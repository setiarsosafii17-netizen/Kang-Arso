import React, { useState } from 'react';
import { LEARNING_CHAPTERS } from '../../data/learningMateri';
import { BookOpen, AlertTriangle, CheckCircle2, ChevronRight, Calculator, Sparkles } from 'lucide-react';

interface StudyModalProps {
  onClose: () => void;
  fontSizeClass?: string;
}

export const StudyModal: React.FC<StudyModalProps> = ({
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Interactive Live Playground values
  const [liveBase, setLiveBase] = useState(2);
  const [liveExp1, setLiveExp1] = useState(3);
  const [liveExp2, setLiveExp2] = useState(2);

  const cur = LEARNING_CHAPTERS[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-4xl h-[90vh] rounded-3xl bg-slate-900 border-2 border-sky-500/50 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow">
              📚
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                Ringkasan Visual Materi
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                BELAJAR DULU: Panduan Eksponen Lengkap
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

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {LEARNING_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === idx
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {ch.title.split('.')[1] || ch.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Chapter Title & Formula Hero Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sky-300 font-semibold">
                {cur.subtitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{cur.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                {cur.conceptSummary}
              </p>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-950/80 border border-sky-400/40 text-center shadow-lg">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Bentuk Rumus Utama
              </span>
              <p className="text-lg sm:text-xl font-math font-bold text-amber-300">
                {cur.formula}
              </p>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cur.visualBreakdown.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <span className={`text-xs font-bold uppercase tracking-wider ${item.highlightColor} block mb-1`}>
                  {item.label}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Interactive Live Playground (Coba Langsung Simulasi Angka) */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-4 font-bold text-amber-400 text-sm">
              <Calculator className="w-4 h-4" />
              <span>Simulasi Interaktif: Coba Ubah Angka & Amati Polanya</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="text-xs text-slate-300 flex items-center gap-2">
                <span>Basis (a):</span>
                <select
                  value={liveBase}
                  onChange={(e) => setLiveBase(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold"
                >
                  {[2, 3, 4, 5, 10].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-slate-300 flex items-center gap-2">
                <span>Pangkat 1 (m):</span>
                <select
                  value={liveExp1}
                  onChange={(e) => setLiveExp1(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold"
                >
                  {[0, 1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              {activeTab >= 1 && activeTab <= 3 && (
                <label className="text-xs text-slate-300 flex items-center gap-2">
                  <span>Pangkat 2 (n):</span>
                  <select
                    value={liveExp2}
                    onChange={(e) => setLiveExp2(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold"
                  >
                    {[1, 2, 3, 4].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {/* Calculated Result Display */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm font-math">
              {activeTab === 0 && (
                <p className="text-slate-200">
                  <span className="text-amber-300 font-bold">{liveBase}</span>
                  <sup className="text-sky-300">{liveExp1}</sup> ={' '}
                  {Array(liveExp1).fill(liveBase).join(' × ') || '1'} ={' '}
                  <strong className="text-emerald-400">{Math.pow(liveBase, liveExp1)}</strong>
                </p>
              )}
              {activeTab === 1 && (
                <p className="text-slate-200">
                  {liveBase}
                  <sup>{liveExp1}</sup> × {liveBase}
                  <sup>{liveExp2}</sup> = {liveBase}
                  <sup>
                    {liveExp1}+{liveExp2}
                  </sup>{' '}
                  = {liveBase}
                  <sup>{liveExp1 + liveExp2}</sup> ={' '}
                  <strong className="text-emerald-400">
                    {Math.pow(liveBase, liveExp1 + liveExp2)}
                  </strong>
                </p>
              )}
              {activeTab === 2 && (
                <p className="text-slate-200">
                  {liveBase}
                  <sup>{liveExp1}</sup> ÷ {liveBase}
                  <sup>{liveExp2}</sup> = {liveBase}
                  <sup>
                    {liveExp1}-{liveExp2}
                  </sup>{' '}
                  = {liveBase}
                  <sup>{liveExp1 - liveExp2}</sup> ={' '}
                  <strong className="text-emerald-400">
                    {Math.pow(liveBase, liveExp1 - liveExp2)}
                  </strong>
                </p>
              )}
              {activeTab === 3 && (
                <p className="text-slate-200">
                  ({liveBase}
                  <sup>{liveExp1}</sup>)<sup>{liveExp2}</sup> = {liveBase}
                  <sup>
                    {liveExp1}×{liveExp2}
                  </sup>{' '}
                  = {liveBase}
                  <sup>{liveExp1 * liveExp2}</sup> ={' '}
                  <strong className="text-emerald-400">
                    {Math.pow(liveBase, liveExp1 * liveExp2)}
                  </strong>
                </p>
              )}
              {activeTab === 4 && (
                <p className="text-slate-200">
                  {liveBase}
                  <sup>0</sup> = <strong className="text-emerald-400">1</strong> (Pangkat Nol) &nbsp;|&nbsp;{' '}
                  {liveBase}
                  <sup>-2</sup> = 1 / ({liveBase}
                  <sup>2</sup>) ={' '}
                  <strong className="text-emerald-400">1/{liveBase * liveBase}</strong> (Pangkat Negatif)
                </p>
              )}
            </div>
          </div>

          {/* Key Takeaways & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kunci Ingatan Cepat</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">{cur.keyTakeaway}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
              <div className="flex items-center gap-2 font-bold text-rose-400 text-sm mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Hindari Kesalahan Ini!</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">{cur.commonMistake}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => setActiveTab((p) => Math.max(0, p - 1))}
            disabled={activeTab === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold"
          >
            ← Bab Sebelumnya
          </button>

          <button
            onClick={() => {
              if (activeTab + 1 < LEARNING_CHAPTERS.length) {
                setActiveTab((p) => p + 1);
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-game font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            <span>{activeTab + 1 < LEARNING_CHAPTERS.length ? 'Bab Selanjutnya' : 'Mulai Petualangan'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
