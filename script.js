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
// ⚙️ إعدادات المواد (لإضافة مواد جديدة)
// ==========================================
// فقط اضف سطر جديد هنا لاضافة مادة، وقم بانشاء مجلد بنفس الـ id
const subjectsConfig = [
    { id: 'microbiology', name: 'Microbiology' },
    { id: 'fundamental', name: 'Fundamental' },
    { id: 'biochemistry', name: 'Biochemistry' },
    { id: 'anatomy', name: 'Anatomy' },
    { id: 'physiology', name: 'Physiology' },
    { id: 'clinical', name: 'Clinical' },
    { id: 'ethics', name: 'Ethics' },
    // مثال لاضافة مادة: { id: 'community', name: 'Community' }, 
];

// --- Global State ---
let currentStudentName = localStorage.getItem('studentName') || "";
let currentSubject = subjectsConfig[0].id; 
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

// --- Tab Generation ---
function generateSubjectTabs() {
    const navContainer = document.getElementById('main-nav');
    navContainer.innerHTML = ''; 

    subjectsConfig.forEach((sub, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = sub.name;
        btn.onclick = () => selectSubject(sub.id);
        navContainer.appendChild(btn);
    });
    if(subjectsConfig.length > 0) currentSubject = subjectsConfig[0].id;
}

// --- Login & Validation Logic (المعدل) ---
async function saveStudentName() {
    const nameInput = document.getElementById('student-name-input');
    const errorMsg = document.getElementById('login-error');
    const rawName = nameInput.value.trim();
    
    // 1. التحقق من أن الاسم ثلاثي
    const parts = rawName.split(/\s+/);
    if (parts.length < 3) {
        errorMsg.textContent = "❌ يجب إدخال الاسم الثلاثي على الأقل";
        errorMsg.style.display = 'block';
        return;
    }

    if (!db) {
        // لو مفيش نت أو قاعدة بيانات، احفظ محلي وخلاص
        completeLogin(rawName);
        return;
    }

    // 2. التحقق من عدم تكرار الاسم في Firebase
    nameInput.disabled = true;
    errorMsg.textContent = "⏳ جاري التحقق من الاسم...";
    errorMsg.style.display = 'block';
    errorMsg.style.color = "blue";

    try {
        // بنشيك في كولكشن اسمه 'users' عشان نضمن عدم التكرار
        const userDoc = await db.collection('users').doc(rawName).get();
        
        if (userDoc.exists) {
            errorMsg.textContent = "❌ هذا الاسم مسجل بالفعل، يرجى مراجعة المشرف إذا كان هذا خطأ.";
            errorMsg.style.color = "red";
            nameInput.disabled = false;
        } else {
            // تسجيل مستخدم جديد
            await db.collection('users').doc(rawName).set({
                name: rawName,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            completeLogin(rawName);
        }
    } catch (error) {
        console.error("Login Error:", error);
        errorMsg.textContent = "⚠️ حدث خطأ في الاتصال، حاول مرة أخرى.";
        nameInput.disabled = false;
    }
}

function completeLogin(name) {
    currentStudentName = name;
    localStorage.setItem('studentName', currentStudentName);
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    location.reload(); // ريفريش عشان التأكيد
}

function logout() {
    if(confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        localStorage.removeItem('studentName');
        location.reload();
    }
}

// --- Navigation ---
function selectSubject(subjectId) {
    currentSubject = subjectId;
    const buttons = document.querySelectorAll('.tab-btn');
    subjectsConfig.forEach((sub, index) => {
        if (sub.id === subjectId) buttons[index].classList.add('active');
        else buttons[index].classList.remove('active');
    });

    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
}

function loadQuizSource(source) {
    currentSource = source;
    // إضافة timestamp لمنع الكاش
    const scriptPath = `questions/${currentSubject}/${source}.js?v=${new Date().getTime()}`;
    
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('dynamic-cards-container').innerHTML = '<p style="text-align:center;">جاري تحميل الأسئلة...</p>';

    loadScript(scriptPath, () => {
        const dataVarName = `${currentSubject}_${source}_data`;
        const data = window[dataVarName];
        if (data) renderQuizCards(data);
        else document.getElementById('dynamic-cards-container').innerHTML = `<p class="coming-soon">⚠️ الملف فارغ أو اسم المتغير خطأ (${dataVarName})</p>`;
    }, () => {
        document.getElementById('dynamic-cards-container').innerHTML = `<p class="coming-soon">📂 لا يوجد محتوى مضاف لهذه المادة بعد.</p>`;
    });
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
        container.innerHTML = '<p class="coming-soon">لا توجد اختبارات.</p>';
        return;
    }

    keys.forEach(quizKey => {
        const quiz = data[quizKey];
        const historyKey = `${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        let badgeHtml = savedHistory[historyKey] ? `<div class="history-badge">✅ ${savedHistory[historyKey].score}/${savedHistory[historyKey].total}</div>` : '';
        
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
    
    const historyKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let entry = historyData[historyKey] || { score: 0, total: currentQuiz.length, highestScore: 0, attempts: 0, title: window.currentQuizTitle };
    entry.score = score;
    entry.total = currentQuiz.length;
    entry.title = window.currentQuizTitle;
    entry.attempts = (entry.attempts || 0) + 1;
    entry.highestScore = Math.max(entry.highestScore || 0, score);
    
    historyData[historyKey] = entry;
    localStorage.setItem('quizHistory', JSON.stringify(historyData));
    saveScoreToFirebase(score, currentQuiz.length);

    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = score === currentQuiz.length ? "ممتاز! 🌟" : "جيد، حاول مرة أخرى";
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
                <div class="question-number">س ${i+1}</div>
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
    clearInterval(timerInterval);
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

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
}

function saveScoreToFirebase(score, total) {
    if (!db) return;
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
    document.getElementById('upload-status').textContent = "جاري الحفظ...";
    db.collection("exam_results").add(resultData)
    .then(() => document.getElementById('upload-status').textContent = "✅ تم حفظ النتيجة")
    .catch(() => document.getElementById('upload-status').textContent = "❌ فشل الحفظ");
}

// --- Admin & Dashboard Functions ---

window.openDashboard = function() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    let tQ=0, tA=0, tS=0, tP=0;

    Object.entries(historyData).forEach(([key, data]) => {
        tQ++; tA += data.attempts || 1; tS += data.score; tP += data.total;
        tbody.innerHTML += `<tr><td>${data.title}</td><td>${data.highestScore}</td><td>${data.score}</td><td>${data.attempts || 1}</td></tr>`;
    });
    
    document.getElementById('total-quizzes-taken').textContent = tQ;
    document.getElementById('total-attempts').textContent = tA;
    document.getElementById('total-accuracy').textContent = tP ? Math.round((tS/tP)*100) + '%' : '0%';
};

window.closeDashboard = function() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
};

// Admin Auth
window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; };
window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; };
window.checkAdminPassword = function() { 
    if (document.getElementById('admin-password-input').value === "admin123") {
        closeAdminLogin(); openAdminDashboard();
    } else { alert("كلمة المرور خاطئة!"); }
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
    tbody.innerHTML = '<tr><td colspan="5">جاري جلب البيانات...</td></tr>';
    
    db.collection("exam_results").orderBy("timestamp", "desc").limit(100).get().then((snap) => {
        tbody.innerHTML = '';
        if(snap.empty) { tbody.innerHTML = '<tr><td colspan="5">لا توجد نتائج</td></tr>'; return; }
        snap.forEach(doc => {
            const d = doc.data();
            tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td>${d.percentage}%</td><td dir="ltr">${d.date}</td></tr>`;
        });
    });
}

// --- Admin Danger Zone (حذف البيانات) ---
window.adminResetAllResults = function() {
    if(!confirm("⚠️ تحذير: هل أنت متأكد من حذف جميع نتائج الطلاب؟ لا يمكن التراجع عن هذا الإجراء!")) return;
    if(!db) return;

    // الحذف في Firestore يتطلب Looping (لا يوجد Delete All مباشر)
    const btn = event.target;
    btn.textContent = "جاري الحذف...";
    btn.disabled = true;

    db.collection("exam_results").get().then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        return batch.commit();
    }).then(() => {
        alert("تم حذف جميع النتائج بنجاح ✅");
        fetchAdminData(); // تحديث الجدول
        btn.textContent = "🗑️ حذف جميع النتائج";
        btn.disabled = false;
    }).catch(err => {
        alert("حدث خطأ أثناء الحذف: " + err.message);
        btn.textContent = "🗑️ حذف جميع النتائج";
        btn.disabled = false;
    });
};

window.adminDeleteAllUsers = function() {
    if(!confirm("⚠️ تحذير خطير: هل تريد حذف جميع حسابات الطلاب المسجلة؟ سيضطر الجميع للتسجيل من جديد.")) return;
    if(!db) return;

    const btn = event.target;
    btn.textContent = "جاري الحذف...";
    btn.disabled = true;

    db.collection("users").get().then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        return batch.commit();
    }).then(() => {
        alert("تم حذف جميع المستخدمين بنجاح 👥");
        btn.textContent = "👥 حذف جميع المستخدمين";
        btn.disabled = false;
    }).catch(err => {
        alert("حدث خطأ: " + err.message);
        btn.disabled = false;
    });
};

window.filterAdminTable = function() {
    const filter = document.getElementById("admin-search").value.toUpperCase();
    const rows = document.getElementById("admin-table").getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[0];
        if (td) rows[i].style.display = (td.textContent || td.innerText).toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
};

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
