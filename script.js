// --- Firebase Config (زي ما هو) ---
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
} catch (e) {
    console.log("Firebase Error ⚠️");
}

let subjectsConfig = []; // هيتحمل من الداتابيز
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور' }
];

let currentUser = null; 
let currentSubject = ''; 
let currentQuiz = [];
let userAnswers = [];
let timerInterval = null;
let builderQuestions = []; // للكويز الهجين

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Check Session
    const saved = localStorage.getItem('nursingUser');
    if(saved) {
        currentUser = JSON.parse(saved);
        await checkUserBan(); // تأكد أنه مش محظور
    } else {
        document.getElementById('welcome-modal').style.display = 'flex';
    }

    if(currentUser) initApp();

    // Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// --- Auth System ---
let authMode = 'login';
function setAuthMode(mode) {
    authMode = mode;
    document.getElementById('btn-mode-login').classList.toggle('active', mode==='login');
    document.getElementById('btn-mode-register').classList.toggle('active', mode==='register');
    document.getElementById('reg-fullname').style.display = mode === 'register' ? 'block' : 'none';
}

async function handleAuth() {
    const user = document.getElementById('student-user-input').value.trim().toLowerCase();
    const name = document.getElementById('reg-fullname').value.trim();
    const err = document.getElementById('login-error');

    if(!user) return err.textContent = "ادخل اسم المستخدم";
    err.style.display = 'none';

    if(!db) {
        // Fallback if offline
        currentUser = { username: user, name: name || user };
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
        return;
    }

    try {
        const doc = await db.collection('users').doc(user).get();
        
        if (authMode === 'login') {
            if(!doc.exists) {
                err.style.display = 'block'; err.textContent = "المستخدم غير موجود"; return;
            }
            if(doc.data().isBanned) {
                 err.style.display = 'block'; err.textContent = "حسابك موقوف. تواصل مع الادارة"; return;
            }
            currentUser = doc.data();
        } else {
            // Register
            if(doc.exists) {
                 err.style.display = 'block'; err.textContent = "اسم المستخدم مأخوذ"; return;
            }
            if(!name) { err.style.display = 'block'; err.textContent = "الاسم مطلوب"; return; }
            
            currentUser = { username: user, name: name, joinedAt: firebase.firestore.FieldValue.serverTimestamp(), isBanned: false };
            await db.collection('users').doc(user).set(currentUser);
        }
        
        localStorage.setItem('nursingUser', JSON.stringify(currentUser));
        location.reload();
    } catch(e) {
        console.error(e);
        err.style.display = 'block'; err.textContent = "خطأ في الاتصال";
    }
}

async function checkUserBan() {
    if(!db) return;
    const doc = await db.collection('users').doc(currentUser.username).get();
    if(doc.exists && doc.data().isBanned) {
        alert("تم حظر حسابك");
        logout();
    }
}

function initApp() {
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً د. ${currentUser.name.split(' ')[0]} 👋`;
    
    // Load Settings
    loadGlobalSettings();
    // Load Content
    fetchContent();
}

// --- Content Loading ---
async function fetchContent() {
    if(db) {
        const snap = await db.collection('subjects').get();
        subjectsConfig = [];
        snap.forEach(d => subjectsConfig.push(d.data()));
    }
    // Render Tabs
    const nav = document.getElementById('main-nav');
    nav.innerHTML = '';
    subjectsConfig.forEach((sub, i) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${i===0?'active':''}`;
        btn.textContent = sub.name;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectSubject(sub.id);
        };
        nav.appendChild(btn);
    });
    if(subjectsConfig.length) selectSubject(subjectsConfig[0].id);
}

async function selectSubject(subId) {
    currentSubject = subId;
    document.getElementById('quiz-list-area').style.display = 'none';
    const con = document.getElementById('source-selection');
    con.style.display = 'flex';
    con.innerHTML = '';
    
    defaultSources.forEach(s => renderSource(s, con));
    if(db) {
        const snap = await db.collection('sources').where('subjectId', '==', subId).get();
        snap.forEach(d => renderSource(d.data(), con));
    }
}

function renderSource(src, con) {
    const d = document.createElement('div');
    d.className = 'source-card';
    d.innerHTML = `<h3>${src.name}</h3>`;
    d.onclick = () => showQuizzes(src.id, src.name);
    con.appendChild(d);
}

async function showQuizzes(srcId, srcName) {
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = srcName;
    const grid = document.getElementById('dynamic-cards-container');
    grid.innerHTML = 'تحميل...';

    if(db) {
        const snap = await db.collection('quizzes').where('subjectId','==',currentSubject).where('sourceId','==',srcId).get();
        grid.innerHTML = '';
        if(snap.empty) grid.innerHTML = '<p>لا يوجد كويزات</p>';
        snap.forEach(doc => {
            const q = doc.data();
            grid.innerHTML += `
            <div class="quiz-card" onclick="startQuiz('${doc.id}')">
                <h3>${q.title}</h3>
                <p>${q.questions.length} سؤال</p>
                <button class="start-btn">ابدأ</button>
            </div>`;
            window['q_'+doc.id] = q; 
        });
    }
}

// --- Quiz Logic ---
function startQuiz(qid) {
    const qData = window['q_'+qid];
    currentQuiz = qData.questions;
    userAnswers = new Array(currentQuiz.length).fill(null);
    currentQuestionIndex = 0;
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('current-quiz-title').textContent = qData.title;

    renderQuestion();
}

function renderQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    const el = document.getElementById('question-container');
    const u = userAnswers[currentQuestionIndex];
    
    let html = `<div class="question-text"><b>س${currentQuestionIndex+1}:</b> ${q.q}</div>`;
    html += `<div class="answer-options">`;
    q.options.forEach((o, i) => {
        html += `<button class="answer-btn ${u && u.idx === i ? 'selected' : ''}" onclick="ans(${i})">${o}</button>`;
    });
    html += `</div>`;
    el.innerHTML = html;
    
    document.getElementById('question-counter').textContent = `${currentQuestionIndex+1}/${currentQuiz.length}`;
    document.getElementById('next-btn').textContent = currentQuestionIndex === currentQuiz.length-1 ? "إنهاء" : "التالي";
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
}

function ans(i) {
    userAnswers[currentQuestionIndex] = { idx: i, isCorrect: i === currentQuiz[currentQuestionIndex].a };
    renderQuestion();
}

document.getElementById('next-btn').onclick = () => {
    if(currentQuestionIndex < currentQuiz.length-1) {
        currentQuestionIndex++; renderQuestion();
    } else {
        finishQuiz();
    }
};
document.getElementById('prev-btn').onclick = () => {
    currentQuestionIndex--; renderQuestion();
};

async function finishQuiz() {
    const score = userAnswers.filter(a => a && a.isCorrect).length;
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('final-score').textContent = `${score} / ${currentQuiz.length}`;
    
    if(db) {
        await db.collection('exam_results').add({
            username: currentUser.username,
            studentName: currentUser.name,
            quizTitle: document.getElementById('current-quiz-title').textContent,
            score: score,
            total: currentQuiz.length,
            date: new Date().toLocaleDateString('ar-EG'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// Review
document.getElementById('review-btn').onclick = () => {
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
    const c = document.getElementById('review-content');
    c.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const u = userAnswers[i];
        const isC = u && u.isCorrect;
        c.innerHTML += `
        <div class="review-question" style="border-right-color:${isC?'green':'red'}">
            <p>${q.q}</p>
            <p style="color:${isC?'green':'red'}">إجابتك: ${u ? q.options[u.idx] : 'لم يجب'}</p>
            ${!isC ? `<p style="color:green">الصح: ${q.options[q.a]}</p>` : ''}
        </div>`;
    });
};

window.backToQuizList = function() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
};
window.backToSources = function() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
};

window.logout = function() { localStorage.removeItem('nursingUser'); location.reload(); };
window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// --- Admin ---
window.openAdminLogin = () => document.getElementById('admin-login-modal').style.display = 'flex';
window.closeAdminLogin = () => document.getElementById('admin-login-modal').style.display = 'none';
window.checkAdminPassword = () => {
    if(document.getElementById('admin-password-input').value === 'admin123') {
        closeAdminLogin();
        document.getElementById('main-nav').style.display = 'none';
        document.getElementById('source-selection').style.display = 'none';
        document.getElementById('quiz-list-area').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        switchAdminTab('results');
    }
};
window.closeAdminDashboard = () => {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
};

window.switchAdminTab = (tab) => {
    document.querySelectorAll('.admin-tab-content').forEach(d => d.style.display='none');
    document.getElementById('admin-tab-'+tab).style.display = 'block';
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active')); // Reset active styles if needed
    
    if(tab === 'results') fetchAdminData();
    if(tab === 'users') fetchAdminUsers();
    if(tab === 'content') setupBuilder();
};

// 1. Results
window.fetchAdminData = async () => {
    if(!db) return;
    const con = document.getElementById('results-accordion-container');
    con.innerHTML = 'تحميل...';
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').limit(50).get();
    con.innerHTML = '';
    
    const groups = {};
    snap.forEach(doc => {
        const d = doc.data();
        if(!groups[d.studentName]) groups[d.studentName] = [];
        groups[d.studentName].push({id: doc.id, ...d});
    });
    
    Object.keys(groups).forEach(name => {
        let rows = '';
        groups[name].forEach(r => {
            rows += `<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td><td><button onclick="delRes('${r.id}')" style="color:red">X</button></td></tr>`;
        });
        con.innerHTML += `
        <div class="accordion-item">
            <div class="accordion-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='block'?'none':'block'">
                👤 ${name} (${groups[name].length})
            </div>
            <div class="accordion-content"><table>${rows}</table></div>
        </div>`;
    });
};
window.delRes = async (id) => { if(confirm("حذف؟")) await db.collection('exam_results').doc(id).delete(); fetchAdminData(); };

// 2. Users
window.fetchAdminUsers = async () => {
    const tb = document.getElementById('users-table-body');
    tb.innerHTML = '';
    const snap = await db.collection('users').get();
    snap.forEach(doc => {
        const u = doc.data();
        tb.innerHTML += `
        <tr>
            <td>${u.name} <button onclick="editUser('${doc.id}', '${u.name}')">✏️</button></td>
            <td>${u.username}</td>
            <td style="color:${u.isBanned?'red':'green'}">${u.isBanned?'محظور':'نشط'}</td>
            <td>
                <button onclick="banUser('${doc.id}', ${!u.isBanned})">${u.isBanned?'فك':'حظر'}</button>
                <button onclick="delUser('${doc.id}')">🗑️</button>
            </td>
        </tr>`;
    });
};
window.editUser = (id, name) => {
    document.getElementById('edit-uid').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-user-modal').style.display = 'flex';
};
window.confirmEditUser = async () => {
    await db.collection('users').doc(document.getElementById('edit-uid').value).update({name: document.getElementById('edit-name').value});
    document.getElementById('edit-user-modal').style.display = 'none';
    fetchAdminUsers();
};
window.banUser = async (id, s) => { await db.collection('users').doc(id).update({isBanned: s}); fetchAdminUsers(); };
window.delUser = async (id) => { if(confirm("حذف نهائي؟")) await db.collection('users').doc(id).delete(); fetchAdminUsers(); };

// 3. Hybrid Builder
function setupBuilder() {
    const s1 = document.getElementById('exam-subject-select');
    s1.innerHTML = '';
    subjectsConfig.forEach(s => s1.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    updateSourceSelect();
    builderQuestions = [];
    renderBuilder();
}
window.updateSourceSelect = () => {
    const sub = document.getElementById('exam-subject-select').value;
    const s2 = document.getElementById('exam-source-select');
    s2.innerHTML = '';
    defaultSources.forEach(s => s2.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    // load extra sources if needed from db
};

window.addManualCard = () => {
    builderQuestions.push({ q: '', options: ['','','',''], a: 0 });
    renderBuilder();
};
window.renderBuilder = () => {
    const c = document.getElementById('builder-cards-area');
    c.innerHTML = '';
    document.getElementById('q-count').textContent = builderQuestions.length + " سؤال";
    builderQuestions.forEach((q, i) => {
        c.innerHTML += `
        <div class="builder-card">
            <button class="del-card-btn" onclick="remCard(${i})">X</button>
            <input type="text" placeholder="السؤال" value="${q.q}" onchange="updQ(${i},'q',this.value)">
            ${q.options.map((o, oi) => `<input type="text" placeholder="خيار" value="${o}" onchange="updQ(${i},'o',this.value,${oi})">`).join('')}
            <input type="number" placeholder="رقم الاجابة الصحيحة (0-3)" value="${q.a}" onchange="updQ(${i},'a',this.value)">
        </div>`;
    });
};
window.updQ = (i, t, v, oi) => {
    if(t==='q') builderQuestions[i].q = v;
    if(t==='o') builderQuestions[i].options[oi] = v;
    if(t==='a') builderQuestions[i].a = parseInt(v);
};
window.remCard = (i) => { builderQuestions.splice(i,1); renderBuilder(); };

window.parseSmartText = () => {
    const txt = document.getElementById('smart-text').value;
    const lines = txt.split('\n');
    let curr = null;
    lines.forEach(l => {
        l = l.trim();
        if(l.match(/^(س|Q|\d)/)) {
            if(curr) builderQuestions.push(curr);
            curr = { q: l, options: [], a: 0 };
        } else if(curr && l) {
            if(l.startsWith('*')) curr.a = curr.options.length;
            curr.options.push(l.replace('*',''));
        }
    });
    if(curr) builderQuestions.push(curr);
    renderBuilder();
    document.getElementById('smart-import-area').style.display='none';
};

window.saveHybridExam = async () => {
    if(!builderQuestions.length) return alert("لا يوجد أسئلة");
    await db.collection('quizzes').add({
        title: document.getElementById('new-exam-title').value,
        subjectId: document.getElementById('exam-subject-select').value,
        sourceId: document.getElementById('exam-source-select').value,
        questions: builderQuestions
    });
    alert("تم الحفظ");
    builderQuestions = []; renderBuilder();
};

// 4. Global Settings
async function loadGlobalSettings() {
    if(!db) return;
    const doc = await db.collection('settings').doc('global').get();
    if(doc.exists) {
        const d = doc.data();
        if(d.news) {
            document.getElementById('news-ticker').style.display = 'block';
            document.getElementById('ticker-text').textContent = d.news;
        }
        if(d.honor) {
            document.getElementById('honor-board').style.display = 'block';
            loadHonor();
        }
    }
}
async function loadHonor() {
    const d = document.getElementById('honor-list');
    const snap = await db.collection('exam_results').orderBy('score','desc').limit(5).get();
    snap.forEach(doc => d.innerHTML += `<span>🏅 ${doc.data().studentName} </span>`);
}
window.saveGlobalSettings = async () => {
    await db.collection('settings').doc('global').set({
        news: document.getElementById('setting-news').value,
        honor: document.getElementById('setting-honor').checked
    }, {merge:true});
    alert("تم");
};

// Delete Logic
window.updateDeleteDropdown = async () => {
    const t = document.getElementById('delete-type-select').value;
    const s = document.getElementById('delete-item-select');
    s.innerHTML = '';
    const col = t === 'subject' ? 'subjects' : (t === 'source' ? 'sources' : 'quizzes');
    if(db) {
        const snap = await db.collection(col).get();
        snap.forEach(d => s.innerHTML += `<option value="${d.id}">${d.data().title || d.data().name}</option>`);
    }
};
window.deleteSelectedItem = async () => {
    const t = document.getElementById('delete-type-select').value;
    const id = document.getElementById('delete-item-select').value;
    const col = t === 'subject' ? 'subjects' : (t === 'source' ? 'sources' : 'quizzes');
    await db.collection(col).doc(id).delete();
    alert("تم");
};
