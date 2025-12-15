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

// --- Global Variables ---
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

// Auth Data
let currentStudentName = localStorage.getItem('studentName') || "";
let currentUsername = localStorage.getItem('studentUsername') || "";

// Quiz Data
let currentSubject = subjectsConfig[0].id; 
let currentSource = ''; 
let currentQuizData = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsRemaining = 0;
let isTimerDown = false; 

// Advanced Quiz Settings State
let currentQuizSettings = {
    preventBack: false,
    showResult: true,
    oneTime: false
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
    
    // ✅ FIX: Apply Dark Mode FIRST (Before checking login or DB)
    // هذا هو التعديل: وضعنا الكود في البداية لضمان عدم وميض اللون الأبيض
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('theme-toggle');
        if(toggleBtn) toggleBtn.textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // 1. Check Admin Session
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('main-nav').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        switchAdminTab(localStorage.getItem('lastAdminTab') || 'results');
    } 
    // 2. Check Student Login
    else if (currentUsername && currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('welcome-message').innerHTML = `أهلاً بك يا دكتور/ة <b>${currentStudentName}</b> 👋`;
        // We verify status in background to not block UI
        verifyUserStatus(); 
    } else {
        document.getElementById('welcome-modal').style.display = 'flex';
        toggleAuthView('login');
    }

    // 3. Load Content & Features
    // Added try-catch to prevent errors from stopping the script
    try {
        await fetchDynamicContent();
        generateSubjectTabs();
        initNotificationListener(); 
    } catch (e) {
        console.error("Error loading content:", e);
    }
    
    // 4. Event Listeners
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });
});

// --- Notification System ---
function initNotificationListener() {
    if(!db) return;
    db.collection('settings').doc('notification').onSnapshot((doc) => {
        if(doc.exists) {
            const data = doc.data();
            if(!data || !data.text || !data.timestamp) return;

            // Check time (2 minutes = 120,000 ms)
            const notifTime = data.timestamp.toDate().getTime();
            const now = new Date().getTime();
            const timeDiff = now - notifTime;
            const twoMinutes = 2 * 60 * 1000;

            if(timeDiff < twoMinutes) {
                showNotificationBar(data.text, twoMinutes - timeDiff);
            }
        }
    });
}

function showNotificationBar(text, duration) {
    const bar = document.getElementById('top-notification-bar');
    if(!bar) return;
    document.getElementById('notification-text').textContent = text;
    bar.style.display = 'block';

    // Auto hide after remaining time
    setTimeout(() => {
        bar.style.display = 'none';
    }, duration);
}

window.closeNotification = function() {
    document.getElementById('top-notification-bar').style.display = 'none';
};

// Admin Post Notification
window.postNotification = async function() {
    const text = document.getElementById('admin-notif-text').value;
    if(!text) { alert("اكتب نص الإشعار"); return; }
    
    try {
        await db.collection('settings').doc('notification').set({
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("✅ تم نشر الإشعار، سيظهر للطلاب لمدة دقيقتين.");
        document.getElementById('admin-notif-text').value = "";
    } catch(e) { alert("خطأ: " + e.message); }
};

// --- Auth Functions ---
window.toggleAuthView = function(view) {
    const errorP = document.getElementById('auth-error');
    errorP.style.display = 'none';
    
    if (view === 'signup') {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('signup-view').style.display = 'block';
    } else {
        document.getElementById('signup-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'block';
    }
}

window.registerUser = async function() {
    const fullname = document.getElementById('signup-fullname').value.trim();
    let username = document.getElementById('signup-username').value.trim().toLowerCase();
    
    if (fullname.split(" ").length < 3) { showError("❌ يرجى كتابة الاسم الثلاثي على الأقل."); return; }
    if (username.length < 3 || !/^[a-z0-9_]+$/.test(username)) { showError("❌ اسم المستخدم يجب أن يكون إنجليزي (حروف وأرقام) وبدون مسافات."); return; }
    if (!db) { showError("⚠️ الاتصال بقاعدة البيانات غير متوفر."); return; }
    showError("⏳ جاري إنشاء الحساب...", "blue");

    try {
        const userDocRef = db.collection('users').doc(username);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) { showError("❌ اسم المستخدم هذا مستخدم بالفعل، اختر اسماً آخر."); return; }

        await userDocRef.set({ name: fullname, username: username, joinedAt: firebase.firestore.FieldValue.serverTimestamp() });
        completeLogin(username, fullname);
    } catch (e) { console.error(e); showError("حدث خطأ غير متوقع."); }
};

window.loginUser = async function() {
    let username = document.getElementById('login-username').value.trim().toLowerCase();
    if (!username) { showError("❌ اكتب اسم المستخدم"); return; }
    if (!db) { showError("⚠️ الاتصال بقاعدة البيانات غير متوفر."); return; }
    showError("⏳ جاري التحقق...", "blue");

    try {
        const userDocRef = db.collection('users').doc(username);
        const docSnap = await userDocRef.get();
        if (!docSnap.exists) { showError("❌ اسم المستخدم غير موجود. هل قمت بإنشاء حساب؟"); return; }
        completeLogin(username, docSnap.data().name);
    } catch (e) { console.error(e); showError("خطأ في الاتصال."); }
};

function showError(msg, color="red") { const el = document.getElementById('auth-error'); el.textContent = msg; el.style.color = color; el.style.display = 'block'; }
function completeLogin(username, fullname) { localStorage.setItem('studentUsername', username); localStorage.setItem('studentName', fullname); location.reload(); }
async function verifyUserStatus() { if (!db || !currentUsername) return; try { const userDoc = await db.collection('users').doc(currentUsername).get(); if (!userDoc.exists) logout(); } catch (e) { console.log(e); } }
window.logout = function() { if(confirm("تسجيل خروج؟")) { localStorage.removeItem('studentName'); localStorage.removeItem('studentUsername'); location.reload(); } };

// --- Content Loading ---
async function fetchDynamicContent() {
    if (!db) return;
    try {
        const subsSnap = await db.collection('subjects').get();
        dbSubjects = []; 
        subsSnap.forEach(doc => { const data = doc.data(); dbSubjects.push({ docId: doc.id, ...data }); if (!subjectsConfig.find(s => s.id === data.id)) subjectsConfig.push(data); });
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
    if (db) { const customSrcSnap = await db.collection('sources').where('subjectId', '==', subjectId).get(); customSrcSnap.forEach(doc => renderSourceCard(doc.data(), sourceContainer)); }

    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    
    // Hide Admin View if it was open via persistence logic
    if(localStorage.getItem('adminLoggedIn') !== 'true') {
        document.getElementById('admin-dashboard-view').style.display = 'none';
    }
}

function renderSourceCard(src, container) {
    const div = document.createElement('div');
    div.className = `source-card ${src.id === 'doctor' ? 'doctor-card' : ''}`;
    div.innerHTML = `<h3>${src.name}</h3><p>${src.desc || ''}</p>`;
    div.onclick = () => loadQuizSource(src.id, src.name);
    container.appendChild(div);
}

window.backToSources = function() { document.getElementById('quiz-list-area').style.display = 'none'; document.getElementById('source-selection').style.display = 'flex'; };

async function loadQuizSource(sourceId, sourceName) {
    currentSource = sourceId;
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('source-title-display').textContent = `📂 ${sourceName}`;
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">جاري البحث عن كويزات...</p>';

    let allQuizzes = {};
    // Load local JS files
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

    // Load Firebase Quizzes
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
    if (keys.length === 0) { container.innerHTML = '<p class="coming-soon">لا توجد اختبارات مضافة هنا بعد.</p>'; return; }

    keys.forEach(quizKey => {
        const quiz = data[quizKey];
        const historyKey = `${currentUsername}_${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        let badgeHtml = savedHistory[historyKey] ? `<div class="history-badge">✅ ${savedHistory[historyKey].score}/${savedHistory[historyKey].total}</div>` : '';
        
        let timeBadge = '';
        if (quiz.timeLimit && quiz.timeLimit > 0) timeBadge = `<span style="font-size:0.8rem; background:#fecaca; padding:2px 8px; border-radius:10px; color:#b91c1c;">⏳ ${quiz.timeLimit} دقيقة</span>`;
        else timeBadge = `<span style="font-size:0.8rem; background:#dcfce7; padding:2px 8px; border-radius:10px; color:#15803d;">⏱️ مفتوح</span>`;

        // Check availability (Date)
        let isAvailable = true;
        let lockMessage = "";
        const now = new Date();
        if(quiz.startDate && new Date(quiz.startDate) > now) { isAvailable = false; lockMessage = "🔒 لم يبدأ بعد"; }
        if(quiz.endDate && new Date(quiz.endDate) < now) { isAvailable = false; lockMessage = "🔒 انتهى الوقت"; }

        // Check one-time attempt
        if(quiz.oneTime && savedHistory[historyKey]) { isAvailable = false; lockMessage = "🔒 محاولة واحدة فقط"; }

        const clickAction = isAvailable ? `onclick="startQuiz('${quizKey}')"` : `onclick="alert('${lockMessage}')" style="opacity:0.6; cursor:not-allowed;"`;

        container.innerHTML += `
            <div class="quiz-card" ${clickAction}>
                ${badgeHtml}
                <h3>${quiz.title}</h3>
                <div style="display:flex; justify-content:center; gap:10px; margin-bottom:10px;">
                    <span>📝 ${quiz.questions.length} سؤال</span>
                    ${timeBadge}
                </div>
                ${!isAvailable ? `<p style="color:red; font-weight:bold;">${lockMessage}</p>` : '<button class="start-btn">ابدأ</button>'}
            </div>`;
    });
    currentQuizData = data;
}

// --- NEW: Advanced Start Quiz Logic ---
function startQuiz(quizKey) {
    const quiz = currentQuizData[quizKey];
    if (!quiz) return;

    // Apply Settings
    currentQuizSettings = {
        preventBack: quiz.preventBack || false,
        showResult: quiz.showResult !== false, // Default true
        oneTime: quiz.oneTime || false
    };

    window.currentQuizKey = quizKey;
    window.currentQuizTitle = quiz.title;
    
    // Shuffle Logic
    let qList = [...quiz.questions];
    if(quiz.shuffleQuestions) qList = shuffleArray(qList);
    currentQuiz = qList;

    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById("current-quiz-title").textContent = quiz.title;
    
    if (timerInterval) clearInterval(timerInterval);
    
    // Timer Logic
    const exitBtn = document.querySelector('#quiz-container .back-btn');
    const timeLimit = quiz.timeLimit || 0;
    
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
    
    // Save History
    const historyKey = `${currentUsername}_${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let entry = historyData[historyKey] || { score: 0, total: currentQuiz.length, highestScore: 0, attempts: 0, title: window.currentQuizTitle };
    entry.score = score; entry.total = currentQuiz.length; entry.title = window.currentQuizTitle;
    entry.attempts = (entry.attempts || 0) + 1;
    entry.highestScore = Math.max(entry.highestScore || 0, score);
    historyData[historyKey] = entry;
    localStorage.setItem('quizHistory', JSON.stringify(historyData));
    
    saveScoreToFirebase(score, currentQuiz.length);
    
    // Handle Show Result Setting
    if (currentQuizSettings.showResult) {
        document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
        document.getElementById("score-message").textContent = timeOut ? "⏰ انتهى الوقت!" : (score === currentQuiz.length ? "ممتاز! 🌟" : "جيد، حاول مرة أخرى");
        document.getElementById('review-btn').style.display = 'inline-block';
    } else {
        document.getElementById("final-score").textContent = "✅";
        document.getElementById("score-message").textContent = "تم استلام إجاباتك بنجاح.";
        document.getElementById('review-btn').style.display = 'none';
    }
    
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
function prevQuestion() { 
    // Check setting
    if(currentQuizSettings.preventBack) return;
    if (currentQuestionIndex > 0) { currentQuestionIndex--; displayQuestion(); updateNavigation(); } 
}

function updateNavigation() { 
    const prevBtn = document.getElementById("prev-btn");
    prevBtn.disabled = currentQuestionIndex === 0 || currentQuizSettings.preventBack;
    if(currentQuizSettings.preventBack) prevBtn.style.opacity = "0.5";
    else prevBtn.style.opacity = "1";
    
    document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي"; 
}

function backToQuizList() { clearInterval(timerInterval); document.getElementById('quiz-container').style.display = 'none'; document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'none'; document.getElementById('quiz-list-area').style.display = 'block'; if (currentQuizData) renderQuizCards(currentQuizData); window.onbeforeunload = null; }

function saveScoreToFirebase(score, total) {
    if (!db || !currentUsername) return;
    db.collection("exam_results").add({
        studentName: currentStudentName,
        username: currentUsername,
        subject: currentSubject,
        quizTitle: window.currentQuizTitle,
        score: score,
        total: total,
        percentage: Math.round((score/total)*100),
        date: new Date().toLocaleString('ar-EG'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => document.getElementById('upload-status').textContent = "✅ تم الحفظ");
}

function showReview() { 
    if(!currentQuizSettings.showResult) return; 
    const container = document.getElementById("review-content"); container.innerHTML = ''; currentQuiz.forEach((q, i) => { const uAns = userAnswers[i]; const isCorrect = uAns && uAns.isCorrect; let correctText = q.type === 'tf' ? (q.a ? 'True' : 'False') : q.options[q.a]; let userText = uAns ? (q.type === 'tf' ? (uAns.answer ? 'True' : 'False') : q.options[uAns.answer]) : 'لم يجب'; container.innerHTML += `<div class="review-question"><div class="question-number">س ${i+1}</div><div class="question-text">${q.q}</div><div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">إجابتك: ${userText}</div>${!isCorrect ? `<div class="review-option correct">الصحيح: ${correctText}</div>` : ''}${q.explanation ? `<div class="explanation-box">💡 ${q.explanation}</div>` : ''}</div>`; }); document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'block'; 
}
function toggleTheme() { 
    document.body.classList.toggle('dark-mode'); 
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); 
    const toggleBtn = document.getElementById('theme-toggle');
    if(toggleBtn) toggleBtn.textContent = isDark ? '☀️' : '🌙';
}
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

// --- Admin Panel (Updated with Session Persistence) ---
window.openDashboard = function() { document.getElementById('main-nav').style.display = 'none'; document.getElementById('source-selection').style.display = 'none'; document.getElementById('quiz-list-area').style.display = 'none'; document.getElementById('dashboard-view').style.display = 'block'; const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {}; let tQ=0, tA=0, tS=0, tP=0; const tbody = document.getElementById('history-table-body'); tbody.innerHTML = ''; Object.entries(historyData).forEach(([key, data]) => { tQ++; tA += data.attempts || 1; tS += data.score; tP += data.total; tbody.innerHTML += `<tr><td>${data.title || key}</td><td>${data.highestScore}</td><td>${data.score}</td><td>${data.attempts || 1}</td></tr>`; }); document.getElementById('total-quizzes-taken').textContent = tQ; document.getElementById('total-attempts').textContent = tA; document.getElementById('total-accuracy').textContent = tP ? Math.round((tS/tP)*100) + '%' : '0%'; };
window.closeDashboard = function() { document.getElementById('dashboard-view').style.display = 'none'; document.getElementById('main-nav').style.display = 'flex'; selectSubject(currentSubject); };

window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; };
window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; };

window.checkAdminPassword = function() { 
    if (document.getElementById('admin-password-input').value === "admin123") { 
        closeAdminLogin(); 
        
        // Save Session
        localStorage.setItem('adminLoggedIn', 'true');
        
        document.getElementById('main-nav').style.display = 'none'; 
        document.getElementById('source-selection').style.display = 'none'; 
        document.getElementById('quiz-list-area').style.display = 'none'; 
        document.getElementById('admin-dashboard-view').style.display = 'block'; 
        switchAdminTab('results'); 
    } else { 
        alert("خطأ!"); 
    } 
};

window.logoutAdmin = function() {
    if(confirm("تسجيل خروج من لوحة المشرف؟")) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('lastAdminTab');
        location.reload();
    }
};

// --- Updated: Tab Switcher with Persistence ---
window.switchAdminTab = function(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(`admin-tab-${tabName}`).style.display = 'block';
    
    document.querySelectorAll('#admin-dashboard-view .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.includes(getTabTitle(tabName))) btn.classList.add('active'); // loose match
    });
    
    // Save current tab
    localStorage.setItem('lastAdminTab', tabName);

    if(tabName === 'content') populateAdminDropdowns();
    if(tabName === 'results') fetchAdminData();
    if(tabName === 'users') fetchAdminUsers();
};

function getTabTitle(tab) {
    const map = { 'results': 'النتائج', 'users': 'الطلاب', 'content': 'المحتوى', 'settings': 'الإعدادات' };
    return map[tab] || '';
}


window.toggleTimeInput = function(show) { document.getElementById('time-limit-input-container').style.display = show ? 'block' : 'none'; };
window.addNewSubject = async function() { const name = document.getElementById('new-subject-name').value; const id = document.getElementById('new-subject-id').value; if(!name || !id) { alert("بيانات ناقصة"); return; } try { await db.collection('subjects').add({ id, name }); alert("تم!"); location.reload(); } catch(e) { alert("خطأ"); } };
window.addNewSource = async function() { const subjectId = document.getElementById('source-subject-select').value; const name = document.getElementById('new-source-name').value; const id = document.getElementById('new-source-id').value; if(!name || !id) { alert("بيانات ناقصة"); return; } try { await db.collection('sources').add({ subjectId, id, name }); alert("تم!"); location.reload(); } catch(e) { alert("خطأ"); } };

// --- NEW: Visual Editor & Final Save Logic ---

// 1. Switch Editor Modes
window.switchEditorMode = function(mode) {
    document.querySelectorAll('.editor-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.editor-content').forEach(c => c.style.display = 'none');
    
    if (mode === 'text') {
        document.getElementById('tab-text-mode').classList.add('active');
        document.getElementById('editor-text-mode').style.display = 'block';
    } else {
        document.getElementById('tab-visual-mode').classList.add('active');
        document.getElementById('editor-visual-mode').style.display = 'block';
    }
};

// 2. Convert Logic
window.convertAndSwitchToVisual = function() {
    const rawText = document.getElementById('raw-exam-text').value;
    const questions = parseQuestionsFromText(rawText);
    renderVisualEditor(questions);
    switchEditorMode('visual');
};

// 3. Render Visual Cards
function renderVisualEditor(questions) {
    const container = document.getElementById('visual-questions-container');
    container.innerHTML = '';
    
    questions.forEach((q, i) => {
        container.appendChild(createVisualQuestionElement(q, i));
    });
}

function createVisualQuestionElement(q = {q:'', options:['','','',''], a:0}, index) {
    const div = document.createElement('div');
    div.className = 'visual-question-card';
    div.dataset.index = index;
    
    div.innerHTML = `
        <div class="vq-header">
            <span>سؤال ${index + 1}</span>
            <button class="btn-danger" style="padding:2px 8px; font-size:0.8rem" onclick="deleteVisualQuestion(this)">حذف</button>
        </div>
        <div class="vq-input-group">
            <input type="text" class="vq-q-text" value="${q.q}" placeholder="نص السؤال">
        </div>
        <div class="vq-options-grid">
            <input type="text" class="vq-opt" data-idx="0" value="${q.options[0] || ''}" placeholder="خيار أ">
            <input type="text" class="vq-opt" data-idx="1" value="${q.options[1] || ''}" placeholder="خيار ب">
            <input type="text" class="vq-opt" data-idx="2" value="${q.options[2] || ''}" placeholder="خيار ج">
            <input type="text" class="vq-opt" data-idx="3" value="${q.options[3] || ''}" placeholder="خيار د">
        </div>
        <div class="vq-input-group">
            <select class="vq-correct-select">
                <option value="0" ${q.a == 0 ? 'selected' : ''}>الإجابة الصحيحة: أ</option>
                <option value="1" ${q.a == 1 ? 'selected' : ''}>الإجابة الصحيحة: ب</option>
                <option value="2" ${q.a == 2 ? 'selected' : ''}>الإجابة الصحيحة: ج</option>
                <option value="3" ${q.a == 3 ? 'selected' : ''}>الإجابة الصحيحة: د</option>
            </select>
        </div>
    `;
    return div;
}

window.addVisualQuestion = function() {
    const container = document.getElementById('visual-questions-container');
    const index = container.children.length;
    container.appendChild(createVisualQuestionElement(undefined, index));
};

window.deleteVisualQuestion = function(btn) {
    btn.closest('.visual-question-card').remove();
    // Re-index titles
    document.querySelectorAll('.visual-question-card').forEach((card, i) => {
        card.querySelector('.vq-header span').textContent = `سؤال ${i+1}`;
    });
};

// 4. Gather Data from Visual Editor
function gatherVisualData() {
    const cards = document.querySelectorAll('.visual-question-card');
    let questions = [];
    
    cards.forEach(card => {
        const qText = card.querySelector('.vq-q-text').value.trim();
        const opts = Array.from(card.querySelectorAll('.vq-opt')).map(i => i.value.trim());
        const correct = parseInt(card.querySelector('.vq-correct-select').value);
        
        if (qText && opts[0] && opts[1]) {
            questions.push({
                q: qText,
                options: opts.filter(o => o), // Remove empty options
                a: correct,
                type: 'mcq'
            });
        }
    });
    return questions;
}

// 5. Final Save Function (Replaces parseAndSaveExam)
window.saveExamFinal = async function() {
    const subjectId = document.getElementById('exam-subject-select').value;
    const sourceId = document.getElementById('exam-source-select').value;
    const title = document.getElementById('new-exam-title').value;
    
    // Time & Advanced Settings
    const startDate = document.getElementById('exam-start-date').value || null;
    const endDate = document.getElementById('exam-end-date').value || null;
    const timeLimit = parseInt(document.getElementById('new-exam-time').value) || 0;
    
    const oneTime = document.getElementById('setting-one-time').checked;
    const shuffleQ = document.getElementById('setting-shuffle-q').checked;
    const preventBack = document.getElementById('setting-prevent-back').checked;
    const showResult = document.getElementById('setting-show-result').checked;

    if (!title) { alert("يرجى كتابة عنوان الامتحان"); return; }

    // Decide source of questions (Visual Editor is Primary now if visible)
    let questions = [];
    if (document.getElementById('editor-visual-mode').style.display !== 'none') {
        questions = gatherVisualData();
    } else {
        // If user stayed in Text mode, convert now
        const rawText = document.getElementById('raw-exam-text').value;
        questions = parseQuestionsFromText(rawText);
    }

    if (questions.length === 0) { alert("⚠️ لا توجد أسئلة صالحة للحفظ!"); return; }

    if (confirm(`حفظ الامتحان (${questions.length} سؤال)؟`)) {
        try {
            await db.collection('quizzes').add({
                subjectId, sourceId, title, timeLimit,
                questions,
                startDate, endDate,
                oneTime, shuffleQuestions: shuffleQ, preventBack, showResult,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("✅ تم حفظ الامتحان بنجاح!");
            location.reload();
        } catch (e) {
            alert("خطأ في الحفظ: " + e.message);
        }
    }
};

function parseQuestionsFromText(text) { const lines = text.split('\n').filter(l => l.trim()); let questions = []; let currentQ = null; lines.forEach(line => { line = line.trim(); if (line.match(/^(س|Q|\d+)[\.:\/]/) || line.includes('?')) { if (currentQ && currentQ.options.length > 1) questions.push(currentQ); currentQ = { q: line.replace(/^(س|Q|\d+)[\.:\/]\s*/, ''), options: [], a: 0, type: 'mcq' }; } else if (currentQ) { let isCorrect = line.startsWith('*'); let optionText = line.replace(/^[\*\-\)\.]\s*/, '').replace(/^[أ-يa-z][\)\.]\s*/, ''); if (isCorrect) currentQ.a = currentQ.options.length; currentQ.options.push(optionText); } }); if (currentQ && currentQ.options.length > 1) questions.push(currentQ); return questions; }

// --- Delete & Admin Utils ---
window.updateDeleteDropdown = async function() { const type = document.getElementById('delete-type-select').value; const itemSelect = document.getElementById('delete-item-select'); itemSelect.innerHTML = ''; if(type === 'none') { itemSelect.style.display = 'none'; return; } itemSelect.style.display = 'block'; if (type === 'subject') { dbSubjects.forEach(sub => { itemSelect.innerHTML += `<option value="${sub.docId}">${sub.name}</option>`; }); if(dbSubjects.length === 0) itemSelect.innerHTML = '<option>لا توجد مواد</option>'; } else if (type === 'source') { dbSources.forEach(src => { itemSelect.innerHTML += `<option value="${src.docId}">${src.name}</option>`; }); if(dbSources.length === 0) itemSelect.innerHTML = '<option>لا توجد مصادر</option>'; } else if (type === 'quiz') { itemSelect.innerHTML = '<option>تحميل...</option>'; if(db) { const snaps = await db.collection('quizzes').get(); itemSelect.innerHTML = ''; if(snaps.empty) { itemSelect.innerHTML = '<option>فارغ</option>'; return; } snaps.forEach(doc => { const q = doc.data(); const subName = q.subjectId || 'عام'; itemSelect.innerHTML += `<option value="${doc.id}">${q.title} (${subName})</option>`; }); } } };
window.deleteSelectedItem = async function() { const type = document.getElementById('delete-type-select').value; const id = document.getElementById('delete-item-select').value; if(type === 'none' || !id) return; if(!confirm("تأكيد الحذف؟")) return; let col = type === 'subject' ? 'subjects' : (type === 'source' ? 'sources' : 'quizzes'); try { await db.collection(col).doc(id).delete(); alert("تم الحذف"); location.reload(); } catch(e) { alert("خطأ: " + e.message); } };

window.fetchAdminUsers = function() { const tbody = document.getElementById('users-table-body'); if (!db) { tbody.innerHTML = '<tr><td colspan="3">Firebase غير مفعل</td></tr>'; return; } tbody.innerHTML = '<tr><td colspan="3">جاري التحميل...</td></tr>'; db.collection("users").orderBy("joinedAt", "desc").get().then((snap) => { tbody.innerHTML = ''; if(snap.empty) { tbody.innerHTML = '<tr><td colspan="3">لا يوجد طلاب</td></tr>'; return; } snap.forEach(doc => { const d = doc.data(); const date = d.joinedAt ? new Date(d.joinedAt.toDate()).toLocaleDateString('ar-EG') : 'غير معروف'; const userInfo = `<div>${d.name}</div><div style="font-size:0.85rem; color:#64748b; font-family:monospace;">@${doc.id}</div>`; tbody.innerHTML += `<tr><td>${userInfo}</td><td>${date}</td><td><button class="btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="deleteOneUser('${doc.id}')">حذف</button></td></tr>`; }); }); };
window.deleteOneUser = function(userId) { if(!confirm(`هل أنت متأكد من حذف الطالب @${userId}؟`)) return; db.collection('users').doc(userId).delete().then(() => { alert("تم حذف الطالب."); fetchAdminUsers(); }).catch(err => alert("خطأ: " + err.message)); };
window.filterUsersTable = function() { const f = document.getElementById("users-search").value.toUpperCase(); const r = document.getElementById("users-table").getElementsByTagName("tr"); for(let i=1;i<r.length;i++) { const td = r[i].getElementsByTagName("td")[0]; if(td) r[i].style.display = td.textContent.toUpperCase().indexOf(f) > -1 ? "" : "none"; } };
window.fetchAdminData = function() { const tbody = document.getElementById('admin-table-body'); if (!db) { tbody.innerHTML = '<tr><td colspan="5">Firebase غير مفعل</td></tr>'; return; } tbody.innerHTML = '<tr><td colspan="5">تحميل...</td></tr>'; db.collection("exam_results").orderBy("timestamp", "desc").limit(100).get().then((snap) => { tbody.innerHTML = ''; if(snap.empty) { tbody.innerHTML = '<tr><td colspan="5">لا توجد نتائج</td></tr>'; return; } snap.forEach(doc => { const d = doc.data(); const nameDisplay = d.username ? `${d.studentName} <span style="font-size:0.8rem; color:gray">(${d.username})</span>` : d.studentName; tbody.innerHTML += `<tr><td>${nameDisplay}</td><td>${d.subject || '-'}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td dir="ltr">${d.date}</td></tr>`; }); }).catch(e => tbody.innerHTML = `<tr><td colspan="5">خطأ: ${e.message}</td></tr>`); };

function populateAdminDropdowns() { const subSelects = [document.getElementById('source-subject-select'), document.getElementById('exam-subject-select')]; subSelects.forEach(s => s.innerHTML = ''); subjectsConfig.forEach(sub => { subSelects.forEach(s => s.innerHTML += `<option value="${sub.id}">${sub.name}</option>`); }); updateSourceSelect(); }
window.updateSourceSelect = async function() { const subId = document.getElementById('exam-subject-select').value; const srcSelect = document.getElementById('exam-source-select'); srcSelect.innerHTML = ''; defaultSources.forEach(s => srcSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`); if(db) { const snap = await db.collection('sources').where('subjectId', '==', subId).get(); snap.forEach(doc => srcSelect.innerHTML += `<option value="${doc.data().id}">${doc.data().name}</option>`); } };
window.adminResetAllResults = function() { if(confirm("حذف الكل؟") && db) db.collection("exam_results").get().then(s => { const b=db.batch(); s.docs.forEach(d=>b.delete(d.ref)); b.commit(); }).then(()=>alert("تم")); };
window.adminDeleteAllUsers = function() { if(confirm("حذف المستخدمين؟") && db) db.collection("users").get().then(s => { const b=db.batch(); s.docs.forEach(d=>b.delete(d.ref)); b.commit(); }).then(()=>alert("تم")); };
window.exportToExcel = function() { const t=document.getElementById("admin-table"); let c="\uFEFF"; t.querySelectorAll("tr").forEach(r=>{ let d=[]; r.querySelectorAll("th,td").forEach(k=>d.push(`"${k.innerText}"`)); c+=d.join(",")+ "\n"; }); const l=document.createElement("a"); l.href=URL.createObjectURL(new Blob([c],{type:"text/csv"})); l.download="Results.csv"; l.click(); };
window.filterAdminTable = function() { const f=document.getElementById("admin-search").value.toUpperCase(); const r=document.getElementById("admin-table").getElementsByTagName("tr"); for(let i=1;i<r.length;i++) { const d=r[i].getElementsByTagName("td")[0]; if(d) r[i].style.display=d.textContent.toUpperCase().indexOf(f)>-1?"":"none"; } };
