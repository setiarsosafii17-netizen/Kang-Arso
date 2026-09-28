import React from 'react';
import { REALMS } from '../../data/realmsData';
import { Compass, Sparkles, Lock, ArrowRight } from 'lucide-react';

interface MapModalProps {
  currentRealmId: number;
  unlockedRealms: number[];
  crystalsCount: number;
  onSelectRealm: (realmId: number) => void;
  onClose: () => void;
  fontSizeClass?: string;
}

export const MapModal: React.FC<MapModalProps> = ({
  currentRealmId,
  unlockedRealms,
  crystalsCount,
  onSelectRealm,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-4xl h-[88vh] rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Peta Pulau Kerajaan Numeria
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                PILIH WILAYAH PETUALANGAN
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

        {/* Content Island Grid */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-slate-300">
            Jelajahi 5 pulau matematika untuk mengumpulkan seluruh pecahan Kristal Energi Eksponen:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REALMS.map((realm) => {
              const isUnlocked = unlockedRealms.includes(realm.id);
              const isCurrent = realm.id === currentRealmId;
              const hasCrystal = realm.id <= crystalsCount;

              return (
                <div
                  key={realm.id}
                  className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isCurrent
                      ? 'bg-slate-800 border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                      : isUnlocked
                      ? 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        Pulau #{realm.id}
                      </span>
                      {hasCrystal ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 font-bold">
                          <Sparkles className="w-3.5 h-3.5" /> Kristal Aktif
                        </span>
                      ) : !isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Lock className="w-3.5 h-3.5" /> Terkunci
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-game font-bold text-lg text-white mb-1">{realm.name}</h4>
                    <p className="text-xs text-amber-300/90 font-mono mb-2">{realm.formula}</p>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">{realm.description}</p>

                    <div className="space-y-1 mb-4">
                      {realm.topics.map((t, i) => (
                        <span
                          key={i}
                          className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 mr-1.5 mb-1 border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="w-full py-2.5 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs text-center border border-amber-400/40">
                        Lokasi Kamu Saat Ini
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => {
                          onSelectRealm(realm.id);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-game font-bold text-xs active:scale-95 transition-all shadow flex items-center justify-center gap-2"
                      >
                        <span>Menuju Pulau Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-600 font-mono text-xs text-center border border-slate-800">
                        Selesaikan Guardian Sebelumnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 bg-slate-950 border-t border-slate-800">
          <span className="text-xs font-mono text-cyan-300">
            💎 Total Kristal Terkumpul: {crystalsCount} / 5
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
          >
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
};
