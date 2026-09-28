import React from 'react';
import { loadLeaderboard } from '../../utils/storage';
import { Trophy, Sparkles, Clock, Target, Award } from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
  fontSizeClass?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const entries = loadLeaderboard();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Peringkat Penjelajah Numeria
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                PAPAN PERINGKAT KERAJAAN
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Pemenang ditentukan berdasarkan kombinasi <strong>ketepatan matematika (akurasi)</strong>, perolehan <strong>Kristal Eksponen</strong>, dan total XP penyelesaian misi, bukan semata-mata kecepatan bermain!
          </p>

          <div className="space-y-2.5">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  idx === 0
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-lg'
                    : idx === 1
                    ? 'bg-slate-800/80 border-slate-600'
                    : idx === 2
                    ? 'bg-slate-800/60 border-amber-700/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      {entry.name}
                      {idx === 0 && <span className="text-sm">👑</span>}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                      <span className="flex items-center gap-1 text-cyan-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" /> {entry.crystals} Kristal
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Target className="w-3.5 h-3.5" /> {entry.accuracy}% Akurasi
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {entry.timeFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-amber-300 block">
                    {entry.xp}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    Total XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
