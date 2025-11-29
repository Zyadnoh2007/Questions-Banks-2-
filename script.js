// --- Firebase Config (نفس بياناتك) ---
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

// --- متغيرات ---
let currentUser = null;
let subjectsConfig = [];
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور' }
];
let currentExamQuestions = [];
let groupedResults = {};
let currentQuiz = [];
let userAnswers = [];
let timerInterval = null;

// --- عند التحميل ---
document.addEventListener("DOMContentLoaded", async () => {
    // 1. فحص أدمن
    if (sessionStorage.getItem('isAdmin') === 'true') {
        currentUser = { name: 'Admin', isAdmin: true };
    } 
    // 2. فحص طالب
    else {
        const saved = localStorage.getItem('nursingUser');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // إصلاح مشكلة undefined: لو الطالب قديم ومعهوش يوزر، نستخدم اسمه كيوزر مؤقت
                if(!parsed.username) parsed.username = parsed.name; 
                
                // التأكد من الحظر
                if(!(await verifyBan(parsed.username))) currentUser = parsed;
            } catch(e) { localStorage.removeItem('nursingUser'); }
        }
    }

    // 3. التوجيه
    if (!currentUser) {
        document.getElementById('welcome-modal').style.display = 'flex';
        toggleAuthView('login');
    } else if (currentUser.isAdmin) {
        openAdminDashboard(true);
    } else {
        initStudentView();
    }

    loadAnnouncement();
    loadLeaderboard();
    fetchSubjects();
    
    // الثيم
    if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode')?'dark':'light');
    };
});

// ================= AUTH SYSTEM =================
function toggleAuthView(mode) {
    document.getElementById('login-view').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('register-view').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('btn-login-view').classList.toggle('active', mode === 'login');
    document.getElementById('btn-register-view').classList.toggle('active', mode === 'register');
}

async function handleLogin() {
    let input = document.getElementById('login-input').value.trim();
    if(!input) return alert("ادخل البيانات");
    
    // محاولة ذكية: البحث باليوزر، ولو فشل نبحث بالاسم (للطلاب القدام)
    try {
        let userDoc = await db.collection('users').doc(input.toLowerCase()).get();
        let userData = userDoc.exists ? userDoc.data() : null;

        // لو ملقناش باليوزر، ندور بالاسم (للقدام)
        if(!userData) {
            const snap = await db.collection('users').where('name', '==', input).get();
            if(!snap.empty) {
                userData = snap.docs[0].data();
                // تحديث بياناته القديمة عشان يكون ليه يوزر
                userData.username = userData.name; 
            }
        }

        if(!userData) return alert("بيانات غير صحيحة");
        if(userData.isBanned) return alert("حسابك محظور");

        currentUser = { name: userData.name, username: userData.username || userData.name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();

    } catch(e) { alert("خطأ في الاتصال"); }
}

async function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const user = document.getElementById('reg-user').value.trim().toLowerCase();
    
    if(name.split(" ").length < 3) return alert("اكتب اسمك الثلاثي");
    if(!/^[a-z0-9]+$/.test(user)) return alert("اسم المستخدم حروف إنجليزية وأرقام فقط");

    try {
        const check = await db.collection('users').doc(user).get();
        if(check.exists) return alert("اسم المستخدم هذا محجوز");

        await db.collection('users').doc(user).set({
            name: name, username: user, joinedAt: firebase.firestore.FieldValue.serverTimestamp(), isBanned: false
        });

        currentUser = { name: name, username: user, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { alert("خطأ: " + e.message); }
}

async function verifyBan(user) {
    if(!db) return false;
    const d = await db.collection('users').doc(user).get();
    return d.exists && d.data().isBanned;
}

function logout() {
    localStorage.clear(); sessionStorage.clear(); location.reload();
}

// ================= ADMIN DASHBOARD =================
function checkAdminSession() {
    if(sessionStorage.getItem('isAdmin')) openAdminDashboard(true);
    else document.getElementById('admin-login-modal').style.display='flex';
}
function checkAdminPassword() {
    if(document.getElementById('admin-password-input').value === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('admin-login-modal').style.display='none';
        openAdminDashboard(true);
    } else alert("خطأ");
}
function adminLogout() {
    sessionStorage.removeItem('isAdmin'); location.reload();
}
function openAdminDashboard(skip) {
    document.getElementById('main-nav').style.display='none';
    document.getElementById('quiz-list-area').style.display='none';
    document.getElementById('admin-dashboard-view').style.display='block';
    if(skip) switchAdminTab('results');
}
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-content').forEach(e=>e.style.display='none');
    document.getElementById('admin-tab-'+tab).style.display='block';
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    event.target.classList.add('active');
    
    if(tab==='results') fetchGroupedResults();
    if(tab==='users') fetchAdminUsers();
    if(tab==='content') { populateDropdowns(); currentExamQuestions=[]; renderVisualEditor(); }
}

// --- النتائج المجمعة (مع إصلاح undefined) ---
async function fetchGroupedResults() {
    const cont = document.getElementById('results-container');
    cont.innerHTML = 'جاري التحميل...';
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').get();
    groupedResults = {};
    
    snap.forEach(doc => {
        const d = doc.data();
        // الحل السحري لمشكلة undefined: لو مفيش يوزر، استخدم الاسم
        const key = d.username || d.studentName || 'غير معروف';
        if(!groupedResults[key]) groupedResults[key] = { name: d.studentName, username: key, results: [] };
        groupedResults[key].results.push({ id: doc.id, ...d });
    });
    
    renderResultsAccordion();
}

function renderResultsAccordion(filter='') {
    const cont = document.getElementById('results-container');
    cont.innerHTML = '';
    Object.keys(groupedResults).forEach(key => {
        const s = groupedResults[key];
        if(filter && !s.name.includes(filter)) return;
        
        cont.innerHTML += `
            <div style="margin-bottom:10px;">
                <div class="student-row-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='block'?'none':'block'">
                    <b>${s.name} <small>(${s.username})</small></b>
                    <div>
                        <span style="font-size:0.8rem; color:gray;">${s.results.length} امتحان</span>
                        <button onclick="event.stopPropagation(); printOneReport('${key}')" class="start-btn" style="width:auto; padding:5px; font-size:0.8rem;">طباعة</button>
                    </div>
                </div>
                <div class="student-details">
                    <table style="width:100%">
                        ${s.results.map(r => `
                            <tr>
                                <td>${r.quizTitle}</td>
                                <td style="direction:ltr">${r.score}/${r.total}</td>
                                <td>${r.date}</td>
                                <td><button onclick="delResult('${r.id}')" style="color:red; border:none; background:none; cursor:pointer;">❌</button></td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>
        `;
    });
}
function filterResults() { renderResultsAccordion(document.getElementById('results-search').value); }
async function delResult(id) { if(confirm("حذف؟")) await db.collection('exam_results').doc(id).delete(); fetchGroupedResults(); }

// --- طباعة ---
function printOneReport(key) {
    const s = groupedResults[key];
    document.getElementById('print-area').innerHTML = `
        <div class="print-page">
            <h2 style="text-align:center">تقرير الطالب: ${s.name}</h2>
            <table class="print-table">
                <thead><tr><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th></tr></thead>
                <tbody>${s.results.map(r=>`<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}</tbody>
            </table>
        </div>`;
    window.print();
}
function printAllReports() {
    let h = '';
    Object.values(groupedResults).forEach(s => {
        h += `<div class="print-page"><h2>${s.name}</h2><table class="print-table"><thead><tr><th>امتحان</th><th>درجة</th></tr></thead><tbody>${s.results.map(r=>`<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td></tr>`).join('')}</tbody></table></div>`;
    });
    document.getElementById('print-area').innerHTML = h;
    window.print();
}
function exportExcel() {
    let d = [];
    Object.values(groupedResults).forEach(s => s.results.forEach(r => d.push({الاسم:s.name, الامتحان:r.quizTitle, الدرجة:r.score, المجموع:r.total})));
    XLSX.writeFile(XLSX.utils.json_to_sheet(d), 'Results.xlsx');
}

// ================= EXAM CREATION (VISUAL + SMART PASTE) =================
function parseSmartPaste() {
    const txt = document.getElementById('smart-paste-input').value;
    const lines = txt.split('\n');
    let q = null;
    lines.forEach(l => {
        l = l.trim();
        if((/^(\d+|Q\d+)/.test(l) || l.includes('?')) && !q) {
            if(q) currentExamQuestions.push(q);
            q = { q: l, options: [], a: 0 };
        } else if(q && (/^[a-z]\)/i.test(l) || l.startsWith('-'))) {
            let isC = l.includes('*');
            q.options.push(l.replace('*',''));
            if(isC) q.a = q.options.length - 1;
        }
    });
    if(q) currentExamQuestions.push(q);
    renderVisualEditor();
}
function renderVisualEditor() {
    document.getElementById('visual-editor').innerHTML = currentExamQuestions.map((q,i) => `
        <div class="q-card">
            <button class="del" onclick="delQ(${i})">x</button>
            <b>${q.q}</b>
            <div class="q-opts">${q.options.map((o,oi)=>`<div class="q-opt ${q.a==oi?'correct':''}" onclick="setQ(${i},${oi})">${o}</div>`).join('')}</div>
        </div>
    `).join('');
}
function delQ(i) { currentExamQuestions.splice(i,1); renderVisualEditor(); }
function setQ(i,o) { currentExamQuestions[i].a = o; renderVisualEditor(); }
async function saveExamFinal() {
    await db.collection('quizzes').add({
        title: document.getElementById('new-exam-title').value,
        subjectId: document.getElementById('exam-subject-select').value,
        sourceId: document.getElementById('exam-source-select').value,
        questions: currentExamQuestions,
        timeLimit: document.getElementById('new-exam-time').value,
        oneAttempt: document.getElementById('opt-one-attempt').checked,
        randomQuestions: document.getElementById('opt-random-q').checked,
        hideResult: document.getElementById('opt-hide-result').checked
    });
    alert("تم الحفظ ✅");
    currentExamQuestions = []; renderVisualEditor();
}

// ================= HELPERS & USER MGMT =================
async function fetchAdminUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = 'تحميل...';
    const snap = await db.collection('users').orderBy('joinedAt','desc').get();
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const u = doc.data();
        // عرض الاسم لو اليوزر مش موجود (للطلاب القدام)
        const displayUser = u.username || 'طالب قديم';
        tbody.innerHTML += `
            <tr>
                <td>${u.name}</td>
                <td>${displayUser}</td>
                <td>${u.isBanned ? '<span style="color:red">محظور</span>' : 'نشط'}</td>
                <td>
                    <button onclick="toggleBan('${doc.id}', ${!u.isBanned})">حظر/فك</button>
                    <button onclick="deleteUser('${doc.id}')" style="color:red">حذف</button>
                </td>
            </tr>
        `;
    });
}
async function toggleBan(uid, s) { await db.collection('users').doc(uid).update({isBanned:s}); fetchAdminUsers(); }
async function deleteUser(uid) { if(confirm("حذف؟")) await db.collection('users').doc(uid).delete(); fetchAdminUsers(); }

function initStudentView() {
    document.getElementById('welcome-message').textContent = `أهلاً د. ${currentUser.name}`;
    document.getElementById('welcome-modal').style.display = 'none';
}
function fetchSubjects() {
    db.collection('subjects').get().then(snap => {
        subjectsConfig = [
            { id: 'microbiology', name: 'Microbiology' },
            { id: 'fundamental', name: 'Fundamental' },
            { id: 'biochemistry', name: 'Biochemistry' },
            { id: 'anatomy', name: 'Anatomy' },
            { id: 'physiology', name: 'Physiology' },
            { id: 'clinical', name: 'Clinical' },
            { id: 'ethics', name: 'Ethics' }
        ];
        snap.forEach(d => { if(!subjectsConfig.find(s=>s.id===d.data().id)) subjectsConfig.push(d.data()); });
        generateTabs(); populateDropdowns();
    });
}
function generateTabs() {
    const n = document.getElementById('main-nav'); n.innerHTML='';
    subjectsConfig.forEach(s => {
        n.innerHTML += `<button class="tab-btn" onclick="loadSources('${s.id}', this)">${s.name}</button>`;
    });
}
function loadSources(subId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    
    const cont = document.getElementById('source-selection');
    cont.innerHTML = '';
    document.getElementById('quiz-list-area').style.display='none';
    
    // Default + DB Sources
    [...defaultSources].forEach(src => renderSrcCard(src, subId, cont));
    db.collection('sources').where('subjectId','==',subId).get().then(snap => {
        snap.forEach(d => renderSrcCard(d.data(), subId, cont));
    });
    cont.style.display='flex';
}
function renderSrcCard(src, subId, cont) {
    const d = document.createElement('div');
    d.className = 'quiz-card';
    d.innerHTML = `<h3>${src.name}</h3>`;
    d.onclick = () => loadQuizzes(subId, src.id, src.name);
    cont.appendChild(d);
}

// --- تحميل الامتحانات (الملفات + قاعدة البيانات) ---
async function loadQuizzes(subId, srcId, srcName) {
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = srcName;
    const cont = document.getElementById('dynamic-cards-container');
    cont.innerHTML = 'تحميل...';
    
    let quizzes = {};
    
    // 1. ملفات محلية (النظام القديم)
    try {
        await new Promise(r => {
            const s = document.createElement('script');
            s.src = `questions/${subId}/${srcId}.js`;
            s.onload = () => {
                const v = `${subId}_${srcId}_data`;
                if(window[v]) Object.assign(quizzes, window[v]);
                r();
            };
            s.onerror = r;
            document.head.appendChild(s);
        });
    } catch(e){}

    // 2. فايربيس
    const snap = await db.collection('quizzes').where('subjectId','==',subId).where('sourceId','==',srcId).get();
    snap.forEach(d => quizzes[d.id] = d.data());
    
    renderQuizCards(quizzes);
}

function renderQuizCards(qs) {
    const c = document.getElementById('dynamic-cards-container'); c.innerHTML='';
    Object.keys(qs).forEach(k => {
        const q = qs[k];
        c.innerHTML += `
            <div class="quiz-card" onclick="startQuiz(this, '${k}')">
                <h3>${q.title}</h3><p>${q.questions.length} سؤال</p>
                <button class="start-btn">ابدأ</button>
            </div>`;
        // Store data in element for easy access
        c.lastElementChild.quizData = q; 
    });
}

function startQuiz(el, id) {
    const q = el.quizData;
    window.currentQuiz = q.questions;
    window.userAnswers = new Array(q.questions.length).fill(null);
    window.currentQuestionIndex = 0;
    
    document.getElementById('quiz-list-area').style.display='none';
    document.getElementById('quiz-container').style.display='block';
    document.getElementById('current-quiz-title').textContent = q.title;
    
    if(window.timerInterval) clearInterval(window.timerInterval);
    if(q.timeLimit > 0) {
        let t = q.timeLimit * 60;
        window.timerInterval = setInterval(() => {
            t--; document.getElementById('quiz-timer').textContent = `${Math.floor(t/60)}:${t%60}`;
            if(t<=0) finishQuiz();
        }, 1000);
    }
    renderQuestion();
}

function renderQuestion() {
    const q = window.currentQuiz[window.currentQuestionIndex];
    document.getElementById('question-container').innerHTML = `
        <div class="question-text">Q${window.currentQuestionIndex+1}: ${q.q}</div>
        <div>${q.options.map((o,i)=>`<button class="answer-btn" onclick="ans(${i}, this)">${o}</button>`).join('')}</div>
    `;
    document.getElementById('q-counter').textContent = `${window.currentQuestionIndex+1}/${window.currentQuiz.length}`;
}

window.ans = function(i, btn) {
    window.userAnswers[window.currentQuestionIndex] = { answer: i, isCorrect: i === window.currentQuiz[window.currentQuestionIndex].a };
    document.querySelectorAll('.answer-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
}

document.getElementById('next-btn').onclick = () => {
    if(window.currentQuestionIndex < window.currentQuiz.length-1) {
        window.currentQuestionIndex++; renderQuestion();
    } else finishQuiz();
};

function finishQuiz() {
    clearInterval(window.timerInterval);
    const score = window.userAnswers.filter(a=>a&&a.isCorrect).length;
    document.getElementById('quiz-container').style.display='none';
    document.getElementById('results').style.display='block';
    document.getElementById('final-score').textContent = `${score}/${window.currentQuiz.length}`;
    
    if(currentUser) {
        db.collection('exam_results').add({
            studentName: currentUser.name, username: currentUser.username,
            score, total: window.currentQuiz.length, quizTitle: document.getElementById('current-quiz-title').textContent,
            date: new Date().toLocaleDateString(), timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// Helpers
function populateDropdowns() {
    const s1 = document.getElementById('exam-subject-select');
    const s2 = document.getElementById('src-sub-select');
    [s1,s2].forEach(s=>{ s.innerHTML=''; subjectsConfig.forEach(sub=>s.innerHTML+=`<option value="${sub.id}">${sub.name}</option>`) });
    updateSourceSelect();
}
async function updateSourceSelect() {
    const sub = document.getElementById('exam-subject-select').value;
    const s = document.getElementById('exam-source-select'); s.innerHTML='';
    defaultSources.forEach(d=>s.innerHTML+=`<option value="${d.id}">${d.name}</option>`);
    const snap = await db.collection('sources').where('subjectId','==',sub).get();
    snap.forEach(d=>s.innerHTML+=`<option value="${d.data().id}">${d.data().name}</option>`);
}
async function addNewSubject() { await db.collection('subjects').add({name:document.getElementById('new-sub-name').value, id:document.getElementById('new-sub-id').value}); fetchSubjects(); alert("تم"); }
async function addNewSource() { await db.collection('sources').add({subjectId:document.getElementById('src-sub-select').value, name:document.getElementById('new-src-name').value, id:document.getElementById('new-src-id').value}); updateSourceSelect(); alert("تم"); }
async function loadAnnouncement() {
    const d = await db.collection('settings').doc('announcement').get();
    if(d.exists && d.data().active) {
        document.getElementById('announcement-bar').style.display='flex';
        document.getElementById('announcement-text').textContent=d.data().text;
    }
}
function closeAnnouncement() { document.getElementById('announcement-bar').style.display='none'; }
async function saveAnnouncement() { await db.collection('settings').doc('announcement').set({text:document.getElementById('announcement-input').value, active:true}); alert("تم"); }
async function clearAnnouncement() { await db.collection('settings').doc('announcement').update({active:false}); alert("تم"); }
async function loadLeaderboard() {/* ... */}
