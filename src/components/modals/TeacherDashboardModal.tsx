import React, { useState } from 'react';
import { TeacherRecord, PlayerStats } from '../../types/game';
import { loadTeacherRecords, recordTeacherSession } from '../../utils/storage';
import { GraduationCap, CheckCircle2, AlertCircle, FileText, Download, UserPlus, Sparkles } from 'lucide-react';

interface TeacherDashboardModalProps {
  currentStats: PlayerStats;
  onClose: () => void;
  fontSizeClass?: string;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  currentStats,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const [records, setRecords] = useState<TeacherRecord[]>(loadTeacherRecords());
  const [selectedRecord, setSelectedRecord] = useState<TeacherRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState(currentStats.name || '');

  const handleSaveCurrentSession = () => {
    const totalAnswered = currentStats.correctAnswers + currentStats.wrongAnswers;
    const accuracy = totalAnswered > 0 ? (currentStats.correctAnswers / totalAnswered) * 100 : 100;

    // Evaluate mastered vs needs practice
    const mastered: string[] = [];
    const needsPractice: string[] = [];

    if (currentStats.correctAnswers >= 3) mastered.push('Pengertian Eksponen (Desa Pangkat)');
    if (currentStats.correctAnswers >= 6) mastered.push('Perkalian Eksponen aᵐ × aⁿ');
    if (currentStats.correctAnswers >= 9) mastered.push('Pembagian Eksponen aᵐ ÷ aⁿ');
    if (currentStats.correctAnswers >= 12) mastered.push('Pangkat dari Pangkat (aᵐ)ⁿ');
    if (currentStats.crystals >= 4) mastered.push('Pangkat Nol & Negatif');

    if (currentStats.wrongAnswers > 1) needsPractice.push('Kombinasi Sifat & Aljabar');
    if (currentStats.wrongAnswers > 3) needsPractice.push('Soal Cerita & HOTS');
    if (needsPractice.length === 0) needsPractice.push('Pertahankan konsistensi latihan!');

    const newRecord: TeacherRecord = {
      id: `rec_${Date.now()}`,
      studentName: newStudentName.trim() || 'Siswa Penjelajah',
      date: new Date().toISOString().split('T')[0],
      score: currentStats.score,
      xp: currentStats.xp,
      correct: currentStats.correctAnswers,
      wrong: currentStats.wrongAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
      timeSpentMinutes: Math.max(1, Math.round(currentStats.playTimeSeconds / 60)),
      masteredTopics: mastered.length > 0 ? mastered : ['Konsep Dasar Perpangkatan'],
      needsPracticeTopics: needsPractice,
      highestLevel: currentStats.levelTitle,
    };

    recordTeacherSession(newRecord);
    setRecords(loadTeacherRecords());
    setSelectedRecord(newRecord);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-4xl h-[90vh] rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Panel Pendidik & Analisis Belajar
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                DASHBOARD GURU: HASIL BELAJAR SISWA
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

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Quick Actions & Current Live Session Banner */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                Sesi Berjalan Saat Ini
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {currentStats.name} ({currentStats.levelTitle})
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Skor: {currentStats.score} · XP: {currentStats.xp} · Benar: {currentStats.correctAnswers} · Salah: {currentStats.wrongAnswers}
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan Catatan Siswa Ini</span>
            </button>
          </div>

          {/* Form Modal to Name Student */}
          {showAddForm && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Masukkan Nama Siswa..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCurrentSession}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Simpan ke Laporan
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Records Table */}
          <div>
            <h4 className="text-sm font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Daftar Rekap Hasil Belajar ({records.length} Siswa)
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Nama Siswa</th>
                    <th className="p-3.5">Tingkat</th>
                    <th className="p-3.5">Akurasi</th>
                    <th className="p-3.5">Benar / Salah</th>
                    <th className="p-3.5">Waktu</th>
                    <th className="p-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3.5 font-bold text-white">{r.studentName}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/20">
                          {r.highestLevel}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400">{r.accuracy}%</td>
                      <td className="p-3.5 font-mono">
                        <span className="text-emerald-400 font-bold">{r.correct}</span> /{' '}
                        <span className="text-rose-400 font-bold">{r.wrong}</span>
                      </td>
                      <td className="p-3.5 text-slate-400">{r.timeSpentMinutes} menit</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="px-3 py-1.5 rounded-lg bg-sky-600/30 text-sky-300 hover:bg-sky-600 hover:text-white text-xs font-semibold border border-sky-500/40 transition-colors"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Record In-Depth Learning Breakdown */}
          {selectedRecord && (
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedRecord.studentName}</h4>
                  <p className="text-xs text-slate-400">
                    Sesi Ujian Tanggal: {selectedRecord.date} · Waktu Belajar: {selectedRecord.timeSpentMinutes} menit
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-emerald-400">
                    {selectedRecord.accuracy}%
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Tingkat Penguasaan</span>
                </div>
              </div>

              {/* Mastered vs Needs Practice Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mastered */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Materi yang Sudah Dikuasai</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                    {selectedRecord.masteredTopics.map((top, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Needs Practice */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex items-center gap-2 font-bold text-amber-400 text-sm mb-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>Materi yang Perlu Latihan Lanjutan</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                    {selectedRecord.needsPracticeTopics.map((top, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">●</span>
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Cetak / Unduh Hasil Belajar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Data penilaian tersimpan secara lokal dan dapat digunakan untuk evaluasi formatif kelas.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
