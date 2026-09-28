import { Realm, MathQuestion } from '../types/game';

export const REALMS: Realm[] = [
  {
    id: 1,
    name: 'DESA PANGKAT',
    themeTitle: 'Awal Perjalanan di Lembah Angka',
    description: 'Pelajari dasar bilangan berpangkat, kenali basis dan eksponen, serta hitung nilai perpangkatan sederhana.',
    color: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-700',
    topics: ['Pengertian Bilangan Berpangkat', 'Basis dan Eksponen', 'Menghitung Bentuk Sederhana'],
    formula: 'aⁿ = a × a × ... × a (sebanyak n kali)',
    npcName: 'Prof. Numerus',
    npcRole: 'Guru Tetua Desa Pangkat',
    npcGreeting: 'Salam, Penjelajah Muda! Untuk mengaktifkan kembali Kristal Energi Desa ini, pahamilah bahwa pangkat melambangkan perkalian berulang!',
    bossName: 'Golem Pangkat Purba',
    bossTitle: 'Penjaga Gerbang Desa Pangkat',
    bossMaxHealth: 3,
  },
  {
    id: 2,
    name: 'HUTAN PERKALIAN',
    themeTitle: 'Rimbunnya Pohon Eksponen Serumpun',
    description: 'Temukan rahasia perkalian bilangan berpangkat dengan basis yang sama. Gabungkan kekuatan pangkatnya!',
    color: '#0284C7',
    bgGradient: 'from-sky-500 to-blue-700',
    topics: ['Perkalian Berbasis Sama', 'Sifat aᵐ × aⁿ = aᵐ⁺ⁿ', 'Penyederhanaan Suku Aljabar Berpangkat'],
    formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
    npcName: 'Ranger Vektor',
    npcRole: 'Penjaga Hutan Perkalian',
    npcGreeting: 'Hati-hati di dalam hutan, Penjelajah! Jika menemui dua pohon berpangkat dengan akar yang sama, cukup jumlahkan daun-daun eksponennya!',
    bossName: 'Silvanus Multipikasi',
    bossTitle: 'Ent Penjaga Hutan Perkalian',
    bossMaxHealth: 4,
  },
  {
    id: 3,
    name: 'GUNUNG PEMBAGIAN',
    themeTitle: 'Tebing Curam Selisih Pangkat',
    description: 'Mendaki puncak terjal dengan membagi bilangan berpangkat yang memiliki basis sama. Kurangkan pangkatnya untuk naik!',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-600',
    topics: ['Pembagian Berbasis Sama', 'Sifat aᵐ ÷ aⁿ = aᵐ⁻ⁿ', 'Penyederhanaan Pecahan Eksponen'],
    formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ (dengan a ≠ 0)',
    npcName: 'Sage Logika',
    npcRole: 'Petapa Gunung Pembagian',
    npcGreeting: 'Setiap langkah pendakian mengurangi bebanmu. Ketika membagi bilangan dengan basis yang sama, kurangkanlah eksponen pembilang dengan penyebut!',
    bossName: 'Gryphon Divisio',
    bossTitle: 'Penguasa Badai Gunung Pembagian',
    bossMaxHealth: 4,
  },
  {
    id: 4,
    name: 'GUA PANGKAT',
    themeTitle: 'Lorong Kristal Pangkat Bertingkat',
    description: 'Masuki kedalaman gua misterius di mana suatu bilangan berpangkat dapat dipangkatkan kembali!',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500 to-indigo-700',
    topics: ['Pangkat dari Pangkat', 'Sifat (aᵐ)ⁿ = aᵐˣⁿ', 'Sifat (a × b)ⁿ = aⁿ × bⁿ'],
    formula: '(aᵐ)ⁿ = aᵐˣⁿ',
    npcName: 'Elder Sigma',
    npcRole: 'Penjaga Kristal Gua Pangkat',
    npcGreeting: 'Pangkat yang ditumpuk di dalam gua ini menghasilkan kekuatan berlipat! Kalikan eksponen dalam dengan eksponen luar untuk membuka jalan!',
    bossName: 'Titan Kristal Eksponen',
    bossTitle: 'Penjaga Inti Gua Pangkat',
    bossMaxHealth: 4,
  },
  {
    id: 5,
    name: 'KASTEL EKSPONEN',
    themeTitle: 'Singgasana Ujian Akhir Numeria',
    description: 'Tantangan puncak Kerajaan Numeria: kuasai pangkat nol, pangkat negatif, dan pecahkan masalah HOTS tingkat tinggi!',
    color: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-700',
    topics: ['Pangkat Nol (a⁰ = 1)', 'Pangkat Negatif (a⁻ⁿ = 1/aⁿ)', 'Kombinasi Sifat & Soal HOTS'],
    formula: 'a⁰ = 1 | a⁻ⁿ = 1/aⁿ | (aᵐ × aⁿ) ÷ aᵖ = aᵐ⁺ⁿ⁻ᵖ',
    npcName: 'Putri Numeria',
    npcRole: 'Penjaga Takhta Kerajaan',
    npcGreeting: 'Kristal Utama berada di tangan Raja Eksponen yang terkena sihir kebingungan! Kuasai seluruh sifat eksponen untuk mengembalikannya!',
    bossName: 'RAJA EKSPONEN',
    bossTitle: 'Raja Penguasa Kerajaan Numeria',
    bossMaxHealth: 10,
  },
];

export const QUESTION_BANK: MathQuestion[] = [
  // --- REALM 1: DESA PANGKAT ---
  {
    id: 'r1_q1',
    realmId: 1,
    topic: 'Pengertian Bilangan Berpangkat',
    level: 'pemula',
    question: 'Berapakah nilai dari 2³ ?',
    options: ['5', '6', '8', '9'],
    correctAnswerIndex: 2,
    hints: [
      'Pangkat 3 artinya bilangan 2 dikalikan dengan dirinya sendiri sebanyak 3 kali.',
      'Hitung: 2 × 2 × 2 = ?'
    ],
    explanation: '2³ = 2 × 2 × 2 = 8. Jangan sampai tertukar dengan 2 × 3 = 6!',
    ruleFormula: 'aⁿ = a × a × ... × a (sebanyak n kali)'
  },
  {
    id: 'r1_q2',
    realmId: 1,
    topic: 'Basis dan Eksponen',
    level: 'pemula',
    question: 'Pada bentuk perpangkatan 5⁴, manakah yang merupakan basis (bilangan pokok) dan manakah eksponennya?',
    options: [
      'Basis = 4, Eksponen = 5',
      'Basis = 5, Eksponen = 4',
      'Basis = 20, Eksponen = 4',
      'Basis = 5, Eksponen = 20'
    ],
    correctAnswerIndex: 1,
    hints: [
      'Basis adalah bilangan utama di bawah, sedangkan eksponen adalah angka kecil di atas.',
      'Pada bentuk aᵇ: a adalah basis, b adalah eksponen (pangkat).'
    ],
    explanation: 'Pada 5⁴, angka 5 berada di bawah sebagai basis (bilangan pokok), dan angka 4 di atas sebagai eksponen (pangkat).',
    ruleFormula: 'Bentuk umum: aⁿ (a = basis, n = eksponen)'
  },
  {
    id: 'r1_q3',
    realmId: 1,
    topic: 'Menghitung Bentuk Sederhana',
    level: 'pemula',
    question: 'Berapakah hasil dari 3² + 4² ?',
    options: ['14', '25', '49', '12'],
    correctAnswerIndex: 1,
    hints: [
      'Hitung terlebih dahulu nilai 3² dan nilai 4², lalu jumlahkan keduanya.',
      '3² = 3 × 3 = 9, dan 4² = 4 × 4 = 16.'
    ],
    explanation: '3² = 9 dan 4² = 16. Maka 9 + 16 = 25 (yang juga sama dengan 5²).',
    ruleFormula: 'Operasi hitung: selesaikan perpangkatan sebelum penjumlahan.'
  },
  {
    id: 'r1_q4',
    realmId: 1,
    topic: 'Menghitung Bentuk Sederhana',
    level: 'pemula',
    question: 'Nilai dari 10² adalah...',
    options: ['20', '100', '1000', '10'],
    correctAnswerIndex: 1,
    hints: [
      '10 dipangkatkan 2 artinya 10 dikalikan 10.',
      '10 × 10 = ?'
    ],
    explanation: '10² = 10 × 10 = 100.',
    ruleFormula: '10ⁿ = angka 1 diikuti sebanyak n buah angka nol.'
  },
  {
    id: 'r1_q5',
    realmId: 1,
    topic: 'Pengertian Bilangan Berpangkat',
    level: 'pemula',
    question: 'Bentuk perkalian berulang (-3) × (-3) × (-3) × (-3) jika ditulis dalam bentuk pangkat adalah...',
    options: ['(-3)⁴', '-3⁴', '(-3) × 4', '3⁻⁴'],
    correctAnswerIndex: 0,
    hints: [
      'Bilangan (-3) dikalikan berulang sebanyak 4 kali dengan tanda kurung menyertai tanda minus.',
      'Gunakan tanda kurung: (-3)ⁿ dengan n adalah banyak pengulangan.'
    ],
    explanation: 'Karena (-3) dikalikan sebanyak 4 kali, maka penulisannya adalah (-3)⁴. Nilainya adalah +81.',
    ruleFormula: '(-a)ⁿ bernilai positif jika n genap, negatif jika n ganjil.'
  },

  // --- REALM 2: HUTAN PERKALIAN ---
  {
    id: 'r2_q1',
    realmId: 2,
    topic: 'Perkalian Berbasis Sama',
    level: 'penjelajah',
    question: 'Berapakah bentuk sederhana dari 2³ × 2² ?',
    options: ['2⁵', '2⁶', '4⁵', '4⁶'],
    correctAnswerIndex: 0,
    hints: [
      'Jika basisnya sama (keduanya angka 2), apa yang dilakukan terhadap pangkatnya pada operasi perkalian?',
      'Gunakan aturan perkalian eksponen: aᵐ × aⁿ = aᵐ⁺ⁿ. Jumlahkan pangkatnya!'
    ],
    explanation: '2³ × 2² = 2³⁺² = 2⁵ (nilainya adalah 32). Basis tetap 2, tidak dikalikan menjadi 4!',
    ruleFormula: 'aᵐ × aⁿ = aᵐ⁺ⁿ'
  },
  {
    id: 'r2_q2',
    realmId: 2,
    topic: 'Perkalian Berbasis Sama',
    level: 'penjelajah',
    question: 'Sederhanakan bentuk: 5⁴ × 5³ × 5¹',
    options: ['5¹²', '5⁸', '125⁸', '5⁷'],
    correctAnswerIndex: 1,
    hints: [
      'Perhatikan bahwa semua suku memiliki basis 5. Jumlahkan semua eksponennya: 4 + 3 + 1.',
      '4 + 3 + 1 = 8, basis tetap 5.'
    ],
    explanation: '5⁴ × 5³ × 5¹ = 5⁴⁺³⁺¹ = 5⁸.',
    ruleFormula: 'aᵖ × aᵠ × aʳ = aᵖ⁺ᵠ⁺ʳ'
  },
  {
    id: 'r2_q3',
    realmId: 2,
    topic: 'Sifat aᵐ × aⁿ',
    level: 'penjelajah',
    question: 'Bentuk sederhana dari (3x²) × (4x⁵) adalah...',
    options: ['7x⁷', '12x¹⁰', '12x⁷', '7x¹⁰'],
    correctAnswerIndex: 2,
    hints: [
      'Kalikan koefisien angka (3 × 4), dan kalikan variabel berpangkat (x² × x⁵) dengan menjumlahkan pangkatnya.',
      '3 × 4 = 12, dan x² × x⁵ = x²⁺⁵ = x⁷.'
    ],
    explanation: '(3 × 4) × (x² × x⁵) = 12 × x²⁺⁵ = 12x⁷. Koefisien dikalikan biasa, pangkat dijumlahkan!',
    ruleFormula: '(p · xᵃ) × (q · xᵇ) = (p · q) · xᵃ⁺ᵇ'
  },
  {
    id: 'r2_q4',
    realmId: 2,
    topic: 'Perkalian Berbasis Sama',
    level: 'penjelajah',
    question: 'Jika 3ⁿ × 3⁴ = 3⁹, berapakah nilai n yang tepat?',
    options: ['2', '4', '5', '36'],
    correctAnswerIndex: 2,
    hints: [
      'Sisi kiri: 3ⁿ × 3⁴ = 3ⁿ⁺⁴. Samakan pangkatnya dengan sisi kanan: n + 4 = 9.',
      'Berapa ditambah 4 agar hasilnya 9?'
    ],
    explanation: '3ⁿ⁺⁴ = 3⁹, sehingga n + 4 = 9, maka n = 9 - 4 = 5.',
    ruleFormula: 'Jika aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ maka f(x) = g(x) untuk a > 0, a ≠ 1'
  },

  // --- REALM 3: GUNUNG PEMBAGIAN ---
  {
    id: 'r3_q1',
    realmId: 3,
    topic: 'Pembagian Berbasis Sama',
    level: 'petualang',
    question: 'Bentuk sederhana dari 3⁷ ÷ 3⁴ adalah...',
    options: ['3¹¹', '3³', '1³', '3²⁸'],
    correctAnswerIndex: 1,
    hints: [
      'Pada pembagian dua bilangan berpangkat dengan basis yang sama, kurangkan pangkat pembilang dengan penyebut.',
      'Aturan: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. Hitung 7 - 4 = ?'
    ],
    explanation: '3⁷ ÷ 3⁴ = 3⁷⁻⁴ = 3³ (nilainya 27). Basis tetap 3, pangkat dikurangi.',
    ruleFormula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ'
  },
  {
    id: 'r3_q2',
    realmId: 3,
    topic: 'Pembagian Berbasis Sama',
    level: 'petualang',
    question: 'Hasil dari (8a⁶b⁴) ÷ (2a²b) adalah...',
    options: ['4a⁴b³', '4a³b⁴', '6a⁴b³', '4a⁸b⁵'],
    correctAnswerIndex: 0,
    hints: [
      'Bagi koefisien: 8 ÷ 2. Bagi variabel a: a⁶ ÷ a². Bagi variabel b: b⁴ ÷ b¹.',
      '8 ÷ 2 = 4, a⁶⁻² = a⁴, b⁴⁻¹ = b³.'
    ],
    explanation: '(8 ÷ 2) · a⁶⁻² · b⁴⁻¹ = 4a⁴b³.',
    ruleFormula: '(p · aᵐbⁿ) ÷ (q · aʳbˢ) = (p/q) · aᵐ⁻ʳ · bⁿ⁻ˢ'
  },
  {
    id: 'r3_q3',
    realmId: 3,
    topic: 'Penyederhanaan Pecahan Eksponen',
    level: 'petualang',
    question: 'Berapakah nilai dari (2⁸ × 2²) ÷ 2⁶ ?',
    options: ['2⁴ = 16', '2³ = 8', '2⁵ = 32', '2¹⁶'],
    correctAnswerIndex: 0,
    hints: [
      'Selesaikan pembilang terlebih dahulu dengan menjumlahkan pangkat, lalu kurangkan dengan pangkat penyebut.',
      'Pembilang: 2⁸⁺² = 2¹⁰. Lalu 2¹⁰ ÷ 2⁶ = 2¹⁰⁻⁶ = 2⁴.'
    ],
    explanation: '(2⁸ × 2²) ÷ 2⁶ = 2¹⁰ ÷ 2⁶ = 2¹⁰⁻⁶ = 2⁴ = 16.',
    ruleFormula: '(aᵐ × aⁿ) ÷ aᵖ = aᵐ⁺ⁿ⁻ᵖ'
  },
  {
    id: 'r3_q4',
    realmId: 3,
    topic: 'Pembagian Berbasis Sama',
    level: 'petualang',
    question: 'Jika 5⁸ ÷ 5ˣ = 5³, berapakah nilai x?',
    options: ['2', '3', '5', '8'],
    correctAnswerIndex: 2,
    hints: [
      '5⁸⁻ˣ = 5³. Samakan eksponennya: 8 - x = 3.',
      '8 dikurangi berapa yang menghasilkan 3?'
    ],
    explanation: '8 - x = 3, maka x = 8 - 3 = 5.',
    ruleFormula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ'
  },

  // --- REALM 4: GUA PANGKAT ---
  {
    id: 'r4_q1',
    realmId: 4,
    topic: 'Pangkat dari Pangkat',
    level: 'petualang',
    question: 'Bentuk sederhana dari (2³)² adalah...',
    options: ['2⁵', '2⁶', '2⁹', '4⁶'],
    correctAnswerIndex: 1,
    hints: [
      'Jika suatu perpangkatan dipangkatkan lagi, kalikan kedua eksponennya!',
      'Gunakan rumus (aᵐ)ⁿ = aᵐˣⁿ. Hitung 3 × 2 = ?'
    ],
    explanation: '(2³)² = 2³ˣ² = 2⁶ (nilainya adalah 64). Bukan 2³⁺² = 2⁵.',
    ruleFormula: '(aᵐ)ⁿ = aᵐˣⁿ'
  },
  {
    id: 'r4_q2',
    realmId: 4,
    topic: 'Pangkat dari Pangkat',
    level: 'petualang',
    question: 'Bentuk sederhana dari (3a²b³)⁴ adalah...',
    options: ['3a⁸b¹²', '12a⁸b¹²', '81a⁸b¹²', '81a⁶b⁷'],
    correctAnswerIndex: 2,
    hints: [
      'Pangkat 4 berlaku untuk semua faktor di dalam kurung: 3⁴, (a²)⁴, dan (b³)⁴.',
      '3⁴ = 81, a²ˣ⁴ = a⁸, b³ˣ⁴ = b¹².'
    ],
    explanation: '(3)⁴ · (a²)⁴ · (b³)⁴ = 81 · a⁸ · b¹² = 81a⁸b¹².',
    ruleFormula: '(k · aᵐ · bⁿ)ᵖ = kᵖ · aᵐˣᵖ · bⁿˣᵖ'
  },
  {
    id: 'r4_q3',
    realmId: 4,
    topic: 'Pangkat dari Pangkat',
    level: 'petualang',
    question: 'Berapakah nilai dari [(2²)³]² ?',
    options: ['2⁷', '2¹²', '2¹⁸', '2²⁴'],
    correctAnswerIndex: 1,
    hints: [
      'Kalikan semua eksponen bertingkat: 2 × 3 × 2.',
      '2 × 3 × 2 = 12.'
    ],
    explanation: '[(2²)³]² = 2²ˣ³ˣ² = 2¹² = 4096.',
    ruleFormula: '[ (aᵐ)ⁿ ]ᵖ = aᵐˣⁿˣᵖ'
  },
  {
    id: 'r4_q4',
    realmId: 4,
    topic: 'Kombinasi Sifat',
    level: 'petualang',
    question: 'Bentuk sederhana dari ((p³)⁴ × p²) ÷ p⁸ adalah...',
    options: ['p⁴', 'p⁶', 'p⁸', 'p¹⁴'],
    correctAnswerIndex: 1,
    hints: [
      'Sederhanakan (p³)⁴ menjadi p¹². Lalu kalikan dengan p² menjadi p¹⁴. Terakhir bagi dengan p⁸.',
      'p¹⁴ ÷ p⁸ = p¹⁴⁻⁸ = p⁶.'
    ],
    explanation: '(p³)⁴ = p¹². Pembilang: p¹² × p² = p¹⁴. Dibagi penyebut: p¹⁴ ÷ p⁸ = p¹⁴⁻⁸ = p⁶.',
    ruleFormula: 'Kombinasi: (aᵐ)ⁿ = aᵐⁿ, perkalian aᵐ⁺ⁿ, pembagian aᵐ⁻ⁿ'
  },

  // --- REALM 5: KASTEL EKSPONEN (PANGKAT NOL, NEGATIF, HOTS) ---
  {
    id: 'r5_q1',
    realmId: 5,
    topic: 'Pangkat Nol',
    level: 'master',
    question: 'Berapakah nilai dari 2026⁰ + 5⁰ ?',
    options: ['0', '1', '2', '2031'],
    correctAnswerIndex: 2,
    hints: [
      'Berapapun bilangan bukan nol jika dipangkatkan 0, nilainya selalu sama.',
      'Sifat: a⁰ = 1 (untuk a ≠ 0). Jadi 2026⁰ = 1 dan 5⁰ = 1.'
    ],
    explanation: 'Setiap bilangan tak nol dipangkatkan 0 bernilai 1. Maka 2026⁰ + 5⁰ = 1 + 1 = 2.',
    ruleFormula: 'a⁰ = 1 (untuk a ≠ 0)'
  },
  {
    id: 'r5_q2',
    realmId: 5,
    topic: 'Pangkat Negatif',
    level: 'master',
    question: 'Bentuk 2⁻³ jika diubah menjadi pangkat positif bernilai...',
    options: ['-6', '-8', '1/8', '1/6'],
    correctAnswerIndex: 2,
    hints: [
      'Pangkat negatif berarti kebalikan (1 per bilangan berpangkat positif).',
      'a⁻ⁿ = 1 / (aⁿ). Maka 2⁻³ = 1 / (2³) = 1 / 8.'
    ],
    explanation: '2⁻³ = 1 / 2³ = 1 / 8. Pangkat negatif bukan berarti hasilnya bertanda minus!',
    ruleFormula: 'a⁻ⁿ = 1 / aⁿ'
  },
  {
    id: 'r5_q3',
    realmId: 5,
    topic: 'Pangkat Negatif',
    level: 'master',
    question: 'Nilai dari (1/3)⁻² adalah...',
    options: ['1/9', '-6', '9', '-9'],
    correctAnswerIndex: 2,
    hints: [
      'Pangkat negatif membalikkan pecahan: (1/a)⁻ⁿ = aⁿ.',
      '(1/3)⁻² = (3/1)² = 3² = ?'
    ],
    explanation: '(1/3)⁻² = 3² = 9.',
    ruleFormula: '(a/b)⁻ⁿ = (b/a)ⁿ'
  },
  {
    id: 'r5_q4',
    realmId: 5,
    topic: 'Soal HOTS & Cerita',
    level: 'legend',
    isHOTS: true,
    question: 'Sebuah bakteri membelah diri menjadi 2 setiap 20 menit. Jika mula-mula ada 5 bakteri, berapa jumlah bakteri setelah 1 jam (60 menit)?',
    options: ['20 bakteri', '40 bakteri', '80 bakteri', '120 bakteri'],
    correctAnswerIndex: 1,
    hints: [
      '1 jam = 60 menit. Berapa kali pembelahan terjadi dalam 60 menit jika membelah setiap 20 menit?',
      '60 ÷ 20 = 3 kali pembelahan. Jumlah = mula-mula × 2³ = 5 × 8.'
    ],
    explanation: 'Dalam 60 menit terjadi 60/20 = 3 siklus pembelahan. Jumlah bakteri = 5 × 2³ = 5 × 8 = 40 bakteri.',
    ruleFormula: 'Pertumbuhan Eksponensial: N = N₀ × rᵗ'
  },
  {
    id: 'r5_q5',
    realmId: 5,
    topic: 'Tantangan HOTS Tingkat Tinggi',
    level: 'legend',
    isHOTS: true,
    question: 'Jika 2ˣ = 3, maka nilai dari 8ˣ adalah...',
    options: ['9', '18', '27', '81'],
    correctAnswerIndex: 2,
    hints: [
      'Hubungkan angka 8 dengan angka 2 menggunakan perpangkatan: 8 = 2³.',
      '8ˣ = (2³)ˣ = (2ˣ)³. Sekarang ganti 2ˣ dengan 3!'
    ],
    explanation: 'Karena 8 = 2³, maka 8ˣ = (2³)ˣ = (2ˣ)³. Diketahui 2ˣ = 3, maka nilainya adalah 3³ = 27!',
    ruleFormula: '(aᵐ)ⁿ = (aⁿ)ᵐ'
  },
  {
    id: 'r5_q6',
    realmId: 5,
    topic: 'Kombinasi Sifat Kompleks',
    level: 'legend',
    isHOTS: true,
    question: 'Bentuk sederhana dari (2³ × 3⁴)² ÷ (2⁴ × 3⁶) adalah...',
    options: ['2² × 3² = 36', '2¹ × 3² = 18', '2² × 3¹ = 12', '2³ × 3⁰ = 8'],
    correctAnswerIndex: 0,
    hints: [
      'Pangkatkan pembilang terlebih dahulu: (2³)² = 2⁶ dan (3⁴)² = 3⁸.',
      'Lalu bagi masing-masing basis: 2⁶⁻⁴ dan 3⁸⁻⁶.'
    ],
    explanation: 'Pembilang: 2⁶ × 3⁸. Dibagi penyebut (2⁴ × 3⁶): 2⁶⁻⁴ × 3⁸⁻⁶ = 2² × 3² = 4 × 9 = 36.',
    ruleFormula: '(aᵐbⁿ)ᵖ = aᵐᵖbⁿᵖ dan aᵐ ÷ aⁿ = aᵐ⁻ⁿ'
  }
];

// Special King Exponent 10-Question Progressive Final Gauntlet
export const KING_EXPONENT_QUESTIONS: MathQuestion[] = [
  {
    id: 'king_1',
    realmId: 5,
    topic: 'Pengertian Dasar',
    level: 'pemula',
    question: 'Raja Eksponen Menguji! Berapakah nilai dari 4³ ?',
    options: ['12', '16', '64', '81'],
    correctAnswerIndex: 2,
    hints: ['4³ = 4 × 4 × 4.', '4 × 4 = 16, lalu 16 × 4 = ?'],
    explanation: '4³ = 4 × 4 × 4 = 64.',
    ruleFormula: 'aⁿ = a × a × ... × a'
  },
  {
    id: 'king_2',
    realmId: 5,
    topic: 'Perkalian Eksponen',
    level: 'penjelajah',
    question: 'Sederhanakan serangan: 3⁴ × 3³ = ...',
    options: ['3⁷', '3¹²', '9⁷', '9¹²'],
    correctAnswerIndex: 0,
    hints: ['Basis sama, kalikan -> jumlahkan eksponennya.', '3⁴⁺³ = 3⁷.'],
    explanation: '3⁴ × 3³ = 3⁴⁺³ = 3⁷ = 2187.',
    ruleFormula: 'aᵐ × aⁿ = aᵐ⁺ⁿ'
  },
  {
    id: 'king_3',
    realmId: 5,
    topic: 'Pembagian Eksponen',
    level: 'penjelajah',
    question: 'Tangkis serangan: 7⁶ ÷ 7² = ...',
    options: ['7³', '7⁴', '7⁸', '1⁴'],
    correctAnswerIndex: 1,
    hints: ['Basis sama, bagi -> kurangkan eksponennya.', '7⁶⁻² = 7⁴.'],
    explanation: '7⁶ ÷ 7² = 7⁶⁻² = 7⁴.',
    ruleFormula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ'
  },
  {
    id: 'king_4',
    realmId: 5,
    topic: 'Pangkat Bertingkat',
    level: 'petualang',
    question: 'Ledakan Pangkat: (5²)³ = ...',
    options: ['5⁵', '5⁶', '5⁸', '10³'],
    correctAnswerIndex: 1,
    hints: ['Pangkat dipangkatkan -> kalikan pangkatnya.', '2 × 3 = 6.'],
    explanation: '(5²)³ = 5²ˣ³ = 5⁶.',
    ruleFormula: '(aᵐ)ⁿ = aᵐⁿ'
  },
  {
    id: 'king_5',
    realmId: 5,
    topic: 'Pangkat Nol',
    level: 'petualang',
    question: 'Kutukan Nol: Berapakah nilai dari (99⁹⁹)⁰ ?',
    options: ['0', '1', '99', 'Tak terdefinisi'],
    correctAnswerIndex: 1,
    hints: ['Apapun bilangan tak nol jika dipangkatkan 0 selalu sama.', 'a⁰ = 1 untuk a ≠ 0.'],
    explanation: 'Setiap bilangan bukan nol yang dipangkatkan 0 selalu menghasilkan 1.',
    ruleFormula: 'a⁰ = 1 (a ≠ 0)'
  },
  {
    id: 'king_6',
    realmId: 5,
    topic: 'Pangkat Negatif',
    level: 'master',
    question: 'Perisai Terbalik: Bentuk 5⁻² senilai dengan...',
    options: ['-10', '-25', '1/25', '1/10'],
    correctAnswerIndex: 2,
    hints: ['Pangkat negatif adalah 1 per bilangan berpangkat positif.', '1 / (5²) = 1 / 25.'],
    explanation: '5⁻² = 1 / 5² = 1 / 25 = 0,04.',
    ruleFormula: 'a⁻ⁿ = 1 / aⁿ'
  },
  {
    id: 'king_7',
    realmId: 5,
    topic: 'Kombinasi Sifat',
    level: 'master',
    question: 'Sederhanakan kombinasi mantra: (a³ × a⁴) ÷ a⁵ = ...',
    options: ['a²', 'a³', 'a⁷', 'a¹²'],
    correctAnswerIndex: 0,
    hints: ['Jumlahkan dulu pembilang: a³⁺⁴ = a⁷.', 'Lalu kurangkan penyebut: a⁷⁻⁵ = a².'],
    explanation: '(a³ × a⁴) ÷ a⁵ = a⁷ ÷ a⁵ = a⁷⁻⁵ = a².',
    ruleFormula: '(aᵐ × aⁿ) ÷ aᵖ = aᵐ⁺ⁿ⁻ᵖ'
  },
  {
    id: 'king_8',
    realmId: 5,
    topic: 'Aljabar Eksponen',
    level: 'master',
    question: 'Nilai dari 2⁴ × 4² jika diubah ke basis 2 tunggal adalah...',
    options: ['2⁶', '2⁷', '2⁸', '8⁶'],
    correctAnswerIndex: 2,
    hints: ['Ubah 4 menjadi 2².', '4² = (2²)² = 2⁴. Lalu kalikan 2⁴ × 2⁴.'],
    explanation: '4² = (2²)² = 2⁴. Maka 2⁴ × 2⁴ = 2⁴⁺⁴ = 2⁸ (nilainya 256).',
    ruleFormula: 'Samakan basis: 4 = 2²'
  },
  {
    id: 'king_9',
    realmId: 5,
    topic: 'Soal HOTS Strategi',
    level: 'legend',
    isHOTS: true,
    question: 'Tantangan Mahkota I: Jika 3ˣ = 5, maka nilai dari 3ˣ⁺² adalah...',
    options: ['7', '25', '45', '75'],
    correctAnswerIndex: 2,
    hints: ['Pecah bentuk 3ˣ⁺² menjadi perkalian: 3ˣ × 3².', 'Ganti 3ˣ dengan 5, dan 3² = 9. Kalikan keduanya!'],
    explanation: '3ˣ⁺² = 3ˣ × 3² = 5 × 9 = 45!',
    ruleFormula: 'aᵐ⁺ⁿ = aᵐ × aⁿ'
  },
  {
    id: 'king_10',
    realmId: 5,
    topic: 'Tantangan HOTS Terakhir',
    level: 'legend',
    isHOTS: true,
    question: 'Ujian Terakhir Pemulihan Kerajaan! Berapakah hasil dari: (2⁰ + 2¹ + 2² + 2³) ÷ 2⁻¹ ?',
    options: ['15', '30', '7.5', '16'],
    correctAnswerIndex: 1,
    hints: [
      'Hitung dulu pembilang: 2⁰=1, 2¹=2, 2²=4, 2³=8. Jumlahkan semuanya.',
      '1 + 2 + 4 + 8 = 15. Lalu 15 dibagi 2⁻¹ (ingat: 2⁻¹ = 1/2, membagi dengan 1/2 sama dengan mengalikan 2)!'
    ],
    explanation: 'Pembilang: 1 + 2 + 4 + 8 = 15. Penyebut: 2⁻¹ = 1/2. Maka 15 ÷ (1/2) = 15 × 2 = 30!',
    ruleFormula: 'a⁰=1 dan x ÷ (1/k) = x · k'
  }
];
