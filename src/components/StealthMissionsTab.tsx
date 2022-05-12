import React, { useState } from 'react';
import { VoiceSettings } from '../types';
import { speakText, playSwordSlashSFX, playSuccessChime, playErrorBuzz } from '../utils/audio';
import { ShieldAlert, Crosshair, Zap, Award, Sparkles, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Volume2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StealthMission {
  id: string;
  titleArabic: string;
  codename: string;
  locationArabic: string;
  briefingArabic: string;
  requiredIdiom: string;
  requiredIdiomMeaning: string;
  xpReward: number;
  threatLevel: 'منخفض' | 'متوسط' | 'مرتفع' | 'أسطوري';
  situationArabic: string;
  options: Array<{
    id: string;
    textEnglish: string;
    explanationArabic: string;
    isStealthSuccess: boolean;
  }>;
}

const STEALTH_MISSIONS: StealthMission[] = [
  {
    id: 'm-1',
    titleArabic: 'عملية سرقة بيكاديللي الخفية',
    codename: 'OPERATION PICCADILLY HEIST',
    locationArabic: 'أنفاق قطارات بيكاديللي - لندن',
    briefingArabic: 'أنت متخفٍ في هيئة مواطن لندني. توقف القطار فجأة وتعطلت الأبواب. حاول الحارس كشف هويتك بسؤالك عن انطباعك عن هذا الموقف المزعج!',
    requiredIdiom: 'Gutted',
    requiredIdiomMeaning: 'محبط ومقهور جداً',
    xpReward: 200,
    threatLevel: 'متوسط',
    situationArabic: 'سألك الحارس اللندني بلهجة جافة: "How are you feeling about this train delay, mate?"',
    options: [
      {
        id: 'opt-1',
        textEnglish: "I'm proper gutted, to be honest. Missing my match!",
        explanationArabic: "تخفٍ أسطوري! استخدام 'proper gutted' جعل الحارس يبتسم ويظنك لندني أصلي 100%. غادرت الموقع بسلام!",
        isStealthSuccess: true,
      },
      {
        id: 'opt-2',
        textEnglish: "I am extremely angry and furious right now!",
        explanationArabic: "انكشف أمرك! الصراحة المباشرة والغضب الواضح كشفا أنك غريب عن دهاء الهدوء اللندني.",
        isStealthSuccess: false,
      },
      {
        id: 'opt-3',
        textEnglish: "No problem at all, I love waiting in dark tunnels.",
        explanationArabic: "سخرية زائدة عن اللزوم بدت مريبة للغاية وجعلت الحارس يدقق في وثائقك!",
        isStealthSuccess: false,
      },
    ],
  },
  {
    id: 'm-2',
    titleArabic: 'اختراق نادي سوهو الخاص',
    codename: 'OPERATION SOHO VIP INFILTRATION',
    locationArabic: 'نادي الساموراي المظلم - سوهو لندن',
    briefingArabic: 'تتسلل إلى حفل كبار الشخصيات لتسريب شفرة النينجا. طلب الحارس عند البوابة معرفة شعورك تجاه الدعوة الخاصة التي تلقيتها.',
    requiredIdiom: 'Chuffed',
    requiredIdiomMeaning: 'مسرور ومبتهج للغاية',
    xpReward: 250,
    threatLevel: 'مرتفع',
    situationArabic: 'سألك حارس البوابة الفولاذي: "Welcome to Soho VIP. Glad you made the list?"',
    options: [
      {
        id: 'opt-1',
        textEnglish: "Absolutely chuffed, mate! Thanks for having me.",
        explanationArabic: "تسلل نينجا باهر! كلمة 'chuffed' أذابت جليد الحارس وفتحت لك أبواب النادي فوراً!",
        isStealthSuccess: true,
      },
      {
        id: 'opt-2',
        textEnglish: "Yes, I am happy because I am very important.",
        explanationArabic: "إجابة متكبرة كشفت ثغرتك وأثارت الشكوك حول هويتك الحقيقية!",
        isStealthSuccess: false,
      },
      {
        id: 'opt-3',
        textEnglish: "I don't care much, it's just a normal party.",
        explanationArabic: "رد جاف جعل الحارس يرفض دخولك حتى تتأكد من الدعوة!",
        isStealthSuccess: false,
      },
    ],
  },
  {
    id: 'm-3',
    titleArabic: 'تسلل قصر باكنغهام وشاي الظل',
    codename: 'OPERATION BUCKINGHAM TEA SHADOW',
    locationArabic: 'صالون الضيافة الملكي - لندن',
    briefingArabic: 'أنت في مهمة استخباراتية رفيعة المستوى داخل حفل شاي ملكي. عرض عليك أحد الدبلوماسيين كوب شاي مميز وعليك الرد بأسلوب نبيل وراقي.',
    requiredIdiom: 'Proper brilliant',
    requiredIdiomMeaning: 'رائع ومبهر بامتياز',
    xpReward: 300,
    threatLevel: 'أسطوري',
    situationArabic: 'قال لك الدبلوماسي الملكي: "How do you find our Earl Grey blend this afternoon?"',
    options: [
      {
        id: 'opt-1',
        textEnglish: "It's proper brilliant, my good sir. Compliments to the chef.",
        explanationArabic: "إتقان كامل لدبلوماسية النينجا! الجمع بين 'proper brilliant' واللباقة الملكية جعل الحارس يمنحك الوصول الأمني الكامل!",
        isStealthSuccess: true,
      },
      {
        id: 'opt-2',
        textEnglish: "It is good water with grass in it.",
        explanationArabic: "إهانة غير مقصودة لتقاليد الشاي البريطاني! صودرت هويتك وتم طردك من القصر!",
        isStealthSuccess: false,
      },
      {
        id: 'opt-3',
        textEnglish: "Give me sugar now, it lacks taste.",
        explanationArabic: "وقاحة كشفت عنك فوراً وأنهت المهمة بالفشل الذريع!",
        isStealthSuccess: false,
      },
    ],
  },
];

interface StealthMissionsTabProps {
  voiceSettings: VoiceSettings;
  onAddXP: (amount: number) => void;
}

export const StealthMissionsTab: React.FC<StealthMissionsTabProps> = ({ voiceSettings, onAddXP }) => {
  const [activeMission, setActiveMission] = useState<StealthMission | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [detectionLevel, setDetectionLevel] = useState<number>(0); // 0% to 100%
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);

  const handleStartMission = (mission: StealthMission) => {
    setActiveMission(mission);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setDetectionLevel(0);
    if (voiceSettings.soundEffects) playSwordSlashSFX();
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !activeMission) return;
    setIsSubmitted(true);
    const selected = activeMission.options.find(o => o.id === selectedOptionId);
    
    if (selected?.isStealthSuccess) {
      if (voiceSettings.soundEffects) playSuccessChime();
      setDetectionLevel(0);
      if (!completedMissionIds.includes(activeMission.id)) {
        setCompletedMissionIds(prev => [...prev, activeMission.id]);
        onAddXP(activeMission.xpReward);
      }
    } else {
      if (voiceSettings.soundEffects) playErrorBuzz();
      setDetectionLevel(85);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8" dir="rtl">
      {/* Top Cyber Banner */}
      <div className="p-6 rounded-3xl glass-card-neon relative overflow-hidden space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-black/80 border border-[#39FF14]/50 rounded-2xl text-[#39FF14] text-3xl shadow-[0_0_20px_rgba(57,255,20,0.3)]">
              🥷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40">
                  MODE: STEALTH MISSIONS
                </span>
                <span className="text-xs font-mono text-[#C084FC] font-bold">لندن السريّة 🇬🇧</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide mt-1">المهمات الخفية (Stealth Missions)</h2>
              <p className="text-xs text-gray-300">
                تسلل إلى المواقف اللندنية الحساسة واستخدم المصطلح البريطاني الصحيح لتتجاوز التفتيش و "تنجو" من الكشف!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/60 p-3 rounded-2xl border border-white/10 shrink-0">
            <Eye className="w-5 h-5 text-[#39FF14]" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold block">مستوى التخفي الحالي</span>
              <span className="text-xs font-mono font-bold text-[#39FF14]">
                {completedMissionIds.length} / {STEALTH_MISSIONS.length} مهمات مكتملة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Selection View */}
      {!activeMission && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#39FF14] flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#C084FC]" /> اختر المهمة السرية النشطة:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEALTH_MISSIONS.map((m) => {
              const isCompleted = completedMissionIds.includes(m.id);

              return (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -4 }}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                    isCompleted
                      ? 'bg-[#051805] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                      : 'bg-black/70 backdrop-blur-md border-white/10 hover:border-[#A855F7]/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#C084FC] font-bold tracking-widest">{m.codename}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-[#39FF14] border border-[#39FF14]/30">
                        {m.threatLevel}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">{m.titleArabic}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{m.briefingArabic}</p>

                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-400 block">مصطلح التخفي المطلوبة:</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#39FF14] ltr">{m.requiredIdiom}</span>
                        <span className="text-[11px] text-[#C084FC] font-medium">{m.requiredIdiomMeaning}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">+{m.xpReward} XP</span>

                    <button
                      onClick={() => handleStartMission(m)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                        isCompleted ? 'ninja-btn-neon' : 'ninja-btn-purple'
                      }`}
                    >
                      <span>{isCompleted ? 'إعادة المهمة 🔄' : 'بدء التسلل 🥷'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Stealth Mission Playfield */}
      {activeMission && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <button
                onClick={() => setActiveMission(null)}
                className="text-xs font-bold text-gray-400 hover:text-[#39FF14] transition-colors flex items-center gap-1"
              >
                <span>← انسحاب إلى القائمة</span>
              </button>

              <div className="text-center">
                <span className="text-[10px] font-mono text-[#C084FC] uppercase block">{activeMission.codename}</span>
                <h3 className="text-sm font-bold text-white">{activeMission.titleArabic}</h3>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400">+{activeMission.xpReward} XP</span>
            </div>

            {/* Situation & Threat Monitor */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Detection Level Monitor */}
              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 flex flex-col justify-between items-center text-center space-y-3">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">رادار كشف الهوية</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-mono font-black text-xl transition-all ${
                    detectionLevel > 50 ? 'border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'border-[#39FF14] text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.5)]'
                  }`}>
                    {detectionLevel}%
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${detectionLevel > 50 ? 'text-rose-400 animate-pulse' : 'text-[#39FF14]'}`}>
                  {detectionLevel > 50 ? '🚨 خطر انكشاف الهوية!' : '🟢 تخفٍ آمن تماماً'}
                </span>
              </div>

              {/* Mission Scenario Prompt */}
              <div className="md:col-span-3 p-5 rounded-2xl glass-card border-[#39FF14]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30">
                    الموقع: {activeMission.locationArabic}
                  </span>
                  <button
                    onClick={() => speakText(activeMission.situationArabic, voiceSettings)}
                    className="p-2 rounded-xl bg-black/60 border border-white/10 text-[#39FF14] hover:bg-black transition-all"
                    title="استماع للحوار"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-base sm:text-lg font-bold text-white leading-relaxed dir-rtl text-right">
                  {activeMission.situationArabic}
                </p>

                <div className="p-3 rounded-xl bg-black/50 border border-[#C084FC]/30 text-xs text-gray-300 flex items-center justify-between">
                  <span>المصطلح المطلوب للنجاة: <strong className="text-[#39FF14] font-mono ltr">{activeMission.requiredIdiom}</strong></span>
                  <span className="text-[#C084FC]"> المعنى: ({activeMission.requiredIdiomMeaning})</span>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {activeMission.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'bg-black/60 border-white/10 text-gray-200 hover:border-[#39FF14]/50';

                if (isSelected) {
                  cardStyle = 'bg-[#051805] border-[#39FF14] text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)]';
                }

                if (isSubmitted) {
                  if (opt.isStealthSuccess) {
                    cardStyle = 'bg-[#051805] border-[#39FF14] text-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.4)]';
                  } else if (isSelected && !opt.isStealthSuccess) {
                    cardStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (!isSubmitted) {
                        setSelectedOptionId(opt.id);
                        speakText(opt.textEnglish, voiceSettings);
                      }
                    }}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${cardStyle}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-bold font-serif ltr text-left block dir-ltr">{opt.textEnglish}</span>
                      <div className="flex items-center gap-2">
                        {isSubmitted && opt.isStealthSuccess && <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />}
                        {isSubmitted && isSelected && !opt.isStealthSuccess && <XCircle className="w-5 h-5 text-rose-400" />}
                      </div>
                    </div>

                    {isSubmitted && (
                      <p className="text-xs text-gray-300 font-medium pt-2 border-t border-white/5 leading-relaxed">
                        {opt.explanationArabic}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveMission(null)}
                className="px-5 py-2.5 rounded-xl bg-black border border-white/10 text-gray-400 font-bold text-xs hover:text-white"
              >
                إلغاء المهمة
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className="px-8 py-3 ninja-btn-neon rounded-xl text-sm font-black shadow-lg disabled:opacity-50"
                >
                  تأكيد خيار التسلل 🗡️
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveMission(null);
                  }}
                  className="px-8 py-3 ninja-btn-purple rounded-xl text-sm font-black shadow-lg"
                >
                  العودة لقائمة المهمات 🥷
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
