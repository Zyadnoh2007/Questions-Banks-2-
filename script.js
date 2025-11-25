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

// --- Global State ---
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

// البيانات المضافة يدوياً فقط
let customConfig = {
    subjects: JSON.parse(localStorage.getItem('custom_subjects_list')) || [],
    sources: JSON.parse(localStorage.getItem('custom_sources_list')) || []
};

// --- دوال الدخول (في البداية) ---
window.saveStudentName = async function() {
    const nameInput = document.getElementById('student-name-input').value.trim();
    const errorMsg = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    if (nameInput.length < 3) {
        errorMsg.textContent = "الاسم قصير جداً";
        errorMsg.style.display = "block";
        return;
    }

    if (!db) { completeLogin(nameInput); return; }

    btn.textContent = "جاري التحقق...";
    btn.disabled = true;

    try {
        const userRef = db.collection('users').doc(nameInput);
        const doc = await userRef.get();

        if (doc.exists) {
            if (localStorage.getItem('studentName') === nameInput) {
                completeLogin(nameInput); 
            } else {
                errorMsg.textContent = "هذا الاسم مستخدم بالفعل";
                errorMsg.style.display = "block";
                btn.textContent = "دخول";
                btn.disabled = false;
            }
        } else {
            await userRef.set({
                name: nameInput,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            completeLogin(nameInput);
        }
    } catch (error) {
        console.error(error);
        completeLogin(nameInput);
    }
};

function completeLogin(name) {
    currentStudentName = name;
    localStorage.setItem('studentName', name);
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    const btn = document.getElementById('login-btn');
    if(btn) { btn.textContent = "دخول"; btn.disabled = false; }
}

window.logoutUser = function() {
    if(confirm("هل تريد تسجيل الخروج؟")) {
        localStorage.removeItem('studentName');
        location.reload();
    }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    renderAppUI();

    if (!currentStudentName) {
        document.getElementById('welcome-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-modal').style.display = 'none';
        document.getElementById('welcome-message').textContent = `أهلاً بك يا دكتور/ة ${currentStudentName} 👋`;
    }

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('review-btn').addEventListener('click', showReview);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    hideAllViews();
    document.getElementById('main-nav').style.display = 'flex';
    selectSubject('microbiology');
    
    listenToCloudNews();
});

// --- 🛠️ دوال الواجهة (الدمج الذكي) ---
function renderAppUI() {
    const navContainer = document.getElementById('main-nav');
    const srcContainer = document.getElementById('source-selection');

    // إزالة العناصر الديناميكية القديمة (التي لها كلاس dynamic-item)
    document.querySelectorAll('.dynamic-item').forEach(e => e.remove());

    // 1. إضافة المواد الجديدة جنب القديمة
    customConfig.subjects.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = `tab-btn dynamic-item ${sub.id === currentSubject ? 'active' : ''}`;
        btn.textContent = sub.name;
        btn.onclick = () => selectSubject(sub.id);
        navContainer.appendChild(btn);
    });

    // 2. إضافة المصادر الجديدة (مع الفلترة)
    customConfig.sources.forEach(src => {
        // إظهار المصدر فقط إذا كان مخصص للمادة الحالية أو لكل المواد
        if(!src.targetSubject || src.targetSubject === 'all' || src.targetSubject === currentSubject) {
            const div = document.createElement('div');
            div.className = 'source-card dynamic-item';
            div.onclick = () => loadQuizSource(src.id);
            div.innerHTML = `<h3>${src.name}</h3><p>${src.desc || 'مصدر إضافي'}</p>`;
            srcContainer.appendChild(div);
        }
    });

    // 3. تحديث قوائم الأدمن
    updateAdminSelects();
    renderSettingsLists();
}

function updateAdminSelects() {
    // تجميع كل المواد (من الـ HTML ومن الذاكرة)
    const allSubjects = [];
    // المواد الثابتة
    document.querySelectorAll('#main-nav .tab-btn:not(.dynamic-item)').forEach(btn => {
        const onclickText = btn.getAttribute('onclick');
        if(onclickText) {
            const match = onclickText.match(/'([^']+)'/);
            if(match) allSubjects.push({ id: match[1], name: btn.textContent });
        }
    });
    // المواد الجديدة
    customConfig.subjects.forEach(s => allSubjects.push(s));

    // تجميع المصادر
    const allSources = [
        {id:'bank', name:'بنك الأسئلة'},
        {id:'doctor', name:'كويزات الدكتور'}
    ];
    customConfig.sources.forEach(s => allSources.push(s));

    // تعبئة قوائم إضافة امتحان
    const subSelect = document.getElementById('admin-sub-select');
    const srcSelect = document.getElementById('admin-src-select');
    if(subSelect) subSelect.innerHTML = allSubjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    if(srcSelect) srcSelect.innerHTML = allSources.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // تعبئة قائمة "اختيار المادة للمصدر الجديد"
    const targetSelect = document.getElementById('new-source-target-subject');
    if(targetSelect) {
        targetSelect.innerHTML = `<option value="all">لكل المواد (عام)</option>` + 
            allSubjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

// --- ⚙️ إدارة الإعدادات ---
window.addNewSubject = function() {
    const name = document.getElementById('new-subject-name').value.trim();
    if(!name) return alert('اكتب اسم المادة');
    const id = name.toLowerCase().replace(/\s+/g, '_');
    
    // التحقق
    const exists = Array.from(document.querySelectorAll('#main-nav .tab-btn')).some(b => b.textContent === name);
    if(exists) return alert('موجود بالفعل');

    customConfig.subjects.push({ id, name });
    localStorage.setItem('custom_subjects_list', JSON.stringify(customConfig.subjects));
    
    document.getElementById('new-subject-name').value = '';
    renderAppUI();
    alert('تمت الإضافة ✅');
};

window.addNewSource = function() {
    const name = document.getElementById('new-source-name').value.trim();
    const targetSub = document.getElementById('new-source-target-subject').value;

    if(!name) return alert('اكتب اسم المصدر');
    const id = name.toLowerCase().replace(/\s+/g, '_');

    if(id === 'bank' || id === 'doctor' || customConfig.sources.some(s => s.id === id)) return alert('موجود بالفعل');

    customConfig.sources.push({ id, name, targetSubject: targetSub });
    localStorage.setItem('custom_sources_list', JSON.stringify(customConfig.sources));
    
    document.getElementById('new-source-name').value = '';
    renderAppUI();
    alert('تمت الإضافة ✅');
};

function renderSettingsLists() {
    const subList = document.getElementById('subjects-list');
    const srcList = document.getElementById('sources-list');
    
    subList.innerHTML = customConfig.subjects.map(s => 
        `<span class="tag-item">${s.name} <b onclick="deleteItem('subject', '${s.id}')" style="color:red; cursor:pointer;">×</b></span>`
    ).join('');

    srcList.innerHTML = customConfig.sources.map(s => 
        `<span class="tag-item">${s.name} (${s.targetSubject==='all'?'عام':s.targetSubject}) <b onclick="deleteItem('source', '${s.id}')" style="color:red; cursor:pointer;">×</b></span>`
    ).join('');
}

window.deleteItem = function(type, id) {
    if(!confirm('حذف هذا العنصر؟')) return;
    if(type === 'subject') {
        customConfig.subjects = customConfig.subjects.filter(s => s.id !== id);
        localStorage.setItem('custom_subjects_list', JSON.stringify(customConfig.subjects));
    } else {
        customConfig.sources = customConfig.sources.filter(s => s.id !== id);
        localStorage.setItem('custom_sources_list', JSON.stringify(customConfig.sources));
    }
    renderAppUI();
};

// --- Danger Zone (حذف البيانات) ---
window.deleteAllStudents = async function() {
    if(!db) return alert("يجب توفر انترنت");
    if(!confirm("تحذير! سيتم حذف جميع الطلاب.")) return;
    const p = prompt("اكتب admin123 للتأكيد:");
    if(p!=="admin123") return alert("خطأ");
    try {
        const s = await db.collection('users').get();
        const b = db.batch();
        s.docs.forEach(d => b.delete(d.ref));
        await b.commit();
        alert("تم الحذف");
    } catch(e) { alert("خطأ"); }
};

window.deleteAllResults = async function() {
    if(!db) return alert("يجب توفر انترنت");
    if(!confirm("تحذير! سيتم حذف جميع النتائج.")) return;
    const p = prompt("اكتب admin123 للتأكيد:");
    if(p!=="admin123") return alert("خطأ");
    try {
        const s = await db.collection('exam_results').get();
        const b = db.batch();
        s.docs.forEach(d => b.delete(d.ref));
        await b.commit();
        alert("تم الحذف");
        fetchAdminData();
    } catch(e) { alert("خطأ"); }
};

// --- Navigation ---
window.selectSubject = function(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // بحث عن الزر (ثابت أو جديد) وتفعيله
    // استخدام دالة البحث بالـ onclick عشان نضمن نجيب الزر الصح
    let btn = null;
    const allBtns = document.querySelectorAll('.tab-btn');
    for(let b of allBtns) {
        if(b.getAttribute('onclick').includes(`'${subject}'`)) {
            btn = b;
            break;
        }
    }
    if(btn) btn.classList.add('active');
    
    // إعادة الرسم لتحديث المصادر الظاهرة
    renderAppUI();
    
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

// --- Admin Auth ---
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
        document.getElementById('admin-news-input').value = localStorage.getItem('siteNews') || '';
        updateAdminSelects();
    } else {
        err.style.display = "block";
    }
};

// --- News & Excel (Same as before) ---
window.updateCloudNews = function() { const t = document.getElementById('admin-news-input').value.trim(); if(db) db.collection('settings').doc('news').set({ text: t }).then(()=>alert('تم')).catch(e=>alert('خطأ')); else alert('مطلوب نت'); };
function listenToCloudNews() { if(db) db.collection('settings').doc('news').onSnapshot(d=>{ if(d.exists&&d.data().text) { document.getElementById('news-text').textContent=d.data().text; document.getElementById('news-ticker-bar').style.display='flex'; } else document.getElementById('news-ticker-bar').style.display='none'; }); }
window.exportToExcel = function() { const t = document.getElementById("admin-table"); let c = "\uFEFF"; c+=Array.from(t.querySelectorAll("th")).map(h=>h.innerText).join(",")+"\n"; t.querySelectorAll("tbody tr").forEach(r=>{c+=Array.from(r.querySelectorAll("td")).map(d=>`"${d.innerText}"`).join(",")+"\n";}); const l=document.createElement("a"); l.href=URL.createObjectURL(new Blob([c],{type:"text/csv;charset=utf-8;"})); l.download="Results.csv"; document.body.appendChild(l); l.click(); document.body.removeChild(l); };
function fetchAdminData() { const b = document.getElementById('admin-table-body'); if(!db) { b.innerHTML='<tr><td colspan="4">اربط Firebase</td></tr>'; return; } b.innerHTML='<tr><td colspan="4">جاري التحميل...</td></tr>'; db.collection("exam_results").orderBy("timestamp","desc").limit(50).get().then(s=>{ b.innerHTML=''; if(s.empty) b.innerHTML='<tr><td colspan="4">لا توجد نتائج</td></tr>'; s.forEach(d=>{ const v=d.data(); b.innerHTML+=`<tr><td>${v.studentName}</td><td>${v.quizTitle}</td><td>${v.score}/${v.total}</td><td style="direction:ltr">${v.date||''}</td></tr>`; }); }); }

// --- Quiz Management ---
window.addNewQuizFromAdmin = function() {
    const sub = document.getElementById('admin-sub-select').value;
    const src = document.getElementById('admin-src-select').value;
    const tit = document.getElementById('admin-quiz-title').value;
    const txt = document.getElementById('admin-quiz-content').value;
    if(!tit || !txt) return alert('أكمل البيانات');
    const qs = parseQuestionsText(txt);
    if(!qs.length) return alert('تنسيق خطأ');
    const c = JSON.parse(localStorage.getItem('custom_quizzes')||'[]');
    c.push({ id: 'c_'+Date.now(), subject: sub, source: src, title: tit, questions: qs });
    localStorage.setItem('custom_quizzes', JSON.stringify(c));
    alert('تم'); document.getElementById('admin-quiz-title').value=''; document.getElementById('admin-quiz-content').value=''; renderCustomQuizzesList();
};
window.deleteCustomQuiz = function(id) { if(!confirm("حذف؟")) return; let l = JSON.parse(localStorage.getItem('custom_quizzes')||'[]'); l = l.filter(q=>q.id!==id); localStorage.setItem('custom_quizzes', JSON.stringify(l)); renderCustomQuizzesList(); alert("تم"); };
function renderCustomQuizzesList() { const l = JSON.parse(localStorage.getItem('custom_quizzes')||'[]'); const c = document.getElementById('admin-custom-quizzes-list'); c.innerHTML=''; if(!l.length) { c.innerHTML='<p style="text-align:center;color:gray;">لا يوجد</p>'; return; } l.forEach(q => { 
    // جلب الأسماء للعرض
    // للتبسيط في العرض، سنستخدم الـ ID لو لم نجد الاسم، لكن الكود يعمل
    c.innerHTML+=`<div class="quiz-card" style="border:1px solid #ccc;cursor:default;"><h4 style="margin:0;">${q.title}</h4><p style="margin:5px 0;font-size:0.9rem;color:gray;">${q.subject} | ${q.source}</p><button class="start-btn" onclick="deleteCustomQuiz('${q.id}')" style="background:#ef4444;width:auto;font-size:0.8rem;padding:5px 10px;">حذف</button></div>`; 
}); }

function parseQuestionsText(text) { const lines = text.split('\n'); let questions = [], cur = null; lines.forEach(l => { l = l.trim(); if(!l) return; if(l.match(/^(Q\d+|س\d+|\d+)[:.)]/i) || l.includes('?')) { if(cur) questions.push(cur); cur = { q: l.replace(/^(Q\d+|س\d+|\d+)[:.)]\s*/i, ''), options: [], a: 0 }; } else if(cur && l.match(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i)) { cur.options.push(l.replace(/^([a-dأ-د]|\-|\*|\d\))[:.)]\s*/i, '')); } else if(cur && l.match(/^(Answer|Correct|الاجابة|الإجابة)[:]\s*/i)) { const map = {'a':0,'b':1,'c':2,'d':3,'أ':0,'ب':1,'ج':2,'د':3}; cur.a = map[l.split(':')[1].trim().toLowerCase()] || 0; } else if(cur && l.match(/^(Hint|Explanation|تلميح|الشرح)[:]\s*/i)) { cur.hint = l.split(':')[1].trim(); } }); if(cur) questions.push(cur); return questions; }

// --- Player & Misc ---
window.startQuiz = function(key, title) { const quiz = currentQuizData[key]; window.currentQuizKey = key; window.currentQuizTitle = title; currentQuiz = quiz.questions; currentQuestionIndex = 0; userAnswers = new Array(currentQuiz.length).fill(null); hideAllViews(); document.getElementById('quiz-container').style.display = 'block'; document.getElementById('current-quiz-title').textContent = title; if (timerInterval) clearInterval(timerInterval); secondsElapsed = 0; timerInterval = setInterval(() => { secondsElapsed++; const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0'); const s = (secondsElapsed % 60).toString().padStart(2, '0'); document.getElementById("quiz-timer").textContent = `${m}:${s}`; }, 1000); displayQuestion(); updateNav(); };
function displayQuestion() { const qData = currentQuiz[currentQuestionIndex]; const container = document.getElementById("question-container"); const uAns = userAnswers[currentQuestionIndex]; const isRtl = qData.q.match(/[\u0600-\u06FF]/); const dirClass = isRtl ? 'rtl' : ''; let optionsHtml = ''; if (!qData.type || qData.type === 'mcq') { optionsHtml = `<div class="answer-options">` + qData.options.map((opt, i) => `<button class="answer-btn ${dirClass} ${uAns?.answer === i ? 'selected' : ''}" onclick="selectOption(${i})">${opt}</button>`).join('') + `</div>`; } else if (qData.type === 'tf') { optionsHtml = `<div class="tf-options" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><button class="answer-btn ${uAns?.answer === true ? 'selected' : ''}" onclick="selectOption(true)">True</button><button class="answer-btn ${uAns?.answer === false ? 'selected' : ''}" onclick="selectOption(false)">False</button></div>`; } let hintHtml = ''; if (qData.hint) { hintHtml = `<div class="hint-container"><button class="hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">💡 تلميح</button><p class="hint-text">${qData.hint}</p></div>`; } container.innerHTML = `<div class="question-card"><div class="question-number">س ${currentQuestionIndex + 1} / ${currentQuiz.length}</div><div class="question-text ${dirClass}">${qData.q}</div>${optionsHtml}${hintHtml}</div>`; document.getElementById("progress-fill").style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`; document.getElementById("question-counter").textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`; }
window.selectOption = function(val) { userAnswers[currentQuestionIndex] = { answer: val, isCorrect: val === currentQuiz[currentQuestionIndex].a }; displayQuestion(); };
window.nextQuestion = function() { if(currentQuestionIndex < currentQuiz.length - 1) { currentQuestionIndex++; displayQuestion(); updateNav(); } else { finishQuiz(); } };
window.prevQuestion = function() { if(currentQuestionIndex > 0) { currentQuestionIndex--; displayQuestion(); updateNav(); } };
function updateNav() { document.getElementById("prev-btn").disabled = currentQuestionIndex === 0; document.getElementById("next-btn").textContent = currentQuestionIndex === currentQuiz.length - 1 ? "إنهاء" : "التالي"; }
function finishQuiz() { clearInterval(timerInterval); const score = userAnswers.filter(a => a && a.isCorrect).length; const hKey = `${currentSubject}_${currentSource}_${window.currentQuizKey}`; const hData = JSON.parse(localStorage.getItem('quizHistory')) || {}; hData[hKey] = { score: score, total: currentQuiz.length, title: window.currentQuizTitle }; localStorage.setItem('quizHistory', JSON.stringify(hData)); if(db) { document.getElementById('upload-status').textContent = "جاري الحفظ..."; db.collection("exam_results").add({ studentName: currentStudentName, subject: currentSubject, quizTitle: window.currentQuizTitle, score: score, total: currentQuiz.length, date: new Date().toLocaleString(), timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { document.getElementById('upload-status').textContent = "✅ تم حفظ النتيجة"; document.getElementById('upload-status').style.color = "green"; }).catch(() => { document.getElementById('upload-status').textContent = "⚠️ تم الحفظ محلياً فقط"; }); } hideAllViews(); document.getElementById('results').style.display = 'block'; document.getElementById("final-score").textContent = `${score} / ${currentQuiz.length}`; document.getElementById("score-message").textContent = score >= currentQuiz.length/2 ? "ممتاز! 👏" : "حاول مرة أخرى 💪"; }
window.showReview = function() { const c = document.getElementById("review-content"); c.innerHTML = ''; currentQuiz.forEach((q, i) => { const ua = userAnswers[i]; const correct = ua && ua.isCorrect; let cText = q.type==='tf' ? (q.a?'True':'False') : q.options[q.a]; let uText = ua ? (q.type==='tf' ? (ua.answer?'True':'False') : q.options[ua.answer]) : "لم يجب"; c.innerHTML += `<div class="review-question"><div style="font-weight:bold;">س ${i+1}: ${q.q}</div><div class="review-option ${correct?'correct':'user-incorrect'}">إجابتك: ${uText}</div>${!correct ? `<div class="review-option correct">الصحيح: ${cText}</div>` : ''}${q.hint ? `<div style="font-size:0.9rem; color:gray; margin-top:5px;">💡 تلميح: ${q.hint}</div>` : ''}</div>`; }); document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'block'; };
window.openAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'flex'; }; window.closeAdminLogin = function() { document.getElementById('admin-login-modal').style.display = 'none'; }; window.closeAdminDashboard = function() { hideAllViews(); document.getElementById('main-nav').style.display = 'flex'; selectSubject(currentSubject); }; window.toggleTheme = function() { document.body.classList.toggle('dark-mode'); document.documentElement.classList.toggle('dark-mode'); localStorage.setItem('theme', document.body.classList.contains('dark-mode')?'dark':'light'); document.getElementById('theme-toggle').textContent = document.body.classList.contains('dark-mode')?'☀️':'🌙'; }; window.hideAllViews = function() { document.getElementById('quiz-list-area').style.display = 'none'; document.getElementById('quiz-container').style.display = 'none'; document.getElementById('results').style.display = 'none'; document.getElementById('review-container').style.display = 'none'; document.getElementById('dashboard-view').style.display = 'none'; document.getElementById('admin-dashboard-view').style.display = 'none'; document.getElementById('source-selection').style.display = 'none'; }; window.backToSources = function() { hideAllViews(); document.getElementById('main-nav').style.display = 'flex'; document.getElementById('source-selection').style.display = 'flex'; }; window.backToQuizList = function() { hideAllViews(); document.getElementById('main-nav').style.display = 'flex'; loadQuizSource(currentSource); }; window.openDashboard = function() { hideAllViews(); document.getElementById('dashboard-view').style.display = 'block'; const hist = JSON.parse(localStorage.getItem('quizHistory')) || {}; let tQ=0; const tbody = document.getElementById('history-table-body'); tbody.innerHTML = ''; Object.values(hist).forEach(v => { tQ++; tbody.innerHTML += `<tr><td>${v.title}</td><td>${v.score}</td><td>${v.score}</td><td>1</td></tr>`; }); document.getElementById('total-quizzes-taken').textContent = tQ; }; window.closeDashboard = function() { hideAllViews(); document.getElementById('main-nav').style.display = 'flex'; selectSubject(currentSubject); }; function loadScript(s,c,e) { if(loadedScripts[s]) { c(); return; } const sc = document.createElement('script'); sc.src = s; sc.onload = () => { loadedScripts[s]=true; c(); }; sc.onerror = e; document.head.appendChild(s); }
