// --- Global State ---
let currentSubject = 'microbiology';
let currentSource = ''; 
let currentQuizData = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsElapsed = 0;
let loadedScripts = {}; 

// --- Theme Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;
if (localStorage.getItem('theme') === 'dark') {
    bodyElement.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
}
themeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', bodyElement.classList.contains('dark-mode') ? 'dark' : 'light');
    themeToggleBtn.textContent = bodyElement.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// --- Dashboard Logic (الجديد) ---

function openDashboard() {
    // إخفاء كل الصفحات وإظهار الداش بورد
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('main-nav').style.display = 'none'; // إخفاء التبويبات
    document.getElementById('dashboard-view').style.display = 'block';

    calculateAndRenderStats();
}

function closeDashboard() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject(currentSubject); // العودة لآخر مادة
}

function calculateAndRenderStats() {
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';

    let totalQuizzes = 0;
    let totalAttempts = 0;
    let totalScoreSum = 0;
    let totalQuestionsSum = 0;

    // تحويل البيانات لمصفوفة وترتيبها (الأحدث أولاً أو حسب المادة)
    const entries = Object.entries(historyData);

    if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">لم تقم بحل أي اختبارات بعد 🤷‍♂️</td></tr>';
        return;
    }

    entries.forEach(([key, data]) => {
        // key format: subject_source_quizId
        const parts = key.split('_');
        // استخراج اسم الكويز بشكل جميل (ممكن نحتاج مابينج للاسم بس مؤقتاً هنعرض الكود)
        // لتحسين الاسم، بنعتمد على إننا بنعرض العنوان لما نكون فاتحين المادة، هنا هنعرض الـ Quiz ID
        // الأفضل: تخزين عنوان الكويز في الـ history
        const quizTitle = data.title || key; // Fallback to key if title missing

        // تجميع الإحصائيات
        totalQuizzes++;
        totalAttempts += (data.attempts || 1);
        totalScoreSum += data.score; // Last score
        totalQuestionsSum += data.total;

        // حساب النسبة المئوية لأعلى درجة
        const highScore = data.highestScore !== undefined ? data.highestScore : data.score;
        const percentage = Math.round((highScore / data.total) * 100);
        
        let rowHtml = `
            <tr>
                <td>
                    <div style="font-weight:bold;">${quizTitle}</div>
                    <div style="font-size:0.8rem; color:gray;">${parts[0]}</div>
                </td>
                <td><span style="color:var(--primary-color); font-weight:bold;">${highScore}/${data.total}</span> (${percentage}%)</td>
                <td>${data.score}/${data.total}</td>
                <td>${data.attempts || 1}</td>
            </tr>
        `;
        tbody.innerHTML += rowHtml;
    });

    // تحديث الكروت العلوية
    document.getElementById('total-quizzes-taken').textContent = totalQuizzes;
    document.getElementById('total-attempts').textContent = totalAttempts;
    
    // حساب الدقة العامة (بناءً على آخر درجات)
    const globalAccuracy = totalQuestionsSum > 0 ? Math.round((totalScoreSum / totalQuestionsSum) * 100) : 0;
    document.getElementById('total-accuracy').textContent = `${globalAccuracy}%`;
}


// --- Navigation Logic ---

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
}

function loadQuizSource(source) {
    currentSource = source;
    const scriptPath = `questions/${currentSubject}/${source}.js?v=3.0`;
    
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('dynamic-cards-container').innerHTML = '<p style="text-align:center;">جاري تحميل الأسئلة...</p>';

    loadScript(scriptPath, () => {
        const dataVarName = `${currentSubject}_${source}_data`;
        const data = window[dataVarName];

        if (data) {
            renderQuizCards(data);
        } else {
            document.getElementById('dynamic-cards-container').innerHTML = 
                '<p class="coming-soon">لم يتم العثور على بيانات لهذا القسم.</p>';
        }
    }, () => {
        document.getElementById('dynamic-cards-container').innerHTML = 
            '<p class="coming-soon">عذراً، الملف غير موجود حالياً.</p>';
    });
}

function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = '';

    Object.keys(data).forEach(quizKey => {
        const quiz = data[quizKey];
        const questionCount = quiz.questions ? quiz.questions.length : 0;
        
        const historyKey = `${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        let badgeHtml = '';
        
        // تعديل لعرض أعلى درجة في الكارت
        if (savedHistory[historyKey]) {
            const best = savedHistory[historyKey].highestScore !== undefined ? savedHistory[historyKey].highestScore : savedHistory[historyKey].score;
            badgeHtml = `<div class="history-badge">🏆 Best: ${best}/${savedHistory[historyKey].total}</div>`;
        }

        const cardHtml = `
            <div class="quiz-card" onclick="startQuiz('${quizKey}', '${quiz.title}')">
                ${badgeHtml}
                <h3>${quiz.title}</h3>
                <p>${questionCount} سؤال</p>
                <button class="start-btn">ابدأ الاختبار</button>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
    currentQuizData = data;
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
    if (loadedScripts[cleanSrc]) {
        if (callback) callback();
        return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        loadedScripts[cleanSrc] = true;
        if (callback) callback();
    };
    script.onerror = () => {
        if (errorCallback) errorCallback();
    };
    document.head.appendChild(script);
}

// --- Quiz Logic ---

function startQuiz(quizKey, quizTitle) {
    const quiz = currentQuizData[quizKey];
    if (!quiz || !quiz.questions) return;

    window.currentQuizKey = quizKey;
    window.currentQuizTitle = quizTitle; // تخزين العنوان عشان نحفظه في الهيستوري

    currentQuiz = shuffleArray([...quiz.questions]);
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);

    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    document.getElementById("current-quiz-title").textContent = quiz.title;
    document.getElementById("quiz-timer").textContent = "00:00";
    
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
            <div class="question-number">السؤال ${currentQuestionIndex + 1} من ${currentQuiz.length}</div>
            <div class="question-text ${dirClass}">${qData.q}</div>
            ${optionsHtml}
            ${qData.hint ? `
                <div class="hint-container">
                    <button class="hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">إظهار التلميح</button>
                    <p class="hint-text">${qData.hint}</p>
                </div>` : ''}
        </div>
    `;
    
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    document.getElementById("progress-fill").style.width = `${progress}%`;
    document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

function selectOption(val) {
    userAnswers[currentQuestionIndex] = { 
        answer: val, 
        isCorrect: val === currentQuiz[currentQuestionIndex].a 
    };
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
    document.getElementById("next-btn").textContent = 
        currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي";
}

// --- (تعديل) دالة الإنهاء وحفظ البيانات الجديدة ---
function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    const historyKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    
    // استرجاع البيانات القديمة أو إنشاء جديد
    let entry = historyData[historyKey] || { 
        score: 0, 
        total: currentQuiz.length, 
        highestScore: 0, 
        attempts: 0,
        title: window.currentQuizTitle 
    };

    // تحديث البيانات
    entry.score = score; // آخر درجة
    entry.total = currentQuiz.length;
    entry.title = window.currentQuizTitle; // تحديث العنوان لضمان ظهوره في الداش بورد
    entry.attempts = (entry.attempts || 0) + 1; // زيادة عدد المحاولات
    entry.highestScore = Math.max(entry.highestScore || 0, score); // حفظ أعلى درجة

    // حفظ في LocalStorage
    historyData[historyKey] = entry;
    localStorage.setItem('quizHistory', JSON.stringify(historyData));

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
        let userText = uAns ? (q.type === 'tf' ? (uAns.answer ? 'True' : 'False') : q.options[uAns.answer]) : 'لم يتم الرد';

        const reviewHtml = `
            <div class="review-question">
                <div class="question-number">السؤال ${i+1}</div>
                <div class="question-text">${q.q}</div>
                <div class="review-option ${isCorrect ? 'correct' : 'user-incorrect'}">
                    إجابتك: ${userText}
                </div>
                ${!isCorrect ? `<div class="review-option correct">الإجابة الصحيحة: ${correctText}</div>` : ''}
                ${q.explanation ? `<div class="explanation-box">💡 ${q.explanation}</div>` : ''}
            </div>
        `;
        container.innerHTML += reviewHtml;
    });

    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'block';
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });

    selectSubject('microbiology'); 
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
        }
