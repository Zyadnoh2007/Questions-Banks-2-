// --- Firebase Config (تأكد من صحة البيانات) ---
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
} catch (e) { console.error("Firebase Error", e); }

// --- Global Variables ---
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
let currentQuestionIndex = 0;
let timerInterval = null;

// --- عند تحميل الصفحة ---
document.addEventListener("DOMContentLoaded", async () => {
    // 1. استعادة جلسة الأدمن
    if (sessionStorage.getItem('isAdmin') === 'true') {
        currentUser = { name: 'Admin', isAdmin: true };
    }
    
    // 2. استعادة جلسة الطالب
    const savedUser = localStorage.getItem('nursingUser');
    if (savedUser && !currentUser) {
        const parsed = JSON.parse(savedUser);
        // التحقق من الحظر
        if(await verifyUserBan(parsed.username)) {
            logout(); return;
        }
        currentUser = parsed;
    }

    // 3. توجيه المستخدم
    if (!currentUser) {
        document.getElementById('auth-modal').style.display = 'flex';
        switchAuthMode('login'); // Default tab
    } else if (currentUser.isAdmin) {
        openAdminDashboard(true);
    } else {
        initStudentView();
    }

    // 4. تحميل البيانات
    loadAnnouncement();
    loadLeaderboard();
    fetchSubjects();

    // 5. الثيم
    if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode')?'dark':'light');
    };
});

// ================= AUTH SYSTEM (تم إصلاح الأزرار) =================
function switchAuthMode(mode) {
    document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(mode === 'login' ? 'tab-login' : 'tab-register').classList.add('active');
    
    document.getElementById('login-form').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('auth-error').style.display = 'none';
}

async function loginUser() {
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    if(!username) return showError("⚠️ ادخل اسم المستخدم");

    try {
        showError("⏳ جاري التحقق...", true);
        const doc = await db.collection('users').doc(username).get();
        if(!doc.exists) return showError("❌ اسم المستخدم غير موجود");
        
        const data = doc.data();
        if(data.isBanned) return showError("⛔ تم حظر هذا الحساب. راجع الإدارة.");

        currentUser = { username: username, name: data.name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { showError("خطأ في الاتصال"); }
}

async function registerUser() {
    const name = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    
    if(name.split(" ").length < 3) return showError("⚠️ يجب كتابة الاسم الثلاثي");
    if(!/^[a-z0-9]+$/.test(username)) return showError("⚠️ اسم المستخدم إنجليزي وأرقام فقط (بدون مسافات)");

    try {
        showError("⏳ جاري إنشاء الحساب...", true);
        const doc = await db.collection('users').doc(username).get();
        if(doc.exists) return showError("⛔ اسم المستخدم هذا محجوز مسبقاً، اختر غيره");

        await db.collection('users').doc(username).set({
            name: name,
            username: username,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            isBanned: false
        });

        currentUser = { username: username, name: name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { showError("❌ خطأ في التسجيل: " + e.message); }
}

function showError(msg, isInfo = false) {
    const el = document.getElementById('auth-error');
    el.textContent = msg; 
    el.style.display = 'block';
    el.style.color = isInfo ? '#3b82f6' : '#ef4444';
    el.style.borderColor = isInfo ? '#3b82f6' : '#fecaca';
}

async function verifyUserBan(username) {
    if(!db) return false;
    try {
        const doc = await db.collection('users').doc(username).get();
        return doc.exists && doc.data().isBanned;
    } catch(e) { return false; }
}

function logout() {
    localStorage.removeItem('nursingUser');
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// ================= ADMIN SYSTEM =================
function checkAdminSession() {
    if(sessionStorage.getItem('isAdmin')) {
        openAdminDashboard(true);
    } else {
        document.getElementById('admin-login-modal').style.display = 'flex';
    }
}

function closeAdminLogin() { document.getElementById('admin-login-modal').style.display = 'none'; }

function checkAdminPassword() {
    const pass = document.getElementById('admin-password-input').value;
    if(pass === "admin123") { 
        sessionStorage.setItem('isAdmin', 'true');
        closeAdminLogin();
        openAdminDashboard(true);
    } else {
        alert("كلمة مرور خاطئة");
    }
}

function openAdminDashboard(skipAuth=false) {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    if(skipAuth) switchAdminTab('results');
}

function adminLogout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(d => d.style.display = 'none');
    document.getElementById(`admin-tab-${tab}`).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if(tab === 'results') fetchGroupedResults();
    if(tab === 'users') fetchAdminUsers();
    if(tab === 'content') { populateDropdowns(); currentExamQuestions = []; renderVisualCards(); }
}

// --- 1. Admin: Users ---
async function fetchAdminUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">جاري التحميل...</td></tr>';
    
    const snap = await db.collection('users').orderBy('joinedAt', 'desc').get();
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const u = doc.data();
        const date = u.joinedAt ? new Date(u.joinedAt.toDate()).toLocaleDateString() : '-';
        const isBanned = u.isBanned || false;
        
        tbody.innerHTML += `
            <tr>
                <td><input value="${u.name}" onchange="updateUserName('${u.username}', this.value)" class="pro-input" style="padding:5px;"></td>
                <td>${u.username}</td>
                <td>${date}</td>
                <td>${isBanned ? '<span style="color:red; font-weight:bold;">محظور ⛔</span>' : '<span style="color:green; font-weight:bold;">نشط ✅</span>'}</td>
                <td>
                    <button onclick="toggleBan('${u.username}', ${!isBanned})" class="pro-btn sm ${isBanned ? 'success-btn' : 'danger-btn'}">
                        ${isBanned ? 'فك الحظر' : 'حظر'}
                    </button>
                    <button onclick="deleteUser('${u.username}')" class="pro-btn sm danger-btn" style="background:#7f1d1d;">حذف</button>
                </td>
            </tr>
        `;
    });
}

async function toggleBan(username, status) {
    if(!confirm(status ? "حظر الطالب؟ لن يتمكن من الدخول." : "فك الحظر عن الطالب؟")) return;
    await db.collection('users').doc(username).update({ isBanned: status });
    fetchAdminUsers();
}

async function updateUserName(username, newName) {
    await db.collection('users').doc(username).update({ name: newName });
}

async function deleteUser(username) {
    if(!confirm("⚠️ حذف الطالب نهائياً؟ هذا الإجراء لا يمكن التراجع عنه!")) return;
    await db.collection('users').doc(username).delete();
    fetchAdminUsers();
}

// --- 2. Admin: Results (Grouped) ---
async function fetchGroupedResults() {
    const container = document.getElementById('results-accordion-container');
    container.innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';
    
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').get();
    groupedResults = {};

    snap.forEach(doc => {
        const r = doc.data();
        const userKey = r.username || r.studentName; 
        if(!groupedResults[userKey]) groupedResults[userKey] = { name: r.studentName, username: r.username, results: [] };
        groupedResults[userKey].results.push({ id: doc.id, ...r });
    });

    renderAccordion();
}

function renderAccordion(filterText = '') {
    const container = document.getElementById('results-accordion-container');
    container.innerHTML = '';
    
    Object.keys(groupedResults).forEach(key => {
        const student = groupedResults[key];
        if(filterText && !student.name.includes(filterText) && !key.includes(filterText)) return;

        const html = `
            <div class="student-result-card">
                <div class="student-header" onclick="this.nextElementSibling.classList.toggle('open')">
                    <div class="student-info">
                        <h4 style="margin:0;">👤 ${student.name} <span style="color:#666; font-size:0.9rem;">(${student.username || key})</span></h4>
                        <span style="font-size:0.8rem; color:gray;">📄 ${student.results.length} امتحان</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button onclick="event.stopPropagation(); printStudentReport('${key}')" class="pro-btn sm secondary-btn">🖨️</button>
                        <span>🔽</span>
                    </div>
                </div>
                <div class="result-details">
                    <table class="mini-table">
                        <thead><tr><th>المادة</th><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th><th>حذف</th></tr></thead>
                        <tbody>
                            ${student.results.map(r => `
                                <tr>
                                    <td>${r.subject||'-'}</td>
                                    <td>${r.quizTitle}</td>
                                    <td style="color:${r.score/r.total >= 0.5 ? 'green':'red'}; font-weight:bold;">${r.score}/${r.total}</td>
                                    <td dir="ltr">${r.date}</td>
                                    <td><button class="pro-btn sm danger-btn" onclick="deleteResult('${r.id}')" style="padding:2px 8px;">🗑️</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function filterResults() { renderAccordion(document.getElementById('results-search').value); }

async function deleteResult(docId) {
    if(!confirm("حذف هذه النتيجة؟ سيتمكن الطالب من إعادة الامتحان.")) return;
    await db.collection('exam_results').doc(docId).delete();
    fetchGroupedResults();
}

// --- 3. Printing System ---
function printStudentReport(userKey) {
    const student = groupedResults[userKey];
    const content = `
        <div class="print-page">
            <h2 style="text-align:center; border-bottom:2px solid black; padding-bottom:10px;">تقرير درجات الطالب</h2>
            <div style="display:flex; justify-content:space-between; margin-top:20px;">
                <h3>الاسم: ${student.name}</h3>
                <h3>User ID: ${student.username || userKey}</h3>
            </div>
            <table class="print-table">
                <thead><tr><th>م</th><th>المادة</th><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th></tr></thead>
                <tbody>
                    ${student.results.map((r, i) => `<tr><td>${i+1}</td><td>${r.subject||'-'}</td><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}
                </tbody>
            </table>
            <p style="margin-top:40px;">التوقيع: ................................</p>
        </div>
    `;
    document.getElementById('print-area').innerHTML = content;
    window.print();
}

function printAllReports() {
    let content = '';
    Object.values(groupedResults).sort((a,b) => a.name.localeCompare(b.name)).forEach(student => {
        content += `
            <div class="print-page">
                <h2 style="text-align:center;">منصة الاختبارات - تقرير شامل</h2>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <h3>${student.name}</h3>
                    <h3>ID: ${student.username || '-'}</h3>
                </div>
                <hr>
                <table class="print-table">
                    <thead><tr><th>المادة</th><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th></tr></thead>
                    <tbody>
                        ${student.results.map(r => `<tr><td>${r.subject||'-'}</td><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });
    document.getElementById('print-area').innerHTML = content;
    window.print();
}

function exportGroupedExcel() {
    let data = [];
    Object.values(groupedResults).sort((a,b) => a.name.localeCompare(b.name)).forEach(s => {
        s.results.forEach(r => {
            data.push({
                "اسم الطالب": s.name,
                "User ID": s.username || '-',
                "المادة": r.subject || '-',
                "الامتحان": r.quizTitle,
                "الدرجة": r.score,
                "المجموع": r.total,
                "التاريخ": r.date
            });
        });
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "نتائج شاملة");
    XLSX.writeFile(wb, "Student_Results_Full.xlsx");
}

// ================= EXAM CREATION (SMART PASTE) =================
function parseSmartPaste() {
    const text = document.getElementById('smart-paste-input').value;
    const lines = text.split('\n').filter(l => l.trim());
    let newQs = [];
    let currentQ = null;

    lines.forEach(line => {
        line = line.trim();
        // Detect Question (Starts with number or Q or ?)
        if (/^(\d+|Q\d+|Question)\s*[\.:]/.test(line) || (line.includes('?') && !currentQ)) {
            if(currentQ) newQs.push(currentQ);
            currentQ = { q: line.replace(/^(\d+|Q\d+|Question)\s*[\.:]\s*/i, ''), options: [], a: 0 };
        } 
        // Detect Options (Starts with a,b,c or -)
        else if (currentQ && (/^[a-zA-Z][\)\.]\s/.test(line) || line.startsWith('-'))) {
            let isCorrect = line.includes('*') || line.toLowerCase().includes('correct');
            let optText = line.replace(/^[a-zA-Z][\)\.]\s/, '').replace(/^\-\s/, '').replace('*','').replace('(Correct)','').trim();
            if(isCorrect) currentQ.a = currentQ.options.length;
            currentQ.options.push(optText);
        }
    });
    if(currentQ) newQs.push(currentQ);

    currentExamQuestions = [...currentExamQuestions, ...newQs];
    renderVisualCards();
    document.getElementById('smart-paste-input').value = ''; 
}

function renderVisualCards() {
    const div = document.getElementById('visual-editor-container');
    div.innerHTML = '';
    currentExamQuestions.forEach((q, qIdx) => {
        div.innerHTML += `
            <div class="visual-card">
                <button class="delete-card" onclick="deleteQuestion(${qIdx})">×</button>
                <div style="font-weight:bold; margin-bottom:10px; direction:ltr;">Q${qIdx+1}: ${q.q}</div>
                <div class="visual-options">
                    ${q.options.map((opt, oIdx) => `
                        <div class="v-opt ${qIdx === q.a ? 'correct' : ''}" onclick="setCorrect(${qIdx}, ${oIdx})">
                            ${oIdx === q.a ? '✅' : '⚪'} <span style="direction:ltr;">${opt}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
}

function setCorrect(qIdx, oIdx) {
    currentExamQuestions[qIdx].a = oIdx; 
    renderVisualCards();
}

function deleteQuestion(idx) {
    currentExamQuestions.splice(idx, 1);
    renderVisualCards();
}

async function saveExamFinal() {
    const title = document.getElementById('new-exam-title').value;
    const subId = document.getElementById('exam-subject-select').value;
    const srcId = document.getElementById('exam-source-select').value;
    
    if(!title || currentExamQuestions.length === 0) return alert("❌ البيانات ناقصة! تأكد من العنوان والأسئلة");

    const examData = {
        title: title,
        subjectId: subId,
        sourceId: srcId,
        questions: currentExamQuestions,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Settings
        timeLimit: parseInt(document.getElementById('new-exam-time').value) || 0,
        oneAttempt: document.getElementById('opt-one-attempt').checked,
        randomQuestions: document.getElementById('opt-random-q').checked,
        hideResult: document.getElementById('opt-hide-result').checked
    };

    await db.collection('quizzes').add(examData);
    alert("✅ تم حفظ الامتحان بنجاح");
    currentExamQuestions = [];
    renderVisualCards();
    document.getElementById('new-exam-title').value = '';
}

// ================= HELPERS (الطلاب) =================
function initStudentView() {
    document.getElementById('welcome-message').textContent = `أهلاً بك، د. ${currentUser.name} 👋`;
    document.getElementById('auth-modal').style.display = 'none';
    generateSubjectTabs();
}

async function fetchSubjects() {
    if(!db) return;
    const subSnap = await db.collection('subjects').get();
    subjectsConfig = [
        { id: 'microbiology', name: 'Microbiology' },
        { id: 'fundamental', name: 'Fundamental' },
        { id: 'biochemistry', name: 'Biochemistry' },
        { id: 'anatomy', name: 'Anatomy' },
        { id: 'physiology', name: 'Physiology' },
        { id: 'clinical', name: 'Clinical' },
        { id: 'ethics', name: 'Ethics' }
    ];
    subSnap.forEach(doc => {
        if(!subjectsConfig.find(s=>s.id === doc.data().id)) subjectsConfig.push(doc.data());
    });
    generateSubjectTabs();
    populateDropdowns();
}

function generateSubjectTabs() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = '';
    subjectsConfig.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.textContent = sub.name;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            loadSourcesForSubject(sub.id);
        };
        nav.appendChild(btn);
    });
}

async function loadSourcesForSubject(subId) {
    const container = document.getElementById('source-selection');
    container.innerHTML = '';
    document.getElementById('quiz-list-area').style.display = 'none';
    
    // Default Sources
    defaultSources.forEach(src => renderSourceCard(src, subId, container));
    
    // Custom Sources
    if(db) {
        const snap = await db.collection('sources').where('subjectId', '==', subId).get();
        snap.forEach(doc => renderSourceCard(doc.data(), subId, container));
    }
    document.getElementById('source-selection').style.display = 'flex';
}

function renderSourceCard(src, subId, container) {
    const div = document.createElement('div');
    div.className = 'quiz-card';
    div.innerHTML = `<h3>${src.name}</h3>`;
    div.onclick = () => loadQuizzes(subId, src.id, src.name);
    container.appendChild(div);
}

async function loadQuizzes(subId, srcId, srcName) {
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = srcName;
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p>جاري التحميل...</p>';
    
    const snap = await db.collection('quizzes')
        .where('subjectId', '==', subId)
        .where('sourceId', '==', srcId).get();
        
    container.innerHTML = '';
    if(snap.empty) { container.innerHTML = '<p>لا توجد اختبارات</p>'; return; }

    snap.forEach(doc => {
        const q = doc.data();
        const div = document.createElement('div');
        div.className = 'quiz-card';
        div.innerHTML = `<h3>${q.title}</h3><p>${q.questions.length} سؤال</p><button class="start-btn">ابدأ</button>`;
        div.onclick = () => startQuiz(q);
        container.appendChild(div);
    });
}

function startQuiz(quizData) {
    currentQuiz = quizData.questions;
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('current-quiz-title').textContent = quizData.title;
    displayQuestion();
}

function displayQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    document.getElementById('question-container').innerHTML = `
        <div class="question-text">Q${currentQuestionIndex+1}: ${q.q}</div>
        <div>${q.options.map((o,i) => `<button class="answer-btn" onclick="selectAnswer(${i})">${o}</button>`).join('')}</div>
    `;
}

function selectAnswer(idx) {
    userAnswers[currentQuestionIndex] = { answer: idx, isCorrect: idx === currentQuiz[currentQuestionIndex].a };
    document.querySelectorAll('.answer-btn').forEach((b, i) => {
        b.classList.toggle('selected', i === idx);
    });
}

// ... (باقي وظائف التنقل والحفظ والـ Announcements زي ما هي) ...
// (تم دمجها في الرد السابق، تأكد فقط من نسخ الكود كاملاً)

function populateDropdowns() {
    const s1 = document.getElementById('exam-subject-select');
    const s2 = document.getElementById('source-subject-select');
    [s1, s2].forEach(s => {
        s.innerHTML = '';
        subjectsConfig.forEach(sub => s.innerHTML += `<option value="${sub.id}">${sub.name}</option>`);
    });
    updateSourceSelect();
}

async function updateSourceSelect() {
    const subId = document.getElementById('exam-subject-select').value;
    const sel = document.getElementById('exam-source-select');
    sel.innerHTML = '';
    defaultSources.forEach(s => sel.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    const snap = await db.collection('sources').where('subjectId', '==', subId).get();
    snap.forEach(doc => sel.innerHTML += `<option value="${doc.data().id}">${doc.data().name}</option>`);
}

async function addNewSubject() {
    await db.collection('subjects').add({
        name: document.getElementById('new-subject-name').value,
        id: document.getElementById('new-subject-id').value
    });
    alert("تم"); fetchSubjects();
}

async function addNewSource() {
    await db.collection('sources').add({
        subjectId: document.getElementById('source-subject-select').value,
        name: document.getElementById('new-source-name').value,
        id: document.getElementById('new-source-id').value
    });
    alert("تم"); updateSourceSelect();
}

async function loadAnnouncement() {
    try {
        const doc = await db.collection('settings').doc('announcement').get();
        if(doc.exists && doc.data().active) {
            document.getElementById('announcement-bar').style.display = 'flex';
            document.getElementById('announcement-text').textContent = doc.data().text;
        }
    } catch(e){}
}
function closeAnnouncement() { document.getElementById('announcement-bar').style.display = 'none'; }
async function saveAnnouncement() {
    await db.collection('settings').doc('announcement').set({
        text: document.getElementById('announcement-input').value,
        active: true
    });
    alert("تم النشر");
}
async function clearAnnouncement() {
    await db.collection('settings').doc('announcement').update({ active: false });
    alert("تم الإخفاء");
}
async function loadLeaderboard() {/* ... */}
