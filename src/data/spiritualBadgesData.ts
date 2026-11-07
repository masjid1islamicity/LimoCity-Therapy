import { SpiritualBadge } from "../types";

export const INITIAL_SPIRITUAL_BADGES: SpiritualBadge[] = [
  {
    id: "badge-streak-1",
    title: "Langkah Pertama (Bismillah)",
    code: "FIRST_STEP",
    category: "streak",
    tier: "bronze",
    iconName: "Sparkles",
    requiredStreakDays: 1,
    description: "Menyelesaikan seluruh target ruhani harian untuk pertama kalinya dengan penuh kesadaran.",
    spiritualBenefit: "Memulai niat suci perbaikan diri. Setiap langkah awal bernilai pahala besar di sisi Allah SWT.",
    hadithOrVerseReference: "HR. Bukhari: 'Sesungguhnya setiap amalan tergantung pada niatnya.'",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "18 Agt 2026",
    rewardTitle: "Pencari Ketenangan",
    xpReward: 50,
  },
  {
    id: "badge-streak-3",
    title: "Penenang Fajar (3 Hari Konsisten)",
    code: "STREAK_3_DAYS",
    category: "streak",
    tier: "silver",
    iconName: "Sun",
    requiredStreakDays: 3,
    description: "Istiqomah menyelesaikan target ruhani harian selama 3 hari berturut-turut.",
    spiritualBenefit: "Menumbuhkan kebiasaan positif dan melatih ketenangan saraf dari distraksi duniawi.",
    hadithOrVerseReference: "QS. Al-Insyirah: 7 • 'Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain).'",
    progress: 3,
    maxProgress: 3,
    isUnlocked: true,
    unlockedAt: "21 Agt 2026",
    rewardTitle: "Penjaga Fajar",
    xpReward: 100,
  },
  {
    id: "badge-streak-7",
    title: "Pilar Keteguhan Jiwa (7 Hari Istiqomah)",
    code: "STREAK_7_DAYS",
    category: "streak",
    tier: "gold",
    iconName: "Flame",
    requiredStreakDays: 7,
    description: "Konsisten mencapai target spiritual harian selama 7 hari berturut-turut tanpa terputus.",
    spiritualBenefit: "Membentuk sirkuit neuroplastisitas ketenangan batin (*Sakinah*) dan memperkokoh benteng keimanan mingguan.",
    hadithOrVerseReference: "HR. Bukhari & Muslim: 'Amalan yang paling dicintai Allah adalah yang terus-menerus (istiqomah) walaupun sedikit.'",
    progress: 3,
    maxProgress: 7,
    isUnlocked: false,
    rewardTitle: "Kesatria Istiqomah 7 Hari",
    xpReward: 250,
  },
  {
    id: "badge-streak-14",
    title: "Benteng Tawakkal (14 Hari / 2 Pekan)",
    code: "STREAK_14_DAYS",
    category: "streak",
    tier: "emerald",
    iconName: "ShieldCheck",
    requiredStreakDays: 14,
    description: "Konsistensi 2 pekan berturut-turut menjaga kebersihan hati dan dzikir harian.",
    spiritualBenefit: "Mengikis kecemasan kronis dan membangun resiliensi psikologis berbasis tauhid dan kepasrahan total.",
    hadithOrVerseReference: "QS. At-Talaq: 3 • 'Dan barangsiapa bertawakkal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.'",
    progress: 3,
    maxProgress: 14,
    isUnlocked: false,
    rewardTitle: "Penjaga Benteng Qolbu",
    xpReward: 500,
  },
  {
    id: "badge-streak-30",
    title: "Master Tazkiyah Qolbu (30 Hari Sebulan Penuh)",
    code: "STREAK_30_DAYS",
    category: "streak",
    tier: "royal",
    iconName: "Crown",
    requiredStreakDays: 30,
    description: "Pencapaian luar biasa istiqomah selama 30 hari penuh membina ruhani dan kesehatan mental islami.",
    spiritualBenefit: "Transformasi karakter sejati. Amalan spiritual telah mengakar menjadi gaya hidup dan sumber kedamaian hakiki.",
    hadithOrVerseReference: "QS. Ar-Ra'd: 28 • 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.'",
    progress: 3,
    maxProgress: 30,
    isUnlocked: false,
    rewardTitle: "Master Tazkiyah 30 Hari",
    xpReward: 1000,
  },
  {
    id: "badge-streak-60",
    title: "As-Sabirun (60 Hari Ketabahan Sejati)",
    code: "STREAK_60_DAYS",
    category: "streak",
    tier: "royal",
    iconName: "Star",
    requiredStreakDays: 60,
    description: "Istiqomah 2 bulan penuh mengukir kedisiplinan jiwa dan ketenangan batin tingkat tinggi.",
    spiritualBenefit: "Mencapai derajat kelapangan dada dan kestabilan emosi yang kokoh dalam menghadapi segala ujian hidup.",
    hadithOrVerseReference: "QS. Az-Zumar: 10 • 'Sesungguhnya hanya orang-orang yang bersabarlah yang disempurnakan pahalanya tanpa batas.'",
    progress: 3,
    maxProgress: 60,
    isUnlocked: false,
    rewardTitle: "Hamba Pilihan Berjiwa Tenang",
    xpReward: 2000,
  },
  {
    id: "badge-quran-tadabbur",
    title: "Pecinta Tadabbur Al-Qur'an",
    code: "QURAN_LOVER",
    category: "mastery",
    tier: "silver",
    iconName: "BookOpen",
    description: "Membaca dan merenungi ayat-ayat penyembuh jiwa (*Syifa'*) dalam target harian.",
    spiritualBenefit: "Al-Qur'an menjadi obat penawar duka dan cahaya petunjuk saat pikiran dilanda keraguan.",
    hadithOrVerseReference: "QS. Al-Isra': 82 • 'Dan Kami turunkan dari Al-Qur'an suatu yang menjadi penawar dan rahmat bagi orang-orang yang beriman.'",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "20 Agt 2026",
    rewardTitle: "Sahabat Al-Qur'an",
    xpReward: 150,
  },
  {
    id: "badge-breathing-thumaninah",
    title: "Thuma'ninah Sejati (Relaksasi Nafas)",
    code: "BREATHING_MASTER",
    category: "tazkiyah",
    tier: "emerald",
    iconName: "Wind",
    description: "Menyelesaikan sesi pernapasan thuma'ninah 4-4-6 untuk menyeimbangkan sistem saraf.",
    spiritualBenefit: "Mengaktifkan saraf parasimpatis, meredakan ketegangan fisik, dan menghadirkan kekhusyukan.",
    hadithOrVerseReference: "HR. Muslim: 'Ketenangan itu berasal dari Allah, sedangkan ketergesa-gesaan itu berasal dari setan.'",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "22 Agt 2026",
    rewardTitle: "Praktisi Thuma'ninah",
    xpReward: 150,
  },
  {
    id: "badge-gratitude-heart",
    title: "Qolbun Syakir (Hati Penuh Syukur)",
    code: "GRATITUDE_HEART",
    category: "habit",
    tier: "emerald",
    iconName: "Heart",
    description: "Mencatat dan mensyukuri nikmat-nikmat tersembunyi dalam keseharian.",
    spiritualBenefit: "Meningkatkan dopamin alami, mengalihkan fokus dari kekurangan menuju kelimpahan rahmat Ilahi.",
    hadithOrVerseReference: "QS. Ibrahim: 7 • 'Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.'",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "23 Agt 2026",
    rewardTitle: "Hamba yang Bersyukur",
    xpReward: 150,
  }
];

export const calculateBadgesProgress = (
  currentStreak: number,
  completedGoalsCount: number = 0,
  savedBadges?: SpiritualBadge[]
): SpiritualBadge[] => {
  const baseBadges = savedBadges && savedBadges.length > 0 ? savedBadges : INITIAL_SPIRITUAL_BADGES;

  return baseBadges.map((badge) => {
    if (badge.requiredStreakDays) {
      const isUnlocked = currentStreak >= badge.requiredStreakDays;
      const progress = Math.min(currentStreak, badge.requiredStreakDays);
      const wasUnlocked = badge.isUnlocked;
      
      return {
        ...badge,
        progress,
        maxProgress: badge.requiredStreakDays,
        isUnlocked,
        unlockedAt: isUnlocked
          ? badge.unlockedAt || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : undefined,
      };
    }

    return badge;
  });
};

export const getBadgeTierStyles = (tier: string) => {
  switch (tier) {
    case "bronze":
      return {
        bg: "bg-amber-950/40",
        border: "border-amber-700/50",
        text: "text-amber-300",
        glow: "shadow-amber-900/30",
        pill: "bg-amber-900/50 text-amber-200 border-amber-600/40",
        gradient: "from-amber-700 to-amber-900",
        label: "Perunggu",
      };
    case "silver":
      return {
        bg: "bg-slate-900/60",
        border: "border-slate-400/50",
        text: "text-slate-200",
        glow: "shadow-slate-500/20",
        pill: "bg-slate-800 text-slate-200 border-slate-500/40",
        gradient: "from-slate-400 to-slate-600",
        label: "Perak",
      };
    case "gold":
      return {
        bg: "bg-amber-950/60",
        border: "border-[#C5A267]",
        text: "text-[#C5A267]",
        glow: "shadow-[#C5A267]/30",
        pill: "bg-[#C5A267]/20 text-[#C5A267] border-[#C5A267]/40",
        gradient: "from-[#C5A267] to-[#8C6D37]",
        label: "Emas (7 Hari)",
      };
    case "emerald":
      return {
        bg: "bg-emerald-950/50",
        border: "border-emerald-500/50",
        text: "text-emerald-300",
        glow: "shadow-emerald-900/30",
        pill: "bg-emerald-900/40 text-emerald-300 border-emerald-500/40",
        gradient: "from-emerald-500 to-emerald-800",
        label: "Zamrud",
      };
    case "royal":
    case "platinum":
      return {
        bg: "bg-gradient-to-b from-[#1C172E] to-[#120F24]",
        border: "border-amber-400 ring-1 ring-purple-500/40",
        text: "text-amber-300",
        glow: "shadow-purple-900/40",
        pill: "bg-gradient-to-r from-amber-400/20 to-purple-500/20 text-amber-300 border-amber-400/50",
        gradient: "from-amber-300 via-amber-500 to-purple-600",
        label: "Mahkota Platinum (30 Hari)",
      };
    default:
      return {
        bg: "bg-[#181C26]",
        border: "border-[#252E3E]",
        text: "text-[#C5A267]",
        glow: "shadow-black/20",
        pill: "bg-[#1F2937] text-[#C5A267] border-[#374151]",
        gradient: "from-slate-600 to-slate-800",
        label: "Standar",
      };
  }
};
