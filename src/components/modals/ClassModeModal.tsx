import React, { useState, useEffect } from 'react';
import { ClassGameConfig, ClassModePlayer, MathQuestion } from '../../types/game';
import { QUESTION_BANK } from '../../data/realmsData';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Users, Play, Trophy, Clock, CheckCircle2, RotateCcw, Award } from 'lucide-react';

interface ClassModeModalProps {
  onClose: () => void;
  fontSizeClass?: string;
}

export const ClassModeModal: React.FC<ClassModeModalProps> = ({
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const [phase, setPhase] = useState<'config' | 'playing' | 'podium'>('config');

  const [config, setConfig] = useState<ClassGameConfig>({
    numPlayers: 2,
    numQuestions: 5,
    difficulty: 'semua',
    realmFilter: 0,
    timeLimitSec: 30,
  });

  const [players, setPlayers] = useState<ClassModePlayer[]>([
    { id: 1, name: 'Tim 1 (Merah)', score: 0, correct: 0, color: '#ef4444' },
    { id: 2, name: 'Tim 2 (Biru)', score: 0, correct: 0, color: '#3b82f6' },
  ]);

  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timerLeft, setTimerLeft] = useState(30);
  const [hasAnsweredMap, setHasAnsweredMap] = useState<{ [playerId: number]: boolean }>({});
  const [playerSelectedIdx, setPlayerSelectedIdx] = useState<{ [playerId: number]: number | null }>({});
  const [revealed, setRevealed] = useState(false);

  // Setup players when numPlayers changes
  const handleNumPlayersChange = (n: 1 | 2 | 4) => {
    const playerConfigs: ClassModePlayer[] = [
      { id: 1, name: 'Tim 1 (Merah)', score: 0, correct: 0, color: '#ef4444' },
      { id: 2, name: 'Tim 2 (Biru)', score: 0, correct: 0, color: '#3b82f6' },
      { id: 3, name: 'Tim 3 (Hijau)', score: 0, correct: 0, color: '#10b981' },
      { id: 4, name: 'Tim 4 (Kuning)', score: 0, correct: 0, color: '#f59e0b' },
    ];
    setConfig((prev) => ({ ...prev, numPlayers: n }));
    setPlayers(playerConfigs.slice(0, n));
  };

  const handleStartClassGame = () => {
    let pool = [...QUESTION_BANK];
    if (config.realmFilter !== 0) {
      pool = pool.filter((q) => q.realmId === config.realmFilter);
    }
    if (config.difficulty !== 'semua') {
      pool = pool.filter((q) => q.level === config.difficulty);
    }
    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, config.numQuestions);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setTimerLeft(config.timeLimitSec);
    setHasAnsweredMap({});
    setPlayerSelectedIdx({});
    setRevealed(false);
    setPhase('playing');
  };

  // Timer tick during play
  useEffect(() => {
    let interval: number;
    if (phase === 'playing' && config.timeLimitSec > 0 && !revealed && timerLeft > 0) {
      interval = window.setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, config.timeLimitSec, revealed, timerLeft]);

  const handleTimeUp = () => {
    setRevealed(true);
    soundEngine.playWrong();
  };

  const handlePlayerAnswer = (playerId: number, optionIdx: number) => {
    if (revealed || hasAnsweredMap[playerId]) return;

    setPlayerSelectedIdx((prev) => ({ ...prev, [playerId]: optionIdx }));
    setHasAnsweredMap((prev) => ({ ...prev, [playerId]: true }));

    // Check if all players answered
    const nextMap = { ...hasAnsweredMap, [playerId]: true };
    if (Object.keys(nextMap).length >= config.numPlayers) {
      finishQuestionReview({ ...playerSelectedIdx, [playerId]: optionIdx });
    }
  };

  const finishQuestionReview = (selections: { [id: number]: number | null }) => {
    setRevealed(true);
    const curQ = questions[currentQIndex];

    let anyCorrect = false;
    setPlayers((prev) =>
      prev.map((p) => {
        const choice = selections[p.id];
        if (choice === curQ.correctAnswerIndex) {
          anyCorrect = true;
          return {
            ...p,
            score: p.score + 100,
            correct: p.correct + 1,
          };
        }
        return p;
      })
    );

    if (anyCorrect) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((p) => p + 1);
      setTimerLeft(config.timeLimitSec);
      setHasAnsweredMap({});
      setPlayerSelectedIdx({});
      setRevealed(false);
    } else {
      // Podium
      soundEngine.playLevelUp();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      setPhase('podium');
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-5xl h-[92vh] rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                TV Interaktif & Kolaborasi
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                MODE KELAS MULTIPLAYER
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

        {/* Phase 1: Configuration for Teachers */}
        {phase === 'config' && (
          <div className="p-8 flex-1 overflow-y-auto space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Pengaturan Sesi Kelas</h3>
                <p className="text-sm text-slate-300">
                  Guru dapat menyesuaikan konfigurasi permainan sebelum ditampilkan pada TV Interaktif di depan kelas.
                </p>
              </div>

              {/* Number of Players */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-2 font-bold">
                  1. Jumlah Tim / Pemain:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumPlayersChange(num as 1 | 2 | 4)}
                      className={`py-3 rounded-2xl font-game font-bold text-base border-2 transition-all ${
                        config.numPlayers === num
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {num === 1 ? '1 Pemain (Solo TV)' : num === 2 ? '2 Tim (Kiri vs Kanan)' : '4 Tim (4 Sudut TV)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-2 font-bold">
                  2. Jumlah Soal:
                </label>
                <div className="flex gap-3">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setConfig((p) => ({ ...p, numQuestions: count }))}
                      className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-sm border-2 transition-all ${
                        config.numQuestions === count
                          ? 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {count} Soal
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Limit */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-2 font-bold">
                  3. Batas Waktu per Soal:
                </label>
                <div className="flex gap-3">
                  {[
                    { label: '15 Detik', val: 15 },
                    { label: '30 Detik', val: 30 },
                    { label: '45 Detik', val: 45 },
                    { label: 'Tanpa Batas', val: 0 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setConfig((p) => ({ ...p, timeLimitSec: item.val }))}
                      className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-sm border-2 transition-all ${
                        config.timeLimitSec === item.val
                          ? 'bg-sky-500 border-sky-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-4">
                <button
                  onClick={handleStartClassGame}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white font-game font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>TAMPILKAN KE LAYAR TV INTERAKTIF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Interactive Big Screen Playing Mode */}
        {phase === 'playing' && currentQ && (
          <div className="flex-1 flex flex-col justify-between p-6">
            {/* Top Info Bar for Class */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono">
              <span className="text-sm text-slate-300 font-bold">
                Soal {currentQIndex + 1} / {questions.length} · {currentQ.topic}
              </span>

              {config.timeLimitSec > 0 && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-lg">
                  <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{timerLeft}s</span>
                </div>
              )}

              {/* Score ticker */}
              <div className="flex items-center gap-3">
                {players.map((p) => (
                  <span
                    key={p.id}
                    style={{ borderColor: p.color }}
                    className="px-3 py-1 rounded-xl bg-slate-950 border font-bold text-xs"
                  >
                    <span style={{ color: p.color }}>{p.name.split(' ')[0]}:</span> {p.score}
                  </span>
                ))}
              </div>
            </div>

            {/* Huge Question Display in Screen Center */}
            <div className="my-auto text-center py-6">
              <div className="p-8 rounded-3xl bg-slate-950/80 border-2 border-slate-800 max-w-3xl mx-auto shadow-2xl">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block mb-2">
                  Tantangan Bersama
                </span>
                <p className="text-2xl sm:text-4xl font-bold font-math text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Answer Choices List for Class Display */}
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mt-6">
                {currentQ.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = idx === currentQ.correctAnswerIndex;
                  let style = 'bg-slate-800/80 border-slate-700 text-slate-200';
                  if (revealed) {
                    if (isCorrect) style = 'bg-emerald-600/40 border-emerald-400 text-emerald-200 font-bold';
                  }
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left ${style}`}
                    >
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center font-mono">
                        {letter}
                      </span>
                      <span className="font-math font-semibold text-lg">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {revealed && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 max-w-2xl mx-auto text-emerald-200 text-sm">
                  <strong>Pembahasan: </strong> {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Bottom Touch Buzzer Buttons for each player/team */}
            <div className="pt-3 border-t border-slate-800">
              <div className={`grid gap-3 ${config.numPlayers === 1 ? 'grid-cols-1' : config.numPlayers === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {players.map((p) => {
                  const hasAnswered = hasAnsweredMap[p.id];
                  const chosenIdx = playerSelectedIdx[p.id];

                  return (
                    <div
                      key={p.id}
                      style={{ borderColor: p.color }}
                      className="p-3 rounded-2xl bg-slate-950 border-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ color: p.color }} className="font-bold text-xs uppercase">
                          {p.name}
                        </span>
                        {hasAnswered && (
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            ✓ Terpilih ({chosenIdx !== null && chosenIdx !== undefined ? String.fromCharCode(65 + chosenIdx) : ''})
                          </span>
                        )}
                      </div>

                      {/* Touch Options A, B, C, D */}
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isSelected = chosenIdx === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={revealed || hasAnswered}
                              onClick={() => handlePlayerAnswer(p.id, optIdx)}
                              className={`py-3 rounded-xl font-mono font-bold text-base transition-all active:scale-90 disabled:pointer-events-none ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Question Control */}
              {revealed && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-game font-bold text-base active:scale-95 shadow-xl transition-all"
                  >
                    {currentQIndex + 1 < questions.length ? 'Soal Selanjutnya →' : 'Lihat Pemenang & Podium 🏆'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Winner Podium & Celebration */}
        {phase === 'podium' && (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-xl">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-3xl font-game font-bold text-amber-300 mb-2">
              SESI KELAS SELESAI!
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Selamat kepada seluruh tim yang telah bekerja sama memecahkan soal eksponen!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mb-8">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-slate-950 border-2 border-slate-800 text-center shadow-lg"
                  >
                    <span className="text-2xl mb-1 block">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎖️'}
                    </span>
                    <h4 style={{ color: p.color }} className="font-bold text-base mb-1">
                      {p.name}
                    </h4>
                    <p className="text-2xl font-mono font-bold text-white mb-2">{p.score} Poin</p>
                    <span className="text-xs text-slate-400">
                      Benar: {p.correct} / {questions.length}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setPhase('config')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Sesi Baru</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-game font-bold text-base active:scale-95 shadow-lg"
              >
                Kembali ke Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
