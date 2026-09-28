import React from 'react';
import { PlayerStats, Realm } from '../../types/game';
import { Sparkles, Award, Coins, Volume2, VolumeX, Menu, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface GameHUDProps {
  stats: PlayerStats;
  currentRealm: Realm;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMenu: () => void;
  subtitleText: string | null;
  fontSizeClass?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  currentRealm,
  soundEnabled,
  onToggleSound,
  onOpenMenu,
  subtitleText,
  fontSizeClass = 'text-sm',
}) => {
  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const xpPercent = Math.min(100, Math.round((stats.xp / stats.nextLevelXp) * 100));

  return (
    <div className={`absolute top-0 left-0 right-0 p-3 sm:p-5 pointer-events-none z-30 select-none ${fontSizeClass}`}>
      {/* Top Bar Layout */}
      <div className="flex items-start justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Player Profile & Level Progress */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Level & Player Badge */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-game font-bold text-lg shadow">
              {stats.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide">{stats.name}</span>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {stats.levelTitle}
                </span>
              </div>
              {/* XP Progress Bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  {stats.xp} / {stats.nextLevelXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Current Island Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 w-fit">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentRealm.color }} />
            <span className="text-xs font-bold text-slate-200">{currentRealm.name}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">| {currentRealm.formula}</span>
          </div>
        </div>

        {/* Center: Crystals & Stat Counters */}
        <div className="hidden md:flex items-center gap-3 pointer-events-auto">
          {/* Crystal Collection Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 shadow-xl">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((idx) => {
                const collected = idx <= stats.crystals;
                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                      collected
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                        : 'bg-slate-800 text-slate-600 border border-slate-700'
                    }`}
                    title={`Kristal Wilayah ${idx}`}
                  >
                    💎
                  </div>
                );
              })}
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 ml-1">
              {stats.crystals}/5
            </span>
          </div>

          {/* Coins & Score */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{stats.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{stats.score} Poin</span>
            </div>
          </div>
        </div>

        {/* Right: Accuracy, Timer, and Menu Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Accuracy Tracker */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold" title="Jawaban Benar">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stats.correctAnswers}
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-rose-400 font-bold" title="Jawaban Salah">
              <XCircle className="w-3.5 h-3.5" />
              {stats.wrongAnswers}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {formatTime(stats.playTimeSeconds)}
            </span>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xl active:scale-95 transition-all"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
          </button>

          {/* Main Menu Button */}
          <button
            onClick={onOpenMenu}
            className="flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm border border-sky-400/40 shadow-xl active:scale-95 transition-all"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>

      {/* Accessibility Subtitle Toast */}
      {subtitleText && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none transition-all">
          <div className="px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-yellow-300 text-xs sm:text-sm font-semibold tracking-wide shadow-2xl">
            {subtitleText}
          </div>
        </div>
      )}
    </div>
  );
};
