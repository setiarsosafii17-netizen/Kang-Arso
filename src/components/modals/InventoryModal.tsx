import React from 'react';
import { PlayerStats } from '../../types/game';
import { Sparkles, Coins, Award, ShieldCheck } from 'lucide-react';

interface InventoryModalProps {
  stats: PlayerStats;
  onClose: () => void;
  fontSizeClass?: string;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  stats,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const crystalDetails = [
    {
      id: 1,
      name: 'Kristal Basis & Eksponen',
      origin: 'Desa Pangkat',
      rule: 'aⁿ = perkalian berulang sebanyak n kali',
      desc: 'Memancarkan cahaya hijau zamrud pemula.',
    },
    {
      id: 2,
      name: 'Kristal Perkalian Eksponen',
      origin: 'Hutan Perkalian',
      rule: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
      desc: 'Menyinari rimbunnya hutan dengan cahaya biru safir.',
    },
    {
      id: 3,
      name: 'Kristal Pembagian Eksponen',
      origin: 'Gunung Pembagian',
      rule: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
      desc: 'Batu topas kuning melambangkan selisih pangkat.',
    },
    {
      id: 4,
      name: 'Kristal Pangkat Bertingkat',
      origin: 'Gua Pangkat',
      rule: '(aᵐ)ⁿ = aᵐˣⁿ',
      desc: 'Amethyst ungu yang melipatgandakan eksponen.',
    },
    {
      id: 5,
      name: 'Kristal Mahkota Raja Numeria',
      origin: 'Kastel Eksponen',
      rule: 'a⁰ = 1 | a⁻ⁿ = 1/aⁿ | HOTS',
      desc: 'Kristal utama kerajaan pemersatu seluruh sifat.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Tas Penjelajah Matematika
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                INVENTORI & KRISTAL ENERGI
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
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Wallet summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Coins className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-mono block">Koin Emas</span>
              <span className="text-base font-mono font-bold text-amber-300">{stats.coins}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Sparkles className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-mono block">Kristal Terkumpul</span>
              <span className="text-base font-mono font-bold text-cyan-300">{stats.crystals} / 5</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-mono block">Gelar Petualang</span>
              <span className="text-base font-game font-bold text-emerald-300">{stats.levelTitle}</span>
            </div>
          </div>

          {/* Crystals Detailed Shards List */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Pecahan Kristal Energi Eksponen
            </h4>

            <div className="space-y-3">
              {crystalDetails.map((c) => {
                const obtained = c.id <= stats.crystals;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-4 transition-all ${
                      obtained
                        ? 'bg-slate-800/80 border-cyan-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow ${
                        obtained
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white animate-pulse'
                          : 'bg-slate-900 text-slate-700'
                      }`}
                    >
                      💎
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-white text-sm sm:text-base">{c.name}</h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                          {c.origin}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-cyan-300/90 font-semibold mt-0.5">{c.rule}</p>
                      <p className="text-xs text-slate-400 mt-1">{obtained ? c.desc : 'Belum ditemukan. Kalahkan Guardian wilayah terkait.'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
          >
            Tutup Tas
          </button>
        </div>
      </div>
    </div>
  );
};
