export interface DzikirItem {
  id: string;
  category: "calm" | "morning_evening" | "healing" | "gratitude" | "istighfar" | "strength";
  categoryLabel: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  benefit: string;
  targetCount: number;
  source: string;
  recommendedForMood: string[];
}

export interface SpiritualQuote {
  id: string;
  quote: string;
  authorOrSource: string;
  theme: "sabr" | "tawakkul" | "peace" | "healing" | "gratitude" | "hope";
  themeLabel: string;
  tazkiyahExplanation: string;
}

export interface ReflectionJournalEntry {
  id: string;
  date: string;
  moodTag: "tenteram" | "bersyukur" | "butuh_kekuatan" | "muhasabah" | "pasrah";
  note: string;
  dzikirDoneCount: number;
}

export const DZIKIR_COLLECTION: DzikirItem[] = [
  {
    id: "dzikir-1",
    category: "calm",
    categoryLabel: "Penenang Hati & Pengurai Gelisah",
    title: "Doa Nabi Yunus (Pelepas Kegundahan Batin)",
    arabic: "لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "Lā ilāha illā Anta, subḥānaka innī kuntu minaẓ-ẓālimīn.",
    translation: "Tidak ada Tuhan selain Engkau, Maha Suci Engkau, sungguh aku termasuk orang-orang yang zhalim.",
    benefit: "Membongkar simpul keputusasaan, mengikis kecemasan eksistensial, dan memulihkan keyakinan bahwa pertolongan Allah melampaui segala kegelapan.",
    targetCount: 33,
    source: "QS. Al-Anbiya: 87 (Shahih HR. Tirmidzi)",
    recommendedForMood: ["cemas", "lelah_batin", "overthinking", "sesak"],
  },
  {
    id: "dzikir-2",
    category: "istighfar",
    categoryLabel: "Istighfar & Tazkiyatun Nafs",
    title: "Sayyidul Istighfar (Pembersih Jiwa Utama)",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allāhumma Anta Rabbī lā ilāha illā Anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdzu bika min syarri mā ṣana'tu, abū'u laka bini'matika 'alayya, wa abū'u laka bidzanbī, faghfir lī fa-innahū lā yaghfirudz-dzunūba illā Anta.",
    translation: "Ya Allah, Engkau adalah Tuhanku, tiada Tuhan selain Engkau. Engkau menciptakanku dan aku hamba-Mu, aku memegang janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku, aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Maka ampunilah aku, karena sesungguhnya tiada yang mengampuni dosa selain Engkau.",
    benefit: "Menyucikan noda penyesalan batin, meluruhkan rasa bersalah toksik (*toxic guilt*), dan mengembalikan kemurnian fitrah *Qolbun Salim*.",
    targetCount: 3,
    source: "Shahih Bukhari No. 6306",
    recommendedForMood: ["penyesalan", "lelah_batin", "rasa_bersalah"],
  },
  {
    id: "dzikir-3",
    category: "calm",
    categoryLabel: "Ketenangan Jiwa & Thuma'ninah",
    title: "Hauqalah (Kepasrahan Total & Pengikis Beban)",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Lā ḥawla wa lā quwwata illā billāhil-'aliyyil-'aẓīm.",
    translation: "Tiada daya untuk menjauhi maksiat dan tiada kekuatan untuk berbuat ketaatan kecuali dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.",
    benefit: "Menghentikan ilusi kendali berlebih yang memicu *burnout*, menumbuhkan penerimaan (*acceptance*), dan mengalirkan energi tawakkul.",
    targetCount: 100,
    source: "Shahih Bukhari & Muslim (Simpanan Perbendaharaan Surga)",
    recommendedForMood: ["burnout", "cemas", "lelah_batin", "krisis"],
  },
  {
    id: "dzikir-4",
    category: "healing",
    categoryLabel: "Doa Perlindungan Jiwa & Raga",
    title: "Doa Penghilang Gelisah & Duka Mendalam",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allāhumma innī a'ūdzu bika minal-hammi wal-ḥazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa ḍala'id-dayni wa ghalabatir-rijāl.",
    translation: "Ya Allah, aku berlindung kepada-Mu dari rasa gelisah dan duka cita, dari kelemahan dan kemalasan, dari sifat kikir dan pengecut, serta dari lilitan hutang dan tekanan orang-orang.",
    benefit: "Perlindungan klinis ruhani dari 8 rantai distres psikologis (kecemasan masa depan, trauma masa lalu, keputusasaan, dan tekanan sosial).",
    targetCount: 7,
    source: "Shahih Bukhari No. 5425",
    recommendedForMood: ["cemas", "depresi", "trauma", "tertekan"],
  },
  {
    id: "dzikir-5",
    category: "strength",
    categoryLabel: "Kekuatan & Tawakkul",
    title: "Hasbunallah wa Ni'mal Wakil",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَىٰ وَنِعْمَ النَّصِيرُ",
    transliteration: "Ḥasbunallāhu wa ni'mal-wakīl, ni'mal-mawlā wa ni'man-naṣīr.",
    translation: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung, sebaik-baik Pemimpin dan sebaik-baik Penolong.",
    benefit: "Menegakkan resiliensi spiritual saat menghadapi vonis sulit, badai hidup, atau ketika merasa sendirian tanpa sandaran manusia.",
    targetCount: 33,
    source: "QS. Ali 'Imran: 173 (Dzikir Nabi Ibrahim & Rasulullah SAW)",
    recommendedForMood: ["takut", "putus_asa", "kesepian", "krisis"],
  },
  {
    id: "dzikir-6",
    category: "healing",
    categoryLabel: "Penguat Jiwa & Urusan",
    title: "Ya Hayyu Ya Qayyum (Doa Keterlepasan & Rahmat)",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration: "Yā Ḥayyu yā Qayyūm, bi-raḥmatika astaghīts, aṣliḥ lī sya'nī kullahu wa lā takilnī ilā nafsī ṭarfata 'ayn.",
    translation: "Wahai Yang Maha Hidup, Wahai Yang Maha Berdiri Sendiri, dengan rahmat-Mu aku memohon pertolongan. Perbaikilah seluruh urusanku dan jangan Engkau serahkan aku kepada diriku sendiri walau sekejap mata.",
    benefit: "Menghadirkan rasa aman yang mendalam bahwa hidup kita di bawah pemeliharaan Dzat Yang Maha Menghidupkan dan Mengatur segalanya.",
    targetCount: 33,
    source: "Shahih HR. Al-Hakim & An-Nasa'i",
    recommendedForMood: ["lelah_batin", "bingung", "kewalahan"],
  },
  {
    id: "dzikir-7",
    category: "gratitude",
    categoryLabel: "Syukur & Ketenangan",
    title: "Tasbih & Tahmid Kalimah Tercinta",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "Subḥānallāhi wa biḥamdihī, Subḥānallāhil-'Aẓīm.",
    translation: "Maha Suci Allah dengan segala puji bagi-Nya, Maha Suci Allah Yang Maha Agung.",
    benefit: "Dua kalimat yang ringan di lisan namun berat di timbangan kebajikan, melahirkan hormon ketenangan dan kejernihan pikiran (*mindfulness*).",
    targetCount: 100,
    source: "Shahih Bukhari No. 6682 & Muslim No. 2694",
    recommendedForMood: ["netral", "tenang", "bersyukur"],
  },
  {
    id: "dzikir-8",
    category: "morning_evening",
    categoryLabel: "Perlindungan Batin Pagi & Petang",
    title: "Benteng Dari Segala Marabahaya",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillāhillażī lā yaḍurru ma'asmihī syay'un fil-arḍi wa lā fis-samā'i wa Huwas-Samī'ul-'Alīm.",
    translation: "Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat mencelakakan, dan Dia Maha Mendengar lagi Maha Mengetahui.",
    benefit: "Meredakan serangan panik (*panic attack*), paranoid, dan menanamkan tameng psikologis yang tak tergoyahkan.",
    targetCount: 3,
    source: "HR. Abu Dawud No. 5088 & Tirmidzi (Hasan Shahih)",
    recommendedForMood: ["cemas", "panik", "waswas"],
  }
];

export const SPIRITUAL_QUOTES: SpiritualQuote[] = [
  {
    id: "q-1",
    quote: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    authorOrSource: "QS. Ar-Ra'd: 28",
    theme: "peace",
    themeLabel: "Ketenangan Hakiki",
    tazkiyahExplanation: "Hati manusia dirancang memiliki ruang hampa yang tidak akan pernah bisa dipuaskan oleh materi atau pujian manusia, melainkan hanya dengan kedekatan bersama Sang Pencipta.",
  },
  {
    id: "q-2",
    quote: "Ketenangan bukanlah ketiadaan badai di sekelilingmu, melainkan kedamaian di dalam hatimu karena bersandar pada Dzat Yang Maha Mengatur Badai.",
    authorOrSource: "Imam Ibn Al-Qayyim Al-Jawziyyah (Thariq al-Hijratain)",
    theme: "tawakkul",
    themeLabel: "Tawakkul & Resiliensi",
    tazkiyahExplanation: "Ketika tawakkul meresap ke dalam jiwa, kegelisahan terhadap hal-hal di luar kendali kita akan luluh menjadi ketundukan yang menyejukkan.",
  },
  {
    id: "q-3",
    quote: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    authorOrSource: "QS. Al-Insyirah: 5-6",
    theme: "hope",
    themeLabel: "Harapan & Kemudahan",
    tazkiyahExplanation: "Satu kesulitan tidak akan pernah mampu mengalahkan dua kemudahan yang telah Allah siapkan menyertainya secara simultan.",
  },
  {
    id: "q-4",
    quote: "Obat dari hati yang keras dan gelisah ada lima: membaca Al-Qur'an dengan tadabbur, mengosongkan perut dari syubhat, bangun di keheningan malam, merendahkan diri di hadapan Allah saat sahur, dan duduk bersama orang-orang shalih.",
    authorOrSource: "Ibrahim Al-Khawwash (Kitab Tazkiyatun Nafs)",
    theme: "healing",
    themeLabel: "Resep Penyucian Jiwa",
    tazkiyahExplanation: "Terapi integratif ruhani menyelaraskan asupan fisik, keheningan mental, dan nutrisi spiritual untuk memulihkan vitalitas batin.",
  },
  {
    id: "q-5",
    quote: "Jika Allah menutup satu pintu yang kamu inginkan, ketahuilah bahwa Dia tidak menutupnya karena benci, melainkan sedang menyelamatkanmu dari jurang yang tak kamu lihat.",
    authorOrSource: "Syaikh Ibnu Atha'illah As-Sakandari (Al-Hikam)",
    theme: "sabr",
    themeLabel: "Husnudzan & Sabar",
    tazkiyahExplanation: "Menerima ketetapan takdir (*Ridha*) memutus siklus overthinking dan penyesalan masa lalu (*rumination*).",
  },
  {
    id: "q-6",
    quote: "وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    authorOrSource: "QS. Al-Baqarah: 155",
    theme: "sabr",
    themeLabel: "Kabar Gembira Bagi yang Sabar",
    tazkiyahExplanation: "Ujian hidup bukan tanda kemurkaan, melainkan proses penyaringan (*tamhish*) untuk meninggikan derajat spiritual dan memperkokoh karakter jiwa.",
  },
  {
    id: "q-7",
    quote: "Siapa yang menjadikan kerisauannya hanya satu—yaitu kerisauan akan pertemuannya dengan Allah—maka Allah akan mencukupi seluruh kerisauan duniawinya.",
    authorOrSource: "HR. Ibnu Majah No. 257 (Hadits Hasan)",
    theme: "peace",
    themeLabel: "Penyatuan Fokus Jiwa",
    tazkiyahExplanation: "Penyederhanaan orientasi hidup (*single focus*) mengurangi fragmentasi pikiran dan kepenatan psikologis di era penuh distraksi.",
  }
];

export const TAZKIYAH_BREATHING_STEPS = [
  { phase: "inhale", duration: 4, instruction: "Tarik Nafas Perlahan...", arabicFocus: "سُبْحَانَ اللَّهِ (Maha Suci Allah)" },
  { phase: "hold", duration: 4, instruction: "Tahan Nafas & Thuma'ninah...", arabicFocus: "الْحَمْدُ لِلَّهِ (Segala Puji Bagi Allah)" },
  { phase: "exhale", duration: 6, instruction: "Hembuskan & Lepaskan Gelisah...", arabicFocus: "أَسْتَغْفِرُ اللَّهَ (Aku Memohon Ampun)" },
  { phase: "pause", duration: 2, instruction: "Hati Tenang Bersama Allah...", arabicFocus: "لَا إِلٰهَ إِلَّا اللَّهُ" }
];
