import { WordItem, ChallengeScenario } from "../types";

export const initialWords: WordItem[] = [
  {
    id: "w-1",
    english: "Smitten",
    arabicMeaning: "مفتون / مغرم جداً",
    phonetic: "/ˈsmɪt.ən/",
    category: "idiom",
    contextExplanationArabic: "تعبير بريطاني راقٍ للوقوع في الحب والافتتان بالشخص بأسلوب أعمق من كلمة Love المباشرة.",
    exampleSentence: "I am completely smitten with her elegance.",
    exampleTranslationArabic: "أنا مفتون كلياً برقتها ورقيها.",
    masteryLevel: 75,
    stageLabel: "نينجا محترف",
    timesPracticed: 6,
    isFavorite: true,
  },
  {
    id: "w-2",
    english: "Gutted",
    arabicMeaning: "محبط ومقهور جداً",
    phonetic: "/ˈɡʌt.ɪd/",
    category: "slang",
    contextExplanationArabic: "كلمة عامية بريطانية شائعة جداً للتعبير عن الحزن والخيبة جراء خسارة فريقك أو إلغاء موعد.",
    exampleSentence: "I was absolutely gutted when Arsenal lost the match.",
    exampleTranslationArabic: "كنت محبطاً للغاية عندما خسر آرسنال المباراة.",
    masteryLevel: 90,
    stageLabel: "سيد النينجا",
    timesPracticed: 10,
    isFavorite: true,
  },
  {
    id: "w-3",
    english: "Knackered",
    arabicMeaning: "مرهق تماماً / مهدود الحيل",
    phonetic: "/ˈnæk.əd/",
    category: "slang",
    contextExplanationArabic: "تعبير بريطاني أصيل للتعبير عن التعب الشديد بعد يوم عمل طويل بدلاً من كلمة Tired العادية.",
    exampleSentence: "After a long shift at work, I am proper knackered.",
    exampleTranslationArabic: "بعد نوبة عمل طويلة، أنا مرهق ومجهد بحق.",
    masteryLevel: 45,
    stageLabel: "نينجا صاعد",
    timesPracticed: 3,
    isFavorite: false,
  },
  {
    id: "w-4",
    english: "Chuffed",
    arabicMeaning: "مبتهج ومسرور للغاية",
    phonetic: "/tʃʌft/",
    category: "slang",
    contextExplanationArabic: "تعبير بريطاني شهير يعني الشعور بالفخر والسعادة بإنجاز ما.",
    exampleSentence: "I was proper chuffed with my test results!",
    exampleTranslationArabic: "كنت مسروراً ومبتهجاً جداً بدرجات اختباري!",
    masteryLevel: 60,
    stageLabel: "نينجا محترف",
    timesPracticed: 4,
    isFavorite: true,
  },
  {
    id: "w-5",
    english: "Proper brilliant",
    arabicMeaning: "رائع ومبهر بامتياز",
    phonetic: "/ˈprɒp.ər ˈbrɪl.jənt/",
    category: "daily",
    contextExplanationArabic: "الدمج بين Proper و Brilliant يُعتبر من التواقيع اللفظية لأهل لندن.",
    exampleSentence: "That meal was proper brilliant, cheers mate!",
    exampleTranslationArabic: "تلك الوجبة كانت رائعة بامتياز، شكراً يا صديقي!",
    masteryLevel: 80,
    stageLabel: "نينجا محترف",
    timesPracticed: 7,
    isFavorite: false,
  },
  {
    id: "w-6",
    english: "Sincerest apologies",
    arabicMeaning: "أخلص الاعتذارات وأعمقها",
    phonetic: "/sɪnˈsɪə.rɪst əˈpɒl.ə.dʒiz/",
    category: "formal",
    contextExplanationArabic: "صياغة رسمية عالية الرقي واللباقة تُستخدم في خطابات العمل واللقاءات الرسمية.",
    exampleSentence: "Please accept my sincerest apologies for the delay.",
    exampleTranslationArabic: "تفضل بقبول أخلص اعتذاراتي على هذا التأخير.",
    masteryLevel: 30,
    stageLabel: "مبتدئ",
    timesPracticed: 1,
    isFavorite: false,
  }
];

export const initialScenarios: ChallengeScenario[] = [
  {
    id: "sc-1",
    titleArabic: "ميدان المقهى اللندني",
    titleEnglish: "London Soho Cafe Challenge",
    descriptionArabic: "اختبر قدرتك على طلب القهوة والتعامل مع البارستا بأسلوب لندني عصري وراقي دون التلعثم!",
    difficulty: "سهل",
    badge: "☕",
    xpReward: 150,
    questions: [
      {
        id: "q-1-1",
        situationArabic: "دخلت مقهى في شارع أوكسفورد وتبي تطلب قهوة فلات وايت بأسلوب مؤدب وطبيعي جداً كأنك ساكن في لندن.",
        questionArabic: "ما هي الجملة البريطانية الأنسب والأكثر لباقة؟",
        hintArabic: "البريطانيون يفضلون صيغة 'Can I grab...' بدلاً من الأوامر المباشرة.",
        options: [
          {
            id: "opt-1",
            textEnglish: "Can I grab a flat white, please?",
            explanationArabic: "إجابة نينجا مثالية! صيغة 'Can I grab... please' هي الأكثر انتشاراً ولباقة في المقاهي البريطانية اليوم.",
            isCorrect: true
          },
          {
            id: "opt-2",
            textEnglish: "Give me one flat white now.",
            explanationArabic: "صيغة جافة ومباشرة جداً قد تبدو غير لبيقة في الثقافة البريطانية.",
            isCorrect: false
          },
          {
            id: "opt-3",
            textEnglish: "I want a coffee immediately.",
            explanationArabic: "صياغة حادة تفتقر إلى أدبيات اللباقة البريطانية.",
            isCorrect: false
          }
        ],
        targetWord: "Flat white",
        grammarModal: {
          title: "الطلب بأسلوب Can I grab...",
          explanationArabic: "في الإنجليزية البريطانية الحديثة، استخدام الفعل 'grab' مع 'Can I' يضفي انطباعاً ودوداً وغير متكلف.",
          correctExample: "Can I grab an espresso, please?",
          wrongExample: "Give me an espresso. (صياغة آمرة)",
          ninjaTip: "لا تنس إضافة please دائماً في نهاية أي طلب لندني!"
        }
      },
      {
        id: "q-1-2",
        situationArabic: "البارستا سلمك القهوة، وتبغى تشكره بأسلوب عامي لندني لطيف.",
        questionArabic: "ما هي الكلمة البريطانية الشائعة للشكر بين الأصدقاء وفي المحلات؟",
        hintArabic: "كلمة من 6 حروف تعني أيضاً 'في صحتك' عند الشرب.",
        options: [
          {
            id: "opt-1",
            textEnglish: "Cheers, mate!",
            explanationArabic: "إحراز أسطوري! 'Cheers, mate' هي كلمة الشكر البريطانية الأكثر شعبية على الإطلاق في الشارع والأنفاق والمقاهي.",
            isCorrect: true
          },
          {
            id: "opt-2",
            textEnglish: "Thank you extremely much sir.",
            explanationArabic: "صيغة رسمية زيادة عن اللزوم لموقف يومي بسيط في مقهى.",
            isCorrect: false
          },
          {
            id: "opt-3",
            textEnglish: "I appreciate your service deeply.",
            explanationArabic: "تعبير متكلف لا يُستخدم عادة مع البارستا.",
            isCorrect: false
          }
        ],
        targetWord: "Cheers"
      }
    ]
  },
  {
    id: "sc-2",
    titleArabic: "ميدان الإعجاب والرومانسية",
    titleEnglish: "The Romance & Admiration Dojo",
    descriptionArabic: "تفكيك مشاعرك باللغة العربية وتحويلها إلى كلمات بريطانية دافئة وسحرية!",
    difficulty: "متوسط",
    badge: "💖",
    xpReward: 250,
    questions: [
      {
        id: "q-2-1",
        situationArabic: "تبغى تعبر لصديقك عن مدى إعجابك الكبير بشخصية البنت اللي قابلتها اليوم.",
        questionArabic: "أي التعبيرات التالية يعطي معنى 'مفتون ومأخوذ بها كلياً' بأسلوب بريطاني راقٍ؟",
        hintArabic: "تذكر كلمة Smitten التي شرحها لك السينسي!",
        options: [
          {
            id: "opt-1",
            textEnglish: "I am completely smitten with her.",
            explanationArabic: "ضربة قاطعة! Smitten يعكس افتتاناً رقيقاً وعميقاً بأسلوب بريطاني أصيل.",
            isCorrect: true
          },
          {
            id: "opt-2",
            textEnglish: "I like her a little bit.",
            explanationArabic: "تعبير ضعيف لا يعكس شدة الإعجاب أو الافتتان.",
            isCorrect: false
          },
          {
            id: "opt-3",
            textEnglish: "She is a normal girl for me.",
            explanationArabic: "تعبير حيادي لا يصف حالة الشغف إطلاقاً.",
            isCorrect: false
          }
        ],
        targetWord: "Smitten",
        grammarModal: {
          title: "حرف الجر المصاحب لـ Smitten",
          explanationArabic: "صفة Smitten ترتبط دائماً بحرف الجر 'with' لربط المشاعر بالشخص.",
          correctExample: "He is smitten with her quick wit.",
          wrongExample: "He is smitten on her. (خطأ شائع)",
          ninjaTip: "ركز دائماً على المزاوجة بين Smitten و With!"
        }
      }
    ]
  },
  {
    id: "sc-3",
    titleArabic: "ميدان اعتذارات المكاتب الدبلوماسية",
    titleEnglish: "Corporate Diplomacy Dojo",
    descriptionArabic: "مواقف العمل الحساسة مع المدراء والعملاء البريطانيين لتقديم اعتذار دبلوماسي رفيع.",
    difficulty: "صعب",
    badge: "💼",
    xpReward: 350,
    questions: [
      {
        id: "q-3-1",
        situationArabic: "تأخرت في إرسال التقرير لمديرك البريطاني، وتبغى تعتذر بأسلوب راقٍ يمنع أي غضب.",
        questionArabic: "ما هي الصياغة الأكثر احترافية ودبلوماسية؟",
        hintArabic: "استخدم تركيب Sincerest apologies...",
        options: [
          {
            id: "opt-1",
            textEnglish: "Please accept my sincerest apologies for the delay.",
            explanationArabic: "ممتاز جداً! هذا التعبير يُظهر احتراماً عالياً واحترافية متناهية في بيئة العمل اللندنية.",
            isCorrect: true
          },
          {
            id: "opt-2",
            textEnglish: "Sorry I am late bro.",
            explanationArabic: "صياغة كاجوال وغير لبيقة إطلاقاً للمدير في العمل.",
            isCorrect: false
          },
          {
            id: "opt-3",
            textEnglish: "It's not my fault the computer crashed.",
            explanationArabic: "إلقاء اللوم على الأجهزة يُضعف صورتك المهنية.",
            isCorrect: false
          }
        ],
        targetWord: "Sincerest apologies"
      }
    ]
  }
];
