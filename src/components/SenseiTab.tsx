import React, { useState } from 'react';
import { ChatMessage, SenseiResponse, VoiceSettings, WordItem, GrammarRule } from '../types';
import { speakText, playSwordSlashSFX } from '../utils/audio';
import { Send, Volume2, PlusCircle, Check, BookOpen, Sparkles, AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SenseiTabProps {
  voiceSettings: VoiceSettings;
  onSaveWordsToVault: (words: WordItem[]) => void;
  onOpenGrammarModal: (rule: GrammarRule) => void;
  savedWordIds: string[];
}

export const SenseiTab: React.FC<SenseiTabProps> = ({
  voiceSettings,
  onSaveWordsToVault,
  onOpenGrammarModal,
  savedWordIds,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'sensei',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      data: {
        arabicOriginal: 'مرحباً بك في دوجو السينسي شيرونينجا!',
        britishMainTranslation: 'Welcome to the Ninja Dojo, mate!',
        mainPhonetic: "/ˈwel.kəm tuː ðə ˈnɪn.dʒə ˈdəʊ.dʒəʊ, meɪt/",
        arabicExplanation: "أنا السينسي الخاص بك. اكتب أي فكرة تدور في ذهنك باللغة العربية (سواء كانت عامية، مشاعر، أو مواقف يومية)، وسأقوم بتفكيكها وتحويلها إلى تعابير بريطانية أصيلة وحية مع الشرح الكامل باللغة العربية!",
        britishNuance: "في لندن وباقي المدن البريطانية، التعبير عن النفس يعتمد على اختيار الألفاظ ذات اللباقة والدقة الشديدة.",
        alternativeExpressions: [
          { english: "Right then, let's get down to business!", arabicType: "تعبير عصري", noteArabic: "عبارة حماسية بريطانية للبدء في التمارين" },
          { english: "Splendid to have you here, old chap.", arabicType: "رسمية وأنيقة", noteArabic: "أسلوب بريطاني كلاسيكي ترحيبي راقٍ" }
        ],
        vocabularyToSave: [
          {
            english: "Smitten",
            arabicMeaning: "مفتون / مغرم جداً",
            phonetic: "/ˈsmɪt.ən/",
            category: "idiom",
            contextExplanationArabic: "كلمة بريطانية ممتازة للوقوع في الحب والافتتان بالشخص بدلاً من كلمة Love المباشرة.",
            exampleSentence: "I am completely smitten with her.",
            exampleTranslationArabic: "أنا مفتون كلياً برقتها ورقيها."
          }
        ],
        ninjaLevelTip: "جرب الآن كتابة: 'ياخي أنا أحب البنت...' أو 'كيف أطلب قهوة مؤدبة؟' لترى سحر التفكيك!"
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedWordMap, setAddedWordMap] = useState<Record<string, boolean>>({});

  // Quick Starter Prompts
  const quickPrompts = [
    "ياخي أنا أحب البنت...",
    "أبغا اعتذر من مدير العمل بشكل راقي",
    "كيف أطلب قهوة فلات وايت بأسلوب مؤدب؟",
    "أنا زعلان من صديقي بس ما أبغى أجرحه",
    "تعبان ومستنزف طاقتك اليوم؟"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    const senseiMsgId = `sn-loading-${Date.now()}`;
    const loadingMsg: ChatMessage = {
      id: senseiMsgId,
      sender: 'sensei',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/sensei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const resData = await response.json();

      if (resData.data) {
        const senseiData: SenseiResponse = resData.data;

        // Auto speak if enabled
        if (voiceSettings.autoSpeak) {
          speakText(senseiData.britishMainTranslation, voiceSettings);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === senseiMsgId
              ? {
                  ...msg,
                  isLoading: false,
                  data: senseiData,
                }
              : msg
          )
        );
      } else {
        throw new Error('لم يتم استلام رد صحيح');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === senseiMsgId
            ? {
                ...msg,
                isLoading: false,
                error: 'حدث تعذر بسيط في الاتصال بدوجو النينجا. حاول مرة أخرى!',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWord = (wordObj: SenseiResponse['vocabularyToSave'][0]) => {
    const newWord: WordItem = {
      id: `w-saved-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      english: wordObj.english,
      arabicMeaning: wordObj.arabicMeaning,
      phonetic: wordObj.phonetic,
      category: wordObj.category || 'daily',
      contextExplanationArabic: wordObj.contextExplanationArabic,
      exampleSentence: wordObj.exampleSentence,
      exampleTranslationArabic: wordObj.exampleTranslationArabic,
      masteryLevel: 20,
      stageLabel: 'مبتدئ',
      timesPracticed: 1,
      isFavorite: true,
    };

    if (voiceSettings.soundEffects) {
      playSwordSlashSFX();
    }

    onSaveWordsToVault([newWord]);
    setAddedWordMap((prev) => ({ ...prev, [wordObj.english]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6" dir="rtl">
      {/* Sensei Banner Card */}
      <div className="relative overflow-hidden rounded-3xl glass-card-neon p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 text-right">
            <div className="w-14 h-14 rounded-2xl bg-black border-2 border-[#39FF14] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(57,255,20,0.4)] shrink-0 rotate-45">
              <span className="-rotate-45">🥷</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white font-serif">السينسي الذكي (Cyber AI Sensei)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40">
                  خبير السهم اللندني ⚡
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                اكتب أي فكرة أو موقف باللغة العربية وسيقوم السينسي بتشريحها وتحويلها فوراً إلى إنجليزية بريطانية حية!
              </p>
            </div>
          </div>

          {/* Audio Profile Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/80 border border-[#A855F7]/40 text-xs text-[#C084FC]">
            <Volume2 className="w-4 h-4 text-[#C084FC]" />
            <span>صوت السينسي: <strong className="text-white capitalize">{voiceSettings.profile.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#00FF41] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> اقتراحات سريعة للاختبار:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#001a05] border border-[#222222] hover:border-[#00FF41]/50 text-gray-300 hover:text-[#00FF41] text-xs font-medium transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Log Stream */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
            >
              {msg.sender === 'user' ? (
                /* User Message Bubble */
                <div className="max-w-md px-5 py-3 rounded-2xl bg-[#1a1a1a] text-white font-semibold text-sm border-r-2 border-gray-600 shadow-md rounded-br-none">
                  <p className="text-right">{msg.text}</p>
                  <span className="text-[10px] text-gray-400 block text-left mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ) : msg.isLoading ? (
                /* Loading State Bubble */
                <div className="w-full max-w-2xl p-5 rounded-2xl bg-[#0c0c0c] border border-[#00FF41]/40 flex items-center gap-3 text-[#00FF41]">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-bold">السينسي يقوم بتشريح فكرتك وتحويلها لإنجليزية بريطانية أصيلة...</span>
                </div>
              ) : msg.error ? (
                /* Error State Bubble */
                <div className="w-full max-w-2xl p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{msg.error}</span>
                </div>
              ) : (
                /* Sensei Response Card */
                <div className="w-full glass-card-neon border-[#39FF14]/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_25px_rgba(57,255,20,0.15)] space-y-5 text-right relative overflow-hidden">
                  {/* Background Watermark Kanji */}
                  <div className="absolute top-2 left-2 p-2 opacity-5 pointer-events-none">
                    <span className="text-8xl font-bold text-[#39FF14]">忍者</span>
                  </div>

                  {/* Original Arabic Input Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                    <span className="text-xs font-mono text-gray-400">الفكرة الأصلية: "{msg.data?.arabicOriginal}"</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#001a05] text-[#00FF41] border border-[#00FF41]/40">
                      تحليل السينسي 🥷
                    </span>
                  </div>

                  {/* Main British Translation Display */}
                  <div className="p-4 rounded-xl bg-[#001a05] border-l-2 border-[#00FF41] space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00FF41] uppercase tracking-wider">الترجمة البريطانية النينجا:</span>
                      <button
                        onClick={() => msg.data?.britishMainTranslation && speakText(msg.data.britishMainTranslation, voiceSettings)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg ninja-btn-neon font-black text-xs transition-all active:scale-95 shadow-md"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>استمع للنطق الأصلي</span>
                      </button>
                    </div>

                    <p className="text-xl sm:text-2xl font-black text-white font-serif ltr text-left tracking-wide">
                      {msg.data?.britishMainTranslation}
                    </p>

                    <p className="text-xs font-mono text-[#00FF41]/80 ltr text-left dir-ltr">
                      {msg.data?.mainPhonetic}
                    </p>
                  </div>

                  {/* Detailed Arabic Explanation */}
                  <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
                    <h4 className="text-sm font-bold text-[#00FF41] flex items-center gap-1.5">
                      <Bot className="w-4 h-4" /> الشرح والتفكيك بلسان السينسي:
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-200">
                      {msg.data?.arabicExplanation}
                    </p>
                  </div>

                  {/* British Cultural Nuance */}
                  {msg.data?.britishNuance && (
                    <div className="p-3.5 rounded-xl bg-[#111111] border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                      <strong className="text-amber-400 block mb-1">🏛️ اللمسة الثقافية البريطانية:</strong>
                      {msg.data.britishNuance}
                    </div>
                  )}

                  {/* Alternative Expressions Grid */}
                  {msg.data?.alternativeExpressions && msg.data.alternativeExpressions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-300">بدائل بريطانية أخرى حسب السياق:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.data.alternativeExpressions.map((alt, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#00FF41]/40 transition-all space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black text-[#00FF41]">
                                {alt.arabicType}
                              </span>
                              <button
                                onClick={() => speakText(alt.english, voiceSettings)}
                                className="text-gray-400 hover:text-[#00FF41] transition-colors p-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-white ltr text-left font-serif">{alt.english}</p>
                            <p className="text-xs text-gray-400">{alt.noteArabic}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grammar Modal Trigger Button */}
                  {msg.data?.grammarRule && (
                    <div className="pt-2">
                      <button
                        onClick={() => msg.data?.grammarRule && onOpenGrammarModal(msg.data.grammarRule)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#001a05] hover:bg-[#002b08] border border-[#00FF41]/40 text-[#00FF41] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <BookOpen className="w-4 h-4 text-[#00FF41]" />
                        <span>عرض قاعدة النينجا النحوية الخاصة بهذه الجملة 📜</span>
                      </button>
                    </div>
                  )}

                  {/* Vocabulary to Save Section */}
                  {msg.data?.vocabularyToSave && msg.data.vocabularyToSave.length > 0 && (
                    <div className="pt-3 border-t border-[#1a1a1a] space-y-2">
                      <span className="text-xs font-bold text-[#00FF41] block">
                        مفردات هامة يُنصح بإضافتها لخزنة الذاكرة:
                      </span>
                      <div className="space-y-2">
                        {msg.data.vocabularyToSave.map((v, idx) => {
                          const isAlreadyAdded = addedWordMap[v.english] || savedWordIds.includes(v.english);

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-[#222222] text-xs"
                            >
                              <div className="text-right space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm ltr font-serif">{v.english}</span>
                                  <span className="text-[10px] text-gray-400 ltr font-mono">{v.phonetic}</span>
                                </div>
                                <p className="text-gray-300 font-medium">{v.arabicMeaning}</p>
                              </div>

                              <button
                                onClick={() => !isAlreadyAdded && handleSaveWord(v)}
                                disabled={isAlreadyAdded}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isAlreadyAdded
                                    ? 'bg-[#1a1a1a] text-[#00FF41] cursor-default border border-[#00FF41]/30'
                                    : 'ninja-btn-neon shadow-md active:scale-95'
                                }`}
                              >
                                {isAlreadyAdded ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>في الخزنة</span>
                                  </>
                                ) : (
                                  <>
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>إضافة للخزنة</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sensei Tip Footer */}
                  {msg.data?.ninjaLevelTip && (
                    <div className="p-3 rounded-xl bg-[#001a05] border border-[#00FF41]/30 text-[#00FF41] text-xs flex items-center gap-2">
                      <span className="text-lg">🥷</span>
                      <span className="font-medium">{msg.data.ninjaLevelTip}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Form Bar */}
      <div className="sticky bottom-4 z-20 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-[#111111] border border-[#333333] focus-within:border-[#00FF41] rounded-2xl p-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب أفكارك بالعربية هنا... (مثال: ياخي أنا أحب البنت...)"
            className="w-full bg-transparent px-4 py-2 text-white text-sm focus:outline-none placeholder:text-gray-500"
            dir="rtl"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl ninja-btn-neon disabled:opacity-50 text-black font-black text-sm transition-all active:scale-95 shrink-0"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
