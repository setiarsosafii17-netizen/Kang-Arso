export interface LearningChapter {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  conceptSummary: string;
  visualBreakdown: {
    label: string;
    detail: string;
    highlightColor: string;
  }[];
  interactiveExample: {
    base: number;
    exp1: number;
    exp2?: number;
    explanation: string;
  };
  keyTakeaway: string;
  commonMistake: string;
}

export const LEARNING_CHAPTERS: LearningChapter[] = [
  {
    id: 'intro_eksponen',
    title: '1. Pengertian Bilangan Berpangkat',
    subtitle: 'Singkatan Perkalian Berulang',
    formula: 'aⁿ = a × a × a × ... × a (sebanyak n kali)',
    conceptSummary: 'Bilangan berpangkat (eksponen) adalah cara cerdas dan ringkas untuk menuliskan perkalian bilangan yang sama secara berulang-ulang.',
    visualBreakdown: [
      {
        label: 'a (Basis / Bilangan Pokok)',
        detail: 'Bilangan yang dikalikan berulang.',
        highlightColor: 'text-emerald-400',
      },
      {
        label: 'n (Eksponen / Pangkat)',
        detail: 'Berapa kali bilangan pokok tersebut dikalikan dengan dirinya sendiri.',
        highlightColor: 'text-amber-400',
      },
      {
        label: 'Hasil Pangkat',
        detail: 'Nilai total dari perkalian berulang tersebut.',
        highlightColor: 'text-sky-400',
      },
    ],
    interactiveExample: {
      base: 2,
      exp1: 3,
      explanation: '2³ dibaca "dua pangkat tiga" = 2 × 2 × 2 = 8.',
    },
    keyTakeaway: 'Pangkat 3 BUKAN 2 × 3 = 6, melainkan 2 × 2 × 2 = 8!',
    commonMistake: 'Kesalahan paling sering: mengalikan basis dengan eksponennya secara langsung (misal: 5² dijawab 10 padahal 25).',
  },
  {
    id: 'perkalian_eksponen',
    title: '2. Sifat Perkalian Eksponen',
    subtitle: 'Basis Sama, Jumlahkan Pangkatnya',
    formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
    conceptSummary: 'Ketika mengalikan dua bilangan berpangkat yang memiliki basis (bilangan pokok) yang sama, kita cukup menjumlahkan eksponennya.',
    visualBreakdown: [
      {
        label: 'Syarat Mutlak',
        detail: 'Hanya berlaku jika basis kedua bilangan SAMA persis!',
        highlightColor: 'text-emerald-400',
      },
      {
        label: 'Aturan Pangkat',
        detail: 'Operasi × pada basis menjadi operasi + pada eksponen.',
        highlightColor: 'text-sky-400',
      },
    ],
    interactiveExample: {
      base: 3,
      exp1: 2,
      exp2: 3,
      explanation: '3² × 3³ = (3 × 3) × (3 × 3 × 3) = 3⁵ = 243. Pangkatnya 2 + 3 = 5!',
    },
    keyTakeaway: 'Basis tetap sama, jangan dikalikan menjadi 9⁵! Tetap 3⁵.',
    commonMistake: 'Mengalikan basisnya (misal: 2³ × 2² ditulis 4⁵, ini keliru! Harusnya 2⁵).',
  },
  {
    id: 'pembagian_eksponen',
    title: '3. Sifat Pembagian Eksponen',
    subtitle: 'Basis Sama, Kurangkan Pangkatnya',
    formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ (dengan a ≠ 0)',
    conceptSummary: 'Ketika membagi dua bilangan berpangkat dengan basis yang sama, kurangkan pangkat pembilang dengan pangkat penyebut.',
    visualBreakdown: [
      {
        label: 'Penyederhanaan Pecahan',
        detail: 'Faktor yang sama di atas dan bawah saling membagi (coret).',
        highlightColor: 'text-amber-400',
      },
      {
        label: 'Aturan Pangkat',
        detail: 'Operasi ÷ pada basis menjadi operasi - pada eksponen.',
        highlightColor: 'text-sky-400',
      },
    ],
    interactiveExample: {
      base: 5,
      exp1: 4,
      exp2: 2,
      explanation: '5⁴ ÷ 5² = (5 × 5 × 5 × 5) / (5 × 5) = 5² = 25. Pangkatnya 4 - 2 = 2!',
    },
    keyTakeaway: 'Pangkat atas dikurangi pangkat bawah (m - n).',
    commonMistake: 'Membagi basisnya menjadi 1 atau membagi pangkatnya (4 ÷ 2 = 2 kebetulan sama pada 4 dan 2, tapi pada 6 dan 2 hasilnya 6-2=4 bukan 6/2=3).',
  },
  {
    id: 'pangkat_bertingkat',
    title: '4. Pangkat dari Pangkat',
    subtitle: 'Pangkat Ditumpuk, Kalikan Pangkatnya',
    formula: '(aᵐ)ⁿ = aᵐˣⁿ',
    conceptSummary: 'Jika bilangan berpangkat dipangkatkan lagi di luar tanda kurung, kalikan eksponen yang di dalam dengan eksponen yang di luar.',
    visualBreakdown: [
      {
        label: 'Pengulangan Kelompok',
        detail: '(aᵐ) diulang sebanyak n kali.',
        highlightColor: 'text-purple-400',
      },
      {
        label: 'Aturan Pangkat',
        detail: 'Eksponen dikalikan: m × n.',
        highlightColor: 'text-pink-400',
      },
    ],
    interactiveExample: {
      base: 2,
      exp1: 3,
      exp2: 2,
      explanation: '(2³)² = 2³ × 2³ = 2³⁺³ = 2⁶ = 64. Hasil perkalian eksponen 3 × 2 = 6.',
    },
    keyTakeaway: '(aᵐ)ⁿ = aᵐⁿ, jangan dijumlahkan!',
    commonMistake: 'Menjumlahkan pangkatnya menjadi 2³⁺² = 2⁵, padahal harusnya 2³ˣ² = 2⁶.',
  },
  {
    id: 'pangkat_nol_negatif',
    title: '5. Pangkat Nol & Pangkat Negatif',
    subtitle: 'Nilai 1 dan Pecahan Kebalikan',
    formula: 'a⁰ = 1 | a⁻ⁿ = 1 / aⁿ (a ≠ 0)',
    conceptSummary: 'Setiap bilangan tak nol yang dipangkatkan 0 bernilai 1. Sedangkan pangkat negatif adalah kebalikan dari perpangkatan positifnya.',
    visualBreakdown: [
      {
        label: 'Mengapa a⁰ = 1?',
        detail: 'Berdasarkan sifat pembagian: aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰. Dan bilangan dibagi dirinya sendiri bernilai 1!',
        highlightColor: 'text-emerald-400',
      },
      {
        label: 'Arti Pangkat Negatif',
        detail: 'a⁻ⁿ = 1 / aⁿ. Pangkat negatif bukan bilangan bernilai negatif, melainkan bentuk pecahan (kebalikan)!',
        highlightColor: 'text-rose-400',
      },
    ],
    interactiveExample: {
      base: 2,
      exp1: -3,
      explanation: '2⁻³ = 1 / (2³) = 1 / 8 = 0,125.',
    },
    keyTakeaway: 'Pangkat negatif bertindak seperti pembalik tempat (pembilang pindah ke penyebut).',
    commonMistake: 'Mengira 2⁻³ = -8 atau -6. Nilai sebenarnya adalah pecahan positif +1/8!',
  },
];
