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
} catch (e) {
    console.log("Local Mode ⚠️");
}

// --- Global Variables ---
let currentStudentName = localStorage.getItem('studentName') || "";
let currentSubject = 'microbiology';
let currentSource = '';
let currentQuizData = {};
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsElapsed = 0;
let loadedScripts = {};

// 🟢🟢 1. دوال الدخول (في البداية لضمان عملها) 🟢🟢
window.saveStudentName = function() {
    const nameInput = document.getElementById('student-name-input').value.trim();
    const errorMsg = document.getElementById('login-error');
    if (nameInput.length < 3) {
        errorMsg.style.display = "block";
        return;
    }
    currentStudentName = nameInput;
    localStorage.setItem('studentName', currentStudentName);
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
};

window.checkAdminPassword = function() {
    const pass = document.getElementById('admin-password-input').value;
    const err = document.getElementById('admin-error');
    if(pass === "admin123") {
        closeAdminLogin();
        hideAllViews();
        document.getElementById('admin-dashboard-view').style.display = 'block';
        err.style.display = "none";
        renderCustomQuizzesList();
        fetchAdminData();
        // استرجاع الخبر المحفوظ
        document.getElementById('admin-news-input').value = localStorage.getItem('siteNews') || '';
    } else {
        err.style.display = "block";
    }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    }

    // تفعيل الأزرار
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);

    // الوضع الليلي
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // إخفاء الشاشات وتحميل الأخبار
    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject('microbiology');
    loadNewsTicker(); 
});

// --- 📢 شريط الأخبار ---
window.updateNewsTicker = function() {
    const text = document.getElementById('admin-news-input').value.trim();
    if(text) {
        localStorage.setItem('siteNews', text);
        loadNewsTicker();
        alert('تم تحديث الشريط ✅');
    } else {
        localStorage.removeItem('siteNews');
        loadNewsTicker();
        alert('تم الإخفاء');
    }
};

function loadNewsTicker() {
    const news = localStorage.getItem('siteNews');
    const container = document.getElementById('news-ticker-bar');
    if(news) {
        document.getElementById('news-text').textContent = news;
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
    }
}

// --- 📥 Excel Export ---
window.exportToExcel = function() {
    const table = document.getElementById("admin-table");
    let csvContent = "\uFEFF"; 
    const headers = Array.from(table.querySelectorAll("th")).map(th => th.innerText);
    csvContent += headers.join(",") + "\n";
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td")).map(td => `"${td.innerText}"`);
        csvContent += cells.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Nursing_Results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Admin Functions (Fetch Data) ---
function fetchAdminData() {
    const tbody = document.getElementById('admin-table-body');
    if (!db) { tbody.innerHTML = '<tr><td colspan="4">يجب ربط Firebase</td></tr>'; return; }
    tbody.innerHTML = '<tr><td colspan="4">جاري التحميل...</td></tr>';
    db.collection("exam_results").orderBy("timestamp", "desc").limit(50).get().then((snap) => {
        tbody.innerHTML = '';
        if(snap.empty) { tbody.innerHTML = '<tr><td colspan="4">لا توجد نتائج</td></tr>'; return; }
        snap.forEach((doc) => {
            const d = doc.data();
            tbody.innerHTML += `<tr><td>${d.studentName}</td><td>${d.quizTitle}</td><td>${d.score}/${d.total}</td><td style="direction:ltr">${d.date||''}</td></tr>`;
        });
    });
}

// --- Custom Quizzes (Add/Delete) ---
window.addNewQuizFromAdmin = function() {
    const sub = document.getElementById('admin-sub-select').value;
    const src = document.getElementById('admin-src-select').value;
    const tit = document.getElementById('admin-quiz-title').value;
    const txt = document.getElementById('admin-quiz-content').value;
    
    if(!tit || !txt) return alert('أكمل البيانات');
    const qs = parseQuestionsText(txt);
    if(!qs.length) return alert('تنسيق الأسئلة غير صحيح');
    
    const custom = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    custom.push({ id: 'cust_'+Date.now(), subject: sub, source: src, title: tit, questions: qs });
    localStorage.setItem('custom_quizzes', JSON.stringify(custom));
    alert('تم الحفظ ✅');
    document.getElementById('admin-quiz-title').value = '';
    document.getElementById('admin-quiz-content').value = '';
    renderCustomQuizzesList();
};

window.deleteCustomQuiz = function(id) {
    if(!confirm("حذف؟")) return;
    let list = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const newList = list.filter(q => q.id !== id);
    localStorage.setItem('custom_quizzes', JSON.stringify(newList));
    renderCustomQuizzesList();
    alert("تم الحذف 🗑️");
};

function renderCustomQuizzesList() {
    const list = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const container = document.getElementById('admin-custom-quizzes-list');
    container.innerHTML = '';
    if(list.length === 0) { container.innerHTML = '<p style="text-align:center; color:gray; width:100%;">لا توجد امتحانات مضافة</p>'; return; }
    list.forEach(q => {
        container.innerHTML += `
            <div class="quiz-card" style="border:1px solid #e2e8f0; cursor:default;">
                <h4 style="margin:0 0 10px 0;">${q.title}</h4>
                <p style="margin:0; font-size:0.9rem; color:gray;">${q.subject} | ${q.source === 'bank' ? 'بنك' : 'دكتور'}</p>
                <p style="margin:5px 0 15px 0; font-size:0.9rem;">${q.questions.length} أسئلة</p>
                <button class="start-btn" onclick="deleteCustomQuiz('${q.id}')" style="background:#ef4444; font-size:0.9rem;">حذف 🗑️</button>
            </div>`;
    });
}

function parseQuestionsText(text) {
    const lines = text.split('\n');
    let questions = [], cur = null;
    lines.forEach(l => {
        l = l.trim();
        if(!l) return;
        if(l.match(/^(Q\d+|س\d+|\d+)[:.)]/i) || l.includes('?')) {
            if(cur) questions.push(cur);
            cur = { q: l.replace(/^(Q\d+|س\d+|\d+)[:.)]\s*/i, ''), options: [], a: 0 };
        } else if(cur && l.match(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i)) {
            cur.options.push(l.replace(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i, ''));
        } else if(cur && l.match(/^(Answer|Correct|الاجابة|الإجابة)[:]\s*/i)) {
            const map = {'a':0,'b':1,'c':2,'d':3,'أ':0,'ب':1,'ج':2,'د':3};
            cur.a = map[l.split(':')[1].trim().toLowerCase()] || 0;
        } else if(cur && l.match(/^(Hint|Explanation|تلميح|الشرح)[:]\s*/i)) {
            cur.hint = l.split(':')[1].trim();
        }
    });
    if(cur) questions.push(cur);
    return questions;
}

// --- Navigation ---
window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
};

window.hideAllViews = function() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('source-selection').style.display = 'none';
};

window.selectSubject = function(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`button[onclick="selectSubject('${subject}')"]`);
    if(btn) btn.classList.add('active');
    hideAllViews();
    document.getElementById('source-selection').style.display = 'flex';
};

window.loadQuizSource = function(source) {
    currentSource = source;
    hideAllViews();
    document.getElementById('quiz-list-area').style.display = 'block';
    
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '<p style="text-align:center;">جاري البحث عن الامتحانات...</p>';

    const scriptPath = `questions/${currentSubject}/${source}.js`;
    let fileQuizzes = {};
    const customAll = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
    const customFiltered = customAll.filter(q => q.subject === currentSubject && q.source === currentSource);

    loadScript(scriptPath, () => {
        const dataVar = `${currentSubject}_${source}_data`;
        if(window[dataVar]) fileQuizzes = window[dataVar];
        renderCombinedQuizzes(fileQuizzes, customFiltered);
    }, () => {
        renderCombinedQuizzes({}, customFiltered);
    });
};

function renderCombinedQuizzes(fileData, customList) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';
    currentQuizData = {}; 
    Object.keys(fileData).forEach(key => {
        currentQuizData[key] = fileData[key];
        addQuizCard(key, fileData[key].title, fileData[key].questions.length, false);
    });
    customList.forEach(quiz => {
        currentQuizData[quiz.id] = quiz;
        addQuizCard(quiz.id, quiz.title, quiz.questions.length, true);
    });
    if (container.innerHTML === '') {
        container.innerHTML = '<p style="text-align:center; padding:20px;">لا توجد امتحانات متاحة حالياً.</p>';
    }
}

function addQuizCard(key, title, count, isCustom) {
    const histKey = `${currentSubject}_${currentSource}_${key}`;
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
    const badge = savedHistory[histKey] ? `<div class="history-badge">✅ ${savedHistory[histKey].score}</div>` : '';
    const customTag = isCustom ? '<span style="font-size:0.8rem; color:green;">(جديد)</span>' : '';
    document.getElementById('dynamic-cards-container').innerHTML += `
        <div class="quiz-card" onclick="startQuiz('${key}', '${title}')">
            ${badge}
            <h3>${title} ${customTag}</h3>
            <p>${count} سؤال</p>
            <button class="start-btn">ابدأ</button>
        </div>`;
}

// --- Quiz Player ---
window.startQuiz = function(key, title) {
    const quiz = currentQuizData[key];
    window.currentQuizKey = key;
    window.currentQuizTitle = title;
    currentQuiz = quiz.questions;
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    hideAllViews();
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('current-quiz-title').textContent = title;
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById("quiz-timer").textContent = `${m}:${s}`;
    }, 1000);
    displayQuestion();
    updateNav();
};

function displayQuestion() {
    const qData = currentQuiz[currentQuestionIndex];
    const container = document.getElementById("question-container");
    const uAns = userAnswers[currentQuestionIndex];
    const isRtl = qData.q.match(/[\u0600-\u06FF]/);
    const dirClass = isRtl ? 'rtl' : '';

    let optionsHtml = '';
    if (!qData.type || qData.type === 'mcq') {
        optionsHtml = `<div class="answer-options">` + 
            qData.options.map((opt, i) => `
                <button class="answer-btn ${dirClass} ${uAns?.answer === i ? 'selected' : ''}" 
                        onclick="selectOption(${i})">${opt}</button>
            `).join('') + `</div>`;
    } else if (qData.type === 'tf') {
        optionsHtml = `<div class="tf-options" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button class="answer-btn ${uAns?.answer === true ? 'selected' : ''}" onclick="selectOption(true)">True</button>
            <button class="answer-btn ${uAns?.answer === false ? 'selected' : ''}" onclick="selectOption(false)">False</button>
        </div>`;
    }

    let hintHtml = '';
    if (qData.hint) {
        hintHtml = `<div class="hint-container"><button class="hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">💡 تلميح</button><p class="hint-text">${qData.hint}</p></div>`;
    }

    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div>
            <div class="question-text ${dirClass}">${qData.q}</div>
            ${optionsHtml}
            ${hintHtml}
        </div>`;
    
    document.getElementById("progress-fill").style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
    document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

window.selectOption = function(val) {
    userAnswers[currentQuestionIndex] = { answer: val, isCorrect: val === currentQuiz[currentQuestionIndex].a };
    displayQuestion();
};

window.nextQuestion = function() {
    if(currentQuestionIndex < currentQuiz.length - 1) { currentQuestionIndex++; displayQuestion(); updateNav(); } else { finishQuiz(); }
};

window.prevQuestion = function() {
    if(currentQuestionIndex > 0) { currentQuestionIndex--; displayQuestion(); updateNav(); }
};

function updateNav() {
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

function finishQuiz() {
    clearInterval(timerInterval);
    const score = userAnswers.filter(a => a && a.isCorrect).length;
    const hKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const hData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    hData[hKey] = { score: score, total: currentQuiz.length, title: window.currentQuizTitle };
    localStorage.setItem('quizHistory', JSON.stringify(hData));

    if(db) {
        document.getElementById('upload-status').textContent = "جاري الحفظ...";
        db.collection("exam_results").add({
            studentName: currentStudentName,
            subject: currentSubject,
            quizTitle: window.currentQuizTitle,
            score: score,
            total: currentQuiz.length,
            date: new Date().toLocaleString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('upload-status').textContent = "✅ تم حفظ النتيجة";
            document.getElementById('upload-status').style.color = "green";
        }).catch(() => {
            document.getElementById('upload-status').textContent = "⚠️ تم الحفظ محلياً فقط";
        });
    }

    hideAllViews();
    document.getElementById('results').style.display = 'block';
    document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`;
    document.getElementById("score-message").textContent = score >= currentQuiz.length/2 ? "ممتاز! 👏" : "حاول مرة أخرى 💪";
}

window.showReview = function() {
    const c = document.getElementById("review-content");
    c.innerHTML = '';
    currentQuiz.forEach((q, i) => {
        const ua = userAnswers[i];
        const correct = ua && ua.isCorrect;
        let cText = q.type==='tf' ? (q.a?'True':'False') : q.options[q.a];
        let uText = ua ? (q.type==='tf' ? (ua.answer?'True':'False') : q.options[ua.answer]) : "لم يجب";
        c.innerHTML += `
            <div class="review-question">
                <div style="font-weight:bold;">س ${i+1}: ${q.q}</div>
                <div class="review-option ${correct?'correct':'user-incorrect'}">إجابتك: ${uText}</div>
                ${!correct ? `<div class="review-option correct">الصحيح: ${cText}</div>` : ''}
                ${q.hint ? `<div style="font-size:0.9rem; color:gray; margin-top:5px;">💡 تلميح: ${q.hint}</div>` : ''}
            </div>`;
    });
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
};

window.backToSources = function() {
    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    document.getElementById('source-selection').style.display = 'flex';
};

window.backToQuizList = function() {
    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    loadQuizSource(currentSource);
};

window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; };
window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; };
window.closeAdminDashboard = function() {
    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
};

window.openDashboard = function() {
    hideAllViews();
    document.getElementById('dashboard-view').style.display = 'block';
    const hist = JSON.parse(localStorage.getItem('quizHistory')) || {};
    let tQ=0;
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    Object.values(hist).forEach(v => { 
        tQ++;
        tbody.innerHTML += `<tr><td>${v.title}</td><td>${v.score}</td><td>${v.score}</td><td>1</td></tr>`;
    });
    document.getElementById('total-quizzes-taken').textContent = tQ;
};

window.closeDashboard = function() {
    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject);
};

function loadScript(src, cb, errCb) {
    if(loadedScripts[src]) { cb(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { loadedScripts[src]=true; cb(); };
    s.onerror = errCb;
    document.head.appendChild(s);
          }
