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
    console.log("Firebase Connected Successfully ✅");
} catch (e) {
    console.log("Firebase not configured (Local Mode) ⚠️");
}

// --- Global State ---
let currentStudentName = localStorage.getItem('studentName') || "";
let currentSubject = 'microbiology';
let currentSource = ''; 
let currentQuizData = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsElapsed = 0;
let loadedScripts = {}; 

// --- Setup on Load ---
document.addEventListener("DOMContentLoaded", () => {
    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
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
    selectSubject('microbiology'); 
});

// --- User Management ---
function saveStudentName() {
    const nameInput = document.getElementById('student-name-input').value.trim();
    if (nameInput.length < 3) return alert("الاسم قصير جداً");
    currentStudentName = nameInput;
    localStorage.setItem('studentName', currentStudentName);
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
}

// --- Admin Features (New Addition) ---
function addNewQuizFromAdmin() {
    const subject = document.getElementById('admin-sub-select').value;
    const source = document.getElementById('admin-src-select').value;
    const title = document.getElementById('admin-quiz-title').value;
    const content = document.getElementById('admin-quiz-content').value;
    
    if(!title || !content) return alert("يرجى إدخال العنوان والأسئلة");
    
    // Parse Questions
    const questions = parseQuestionsText(content);
    if(questions.length === 0) return alert("تنسيق الأسئلة غير صحيح. تأكد من كتابة س1: ... أ)...");
    
    // Save to LocalStorage
    const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const newId = 'custom_' + Date.now();
    
    customQuizzes.push({
        id: newId,
        subject: subject,
        source: source,
        title: title,
        questions: questions
    });
    
    localStorage.setItem('custom_quizzes', JSON.stringify(customQuizzes));
    
    alert("تم حفظ الامتحان بنجاح ✅");
    document.getElementById('admin-quiz-title').value = '';
    document.getElementById('admin-quiz-content').value = '';
}

function parseQuestionsText(text) {
    const lines = text.split('\n');
    let questions = [];
    let current = null;
    
    lines.forEach(line => {
        line = line.trim();
        if(!line) return;
        
        if(line.match(/^(Q\d+|س\d+|\d+)[:.)]/i) || (line.includes('?') && !current)) {
            if(current) questions.push(current);
            current = { q: line.replace(/^(Q\d+|س\d+|\d+)[:.)]\s*/i, ''), options: [], a: 0, type: 'mcq' };
        } else if(current && line.match(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i)) {
            current.options.push(line.replace(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i, ''));
        } else if(current && line.match(/^(Answer|Correct|الاجابة|الإجابة)[:]\s*/i)) {
            const m = {'a':0,'b':1,'c':2,'d':3,'أ':0,'ب':1,'ج':2,'د':3,'1':0,'2':1,'3':2,'4':3};
            const char = line.split(':')[1].trim().toLowerCase();
            if(m[char] !== undefined) current.a = m[char];
        }
    });
    if(current) questions.push(current);
    return questions;
}

// --- Quiz Logic ---
function selectSubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="selectSubject('${subject}')"]`)?.classList.add('active');
    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function loadQuizSource(source) {
    currentSource = source;
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';
    
    // 1. Load File-based Quizzes (Old Way)
    const scriptPath = `questions/${currentSubject}/${source}.js`;
    let fileQuizzes = {};
    
    // 2. Load Custom Quizzes (New Way)
    const customAll = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const customFiltered = customAll.filter(q => q.subject === currentSubject && q.source === currentSource);
    
    // Combine logic
    loadScript(scriptPath, () => {
        const dataVar = `${currentSubject}_${source}_data`;
        if(window[dataVar]) fileQuizzes = window[dataVar];
        renderCombinedQuizzes(fileQuizzes, customFiltered);
    }, () => {
        renderCombinedQuizzes({}, customFiltered);
    });
}

function renderCombinedQuizzes(fileData, customList) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    
    // Render File Data
    Object.keys(fileData).forEach(key => {
        const quiz = fileData[key];
        const histKey = `${currentSubject}_${currentSource}_${key}`;
        addQuizCard(key, quiz.title, quiz.questions.length, histKey, 'file');
    });
    
    // Render Custom Data
    customList.forEach(quiz => {
        const histKey = `${currentSubject}_${currentSource}_${quiz.id}`;
        addQuizCard(quiz.id, quiz.title, quiz.questions.length, histKey, 'custom');
    });
    
    // Cache data for playing
    currentQuizData = { ...fileData };
    customList.forEach(q => currentQuizData[q.id] = q);
    
    if(container.innerHTML === '') container.innerHTML = '<p class="coming-soon">لا يوجد محتوى</p>';
}

function addQuizCard(key, title, count, histKey, type) {
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let badgeHtml = savedHistory[histKey] ? `<div class="history-badge">✅ ${savedHistory[histKey].score}</div>` : '';
    let badgeType = type === 'custom' ? '<span style="font-size:0.8rem; color:green;">(مضاف يدوياً)</span>' : '';
    
    document.getElementById('dynamic-cards-container').innerHTML += `
        <div class="quiz-card" onclick="startQuiz('${key}', '${title}')">
            ${badgeHtml}
            <h3>${title} ${badgeType}</h3>
            <p>${count} سؤال</p>
            <button class="start-btn">ابدأ</button>
        </div>`;
}

function startQuiz(key, title) {
    const quiz = currentQuizData[key];
    window.currentQuizKey = key;
    window.currentQuizTitle = title;
    currentQuiz = quiz.questions; // Shuffle removed for simplicity in custom quizzes
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById("current-quiz-title").textContent = title;
    
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById("quiz-timer").textContent = `${m}:${s}`;
    }, 1000);
    
    displayQuestion();
    updateNavigation();
}

function displayQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    const container = document.getElementById("question-container");
    const uAns = userAnswers[currentQuestionIndex];
    
    let optionsHtml = `<div class="answer-options">` + 
        q.options.map((opt, i) => `
            <button class="answer-btn ${uAns?.answer === i ? 'selected' : ''}" 
                    onclick="selectOption(${i})">${opt}</button>
        `).join('') + `</div>`;

    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div>
            <div class="question-text">${q.q}</div>
            ${optionsHtml}
        </div>`;
    
    document.getElementById("progress-fill").style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
    document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

function selectOption(val) {
    userAnswers[currentQuestionIndex] = { answer: val, isCorrect: val === currentQuiz[currentQuestionIndex].a };
    displayQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        finishQuiz();
    }
    updateNavigation();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
    updateNavigation();
}

function updateNavigation() {
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    // Save Local History
    const hKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const hData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    hData[hKey] = { score: score, total: currentQuiz.length, title: window.currentQuizTitle };
    localStorage.setItem('quizHistory', JSON.stringify(hData));

    // Save to Firebase (if connected)
    if(db) {
        document.getElementById('upload-status').textContent = "جاري رفع النتيجة...";
        db.collection("exam_results").add({
            studentName: currentStudentName,
            subject: currentSubject,
            quizTitle: window.currentQuizTitle,
            score: score,
            total: currentQuiz.length,
            date: new Date().toLocaleString('ar-EG'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('upload-status').textContent = "✅ تم إرسال النتيجة";
            document.getElementById('upload-status').style.color = "green";
        });
    }

    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = score >= currentQuiz.length/2 ? "أحسنت! 👏" : "حاول مرة أخرى 💪";
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function showReview() {
    const container = document.getElementById("review-content");
    container.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const uAns = userAnswers[i];
        const isCorrect = uAns && uAns.isCorrect;
        let correctText = q.options[q.a];
        let userText = uAns ? q.options[uAns.answer] : 'لم يجب';
        
        container.innerHTML += `
            <div class="review-question">
                <div class="question-number">سؤال ${i+1}</div>
                <div class="question-text">${q.q}</div>
                <div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">إجابتك: ${userText}</div>
                ${!isCorrect ? `<div class="review-option correct">الصحيح: ${correctText}</div>` : ''}
            </div>`;
    });
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
}

function backToSources() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
}

function backToQuizList() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
}

function loadScript(src, callback, errorCallback) {
    if (loadedScripts[src]) { if (callback) callback(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { loadedScripts[src] = true; if (callback) callback(); };
    script.onerror = () => { if (errorCallback) errorCallback(); };
    document.head.appendChild(script);
}

// Admin & Dashboard Navigation
function openAdminLogin() { document.getElementById('admin-login-modal').style.display = 'flex'; }
function closeAdminLogin() { document.getElementById('admin-login-modal').style.display = 'none'; }
function checkAdminPassword() {
    if (document.getElementById('admin-password-input').value === "admin123") { 
        closeAdminLogin();
        document.getElementById('main-nav').style.display = 'none';
        document.getElementById('source-selection').style.display = 'none';
        document.getElementById('quiz-list-area').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        fetchAdminData();
    } else { alert("كلمة المرور خاطئة!"); }
}

function openDashboard() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    // Render Stats logic here... (Same as before)
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    let tQ=0, tScore=0, tTotal=0;
    Object.values(historyData).forEach(d => {
        tQ++; tScore+=d.score; tTotal+=d.total;
        tbody.innerHTML += `<tr><td>${d.title}</td><td>${d.score}</td><td>${d.score}</td><td>1</td></tr>`;
    });
    document.getElementById('total-quizzes-taken').textContent = tQ;
    document.getElementById('total-accuracy').textContent = tTotal ? Math.round((tScore/tTotal)*100)+'%' : '0%';
}

function closeDashboard() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
}

function closeAdminDashboard() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
}

function fetchAdminData() {
    const tbody = document.getElementById('admin-table-body');
    if (!db) { tbody.innerHTML = '<tr><td colspan="4">يجب ربط Firebase لرؤية النتائج</td></tr>'; return; }
    tbody.innerHTML = '<tr><td colspan="4">جاري التحميل...</td></tr>';
    db.collection("exam_results").orderBy("timestamp", "desc").limit(20).get().then((snap) => {
        tbody.innerHTML = '';
        snap.forEach((doc) => {
            const d = doc.data();
            tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td>${d.date}</td></tr>`;
        });
    });
      }}

// --- Admin Features (New Addition) ---
function addNewQuizFromAdmin() {
    const subject = document.getElementById('admin-sub-select').value;
    const source = document.getElementById('admin-src-select').value;
    const title = document.getElementById('admin-quiz-title').value;
    const content = document.getElementById('admin-quiz-content').value;
    
    if(!title || !content) return alert("يرجى إدخال العنوان والأسئلة");
    
    // Parse Questions
    const questions = parseQuestionsText(content);
    if(questions.length === 0) return alert("تنسيق الأسئلة غير صحيح. تأكد من كتابة س1: ... أ)...");
    
    // Save to LocalStorage
    const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const newId = 'custom_' + Date.now();
    
    customQuizzes.push({
        id: newId,
        subject: subject,
        source: source,
        title: title,
        questions: questions
    });
    
    localStorage.setItem('custom_quizzes', JSON.stringify(customQuizzes));
    
    alert("تم حفظ الامتحان بنجاح ✅");
    document.getElementById('admin-quiz-title').value = '';
    document.getElementById('admin-quiz-content').value = '';
}

function parseQuestionsText(text) {
    const lines = text.split('\n');
    let questions = [];
    let current = null;
    
    lines.forEach(line => {
        line = line.trim();
        if(!line) return;
        
        if(line.match(/^(Q\d+|س\d+|\d+)[:.)]/i) || (line.includes('?') && !current)) {
            if(current) questions.push(current);
            current = { q: line.replace(/^(Q\d+|س\d+|\d+)[:.)]\s*/i, ''), options: [], a: 0, type: 'mcq' };
        } else if(current && line.match(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i)) {
            current.options.push(line.replace(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i, ''));
        } else if(current && line.match(/^(Answer|Correct|الاجابة|الإجابة)[:]\s*/i)) {
            const m = {'a':0,'b':1,'c':2,'d':3,'أ':0,'ب':1,'ج':2,'د':3,'1':0,'2':1,'3':2,'4':3};
            const char = line.split(':')[1].trim().toLowerCase();
            if(m[char] !== undefined) current.a = m[char];
        }
    });
    if(current) questions.push(current);
    return questions;
}

// --- Quiz Logic ---
function selectSubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="selectSubject('${subject}')"]`)?.classList.add('active');
    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function loadQuizSource(source) {
    currentSource = source;
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';
    
    // 1. Load File-based Quizzes (Old Way)
    const scriptPath = `questions/${currentSubject}/${source}.js`;
    let fileQuizzes = {};
    
    // 2. Load Custom Quizzes (New Way)
    const customAll = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const customFiltered = customAll.filter(q => q.subject === currentSubject && q.source === currentSource);
    
    // Combine logic
    loadScript(scriptPath, () => {
        const dataVar = `${currentSubject}_${source}_data`;
        if(window[dataVar]) fileQuizzes = window[dataVar];
        renderCombinedQuizzes(fileQuizzes, customFiltered);
    }, () => {
        renderCombinedQuizzes({}, customFiltered);
    });
}

function renderCombinedQuizzes(fileData, customList) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    
    // Render File Data
    Object.keys(fileData).forEach(key => {
        const quiz = fileData[key];
        const histKey = `${currentSubject}_${currentSource}_${key}`;
        addQuizCard(key, quiz.title, quiz.questions.length, histKey, 'file');
    });
    
    // Render Custom Data
    customList.forEach(quiz => {
        const histKey = `${currentSubject}_${currentSource}_${quiz.id}`;
        addQuizCard(quiz.id, quiz.title, quiz.questions.length, histKey, 'custom');
    });
    
    // Cache data for playing
    currentQuizData = { ...fileData };
    customList.forEach(q => currentQuizData[q.id] = q);
    
    if(container.innerHTML === '') container.innerHTML = '<p class="coming-soon">لا يوجد محتوى</p>';
}

function addQuizCard(key, title, count, histKey, type) {
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let badgeHtml = savedHistory[histKey] ? `<div class="history-badge">✅ ${savedHistory[histKey].score}</div>` : '';
    let badgeType = type === 'custom' ? '<span style="font-size:0.8rem; color:green;">(مضاف يدوياً)</span>' : '';
    
    document.getElementById('dynamic-cards-container').innerHTML += `
        <div class="quiz-card" onclick="startQuiz('${key}', '${title}')">
            ${badgeHtml}
            <h3>${title} ${badgeType}</h3>
            <p>${count} سؤال</p>
            <button class="start-btn">ابدأ</button>
        </div>`;
}

function startQuiz(key, title) {
    const quiz = currentQuizData[key];
    window.currentQuizKey = key;
    window.currentQuizTitle = title;
    currentQuiz = quiz.questions; // Shuffle removed for simplicity in custom quizzes
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById("current-quiz-title").textContent = title;
    
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById("quiz-timer").textContent = `${m}:${s}`;
    }, 1000);
    
    displayQuestion();
    updateNavigation();
}

function displayQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    const container = document.getElementById("question-container");
    const uAns = userAnswers[currentQuestionIndex];
    
    let optionsHtml = `<div class="answer-options">` + 
        q.options.map((opt, i) => `
            <button class="answer-btn ${uAns?.answer === i ? 'selected' : ''}" 
                    onclick="selectOption(${i})">${opt}</button>
        `).join('') + `</div>`;

    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div>
            <div class="question-text">${q.q}</div>
            ${optionsHtml}
        </div>`;
    
    document.getElementById("progress-fill").style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
    document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

function selectOption(val) {
    userAnswers[currentQuestionIndex] = { answer: val, isCorrect: val === currentQuiz[currentQuestionIndex].a };
    displayQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        finishQuiz();
    }
    updateNavigation();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
    updateNavigation();
}

function updateNavigation() {
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    // Save Local History
    const hKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const hData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    hData[hKey] = { score: score, total: currentQuiz.length, title: window.currentQuizTitle };
    localStorage.setItem('quizHistory', JSON.stringify(hData));

    // Save to Firebase (if connected)
    if(db) {
        document.getElementById('upload-status').textContent = "جاري رفع النتيجة...";
        db.collection("exam_results").add({
            studentName: currentStudentName,
            subject: currentSubject,
            quizTitle: window.currentQuizTitle,
            score: score,
            total: currentQuiz.length,
            date: new Date().toLocaleString('ar-EG'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('upload-status').textContent = "✅ تم إرسال النتيجة";
            document.getElementById('upload-status').style.color = "green";
        });
    }

    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = score >= currentQuiz.length/2 ? "أحسنت! 👏" : "حاول مرة أخرى 💪";
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function showReview() {
    const container = document.getElementById("review-content");
    container.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const uAns = userAnswers[i];
        const isCorrect = uAns && uAns.isCorrect;
        let correctText = q.options[q.a];
        let userText = uAns ? q.options[uAns.answer] : 'لم يجب';
        
        container.innerHTML += `
            <div class="review-question">
                <div class="question-number">سؤال ${i+1}</div>
                <div class="question-text">${q.q}</div>
                <div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">إجابتك: ${userText}</div>
                ${!isCorrect ? `<div class="review-option correct">الصحيح: ${correctText}</div>` : ''}
            </div>`;
    });
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
}

function backToSources() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
}

function backToQuizList() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
}

function loadScript(src, callback, errorCallback) {
    if (loadedScripts[src]) { if (callback) callback(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { loadedScripts[src] = true; if (callback) callback(); };
    script.onerror = () => { if (errorCallback) errorCallback(); };
    document.head.appendChild(script);
}

// Admin & Dashboard Navigation
function openAdminLogin() { document.getElementById('admin-login-modal').style.display = 'flex'; }
function closeAdminLogin() { document.getElementById('admin-login-modal').style.display = 'none'; }
function checkAdminPassword() {
    if (document.getElementById('admin-password-input').value === "admin123") { 
        closeAdminLogin();
        document.getElementById('main-nav').style.display = 'none';
        document.getElementById('source-selection').style.display = 'none';
        document.getElementById('quiz-list-area').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        fetchAdminData();
    } else { alert("كلمة المرور خاطئة!"); }
}

function openDashboard() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    // Render Stats logic here... (Same as before)
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    let tQ=0, tScore=0, tTotal=0;
    Object.values(historyData).forEach(d => {
        tQ++; tScore+=d.score; tTotal+=d.total;
        tbody.innerHTML += `<tr><td>${d.title}</td><td>${d.score}</td><td>${d.score}</td><td>1</td></tr>`;
    });
    document.getElementById('total-quizzes-taken').textContent = tQ;
    document.getElementById('total-accuracy').textContent = tTotal ? Math.round((tScore/tTotal)*100)+'%' : '0%';
}

function closeDashboard() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
}

function closeAdminDashboard() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
}

function fetchAdminData() {
    const tbody = document.getElementById('admin-table-body');
    if (!db) { tbody.innerHTML = '<tr><td colspan="4">يجب ربط Firebase لرؤية النتائج</td></tr>'; return; }
    tbody.innerHTML = '<tr><td colspan="4">جاري التحميل...</td></tr>';
    db.collection("exam_results").orderBy("timestamp", "desc").limit(20).get().then((snap) => {
        tbody.innerHTML = '';
        snap.forEach((doc) => {
            const d = doc.data();
            tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td>${d.date}</td></tr>`;
        });
    });
}
