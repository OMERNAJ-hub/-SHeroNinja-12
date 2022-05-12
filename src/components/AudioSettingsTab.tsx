import React from 'react';
import { VoiceSettings, VoiceProfileType, AccentType } from '../types';
import { speakText, playSwordSlashSFX, playDojoGongSFX, playSuccessChime } from '../utils/audio';
import { Volume2, Sliders, Play, Sparkles, User, Check, Mic, Music } from 'lucide-react';

interface AudioSettingsTabProps {
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
}

export const AudioSettingsTab: React.FC<AudioSettingsTabProps> = ({ settings, onUpdateSettings }) => {
  const voiceProfiles: Array<{
    id: VoiceProfileType;
    labelArabic: string;
    labelEnglish: string;
    icon: string;
    desc: string;
    tag: string;
    accentColor: 'green' | 'purple';
  }> = [
    {
      id: 'tiny_ninja',
      labelArabic: 'طفل النينجا (Tiny Ninja)',
      labelEnglish: 'Tiny Ninja - Boy',
      icon: '🥷',
      desc: 'صوت طفل نينجا حماسي وسريع مع طبقة صوتية عالية ومميزة.',
      tag: 'سريع وحاد ⚡',
      accentColor: 'green',
    },
    {
      id: 'little_sakura',
      labelArabic: 'زهرة الساكورا (Little Sakura)',
      labelEnglish: 'Little Sakura - Girl',
      icon: '🌸',
      desc: 'صوت فتاة نينجا رقيقة ونقية بنطق بريطاني واضح وجذاب.',
      tag: 'نقي وعذب ✨',
      accentColor: 'purple',
    },
    {
      id: 'sensei',
      labelArabic: 'الشيخ المربي (The Sensei)',
      labelEnglish: 'The Sensei - Old Man',
      icon: '👴🏻',
      desc: 'صوت حكيم بريطاني قديم يعلمك أسرار اللغة بنبرة متأنية ورزينة.',
      tag: 'حكيم وقور 📜',
      accentColor: 'green',
    },
    {
      id: 'assassin',
      labelArabic: 'القاتلة المأجورة (The Assassin)',
      labelEnglish: 'The Assassin - Young Woman',
      icon: '🗡️',
      desc: 'صوت امرأة شابة حاد، دقيق وسريع، يقطع الجمل بأسلوب لندني راقٍ.',
      tag: 'دقيق وقاطع 🗡️',
      accentColor: 'purple',
    },
    {
      id: 'guardian',
      labelArabic: 'الحارس الفولاذي (The Guardian)',
      labelEnglish: 'The Guardian - Deep Male',
      icon: '🛡️',
      desc: 'صوت ذكوري عميق جداً وبسالة بريطانية تعطي هيبة فائقة.',
      tag: 'جهوري وفولاذي 🛡️',
      accentColor: 'green',
    },
    {
      id: 'shadow',
      labelArabic: 'صوت الظل الهمسي (The Shadow)',
      labelEnglish: 'The Shadow - Whisper Voice',
      icon: '👤',
      desc: 'صوت همس خفي وسري مع تأثير التنفس المخفي لمحاكاة مهام النينجا.',
      tag: 'همس السايبر 👁️',
      accentColor: 'purple',
    },
  ];

  const accents: Array<{ id: AccentType; labelArabic: string; note: string }> = [
    { id: 'british_rp', labelArabic: 'اللكنة اللندنية الفصيحة (RP)', note: 'اللكنة القياسية لملوك بريطانيا وهيئة الإذاعة BBC' },
    { id: 'cockney', labelArabic: 'عامية شرق لندن (Cockney)', note: 'لكنة حية من أحياء الشارع البريطاني الأصيل' },
    { id: 'northern', labelArabic: 'اللكنة الشمالية الدافئة (Northern)', note: 'لكنة مانشستر ويوركشاير الودودة' },
  ];

  const handleTestVoice = () => {
    speakText("Cheers mate! Welcome to the Sheroninja Dojo.", settings);
  };

  const handleTestSFX = (type: 'slash' | 'gong' | 'chime') => {
    if (type === 'slash') playSwordSlashSFX();
    if (type === 'gong') playDojoGongSFX();
    if (type === 'chime') playSuccessChime();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8" dir="rtl">
      {/* Settings Banner */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] ninja-border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#001a05] border border-[#00FF41]/50 rounded-2xl text-[#00FF41] text-2xl">
            🎛️
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-serif">إعدادات الصوت والملفات الصوتية</h2>
            <p className="text-xs text-[#00FF41] font-medium">
              خصص نبرة ونوع صوت معلم النينجا وتأثيرات السيوف والجرس لتدريب صوتي ممتع!
            </p>
          </div>
        </div>

        <button
          onClick={handleTestVoice}
          className="px-5 py-2.5 rounded-xl ninja-btn-neon text-black font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>اختبار الصوت الآن</span>
        </button>
      </div>

      {/* Voice Profiles Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#39FF14] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C084FC]" /> اختر أسلوب الصوت الذكي (6 AI Voice Profiles):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {voiceProfiles.map((p) => {
            const isSelected = settings.profile === p.id;
            const isGreen = p.accentColor === 'green';

            return (
              <button
                key={p.id}
                onClick={() => {
                  onUpdateSettings({ profile: p.id });
                  speakText(`Cheers! Selected ${p.labelEnglish} voice profile.`, { ...settings, profile: p.id });
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden group ${
                  isSelected
                    ? isGreen
                      ? 'bg-[#051805] border-[#39FF14] text-white shadow-[0_0_25px_rgba(57,255,20,0.3)]'
                      : 'bg-[#150520] border-[#A855F7] text-white shadow-[0_0_25px_rgba(168,85,247,0.35)]'
                    : 'bg-black/70 backdrop-blur-md border-white/10 text-gray-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl shrink-0 p-2 bg-black/60 rounded-xl border border-white/10 shadow-inner">{p.icon}</span>
                    <div>
                      <span className="font-bold text-sm text-white block">{p.labelArabic}</span>
                      <span className="text-[10px] text-gray-400 font-mono block ltr text-right">{p.labelEnglish}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className={`p-1 rounded-full ${isGreen ? 'bg-[#39FF14] text-black' : 'bg-[#A855F7] text-white'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed text-right">{p.desc}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 w-full">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGreen ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30' : 'bg-[#A855F7]/10 text-[#C084FC] border border-[#A855F7]/30'}`}>
                    {p.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono group-hover:text-white transition-colors flex items-center gap-1">
                    <Play className="w-3 h-3 text-[#39FF14]" /> استمع للعينّة
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* British Accent Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#00FF41] flex items-center gap-2">
          <Mic className="w-4 h-4" /> نمط اللهجة البريطانية (Accent Tuning):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accents.map((acc) => {
            const isSelected = settings.accent === acc.id;

            return (
              <button
                key={acc.id}
                onClick={() => onUpdateSettings({ accent: acc.id })}
                className={`p-3.5 rounded-xl border text-right transition-all space-y-1 ${
                  isSelected
                    ? 'bg-[#001a05] border-[#00FF41] text-[#00FF41]'
                    : 'bg-[#0c0c0c] border-[#222222] text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="font-bold text-xs block text-white font-serif">{acc.labelArabic}</span>
                <p className="text-[11px] text-gray-400">{acc.note}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pitch & Speed Controls */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#222222] space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00FF41]" /> التحكم بدقة سرعة وطبقة الصوت:
        </h3>

        {/* Speed Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-300">سرعة نطق الجمل الإنجليزية (Speed Rate)</span>
            <span className="text-[#00FF41] font-mono">{settings.speed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.05"
            value={settings.speed}
            onChange={(e) => onUpdateSettings({ speed: parseFloat(e.target.value) })}
            className="w-full accent-[#00FF41] bg-[#111111] rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Pitch Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-300">درجة حدة الصوت (Voice Pitch)</span>
            <span className="text-[#00FF41] font-mono">{settings.pitch.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={settings.pitch}
            onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
            className="w-full accent-[#00FF41] bg-[#111111] rounded-lg cursor-pointer h-2"
          />
        </div>
      </div>

      {/* Sound Effects & Toggles */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#222222] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Music className="w-4 h-4 text-[#00FF41]" /> المؤثرات الصوتية والتشغيل التلقائي:
        </h3>

        <div className="space-y-3">
          {/* Sound Effects Toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-[#222222] cursor-pointer">
            <div>
              <span className="font-bold text-xs text-white block">تفعيل مؤثرات النينجا الصوتية (SFX)</span>
              <span className="text-[11px] text-gray-400">صوت ضربة سيف الكاتانا عند الحفظ وجرس الدوجو</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
              className="w-5 h-5 accent-[#00FF41] rounded cursor-pointer"
            />
          </label>

          {/* Auto Speak Toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-[#222222] cursor-pointer">
            <div>
              <span className="font-bold text-xs text-white block">نطق ترجمة السينسي تلقائياً</span>
              <span className="text-[11px] text-gray-400">استماع الجملة الإنجليزية فور انتهائه من التفليك</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => onUpdateSettings({ autoSpeak: e.target.checked })}
              className="w-5 h-5 accent-[#00FF41] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* SFX Test Buttons */}
        <div className="pt-3 border-t border-[#1a1a1a] flex flex-wrap gap-2">
          <span className="text-xs font-bold text-gray-400 w-full block">اختبار المؤثرات المصنعة:</span>
          <button
            onClick={() => handleTestSFX('slash')}
            className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-[#00FF41] border border-[#222222] text-xs font-bold transition-all"
          >
            ⚔️ ضربة سيف الكاتانا
          </button>
          <button
            onClick={() => handleTestSFX('gong')}
            className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-amber-300 border border-[#222222] text-xs font-bold transition-all"
          >
            🔔 جرس الدوجو
          </button>
          <button
            onClick={() => handleTestSFX('chime')}
            className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-[#00FF41] border border-[#222222] text-xs font-bold transition-all"
          >
            ✨ نغمة النجاح
          </button>
        </div>
      </div>
    </div>
  );
};
