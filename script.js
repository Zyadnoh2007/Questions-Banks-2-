// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCzv8U8Syd71OK5uXF7MbOTdT77jXldWqE",
  authDomain: "nursing-quiz-63de2.firebaseapp.com",
  projectId: "nursing-quiz-63de2",
  storageBucket: "nursing-quiz-63de2.firebasestorage.app",
  messagingSenderId: "135091277588",
  appId: "1:135091277588:web:388ed4c31b8b11693cbc01"
};

// تهيئة Firebase
let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Connected Successfully ✅");
} catch (e) {
    console.log("Firebase not configured yet (Local Mode) ⚠️");
}

// ==========================================
// ⚙️ إعدادات المواد (قائمة التحكم)
// ==========================================
// ضيف أي مادة جديدة هنا، والكود هيعمل الزرار بتاعها والربط تلقائياً
// id: لازم يكون نفس اسم الفولدر اللي في ملفاتك (بالإنجليزي)
// name: الاسم اللي هيظهر للطالب على الزرار
const subjectsConfig = [
    { id: 'microbiology', name: 'Microbiology' },
    { id: 'fundamental', name: 'Fundamental' },
    { id: 'biochemistry', name: 'Biochemistry' },
    { id: 'anatomy', name: 'Anatomy' },
    { id: 'physiology', name: 'Physiology' },
    { id: 'clinical', name: 'Clinical' },
    { id: 'ethics', name: 'Ethics' },
    // مثال: لو عايز تضيف مادة "صحة مجتمع"
    // { id: 'community', name: 'Community' }, 
];

// --- Global State ---
let currentStudentName = localStorage.getItem('studentName') || "";
let currentSubject = subjectsConfig[0].id; // الافتراضي أول مادة
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
    // 1. توليد أزرار المواد ديناميكياً
    generateSubjectTabs();

    // 2. التحقق من الاسم
    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    }

    // 3. ربط الأزرار الأساسية
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });

    // 4. الثيم
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// --- دالة بناء التبويبات (الحل للمشكلة) ---
function generateSubjectTabs() {
    const navContainer = document.getElementById('main-nav');
    navContainer.innerHTML = ''; // تنظيف

    subjectsConfig.forEach((sub, index) => {
        const btn = document.createElement('button');
        // هنا بنضمن إن الستايل يتاخد صح لكل الأزرار
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = sub.name;
        // ربط الزرار بوظيفة اختيار المادة
        btn.onclick = () => selectSubject(sub.id);
        navContainer.appendChild(btn);
    });

    // تنشيط أول مادة افتراضياً
    if(subjectsConfig.length > 0) {
        currentSubject = subjectsConfig[0].id;
    }
}

// --- Navigation Logic ---
function selectSubject(subjectId) {
    currentSubject = subjectId;
    
    // تحديث شكل الأزرار (Active State)
    const buttons = document.querySelectorAll('.tab-btn');
    subjectsConfig.forEach((sub, index) => {
        if (sub.id === subjectId) {
            buttons[index].classList.add('active');
        } else {
            buttons[index].classList.remove('active');
        }
    });

    // إعادة الشاشة لوضع البداية
    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function loadQuizSource(source) {
    currentSource = source;
    // مسار الملف بناءً على المجلدات الموجودة عندك
    const scriptPath = `questions/${currentSubject}/${source}.js?v=${new Date().getTime()}`; 
    
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('dynamic-cards-container').innerHTML = '<p style="text-align:center; padding:20px;">جاري تحميل الأسئلة...</p>';

    loadScript(scriptPath, () => {
        // اسم المتغير المتوقع وجوده داخل الملف
        const dataVarName = `${currentSubject}_${source}_data`;
        const data = window[dataVarName];
        
        if (data) {
            renderQuizCards(data);
        } else {
            document.getElementById('dynamic-cards-container').innerHTML = `
                <div class="coming-soon">
                    <p>⚠️ تم تحميل الملف ولكن البيانات غير موجودة.</p>
                    <small>تأكد أن المتغير داخل الملف اسمه: <b>${dataVarName}</b></small>
                </div>`;
        }
    }, () => {
        // في حالة الملف مش موجود
        document.getElementById('dynamic-cards-container').innerHTML = `
            <div class="coming-soon">
                <p>📂 المحتوى قيد التجهيز لهذه المادة.</p>
                <small>لم يتم العثور على الملف: ${scriptPath.split('?')[0]}</small>
            </div>`;
    });
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    
    const quizKeys = Object.keys(data);
    if (quizKeys.length === 0) {
        container.innerHTML = '<p class="coming-soon">لا توجد اختبارات مضافة حالياً.</p>';
        return;
    }

    quizKeys.forEach(quizKey => {
        const quiz = data[quizKey];
        const historyKey = `${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        
        let badgeHtml = '';
        if (savedHistory[historyKey]) {
            badgeHtml = `<div class="history-badge">✅ ${savedHistory[historyKey].score}/${savedHistory[historyKey].total}</div>`;
        }

        container.innerHTML += `
            <div class="quiz-card" onclick="startQuiz('${quizKey}', '${quiz.title}')">
                ${badgeHtml}
                <h3>${quiz.title}</h3>
                <p>${quiz.questions.length} سؤال</p>
                <button class="start-btn">ابدأ</button>
            </div>`;
    });
    currentQuizData = data;
}

// --- Quiz Logic ---
function startQuiz(quizKey, quizTitle) {
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
    const qData = currentQuiz[currentQuestionIndex];
    const container = document.getElementById("question-container");
    const userAnswer = userAnswers[currentQuestionIndex];
    const isRtl = qData.q.match(/[\u0600-\u06FF]/);
    const dirClass = isRtl ? 'rtl' : '';

    let optionsHtml = '';
    if (qData.type === 'mcq') {
        optionsHtml = `<div class="answer-options">` + 
            qData.options.map((opt, i) => `
                <button class="answer-btn ${dirClass} ${userAnswer?.answer === i ? 'selected' : ''}" 
                        onclick="selectOption(${i})">${opt}</button>
            `).join('') + `</div>`;
    } else if (qData.type === 'tf') {
        optionsHtml = `<div class="tf-options">
            <button class="answer-btn ${userAnswer?.answer === true ? 'selected' : ''}" onclick="selectOption(true)">True</button>
            <button class="answer-btn ${userAnswer?.answer === false ? 'selected' : ''}" onclick="selectOption(false)">False</button>
        </div>`;
    }

    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div>
            <div class="question-text ${dirClass}">${qData.q}</div>
            ${optionsHtml}
            ${qData.hint ? `<div class="hint-container"><button class="hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">تلميح</button><p class="hint-text">${qData.hint}</p></div>` : ''}
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
        updateNavigation();
    }
}

function updateNavigation() {
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    // حفظ محلي
    const historyKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    
    let entry = historyData[historyKey] || { 
        score: 0, total: currentQuiz.length, highestScore: 0, attempts: 0, title: window.currentQuizTitle 
    };
    entry.score = score;
    entry.total = currentQuiz.length;
    entry.title = window.currentQuizTitle;
    entry.attempts = (entry.attempts || 0) + 1;
    entry.highestScore = Math.max(entry.highestScore || 0, score);
    
    historyData[historyKey] = entry;
    localStorage.setItem('quizHistory', JSON.stringify(historyData));

    // حفظ سحابي
    saveScoreToFirebase(score, currentQuiz.length);

    // عرض النتائج
    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = 
        score === currentQuiz.length ? "ممتاز! العلامة الكاملة 🎉" :
        score > currentQuiz.length / 2 ? "جيد جداً، استمر 💪" : "حاول مرة أخرى 📚";

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function showReview() {
    const container = document.getElementById("review-content");
    container.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const uAns = userAnswers[i];
        const isCorrect = uAns && uAns.isCorrect;
        let correctText = q.type === 'tf' ? (q.a ? 'True' : 'False') : q.options[q.a];
        let userText = uAns ? (q.type === 'tf' ? (uAns.answer ? 'True' : 'False') : q.options[uAns.answer]) : 'لم يجب';
        
        container.innerHTML += `
            <div class="review-question">
                <div class="question-number">سؤال ${i+1}</div>
                <div class="question-text">${q.q}</div>
                <div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">إجابتك: ${userText}</div>
                ${!isCorrect ? `<div class="review-option correct">الصحيح: ${correctText}</div>` : ''}
                ${q.explanation ? `<div class="explanation-box">💡 ${q.explanation}</div>` : ''}
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
    if (currentQuizData) renderQuizCards(currentQuizData);
}

// --- Utils ---
function loadScript(src, callback, errorCallback) {
    const cleanSrc = src.split('?')[0];
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { loadedScripts[cleanSrc] = true; if (callback) callback(); };
    script.onerror = () => { if (errorCallback) errorCallback(); };
    document.head.appendChild(script);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function saveStudentName() {
    const nameInput = document.getElementById('student-name-input').value.trim();
    if (nameInput.length < 3) {
        alert("الرجاء كتابة الاسم الثلاثي بشكل صحيح");
        return;
    }
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

function saveScoreToFirebase(score, total) {
    const statusEl = document.getElementById('upload-status');
    if (!db) {
        statusEl.textContent = "⚠️ النتيجة محفوظة محلياً فقط (لم يتم ربط قاعدة البيانات)";
        return;
    }
    statusEl.textContent = "جاري رفع النتيجة...";
    const resultData = {
        studentName: currentStudentName,
        subject: currentSubject,
        quizTitle: window.currentQuizTitle,
        score: score,
        total: total,
        percentage: Math.round((score/total)*100),
        date: new Date().toLocaleString('ar-EG'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    db.collection("exam_results").add(resultData)
    .then(() => { statusEl.textContent = "✅ تم إرسال النتيجة"; statusEl.style.color = "green"; })
    .catch(() => { statusEl.textContent = "❌ فشل إرسال النتيجة"; statusEl.style.color = "red"; });
}

// --- Admin & Dashboard ---
window.openDashboard = function() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let totalQ = 0, totalAttempts = 0, totalScore = 0, totalPossible = 0;
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    Object.entries(historyData).forEach(([key, data]) => {
        totalQ++;
        totalAttempts += (data.attempts || 1);
        totalScore += data.score;
        totalPossible += data.total;
        tbody.innerHTML += `<tr><td>${data.title}</td><td>${data.highestScore}</td><td>${data.score}</td><td>${data.attempts || 1}</td></tr>`;
    });
    document.getElementById('total-quizzes-taken').textContent = totalQ;
    document.getElementById('total-attempts').textContent = totalAttempts;
    document.getElementById('total-accuracy').textContent = totalPossible ? Math.round((totalScore/totalPossible)*100) + '%' : '0%';
};

window.closeDashboard = function() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
};

window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; };
window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; };
window.checkAdminPassword = function() { 
    if (document.getElementById('admin-password-input').value === "admin123") { closeAdminLogin(); openAdminDashboard(); }
    else { alert("كلمة المرور خاطئة!"); }
};
window.openAdminDashboard = function() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    fetchAdminData();
};
window.closeAdminDashboard = function() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
};
function fetchAdminData() {
    const tbody = document.getElementById('admin-table-body');
    if (!db) { tbody.innerHTML = '<tr><td colspan="5">Firebase غير مفعل</td></tr>'; return; }
    tbody.innerHTML = '<tr><td colspan="5">تحميل...</td></tr>';
    db.collection("exam_results").orderBy("timestamp", "desc").limit(50).get().then((snap) => {
        tbody.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td>${d.percentage}%</td><td dir="ltr">${d.date}</td></tr>`;
        });
    });
}
window.exportToExcel = function() {
    const table = document.getElementById("admin-table");
    let csv = "\uFEFF";
    table.querySelectorAll("tr").forEach(row => {
        const rowData = [];
        row.querySelectorAll("th, td").forEach(col => rowData.push(`"${col.innerText}"`));
        csv += rowData.join(",") + "\n";
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = "Results.csv";
    link.click();
};
window.filterAdminTable = function() {
    const filter = document.getElementById("admin-search").value.toUpperCase();
    const rows = document.getElementById("admin-table").getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[0];
        if (td) rows[i].style.display = (td.textContent || td.innerText).toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
};
