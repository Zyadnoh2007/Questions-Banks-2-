/* إضافة خط المراعي لضمان دعم العربية بشكل جميل */
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');

:root {
  --primary-color: #3b82f6; 
  --secondary-color: #6366f1; 
  --card-bg: #ffffff;
  --body-bg: #f8fafc; 
  --text-dark: #1e293b;
  --text-light: #64748b;
  --border-color: #e2e8f0;
  --quiz-card-bg: #eff6ff;
  --quiz-card-border: #3b82f6;
  --success: #22c55e;
  --danger: #ef4444;
  --shadow-light: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-heavy: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --radius-md: 12px;
  --radius-lg: 16px;
}

body.dark-mode {
  --card-bg: #1e293b;
  --body-bg: #0f172a;
  --text-dark: #f1f5f9;
  --text-light: #94a3b8;
  --border-color: #334155;
  --quiz-card-bg: #1e293b;
  --quiz-card-border: #6366f1;
}

body {
  box-sizing: border-box;
  font-family: 'Almarai', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--body-bg);
  min-height: 100vh;
  color: var(--text-dark);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px;
}

/* --- News Ticker --- */
.news-ticker {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 10px 0;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}
.ticker-content {
    display: inline-block;
    padding-left: 100%;
    animation: ticker 20s linear infinite;
    font-weight: bold;
    font-size: 1.1rem;
}
@keyframes ticker {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(100%, 0, 0); } /* RTL logic: move right */
}

/* --- Honor Board --- */
.honor-board {
    background: linear-gradient(135deg, #fef9c3 0%, #fffbeb 100%);
    border: 2px solid #fbbf24;
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 30px;
    text-align: center;
    box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.4);
    animation: fadeIn 0.5s ease;
}
body.dark-mode .honor-board {
    background: #422006;
    border-color: #b45309;
}
.honor-board h3 { color: #d97706; margin-top: 0; font-size: 1.8rem; text-shadow: 1px 1px 0px rgba(255,255,255,0.5); }
.top-students-grid {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}
.honor-card {
    background: white;
    padding: 10px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: #b45309;
}
.honor-rank {
    background: #fcd34d;
    color: #78350f;
    width: 30px; height: 30px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}

/* --- Auth Modal --- */
.auth-box { padding: 0 !important; overflow: hidden; max-width: 450px !important; }
.auth-tabs { display: flex; background: #f1f5f9; }
.auth-tab-btn {
    flex: 1; border: none; padding: 15px;
    font-weight: bold; cursor: pointer;
    background: transparent; color: var(--text-light);
    transition: 0.3s;
}
.auth-tab-btn.active {
    background: white; color: var(--primary-color);
    border-top: 3px solid var(--primary-color);
}
.auth-form { padding: 30px; text-align: center; animation: fadeIn 0.3s ease; }
.auth-form h3 { color: var(--primary-color); margin-bottom: 20px; }
.auth-form input {
    width: 100%; padding: 12px; margin-bottom: 15px;
    border: 2px solid var(--border-color); border-radius: 8px;
    font-size: 1rem;
}
.error-msg { color: var(--danger); font-size: 0.9rem; margin-top: 5px; min-height: 20px; }

/* --- Admin Panel Enhancements --- */
.admin-panel .tab-btn {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    font-size: 0.9rem; padding: 10px;
}
.admin-header {
    background: #1e293b; padding: 20px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex; justify-content: space-between; align-items: center;
}
.admin-tabs { margin-top: -10px; border-radius: 0 0 var(--radius-lg) var(--radius-lg); z-index: 10; position: relative; }

/* Hybrid Builder Styles */
.hybrid-editor-container {
    background: var(--card-bg); border: 2px solid var(--border-color);
    border-radius: var(--radius-lg); overflow: hidden;
}
.editor-header {
    background: #f8fafc; padding: 15px; border-bottom: 1px solid var(--border-color);
}
.exam-meta {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;
}
.exam-meta input, .exam-meta select {
    padding: 8px; border: 1px solid var(--border-color); border-radius: 6px;
}
.toolbar {
    padding: 10px; background: #f1f5f9; display: flex; gap: 10px; align-items: center;
    border-bottom: 1px solid var(--border-color);
}
.tool-btn {
    background: white; border: 1px solid var(--border-color);
    padding: 8px 15px; border-radius: 6px; cursor: pointer;
    font-weight: bold; color: var(--text-dark); display: flex; align-items: center; gap: 5px;
}
.tool-btn:hover { background: #e2e8f0; }
.magic-btn { color: var(--secondary-color); border-color: var(--secondary-color); }
.magic-btn:hover { background: #eff6ff; }

.builder-area {
    padding: 20px; min-height: 300px; max-height: 600px; overflow-y: auto;
    background: #f8fafc;
}
.builder-card {
    background: white; border-right: 4px solid var(--primary-color);
    padding: 15px; margin-bottom: 15px; border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: relative;
    animation: slideUp 0.3s ease;
}
body.dark-mode .builder-card { background: #1e293b; border-color: var(--secondary-color); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--text-light); font-size: 0.9rem;}
.delete-card-btn { color: var(--danger); background: none; border: none; cursor: pointer; font-size: 1.1rem; }

.q-input-group { margin-bottom: 10px; }
.q-input-group label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem;}
.q-input { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.option-row { display: flex; align-items: center; gap: 5px; }
.radio-select { transform: scale(1.2); cursor: pointer; }

.editor-footer { padding: 15px; background: #f8fafc; border-top: 1px solid var(--border-color); text-align: center; }
.save-exam-btn { width: 100%; max-width: 300px; background: var(--success); }

/* Accordion Results */
.accordion-item {
    background: var(--card-bg); border: 1px solid var(--border-color);
    margin-bottom: 10px; border-radius: 8px; overflow: hidden;
}
.accordion-header {
    padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
    background: #f8fafc;
}
.accordion-header:hover { background: #f1f5f9; }
.accordion-content {
    display: none; padding: 15px; background: white;
    border-top: 1px solid var(--border-color);
}
.accordion-content.active { display: block; }

/* Status Badges */
.status-badge { padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
.status-active { background: #dcfce7; color: #166534; }
.status-banned { background: #fee2e2; color: #991b1b; }

/* General Styles from before */
.header { text-align: center; margin-bottom: 30px; background: var(--card-bg); padding: 30px; border-radius: var(--radius-lg); box-shadow: var(--shadow-heavy); position: relative; }
.header-controls { position: absolute; top: 20px; left: 20px; display: flex; gap: 10px; z-index: 10; }
.icon-btn { background: transparent; border: 2px solid var(--border-color); font-size: 1.3rem; cursor: pointer; padding: 8px; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; color: var(--text-dark); }
.icon-btn:hover { transform: scale(1.1); background-color: var(--border-color); }
.dashboard-icon { background: #e0e7ff; border-color: var(--primary-color); color: var(--primary-color); }
.admin-icon { background: #fce7f3; border-color: #ec4899; color: #ec4899; }
.tab-container { display: flex; flex-wrap: wrap; background: var(--card-bg); border-radius: var(--radius-lg); padding: 8px; margin-bottom: 30px; box-shadow: var(--shadow-light); gap: 5px; }
.tab-btn { flex-grow: 1; text-align: center; padding: 12px 10px; border: none; background: transparent; cursor: pointer; font-size: 1rem; font-weight: bold; color: var(--text-light); border-radius: var(--radius-md); transition: all 0.3s ease; min-width: 100px; }
.tab-btn:hover { background: rgba(0, 0, 0, 0.05); color: var(--text-dark); }
.tab-btn.active { background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); color: white; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3); }
.source-container { display: none; justify-content: center; gap: 30px; margin: 40px 0; flex-wrap: wrap; }
.source-card { background: var(--card-bg); border: 2px solid var(--border-color); border-radius: var(--radius-lg); padding: 40px 20px; width: 300px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: var(--shadow-light); }
.source-card:hover { transform: translateY(-10px); border-color: var(--primary-color); box-shadow: var(--shadow-heavy); }
.source-card h3 { color: var(--primary-color); font-size: 1.8rem; margin-bottom: 10px; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 20px; }
.quiz-card { background: var(--card-bg); border-radius: var(--radius-lg); padding: 25px; box-shadow: var(--shadow-light); transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; border: 2px solid transparent; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
.quiz-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-heavy); border-color: var(--primary-color); }
.quiz-card h3 { color: var(--text-dark); font-size: 1.5rem; margin-bottom: 15px; text-align: center; }
.start-btn { background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); color: white; border: none; padding: 12px 25px; border-radius: 25px; font-size: 1rem; cursor: pointer; width: 100%; transition: all 0.3s ease; font-weight: bold; margin-top: 10px; }
.start-btn:hover { transform: scale(1.03); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3); }
.quiz-container { display: none; background: var(--card-bg); border-radius: var(--radius-lg); padding: 30px; padding-top: 70px; box-shadow: var(--shadow-heavy); margin-bottom: 30px; position: relative; }
.quiz-title { color: #0d47a1; font-size: 2rem; margin-bottom: 5px; }
.question-card { background: var(--quiz-card-bg); border-radius: var(--radius-md); padding: 25px; margin-bottom: 20px; border-right: 4px solid var(--quiz-card-border); direction: rtl; text-align: right; }
.question-text { font-size: 1.3rem; color: var(--text-dark); margin-bottom: 25px; line-height: 1.6; text-align: left; direction: ltr; }
.question-text.rtl { text-align: right; direction: rtl; }
.answer-options { display: grid; grid-template-columns: 1fr; gap: 10px; max-width: 600px; margin: 0 auto; }
.answer-btn { background: var(--card-bg); border: 2px solid var(--border-color); padding: 15px 20px; border-radius: var(--radius-md); font-size: 1.1rem; cursor: pointer; transition: all 0.3s ease; font-weight: bold; width: 100%; text-align: left; direction: ltr; }
.answer-btn.rtl { text-align: right; direction: rtl; }
.answer-btn:hover { border-color: var(--primary-color); background-color: #f1f5f9; }
.answer-btn.selected { background: #e0e7ff; border-color: var(--secondary-color); color: #1e293b; }
.quiz-navigation { display: flex; justify-content: space-between; margin-top: 20px; }
.nav-btn { background: var(--primary-color); color: white; border: none; padding: 12px 25px; border-radius: 25px; font-size: 1rem; cursor: pointer; font-weight: bold; min-width: 140px; transition: transform 0.2s ease; }
.nav-btn:disabled { background: #64748b; color: white; cursor: not-allowed; }
.back-btn { background: var(--text-light); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; margin-bottom: 20px; font-weight: bold; transition: background-color 0.2s ease; }
.results { text-align: center; display: none; }
.score { font-size: 3rem; color: var(--primary-color); font-weight: bold; margin: 20px 0; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: var(--card-bg); padding: 20px; border-radius: var(--radius-lg); box-shadow: var(--shadow-light); display: flex; align-items: center; gap: 15px; border: 1px solid var(--border-color); }
.stat-icon { font-size: 2.5rem; background: #f3f4f6; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.stat-info span { display: block; font-size: 1.8rem; font-weight: bold; color: var(--primary-color); }
.history-table-container { overflow-x: auto; background: var(--card-bg); border-radius: var(--radius-md); box-shadow: var(--shadow-light); }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th, td { padding: 15px; text-align: right; border-bottom: 1px solid var(--border-color); }
th { background-color: #f8fafc; color: var(--text-light); font-weight: bold; }
.footer { text-align: center; margin-top: 50px; padding: 20px; background: var(--card-bg); border-radius: var(--radius-lg); box-shadow: var(--shadow-light); }
.sarhne-btn { display: inline-block; margin-top: 10px; text-decoration: none; color: var(--primary-color); border: 2px solid var(--primary-color); padding: 8px 20px; border-radius: 25px; font-weight: bold; transition: all 0.3s ease; font-size: 0.9rem; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
.modal-box { background: var(--card-bg); padding: 40px; border-radius: var(--radius-lg); text-align: center; width: 90%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@media (max-width: 768px) { .container { padding: 15px; } .header { display: flex; flex-direction: column; align-items: center; padding-top: 20px; } .header-controls { position: static; margin-bottom: 15px; justify-content: center; width: 100%; } .tab-container { flex-direction: column; } .tab-btn { width: 100%; } .quiz-header-info { flex-direction: column; gap: 15px; } .quiz-container .back-btn, #quiz-timer { position: static; width: 100%; max-width: 200px; margin: 10px auto; text-align: center; } #quiz-timer { order: -1; } .options-grid { grid-template-columns: 1fr; } }
@media print {
    body * { visibility: hidden; }
    #admin-tab-results, #admin-tab-results * { visibility: visible; }
    #admin-tab-results { position: absolute; left: 0; top: 0; width: 100%; }
    .filter-container, .btn-group { display: none !important; }
}

/* Switch */
.switch-container { position: relative; display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 10px; }
.switch-container input { opacity: 0; width: 0; height: 0; }
.slider { position: relative; width: 50px; height: 26px; background-color: #ccc; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: var(--primary-color); }
input:checked + .slider:before { transform: translateX(24px); }
