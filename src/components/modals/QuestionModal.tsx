import React, { useState } from 'react';
import { MathQuestion } from '../../types/game';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

interface QuestionModalProps {
  question: MathQuestion;
  npcName?: string;
  onCorrect: (xpReward: number, coinReward: number) => void;
  onWrong: () => void;
  onClose: () => void;
  fontSizeClass?: string;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  npcName = 'Prof. Numerus',
  onCorrect,
  onWrong,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintStage, setHintStage] = useState<number>(0); // 0 = none, 1 = cognitive, 2 = explicit rule
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (idx: number) => {
    if (hasSubmitted && isCorrect) return;
    setSelectedIdx(idx);
  };

  const handleRevealHint = () => {
    setHintStage((prev) => Math.min(prev + 1, 2));
  };

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    const correct = selectedIdx === question.correctAnswerIndex;
    setHasSubmitted(true);
    setIsCorrect(correct);
    setAttempts((prev) => prev + 1);

    if (correct) {
      soundEngine.playCorrect();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      const xp = question.isHOTS ? 500 : 100;
      const coins = question.isHOTS ? 30 : 15;
      onCorrect(xp, coins);
    } else {
      soundEngine.playWrong();
      onWrong();
      // Auto upgrade hint on wrong attempt to guide the student
      if (hintStage === 0) {
        setHintStage(1);
      }
    }
  };

  const handleTryAgain = () => {
    setSelectedIdx(null);
    setHasSubmitted(false);
    if (hintStage < 2) {
      setHintStage(2); // Reveal full rule hint on retry
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
              ∑
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Tantangan Matematika
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">{question.topic}</h3>
            </div>
          </div>
          {question.isHOTS && (
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/40">
              🔥 SOAL HOTS
            </span>
          )}
        </div>

        {/* NPC Dialogue Prompt */}
        <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-800 flex items-start gap-3">
          <span className="text-2xl">🧙‍♂️</span>
          <p className="text-sm text-slate-300 italic">
            <strong className="text-amber-300 not-italic">{npcName}: </strong>
            &ldquo;Petualang! Kristal ini hanya bisa dibuka jika kamu menjawab soal berikut dengan cermat.&rdquo;
          </p>
        </div>

        {/* Question Body */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center shadow-inner mb-6">
            <p className="text-xl sm:text-2xl font-bold font-math text-white tracking-wide leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {question.options.map((option, idx) => {
              const label = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedIdx === idx;
              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';

              if (hasSubmitted) {
                if (idx === question.correctAnswerIndex) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 line-through';
                }
              } else if (isSelected) {
                btnStyle = 'bg-sky-600/40 border-sky-400 text-white font-bold ring-2 ring-sky-400/50 shadow-lg';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${btnStyle}`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 font-mono font-bold text-sm text-amber-400 border border-slate-700">
                    {label}
                  </span>
                  <span className="font-math font-semibold text-base sm:text-lg flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Hint Area (Two-tier hints) */}
          <div className="mt-2">
            {hintStage === 0 && !hasSubmitted && (
              <button
                onClick={handleRevealHint}
                className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Butuh Petunjuk? (Tahap 1)</span>
              </button>
            )}

            {hintStage >= 1 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
                <div className="flex items-center justify-between mb-1 font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    💡 Petunjuk {hintStage === 1 ? '1 (Pemicu Berpikir)' : '2 (Aturan Eksponen)'}
                  </span>
                  {hintStage === 1 && (
                    <button
                      onClick={handleRevealHint}
                      className="text-[11px] underline hover:text-white"
                    >
                      Buka Aturan Penuh →
                    </button>
                  )}
                </div>
                <p>{question.hints[hintStage - 1]}</p>
              </div>
            )}
          </div>

          {/* Feedback & Explanation Section */}
          {hasSubmitted && (
            <div className="mt-4">
              {isCorrect ? (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-200 text-sm animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-base mb-1">
                    <CheckCircle className="w-5 h-5" />
                    <span>Luar Biasa! Jawabanmu Benar!</span>
                  </div>
                  <p className="mb-2">{question.explanation}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/60 font-mono text-xs text-emerald-300 border border-emerald-500/30">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Rumus: {question.ruleFormula}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/50 text-rose-200 text-sm">
                  <div className="flex items-center gap-2 font-bold text-rose-400 text-base mb-1">
                    <XCircle className="w-5 h-5" />
                    <span>Belum Tepat, Jangan Menyerah!</span>
                  </div>
                  <p className="text-slate-300 mb-2">
                    {question.hints[0]}
                  </p>
                  <p className="text-xs text-amber-300 font-semibold">
                    Silakan baca petunjuk di atas dan coba kembali!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-semibold transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-3">
            {!hasSubmitted ? (
              <button
                disabled={selectedIdx === null}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-game font-bold text-base hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg"
              >
                <span>Periksa Jawaban</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : isCorrect ? (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-game font-bold text-base hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                <span>Lanjutkan Petualangan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleTryAgain}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-game font-bold text-base active:scale-95 transition-all shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi ({attempts}x)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
