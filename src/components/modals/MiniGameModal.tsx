import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface MiniGameModalProps {
  onReward: (xp: number, coins: number) => void;
  onClose: () => void;
  fontSizeClass?: string;
}

type MiniGameType = 'lompat_angka' | 'jembatan_eksponen' | 'peti_harta' | 'labirin_eksponen' | 'balap_kristal';

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  onReward,
  onClose,
  fontSizeClass = 'text-base',
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameType>('lompat_angka');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [gameScore, setGameScore] = useState(0);

  // Sub-game 1: Lompat Angka
  const [jumpStage, setJumpStage] = useState(0);
  const jumpQuestions = [
    { target: 'Lompat ke platform 2⁴', options: ['8', '12', '16', '24'], correct: 2 },
    { target: 'Lompat ke platform 3³', options: ['9', '18', '27', '81'], correct: 2 },
    { target: 'Lompat ke platform 5²', options: ['10', '20', '25', '125'], correct: 2 },
    { target: 'Lompat ke platform 10³', options: ['100', '300', '1000', '10000'], correct: 2 },
  ];

  // Sub-game 2: Jembatan Eksponen
  const [bridgeStep, setBridgeStep] = useState(0);
  const bridgeChallenges = [
    {
      problem: 'Untuk menyambung jembatan pertama: a³ × a⁴ = ?',
      options: ['a⁷', 'a¹²', 'a¹', '2a⁷'],
      correct: 0,
      rule: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
    },
    {
      problem: 'Jembatan kedua membutuhkan sifat pembagian: b⁸ ÷ b³ = ?',
      options: ['b¹¹', 'b⁵', 'b²⁴', 'b²'],
      correct: 1,
      rule: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
    },
    {
      problem: 'Jembatan kristal terakhir: (x²)³ = ?',
      options: ['x⁵', 'x⁶', 'x⁸', 'x⁹'],
      correct: 1,
      rule: '(aᵐ)ⁿ = aᵐⁿ',
    },
  ];

  // Sub-game 3: Peti Harta Matematika
  const [chestCode, setChestCode] = useState<string[]>(['', '', '']);
  const chestPuzzles = [
    { label: 'Digit 1: 2³', answer: '8' },
    { label: 'Digit 2: 7⁰', answer: '1' },
    { label: 'Digit 3: 3²', answer: '9' },
  ];

  // Sub-game 4: Labirin Eksponen
  const [mazeNode, setMazeNode] = useState(0);
  const mazePaths = [
    {
      prompt: 'Simpang Awal: Pilih lorong dengan nilai terbesar!',
      choices: [
        { label: 'Lorong Kiri: 2⁵ (32)', correct: true },
        { label: 'Lorong Kanan: 5² (25)', correct: false },
      ],
    },
    {
      prompt: 'Ruang Tengah: Manakah jalur yang benar untuk 4³ ?',
      choices: [
        { label: 'Pintu Merah: 16', correct: false },
        { label: 'Pintu Hijau: 64', correct: true },
      ],
    },
    {
      prompt: 'Pintu Keluar Labirin: Pilih jalur penyederhanaan (2³)²',
      choices: [
        { label: 'Lorong Emas: 2⁶', correct: true },
        { label: 'Lorong Perak: 2⁵', correct: false },
      ],
    },
  ];

  // Sub-game 5: Balap Kristal
  const [raceTimeLeft, setRaceTimeLeft] = useState(20);
  const [raceScore, setRaceScore] = useState(0);
  const [raceQIndex, setRaceQIndex] = useState(0);
  const raceQuestions = [
    { q: '2² = ?', a: ['4', '8'], correct: 0 },
    { q: '3² = ?', a: ['6', '9'], correct: 1 },
    { q: '2³ = ?', a: ['8', '6'], correct: 0 },
    { q: '10² = ?', a: ['20', '100'], correct: 1 },
    { q: '5⁰ = ?', a: ['1', '0'], correct: 0 },
    { q: '4² = ?', a: ['16', '8'], correct: 0 },
  ];

  // Timer for Balap Kristal
  useEffect(() => {
    let timer: number;
    if (activeGame === 'balap_kristal' && gameState === 'playing' && raceTimeLeft > 0) {
      timer = window.setInterval(() => {
        setRaceTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('result');
            soundEngine.playLevelUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeGame, gameState, raceTimeLeft]);

  const startSubGame = (type: MiniGameType) => {
    setActiveGame(type);
    setGameState('playing');
    setGameScore(0);
    setJumpStage(0);
    setBridgeStep(0);
    setChestCode(['', '', '']);
    setMazeNode(0);
    setRaceTimeLeft(20);
    setRaceScore(0);
    setRaceQIndex(0);
  };

  const finishGame = (earnedScore: number) => {
    setGameScore(earnedScore);
    setGameState('result');
    soundEngine.playLevelUp();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    const rewardXp = earnedScore * 40;
    const rewardCoins = earnedScore * 5;
    onReward(rewardXp, rewardCoins);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <div className={`relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl overflow-hidden flex flex-col ${fontSizeClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
              🎮
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Arena Mini Game Edukasi
              </p>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Tantangan Eksponen Kerajaan Numeria
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

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {gameState === 'menu' && (
            <div>
              <p className="text-sm text-slate-300 mb-4">
                Pilih salah satu mini game matematika interaktif untuk mengasah refleks dan pemahaman eksponenmu:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'lompat_angka',
                    title: '1. Lompat Angka',
                    desc: 'Lompat ke platform batu yang memuat jawaban eksponen yang tepat!',
                    icon: '🦘',
                    badge: 'Ketangkasan & Pangkat',
                  },
                  {
                    id: 'jembatan_eksponen',
                    title: '2. Jembatan Eksponen',
                    desc: 'Pilih sifat dan rumus eksponen yang benar agar jembatan ajaib membentang!',
                    icon: '🌉',
                    badge: 'Sifat Perkalian & Pembagian',
                  },
                  {
                    id: 'peti_harta',
                    title: '3. Peti Harta Matematika',
                    desc: 'Pecahkan kode kunci gembok peti harta dengan perhitungan eksponen!',
                    icon: '📦',
                    badge: 'Perhitungan Nilai',
                  },
                  {
                    id: 'labirin_eksponen',
                    title: '4. Labirin Eksponen',
                    desc: 'Cari lorong keluar yang aman dengan membandingkan nilai perpangkatan!',
                    icon: '🧭',
                    badge: 'Analisis & Perbandingan',
                  },
                  {
                    id: 'balap_kristal',
                    title: '5. Balap Kristal',
                    desc: 'Kumpulkan kristal sebanyak-banyaknya dalam 20 detik dengan menjawab kilat!',
                    icon: '⚡',
                    badge: 'Kecepatan & Akurasi',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => startSubGame(item.id as MiniGameType)}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border-2 border-slate-700 hover:border-amber-400 text-left transition-all active:scale-[0.98] shadow-md group"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white group-hover:text-amber-300">
                          {item.title}
                        </h4>
                        <Play className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">{item.desc}</p>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 text-[10px] font-mono border border-amber-400/20">
                        {item.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 1: LOMPAT ANGKA */}
          {gameState === 'playing' && activeGame === 'lompat_angka' && (
            <div className="text-center py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
                Level Lompatan {jumpStage + 1} / {jumpQuestions.length}
              </span>
              <h3 className="text-2xl font-bold font-math text-white mb-6">
                {jumpQuestions[jumpStage].target}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Ketuk platform pulau angka yang sesuai untuk melompat!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto mb-6">
                {jumpQuestions[jumpStage].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === jumpQuestions[jumpStage].correct) {
                        soundEngine.playCorrect();
                        if (jumpStage + 1 < jumpQuestions.length) {
                          setJumpStage((p) => p + 1);
                        } else {
                          finishGame(jumpQuestions.length);
                        }
                      } else {
                        soundEngine.playWrong();
                      }
                    }}
                    className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-emerald-400 text-emerald-300 font-math font-bold text-xl active:scale-90 transition-all shadow-lg"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 2: JEMBATAN EKSPONEN */}
          {gameState === 'playing' && activeGame === 'jembatan_eksponen' && (
            <div className="text-center py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-2">
                Bantalan Jembatan {bridgeStep + 1} / {bridgeChallenges.length}
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 max-w-lg mx-auto mb-6">
                <p className="text-xl font-bold font-math text-white">
                  {bridgeChallenges[bridgeStep].problem}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
                {bridgeChallenges[bridgeStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === bridgeChallenges[bridgeStep].correct) {
                        soundEngine.playCorrect();
                        if (bridgeStep + 1 < bridgeChallenges.length) {
                          setBridgeStep((p) => p + 1);
                        } else {
                          finishGame(bridgeChallenges.length);
                        }
                      } else {
                        soundEngine.playWrong();
                      }
                    }}
                    className="p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-sky-400 text-sky-200 font-math font-bold text-lg active:scale-95 transition-all shadow-md"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 3: PETI HARTA MATEMATIKA */}
          {gameState === 'playing' && activeGame === 'peti_harta' && (
            <div className="text-center py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
                Pecahkan 3 Digit Kode Kunci Peti
              </span>
              <div className="flex items-center justify-center gap-4 mb-6">
                {chestPuzzles.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 w-36">
                    <span className="text-xs text-amber-300 font-bold block mb-1">{p.label}</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={chestCode[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setChestCode((prev) => {
                          const copy = [...prev];
                          copy[idx] = val;
                          return copy;
                        });
                      }}
                      placeholder="?"
                      className="w-16 h-14 rounded-xl bg-slate-900 border-2 border-amber-400 text-center font-math font-bold text-2xl text-white outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const isAllCorrect = chestPuzzles.every(
                    (p, idx) => chestCode[idx].trim() === p.answer
                  );
                  if (isAllCorrect) {
                    soundEngine.playCrystal();
                    finishGame(3);
                  } else {
                    soundEngine.playWrong();
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-base active:scale-95 shadow-lg"
              >
                Buka Peti Harta
              </button>
            </div>
          )}

          {/* GAME 4: LABIRIN EKSPONEN */}
          {gameState === 'playing' && activeGame === 'labirin_eksponen' && (
            <div className="text-center py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-2">
                Lorong Labirin {mazeNode + 1} / {mazePaths.length}
              </span>
              <p className="text-lg font-bold text-white mb-6">{mazePaths[mazeNode].prompt}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                {mazePaths[mazeNode].choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (c.correct) {
                        soundEngine.playCorrect();
                        if (mazeNode + 1 < mazePaths.length) {
                          setMazeNode((p) => p + 1);
                        } else {
                          finishGame(mazePaths.length);
                        }
                      } else {
                        soundEngine.playWrong();
                      }
                    }}
                    className="p-5 flex-1 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-purple-400 text-purple-200 font-math font-bold text-base active:scale-95 transition-all shadow-md"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 5: BALAP KRISTAL */}
          {gameState === 'playing' && activeGame === 'balap_kristal' && (
            <div className="text-center py-4">
              <div className="flex items-center justify-between max-w-sm mx-auto mb-4 font-mono">
                <span className="text-xs text-rose-400 font-bold">⏱ Sisa Waktu: {raceTimeLeft}s</span>
                <span className="text-xs text-cyan-300 font-bold">💎 Kristal: {raceScore}</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-sm mx-auto mb-6">
                <p className="text-3xl font-bold font-math text-white">
                  {raceQuestions[raceQIndex % raceQuestions.length].q}
                </p>
              </div>

              <div className="flex gap-4 justify-center max-w-sm mx-auto">
                {raceQuestions[raceQIndex % raceQuestions.length].a.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const cur = raceQuestions[raceQIndex % raceQuestions.length];
                      if (idx === cur.correct) {
                        soundEngine.playCoin();
                        setRaceScore((p) => p + 1);
                      } else {
                        soundEngine.playWrong();
                      }
                      setRaceQIndex((p) => p + 1);
                    }}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-math font-bold text-2xl active:scale-90 transition-all shadow-lg"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESULT SCREEN */}
          {gameState === 'result' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-game font-bold text-amber-300 mb-1">
                Tantangan Selesai!
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Kerja bagus, Penjelajah! Kamu berhasil memecahkan teka-teki mini game ini.
              </p>

              <div className="flex items-center justify-center gap-4 mb-6 font-mono">
                <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">XP Didapat</span>
                  <span className="text-lg font-bold text-amber-300">+{gameScore * 40} XP</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Koin Bonus</span>
                  <span className="text-lg font-bold text-yellow-300">+{gameScore * 5} Koin</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setGameState('menu')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Pilih Mini Game Lain</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-game font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  <span>Lanjutkan Petualangan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
