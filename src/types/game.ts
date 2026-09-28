export type DifficultyLevel = 'pemula' | 'penjelajah' | 'petualang' | 'master' | 'legend';

export interface MathQuestion {
  id: string;
  realmId: number;
  topic: string;
  level: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  hints: [string, string]; // [Cognitive nudge, Explicit rule hint]
  explanation: string;
  ruleFormula: string;
  isHOTS?: boolean;
}

export interface Realm {
  id: number;
  name: string;
  themeTitle: string;
  description: string;
  color: string;
  bgGradient: string;
  topics: string[];
  formula: string;
  npcName: string;
  npcRole: string;
  npcGreeting: string;
  bossName: string;
  bossTitle: string;
  bossMaxHealth: number;
}

export interface PlayerStats {
  name: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  score: number;
  crystals: number;
  coins: number;
  correctAnswers: number;
  wrongAnswers: number;
  playTimeSeconds: number;
  currentRealmId: number;
  unlockedRealms: number[];
  completedQuests: string[];
  masteredTopics: string[];
}

export interface TeacherRecord {
  id: string;
  studentName: string;
  date: string;
  score: number;
  xp: number;
  correct: number;
  wrong: number;
  accuracy: number;
  timeSpentMinutes: number;
  masteredTopics: string[];
  needsPracticeTopics: string[];
  highestLevel: string;
}

export interface ClassModePlayer {
  id: number;
  name: string;
  score: number;
  correct: number;
  color: string;
}

export interface ClassGameConfig {
  numPlayers: 1 | 2 | 4;
  numQuestions: number;
  difficulty: 'semua' | 'pemula' | 'penjelajah' | 'petualang' | 'master' | 'legend';
  realmFilter: number; // 0 for all
  timeLimitSec: number; // 0 for unlimited
}

export interface GameSettings {
  musicVolume: number;
  soundVolume: number;
  musicEnabled: boolean;
  soundEnabled: boolean;
  subtitlesEnabled: boolean;
  tvFontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
}
