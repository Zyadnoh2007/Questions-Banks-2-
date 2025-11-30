// --- Firebase Config (Updated) ---
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
} catch (e) { console.error("Firebase Error ⚠️", e); }

// --- Global State ---
let currentUser = null; // { username, name, joinedAt, isAdmin }
let subjectsConfig = [];
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة', desc: 'أسئلة البنك الشاملة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور', desc: 'أسئلة المحاضرات' }
];
let dbSubjects = [];
let dbSources = [];
let currentSubject = ''; 
let currentQuizData = {};
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;

// Hybrid System State
let newExamQuestions = [];

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Check Auth
    const savedUser = localStorage.getItem('nursingUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        await verifyUserStatus(); // Check if banned
    } else {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    // 2. Load Settings & Content
    if (currentUser) {
        setupUI();
        loadGlobalSettings();
    }
    
    // 3. Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('#theme-toggle i').className = 'fas fa-sun';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // 4. Admin Session Check
    if(localStorage.getItem('adminLoggedIn') === 'true') {
        document.querySelector('.admin-icon').style.display = 'flex';
    }
});

function setupUI() {
    document.getElementById('auth-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً د. ${currentUser.name.split(' ')[0]} 👋`;
    fetchDynamicContent(); // Load subjects
    document.getElementById('main-nav').style.display = 'flex';
}

// --- Auth System (Split) ---
function switchAuthMode(mode) {
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
    
    if (mode === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.querySelector('button[onclick="switchAuthMode(\'login\')"]').classList.add('active');
    } else {
        document.getElementById('register-form').style.display = 'block';
        document.querySelector('button[onclick="switchAuthMode(\'register\')"]').classList.add('active');
    }
}

async function registerUser() {
    const name = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const msg = document.getElementById('reg-msg');

    if (name.split(' ').length < 3) { msg.textContent = "❌ الاسم يجب أن يكون ثلاثياً على الأقل"; return; }
    if (username.length < 4 || /[^a-z0-9]/.test(username)) { msg.textContent = "❌ اسم المستخدم يجب أن يكون إنجليزي فقط (بدون مسافات)"; return; }

    if (!db) { alert("قاعدة البيانات غير متصلة"); return; }
    
    msg.textContent = "⏳ جاري التحقق...";
    try {
        const docRef = db.collection('users').doc(username);
        const doc = await docRef.get();
        if (doc.exists) {
            msg.textContent = "❌ اسم المستخدم هذا موجود مسبقاً، اختر غيره.";
        } else {
            const newUser = { name, username, joinedAt: firebase.firestore.FieldValue.serverTimestamp(), isBanned: false };
            await docRef.set(newUser);
            localStorage.setItem('nursingUser', JSON.stringify(newUser));
            location.reload();
        }
    } catch(e) { msg.textContent = "خطأ في الاتصال"; console.error(e); }
}

async function loginUser() {
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const msg = document.getElementById('login-msg');
    
    if (!username) { msg.textContent = "أدخل اسم المستخدم"; return; }
    if (!db) return;

    msg.textContent = "⏳ تحقق...";
    try {
        const doc = await db.collection('users').doc(username).get();
        if (!doc.exists) {
            msg.textContent = "❌ حساب غير موجود. سجل حساب جديد.";
        } else {
            const data = doc.data();
            if (data.isBanned) {
                msg.textContent = "🚫 تم إيقاف حسابك. تواصل مع الإدارة.";
            } else {
                // Update local data in case name changed
                const userObj = { name: data.name, username: data.username };
                localStorage.setItem('nursingUser', JSON.stringify(userObj));
                location.reload();
            }
        }
    } catch(e) { msg.textContent = "خطأ الاتصال"; }
}

async function verifyUserStatus() {
    if (!db || !currentUser) return;
    try {
        const doc = await db.collection('users').doc(currentUser.username).get();
        if (doc.exists && doc.data().isBanned) {
            alert("⚠️ تم حظر حسابك");
            logout();
        }
    } catch(e) {}
}

function logout() {
    localStorage.removeItem('nursingUser');
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// --- Load Content ---
async function fetchDynamicContent() {
    if (!db) return;
    // Load Subjects
    const subSnap = await db.collection('subjects').get();
    dbSubjects = []; subjectsConfig = [];
    subSnap.forEach(doc => {
        const d = doc.data();
        dbSubjects.push({docId: doc.id, ...d});
        subjectsConfig.push(d);
    });
    // Load Sources
    const srcSnap = await db.collection('sources').get();
    dbSources = [];
    srcSnap.forEach(doc => dbSources.push({docId: doc.id, ...doc.data()}));
    
    generateSubjectTabs();
}

function generateSubjectTabs() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = '';
    if(subjectsConfig.length === 0) nav.innerHTML = '<p style="width:100%;text-align:center;">لا توجد مواد مضافة</p>';
    
    subjectsConfig.forEach((sub, idx) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.textContent = sub.name;
        btn.onclick = () => {
            currentSubject = sub.id;
            document.querySelectorAll('#main-nav .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showSourceSelection(sub.id);
        };
        nav.appendChild(btn);
        if (idx === 0) btn.click();
    });
}

function showSourceSelection(subId) {
    const container = document.getElementById('source-selection');
    container.innerHTML = '';
    
    // Default Sources
    defaultSources.forEach(src => renderSourceCard(src, container));
    // Custom Sources
    dbSources.filter(s => s.subjectId === subId).forEach(s => renderSourceCard(s, container));

    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
}

function renderSourceCard(src, container) {
    const div = document.createElement('div');
    div.className = 'source-card';
    div.innerHTML = `<h3>${src.name}</h3><p>${src.desc || ''}</p>`;
    div.onclick = () => loadQuizzes(src.id, src.name);
    container.appendChild(div);
}

async function loadQuizzes(sourceId, sourceName) {
    document.getElementById('source-selection').style.display = 'none';
    const listArea = document.getElementById('quiz-list-area');
    listArea.style.display = 'block';
    document.getElementById('source-title-display').textContent = `📂 ${sourceName}`;
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">تحميل...</p>';

    currentQuizData = {};
    if (db) {
        const snap = await db.collection('quizzes')
            .where('subjectId', '==', currentSubject)
            .where('sourceId', '==', sourceId).get();
        
        if (snap.empty) {
            container.innerHTML = '<p class="empty-state">لا توجد اختبارات هنا.</p>';
            return;
        }
        
        container.innerHTML = '';
        snap.forEach(doc => {
            const q = doc.data();
            currentQuizData[doc.id] = q;
            // Check History (Client Side Badge)
            // Ideally we check server history, but for speed keeping local check visually
            // Real history is in Dashboard
            
            container.innerHTML += `
            <div class="quiz-card" onclick="startQuiz('${doc.id}')">
                <h3>${q.title}</h3>
                <div style="display:flex; justify-content:center; gap:10px; color:gray;">
                    <span>📝 ${q.questions.length} سؤال</span>
                    <span>${q.timeLimit ? '⏳ '+q.timeLimit+' د' : '⏱️ مفتوح'}</span>
                </div>
                <button class="start-btn">ابدأ الآن</button>
            </div>`;
        });
    }
}

// --- Quiz Logic ---
function startQuiz(quizId) {
    const quiz = currentQuizData[quizId];
    if(!quiz) return;
    
    currentQuiz = quiz.questions; // Shuffle?
    currentQuiz = currentQuiz.sort(() => Math.random() - 0.5); // Simple shuffle
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    window.currentQuizTitle = quiz.title;

    document.getElementById('quiz-list-area').style.display = 'none';
    const qContainer = document.getElementById('quiz-container');
    qContainer.style.display = 'block';
    document.getElementById('current-quiz-title').textContent = quiz.title;

    // Timer Logic
    const timerEl = document.getElementById('quiz-timer');
    clearInterval(timerInterval);
    if(quiz.timeLimit > 0) {
        let timeLeft = quiz.timeLimit * 60;
        timerEl.style.display = 'block';
        timerInterval = setInterval(() => {
            timeLeft--;
            let m = Math.floor(timeLeft / 60).toString().padStart(2,'0');
            let s = (timeLeft % 60).toString().padStart(2,'0');
            timerEl.textContent = `${m}:${s}`;
            if(timeLeft <= 0) finishQuiz(true);
        }, 1000);
    } else {
        timerEl.textContent = "∞";
    }

    renderQuestion();
}

function renderQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    const container = document.getElementById('question-container');
    const uAns = userAnswers[currentQuestionIndex];
    
    // Auto Detect RTL/LTR for Question Text
    const dirClass = /[أ-ي]/.test(q.q) ? 'rtl' : 'ltr';

    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        const isSelected = uAns && uAns.answer === idx;
        optionsHtml += `<button class="answer-btn ${dirClass} ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${idx})">${opt}</button>`;
    });

    container.innerHTML = `
        <div class="question-card">
            <div class="question-text ${dirClass}"><b>س${currentQuestionIndex+1}:</b> ${q.q}</div>
            <div class="answer-options">${optionsHtml}</div>
        </div>
    `;

    // Progress
    document.getElementById('progress-fill').style.width = `${((currentQuestionIndex+1)/currentQuiz.length)*100}%`;
    document.getElementById('question-counter').textContent = `${currentQuestionIndex+1} / ${currentQuiz.length}`;
    
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

function selectAnswer(idx) {
    userAnswers[currentQuestionIndex] = { answer: idx, isCorrect: idx === currentQuiz[currentQuestionIndex].a };
    renderQuestion();
}

document.getElementById('next-btn').onclick = () => {
    if(currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++; renderQuestion();
    } else {
        finishQuiz();
    }
};
document.getElementById('prev-btn').onclick = () => {
    currentQuestionIndex--; renderQuestion();
};

async function finishQuiz(isTimeout = false) {
    clearInterval(timerInterval);
    const score = userAnswers.filter(a => a && a.isCorrect).length;
    
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('final-score').textContent = `${score} / ${currentQuiz.length}`;
    
    if(isTimeout) document.getElementById('score-message').textContent = "⏰ انتهى الوقت!";
    else document.getElementById('score-message').textContent = score === currentQuiz.length ? "عبقري! 🌟" : "أحسنت المحاولة";

    // Save Result
    if(db && currentUser) {
        try {
            await db.collection('exam_results').add({
                username: currentUser.username,
                studentName: currentUser.name,
                quizTitle: window.currentQuizTitle,
                subject: currentSubject,
                score: score,
                total: currentQuiz.length,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                date: new Date().toLocaleDateString('ar-EG')
            });
            document.getElementById('upload-status').textContent = "✅ تم حفظ النتيجة";
        } catch(e) { console.error(e); }
    }
}

// Review Logic
document.getElementById('review-btn').onclick = () => {
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
    const con = document.getElementById('review-content');
    con.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const u = userAnswers[i];
        const isCorrect = u && u.isCorrect;
        const uText = u ? q.options[u.answer] : "لم يجب";
        const cText = q.options[q.a];
        con.innerHTML += `
            <div class="question-card" style="border-right-color:${isCorrect?'var(--success)':'var(--danger)'}">
                <p><b>س${i+1}:</b> ${q.q}</p>
                <p style="color:${isCorrect?'green':'red'}">إجابتك: ${uText}</p>
                ${!isCorrect ? `<p style="color:green; font-weight:bold;">الصح: ${cText}</p>` : ''}
            </div>
        `;
    });
};

function backToQuizList() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
}

window.backToSources = function() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
};

// --- Student Dashboard ---
window.openDashboard = async function() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    
    document.getElementById('user-display-id').textContent = currentUser.username;
    
    if(!db) return;
    const snap = await db.collection('exam_results')
        .where('username', '==', currentUser.username)
        .orderBy('timestamp', 'desc').get();
    
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    let totalQ = 0, totalScore = 0, totalMax = 0;
    
    snap.forEach(doc => {
        const d = doc.data();
        totalQ++;
        totalScore += d.score;
        totalMax += d.total;
        tbody.innerHTML += `<tr><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td>${d.score >= d.total/2 ? '✅ ناجح' : '⚠️ راسب'}</td></tr>`;
    });
    
    document.getElementById('total-quizzes-taken').textContent = totalQ;
    document.getElementById('total-accuracy').textContent = totalMax ? Math.round((totalScore/totalMax)*100)+'%' : '0%';
};
window.closeDashboard = function() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
};

// --- Settings: News & Honor ---
async function loadGlobalSettings() {
    if(!db) return;
    const doc = await db.collection('settings').doc('global').get();
    if(doc.exists) {
        const d = doc.data();
        // News
        if(d.announcement && d.announcement.trim() !== "") {
            document.getElementById('news-ticker').style.display = 'block';
            document.getElementById('ticker-text').textContent = d.announcement;
        }
        // Honor
        if(d.showHonorBoard) {
            loadHonorBoard();
        }
    }
}

async function loadHonorBoard() {
    // Top 5 students by score sum (requires aggregation or client side calc)
    // For simplicity: We query last 50 results and rank them client side
    // OR create a 'leaderboard' collection updated by cloud functions.
    // Client-side approximation for now:
    const snap = await db.collection('exam_results').orderBy('score', 'desc').limit(20).get();
    const map = {};
    snap.forEach(d => {
        const data = d.data();
        if(!map[data.studentName]) map[data.studentName] = 0;
        map[data.studentName] += data.score;
    });
    // Convert to array and sort
    const sorted = Object.entries(map).sort((a,b) => b[1] - a[1]).slice(0, 5);
    
    const board = document.getElementById('honor-board');
    const list = document.getElementById('top-students-list');
    if(sorted.length > 0) {
        board.style.display = 'block';
        list.innerHTML = '';
        sorted.forEach((item, idx) => {
            list.innerHTML += `<div class="honor-card"><div class="honor-rank">${idx+1}</div> ${item[0]} <span style="color:#d97706">(${item[1]} نقطة)</span></div>`;
        });
    }
}

// ==========================================
// ========== ADMIN PANEL LOGIC =============
// ==========================================

window.openAdminLogin = () => document.getElementById('admin-login-modal').style.display = 'flex';
window.closeAdminLogin = () => document.getElementById('admin-login-modal').style.display = 'none';
window.checkAdminPassword = () => {
    if(document.getElementById('admin-password-input').value === "admin123") {
        localStorage.setItem('adminLoggedIn', 'true');
        closeAdminLogin();
        openAdminDashboard();
    } else alert("خطأ!");
};
function openAdminDashboard() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    switchAdminTab('users');
}
window.closeAdminDashboard = () => {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
};

window.switchAdminTab = (tab) => {
    document.querySelectorAll('.admin-tab-content').forEach(d => d.style.display='none');
    document.getElementById('admin-tab-'+tab).style.display='block';
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if(tab === 'users') fetchAdminUsers();
    if(tab === 'results') fetchAdminResults();
    if(tab === 'content') setupContentTab();
};

// --- 1. Admin Users ---
window.fetchAdminUsers = async () => {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="5">تحميل...</td></tr>';
    const snap = await db.collection('users').orderBy('joinedAt', 'desc').get();
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const u = doc.data();
        const date = u.joinedAt ? new Date(u.joinedAt.toDate()).toLocaleDateString('ar-EG') : '-';
        const isBanned = u.isBanned;
        tbody.innerHTML += `
            <tr id="row-${u.username}">
                <td onclick="promptEditUser('${doc.id}', '${u.name}')" style="cursor:pointer; text-decoration:underline;">${u.name} ✏️</td>
                <td style="font-family:monospace;">${u.username}</td>
                <td>${date}</td>
                <td><span class="status-badge ${isBanned?'status-banned':'status-active'}">${isBanned?'محظور':'نشط'}</span></td>
                <td>
                    <button class="mini-btn" style="background:${isBanned?'#22c55e':'#ef4444'}" onclick="toggleBan('${u.username}', ${!isBanned})">${isBanned?'فك حظر':'حظر'}</button>
                    <button class="mini-btn" style="background:#000" onclick="deleteUser('${u.username}')">🗑️</button>
                </td>
            </tr>
        `;
    });
};
window.toggleBan = async (uid, status) => {
    if(confirm(status ? "فك الحظر؟" : "حظر الطالب؟")) {
        await db.collection('users').doc(uid).update({ isBanned: status });
        fetchAdminUsers();
    }
};
window.deleteUser = async (uid) => {
    if(confirm("حذف الطالب نهائياً؟ هذا لا يمكن التراجع عنه!")) {
        await db.collection('users').doc(uid).delete();
        fetchAdminUsers();
    }
};
window.promptEditUser = (uid, oldName) => {
    document.getElementById('edit-user-id').value = uid;
    document.getElementById('edit-user-fullname').value = oldName;
    document.getElementById('edit-user-modal').style.display = 'flex';
};
window.saveUserEdit = async () => {
    const uid = document.getElementById('edit-user-id').value;
    const newName = document.getElementById('edit-user-fullname').value;
    if(newName) {
        await db.collection('users').doc(uid).update({ name: newName });
        document.getElementById('edit-user-modal').style.display = 'none';
        fetchAdminUsers();
    }
};
window.filterUsersTable = () => {
    const val = document.getElementById('users-search').value.toLowerCase();
    document.querySelectorAll('#users-table tbody tr').forEach(tr => {
        tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
};

// --- 2. Admin Results (Accordion) ---
window.fetchAdminResults = async () => {
    const container = document.getElementById('results-accordion');
    container.innerHTML = 'تحميل...';
    // Group by student
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').get();
    const groups = {};
    snap.forEach(doc => {
        const d = doc.data();
        const key = d.username || d.studentName; // Fallback
        if(!groups[key]) groups[key] = { name: d.studentName, results: [] };
        groups[key].results.push({ id: doc.id, ...d });
    });
    
    container.innerHTML = '';
    Object.keys(groups).forEach(key => {
        const g = groups[key];
        let resultsHtml = `<table style="width:100%; font-size:0.9rem;">
            <thead><tr><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th><th>حذف</th></tr></thead><tbody>`;
        g.results.forEach(r => {
            resultsHtml += `<tr>
                <td>${r.quizTitle}</td>
                <td>${r.score}/${r.total}</td>
                <td>${r.date}</td>
                <td><span onclick="deleteResult('${r.id}')" style="cursor:pointer; color:red;">🗑️</span></td>
            </tr>`;
        });
        resultsHtml += `</tbody></table>`;
        
        container.innerHTML += `
            <div class="accordion-item student-result-item" data-search="${g.name} ${key}">
                <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('active')">
                    <b>👤 ${g.name} (${g.results.length} امتحان)</b>
                    <span>▼</span>
                </div>
                <div class="accordion-content">${resultsHtml}</div>
            </div>
        `;
    });
};
window.deleteResult = async (rid) => {
    if(confirm("حذف هذه النتيجة فقط؟")) {
        await db.collection('exam_results').doc(rid).delete();
        fetchAdminResults();
    }
};
window.filterResultsAccordion = () => {
    const val = document.getElementById('results-search').value.toLowerCase();
    document.querySelectorAll('.student-result-item').forEach(el => {
        el.style.display = el.getAttribute('data-search').toLowerCase().includes(val) ? 'block' : 'none';
    });
};
// Print Logic
window.printReport = () => window.print();

// --- 3. Content (The Hybrid System) ---
function setupContentTab() {
    // Populate Dropdowns
    const subSel = document.getElementById('exam-subject-select');
    subSel.innerHTML = '';
    subjectsConfig.forEach(s => subSel.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    updateSourceSelect();
    
    // Reset Builder
    newExamQuestions = [];
    renderBuilder();
}
window.updateSourceSelect = () => {
    const subId = document.getElementById('exam-subject-select').value;
    const srcSel = document.getElementById('exam-source-select');
    srcSel.innerHTML = '';
    defaultSources.forEach(s => srcSel.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    dbSources.filter(s => s.subjectId === subId).forEach(s => srcSel.innerHTML += `<option value="${s.docId}">${s.name}</option>`);
};

// --- Hybrid Builder Logic ---
window.addQuestionCard = (data = null) => {
    const q = data || { q: '', options: ['','','',''], a: 0 };
    newExamQuestions.push(q);
    renderBuilder();
};

window.removeQuestion = (idx) => {
    newExamQuestions.splice(idx, 1);
    renderBuilder();
};

window.renderBuilder = () => {
    const con = document.getElementById('builder-container');
    const countBadge = document.getElementById('questions-count-badge');
    countBadge.textContent = `${newExamQuestions.length} سؤال`;
    
    if(newExamQuestions.length === 0) {
        con.innerHTML = '<p class="empty-state">لم يتم إضافة أسئلة بعد.</p>';
        return;
    }
    
    con.innerHTML = '';
    newExamQuestions.forEach((q, idx) => {
        con.innerHTML += `
        <div class="builder-card">
            <div class="card-header">
                <span>سؤال رقم ${idx+1}</span>
                <button class="delete-card-btn" onclick="removeQuestion(${idx})"><i class="fas fa-trash"></i></button>
            </div>
            <div class="q-input-group">
                <input type="text" class="q-input" value="${q.q}" placeholder="نص السؤال" onchange="updateQData(${idx}, 'q', this.value)">
            </div>
            <div class="options-grid">
                ${q.options.map((opt, oIdx) => `
                <div class="option-row">
                    <input type="radio" name="q-${idx}" class="radio-select" ${q.a === oIdx ? 'checked' : ''} onchange="updateQData(${idx}, 'a', ${oIdx})">
                    <input type="text" class="q-input" value="${opt}" placeholder="اختيار ${oIdx+1}" onchange="updateQData(${idx}, 'opt', this.value, ${oIdx})">
                </div>
                `).join('')}
            </div>
        </div>
        `;
    });
};

window.updateQData = (qIdx, type, val, optIdx = null) => {
    if(type === 'q') newExamQuestions[qIdx].q = val;
    if(type === 'a') newExamQuestions[qIdx].a = val;
    if(type === 'opt') newExamQuestions[qIdx].options[optIdx] = val;
};

// --- Smart Parser Logic ---
window.openSmartImport = () => document.getElementById('smart-import-modal').style.display = 'flex';
window.processSmartImport = () => {
    const text = document.getElementById('smart-import-text').value;
    if(!text.trim()) return;
    
    const lines = text.split('\n').filter(l => l.trim());
    let currentQ = null;
    let addedCount = 0;
    
    lines.forEach(line => {
        line = line.trim();
        // Regex to detect Questions (Start with Q, S, Number)
        if (line.match(/^(س|Q|\d+)[\.:\/]/) || line.includes('?') || (!currentQ && line.length > 5)) {
            if (currentQ && currentQ.options.length > 1) {
                 newExamQuestions.push(currentQ);
                 addedCount++;
            }
            currentQ = { 
                q: line.replace(/^(س|Q|\d+)[\.:\/]\s*/, ''), 
                options: [], 
                a: 0 
            };
        } else if (currentQ) {
            // Detect Options
            let isCorrect = line.startsWith('*');
            let optionText = line.replace(/^[\*\-\)\.]\s*/, '').replace(/^[أ-يa-z][\)\.]\s*/, ''); // Remove numbering a) b)
            
            if(isCorrect) currentQ.a = currentQ.options.length;
            currentQ.options.push(optionText);
        }
    });
    // Push last one
    if (currentQ && currentQ.options.length > 1) {
        newExamQuestions.push(currentQ);
        addedCount++;
    }
    
    document.getElementById('smart-import-modal').style.display = 'none';
    document.getElementById('smart-import-text').value = '';
    renderBuilder();
    alert(`تم استيراد ${addedCount} سؤال بنجاح! راجعهم الآن.`);
};

window.saveHybridExam = async () => {
    if(newExamQuestions.length === 0) { alert("لا توجد أسئلة!"); return; }
    
    const title = document.getElementById('new-exam-title').value;
    const subjectId = document.getElementById('exam-subject-select').value;
    const sourceId = document.getElementById('exam-source-select').value;
    const timerType = document.getElementById('exam-timer-type').value;
    const timeVal = parseInt(document.getElementById('exam-time-val').value) || 0;
    
    if(!title) { alert("اكتب عنوان الامتحان"); return; }
    
    const examData = {
        title, subjectId, sourceId,
        questions: newExamQuestions,
        timeLimit: (timerType === 'limit') ? timeVal : 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('quizzes').add(examData);
        alert("✅ تم حفظ الامتحان بنجاح");
        newExamQuestions = [];
        renderBuilder();
        document.getElementById('new-exam-title').value = '';
    } catch(e) { alert("خطأ في الحفظ"); }
};

// UI Helpers for Content
document.getElementById('exam-timer-type').onchange = (e) => {
    document.getElementById('exam-time-val').style.display = e.target.value === 'limit' ? 'inline-block' : 'none';
};

// --- 4. Admin Settings ---
window.saveSettings = async (type) => {
    const data = {};
    if(type === 'announcement') {
        data.announcement = document.getElementById('setting-announcement').value;
    }
    if(type === 'honor') {
        data.showHonorBoard = document.getElementById('setting-honor-toggle').checked;
    }
    await db.collection('settings').doc('global').set(data, {merge: true});
    alert("تم الحفظ");
};

// --- Delete Logic ---
window.updateDeleteDropdown = async () => {
    const type = document.getElementById('delete-type-select').value;
    const sel = document.getElementById('delete-item-select');
    sel.style.display = 'inline-block';
    sel.innerHTML = '<option>جاري التحميل...</option>';
    
    let col = type === 'subject' ? 'subjects' : (type === 'source' ? 'sources' : 'quizzes');
    const snap = await db.collection(col).get();
    
    sel.innerHTML = '';
    snap.forEach(doc => {
        const d = doc.data();
        let label = d.name || d.title;
        sel.innerHTML += `<option value="${doc.id}">${label}</option>`;
    });
};
window.deleteSelectedItem = async () => {
    const type = document.getElementById('delete-type-select').value;
    const id = document.getElementById('delete-item-select').value;
    if(!id || type === 'none') return;
    
    let col = type === 'subject' ? 'subjects' : (type === 'source' ? 'sources' : 'quizzes');
    if(confirm("هل أنت متأكد؟ سيتم الحذف نهائياً.")) {
        await db.collection(col).doc(id).delete();
        alert("تم الحذف");
        updateDeleteDropdown();
    }
};

window.toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('#theme-toggle i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
};
