// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCzv8U8Syd71OK5uXF7MbOTdT77jXldWqE",
  authDomain: "nursing-quiz-63de2.firebaseapp.com",
  projectId: "nursing-quiz-63de2",
  storageBucket: "nursing-quiz-63de2.firebasestorage.app",
  messagingSenderId: "135091277588",
  appId: "1:135091277588:web:388ed4c31b8b11693cbc01"
};

let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Connected ✅");
} catch (e) { console.error(e); }

// --- Global Vars ---
let currentUser = null;
let subjectsConfig = [];
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور' }
];
let currentExamQuestions = []; // For visual builder
let groupedResults = {};

document.addEventListener("DOMContentLoaded", async () => {
    // Admin Session Check
    if(sessionStorage.getItem('isAdmin') === 'true') {
        currentUser = { name: 'Admin', isAdmin: true };
    }
    // Student Session Check
    else {
        const saved = localStorage.getItem('nursingUser');
        if(saved) {
            const parsed = JSON.parse(saved);
            if(!(await verifyUserBan(parsed.username))) currentUser = parsed;
        }
    }

    if(!currentUser) {
        document.getElementById('auth-modal').style.display = 'flex';
        switchAuthMode('login');
    } else if(currentUser.isAdmin) {
        openAdminDashboard(true);
    } else {
        initStudentView();
    }

    loadAnnouncement();
    loadLeaderboard();
    fetchSubjects();

    // Theme Logic
    if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }
});

// ================= AUTH =================
function switchAuthMode(mode) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(mode === 'login' ? 'btn-mode-login' : 'btn-mode-register').classList.add('active');
    document.getElementById('login-section').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('register-section').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('auth-error').style.display = 'none';
}

async function loginUser() {
    const user = document.getElementById('login-username').value.trim().toLowerCase();
    if(!user) return authError("ادخل اليوزر");
    try {
        const doc = await db.collection('users').doc(user).get();
        if(!doc.exists) return authError("غير موجود");
        if(doc.data().isBanned) return authError("محظور");
        
        currentUser = { username: user, name: doc.data().name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { authError("خطأ اتصال"); }
}

async function registerUser() {
    const name = document.getElementById('reg-fullname').value.trim();
    const user = document.getElementById('reg-username').value.trim().toLowerCase();
    if(name.split(" ").length < 3) return authError("الاسم ثلاثي مطلوب");
    if(!/^[a-z0-9]+$/.test(user)) return authError("يوزر إنجليزي فقط");

    try {
        const doc = await db.collection('users').doc(user).get();
        if(doc.exists) return authError("مستخدم مسبقاً");
        await db.collection('users').doc(user).set({
            name, username: user, joinedAt: firebase.firestore.FieldValue.serverTimestamp(), isBanned: false
        });
        currentUser = { username: user, name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { authError("خطأ"); }
}

function authError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg; el.style.display = 'block';
}

async function verifyUserBan(user) {
    if(!db) return false;
    const doc = await db.collection('users').doc(user).get();
    return doc.exists && doc.data().isBanned;
}

function logout() {
    localStorage.removeItem('nursingUser');
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// ================= ADMIN & SESSION =================
function checkAdminSession() {
    if(sessionStorage.getItem('isAdmin')) openAdminDashboard(true);
    else document.getElementById('admin-login-modal').style.display = 'flex';
}
function closeAdminLogin() { document.getElementById('admin-login-modal').style.display = 'none'; }
function checkAdminPassword() {
    if(document.getElementById('admin-password-input').value === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        closeAdminLogin();
        openAdminDashboard(true);
    } else alert("خطأ");
}
function adminLogout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}
function openAdminDashboard(skip) {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    if(skip) switchAdminTab('results');
}
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(e=>e.style.display='none');
    document.getElementById('admin-tab-'+tab).style.display='block';
    if(tab==='results') fetchGroupedResults();
    if(tab==='users') fetchAdminUsers();
    if(tab==='content') { populateDropdowns(); currentExamQuestions=[]; renderVisualCards(); }
}

// ================= QUIZ LOGIC + LOCAL FILE PATH SUPPORT =================
async function loadQuizSource(sourceId, sourceName) {
    // This function preserves your OLD logic for loading files from paths
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = sourceName;
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p>جاري التحميل...</p>';

    let allQuizzes = {};
    
    // 1. Try Loading Local Script (Your Old Feature)
    try {
        const currentSubject = subjectsConfig.find(s => document.querySelector('.tab-btn.active').textContent === s.name)?.id;
        const scriptPath = `questions/${currentSubject}/${sourceId}.js`;
        await new Promise(resolve => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                const varName = `${currentSubject}_${sourceId}_data`;
                if(window[varName]) Object.assign(allQuizzes, window[varName]);
                resolve();
            };
            script.onerror = resolve; // Continue if file not found
            document.head.appendChild(script);
        });
    } catch(e) {}

    // 2. Load From Firebase
    if(db) {
        const currentSubject = subjectsConfig.find(s => document.querySelector('.tab-btn.active').textContent === s.name)?.id;
        const snap = await db.collection('quizzes').where('subjectId','==',currentSubject).where('sourceId','==',sourceId).get();
        snap.forEach(doc => { allQuizzes[doc.id] = doc.data(); });
    }

    renderQuizCards(allQuizzes);
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    Object.keys(data).forEach(key => {
        const q = data[key];
        const div = document.createElement('div');
        div.className = 'quiz-card';
        div.innerHTML = `<h3>${q.title}</h3><p>${q.questions.length} سؤال</p><button class="start-btn">ابدأ</button>`;
        div.onclick = () => startQuiz(q, key);
        container.appendChild(div);
    });
}

function startQuiz(quizData, key) {
    window.currentQuizKey = key;
    window.currentQuizTitle = quizData.title;
    let qs = [...quizData.questions];
    if(quizData.randomQuestions) qs.sort(() => Math.random() - 0.5);
    
    window.currentQuiz = qs;
    window.currentQuestionIndex = 0;
    window.userAnswers = new Array(qs.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('current-quiz-title').textContent = quizData.title;
    
    // Timer Logic
    if(window.timerInterval) clearInterval(window.timerInterval);
    if(quizData.timeLimit > 0) {
        let sec = quizData.timeLimit * 60;
        window.timerInterval = setInterval(() => {
            sec--;
            let m=Math.floor(sec/60), s=sec%60;
            document.getElementById('quiz-timer').textContent = `${m}:${s}`;
            if(sec<=0) { clearInterval(window.timerInterval); finishQuiz(true); }
        }, 1000);
    }
    
    displayQuestion();
}

function displayQuestion() {
    const q = window.currentQuiz[window.currentQuestionIndex];
    document.getElementById('question-container').innerHTML = `
        <div class="question-text" style="direction:ltr; text-align:left;">Q${window.currentQuestionIndex+1}: ${q.q}</div>
        <div>${q.options.map((o,i) => `<button class="answer-btn" onclick="selAns(${i})">${o}</button>`).join('')}</div>
    `;
    document.getElementById('question-counter').textContent = `${window.currentQuestionIndex+1}/${window.currentQuiz.length}`;
}

window.selAns = function(idx) {
    window.userAnswers[window.currentQuestionIndex] = { answer: idx, isCorrect: idx === window.currentQuiz[window.currentQuestionIndex].a };
    displayQuestion(); // Refresh UI
}

document.getElementById('next-btn').onclick = () => {
    if(window.currentQuestionIndex < window.currentQuiz.length - 1) {
        window.currentQuestionIndex++; displayQuestion();
    } else finishQuiz();
};

function finishQuiz() {
    clearInterval(window.timerInterval);
    let score = window.userAnswers.filter(a => a && a.isCorrect).length;
    document.getElementById('final-score').textContent = `${score}/${window.currentQuiz.length}`;
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    if(db && currentUser) {
        db.collection('exam_results').add({
            studentName: currentUser.name, username: currentUser.username,
            quizTitle: window.currentQuizTitle, score: score, total: window.currentQuiz.length,
            date: new Date().toLocaleString(), timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// ================= ADMIN FEATURES =================
// 1. Grouped Results & Printing
async function fetchGroupedResults() {
    const container = document.getElementById('results-accordion-container');
    container.innerHTML = 'تحميل...';
    const snap = await db.collection('exam_results').orderBy('timestamp','desc').get();
    groupedResults = {};
    snap.forEach(doc => {
        const d = doc.data();
        const key = d.username || d.studentName;
        if(!groupedResults[key]) groupedResults[key] = {name: d.studentName, username: d.username, results:[]};
        groupedResults[key].results.push({id:doc.id, ...d});
    });
    renderAccordion();
}

function renderAccordion(filter='') {
    const div = document.getElementById('results-accordion-container');
    div.innerHTML = '';
    Object.keys(groupedResults).forEach(key => {
        const s = groupedResults[key];
        if(filter && !s.name.includes(filter)) return;
        div.innerHTML += `
            <div class="student-result-card">
                <div class="student-header" onclick="this.nextElementSibling.classList.toggle('open')">
                    <b>${s.name} (${key})</b> <span>${s.results.length} امتحان</span>
                    <button onclick="event.stopPropagation(); printOne('${key}')">طباعة</button>
                </div>
                <div class="result-details">
                    <table class="mini-table">
                        ${s.results.map(r => `<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td><td><button onclick="delRes('${r.id}')">🗑️</button></td></tr>`).join('')}
                    </table>
                </div>
            </div>`;
    });
}

window.filterResults = () => renderAccordion(document.getElementById('results-search').value);
window.delRes = async (id) => { if(confirm("حذف؟")) await db.collection('exam_results').doc(id).delete(); fetchGroupedResults(); };
window.printOne = (key) => {
    const s = groupedResults[key];
    document.getElementById('print-area').innerHTML = `
        <div class="print-page">
            <h2>${s.name} (${s.username})</h2><hr>
            <table class="print-table">
                ${s.results.map(r => `<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}
            </table>
        </div>`;
    window.print();
}
window.printAllReports = () => {
    let html = '';
    Object.values(groupedResults).forEach(s => {
        html += `<div class="print-page"><h2>${s.name} (${s.username})</h2><hr><table class="print-table">${s.results.map(r => `<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}</table></div>`;
    });
    document.getElementById('print-area').innerHTML = html;
    window.print();
}

// 2. Visual Editor + Smart Paste
window.parseSmartPaste = () => {
    const txt = document.getElementById('smart-paste-input').value;
    const lines = txt.split('\n');
    let q = null;
    lines.forEach(l => {
        l = l.trim();
        if(/^(\d+|Q\d+)\./.test(l) || (l.includes('?') && !q)) {
            if(q) currentExamQuestions.push(q);
            q = { q: l, options: [], a: 0 };
        } else if(q && (/^[a-z]\)/.test(l) || l.startsWith('-'))) {
            let isCor = l.includes('*');
            q.options.push(l.replace('*',''));
            if(isCor) q.a = q.options.length - 1;
        }
    });
    if(q) currentExamQuestions.push(q);
    renderVisualCards();
}
function renderVisualCards() {
    document.getElementById('visual-editor-container').innerHTML = currentExamQuestions.map((q,i) => `
        <div class="visual-card">
            <button class="delete-card" onclick="delQ(${i})">x</button>
            <b>${q.q}</b>
            <div class="visual-options">${q.options.map((o,ox) => `<div class="v-opt ${q.a==ox?'correct':''}" onclick="setQ(${i},${ox})">${o}</div>`).join('')}</div>
        </div>`).join('');
}
window.delQ = (i) => { currentExamQuestions.splice(i,1); renderVisualCards(); };
window.setQ = (i,o) => { currentExamQuestions[i].a = o; renderVisualCards(); };
window.saveExamFinal = async () => {
    await db.collection('quizzes').add({
        title: document.getElementById('new-exam-title').value,
        subjectId: document.getElementById('exam-subject-select').value,
        sourceId: document.getElementById('exam-source-select').value,
        questions: currentExamQuestions,
        timeLimit: document.getElementById('new-exam-time').value,
        oneAttempt: document.getElementById('opt-one-attempt').checked
    });
    alert("تم");
}

// 3. User Mgmt
window.fetchAdminUsers = async () => {
    const snap = await db.collection('users').get();
    let html = '';
    snap.forEach(doc => {
        const u = doc.data();
        html += `<tr><td>${u.name}</td><td>${u.username}</td><td>${u.joinedAt?.toDate().toLocaleDateString()}</td><td>${u.isBanned?'محظور':'نشط'}</td><td><button onclick="togBan('${u.username}',${!u.isBanned})">حظر/فك</button></td></tr>`;
    });
    document.getElementById('users-table-body').innerHTML = html;
}
window.togBan = async (u, s) => { await db.collection('users').doc(u).update({isBanned:s}); fetchAdminUsers(); };

// Helpers
function initStudentView() {
    document.getElementById('welcome-message').textContent = `أهلاً د. ${currentUser.name}`;
    document.getElementById('auth-modal').style.display = 'none';
}
function fetchSubjects() { /* ... Populate from DB + Config ... */ }
function populateDropdowns() { /* ... Fill Selects ... */ }
