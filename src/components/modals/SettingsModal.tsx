import React from 'react';
import { GameSettings } from '../../types/game';
import { soundEngine } from '../../utils/audio';
import { Volume2, VolumeX, Music, Type, Eye, Save, RotateCcw, Home, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onSaveProgress: () => void;
  onRestartLevel: () => void;
  onReturnToMainMenu: () => void;
  onClose: () => void;
  fontSizeClass?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onSaveProgress,
  onRestartLevel,
  onReturnToMainMenu,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundEngine.setSoundEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleMusic = () => {
    const next = !settings.musicEnabled;
    soundEngine.setMusicEnabled(next);
    onUpdateSettings({ ...settings, musicEnabled: next });
  };

  const toggleSubtitles = () => {
    const next = !settings.subtitlesEnabled;
    soundEngine.subtitlesEnabled = next;
    onUpdateSettings({ ...settings, subtitlesEnabled: next });
  };

  const setFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    onUpdateSettings({ ...settings, tvFontSize: size });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-lg border border-slate-700 shadow">
              ⚙
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Aksesibilitas & Pengaturan
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                PENGATURAN PERMAINAN
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
          {/* Audio Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              1. Audio & Efek Suara
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Music */}
              <button
                onClick={toggleMusic}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  settings.musicEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-2.5 font-bold text-sm">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>Musik Petualangan</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono font-bold">
                  {settings.musicEnabled ? 'AKTIF' : 'MATI'}
                </span>
              </button>

              {/* Sound Effects */}
              <button
                onClick={toggleSound}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  settings.soundEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-2.5 font-bold text-sm">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                  <span>Efek Suara (SFX)</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono font-bold">
                  {settings.soundEnabled ? 'AKTIF' : 'MATI'}
                </span>
              </button>
            </div>
          </div>

          {/* Accessibility: Font Size & Subtitles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              2. Aksesibilitas & Tampilan Layar
            </h4>

            {/* Subtitles */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm font-bold text-white">Teks Subtitle / Notifikasi Suara</p>
                  <p className="text-xs text-slate-400">Menampilkan teks penjelasan setiap efek audio berbunyi.</p>
                </div>
              </div>
              <button
                onClick={toggleSubtitles}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
                  settings.subtitlesEnabled
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {settings.subtitlesEnabled ? 'NYALA' : 'MATI'}
              </button>
            </div>

            {/* Font Size for TV Interaktif */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 mb-2 font-bold text-white text-sm">
                <Type className="w-4 h-4 text-sky-400" />
                <span>Ukuran Teks Tampilan (Optimalisasi TV Interaktif):</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Normal (Laptop/HP)' },
                  { id: 'large', label: 'Besar (Tablet)' },
                  { id: 'extra-large', label: 'Ekstra (TV Interaktif)' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setFontSize(sz.id as 'normal' | 'large' | 'extra-large')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      settings.tvFontSize === sz.id
                        ? 'bg-sky-500 border-sky-400 text-white shadow'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Guide */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <h5 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Panduan Kontrol:
            </h5>
            <ul className="space-y-1 text-slate-300">
              <li>• <strong>Gerak:</strong> Tombol [W, A, S, D], Tombol Arah Panah, atau Virtual Joystick di layar.</li>
              <li>• <strong>Lompat:</strong> Tombol [Spasi] atau Tombol Lompat hijau di kanan bawah.</li>
              <li>• <strong>Interaksi / Buka Misi:</strong> Tombol [E] / [Enter] atau Tombol Aksi di layar sentuh TV.</li>
              <li>• <strong>Peta [M] / Inventori [I]:</strong> Gunakan tombol jalan pintas di layar.</li>
            </ul>
          </div>

          {/* Game Progression Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onSaveProgress}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Progres Permainan</span>
              </button>

              <button
                onClick={onRestartLevel}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Wilayah Ini</span>
              </button>
            </div>

            <button
              onClick={onReturnToMainMenu}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:border-rose-500/50 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Menu Utama</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm active:scale-95 shadow transition-all"
          >
            Lanjutkan Petualangan
          </button>
        </div>
      </div>
    </div>
  );
};
