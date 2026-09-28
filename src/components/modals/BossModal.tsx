import React, { useState } from 'react';
import { Realm, MathQuestion } from '../../types/game';
import { QUESTION_BANK, KING_EXPONENT_QUESTIONS } from '../../data/realmsData';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Shield, Swords, Zap, HelpCircle, RotateCcw, Check, Sparkles, Trophy } from 'lucide-react';

interface BossModalProps {
  realm: Realm;
  isKingExponent?: boolean;
  onVictory: (rewardXp: number, rewardCoins: number) => void;
  onClose: () => void;
  fontSizeClass?: string;
}

export const BossModal: React.FC<BossModalProps> = ({
  realm,
  isKingExponent = false,
  onVictory,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  // Load questions for this boss
  const bossQuestions: MathQuestion[] = isKingExponent
    ? KING_EXPONENT_QUESTIONS
    : QUESTION_BANK.filter((q) => q.realmId === realm.id).slice(0, realm.bossMaxHealth);

  const [questionIdx, setQuestionIdx] = useState(0);
  const [bossHealth, setBossHealth] = useState(bossQuestions.length);
  const maxHealth = bossQuestions.length;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [battleComplete, setBattleComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = bossQuestions[questionIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedIdx(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedIdx === null || hasAnswered) return;
    const correct = selectedIdx === currentQ.correctAnswerIndex;
    setHasAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playBossHit();
      setBossHealth((prev) => Math.max(0, prev - 1));
      setCorrectCount((prev) => prev + 1);

      if (bossHealth - 1 <= 0 || questionIdx + 1 >= maxHealth) {
        // Battle finished
        setTimeout(() => {
          soundEngine.playLevelUp();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
          setBattleComplete(true);
        }, 800);
      }
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNextQuestion = () => {
    setSelectedIdx(null);
    setHasAnswered(false);
    setShowHint(false);
    if (questionIdx + 1 < maxHealth) {
      setQuestionIdx((prev) => prev + 1);
    } else {
      setBattleComplete(true);
    }
  };

  const handleClaimVictory = () => {
    const xp = isKingExponent ? 1000 : 500;
    const coins = isKingExponent ? 100 : 50;
    onVictory(xp, coins);
    onClose();
  };

  const healthPercent = Math.round((bossHealth / maxHealth) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-rose-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Boss Top Arena Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 border-b border-rose-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-2xl shadow">
                {isKingExponent ? '👑' : '👾'}
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  {isKingExponent ? 'PERTARUNGAN AKHIR KERAJAAN' : 'GUARDIAN WILAYAH'}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isKingExponent ? 'RAJA EKSPONEN' : realm.bossName}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Soal {questionIdx + 1} dari {maxHealth}</span>
              <p className="text-xs text-emerald-400 font-bold">{correctCount} Serangan Tepat</p>
            </div>
          </div>

          {/* Boss Energy Health Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-rose-300 font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Energi Pelindung Guardian
              </span>
              <span className="text-rose-300 font-bold">{healthPercent}%</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-950 border border-rose-900/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Victory Screen */}
        {battleComplete ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-xl">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-game font-bold text-amber-300 mb-2">
              {isKingExponent ? 'KERAJAAN NUMERIA TERTOLONG!' : 'GUARDIAN BERHASIL DITUNDUKKAN!'}
            </h2>
            <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm">
              {isKingExponent
                ? 'Sihir kebingungan telah sirna! Kristal Energi Eksponen bersatu kembali dan kebijaksanaan matematika kembali menyinari Numeria.'
                : `Kamu telah membuktikan penguasaanmu atas sifat eksponen di ${realm.name}. Pecahan kristal energi berhasil diperoleh!`}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block">Hadiah XP</span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  +{isKingExponent ? 1000 : 500} XP
                </span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block">Kristal Eksponen</span>
                <span className="text-lg font-mono font-bold text-cyan-300 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" /> +1 Didapat
                </span>
              </div>
            </div>

            <button
              onClick={handleClaimVictory}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-game font-bold text-lg hover:brightness-110 active:scale-95 shadow-2xl transition-all"
            >
              Klaim Kristal & Hadiah
            </button>
          </div>
        ) : (
          /* Active Question Body */
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-inner mb-5">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                Tantangan #{questionIdx + 1}
              </span>
              <p className="text-xl sm:text-2xl font-bold font-math text-white tracking-wide">
                {currentQ.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {currentQ.options.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx);
                const isSelected = selectedIdx === idx;
                let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750';

                if (hasAnswered) {
                  if (idx === currentQ.correctAnswerIndex) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 line-through';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600/40 border-rose-400 text-white font-bold ring-2 ring-rose-400/50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${btnStyle}`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-slate-900 font-mono font-bold text-sm text-rose-400 flex items-center justify-center border border-slate-700">
                      {label}
                    </span>
                    <span className="font-math font-semibold text-base sm:text-lg flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint & Feedback Banner */}
            <div className="min-h-[60px]">
              {!hasAnswered && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <HelpCircle className="w-4 h-4" /> Butuh Petunjuk Taktik?
                </button>
              )}

              {showHint && !hasAnswered && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
                  💡 <strong>Petunjuk:</strong> {currentQ.hints[0]}
                </div>
              )}

              {hasAnswered && (
                <div
                  className={`p-3.5 rounded-xl border text-sm ${
                    isCorrect
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    {isCorrect ? <Check className="w-4 h-4 text-emerald-400" /> : '⚠️'}
                    {isCorrect ? 'Serangan Berhasil Menembus Pertahanan!' : 'Serangan Tertahan oleh Perisai Guardian!'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Mundur Sementara
              </button>

              <div>
                {!hasAnswered ? (
                  <button
                    disabled={selectedIdx === null}
                    onClick={handleConfirmAnswer}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-game font-bold text-sm sm:text-base hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Lancarkan Serangan Eksponen</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-game font-bold text-sm sm:text-base active:scale-95 transition-all shadow-lg"
                  >
                    <span>Lanjut Soal Berikutnya</span>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
