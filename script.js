// --- Firebase Configuration ---
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
    { id: 'bank', name: '📚 بنك الأسئلة', desc: 'أسئلة البنك الشاملة' },
    { id: 'doctor', name: '👨‍⚕️ كويزات الدكتور', desc: 'أسئلة المحاضرات' }
];

let dbSubjects = []; 
let dbSources = [];

let currentStudentName = localStorage.getItem('studentName') || "";
let currentSubject = subjectsConfig[0].id; 
let currentSource = ''; 
let currentQuizData = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsRemaining = 0;
let isTimerDown = false; 

document.addEventListener("DOMContentLoaded", async () => {
    if (currentStudentName) await verifyUserStatus(); 
    await fetchDynamicContent();
    generateSubjectTabs();
    
    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    }

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

async function verifyUserStatus() {
    if (!db) return;
    try {
        const userDoc = await db.collection('users').doc(currentStudentName).get();
        if (!userDoc.exists) {
            localStorage.removeItem('studentName'); 
            alert("⚠️ تم إيقاف حسابك من قبل إدارة المنصة.");
            location.reload(); 
        }
    } catch (e) { console.log(e); }
}

async function fetchDynamicContent() {
    if (!db) return;
    try {
        const subsSnap = await db.collection('subjects').get();
        dbSubjects = []; 
        subsSnap.forEach(doc => {
            const data = doc.data();
            dbSubjects.push({ docId: doc.id, ...data }); 
            if (!subjectsConfig.find(s => s.id === data.id)) subjectsConfig.push(data);
        });
        const srcSnap = await db.collection('sources').get();
        dbSources = [];
        srcSnap.forEach(doc => dbSources.push({ docId: doc.id, ...doc.data() }));
    } catch (e) { console.error(e); }
}

function generateSubjectTabs() {
    const navContainer = document.getElementById('main-nav');
    navContainer.innerHTML = ''; 
    subjectsConfig.forEach((sub, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${currentSubject === sub.id ? 'active' : ''}`;
        btn.textContent = sub.name;
        btn.onclick = () => selectSubject(sub.id);
        navContainer.appendChild(btn);
    });
    if(subjectsConfig.length > 0) selectSubject(currentSubject || subjectsConfig[0].id);
}

async function selectSubject(subjectId) {
    currentSubject = subjectId;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const btns = document.querySelectorAll('.tab-btn');
    const subIndex = subjectsConfig.findIndex(s => s.id === subjectId);
    if(btns[subIndex]) btns[subIndex].classList.add('active');

    const sourceContainer = document.getElementById('source-selection');
    sourceContainer.innerHTML = '';
    
    defaultSources.forEach(src => renderSourceCard(src, sourceContainer));

    if (db) {
        const customSrcSnap = await db.collection('sources').where('subjectId', '==', subjectId).get();
        customSrcSnap.forEach(doc => renderSourceCard(doc.data(), sourceContainer));
    }

    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function renderSourceCard(src, container) {
    const div = document.createElement('div');
    div.className = `source-card ${src.id === 'doctor' ? 'doctor-card' : ''}`;
    div.innerHTML = `<h3>${src.name}</h3><p>${src.desc || ''}</p>`;
    div.onclick = () => loadQuizSource(src.id, src.name);
    container.appendChild(div);
}

window.backToSources = function() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
};

async function loadQuizSource(sourceId, sourceName) {
    currentSource = sourceId;
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = `📂 ${sourceName}`;
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">جاري البحث عن كويزات...</p>';

    let allQuizzes = {};
    try {
        const scriptPath = `questions/${currentSubject}/${sourceId}.js`;
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                const dataVarName = `${currentSubject}_${sourceId}_data`;
                if(window[dataVarName]) Object.assign(allQuizzes, window[dataVarName]);
                resolve();
            };
            script.onerror = () => resolve(); 
            document.head.appendChild(script);
        });
    } catch(e) {}

    if (db) {
        const qSnap = await db.collection('quizzes').where('subjectId', '==', currentSubject).where('sourceId', '==', sourceId).get();
        qSnap.forEach(doc => { allQuizzes[doc.id] = doc.data(); });
    }
    renderQuizCards(allQuizzes);
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
        container.innerHTML = '<p class="coming-soon">لا توجد اختبارات مضافة هنا بعد.</p>';
        return;
    }

    keys.forEach(quizKey => {
        const quiz = data[quizKey];
        const historyKey = `${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        let badgeHtml = savedHistory[historyKey] ? `<div class="history-badge">✅ ${savedHistory[historyKey].score}/${savedHistory[historyKey].total}</div>` : '';
        
        let timeBadge = '';
        if (quiz.timeLimit && quiz.timeLimit > 0) {
            timeBadge = `<span style="font-size:0.8rem; background:#fecaca; padding:2px 8px; border-radius:10px; color:#b91c1c;">⏳ ${quiz.timeLimit} دقيقة</span>`;
        } else {
            timeBadge = `<span style="font-size:0.8rem; background:#dcfce7; padding:2px 8px; border-radius:10px; color:#15803d;">⏱️ مفتوح</span>`;
        }

        container.innerHTML += `
            <div class="quiz-card" onclick="startQuiz('${quizKey}', '${quiz.title}', ${quiz.timeLimit || 0})">
                ${badgeHtml}
                <h3>${quiz.title}</h3>
                <div style="display:flex; justify-content:center; gap:10px; margin-bottom:10px;">
                    <span>📝 ${quiz.questions.length} سؤال</span>
                    ${timeBadge}
                </div>
                <button class="start-btn">ابدأ</button>
            </div>`;
    });
    currentQuizData = data;
}

function startQuiz(quizKey, quizTitle, timeLimit = 0) {
    const quiz = currentQuizData[quizKey];
    if (!quiz) return;
    window.currentQuizKey = quizKey;
    window.currentQuizTitle = quizTitle;
    currentQuiz = shuffleArray([...quiz.questions]);
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById("current-quiz-title").textContent = quiz.title;
    
    if (timerInterval) clearInterval(timerInterval);
    
    const exitBtn = document.querySelector('#quiz-container .back-btn');
    
    if (timeLimit > 0) {
        isTimerDown = true;
        secondsRemaining = timeLimit * 60;
        exitBtn.style.display = 'none';
        window.onbeforeunload = function() { return "تحذير: الامتحان قيد التشغيل!"; };
    } else {
        isTimerDown = false;
        secondsRemaining = 0;
        exitBtn.style.display = 'block';
        window.onbeforeunload = null;
    }

    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (isTimerDown) {
            secondsRemaining--;
            if (secondsRemaining <= 0) {
                clearInterval(timerInterval);
                finishQuiz(true); 
            }
        } else {
            secondsRemaining++;
        }
        updateTimerDisplay();
    }, 1000);
    
    displayQuestion();
    updateNavigation();
}

function finishQuiz(timeOut = false) {
    clearInterval(timerInterval);
    window.onbeforeunload = null;
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    const historyKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let entry = historyData[historyKey] || { score: 0, total: currentQuiz.length, highestScore: 0, attempts: 0, title: window.currentQuizTitle };
    entry.score = score; entry.total = currentQuiz.length; entry.title = window.currentQuizTitle;
    entry.attempts = (entry.attempts || 0) + 1;
    entry.highestScore = Math.max(entry.highestScore || 0, score);
    historyData[historyKey] = entry;
    localStorage.setItem('quizHistory', JSON.stringify(historyData));
    saveScoreToFirebase(score, currentQuiz.length);
    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = timeOut ? "⏰ انتهى الوقت!" : (score === currentQuiz.length ? "ممتاز! 🌟" : "جيد، حاول مرة أخرى");
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function updateTimerDisplay() {
    const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const s = (secondsRemaining % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById("quiz-timer");
    timerEl.textContent = `${m}:${s}`;
    if (isTimerDown && secondsRemaining < 60) { timerEl.style.backgroundColor = "#ef4444"; timerEl.classList.add('pulse'); } 
    else { timerEl.style.backgroundColor = "var(--primary-color)"; timerEl.classList.remove('pulse'); }
}

function displayQuestion() {
    const qData = currentQuiz[currentQuestionIndex];
    const container = document.getElementById("question-container");
    const userAnswer = userAnswers[currentQuestionIndex];
    const isRtl = /[أ-ي]/.test(qData.q);
    const dirClass = isRtl ? 'rtl' : 'ltr'; 
    let optionsHtml = '';
    if (qData.type === 'mcq') {
        optionsHtml = `<div class="answer-options">` + qData.options.map((opt, i) => `<button class="answer-btn ${dirClass} ${userAnswer?.answer === i ? 'selected' : ''}" onclick="selectOption(${i})">${opt}</button>`).join('') + `</div>`;
    } else if (qData.type === 'tf') {
        optionsHtml = `<div class="tf-options"><button class="answer-btn ${userAnswer?.answer === true ? 'selected' : ''}" onclick="selectOption(true)">True</button><button class="answer-btn ${userAnswer?.answer === false ? 'selected' : ''}" onclick="selectOption(false)">False</button></div>`;
    }
    container.innerHTML = `<div class="question-card"><div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div><div class="question-text ${dirClass}">${qData.q}</div>${optionsHtml}${qData.hint ? `<div class="hint-container"><button class="hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">تلميح</button><p class="hint-text">${qData.hint}</p></div>` : ''}</div>`;
    document.getElementById("progress-fill").style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
    document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

function selectOption(val) { userAnswers[currentQuestionIndex] = { answer: val, isCorrect: val === currentQuiz[currentQuestionIndex].a }; displayQuestion(); }
function nextQuestion() { if (currentQuestionIndex < currentQuiz.length - 1) { currentQuestionIndex++; displayQuestion(); } else { finishQuiz(); } updateNavigation(); }
function prevQuestion() { if (currentQuestionIndex > 0) { currentQuestionIndex--; displayQuestion(); updateNavigation(); } }
function updateNavigation() { document.getElementById("prev-btn").disabled = currentQuestionIndex === 0; document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي"; }
function backToQuizList() { clearInterval(timerInterval); document.getElementById('quiz-container').style.display = 'none'; document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'none'; document.getElementById('quiz-list-area').style.display = 'block'; if (currentQuizData) renderQuizCards(currentQuizData); window.onbeforeunload = null; }

// 🔴 Logic for Registration + Allow Re-entry 🔴
async function saveStudentName() {
    const nameInput = document.getElementById('student-name-input');
    const errorMsg = document.getElementById('login-error');
    const rawName = nameInput.value.trim();
    const parts = rawName.split(/\s+/);
    
    if (parts.length < 3) {
        errorMsg.textContent = "❌ يجب إدخال الاسم الثلاثي";
        errorMsg.style.display = 'block'; return;
    }
    if (!db) { completeLogin(rawName); return; }
    
    nameInput.disabled = true;
    errorMsg.textContent = "⏳ جاري التحقق..."; errorMsg.style.display = 'block';
    errorMsg.style.color = "blue";

    try {
        // 1. Check Strict Mode Setting
        let strictMode = true; 
        const configDoc = await db.collection('settings').doc('config').get();
        if(configDoc.exists) strictMode = configDoc.data().strictNames;

        const userDoc = await db.collection('users').doc(rawName).get();
        
        if (userDoc.exists) {
            // 2. Check if allowed specifically
            const userData = userDoc.data();
            if (strictMode && !userData.allowReentry) {
                errorMsg.textContent = "❌ الاسم مسجل بالفعل (تواصل مع المشرف لفك الحظر)";
                errorMsg.style.color = "red";
                nameInput.disabled = false;
            } else {
                // Allowed! (Consume the permission)
                if (userData.allowReentry) {
                    await db.collection('users').doc(rawName).update({ allowReentry: false });
                }
                completeLogin(rawName);
            }
        } else {
            // New User
            await db.collection('users').doc(rawName).set({ 
                name: rawName, 
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                allowReentry: false
            });
            completeLogin(rawName);
        }
    } catch (error) { errorMsg.textContent = "خطأ في الاتصال"; nameInput.disabled = false; console.log(error); }
}

// 🔴 New Admin Function: Grant Access 🔴
window.grantOneTimeAccess = async function() {
    const name = document.getElementById('unblock-user-name').value.trim();
    if(!name) { alert("اكتب اسم الطالب الأول"); return; }
    
    try {
        const userDoc = await db.collection('users').doc(name).get();
        if(!userDoc.exists) {
            alert("⚠️ هذا الطالب غير مسجل أصلاً.");
            return;
        }
        // Set flag to true
        await db.collection('users').doc(name).update({ allowReentry: true });
        alert(`✅ تم السماح للطالب (${name}) بالدخول مرة واحدة.`);
        document.getElementById('unblock-user-name').value = "";
    } catch(e) { alert("خطأ: " + e.message); }
};

function completeLogin(name) { currentStudentName = name; localStorage.setItem('studentName', currentStudentName); location.reload(); }
function logout() { if(confirm("تسجيل خروج؟")) { localStorage.removeItem('studentName'); location.reload(); } }
function saveScoreToFirebase(score, total) { if (!db) return; db.collection("exam_results").add({ studentName: currentStudentName, subject: currentSubject, quizTitle: window.currentQuizTitle, score: score, total: total, percentage: Math.round((score/total)*100), date: new Date().toLocaleString('ar-EG'), timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then(() => document.getElementById('upload-status').textContent = "✅ تم الحفظ"); }
function showReview() { const container = document.getElementById("review-content"); container.innerHTML = ''; currentQuiz.forEach((q, i) => { const uAns = userAnswers[i]; const isCorrect = uAns && uAns.isCorrect; let correctText = q.type === 'tf' ? (q.a ? 'True' : 'False') : q.options[q.a]; let userText = uAns ? (q.type === 'tf' ? (uAns.answer ? 'True' : 'False') : q.options[uAns.answer]) : 'لم يجب'; container.innerHTML += `<div class="review-question"><div class="question-number">س ${i+1}</div><div class="question-text">${q.q}</div><div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">إجابتك: ${userText}</div>${!isCorrect ? `<div class="review-option correct">الصحيح: ${correctText}</div>` : ''}${q.explanation ? `<div class="explanation-box">💡 ${q.explanation}</div>` : ''}</div>`; }); document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'block'; }
function toggleTheme() { document.body.classList.toggle('dark-mode'); localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); }
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

// --- Admin Panel ---
window.openDashboard = function() { document.getElementById('main-nav').style.display = 'none'; document.getElementById('source-selection').style.display = 'none'; document.getElementById('quiz-list-area').style.display = 'none'; document.getElementById('dashboard-view').style.display = 'block'; const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {}; let tQ=0, tA=0, tS=0, tP=0; const tbody = document.getElementById('history-table-body'); tbody.innerHTML = ''; Object.entries(historyData).forEach(([key, data]) => { tQ++; tA += data.attempts || 1; tS += data.score; tP += data.total; tbody.innerHTML += `<tr><td>${data.title || key}</td><td>${data.highestScore}</td><td>${data.score}</td><td>${data.attempts || 1}</td></tr>`; }); document.getElementById('total-quizzes-taken').textContent = tQ; document.getElementById('total-attempts').textContent = tA; document.getElementById('total-accuracy').textContent = tP ? Math.round((tS/tP)*100) + '%' : '0%'; };
window.closeDashboard = function() { document.getElementById('dashboard-view').style.display = 'none'; document.getElementById('main-nav').style.display = 'flex'; selectSubject(currentSubject); };
window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; };
window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; };
window.checkAdminPassword = function() { if (document.getElementById('admin-password-input').value === "admin123") { closeAdminLogin(); document.getElementById('main-nav').style.display = 'none'; document.getElementById('source-selection').style.display = 'none'; document.getElementById('quiz-list-area').style.display = 'none'; document.getElementById('admin-dashboard-view').style.display = 'block'; switchAdminTab('results'); } else { alert("خطأ!"); } };
window.closeAdminDashboard = function() { document.getElementById('admin-dashboard-view').style.display = 'none'; document.getElementById('main-nav').style.display = 'flex'; selectSubject(currentSubject); };

window.switchAdminTab = function(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(`admin-tab-${tabName}`).style.display = 'block';
    document.querySelectorAll('#admin-dashboard-view .tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if(tabName === 'content') populateAdminDropdowns();
    if(tabName === 'results') fetchAdminData();
    if(tabName === 'users') fetchAdminUsers();
    if(tabName === 'settings') fetchAdminSettings(); 
};

window.fetchAdminSettings = async function() {
    if(!db) return;
    const doc = await db.collection('settings').doc('config').get();
    const toggle = document.getElementById('strict-mode-toggle');
    if(doc.exists) {
        toggle.checked = doc.data().strictNames;
    } else {
        toggle.checked = true; 
    }
};

window.updateLoginSettings = async function() {
    const isStrict = document.getElementById('strict-mode-toggle').checked;
    try {
        await db.collection('settings').doc('config').set({ strictNames: isStrict }, { merge: true });
    } catch(e) { alert("خطأ في حفظ الإعدادات"); }
};

window.toggleTimeInput = function(show) { document.getElementById('time-limit-input-container').style.display = show ? 'block' : 'none'; };
window.addNewSubject = async function() { const name = document.getElementById('new-subject-name').value; const id = document.getElementById('new-subject-id').value; if(!name || !id) { alert("بيانات ناقصة"); return; } try { await db.collection('subjects').add({ id, name }); alert("تم!"); location.reload(); } catch(e) { alert("خطأ"); } };
window.addNewSource = async function() { const subjectId = document.getElementById('source-subject-select').value; const name = document.getElementById('new-source-name').value; const id = document.getElementById('new-source-id').value; if(!name || !id) { alert("بيانات ناقصة"); return; } try { await db.collection('sources').add({ subjectId, id, name }); alert("تم!"); location.reload(); } catch(e) { alert("خطأ"); } };
window.parseAndSaveExam = async function() { const subjectId = document.getElementById('exam-subject-select').value; const sourceId = document.getElementById('exam-source-select').value; const title = document.getElementById('new-exam-title').value; const timerType = document.querySelector('input[name="timerType"]:checked').value; let timeLimit = (timerType === 'limit') ? (parseInt(document.getElementById('new-exam-time').value) || 0) : 0; const rawText = document.getElementById('raw-exam-text').value; if(!title || !rawText) { alert("الرجاء كتابة البيانات"); return; } const questions = parseQuestionsFromText(rawText); if(questions.length === 0) { document.getElementById('parse-status').textContent = "❌ لا توجد أسئلة"; return; } if(confirm(`حفظ ${questions.length} سؤال؟`)) { try { await db.collection('quizzes').add({ subjectId, sourceId, title, timeLimit, questions, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); alert("تم!"); location.reload(); } catch(e) { alert("خطأ"); } } };
function parseQuestionsFromText(text) { const lines = text.split('\n').filter(l => l.trim()); let questions = []; let currentQ = null; lines.forEach(line => { line = line.trim(); if (line.match(/^(س|Q|\d+)[\.:\/]/) || line.includes('?')) { if (currentQ && currentQ.options.length > 1) questions.push(currentQ); currentQ = { q: line.replace(/^(س|Q|\d+)[\.:\/]\s*/, ''), options: [], a: 0, type: 'mcq' }; } else if (currentQ) { let isCorrect = line.startsWith('*'); let optionText = line.replace(/^[\*\-\)\.]\s*/, '').replace(/^[أ-يa-z][\)\.]\s*/, ''); if (isCorrect) currentQ.a = currentQ.options.length; currentQ.options.push(optionText); } }); if (currentQ && currentQ.options.length > 1) questions.push(currentQ); return questions; }
window.updateDeleteDropdown = async function() { const type = document.getElementById('delete-type-select').value; const itemSelect = document.getElementById('delete-item-select'); itemSelect.innerHTML = ''; if(type === 'none') { itemSelect.style.display = 'none'; return; } itemSelect.style.display = 'block'; if (type === 'subject') { dbSubjects.forEach(sub => { itemSelect.innerHTML += `<option value="${sub.docId}">${sub.name}</option>`; }); if(dbSubjects.length === 0) itemSelect.innerHTML = '<option>لا توجد مواد</option>'; } else if (type === 'source') { dbSources.forEach(src => { itemSelect.innerHTML += `<option value="${src.docId}">${src.name}</option>`; }); if(dbSources.length === 0) itemSelect.innerHTML = '<option>لا توجد مصادر</option>'; } else if (type === 'quiz') { itemSelect.innerHTML = '<option>تحميل...</option>'; if(db) { const snaps = await db.collection('quizzes').get(); itemSelect.innerHTML = ''; if(snaps.empty) { itemSelect.innerHTML = '<option>فارغ</option>'; return; } snaps.forEach(doc => { const q = doc.data(); const subName = q.subjectId || 'عام'; itemSelect.innerHTML += `<option value="${doc.id}">${q.title} (${subName})</option>`; }); } } };
window.deleteSelectedItem = async function() { const type = document.getElementById('delete-type-select').value; const id = document.getElementById('delete-item-select').value; if(type === 'none' || !id) return; if(!confirm("تأكيد الحذف؟")) return; let col = type === 'subject' ? 'subjects' : (type === 'source' ? 'sources' : 'quizzes'); try { await db.collection(col).doc(id).delete(); alert("تم الحذف"); location.reload(); } catch(e) { alert("خطأ: " + e.message); } };
window.fetchAdminUsers = function() { const tbody = document.getElementById('users-table-body'); if (!db) { tbody.innerHTML = '<tr><td colspan="3">Firebase غير مفعل</td></tr>'; return; } tbody.innerHTML = '<tr><td colspan="3">جاري التحميل...</td></tr>'; db.collection("users").orderBy("joinedAt", "desc").get().then((snap) => { tbody.innerHTML = ''; if(snap.empty) { tbody.innerHTML = '<tr><td colspan="3">لا يوجد طلاب</td></tr>'; return; } snap.forEach(doc => { const d = doc.data(); const date = d.joinedAt ? new Date(d.joinedAt.toDate()).toLocaleDateString('ar-EG') : 'غير معروف'; tbody.innerHTML += `<tr><td>${d.name}</td><td>${date}</td><td><button class="btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="deleteOneUser('${doc.id}')">حذف</button></td></tr>`; }); }); };
window.deleteOneUser = function(userId) { if(!confirm(`هل أنت متأكد من حذف الطالب ${userId}؟`)) return; db.collection('users').doc(userId).delete().then(() => { alert("تم حذف الطالب."); fetchAdminUsers(); }).catch(err => alert("خطأ: " + err.message)); };
window.filterUsersTable = function() { const f = document.getElementById("users-search").value.toUpperCase(); const r = document.getElementById("users-table").getElementsByTagName("tr"); for(let i=1;i<r.length;i++) { const td = r[i].getElementsByTagName("td")[0]; if(td) r[i].style.display = td.textContent.toUpperCase().indexOf(f) > -1 ? "" : "none"; } };
window.fetchAdminData = function() { const tbody = document.getElementById('admin-table-body'); if (!db) { tbody.innerHTML = '<tr><td colspan="5">Firebase غير مفعل</td></tr>'; return; } tbody.innerHTML = '<tr><td colspan="5">تحميل...</td></tr>'; db.collection("exam_results").orderBy("timestamp", "desc").limit(100).get().then((snap) => { tbody.innerHTML = ''; if(snap.empty) { tbody.innerHTML = '<tr><td colspan="5">لا توجد نتائج</td></tr>'; return; } snap.forEach(doc => { const d = doc.data(); tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.subject || '-'}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td dir="ltr">${d.date}</td></tr>`; }); }).catch(e => tbody.innerHTML = `<tr><td colspan="5">خطأ: ${e.message}</td></tr>`); };
function populateAdminDropdowns() { const subSelects = [document.getElementById('source-subject-select'), document.getElementById('exam-subject-select')]; subSelects.forEach(s => s.innerHTML = ''); subjectsConfig.forEach(sub => { subSelects.forEach(s => s.innerHTML += `<option value="${sub.id}">${sub.name}</option>`); }); updateSourceSelect(); }
window.updateSourceSelect = async function() { const subId = document.getElementById('exam-subject-select').value; const srcSelect = document.getElementById('exam-source-select'); srcSelect.innerHTML = ''; defaultSources.forEach(s => srcSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`); if(db) { const snap = await db.collection('sources').where('subjectId', '==', subId).get(); snap.forEach(doc => srcSelect.innerHTML += `<option value="${doc.data().id}">${doc.data().name}</option>`); } };
window.adminResetAllResults = function() { if(confirm("حذف الكل؟") && db) db.collection("exam_results").get().then(s => { const b=db.batch(); s.docs.forEach(d=>b.delete(d.ref)); b.commit(); }).then(()=>alert("تم")); };
window.adminDeleteAllUsers = function() { if(confirm("حذف المستخدمين؟") && db) db.collection("users").get().then(s => { const b=db.batch(); s.docs.forEach(d=>b.delete(d.ref)); b.commit(); }).then(()=>alert("تم")); };
window.exportToExcel = function() { const t=document.getElementById("admin-table"); let c="\uFEFF"; t.querySelectorAll("tr").forEach(r=>{ let d=[]; r.querySelectorAll("th,td").forEach(k=>d.push(`"${k.innerText}"`)); c+=d.join(",")+ "\n"; }); const l=document.createElement("a"); l.href=URL.createObjectURL(new Blob([c],{type:"text/csv"})); l.download="Results.csv"; l.click(); };
window.filterAdminTable = function() { const f=document.getElementById("admin-search").value.toUpperCase(); const r=document.getElementById("admin-table").getElementsByTagName("tr"); for(let i=1;i<r.length;i++) { const d=r[i].getElementsByTagName("td")[0]; if(d) r[i].style.display=d.textContent.toUpperCase().indexOf(f)>-1?"":"none"; } };
