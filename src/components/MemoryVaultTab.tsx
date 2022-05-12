import React, { useState } from 'react';
import { WordItem, VoiceSettings } from '../types';
import { speakText, playSuccessChime } from '../utils/audio';
import { Search, Volume2, Trash2, Award, Zap, BookOpen, CheckCircle, Flame, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryVaultTabProps {
  words: WordItem[];
  voiceSettings: VoiceSettings;
  onUpdateWordMastery: (wordId: string, newLevel: number) => void;
  onDeleteWord: (wordId: string) => void;
  onToggleFavorite: (wordId: string) => void;
}

export const MemoryVaultTab: React.FC<MemoryVaultTabProps> = ({
  words,
  voiceSettings,
  onUpdateWordMastery,
  onDeleteWord,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practiceModalWord, setPracticeModalWord] = useState<WordItem | null>(null);
  const [userPracticeInput, setUserPracticeInput] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Filter words
  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.arabicMeaning.includes(searchQuery) ||
      word.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'favorites') return matchesSearch && word.isFavorite;
    return matchesSearch && word.category === selectedCategory;
  });

  // Calculate overall stats
  const totalWords = words.length;
  const masterWordsCount = words.filter((w) => w.masteryLevel >= 80).length;
  const avgMastery = totalWords > 0 ? Math.round(words.reduce((acc, curr) => acc + curr.masteryLevel, 0) / totalWords) : 0;

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!practiceModalWord) return;

    const isCorrect = userPracticeInput.trim().toLowerCase() === practiceModalWord.english.toLowerCase();

    if (isCorrect) {
      if (voiceSettings.soundEffects) {
        playSuccessChime();
      }
      const newLevel = Math.min(100, practiceModalWord.masteryLevel + 15);
      onUpdateWordMastery(practiceModalWord.id, newLevel);
      setPracticeFeedback({
        isSuccess: true,
        text: `أداء نينجا أسطوري! ارتفعت نسبة إتقانك للكلمة إلى ${newLevel}%!`,
      });
      setTimeout(() => {
        setPracticeModalWord(null);
        setUserPracticeInput('');
        setPracticeFeedback(null);
      }, 1800);
    } else {
      setPracticeFeedback({
        isSuccess: false,
        text: `حاول مجدداً! الإملاء الصحيح هو: "${practiceModalWord.english}"`,
      });
    }
  };

  const getStageBadgeColor = (stage: WordItem['stageLabel']) => {
    switch (stage) {
      case 'سيد النينجا':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'نينجا محترف':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'نينجا صاعد':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6" dir="rtl">
      {/* Vault Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl glass-card-neon flex items-center gap-4">
          <div className="p-3 bg-black/80 border border-[#39FF14]/50 rounded-2xl text-[#39FF14] text-2xl shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400">إجمالي الكلمات المحفوظة</span>
            <p className="text-2xl font-black text-white">{totalWords} كلمة</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card-purple flex items-center gap-4">
          <div className="p-3 bg-black/80 border border-[#A855F7]/50 rounded-2xl text-[#C084FC] text-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400">كلمات بدرجة "سيد النينجا"</span>
            <p className="text-2xl font-black text-amber-400">{masterWordsCount} كلمة</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card-neon flex items-center gap-4">
          <div className="p-3 bg-black/80 border border-[#39FF14]/50 rounded-2xl text-[#39FF14] text-2xl shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400">متوسط الحفظ العام</span>
            <p className="text-2xl font-black text-[#39FF14]">{avgMastery}%</p>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالإنجليزية أو العربية..."
            className="w-full bg-[#050505] border border-[#333333] focus:border-[#00FF41] rounded-xl pr-10 pl-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'favorites', label: 'المفضلة ★' },
            { id: 'slang', label: 'عامية بريطانية' },
            { id: 'idiom', label: 'تعابير أصيلة' },
            { id: 'formal', label: 'رسمية' },
            { id: 'daily', label: 'يومية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00FF41] text-black shadow-md'
                  : 'bg-[#050505] text-gray-400 hover:text-white border border-[#222222]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Grid */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12 bg-[#0c0c0c] rounded-2xl border border-dashed border-[#222222] space-y-3">
          <span className="text-4xl">🥷</span>
          <p className="text-gray-300 font-bold text-sm">لا توجد كلمات مطابقة في خزنة الذاكرة حالياً</p>
          <p className="text-xs text-gray-500">استخدم [السينسي الذكي] لإضافة كلمات جديدة تلقائياً!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredWords.map((word) => (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#0c0c0c] border border-[#222222] hover:border-[#00FF41]/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 transition-all border-r-2 border-r-[#00FF41]"
              >
                {/* Card Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStageBadgeColor(word.stageLabel)}`}>
                      {word.stageLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#111111] text-gray-400 uppercase border border-[#222]">
                      {word.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(word.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        word.isFavorite ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => onDeleteWord(word.id)}
                      className="p-1.5 text-gray-600 hover:text-rose-400 transition-colors"
                      title="حذف من الخزنة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* English Word & Audio */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-serif ltr tracking-wide">{word.english}</h3>
                    <button
                      onClick={() => speakText(word.english, voiceSettings)}
                      className="p-2 rounded-xl bg-[#001a05] hover:bg-[#002b08] border border-[#00FF41]/40 text-[#00FF41] transition-all active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#00FF41]/80 font-mono ltr">{word.phonetic}</p>
                </div>

                {/* Arabic Meaning & Context */}
                <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] space-y-1 text-right">
                  <p className="text-sm font-bold text-[#00FF41]">{word.arabicMeaning}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{word.contextExplanationArabic}</p>
                </div>

                {/* Example Sentence */}
                <div className="text-xs space-y-0.5 pt-1">
                  <p className="text-gray-200 font-serif ltr text-left font-medium">"{word.exampleSentence}"</p>
                  <p className="text-gray-500 text-right">{word.exampleTranslationArabic}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-400">مستوى الحفظ والتمكن</span>
                    <span className="text-[#00FF41] font-mono">{word.masteryLevel}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black overflow-hidden border border-[#222]">
                    <div
                      className="h-full bg-[#00FF41] transition-all duration-500 shadow-[0_0_8px_#00FF41]"
                      style={{ width: `${word.masteryLevel}%` }}
                    />
                  </div>
                </div>

                {/* Practice Button */}
                <button
                  onClick={() => {
                    setPracticeModalWord(word);
                    setUserPracticeInput('');
                    setPracticeFeedback(null);
                  }}
                  className="w-full py-2 rounded-xl bg-[#111111] hover:bg-[#001a05] border border-[#222222] hover:border-[#00FF41]/50 text-[#00FF41] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>تمرين إملاء سريع لرفع النسبة 🎯</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Practice Modal Popup */}
      <AnimatePresence>
        {practiceModalWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#0c0c0c] ninja-border rounded-2xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#00FF41] uppercase tracking-wider">تمرين نينجا الذاكرة السريع 🎯</span>
                <h3 className="text-xl font-bold text-white">{practiceModalWord.arabicMeaning}</h3>
                <p className="text-xs text-gray-400">اكتب الكلمة بالإنجليزية لرفع نسبة الحفظ!</p>
              </div>

              <form onSubmit={handlePracticeSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userPracticeInput}
                  onChange={(e) => setUserPracticeInput(e.target.value)}
                  placeholder="اكتب الكلمة بالإنجليزية..."
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#00FF41] rounded-xl px-4 py-3 text-center text-lg font-mono text-[#00FF41] focus:outline-none ltr"
                  autoFocus
                />

                {practiceFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold text-center ${
                      practiceFeedback.isSuccess ? 'bg-[#001a05] text-[#00FF41] border border-[#00FF41]/40' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {practiceFeedback.text}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 ninja-btn-neon font-black rounded-xl text-sm transition-all shadow-md"
                  >
                    تأكيد الإجابة
                  </button>
                  <button
                    type="button"
                    onClick={() => setPracticeModalWord(null)}
                    className="px-4 py-2.5 bg-[#111111] hover:bg-[#1a1a1a] text-gray-300 font-bold rounded-xl text-sm transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
