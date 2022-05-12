import React, { useState } from 'react';
import { ChallengeScenario, ChallengeQuestion, VoiceSettings, WordItem, GrammarRule } from '../types';
import { initialScenarios } from '../data/initialData';
import { speakText, playSuccessChime, playErrorBuzz, playDojoGongSFX, playSwordSlashSFX } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Swords, Trophy, Sparkles, CheckCircle2, XCircle, ArrowRight, HelpCircle, BookOpen, RotateCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChallengeDojoTabProps {
  voiceSettings: VoiceSettings;
  vaultWords: WordItem[];
  onAddXP: (xp: number) => void;
  onOpenGrammarModal: (rule: GrammarRule) => void;
}

export const ChallengeDojoTab: React.FC<ChallengeDojoTabProps> = ({
  voiceSettings,
  vaultWords,
  onAddXP,
  onOpenGrammarModal,
}) => {
  const [scenarios] = useState<ChallengeScenario[]>(initialScenarios);
  const [activeScenario, setActiveScenario] = useState<ChallengeScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [isScenarioCompleted, setIsScenarioCompleted] = useState(false);
  const [senseiEmotion, setSenseiEmotion] = useState<'normal' | 'happy' | 'thinking' | 'oops'>('normal');
  const [showHint, setShowHint] = useState(false);

  // Dynamic Scenario generated from Memory Vault Algorithm
  const generateVaultScenario = (): ChallengeScenario | null => {
    if (vaultWords.length === 0) return null;

    // Pick 3 lowest mastery words or recent words
    const sortedWords = [...vaultWords].sort((a, b) => a.masteryLevel - b.masteryLevel).slice(0, 3);

    const questions: ChallengeQuestion[] = sortedWords.map((w, idx) => ({
      id: `vq-${idx}-${w.id}`,
      situationArabic: `تحدي الخزنة الذكية: الكلمة المراد اختبارها هي "${w.arabicMeaning}"`,
      questionArabic: `ما هو التعبير البريطاني المطابق للمفهوم "${w.arabicMeaning}"؟`,
      hintArabic: w.contextExplanationArabic,
      targetWord: w.english,
      options: [
        {
          id: `opt-correct-${w.id}`,
          textEnglish: w.english,
          explanationArabic: `إجابة نينجا قاطعة! ${w.english} تعني: ${w.arabicMeaning}`,
          isCorrect: true,
        },
        {
          id: `opt-wrong-1-${w.id}`,
          textEnglish: "A completely wrong answer",
          explanationArabic: "هذه ترجمة حرفية خاطئة في السياق البريطاني.",
          isCorrect: false,
        },
        {
          id: `opt-wrong-2-${w.id}`,
          textEnglish: "Nice try mate",
          explanationArabic: "تعبير آخر غير دقيق لهذا المفهوم.",
          isCorrect: false,
        },
      ].sort(() => Math.random() - 0.5), // Shuffle options
    }));

    return {
      id: 'sc-vault-dynamic',
      titleArabic: 'ميدان نينجا الذاكرة الذكية',
      titleEnglish: 'Smart Vault Algorithm Dojo',
      descriptionArabic: 'تحدي تم إنشاؤه تلقائياً بناءً على الكلمات المحفوظة في خزننك لإعادة تثبيتها وتحدي حفظك!',
      difficulty: 'متوسط',
      badge: '🧠',
      xpReward: 200,
      questions,
    };
  };

  const handleStartScenario = (sc: ChallengeScenario) => {
    if (voiceSettings.soundEffects) {
      playDojoGongSFX();
    }
    setActiveScenario(sc);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScoreCount(0);
    setIsScenarioCompleted(false);
    setSenseiEmotion('normal');
    setShowHint(false);
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
    setSenseiEmotion('thinking');
  };

  const handleConfirmAnswer = () => {
    if (!activeScenario || !selectedOptionId || isAnswerSubmitted) return;

    const currentQ = activeScenario.questions[currentQuestionIndex];
    const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

    setIsAnswerSubmitted(true);

    if (selectedOpt?.isCorrect) {
      if (voiceSettings.soundEffects) {
        playSuccessChime();
      }
      setSenseiEmotion('happy');
      setScoreCount((prev) => prev + 1);

      // Pronounce target word
      if (currentQ.targetWord) {
        speakText(currentQ.targetWord, voiceSettings);
      }
    } else {
      if (voiceSettings.soundEffects) {
        playErrorBuzz();
      }
      setSenseiEmotion('oops');
    }
  };

  const handleNextQuestion = () => {
    if (!activeScenario) return;

    if (currentQuestionIndex + 1 < activeScenario.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setSenseiEmotion('normal');
      setShowHint(false);
    } else {
      // Scenario Completed!
      setIsScenarioCompleted(true);
      onAddXP(activeScenario.xpReward);

      if (voiceSettings.soundEffects) {
        playSwordSlashSFX();
      }

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const vaultScenario = generateVaultScenario();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6" dir="rtl">
      {!activeScenario ? (
        /* Scenarios Selection List */
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 rounded-2xl bg-[#0c0c0c] ninja-border text-right space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#001a05] rounded-xl text-2xl text-[#00FF41]">⚔️</div>
              <div>
                <h2 className="text-2xl font-black text-white font-serif">ميدان التحدي والمحاكاة</h2>
                <p className="text-xs text-[#00FF41] font-medium">
                  محاكاة مواقف واقعية مع تنبيهات نينجا فورية وخوارزمية تكرار مخصصة لخبراء الإنجليزية!
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Vault Scenario if Available */}
          {vaultScenario && (
            <div className="p-5 rounded-2xl bg-[#0c0c0c] border-2 border-[#00FF41] shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#001a05] text-[#00FF41] border border-[#00FF41]/40">
                  خوارزمية الذاكرة الذكية 🧠
                </span>
                <span className="text-xs font-bold text-[#00FF41]">+{vaultScenario.xpReward} XP</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif">{vaultScenario.titleArabic}</h3>
              <p className="text-xs text-gray-300">{vaultScenario.descriptionArabic}</p>
              <button
                onClick={() => handleStartScenario(vaultScenario)}
                className="w-full py-3 rounded-xl ninja-btn-neon text-black font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>دخول تحدي كلمات الخزنة الآن</span>
              </button>
            </div>
          )}

          {/* Standard Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {scenarios.map((sc) => (
              <motion.div
                key={sc.id}
                whileHover={{ y: -4 }}
                className="bg-[#0c0c0c] border border-[#222222] hover:border-[#00FF41]/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{sc.badge}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#001a05] text-[#00FF41] border border-[#00FF41]/30">
                      مستوى: {sc.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">{sc.titleArabic}</h3>
                  <p className="text-xs font-mono text-[#00FF41]/80">{sc.titleEnglish}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{sc.descriptionArabic}</p>
                </div>

                <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">+{sc.xpReward} XP</span>
                  <button
                    onClick={() => handleStartScenario(sc)}
                    className="px-4 py-2 rounded-xl ninja-btn-neon text-black font-black text-xs transition-all active:scale-95 flex items-center gap-1 shadow-md"
                  >
                    <span>ابدأ الميدان</span>
                    <Swords className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : isScenarioCompleted ? (
        /* Victory Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-[#0c0c0c] ninja-border text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-[#001a05] border-2 border-[#00FF41] flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(0,255,65,0.4)]">
            🏆
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#00FF41] uppercase tracking-wider">ميدان النينجا مكتمل 🎉</span>
            <h2 className="text-3xl font-black text-white font-serif">أحسنت القتال يا نينجا!</h2>
            <p className="text-sm text-gray-300">
              أكملت بنجاح: <strong>{activeScenario.titleArabic}</strong>
            </p>
          </div>

          <div className="flex justify-center gap-6 p-4 rounded-xl bg-[#111111] border border-[#222222] max-w-sm mx-auto">
            <div>
              <span className="text-xs text-gray-400 block">الإجابات الصحيحة</span>
              <span className="text-2xl font-black text-[#00FF41]">
                {scoreCount} / {activeScenario.questions.length}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">نقاط XP المكتسبة</span>
              <span className="text-2xl font-black text-amber-400">+{activeScenario.xpReward}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveScenario(null)}
            className="px-8 py-3 ninja-btn-neon text-black font-black rounded-xl text-sm transition-all shadow-lg active:scale-95"
          >
            العودة لميادين التحدي
          </button>
        </motion.div>
      ) : (
        /* Active Question Screen */
        <div className="space-y-6">
          {/* Challenge Header Progress */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0c0c0c] border border-[#00FF41]/30">
            <button
              onClick={() => setActiveScenario(null)}
              className="text-xs text-gray-400 hover:text-[#00FF41] transition-colors flex items-center gap-1 font-bold"
            >
              <span>خروج</span>
            </button>

            <span className="text-sm font-bold text-white font-serif">{activeScenario.titleArabic}</span>

            <span className="text-xs font-mono font-bold text-[#00FF41]">
              سؤال {currentQuestionIndex + 1} من {activeScenario.questions.length}
            </span>
          </div>

          {/* Question Box & Animated Avatar Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Animated Sensei Character Avatar */}
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#00FF41]/30 flex flex-col items-center justify-center text-center space-y-2">
              <motion.div
                animate={{
                  scale: senseiEmotion === 'happy' ? [1, 1.15, 1] : 1,
                  rotate: senseiEmotion === 'oops' ? [-5, 5, 0] : 0,
                }}
                className="w-16 h-16 rounded-2xl bg-[#001a05] border border-[#00FF41]/50 flex items-center justify-center text-4xl shadow-inner"
              >
                {senseiEmotion === 'happy' && '🥷✨'}
                {senseiEmotion === 'oops' && '🥷😅'}
                {senseiEmotion === 'thinking' && '🥷🤔'}
                {senseiEmotion === 'normal' && '🥷'}
              </motion.div>
              <span className="text-xs font-bold text-gray-300">السينسي المراقب</span>
              <span className="text-[10px] text-[#00FF41] font-mono">
                {senseiEmotion === 'happy' && 'ممتاز جداً!'}
                {senseiEmotion === 'oops' && 'ركز في المحاولة القادمة!'}
                {senseiEmotion === 'thinking' && 'يفكر في إجابتك...'}
                {senseiEmotion === 'normal' && 'جاهز للتقييم'}
              </span>
            </div>

            {/* Question Description */}
            <div className="md:col-span-3 p-5 rounded-2xl bg-[#0c0c0c] border border-[#00FF41]/40 space-y-3 text-right">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#001a05] text-[#00FF41] border border-[#00FF41]/30">
                الموقف 🎯
              </span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {activeScenario.questions[currentQuestionIndex].situationArabic}
              </p>
              <p className="text-sm text-[#00FF41] font-medium">
                {activeScenario.questions[currentQuestionIndex].questionArabic}
              </p>

              {/* Hint Trigger */}
              {activeScenario.questions[currentQuestionIndex].hintArabic && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-[#00FF41] hover:underline flex items-center gap-1 font-bold"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'إخفاء التلميح' : 'عرض تلميح النينجا 💡'}</span>
                  </button>
                  {showHint && (
                    <p className="mt-2 p-3 rounded-xl bg-[#111111] border border-[#222222] text-xs text-gray-300">
                      {activeScenario.questions[currentQuestionIndex].hintArabic}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {activeScenario.questions[currentQuestionIndex].options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-[#111111] border-[#222222] text-gray-200 hover:border-[#00FF41]/50';

              if (isSelected) {
                btnStyle = 'bg-[#001a05] border-[#00FF41] text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.2)]';
              }

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-[#001a05] border-[#00FF41] text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.3)]';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-950 border-rose-600 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="space-y-1">
                    <span className="text-base font-bold font-serif ltr text-left block dir-ltr">{opt.textEnglish}</span>
                    {isAnswerSubmitted && (
                      <p className="text-xs text-gray-300 font-medium">{opt.explanationArabic}</p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isAnswerSubmitted && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-[#00FF41]" />}
                    {isAnswerSubmitted && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Grammar Modal Trigger inside Question if available */}
          {activeScenario.questions[currentQuestionIndex].grammarModal && (
            <div className="pt-1">
              <button
                onClick={() => {
                  const rule = activeScenario.questions[currentQuestionIndex].grammarModal;
                  if (rule) onOpenGrammarModal(rule);
                }}
                className="w-full py-2 px-4 rounded-xl bg-[#0c0c0c] border border-[#00FF41]/30 text-[#00FF41] font-bold text-xs flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>عرض النافذة المنبثقة لشرح قاعدة السؤال 📜</span>
              </button>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#1a1a1a] flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOptionId}
                className="px-8 py-3 ninja-btn-neon text-black font-black rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                تأكيد الإجابة ⚔️
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 ninja-btn-neon text-black font-black rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>السؤال التالي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
