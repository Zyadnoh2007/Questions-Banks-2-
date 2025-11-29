// --- Firebase Config (Replace with yours if different) ---
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
let currentUser = null; // { name, username, isAdmin }
let subjectsConfig = [];
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور' }
];

let currentExamQuestions = []; // For Visual Builder
let groupedResults = {}; // For Admin Results

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Check Admin Session
    if (sessionStorage.getItem('isAdmin') === 'true') {
        currentUser = { name: 'Admin', isAdmin: true };
    }
    
    // 2. Check Student Login
    const savedUser = localStorage.getItem('nursingUser');
    if (savedUser && !currentUser) {
        currentUser = JSON.parse(savedUser);
        if(await verifyUserBan(currentUser.username)) {
            logout(); return;
        }
    }

    // 3. Init Interface
    if (!currentUser) {
        document.getElementById('auth-modal').style.display = 'flex';
    } else if (currentUser.isAdmin) {
        openAdminDashboard(true); // Skip login check
    } else {
        initStudentView();
    }

    // 4. Load Config
    loadAnnouncement();
    loadLeaderboard();
    fetchSubjects();

    // 5. Setup Theme
    if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode')?'dark':'light');
    };
});

// ================= AUTH SYSTEM =================
function switchAuthMode(mode) {
    document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('login-form').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('auth-error').style.display = 'none';
}

async function loginUser() {
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    if(!username) return showError("ادخل اسم المستخدم");

    try {
        const doc = await db.collection('users').doc(username).get();
        if(!doc.exists) return showError("اسم المستخدم غير موجود");
        
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
    
    if(name.split(" ").length < 3) return showError("يجب كتابة الاسم الثلاثي");
    if(!/^[a-z0-9]+$/.test(username)) return showError("اسم المستخدم إنجليزي وأرقام فقط بدون مسافات");

    try {
        const doc = await db.collection('users').doc(username).get();
        if(doc.exists) return showError("اسم المستخدم هذا محجوز مسبقاً ⛔");

        await db.collection('users').doc(username).set({
            name: name,
            username: username,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            isBanned: false
        });

        currentUser = { username: username, name: name, isAdmin: false };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) { showError("خطأ في التسجيل: " + e.message); }
}

function showError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg; el.style.display = 'block';
}

async function verifyUserBan(username) {
    const doc = await db.collection('users').doc(username).get();
    return doc.exists && doc.data().isBanned;
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

function checkAdminPassword() {
    const pass = document.getElementById('admin-password-input').value;
    if(pass === "admin123") { // Change this password!
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('admin-login-modal').style.display = 'none';
        openAdminDashboard(true);
    } else {
        alert("كلمة مرور خاطئة");
    }
}

function openAdminDashboard(skipAuth=false) {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
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

// --- 1. Admin: Users Management ---
async function fetchAdminUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="5">جاري التحميل...</td></tr>';
    
    const snap = await db.collection('users').orderBy('joinedAt', 'desc').get();
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const u = doc.data();
        const date = u.joinedAt ? new Date(u.joinedAt.toDate()).toLocaleDateString() : '-';
        const banBtn = u.isBanned 
            ? `<button onclick="toggleBan('${u.username}', false)" style="background:#22c55e; color:white;">فك الحظر</button>` 
            : `<button onclick="toggleBan('${u.username}', true)" style="background:#ef4444; color:white;">حظر</button>`;
        
        tbody.innerHTML += `
            <tr>
                <td><input value="${u.name}" onchange="updateUserName('${u.username}', this.value)" style="width:100%"></td>
                <td>${u.username}</td>
                <td>${date}</td>
                <td>${u.isBanned ? '<span style="color:red">محظور</span>' : '<span style="color:green">نشط</span>'}</td>
                <td>
                    ${banBtn}
                    <button onclick="deleteUser('${u.username}')" style="background:#b91c1c; color:white;">حذف</button>
                </td>
            </tr>
        `;
    });
}

async function toggleBan(username, status) {
    if(!confirm(status ? "حظر الطالب؟" : "فك الحظر؟")) return;
    await db.collection('users').doc(username).update({ isBanned: status });
    fetchAdminUsers();
}

async function updateUserName(username, newName) {
    await db.collection('users').doc(username).update({ name: newName });
}

async function deleteUser(username) {
    if(!confirm("حذف الطالب نهائياً؟")) return;
    await db.collection('users').doc(username).delete();
    fetchAdminUsers();
}

// --- 2. Admin: Results (Grouped) ---
async function fetchGroupedResults() {
    const container = document.getElementById('results-accordion-container');
    container.innerHTML = 'جاري التحميل...';
    
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').get();
    groupedResults = {};

    snap.forEach(doc => {
        const r = doc.data();
        const userKey = r.username || r.studentName; // Fallback
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
                        <h4>${student.name} <small>(${key})</small></h4>
                        <span>${student.results.length} امتحان</span>
                    </div>
                    <div class="student-actions">
                        <button onclick="event.stopPropagation(); printStudentReport('${key}')" class="sm-btn">🖨️ طباعة</button>
                        <span style="font-size:1.2rem;">🔽</span>
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
                                    <td style="color:${r.score/r.total >= 0.5 ? 'green':'red'}">${r.score}/${r.total}</td>
                                    <td dir="ltr">${r.date}</td>
                                    <td><button class="delete-result-btn" onclick="deleteResult('${r.id}')">🗑️</button></td>
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
            <h2 style="text-align:center; border-bottom:2px solid black;">تقرير درجات الطالب</h2>
            <h3>الاسم: ${student.name}</h3>
            <h4>User ID: ${student.username || userKey}</h4>
            <table class="print-table">
                <thead><tr><th>م</th><th>المادة</th><th>الامتحان</th><th>الدرجة</th><th>التاريخ</th></tr></thead>
                <tbody>
                    ${student.results.map((r, i) => `<tr><td>${i+1}</td><td>${r.subject||'-'}</td><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`).join('')}
                </tbody>
            </table>
            <p style="margin-top:20px;">التوقيع: ....................</p>
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
                <h2 style="text-align:center;">منصة الاختبارات - تقرير طالب</h2>
                <div style="display:flex; justify-content:space-between;">
                    <h3>${student.name}</h3>
                    <h3>${student.username || '-'}</h3>
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
        // Detect Question (Starts with number or Q)
        if (/^(\d+|Q\d+|Question)\s*[\.:]/.test(line) || line.includes('?') && !currentQ) {
            if(currentQ) newQs.push(currentQ);
            currentQ = { q: line.replace(/^(\d+|Q\d+|Question)\s*[\.:]\s*/i, ''), options: [], a: 0 };
        } 
        // Detect Options (Starts with a,b,c or -)
        else if (currentQ && /^[a-zA-Z][\)\.]\s/.test(line) || line.startsWith('-')) {
            let isCorrect = line.includes('*') || line.toLowerCase().includes('correct');
            let optText = line.replace(/^[a-zA-Z][\)\.]\s/, '').replace(/^\-\s/, '').replace('*','').replace('(Correct)','').trim();
            if(isCorrect) currentQ.a = currentQ.options.length;
            currentQ.options.push(optText);
        }
    });
    if(currentQ) newQs.push(currentQ);

    currentExamQuestions = [...currentExamQuestions, ...newQs];
    renderVisualCards();
    document.getElementById('smart-paste-input').value = ''; // clear
}

function renderVisualCards() {
    const div = document.getElementById('visual-editor-container');
    div.innerHTML = '';
    currentExamQuestions.forEach((q, qIdx) => {
        div.innerHTML += `
            <div class="visual-card">
                <button class="delete-card" onclick="deleteQuestion(${qIdx})">×</button>
                <div style="font-weight:bold; margin-bottom:5px;">Q${qIdx+1}: ${q.q}</div>
                <div class="visual-options">
                    ${q.options.map((opt, oIdx) => `
                        <div class="v-opt ${qIdx === q.a ? 'correct' : ''}" onclick="setCorrect(${qIdx}, ${oIdx})">
                            ${oIdx === q.a ? '✅' : '⚪'} ${opt}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
}

function setCorrect(qIdx, oIdx) {
    currentExamQuestions[qIdx].a = oIdx; // Update correct answer logic if needed, current logic assumes index
    // Note: My visual logic uses index, real exam uses index. Just need to ensure mapping.
    // Fixed: The parsing sets 'a' to the index.
    currentExamQuestions[qIdx].a = oIdx; // Update manually
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
    
    if(!title || currentExamQuestions.length === 0) return alert("البيانات ناقصة!");

    const examData = {
        title: title,
        subjectId: subId,
        sourceId: srcId,
        questions: currentExamQuestions,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Settings
        timeLimit: document.getElementById('new-exam-time').value || 0,
        oneAttempt: document.getElementById('opt-one-attempt').checked,
        randomQuestions: document.getElementById('opt-random-q').checked,
        hideResult: document.getElementById('opt-hide-result').checked
    };

    await db.collection('quizzes').add(examData);
    alert("تم الحفظ بنجاح ✅");
    currentExamQuestions = [];
    renderVisualCards();
    document.getElementById('new-exam-title').value = '';
}

// ================= ANNOUNCEMENTS & LEADERBOARD =================
async function saveAnnouncement() {
    const txt = document.getElementById('announcement-input').value;
    await db.collection('settings').doc('announcement').set({ text: txt, active: !!txt });
    alert("تم النشر");
}
async function clearAnnouncement() {
    await db.collection('settings').doc('announcement').update({ active: false });
    alert("تم الإخفاء");
}
async function loadAnnouncement() {
    const doc = await db.collection('settings').doc('announcement').get();
    if(doc.exists && doc.data().active) {
        document.getElementById('announcement-bar').style.display = 'flex';
        document.getElementById('announcement-text').textContent = doc.data().text;
    }
}

// ================= UTILS & HELPERS =================
function populateDropdowns() { /* ... Same as before ... */ }
function initStudentView() { /* ... Same as before ... */ }
function fetchSubjects() { /* ... Same as before ... */ }
// Note: Ensure `renderQuizCards` uses `currentUser.username` for history keys now for uniqueness!
// Example: const historyKey = `${currentSubject}_${currentSource}_${quizKey}_${currentUser.username}`;
