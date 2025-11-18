// --- Global State ---
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = []; // Store answers {qIndex: 0, answer: 1, isCorrect: true}
let quizTitle = "";
let currentBankId = ""; // (جديد) لتخزين اسم البنك الحالي
let currentQuizId = ""; // (جديد) لتخزين اسم الكويز الحالي

// (جديد) متغيرات العداد
let timerInterval = null;
let secondsElapsed = 0;

// (جديد) متغيرات لتخزين الأسئلة والملفات التي تم تحميلها
let quizDataBank = {}; 
let loadedScripts = {}; 


// ======================================================
// (جديد) كود الوضع الليلي (Dark Mode)
// ======================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

// 1. التحقق من الوضع المحفوظ في الذاكرة عند التحميل
if (localStorage.getItem('theme') === 'dark') {
    bodyElement.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️'; // تغيير الأيقونة لشمس
}

// 2. تفعيل الزرار
themeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    
    if (bodyElement.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }
});


/**
 * Shuffles an array in place.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * (جديد) دالة لتحديث عداد الوقت كل ثانية
 */
function updateTimer() {
  secondsElapsed++;
  const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
  const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
  
  const timerElement = document.getElementById("quiz-timer");
  if (timerElement) {
    timerElement.textContent = `${minutes}:${seconds}`;
  }
}

/**
 * Handles switching tabs.
 */
function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const tabToShow = document.getElementById(tabName);
  if(tabToShow) {
    tabToShow.classList.add("active");
  }
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

/**
 * (جديد) تحديث واجهة المستخدم بالنتائج المحفوظة
 * هذه الدالة تبحث في كل كروت الأسئلة وتضيف شارة النتيجة إذا وجدت
 */
function updateQuizCardsWithHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
    
    document.querySelectorAll('.quiz-card').forEach(card => {
        const bank = card.dataset.bank;
        const quizId = card.dataset.quiz;
        const key = `${bank}_${quizId}`;
        
        if (savedHistory[key]) {
            const history = savedHistory[key];
            // التحقق هل الشارة موجودة بالفعل أم لا لتجنب التكرار
            let badge = card.querySelector('.history-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'history-badge';
                card.appendChild(badge);
            }
            badge.innerHTML = `✅ تم حله: ${history.score}/${history.total}`;
        }
    });
}

/**
 * دالة تحميل ملف الأسئلة
 */
function loadScript(src, callback, errorCallback) {
  const cleanSrc = src.split('?')[0];
  if (loadedScripts[cleanSrc]) {
    console.log(`Script ${cleanSrc} already loaded.`);
    if (callback) callback();
    return;
  }
  
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    console.log(`Script loaded: ${src}`);
    loadedScripts[cleanSrc] = true;
    if (callback) callback();
  };
  script.onerror = () => {
    console.error(`Failed to load: ${src}`);
    if (errorCallback) errorCallback();
  };
  document.head.appendChild(script);
}


/**
 * (معدل) يبدأ اختباراً محدداً
 */
function startQuiz(bank, quizId) {

  const runQuiz = () => {
    const bankData = quizDataBank[bank];
    
    if (!bankData) {
      document.getElementById("quiz-selection").innerHTML = `<p class="coming-soon">خطأ فادح: بيانات المادة (${bank}) غير موجودة.</p>`;
      return;
    }

    if (!bankData[quizId] || !bankData[quizId].questions) {
      const tabToShow = document.getElementById(bank);
      if (tabToShow) {
        tabToShow.innerHTML = `<p class="coming-soon">خطأ: لم يتم العثور على الاختبار (${quizId}).</p>`;
      }
      openTab(bank);
      return;
    }
    
    // (جديد) حفظ المعرفات الحالية لاستخدامها لاحقاً
    currentBankId = bank;
    currentQuizId = quizId;

    const quiz = bankData[quizId];
    currentQuiz = shuffleArray([...quiz.questions]);
    quizTitle = quiz.title;
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null); 

    // تصفير العداد وبدء الجديد
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    document.getElementById("quiz-timer").textContent = "00:00";
    timerInterval = setInterval(updateTimer, 1000);

    document.getElementById("current-quiz-title").textContent = quizTitle;
    
    document.getElementById("quiz-selection").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("review-container").style.display = "none";

    displayQuestion();
    updateNavigation();
  };

  // Check if data exists or load it
  if (quizDataBank[bank]) {
    runQuiz();
  } else {
    const scriptSrc = `questions/${bank}_questions.js?v=1.1`; 
    
    loadScript(scriptSrc,
      () => {
        const dataVarName = `${bank}Data`;
        if (typeof window[dataVarName] !== 'undefined') {
          quizDataBank[bank] = window[dataVarName];
          runQuiz();
        } else {
            // Error handling
        }
      },
      () => {
          // Error handling
      }
    );
  }
}

/**
 * يعرض السؤال الحالي
 */
function displayQuestion() {
  if (currentQuestionIndex >= currentQuiz.length) {
    showResults();
    return;
  }

  const questionData = currentQuiz[currentQuestionIndex];
  const questionContainer = document.getElementById("question-container");
  const userAnswer = userAnswers[currentQuestionIndex];

  let optionsHTML = '';
  
  const isRtlQuestion = questionData.q.startsWith("البكتيريا") || questionData.q.includes("صح وخطأ");
  const textClass = isRtlQuestion ? "rtl" : "";

  if (questionData.type === "mcq") {
    optionsHTML = '<div class="answer-options">';
    optionsHTML += questionData.options.map((option, index) => {
      let btnClass = "answer-btn";
      if (userAnswer !== null && userAnswer.answer === index) {
        btnClass += " selected";
      }
      const optionClass = isRtlQuestion ? "rtl" : "";
      return `<button class="${btnClass} ${optionClass}" data-option-index="${index}">${option}</button>`;
    }).join('');
     optionsHTML += '</div>';
  } else if (questionData.type === "tf") {
    optionsHTML = '<div class="tf-options">';
    optionsHTML += `
      <button class="answer-btn ${userAnswer !== null && userAnswer.answer === true ? 'selected' : ''}" data-tf-value="true">
        True
      </button>
      <button class="answer-btn ${userAnswer !== null && userAnswer.answer === false ? 'selected' : ''}" data-tf-value="false">
        False
      </button>
    `;
     optionsHTML += '</div>';
  }
 
  questionContainer.innerHTML = `
        <div class="question-card">
          <div class="question-number">السؤال ${currentQuestionIndex + 1}</div>
          <div class="question-text ${textClass}">${questionData.q}</div>
          ${optionsHTML}

          ${questionData.hint ? `
            <div class="hint-container">
                <button class="hint-btn">إظهار التلميح</button>
                <p class="hint-text">${questionData.hint}</p>
            </div>
          ` : ''}
        </div>
    `;

  attachQuestionListeners();
  updateProgressBar();
}

function attachQuestionListeners() {
    document.querySelectorAll('.answer-btn').forEach(btn => {
        if (btn.dataset.optionIndex) {
             btn.addEventListener('click', () => {
                selectOption(parseInt(btn.dataset.optionIndex, 10));
            });
        } else if (btn.dataset.tfValue) {
            btn.addEventListener('click', () => {
                selectTF(btn.dataset.tfValue === 'true');
            });
        }
    });

    const hintBtn = document.querySelector('.hint-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', (e) => {
            e.target.closest('.hint-container').classList.add('active');
            e.target.style.display = 'none';
        });
    }
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
  document.getElementById("progress-fill").style.width = `${progress}%`;
  document.getElementById("question-counter").textContent = `السؤال ${currentQuestionIndex + 1} من ${currentQuiz.length}`;
}

function goBack() {
  if (timerInterval) clearInterval(timerInterval);
  secondsElapsed = 0;
  document.getElementById("quiz-timer").textContent = "00:00";

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("results").style.display = "none";
  document.getElementById("review-container").style.display = "none";
  
  const quizSelectionEl = document.getElementById("quiz-selection");
  if (quizSelectionEl) {
      quizSelectionEl.style.display = "block";
      // (جديد) تحديث الكروت بالنتائج الجديدة عند العودة
      updateQuizCardsWithHistory();
  }

  const activeTabBtn = document.querySelector('.tab-btn.active');
  const tabId = activeTabBtn ? activeTabBtn.dataset.tab : 'microbiology';
  openTab(tabId);
}

function showResultsScreen() {
    document.getElementById("review-container").style.display = "none";
    document.getElementById("results").style.display = "block";
}

function selectOption(optionIndex) {
  const question = currentQuiz[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = {
    answer: optionIndex,
    isCorrect: (optionIndex === question.a)
  };
  displayQuestion();
}

function selectTF(isTrue) {
  const question = currentQuiz[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = {
    answer: isTrue,
    isCorrect: (isTrue === question.a)
  };
  displayQuestion();
}

function updateNavigation() {
  document.getElementById("prev-btn").disabled = (currentQuestionIndex === 0);
  if (currentQuestionIndex === currentQuiz.length - 1) {
    document.getElementById("next-btn").textContent = "إنهاء الاختبار";
  } else {
    document.getElementById("next-btn").textContent = "التالي";
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
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

/**
 * (معدل) حساب النتيجة + حفظها في LocalStorage
 */
function showResults() {
  if (timerInterval) clearInterval(timerInterval);

  let score = 0;
  userAnswers.forEach(answer => {
    if (answer && answer.isCorrect) {
      score++;
    }
  });

  const total = currentQuiz.length;
  
  // ======================================================
  // (جديد) حفظ النتيجة في الذاكرة
  // ======================================================
  const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};
  // المفتاح هيكون مميز باستخدام اسم البنك واسم الكويز
  const key = `${currentBankId}_${currentQuizId}`;
  
  // نحفظ النتيجة فقط لو كانت أحسن (اختياري) أو نحفظ آخر محاولة
  // هنا هنحفظ آخر محاولة
  savedHistory[key] = {
      score: score,
      total: total,
      date: new Date().toISOString()
  };
  
  localStorage.setItem('quizHistory', JSON.stringify(savedHistory));
  // ======================================================

  const percentage = (score / total) * 100;
  const scoreEl = document.getElementById("final-score");
  const messageEl = document.getElementById("score-message");

  scoreEl.textContent = `${score} / ${total}`;
  
  let message = "نتيجة جيدة!";
  if (percentage >= 90) {
    message = "ممتاز! أحسنت.";
  } else if (percentage >= 75) {
    message = "جيد جداً، استمر.";
  } else if (percentage < 50) {
    message = "تحتاج للمزيد من المراجعة. بالتوفيق المرة القادمة!";
  }

  const finalTime = document.getElementById("quiz-timer").textContent;
  messageEl.textContent = `${message} | الوقت المستغرق: ${finalTime}`;

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("review-container").style.display = "none";
  document.getElementById("results").style.display = "block";
}

/**
 * (معدل) يعرض المراجعة مع الشرح (إذا وجد)
 */
function showReview() {
  const reviewContent = document.getElementById("review-content");
  reviewContent.innerHTML = ""; 

  currentQuiz.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = question.a;
    const isCorrect = userAnswer ? userAnswer.isCorrect : false;

    let optionsReviewHtml = '';
    
    const isRtlQuestion = question.q.startsWith("البكتيريا") || question.q.includes("صح وخطأ");
    const textClass = isRtlQuestion ? "rtl" : "";
    const optionClass = isRtlQuestion ? "rtl" : "";

    if (question.type === "mcq") {
      optionsReviewHtml = question.options.map((option, i) => {
        let className = 'review-option';
        if (i === correctAnswer) {
          className += ' correct';
        } else if (userAnswer && i === userAnswer.answer && !isCorrect) {
          className += ' user-incorrect';
        }
        return `<div class="${className} ${optionClass}">${option}</div>`;
      }).join('');
    } else if (question.type === "tf") {
      optionsReviewHtml = `
        <div class="review-option ${correctAnswer === true ? 'correct' : ''} ${userAnswer && userAnswer.answer === true && !isCorrect ? 'user-incorrect' : ''}">
          True
        </div>
        <div class="review-option ${correctAnswer === false ? 'correct' : ''} ${userAnswer && userAnswer.answer === false && !isCorrect ? 'user-incorrect' : ''}">
          False
        </div>
      `;
    }

    // ======================================================
    // (جديد) إضافة الشرح إذا كان موجوداً في بيانات السؤال
    // ======================================================
    let explanationHtml = '';
    if (question.explanation) {
        explanationHtml = `
            <div class="explanation-box">
                <strong>💡 Explanation:</strong><br>
                ${question.explanation}
            </div>
        `;
    }

    reviewContent.innerHTML += `
        <div class="review-question">
          <div class="question-number">السؤال ${index + 1}</div>
          <div class="question-text ${textClass}">${question.q}</div>
          ${optionsReviewHtml}
          ${explanationHtml} <!-- إضافة الشرح هنا -->
        </div>
    `;
  });

  document.getElementById("results").style.display = "none";
  document.getElementById("review-container").style.display = "block";
}

function initializeEventListeners() {
  console.log("Initializing event listeners...");
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll('.quiz-card').forEach(card => {
    card.addEventListener('click', () => {
      startQuiz(card.dataset.bank, card.dataset.quiz);
    });
  });
  
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('review-btn').addEventListener('click', showReview);
  
   document.getElementById('back-to-results').addEventListener('click', showResultsScreen);

  document.querySelectorAll('.go-back').forEach(btn => {
    btn.addEventListener('click', goBack);
  });
  console.log("Event listeners initialized.");
}

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.tab-content').forEach(tab => {
        if(tab.children.length > 1 || (tab.children.length === 1 && tab.children[0]?.classList.contains('quiz-card'))) {
            // content exists
        } else if (tab.children.length === 1 && tab.children[0]?.classList.contains('coming-soon')) {
            // coming soon msg exists
        } else if (tab.children.length === 0) {
            tab.innerHTML = '<p class="coming-soon">الأسئلة قادمة قريباً...</p>';
        }
    });
    
    openTab('microbiology'); 
    
    // (جديد) استدعاء دالة تحديث النتائج المحفوظة عند فتح الموقع
    updateQuizCardsWithHistory();
    
    initializeEventListeners(); 
});
