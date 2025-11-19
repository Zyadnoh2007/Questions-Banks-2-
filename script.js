// --- Global State ---
let currentSubject = 'microbiology'; // المادة الحالية
let currentSource = ''; // 'bank' or 'doctor'
let currentQuizData = null; // الداتا اللي حملناها
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let secondsElapsed = 0;
let loadedScripts = {}; // لتتبع الملفات المحملة

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

// --- Navigation Logic ---

// 1. اختيار المادة (التبويبات اللي فوق)
function selectSubject(subject) {
    currentSubject = subject;
    
    // تحديث شكل الزراير
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="selectSubject('${subject}')"]`);
    if(activeBtn) activeBtn.classList.add('active');

    // إظهار شاشة اختيار المصدر (بنك/دكتور) وإخفاء الباقي
    document.getElementById('source-selection').style.display = 'flex';
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
}

// 2. اختيار المصدر (بنك أو دكتور)
function loadQuizSource(source) {
    currentSource = source;
    
    // مسار الملف بناءً على المادة والمصدر
    // مثال: questions/microbiology/bank.js
    const scriptPath = `questions/${currentSubject}/${source}.js?v=2.1`;
    
    // إظهار رسالة تحميل مؤقتة
    document.getElementById('source-selection').style.display = 'none';
    document.getElementById('quiz-list-area').style.display = 'block';
    document.getElementById('dynamic-cards-container').innerHTML = '<p style="text-align:center;">جاري تحميل الأسئلة...</p>';

    loadScript(scriptPath, () => {
        // اسم المتغير المتوقع داخل الملف: microbiology_bank_data
        const dataVarName = `${currentSubject}_${source}_data`;
        const data = window[dataVarName];

        if (data) {
            renderQuizCards(data);
        } else {
            document.getElementById('dynamic-cards-container').innerHTML = 
                '<p class="coming-soon">لسه مفيش كويزات هنا 🙂</p>';
        }
    }, () => {
        document.getElementById('dynamic-cards-container').innerHTML = 
            '<p class="coming-soon">عذراً، ملف الأسئلة غير موجود حالياً (قريباً).</p>';
    });
}

// 3. رسم الكروت أوتوماتيك
function renderQuizCards(data) {
    const container = document.getElementById('dynamic-cards-container');
    container.innerHTML = ''; // مسح القديم

    // التكرار على كل الكويزات في الملف
    Object.keys(data).forEach(quizKey => {
        const quiz = data[quizKey];
        const questionCount = quiz.questions ? quiz.questions.length : 0;
        
        // البحث عن النتيجة المحفوظة
        const historyKey = `${currentSubject}_${currentSource}_${quizKey}`;
        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
        let badgeHtml = '';
        
        if (savedHistory[historyKey]) {
            badgeHtml = `<div class="history-badge">✅ ${savedHistory[historyKey].score}/${savedHistory[historyKey].total}</div>`;
        }

        const cardHtml = `
            <div class="quiz-card" onclick="startQuiz('${quizKey}')">
                ${badgeHtml}
                <h3>${quiz.title}</h3>
                <p>${questionCount} سؤال</p>
                <button class="start-btn">ابدأ الاختبار</button>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
    
    // حفظ الداتا الحالية عشان لما نختار كويز نعرف نجيبه
    currentQuizData = data;
}

// 4. الرجوع لاختيار المصدر
function backToSources() {
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('source-selection').style.display = 'flex';
}

// 5. الرجوع لقائمة الكويزات (من جوه الامتحان)
function backToQuizList() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review-container').style.display = 'none';
    
    // إعادة تحميل القائمة وتحديث النتائج
    document.getElementById('quiz-list-area').style.display = 'block';
    if (currentQuizData) renderQuizCards(currentQuizData);
}

// --- Helper: Load Script ---
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

// --- Quiz Logic (Start, Play, End) ---

function startQuiz(quizKey) {
    const quiz = currentQuizData[quizKey];
    if (!quiz || !quiz.questions) return;

    // تخزين المفتاح الحالي للحفظ لاحقاً
    window.currentQuizKey = quizKey;

    currentQuiz = shuffleArray([...quiz.questions]);
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);

    // إخفاء القائمة وإظهار الاختبار
    document.getElementById('quiz-list-area').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    // إعداد الواجهة
    document.getElementById("current-quiz-title").textContent = quiz.title;
    document.getElementById("quiz-timer").textContent = "00:00";
    
    // بدء العداد
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
    
    const isRtl = qData.q.match(/[\u0600-\u06FF]/); // كشف اللغة العربية
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
    displayQuestion(); // إعادة رسم لتحديث الـ Selected style
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

function finishQuiz() {
    clearInterval(timerInterval);
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    // حفظ النتيجة
    const historyKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`;
    const historyData = JSON.parse(localStorage.getItem('quizHistory')) || {};
    historyData[historyKey] = { score: score, total: currentQuiz.length };
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
        
        // تجهيز عرض الإجابات (للمراجعة)
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

// --- (تعديل هام) ربط الأزرار عند تحميل الصفحة ---
document.addEventListener("DOMContentLoaded", () => {
    
    // ربط أزرار التنقل والمراجعة (هذا هو الجزء الذي كان ناقصاً)
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.getElementById('review-container').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    });

    // تشغيل المادة الافتراضية
    selectSubject('microbiology'); 
});

// أدوات مساعدة
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
