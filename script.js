// --- Firebase Configuration ---
// 🔴🔴 هام جداً: استبدل البيانات دي ببيانات مشروعك من Firebase Console 🔴🔴
const firebaseConfig = {
  apiKey: "AIzaSyCzv8U8Syd71OK5uXF7MbOTdT77jXldWqE",
  authDomain: "nursing-quiz-63de2.firebaseapp.com",
  projectId: "nursing-quiz-63de2",
  storageBucket: "nursing-quiz-63de2.firebasestorage.app",
  messagingSenderId: "135091277588",
  appId: "1:135091277588:web:388ed4c31b8b11693cbc01"
};

// تهيئة Firebase (لو البيانات مش موجودة مش هيشتغل، بس الموقع هيفضل شغال Local)
let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Connected Successfully ✅");
} catch (e) {
    console.log("Firebase not configured yet (Local Mode) ⚠️");
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
    // التحقق من الاسم
    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    }

    // ربط الأزرار
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });

    // Theme Check
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


// --- Quiz Logic & Firebase Saving ---

function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    // 1. الحفظ المحلي (للطالب)
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

    // 2. الحفظ في السحابة (للمشرف)
    saveScoreToFirebase(score, currentQuiz.length);

    // 3. عرض النتائج
    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = 
        score === currentQuiz.length ? "ممتاز! العلامة الكاملة 🎉" :
        score > currentQuiz.length / 2 ? "جيد جداً، استمر 💪" : "حاول مرة أخرى 📚";

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function saveScoreToFirebase(score, total) {
    const statusEl = document.getElementById('upload-status');
    
    if (!db) {
        statusEl.textContent = "⚠️ النتيجة محفوظة محلياً فقط (لم يتم ربط قاعدة البيانات)";
        return;
    }

    statusEl.textContent = "جاري رفع النتيجة...";
    
    // البيانات التي سيتم حفظها
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
    .then(() => {
        statusEl.textContent = "✅ تم إرسال النتيجة للدكتور بنجاح";
        statusEl.style.color = "green";
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        statusEl.textContent = "❌ فشل إرسال النتيجة (تأكد من الإنترنت)";
        statusEl.style.color = "red";
    });
}

// --- Admin Dashboard Logic ---

function openAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'flex';
}

function closeAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'none';
}

function checkAdminPassword() {
    const pass = document.getElementById('admin-password-input').value;
    // باسورد بسيط (ممكن تغيره)
    if (pass === "admin123") { 
        closeAdminLogin();
        openAdminDashboard();
    } else {
        alert("كلمة المرور خاطئة!");
    }
}

function openAdminDashboard() {
    // إخفاء كل شيء وإظهار لوحة الأدمن
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    
    fetchAdminData();
}

function closeAdminDashboard() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
}

function fetchAdminData() {
    const tbody = document.getElementById('admin-table-body');
    
    if (!db) {
        tbody.innerHTML = '<tr><td colspan="5">يجب ربط Firebase لتفعيل هذه الميزة</td></tr>';
        return;
    }

    tbody.innerHTML = '<tr><td colspan="5">جاري تحميل البيانات...</td></tr>';

    // جلب البيانات مرتبة بالأحدث
    db.collection("exam_results").orderBy("timestamp", "desc").limit(100).get()
    .then((querySnapshot) => {
        tbody.innerHTML = '';
        if (querySnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5">لا توجد نتائج حتى الآن</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td><b>${data.studentName}</b></td>
                    <td>${data.quizTitle} <br><small style="color:gray">${data.subject}</small></td>
                    <td>${data.score} / ${data.total}</td>
                    <td>${data.percentage}%</td>
                    <td style="direction:ltr">${data.date}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    })
    .catch((error) => {
        tbody.innerHTML = `<tr><td colspan="5">حدث خطأ: ${error.message}</td></tr>`;
    });
}

// دالة البحث في الجدول
function filterAdminTable() {
    const input = document.getElementById("admin-search");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("admin-table");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td")[0]; // العمود الأول (الاسم)
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// دالة تصدير لإكسيل (Simple CSV Export)
function exportToExcel() {
    const table = document.getElementById("admin-table");
    let csvContent = "\uFEFF"; // BOM لـ Excel عشان العربي يظهر صح
    
    const rows = table.querySelectorAll("tr");
    
    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        let rowData = [];
        cols.forEach(col => rowData.push(`"${col.innerText.replace(/\n/g, ' ')}"`));
        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Nursing_Exam_Results.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- باقي دوال الكويز العادية (Select, Start, Render) ---
// (نفس الدوال السابقة بدون تغيير جوهري، بس تأكد إنها موجودة)

function selectSubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="selectSubject('${subject}')"]`);
    if(activeBtn) activeBtn.classList.add('active');

    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function loadQuizSource(source) {
    currentSource = source;
    const scriptPath = `questions/${currentSubject}/${source}.js?v=3.1`;
    
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('dynamic-cards-container').innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';

    loadScript(scriptPath, () => {
        const dataVarName = `${currentSubject}_${source}_data`;
        const data = window[dataVarName];
        if (data) renderQuizCards(data);
        else document.getElementById('dynamic-cards-container').innerHTML = '<p class="coming-soon">لا يوجد محتوى</p>';
    }, () => {
        document.getElementById('dynamic-cards-container').innerHTML = '<p class="coming-soon">الملف غير موجود</p>';
    });
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    Object.keys(data).forEach(quizKey => {
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

function loadScript(src, callback, errorCallback) {
    const cleanSrc = src.split('?')[0];
    if (loadedScripts[cleanSrc]) { if (callback) callback(); return; }
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

// Global Functions for Dashboard
window.openDashboard = function() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    
    // Render Student Stats
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let totalQ = 0, totalAttempts = 0, totalScore = 0, totalPossible = 0;
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    Object.entries(historyData).forEach(([key, data]) => {
        totalQ++;
        totalAttempts += (data.attempts || 1);
        totalScore += data.score;
        totalPossible += data.total;
        
        tbody.innerHTML += `
            <tr>
                <td>${data.title || key}</td>
                <td>${data.highestScore || data.score}</td>
                <td>${data.score}</td>
                <td>${data.attempts || 1}</td>
            </tr>`;
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
