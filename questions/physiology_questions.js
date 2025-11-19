window.physiologyData = {
  // ==========================================================
  // القسم الأول: CNS (الجهاز العصبي المركزي)
  // ==========================================================
  physio_cns_1: {
    title: "CNS - Part 1",
    questions: [
      { 
        q: "A typical neural pathway is:", 
        type: "mcq", 
        options: ["effector-sensory nerve-PNS-motor nerve-receptor", "receptor-sensory nerve-CNS-motor nerve-effector", "effector-motor nerve-PNS-sensory nerve-receptor", "receptor-motor nerve-CNS-sensory nerve-effector"], 
        a: 1, 
        hint: "يبدأ المسار دائمًا بـ 'مستقبل' (receptor) وينتهي بـ 'مستجيب' (effector).",
        explanation: "المسار العصبي يبدأ باستقبال المؤثر (Receptor)، ثم نقله عبر عصب حسي للمركز (CNS)، ثم إصدار أمر عبر عصب حركي للعضو المستجيب (Effector)."
      },
      { 
        q: "In most reflex arcs, sensory neurones synapse in:", 
        type: "mcq", 
        options: ["the dura mater", "the cerebrospinal fluid", "the spinal cord", "the brain stem"], 
        a: 2, 
        hint: "القوس الانعكاسي البسيط (مثل الشوكة) يحدث تشابكه في 'الحبل الشوكي' قبل أن تصل الإشارة للمخ.",
        explanation: "القوس الانعكاسي (Reflex arc) هو استجابة سريعة تتم معالجتها في الحبل الشوكي (Spinal Cord) لسرعة رد الفعل."
      },
      { 
        q: "The action potential is described as being:", 
        type: "mcq", 
        options: ["one-for-all", "all-for-one", "nothing-at-all", "all-or-nothing"], 
        a: 3, 
        hint: "إما أن يحدث جهد الفعل 'بالكامل' (all) أو لا يحدث 'إطلاقًا' (nothing).",
        explanation: "قانون 'الكل أو لا شيء' (All-or-nothing) يعني أن العصب إما يطلق الإشارة بأقصى قوته إذا وصل للعتبة، أو لا يطلقها أبداً."
      },
      { 
        q: "Each cerebral hemisphere is divided into how many lobes?", 
        type: "mcq", 
        options: ["2", "3", "4", "5"], 
        a: 2, 
        hint: "الفصوص الأربعة هي: Frontal, Parietal, Temporal, Occipital.",
        explanation: "كل نصف كرة مخية ينقسم لـ 4 فصوص رئيسية: الجبهي، الجداري، الصدغي، والقفوي."
      },
      { 
        q: "How many pairs of cranial nerves originate in the brain?", 
        type: "mcq", 
        options: ["8", "10", "12", "14"], 
        a: 2, 
        hint: "عدد الأعصاب القحفية (Cranial nerves) هو 12 زوجًا.",
        explanation: "يوجد 12 زوجاً من الأعصاب القحفية تخرج مباشرة من الدماغ (مثل العصب البصري والسمعي)."
      },
      { 
        q: "The spinal cord is continuous with which region of the brain?", 
        type: "mcq", 
        options: ["cerebrum", "medulla oblongata", "midbrain", "pons"], 
        a: 1, 
        hint: "الحبل الشوكي يتصل مباشرة بـ 'النخاع المستطيل' (Medulla) وهو جزء من جذع الدماغ.",
        explanation: "النخاع المستطيل (Medulla Oblongata) هو الجزء السفلي من جذع الدماغ الذي يتصل مباشرة بالحبل الشوكي."
      },
      { 
        q: "The sympathetic nervous system mediates:", 
        type: "mcq", 
        options: ["rest and digest responses", "fright, fight or flight responses", "sleeping responses", "gastric responses"], 
        a: 1, 
        hint: "الجهاز 'السمبثاوي' هو المسؤول عن استجابات 'الكر والفر' (fight or flight).",
        explanation: "الجهاز السمبثاوي يجهز الجسم للطوارئ (زيادة ضربات القلب، توسيع الحدقة)، وهي حالة Fight or Flight."
      },
      { 
        q: "Nerve impulses from visual stimuli are integrated in which lobe?", 
        type: "mcq", 
        options: ["frontal", "temporal", "parietal", "occipital"], 
        a: 3, 
        hint: "الفص 'القفوي' (Occipital) هو مركز معالجة 'الرؤية' (visual).",
        explanation: "الفص القفوي (Occipital lobe) في مؤخرة الدماغ يحتوي على القشرة البصرية المسؤولة عن تفسير الصور."
      },
      { 
        q: "In the eye, light rays are refracted onto:", 
        type: "mcq", 
        options: ["the cornea", "the lens", "the retina", "the blind spot"], 
        a: 2, 
        hint: "الضوء يتجمع وينكسر ليقع على 'شبكية العين' (Retina) التي تحتوي على المستقبلات الضوئية.",
        explanation: "الشبكية (Retina) هي الطبقة الحساسة للضوء التي تتكون عليها الصورة وترسلها للدماغ."
      },
      { 
        q: "Which word correctly completes the statement: “All motor neurons are...”", 
        type: "mcq", 
        options: ["interneurons", "multipolar", "bipolar", "unipolar"], 
        a: 1, 
        hint: "الخلايا العصبية الحركية (Motor neurons) تتميز بوجود 'أقطاب متعددة' (multipolar).",
        explanation: "الخلايا الحركية تحتاج لاستقبال إشارات كثيرة من الدماغ، لذا فهي متعددة الأقطاب (Multipolar) ولها زوائد شجيرية كثيرة."
      },
      { 
        q: "In the peripheral nervous system, which cells form the myelin sheath?", 
        type: "mcq", 
        options: ["Ependymal cells", "Schwann cells", "Astrocytes", "Oligodendrocytes"], 
        a: 1, 
        hint: "خلايا 'شوان' (Schwann cells) هي المسؤولة عن المايلين في الجهاز العصبي 'الطرفي' (PNS).",
        explanation: "في الجهاز الطرفي (PNS)، خلايا شوان هي التي تلتف حول المحور لتكوين المايلين. (في المركزي تكون Oligodendrocytes)."
      },
      { 
        q: "What does the term “action potential” refer to?", 
        type: "mcq", 
        options: ["The resting state at -70mV", "A local movement of sodium ions", "The rapid movement of sodium ions in followed by potassium ions out", "Sodium ions being pumped out and potassium ions in"], 
        a: 2, 
        hint: "هو موجة من 'دخول الصوديوم' (depolarization) السريع يتبعه 'خروج البوتاسيوم' (repolarization).",
        explanation: "جهد الفعل هو تغير كهربائي سريع نتيجة دخول الصوديوم (Na+) لداخل الخلية ثم خروج البوتاسيوم (K+) لخارجها."
      },
      { 
        q: "What is the gap between the plasma membranes of a neuron and the cell that is going to receive the signal called?", 
        type: "mcq", 
        options: ["neuromuscular junction", "intercellular cleft", "synaptic cleft", "intercalated disc"], 
        a: 2, 
        hint: "الفراغ (Cleft) الذي يحدث فيه 'التشابك العصبي' (Synapse).",
        explanation: "الشق التشابكي (Synaptic cleft) هو الفراغ الصغير جداً الذي تعبره النواقل العصبية لتنقل الإشارة للخلية التالية."
      },
      { 
        q: "Which of the following substances CANNOT pass through the “blood-brain barrier”?", 
        type: "mcq", 
        options: ["steroid hormones", "O2 molecules", "alcohol", "potassium ions"], 
        a: 3, 
        hint: "الحاجز الدموي الدماغي يمنع مرور 'الأيونات' (Ions) للحفاظ على بيئة الدماغ ثابتة.",
        explanation: "الحاجز الدموي الدماغي (BBB) يمنع مرور المواد المشحونة والكبيرة (مثل أيونات البوتاسيوم) لحماية الدماغ من التقلبات الكهربائية."
      },
      { 
        q: "What name is given to the cells in the nervous system that produce nerve impulses?", 
        type: "mcq", 
        options: ["neurotransmitters", "nerves", "neurons", "neuroglia"], 
        a: 2, 
        hint: "الـ 'Neurons' (الخلايا العصبية) هي التي تنتج النبضات، بينما الـ 'Neuroglia' هي الخلايا الداعمة.",
        explanation: "الخلايا العصبية (Neurons) هي الوحدات الوظيفية المسؤولة عن توليد ونقل الإشارات الكهربائية."
      },
      { 
        q: "Which structure carries incoming impulses towards the nerve cell body?", 
        type: "mcq", 
        options: ["axon hillock", "axon", "dendrite", "synaptic knobs"], 
        a: 2, 
        hint: "الـ 'Dendrites' (الزوائد الشجيرية) هي 'المستقبلات' التي تجلب الإشارة 'إلى' جسم الخلية.",
        explanation: "الزوائد الشجيرية (Dendrites) تستقبل الإشارات من الخلايا الأخرى وتنقلها باتجاه جسم الخلية."
      },
      { 
        q: "Which neurons are unipolar?", 
        type: "mcq", 
        options: ["neurons in the central nervous system", "neurons in the retina", "sensory neurons", "motor neurons"], 
        a: 2, 
        hint: "معظم الخلايا العصبية 'الحسية' (Sensory) تكون 'أحادية القطب' (unipolar).",
        explanation: "الخلايا الحسية (Sensory neurons) غالباً ما تكون أحادية القطب لتوصيل الإحساس مباشرة من المستقبلات إلى الجهاز المركزي."
      },
      { 
        q: "Which glial cells are responsible for forming the myelin sheath around peripheral nerve cells?", 
        type: "mcq", 
        options: ["Astrocytes", "Schwann cells", "Satellite cells", "Oligodendrocytes"], 
        a: 1, 
        hint: "مرة أخرى، خلايا 'شوان' (Schwann) هي المسؤولة عن المايلين في 'الجهاز الطرفي' (Peripheral).",
        explanation: "سؤال مكرر للتأكيد: خلايا شوان تغلف محاور الأعصاب الطرفية بالمايلين."
      },
      { 
        q: "Inactive muscle and nerve cells maintain a resting membrane potential. This potential results in:", 
        type: "mcq", 
        options: ["the outside of the cell being negative", "the inside of the cell being positive", "the inside and outside of the cell having the same charge", "the inside of the cell being negative"], 
        a: 3, 
        hint: "في 'وضع الراحة' (Resting)، يكون 'داخل' الخلية سالبًا (حوالي -70mV) مقارنة بخارجها.",
        explanation: "في وقت الراحة، يكون الغشاء مستقطباً، حيث تتراكم الشحنات السالبة في الداخل والموجبة في الخارج."
      },
      { 
        q: "When an action potential arrives at a synapse, what happens first?", 
        type: "mcq", 
        options: ["a neurotransmitter is released into the synaptic cleft", "extracellular Na+ crosses the post-synaptic membrane", "Choline in the synaptic cleft enters the nerve cell", "extracellular Ca++ enters the nerve cell"], 
        a: 3, 
        hint: "وصول جهد الفعل يفتح قنوات 'الكالسيوم' (Ca++)، وهو الذي يحفز إطلاق النواقل العصبية.",
        explanation: "دخول الكالسيوم (Ca++) هو المفتاح الذي يحفز الحويصلات التشابكية على الاندماج مع الغشاء وإطلاق الناقل العصبي."
      }
    ]
  },
  physio_cns_2: {
    title: "CNS - Part 2",
    questions: [
      { 
        q: "What is the last part of a nerve cell that is involved when a nerve impulse passes to another cell?", 
        type: "mcq", 
        options: ["synaptic knob", "axon hillock", "dendrite", "axon"], 
        a: 0, 
        hint: "الإشارة تنتقل من جسم الخلية، عبر المحور (Axon)، وتنتهي عند 'النهايات العصبية' (Synaptic knob).",
        explanation: "النهاية العصبية (Synaptic knob) هي الجزء الأخير الذي يطلق الناقل العصبي لنقل الإشارة للخلية التالية."
      },
      { 
        q: "Which of the following statements is true of neuroglia?", 
        type: "mcq", 
        options: ["they are the cells that link motor neurons to sensory neurons", "it is the non-cellular material that lies between neurons", "they have only one dendrite and one axon", "they produce the myelin sheath"], 
        a: 3, 
        hint: "الـ Neuroglia هي الخلايا الداعمة، ومن وظائفها إنتاج 'غلاف المايلين' (Myelin sheath).",
        explanation: "الخلايا الدبقية (Neuroglia) لا تنقل إشارات عصبية ولكنها تدعم الأعصاب، ومن وظائفها تكوين المايلين."
      },
      { 
        q: "What can correctly be said about somatic motor neurons?", 
        type: "mcq", 
        options: ["they are unipolar neurons", "their cell bodies are in the dorsal root ganglia", "their cell bodies are located in the central nervous system", "they are bipolar neurons"], 
        a: 2, 
        hint: "أجسام الخلايا العصبية 'الحركية' (Motor) تقع 'داخل' الجهاز العصبي المركزي (CNS).",
        explanation: "أجسام الخلايا الحركية الجسدية تقع في القرن الأمامي للحبل الشوكي (داخل CNS) وترسل محاورها للعضلات."
      },
      { 
        q: "What is the effect of the movement of Na+ into a nerve cell followed very soon by the movement of K+ out of the nerve cell?", 
        type: "mcq", 
        options: ["this establishes the resting membrane potential", "these movements are known as depolarisation and repolarisation", "these movements repolarise the cell", "it changes the membrane potential from about -70 mV to about -50 mV"], 
        a: 1, 
        hint: "دخول الصوديوم هو 'إزالة الاستقطاب' (Depolarisation)، وخروج البوتاسيوم هو 'إعادة الاستقطاب' (Repolarisation).",
        explanation: "دخول الصوديوم يزيل الشحنة السالبة (Depolarisation)، وخروج البوتاسيوم يعيدها (Repolarisation)."
      },
      { 
        q: "There is a space between a neuron and the cell it stimulates, that is crossed by a neurotransmitter. What is it called?", 
        type: "mcq", 
        options: ["synaptic cleft", "voltage-gated channel", "synapse", "post-synaptic membrane"], 
        a: 0, 
        hint: "هذا 'الفراغ' أو 'الشق' (Cleft) هو الذي يفصل بين الخليتين.",
        explanation: "الشق التشابكي (Synaptic Cleft) هو الفراغ الفعلي الذي يسبح فيه الناقل العصبي."
      },
      { 
        q: "Which of the following CAN cross the blood-brain barrier to enter the brain?", 
        type: "mcq", 
        options: ["K+", "O2", "proteins", "most pharmaceuticals"], 
        a: 1, 
        hint: "الأكسجين (O2) ضروري لحياة خلايا الدماغ، لذا يجب أن يعبر الحاجز بسهولة.",
        explanation: "الغازات مثل الأكسجين وثاني أكسيد الكربون تعبر الحاجز الدموي الدماغي بحرية عن طريق الانتشار."
      },
      { 
        q: "What name is used for a nerve cell?", 
        type: "mcq", 
        options: ["neuron", "neuroglia", "ganglion", "astrocyte"], 
        a: 0, 
        hint: "الـ 'Neuron' هو الاسم العلمي لـ 'الخلية العصبية'.",
        explanation: "Neuron هو المصطلح العلمي للخلية العصبية."
      },
      { 
        q: "What is the name of the nerve cell structure that carries incoming impulses towards the cell?", 
        type: "mcq", 
        options: ["dendrite", "axon", "cell body", "ganglion"], 
        a: 0, 
        hint: "الـ 'Dendrites' (الزوائد الشجيرية) هي 'المستقبلات' التي تجلب الإشارة 'إلى' جسم الخلية.",
        explanation: "Dendrites (الزوائد الشجيرية) تستقبل الإشارات."
      },
      { 
        q: "Which is the major type of nerve cell in the CNS?", 
        type: "mcq", 
        options: ["Anaxonic", "Unipolar", "Bipolar", "Multipolar"], 
        a: 3, 
        hint: "النوع 'متعدد الأقطاب' (Multipolar) هو الأكثر شيوعًا في الجهاز العصبي المركزي.",
        explanation: "معظم خلايا الدماغ والحبل الشوكي متعددة الأقطاب لتتمكن من معالجة كميات كبيرة من المعلومات."
      },
      { 
        q: "What is the purpose of the myelin sheath around an axon?", 
        type: "mcq", 
        options: ["To control the chemical environment around the nerve cell.", "To phagocytose microbes", "To prevent movement of ions through the nerve cell membrane", "To form the blood-brain barrier."], 
        a: 2, 
        hint: "غلاف المايلين يعمل كـ 'عازل' (Insulator) يمنع تسرب الأيونات ويسرع الإشارة.",
        explanation: "المايلين يعمل كعازل كهربائي يمنع حركة الأيونات إلا في العقد (Nodes)، مما يجبر الإشارة على القفز ويسرعها."
      },
      { 
        q: "Which nerve cells carry impulses from the brain to the muscles?", 
        type: "mcq", 
        options: ["Sensory", "Motor", "Afferent", "Association"], 
        a: 1, 
        hint: "الخلايا 'الحركية' (Motor) هي التي تنقل الأوامر 'من' الدماغ 'إلى' العضلات.",
        explanation: "الأعصاب الحركية (Motor/Efferent) تنقل الأوامر من الجهاز المركزي للأعضاء المستجيبة مثل العضلات."
      },
      { 
        q: "Which of the following describes an “action potential”?", 
        type: "mcq", 
        options: ["The high concentration of Na+ and Cl− outside the cell", "The voltage change that moves along the cell membrane", "The movement of a neurotransmitter", "The movement of Na+ across the cell membrane into the cell, followed by the movement of K+ out of the cell"], 
        a: 3, 
        hint: "جهد الفعل هو 'دخول الصوديوم' ثم 'خروج البوتاسيوم'.",
        explanation: "الوصف الدقيق لجهد الفعل هو تدفق الصوديوم للداخل (Depolarization) يليه تدفق البوتاسيوم للخارج (Repolarization)."
      },
      { 
        q: "What part of the neurone carries the “action potential”?", 
        type: "mcq", 
        options: ["the cell body", "the dendrites", "the synaptic knobs", "the axon"], 
        a: 3, 
        hint: "جهد الفعل ينتقل 'بعيدًا' عن جسم الخلية عبر 'المحور' (Axon).",
        explanation: "المحور (Axon) هو الجزء الطويل المتخصص في نقل جهد الفعل لمسافات طويلة."
      },
      { 
        q: "What type of neurones are motor neurones?", 
        type: "mcq", 
        options: ["Anaxonic", "Multipolar", "Bipolar", "Unipolar"], 
        a: 1, 
        hint: "سؤال مكرر، الخلايا العصبية الحركية (Motor) هي 'متعددة الأقطاب' (Multipolar).",
        explanation: "تكرار للسؤال للتأكيد: الخلايا الحركية متعددة الأقطاب."
      },
      { 
        q: "What event during the action potential causes the resting membrane potential to change from about -70 mV to about +30 mV?", 
        type: "mcq", 
        options: ["K+ ions moving into the cell", "K+ ions moving out of the cell", "Na+ ions moving into the cell", "Na+ ions moving out of the cell"], 
        a: 2, 
        hint: "التغير من سالب إلى موجب يحدث بسبب 'دخول' أيونات 'الصوديوم' (Na+) الموجبة.",
        explanation: "دخول الصوديوم الموجب بكثافة يقلب شحنة الغشاء ويجعل الداخل موجباً (+30mV)."
      },
      { 
        q: "Where are the cell bodies of somatic motor neurones found?", 
        type: "mcq", 
        options: ["in the peripheral nervous system", "in the central nervous system", "in the dorsal root ganglia", "in the spinal cord"], 
        a: 3, 
        hint: "توجد في 'الحبل الشوكي' (Spinal cord)، وتحديدًا في (ventral gray horns).",
        explanation: "أجسام الخلايا الحركية تقع في المادة الرمادية للحبل الشوكي."
      },
      { 
        q: "What is an “action potential”? It is:", 
        type: "mcq", 
        options: ["when the resting potential changes from -70 mV to +30 mV and then back again.", "the difference in electrical charge between the inside and outside", "the stimulus that changes the resting potential from -70 to -50 mV.", "the voltage produced by a stimulus"], 
        a: 0, 
        hint: "هو 'التغير الكامل' في الجهد (من -70 إلى +30 ثم العودة إلى -70) الذي ينتقل.",
        explanation: "جهد الفعل هو الدورة الكاملة لتغير الجهد الكهربائي عبر الغشاء وعودته لحالته الأصلية."
      },
      { 
        q: "What does the term “synapse” refer to?", 
        type: "mcq", 
        options: ["the plasma membrane of the axon terminal", "that part of the plasma membrane of the cell being stimulated", "the gap between the stimulating nerve cell and the receiving cell.", "the place where signal transmission between a nerve cell and the cell it is stimulating occurs."], 
        a: 3, 
        hint: "الـ 'Synapse' (التشابك العصبي) هو 'المكان' (the place) الذي تحدث فيه عملية نقل الإشارة بالكامل.",
        explanation: "التشابك العصبي (Synapse) هو منطقة الاتصال الوظيفي التي تنتقل فيها الإشارة بين خليتين."
      },
      { 
        q: "Which statement is true of a multi-polar neuron?", 
        type: "mcq", 
        options: ["has many axons attached to the cell body", "is the major type of neuron in the peripheral nervous system", "all sensory neurons are multi-polar", "has many dendrites attached to the cell body"], 
        a: 3, 
        hint: "كلمة 'Multi' (متعدد) تشير إلى وجود 'العديد من الزوائد الشجيرية' (many dendrites).",
        explanation: "متعدد الأقطاب يعني محوراً واحداً والعديد من الزوائد الشجيرية."
      },
      { 
        q: "Which of the following is a true statement about an “action potential”?", 
        type: "mcq", 
        options: ["It refers to the movement of a neuro-transmitter along an axon.", "It travels away from the cell body along the axon.", "It causes K+ to rush into the cell.", "It travels between the dendrite and the axon hillock."], 
        a: 1, 
        hint: "جهد الفعل هو إشارة كهربائية تنتقل 'على طول المحور' (along the axon) 'بعيدًا' عن جسم الخلية.",
        explanation: "جهد الفعل ينشأ عند منطقة (Axon hillock) وينتقل بعيداً عبر المحور."
      }
    ]
  },
  physio_cns_3: {
    title: "CNS - Part 3",
    questions: [
      { 
        q: "Complete the sentence. Neuroglia", 
        type: "mcq", 
        options: ["are bundles of axons", "contain cell bodies outside the central nervous system", "are a type of neuron", "include ependymal cells, astrocytes and satellite cells"], 
        a: 3, 
        hint: "الـ Neuroglia هي 'الخلايا الداعمة' للجهاز العصبي، وهذه أمثلة عليها.",
        explanation: "الخلايا الدبقية (Neuroglia) تشمل أنواعاً متعددة مثل الخلايا النجمية (Astrocytes) وخلايا البطانة العصبية (Ependymal cells)."
      },
      { 
        q: "Which of the three structures listed below constitute a nerve cell?", 
        type: "mcq", 
        options: ["dendrites, ganglion, myelin sheath", "dendrites, cell body, axon", "neuron, neuroglia, synaptic process", "cell body, synaptic knobs, efferent fibre"], 
        a: 1, 
        hint: "مكونات الخلية العصبية الأساسية هي: 'الزوائد الشجيرية' (Dendrites)، 'جسم الخلية' (Cell body)، و'المحور' (Axon).",
        explanation: "التركيب الأساسي لأي خلية عصبية يتكون من ثلاثة أجزاء: جسم الخلية، زوائد شجيرية للاستقبال، ومحور للنقل."
      },
      { 
        q: "What are the major type of nerve cells in the CNS?", 
        type: "mcq", 
        options: ["multipolar", "sensory", "interneurons", "unipolar"], 
        a: 0, 
        hint: "سؤال مكرر، النوع 'متعدد الأقطاب' (Multipolar) هو الأكثر شيوعًا.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which sequence of ion movements describes the action potential?", 
        type: "mcq", 
        options: ["Na+ move out of cell then K+ move in", "K+ move in to cell then Na+ move out", "K+ move out of cell then Na+ move in", "Na+ move into cell then K+ move out"], 
        a: 3, 
        hint: "التسلسل الصحيح هو: 'دخول الصوديوم' (Na+ in) أولاً، ثم 'خروج البوتاسيوم' (K+ out).",
        explanation: "تكرار للسؤال: صوديوم للداخل (إثارة)، ثم بوتاسيوم للخارج (عودة للراحة)."
      },
      { 
        q: "What is the space between a neuron and the following neuron, muscle or gland that it stimulates called?", 
        type: "mcq", 
        options: ["Synaptic vesicle", "Ion channel", "Synaptic cleft", "Receptor"], 
        a: 2, 
        hint: "هذا 'الفراغ' أو 'الشق' (Cleft) هو الذي يفصل بين الخليتين.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "What feature do the dendrites of a nerve cell have?", 
        type: "mcq", 
        options: ["they transmit an action potential", "they contain the cell nucleus and organelles", "they carry incoming impulses to the cell body", "they are connected to the cell body by the axon hillock"], 
        a: 2, 
        hint: "وظيفة 'الزوائد الشجيرية' (Dendrites) هي استقبال الإشارات 'الواردة' (incoming).",
        explanation: "تكرار للسؤال: وظيفة Dendrites هي استقبال الإشارة."
      },
      { 
        q: "Most sensory neurones may be described as which of the following?", 
        type: "mcq", 
        options: ["multipolar", "bipolar", "having cell bodies within the CNS", "unipolar"], 
        a: 3, 
        hint: "سؤال مكرر، معظم الخلايا العصبية 'الحسية' (Sensory) هي 'أحادية القطب' (unipolar).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "What is the type of neuroglia that forms the myelin sheath on neurons outside of the CNS?", 
        type: "mcq", 
        options: ["Oligodendrocytes", "Satellite cells", "Schwann cells", "Microglia"], 
        a: 2, 
        hint: "خلايا 'شوان' (Schwann) في الجهاز الطرفي (Outside CNS)، بينما 'Oligodendrocytes' في الجهاز المركزي.",
        explanation: "تكرار للسؤال: خلايا شوان هي المسؤولة في PNS."
      },
      { 
        q: "The action potential occurs when one of the following events occurs. Which one?", 
        type: "mcq", 
        options: ["Na+ rushes into the cell followed by Cl−", "Na+ rushes out of the cell followed by PO43− rushing in", "K+ rushes into the cell followed by Na+ rushing out", "Na+ rushes into the cell followed by K+ rushing out"], 
        a: 3, 
        hint: "مرة أخرى، التسلسل هو 'دخول الصوديوم' ثم 'خروج البوتاسيوم'.",
        explanation: "تكرار للسؤال لأهميته."
      },
      { 
        q: "A multipolar neuron has more than one what?", 
        type: "mcq", 
        options: ["dendrite attached to the cell body", "axon attached to the cell body", "synaptic terminal attached to the axon", "cell body"], 
        a: 0, 
        hint: "سؤال مكرر، 'Multi' (متعدد) يشير إلى 'الزوائد الشجيرية' (Dendrites).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "What is the depolarisation and repolarisation of a nerve cell membrane called?", 
        type: "mcq", 
        options: ["graded potential", "action potential", "threshold potential", "resting membrane potential"], 
        a: 1, 
        hint: "هذه الدورة الكاملة (Depolarisation + Repolarisation) تسمى 'جهد الفعل' (Action potential).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which best describes a nerve?", 
        type: "mcq", 
        options: ["dendrites, cell bodies, axons, Schwann cells", "dendrites, cell bodies, axon hillock, axon terminals, vesicles", "dendrites, cell bodies, axon hillock, axon terminals, Schwann cells, neurotransmitters", "axons, blood vessels, connective tissue, Schwann cells"], 
        a: 3, 
        hint: "الـ 'عصب' (Nerve) هو 'حزمة' من 'المحاور' (Axons) مغلفة بأنسجة ضامة وأوعية دموية.",
        explanation: "العصب (في الجهاز الطرفي) هو حزمة من الألياف العصبية (المحاور) مغلفة بنسيج ضام ومعها أوعية دموية."
      },
      { 
        q: "Which of the following would conduct an action potential with the greatest speed?", 
        type: "mcq", 
        options: ["myelinated, large diameter fibres", "myelinated, small diameter fibres", "unmyelinated, large diameter fibres", "unmyelinated, small diameter fibres"], 
        a: 0, 
        hint: "السرعة تكون 'أكبر' عندما يكون العصب 'مغطى بالمايلين' (myelinated) وذو 'قطر كبير' (large diameter).",
        explanation: "المايلين والقطر الكبير يقللان المقاومة ويزيدان سرعة النقل العصبي بشكل كبير."
      },
      { 
        q: "Which of the following is a characteristic of an action potential?", 
        type: "mcq", 
        options: ["The signal is graded", "It results due to an influx of potassium ions", "it is an all or none response", "It results from an initial outflow of sodium ions"], 
        a: 2, 
        hint: "سؤال مكرر، جهد الفعل هو استجابة 'الكل أو لا شيء' (all or none).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "What is meant by an absolute refractory period?", 
        type: "mcq", 
        options: ["at least 5 ms must elapse", "an action potential cannot be initiated during this period regardless of the strength of the stimulus", "an action potential can be initiated if the strength of the stimulus is higher than normal", "an action potential can be initiated if the strength of the stimulus is lower than normal"], 
        a: 1, 
        hint: "فترة 'الجموح المطلق' (Absolute refractory) تعني أنه 'لا يمكن' إطلاق جهد فعل جديد مهما كانت قوة المؤثر.",
        explanation: "خلال فترة الجموح المطلق، قنوات الصوديوم تكون غير قابلة للاستجابة، مما يمنع حدوث أي جهد فعل جديد."
      },
      { 
        q: "What would happen if a neuron lost its myelin sheath?", 
        type: "mcq", 
        options: ["Na+ would leak out of the axon", "The neuron would die.", "conduction speed would increase.", "the cell would hyperpolarise."], 
        a: 0, 
        hint: "المايلين يمنع 'تسرب' (leak) الصوديوم، وبدونه ستتسرب الأيونات وتضعف الإشارة.",
        explanation: "فقدان المايلين (كما في التصلب المتعدد) يسبب تسرب الأيونات، مما يبطئ الإشارة وقد يوقفها تماماً."
      },
      { 
        q: "How do cells maintain an electric potential across their cell membrane?", 
        type: "mcq", 
        options: ["By using the sodium-potassium pump", "By allowing negative chloride ions to enter", "By trapping large cations inside", "By keeping unequal concentrations of various ions on each side"], 
        a: 3, 
        hint: "السبب الرئيسي هو 'التوزيع غير المتساوي للأيونات' (unequal concentrations) على جانبي الغشاء.",
        explanation: "جهد الغشاء ينتج عن الاختلاف في تركيز الأيونات (خاصة الصوديوم والبوتاسيوم) بين الداخل والخارج."
      },
      { 
        q: "In nerve fibres with myelin sheaths, which of the following is true about the electrical conduction?", 
        type: "mcq", 
        options: ["It is ‘saltatory’, so propagates at higher speed", "It requires more energy to send an impulse", "cross talk’ is increased", "It is slower due to the separation between the ‘nodes of Ranvier’"], 
        a: 0, 
        hint: "النقل 'القفزي' (Saltatory conduction) (من عقدة رانفييه لأخرى) هو 'أسرع' بكثير.",
        explanation: "النقل القفزي يعني أن الإشارة تقفز من عقدة لعقدة، مما يوفر الوقت والطاقة."
      },
      { 
        q: "When we say that the cell membrane is polarised we mean that", 
        type: "mcq", 
        options: ["the outside of the cell is negative with respect to the inside", "the inside of the cell is negative with respect to the outside", "there are more Na+ ions and less K+ ions inside", "Na+ ions have moved out of the cell and K+ ions have moved in."], 
        a: 1, 
        hint: "الـ 'استقطاب' (Polarised) يعني أن 'داخل' الخلية 'سالب' الشحنة مقارنة بخارجها.",
        explanation: "الاستقطاب يشير لوجود فرق جهد كهربائي، حيث يكون الداخل سالباً بالنسبة للخارج."
      },
      { 
        q: "Depolarisation of the cell membrane involves:", 
        type: "mcq", 
        options: ["sodium channels opening to allow Na+ to flow in.", "potassium channels opening to allow K+ to flow in.", "chloride pumps quickly pumping large amounts of Cl− outside.", "electrical attraction between K+ inside and Cl− outside."], 
        a: 0, 
        hint: "'إزالة الاستقطاب' (Depolarisation) تحدث بسبب 'دخول الصوديوم' (Na+ flow in).",
        explanation: "تكرار للسؤال: فتح قنوات الصوديوم يسبب التدفق السريع للداخل وإزالة الاستقطاب."
      }
    ]
  },
  physio_cns_4: {
    title: "CNS - Part 4",
    questions: [
      { 
        q: "Which of the following statements about the action potential is FALSE?", 
        type: "mcq", 
        options: ["The action potential lasts about four milliseconds.", "It is triggered by anions crossing the cell membrane.", "The sequence: ‘Na ions moving in, K ions moving out’ constitutes the action potential.", "Repolarisation follows depolarisation of the cell membrane."], 
        a: 1, 
        hint: "جهد الفعل يُشغل بواسطة 'كاتيونات' (Cations) موجبة الشحنة (مثل الصوديوم) وليس 'أنيونات' (anions) سالبة.",
        explanation: "جهد الفعل يعتمد على حركة الأيونات الموجبة (Cations) مثل الصوديوم والبوتاسيوم، وليس الأنيونات السالبة."
      },
      { 
        q: "When is an action potential initiated?", 
        type: "mcq", 
        options: ["when the resting membrane potential changes from -70 mV to +30 mV.", "when a nerve impulse has caused some muscle action", "when the potassium ‘gates’ in the cell membrane open", "a stimulus, which is above the threshold level, is applied to a receptor."], 
        a: 3, 
        hint: "يجب أن يكون المؤثر 'فوق مستوى العتبة' (above the threshold) لبدء جهد الفعل.",
        explanation: "لن ينطلق جهد الفعل إلا إذا كان المحفز قوياً بما يكفي للوصول إلى 'عتبة الجهد' (Threshold)."
      },
      { 
        q: "The sequence of events that constitute an action potential is correctly described by which of the following?", 
        type: "mcq", 
        options: ["Resting potential of +35 mV...", "Resting potential of -70 mV, K+ move into cell...", "Resting potential of +35 mV, K+ move into cell...", "Resting potential of -70 mV, Na+ move into cell, depolarisation to +35 mV, K+ move out of cell, repolarisation to -70 mV."], 
        a: 3, 
        hint: "هذا هو التسلسل الكامل والصحيح: راحة (-70)، دخول صوديوم (+35)، خروج بوتاسيوم (-70).",
        explanation: "هذا هو الوصف الدقيق والكامل لدورة جهد الفعل من البداية للنهاية."
      },
      { 
        q: "What term refers to the sudden movement of potassium ions across the cell membrane to the outside of a nerve cell?", 
        type: "mcq", 
        options: ["Repolarisation", "Depolarisation", "The action potential", "The potassium pump"], 
        a: 0, 
        hint: "'خروج' البوتاسيوم (K+) الموجب يعيد الغشاء إلى وضعه السالب، وهذا يسمى 'إعادة الاستقطاب' (Repolarisation).",
        explanation: "خروج البوتاسيوم يعيد الخلية لحالة الاستقطاب (السالبة) الطبيعية."
      },
      { 
        q: "Which of the lists of structures include all of the central nervous system?", 
        type: "mcq", 
        options: ["cerebellum, cerebrum, spinal cord, diencephalon, brainstem", "midbrain, spinal cord, autonomic nerves, pons, diencephalon", "midbrain, cerebellum, special sense organs, medulla oblongata", "cerebrum, sensory neurons, motor neurons, cerebellum"], 
        a: 0, 
        hint: "الجهاز العصبي المركزي (CNS) يتكون من 'الدماغ' (بكل أجزائه) و'الحبل الشوكي' (Spinal cord).",
        explanation: "الخيار الأول يشمل كل أجزاء الدماغ (المخ، المخيخ، جذع الدماغ، الدماغ البيني) والحبل الشوكي."
      },
      { 
        q: "What are the three meninges and two named “spaces” that surround the brain, in order from superficial to deep (outermost to innermost)?", 
        type: "mcq", 
        options: ["pia, arachnoid, sub-arachnoid, dura, septa", "sub-arachnoid, epidural, dura, pia, arachnoid", "arachnoid, sun-arachnoid, pia, epidural, dura", "epidural, dura, arachnoid, sub-arachnoid, pia"], 
        a: 3, 
        hint: "الترتيب من الخارج للداخل: Epidural space -> Dura mater -> Arachnoid mater -> Sub-arachnoid space -> Pia mater.",
        explanation: "الترتيب الصحيح للأغشية من الجمجمة للدماغ هو: الجافية، العنكبوتية، الحنون (مع الفراغات بينها)."
      },
      { 
        q: "Which of the following is NOT composed of “gray matter”?", 
        type: "mcq", 
        options: ["spinothalamic tract", "cerebral cortex", "basal nuclei", "post-central gyrus"], 
        a: 0, 
        hint: "المادة 'الرمادية' (Gray matter) هي أجسام خلايا. أما 'Tract' (المسار) فهو 'حزمة محاور' (ألياف)، وهي مادة 'بيضاء' (White matter).",
        explanation: "المسارات (Tracts) تتكون من محاور مغلفة بالمايلين الأبيض، لذا فهي مادة بيضاء."
      },
      { 
        q: "Where in the brain is the “primary motor area”?", 
        type: "mcq", 
        options: ["Midbrain", "Thalamus", "Basal nuclei", "Pre-central gyrus"], 
        a: 3, 
        hint: "المنطقة الحركية الأساسية تقع في 'التلفيف قبل المركزي' (Pre-central gyrus) في الفص الأمامي.",
        explanation: "التلفيف قبل المركزي (Pre-central gyrus) هو المنطقة المسؤولة عن إصدار الأوامر الحركية الإرادية."
      },
      { 
        q: "The hypothalamus does ALL of the following EXCEPT one. Which one?", 
        type: "mcq", 
        options: ["It is the autonomic control centre.", "It directs lower CNS centres to perform actions.", "It produces the rigidly programmed, automatic behaviours necessary for survival", "It performs many homeostatic roles."], 
        a: 2, 
        hint: "السلوكيات 'الأوتوماتيكية' للبقاء (مثل التنفس) يتم التحكم بها بواسطة 'جذع الدماغ' (Brainstem)، وليس الـ Hypothalamus.",
        explanation: "السلوكيات التلقائية المبرمجة (مثل التنفس وضربات القلب) هي وظيفة جذع الدماغ، بينما الهيبوثلاموس ينظم التوازن الداخلي."
      },
      { 
        q: "Which of the following structures together make up the brainstem?", 
        type: "mcq", 
        options: ["medulla oblongata, pons, midbrain, cerebellum", "medulla oblongata, pons, midbrain", "medulla oblongata, pons, midbrain, thalamus", "medulla oblongata, pons, midbrain, pineal gland"], 
        a: 1, 
        hint: "'جذع الدماغ' (Brainstem) يتكون من ثلاثة أجزاء: النخاع المستطيل، والجسر، والدماغ الأوسط.",
        explanation: "جذع الدماغ يتكون حصرياً من: Midbrain, Pons, Medulla Oblongata."
      },
      { 
        q: "In which of the following places would you NOT find cerebrospinal fluid?", 
        type: "mcq", 
        options: ["the sub-arachnoid space", "the third ventricle of the brain", "the epidural space", "the central canal of the spinal cord"], 
        a: 2, 
        hint: "السائل الدماغي الشوكي (CSF) يوجد 'تحت' الأم العنكبوتية. أما 'Epidural' (فوق الجافية) فيحتوي على دهون وأوعية دموية.",
        explanation: "الفراغ فوق الجافية (Epidural) لا يحتوي على CSF، بل يحتوي على نسيج دهني وأوعية دموية."
      },
      { 
        q: "What is the name of the lobe of the brain that is immediately superior to the cerebellum?", 
        type: "mcq", 
        options: ["dorsal", "occipital", "posterior", "parietal"], 
        a: 1, 
        hint: "الفص 'القفوي' (Occipital) هو الذي يقع 'فوق' المخيخ (Cerebellum).",
        explanation: "الفص القفوي يقع في مؤخرة الرأس، مباشرة فوق المخيخ."
      },
      { 
        q: "Which of the following statements about the blood-brain barrier (BBB) is correct?", 
        type: "mcq", 
        options: ["The BBB prevents fluctuations of hormone and ion concentrations in blood from affecting the brain.", "It is formed by Schwann cells wrapping around capillaries.", "The brain is supported by (it floats in) the BBB.", "The BBB is formed by the choroid plexus."], 
        a: 0, 
        hint: "وظيفة الحاجز هي 'منع' التغيرات المفاجئة في الأيونات والهرمونات من التأثير على الدماغ.",
        explanation: "الحاجز الدموي الدماغي يحافظ على بيئة كيميائية ثابتة للدماغ بحمايته من تقلبات الدم."
      },
      { 
        q: "In which part of the brain is the thalamus found?", 
        type: "mcq", 
        options: ["diencephalon", "cerebrum", "cerebellum", "brainstem"], 
        a: 0, 
        hint: "الـ 'Diencephalon' (الدماغ البيني) يتكون أساسًا من الثلاموس والهيبوثلاموس.",
        explanation: "الدماغ البيني (Diencephalon) هو الجزء الذي يضم المهاد (Thalamus) وتحت المهاد."
      },
      { 
        q: "Where is the autonomic control centre for most of body homeostasis located?", 
        type: "mcq", 
        options: ["In the limbic system", "In the brainstem", "In the hypothalamus", "In the cerebellum"], 
        a: 2, 
        hint: "الـ 'Hypothalamus' هو 'مركز التحكم' (Control centre) الرئيسي للتوازن (Homeostasis) في الجسم.",
        explanation: "الهيبوثلاموس هو المسؤول الأول عن تنظيم وظائف الجسم الحيوية (حرارة، جوع، عطش، هرمونات)."
      },
      { 
        q: "Which part of the brain allows us to control skilled voluntary muscle movements?", 
        type: "mcq", 
        options: ["basal nuclei", "cerebellum", "pre-central gyrus", "thalamus"], 
        a: 2, 
        hint: "سؤال مكرر، الحركات 'الإرادية' (Voluntary) تأتي من 'التلفيف قبل المركزي' (Pre-central gyrus).",
        explanation: "تكرار للسؤال: القشرة الحركية."
      },
      { 
        q: "Which of the following roles is NOT performed by the hypothalamus?", 
        type: "mcq", 
        options: ["autonomic control of heat activity and blood pressure", "relaying visual and auditory information to the cerebral cortex", "production of hormones for the posterior pituitary", "body temperature regulation"], 
        a: 1, 
        hint: "الـ 'Thalamus' (المهاد) هو الذي يقوم بـ 'ترحيل' (Relaying) المعلومات الحسية، وليس الـ Hypothalamus.",
        explanation: "وظيفة 'ترحيل' المعلومات الحسية (Relaying) هي وظيفة المهاد (Thalamus) وليست تحت المهاد."
      },
      { 
        q: "Cortico-spinal pathways cross-over from one side of the brain to the other side. Where does this cross-over occur?", 
        type: "mcq", 
        options: ["In the medulla oblongata", "In the cerebellum", "In the hypothalamus", "In the reticular formation"], 
        a: 0, 
        hint: "يحدث 'التصالب' (Cross-over) للمسارات الحركية في 'النخاع المستطيل' (Medulla oblongata).",
        explanation: "في منطقة الأهرامات (Pyramids) بالنخاع المستطيل، تعبر الألياف الحركية للجانب المقابل (Decussation)."
      }
    ]
  },

  // ==========================================================
  // القسم الثاني: Blood (الدم)
  // ==========================================================
  physio_blood_1: {
    title: "Blood - Part 1",
    questions: [
      { 
        q: "To which of the following would the term “white cell” NOT be applied?", 
        type: "mcq", 
        options: ["erythrocyte", "leucocyte", "lymphocyte", "monocyte"], 
        a: 0, 
        hint: "الـ 'Erythrocyte' هي خلية الدم 'الحمراء' (Red cell).",
        explanation: "Erythrocyte تعني خلية دم حمراء، بينما الباقي كلهم أنواع من خلايا الدم البيضاء."
      },
      { 
        q: "In the haemostasis process, what forms as a result of the extrinsic and intrinsic pathways?", 
        type: "mcq", 
        options: ["fibrin", "thrombin", "a platelet plug", "prothrombinase"], 
        a: 3, 
        hint: "كلا المسارين (Intrinsic/Extrinsic) يلتقيان ليُكوّنا 'Prothrombinase' (أو Factor Xa).",
        explanation: "نهاية المسارين الداخلي والخارجي هي تكوين مركب البروثرومبيناز (Prothrombinase) الذي يحول البروثرومبين لثرومبين."
      },
      { 
        q: "The blood group known as the ABO system is based on the presence of what proteins on blood cells?", 
        type: "mcq", 
        options: ["antibodies", "antigens", "agglutinins", "immunoglobulins"], 
        a: 1, 
        hint: "فصيلة الدم تُحدد بوجود 'مضادات' (Antigens) على 'سطح' خلية الدم الحمراء.",
        explanation: "نظام ABO يعتمد على نوع الأنتيجينات (A أو B) الموجودة على غشاء خلية الدم الحمراء."
      },
      { 
        q: "What is found in blood serum that is also in blood plasma?", 
        type: "mcq", 
        options: ["blood cells", "platelets", "plasma proteins", "clotting factors"], 
        a: 2, 
        hint: "الـ 'Serum' هو 'Plasma' ولكن 'بدون' (minus) 'عوامل التجلط' (Clotting factors).",
        explanation: "السيروم هو بلازما منزوعة عوامل التجلط، لكنه لا يزال يحتوي على بروتينات البلازما الأخرى والأجسام المضادة."
      },
      { 
        q: "What is the term “formed elements” used to mean in a description of blood?", 
        type: "mcq", 
        options: ["white blood cells, red blood cells and platelets", "blood plasma", "blood serum", "the clotting factors in blood"], 
        a: 0, 
        hint: "الـ 'Formed elements' هي 'كل الخلايا' الموجودة في الدم.",
        explanation: "العناصر المكونة (Formed elements) تشمل جميع الخلايا والصفائح، تمييزاً لها عن البلازما السائلة."
      },
      { 
        q: "What is the SECOND step in the three phases of haemostasis listed below?", 
        type: "mcq", 
        options: ["The vascular phase", "The intrinsic pathway", "The extrinsic pathway", "The platelet phase"], 
        a: 3, 
        hint: "الخطوات هي: 1. تقلص وعائي (Vascular)، 2. تجمع الصفائح (Platelet)، 3. تجلط (Coagulation).",
        explanation: "تسلسل وقف النزيف: 1. انقباض الوعاء، 2. سدادة الصفائح الدموية، 3. تجلط الدم."
      },
      { 
        q: "What type of blood may a patient with blood type “B+” be infused with? Any blood that is", 
        type: "mcq", 
        options: ["positive for rhesus antigen D", "negative for rhesus antigen D", "negative for antigen B", "negative for antigen A"], 
        a: 3, 
        hint: "شخص B+ لديه أجسام مضادة لـ A (Anti-A). لذلك، يجب أن يكون الدم المنقول 'خاليًا من Antigen A'.",
        explanation: "مريض B+ يمكنه استقبال B أو O (لأنهما لا يحتويان على A)، لكن لا يمكنه استقبال A أو AB."
      },
      { 
        q: "What is the first process that occurs after a blood vessel is damaged?", 
        type: "mcq", 
        options: ["coagulation", "platelet plug formation", "vasoconstriction", "haemolysis"], 
        a: 2, 
        hint: "أول رد فعل 'فوري' هو 'انقباض' (Constriction) الوعاء الدموي لتقليل النزيف.",
        explanation: "الانقباض الوعائي (Vascular spasm) هو رد الفعل الفوري لتقليل تدفق الدم في الوعاء المصاب."
      },
      { 
        q: "Which blood cells are involved in protecting the body from pathogens and foreign cells?", 
        type: "mcq", 
        options: ["erythrocytes", "leucocytes", "platelets", "haemoglobin"], 
        a: 1, 
        hint: "الـ 'Leucocytes' هي 'خلايا الدم البيضاء' (White blood cells) المسؤولة عن المناعة.",
        explanation: "خلايا الدم البيضاء (Leucocytes) هي الجهاز المناعي المتحرك في الدم."
      },
      { 
        q: "Which individuals can receive any type of blood and are considered universal recipients?", 
        type: "mcq", 
        options: ["A+", "O-", "AB+", "B-"], 
        a: 2, 
        hint: "فصيلة 'AB+' لا تحتوي على أي أجسام مضادة (لا Anti-A ولا Anti-B ولا Anti-D)، لذا 'تستقبل' (Recipient) من الجميع.",
        explanation: "AB+ ليس لديه أجسام مضادة في البلازما، لذا لن يهاجم أي دم غريب."
      },
      { 
        q: "Which is the most abundant plasma protein?", 
        type: "mcq", 
        options: ["alpha- and beta- globulins", "albumin", "mitochondria", "haemoglobin"], 
        a: 1, 
        hint: "الـ 'Albumin' (الألبومين) هو البروتين الأكثر وفرة في البلازما ومسؤول عن الضغط الأسموزي.",
        explanation: "الألبومين يشكل حوالي 60% من بروتينات البلازما ومهم جداً للحفاظ على الماء داخل الأوعية."
      },
      { 
        q: "Which characteristic of blood refers to the concentration of solutes?", 
        type: "mcq", 
        options: ["salinity", "pH", "osmolality", "viscosity"], 
        a: 2, 
        hint: "الـ 'Osmolality' (الأسمولية) هي مقياس لـ 'تركيز المواد المذابة' (Solutes).",
        explanation: "الأسمولية (Osmolality) تعبر عن عدد الجزيئات المذابة في الكيلوجرام من السائل."
      },
      { 
        q: "Which type of white blood cell is responsible for engulfing pathogens during phagocytosis?", 
        type: "mcq", 
        options: ["thrombocyte", "neutrophil", "erythrocyte", "basophil"], 
        a: 1, 
        hint: "الـ 'Neutrophil' (العدلات) هي خط الدفاع الأول وتقوم بعملية 'البلعمة' (Phagocytosis).",
        explanation: "العدلات (Neutrophils) هي خلايا بلعمية نشطة جداً وهي أول من يصل لموقع العدوى."
      },
      { 
        q: "What does “Rhesus positive” refer to?", 
        type: "mcq", 
        options: ["The presence of antigen D on the surface of red blood cells", "The final factor involved in blood clotting", "The presence of the rhesus antibody/agglutinin in the blood", "A deficiency of Factor VIII that results in haemophilia"], 
        a: 0, 
        hint: "الـ Rhesus (أو Rh) يشير إلى وجود 'Antigen D' على سطح خلية الدم الحمراء.",
        explanation: "وجود عامل ريسس (Rh+) يعني وجود الأنتيجين D على سطح الخلايا الحمراء."
      },
      { 
        q: "What are red blood cells primarily composed of?", 
        type: "mcq", 
        options: ["alpha- and beta- globulins", "albumin", "mitochondria", "haemoglobin"], 
        a: 3, 
        hint: "خلايا الدم الحمراء مليئة ببروتين 'الهيموجلوبين' (Haemoglobin) لنقل الأكسجين.",
        explanation: "خلايا الدم الحمراء هي في الأساس أكياس مملوءة بالهيموجلوبين، وهي تفتقر للنواة والميتوكوندريا."
      },
      { 
        q: "Which is the LEAST common type of white blood cell?", 
        type: "mcq", 
        options: ["lymphocyte", "basophil", "thrombocyte", "neutrophil"], 
        a: 1, 
        hint: "الـ 'Basophil' هي الأقل عددًا (أقل من 1%)، بينما الـ 'Neutrophil' هي الأكثر عددًا.",
        explanation: "القاعدية (Basophils) هي الأندر وتشارك في تفاعلات الحساسية."
      },
      { 
        q: "In the process of haemostasis, which phase involves the intrinsic and extrinsic pathways?", 
        type: "mcq", 
        options: ["the platelet phase", "the clot lysis phase", "the vascular phase", "the coagulation phase"], 
        a: 3, 
        hint: "هذه المسارات (Pathways) هي جزء من 'مرحلة التجلط' (Coagulation phase).",
        explanation: "المسارات الداخلية والخارجية هي الآليات الكيميائية التي تؤدي لتجلط الدم (Coagulation)."
      },
      { 
        q: "In haemostasis, which molecule polymerises to become the insoluble blood clot?", 
        type: "mcq", 
        options: ["factor X", "thrombin", "fibrin", "plasmin"], 
        a: 2, 
        hint: "الـ 'Fibrin' (الفايبرين) هو الذي يتحول من ذائب إلى 'شبكة غير ذائبة' (Insoluble) لتكوين الجلطة.",
        explanation: "الفايبرين يترسب كخيوط صلبة تشكل شبكة الجلطة التي تحبس خلايا الدم."
      },
      { 
        q: "Which enzyme converts fibrinogen to fibrin?", 
        type: "mcq", 
        options: ["serotonin", "thrombin", "renin", "secretin"], 
        a: 1, 
        hint: "الـ 'Thrombin' هو الإنزيم الذي 'ينشط' Fibrinogen (الخامل) إلى Fibrin (النشط).",
        explanation: "الثرومبين هو الإنزيم النشط الذي يحول الفايبرينوجين الذائب إلى فايبرين صلب."
      },
      { 
        q: "Which of the following is NOT a macrophage?", 
        type: "mcq", 
        options: ["Kupffer cell", "Monocyte", "Dendrocyte", "Megakaryocyte"], 
        a: 3, 
        hint: "الـ 'Megakaryocyte' هي الخلية 'العملاقة' التي تنتج 'الصفائح الدموية' (Platelets).",
        explanation: "Megakaryocyte هي الخلية الأم للصفائح الدموية في نخاع العظم، وليست خلية بلعمية."
      }
    ]
  },
  physio_blood_2: {
    title: "Blood - Part 2",
    questions: [
      { 
        q: "What can be said about a person who has the “A” antigen on their red blood cells?", 
        type: "mcq", 
        options: ["their blood contains anti-B agglutinins", "their blood contains anti-A agglutinins", "their blood contains anti-A and anti-B agglutinins", "their blood contains neither anti-A nor anti-B agglutinins"], 
        a: 0, 
        hint: "إذا كان لديك Antigen A، فمن الطبيعي أن يكون لديك أجسام مضادة لـ B (Anti-B).",
        explanation: "الجسم يكون أجساماً مضادة لما لا يملكه. إذا كان لديك A، ستهاجم B (Anti-B)."
      },
      { 
        q: "Which one of the following is NOT a plasma protein?", 
        type: "mcq", 
        options: ["keratin", "albumin", "ferritin", "globulin"], 
        a: 0, 
        hint: "الـ 'Keratin' (الكيراتين) هو بروتين موجود في 'الجلد والشعر'، وليس في 'بلازما' الدم.",
        explanation: "الكيراتين بروتين تركيبي في الجلد والشعر، وليس بروتين ذائب في البلازما."
      },
      { 
        q: "What substance is produced by the first step in the blood clotting (coagulation) process?", 
        type: "mcq", 
        options: ["thrombin", "prothrombin", "factor X", "prothrombinase"], 
        a: 3, 
        hint: "سؤال مكرر، الخطوة الأولى (نهاية المسارين) هي إنتاج 'Prothrombinase'.",
        explanation: "تكرار للسؤال: البروثرومبيناز هو ناتج الخطوة الأولى."
      },
      { 
        q: "Which statement about neutrophils is correct?", 
        type: "mcq", 
        options: ["they have no nucleus", "they contain haemoglobin", "they function as a body defence mechanism", "eosinophils are one type of neutrophil"], 
        a: 2, 
        hint: "الـ 'Neutrophils' هي خلايا مناعية وتعمل 'كآلية دفاع' (Defence mechanism) للجسم.",
        explanation: "العدلات هي خلايا دفاعية تلتهم البكتيريا."
      },
      { 
        q: "What are red blood cells also known as?", 
        type: "mcq", 
        options: ["erythrocytes", "thrombocytes", "monocytes", "eosinophils"], 
        a: 0, 
        hint: "الاسم اللاتيني لخلايا الدم الحمراء هو 'Erythrocytes'.",
        explanation: "Erythro = أحمر، Cyte = خلية."
      },
      { 
        q: "In blood clotting, what activates “factor X”", 
        type: "mcq", 
        options: ["prothrombinase", "thrombin", "the extrinsic pathway", "tissue plasminogen activator"], 
        a: 2, 
        hint: "الـ 'Extrinsic pathway' (و كذلك الـ Intrinsic) كلاهما يؤدي إلى 'تفعيل' (Activates) Factor X.",
        explanation: "المسار الخارجي (بواسطة Tissue Factor) ينشط العامل العاشر (Factor X) لبدء المسار المشترك."
      },
      { 
        q: "A person’s blood group is determined by:", 
        type: "mcq", 
        options: ["the agglutinogens circulating in their plasma", "the antigens on the surface of their red blood cells", "the antibodies on the surface of their red blood cells", "the agglutinins circulating in their plasma"], 
        a: 1, 
        hint: "سؤال مكرر، فصيلة الدم تُحدد بـ 'Antigens' على 'سطح' خلية الدم الحمراء.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "If a blood sample is taken for DNA testing, which of the following would be examined?", 
        type: "mcq", 
        options: ["leucocytes", "erythrocytes", "thrombocytes", "plasma proteins"], 
        a: 0, 
        hint: "خلايا الدم البيضاء (Leucocytes) هي 'الوحيدة' التي تحتوي على 'نواة' (Nucleus) وبالتالي DNA.",
        explanation: "الحمض النووي يوجد في النواة، وخلايا الدم البيضاء هي الوحيدة التي تمتلك نواة."
      },
      { 
        q: "What is the major task of red blood cells?", 
        type: "mcq", 
        options: ["to transport carbon dioxide", "to ensure haemostasis", "to provide immunity", "to transport oxygen"], 
        a: 3, 
        hint: "المهمة 'الرئيسية' (Major task) لخلايا الدم الحمراء هي 'نقل الأكسجين' (Transport oxygen).",
        explanation: "الهيموجلوبين في الخلايا الحمراء وظيفته الأساسية نقل الأكسجين للأنسجة."
      },
      { 
        q: "Careful blood matching is performed prior to transfusing blood in order to avoid which scenario?", 
        type: "mcq", 
        options: ["newborn haemolytic disease", "the recipient’s antigens attacking the red blood cells", "the recipient’s antibodies attacking the red blood cells in the transfusion", "the antigens on the recipient’s red blood cells reacting with the antibodies"], 
        a: 2, 
        hint: "المشكلة الكبرى هي أن 'أجسامك المضادة' (Recipient's antibodies) 'تهاجم' (Attacking) خلايا الدم 'المنقولة' (Transfusion).",
        explanation: "نطابق الدم لمنع الجهاز المناعي للمستقبل (الأجسام المضادة) من تدمير خلايا دم المتبرع."
      },
      { 
        q: "Which cell in the list below is the MOST common white blood cell?", 
        type: "mcq", 
        options: ["basophils", "lymphocytes", "monocytes", "neutrophils"], 
        a: 3, 
        hint: "الـ 'Neutrophils' (العدلات) هي 'الأكثر' شيوعًا (50-70%).",
        explanation: "العدلات هي الخلايا الأكثر وفرة."
      },
      { 
        q: "What substance is the product of the second step in the blood clotting process?", 
        type: "mcq", 
        options: ["thrombin", "prothrombin", "prothrombin activator", "fibrin"], 
        a: 0, 
        hint: "الخطوة 1: Prothrombinase. الخطوة 2: Prothrombinase يحول Prothrombin إلى 'Thrombin'.",
        explanation: "ناتج الخطوة الثانية هو الثرومبين النشط."
      },
      { 
        q: "A person whose blood group is “B positive” has which of the following?", 
        type: "mcq", 
        options: ["the rhesus D antigen and the B antigen on their rbc, and the anti-A agglutinin.", "the rhesus D antigen and the B antigen on their rbc, and the anti-B agglutinin.", "the rhesus D antigen and the A antigen on their rbc, and the anti-B agglutinin", "no rhesus D antigen and the B antigen on their rbc, and the anti-A agglutinin"], 
        a: 0, 
        hint: "B+ يعني: Antigen B، و Antigen D (عشان +)، و Anti-A (لأنه B).",
        explanation: "B+ تعني وجود B Antigens و D Antigens، وبالتالي يكون لديه أجسام مضادة للنوع المفقود (Anti-A)."
      },
      { 
        q: "The role of platelets in blood clotting includes all of the following EXCEPT one. Which one?", 
        type: "mcq", 
        options: ["to form a plug in the hole", "to convert prothrombin to thrombin", "to release chemicals to attract other platelets", "to adhere to exposed collagen fibres"], 
        a: 1, 
        hint: "الصفائح (Platelets) 'لا تحول' Prothrombin إلى Thrombin. هذه وظيفة 'Prothrombinase'.",
        explanation: "تحويل البروثرومبين لثرومبين هو تفاعل كيميائي إنزيمي لا تقوم به الصفائح مباشرة."
      },
      { 
        q: "If someone’s ABO blood group is “type A”, this means that", 
        type: "mcq", 
        options: ["they have the type A antigen on their red blood cells", "their blood contains anti-A agglutinins", "they can receive blood from a type B donor", "they may donate blood to a type B recipient"], 
        a: 0, 
        hint: "فصيلة A تعني أن خلايا الدم الحمراء تحمل 'Antigen A'.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which statement below about vitamin K is true?", 
        type: "mcq", 
        options: ["It is water soluble.", "It is essential for prothrombin production by the liver.", "It is part of the “extrinsic pathway”.", "It destroys fibrin so allowing a clot to gradually dissolve."], 
        a: 1, 
        hint: "فيتامين K ضروري لـ 'الكبد' (Liver) لإنتاج 'عوامل التجلط' (مثل Prothrombin).",
        explanation: "الكبد يحتاج فيتامين K لتصنيع عوامل التجلط (II, VII, IX, X)."
      },
      { 
        q: "What is the function of the plasma proteins in blood?", 
        type: "mcq", 
        options: ["to transport oxygen.", "to regulate electrolyte balance", "to exert osmotic pressure and so help maintain blood volume.", "to function as a non-specific body defence mechanism."], 
        a: 2, 
        hint: "البروتينات (خاصة الألبومين) 'تسحب' الماء وتحافظ عليه داخل الأوعية الدموية (Osmotic pressure).",
        explanation: "بروتينات البلازما تخلق ضغطاً أسموزياً يمنع تسرب السوائل من الأوعية الدموية للأنسجة."
      },
      { 
        q: "The term “formed elements” used in relation to the blood include which of the following?", 
        type: "mcq", 
        options: ["fibrinogen.", "white blood cells.", "electrolytes.", "plasma proteins."], 
        a: 1, 
        hint: "سؤال مكرر، 'Formed elements' تشمل 'خلايا الدم البيضاء' (WBCs).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which blood cell fits the following description: multi-lobed nucleus, inconspicuous cytoplasmic granules, most common type of blood cell except for red blood cells?", 
        type: "mcq", 
        options: ["neutrophil", "eosinophil", "basophil", "lymphocyte"], 
        a: 0, 
        hint: "هذا الوصف (Multi-lobed nucleus، Most common) ينطبق على 'Neutrophil' (العدلات).",
        explanation: "العدلات تتميز بنواة متعددة الفصوص وهي الأكثر شيوعاً."
      },
      { 
        q: "What constitutes blood plasma?", 
        type: "mcq", 
        options: ["whole blood without the formed elements.", "blood without the red blood cells.", "whole blood without blood cells and clotting factors.", "blood minus blood cells and proteins."], 
        a: 0, 
        hint: "البلازما هي الدم 'بدون' (Without) 'العناصر المكونة' (Formed elements) أي الخلايا.",
        explanation: "البلازما هي الجزء السائل من الدم بعد إزالة الخلايا."
      }
    ]
  },
  physio_blood_3: {
    title: "Blood - Part 3",
    questions: [
      { 
        q: "Which of the following statements about a person with blood group “A” is true? They have the:", 
        type: "mcq", 
        options: ["A antigen on their red blood cells.", "anti-A antibodies in their plasma.", "anti-A agglutinogen on their red blood cells.", "A antibody on their red blood cells."], 
        a: 0, 
        hint: "سؤال مكرر، فصيلة A تعني 'Antigen A' على الخلايا.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which of the following statements concerning intracellular and extracellular fluids is FALSE?", 
        type: "mcq", 
        options: ["The concentration of sodium is higher in extracellular fluid", "The concentration of potassium is lower in extracellular fluid", "Blood plasma is an example of intracellular fluid.", "The volume of intracellular fluid is greater than that of extracellular fluid."], 
        a: 2, 
        hint: "بلازما الدم (Blood plasma) هي 'خارج' (Extra) الخلايا، وليست 'داخل' (Intra) الخلايا.",
        explanation: "البلازما هي سائل خارج خلوي (Extracellular Fluid - ECF)، وليست داخل خلوي."
      },
      { 
        q: "Which of the following is not a type of white blood cell?", 
        type: "mcq", 
        options: ["leucocyte", "eosinophil", "erythrocyte", "neutrophil"], 
        a: 2, 
        hint: "سؤال مكرر، 'Erythrocyte' هي خلية الدم 'الحمراء'.",
        explanation: "Erythrocyte هي خلية دم حمراء."
      },
      { 
        q: "Which of the following formed elements of the blood is important in the formation of clots?", 
        type: "mcq", 
        options: ["erythrocytes", "lymphocytes", "monocytes", "thrombocytes"], 
        a: 3, 
        hint: "الـ 'Thrombocytes' هو الاسم الآخر لـ 'الصفائح الدموية' (Platelets) المسؤولة عن التجلط.",
        explanation: "Thrombocytes (الصفائح الدموية) هي المسؤولة عن بدء التجلط وسد الجروح."
      },
      { 
        q: "With which blood types can a person with blood type B be safely transfused?", 
        type: "mcq", 
        options: ["A or AB", "B or O", "A or O", "B or AB"], 
        a: 1, 
        hint: "شخص فصيلته B يمكنه استقبال B (لأنه مثله) أو O (لأنه معطي عام).",
        explanation: "فصيلة B يمكنها استقبال دم من نفس النوع (B) أو من المعطي العام (O)."
      },
      { 
        q: "Leucocytes may be correctly described as what?", 
        type: "mcq", 
        options: ["cells with nuclei that do not contain haemoglobin.", "cells without nuclei, that contain haemoglobin.", "white blood cells with granules in their cytoplasm.", "neutrophilic."], 
        a: 0, 
        hint: "الوصف الدقيق لخلايا الدم البيضاء (Leucocytes) هو أنها تحتوي على 'نواة' (Nuclei) ولا تحتوي على 'هيموجلوبين'.",
        explanation: "الخلايا البيضاء حقيقية النواة ولا تحتوي صبغات (هيموجلوبين)."
      },
      { 
        q: "What are lymphocytes? Blood cells that:", 
        type: "mcq", 
        options: ["mature and proliferate in the bone marrow.", "contain haemoglobin.", "are involved in the body’s immune response", "mature into macrophages."], 
        a: 2, 
        hint: "الخلايا 'الليمفاوية' (Lymphocytes) هي المكون الرئيسي لـ 'الاستجابة المناعية' (Immune response).",
        explanation: "الخلايا الليمفاوية (T و B) هي المسؤولة عن المناعة المكتسبة وإنتاج الأجسام المضادة."
      },
      { 
        q: "Which of the following statements about platelets is INCORRECT?", 
        type: "mcq", 
        options: ["adhere to collagen fibres", "release phospholipids which combine with “clotting factors”", "are cell fragments derived from megakayoblasts", "are part of the “extrinsic pathway”"], 
        a: 1, 
        hint: "الخيار B هو الخاطئ. الصفائح 'تطلق' مواد كيميائية، لكن الفوسفوليبيدات التي تشارك في التجلط هي جزء من غشائها.",
        explanation: "الصفائح لا تطلق فوسفوليبيدات للاتحاد، بل توفر سطحاً للتفاعل. العبارة غير دقيقة علمياً."
      },
      { 
        q: "Finish the sentence correctly. Plasma proteins:", 
        type: "mcq", 
        options: ["help maintain blood volume due to colloid osmotic pressure.", "are regarded as formed elements of the blood.", "are low molecular weight proteins.", "are part of the blood serum."], 
        a: 0, 
        hint: "سؤال مكرر، وظيفتها الرئيسية هي الحفاظ على 'حجم الدم' (Blood volume) عن طريق 'الضغط الأسموزي'.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "The colloid osmotic pressure of blood is due to which of the following?", 
        type: "mcq", 
        options: ["proteins in the blood", "proteins in the interstitial fluid", "sodium and chloride ions dissolved in blood", "the water component of the blood"], 
        a: 0, 
        hint: "الضغط الأسموزي 'الغرواني' (Colloid) ينتج عن 'البروتينات' (Proteins) الموجودة في الدم.",
        explanation: "الضغط الغرواني ينتج حصرياً عن البروتينات لأنها جزيئات كبيرة لا تعبر الغشاء بسهولة."
      },
      { 
        q: "Which one of the following terms refers to an abnormally low number of white blood cells?", 
        type: "mcq", 
        options: ["thrombocytosis", "haemostasis", "leukopenia", "cytokinesis"], 
        a: 2, 
        hint: "'Leuko' تعني أبيض، و 'Penia' تعني 'نقص'.",
        explanation: "Leukopenia تعني انخفاض عدد خلايا الدم البيضاء (Leuko = أبيض، Penia = فقر/نقص)."
      },
      { 
        q: "Which of the following three proteins are known as “plasma proteins”?", 
        type: "mcq", 
        options: ["albumin, globulin, haemoglobin", "insulin, glucagon, haemoglobin", "fibrin, globulin, albumin", "albumin, fibrinogen, globulin"], 
        a: 3, 
        hint: "الهيموجلوبين ليس بروتين بلازما (هو داخل الخلايا). Fibrin هو الشكل النشط، 'Fibrinogen' هو بروتين البلازما.",
        explanation: "البروتينات الرئيسية في البلازما هي: الألبومين، الجلوبيولين، والفيبرينوجين."
      }
    ]
  },

  // ==========================================================
  // القسم الثالث: CVS (الجهاز الدوري)
  // ==========================================================
  physio_cvs_1: {
    title: "CVS - Part 1",
    questions: [
      { 
        q: "Blood flow through the heart follows which of the sequences listed below?", 
        type: "mcq", 
        options: ["from left atrium, then mitral valve, right ventricle...", "from right atrium, then mitral valve, right ventricle...", "from pulmonary trunk, then tricuspid valve, left atrium...", "from vena cava, then right ventricle, pulmonary trunk, left ventricle, aorta."], 
        a: 3, 
        hint: "دورة الدم: وريد أجوف (Vena cava) -> بطين أيمن (Right ventricle) -> شريان رئوي (Pulmonary trunk) -> بطين أيسر (Left ventricle) -> أورطى (Aorta).",
        explanation: "الدم يأتي من الجسم للجانب الأيمن، يضخ للرئة، يعود للجانب الأيسر، ثم يضخ للجسم."
      },
      { 
        q: "What feature does cardiac muscle possess that is missing in skeletal muscle?", 
        type: "mcq", 
        options: ["striations", "multiple nuclei", "voluntary control", "intercalated discs"], 
        a: 3, 
        hint: "عضلة القلب تتميز بوجود 'الأقراص البينية' (Intercalated discs) التي تربط الخلايا ببعضها.",
        explanation: "الأقراص البينية (Intercalated discs) هي وصلات فريدة تسمح بنقل الإشارات الكهربائية بسرعة بين خلايا القلب لينقبض كوحدة واحدة."
      },
      { 
        q: "What is the name of the valve between the left atrium and the left ventricle?", 
        type: "mcq", 
        options: ["mitral valve", "tricuspid valve", "semi-lunar valve", "aortic valve"], 
        a: 0, 
        hint: "الصمام الموجود في الجانب 'الأيسر' (Left) هو الصمام 'الميترالي' (Mitral) أو (Bicuspid).",
        explanation: "الصمام الميترالي (أو ثنائي الشرفات) يقع في الجانب الأيسر."
      },
      { 
        q: "What is meant by a diastolic blood pressure of 100 mm Hg?", 
        type: "mcq", 
        options: ["the maximum pressure during ventricular contraction.", "the minimum pressure before the start of a ventricular contraction.", "the maximum pressure at the start of the aorta and pulmonary trunk.", "The minimum blood pressure measured when resting."], 
        a: 1, 
        hint: "الضغط 'الانبساطي' (Diastolic) هو 'أقل' (Minimum) ضغط في الشرايين (أثناء ارتخاء البطين).",
        explanation: "الضغط الانبساطي هو أقل ضغط يصل إليه الشريان أثناء فترة راحة القلب (Diastole)."
      },
      { 
        q: "What is the main function of mitral valve?", 
        type: "mcq", 
        options: ["to increase the pressure inside the left atrium during systole", "to prevent a drop in pressure in the aorta during diastole", "to prevent backflow from left ventricle to left atrium during systole", "to add additional blood from left atrium to left ventricle"], 
        a: 2, 
        hint: "وظيفة الصمامات (Valves) دائمًا هي 'منع التدفق العكسي' (Prevent backflow).",
        explanation: "الصمام الميترالي يغلق أثناء انقباض البطين (Systole) ليمنع الدم من الرجوع للأذين."
      },
      { 
        q: "The Frank-Starling law of the heart describes the proportional relationship between which of the following pairs?", 
        type: "mcq", 
        options: ["Stroke volume and cardiac output", "Stroke volume and end-diastolic volume", "The blood volume in the ventricles and stroke volume", "Systemic vascular resistance and stroke volume"], 
        a: 2, 
        hint: "قانون 'ستارلينج' يقول: كلما 'زاد امتلاء' (Volume in ventricles) القلب بالدم، كلما 'زادت قوة الضخة' (Stroke volume).",
        explanation: "قانون ستارلينج: كلما زاد تمدد عضلة القلب (بزيادة حجم الدم)، زادت قوة الانقباض."
      },
      { 
        q: "If Sarah has a stroke volume of 70 ml and a cardiac output of 5950 ml/min, which of the following is her heart rate (in beats/min)?", 
        type: "mcq", 
        options: ["70", "75", "80", "85"], 
        a: 3, 
        hint: "المعادلة: Cardiac Output = Stroke Volume * Heart Rate. (5950 / 70 = 85).",
        explanation: "معدل ضربات القلب = النتاج القلبي ÷ حجم الضربة (5950 ÷ 70 = 85)."
      },
      { 
        q: "What will cause the sinoatrial (SA) node to depolarize more frequently?", 
        type: "mcq", 
        options: ["Acetylcholine", "Norepinephrine", "Parasympathetic stimulation", "Vagus nerve"], 
        a: 1, 
        hint: "الـ 'Norepinephrine' (نورإبينفرين) هو ناقل عصبي 'سمبثاوي' (Sympathetic) 'يسرّع' (More frequently) ضربات القلب.",
        explanation: "النورإبينفرين يطلق من الجهاز السمبثاوي ويزيد من سرعة إطلاق الإشارات من العقدة الجيبية (SA node)."
      },
      { 
        q: "How are cardiac cells mechanically attached to each other? By their:", 
        type: "mcq", 
        options: ["mitochondria", "intercalated discs", "gap junctions", "sarcolemma"], 
        a: 1, 
        hint: "سؤال مكرر، 'الأقراص البينية' (Intercalated discs) هي التي تربط خلايا القلب.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Starting at the APEX of the heart and moving superiorly, what is the correct order...?", 
        type: "mcq", 
        options: ["valves, chordae tendonae, papillary muscle, ventricle", "ventricle, papillary muscle, chordae tendonae, valves", "papillary muscle, chordae tendonae, ventricle, valves", "chordae tendonae, valves, ventricle, papillary muscle"], 
        a: 1, 
        hint: "الـ Apex (القمة) هي 'البطين' (Ventricle). متصل به 'عضلة حليمية' (Papillary muscle)، ثم 'حبال وترية' (Chordae tendonae)، ثم 'الصمام' (Valve).",
        explanation: "من القمة للأعلى: جدار البطين، عضلات حليمية، حبال وترية، ثم الصمام."
      },
      { 
        q: "Which period of the heart cycle is completely occupied by the ventricles relaxing?", 
        type: "mcq", 
        options: ["atrial systole", "atrial diastole", "ventricular systole", "ventricular diastole"], 
        a: 3, 
        hint: "'Diastole' يعني 'ارتخاء' (Relaxing)، و 'Ventricular' يعني 'البطينين'.",
        explanation: "Ventricular diastole هي الفترة التي تكون فيها البطينات في حالة استرخاء لتمتلئ بالدم."
      },
      { 
        q: "Through which valve does blood flow when it moves from the right atrium into the right ventricle?", 
        type: "mcq", 
        options: ["the tricuspid valve", "the mitral valve", "the pulmonary valve", "the bicuspid valve"], 
        a: 0, 
        hint: "الصمام الموجود في الجانب 'الأيمن' (Right) هو الصمام 'ثلاثي الشرفات' (Tricuspid).",
        explanation: "الصمام ثلاثي الشرفات يفصل بين الأذين الأيمن والبطين الأيمن."
      },
      { 
        q: "How is the fibrous pericardium attached to the surrounding structures?", 
        type: "mcq", 
        options: ["laterally to the pleural surfaces of the lungs.", "posteriorly to the sternum.", "anteriorly to trachea, main-stem bronchi and oesophagus.", "inferiorly to the clavicles."], 
        a: 0, 
        hint: "غشاء التامور (Pericardium) متصل 'جانبيًا' (Laterally) بالرئتين ومثبت 'سفليًا' بالحجاب الحاجز.",
        explanation: "التامور الليفي يتصل جانبيًا بأغشية الرئة (Pleura) لتثبيت القلب."
      },
      { 
        q: "A drug, such as cocaine, which stimulates the heart... would be considered a:", 
        type: "mcq", 
        options: ["Sympatholytic", "Sympathomimetic", "Parasympatholytic", "Parasympathomimetic"], 
        a: 1, 
        hint: "الأدوية التي 'تحاكي' (Mimic) تأثير الجهاز 'السمبثاوي' (Sympathetic) (المنشط للقلب) تسمى 'Sympathomimetic'.",
        explanation: "محاكيات السمبثاوي (Sympathomimetic) تزيد نشاط القلب وتشبه تأثير الأدرينالين."
      },
      { 
        q: "Why is the myocardium of the right ventricle (RV) thinner than that of the left ventricle (LV)?", 
        type: "mcq", 
        options: ["the RV pumps into the pulmonary circuit which has less resistance than the systemic circuit.", "the RV pumps a smaller volume of blood than the LV.", "the RV pumps blood out with a slower exit speed than the RV.", "the RV chamber has a smaller volume than the LV."], 
        a: 0, 
        hint: "البطين 'الأيمن' (RV) يضخ الدم 'للرئتين' فقط (مقاومة منخفضة)، بينما 'الأيسر' (LV) يضخ 'لكل الجسم' (مقاومة عالية).",
        explanation: "الدورة الرئوية قصيرة ومنخفضة المقاومة، فلا تحتاج لعضلة ضخمة كالبطين الأيسر."
      },
      { 
        q: "Through which valve does blood flow when it moves from the left atrium into the left ventricle?", 
        type: "mcq", 
        options: ["the semilunar valve", "the mitral valve", "the tricuspid valve", "the bicuspid valve"], 
        a: 1, 
        hint: "سؤال مكرر، الجانب 'الأيسر' (Left) يحتوي على الصمام 'الميترالي' (Mitral).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which period of the heart cycle is completely occupied by the ventricles contracting?", 
        type: "mcq", 
        options: ["atrial systole", "atrial diastole", "ventricular systole", "ventricular diastole"], 
        a: 2, 
        hint: "'Systole' يعني 'انقباض' (Contracting)، و 'Ventricular' يعني 'البطينين'.",
        explanation: "Ventricular systole هي فترة انقباض البطين لضخ الدم."
      },
      { 
        q: "Which statement below describes blood flow through the mitral valve?", 
        type: "mcq", 
        options: ["blood flows from the right atrium into the right ventricle", "blood flows from the right ventricle into the pulmonary artery", "blood flows from the left ventricle into the aorta", "blood flows from the left atrium into the left ventricle"], 
        a: 3, 
        hint: "الصمام 'الميترالي' (Mitral) يفصل بين 'الأذين الأيسر' (Left atrium) و'البطين الأيسر' (Left ventricle).",
        explanation: "تكرار للسؤال بصيغة أخرى."
      },
      { 
        q: "Which structure has the thickest wall?", 
        type: "mcq", 
        options: ["the aorta", "the inter-atrial septum", "the left ventricle", "the right ventricle"], 
        a: 2, 
        hint: "البطين 'الأيسر' (Left ventricle) لديه 'أسمك' جدار عضلي لأنه يضخ الدم لكل الجسم.",
        explanation: "تكرار للسؤال: البطين الأيسر هو الأسمك."
      },
      { 
        q: "Which tissue is supplied with blood via the coronary arteries?", 
        type: "mcq", 
        options: ["the lungs", "the myocardium", "the corona", "the aorta"], 
        a: 1, 
        hint: "الشرايين 'التاجية' (Coronary) تغذي 'عضلة القلب' (Myocardium) نفسها.",
        explanation: "الشرايين التاجية تغذي عضلة القلب (Myocardium) بالأكسجين والغذاء."
      }
    ]
  },
  physio_cvs_2: {
    title: "CVS - Part 2",
    questions: [
      { 
        q: "What is the innermost layer of the heart wall known as?", 
        type: "mcq", 
        options: ["epicardium", "pericardium", "visceral pericardium", "endocardium"], 
        a: 3, 
        hint: "'Endo' تعني 'داخلي' (Innermost). 'Epi' تعني 'خارجي'.",
        explanation: "شغاف القلب (Endocardium) هو الطبقة الملساء المبطنة للقلب من الداخل."
      },
      { 
        q: "Which of the following is a difference between cardiac muscle and skeletal muscle?", 
        type: "mcq", 
        options: ["cardiac muscle is not striated", "cardiac muscle fibres are branched", "skeletal muscle is involuntary", "skeletal muscle has intercalated discs"], 
        a: 1, 
        hint: "خلايا العضلة القلبية (Cardiac) تكون 'متفرعة' (Branched)، بينما العضلات الهيكلية (Skeletal) تكون أليافًا مستقيمة.",
        explanation: "خلايا القلب متفرعة وتتصل ببعضها كشبكة، عكس العضلات الهيكلية المتوازية."
      },
      { 
        q: "Where is the mitral valve of the heart located? Between the", 
        type: "mcq", 
        options: ["left atrium and left ventricle", "left ventricle and the aorta", "right ventricle and the pulmonary trunk", "right atrium and right ventricle"], 
        a: 0, 
        hint: "سؤال مكرر، الصمام 'الميترالي' (Mitral) يقع في الجانب 'الأيسر' (Left).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Choose the structure known as the pacemaker of the heart from the following.", 
        type: "mcq", 
        options: ["atrio-ventricular node", "sino-atrial node", "atrio-ventricular bundle", "the bundle of His"], 
        a: 1, 
        hint: "منظم ضربات القلب (Pacemaker) الطبيعي هو 'العقدة الجيبية الأذينية' (Sino-atrial node - SA node).",
        explanation: "SA node هي التي تبدأ الإشارة الكهربائية وتحدد سرعة القلب."
      },
      { 
        q: "Where is the aortic valve located?", 
        type: "mcq", 
        options: ["between the right atrium and right ventricle", "between the right ventricle and the pulmonary trunk", "between the left ventricle and the aorta", "between the left atrium and left ventricle"], 
        a: 2, 
        hint: "الصمام 'الأورطي' (Aortic) يقع بين 'البطين الأيسر' (Left ventricle) و'الأورطى' (Aorta).",
        explanation: "الصمام الأورطي يمنع رجوع الدم من الأورطى للبطين الأيسر."
      },
      { 
        q: "By what name is the heart muscle known?", 
        type: "mcq", 
        options: ["epicardium", "myocardium", "pericardium", "endocardium"], 
        a: 1, 
        hint: "'Myo' هي بادئة تعني 'عضلة' (Muscle). 'Cardium' تعني 'قلب'.",
        explanation: "Myocardium هو الاسم العلمي لعضلة القلب."
      },
      { 
        q: "The heart receives its own oxygenated blood supply via the", 
        type: "mcq", 
        options: ["coronary arteries", "the pulmonary veins", "the coronary sinus", "the foramen ovale"], 
        a: 0, 
        hint: "سؤال مكرر، الشرايين 'التاجية' (Coronary) هي التي تغذي القلب.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which name is NOT applied to the valve between the left ventricle and the left atrium?", 
        type: "mcq", 
        options: ["atrioventricular valve", "semilunar valve", "the bicuspid valve", "the mitral valve"], 
        a: 1, 
        hint: "هذا الصمام (الميترالي) هو (AV valve) و (Bicuspid)، لكنه 'ليس' (NOT) صمامًا 'هلاليًا' (Semilunar).",
        explanation: "الصمامات الهلالية هي الأورطي والرئوي، وليست الصمامات بين الأذين والبطين."
      },
      { 
        q: "Where does the pulmonary trunk deliver its blood to?", 
        type: "mcq", 
        options: ["the left atrium", "the right ventricle", "the lungs", "the left ventricle"], 
        a: 2, 
        hint: "الجذع 'الرئوي' (Pulmonary) يوصل الدم (غير المؤكسج) إلى 'الرئتين' (Lungs).",
        explanation: "الشريان الرئوي ينقل الدم غير المؤكسج للرئتين للتنقية."
      },
      { 
        q: "The heart can be made to beat faster by which of the following?", 
        type: "mcq", 
        options: ["sympathetic stimulation of the SA node", "sympathetic stimulation of the AV node", "parasympathetic stimulation of the SA node", "parasympathetic stimulation of the AV node"], 
        a: 0, 
        hint: "الجهاز 'السمبثاوي' (Sympathetic) 'يسرع' القلب عن طريق تحفيز 'SA node'.",
        explanation: "التحفيز السمبثاوي لـ SA node يزيد معدل إطلاق الإشارات وبالتالي يسرع القلب."
      },
      { 
        q: "What is the outermost layer of the heart wall known as?", 
        type: "mcq", 
        options: ["epicardium", "pericardium", "parietal membrane", "endocardium"], 
        a: 0, 
        hint: "'Epi' تعني 'فوق' أو 'خارجي' (Outermost). وهي نفسها الطبقة الحشوية للتامور.",
        explanation: "Epicardium هي الطبقة الخارجية لجدار القلب."
      },
      { 
        q: "The valve between the atrium and the ventricle that pumps oxygenated blood is called:", 
        type: "mcq", 
        options: ["the right atrioventricular valve", "the semilunar valve", "the mitral valve", "the tricuspid valve"], 
        a: 2, 
        hint: "الدم 'المؤكسج' (Oxygenated) يكون في الجانب 'الأيسر'، والصمام هناك هو 'الميترالي' (Mitral).",
        explanation: "الجانب الأيسر (الميترالي) يتعامل مع الدم المؤكسج."
      },
      { 
        q: "What is the name given to the remnant of the opening in the foetal heart that allowed the foetal lungs to be bypassed?", 
        type: "mcq", 
        options: ["coronary sinus", "foramen ovale", "interatrial septum", "fossa ovalis"], 
        a: 3, 
        hint: "الفتحة (Opening) نفسها تسمى 'Foramen ovale'، أما 'الأثر' (Remnant) المتبقي بعد الولادة يسمى 'Fossa ovalis'.",
        explanation: "Fossa ovalis هي الانخفاض المتبقي بعد انغلاق الثقب البيضاوي (Foramen ovale) بعد الولادة."
      },
      { 
        q: "Complete the sentence correctly. The left ventricle pumps:", 
        type: "mcq", 
        options: ["more blood than the right ventricle", "blood at a lower pressure than the right ventricle", "less blood than the right ventricle", "blood at a higher pressure than the right ventricle"], 
        a: 3, 
        hint: "البطين 'الأيسر' (Left) يضخ الدم 'بضغط أعلى' (Higher pressure) لأنه يضخ لجميع أنحاء الجسم.",
        explanation: "كلا البطينين يضخان نفس حجم الدم، لكن الأيسر يضخ بضغط أعلى بكثير."
      },
      { 
        q: "What is ventricular systole? It", 
        type: "mcq", 
        options: ["refers to contraction of the ventricles", "occurs at the same time as contraction of the atria", "occurs while the bicuspid valve is open", "refers to relaxation of the ventricles"], 
        a: 0, 
        hint: "سؤال مكرر، 'Systole' يعني 'انقباض' (Contraction).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which is correct? In its passage through the heart, blood is pumped into the pulmonary trunk:", 
        type: "mcq", 
        options: ["after leaving the left ventricle", "after leaving the left atrium", "after passing through the right AV valve", "after passing through the left AV valve"], 
        a: 2, 
        hint: "الدم يدخل البطين الأيمن (عبر Right AV valve) ثم يُضخ إلى الـ Pulmonary trunk.",
        explanation: "الدم يمر عبر الصمام ثلاثي الشرفات (Right AV) للبطين الأيمن، ثم يضخ للشريان الرئوي."
      },
      { 
        q: "Cardiac muscle cells differ from skeletal muscle cells in that:", 
        type: "mcq", 
        options: ["skeletal muscle cells are voluntary but cardiac muscle cells are not.", "skeletal muscle cells are branched but cardiac muscle cells are not.", "cardiac muscle cells are multinucleate but skeletal muscle cells are not.", "cardiac muscle cells are a syncytium while skeletal muscle does not."], 
        a: 0, 
        hint: "العضلات 'الهيكلية' (Skeletal) 'إرادية' (Voluntary)، بينما عضلة القلب 'لا إرادية' (Not voluntary).",
        explanation: "الفرق الوظيفي الرئيسي هو أن عضلة القلب لا إرادية، بينما الهيكلية إرادية."
      },
      { 
        q: "Which chamber of the heart has the thickest myocardium?", 
        type: "mcq", 
        options: ["left ventricle", "right ventricle", "left atrium", "right atrium"], 
        a: 0, 
        hint: "سؤال مكرر، 'البطين الأيسر' (Left ventricle) هو الأسمك.",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Why is the myocardium of the left ventricle thicker than that of the right ventricle?", 
        type: "mcq", 
        options: ["The left ventricle has to pump a greater volume of blood", "The resistance of the systemic circulation is greater", "The left ventricle has to pump blood to the brain against gravity.", "The right ventricle is assisted by the “respiratory pump”."], 
        a: 1, 
        hint: "سؤال مكرر، السبب هو 'المقاومة' (Resistance) العالية في 'الدورة الدموية الكبرى' (Systemic circulation).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "What supplies blood to the myocardium?", 
        type: "mcq", 
        options: ["the coronary circulation.", "the vena cavae.", "the vasa recta.", "the pulmonary circulation."], 
        a: 0, 
        hint: "سؤال مكرر، الدورة 'التاجية' (Coronary circulation) هي التي تغذي عضلة القلب.",
        explanation: "تكرار للسؤال."
      }
    ]
  },
  physio_cvs_3: {
    title: "CVS - Part 3",
    questions: [
      { 
        q: "Which of the following heart structures are listed in the correct sequence of blood flow through them?", 
        type: "mcq", 
        options: ["right atrium, bicuspid valve, pulmonary valve, left ventricle.", "tricuspid valve, right ventricle, left atrium, mitral valve.", "pulmonary valve, left atrium, tricuspid valve, left ventricle.", "right ventricle, left atrium, aortic valve, left ventricle."], 
        a: 1, 
        hint: "الترتيب صحيح جزئيًا: الدم يعبر (Tricuspid) إلى (RV)، وفي الجانب الآخر يعبر (Mitral) من (LA).",
        explanation: "التسلسل الصحيح: صمام ثلاثي شرفات -> بطين أيمن -> (رئة) -> أذين أيسر -> صمام ميترالي."
      },
      { 
        q: "The tricuspid valve separates which two structures?", 
        type: "mcq", 
        options: ["right ventricle and pulmonary trunk", "right ventricle and right atrium", "left ventricle and aorta", "left ventricle and left atrium"], 
        a: 1, 
        hint: "سؤال مكرر، الصمام 'ثلاثي الشرفات' (Tricuspid) يقع في الجانب 'الأيمن' (Right).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Which of the following events occur during late ventricular diastole?", 
        type: "mcq", 
        options: ["the atria are relaxed, the ventricles are filling passively", "the ventricles are starting to contract, the AV valves are closed", "the atria contract, the ventricles are relaxed, the AV valves are open", "the atria are relaxed, the ventricles are starting to relax"], 
        a: 2, 
        hint: "في 'نهاية' (Late) الانبساط، 'ينقبض الأذينان' (Atria contract) لضخ آخر كمية دم للبطينين.",
        explanation: "في نهاية الانبساط، ينقبض الأذين لضخ الـ 20% المتبقية من الدم للبطين (Atrial Kick)."
      },
      { 
        q: "In a normal ECG trace, what does a QRS wave indicate?", 
        type: "mcq", 
        options: ["depolarisation of the atria", "repolarisation of the atria", "depolarisation of the ventricles", "repolarisation of the ventricles"], 
        a: 2, 
        hint: "الـ 'QRS complex' يمثل 'انقباض' (Depolarisation) 'البطينين' (Ventricles).",
        explanation: "موجة QRS تمثل النشاط الكهربائي (إزالة الاستقطاب) الذي يسبب انقباض البطينين."
      },
      { 
        q: "What would be a possible consequence of the SA node failing to depolarise?", 
        type: "mcq", 
        options: ["the entire heart would not contract", "the heart rate will decrease", "the ventricles would not contract", "the heart rate will increase"], 
        a: 1, 
        hint: "إذا فشلت الـ SA node (منظم الضربات الأسرع)، ستتولى عقدة أخرى (مثل AV node) المهمة، ولكن 'بمعدل أبطأ' (Decrease).",
        explanation: "إذا تعطلت SA node، تتولى AV node القيادة ولكن بمعدل أبطأ (40-60 نبضة/دقيقة)."
      },
      { 
        q: "By what means does an electrical signal travel from the atria to the ventricles?", 
        type: "mcq", 
        options: ["gap junctions", "Purkinje fibres", "intercalated discs", "atrioventricular bundle"], 
        a: 3, 
        hint: "الإشارة تمر من (AV node) إلى (AV bundle - حزمة هيس) لتصل إلى البطينين.",
        explanation: "حزمة هيس (AV bundle) هي الطريق الكهربائي الوحيد بين الأذين والبطين."
      },
      { 
        q: "Which one of the following descriptions or statements about an electrocardiogram (ECG) is NOT correct?", 
        type: "mcq", 
        options: ["It is a record of the voltage changes", "The potentials measured by the ECG electrodes are combined", "The ECG consists of the electrical events... PQR section... S section... T section", "The value of the potential difference called “limb lead II” varies with time"], 
        a: 2, 
        hint: "هذا الوصف (C) خاطئ تمامًا في تقسيم الموجات ومعانيها.",
        explanation: "أقسام الـ ECG هي موجة P، مركب QRS، وموجة T. لا يوجد شيء اسمه 'قسم S' أو 'قسم PQR'."
      },
      { 
        q: "Which of the following events occur during early ventricular systole?", 
        type: "mcq", 
        options: ["the ventricles are filling passively", "the ventricles are starting to contract, the AV valves are closed, the semilunar valves are closed", "the atria contract, the ventricles are relaxed", "the atria are relaxed, the ventricles are starting to relax"], 
        a: 1, 
        hint: "في 'بداية' (Early) الانقباض، يرتفع الضغط لـ 'إغلاق' صمامات (AV)، ولكنه 'ليس كافيًا بعد' لـ 'فتح' الصمامات الهلالية (Semilunar).",
        explanation: "هذه مرحلة الانقباض متساوي الحجم (Isovolumetric contraction)، حيث تكون كل الصمامات مغلقة والضغط يرتفع."
      },
      { 
        q: "When listening to the “lub-dup” sound of the heart... what is the cause of the “dup” sound?", 
        type: "mcq", 
        options: ["The blood flowing through the open semilunar valves", "The blood flowing through the open atrioventricular valves", "The turbulent blood flow through closing atrioventricular valves", "The turbulent blood flow through closing semilunar valves"], 
        a: 3, 
        hint: "صوت 'Lub' (S1) هو إغلاق صمامات (AV). صوت 'Dup' (S2) هو إغلاق الصمامات 'الهلالية' (Semilunar).",
        explanation: "الصوت الثاني (Dup) ينتج عن إغلاق الصمامات الأورطية والرئوية في بداية الانبساط."
      },
      { 
        q: "What feature distinguishes pacemaker cardiac cells from other myocardial cells?", 
        type: "mcq", 
        options: ["require a stimulus from the vagus nerve", "reach threshold with much weaker stimuli", "have gap junctions, while myocardial cells do not.", "spontaneously generate action potentials, while myocardial cells do not."], 
        a: 3, 
        hint: "خلايا (Pacemaker) (مثل SA node) 'تلقائية' (Spontaneously generate) وتطلق إشاراتها بنفسها.",
        explanation: "خلايا منظم الضربات تتميز بـ 'الذاتية' (Automaticity)، أي توليد الكهرباء دون محفز خارجي."
      },
      { 
        q: "What structure in the heart prevents backflow of blood into the right atrium?", 
        type: "mcq", 
        options: ["The tricuspid valve", "The bicuspid valve", "The mitral valve.", "The foramen ovale"], 
        a: 0, 
        hint: "سؤال مكرر، 'الصمام ثلاثي الشرفات' (Tricuspid) يمنع عودة الدم إلى 'الأذين الأيمن' (Right atrium).",
        explanation: "تكرار للسؤال."
      },
      { 
        q: "Why does the lumen of a large vein have a larger diameter than the lumen of a large artery?", 
        type: "mcq", 
        options: ["They need to withstand higher pressure", "Veins contain the majority of the blood volume.", "This allows blood to return to the heart rapidly.", "So that vasoconstriction can produce a greater change"], 
        a: 1, 
        hint: "الأوردة (Veins) تعمل 'كمخزن' (Reservoir) وتستوعب 'غالبية حجم الدم' (Majority of blood volume).",
        explanation: "الأوردة هي أوعية سعة (Capacitance vessels) وتحتوي على حوالي 65% من دم الجسم، لذا تحتاج لتجويف واسع."
      },
      { 
        q: "What causes venous blood to return to the heart?", 
        type: "mcq", 
        options: ["The pumping action of the heart.", "The squashing action of muscles, and valves in the veins.", "Rhythmic vasoconstriction and valves in the veins.", "Gravity, valves and the negative pressure generated by the atria"], 
        a: 1, 
        hint: "عودة الدم الوريدي تعتمد على 'انقباض العضلات' (Muscle pump) ووجود 'الصمامات' (Valves).",
        explanation: "المضخة العضلية الهيكلية (Skeletal muscle pump) والصمامات الوريدية هما الآلية الرئيسية لرفع الدم ضد الجاذبية."
      },
      { 
        q: "When cardiac ejection ceases during diastole, what is the most important factor maintaining blood flow in arteries...?", 
        type: "mcq", 
        options: ["Contraction of skeletal muscle", "Closing the venous valves", "Elastic recoil of the arteries close to heart", "Contraction of the atria"], 
        a: 2, 
        hint: "الشرايين الكبرى 'مرنة' (Elastic)، تتمدد ثم 'تنكمش' (Recoil) لتدفع الدم للأمام أثناء الانبساط.",
        explanation: "الارتداد المرن (Elastic Recoil) للشريان الأورطي يدفع الدم للأمام حتى والقلب في حالة راحة."
      },
      { 
        q: "Which of the following does NOT assist in returning the blood to the heart through the veins?", 
        type: "mcq", 
        options: ["valves in the veins", "the “respiratory pump”", "the effect of gravity", "the pumping action of the heart"], 
        a: 3, 
        hint: "قوة 'ضخ القلب' (Pumping action) تتبدد في الشعيرات الدموية، ولا تساهم في 'عودة' الدم الوريدي.",
        explanation: "قوة ضخ القلب تنتهي تقريباً عند الشعيرات الدموية ولا تكفي لدفع الدم في الأوردة."
      },
      { 
        q: "Which of the following materials is found in the walls of capillaries?", 
        type: "mcq", 
        options: ["endothelium", "elastic fibres", "collagen fibres", "smooth muscle"], 
        a: 0, 
        hint: "جدار الشعيرات (Capillaries) 'رقيق جدًا'، يتكون فقط من طبقة واحدة من الخلايا (Endothelium).",
        explanation: "الشعيرات الدموية تتكون فقط من طبقة بطانة (Endothelium) لتسهيل تبادل الغازات والمواد."
      },
      { 
        q: "What is the pulse we feel in the anterior lateral wrist... (the normal wrist pulse) called?", 
        type: "mcq", 
        options: ["Radial pulse", "Ulnar pulse", "Dorsalis pedis pulse", "Brachial pulse"], 
        a: 0, 
        hint: "هذا هو 'النبض الكعبري' (Radial pulse) الذي نقيسه عند الرسغ.",
        explanation: "النبض المحسوس عند قاعدة الإبهام في الرسغ هو نبض الشريان الكعبري (Radial artery)."
      },
      { 
        q: "How do arteries differ from veins?", 
        type: "mcq", 
        options: ["arteries have a larger diameter than veins.", "arteries have more elastic tissue than veins.", "there is a greater volume of blood in the arteries than in the veins.", "arteries have valves but veins do not."], 
        a: 1, 
        hint: "الشرايين (Arteries) لديها جدران 'أسمك' تحتوي على 'أنسجة مرنة' (Elastic tissue) أكثر لتحمل الضغط.",
        explanation: "الشرايين تحتاج لطبقة مرنة سميكة لتحمل ضغط الدم العالي الخارج من القلب."
      },
      { 
        q: "Which of the following parts of the cardiovascular system contain the greatest volume of blood?", 
        type: "mcq", 
        options: ["heart", "systemic arteries", "pulmonary circulation", "systemic veins"], 
        a: 3, 
        hint: "سؤال مكرر، الأوردة (Veins) تعمل 'كمخزن' وتحتوي على 'أكبر حجم' من الدم.",
        explanation: "تكرار للسؤال: الأوردة الجهازية تحتوي على معظم الدم."
      },
      { 
        q: "Which of the following describes an artery? An artery is a blood vessel that", 
        type: "mcq", 
        options: ["has a thinner wall than a vein", "carries blood away from the heart", "when located in the limbs, has valves", "carries oxygenated blood"], 
        a: 1, 
        hint: "التعريف الأساسي لـ 'الشريان' (Artery) هو أنه ينقل الدم 'بعيدًا عن' (Away from) القلب.",
        explanation: "التعريف العلمي للشريان هو الوعاء الذي ينقل الدم بعيداً عن القلب، بغض النظر عما إذا كان مؤكسجاً أم لا (مثل الشريان الرئوي)."
      }
    ]
  }
};
console.log("Physiology file loaded successfully");
