import React from 'react';
import { NinjaUserStats, VoiceSettings } from '../types';
import { playSuccessChime, playDojoGongSFX } from '../utils/audio';
import { Trophy, Shield, Zap, Award, CheckCircle2, Lock, Sparkles, Star, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RankNode {
  levelNumber: number;
  titleArabic: string;
  titleEnglish: string;
  requiredXp: number;
  badge: string;
  perksArabic: string[];
  color: 'white' | 'green' | 'purple' | 'cyan' | 'black' | 'gold';
}

const RANK_NODES: RankNode[] = [
  {
    levelNumber: 1,
    titleArabic: 'مبتدئ الدوجو',
    titleEnglish: 'Dojo Novice',
    requiredXp: 0,
    badge: '🌱',
    perksArabic: ['فتح مترجم السينسي الذكي', 'نطق الجمل الأساسية'],
    color: 'white',
  },
  {
    levelNumber: 2,
    titleArabic: 'نينجا صاعد',
    titleEnglish: 'Rising Ninja',
    requiredXp: 150,
    badge: '🗡️',
    perksArabic: ['فتح مهمة مقهى سوهو السرية', 'حفظ المصطلحات في خزنة الذاكرة'],
    color: 'green',
  },
  {
    levelNumber: 3,
    titleArabic: 'سيف الظل السايبر',
    titleEnglish: 'Shadow Cyber Blade',
    requiredXp: 400,
    badge: '🔮',
    perksArabic: ['فتح صوت القاتلة المأجورة', 'فتح شفرات السخرية البريطانية'],
    color: 'purple',
  },
  {
    levelNumber: 4,
    titleArabic: 'نينجا سايبر محترف',
    titleEnglish: 'Cyber Pro Ninja',
    requiredXp: 700,
    badge: '⚡',
    perksArabic: ['فتح مهمات قصر باكنغهام الملكية', 'دليل التقليل والمبالغة المعكوسة'],
    color: 'cyan',
  },
  {
    levelNumber: 5,
    titleArabic: 'سيد النينجا الأسود',
    titleEnglish: 'Master Black Belt',
    requiredXp: 1000,
    badge: '🥷',
    perksArabic: ['فتح صوت الظل الهمسي السري', 'اختبار النطق المتقدم بالتمرير'],
    color: 'black',
  },
  {
    levelNumber: 6,
    titleArabic: 'أسطورة الساموراي والظل',
    titleEnglish: 'Grandmaster Shadow Legend',
    requiredXp: 1500,
    badge: '👑',
    perksArabic: ['اللقب الأسطوري الشرفي', 'الوصول لجميع أصوات ومهام الدوجو الأسطورية'],
    color: 'gold',
  },
];

interface RankSystemTabProps {
  stats: NinjaUserStats;
  voiceSettings: VoiceSettings;
  onAddXP: (amount: number) => void;
}

export const RankSystemTab: React.FC<RankSystemTabProps> = ({ stats, voiceSettings, onAddXP }) => {
  const currentXp = stats.xp;

  // Calculate current node index
  let currentNodeIndex = 0;
  for (let i = 0; i < RANK_NODES.length; i++) {
    if (currentXp >= RANK_NODES[i].requiredXp) {
      currentNodeIndex = i;
    }
  }

  const currentRank = RANK_NODES[currentNodeIndex];
  const nextRank = RANK_NODES[Math.min(RANK_NODES.length - 1, currentNodeIndex + 1)];

  const xpProgressToNext = nextRank ? Math.min(100, Math.max(0, ((currentXp - currentRank.requiredXp) / Math.max(1, nextRank.requiredXp - currentRank.requiredXp)) * 100)) : 100;

  const handleClaimDailyXp = () => {
    onAddXP(50);
    if (voiceSettings.soundEffects) playSuccessChime();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8" dir="rtl">
      {/* Top Level Banner */}
      <div className="p-6 rounded-3xl glass-card-neon space-y-4 border-[#39FF14]/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-black/80 border-2 border-[#39FF14] rounded-2xl text-4xl shadow-[0_0_25px_rgba(57,255,20,0.4)]">
              {currentRank.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40 uppercase">
                  LEVEL {currentNodeIndex + 1}
                </span>
                <span className="text-xs font-mono text-[#C084FC] font-bold">خريطة رتب النينجا 🥷</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{currentRank.titleArabic}</h2>
              <p className="text-xs text-gray-300 font-mono ltr text-right">{currentRank.titleEnglish}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/80 p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-left">
              <span className="text-[10px] text-gray-400 font-bold block">إجمالي نقاط الخبرة</span>
              <span className="text-xl font-mono font-black text-[#39FF14]">{currentXp} XP</span>
            </div>
            <button
              onClick={handleClaimDailyXp}
              className="px-4 py-2.5 ninja-btn-purple rounded-xl text-xs font-black shrink-0 active:scale-95 transition-all shadow-md"
            >
              مكافأة يومية +50 XP 🎁
            </button>
          </div>
        </div>

        {/* Progress Bar to Next Rank */}
        {nextRank && nextRank !== currentRank && (
          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-300">الرتبة القادمة: <strong className="text-[#C084FC]">{nextRank.titleArabic} ({nextRank.requiredXp} XP)</strong></span>
              <span className="text-[#39FF14] font-mono">{xpProgressToNext.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#39FF14] to-[#A855F7] rounded-full transition-all duration-500 shadow-[0_0_15px_#39FF14]"
                style={{ width: `${xpProgressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Progression Path Map Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#39FF14] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#C084FC]" /> المسار التدريبي ورتب النينجا:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RANK_NODES.map((rank, idx) => {
            const isUnlocked = currentXp >= rank.requiredXp;
            const isCurrent = idx === currentNodeIndex;

            let borderStyle = 'border-white/10 bg-black/70 text-gray-400';
            if (isCurrent) {
              borderStyle = 'border-[#39FF14] bg-[#051805] text-white shadow-[0_0_25px_rgba(57,255,20,0.3)]';
            } else if (isUnlocked) {
              borderStyle = 'border-[#A855F7]/60 bg-[#150520] text-white';
            }

            return (
              <motion.div
                key={rank.levelNumber}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-3xl border transition-all space-y-4 relative overflow-hidden ${borderStyle}`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-black/60 rounded-2xl border border-white/10">{rank.badge}</span>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 font-bold block">مستوى {rank.levelNumber}</span>
                      <h4 className="text-base font-bold text-white">{rank.titleArabic}</h4>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#39FF14] text-black shadow-[0_0_10px_#39FF14]">
                      رتبتك الحالية
                    </span>
                  ) : isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {/* Requirements */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">النقاط المطلوبة:</span>
                  <span className={isUnlocked ? 'text-[#39FF14] font-bold' : 'text-gray-500'}>
                    {rank.requiredXp} XP
                  </span>
                </div>

                {/* Perks */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold block">امتيازات الرتبة:</span>
                  <ul className="space-y-1">
                    {rank.perksArabic.map((perk, pIdx) => (
                      <li key={pIdx} className="text-xs text-gray-300 flex items-center gap-2">
                        <Sparkles className={`w-3 h-3 ${isUnlocked ? 'text-[#39FF14]' : 'text-gray-600'}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
