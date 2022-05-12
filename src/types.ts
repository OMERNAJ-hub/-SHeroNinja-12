export type TabType = 'sensei' | 'stealth' | 'wisdom' | 'rank' | 'vault' | 'audio';

export type VoiceProfileType = 
  | 'tiny_ninja' 
  | 'little_sakura' 
  | 'sensei' 
  | 'assassin' 
  | 'guardian' 
  | 'shadow';

export type AccentType = 'british_rp' | 'cockney' | 'northern';

export interface VoiceSettings {
  profile: VoiceProfileType;
  accent: AccentType;
  speed: number; // 0.7 to 1.3
  pitch: number; // 0.8 to 1.4
  soundEffects: boolean;
  autoSpeak: boolean;
}

export interface GrammarRule {
  title: string;
  explanationArabic: string;
  formula?: string;
  correctExample: string;
  wrongExample?: string;
  ninjaTip: string;
}

export interface WordItem {
  id: string;
  english: string;
  arabicMeaning: string;
  phonetic: string;
  category: 'slang' | 'idiom' | 'formal' | 'daily' | 'grammar';
  contextExplanationArabic: string;
  exampleSentence: string;
  exampleTranslationArabic: string;
  masteryLevel: number; // 0 - 100
  stageLabel: 'مبتدئ' | 'نينجا صاعد' | 'نينجا محترف' | 'سيد النينجا';
  lastReviewed?: string;
  timesPracticed: number;
  isFavorite?: boolean;
}

export interface AlternativeExpression {
  english: string;
  arabicType: 'عامية بريطانية' | 'رسمية وأنيقة' | 'تعبير عصري';
  noteArabic: string;
}

export interface SenseiResponse {
  arabicOriginal: string;
  britishMainTranslation: string;
  mainPhonetic: string;
  arabicExplanation: string; // e.g., "عشان تبان كأنك بريطاني أصلي..."
  britishNuance: string; // British culture context
  alternativeExpressions: AlternativeExpression[];
  grammarRule?: GrammarRule;
  vocabularyToSave: Array<{
    english: string;
    arabicMeaning: string;
    phonetic: string;
    category: 'slang' | 'idiom' | 'formal' | 'daily' | 'grammar';
    contextExplanationArabic: string;
    exampleSentence: string;
    exampleTranslationArabic: string;
  }>;
  ninjaLevelTip: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sensei';
  timestamp: string;
  text?: string;
  data?: SenseiResponse;
  isLoading?: boolean;
  error?: string;
}

export interface ChallengeOption {
  id: string;
  textEnglish: string;
  explanationArabic: string;
  isCorrect: boolean;
}

export interface ChallengeQuestion {
  id: string;
  situationArabic: string;
  questionArabic: string;
  options: ChallengeOption[];
  hintArabic?: string;
  targetWord?: string;
  grammarModal?: GrammarRule;
}

export interface ChallengeScenario {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  descriptionArabic: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب' | 'أسطوري';
  badge: string;
  xpReward: number;
  questions: ChallengeQuestion[];
}

export interface NinjaUserStats {
  level: number;
  xp: number;
  streakDays: number;
  wordsLearnedCount: number;
  challengesCompleted: number;
  ninjaRankTitle: string;
}
