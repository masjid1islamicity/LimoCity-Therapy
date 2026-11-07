import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  BookOpen,
  Wind,
  Heart,
  Plus,
  Trash2,
  RotateCcw,
  Flame,
  Award,
  Calendar,
  Check,
  ChevronRight,
  X,
  Volume2,
  Play,
  Pause,
  Clock,
  Crown,
  Trophy,
  Sun,
  Bell,
  BellOff,
  Pencil,
  Tag,
  Sunrise,
  Sunset,
  Moon,
  CloudSun,
  Info,
  Lightbulb,
  Compass,
  AlertCircle
} from "lucide-react";
import { SpiritualDailyGoal, GoalCategory, SpiritualBadge, GoalReminderConfig, ReminderSoundType } from "../types";
import { INITIAL_SPIRITUAL_BADGES, calculateBadgesProgress } from "../data/spiritualBadgesData";
import { SpiritualBadgesGallery } from "./SpiritualBadgesGallery";
import { BadgeDetailModal } from "./BadgeDetailModal";
import { GoalReminderConfigModal } from "./GoalReminderConfigModal";
import { GoalPushNotificationToast } from "./GoalPushNotificationToast";
import { GoalScheduleTimelineModal } from "./GoalScheduleTimelineModal";
import { GoalProgressRingToggle } from "./GoalProgressRingToggle";
import { GoalNumericalTargetModal } from "./GoalNumericalTargetModal";
import { soundSynth } from "../utils/audioChime";

interface SpiritualDailyGoalsProps {
  onOpenDzikirSidebar?: () => void;
  onOpenHikmahModal?: () => void;
}

const DEFAULT_PRESET_GOALS: SpiritualDailyGoal[] = [
  {
    id: "goal-quran-1",
    title: "Membaca 1 Ayat Al-Qur'an & Tadabbur Maknanya",
    subtitle: "QS. Ar-Ra'd: 28 • 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.'",
    category: "quran",
    estimatedMinutes: 3,
    completed: false,
    actionType: "quran",
    targetCount: 1,
    currentCount: 0,
    unitLabel: "ayat",
    reminder: {
      enabled: true,
      time: "05:15",
      periodLabel: "Subuh / Fajar",
      soundEnabled: true,
      soundType: "peaceful_bell",
      customMessage: "Awali fajar dengan membaca firman Ilahi dan mentadabburi maknanya.",
      repeatFrequency: "everyday",
    },
  },
  {
    id: "goal-breathing-1",
    title: "Latihan Pernapasan Thuma'ninah (4-4-6)",
    subtitle: "5 Siklus relaksasi paru & stimulasi saraf parasimpatis untuk redakan cemas",
    category: "breathing",
    estimatedMinutes: 5,
    completed: false,
    actionType: "breathing",
    targetCount: 5,
    currentCount: 0,
    unitLabel: "siklus",
    reminder: {
      enabled: true,
      time: "08:30",
      periodLabel: "Dhuha / Pagi",
      soundEnabled: true,
      soundType: "singing_bowl",
      customMessage: "Waktunya jeda 5 menit untuk latihan pernapasan thuma'ninah & tenangkan pikiran.",
      repeatFrequency: "everyday",
    },
  },
  {
    id: "goal-dzikir-1",
    title: "Dzikir Penenang Jiwa (33x Tasbih & Istighfar)",
    subtitle: "Membasahi lisan dengan Subhanallah wa bihamdihi & Astaghfirullah",
    category: "dzikir",
    estimatedMinutes: 4,
    completed: false,
    actionType: "dzikir",
    targetCount: 33,
    currentCount: 0,
    unitLabel: "x dzikir",
    reminder: {
      enabled: true,
      time: "12:30",
      periodLabel: "Dzuhur / Siang",
      soundEnabled: true,
      soundType: "gentle_chime",
      customMessage: "Jeda batin di sela rutinitas siang. Basahi lisan dengan tasbih & istighfar.",
      repeatFrequency: "everyday",
    },
  },
  {
    id: "goal-gratitude-1",
    title: "Refleksi Syukur (Gratitude Journal)",
    subtitle: "Mengingat & mencatat 3 nikmat kecil yang hadir dalam hidup hari ini",
    category: "gratitude",
    estimatedMinutes: 3,
    completed: false,
    actionType: "quote",
    targetCount: 3,
    currentCount: 0,
    unitLabel: "nikmat",
    reminder: {
      enabled: true,
      time: "20:00",
      periodLabel: "Isya / Malam",
      soundEnabled: true,
      soundType: "subtle_drop",
      customMessage: "Tutup malam dengan mengingat & mensyukuri 3 berkah yang hadir hari ini.",
      repeatFrequency: "everyday",
    },
  },
  {
    id: "goal-charity-1",
    title: "Sedekah Subuh / 1 Kebaikan Tersembunyi",
    subtitle: "Berbagi senyuman tulus, sedekah online, atau mendoakan kebaikan orang lain",
    category: "charity",
    estimatedMinutes: 2,
    completed: false,
    targetCount: 1,
    currentCount: 0,
    unitLabel: "kebaikan",
    reminder: {
      enabled: true,
      time: "06:30",
      periodLabel: "Pagi Hari",
      soundEnabled: true,
      soundType: "peaceful_bell",
      customMessage: "Satu kebaikan kecil di awal hari membuka pintu-pintu kemudahan hidup.",
      repeatFrequency: "everyday",
    },
  },
];

// Quick Custom Goal Inspiration Templates for one-click setup
interface GoalTemplate {
  title: string;
  subtitle: string;
  category: GoalCategory;
  estimatedMinutes: number;
  time: string;
  periodLabel: string;
  soundType: ReminderSoundType;
  tag: string;
  targetCount?: number;
  unitLabel?: string;
}

const CUSTOM_GOAL_TEMPLATES: GoalTemplate[] = [
  {
    title: "Shalat Dhuha 2 Rakaat & Doa Kelapangan",
    subtitle: "Menjemput ketenangan batin dan keberkahan rezeki di pagi hari",
    category: "prayer",
    estimatedMinutes: 10,
    time: "08:45",
    periodLabel: "Dhuha / Pagi",
    soundType: "peaceful_bell",
    tag: "Pagi & Fajar",
    targetCount: 2,
    unitLabel: "rakaat",
  },
  {
    title: "Dzikir Pagi Al-Ma'tsurat Kubro/Shughro",
    subtitle: "Membentengi jiwa dari kecemasan dan was-was sepanjang hari",
    category: "dzikir",
    estimatedMinutes: 10,
    time: "06:00",
    periodLabel: "Fajar / Awal Hari",
    soundType: "gentle_chime",
    tag: "Pagi & Fajar",
    targetCount: 1,
    unitLabel: "wirid",
  },
  {
    title: "Tilawah Surah Al-Mulk Sebelum Tidur",
    subtitle: "Sunnah Rasulullah SAW sebagai syafaat penenang jiwa di malam hari",
    category: "quran",
    estimatedMinutes: 8,
    time: "21:30",
    periodLabel: "Malam / Sebelum Tidur",
    soundType: "subtle_drop",
    tag: "Qur'an & Tadabbur",
    targetCount: 30,
    unitLabel: "ayat",
  },
  {
    title: "Membaca Surah Al-Kahfi (Khusus Hari Jumat)",
    subtitle: "Cahaya penerang jiwa di antara dua Jumat",
    category: "quran",
    estimatedMinutes: 25,
    time: "09:30",
    periodLabel: "Pagi Jumat",
    soundType: "peaceful_bell",
    tag: "Qur'an & Tadabbur",
    targetCount: 110,
    unitLabel: "ayat",
  },
  {
    title: "Shalat Tahajjud & Istighfar Waktu Sahur",
    subtitle: "Bermunajat di sepertiga malam terakhir, meluapkan seluruh kegelisahan hati",
    category: "prayer",
    estimatedMinutes: 15,
    time: "03:30",
    periodLabel: "Qiyamul Lail / Sahur",
    soundType: "singing_bowl",
    tag: "Malam & Qiyam",
    targetCount: 2,
    unitLabel: "rakaat",
  },
  {
    title: "Istighfar 100x Penggugur Beban Jiwa",
    subtitle: "Sayyidul Istighfar & Astaghfirullah untuk melapangkan dada yang sesak",
    category: "dzikir",
    estimatedMinutes: 5,
    time: "17:30",
    periodLabel: "Sore Hari",
    soundType: "gentle_chime",
    tag: "Dzikir & Shalawat",
    targetCount: 100,
    unitLabel: "x istighfar",
  },
  {
    title: "Shalawat Nabi 100x Penyejuk Kalbu",
    subtitle: "Allahumma shalli 'ala sayyidina Muhammad, melimpahkan rahmat & syafaat",
    category: "dzikir",
    estimatedMinutes: 5,
    time: "13:00",
    periodLabel: "Siang Hari",
    soundType: "gentle_chime",
    tag: "Dzikir & Shalawat",
    targetCount: 100,
    unitLabel: "x shalawat",
  },
  {
    title: "Memaafkan Semua Orang Sebelum Pejamkan Mata",
    subtitle: "Melepaskan dendam batin, menyucikan qolbu agar tidur nyenyak & tenang",
    category: "gratitude",
    estimatedMinutes: 3,
    time: "22:00",
    periodLabel: "Sebelum Tidur",
    soundType: "subtle_drop",
    tag: "Syukur & Akhlak",
    targetCount: 1,
    unitLabel: "refleksi",
  },
  {
    title: "Menyapa & Mendoakan Orang Tua / Kerabat",
    subtitle: "Menyambung tali silaturahim pembawa kelapangan rezeki & umur berkah",
    category: "charity",
    estimatedMinutes: 5,
    time: "10:00",
    periodLabel: "Pagi Menjelang Siang",
    soundType: "peaceful_bell",
    tag: "Syukur & Akhlak",
    targetCount: 3,
    unitLabel: "orang",
  },
  {
    title: "Latihan Menahan Amarah / Latihan Sabar",
    subtitle: "Mengambil wudhu atau jeda 30 detik saat tertekan agar emosi terkendali",
    category: "breathing",
    estimatedMinutes: 5,
    time: "14:15",
    periodLabel: "Siang / Saat Bekerja",
    soundType: "singing_bowl",
    tag: "Pagi & Fajar",
    targetCount: 3,
    unitLabel: "jeda sabar",
  },
  {
    title: "Menjaga Wudhu (Dawamul Wudhu)",
    subtitle: "Memperbarui wudhu saat batal demi menjaga kesucian lahir batin",
    category: "custom",
    estimatedMinutes: 3,
    time: "07:30",
    periodLabel: "Pagi Hari",
    soundType: "gentle_chime",
    tag: "Syukur & Akhlak",
    targetCount: 5,
    unitLabel: "wudhu",
  },
];

const QURAN_VERSES = [
  {
    surah: "QS. Ar-Ra'd : 28",
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    tadabbur: "Setiap kegelisahan duniawi memiliki penawarnya dalam dzikrullah. Ketika pikiran lelah, kembalikan fokus pada kebesaran Sang Pencipta.",
  },
  {
    surah: "QS. Al-Baqarah : 286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    tadabbur: "Ujian dan beban psikologis yang hadir saat ini adalah tanda bahwa Anda memiliki ketangguhan jiwa untuk melaluinya dengan pertolongan-Nya.",
  },
  {
    surah: "QS. Asy-Syarh : 5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Maka sesungguhnya bersama kesulitan ada kemudahan, sesungguhnya bersama kesulitan ada kemudahan.",
    tadabbur: "Kemudahan tidak datang setelah kesulitan, melainkan membersamai kesulitan tersebut. Buka hati untuk melihat jalan keluar yang telah Allah siapkan.",
  },
  {
    surah: "QS. Az-Zumar : 53",
    arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.",
    tadabbur: "Pintu harapan dan pemulihan jiwa selalu terbuka lebar. Tidak ada rasa bersalah yang tidak bisa disembuhkan oleh luasnya kasih sayang Ilahi.",
  },
];

const STORAGE_KEY_GOALS = "limocity_spiritual_daily_goals";
const STORAGE_KEY_CUSTOM_GOALS = "limocity_spiritual_custom_goals";
const STORAGE_KEY_DATE = "limocity_spiritual_goals_date";
const STORAGE_KEY_STREAK = "limocity_spiritual_streak";
const STORAGE_KEY_BADGES = "limocity_spiritual_badges";

export const SpiritualDailyGoals: React.FC<SpiritualDailyGoalsProps> = ({
  onOpenDzikirSidebar,
  onOpenHikmahModal,
}) => {
  const [activeTab, setActiveTab] = useState<"goals" | "badges">("goals");
  const [goals, setGoals] = useState<SpiritualDailyGoal[]>([]);
  const [activeCategory, setActiveCategory] = useState<GoalCategory | "all" | "custom_only">("all");
  const [streakCount, setStreakCount] = useState<number>(3);
  const [animatingGoalId, setAnimatingGoalId] = useState<string | null>(null);

  // Badges & Achievements state
  const [badges, setBadges] = useState<SpiritualBadge[]>(() => {
    return calculateBadgesProgress(3, 0, INITIAL_SPIRITUAL_BADGES);
  });
  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<SpiritualBadge | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [unlockedMilestoneAlert, setUnlockedMilestoneAlert] = useState<SpiritualBadge | null>(null);

  // Custom Goal Creation & Editing Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState<boolean>(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState<boolean>(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);

  // Push Notification & Schedule Management states
  const [selectedGoalForReminder, setSelectedGoalForReminder] = useState<SpiritualDailyGoal | null>(null);
  const [isReminderConfigModalOpen, setIsReminderConfigModalOpen] = useState<boolean>(false);
  const [isScheduleTimelineModalOpen, setIsScheduleTimelineModalOpen] = useState<boolean>(false);
  const [activePushGoal, setActivePushGoal] = useState<SpiritualDailyGoal | null>(null);
  const [isPushToastVisible, setIsPushToastVisible] = useState<boolean>(false);
  const [notifiedGoalsMap, setNotifiedGoalsMap] = useState<Record<string, string>>({});
  
  // Custom Goal Form States
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("prayer");
  const [newMinutes, setNewMinutes] = useState(5);
  const [newReminderEnabled, setNewReminderEnabled] = useState(true);
  const [newReminderTime, setNewReminderTime] = useState("08:30");
  const [newReminderPeriod, setNewReminderPeriod] = useState("Dhuha / Pagi");
  const [newSoundType, setNewSoundType] = useState<ReminderSoundType>("peaceful_bell");
  const [newCustomMessage, setNewCustomMessage] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("Semua");

  // Numerical Target Form States
  const [newHasNumericalTarget, setNewHasNumericalTarget] = useState<boolean>(false);
  const [newTargetCount, setNewTargetCount] = useState<number>(33);
  const [newUnitLabel, setNewUnitLabel] = useState<string>("x dzikir");
  const [quickEditGoalTarget, setQuickEditGoalTarget] = useState<SpiritualDailyGoal | null>(null);

  // Quran Verse state
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);

  // Breathing Interactive state
  const [breathingPhase, setBreathingPhase] = useState<"Tarik Napas (4s)" | "Tahan / Hening (4s)" | "Hembuskan & Istighfar (6s)">("Tarik Napas (4s)");
  const [breathingCounter, setBreathingCounter] = useState<number>(4);
  const [breathingCycle, setBreathingCycle] = useState<number>(1);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Real-time Push Notification Scheduling Engine
  useEffect(() => {
    const checkScheduledGoals = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split("T")[0];
      const timeKey = `${todayDateStr}-${currentTimeStr}`;

      goals.forEach((goal) => {
        if (
          goal.reminder?.enabled &&
          !goal.completed &&
          goal.reminder.time === currentTimeStr &&
          notifiedGoalsMap[goal.id] !== timeKey
        ) {
          setNotifiedGoalsMap((prev) => ({ ...prev, [goal.id]: timeKey }));
          setActivePushGoal(goal);
          setIsPushToastVisible(true);
        }
      });
    };

    checkScheduledGoals();
    const interval = setInterval(checkScheduledGoals, 15000);
    return () => clearInterval(interval);
  }, [goals, notifiedGoalsMap]);

  // Load from localStorage on mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const savedStreak = localStorage.getItem(STORAGE_KEY_STREAK);
    const savedGoals = localStorage.getItem(STORAGE_KEY_GOALS);
    const savedCustomGoals = localStorage.getItem(STORAGE_KEY_CUSTOM_GOALS);
    const savedBadgesStr = localStorage.getItem(STORAGE_KEY_BADGES);

    let currentStreakVal = 3;
    if (savedStreak) {
      currentStreakVal = parseInt(savedStreak, 10) || 1;
      setStreakCount(currentStreakVal);
    }

    let parsedBadges: SpiritualBadge[] = INITIAL_SPIRITUAL_BADGES;
    if (savedBadgesStr) {
      try {
        parsedBadges = JSON.parse(savedBadgesStr);
      } catch {}
    }
    const calculated = calculateBadgesProgress(currentStreakVal, 0, parsedBadges);
    setBadges(calculated);

    // Parse custom goals if available
    let customGoalsParsed: SpiritualDailyGoal[] = [];
    if (savedCustomGoals) {
      try {
        customGoalsParsed = JSON.parse(savedCustomGoals);
      } catch {}
    }

    if (savedGoals && savedDate === todayStr) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals(parsed);
      } catch (e) {
        setGoals([...DEFAULT_PRESET_GOALS, ...customGoalsParsed]);
      }
    } else {
      // New day: reset completion status but keep all preset and custom goals
      let initialGoals: SpiritualDailyGoal[] = [];
      if (savedGoals) {
        try {
          const parsed: SpiritualDailyGoal[] = JSON.parse(savedGoals);
          initialGoals = parsed.map((g) => ({
            ...g,
            completed: false,
            completedAt: undefined,
          }));
        } catch {
          initialGoals = [
            ...DEFAULT_PRESET_GOALS,
            ...customGoalsParsed.map((g) => ({ ...g, completed: false, completedAt: undefined })),
          ];
        }
      } else {
        initialGoals = [
          ...DEFAULT_PRESET_GOALS,
          ...customGoalsParsed.map((g) => ({ ...g, completed: false, completedAt: undefined })),
        ];
      }

      setGoals(initialGoals);
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(initialGoals));
      localStorage.setItem(STORAGE_KEY_DATE, todayStr);
    }
  }, []);

  // Update badges whenever streak or goals change
  const handleUpdateStreak = (newStreak: number) => {
    setStreakCount(newStreak);
    localStorage.setItem(STORAGE_KEY_STREAK, newStreak.toString());
    const updated = calculateBadgesProgress(newStreak, goals.filter((g) => g.completed).length, badges);
    setBadges(updated);
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(updated));

    // Check if new milestone reached
    if (newStreak === 7) {
      const b7 = updated.find((b) => b.id === "badge-streak-7");
      if (b7) {
        setUnlockedMilestoneAlert(b7);
      }
    } else if (newStreak === 30) {
      const b30 = updated.find((b) => b.id === "badge-streak-30");
      if (b30) {
        setUnlockedMilestoneAlert(b30);
      }
    }
  };

  // Save to localStorage whenever goals change (saves both all goals and custom goals)
  const saveGoals = (updated: SpiritualDailyGoal[]) => {
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(updated));
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(STORAGE_KEY_DATE, todayStr);

    // Also persist custom goals separately for resilient long-term retention
    const customGoals = updated.filter((g) => g.isCustom);
    localStorage.setItem(STORAGE_KEY_CUSTOM_GOALS, JSON.stringify(customGoals));
  };

  // Handle numerical target increment (+1, +5, +10, etc.)
  const handleIncrementGoal = (id: string, step: number = 1, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return;

    const target = targetGoal.targetCount && targetGoal.targetCount > 0 ? targetGoal.targetCount : 1;
    const current = targetGoal.currentCount ?? (targetGoal.completed ? target : 0);
    const newCount = Math.min(target, current + step);
    const willBeCompleted = newCount >= target;

    if (willBeCompleted && !targetGoal.completed) {
      setAnimatingGoalId(id);
      setTimeout(() => setAnimatingGoalId(null), 1000);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.75 },
          colors: ["#C5A267", "#E5C388", "#10B981", "#38BDF8", "#FFFFFF"],
        });
      } catch (err) {}
      soundSynth.playSoundByType("peaceful_bell");
    } else {
      // Subtle click sound
      soundSynth.playSoundByType("subtle_drop");
    }

    const updated = goals.map((g) => {
      if (g.id === id) {
        return {
          ...g,
          currentCount: newCount,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return g;
    });

    saveGoals(updated);

    // Check if all goals are now completed!
    const completedCount = updated.filter((g) => g.completed).length;
    if (completedCount === updated.length && updated.length > 0 && willBeCompleted) {
      setTimeout(() => {
        try {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#C5A267", "#FFD700", "#10B981", "#60A5FA"],
          });
        } catch {}
        setStreakCount((prev) => {
          const next = prev + 1;
          localStorage.setItem(STORAGE_KEY_STREAK, next.toString());
          return next;
        });
      }, 400);
    }
  };

  // Reset numerical goal counter to 0
  const handleResetGoalCount = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = goals.map((g) => {
      if (g.id === id) {
        return {
          ...g,
          currentCount: 0,
          completed: false,
          completedAt: undefined,
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  // Mark goal completed directly to full target
  const handleCompleteGoalDirectly = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return;
    const target = targetGoal.targetCount || 1;

    setAnimatingGoalId(id);
    setTimeout(() => setAnimatingGoalId(null), 1000);

    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.75 },
        colors: ["#C5A267", "#E5C388", "#10B981", "#38BDF8", "#FFFFFF"],
      });
    } catch {}
    soundSynth.playSoundByType("peaceful_bell");

    const updated = goals.map((g) => {
      if (g.id === id) {
        return {
          ...g,
          currentCount: target,
          completed: true,
          completedAt: new Date().toISOString(),
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  // Save updated numerical target from modal
  const handleSaveGoalNumericalTarget = (
    goalId: string,
    targetCount: number,
    unitLabel: string,
    currentCount: number
  ) => {
    const willBeCompleted = currentCount >= targetCount;
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          targetCount,
          unitLabel,
          currentCount,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return g;
    });
    saveGoals(updated);
    soundSynth.playSoundByType("gentle_chime");
  };

  // Toggle goal completion or increment count
  const handleToggleGoal = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return;

    const target = targetGoal.targetCount || 1;

    if (target > 1) {
      // If already completed, toggle off to 0
      if (targetGoal.completed) {
        handleResetGoalCount(id, e);
      } else {
        // Otherwise increment by 1
        handleIncrementGoal(id, 1, e);
      }
      return;
    }

    // Standard 1-step toggle
    const willBeCompleted = !targetGoal.completed;

    if (willBeCompleted) {
      setAnimatingGoalId(id);
      setTimeout(() => setAnimatingGoalId(null), 1000);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.75 },
          colors: ["#C5A267", "#E5C388", "#10B981", "#38BDF8", "#FFFFFF"],
        });
      } catch (err) {}
      soundSynth.playSoundByType("peaceful_bell");
    }

    const updated = goals.map((g) => {
      if (g.id === id) {
        return {
          ...g,
          completed: willBeCompleted,
          currentCount: willBeCompleted ? 1 : 0,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return g;
    });

    saveGoals(updated);

    // Check if all goals are now completed!
    const completedCount = updated.filter((g) => g.completed).length;
    if (completedCount === updated.length && updated.length > 0 && willBeCompleted) {
      setTimeout(() => {
        try {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#C5A267", "#FFD700", "#10B981", "#60A5FA"],
          });
        } catch {}
        // Increase streak
        setStreakCount((prev) => {
          const next = prev + 1;
          localStorage.setItem(STORAGE_KEY_STREAK, next.toString());
          return next;
        });
      }, 400);
    }
  };

  // Open modal in Create mode
  const handleOpenAddModal = () => {
    setEditingGoalId(null);
    setNewTitle("");
    setNewSubtitle("");
    setNewCategory("prayer");
    setNewMinutes(5);
    setNewReminderEnabled(true);
    setNewReminderTime("08:30");
    setNewReminderPeriod("Dhuha / Pagi");
    setNewSoundType("peaceful_bell");
    setNewCustomMessage("");
    setNewHasNumericalTarget(false);
    setNewTargetCount(33);
    setNewUnitLabel("x dzikir");
    setIsAddModalOpen(true);
  };

  // Open modal in Edit mode for an existing custom goal
  const handleOpenEditModal = (goal: SpiritualDailyGoal) => {
    setEditingGoalId(goal.id);
    setNewTitle(goal.title);
    setNewSubtitle(goal.subtitle || "");
    setNewCategory(goal.category);
    setNewMinutes(goal.estimatedMinutes || 5);
    setNewReminderEnabled(goal.reminder?.enabled ?? true);
    setNewReminderTime(goal.reminder?.time || "08:30");
    setNewReminderPeriod(goal.reminder?.periodLabel || "Dhuha / Pagi");
    setNewSoundType(goal.reminder?.soundType || "peaceful_bell");
    setNewCustomMessage(goal.reminder?.customMessage || "");
    setNewHasNumericalTarget(Boolean(goal.targetCount && goal.targetCount > 1));
    setNewTargetCount(goal.targetCount || 33);
    setNewUnitLabel(goal.unitLabel || "x dzikir");
    setIsAddModalOpen(true);
  };

  // Apply a template to the custom goal form
  const handleApplyTemplate = (tpl: GoalTemplate) => {
    setNewTitle(tpl.title);
    setNewSubtitle(tpl.subtitle);
    setNewCategory(tpl.category);
    setNewMinutes(tpl.estimatedMinutes);
    setNewReminderTime(tpl.time);
    setNewReminderPeriod(tpl.periodLabel);
    setNewSoundType(tpl.soundType);
    setNewCustomMessage(`Waktunya melaksanakan: ${tpl.title}. Luangkan ${tpl.estimatedMinutes} menit untuk kedamaian batin Anda.`);
    if (tpl.targetCount && tpl.targetCount > 1) {
      setNewHasNumericalTarget(true);
      setNewTargetCount(tpl.targetCount);
      setNewUnitLabel(tpl.unitLabel || "kali");
    } else {
      setNewHasNumericalTarget(false);
      setNewTargetCount(1);
      setNewUnitLabel(tpl.unitLabel || "kali");
    }
  };

  // Save (Create or Update) custom goal
  const handleSaveCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const customMessageText =
      newCustomMessage.trim() || `Waktunya melaksanakan amalan: ${newTitle.trim()}.`;

    const finalTargetCount = newHasNumericalTarget ? Math.max(1, newTargetCount) : 1;
    const finalUnitLabel = newHasNumericalTarget ? (newUnitLabel.trim() || "kali") : "kali";

    if (editingGoalId) {
      // UPDATE EXISTING GOAL
      const updated = goals.map((g) => {
        if (g.id === editingGoalId) {
          const currentCount = g.currentCount || 0;
          return {
            ...g,
            title: newTitle.trim(),
            subtitle: newSubtitle.trim() || undefined,
            category: newCategory,
            estimatedMinutes: Number(newMinutes) || 5,
            targetCount: finalTargetCount,
            unitLabel: finalUnitLabel,
            completed: currentCount >= finalTargetCount,
            reminder: {
              enabled: newReminderEnabled,
              time: newReminderTime || "08:30",
              periodLabel: newReminderPeriod || "Dhuha / Pagi",
              soundEnabled: true,
              soundType: newSoundType,
              customMessage: customMessageText,
              repeatFrequency: "everyday" as const,
            },
          };
        }
        return g;
      });

      saveGoals(updated);
    } else {
      // CREATE NEW CUSTOM GOAL
      const newGoal: SpiritualDailyGoal = {
        id: `custom-goal-${Date.now()}`,
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || undefined,
        category: newCategory,
        estimatedMinutes: Number(newMinutes) || 5,
        completed: false,
        isCustom: true,
        targetCount: finalTargetCount,
        currentCount: 0,
        unitLabel: finalUnitLabel,
        reminder: {
          enabled: newReminderEnabled,
          time: newReminderTime || "08:30",
          periodLabel: newReminderPeriod || "Dhuha / Pagi",
          soundEnabled: true,
          soundType: newSoundType,
          customMessage: customMessageText,
          repeatFrequency: "everyday",
        },
      };

      const updated = [newGoal, ...goals];
      saveGoals(updated);

      // Play joyful subtle chime on creation
      soundSynth.playSoundByType("peaceful_bell");
    }

    setNewTitle("");
    setNewSubtitle("");
    setEditingGoalId(null);
    setIsAddModalOpen(false);
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
  };

  // Reminder Management Handlers
  const handleSaveReminderConfig = (goalId: string, config: GoalReminderConfig) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return { ...g, reminder: config };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleToggleGoalReminder = (goalId: string, enabled: boolean) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const defaultReminder: GoalReminderConfig = {
          enabled,
          time: "08:30",
          periodLabel: "Dhuha / Pagi",
          soundEnabled: true,
          soundType: "gentle_chime",
          customMessage: `Waktunya melaksanakan: ${g.title}`,
          repeatFrequency: "everyday",
        };
        return { ...g, reminder: g.reminder ? { ...g.reminder, enabled } : defaultReminder };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleToggleAllReminders = (enabled: boolean) => {
    const updated = goals.map((g) => {
      const defaultReminder: GoalReminderConfig = {
        enabled,
        time: "08:30",
        periodLabel: "Dhuha / Pagi",
        soundEnabled: true,
        soundType: "gentle_chime",
        customMessage: `Waktunya melaksanakan: ${g.title}`,
        repeatFrequency: "everyday",
      };
      return { ...g, reminder: g.reminder ? { ...g.reminder, enabled } : defaultReminder };
    });
    saveGoals(updated);
  };

  const handleSnoozeGoal = (goalId: string, minutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeHours = String(now.getHours()).padStart(2, "0");
    const snoozeMinutes = String(now.getMinutes()).padStart(2, "0");
    const snoozeTimeStr = `${snoozeHours}:${snoozeMinutes}`;

    const updated = goals.map((g) => {
      if (g.id === goalId && g.reminder) {
        return {
          ...g,
          reminder: {
            ...g.reminder,
            time: snoozeTimeStr,
            periodLabel: `Tunda (+${minutes}m)`,
          },
        };
      }
      return g;
    });
    saveGoals(updated);
    setIsPushToastVisible(false);
  };

  const handleTriggerTestPush = (goal: SpiritualDailyGoal, customConfig?: GoalReminderConfig) => {
    const goalToTest = customConfig ? { ...goal, reminder: customConfig } : goal;
    setActivePushGoal(goalToTest);
    setIsPushToastVisible(true);
  };

  const handleExecuteGoalAction = (goal: SpiritualDailyGoal) => {
    setIsPushToastVisible(false);
    if (goal.actionType === "quran") {
      setIsQuranModalOpen(true);
    } else if (goal.actionType === "breathing") {
      setIsBreathingModalOpen(true);
    } else if (goal.actionType === "dzikir" && onOpenDzikirSidebar) {
      onOpenDzikirSidebar();
    } else if (goal.actionType === "quote" && onOpenHikmahModal) {
      onOpenHikmahModal();
    }
  };

  // Reset to default presets while offering choice to keep custom goals
  const handleResetKeepCustom = () => {
    const customGoals = goals.filter((g) => g.isCustom);
    const merged = [...DEFAULT_PRESET_GOALS, ...customGoals];
    saveGoals(merged);
    setIsResetConfirmModalOpen(false);
  };

  const handleResetTotal = () => {
    saveGoals(DEFAULT_PRESET_GOALS);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_GOALS);
    setIsResetConfirmModalOpen(false);
  };

  // Filtered goals
  const filteredGoals = goals.filter((g) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "custom_only") return g.isCustom;
    return g.category === activeCategory;
  });

  const customGoalsCount = goals.filter((g) => g.isCustom).length;
  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Category Icon helper
  const getCategoryBadge = (category: GoalCategory, isCustom?: boolean) => {
    switch (category) {
      case "quran":
        return { label: "Al-Qur'an", color: "text-amber-400 bg-amber-950/40 border-amber-500/30", icon: BookOpen };
      case "breathing":
        return { label: "Thuma'ninah", color: "text-sky-400 bg-sky-950/40 border-sky-500/30", icon: Wind };
      case "dzikir":
        return { label: "Dzikir & Doa", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30", icon: Sparkles };
      case "prayer":
        return { label: "Shalat & Ibadah", color: "text-indigo-300 bg-indigo-950/40 border-indigo-500/30", icon: Moon };
      case "gratitude":
        return { label: "Syukur", color: "text-rose-400 bg-rose-950/40 border-rose-500/30", icon: Heart };
      case "charity":
        return { label: "Sedekah", color: "text-purple-400 bg-purple-950/40 border-purple-500/30", icon: Award };
      case "custom":
      default:
        return {
          label: isCustom ? "Pribadi" : "Harian",
          color: "text-[#C5A267] bg-[#C5A267]/15 border-[#C5A267]/40",
          icon: Sparkles,
        };
    }
  };

  // Breathing timer runner
  useEffect(() => {
    if (!isBreathingActive) return;

    let timer = setInterval(() => {
      setBreathingCounter((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (breathingPhase === "Tarik Napas (4s)") {
            setBreathingPhase("Tahan / Hening (4s)");
            return 4;
          } else if (breathingPhase === "Tahan / Hening (4s)") {
            setBreathingPhase("Hembuskan & Istighfar (6s)");
            return 6;
          } else {
            setBreathingPhase("Tarik Napas (4s)");
            setBreathingCycle((c) => {
              if (c >= 5) {
                // Done 5 cycles
                setIsBreathingActive(false);
                // Auto complete breathing goal if exists
                const breathingGoal = goals.find((g) => g.actionType === "breathing");
                if (breathingGoal && !breathingGoal.completed) {
                  handleToggleGoal(breathingGoal.id);
                }
                return 1;
              }
              return c + 1;
            });
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase, goals]);

  // Today formatted
  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#111318] border border-[#C5A267]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-6 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-[#C5A267]/15 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>Target Ruhani & Lencana Istiqomah • Spiritual Daily Goals</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#94A3B8] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              {todayFormatted}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Kebiasaan Kecil Penenang Jiwa & Penjernih Hati
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Bangun rutinitas ruhani yang menenangkan batin (*Qolbun Salim*), tambahkan target amalan personal sesuai kebutuhan jiwa Anda, dan pantau konsistensi istiqomah Anda.
          </p>
        </div>

        {/* Streak & Navigation Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Spiritual Streak Badge */}
          <div
            onClick={() => setActiveTab("badges")}
            className="bg-[#181C26] hover:bg-[#202534] border border-[#252E3E] hover:border-[#C5A267]/50 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-md transition-all cursor-pointer"
            title="Klik untuk membuka Galeri Lencana & Prestasi"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xs">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider block">
                Streak
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                {streakCount} Hari
              </span>
            </div>
          </div>

          {/* Schedule & Notification Hub Button */}
          <button
            onClick={() => setIsScheduleTimelineModalOpen(true)}
            className="bg-[#181C26] hover:bg-[#222838] border border-[#C5A267]/40 hover:border-[#C5A267] text-[#C5A267] font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
            title="Buka Jadwal Pengingat & Notifikasi Harian"
          >
            <Bell className="w-4 h-4 text-[#C5A267]" />
            <span className="hidden sm:inline">Jadwal Notifikasi</span>
            <span className="sm:hidden">Pengingat</span>
            <span className="px-1.5 py-0.5 bg-[#C5A267]/20 border border-[#C5A267]/40 rounded-full text-[10px] font-mono text-[#F3E8D2]">
              {goals.filter((g) => g.reminder?.enabled).length}
            </span>
          </button>

          {/* Add Custom Goal Button */}
          <button
            onClick={handleOpenAddModal}
            className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Tambah Target Pribadi</span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Tabs (Target Harian vs Lencana & Prestasi) */}
      <div className="relative z-10 flex items-center space-x-2 border-b border-[#1F2937] pb-4 mb-6">
        <button
          onClick={() => setActiveTab("goals")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "goals"
              ? "bg-[#C5A267] text-black shadow-lg shadow-[#C5A267]/20"
              : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daftar Target Harian</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "goals" ? "bg-black/20 text-black" : "bg-[#252E3E] text-[#CBD5E1]"
          }`}>
            {completedCount}/{totalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "badges"
              ? "bg-[#C5A267] text-black shadow-lg shadow-[#C5A267]/20"
              : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Lencana & Prestasi Istiqomah</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "badges" ? "bg-black/20 text-black" : "bg-[#C5A267]/20 text-[#C5A267]"
          }`}>
            {badges.filter((b) => b.isUnlocked).length}/{badges.length} Terbuka
          </span>
        </button>
      </div>

      {/* Celebratory Milestone Unlock Alert Banner */}
      {unlockedMilestoneAlert && (
        <div className="relative z-10 mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-[#1C172A] to-emerald-950/80 border-2 border-[#C5A267] shadow-xl animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A267] text-black flex items-center justify-center shadow-lg shadow-[#C5A267]/30 shrink-0">
              {unlockedMilestoneAlert.iconName === "Crown" ? (
                <Crown className="w-7 h-7" />
              ) : (
                <Flame className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-[10px] font-bold uppercase">
                  🎉 Lencana Baru Terbuka!
                </span>
                <span className="text-xs text-emerald-400 font-semibold">+{unlockedMilestoneAlert.xpReward} XP</span>
              </div>
              <h4 className="text-base font-bold text-white font-serif mt-0.5">
                {unlockedMilestoneAlert.title}
              </h4>
              <p className="text-xs text-[#CBD5E1]">
                {unlockedMilestoneAlert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedBadgeForModal(unlockedMilestoneAlert);
                setIsBadgeModalOpen(true);
              }}
              className="px-4 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Lihat Detail Lencana
            </button>
            <button
              onClick={() => setUnlockedMilestoneAlert(null)}
              className="p-2 text-[#94A3B8] hover:text-white rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW A: TARGET HARIAN (GOALS) */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          {/* Icon-Based Reward & 7/30 Days Badges Shelf Preview */}
          <div className="bg-[#0E1015] border border-[#C5A267]/30 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A267] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C5A267]" />
                  Penghargaan Istiqomah Ruhani • Icon-Based Reward System
                </span>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Capai target harian secara konsisten selama 7 atau 30 hari berturut-turut untuk membuka lencana virtual.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("badges")}
                className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Lihat Semua Lencana ({badges.filter((b) => b.isUnlocked).length}/{badges.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick 4 Icon Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Badge 1: 7 Hari Istiqomah */}
              {(() => {
                const b7 = badges.find((b) => b.id === "badge-streak-7") || badges[2];
                return (
                  <div
                    onClick={() => {
                      setSelectedBadgeForModal(b7);
                      setIsBadgeModalOpen(true);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      b7.isUnlocked
                        ? "bg-amber-950/40 border-[#C5A267] shadow-md shadow-[#C5A267]/10"
                        : "bg-[#141720] border-[#252E3E] hover:border-[#C5A267]/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      b7.isUnlocked ? "bg-[#C5A267] text-black" : "bg-[#181C26] text-[#64748B]"
                    }`}>
                      <Flame className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h5 className="text-xs font-bold text-white truncate">7 Hari Istiqomah</h5>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] block truncate">
                        {b7.isUnlocked ? "✓ Terbuka (Gold)" : `${streakCount}/7 Hari`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Badge 2: 30 Hari Istiqomah */}
              {(() => {
                const b30 = badges.find((b) => b.id === "badge-streak-30") || badges[4];
                return (
                  <div
                    onClick={() => {
                      setSelectedBadgeForModal(b30);
                      setIsBadgeModalOpen(true);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      b30.isUnlocked
                        ? "bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/20"
                        : "bg-[#141720] border-[#252E3E] hover:border-purple-400/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      b30.isUnlocked ? "bg-gradient-to-br from-amber-300 to-purple-500 text-black" : "bg-[#181C26] text-[#64748B]"
                    }`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h5 className="text-xs font-bold text-white truncate">30 Hari Master</h5>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] block truncate">
                        {b30.isUnlocked ? "✓ Terbuka (Royal)" : `${streakCount}/30 Hari`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Badge 3: 3 Hari Konsisten */}
              {(() => {
                const b3 = badges.find((b) => b.id === "badge-streak-3") || badges[1];
                return (
                  <div
                    onClick={() => {
                      setSelectedBadgeForModal(b3);
                      setIsBadgeModalOpen(true);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      b3.isUnlocked
                        ? "bg-slate-900/60 border-slate-400/60 shadow-sm"
                        : "bg-[#141720] border-[#252E3E] hover:border-slate-400/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      b3.isUnlocked ? "bg-slate-300 text-black" : "bg-[#181C26] text-[#64748B]"
                    }`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">3 Hari Fajar</h5>
                      <span className="text-[10px] text-[#94A3B8] block truncate">
                        {b3.isUnlocked ? "✓ Terbuka (Perak)" : `${streakCount}/3 Hari`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Badge 4: Tadabbur Al-Qur'an */}
              {(() => {
                const bQ = badges.find((b) => b.id === "badge-quran-tadabbur") || badges[6];
                return (
                  <div
                    onClick={() => {
                      setSelectedBadgeForModal(bQ);
                      setIsBadgeModalOpen(true);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      bQ.isUnlocked
                        ? "bg-emerald-950/40 border-emerald-500/60 shadow-sm"
                        : "bg-[#141720] border-[#252E3E] hover:border-emerald-500/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      bQ.isUnlocked ? "bg-emerald-500 text-black" : "bg-[#181C26] text-[#64748B]"
                    }`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">Tadabbur Qur'an</h5>
                      <span className="text-[10px] text-[#94A3B8] block truncate">
                        {bQ.isUnlocked ? "✓ Terbuka (Zamrud)" : "Belum Selesai"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Progress & Quick Stats Card */}
          <div className="relative z-10 bg-[#0E1015] border border-[#1F2937] rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Capaian Hari Ini: {completedCount} dari {totalCount} Tugas Selesai
                    {customGoalsCount > 0 && (
                      <span className="ml-2 text-[10px] font-normal text-[#C5A267] bg-[#C5A267]/10 px-2 py-0.5 rounded-full border border-[#C5A267]/30">
                        {customGoalsCount} Target Pribadi
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    {progressPercent === 100
                      ? "🎉 Maa Syaa Allah! Semua target ruhani hari ini telah tercapai sempurna."
                      : progressPercent >= 50
                      ? "✨ Luar biasa, jiwa Anda semakin tenang dengan konsistensi ini."
                      : "Mulai dengan 1 langkah kecil untuk menenangkan pikiran."}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xl font-bold font-mono text-[#C5A267]">{progressPercent}%</span>
                <button
                  onClick={() => setIsResetConfirmModalOpen(true)}
                  className="text-[11px] text-[#64748B] hover:text-[#C5A267] flex items-center gap-1 ml-2 transition-colors cursor-pointer"
                  title="Opsi reset daftar target"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Target</span>
                </button>
              </div>
            </div>

            {/* Progress Bar with Glow */}
            <div className="w-full h-3 bg-[#181C26] rounded-full overflow-hidden p-0.5 border border-[#252E3E]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C5A267] via-[#E5C388] to-emerald-400 transition-all duration-500 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>

          {/* Category & Personal Filter Tabs */}
          <div className="relative z-10 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#C5A267] text-black font-bold"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              Semua Target ({goals.length})
            </button>

            {customGoalsCount > 0 && (
              <button
                onClick={() => setActiveCategory("custom_only")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeCategory === "custom_only"
                    ? "bg-[#C5A267] text-black font-bold"
                    : "bg-[#181C26] text-[#C5A267] hover:bg-[#202534] border border-[#C5A267]/40"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Target Pribadi ({customGoalsCount})</span>
              </button>
            )}

            <button
              onClick={() => setActiveCategory("prayer")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "prayer"
                  ? "bg-indigo-500/25 text-indigo-200 border border-indigo-500/60 font-bold"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Shalat & Ibadah</span>
            </button>

            <button
              onClick={() => setActiveCategory("quran")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "quran"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Al-Qur'an</span>
            </button>

            <button
              onClick={() => setActiveCategory("breathing")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "breathing"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/50"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <Wind className="w-3 h-3" />
              <span>Nafas Thuma'ninah</span>
            </button>

            <button
              onClick={() => setActiveCategory("dzikir")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "dzikir"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Dzikir & Doa</span>
            </button>

            <button
              onClick={() => setActiveCategory("gratitude")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "gratitude"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>Syukur & Jurnal</span>
            </button>

            <button
              onClick={() => setActiveCategory("charity")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === "charity"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Sedekah</span>
            </button>
          </div>

          {/* Task List Items */}
          <div className="relative z-10 space-y-3">
            {filteredGoals.length === 0 ? (
              <div className="text-center py-10 bg-[#0E1015] border border-[#1F2937] rounded-2xl p-6">
                <Sparkles className="w-8 h-8 text-[#C5A267] mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-white">Belum Ada Target di Kategori Ini</h4>
                <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
                  Tambahkan amalan pribadi Anda sesuai kebutuhan ruhani atau pilih filter lain untuk melihat target yang ada.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="mt-4 px-4 py-2 bg-[#C5A267] text-black text-xs font-bold rounded-xl shadow-md hover:bg-[#D8B57B] transition-colors"
                >
                  + Tambah Target Pribadi
                </button>
              </div>
            ) : (
              filteredGoals.map((goal) => {
                const badge = getCategoryBadge(goal.category, goal.isCustom);
                const BadgeIcon = badge.icon;
                const isAnimating = animatingGoalId === goal.id;
                const target = goal.targetCount || 1;
                const current = goal.completed ? target : (goal.currentCount || 0);
                const isMultiStep = target > 1;
                const percent = Math.min(100, Math.round((current / target) * 100));

                return (
                  <div
                    key={goal.id}
                    className={`group border rounded-2xl p-4 sm:p-4.5 transition-all duration-300 flex flex-col justify-between gap-3.5 select-none ${
                      goal.completed
                        ? "bg-[#0E131A]/90 border-emerald-500/40 shadow-sm"
                        : goal.isCustom
                        ? "bg-[#141824] border-[#C5A267]/30 hover:border-[#C5A267]/70 hover:bg-[#181E2E] shadow-md hover:shadow-xl"
                        : "bg-[#141720] border-[#1F2937] hover:border-[#C5A267]/60 hover:bg-[#181C28] shadow-md hover:shadow-xl"
                    } ${isAnimating ? "ring-2 ring-emerald-400 scale-[1.01] transition-transform" : ""}`}
                  >
                    {/* Top Row: Progress Ring Toggle + Titles + Main Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left side: Circular Progress Ring Toggle + Titles */}
                      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                        {/* Interactive Circular Progress Percentage Ring */}
                        <div className="shrink-0 mt-0.5">
                          <GoalProgressRingToggle
                            completed={goal.completed}
                            targetCount={goal.targetCount || 1}
                            currentCount={goal.currentCount || 0}
                            isAnimating={isAnimating}
                            unitLabel={goal.unitLabel || "kali"}
                            onToggle={(e) => handleToggleGoal(goal.id, e)}
                            size={44}
                          />
                        </div>

                        {/* Goal Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                              <BadgeIcon className="w-2.5 h-2.5" />
                              <span>{badge.label}</span>
                            </span>

                            {/* Distinct Custom Tag */}
                            {goal.isCustom && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#C5A267]/50 text-[#C5A267] bg-[#C5A267]/15 flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-2.5 h-2.5 text-[#C5A267]" />
                                <span>Target Pribadi</span>
                              </span>
                            )}

                            {/* Numerical Target Badge (Clickable to adjust target) */}
                            {isMultiStep && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickEditGoalTarget(goal);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border flex items-center gap-1 transition-colors cursor-pointer ${
                                  goal.completed
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-[#0E1015] hover:bg-[#181C26] text-[#C5A267] border-[#C5A267]/40 hover:border-[#C5A267]"
                                }`}
                                title="Klik untuk mengubah jumlah target amalan ini"
                              >
                                <span>🎯 {current}/{target} {goal.unitLabel || "kali"}</span>
                                <span className="text-[9px] text-[#CBD5E1]">({percent}%)</span>
                              </button>
                            )}

                            {goal.estimatedMinutes && (
                              <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{goal.estimatedMinutes} Menit</span>
                              </span>
                            )}

                            {/* Push Reminder Status Pill */}
                            {goal.reminder?.enabled ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGoalForReminder(goal);
                                  setIsReminderConfigModalOpen(true);
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono border flex items-center gap-1 transition-all bg-[#181C26] hover:bg-[#252E3E] text-[#C5A267] border-[#C5A267]/40 hover:border-[#C5A267]"
                                title="Klik untuk mengubah jadwal & suara notifikasi"
                              >
                                <Bell className="w-2.5 h-2.5 text-[#C5A267]" />
                                <span>{goal.reminder.time}</span>
                                <span className="text-[9px] text-[#94A3B8] font-sans font-normal hidden sm:inline">({goal.reminder.periodLabel})</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGoalForReminder(goal);
                                  setIsReminderConfigModalOpen(true);
                                }}
                                className="px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 transition-all bg-[#141720] hover:bg-[#181C26] text-[#64748B] hover:text-[#94A3B8] border-[#252E3E]"
                                title="Jadwalkan notifikasi untuk amalan ini"
                              >
                                <BellOff className="w-2.5 h-2.5" />
                                <span>Atur Jadwal</span>
                              </button>
                            )}

                            {goal.completed && (
                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Tuntas Hari Ini</span>
                              </span>
                            )}
                          </div>

                          <h4
                            onClick={() => handleToggleGoal(goal.id)}
                            className={`text-sm sm:text-base font-bold transition-colors leading-snug cursor-pointer ${
                              goal.completed
                                ? "line-through text-[#64748B]"
                                : "text-white group-hover:text-[#F3E8D2]"
                            }`}
                          >
                            {goal.title}
                          </h4>

                          {goal.subtitle && (
                            <p
                              className={`text-xs mt-0.5 leading-relaxed ${
                                goal.completed ? "text-[#475569]" : "text-[#94A3B8]"
                              }`}
                            >
                              {goal.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side: Action Buttons & Quick Controls */}
                      <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F2937] w-full sm:w-auto justify-between sm:justify-end">
                        {/* Action Shortcuts */}
                        {goal.actionType === "quran" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsQuranModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#C5A267]/15 hover:bg-[#C5A267]/30 text-[#C5A267] border border-[#C5A267]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Baca Ayat</span>
                          </button>
                        )}

                        {goal.actionType === "breathing" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsBreathingModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Wind className="w-3.5 h-3.5" />
                            <span>Mulai Latihan</span>
                          </button>
                        )}

                        {goal.actionType === "dzikir" && onOpenDzikirSidebar && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDzikirSidebar();
                            }}
                            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Buka Tasbih</span>
                          </button>
                        )}

                        {goal.actionType === "quote" && onOpenHikmahModal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenHikmahModal();
                            }}
                            className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>Hikmah Syukur</span>
                          </button>
                        )}

                        {/* Reminder Config Quick Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGoalForReminder(goal);
                            setIsReminderConfigModalOpen(true);
                          }}
                          className={`p-2 rounded-xl transition-all border cursor-pointer ${
                            goal.reminder?.enabled
                              ? "text-[#C5A267] bg-[#C5A267]/10 border-[#C5A267]/30 hover:bg-[#C5A267]/20"
                              : "text-[#64748B] hover:text-[#94A3B8] hover:bg-[#181C26] border-transparent"
                          }`}
                          title={goal.reminder?.enabled ? `Pengingat Aktif: ${goal.reminder.time}` : "Atur Pengingat"}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button for Custom Goals */}
                        {goal.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(goal);
                            }}
                            className="p-2 text-[#94A3B8] hover:text-[#C5A267] hover:bg-[#C5A267]/15 rounded-xl transition-colors cursor-pointer"
                            title="Edit Target Pribadi"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Button for Custom Goals */}
                        {goal.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGoal(goal.id);
                            }}
                            className="p-2 text-[#64748B] hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Hapus Target Pribadi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Multi-step Numerical Progress Bar & Quick Increments (+1, +5, Full, Reset) */}
                    {isMultiStep && (
                      <div className="pt-2 border-t border-[#1F2937]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {/* Progress Bar & Counter Label */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#CBD5E1] flex items-center gap-1">
                              <span>Progres:</span>
                              <strong className="text-[#F3E8D2] font-mono">{current}</strong>
                              <span className="text-[#94A3B8]">/ {target} {goal.unitLabel || "kali"}</span>
                            </span>
                            <span className="font-mono font-bold text-[#C5A267]">{percent}%</span>
                          </div>
                          
                          {/* Animated Progress Bar */}
                          <div className="w-full h-2 bg-[#0E1015] rounded-full overflow-hidden border border-[#252E3E]">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                goal.completed
                                  ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                                  : "bg-linear-to-r from-[#C5A267] to-[#E5C388]"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Step Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={(e) => handleIncrementGoal(goal.id, 1, e)}
                            className="px-2.5 py-1 bg-[#181C26] hover:bg-[#252E3E] text-[#F3E8D2] hover:text-white border border-[#2A3448] hover:border-[#C5A267]/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="Tambah 1 hitungan"
                          >
                            <Plus className="w-3 h-3 text-[#C5A267]" />
                            <span>1</span>
                          </button>

                          {target >= 5 && (
                            <button
                              type="button"
                              onClick={(e) => handleIncrementGoal(goal.id, 5, e)}
                              className="px-2.5 py-1 bg-[#181C26] hover:bg-[#252E3E] text-[#F3E8D2] hover:text-white border border-[#2A3448] hover:border-[#C5A267]/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Tambah 5 hitungan cepat"
                            >
                              <Plus className="w-3 h-3 text-[#C5A267]" />
                              <span>5</span>
                            </button>
                          )}

                          {target >= 30 && (
                            <button
                              type="button"
                              onClick={(e) => handleIncrementGoal(goal.id, 10, e)}
                              className="px-2 py-1 bg-[#181C26] hover:bg-[#252E3E] text-[#F3E8D2] hover:text-white border border-[#2A3448] hover:border-[#C5A267]/60 rounded-lg text-xs font-mono font-bold hidden sm:flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Tambah 10 hitungan cepat"
                            >
                              <Plus className="w-3 h-3 text-[#C5A267]" />
                              <span>10</span>
                            </button>
                          )}

                          {!goal.completed && (
                            <button
                              type="button"
                              onClick={(e) => handleCompleteGoalDirectly(goal.id, e)}
                              className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Tandai langsung tuntas target penuh"
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span className="hidden sm:inline">Penuh</span>
                            </button>
                          )}

                          {current > 0 && (
                            <button
                              type="button"
                              onClick={(e) => handleResetGoalCount(goal.id, e)}
                              className="p-1 text-[#64748B] hover:text-[#94A3B8] hover:bg-[#181C26] rounded-lg transition-colors cursor-pointer"
                              title="Reset hitungan ke 0"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Bottom Dashed CTA to Add Custom Goal */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-full border-2 border-dashed border-[#252E3E] hover:border-[#C5A267]/70 bg-[#0E1015]/60 hover:bg-[#141824] rounded-2xl p-4 transition-all flex items-center justify-center gap-3 text-xs font-bold text-[#CBD5E1] hover:text-[#F3E8D2] group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 text-[#C5A267] stroke-[2.5]" />
              </div>
              <span>+ Buat Target Ruhani Pribadi Baru (Custom Personal Goal)</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: GALERI LENCANA & PRESTASI (ICON-BASED BADGES GALLERY) */}
      {activeTab === "badges" && (
        <div className="relative z-10 animate-fadeIn">
          <SpiritualBadgesGallery
            badges={badges}
            currentStreak={streakCount}
            onUpdateStreak={handleUpdateStreak}
          />
        </div>
      )}

      {/* Motivational Spiritual Footer Quote */}
      <div className="mt-6 pt-5 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#C5A267] shrink-0" />
          <span>
            <em>"Amalan yang paling dicintai Allah adalah amalan yang kontinu (istiqomah) walaupun sedikit."</em> — HR. Bukhari & Muslim
          </span>
        </div>

        {onOpenDzikirSidebar && (
          <button
            onClick={onOpenDzikirSidebar}
            className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Buka Ruang Dzikir & Pernapasan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* MODAL 1: Tambah / Edit Target Kustom Personal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-[#141722] border border-[#C5A267]/50 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
                  {editingGoalId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-serif">
                    {editingGoalId ? "Edit Target Ruhani Pribadi" : "Tambah Target Ruhani Pribadi"}
                  </h4>
                  <span className="text-[10px] text-[#94A3B8]">
                    Tersimpan otomatis di penyimpanan lokal (*localStorage*) perangkat Anda
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingGoalId(null);
                }}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspiration Quick Templates Section (Only when creating new goal) */}
            {!editingGoalId && (
              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#C5A267] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Inspirasi Amalan Sunnah & Ketenangan Batin (1-Klik):
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    {["Semua", "Pagi & Fajar", "Qur'an & Tadabbur", "Malam & Qiyam", "Dzikir & Shalawat"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setTemplateFilter(tag)}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          templateFilter === tag
                            ? "bg-[#C5A267]/25 text-[#F3E8D2] font-semibold"
                            : "text-[#64748B] hover:text-[#CBD5E1]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {CUSTOM_GOAL_TEMPLATES.filter((t) => templateFilter === "Semua" || t.tag === templateFilter).map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2.5 py-1 bg-[#181C26] hover:bg-[#222838] border border-[#2E374A] hover:border-[#C5A267]/50 rounded-xl text-[11px] text-[#CBD5E1] hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
                      title={tpl.subtitle}
                    >
                      <Plus className="w-2.5 h-2.5 text-[#C5A267]" />
                      <span>{tpl.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCustomGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                  Judul Amalan / Kebiasaan Ruhani *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Shalat Dhuha 2 Rakaat & Doa Kelapangan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-white placeholder-[#64748B] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                  Catatan Niat / Makna Penenang Jiwa (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Melatih rasa cukup, menenangkan pikiran sebelum memulai kerja"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-white placeholder-[#64748B] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Kategori Amalan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                    className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="prayer">Shalat & Ibadah Sunnah</option>
                    <option value="quran">Al-Qur'an & Tadabbur</option>
                    <option value="dzikir">Dzikir & Doa</option>
                    <option value="breathing">Thuma'ninah / Pernapasan</option>
                    <option value="gratitude">Syukur & Jurnal</option>
                    <option value="charity">Sedekah & Amal Kebaikan</option>
                    <option value="custom">Target Pribadi Lainnya</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-[#CBD5E1]">
                      Estimasi Durasi (Menit)
                    </label>
                    <div className="flex gap-1">
                      {[3, 5, 10, 15, 20].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setNewMinutes(m)}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                            newMinutes === m
                              ? "bg-[#C5A267] text-black font-bold border-[#C5A267]"
                              : "bg-[#141720] text-[#94A3B8] border-[#252E3E]"
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Numerical Target (Multi-step Counter) Configuration */}
              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
                      <span className="font-mono text-[10px] font-bold">#</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block">Target Hitungan Numerik (Multi-Step / Dzikir)</span>
                      <span className="text-[10px] text-[#94A3B8]">Contoh: 33x tasbih, 100x istighfar, 10 halaman</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewHasNumericalTarget(!newHasNumericalTarget)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      newHasNumericalTarget ? "bg-[#C5A267]" : "bg-[#252E3E]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-black absolute top-0.5 transition-transform ${
                        newHasNumericalTarget ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {newHasNumericalTarget && (
                  <div className="space-y-3 pt-1 border-t border-[#1F2937] animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1 font-semibold">
                          Jumlah Target Hitungan
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          value={newTargetCount}
                          onChange={(e) => setNewTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1 font-semibold">
                          Satuan / Label Hitungan
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: x dzikir, ayat, halaman, rupiah"
                          value={newUnitLabel}
                          onChange={(e) => setNewUnitLabel(e.target.value)}
                          className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Count Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { count: 33, label: "33x (Tasbih)" },
                        { count: 70, label: "70x (Sunnah)" },
                        { count: 100, label: "100x (Pagi/Petang)" },
                        { count: 1000, label: "1000x (Shalawat)" },
                        { count: 10, label: "10 Ayat" },
                        { count: 1, label: "1 Juz" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setNewTargetCount(item.count);
                            if (item.label.includes("Tasbih") || item.label.includes("Sunnah") || item.label.includes("Pagi/Petang")) {
                              setNewUnitLabel("x dzikir");
                            } else if (item.label.includes("Ayat")) {
                              setNewUnitLabel("ayat");
                            } else if (item.label.includes("Juz")) {
                              setNewUnitLabel("juz");
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            newTargetCount === item.count
                              ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] font-semibold"
                              : "bg-[#141720] border-[#2E374A] text-[#94A3B8] hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Push Reminder Scheduling for this Goal */}
              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span className="text-[11px] font-bold text-white">Jadwalkan Notifikasi & Lonceng Pengingat</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewReminderEnabled(!newReminderEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      newReminderEnabled ? "bg-[#C5A267]" : "bg-[#252E3E]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-black absolute top-0.5 transition-transform ${
                        newReminderEnabled ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {newReminderEnabled && (
                  <div className="space-y-3 pt-1 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1">Waktu Notifikasi</label>
                        <input
                          type="time"
                          value={newReminderTime}
                          onChange={(e) => setNewReminderTime(e.target.value)}
                          className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#94A3B8] mb-1">Label Periode</label>
                        <input
                          type="text"
                          placeholder="Contoh: Dhuha / Pagi"
                          value={newReminderPeriod}
                          onChange={(e) => setNewReminderPeriod(e.target.value)}
                          className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Time Presets Chips */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: "Subuh", time: "05:15", period: "Subuh / Fajar" },
                        { label: "Dhuha", time: "08:30", period: "Dhuha / Pagi" },
                        { label: "Dzuhur", time: "12:30", period: "Dzuhur / Siang" },
                        { label: "Ashar", time: "15:45", period: "Ashar / Sore" },
                        { label: "Isya", time: "20:00", period: "Isya / Malam" },
                        { label: "Tahajjud", time: "03:30", period: "Qiyamul Lail" },
                        { label: "Tidur", time: "21:45", period: "Sebelum Tidur" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setNewReminderTime(item.time);
                            setNewReminderPeriod(item.period);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            newReminderTime === item.time
                              ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] font-semibold"
                              : "bg-[#141720] border-[#2E374A] text-[#94A3B8] hover:text-white"
                          }`}
                        >
                          {item.label} ({item.time})
                        </button>
                      ))}
                    </div>

                    {/* Sound Selector with Live Audio Test */}
                    <div className="pt-2 border-t border-[#1F2937]">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] text-[#94A3B8]">Pilihan Suara Notifikasi</label>
                        <button
                          type="button"
                          onClick={() => soundSynth.playSoundByType(newSoundType)}
                          className="text-[10px] text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Uji Suara Lonceng</span>
                        </button>
                      </div>
                      <select
                        value={newSoundType}
                        onChange={(e) => setNewSoundType(e.target.value as ReminderSoundType)}
                        className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white text-xs outline-none cursor-pointer"
                      >
                        <option value="peaceful_bell">Lonceng Damai Fajar (Peaceful Bell)</option>
                        <option value="gentle_chime">Harmoni Solfeggio 528Hz (Gentle Chime)</option>
                        <option value="singing_bowl">Tibetan Singing Bowl 432Hz (Deep Relax)</option>
                        <option value="subtle_drop">Tetes Air Penyejuk (Subtle Water Drop)</option>
                      </select>
                    </div>

                    {/* Custom Reminder Message */}
                    <div>
                      <label className="block text-[10px] text-[#94A3B8] mb-1">Pesan Notifikasi Khusus</label>
                      <input
                        type="text"
                        placeholder={`Waktunya melaksanakan: ${newTitle || "Amalan Harian"}`}
                        value={newCustomMessage}
                        onChange={(e) => setNewCustomMessage(e.target.value)}
                        className="w-full bg-[#141720] border border-[#2E374A] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingGoalId(null);
                  }}
                  className="px-4 py-2 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-[#C5A267]/20 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  <span>{editingGoalId ? "Simpan Perubahan" : "Simpan Target Pribadi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Reset Target */}
      {isResetConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#141722] border border-[#C5A267]/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Reset Target Ruhani</h4>
                <p className="text-xs text-[#94A3B8]">Pilih opsi pengaturan ulang daftar target Anda</p>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Anda memiliki {customGoalsCount} target pribadi yang tersimpan. Anda dapat memilih untuk tetap mempertahankan target pribadi Anda atau menghapus semuanya ke setelan awal pabrik.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResetKeepCustom}
                className="w-full p-3 bg-[#181C26] hover:bg-[#222838] border border-[#C5A267]/40 hover:border-[#C5A267] rounded-xl text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-[#C5A267] block">
                  ✓ Reset Preset Rekomendasi (Pertahankan Target Pribadi)
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  Memulihkan 5 target bawaan sistem tanpa menghapus target yang Anda tambahkan sendiri.
                </span>
              </button>

              <button
                type="button"
                onClick={handleResetTotal}
                className="w-full p-3 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 rounded-xl text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-rose-400 block">
                  ✕ Reset Bersih Total (Hapus Semua)
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  Mengembalikan sistem hanya ke 5 target rekomendasi awal dan menghapus semua kustomisasi.
                </span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsResetConfirmModalOpen(false)}
                className="px-4 py-2 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Baca Ayat Al-Qur'an & Tadabbur Interaktif */}
      {isQuranModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#141722] border border-[#C5A267]/50 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-serif">Tadabbur 1 Ayat Penyejuk Jiwa</h4>
                  <span className="text-[10px] text-[#94A3B8]">Membaca & Memahami Makna Firman Ilahi</span>
                </div>
              </div>
              <button
                onClick={() => setIsQuranModalOpen(false)}
                className="text-[#94A3B8] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quran Verse Display */}
            <div className="bg-[#0A0B0E] border border-[#C5A267]/30 rounded-2xl p-5 space-y-4 text-center">
              <span className="px-3 py-1 bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-xs font-bold inline-block">
                {QURAN_VERSES[selectedVerseIndex].surah}
              </span>

              <p className="text-xl sm:text-2xl font-serif text-[#F3E8D2] leading-loose py-2 tracking-wide dir-rtl">
                {QURAN_VERSES[selectedVerseIndex].arabic}
              </p>

              <div className="text-left bg-[#111318] p-3.5 rounded-xl border border-[#1F2937] space-y-2">
                <p className="text-xs text-white leading-relaxed italic">
                  "{QURAN_VERSES[selectedVerseIndex].translation}"
                </p>
                <div className="pt-2 border-t border-[#1F2937] text-[11px] text-[#C5A267]">
                  <strong>Tadabbur Jiwa:</strong> {QURAN_VERSES[selectedVerseIndex].tadabbur}
                </div>
              </div>
            </div>

            {/* Navigation & Completion Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setSelectedVerseIndex((prev) => (prev + 1) % QURAN_VERSES.length);
                }}
                className="px-3.5 py-2 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ayat Lainnya</span>
              </button>

              <button
                onClick={() => {
                  // Mark goal as completed
                  const quranGoal = goals.find((g) => g.actionType === "quran");
                  if (quranGoal && !quranGoal.completed) {
                    handleToggleGoal(quranGoal.id);
                  }
                  setIsQuranModalOpen(false);
                }}
                className="px-5 py-2.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-[#C5A267]/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Alhamdulillah, Selesai Membaca</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: Sesi Pernapasan Thuma'ninah (Interactive Deep Breathing) */}
      {isBreathingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#141722] border border-sky-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 text-center">
            
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-serif">Sesi Pernapasan Thuma'ninah</h4>
                  <span className="text-[10px] text-[#94A3B8]">Ritme 4-4-6 untuk Redakan Kortisol</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBreathingModalOpen(false);
                  setIsBreathingActive(false);
                }}
                className="text-[#94A3B8] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Breathing Animation Sphere */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 relative ${
                  breathingPhase.startsWith("Tarik")
                    ? "scale-110 border-sky-400 bg-sky-500/20 shadow-2xl shadow-sky-500/40"
                    : breathingPhase.startsWith("Tahan")
                    ? "scale-110 border-[#C5A267] bg-[#C5A267]/20 shadow-2xl shadow-[#C5A267]/40"
                    : "scale-90 border-emerald-400 bg-emerald-500/20 shadow-2xl shadow-emerald-500/40"
                }`}
              >
                <span className="text-3xl font-mono font-bold text-white mb-0.5">
                  {breathingCounter}
                </span>
                <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
                  Detik
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <h5 className="text-base font-bold text-white font-serif">
                  {breathingPhase}
                </h5>
                <p className="text-xs text-[#94A3B8]">
                  Putaran ke-{breathingCycle} dari 5 Siklus
                </p>
              </div>
            </div>

            {/* Control & Completion Action */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {!isBreathingActive ? (
                <button
                  onClick={() => setIsBreathingActive(true)}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Mulai Siklus Latihan</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsBreathingActive(false)}
                  className="px-5 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#252E3E] cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Jeda Sesi</span>
                </button>
              )}

              <button
                onClick={() => {
                  const breathingGoal = goals.find((g) => g.actionType === "breathing");
                  if (breathingGoal && !breathingGoal.completed) {
                    handleToggleGoal(breathingGoal.id);
                  }
                  setIsBreathingModalOpen(false);
                  setIsBreathingActive(false);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tandai Selesai</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: Detail Lencana & Prestasi Virtual */}
      {isBadgeModalOpen && (
        <BadgeDetailModal
          badge={selectedBadgeForModal}
          isOpen={isBadgeModalOpen}
          onClose={() => setIsBadgeModalOpen(false)}
        />
      )}

      {/* MODAL 5: Atur Jadwal & Suara Pengingat Notifikasi Per-Goal */}
      <GoalReminderConfigModal
        goal={selectedGoalForReminder}
        isOpen={isReminderConfigModalOpen}
        onClose={() => {
          setIsReminderConfigModalOpen(false);
          setSelectedGoalForReminder(null);
        }}
        onSaveReminder={handleSaveReminderConfig}
        onTriggerTestPush={handleTriggerTestPush}
      />

      {/* MODAL 6: Manajemen Linimasa Jadwal Pengingat Keseluruhan */}
      <GoalScheduleTimelineModal
        goals={goals}
        isOpen={isScheduleTimelineModalOpen}
        onClose={() => setIsScheduleTimelineModalOpen(false)}
        onToggleGoalReminder={handleToggleGoalReminder}
        onToggleAllReminders={handleToggleAllReminders}
        onConfigureGoalReminder={(goal) => {
          setSelectedGoalForReminder(goal);
          setIsReminderConfigModalOpen(true);
        }}
        onTriggerTestPush={handleTriggerTestPush}
      />

      {/* TOAST / PUSH BANNER: Notifikasi Terjadwal Real-Time */}
      <GoalPushNotificationToast
        goal={activePushGoal}
        isVisible={isPushToastVisible}
        onClose={() => {
          setIsPushToastVisible(false);
          setActivePushGoal(null);
        }}
        onCompleteGoal={(goalId) => {
          handleToggleGoal(goalId);
          setIsPushToastVisible(false);
        }}
        onSnoozeGoal={handleSnoozeGoal}
        onExecuteAction={handleExecuteGoalAction}
      />

      {/* MODAL 7: Quick Edit Target Numerik & Dzikir */}
      <GoalNumericalTargetModal
        goal={quickEditGoalTarget}
        isOpen={Boolean(quickEditGoalTarget)}
        onClose={() => setQuickEditGoalTarget(null)}
        onSaveTarget={handleSaveGoalNumericalTarget}
      />

    </div>
  );
};
