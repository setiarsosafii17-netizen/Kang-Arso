import { PlayerStats, GameSettings, TeacherRecord } from '../types/game';

const STORAGE_KEY_STATS = 'exponent_adventure_stats_v1';
const STORAGE_KEY_SETTINGS = 'exponent_adventure_settings_v1';
const STORAGE_KEY_TEACHER = 'exponent_adventure_teacher_v1';
const STORAGE_KEY_LEADERBOARD = 'exponent_adventure_leaderboard_v1';

export const INITIAL_STATS: PlayerStats = {
  name: 'Penjelajah Muda',
  level: 1,
  levelTitle: 'PEMULA',
  xp: 0,
  nextLevelXp: 500,
  score: 0,
  crystals: 0,
  coins: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  playTimeSeconds: 0,
  currentRealmId: 1,
  unlockedRealms: [1],
  completedQuests: [],
  masteredTopics: [],
};

export const INITIAL_SETTINGS: GameSettings = {
  musicVolume: 0.5,
  soundVolume: 0.8,
  musicEnabled: true,
  soundEnabled: true,
  subtitlesEnabled: true,
  tvFontSize: 'normal',
  highContrast: false,
};

export function getLevelTitle(level: number): string {
  switch (level) {
    case 1:
      return 'PEMULA';
    case 2:
      return 'PENJELAJAH';
    case 3:
      return 'PETUALANG';
    case 4:
      return 'MASTER';
    case 5:
    default:
      return 'LEGEND';
  }
}

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_STATS, ...parsed };
    }
  } catch {
    // fallback
  }
  return INITIAL_STATS;
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch {
    // fallback
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // fallback
  }
}

export function loadTeacherRecords(): TeacherRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEACHER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Default mock seeds for classroom demonstration if empty
  return [
    {
      id: 'rec_1',
      studentName: 'Ahmad Faiz',
      date: '2026-09-28',
      score: 1850,
      xp: 2450,
      correct: 14,
      wrong: 2,
      accuracy: 87.5,
      timeSpentMinutes: 18,
      masteredTopics: ['Pengertian Eksponen', 'Perkalian Eksponen', 'Pembagian Eksponen'],
      needsPracticeTopics: ['Pangkat Negatif'],
      highestLevel: 'MASTER',
    },
    {
      id: 'rec_2',
      studentName: 'Siti Rahma',
      date: '2026-09-28',
      score: 2100,
      xp: 3200,
      correct: 16,
      wrong: 1,
      accuracy: 94.1,
      timeSpentMinutes: 22,
      masteredTopics: ['Basis & Eksponen', 'Perkalian Eksponen', 'Pangkat dari Pangkat', 'Pangkat Nol'],
      needsPracticeTopics: ['Soal HOTS Cerita'],
      highestLevel: 'LEGEND',
    },
  ];
}

export function recordTeacherSession(record: TeacherRecord) {
  try {
    const existing = loadTeacherRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(updated));
  } catch {
    // fallback
  }
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  crystals: number;
  correct: number;
  accuracy: number;
  timeFormatted: string;
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [
    { id: 'lb_1', name: 'Budi Santoso', xp: 4200, crystals: 5, correct: 24, accuracy: 96, timeFormatted: '14:20' },
    { id: 'lb_2', name: 'Dewi Lestari', xp: 3750, crystals: 4, correct: 20, accuracy: 91, timeFormatted: '16:05' },
    { id: 'lb_3', name: 'Rian Pratama', xp: 3100, crystals: 3, correct: 17, accuracy: 85, timeFormatted: '18:40' },
  ];
}

export function saveLeaderboardEntry(entry: LeaderboardEntry) {
  try {
    const existing = loadLeaderboard();
    const updated = [...existing, entry]
      .sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy)
      .slice(0, 10);
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(updated));
  } catch {
    // fallback
  }
}
