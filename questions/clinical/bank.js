window.clinical_bank_data = {
  clinical_1: {
    title: "Hand Hygiene & PPE - Part 1",
    questions: [
      { 
        q: "What is the minimum duration for effective hand washing?", 
        type: "mcq", 
        options: ["5 seconds", "10 seconds", "40 seconds", "1 minute"], 
        a: 2, 
        hint: "توصي منظمة الصحة العالمية بمدة كافية لتغطية جميع الأسطح، وهي ليست 10 أو 20 ثانية.",
        explanation: "المدة الموصى بها لغسل اليدين بالماء والصابون هي 40-60 ثانية لضمان إزالة الجراثيم بشكل فعال."
      },
      { 
        q: "Which is the most common way infections are transmitted in healthcare settings?", 
        type: "mcq", 
        options: ["Airborne droplets", "Contaminated instruments", "Hands", "Food"], 
        a: 2, 
        hint: "هذا هو السبب في أن نظافة اليدين هي الركيزة الأساسية لمكافحة العدوى.",
        explanation: "الأيدي الملوثة للعاملين الصحيين هي الوسيلة الرئيسية (Vehicle) لنقل العدوى بين المرضى."
      },
      { 
        q: "What is the primary reason for healthcare workers to practice hand hygiene?", 
        type: "mcq", 
        options: ["To clean their hands", "To prevent healthcare-associated infections", "To avoid skin irritation", "To save water"], 
        a: 1, 
        hint: "الهدف الأساسي هو حماية 'المريض' من الميكروبات.",
        explanation: "الهدف الأسمى هو منع العدوى المرتبطة بالرعاية الصحية (HAIs) وحماية المرضى من انتقال الجراثيم."
      },
      { 
        q: "How many key moments are recognized for hand hygiene in healthcare?", 
        type: "mcq", 
        options: ["3", "4", "5", "6"], 
        a: 2, 
        hint: "تُعرف بـ 'My 5 Moments for Hand Hygiene' من منظمة الصحة العالمية.",
        explanation: "هناك '5 لحظات' ذهبية لنظافة اليدين حددتها منظمة الصحة العالمية (قبل لمس المريض، قبل إجراء نظيف، بعد لمس سوائل الجسم، بعد لمس المريض، بعد لمس محيط المريض)."
      },
      { 
        q: "Which of these is NOT one of the five moments for hand hygiene?", 
        type: "mcq", 
        options: ["Before patient contact", "After body fluid exposure risk", "Before putting on gloves", "After touching patient surroundings"], 
        a: 2, 
        hint: "ارتداء القفازات لا يحل محل نظافة اليدين، ولكن النظافة تحدث 'قبل' لمس المريض و 'بعد' إزالة القفازات.",
        explanation: "'قبل ارتداء القفازات' ليس لحظة منفصلة بحد ذاتها في النموذج، بل يندرج تحت اللحظات الأخرى (مثل قبل إجراء نظيف). الأهم هو غسل اليدين قبل الإجراء وبعد خلع القفازات."
      },
      { 
        q: "How long should alcohol-based hand rub be used for proper hand hygiene?", 
        type: "mcq", 
        options: ["5 seconds", "10 seconds", "20-30 seconds", "1 minute"], 
        a: 2, 
        hint: "المدة الكافية لفرك اليدين حتى تجف تماماً.",
        explanation: "استخدام معقم اليدين الكحولي يتطلب 20-30 ثانية حتى يجف تماماً ويقتل الجراثيم."
      },
      { 
        q: "Which area of the hand is most frequently missed during hand hygiene?", 
        type: "mcq", 
        options: ["Palm", "Back of hand", "Fingertips and around nails", "Wrist"], 
        a: 2, 
        hint: "هذه المناطق يصعب الوصول إليها وغالباً ما يتم إهمالها.",
        explanation: "أطراف الأصابع، الإبهام، وبين الأصابع هي المناطق الأكثر إهمالاً وتلوثاً."
      },
      { 
        q: "When should gloves be changed?", 
        type: "mcq", 
        options: ["When moving from one patient to another", "When visibly dirty", "After patient care involving contamination", "All of the above"], 
        a: 3, 
        hint: "القفازات مخصصة لاستخدام واحد ولحالة واحدة.",
        explanation: "يجب تغيير القفازات بين كل مريض وآخر، وعند تمزقها، وعند الانتقال من منطقة ملوثة لمنطقة نظيفة في نفس المريض."
      },
      { 
        q: "Which method is the fastest for cleaning hands before patient contact?", 
        type: "mcq", 
        options: ["Washing with soap and water", "Using alcohol-based hand rub", "Wearing gloves", "Using hand lotion"], 
        a: 1, 
        hint: "فرك الكحول أسرع ومتاح بجانب سرير المريض (عندما لا تكون الأيدي متسخة بشكل واضح).",
        explanation: "فرك اليدين بالكحول هو الطريقة الأسرع والأكثر فعالية في قتل الجراثيم إذا لم تكن الأيدي متسخة بشكل مرئي."
      },
      { 
        q: "When using personal protective equipment (PPE), hand hygiene should be performed:", 
        type: "mcq", 
        options: ["Before putting on PPE", "After removing PPE", "Both before and after PPE use", "Hand hygiene is not necessary with gloves"], 
        a: 2, 
        hint: "النظافة ضرورية قبل الدخول وبعد الخروج لضمان عدم نقل العدوى.",
        explanation: "يجب غسل اليدين قبل ارتداء الـ PPE لضمان نظافتها، وبعد خلع الـ PPE لأن اليدين قد تتلوث أثناء الخلع."
      },
      { 
        q: "What is the recommended water temperature for hand washing?", 
        type: "mcq", 
        options: ["Cold water", "Warm water", "Hot water", "Temperature does not matter"], 
        a: 1, 
        hint: "الماء الساخن جداً يسبب تهيجاً للجلد، والبارد جداً قد لا يكون مريحاً. الماء الدافئ هو الأفضل.",
        explanation: "الماء الدافئ هو الأفضل لأنه يزيل الزيوت والأوساخ بفعالية دون التسبب في تهيج الجلد أو تشققه مثل الماء الساخن."
      },
      { 
        q: "What is the recommended method for drying hands after washing?", 
        type: "mcq", 
        options: ["Using shared towels", "Air drying or using disposable towels", "Using cloth towels shared by several people", "Shaking hands dry"], 
        a: 1, 
        hint: "المناشف القماشية المشتركة تنقل العدوى. المناشف الورقية هي الأفضل.",
        explanation: "المناشف الورقية التي تستخدم لمرة واحدة هي الطريقة الأكثر صحية لتجفيف اليدين ومنع إعادة التلوث."
      },
      { 
        q: "Which of the following is NOT recommended during hand hygiene practices?", 
        type: "mcq", 
        options: ["Wearing rings or bracelets", "Keeping nails short and clean", "Using alcohol-based hand rub when hands are not visibly soiled", "Washing hands before and after patient contact"], 
        a: 0, 
        hint: "المجوهرات والأظافر الطويلة تأوي الميكروبات وتجعل التنظيف صعباً.",
        explanation: "ارتداء الخواتم والمجوهرات يخلق أماكن اختباء للجراثيم ويجعل تنظيف اليدين بشكل كامل مستحيلاً."
      },
      { 
        q: "What should a healthcare worker do immediately after removing gloves?", 
        type: "mcq", 
        options: ["Ignore hand hygiene if hands look clean", "Perform hand hygiene immediately", "Put on a new pair of gloves without hand hygiene", "Use lotion to protect skin only"], 
        a: 1, 
        hint: "القفازات قد تتمزق (تمزقات دقيقة) أو تتلوث الأيدي أثناء إزالتها.",
        explanation: "القفازات ليست منيعة 100% وقد تحتوي على ثقوب دقيقة، كما أن اليدين غالباً ما تتلوث أثناء خلع القفازات."
      },
      { 
        q: "What is a key reason for healthcare workers' non-compliance with hand hygiene?", 
        type: "mcq", 
        options: ["Lack of knowledge", "Skin irritation caused by frequent washing", "Lack of access to soap", "Disbelief in hand hygiene effectiveness"], 
        a: 1, 
        hint: "جفاف الجلد والتهابه (التهاب الجلد التماسي) هو عائق شائع.",
        explanation: "التهاب الجلد وجفافه الناتج عن الغسل المتكرر واستخدام المواد الكيميائية هو أحد الأسباب الرئيسية لعدم التزام الموظفين."
      },
      { 
        q: "Which of the following is NOT considered PPE?", 
        type: "mcq", 
        options: ["Gloves", "eye protector", "face mask", "Baseball cap"], 
        a: 3, 
        hint: "PPE هي معدات مصممة للحماية من مخاطر صحية معينة.",
        explanation: "قبعة البيسبول هي ملابس عادية وليست معدات حماية شخصية طبية مصممة لمنع العدوى."
      },
      { 
        q: "What is the correct action if PPE is damaged?", 
        type: "mcq", 
        options: ["Continue to use it until replacement is available", "Modify it to fit better", "Report it and replace it immediately", "Share it with a coworker"], 
        a: 2, 
        hint: "المعدات التالفة لا توفر الحماية المطلوبة.",
        explanation: "الـ PPE التالف (مثل قفاز مثقوب) يفقد وظيفته الحمائية ويعرضك للخطر، لذا يجب استبداله فوراً."
      },
      { 
        q: "What is the main reason for washing our hands in a hospital?", 
        type: "mcq", 
        options: ["To make them smell nice", "To remove germs and prevent their spread", "To warm them up", "To remove jewelry"], 
        a: 1, 
        hint: "الهدف الأساسي هو مكافحة العدوى.",
        explanation: "الهدف هو إزالة الميكروبات العابرة (Transient flora) ومنع انتقالها للمرضى الضعفاء."
      },
      { 
        q: "How long should you wash your hands with soap and water?", 
        type: "mcq", 
        options: ["About 5 seconds", "About 15-30 seconds", "About 1 minute", "About 2 minutes"], 
        a: 1, 
        hint: "الوقت الإجمالي الموصى به من منظمة الصحة العالمية (WHO) هو 40-60 ثانية، ولكن وقت الفرك الفعلي يتراوح بين 15-30 ثانية.",
        explanation: "فرك اليدين بالصابون يجب أن يستمر لمدة 15-30 ثانية على الأقل لضمان تغطية وتنظيف جميع الأجزاء."
      },
      { 
        q: "When must health professionals use PPE?", 
        type: "mcq", 
        options: ["Only during surgical procedures.", "When they remember to do so.", "When undertaking any procedure that carries an infection risk.", "Only when dealing with patients known to be infectious."], 
        a: 2, 
        hint: "يجب استخدامها بناءً على 'تقييم المخاطر' للإجراء، وليس فقط للمرضى المعروفين.",
        explanation: "الـ PPE مطلوبة في أي إجراء يحمل خطر التعرض للدم، سوائل الجسم، أو الأغشية المخاطية، بغض النظر عن تشخيص المريض."
      }
    ]
  },
  
  clinical_2: {
    title: "Hand Hygiene & PPE - Part 2",
    questions: [
      { 
        q: "The effectiveness of PPE is heavily dependent on:", 
        type: "mcq", 
        options: ["The color and brand of the equipment.", "The user's skill in putting it on (donning) and taking it off (doffing).", "How expensive the equipment was.", "The time of day it is used."], 
        a: 1, 
        hint: "الطريقة الصحيحة للخلع (Doffing) هي الأكثر أهمية لمنع تلوث النفس.",
        explanation: "أكبر خطر للتلوث الذاتي يحدث أثناء خلع الـ PPE الملوثة، لذا فإن المهارة في ارتدائها وخلعها (Donning & Doffing) حاسمة."
      },
      { 
        q: "How does PPE protect vulnerable patients?", 
        type: "mcq", 
        options: ["By making the healthcare environment look more professional.", "By curing them of their existing infections.", "By preventing them from acquiring infections from staff.", "By reducing the cost of their hospital stay."], 
        a: 2, 
        hint: "يمنع نقل الميكروبات من العامل الصحي إلى المريض (مثال: في الجراحة).",
        explanation: "في حالات العزل الوقائي (Protective Isolation)، يحمي الـ PPE المرضى ذوي المناعة الضعيفة من الميكروبات التي قد يحملها الطاقم الطبي."
      },
      { 
        q: "When should PPE be changed?", 
        type: "mcq", 
        options: ["At the end of each shift.", "Only when it is visibly torn.", "Whenever it is heavily splashed and between procedures with different patients.", "Once a day to save resources."], 
        a: 2, 
        hint: "يجب تغييرها لمنع انتقال التلوث بين المرضى أو عند تلفها.",
        explanation: "الـ PPE ملوثة بعد الاستخدام، لذا يجب تغييرها بين المرضى لمنع نقل العدوى (Cross-contamination)."
      },
      { 
        q: "What is the main reason for washing our hands in a hospital?", 
        type: "mcq", 
        options: ["To make them smell nice", "To remove germs and prevent their spread", "To warm them up", "To remove jewelry"], 
        a: 1, 
        hint: "الهدف هو كسر سلسلة انتقال العدوى.",
        explanation: "سؤال مكرر للتأكيد: الهدف هو منع انتشار العدوى (Infection Control)."
      },
      { 
        q: "When must you wash your hands with soap and water instead of using hand sanitizer?", 
        type: "mcq", 
        options: ["When they feel sticky", "When they look dirty", "After touching a clean bed", "Before wearing gloves"], 
        a: 1, 
        hint: "الكحول لا يعمل بفعالية في وجود الأوساخ أو المواد العضوية. (وأيضاً بعد استخدام الحمام أو مع عدوى C. difficile).",
        explanation: "إذا كانت الأيدي متسخة بشكل مرئي (Visibly soiled)، يجب غسلها بالماء والصابون لأن الكحول لا يخترق الأوساخ والبروتينات."
      },
      { 
        q: "How long should you wash your hands with soap and water?", 
        type: "mcq", 
        options: ["About 5 seconds", "About 15-30 seconds", "About 1 minute", "About 2 minutes"], 
        a: 1, 
        hint: "الوقت الكافي لغناء 'عيد ميلاد سعيد' مرتين ببطء.",
        explanation: "15-30 ثانية من الفرك الفعلي تكفي لإزالة معظم الجراثيم العابرة."
      },
      { 
        q: "What is the first thing you should do before washing your hands?", 
        type: "mcq", 
        options: ["Dry them with a towel", "Put on gloves", "Remove jewelry like rings and watches", "Use hand sanitizer"], 
        a: 2, 
        hint: "المجوهرات والساعات تأوي الميكروبات ويجب إزالتها لضمان تنظيف فعال.",
        explanation: "إزالة المجوهرات ضرورية لأن الميكروبات تختبئ تحتها ولا يصلها الصابون أو الكحول."
      },
      { 
        q: "When using an alcohol-based hand rub, what should you do until your hands are dry?", 
        type: "mcq", 
        options: ["Rinse them with water", "Wipe them on your clothes", "Keep rubbing them together", "Put on gloves immediately"], 
        a: 2, 
        hint: "يجب أن يجف الكحول تماماً ليكون فعالاً. لا تنفخ عليها أو تلوح بها.",
        explanation: "الفرك المستمر حتى الجفاف (Rub until dry) يضمن تغطية كاملة ويعطي الكحول وقتاً لقتل البكتيريا."
      },
      { 
        q: "What is a major advantage of using an alcohol-based hand rub?", 
        type: "mcq", 
        options: ["It works better than soap on visibly dirty hands.", "It is faster and more accessible than finding a sink.", "It makes your hands feel wetter.", "You don't need to dry your hands."], 
        a: 1, 
        hint: "سرعته وسهولة توفره بجانب المريض يزيدان من معدل الامتثال.",
        explanation: "المعقم الكحولي أسرع، ألطف على الجلد، ويمكن توفيره عند 'نقطة الرعاية' (Point of care) بجانب سرير المريض."
      },
      { 
        q: "When should you perform 'Clinical Hand Hygiene' with special soap?", 
        type: "mcq", 
        options: ["After using the toilet", "Before eating your lunch", "Before a task like inserting a catheter", "When your hands are visibly clean"], 
        a: 2, 
        hint: "هذا يشير إلى إجراء يتطلب تقنية 'معقمة' (aseptic)، مثل قبل العمليات الجراحية أو الإجراءات الغازية.",
        explanation: "غسل اليدين الجراحي أو السريري بمطهر خاص (مثل Chlorhexidine) مطلوب قبل الإجراءات الغازية (Invasive procedures) لمنع دخول الجراثيم للجسم."
      },
      { 
        q: "Why is it important to keep your nails short and clean?", 
        type: "mcq", 
        options: ["It looks more professional.", "Germs can hide under long or dirty nails.", "Soap works better on short nails.", "Gloves fit better."], 
        a: 1, 
        hint: "منطقة تحت الأظافر هي واحدة من أكثر المناطق صعوبة في التنظيف.",
        explanation: "المنطقة تحت الأظافر (Subungual area) هي أكبر مخزن للجراثيم في اليد، والأظافر الطويلة تزيد من هذا الخطر."
      },
      { 
        q: "What should you use to turn off the water tap after washing your hands if you don't have elbow controls?", 
        type: "mcq", 
        options: ["Your clean hands", "Your elbow", "A paper towel", "Your uniform"], 
        a: 2, 
        hint: "استخدام منشفة ورقية جافة يمنع إعادة تلوث يديك النظيفة من الصنبور.",
        explanation: "الصنبور يعتبر سطحاً ملوثاً، لذا يجب استخدام حاجز (منشفة ورقية) لإغلاقه بعد غسل اليدين."
      },
      { 
        q: "When should you wear gloves?", 
        type: "mcq", 
        options: ["For all patient contacts", "Only when you remember", "When you might touch blood or body fluids", "As a replacement for hand washing"], 
        a: 2, 
        hint: "تُستخدم القفازات عند توقع 'مخاطر' التعرض لسوائل الجسم.",
        explanation: "القفازات ليست للمصافحة! تستخدم فقط عند وجود خطر التعرض للدم، سوائل الجسم، الأغشية المخاطية، أو الجلد غير السليم."
      },
      { 
        q: "What must you do immediately after taking off gloves?", 
        type: "mcq", 
        options: ["Throw them in the regular trash.", "Clean your hands again.", "Put on a new pair.", "Wipe your hands on a towel."], 
        a: 1, 
        hint: "هذه واحدة من 'اللحظات الخمس' (5 Moments) - بعد إزالة القفازات.",
        explanation: "الأيدي تتلوث غالباً أثناء خلع القفازات، كما أن البيئة الرطبة داخل القفاز تشجع نمو البكتيريا، لذا الغسل واجب."
      },
      { 
        q: "The statement 'Gloves are not a substitute for hand hygiene' means:", 
        type: "mcq", 
        options: ["You don't need to wash your hands if you wear gloves.", "You must clean your hands before putting on and after taking off gloves.", "Gloves are more important than handwashing.", "Hand sanitizer doesn't work on gloves."], 
        a: 1, 
        hint: "القفازات تحميك أنت، وغسل اليدين يحمي المريض (ويحميك بعد الخلع).",
        explanation: "ارتداء القفازات لا يلغي الحاجة لغسل اليدين؛ إنهما إجراءان متكاملان للحماية."
      },
      { 
        q: "What does PPE stand for?", 
        type: "mcq", 
        options: ["Personal Patient Equipment", "Protective Patient Environment", "Personal Protective Equipment", "Professional Protective Ensembles"], 
        a: 2, 
        hint: "إنها معدات 'شخصية' و 'واقية'.",
        explanation: "PPE هي اختصار لـ Personal Protective Equipment (معدات الحماية الشخصية)."
      },
      { 
        q: "What is the main purpose of PPE?", 
        type: "mcq", 
        options: ["To make staff look uniform", "To prevent the spread of infection to both staff and patients", "To keep staff warm", "To replace the need for cleaning"], 
        a: 1, 
        hint: "إنها حاجز مادي بين الميكروبات وبينك (أو بينك وبين المريض).",
        explanation: "الـ PPE تعمل كحاجز يمنع انتقال العدوى من المريض للموظف والعكس."
      },
      { 
        q: "When should you change your PPE (like gloves and gown)?", 
        type: "mcq", 
        options: ["At the end of your shift", "When they become heavily soiled or before a new procedure", "Only if the patient asks you to", "Once a day"], 
        a: 1, 
        hint: "لا تنتقل من مريض لآخر بنفس المعدات الملوثة.",
        explanation: "يجب تغيير الـ PPE فوراً إذا تلوثت بشدة، وبين الإجراءات المختلفة، وبين المرضى."
      },
      { 
        q: "What should you do if you have a cut on your hand?", 
        type: "mcq", 
        options: ["Wash it with extra soap.", "Cover it with a waterproof bandage.", "Avoid washing that hand.", "Wear an extra pair of gloves."], 
        a: 1, 
        hint: "الجرح المفتوح هو مدخل سهل للميكروبات، لذا يجب تغطيته.",
        explanation: "يجب تغطية أي جروح بضمادة مقاومة للماء (Waterproof bandage) قبل ارتداء القفازات لمنع دخول العدوى."
      },
      { 
        q: "What is the purpose of the 'rotational rubbing of thumbs' step?", 
        type: "mcq", 
        options: ["To clean the palms", "To clean the often-missed thumbs", "To clean the wrists", "To dry the hands faster"], 
        a: 1, 
        hint: "الإبهام هو جزء آخر يتم إهماله كثيراً إذا لم يتم فركه بشكل مخصص.",
        explanation: "الإبهام غالباً ما يُنسى في الغسيل العادي، لذا خصصت له خطوة (Rotational rubbing) لضمان نظافته."
      }
    ]
  },

  clinical_3: {
    title: "Hand Hygiene & PPE - Part 3",
    questions: [
      { 
        q: "Who is responsible for performing hand hygiene correctly?", 
        type: "mcq", 
        options: ["Only doctors", "Only nurses", "Anyone involved in patient care", "Only cleaning staff"], 
        a: 2, 
        hint: "مكافحة العدوى هي مسؤولية 'الجميع' في البيئة الصحية.",
        explanation: "كل شخص يلمس المريض أو بيئته (أطباء، ممرضين، عمال، فنيين) مسؤول عن نظافة اليدين."
      },
      { 
        q: "The main reason for the specific hand rubbing steps is to:", 
        type: "mcq", 
        options: ["Make it a fun activity", "Ensure every part of the hand is cleaned", "Follow the latest trend", "Use more soap or sanitizer"], 
        a: 1, 
        hint: "الخطوات (بين الأصابع، ظهر اليد، أطراف الأصابع، الإبهام) تضمن عدم ترك أي منطقة.",
        explanation: "الخطوات المحددة من WHO تهدف لتغطية المناطق التي يتم إهمالها عادةً (بين الأصابع، ظهر اليد، الإبهام)."
      },
      { 
        q: "When must health professionals use PPE?", 
        type: "mcq", 
        options: ["Only during surgical procedures.", "When they remember to do so.", "When undertaking any procedure that carries an infection risk.", "Only when dealing with patients known to be infectious."], 
        a: 2, 
        hint: "الاستخدام يعتمد على 'الإجراء' والمخاطر المتوقعة، وليس فقط على المريض.",
        explanation: "استخدام الـ PPE يعتمد على تقييم المخاطر (Risk Assessment) لكل إجراء، وليس فقط على حالة المريض."
      },
      { 
        q: "The effectiveness of PPE is heavily dependent on:", 
        type: "mcq", 
        options: ["The color and brand of the equipment.", "The user's skill in putting it on (donning) and taking it off (doffing).", "How expensive the equipment was.", "The time of day it is used."], 
        a: 1, 
        hint: "الخلع (Doffing) بطريقة خاطئة يمكن أن يلوثك، مما يبطل الغرض من ارتدائها.",
        explanation: "أهم جزء في استخدام الـ PPE هو معرفة كيفية خلعها بأمان دون تلويث نفسك (Self-contamination)."
      },
      { 
        q: "How does PPE protect vulnerable patients?", 
        type: "mcq", 
        options: ["By making the healthcare environment look more professional.", "By curing them of their existing infections.", "By preventing them from acquiring infections from staff.", "By reducing the cost of their hospital stay."], 
        a: 2, 
        hint: "مثال: ارتداء قناع جراحي لحماية مريض يعاني من نقص المناعة.",
        explanation: "الـ PPE تعمل كحاجز يمنع الميكروبات الموجودة على ملابس أو جسم الموظف من الانتقال للمريض."
      },
      { 
        q: "When should PPE be changed?", 
        type: "mcq", 
        options: ["At the end of each shift.", "Only when it is visibly torn.", "Whenever it is heavily splashed and between procedures with different patients.", "Once a day to save resources."], 
        a: 2, 
        hint: "يجب عدم الانتقال من مريض لآخر بنفس المعدات لمنع انتقال العدوى.",
        explanation: "يجب تغيير الـ PPE عند الانتقال من مريض لآخر أو عند تلوثها بشدة لضمان فعالية العزل."
      }
    ]
  },

  clinical_4: {
    title: "Patient Positioning - Part 1",
    questions: [
      { 
        q: "What is the primary interval recommended for regularly changing a client's position?", 
        type: "mcq", 
        options: ["Every 1 hour", "Every 2 hours", "Every 3 hours", "Once per shift"], 
        a: 1, 
        hint: "هذه هي المدة القياسية الموصى بها لمنع قرح الفراش (Pressure ulcers).",
        explanation: "تغيير الوضع كل ساعتين (q2h) هو المعيار الذهبي لتخفيف الضغط والسماح للدورة الدموية بالعودة للأنسجة المضغوطة."
      },
      { 
        q: "Before and after a position change, what essential aspect of care should a nurse assess and provide?", 
        type: "mcq", 
        options: ["Oral hygiene", "Range of motion exercises", "Skin assessment and skin care", "Vital signs monitoring"], 
        a: 2, 
        hint: "عند تغيير الوضع، أنت تكشف الجلد، وهي فرصة مثالية لفحصه والاعتناء به.",
        explanation: "تغيير الوضع هو الفرصة الأفضل لفحص الجلد بحثاً عن احمرار أو قرح (Skin breakdown) وتنظيفه."
      },
      { 
        q: "One of the main purposes of patient positioning is to prevent muscle discomfort, contractures, and what other body issue?", 
        type: "mcq", 
        options: ["Increased pain perception", "Body deformities", "Respiratory alkalosis", "Fluid volume deficit"], 
        a: 1, 
        hint: "البقاء في وضع واحد لفترة طويلة يمكن أن يؤدي إلى تشوهات دائمة (مثل 'سقوط القدم').",
        explanation: "الوضعيات غير الصحيحة لفترات طويلة تؤدي إلى تشوهات في العظام والمفاصل (Deformities) وتقلصات دائمة."
      },
      { 
        q: "Which principle should be followed when positioning a patient, particularly concerning the mattress?", 
        type: "mcq", 
        options: ["The mattress should be soft and conforming to the body.", "The mattress should be firm and support natural body curvatures.", "The mattress should be replaced every 24 hours.", "The client should never lie directly on the mattress."], 
        a: 1, 
        hint: "المرتبة اللينة جداً تسبب انحناءات غير طبيعية في العمود الفقري.",
        explanation: "المرتبة الصلبة والمستوية توفر الدعم اللازم للعمود الفقري وتحافظ على استقامته الطبيعية."
      },
      { 
        q: "Wrinkled or damp sheets significantly increase the risk for:", 
        type: "mcq", 
        options: ["Muscle atrophy", "Pressure ulcer formation", "Decreased circulation", "Joint stiffness"], 
        a: 1, 
        hint: "التجاعيد تسبب ضغطاً مركزاً، والرطوبة تضعف الجلد.",
        explanation: "التجاعيد تسبب نقاط ضغط، والرطوبة تسبب تهرؤ الجلد (Maceration)، وكلاهما يسرع حدوث قرح الفراش."
      },
      { 
        q: "In positioning, what should be avoided, especially with bony prominences?", 
        type: "mcq", 
        options: ["Placing one body part directly on top of another body part.", "Using supportive devices like pillows.", "Turning the patient systematically.", "Consulting the client about their comfort."], 
        a: 0, 
        hint: "مثال: وضع الركبتين أو الكاحلين فوق بعضهما مباشرة يزيد من الضغط.",
        explanation: "وضع جزء عظمي فوق آخر (مثل الركبتين) يضاعف الضغط ويسبب تقرحات، لذا يجب وضع وسادة بينهما."
      },
      { 
        q: "For clients capable of movement, what is a potential negative consequence of using too many supportive devices?", 
        type: "mcq", 
        options: ["Decreased risk for contractures", "Limited mobility, muscle weakness, and atrophy", "Increased comfort and relaxation", "Enhanced physiological functions"], 
        a: 1, 
        hint: "إذا تم 'تثبيت' المريض بالوسائد، فإنه لن يتمكن من الحركة، مما يؤدي إلى 'ضمور' العضلات.",
        explanation: "الإفراط في استخدام الوسائد قد يقيد حركة المريض النشط، مما يؤدي إلى ضعف العضلات وضمورها."
      },
      { 
        q: "What is the final step of documenting a position change?", 
        type: "mcq", 
        options: ["Recording the client's new vital signs.", "Listing all the supportive devices available in the room.", "Documenting the time, position moved from/to, and the client's response.", "Charting the next scheduled position change time."], 
        a: 2, 
        hint: "التوثيق يجب أن يتضمن ماذا فعلت، ومتى، وكيف استجاب المريض (مثل: هل كان مرتاحاً؟).",
        explanation: "التوثيق الدقيق يشمل الوقت، الوضع الجديد، واستجابة المريض (ألم، راحة) لضمان استمرارية الرعاية."
      },
      { 
        q: "What category of patients primarily relies on nurses for position changes?", 
        type: "mcq", 
        options: ["Ambulatory patients", "Patients who can move easily", "Patients who are weak, frail, paralyzed, or unconscious", "Patients undergoing daily physical therapy"], 
        a: 2, 
        hint: "المرضى الذين لا يستطيعون تغيير وضعهم بأنفسهم.",
        explanation: "المرضى الضعفاء أو المشلولين أو فاقدي الوعي هم الأكثر عرضة لمضاعفات عدم الحركة ويحتاجون لمساعدة كاملة."
      },
      { 
        q: "Positioning the patient is essential to decrease the risk for bed sores by:", 
        type: "mcq", 
        options: ["Promoting normal physiological functions.", "Providing proper body alignment.", "Removing pressure on various parts.", "Stimulating circulation."], 
        a: 2, 
        hint: "قرح الفراش (Bed sores) تنتج عن الضغط المستمر على منطقة واحدة.",
        explanation: "تغيير الوضع يوزع الوزن ويزيل الضغط المستمر عن المناطق العظمية البارزة، مما يسمح بتدفق الدم."
      },
      { 
        q: "Which supportive device is specifically designed to keep the feet in dorsiflexion and prevent plantar flexion (foot drop)?", 
        type: "mcq", 
        options: ["Suspension or heel guard boot", "Trochanter roll", "Footboard", "High-top sneakers"], 
        a: 2, 
        hint: "لوح القدم (Footboard) يوفر سطحاً صلباً لدعم القدمين في زاوية 90 درجة.",
        explanation: "لوح القدم (Footboard) يحافظ على القدم في وضع زاوية قائمة (Dorsiflexion) لمنع قصر وتر أخيل وسقوط القدم."
      },
      { 
        q: "A triangular-shaped foam pillow used to maintain hip abduction, often following total hip replacement, is called a(n):", 
        type: "mcq", 
        options: ["Trochanter roll", "Abduction pillow", "Hand and wrist splint", "Bed board"], 
        a: 1, 
        hint: "وسادة 'الإبعاد' (Abduction) تبقي الساقين متباعدتين لمنع خلع مفصل الفخذ.",
        explanation: "وسادة الإبعاد (Abduction pillow) توضع بين الساقين لمنعهما من التقارب (Adduction) الذي قد يخلع مفصل الفخذ الصناعي."
      },
      { 
        q: "Which device is made from tightly rolled towels or foam pads and is placed adjacent to the hips and thighs to prevent their external rotation?", 
        type: "mcq", 
        options: ["Sandbag", "Heel or elbow protector", "Trochanter roll", "Hand roll"], 
        a: 2, 
        hint: "تُستخدم لمنع دوران 'المدور' (Trochanter) في عظم الفخذ للخارج.",
        explanation: "Trochanter roll توضع بجانب الورك لمنع الساق من الدوران للخارج (External rotation) الذي قد يسبب ضرراً للمفصل."
      },
      { 
        q: "What is the primary purpose of a Hand Roll, which can be made by rolling a washcloth?", 
        type: "mcq", 
        options: ["To keep the hand in a functional position and prevent finger contractures.", "To relieve pressure on the elbow.", "To prevent wrist drop.", "To secure the IV line."], 
        a: 0, 
        hint: "تمنع اليد من الانقباض بشكل دائم (Contractures) في وضع 'القبضة'.",
        explanation: "لفافة اليد (Hand roll) تحافظ على الأصابع في وضع وظيفي (مفتوحة قليلاً) وتمنع تيبسها في وضعية الانقباض."
      },
      { 
        q: "What device is attached to an overhead bed frame and helps the patient change positions in bed with minimal or self-help?", 
        type: "mcq", 
        options: ["Side rails", "Bed loops", "Bed cradle", "Trapeze Bar"], 
        a: 3, 
        hint: "الـ 'ترابيز' هو مقبض مثلثي يتدلى فوق السرير.",
        explanation: "الـ Trapeze Bar يسمح للمريض باستخدام قوة ذراعيه لرفع جذعه، مما يسهل الحركة ويعزز استقلاليته."
      },
      { 
        q: "Which device is placed under the entire mattress to improve spinal alignment by providing firm support?", 
        type: "mcq", 
        options: ["Waterbed mattress", "Egg-crate mattress", "Bed board", "Suspension boot"], 
        a: 2, 
        hint: "لوح السرير (Bed board) يجعل المرتبة 'أكثر صلابة'.",
        explanation: "لوح السرير (Bed board) يوضع تحت المرتبة لزيادة صلابتها ودعم العمود الفقري، خاصة إذا كانت المرتبة لينة جداً."
      },
      { 
        q: "Metal or plastic devices secured at the foot of the bed to hold bedding up off the toes are known as:", 
        type: "mcq", 
        options: ["Over Bed Table", "Bed cradle", "Footboard", "Side rails"], 
        a: 1, 
        hint: "'مهد' السرير (Bed cradle) يرفع الغطاء عن القدمين لمنع الضغط.",
        explanation: "مهد السرير (Bed cradle) يخلق قبة فوق القدمين لمنع وزن الأغطية من الضغط عليها، مما يحمي من قرح الكعب وسقوط القدم."
      },
      { 
        q: "What is the main difference between Trochanter Rolls and Sandbags in terms of support provided?", 
        type: "mcq", 
        options: ["Trochanter rolls are used only for the hips, while sandbags are used only for the feet.", "Sandbags provide firmer support.", "Trochanter rolls are used only after surgery.", "Sandbags are lighter and easier to position."], 
        a: 1, 
        hint: "أكياس الرمل (Sandbags) أثقل وتوفر دعماً أكثر ثباتاً.",
        explanation: "أكياس الرمل (Sandbags) أثقل من اللفافات القماشية، لذا توفر تثبيتاً أقوى ودعماً أكثر صلابة للجزء المراد تثبيته."
      },
      { 
        q: "What is the purpose of Heel or Elbow Protectors?", 
        type: "mcq", 
        options: ["To prevent foot drop.", "To reduce mattress pressure and alleviate friction.", "To hold the joint in a natural position.", "To prevent hip rotation."], 
        a: 1, 
        hint: "هذه المناطق (الكعب والكوع) هي مناطق 'عظمية' معرضة بشدة لقرح الضغط.",
        explanation: "واقيات الكعب والكوع (Protectors) تقلل الاحتكاك والضغط المباشر على هذه المناطق العظمية الحساسة."
      },
      { 
        q: "The Orthopneic position is particularly helpful for clients with problems exhaling because:", 
        type: "mcq", 
        options: ["It allows them to press the lower part of the chest against the overbed table.", "It prevents hip dislocation.", "It maintains the knees in a flexed position.", "It decreases pressure on the heels."], 
        a: 0, 
        hint: "الضغط على الصدر يساعد على 'إخراج' الهواء (الزفير)، مفيد لمرضى الانسداد الرئوي المزمن.",
        explanation: "الضغط على أسفل الصدر في وضع الجلوس المائل للأمام يساعد في إخراج الهواء من الرئتين (الزفير)، وهو أمر حيوي لمرضى COPD."
      }
    ]
  },

  clinical_5: {
    title: "Patient Positioning - Part 2",
    questions: [
      { 
        q: "The Orthopneic position facilitates respiration by allowing what?", 
        type: "mcq", 
        options: ["Reduced metabolic demand", "Maximum chest expansion", "Full hip extension", "Decreased cerebral blood flow"], 
        a: 1, 
        hint: "الجلوس والانحناء للأمام يسمح للرئتين بالتمدد 'لأقصى' درجة ممكنة.",
        explanation: "هذا الوضع يسمح للقفص الصدري بالتمدد الكامل ويزيل ضغط أعضاء البطن عن الحجاب الحاجز، مما يسهل التنفس."
      },
      { 
        q: "Which type of position is typically used for lower abdominal, colorectal, and gynecological surgeries, and also for central venous catheter placement?", 
        type: "mcq", 
        options: ["Reverse Trendelenburg Position", "Jackknife Position", "Lithotomy Position", "Trendelenburg Position"], 
        a: 3, 
        hint: "هذا الوضع (الرأس لأسفل والقدمين لأعلى) يستخدم الجاذبية لإبعاد الأعضاء عن منطقة الحوض.",
        explanation: "وضع ترندلنبرغ (Trendelenburg) يساعد في إزاحة الأمعاء لأعلى بعيداً عن الحوض، ويزيد تدفق الدم الوريدي للقلب (في حالات تركيب القسطرة)."
      },
      { 
        q: "The Dorsal Recumbent Position can be used to assess which areas?", 
        type: "mcq", 
        options: ["Spine and back", "Head and neck only", "Female genitals, rectum, and female reproductive tract", "Lower extremities and reflexes only"], 
        a: 2, 
        hint: "هذا هو وضع الاستلقاء على الظهر مع ثني الركبتين، وهو شائع في فحوصات النساء.",
        explanation: "الوضع الظهري (Dorsal Recumbent) يريح عضلات البطن ويسهل فحص المنطقة التناسلية والمستقيم."
      },
      { 
        q: "The Sitting Position is appropriate for assessing which of the following?", 
        type: "mcq", 
        options: ["Only the abdomen", "Head, neck, thorax, breasts, heart, and extremities", "Only the spinal column", "Only the reflexes and vital signs"], 
        a: 1, 
        hint: "وضع الجلوس مثالي لفحص الجزء العلوي من الجسم.",
        explanation: "الجلوس يسمح بالتمدد الكامل للرئتين ويسهل فحص الرأس، الرقبة، الصدر، القلب، والظهر."
      },
      { 
        q: "The Orthopneic position is classified as a:", 
        type: "mcq", 
        options: ["Examination position", "Surgical position", "Comfort position", "Hypotensive position"], 
        a: 2, 
        hint: "يُستخدم بشكل أساسي لمرضى (COPD) أو قصور القلب الذين يشعرون بضيق في التنفس عند الاستلقاء.",
        explanation: "يُصنف كوضع 'راحة' (Comfort Position) لأنه يخفف من ضيق التنفس (Orthopnea) ويساعد المريض على الراحة والنوم."
      },
      { 
        q: "Examination positions are typically used for what duration?", 
        type: "mcq", 
        options: ["For long periods (2 hours)", "For a short period of time", "Only during sleep", "Only when the patient is unconscious"], 
        a: 1, 
        hint: "تُستخدم فقط أثناء 'الفحص' السريري.",
        explanation: "أوضاع الفحص (مثل Lithotomy) غالباً ما تكون غير مريحة أو محرجة، لذا تستخدم لفترات قصيرة جداً أثناء الفحص فقط."
      },
      { 
        q: "The Lithotomy Position is typically used for procedures related to:", 
        type: "mcq", 
        options: ["Spine and neck", "Gynecology, colorectal, urology, perineal, or pelvis", "Gallbladder and stomach", "Cardiovascular system"], 
        a: 1, 
        hint: "هذا هو وضع 'الولادة' أو فحص أمراض النساء.",
        explanation: "وضع الليثوتومي (رفع الساقين) يوفر أفضل وصول للمنطقة التناسلية والشرجية لإجراء العمليات والفحوصات."
      },
      { 
        q: "Before turning a client, the bed should be adjusted to a flat position or:", 
        type: "mcq", 
        options: ["As high as the nurse can reach comfortably.", "As low as the client can tolerate.", "Trendelenburg position.", "Reverse Trendelenburg position."], 
        a: 1, 
        hint: "تسطيح السرير يسهل عملية الدوران ويقلل من الاحتكاك، ولكن إذا كان المريض لا يستطيع تحمل الوضع المسطح، يُخفض 'بقدر ما يمكن'.",
        explanation: "يجب جعل السرير مسطحاً (Flat) لتسهيل الحركة، ولكن إذا كان المريض يعاني من ضيق تنفس، نخفضه لأقصى درجة يتحملها."
      },
      { 
        q: "Why should the nurse raise the bed to a height appropriate for personnel safety (at the caregiver's elbows)?", 
        type: "mcq", 
        options: ["To prevent the client from sliding off the bed.", "To facilitate better client participation.", "To follow the principles of proper body mechanics.", "To allow for easier documentation."], 
        a: 2, 
        hint: "هذا يمنع الممرض من الانحناء المفرط ويحمي ظهره.",
        explanation: "رفع السرير لمستوى العمل (مستوى المرفق) يحمي ظهر الممرض من الإصابة ويقلل الجهد المبذول."
      },
      { 
        q: "When preparing to turn a client to the lateral position, why is it necessary to move the client closer to the side of the bed opposite the side they will face?", 
        type: "mcq", 
        options: ["To prevent friction-reducing devices from slipping.", "To ensure the client will be positioned safely in the center of the bed after turning.", "To maintain proper spinal alignment.", "To make it easier for the client to grab the side rails."], 
        a: 1, 
        hint: "إذا لم تفعل ذلك، سينتهي الأمر بالمريض على حافة السرير بعد لفه.",
        explanation: "إذا أردت لف المريض لليمين، يجب سحبه لليسار أولاً، بحيث عندما يلتف يستقر في منتصف السرير بأمان."
      },
      { 
        q: "When turning a client to the lateral position, what action facilitates the turning motion?", 
        type: "mcq", 
        options: ["Placing the client's far arm across the chest.", "Pulling the client's near arm forward across the chest.", "Elevating the head of the bed to 45 degrees.", "Placing the knees in a flexed position."], 
        a: 1, 
        hint: "وضع الذراع 'البعيدة' على الصدر يمنع المريض من التدحرج عليها.",
        explanation: "وضع الذراع البعيدة على الصدر والساق البعيدة فوق القريبة يخلق عزم دوران يسهل لف الجسم."
      },
      { 
        q: "When rolling a client to the lateral position, the nurse places one hand on the client's far shoulder and the other hand on the client's:", 
        type: "mcq", 
        options: ["Near hip", "Far knee", "Far hip", "Near ankle"], 
        a: 2, 
        hint: "السحب من الكتف والورك 'البعيدين' يوفر أفضل رافعة للدوران.",
        explanation: "الكتف والورك هما أثقل نقطتين في الجسم، وتحريكهما معاً يضمن دوران الجسم كوحدة واحدة (Logrolling) دون التواء."
      },
      { 
        q: "To prevent the far arm from being caught beneath the client's body during the roll to the lateral position, the nurse should:", 
        type: "mcq", 
        options: ["Keep it alongside the body.", "Place it across the client's chest.", "Abduct it slightly and externally rotate the shoulder.", "Place a pillow underneath it."], 
        a: 2, 
        hint: "'إبعاد' الذراع (Abduct) قليلاً يمنع المريض من التدحرج عليها.",
        explanation: "إبعاد الذراع القريبة (التي سيتدحرج نحوها) يمنع انحشارها تحت الجسم ويعطي مساحة للدوران."
      },
      { 
        q: "What is an important exception when turning a client to the prone position (على البطن) compared to the lateral position?", 
        type: "mcq", 
        options: ["The client must be in the Trendelenburg position.", "Instead of abducting the far arm, keep the client's arm alongside the body to roll over.", "The client must wear a footboard.", "It only requires one nurse."], 
        a: 1, 
        hint: "عند الدوران على البطن، يجب أن تكون الذراع التي ستتدحرج عليها 'بجانب' الجسم.",
        explanation: "عند اللف للوضع المنبطح (Prone)، يجب وضع الذراع بجانب الجسم حتى يتدحرج الجسم 'فوقها' بسهولة، بدلاً من إبعادها."
      },
      { 
        q: "Why should a nurse never pull a client across the bed while the client is in the prone position?", 
        type: "mcq", 
        options: ["It can injure a woman's breasts or a man's genitals.", "It increases the risk of foot drop.", "It can damage the bed sheets.", "It is an ineffective technique."], 
        a: 0, 
        hint: "السحب في وضع الانبطاح يسبب احتكاكاً ضاراً على الأنسجة الرخوة في الأمام.",
        explanation: "سحب المريض وهو على بطنه يسبب احتكاكاً شديداً وضغطاً على الأنسجة الحساسة (الثدي، الأعضاء التناسلية)، مما قد يسبب إصابة."
      },
      { 
        q: "Before performing the turning procedure, the nurse's first action should be to:", 
        type: "mcq", 
        options: ["Lock the wheels on the bed.", "Perform hand hygiene and introduce self/verify client identity.", "Raise the bed to a working height.", "Remove all pillows."], 
        a: 1, 
        hint: "دائماً، الخطوة الأولى هي غسل اليدين والتحقق من هوية المريض وشرح الإجراء.",
        explanation: "سلامة المريض والتواصل (غسل اليدين، التعريف، الشرح) هي دائماً الأولوية القصوى قبل أي إجراء جسدي."
      },
      { 
        q: "When preparing to turn a patient, what action is taken with the bed wheels?", 
        type: "mcq", 
        options: ["They are left unlocked for easy movement.", "They are locked and the rail on the side opposite the nurse is raised.", "They are locked and both side rails are lowered.", "They are removed temporarily."], 
        a: 1, 
        hint: "قفل العجلات يمنع السرير من التحرك، ورفع الحاجز الجانبي 'الآخر' يمنع المريض من السقوط.",
        explanation: "قفل العجلات يضمن ثبات السرير، ورفع الحاجز الجانبي المقابل يمنع المريض من السقوط أثناء الدوران نحوه."
      },
      { 
        q: "Which condition would least require significant positioning assistance from a nurse?", 
        type: "mcq", 
        options: ["Paralysis", "Severe pain", "Weakness", "Ability to move easily for comfort"], 
        a: 3, 
        hint: "المريض القادر على الحركة بسهولة لا يحتاج إلى مساعدة كبيرة.",
        explanation: "المريض القادر على الحركة (Independent) يحتاج فقط لتوجيه بسيط، عكس المشلول أو الضعيف."
      },
      { 
        q: "The term for placing a client on their side, which is often necessary when placing a bedpan or changing linens, is:", 
        type: "mcq", 
        options: ["Prone", "Supine", "Lateral", "Orthopneic"], 
        a: 2, 
        hint: "الوضع 'الجانبي' (Lateral) هو الاستلقاء على أحد الجانبين.",
        explanation: "الوضع الجانبي (Lateral Position) يستخدم بشكل روتيني لتغيير الملاءات، العناية بالظهر، ووضع النونية."
      },
      { 
        q: "Which position is typically used for head and neck surgeries?", 
        type: "mcq", 
        options: ["Lithotomy", "Reverse Trendelenburg", "Trendelenburg", "Knee Chest"], 
        a: 1, 
        hint: "الوضع 'العكسي' (الرأس لأعلى والقدمين لأسفل) يقلل من تدفق الدم إلى الرأس.",
        explanation: "وضع ترندلنبرغ العكسي (Reverse Trendelenburg) يقلل تدفق الدم للرأس والرقبة، مما يقلل النزيف أثناء الجراحة."
      }
    ]
  },

  clinical_6: {
    title: "Patient Positioning - Part 3",
    questions: [
      { 
        q: "An Over Bed Table, when arranged with pillows to keep a patient in a sitting position on the bed, is sometimes referred to as a:", 
        type: "mcq", 
        options: ["Bed board", "Trapeze Bar", "Cardiac table", "Bed Loop"], 
        a: 2, 
        hint: "تُسمى 'طاولة القلب' (Cardiac table) لأنها تساعد مرضى القلب الذين يعانون من ضيق التنفس.",
        explanation: "تسمى 'Cardiac table' لأن مرضى القلب يستخدمونها للاستناد عليها في وضع Orthopneic لتسهيل التنفس."
      },
      { 
        q: "The purpose of using a friction-reducing device or mechanical lift when moving a client to the side of the bed is:", 
        type: "mcq", 
        options: ["To increase the client's muscle strength.", "To maintain proper body alignment during the pull.", "To prevent external rotation of the hips.", "To stimulate circulation."], 
        a: 1, 
        hint: "تقليل الاحتكاك يمنع 'قوى القص' (Shearing forces) ويحافظ على استقامة الجسم.",
        explanation: "أجهزة تقليل الاحتكاك تسمح بنقل المريض بسلاسة دون سحب أو التواء، مما يحافظ على استقامة العمود الفقري."
      },
      { 
        q: "What specific complication of immobility does positioning help to prevent?", 
        type: "mcq", 
        options: ["Increased appetite", "Normal physiological functions", "Contractures", "Improved joint range of motion"], 
        a: 2, 
        hint: "الـ 'Contractures' هي تقبضات دائمة في المفاصل والعضلات بسبب عدم الحركة.",
        explanation: "الوضعيات الصحيحة تمنع تيبس العضلات وقصرها (Contractures) الذي يحدث إذا بقيت المفاصل في وضع واحد طويلاً."
      },
      { 
        q: "What is the role of the second individual(s) when rolling a client to the lateral position?", 
        type: "mcq", 
        options: ["To document the procedure.", "To secure the bed cradle.", "To help roll the client from the opposite side of the bed.", "To remove the pillows."], 
        a: 2, 
        hint: "عادةً، يقف المساعدون على الجانب الذي 'سيتجه' إليه المريض للمساعدة في سحبه.",
        explanation: "وجود مساعدين على الجانب المقابل يضمن استقبال المريض بأمان ومنعه من السقوط أثناء اللف."
      },
      { 
        q: "Which position involves the patient lying flat on their back with knees flexed, and feet flat on the bed?", 
        type: "mcq", 
        options: ["Lithotomy Position", "Jackknife Position", "Dorsal Recumbent Position", "Kidney Position"], 
        a: 2, 
        hint: "الوضع 'الظهري المستلقي' (Dorsal Recumbent) يستخدم للفحص البطني أو التناسلي.",
        explanation: "Dorsal Recumbent هو الاستلقاء على الظهر مع ثني الركبتين، مما يريح عضلات البطن للفحص."
      },
      { 
        q: "If a client is capable of movement, which supportive devices should be used judiciously (carefully to avoid limiting mobility)?", 
        type: "mcq", 
        options: ["Pillows", "Side rails", "Bed boards", "All supportive devices"], 
        a: 3, 
        hint: "أي جهاز دعم (حتى الوسائد) يمكن أن يصبح 'عائقاً' إذا تم استخدامه بشكل مفرط.",
        explanation: "يجب عدم المبالغة في استخدام الأجهزة الداعمة للمريض القادر على الحركة، لأنها قد تعيق حركته الطبيعية وتسبب الاعتمادية."
      }
    ]
  },

  clinical_7: {
    title: "Body Mechanics - Part 1",
    questions: [
      { 
        q: "What is the primary definition of Body Mechanics according to the text?", 
        type: "mcq", 
        options: ["The use of mechanical lifts for all patient transfers.", "The study of the human musculoskeletal system.", "The efficient, coordinated, and safe use of the body to move objects and carry out ADLs.", "The process of aligning a client's body for comfort."], 
        a: 2, 
        hint: "إنها 'الطريقة' التي نستخدم بها أجسامنا بكفاءة وأمان.",
        explanation: "ميكانيكا الجسم هي الاستخدام المتناسق والفعال للجسم لأداء المهام (مثل الرفع) بأقل جهد وأقصى أمان."
      },
      { 
        q: "Which of the following is NOT listed as a purpose of good body mechanics?", 
        type: "mcq", 
        options: ["To avoid skeletal injury.", "To increase client independence.", "To conserve energy.", "To prevent excessive fatigue."], 
        a: 1, 
        hint: "ميكانيكا الجسم تركز على 'سلامة' الممرض، وليس على استقلالية المريض (رغم أنها قد تكون نتيجة ثانوية).",
        explanation: "الهدف الرئيسي لميكانيكا الجسم هو حماية الممرض من الإصابة وتوفير الطاقة، وليس زيادة استقلالية المريض (رغم أهميتها)."
      },
      { 
        q: "The term used to describe the relationship of body parts to one another is:", 
        type: "mcq", 
        options: ["Center of Gravity.", "Base of Support.", "Line of Gravity.", "Posture (alignment)."], 
        a: 3, 
        hint: "'القامة' أو 'الاستقامة' (Posture) هي كيفية ترتيب أجزاء الجسم.",
        explanation: "القامة (Posture) أو المحاذاة (Alignment) تشير إلى الترتيب الهندسي لأجزاء الجسم بالنسبة لبعضها البعض."
      },
      { 
        q: "The point at which the mass of a body or object is centered is known as the:", 
        type: "mcq", 
        options: ["Line of Gravity.", "Base of Support.", "Center of Gravity.", "Posture."], 
        a: 2, 
        hint: "في الإنسان، 'مركز الثقل' (Center of Gravity) يكون عادة في منطقة الحوض.",
        explanation: "مركز الثقل (Center of Gravity) هو النقطة التي يتركز فيها وزن الجسم، وتكون في منتصف الحوض عند الوقوف."
      },
      { 
        q: "The imaginary vertical line drawn through the body's center of gravity is called the:", 
        type: "mcq", 
        options: ["Base of Support.", "Line of Gravity.", "Posture.", "Center of Mass."], 
        a: 1, 
        hint: "'خط الجاذبية' يجب أن يقع داخل قاعدة الدعم لتحقيق التوازن.",
        explanation: "خط الجاذبية (Line of Gravity) هو خط وهمي عمودي يمر عبر مركز الثقل، ويحدد توازن الجسم."
      },
      { 
        q: "To maintain correct body alignment and prevent back muscle fatigue when lifting, a caregiver should:", 
        type: "mcq", 
        options: ["Always twist the body toward the object.", "Keep the back as straight as possible.", "Stop the back frequently.", "Use small, jerky motions."], 
        a: 1, 
        hint: "القاعدة الذهبية: 'ارفع بساقيك، وليس بظهرك'. حافظ على استقامة الظهر.",
        explanation: "الحفاظ على استقامة الظهر يقلل الضغط على الفقرات ويمنع إصابات الديسك؛ الرفع يجب أن يتم بقوة الساقين."
      },
      { 
        q: "To shift work to the large and strongest muscles (hips and legs) when lifting, a caregiver should:", 
        type: "mcq", 
        options: ["Bend at the waist.", "Keep knees straight.", "Bend knees instead of the back.", "Use only arm muscles."], 
        a: 2, 
        hint: "الانحناء من الركبتين (القرفصاء) يستخدم عضلات الفخذين الكبيرة.",
        explanation: "ثني الركبتين (Squatting) ينقل الحمل إلى عضلات الفخذ القوية بدلاً من عضلات الظهر الضعيفة نسبياً."
      },
      { 
        q: "Maximum stability is achieved when the line of gravity:", 
        type: "mcq", 
        options: ["Falls outside the base of support.", "Is as close as possible to the center of the base of support.", "Is as close as possible to the edge of the base of support.", "Is not considered."], 
        a: 1, 
        hint: "لتحقيق التوازن، يجب أن يكون خط الجاذبية في 'وسط' قاعدة الدعم.",
        explanation: "كلما كان خط الجاذبية أقرب لمركز قاعدة الدعم (المساحة بين القدمين)، كان الجسم أكثر استقراراً."
      },
      { 
        q: "The technique used to turn the body in a way that avoids twisting of the spine is called:", 
        type: "mcq", 
        options: ["Logrolling.", "Dangling.", "Pivoting.", "Flexing."], 
        a: 0, 
        hint: "'لف الجذع' (Logrolling) يحرك الجسم كوحدة واحدة (مثل جذع شجرة).",
        explanation: "Logrolling هي التقنية الوحيدة التي تضمن دوران العمود الفقري كقطعة واحدة دون التواء، وتستخدم لإصابات الظهر."
      },
      { 
        q: "The maximum weight a nurse should lift without assistance from proper equipment or other individuals is:", 
        type: "mcq", 
        options: ["50 pounds (22.7 kg).", "35 pounds (15.9 kg).", "45 pounds (20.4 kg).", "25 pounds (11.3 kg)."], 
        a: 1, 
        hint: "توصي (NIOSH) بهذا الحد (35 رطلاً) لتقليل إصابات الظهر.",
        explanation: "المعهد الوطني للسلامة (NIOSH) يوصي بألا يتجاوز الوزن الذي يرفعه الموظف منفرداً 35 رطلاً."
      },
      { 
        q: "Which action should be used when lifting an object from the ground to utilize hip and leg muscles?", 
        type: "mcq", 
        options: ["Stoop down and keep knees straight.", "Flex knees and stoop down, keeping the back straight.", "Round the back to increase leverage.", "Twist and lift simultaneously."], 
        a: 1, 
        hint: "القرفصاء (ثني الركبتين) مع استقامة الظهر هي الطريقة الصحيحة.",
        explanation: "النزول بالركبتين مع إبقاء الظهر مستقيماً يسمح باستخدام عضلات الفخذ للرفع ويحمي الظهر."
      },
      { 
        q: "When working with a team to lift or move a client, what is essential for coordination?", 
        type: "mcq", 
        options: ["Everyone lifts at their own pace.", "A team leader and a signal (e.g., 'count 1, 2, 3 and lift').", "Using only the arms to lift.", "Avoiding eye contact to maintain focus."], 
        a: 1, 
        hint: "العد (1، 2، 3) يضمن أن الجميع يرفعون في نفس اللحظة.",
        explanation: "وجود قائد للفريق وإشارة موحدة (العد) يضمن تزامن الحركة، مما يوزع الوزن بالتساوي ويمنع الإصابات."
      },
      { 
        q: "Why is it recommended to push, pull, or slide an object instead of lifting it?", 
        type: "mcq", 
        options: ["Lifting is against the line of gravity and requires more force.", "Pushing and pulling build more muscle.", "Sliding an object is always faster.", "Lifting is prohibited in all situations."], 
        a: 0, 
        hint: "الرفع يتطلب التغلب على الجاذبية بالكامل، وهو ما يستهلك أكبر قدر من القوة.",
        explanation: "الدفع أو السحب يتطلب طاقة أقل بكثير من الرفع لأنك لا تضطر لمقاومة الجاذبية الكاملة لوزن الجسم."
      },
      { 
        q: "Which piece of equipment is designed to help move a client with minimal friction?", 
        type: "mcq", 
        options: ["Mobile-powered mechanical lift.", "Sit-to-stand powered lift.", "Friction-reducing device.", "Ceiling-mounted lift."], 
        a: 2, 
        hint: "مثل الـ 'Slide sheet' (ملاءة الانزلاق)، هي مصممة لـ 'تقليل الاحتكاك'.",
        explanation: "أجهزة تقليل الاحتكاك (مثل Slide sheets) تجعل المريض ينزلق بسهولة، مما يقلل الجهد المطلوب للتحريك."
      },
      { 
        q: "An Air Transfer System is recommended for a client weighing more than 300 pounds (136.1 kg) with how many assistants?", 
        type: "mcq", 
        options: ["One assistant.", "Two assistants.", "Four assistants.", "Six assistants."], 
        a: 1, 
        hint: "نظام النقل الهوائي (المرتبة الهوائية) يقلل الاحتكاك بشكل كبير.",
        explanation: "لأن النظام الهوائي يقلل الاحتكاك بشكل هائل (كأن المريض يطفو)، يكفي مساعدان فقط حتى للأوزان الثقيلة جداً."
      },
      { 
        q: "A client weighing between 201-300 pounds (91.2- 136.1 kg) who is partially able to assist should be moved up in bed using:", 
        type: "mcq", 
        options: ["A friction-reducing device and two assistants.", "A friction-reducing slide sheet and four assistants OR an air transfer system and two assistants.", "Manual lifting by two nurses.", "A total transfer lift only."], 
        a: 1, 
        hint: "الوزن العالي يتطلب المزيد من الدعم أو تقنية أفضل (مثل الهواء).",
        explanation: "للأوزان المتوسطة إلى الثقيلة، نحتاج إما لـ 4 مساعدين مع ملاءة انزلاق، أو مساعدين اثنين مع نظام هوائي."
      },
      { 
        q: "Before moving a client up in bed, why is a pillow placed against the head of the bed?", 
        type: "mcq", 
        options: ["To make the client more comfortable.", "To protect the client's head from injury against the top of the bed.", "To maintain the Fowler's position.", "To help the nurse pull the client."], 
        a: 1, 
        hint: "لمنع اصطدام رأس المريض بلوح السرير العلوي.",
        explanation: "الوسادة تعمل كمصد (Bumper) لحماية رأس المريض من الارتطام بلوح السرير الصلب أثناء السحب لأعلى."
      },
      { 
        q: "What should be done with the bed wheels before moving a client up in bed?", 
        type: "mcq", 
        options: ["Keep them unlocked for easy adjustment.", "Lock them.", "Only lock the wheels nearest the head of the bed.", "Remove them entirely."], 
        a: 1, 
        hint: "'قفل' العجلات هو إجراء أمان قياسي لمنع تحرك السرير.",
        explanation: "قفل العجلات يمنع السرير من التحرك أثناء بذل الجهد، مما يحمي الممرض والمريض من السقوط."
      },
      { 
        q: "When moving a client who is able to reposition without assistance, the nurse should encourage the client to:", 
        type: "mcq", 
        options: ["Lift the head and pull up with only the arms.", "Push off with the feet and pull up with the arms simultaneously.", "Keep the body completely flat and still.", "Only push with the feet."], 
        a: 1, 
        hint: "استخدام الساقين (الدفع) والذراعين (السحب بالترابيز) هو الطريقة الأكثر فعالية للمريض.",
        explanation: "دفع السرير بالقدمين وسحب الجسم بالذراعين يسمح للمريض باستخدام عضلاته الكبيرة لتسهيل الحركة."
      },
      { 
        q: "For a client who is partially able to assist and weighs less than 200 pounds, the protocol suggests using:", 
        type: "mcq", 
        options: ["A total transfer lift.", "Manual lift by one assistant.", "A friction-reducing device and two assistants.", "A ceiling lift with a supine sling."], 
        a: 2, 
        hint: "هذا هو المعيار القياسي للوزن المتوسط مع مساعدة جزئية.",
        explanation: "حتى مع الوزن الخفيف والمساعدة الجزئية، يُفضل استخدام جهاز لتقليل الاحتكاك ومساعدين لحماية الظهر."
      }
    ]
  },

  clinical_8: {
    title: "Body Mechanics - Part 2",
    questions: [
      { 
        q: "When moving a client who is unable to assist, the recommended equipment/staff are:", 
        type: "mcq", 
        options: ["Friction-reducing slide sheet and four assistants.", "Use the ceiling lift with supine sling or mobile floor-based lift and two or more caregivers.", "Two nurses manually lifting.", "Ask the client to push on the count of three."], 
        a: 1, 
        hint: "إذا كان المريض 'غير قادر' على المساعدة، يجب استخدام 'رافعة ميكانيكية' (Lift).",
        explanation: "الرفع اليدوي لمريض غير قادر على المساعدة ممنوع؛ يجب استخدام رافعة ميكانيكية (Lift) لضمان السلامة."
      },
      { 
        q: "The main purpose of Logrolling is to turn a client while keeping the body:", 
        type: "mcq", 
        options: ["Bent at the hips and knees.", "In a completely straight alignment (like a log).", "Flexed laterally.", "Turned in segments."], 
        a: 1, 
        hint: "يتم تحريك العمود الفقري كوحدة واحدة لمنع أي التواء.",
        explanation: "Logrolling (دحرجة الجذع) تهدف للحفاظ على استقامة العمود الفقري تماماً كقطعة واحدة، وهو أمر حيوي لإصابات الظهر."
      },
      { 
        q: "Logrolling is typically used for clients with:", 
        type: "mcq", 
        options: ["Diabetes.", "Severe pressure ulcers.", "Back surgery or a spinal injury.", "Respiratory distress."], 
        a: 2, 
        hint: "يُستخدم هذا الأسلوب لأي شخص لديه إصابة في 'العمود الفقري'.",
        explanation: "يُستخدم حصرياً للمرضى الذين خضعوا لجراحة في الظهر أو لديهم إصابات في العمود الفقري لمنع تلف النخاع الشوكي."
      },
      { 
        q: "Before logrolling, the client's arms should be positioned:", 
        type: "mcq", 
        options: ["Extended straight above the head.", "Held by the nurses.", "Across the chest.", "Dangling over the side of the bed."], 
        a: 2, 
        hint: "وضع الذراعين متقاطعتين على الصدر يمنعهما من الانحشار تحت الجسم.",
        explanation: "وضع الذراعين على الصدر يبقيهما في مأمن ويمنعهما من الانحشار تحت الجسم أثناء الدوران."
      },
      { 
        q: "During logrolling, the client is first pulled to the side of the bed by how many nurses on the same side?", 
        type: "mcq", 
        options: ["One nurse.", "Two nurses.", "Three nurses.", "Four nurses."], 
        a: 1, 
        hint: "عادةً ما يتطلب هذا الإجراء 2-3 ممرضين، لكنهم يقفون على 'نفس' الجانب للسحب أولاً.",
        explanation: "Logrolling يتطلب ممرضين على الأقل (أو ثلاثة) يعملون بتزامن تام للحفاظ على الاستقامة."
      },
      { 
        q: "Why is a pillow placed between the client's legs before logrolling?", 
        type: "mcq", 
        options: ["To increase comfort during the move.", "To prevent adduction of the upper leg and keep the legs aligned.", "To help the client push off the bed.", "To prevent the nurse from twisting their back."], 
        a: 1, 
        hint: "الوسادة تحافظ على 'استقامة' الحوض والعمود الفقري.",
        explanation: "الوسادة تمنع الساق العليا من السقوط للأمام (Adduction) مما قد يسبب التواء في العمود الفقري القطني."
      },
      { 
        q: "Dangling is performed primarily to prepare a client for:", 
        type: "mcq", 
        options: ["Logrolling.", "Moving to a chair/wheelchair or walking.", "A full bed bath.", "Sleeping."], 
        a: 1, 
        hint: "'التدلي' (Dangling) هو جعل المريض يجلس على حافة السرير كخطوة أولى قبل الوقوف.",
        explanation: "Dangling (الجلوس مع تدلي القدمين) يسمح للدورة الدموية بالتأقلم مع الجاذبية قبل محاولة الوقوف أو المشي."
      },
      { 
        q: "Before assisting a client to a sitting position (dangling), the head of the bed should be raised:", 
        type: "mcq", 
        options: ["Slowly to its highest position.", "Only to a 30-degree angle.", "To a flat position.", "Quickly to maximize momentum."], 
        a: 0, 
        hint: "رفع رأس السرير (وضع فاولر) يستخدم الجاذبية لمساعدة المريض على الجلوس.",
        explanation: "رفع رأس السرير لأعلى وضع (High Fowler's) يقلل المسافة التي يحتاجها المريض للنهوض ويقلل الجهد."
      },
      { 
        q: "When preparing for the move, the nurse should stand beside the client's hips and face:", 
        type: "mcq", 
        options: ["The client's face.", "The far corner of the bottom of the bed.", "Directly down the length of the bed.", "The wall opposite the bed."], 
        a: 1, 
        hint: "التوجه 'قطرياً' نحو الزاوية البعيدة يضع الممرض في الاتجاه الصحيح 'للدوران' (Pivot).",
        explanation: "الوقوف باتجاه القدمين (الزاوية البعيدة) يسمح للممرض بالدوران (Pivot) بسلاسة لإنزال ساقي المريض."
      },
      { 
        q: "During the move, the nurse places the arm nearest the head of the bed:", 
        type: "mcq", 
        options: ["Under the client's knees.", "Under the client's thighs.", "Under the client's shoulders.", "On the client's abdomen."], 
        a: 2, 
        hint: "الذراع تذهب تحت الكتفين للدعم، والذراع الأخرى تذهب تحت الفخذين لتدوير الساقين.",
        explanation: "الذراع تحت الكتفين تدعم الجذع، بينما الذراع الأخرى تحرك الساقين، مما يخلق حركة دوران محورية."
      },
      { 
        q: "The purpose of having the nurse pivot on the balls of their feet in the desired direction is to:", 
        type: "mcq", 
        options: ["Increase the client's downward momentum.", "Prevent twisting of the nurse's spine.", "Check the client's balance.", "Signal the completion of the move."], 
        a: 1, 
        hint: "'الدوران' (Pivot) بالجسم كله يمنع 'الالتواء' (Twisting) في ظهر الممرض.",
        explanation: "الدوران بالقدمين (Pivoting) يحرك الجسم بالكامل كوحدة واحدة، مما يمنع إصابات الظهر الناتجة عن الالتواء (Twisting)."
      },
      { 
        q: "After the client is sitting on the side of the bed (dangling), what should the nurse immediately assess, as indicated by the client's health status?", 
        type: "mcq", 
        options: ["Skin integrity.", "Level of pain.", "Vital signs (e.g., pulse, respirations, and blood pressure).", "Appetite."], 
        a: 2, 
        hint: "يجب التحقق من 'انخفاض ضغط الدم الانتصابي' (Orthostatic hypotension) أو الدوخة قبل محاولة الوقوف.",
        explanation: "يجب مراقبة العلامات الحيوية لاكتشاف انخفاض ضغط الدم الانتصابي (Orthostatic hypotension) الذي قد يسبب الإغماء."
      },
      { 
        q: "Why is good body mechanics important for the caregiver?", 
        type: "mcq", 
        options: ["To avoid skeletal injury and muscle strain or tears.", "To speed up the transfer process.", "To use smaller, easily fatigued muscles.", "To force against the line of gravity."], 
        a: 0, 
        hint: "الهدف الأول هو حماية 'الممرض' من الإصابة.",
        explanation: "إصابات الظهر والعضلات هي الخطر المهني الأكبر في التمريض، وميكانيكا الجسم الصحيحة هي خط الدفاع الأول."
      },
      { 
        q: "The knowledge of a client's body and how it moves is important because it allows the caregiver to:", 
        type: "mcq", 
        options: ["Use minimal staff for all transfers.", "Move the client without causing additional discomfort.", "Avoid using any assistive equipment.", "Skip the assessment phase."], 
        a: 1, 
        hint: "فهم المريض يساعد على جعل الحركة آمنة و 'مريحة' له.",
        explanation: "فهم حدود حركة المريض وميكانيكا جسمه يسمح بتحريكه بطريقة لا تسبب ألماً أو ضرراً إضافياً."
      },
      { 
        q: "Before performing any procedure, the first two steps listed in all techniques are to:", 
        type: "mcq", 
        options: ["Perform hand hygiene and provide for client privacy.", "Introduce self, verify client identity, and explain the procedure.", "Document vital signs and adjust the bed height.", "Roll the client to the side of the bed."], 
        a: 1, 
        hint: "هذه هي الخطوات القياسية للسلامة والتواصل قبل لمس المريض.",
        explanation: "التعريف بالنفس والتحقق من هوية المريض وشرح الإجراء هي أساسيات سلامة المريض وحقوقه."
      },
      { 
        q: "What is an essential piece of information to record after moving or turning a client?", 
        type: "mcq", 
        options: ["The nurse's lunch break time.", "The weather outside.", "The ability of the client to assist in moving and turning.", "The agency's policy number."], 
        a: 2, 
        hint: "توثيق 'مدى' مساعدة المريض مهم لتقييم حالته ولتخطيط الرعاية المستقبلية.",
        explanation: "توثيق قدرة المريض على المساعدة (مستقل، مساعدة جزئية، كلي) يساعد الفريق الطبي في تقييم تقدم حالته."
      },
      { 
        q: "When using the friction-reducing slide sheet for a partially assisting client less than 200 pounds, the client is asked to push on the count of:", 
        type: "mcq", 
        options: ["Two.", "Three.", "Four.", "Five."], 
        a: 1, 
        hint: "العد 'لثلاثة' هو الإشارة القياسية لضمان تزامن الحركة.",
        explanation: "العد لثلاثة (1-2-3) يضمن أن المريض والممرضين يبذلون الجهد في نفس اللحظة بالضبط."
      },
      { 
        q: "What happens if the line of gravity falls outside the base of support?", 
        type: "mcq", 
        options: ["The individual's stability increases.", "The individual falls.", "The center of gravity is lowered.", "The individual is perfectly balanced."], 
        a: 1, 
        hint: "للحفاظ على التوازن، يجب أن يكون خط الجاذبية 'داخل' قاعدة الدعم (أي بين القدمين).",
        explanation: "إذا خرج خط الجاذبية عن قاعدة الدعم، يفقد الجسم توازنه ويسقط."
      },
      { 
        q: "When attempting to lift an object, if necessary, the nurse should:", 
        type: "mcq", 
        options: ["Lift it quickly before fatigue sets in.", "Evaluate the weight of the object and get help.", "Always lift it alone to conserve resources.", "Round the back to increase strength."], 
        a: 2, 
        hint: "لا تخاطر أبداً. 'قيّم' الوزن أولاً، وإذا كان ثقيلاً، 'اطلب المساعدة'.",
        explanation: "التقييم قبل الرفع (Assess before lift) هو القاعدة؛ إذا كان الوزن ثقيلاً، يجب طلب المساعدة فوراً."
      },
      { 
        q: "The rationale for raising the bed to the caregiver's elbow height before moving a client up in bed is primarily to:", 
        type: "mcq", 
        options: ["Give the client a better view.", "Adjust the client's head.", "Make the work easier for the client.", "Ensure personnel safety and avoid back strain."], 
        a: 3, 
        hint: "العمل على ارتفاع 'مناسب' (مستوى المرفق) هو أهم مبادئ ميكانيكا الجسم لحماية الظهر.",
        explanation: "رفع السرير يمنع الممرض من الانحناء بظهره، مما يحافظ على استقامة العمود الفقري ويمنع الإصابة."
      }
    ]
  },

  clinical_9: {
    title: "Body Mechanics - Part 3",
    questions: [
      { 
        q: "When preparing to move a client up in bed, the nurse should lock the wheels on the bed and:", 
        type: "mcq", 
        options: ["Lower all side rails.", "Raise the rail on the side of the bed opposite the nurse.", "Remove the headboard.", "Lower the bed to its lowest position."], 
        a: 1, 
        hint: "هذا إجراء أمان مزدوج: قفل العجلات لمنع الحركة، ورفع الحاجز لمنع السقوط.",
        explanation: "رفع الحاجز الجانبي المقابل يوفر شبكة أمان تمنع المريض من السقوط من الجانب الآخر أثناء الحركة."
      },
      { 
        q: "When assisting a client to sit on the side of the bed, the weight of the client's legs swinging downward helps to:", 
        type: "mcq", 
        options: ["Increase friction on the bed surface.", "Prevent the nurse from pivoting.", "Increase downward movement of the lower body and make the upper body vertical.", "Stabilize the client's blood pressure."], 
        a: 2, 
        hint: "تستخدم الجاذبية (ثقل الساقين) للمساعدة في رفع الجزء العلوي من الجسم.",
        explanation: "حركة الساقين لأسفل تعمل كثقل موازن (Counterweight) يساعد في رفع جذع المريض لأعلى بسهولة."
      },
      { 
        q: "A client with a spinal injury is an example of a client who requires which technique?", 
        type: "mcq", 
        options: ["Moving up in bed using a friction-reducing device.", "Dangling.", "Logrolling.", "Independent repositioning."], 
        a: 2, 
        hint: "يجب الحفاظ على استقامة العمود الفقري (مثل جذع الشجرة) لهؤلاء المرضى.",
        explanation: "Logrolling هو التقنية الوحيدة المسموح بها لمرضى إصابات العمود الفقري لمنع تفاقم الإصابة."
      },
      { 
        q: "Why does the text advise using smooth, coordinated motions instead of jerky movements?", 
        type: "mcq", 
        options: ["To prevent skin shearing.", "Jerky movements are inefficient and can cause injury.", "Jerky movements make the client fall asleep.", "Coordinated motions require less staff."], 
        a: 1, 
        hint: "الحركات 'المفاجئة' أو 'غير المتوقعة' تستهلك طاقة أكبر وتزيد من خطر إصابة الممرض والمريض.",
        explanation: "الحركات السلسة (Smooth) تحافظ على الزخم وتمنع الشد العضلي المفاجئ للمريض والممرض."
      }
    ]
  }
};
console.log("Clinical file loaded successfully");
