// --- Global State ---
let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = []; // Store answers {qIndex: 0, answer: 1, isCorrect: true}
let quizTitle = "";

// (جديد) متغيرات العداد
let timerInterval = null;
let secondsElapsed = 0;

// (جديد) متغيرات لتخزين الأسئلة والملفات التي تم تحميلها
let quizDataBank = {}; // سيخزن البيانات الفعلية (e.g., quizDataBank['microbiology'] = { ... })
let loadedScripts = {}; // سيتتبع الملفات التي تم تحميلها (e.g., loadedScripts['microbiology_questions.js'] = true)


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
 * (جديد) دالة تحميل ملف الأسئلة ديناميكياً
 * @param {string} src - The script source URL (e.g., 'microbiology_questions.js')
 * @param {function} callback - Function to run on successful load
 * @param {function} errorCallback - Function to run on error
 */
function loadScript(src, callback, errorCallback) {
  // 1. إذا تم تحميل الملف من قبل، فقط نفذ الكول باك
  // (تعديل) التأكد من اسم الملف بدون علامة الكاش
  const cleanSrc = src.split('?')[0];
  if (loadedScripts[cleanSrc]) {
    console.log(`Script ${cleanSrc} already loaded, executing callback.`);
    if (callback) callback();
    return;
  }
  
  // 2. إذا لم يتم تحميله، قم بإنشاء عنصر سكريبت جديد
  const script = document.createElement('script');
  script.src = src;

  // 3. عند التحميل الناجح
  script.onload = () => {
    console.log(`Script loaded successfully: ${src}`);
    loadedScripts[cleanSrc] = true; // ضع علامة أنه تم تحميله
    if (callback) callback();
  };

  // 4. عند الفشل في التحميل
  script.onerror = () => {
    console.error(`Failed to load script: ${src}`);
    if (errorCallback) errorCallback();
  };

  // 5. أضف السكريبت إلى الـ head لبدء التحميل
  document.head.appendChild(script);
}


/**
 * (معدل) يبدأ اختباراً محدداً عن طريق تحميل السكريبت الخاص به أولاً
 */
function startQuiz(bank, quizId) {

  // --- (جديد) دالة داخلية لبدء الاختبار الفعلي (بعد التأكد من تحميل البيانات) ---
  const runQuiz = () => {
    // 1. احصل على بيانات المادة من المخزن
    const bankData = quizDataBank[bank]; // e.g., quizDataBank['microbiology']
    
    if (!bankData) {
      console.error(`Data for bank '${bank}' is missing even after script load.`);
      // (تعديل) استخدام رسالة خطأ مخصصة بدلاً من alert
      document.getElementById("quiz-selection").innerHTML = `<p class="coming-soon">خطأ فادح: بيانات المادة (${bank}) غير موجودة.</p>`;
      return;
    }

    // 2. تأكد من وجود الاختبار (quizId) داخل بيانات المادة
    if (!bankData[quizId] || !bankData[quizId].questions) {
      console.error("Quiz not found or empty!", bank, quizId);
      const tabToShow = document.getElementById(bank);
      if (tabToShow) {
        tabToShow.innerHTML = `<p class="coming-soon">خطأ: لم يتم العثور على الاختبار (${quizId}).</p>`;
      }
      openTab(bank); // افتح التاب ليرى المستخدم الرسالة
      return;
    }
    
    // 3. (نفس الكود القديم) إذا وجد الاختبار، ابدأه
    const quiz = bankData[quizId];
    currentQuiz = shuffleArray([...quiz.questions]);
    quizTitle = quiz.title;
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null); 

    // (جديد) بدء/تصفير عداد الوقت
    if (timerInterval) clearInterval(timerInterval); // إيقاف أي عداد قديم
    secondsElapsed = 0;
    document.getElementById("quiz-timer").textContent = "00:00";
    timerInterval = setInterval(updateTimer, 1000); // بدء عداد جديد

    document.getElementById("current-quiz-title").textContent = quizTitle;
    
    // (تعديل) التأكد من استهداف الـ ID الصحيح
    const quizSelectionEl = document.getElementById("quiz-selection");
    if (quizSelectionEl) {
        quizSelectionEl.style.display = "none";
    } else {
        console.error("Could not find #quiz-selection element to hide.");
    }
    
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("review-container").style.display = "none";

    displayQuestion();
    updateNavigation();
  };
  // --- نهاية دالة runQuiz ---


  // --- المنطق الرئيسي لدالة startQuiz ---

  // 1. هل بيانات المادة (bank) موجودة بالفعل في المخزن؟
  if (quizDataBank[bank]) {
    // نعم، تم تحميلها من قبل. ابدأ الاختبار فوراً.
    console.log(`Data for '${bank}' already in bank. Running quiz.`);
    runQuiz();
  } else {
    // لا، لم يتم تحميلها. قم بتحميل السكريبت الخاص بها.
    
    // ======================================================
    // (*** هذا هو السطر الذي يستخدم اسم ملفك الصحيح ***)
    // ======================================================
    const scriptSrc = `${bank}_questions.js?v=1.1`; // e.g., "microbiology_questions.js?v=1.1"
    
    console.log(`Data for '${bank}' not found. Loading script: ${scriptSrc}`);

    loadScript(scriptSrc,
      // --- دالة النجاح (Callback) ---
      () => {
        // السكريبت يجب أن يُعرف متغيراً بالاسم المطابق للمادة
        const dataVarName = `${bank}Data`; // e.g., "microbiologyData"
        
        if (typeof window[dataVarName] !== 'undefined') {
          // نجح! قم بتخزين البيانات في المخزن الرئيسي
          quizDataBank[bank] = window[dataVarName];
          console.log(`Successfully loaded and stored data for '${bank}'.`);
          // الآن ابدأ الاختبار
          runQuiz();
        } else {
          // السكريبت تم تحميله، لكنه لا يحتوي على المتغير المتوقع
          console.error(`Script ${scriptSrc} loaded, but did not define ${dataVarName}.`);
          const tabToShow = document.getElementById(bank);
          if(tabToShow) {
            tabToShow.innerHTML = `<p class="coming-soon">خطأ في ملف الأسئلة (${scriptSrc}). قريباً...</p>`;
          }
          openTab(bank);
        }
      },
      // --- دالة الفشل (Error Callback) ---
      () => {
        // فشل تحميل السكريبت (e.g., 404 Not Found)
        console.error(`Failed to load script: ${scriptSrc}. Marking as 'Coming Soon'.`);
        const tabToShow = document.getElementById(bank);
        if(tabToShow) {
          tabToShow.innerHTML = `<p class="coming-soon">فشل تحميل ملف الأسئلة (${scriptSrc}). قريباً...</p>`;
        }
        openTab(bank);
      }
    );
  }
}

/**
 * يعرض السؤال الحالي بالـ HTML المتوافق مع الثيم الجديد
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
  
  // (تعديل) تحديد اتجاه النص للأسئلة العربية
  // هذا السطر بيبحث عن كلمات عربية. بما إن كل أسئلة المايكرو إنجليزي، هيفضل false
  const isRtlQuestion = questionData.q.startsWith("البكتيريا") || questionData.q.includes("صح وخطأ");
  const textClass = isRtlQuestion ? "rtl" : "";

  if (questionData.type === "mcq") {
    optionsHTML = '<div class="answer-options">';
    optionsHTML += questionData.options.map((option, index) => {
      let btnClass = "answer-btn";
      if (userAnswer !== null && userAnswer.answer === index) {
        btnClass += " selected";
      }
      // (تعديل) تطبيق الكلاس العربي على الأزرار إذا لزم الأمر
      const optionClass = isRtlQuestion ? "rtl" : "";
      return `<button class="${btnClass} ${optionClass}" data-option-index="${index}">${option}</button>`;
    }).join('');
     optionsHTML += '</div>';
  } else if (questionData.type === "tf") {
    // ======================================================
    // (*** هذا هو الكود الذي تم تعديله ***)
    // ======================================================
    optionsHTML = '<div class="tf-options">'; // Use the specific TF wrapper
    optionsHTML += `
      <button class="answer-btn ${userAnswer !== null && userAnswer.answer === true ? 'selected' : ''}" data-tf-value="true">
        True
      </button>
      <button class="answer-btn ${userAnswer !== null && userAnswer.answer === false ? 'selected' : ''}" data-tf-value="false">
        False
      </button>
    `;
     optionsHTML += '</div>';
     // ======================================================
     // (*** نهاية الكود المعدل ***)
     // ======================================================
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

/**
 * يربط المستمعين لأزرار الإجابات والتلميح
 */
function attachQuestionListeners() {
    // 1. مستمعين أزرار الإجابات
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

    // 2. (جديد) مستمع لزر التلميح
    const hintBtn = document.querySelector('.hint-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', (e) => {
            // تفعيل الحاوية لإظهار النص
            e.target.closest('.hint-container').classList.add('active');
            // إخفاء الزر نفسه بعد الضغط عليه
            e.target.style.display = 'none';
        });
    }
}


/**
 * Updates the visual progress bar and question counter.
 */
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
  document.getElementById("progress-fill").style.width = `${progress}%`;
  document.getElementById("question-counter").textContent = `السؤال ${currentQuestionIndex + 1} من ${currentQuiz.length}`;
}

/**
 * Returns the user to the main quiz selection screen.
 */
function goBack() {
  // (جديد) إيقاف العداد عند العودة للقائمة
  if (timerInterval) clearInterval(timerInterval);
  secondsElapsed = 0;
  document.getElementById("quiz-timer").textContent = "00:00";

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("results").style.display = "none";
  document.getElementById("review-container").style.display = "none";
  
  // (تعديل) التأكد من استهداف الـ ID الصحيح
  const quizSelectionEl = document.getElementById("quiz-selection");
  if (quizSelectionEl) {
      quizSelectionEl.style.display = "block";
  }

  const activeTabBtn = document.querySelector('.tab-btn.active');
  const tabId = activeTabBtn ? activeTabBtn.dataset.tab : 'microbiology';
  openTab(tabId);
}

/**
 * وظيفة للرجوع من شاشة المراجعة إلى شاشة النتائج
 */
function showResultsScreen() {
    document.getElementById("review-container").style.display = "none";
    document.getElementById("results").style.display = "block";
}


/**
 * منطق اختيار الإجابة (MCQ) - يخزن الإجابة ويعيد العرض
 */
function selectOption(optionIndex) {
  const question = currentQuiz[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = {
    answer: optionIndex,
    isCorrect: (optionIndex === question.a)
  };
  displayQuestion(); // Just re-render to show the "selected" class
}

/**
 * منطق اختيار الإجابة (TF) - يخزن الإجابة ويعيد العرض
 */
function selectTF(isTrue) {
  const question = currentQuiz[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = {
    answer: isTrue,
    isCorrect: (isTrue === question.a)
  };
  displayQuestion(); // Just re-render to show the "selected" class
}

/**
 * Enables or disables the Next/Prev navigation buttons.
 */
function updateNavigation() {
  document.getElementById("prev-btn").disabled = (currentQuestionIndex === 0);
  if (currentQuestionIndex === currentQuiz.length - 1) {
    document.getElementById("next-btn").textContent = "إنهاء الاختبار";
  } else {
    document.getElementById("next-btn").textContent = "التالي";
  }
}

/**
 * Moves to the next question or finishes the quiz.
 */
function nextQuestion() {
  if (userAnswers[currentQuestionIndex] == null) {
      // (اختياري) يمكنك إلغاء التعليق عن هذا السطر لإجبار المستخدم على الإجابة
      // console.log("الرجاء اختيار إجابة أولاً");
      // return;
  }
    
  if (currentQuestionIndex < currentQuiz.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
  }
  updateNavigation();
}

/**
 * Moves to the previous question.
 */
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
  updateNavigation();
}

/**
 * Calculates and displays the final score.
 */
function showResults() {
  // (جديد) إيقاف العداد عند إظهار النتائج
  if (timerInterval) clearInterval(timerInterval);

  let score = 0;
  userAnswers.forEach(answer => {
    if (answer && answer.isCorrect) {
      score++;
    }
  });

  const total = currentQuiz.length;
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

  // (جديد) إضافة الوقت المستغرق لرسالة النتيجة
  const finalTime = document.getElementById("quiz-timer").textContent;
  messageEl.textContent = `${message} | الوقت المستغرق: ${finalTime}`;

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("review-container").style.display = "none";
  document.getElementById("results").style.display = "block";
}

/**
 * يعرض المراجعة بالـ HTML المتوافق مع الثيم الجديد
 */
function showReview() {
  const reviewContent = document.getElementById("review-content");
  reviewContent.innerHTML = ""; 

  currentQuiz.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = question.a;
    const isCorrect = userAnswer ? userAnswer.isCorrect : false;

    let optionsReviewHtml = '';
    
    // (تعديل) تحديد اتجاه النص للأسئلة العربية
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
      // ======================================================
      // (*** هذا هو الكود الذي تم تعديله ***)
      // ======================================================
      optionsReviewHtml = `
        <div class="review-option ${correctAnswer === true ? 'correct' : ''} ${userAnswer && userAnswer.answer === true && !isCorrect ? 'user-incorrect' : ''}">
          True
        </div>
        <div class="review-option ${correctAnswer === false ? 'correct' : ''} ${userAnswer && userAnswer.answer === false && !isCorrect ? 'user-incorrect' : ''}">
          False
        </div>
      `;
      // ======================================================
      // (*** نهاية الكود المعدل ***)
      // ======================================================
    }

    reviewContent.innerHTML += `
        <div class="review-question">
          <div class="question-number">السؤال ${index + 1}</div>
          <div class="question-text ${textClass}">${question.q}</div>
          ${optionsReviewHtml}
        </div>
    `;
  });

  document.getElementById("results").style.display = "none";
  document.getElementById("review-container").style.display = "block";
}

/**
 * (البرمجة الوظيفية) يربط كل المستمعين عند تحميل الصفحة
 */
function initializeEventListeners() {
  console.log("Initializing event listeners...");
  // 1. Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openTab(btn.dataset.tab);
    });
  });

  // 2. Quiz cards
  // (تعديل!) المستمع هو نفسه، لكن الدالة التي يستدعيها (startQuiz) أصبحت معدلة
  document.querySelectorAll('.quiz-card').forEach(card => {
    card.addEventListener('click', () => {
        console.log(`Quiz card clicked. Bank: ${card.dataset.bank}, Quiz: ${card.dataset.quiz}`);
      startQuiz(card.dataset.bank, card.dataset.quiz);
    });
  });
  
  // 3. Navigation buttons
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('review-btn').addEventListener('click', showReview);
  
  // 4. زر العودة من المراجعة للنتائج
   document.getElementById('back-to-results').addEventListener('click', showResultsScreen);


  // 5. All "Go Back" (to main menu) buttons
  document.querySelectorAll('.go-back').forEach(btn => {
    btn.addEventListener('click', goBack);
  });
  console.log("Event listeners initialized.");
}

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
    // ... (نفس الكود الخاص بالتحقق من التاب) ...
    document.querySelectorAll('.tab-content').forEach(tab => {
        if(tab.children.length > 1 || (tab.children.length === 1 && tab.children[0]?.classList.contains('quiz-card'))) {
            // This tab has cards, do nothing
        } else if (tab.children.length === 1 && tab.children[0]?.classList.contains('coming-soon')) {
            // This tab already has the "coming soon" message
        } else if (tab.children.length === 0) {
            // This tab is empty
            tab.innerHTML = '<p class="coming-soon">الأسئلة قادمة قريباً...</p>';
        }
    });
    
    openTab('microbiology'); // افتح التبويب الافتراضي
    initializeEventListeners(); // اربط كل الأزرار
});
