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
} catch (e) { console.log("Firebase Error ⚠️"); }

// --- Global Vars ---
let currentUser = null;
let currentSubject = '';
let currentQuizQuestions = [];
let currentQuizTitle = "";
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let hybridQuestions = []; // For Exam Builder

// --- Configs ---
// NOTE: Kept hardcoded fallback just in case DB is empty for UI to show something
let subjectsConfig = [
    { id: 'microbiology', name: 'Microbiology' },
    { id: 'fundamental', name: 'Fundamental' },
    { id: 'biochemistry', name: 'Biochemistry' },
    { id: 'anatomy', name: 'Anatomy' },
    { id: 'physiology', name: 'Physiology' },
    { id: 'clinical', name: 'Clinical' },
    { id: 'ethics', name: 'Ethics' }
];
let defaultSources = [
    { id: 'bank', name: '📚 بنك الأسئلة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور' }
];

document.addEventListener("DOMContentLoaded", async () => {
    // Check local session
    const storedUser = localStorage.getItem('nursingUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        await verifyBanStatus();
    } else {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    if (currentUser) initApp();
    
    // Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

async function verifyBanStatus() {
    if(!db) return;
    try {
        const doc = await db.collection('users').doc(currentUser.username).get();
        if(doc.exists && doc.data().isBanned) {
            alert("⚠️ حسابك محظور");
            logout();
        }
    } catch(e){}
}

function initApp() {
    document.getElementById('auth-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً دكتور ${currentUser.name.split(' ')[0]} 👋`;
    
    // Load Settings
    loadSettings();
    
    // Fetch Data
    fetchContent();
}

async function fetchContent() {
    if(db) {
        const subSnap = await db.collection('subjects').get();
        if(!subSnap.empty) {
            subjectsConfig = [];
            subSnap.forEach(doc => subjectsConfig.push(doc.data()));
        }
    }
    renderSubjectTabs();
}

function renderSubjectTabs() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = '';
    subjectsConfig.forEach((sub, i) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
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
    
    // Render Sources
    defaultSources.forEach(s => renderSourceCard(s, con));
    if(db) {
        const snap = await db.collection('sources').where('subjectId', '==', subId).get();
        snap.forEach(doc => renderSourceCard(doc.data(), con));
    }
}

function renderSourceCard(src, con) {
    const div = document.createElement('div');
    div.className = 'source-card';
    div.innerHTML = `<h3>${src.name}</h3>`;
    div.onclick = () => showQuizzes(src.id, src.name);
    con.appendChild(div);
}

async function showQuizzes(srcId, srcName) {
    document.getElementById('source-selection').style.display = 'none';
    const area = document.getElementById('quiz-list-area');
    area.style.display = 'block';
    document.getElementById('source-title-display').textContent = srcName;
    const grid = document.getElementById('dynamic-cards-container');
    grid.innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';
    
    if(db) {
        const snap = await db.collection('quizzes')
            .where('subjectId', '==', currentSubject)
            .where('sourceId', '==', srcId).get();
            
        if(snap.empty) {
            grid.innerHTML = '<p style="text-align:center;">لا توجد كويزات بعد.</p>';
            return;
        }
        
        grid.innerHTML = '';
        snap.forEach(doc => {
            const q = doc.data();
            grid.innerHTML += `
            <div class="quiz-card" onclick="startQuiz('${doc.id}')">
                <h3>${q.title}</h3>
                <p>📝 ${q.questions.length} سؤال | ${q.timeLimit ? q.timeLimit + ' دقيقة' : 'مفتوح'}</p>
                <button class="start-btn">ابدأ</button>
            </div>`;
            // Cache quiz
            window['quiz_'+doc.id] = q;
        });
    }
}

function startQuiz(qid) {
    const quiz = window['quiz_'+qid];
    if(!quiz) return;
    
    currentQuizQuestions = quiz.questions.sort(() => Math.random() - 0.5);
    currentQuizTitle = quiz.title;
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuizQuestions.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('current-quiz-title').textContent = quiz.title;
    
    // Timer
    const timerEl = document.getElementById('quiz-timer');
    clearInterval(timerInterval);
    if(quiz.timeLimit > 0) {
        let t = quiz.timeLimit * 60;
        timerEl.style.display = 'block';
        timerInterval = setInterval(() => {
            t--;
            timerEl.textContent = `${Math.floor(t/60)}:${(t%60).toString().padStart(2,'0')}`;
            if(t<=0) finishQuiz(true);
        }, 1000);
    } else {
        timerEl.textContent = "∞";
    }
    
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuizQuestions[currentQuestionIndex];
    const el = document.getElementById('question-container');
    const u = userAnswers[currentQuestionIndex];
    
    let html = `<div class="question-text"><b>س${currentQuestionIndex+1}:</b> ${q.q}</div><div class="answer-options">`;
    q.options.forEach((opt, i) => {
        html += `<button class="answer-btn ${u && u.idx === i ? 'selected' : ''}" onclick="selectAns(${i})">${opt}</button>`;
    });
    html += `</div>`;
    el.innerHTML = html;
    
    document.getElementById('question-counter').textContent = `${currentQuestionIndex+1} / ${currentQuizQuestions.length}`;
    document.getElementById('progress-fill').style.width = `${((currentQuestionIndex+1)/currentQuizQuestions.length)*100}%`;
    
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').textContent = currentQuestionIndex === currentQuizQuestions.length - 1 ? "إنهاء" : "التالي";
}

function selectAns(i) {
    userAnswers[currentQuestionIndex] = { idx: i, isCorrect: i === currentQuizQuestions[currentQuestionIndex].a };
    renderQuestion();
}

document.getElementById('next-btn').onclick = () => {
    if(currentQuestionIndex < currentQuizQuestions.length - 1) {
        currentQuestionIndex++; renderQuestion();
    } else finishQuiz();
};
document.getElementById('prev-btn').onclick = () => {
    currentQuestionIndex--; renderQuestion();
};

async function finishQuiz(timeout=false) {
    clearInterval(timerInterval);
    const score = userAnswers.filter(x => x && x.isCorrect).length;
    
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('final-score').textContent = `${score} / ${currentQuizQuestions.length}`;
    document.getElementById('score-message').textContent = timeout ? "انتهى الوقت!" : (score === currentQuizQuestions.length ? "ممتاز!" : "جيد");
    
    if(db) {
        try {
            await db.collection('exam_results').add({
                username: currentUser.username,
                studentName: currentUser.name,
                quizTitle: currentQuizTitle,
                score: score,
                total: currentQuizQuestions.length,
                date: new Date().toLocaleDateString('ar-EG'),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            document.getElementById('upload-status').textContent = "تم حفظ النتيجة ✅";
        } catch(e){}
    }
}

document.getElementById('review-btn').onclick = () => {
    document.getElementById('results').style.display = 'none';
    const c = document.getElementById('review-container');
    c.style.display = 'block';
    const content = document.getElementById('review-content');
    content.innerHTML = '';
    
    currentQuizQuestions.forEach((q, i) => {
        const u = userAnswers[i];
        const isCorrect = u && u.isCorrect;
        content.innerHTML += `
        <div class="review-question" style="border-right-color:${isCorrect?'#22c55e':'#ef4444'}">
            <p>${q.q}</p>
            <p style="color:${isCorrect?'green':'red'}">إجابتك: ${u ? q.options[u.idx] : 'لم يجب'}</p>
            ${!isCorrect ? `<p style="color:green">الصح: ${q.options[q.a]}</p>` : ''}
        </div>`;
    });
};

function backToQuizList() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
}

window.backToSources = () => {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
};

// --- Auth ---
window.switchAuthMode = (mode) => {
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-content').forEach(c => c.style.display = 'none');
    
    if(mode === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.querySelector('button[onclick*="login"]').previousElementSibling.previousElementSibling.previousElementSibling.classList.add('active'); // Dirty fix, better rely on ID
    } else {
        document.getElementById('register-form').style.display = 'block';
    }
    // Re-highlight correct tab
    const tabs = document.querySelectorAll('.auth-tab-btn');
    if(mode === 'login') tabs[0].classList.add('active');
    else tabs[1].classList.add('active');
};

window.loginUser = async () => {
    const u = document.getElementById('login-username').value.trim().toLowerCase();
    if(!u) return;
    if(db) {
        const doc = await db.collection('users').doc(u).get();
        if(doc.exists) {
            const d = doc.data();
            if(d.isBanned) { document.getElementById('login-msg').textContent = "محظور!"; return; }
            localStorage.setItem('nursingUser', JSON.stringify({name: d.name, username: d.username}));
            location.reload();
        } else {
            document.getElementById('login-msg').textContent = "غير موجود!";
        }
    }
};

window.registerUser = async () => {
    const n = document.getElementById('reg-fullname').value;
    const u = document.getElementById('reg-username').value.trim().toLowerCase();
    if(!n || !u) return;
    if(db) {
        const doc = await db.collection('users').doc(u).get();
        if(doc.exists) { document.getElementById('reg-msg').textContent = "اسم المستخدم مأخوذ"; return; }
        await db.collection('users').doc(u).set({
            name: n, username: u, joinedAt: firebase.firestore.FieldValue.serverTimestamp(), isBanned: false
        });
        localStorage.setItem('nursingUser', JSON.stringify({name: n, username: u}));
        location.reload();
    }
};

window.logout = () => { localStorage.removeItem('nursingUser'); location.reload(); };

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
    document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById('admin-tab-'+tab).style.display = 'block';
    document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active')); // if exist
    
    if(tab === 'results') fetchResults();
    if(tab === 'users') fetchUsers();
    if(tab === 'content') setupBuilder();
};

// 1. Admin Results
async function fetchResults() {
    if(!db) return;
    const snap = await db.collection('exam_results').orderBy('timestamp', 'desc').limit(50).get();
    const con = document.getElementById('results-accordion');
    con.innerHTML = '';
    
    // Grouping
    const groups = {};
    snap.forEach(doc => {
        const d = doc.data();
        const k = d.studentName;
        if(!groups[k]) groups[k] = [];
        groups[k].push({id: doc.id, ...d});
    });
    
    Object.keys(groups).forEach(name => {
        let rows = '';
        groups[name].forEach(r => {
            rows += `<tr><td>${r.quizTitle}</td><td>${r.score}/${r.total}</td><td>${r.date}</td><td><button style="color:red" onclick="delRes('${r.id}')">X</button></td></tr>`;
        });
        con.innerHTML += `
        <div class="accordion-item">
            <div class="accordion-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'">
                ${name} (${groups[name].length}) <span>▼</span>
            </div>
            <div class="accordion-content">
                <table><thead><tr><th>Quiz</th><th>Score</th><th>Date</th><th>Del</th></tr></thead>
                <tbody>${rows}</tbody></table>
            </div>
        </div>`;
    });
}
window.delRes = async (id) => { if(confirm("حذف؟")) { await db.collection('exam_results').doc(id).delete(); fetchResults(); } };

// 2. Admin Users
async function fetchUsers() {
    if(!db) return;
    const snap = await db.collection('users').orderBy('joinedAt', 'desc').get();
    const tb = document.getElementById('users-table-body');
    tb.innerHTML = '';
    snap.forEach(doc => {
        const u = doc.data();
        tb.innerHTML += `
        <tr>
            <td>${u.name} <button onclick="editUser('${doc.id}', '${u.name}')">✏️</button></td>
            <td>${u.username}</td>
            <td>-</td>
            <td>${u.isBanned ? 'محظور' : 'نشط'}</td>
            <td>
                <button onclick="toggleBan('${u.username}', ${!u.isBanned})" style="color:${u.isBanned?'green':'red'}">${u.isBanned?'فك':'حظر'}</button>
                <button onclick="delUser('${u.username}')">🗑️</button>
            </td>
        </tr>`;
    });
}
window.toggleBan = async (uid, s) => { await db.collection('users').doc(uid).update({isBanned: s}); fetchUsers(); };
window.delUser = async (uid) => { if(confirm("حذف؟")) { await db.collection('users').doc(uid).delete(); fetchUsers(); } };

// 3. Hybrid Builder
function setupBuilder() {
    const s1 = document.getElementById('exam-subject-select');
    s1.innerHTML = '';
    subjectsConfig.forEach(s => s1.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    updateSourceSelect();
    
    hybridQuestions = [];
    renderBuilder();
}
window.updateSourceSelect = () => {
    const sub = document.getElementById('exam-subject-select').value;
    const s2 = document.getElementById('exam-source-select');
    s2.innerHTML = '';
    defaultSources.forEach(s => s2.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    if(db) db.collection('sources').where('subjectId', '==', sub).get().then(snap => snap.forEach(d => s2.innerHTML += `<option value="${d.id}">${d.data().name}</option>`));
};

window.addManualQuestion = () => {
    hybridQuestions.push({ q: '', options: ['','','',''], a: 0 });
    renderBuilder();
};

window.renderBuilder = () => {
    const div = document.getElementById('builder-container');
    document.getElementById('q-count-label').textContent = hybridQuestions.length + " سؤال";
    div.innerHTML = '';
    hybridQuestions.forEach((q, i) => {
        div.innerHTML += `
        <div class="builder-card">
            <button class="del-q-btn" onclick="remQ(${i})">×</button>
            <input type="text" placeholder="السؤال" value="${q.q}" onchange="updQ(${i}, 'q', this.value)">
            ${q.options.map((opt, oi) => `
                <div style="display:flex; align-items:center; gap:5px;">
                    <input type="radio" name="rd-${i}" ${q.a === oi ? 'checked' : ''} onchange="updQ(${i}, 'a', ${oi})">
                    <input type="text" value="${opt}" placeholder="خيار ${oi+1}" onchange="updQ(${i}, 'o', this.value, ${oi})">
                </div>
            `).join('')}
        </div>`;
    });
};

window.updQ = (i, type, val, oi) => {
    if(type === 'q') hybridQuestions[i].q = val;
    if(type === 'a') hybridQuestions[i].a = val;
    if(type === 'o') hybridQuestions[i].options[oi] = val;
};
window.remQ = (i) => { hybridQuestions.splice(i, 1); renderBuilder(); };

window.processSmartImport = () => {
    const txt = document.getElementById('smart-import-text').value;
    const lines = txt.split('\n');
    let curr = null;
    lines.forEach(l => {
        l = l.trim();
        if(l.match(/^(س|Q|\d)/) || l.includes('?')) {
            if(curr && curr.options.length > 1) hybridQuestions.push(curr);
            curr = { q: l, options: [], a: 0 };
        } else if(curr) {
            let isC = l.startsWith('*');
            if(isC) curr.a = curr.options.length;
            curr.options.push(l.replace(/^\*|\-|\)|\./g, '').trim());
        }
    });
    if(curr && curr.options.length > 1) hybridQuestions.push(curr);
    renderBuilder();
    document.getElementById('smart-import-modal').style.display = 'none';
};

window.saveHybridExam = async () => {
    if(!hybridQuestions.length) return alert("اضف أسئلة");
    const t = document.getElementById('new-exam-title').value;
    const sub = document.getElementById('exam-subject-select').value;
    const src = document.getElementById('exam-source-select').value;
    const tm = document.getElementById('new-exam-time').value;
    
    await db.collection('quizzes').add({
        title: t, subjectId: sub, sourceId: src, timeLimit: tm, questions: hybridQuestions, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("تم الحفظ");
    hybridQuestions = []; renderBuilder();
};

// 4. Settings
async function loadSettings() {
    if(db) {
        const doc = await db.collection('settings').doc('global').get();
        if(doc.exists) {
            const d = doc.data();
            if(d.announcement) {
                document.getElementById('news-ticker').style.display = 'block';
                document.getElementById('ticker-text').textContent = d.announcement;
            }
            if(d.honor) {
                document.getElementById('honor-board').style.display = 'block';
            }
        }
    }
}
window.saveSettings = async (type) => {
    const d = {};
    if(type === 'announcement') d.announcement = document.getElementById('setting-announcement').value;
    if(type === 'honor') d.honor = document.getElementById('setting-honor-toggle').checked;
    await db.collection('settings').doc('global').set(d, {merge:true});
    alert("تم");
};

window.toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Delete Logic
window.updateDeleteDropdown = async () => {
    const t = document.getElementById('delete-type-select').value;
    const s = document.getElementById('delete-item-select');
    s.style.display = 'inline-block';
    s.innerHTML = '';
    const col = t === 'subject' ? 'subjects' : (t === 'source' ? 'sources' : 'quizzes');
    const snap = await db.collection(col).get();
    snap.forEach(d => s.innerHTML += `<option value="${d.id}">${d.data().title || d.data().name}</option>`);
};
window.deleteSelectedItem = async () => {
    const t = document.getElementById('delete-type-select').value;
    const id = document.getElementById('delete-item-select').value;
    const col = t === 'subject' ? 'subjects' : (t === 'source' ? 'sources' : 'quizzes');
    await db.collection(col).doc(id).delete();
    alert("تم");
};
