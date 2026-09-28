import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { Play, BookOpen, Target, Trophy, Users, BarChart3, Settings, Sparkles, User } from 'lucide-react';

interface MainMenuProps {
  stats: PlayerStats;
  onStartAdventure: (playerName: string) => void;
  onOpenStudy: () => void;
  onOpenPractice: () => void;
  onOpenBossGauntlet: () => void;
  onOpenClassMode: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenSettings: () => void;
  fontSizeClass?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  stats,
  onStartAdventure,
  onOpenStudy,
  onOpenPractice,
  onOpenBossGauntlet,
  onOpenClassMode,
  onOpenTeacherDashboard,
  onOpenSettings,
  fontSizeClass = 'text-base',
}) => {
  const [name, setName] = useState(stats.name || 'Penjelajah Muda');

  return (
    <div className={`relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8 overflow-y-auto select-none ${fontSizeClass}`}>
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-sky-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Player Profile Input */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow">
          <User className="w-4 h-4 text-amber-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Penjelajah..."
            className="bg-transparent text-sm font-bold text-white outline-none w-36 sm:w-48 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 px-3 py-1 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            💎 {stats.crystals}/5 Kristal
          </span>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow"
            title="Pengaturan"
          >
            <Settings className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Title Hero Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto my-auto py-6 sm:py-10">
        {/* Floating 3D Diamond Crystal Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-1 shadow-2xl shadow-cyan-500/30 animate-float-slow mb-4">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl">💎</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-game font-bold text-white tracking-tight leading-tight">
          EXPONENT ADVENTURE
        </h1>

        <p className="text-sm sm:text-lg text-amber-300 font-semibold tracking-wide mt-2">
          &ldquo;Jelajahi Dunia Eksponen, Pecahkan Tantangan, Jadilah Master Matematika!&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
          Kerajaan Numeria dalam bahaya setelah Kristal Energi Eksponen pecah. Jelajahi 5 pulau matematika, taklukkan Guardian, dan kumpulkan seluruh pecahannya!
        </p>

        {/* Primary Action Buttons Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto mt-8">
          {/* 1. MULAI PETUALANGAN */}
          <button
            onClick={() => onStartAdventure(name)}
            className="sm:col-span-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 active:scale-[0.98] text-slate-950 font-game font-bold text-xl sm:text-2xl shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-3 transition-all"
          >
            <Play className="w-7 h-7 fill-current" />
            <span>MULAI PETUALANGAN</span>
          </button>

          {/* 2. BELAJAR DULU */}
          <button
            onClick={onOpenStudy}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border-2 border-sky-500/50 hover:border-sky-400 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-sky-300">
                📚 BELAJAR DULU
              </h4>
              <p className="text-[11px] text-slate-400">Ringkasan konsep & simulasi visual</p>
            </div>
          </button>

          {/* 3. MODE LATIHAN */}
          <button
            onClick={onOpenPractice}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border-2 border-emerald-500/50 hover:border-emerald-400 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300">
                🎮 MODE LATIHAN
              </h4>
              <p className="text-[11px] text-slate-400">5 Mini Game edukatif seru</p>
            </div>
          </button>

          {/* 4. MODE TANTANGAN */}
          <button
            onClick={onOpenBossGauntlet}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border-2 border-rose-500/50 hover:border-rose-400 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-rose-300">
                🏆 MODE TANTANGAN
              </h4>
              <p className="text-[11px] text-slate-400">Pertarungan Raja Eksponen & Boss</p>
            </div>
          </button>

          {/* 5. MODE KELAS */}
          <button
            onClick={onOpenClassMode}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border-2 border-indigo-500/50 hover:border-indigo-400 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300">
                👥 MODE KELAS
              </h4>
              <p className="text-[11px] text-slate-400">TV Interaktif & multiplayer 1-4 tim</p>
            </div>
          </button>
        </div>

        {/* Secondary Bottom Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={onOpenTeacherDashboard}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 HASIL BELAJAR (DASHBOARD GURU)</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>⚙ PENGATURAN</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-[11px] text-slate-500 max-w-md mx-auto">
        <span>Cocok untuk TV Interaktif, Tablet, dan Ponsel · Kontrol Touchscreen & Keyboard Didukung</span>
      </div>
    </div>
  );
};
