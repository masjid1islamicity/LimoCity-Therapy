import React, { useState, useEffect, useRef } from "react";
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Heart, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  Eye,
  Hand,
  Compass,
  ArrowRight,
  Music,
  Check
} from "lucide-react";
import { soundSynth } from "../utils/audioChime";
import { ambientAudioEngine } from "../utils/ambientAudioEngine";

export type BreathingTechniqueId = "4-4-6" | "4-7-8" | "4-4-4";

interface BreathingStep {
  phase: "inhale" | "hold" | "exhale" | "rest";
  label: string;
  duration: number; // in seconds
  instruction: string;
  arabicDzikir: string;
  dzikirMeaning: string;
  clinicalEffect: string;
  colorClass: {
    border: string;
    bg: string;
    text: string;
    ringGlow: string;
  };
}

interface BreathingTechniqueConfig {
  id: BreathingTechniqueId;
  name: string;
  shortName: string;
  tagline: string;
  targetClinicalGoal: string;
  idealCycleCount: number;
  steps: BreathingStep[];
}

const BREATHING_TECHNIQUES: Record<BreathingTechniqueId, BreathingTechniqueConfig> = {
  "4-4-6": {
    id: "4-4-6",
    name: "Ritme Thuma'ninah 4-4-6 (Protokol Cemas Akut)",
    shortName: "4-4-6 Thuma'ninah",
    tagline: "Regulasi Cepat Sistem Saraf Parasimpatis & Pengendali Serangan Panik",
    targetClinicalGoal: "Menstimulasi saraf vagus dan menurunkan lonjakan denyut jantung akibat adrenalin dalam 2-3 menit.",
    idealCycleCount: 4,
    steps: [
      {
        phase: "inhale",
        label: "Tarik Nafas",
        duration: 4,
        instruction: "Tarik nafas perlahan lewat hidung hingga diafragma mengembang.",
        arabicDzikir: "سُبْحَانَ اللَّهِ",
        dzikirMeaning: "Maha Suci Allah dari segala kecemasan",
        clinicalEffect: "Mengoksigenasi darah & mempersiapkan relaksasi vaskular",
        colorClass: {
          border: "border-emerald-400",
          bg: "from-emerald-950/60 to-emerald-900/20",
          text: "text-emerald-400",
          ringGlow: "rgba(52, 211, 153, 0.35)",
        },
      },
      {
        phase: "hold",
        label: "Tahan & Thuma'ninah",
        duration: 4,
        instruction: "Tahan nafas lembut tanpa tegang. Rilekskan rahang dan bahu.",
        arabicDzikir: "الْحَمْدُ لِلَّهِ",
        dzikirMeaning: "Segala puji bagi Allah, hati berserah",
        clinicalEffect: "Menstabilkan saturasi CO2 dan menahan lonjakan impuls panik",
        colorClass: {
          border: "border-[#C5A267]",
          bg: "from-[#C5A267]/30 to-[#141720]/80",
          text: "text-[#F3E8D2]",
          ringGlow: "rgba(197, 162, 103, 0.45)",
        },
      },
      {
        phase: "exhale",
        label: "Hembuskan Nafas",
        duration: 6,
        instruction: "Hembuskan panjang dan lembut lewat bibir yang agak terbuka.",
        arabicDzikir: "أَسْتَغْفِرُ اللَّهَ",
        dzikirMeaning: "Aku memohon ampun dan melepaskan beban",
        clinicalEffect: "Mengaktifkan saraf parasimpatis & menurunkan detak jantung",
        colorClass: {
          border: "border-sky-400",
          bg: "from-sky-950/60 to-sky-900/20",
          text: "text-sky-300",
          ringGlow: "rgba(56, 189, 248, 0.35)",
        },
      },
      {
        phase: "rest",
        label: "Jeda Hening",
        duration: 2,
        instruction: "Istirahat hening sejenak dalam keheningan kalbu.",
        arabicDzikir: "لَا إِلٰهَ إِلَّا اللَّهُ",
        dzikirMeaning: "Tiada daya dan kekuatan kecuali pertolongan Allah",
        clinicalEffect: "Menjaga ritme homeostasis alami sebelum siklus berikutnya",
        colorClass: {
          border: "border-indigo-400",
          bg: "from-indigo-950/50 to-[#0A0B0D]",
          text: "text-indigo-300",
          ringGlow: "rgba(129, 140, 248, 0.25)",
        },
      },
    ],
  },
  "4-7-8": {
    id: "4-7-8",
    name: "Ritme Relaksasi Saraf 4-7-8 (Deep Calming)",
    shortName: "4-7-8 Relaksasi Mendalam",
    tagline: "Pelepas Insomnia & Ketegangan Otot Menyeluruh",
    targetClinicalGoal: "Memaksa sistem kardiovaskular melambat melalui penahanan nafas lebih panjang.",
    idealCycleCount: 4,
    steps: [
      {
        phase: "inhale",
        label: "Tarik Nafas",
        duration: 4,
        instruction: "Tarik nafas hening lewat hidung, rasakan ketenangan mengalir.",
        arabicDzikir: "سُبْحَانَ اللَّهِ",
        dzikirMeaning: "Maha Suci Allah Yang Maha Menenangkan",
        clinicalEffect: "Inflow oksigen bersih ke organ vital",
        colorClass: {
          border: "border-emerald-400",
          bg: "from-emerald-950/60 to-emerald-900/20",
          text: "text-emerald-400",
          ringGlow: "rgba(52, 211, 153, 0.35)",
        },
      },
      {
        phase: "hold",
        label: "Tahan Nafas",
        duration: 7,
        instruction: "Tahan selama 7 detik dalam keheningan doa batin.",
        arabicDzikir: "حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ",
        dzikirMeaning: "Cukuplah Allah bagiku sebagai penolong",
        clinicalEffect: "Relaksasi tonus otot & pembuluh darah perifer",
        colorClass: {
          border: "border-[#C5A267]",
          bg: "from-[#C5A267]/30 to-[#141720]/80",
          text: "text-[#F3E8D2]",
          ringGlow: "rgba(197, 162, 103, 0.45)",
        },
      },
      {
        phase: "exhale",
        label: "Hembuskan Panjang",
        duration: 8,
        instruction: "Keluarkan nafas desah perlahan selama 8 detik penuh.",
        arabicDzikir: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        dzikirMeaning: "Tiada daya upaya kecuali dengan keagungan Allah",
        clinicalEffect: "Menghentikan respon flight-or-fight ke tingkat sedasi alami",
        colorClass: {
          border: "border-purple-400",
          bg: "from-purple-950/60 to-purple-900/20",
          text: "text-purple-300",
          ringGlow: "rgba(192, 132, 252, 0.35)",
        },
      },
    ],
  },
  "4-4-4": {
    id: "4-4-4",
    name: "Ritme Kotak (Box Breathing 4-4-4-4)",
    shortName: "4-4-4-4 Box Breathing",
    tagline: "Pengembali Kendali Pikiran & Fokus Saat Overwhelmed",
    targetClinicalGoal: "Membagi konsentrasi menjadi 4 kuadran seimbang untuk memutus badai pikiran *overthinking*.",
    idealCycleCount: 4,
    steps: [
      {
        phase: "inhale",
        label: "Tarik Nafas",
        duration: 4,
        instruction: "Tarik nafas 4 detik perlahan dan berirama.",
        arabicDzikir: "سُبْحَانَ اللَّهِ",
        dzikirMeaning: "Maha Suci Allah",
        clinicalEffect: "Meningkatkan kejernihan sensoris otak",
        colorClass: {
          border: "border-teal-400",
          bg: "from-teal-950/60 to-teal-900/20",
          text: "text-teal-400",
          ringGlow: "rgba(45, 212, 191, 0.35)",
        },
      },
      {
        phase: "hold",
        label: "Tahan Nafas",
        duration: 4,
        instruction: "Tahan dengan tenang pada paru-paru penuh.",
        arabicDzikir: "الْحَمْدُ لِلَّهِ",
        dzikirMeaning: "Segala puji bagi Allah",
        clinicalEffect: "Fokus atensi mental penuh",
        colorClass: {
          border: "border-[#C5A267]",
          bg: "from-[#C5A267]/30 to-[#141720]/80",
          text: "text-[#F3E8D2]",
          ringGlow: "rgba(197, 162, 103, 0.45)",
        },
      },
      {
        phase: "exhale",
        label: "Hembuskan Nafas",
        duration: 4,
        instruction: "Hembuskan 4 detik hingga paru-paru kosong santai.",
        arabicDzikir: "أَسْتَغْفِرُ اللَّهَ",
        dzikirMeaning: "Aku memohon ampun",
        clinicalEffect: "Pelepasan tegangan neuromuskular",
        colorClass: {
          border: "border-sky-400",
          bg: "from-sky-950/60 to-sky-900/20",
          text: "text-sky-300",
          ringGlow: "rgba(56, 189, 248, 0.35)",
        },
      },
      {
        phase: "rest",
        label: "Tahan Kosong",
        duration: 4,
        instruction: "Tahan rileks selama 4 detik sebelum menarik nafas lagi.",
        arabicDzikir: "اللَّهُ أَكْبَرُ",
        dzikirMeaning: "Allah Maha Besar di atas segala masalah",
        clinicalEffect: "Pemulihan keseimbangan ritme jantung",
        colorClass: {
          border: "border-amber-400",
          bg: "from-amber-950/60 to-amber-900/20",
          text: "text-amber-300",
          ringGlow: "rgba(251, 191, 36, 0.35)",
        },
      },
    ],
  },
};

// Grounding 5-4-3-2-1 items with spiritual touch
const GROUNDING_STEPS = [
  {
    count: 5,
    title: "5 Benda Yang Dilihat",
    sub: "Arahkan pandangan ke sekitarmu, sebutkan 5 benda nyata (meja, dinding, jendela, cahaya, sajadah). Ciptaan Allah nyata & hadir di sini.",
    icon: Eye,
  },
  {
    count: 4,
    title: "4 Benda Yang Disentuh",
    sub: "Raba 4 tekstur fisik nyata (kain pakaian, permukaan meja dingin, telapak tanganmu sendiri, lantai di bawah kakimu).",
    icon: Hand,
  },
  {
    count: 3,
    title: "3 Suara Yang Didengar",
    sub: "Dengarkan dengan seksama 3 suara nyata (desir AC/kipas, detak jam dinding, atau suara nafasmu sendiri).",
    icon: Activity,
  },
  {
    count: 2,
    title: "2 Aroma Yang Dihirup",
    sub: "Hirup udara di sekitarmu (aroma ruangan, minyak wangi, teh, atau udara segar).",
    icon: Wind,
  },
  {
    count: 1,
    title: "1 Doa & Rasa Syukur Kalbu",
    sub: "Ucapkan dalam hati: 'Alhamdulillah 'ala kulli hal, nafasku masih mengalir, Allah menjagaku detik ini.'",
    icon: Heart,
  },
];

interface ThumaninahBreathingGuideProps {
  onOpenAICounselor?: () => void;
  onOpenBooking?: () => void;
  onTriggerSOS?: () => void;
  onOpenDzikirSidebar?: () => void;
}

export const ThumaninahBreathingGuide: React.FC<ThumaninahBreathingGuideProps> = ({
  onOpenAICounselor,
  onOpenBooking,
  onTriggerSOS,
  onOpenDzikirSidebar,
}) => {
  // Technique selection
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechniqueId>("4-4-6");
  const config = BREATHING_TECHNIQUES[selectedTechnique];

  // Execution state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemainingInStep, setSecondsRemainingInStep] = useState<number>(config.steps[0].duration);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [totalSecondsBreathed, setTotalSecondsBreathed] = useState<number>(0);

  // Audio & Haptic preferences
  const [isAudioChimeEnabled, setIsAudioChimeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("thumaninah_audio_chime");
    return saved !== null ? saved === "true" : true;
  });
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(ambientAudioEngine.getIsPlaying());

  // Interactive Tools Toggles
  const [isGroundingOpen, setIsGroundingOpen] = useState<boolean>(false);
  const [groundingChecklist, setGroundingChecklist] = useState<Record<number, boolean>>({});
  const [isReassuranceOpen, setIsReassuranceOpen] = useState<boolean>(true);
  const [postSessionMood, setPostSessionMood] = useState<"better" | "need_more" | "distressed" | null>(null);

  // Animation scale ref
  const currentStep = config.steps[currentStepIndex] || config.steps[0];
  const stepDuration = currentStep.duration;
  const progressRatio = Math.max(0, Math.min(1, 1 - (secondsRemainingInStep / stepDuration)));

  // Listen to ambient audio state
  useEffect(() => {
    ambientAudioEngine.setListener((playing) => {
      setIsAmbientPlaying(playing);
    });
  }, []);

  // Save audio preference
  useEffect(() => {
    localStorage.setItem("thumaninah_audio_chime", isAudioChimeEnabled.toString());
  }, [isAudioChimeEnabled]);

  // Main countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setTotalSecondsBreathed((prev) => prev + 1);

        setSecondsRemainingInStep((prev) => {
          if (prev <= 1) {
            // Move to next step
            const nextIndex = (currentStepIndex + 1) % config.steps.length;
            const isCycleCompleted = nextIndex === 0;

            if (isCycleCompleted) {
              setCompletedCycles((c) => {
                const updated = c + 1;
                // Update total stats in localStorage
                try {
                  const stored = parseInt(localStorage.getItem("limocity_total_breathing_cycles") || "0", 10);
                  localStorage.setItem("limocity_total_breathing_cycles", (stored + 1).toString());
                } catch {}
                return updated;
              });
            }

            setCurrentStepIndex(nextIndex);
            const nextStepDuration = config.steps[nextIndex].duration;

            // Trigger audio chime for transition
            if (isAudioChimeEnabled) {
              if (config.steps[nextIndex].phase === "inhale") {
                soundSynth.playPeacefulBell();
              } else if (config.steps[nextIndex].phase === "hold") {
                soundSynth.playGentleChime();
              } else if (config.steps[nextIndex].phase === "exhale") {
                soundSynth.playSubtleDrop();
              } else {
                soundSynth.playGentleChime();
              }
            }

            // Haptic feedback if available
            if (typeof window !== "undefined" && "vibrate" in navigator) {
              try {
                navigator.vibrate(60);
              } catch {}
            }

            return nextStepDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, currentStepIndex, config, isAudioChimeEnabled]);

  // Handle technique change
  const handleSelectTechnique = (techId: BreathingTechniqueId) => {
    setIsActive(false);
    setSelectedTechnique(techId);
    setCurrentStepIndex(0);
    setSecondsRemainingInStep(BREATHING_TECHNIQUES[techId].steps[0].duration);
    setCompletedCycles(0);
    setPostSessionMood(null);
  };

  // Start breathing guide
  const handleToggleActive = () => {
    if (!isActive) {
      setIsActive(true);
      setPostSessionMood(null);
      if (isAudioChimeEnabled) {
        soundSynth.playGentleChime();
      }
    } else {
      setIsActive(false);
    }
  };

  // Reset breathing guide
  const handleReset = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setSecondsRemainingInStep(config.steps[0].duration);
    setCompletedCycles(0);
    setPostSessionMood(null);
  };

  // Instant Acute Anxiety Emergency Protocol
  const handleTriggerAcuteRelief = () => {
    setSelectedTechnique("4-4-6");
    setCurrentStepIndex(0);
    setSecondsRemainingInStep(BREATHING_TECHNIQUES["4-4-6"].steps[0].duration);
    setIsActive(true);
    setIsReassuranceOpen(true);
    setPostSessionMood(null);

    // Turn on ambient calming sound automatically if not playing
    if (!ambientAudioEngine.getIsPlaying()) {
      ambientAudioEngine.toggle();
    }

    if (isAudioChimeEnabled) {
      soundSynth.playPeacefulBell();
    }

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {}
    }
  };

  // Dynamic visual sizing and styling for the animated breathing orb
  const getOrbScale = () => {
    if (!isActive) return "scale-100";
    if (currentStep.phase === "inhale") {
      // Swell up to scale-125
      return "scale-115 sm:scale-125";
    }
    if (currentStep.phase === "hold") {
      // Hold full volume
      return "scale-115 sm:scale-120";
    }
    if (currentStep.phase === "exhale") {
      // Contract down
      return "scale-90 sm:scale-92";
    }
    // Rest
    return "scale-95 sm:scale-100";
  };

  // Calculate SVG circumference for circle countdown
  const circleRadius = 88;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <section 
      id="thumaninah-breathing-guide" 
      className="py-12 bg-gradient-to-b from-[#0A0B0D] via-[#0E1118] to-[#0A0B0D] border-b border-[#1F2937] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A267]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#1F2937]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A267]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Wind className="w-4 h-4 text-[#C5A267]" />
                <span>Panduan Nafas Thuma'ninah</span>
              </span>
              <span aria-hidden="true" className="text-[#475569]">·</span>
              <span className="text-[#94A3B8]">Pertolongan Pertama Cemas Akut</span>
              <span aria-hidden="true" className="text-[#475569]">·</span>
              <span className="text-emerald-400 font-mono">Ritme Vagal 4-4-6</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Penyelarasan Nafas Sadar & Peredam Serangan Panik
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Panduan visual ritmis berbasis neurosains klinis dan nilai *Thuma'ninah* Islami. Dirancang untuk menstimulasi saraf vagus, menurunkan lonjakan hormon adrenalin, dan menenangkan dada yang sesak akibat kecemasan berlebih.
            </p>
          </div>

          {/* Quick Panic Reliever Trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleTriggerAcuteRelief}
              className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-rose-950 cursor-pointer"
              title="Mulai sesi relaksasi darurat segera"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>🚨 Tenangkan Diri Sekarang (Mode Darurat)</span>
            </button>
          </div>
        </div>

        {/* Reassurance Psychiatric Banner for Acute Anxiety */}
        {isReassuranceOpen && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171A24] via-[#12151E] to-[#151822] border border-[#252E3E] text-xs text-[#CBD5E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 text-[#C5A267] shrink-0 mt-0.5 sm:mt-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">
                  Kepada Anda yang Sedang Mengalami Cemas / Jantung Berdebar:
                </span>
                <p className="text-[#94A3B8] text-[11px] sm:text-xs leading-relaxed max-w-3xl">
                  Dada sesak, tangan dingin, dan detak jantung kencang adalah respon normal lonjakan adrenalin sementara. <strong>Tubuh Anda tidak dalam bahaya nyata.</strong> Anda aman di sini. Bernafaslah mengikuti visualizer di bawah selama 2 menit untuk mengirimkan sinyal tenang kembali ke otak.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsReassuranceOpen(false)}
              className="text-[11px] text-[#64748B] hover:text-[#CBD5E1] shrink-0 self-end sm:self-center hover:underline cursor-pointer"
            >
              Tutup Pesan
            </button>
          </div>
        )}

        {/* Technique Mode Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-[#141720] border border-[#1F2937] p-2 rounded-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(Object.keys(BREATHING_TECHNIQUES) as BreathingTechniqueId[]).map((techId) => {
              const tech = BREATHING_TECHNIQUES[techId];
              const isSelected = selectedTechnique === techId;
              return (
                <button
                  key={techId}
                  onClick={() => handleSelectTechnique(techId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20 font-bold"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#1E2330]"
                  }`}
                >
                  <span>{tech.shortName}</span>
                  {techId === "4-4-6" && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? "bg-black/20 text-black font-bold" : "bg-[#C5A267]/15 text-[#C5A267]"
                    }`}>
                      Rekomendasi
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Helper Toggles: Chime Sound & Ambient */}
          <div className="flex items-center gap-2 self-end sm:self-auto px-2">
            <button
              onClick={() => setIsAudioChimeEnabled(!isAudioChimeEnabled)}
              title={isAudioChimeEnabled ? "Matikan Nada Panduan" : "Nyalakan Nada Panduan Fasa Nafas"}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioChimeEnabled
                  ? "bg-[#C5A267]/15 border-[#C5A267]/40 text-[#C5A267]"
                  : "bg-[#0E1015] border-[#252E3E] text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              {isAudioChimeEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden md:inline">Suara Chime Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden md:inline">Suara Chime Mati</span>
                </>
              )}
            </button>

            <button
              onClick={() => ambientAudioEngine.toggle()}
              title={isAmbientPlaying ? "Jeda Audio Latar Murottal/Nasheed" : "Putar Audio Latar Murottal/Nasheed"}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isAmbientPlaying
                  ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] shadow-xs shadow-[#C5A267]/30"
                  : "bg-[#0E1015] border-[#252E3E] text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isAmbientPlaying ? "text-[#C5A267] animate-pulse" : ""}`} />
              <span className="text-[11px] hidden md:inline">
                {isAmbientPlaying ? "Alunan Latar Aktif" : "Alunan Latar"}
              </span>
            </button>
          </div>
        </div>

        {/* Main Grid: Visualizer Card & Guidance Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column (8 cols): Interactive Rhythmic Visualizer */}
          <div className="lg:col-span-8 bg-[#12151E] border border-[#252E3E] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            
            {/* Visualizer Top Bar: Active Step Name & Total Elapsed */}
            <div className="flex items-center justify-between text-xs text-[#94A3B8] border-b border-[#1E2330] pb-4">
              <div>
                <span className="text-[#CBD5E1] font-bold block sm:inline">
                  {config.name}
                </span>
                <span className="text-[11px] text-[#64748B] sm:ml-2 block sm:inline">
                  {config.targetClinicalGoal}
                </span>
              </div>
              <div className="text-right font-mono text-[11px] text-[#C5A267] shrink-0">
                <span>Total: {Math.floor(totalSecondsBreathed / 60)}m {totalSecondsBreathed % 60}s</span>
              </div>
            </div>

            {/* Central Animated Breathing Stage */}
            <div className="my-8 sm:my-10 flex flex-col items-center justify-center relative min-h-[300px]">
              
              {/* Concentric Ambient Ripple Rings */}
              <div 
                className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#252E3E] transition-all duration-1000 ${
                  isActive ? "opacity-60 scale-105" : "opacity-20"
                }`}
              />
              <div 
                className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#1A1F2C] transition-all duration-1000 ${
                  isActive && currentStep.phase === "inhale" ? "opacity-80 scale-110" : "opacity-30"
                }`}
              />

              {/* Dynamic SVG Circular Progress Ring */}
              <div className="relative flex items-center justify-center">
                <svg className="w-56 h-56 sm:w-68 sm:h-68 -rotate-90 transform">
                  {/* Background Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={circleRadius}
                    className="stroke-[#1C212E]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Dynamic Animated Stroke */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={circleRadius}
                    className="transition-all duration-500 ease-linear"
                    stroke={
                      currentStep.phase === "inhale" 
                        ? "#10B981" 
                        : currentStep.phase === "hold" 
                        ? "#C5A267" 
                        : currentStep.phase === "exhale" 
                        ? "#38BDF8" 
                        : "#818CF8"
                    }
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={isActive ? strokeDashoffset : 0}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Breathing Core Sphere (Expands and contracts) */}
                <div
                  style={{
                    boxShadow: isActive ? `0 0 45px ${currentStep.colorClass.ringGlow}` : "none",
                  }}
                  className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 ${
                    currentStep.colorClass.border
                  } bg-gradient-to-b ${
                    currentStep.colorClass.bg
                  } flex flex-col items-center justify-center p-4 text-center transition-all duration-1000 ease-in-out cursor-pointer ${getOrbScale()}`}
                  onClick={handleToggleActive}
                  title={isActive ? "Klik untuk jeda" : "Klik untuk mulai nafas"}
                >
                  {/* Phase Label */}
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${currentStep.colorClass.text} mb-1 flex items-center gap-1`}>
                    <Wind className="w-3.5 h-3.5" />
                    <span>{isActive ? currentStep.label : "Mulai Nafas"}</span>
                  </span>

                  {/* Countdown Number / Prompt */}
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight tabular-nums my-0.5 drop-shadow-md">
                    {isActive ? secondsRemainingInStep : "4-4-6"}
                  </span>

                  {/* Spiritual Dzikir Focus */}
                  <div className="mt-1">
                    <span className="text-sm sm:text-base font-serif text-[#F3E8D2] block font-semibold">
                      {isActive ? currentStep.arabicDzikir : "Thuma'ninah"}
                    </span>
                    <span className="text-[10px] text-[#CBD5E1] line-clamp-1 italic px-2 mt-0.5">
                      {isActive ? currentStep.dzikirMeaning : "Sentuh untuk memulai"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Subtitle Guidance under the sphere */}
              <div className="mt-6 text-center max-w-md px-4 min-h-[44px]">
                <p className="text-xs sm:text-sm font-medium text-white transition-all">
                  {isActive 
                    ? currentStep.instruction 
                    : "Posisikan tubuh tegak namun rileks. Letakkan satu tangan di dada dan satu di perut."}
                </p>
                {isActive && (
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    Efek Fisiologis: {currentStep.clinicalEffect}
                  </p>
                )}
              </div>

            </div>

            {/* Bottom Controls Bar */}
            <div className="pt-4 border-t border-[#1E2330] flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Cycles Progress Tracker */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 bg-[#0E1015] px-3 py-1.5 rounded-xl border border-[#1F2937]">
                  <Activity className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span className="text-[#94A3B8]">Siklus Selesai:</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {completedCycles} / {config.idealCycleCount}
                  </span>
                </div>

                {completedCycles >= config.idealCycleCount && (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Target Tercapai (Saraf Vagus Terstimulasi)</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  disabled={!isActive && completedCycles === 0}
                  className="p-2.5 rounded-xl bg-[#141720] border border-[#252E3E] text-[#94A3B8] hover:text-white hover:border-[#38445C] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Reset Sesi"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleActive}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                    isActive
                      ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20"
                      : "bg-[#C5A267] hover:bg-[#D8B57B] text-black shadow-[#C5A267]/20"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 text-black fill-black" />
                      <span>Jeda Nafas</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-black fill-black" />
                      <span>{completedCycles > 0 ? "Lanjutkan Latihan" : "Mulai Panduan Nafas"}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Post Session Reflection Dialog (Triggers after completing >= 2 cycles or pausing) */}
            {completedCycles >= 2 && !isActive && (
              <div className="mt-6 p-4 rounded-2xl bg-[#181D29] border border-[#C5A267]/40 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
                    <Sparkles className="w-4 h-4 text-[#C5A267]" />
                    <span>Evaluasi Ketenangan Dada & Pikiran:</span>
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    {completedCycles} Siklus Thuma'ninah Terlaksana
                  </span>
                </div>

                <p className="text-[11px] text-[#CBD5E1]">
                  Bagaimana ritme denyut jantung dan ketegangan di dada Anda setelah latihan ini?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setPostSessionMood("better")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      postSessionMood === "better"
                        ? "bg-emerald-950/60 border-emerald-400 text-white font-semibold"
                        : "bg-[#12151F] border-[#252E3E] text-[#94A3B8] hover:border-emerald-500/40 hover:text-white"
                    }`}
                  >
                    <span className="block text-emerald-400 font-bold mb-0.5">🌱 Alhamdulillah Tenang</span>
                    <span className="text-[10px] text-[#64748B]">Dada terasa lebih lapang & nafas teratur.</span>
                  </button>

                  <button
                    onClick={() => {
                      setPostSessionMood("need_more");
                      handleToggleActive();
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      postSessionMood === "need_more"
                        ? "bg-[#C5A267]/20 border-[#C5A267] text-white font-semibold"
                        : "bg-[#12151F] border-[#252E3E] text-[#94A3B8] hover:border-[#C5A267]/40 hover:text-white"
                    }`}
                  >
                    <span className="block text-[#C5A267] font-bold mb-0.5">🔄 Masih Perlu Lanjut</span>
                    <span className="text-[10px] text-[#64748B]">Mulai tambah 2-4 siklus berikutnya.</span>
                  </button>

                  <button
                    onClick={() => setPostSessionMood("distressed")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      postSessionMood === "distressed"
                        ? "bg-rose-950/60 border-rose-400 text-white font-semibold"
                        : "bg-[#12151F] border-[#252E3E] text-[#94A3B8] hover:border-rose-500/40 hover:text-white"
                    }`}
                  >
                    <span className="block text-rose-400 font-bold mb-0.5">💬 Masih Cemas Akut</span>
                    <span className="text-[10px] text-[#64748B]">Butuh bicara dengan AI / Psikolog segera.</span>
                  </button>
                </div>

                {/* Follow up action based on mood */}
                {postSessionMood === "better" && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                    <span>
                      Maa syaa Allah. Pertahankan ketenangan ini. Lanjutkan dengan membaca dzikir perlindungan diri.
                    </span>
                    {onOpenDzikirSidebar && (
                      <button
                        onClick={onOpenDzikirSidebar}
                        className="text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg shrink-0 cursor-pointer ml-3"
                      >
                        Buka Dzikir Harian →
                      </button>
                    )}
                  </div>
                )}

                {postSessionMood === "distressed" && (
                  <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 space-y-2">
                    <p>
                      Jangan cemas berlebihan. Kadang tubuh butuh sedikit waktu lebih lama atau pendampingan langsung. Anda tidak sendirian.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {onOpenAICounselor && (
                        <button
                          onClick={onOpenAICounselor}
                          className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Curhat ke Konselor AI 24/7</span>
                        </button>
                      )}
                      {onOpenBooking && (
                        <button
                          onClick={onOpenBooking}
                          className="bg-[#1E2330] hover:bg-[#252C3E] border border-[#38445C] text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                        >
                          <span>Jadwalkan Konsultasi Psikolog</span>
                        </button>
                      )}
                      {onTriggerSOS && (
                        <button
                          onClick={onTriggerSOS}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                        >
                          <span>🚨 Tombol SOS Darurat</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Column (4 cols): Grounding 5-4-3-2-1 & Scientific Protocol Guide */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Box 1: Islamic Grounding Technique (Metode 5-4-3-2-1) */}
            <div className="bg-[#12151E] border border-[#252E3E] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C5A267]" />
                  <h3 className="text-sm font-bold text-white font-serif">
                    Grounding 5-4-3-2-1 Islami
                  </h3>
                </div>
                <button
                  onClick={() => setIsGroundingOpen(!isGroundingOpen)}
                  className="text-[11px] font-semibold text-[#C5A267] hover:text-[#D8B57B] cursor-pointer"
                >
                  {isGroundingOpen ? "Sembunyikan" : "Buka Panduan"}
                </button>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Saat panik menyerang, pikiran sering melompat ke skenario terburuk (*catastrophizing*). Metode anchoring sensori mengembalikan kesadaran ke realitas fisik detik ini.
              </p>

              {isGroundingOpen && (
                <div className="space-y-3 pt-1 animate-fadeIn">
                  {GROUNDING_STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isChecked = !!groundingChecklist[step.count];
                    return (
                      <div
                        key={step.count}
                        onClick={() =>
                          setGroundingChecklist((prev) => ({
                            ...prev,
                            [step.count]: !prev[step.count],
                          }))
                        }
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-100"
                            : "bg-[#0E1015] border-[#1F2937] text-[#94A3B8] hover:border-[#38445C]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-400 text-black"
                              : "bg-[#1A1E2B] border-[#2E374A] text-[#CBD5E1]"
                          }`}
                        >
                          {isChecked ? <Check className="w-3.5 h-3.5" /> : step.count}
                        </div>

                        <div className="space-y-0.5 flex-1">
                          <span className={`text-xs font-bold block ${isChecked ? "text-emerald-300" : "text-white"}`}>
                            {step.title}
                          </span>
                          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                            {step.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setGroundingChecklist({})}
                      className="text-[11px] text-[#64748B] hover:text-[#CBD5E1] hover:underline cursor-pointer"
                    >
                      Reset Cek Grounding
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: Clinical & Tazkiyah Wisdom */}
            <div className="bg-[#12151E] border border-[#252E3E] rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
                <Sparkles className="w-4 h-4 text-[#C5A267]" />
                <h3 className="text-sm font-bold text-white font-serif">
                  Mengapa 4-4-6 Bekerja?
                </h3>
              </div>

              <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed">
                <div className="p-2.5 rounded-xl bg-[#0E1015] border border-[#1F2937]">
                  <strong className="text-white block mb-0.5">1. Hembusan 6 Detik Lebih Panjang</strong>
                  <span>Hembusan nafas yang lebih panjang dari tarikan nafas merangsang reseptor baroreseptor aorta, memperlambat denyut nadi secara instan.</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0E1015] border border-[#1F2937]">
                  <strong className="text-white block mb-0.5">2. Spiritualitas Dzikir Thuma'ninah</strong>
                  <span>Ketenangan hati yang diikat dengan asma Allah (QS. Ar-Ra'd: 28) meredakan rasa sepi dan mengembalikan rasa bersandar (*tawakkul*).</span>
                </div>
              </div>

              {onOpenDzikirSidebar && (
                <div className="pt-2">
                  <button
                    onClick={onOpenDzikirSidebar}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#181D29] hover:bg-[#202738] border border-[#C5A267]/30 text-xs font-semibold text-[#F3E8D2] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Wind className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span>Buka Tasbih & Dzikir Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A267]" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
