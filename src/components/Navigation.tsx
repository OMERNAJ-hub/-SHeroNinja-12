import React from 'react';
import { TabType, NinjaUserStats } from '../types';
import { Bot, Crosshair, Scroll, Trophy, ShieldCheck, Sliders, Flame, Zap, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  stats: NinjaUserStats;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, stats }) => {
  const tabs = [
    {
      id: 'sensei' as TabType,
      labelArabic: 'السينسي الذكي',
      icon: Bot,
      accent: 'green',
      badge: 'AI 3.0',
    },
    {
      id: 'stealth' as TabType,
      labelArabic: 'المهمات الخفية',
      icon: Crosshair,
      accent: 'green',
      badge: 'STEALTH',
    },
    {
      id: 'wisdom' as TabType,
      labelArabic: 'لفافة الحكمة',
      icon: Scroll,
      accent: 'purple',
      badge: 'CODE',
    },
    {
      id: 'rank' as TabType,
      labelArabic: 'خريطة النينجا',
      icon: Trophy,
      accent: 'purple',
    },
    {
      id: 'vault' as TabType,
      labelArabic: 'خزنة الذاكرة',
      icon: ShieldCheck,
      accent: 'green',
      countBadge: stats.wordsLearnedCount,
    },
    {
      id: 'audio' as TabType,
      labelArabic: 'أصوات السايبر',
      icon: Sliders,
      accent: 'purple',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo & Cyber Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 border border-[#39FF14] rotate-45 bg-black shrink-0 shadow-[0_0_15px_rgba(57,255,20,0.4)]">
              <span className="text-xl -rotate-45 font-bold">🥷</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-serif">
                  𝓢𝓗𝓮𝓻𝓸<span className="text-[#39FF14]">𝓝𝓲𝓷𝓪</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-black bg-[#39FF14] rounded-md shadow-[0_0_10px_#39FF14]">
                  3.0 AAA
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Cyberpunk Dojo · الإنجليزية البريطانية بذكاء النينجا ⚡
              </p>
            </div>
          </div>

          {/* Right User Stats (Streak, XP, Rank Title) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-bold shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{stats.streakDays} أيام</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#051805] border border-[#39FF14]/40 text-[#39FF14] text-xs sm:text-sm font-mono font-bold shadow-[0_0_10px_rgba(57,255,20,0.2)]">
              <Zap className="w-4 h-4 text-[#39FF14]" />
              <span>{stats.xp} XP</span>
            </div>

            {/* Rank Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#150520] border border-[#A855F7]/40 text-[#C084FC] text-xs font-bold">
              <Award className="w-4 h-4 text-[#C084FC]" />
              <span>{stats.ninjaRankTitle}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 py-2 border-t border-white/5 overflow-x-auto no-scrollbar" dir="rtl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isPurple = tab.accent === 'purple';

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? isPurple
                      ? 'text-white bg-[#150520] border border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'text-black bg-[#39FF14] border border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.6)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (isPurple ? 'text-[#C084FC]' : 'text-black') : 'text-gray-400'}`} />
                <span>{tab.labelArabic}</span>

                {tab.badge && (
                  <span className={`px-1.5 py-0.2 text-[8px] font-mono font-black uppercase tracking-wider rounded-full ${
                    isActive ? (isPurple ? 'bg-white text-black' : 'bg-black text-[#39FF14]') : 'bg-white/10 text-gray-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}

                {typeof tab.countBadge === 'number' && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full border ${
                    isActive ? 'bg-black text-[#39FF14] border-[#39FF14]' : 'bg-black/60 text-gray-300 border-white/10'
                  }`}>
                    {tab.countBadge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
