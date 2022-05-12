import React, { useState, useEffect } from 'react';
import { TabType, VoiceSettings, WordItem, NinjaUserStats, GrammarRule } from './types';
import { initialWords } from './data/initialData';
import { Navigation } from './components/Navigation';
import { SenseiTab } from './components/SenseiTab';
import { MemoryVaultTab } from './components/MemoryVaultTab';
import { StealthMissionsTab } from './components/StealthMissionsTab';
import { ScrollOfWisdomTab } from './components/ScrollOfWisdomTab';
import { RankSystemTab } from './components/RankSystemTab';
import { AudioSettingsTab } from './components/AudioSettingsTab';
import { GrammarModal } from './components/GrammarModal';

export default function App() {
  // Current active tab
  const [currentTab, setCurrentTab] = useState<TabType>('sensei');

  // Active Grammar Modal Popup
  const [activeGrammarRule, setActiveGrammarRule] = useState<GrammarRule | null>(null);

  // Voice Settings State (Persisted in localStorage)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('sheroninja_voice_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      profile: 'the_sensei',
      accent: 'british_rp',
      speed: 1.0,
      pitch: 1.0,
      soundEffects: true,
      autoSpeak: true,
    };
  });

  // Saved Words State in Memory Vault
  const [words, setWords] = useState<WordItem[]>(() => {
    const saved = localStorage.getItem('sheroninja_words');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialWords;
  });

  // User XP and Stats State
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sheroninja_xp');
    return saved ? parseInt(saved, 10) : 450;
  });

  // Save to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('sheroninja_voice_settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    localStorage.setItem('sheroninja_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('sheroninja_xp', xp.toString());
  }, [xp]);

  // Calculate Ninja Rank Title based on XP
  const getNinjaRankTitle = (xpPoints: number) => {
    if (xpPoints >= 1500) return 'أسطورة الساموراي والظل 👑';
    if (xpPoints >= 1000) return 'سيد النينجا الأسود 🥷';
    if (xpPoints >= 700) return 'نينجا سايبر محترف ⚡';
    if (xpPoints >= 400) return 'سيف الظل السايبر 🔮';
    if (xpPoints >= 150) return 'نينجا صاعد 🗡️';
    return 'مبتدئ الدوجو 🌱';
  };

  const userStats: NinjaUserStats = {
    level: Math.floor(xp / 250) + 1,
    xp: xp,
    streakDays: 7,
    wordsLearnedCount: words.length,
    challengesCompleted: 5,
    ninjaRankTitle: getNinjaRankTitle(xp),
  };

  // Add words to Memory Vault
  const handleSaveWordsToVault = (newWords: WordItem[]) => {
    setWords((prev) => {
      const existingEng = new Set(prev.map((w) => w.english.toLowerCase()));
      const filteredNew = newWords.filter((w) => !existingEng.has(w.english.toLowerCase()));
      return [...filteredNew, ...prev];
    });
    setXp((prev) => prev + newWords.length * 20);
  };

  // Update Word Mastery Level
  const handleUpdateWordMastery = (wordId: string, newLevel: number) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id === wordId) {
          let stageLabel: WordItem['stageLabel'] = 'مبتدئ';
          if (newLevel >= 80) stageLabel = 'سيد النينجا';
          else if (newLevel >= 60) stageLabel = 'نينجا محترف';
          else if (newLevel >= 40) stageLabel = 'نينجا صاعد';

          return { ...w, masteryLevel: newLevel, stageLabel, timesPracticed: w.timesPracticed + 1 };
        }
        return w;
      })
    );
  };

  // Delete Word
  const handleDeleteWord = (wordId: string) => {
    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  // Toggle Favorite
  const handleToggleFavorite = (wordId: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  // Update Voice Settings
  const handleUpdateVoiceSettings = (newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Add XP
  const handleAddXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  return (
    <div className="min-h-screen bg-black text-[#E0E0E0] font-sans selection:bg-[#39FF14] selection:text-black pb-12">
      {/* Navigation & Dojo Header */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} stats={userStats} />

      {/* Main Content Body */}
      <main className="transition-all duration-300">
        {currentTab === 'sensei' && (
          <SenseiTab
            voiceSettings={voiceSettings}
            onSaveWordsToVault={handleSaveWordsToVault}
            onOpenGrammarModal={setActiveGrammarRule}
            savedWordIds={words.map((w) => w.english)}
          />
        )}

        {currentTab === 'stealth' && (
          <StealthMissionsTab
            voiceSettings={voiceSettings}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'wisdom' && (
          <ScrollOfWisdomTab
            voiceSettings={voiceSettings}
          />
        )}

        {currentTab === 'rank' && (
          <RankSystemTab
            stats={userStats}
            voiceSettings={voiceSettings}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'vault' && (
          <MemoryVaultTab
            words={words}
            voiceSettings={voiceSettings}
            onUpdateWordMastery={handleUpdateWordMastery}
            onDeleteWord={handleDeleteWord}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'audio' && (
          <AudioSettingsTab
            settings={voiceSettings}
            onUpdateSettings={handleUpdateVoiceSettings}
          />
        )}
      </main>

      {/* Grammar Modal Window */}
      <GrammarModal rule={activeGrammarRule} onClose={() => setActiveGrammarRule(null)} />
    </div>
  );
}
