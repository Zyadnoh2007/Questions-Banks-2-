
const anatomyData = {
  respiratory: {
    title: "Respiratory System",
    questions: [
      { q: "Which structure is NOT part of the upper respiratory tract?", type: "mcq", options: ["Nose", "Pharynx", "Larynx", "Trachea"], a: 3, hint: "القصبة الهوائية (Trachea) هي بداية الجهاز التنفسي السفلي." },
      { q: "The 'Adam's apple' is the common name for the:", type: "mcq", options: ["Cricoid cartilage", "Epiglottis", "Thyroid cartilage", "Hyoid bone"], a: 2, hint: "هذا الغضروف الدرقي يكون أكبر وأكثر بروزاً عند الذكور." },
      { q: "What structure prevents food from entering the trachea during swallowing?", type: "mcq", options: ["Uvula", "Epiglottis", "Vocal cords", "Tongue"], a: 1, hint: "إنه 'غطاء' مرن يغلق مدخل الحنجرة عند البلع." },
      { q: "The trachea bifurcates (splits) into the:", type: "mcq", options: ["Pharynx and Larynx", "Right and Left main bronchi", "Alveolar ducts", "Bronchioles"], a: 1, hint: "تتفرع إلى شعبتين هوائيتين رئيسيتين، واحدة لكل رئة." },
      { q: "Which of the following is true about the right main bronchus?", type: "mcq", options: ["It is longer than the left", "It is narrower than the left", "It is more vertical than the left", "It has 2 secondary bronchi"], a: 2, hint: "لهذا السبب، الأجسام الغريبة التي يتم استنشاقها غالباً ما تذهب إلى الرئة اليمنى." },
      { q: "Gas exchange (O2 and CO2) occurs in the:", type: "mcq", options: ["Trachea", "Main bronchi", "Bronchioles", "Alveoli"], a: 3, hint: "هذه هي الأكياس الهوائية الدقيقة في نهاية الجهاز التنفسي." },
      { q: "How many lobes does the right lung have?", type: "mcq", options: ["One", "Two", "Three", "Four"], a: 2, hint: "الرئة اليمنى أكبر قليلاً من اليسرى." },
      { q: "How many lobes does the left lung have?", type: "mcq", options: ["One", "Two", "Three", "Four"], a: 1, hint: "الرئة اليسرى أصغر لإفساح المجال للقلب (Cardiac notch)." },
      { q: "The serous membrane covering the surface of the lung is the:", type: "mcq", options: ["Parietal pleura", "Visceral pleura", "Pericardium", "Peritoneum"], a: 1, hint: "كلمة 'Visceral' تشير إلى الأعضاء الداخلية. 'Parietal' تبطن جدار التجويف." },
      { q: "The main muscle of inspiration (inhalation) is the:", type: "mcq", options: ["Internal intercostals", "External intercostals", "Diaphragm", "Abdominal muscles"], a: 2, hint: "هذه العضلة الكبيرة تفصل بين تجويف الصدر والبطن." },
      { q: "The 'cardiac notch' is a feature of the:", type: "mcq", options: ["Right lung", "Left lung", "Diaphragm", "Sternum"], a: 1, hint: "إنها 'فجوة' في الرئة اليسرى لإعطاء مساحة للقلب." }
    ]
  },
  heart: {
    title: "The Heart",
    questions: [
      { q: "The chamber of the heart that receives deoxygenated blood from the body is the:", type: "mcq", options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], a: 0, hint: "الدم غير المؤكسج من الجسم يدخل إلى 'الأذين' الأيمن عبر الوريد الأجوف." },
      { q: "The chamber that pumps oxygenated blood to the rest of the body is the:", type: "mcq", options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], a: 3, hint: "هذا هو 'البطين' الأيسر، وهو أقوى حجرة في القلب." },
      { q: "The chamber that pumps deoxygenated blood to the lungs is the:", type: "mcq", options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], a: 2, hint: "الدم غير المؤكسج يذهب من 'البطين' الأيمن إلى الرئتين عبر الشريان الرئوي." },
      { q: "The valve located between the right atrium and right ventricle is the:", type: "mcq", options: ["Mitral valve", "Tricuspid valve", "Aortic valve", "Pulmonary valve"], a: 1, hint: "هذا الصمام له ثلاث 'شرفات' (Tri = ثلاثة)." },
      { q: "The valve located between the left atrium and left ventricle is the:", type: "mcq", options: ["Mitral (Bicuspid) valve", "Tricuspid valve", "Aortic valve", "Pulmonary valve"], a: 0, hint: "يُعرف أيضاً بالصمام 'ثنائي الشرفات' (Bi = اثنان)." },
      { q: "The 'pacemaker' of the heart is the:", type: "mcq", options: ["AV node", "SA node", "Bundle of His", "Purkinje fibers"], a: 1, hint: "العقدة الجيبية الأذينية (Sinoatrial node) هي التي تبدأ النبضة الكهربائية للقلب." },
      { q: "Which vessels carry oxygenated blood from the lungs to the heart?", type: "mcq", options: ["Pulmonary arteries", "Pulmonary veins", "Aorta", "Vena cava"], a: 1, hint: "هذه هي الأوعية الوحيدة في الجسم التي تحمل دماً مؤكسجاً (الأوردة الرئوية)." },
      { q: "Which vessel carries deoxygenated blood from the heart to the lungs?", type: "mcq", options: ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], a: 0, hint: "هذا هو الشريان الوحيد في الجسم الذي يحمل دماً غير مؤكسج (الشريان الرئوي)." },
      { q: "The largest artery in the human body is the:", type: "mcq", options: ["Pulmonary artery", "Femoral artery", "Aorta", "Coronary artery"], a: 2, hint: "الشريان الأورطي (الأبهر) هو الشريان الرئيسي الذي يخرج من البطين الأيسر." },
      { q: "The inner lining of the heart chambers is called the:", type: "mcq", options: ["Epicardium", "Myocardium", "Endocardium", "Pericardium"], a: 2, hint: "كلمة 'Endo' تعني 'داخلي'." },
      { q: "The muscular layer of the heart wall is the:", type: "mcq", options: ["Epicardium", "Myocardium", "Endocardium", "Pericardium"], a: 1, hint: "كلمة 'Myo' تعني 'عضلة'." },
      { q: "The sac enclosing the heart is the:", type: "mcq", options: ["Epicardium", "Myocardium", "Endocardium", "Pericardium"], a: 3, hint: "كلمة 'Peri' تعني 'حول'. هذا هو كيس التامور." },
      { q: "The 'lub' (S1) heart sound is caused by the closing of the:", type: "mcq", options: ["AV (Mitral & Tricuspid) valves", "Semilunar (Aortic & Pulmonary) valves", "Aortic valve only", "Mitral valve only"], a: 0, hint: "الصوت الأول (S1) يحدث عند بداية انقباض البطينين." },
      { q: "The 'dub' (S2) heart sound is caused by the closing of the:", type: "mcq", options: ["AV (Mitral & Tricuspid) valves", "Semilunar (Aortic & Pulmonary) valves", "Aortic valve only", "Mitral valve only"], a: 1, hint: "الصوت الثاني (S2) يحدث عند نهاية انقباض البطينين." },
      { q: "Which chamber has the thickest muscular wall?", type: "mcq", options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], a: 3, hint: "البطين الأيسر يحتاج إلى ضخ الدم إلى جميع أنحاء الجسم، لذا فهو الأقوى." },
      { q: "The coronary arteries supply blood to the:", type: "mcq", options: ["Lungs", "Brain", "Heart muscle (Myocardium)", "Liver"], a: 2, hint: "الشرايين 'التاجية' تغذي عضلة القلب نفسها." },
      { q: "The QRS complex on an ECG represents:", type: "mcq", options: ["Atrial depolarization", "Ventricular depolarization", "Ventricular repolarization", "Atrial repolarization"], a: 1, hint: "هذه الموجة الكبيرة تمثل 'انقباض' البطينين." },
      { q: "The T wave on an ECG represents:", type: "mcq", options: ["Atrial depolarization", "Ventricular depolarization", "Ventricular repolarization", "Atrial repolarization"], a: 2, hint: "هذه الموجة تمثل 'انبساط' أو 'إعادة استقطاب' البطينين." },
      { q: "The P wave on an ECG represents:", type: "mcq", options: ["Atrial depolarization", "Ventricular depolarization", "Ventricular repolarization", "Atrial repolarization"], a: 0, hint: "هذه هي الموجة الصغيرة الأولى وتمثل 'انقباض' الأذينين." },
      { q: "Chordae tendineae ('heart strings') are attached to:", type: "mcq", options: ["Semilunar valves", "AV valves", "The SA node", "The Aorta"], a: 1, hint: "هذه 'الحبال' تمنع الصمامات (الميترالي وثلاثي الشرفات) من الانقلاب للخلف." }
    ]
  },
  general: {
    title: "General Anatomy",
    questions: [
      { q: "Which plane divides the body into right and left halves?", type: "mcq", options: ["Sagittal (Median)", "Coronal (Frontal)", "Transverse (Horizontal)", "Oblique"], a: 0, hint: "المستوى 'السهمي' (Sagittal) يمر من الأمام إلى الخلف." },
      { q: "Which plane divides the body into anterior and posterior parts?", type: "mcq", options: ["Sagittal", "Coronal (Frontal)", "Transverse", "Median"], a: 1, hint: "المستوى 'التاجي' (Coronal) يقسم الجسم إلى أمامي (Anterior) وخلفي (Posterior)." },
      { q: "Which plane divides the body into superior and inferior parts?", type: "mcq", options: ["Sagittal", "Coronal", "Transverse (Horizontal)", "Frontal"], a: 2, hint: "المستوى 'المستعرض' (Transverse) يقطع الجسم أفقياً." },
      { q: "The term 'proximal' means:", type: "mcq", options: ["Further from the trunk/origin", "Closer to the trunk/origin", "Towards the midline", "Away from the midline"], a: 1, hint: "'Proximal' (قريب) عكس 'Distal' (بعيد). المرفق قريب (proximal) من الكتف." },
      { q: "The term 'lateral' means:", type: "mcq", options: ["Closer to the midline", "Away from the midline", "Towards the front", "Towards the back"], a: 1, hint: "'Lateral' (جانبي) عكس 'Medial' (أوسط). الأذن جانبية (lateral) للأنف." }
    ]
  }
};
