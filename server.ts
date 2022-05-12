import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Route for Smart Sensei
app.post("/api/sensei", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "الرجاء إدخال نص صحيح للتحليل" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback mock logic if GEMINI_API_KEY is missing
      const fallbackResponse = generateFallbackSenseiResponse(message);
      res.json({ data: fallbackResponse, note: "افتراضي" });
      return;
    }

    const systemPrompt = `أنت "السينسي شيرونينجا" (Sensei Sheroninja) - معلم خبير متخصص في تفكيك أفكار المتحدثين بالعربية وتحويلها إلى إنجليزية بريطانية أصيلة وذكية.
مهمتك ليست مجرد الترجمة الحرفية! بل شرح الدلالات الثقافية والتعبيرات البريطانية الحديثة (British Slang & Natural Idioms) باللغة العربية بأسلوب مشوق ومحفز للنينجا.

قواعد الاستجابة المطلوبة:
1. الشرح الكامل والتغذية الراجعة باللغة العربية دائماً (عدا الأمثلة والعبارات بالإنجليزية).
2. قدم ترجمة رئيسية بريطانية فصيحة وأصيلة (British English) وليست أمريكية.
3. اشرح للتعلم باللغة العربية سبب اختيار هذا اللفظ المحدد ولماذا هو أقوى أو أكثر لياقة بريطانية (مثال: "عشان تبان كأنك بريطاني أصلي، استخدم كلمة Smitten بدل Love لأنها أعمق...").
4. وفر 2 إلى 3 تعبيرات بديلة (عامية بريطانية طازجة، تعبير رسمي راقي، تعبير عصري في لندن).
5. إذا كانت الجملة تحتوى على قاعدة نحوية دقيقة، أرفق كائن grammarRule يتضمن شرح القاعدة وتنبيه نينجا.
6. استخرج من الجملة 1 إلى 3 مفردات أو عبارات هامة وضمنها في قائمة vocabularyToSave لإضافتها لخزنة الذاكرة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `فكك الفكرة العربية التالية وحولها لإنجليزية بريطانية مع الشرح بالترتيب المطلوب:\n"${message}"`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicOriginal: { type: Type.STRING, description: "الفكرة الأصلية باللغة العربية" },
            britishMainTranslation: { type: Type.STRING, description: "الترجمة البريطانية الأنسب والرئيسية" },
            mainPhonetic: { type: Type.STRING, description: "النطق الصوتي التقريبي مثلاً /'smɪt.ən/" },
            arabicExplanation: { type: Type.STRING, description: "شرح معمق باللغة العربية لسبب اختيار هذه الألفاظ بالذات" },
            britishNuance: { type: Type.STRING, description: "ملاحظة حول الثقافة والسياق البريطاني" },
            alternativeExpressions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  arabicType: { type: Type.STRING, description: "عامية بريطانية أو رسمية وأنيقة أو تعبير عصري" },
                  noteArabic: { type: Type.STRING, description: "شرح مختصر لاستخدام هذا البديل" }
                },
                required: ["english", "arabicType", "noteArabic"]
              }
            },
            grammarRule: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "عنوان القاعدة النحوية باللغة العربية" },
                explanationArabic: { type: Type.STRING, description: "شرح القاعدة باختصار وسلاسة" },
                formula: { type: Type.STRING, description: "معادلة القاعدة إن وجدت" },
                correctExample: { type: Type.STRING, description: "مثال صحيح" },
                wrongExample: { type: Type.STRING, description: "خطأ شائع لتجنبه" },
                ninjaTip: { type: Type.STRING, description: "نصيحة نينجا سريعة لتذكر القاعدة" }
              },
              required: ["title", "explanationArabic", "correctExample", "ninjaTip"]
            },
            vocabularyToSave: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  arabicMeaning: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  category: { type: Type.STRING, description: "slang, idiom, formal, daily, grammar" },
                  contextExplanationArabic: { type: Type.STRING },
                  exampleSentence: { type: Type.STRING },
                  exampleTranslationArabic: { type: Type.STRING }
                },
                required: ["english", "arabicMeaning", "phonetic", "category", "contextExplanationArabic", "exampleSentence", "exampleTranslationArabic"]
              }
            },
            ninjaLevelTip: { type: Type.STRING, description: "حكمة أو نصيحة احترافية من السينسي" }
          },
          required: ["arabicOriginal", "britishMainTranslation", "mainPhonetic", "arabicExplanation", "britishNuance", "alternativeExpressions", "vocabularyToSave", "ninjaLevelTip"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(jsonText);

    res.json({ data: parsedData });
  } catch (error) {
    console.error("Error in /api/sensei:", error);
    // Return friendly error + fallback so the user always receives valid feedback
    const message = req.body?.message || "";
    const fallbackResponse = generateFallbackSenseiResponse(message);
    res.json({ data: fallbackResponse, note: "fallback_error" });
  }
});

// Fallback response generator if API fails or offline
function generateFallbackSenseiResponse(message: string) {
  const isLove = message.includes("حب") || message.includes("بنت") || message.includes("أحب");
  const isApology = message.includes("اعتذر") || message.includes("أسف") || message.includes("سامحني");
  
  if (isLove) {
    return {
      arabicOriginal: message,
      britishMainTranslation: "I am completely smitten with her.",
      mainPhonetic: "/aɪ æm kəmˈpliːt.li ˈsmɪt.ən wɪð hɜː/",
      arabicExplanation: "عشان تبان كأنك بريطاني أصلي ومثقف، استخدم كلمة Smitten بدل Love العادية؛ لأنها تصف الشعور بالافتتان والشغف بأسلوب بريطاني راقٍ ودافئ جداً في هذا السياق.",
      britishNuance: "في المجتمع البريطاني، يُعتبر تعبير 'Smitten' أكثر دقة ورقة للتعبير عن الإعجاب العميق من كلمة 'In love' التي قد تبدو مباشرة جداً في البداية.",
      alternativeExpressions: [
        { english: "I'm head over heels for her.", arabicType: "تعبير عصري", noteArabic: "تعبير متداول وشائع جداً بين الشباب في لندن" },
        { english: "She's stolen my heart, mate.", arabicType: "عامية بريطانية", noteArabic: "أسلوب ودي غير رسمي بين الأصدقاء في المقهى" },
        { english: "I hold her in high regard.", arabicType: "رسمية وأنيقة", noteArabic: "أسلوب راقٍ ومحترم جداً في المناسبات الرسمية" }
      ],
      grammarRule: {
        title: "استخدام الصفة المعقدة Smitten مع حرف الجر With",
        explanationArabic: "عند التعبير عن الشغف بشخص، تأتي صفة Smitten متبوعة دائماً بحرف الجر 'with' وليس 'by' أو 'in'.",
        formula: "Subject + be verb + smitten + with + person",
        correctExample: "He is smitten with her elegance.",
        wrongExample: "He is smitten by her. (أقل دقة في الفصاحة البريطانية)",
        ninjaTip: "تذكر دائماً: Smitten + With = افتتان حقيقي بلا أخطاء!"
      },
      vocabularyToSave: [
        {
          english: "Smitten",
          arabicMeaning: "مفتون / مأخوذ بحب شخص",
          phonetic: "/ˈsmɪt.ən/",
          category: "idiom",
          contextExplanationArabic: "تعبير بريطاني ذكي يعبر عن الوقوع في الحب والافتتان بشكل رقيق",
          exampleSentence: "He was completely smitten from the first moment.",
          exampleTranslationArabic: "كان مفتوناً بها كلياً منذ اللحظة الأولى."
        },
        {
          english: "Head over heels",
          arabicMeaning: "مغرم حتى أذنيه",
          phonetic: "/hɛd ˈoʊ.vər hiːlz/",
          category: "slang",
          contextExplanationArabic: "اصطلاح بريطاني شهير يصف شدة الإعجاب والحماس",
          exampleSentence: "They are head over heels in love.",
          exampleTranslationArabic: "هما مغرمان ببعضهما حتى النخاع."
        }
      ],
      ninjaLevelTip: "ضربة نينجا: التعبير البريطاني الصادق يكمن في اختيار المفردات ذات البعد العاطفي الرفيع بدلاً من الكلمات العامة!"
    };
  }

  if (isApology) {
    return {
      arabicOriginal: message,
      britishMainTranslation: "I offers my sincerest apologies for any inconvenience caused.",
      mainPhonetic: "/aɪ ˈɒf.əz maɪ sɪnˈsɪə.rɪst əˈpɒl.ə.dʒiz/",
      arabicExplanation: "في الثقافة البريطانية، الاعتذار يعتبر فن قائم بذاته! استخدام كلمة 'inconvenience' يعكس أسلوب الأدب البريطاني الرفيع (Polite Understatement).",
      britishNuance: "البريطانيون يعشقون اللباقة الدبلوماسية المباشرة مع الحفاظ على الاحترام العالي في بيئات العمل.",
      alternativeExpressions: [
        { english: "My apologies, I didn't mean to ruffle any feathers.", arabicType: "عامية بريطانية", noteArabic: "تعبير معناه لم أكن أقصد إزعاج أحد" },
        { english: "I deeply regret the oversight.", arabicType: "رسمية وأنيقة", noteArabic: "اعتذار رسمي راقٍ لمدير العمل أو العملاء" }
      ],
      grammarRule: {
        title: "الاعتذار باستخدام الأسماء بدلاً من الأفعال",
        explanationArabic: "تحويل الفعل Apologise إلى الاسم Apologies يمنح جملتك طابعاً رسمياً ورزيناً في الإنجليزية البريطانية.",
        correctExample: "Please accept my apologies.",
        wrongExample: "I am apologising you. (صياغة غير دقيقة)",
        ninjaTip: "استخدم الأسماء مع الصفات العالية مثل Sincerest لتجعل اعتذارك مقبولاً فوراً!"
      },
      vocabularyToSave: [
        {
          english: "Sincerest apologies",
          arabicMeaning: "أخلص الاعتذارات",
          phonetic: "/sɪnˈsɪə.rɪst əˈpɒl.ə.dʒiz/",
          category: "formal",
          contextExplanationArabic: "عبارة رسمية جداً تُستخدم في المكاتب والمراسلات الرسمية",
          exampleSentence: "Please accept my sincerest apologies.",
          exampleTranslationArabic: "تفضل بقبول أخلص اعتذاراتي."
        }
      ],
      ninjaLevelTip: "اللباقة البريطانية هي سلاح النينجا القاطع في اللقاءات الرسمية!"
    };
  }

  // Generic fallback for any other phrase
  return {
    arabicOriginal: message,
    britishMainTranslation: `I must say, "${message.slice(0, 30)}..." sounds like a proper brilliant thought!`,
    mainPhonetic: "/aɪ mʌst seɪ.../",
    arabicExplanation: `للتعبير عن هذا المفهوم بأسلوب بريطاني طبيعي وأصيل، نستخدم عبارات توازن بين اللباقة الإنجليزية والحماس الودود. الكلمات مثل "Proper" و"Brilliant" هي مفاتيح اللهجة اللندنية الفصيحة!`,
    britishNuance: "كلمة 'Proper' تُستخدم في بريطانيا قبل الصفات للتوكيد (بمعنى: بحق / تماماً / بشكل ممتاز).",
    alternativeExpressions: [
      { english: "That's absolute quality, mate!", arabicType: "عامية بريطانية", noteArabic: "تعبير بريطاني يومي يُقال للتعبير عن الإعجاب الشديد" },
      { english: "I am rather keen on this perspective.", arabicType: "رسمية وأنيقة", noteArabic: "طريقة راقية جداً لإظهار الاهتمام بالموضوع" }
    ],
    grammarRule: {
        title: "استخدام الصفات التوكيدية في الإنجليزية البريطانية",
        explanationArabic: "البريطانيون يفضلون استخدام كلمات مثل Quite, Rather, Proper للتعديل على قوة الصفة بأسلوب ذكي.",
        correctExample: "It is rather cold today.",
        wrongExample: "It is very much cold. (صياغة غير طبيعية)",
        ninjaTip: "اضف Rather قبل الصفة لتبدو بريطاني أسطوري!"
    },
    vocabularyToSave: [
      {
        english: "Proper brilliant",
        arabicMeaning: "رائع بحق / ممتازة جداً",
        phonetic: "/ˈprɒp.ər ˈbrɪl.jənt/",
        category: "slang",
        contextExplanationArabic: "تعبير لندني شائع جداً في الحياة اليومية للتعبير عن الجودة العالية",
        exampleSentence: "That was a proper brilliant performance!",
        exampleTranslationArabic: "كان ذلك أداءً رائعاً بحق!"
      }
    ],
    ninjaLevelTip: "السر في نطق اللغة البريطانية هو التحكم بالرتم والتعبير بثقة نينجا!"
  };
}

// Start Server with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sheroninja Ninja Dojo running on http://localhost:${PORT}`);
  });
}

startServer();
