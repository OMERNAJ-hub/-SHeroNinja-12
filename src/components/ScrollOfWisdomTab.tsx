import React, { useState } from 'react';
import { VoiceSettings } from '../types';
import { speakText, playSwordSlashSFX } from '../utils/audio';
import { Scroll, Sparkles, Volume2, HelpCircle, Flame, Shield, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WisdomSection {
  id: string;
  titleArabic: string;
  badge: string;
  subtitleArabic: string;
  conceptExplanationArabic: string;
  ninjaRule: string;
  examples: Array<{
    standardEnglish: string;
    standardMeaningArabic: string;
    britishSarcasticEnglish: string;
    realMeaningArabic: string;
    contextNoteArabic: string;
  }>;
}

const WISDOM_SECTIONS: WisdomSection[] = [
  {
    id: 'sarcasm',
    titleArabic: 'فن السخرية الجليدية (British Sarcasm & Irony)',
    badge: '🧊',
    subtitleArabic: 'كيف ينطق البريطاني عكس ما يقصده دون أن يرف له جفن!',
    conceptExplanationArabic: 'في الثقافة البريطانية، تعتبر السخرية المبطنة (Sarcasm) لغة التعامل اليومية. لن يقول لك البريطاني "أنت مخطئ" مباشرة، بل سيبتسم ويقول "That is an interesting choice!" ليلمح بأسلوب بارد أنك ارتكبت كارثة!',
    ninjaRule: 'سر النينجا: كلما بدت الجملة مشجعة بزيادة من شخص بريطاني، كلما احتملت أن تعني العكس تماماً!',
    examples: [
      {
        standardEnglish: "That is a terrible idea.",
        standardMeaningArabic: "هذه فكرة سيئة جداً.",
        britishSarcasticEnglish: "With all due respect, that's a very interesting approach.",
        realMeaningArabic: "مع كامل الاحترام، فكرتك هذه كارثية ولن تنجح!",
        contextNoteArabic: "تُستخدم عادة في اجتماعات العمل بالشركات اللندنية."
      },
      {
        standardEnglish: "You made a huge mistake.",
        standardMeaningArabic: "لقد ارتكبت خطأ كبيراً.",
        britishSarcasticEnglish: "Well, that went exceedingly well, didn't it?",
        realMeaningArabic: "حسناً، لقد فسد الأمر كلياً وشكراً لجهودك الكارثية!",
        contextNoteArabic: "تُقال عند وقوع حادث مفاجئ بين الأصدقاء."
      }
    ]
  },
  {
    id: 'understatement',
    titleArabic: 'فن التقليل البريطاني (Understatement)',
    badge: '🌧️',
    subtitleArabic: 'وصف الأعاصير والكوارث بأنها "مجرد نسمة هواء بسيطة"!',
    conceptExplanationArabic: 'البريطانيون يكرهون المبالغة الصريحة (Exaggeration). إذا هبت عاصفة ثلجية ودمرت الممتلكات، سيقول البريطاني: "It\'s a bit chilly today" (الطقس بارد قليلاً اليوم). هذا الأسلوب يعكس رباطة الجأش العالية.',
    ninjaRule: 'سر النينجا: لا تستخدم كلمات المبالغة الضخمة مثل Terrible أو Horrible بكثرة، استخدم Bit bad بدلاً منها لتظهر كأصيل.',
    examples: [
      {
        standardEnglish: "There is a massive flood outside!",
        standardMeaningArabic: "هناك فيضان هائل في الخارج!",
        britishSarcasticEnglish: "It's a tad moist outside today.",
        realMeaningArabic: "الجو رطب قليلاً في الخارج اليوم!",
        contextNoteArabic: "توصيف طريف لفيضانات الأمطار الغزيرة في شوارع لندن."
      },
      {
        standardEnglish: "I am extremely exhausted and dying.",
        standardMeaningArabic: "أنا مجهد للغاية وأموت من التعب.",
        britishSarcasticEnglish: "I'm feeling slightly weary, to be fair.",
        realMeaningArabic: "أشعر ببعض التعب الخفيف صراحة (وهو مهدود الحيل كلياً).",
        contextNoteArabic: "تُستخدم بين زملائك بعد نوبة عمل 12 ساعة."
      }
    ]
  },
  {
    id: 'politeness',
    titleArabic: 'شفرات اللباقة والاعتذار (Politeness & Queuing)',
    badge: '👑',
    subtitleArabic: 'لماذا يعتذر البريطاني لك حتى لو قمت أنت بالاصطدام به؟!',
    conceptExplanationArabic: 'كلمة "Sorry" في لندن ليست مجرد اعتذار عن خطأ، بل هي أداة دبلوماسية لفتح الحوار، طلب الإذن، أو التعبير عن الاستغراب. إذا صدمك أحد في المترو، ستجده يقول "Sorry!" لتفادي المحك.',
    ninjaRule: 'سر النينجا: ابدأ أي سؤال غريب بكلمة Sorry قبلExcuse me لتبدو كشخص لندني عاش هناك 20 عاماً!',
    examples: [
      {
        standardEnglish: "Move out of my way.",
        standardMeaningArabic: "ابتعد من طريقي.",
        britishSarcasticEnglish: "Sorry, mind if I just squeeze past you?",
        realMeaningArabic: "عفواً، هل تمانع أن أمر بجانبك ببطء؟",
        contextNoteArabic: "التعبير الذهبي للتحرك داخل قطار الأنفاق المزدحم."
      },
      {
        standardEnglish: "I didn't hear what you said.",
        standardMeaningArabic: "لم أسمع ما قلته.",
        britishSarcasticEnglish: "Sorry, I didn't quite catch that, mate?",
        realMeaningArabic: "عذراً، لم التقط كلامك جيداً يا صديقي؟",
        contextNoteArabic: "ألطف طريقة لإعادة طلب النطق دون إحراج الطرف الآخر."
      }
    ]
  }
];

interface ScrollOfWisdomTabProps {
  voiceSettings: VoiceSettings;
}

export const ScrollOfWisdomTab: React.FC<ScrollOfWisdomTabProps> = ({ voiceSettings }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sarcasm');
  const [customInputText, setCustomInputText] = useState<string>('');
  const [convertedResult, setConvertedResult] = useState<{ english: string; arabic: string; note: string } | null>(null);

  const activeSection = WISDOM_SECTIONS.find(s => s.id === activeSectionId) || WISDOM_SECTIONS[0];

  const handleConvertSarcasm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    // Interactive Sarcasm Converter logic
    const text = customInputText.trim().toLowerCase();
    if (text.includes('bad') || text.includes('terrible') || text.includes('سيء')) {
      setConvertedResult({
        english: "It's not ideal, to be perfectly honest.",
        arabic: "الأمر ليس مثالياً، كي أكون صادقاً كلياً (بمعنى: الوضع كارثي بس بأسلوب راقي!).",
        note: "استخدم البريطانيون Not ideal لتجنب كلمة Bad الصريحة."
      });
    } else if (text.includes('happy') || text.includes('good') || text.includes('جيد') || text.includes('سعيد')) {
      setConvertedResult({
        english: "Not too bad at all, cheers mate!",
        arabic: "ليس سيئاً إطلاقاً، شكراً يا صديقي! (بمعنى: ممتاز وفخور به!).",
        note: "تعبير Not too bad هو أعلى درجات الثناء في الشارع البريطاني!"
      });
    } else {
      setConvertedResult({
        english: `With all respect, "${customInputText}" is quite something!`,
        arabic: `مع كامل الاحترام، عبارة "${customInputText}" لها طابع خاص ومثير للدهشة!`,
        note: "تركيب Quite something يُستخدم للتعبير الضمني عن المفاجأة أو الاستغراب اللطيف."
      });
    }

    if (voiceSettings.soundEffects) playSwordSlashSFX();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card-purple relative overflow-hidden space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-black/80 border border-[#A855F7]/50 rounded-2xl text-[#C084FC] text-3xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40">
                  THE SCROLL OF WISDOM
                </span>
                <span className="text-xs font-mono text-[#39FF14] font-bold">دليل النينجا الثقافي 🇬🇧</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide mt-1">لفافة الحكمة (The British Code)</h2>
              <p className="text-xs text-gray-300">
                فهم السخرية البريطانية والتقليل واللباقة هو السر الحقيقي لتتحدث كأنك مولود في قلب لندن!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Nav Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {WISDOM_SECTIONS.map((sec) => {
          const isActive = sec.id === activeSectionId;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionId(sec.id);
                if (voiceSettings.soundEffects) playSwordSlashSFX();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                  : 'bg-black/60 text-gray-400 border-white/10 hover:border-white/30'
              }`}
            >
              <span>{sec.badge}</span>
              <span>{sec.titleArabic.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Content */}
      <motion.div
        key={activeSection.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Concept Card */}
        <div className="p-6 rounded-3xl glass-card space-y-3 border-[#A855F7]/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeSection.badge}</span>
            <h3 className="text-xl font-bold text-white">{activeSection.titleArabic}</h3>
          </div>
          <p className="text-xs text-[#C084FC] font-bold">{activeSection.subtitleArabic}</p>
          <p className="text-sm text-gray-300 leading-relaxed pt-2 border-t border-white/5">
            {activeSection.conceptExplanationArabic}
          </p>

          <div className="p-3.5 rounded-2xl bg-[#051805] border border-[#39FF14]/40 text-xs text-[#39FF14] font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#39FF14] shrink-0" />
            <span>{activeSection.ninjaRule}</span>
          </div>
        </div>

        {/* Examples Cards */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">أمثلة الواقع اليومي بين الصراحة والأسلوب البريطاني:</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSection.examples.map((ex, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/80 border border-white/10 hover:border-[#A855F7]/50 transition-all space-y-3">
                {/* Standard Vs British */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold block">الصياغة المباشرة العادية:</span>
                  <p className="text-xs font-mono text-gray-300 ltr">{ex.standardEnglish}</p>
                  <p className="text-[11px] text-gray-400">({ex.standardMeaningArabic})</p>
                </div>

                <div className="p-3 rounded-xl bg-[#150520] border border-[#A855F7]/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#C084FC] font-bold block">الأسلوب البريطاني الأسطوري 🇬🇧:</span>
                    <button
                      onClick={() => speakText(ex.britishSarcasticEnglish, voiceSettings)}
                      className="p-1.5 rounded-lg bg-black/60 text-[#C084FC] hover:text-white transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-mono font-bold text-white ltr">{ex.britishSarcasticEnglish}</p>
                  <p className="text-xs text-[#39FF14] font-bold pt-1">المعنى الحقيقي: {ex.realMeaningArabic}</p>
                </div>

                <p className="text-[11px] text-gray-400 italic">💡 {ex.contextNoteArabic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive British Sarcasm Converter Widget */}
        <div className="p-6 rounded-3xl glass-card-neon space-y-4 border-[#39FF14]/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black border border-[#39FF14]/40 text-[#39FF14]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">محول السخرية واللباقة البريطانية الذكي 🧪</h4>
              <p className="text-xs text-gray-300">اكتب أي جملة أو كلمة صريحة بالإنجليزية أو العربية وشاهد كيف يترجمها النينجا إلى بريطانية راقية!</p>
            </div>
          </div>

          <form onSubmit={handleConvertSarcasm} className="flex gap-2">
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="اكتب جملة مثل: Bad, Terrible, I am happy, I hate this..."
              className="flex-1 bg-black/80 border border-white/20 focus:border-[#39FF14] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 ninja-btn-neon rounded-xl text-xs font-black shrink-0"
            >
              تحويل بريطاني 🇬🇧
            </button>
          </form>

          {convertedResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-black/90 border border-[#39FF14]/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#39FF14]">الصياغة اللندنية المحولة:</span>
                <button
                  onClick={() => speakText(convertedResult.english, voiceSettings)}
                  className="p-1.5 rounded-lg bg-black text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-black transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-base font-mono font-bold text-white ltr">{convertedResult.english}</p>
              <p className="text-xs text-[#C084FC] font-bold">{convertedResult.arabic}</p>
              <p className="text-[11px] text-gray-400">💡 {convertedResult.note}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
