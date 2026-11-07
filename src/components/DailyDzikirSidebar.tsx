import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  Bell,
  BellOff,
  Wind,
  Smile,
  ChevronRight,
  Share2,
  Copy,
  Info,
  Calendar,
  Layers,
  ListChecks,
  Headphones,
  Music,
  Repeat
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  DZIKIR_COLLECTION,
  SPIRITUAL_QUOTES,
  TAZKIYAH_BREATHING_STEPS,
  DzikirItem,
  SpiritualQuote,
  ReflectionJournalEntry
} from "../data/dzikirReflectionData";
import { soundSynth } from "../utils/audioChime";
import { incrementTodayDzikirCount } from "../utils/dzikirHistory";
import { SpiritualDailyChecklist } from "./SpiritualDailyChecklist";
import { AmbientDzikirAudioPlayer } from "./AmbientDzikirAudioPlayer";
import { ambientAudioEngine } from "../utils/ambientAudioEngine";

interface DailyDzikirSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDzikirId?: string;
  onOpenSpiritualModal: (quote?: SpiritualQuote) => void;
  reminderIntervalMinutes: number;
  setReminderIntervalMinutes: (mins: number) => void;
  isReminderEnabled: boolean;
  setIsReminderEnabled: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

export const DailyDzikirSidebar: React.FC<DailyDzikirSidebarProps> = ({
  isOpen,
  onClose,
  selectedDzikirId,
  onOpenSpiritualModal,
  reminderIntervalMinutes,
  setReminderIntervalMinutes,
  isReminderEnabled,
  setIsReminderEnabled,
  isSoundEnabled,
  setIsSoundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<"tasbih" | "checklist" | "reflection" | "breathing" | "settings">("tasbih");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentDzikirIndex, setCurrentDzikirIndex] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(33);
  const [dailyTotalCount, setDailyTotalCount] = useState<number>(() => {
    const saved = localStorage.getItem("limocity_total_dzikir_count");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem("limocity_completed_sessions");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Breathing Guide State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingStepIndex, setBreathingStepIndex] = useState<number>(0);
  const [breathingTimer, setBreathingTimer] = useState<number>(4);

  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<ReflectionJournalEntry[]>(() => {
    const saved = localStorage.getItem("limocity_tazkiyah_journal");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "entry-init-1",
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        moodTag: "tenteram",
        note: "Alhamdulillah setelah membaca Doa Nabi Yunus 33x di sela kerja, dada terasa lebih lapang dan tidak terburu-buru lagi.",
        dzikirDoneCount: 33,
      }
    ];
  });
  const [newJournalNote, setNewJournalNote] = useState<string>("");
  const [selectedMoodTag, setSelectedMoodTag] = useState<"tenteram" | "bersyukur" | "butuh_kekuatan" | "muhasabah" | "pasrah">("tenteram");
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(ambientAudioEngine.getIsPlaying());

  useEffect(() => {
    ambientAudioEngine.setListener((playing) => {
      setIsAmbientPlaying(playing);
    });
  }, []);

  // Random Daily Quote selection based on day
  const todayQuoteIndex = new Date().getDate() % SPIRITUAL_QUOTES.length;
  const currentQuote = SPIRITUAL_QUOTES[todayQuoteIndex];

  // Set selected dzikir if passed from parent
  useEffect(() => {
    if (selectedDzikirId) {
      const idx = DZIKIR_COLLECTION.findIndex((d) => d.id === selectedDzikirId);
      if (idx !== -1) {
        setCurrentDzikirIndex(idx);
        setCounter(0);
        setTargetCount(DZIKIR_COLLECTION[idx].targetCount);
      }
    }
  }, [selectedDzikirId]);

  // Sync daily count to localStorage
  useEffect(() => {
    localStorage.setItem("limocity_total_dzikir_count", dailyTotalCount.toString());
    localStorage.setItem("limocity_completed_sessions", completedSessions.toString());
  }, [dailyTotalCount, completedSessions]);

  // Breathing animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      const currentStep = TAZKIYAH_BREATHING_STEPS[breathingStepIndex];
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            const nextStepIndex = (breathingStepIndex + 1) % TAZKIYAH_BREATHING_STEPS.length;
            setBreathingStepIndex(nextStepIndex);
            if (isSoundEnabled && nextStepIndex === 0) {
              soundSynth.playGentleChime();
            }
            return TAZKIYAH_BREATHING_STEPS[nextStepIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingStepIndex, isSoundEnabled]);

  const activeDzikir: DzikirItem = DZIKIR_COLLECTION[currentDzikirIndex] || DZIKIR_COLLECTION[0];

  // Filtered Dzikir items
  const filteredDzikirs = selectedCategory === "all" 
    ? DZIKIR_COLLECTION 
    : DZIKIR_COLLECTION.filter((d) => d.category === selectedCategory);

  // Handle Tasbih Tap
  const handleTasbihTap = () => {
    const nextCount = counter + 1;
    setCounter(nextCount);
    setDailyTotalCount((prev) => prev + 1);
    incrementTodayDzikirCount(1);

    if (isSoundEnabled) {
      soundSynth.playTasbihClick();
    }

    // Check target reached
    if (targetCount > 0 && nextCount === targetCount) {
      setCompletedSessions((prev) => prev + 1);
      if (isSoundEnabled) {
        soundSynth.playCompletionFanfare();
      }
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7, x: 0.8 },
          colors: ["#C5A267", "#E6CA85", "#FFFFFF", "#10B981"]
        });
      } catch (e) {}
    }
  };

  const handleResetCounter = () => {
    setCounter(0);
  };

  const handleSelectDzikir = (dzikir: DzikirItem) => {
    const idx = DZIKIR_COLLECTION.findIndex((d) => d.id === dzikir.id);
    if (idx !== -1) {
      setCurrentDzikirIndex(idx);
      setCounter(0);
      setTargetCount(dzikir.targetCount);
    }
  };

  const handleSelectDzikirByKeyword = (keyword: string) => {
    const lower = keyword.toLowerCase();
    let found = DZIKIR_COLLECTION.find((d) => 
      d.title.toLowerCase().includes(lower) || 
      d.categoryLabel.toLowerCase().includes(lower) ||
      d.arabic.includes(keyword)
    );

    if (!found) {
      if (lower.includes("pagi") || lower.includes("petang")) {
        found = DZIKIR_COLLECTION.find((d) => d.id === "dzikir-8" || d.category === "morning_evening");
      } else if (lower.includes("sayyidul") || lower.includes("istighfar")) {
        found = DZIKIR_COLLECTION.find((d) => d.id === "dzikir-2" || d.category === "istighfar");
      } else if (lower.includes("sholawat") || lower.includes("syukur") || lower.includes("tasbih")) {
        found = DZIKIR_COLLECTION.find((d) => d.id === "dzikir-7" || d.category === "gratitude");
      }
    }

    if (found) {
      handleSelectDzikir(found);
    }
    setActiveTab("tasbih");
    if (isSoundEnabled) {
      soundSynth.playTasbihClick();
    }
  };

  const handleAddJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalNote.trim()) return;

    const newEntry: ReflectionJournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      moodTag: selectedMoodTag,
      note: newJournalNote.trim(),
      dzikirDoneCount: counter,
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem("limocity_tazkiyah_journal", JSON.stringify(updated));
    setNewJournalNote("");
  };

  const handleCopyQuote = (quoteText: string, quoteId: string) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuoteId(quoteId);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#12151E] via-[#0E1017] to-[#0A0B0E] border-l border-[#C5A267]/30 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#1F2937] bg-[#141720]/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base leading-snug flex items-center gap-1.5">
                  <span>Dzikir & Refleksi Harian</span>
                </h3>
                <span className="text-[10px] text-[#C5A267] font-medium tracking-wide uppercase">
                  Tazkiyatun Nafs • Penyejuk Jiwa
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Ambient Audio (Murottal / Nasheed) Quick Toggle */}
              <button
                onClick={() => ambientAudioEngine.toggle()}
                title={isAmbientPlaying ? "Jeda Latar Audio Murottal/Nasheed" : "Putar Latar Murottal/Nasheed (Auto-Loop)"}
                className={`p-2 rounded-lg border text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  isAmbientPlaying 
                    ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] shadow-xs shadow-[#C5A267]/30 ring-1 ring-[#C5A267]/50" 
                    : "bg-[#181C26] border-[#252E3E] text-[#94A3B8] hover:text-[#CBD5E1] hover:border-[#38445C]"
                }`}
              >
                {isAmbientPlaying ? (
                  <>
                    <Music className="w-4 h-4 text-[#C5A267] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#C5A267] hidden sm:inline">Latar Aktif</span>
                  </>
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                title={isSoundEnabled ? "Matikan Suara Chime" : "Nyalakan Suara Chime"}
                className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSoundEnabled 
                    ? "bg-[#C5A267]/15 border-[#C5A267]/40 text-[#C5A267]" 
                    : "bg-[#181C26] border-[#252E3E] text-[#64748B]"
                }`}
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-lg transition-colors border border-transparent hover:border-[#252E3E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daily Streak & Counter Status Banner */}
          <div className="px-5 py-3 bg-[#0B0D12] border-b border-[#1F2937] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/40">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{completedSessions} Putaran Selesai</span>
              </div>
            </div>
            <div className="text-[#94A3B8] text-[11px]">
              Total Hari Ini: <span className="font-bold text-[#C5A267] font-mono">{dailyTotalCount} Dzikir</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-4 pt-3 pb-1 border-b border-[#1F2937] flex space-x-1 bg-[#10131A] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("tasbih")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "tasbih"
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Tasbih & Dzikir
            </button>

            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "checklist"
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              Checklist Sunnah
            </button>

            <button
              onClick={() => setActiveTab("reflection")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "reflection"
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Tadabbur Hati
            </button>

            <button
              onClick={() => setActiveTab("breathing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "breathing"
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Nafas Sadar
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "settings"
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Pengingat
            </button>
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-[#E2E8F0] custom-scrollbar">
            
            {/* ========================================================= */}
            {/* TAB 1: TASBIH & DZIKIR */}
            {/* ========================================================= */}
            {activeTab === "tasbih" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Quick Daily Checklist Mini Banner */}
                <div 
                  onClick={() => setActiveTab("checklist")}
                  className="p-3 bg-gradient-to-r from-[#181C26] via-[#151922] to-[#12141B] border border-[#C5A267]/30 hover:border-[#C5A267] rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] group-hover:scale-105 transition-transform">
                      <ListChecks className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-[#C5A267] transition-colors">
                        Checklist Amalan Sunnah Harian
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Pantau dzikir pagi/petang & sholat sunnah hari ini
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#C5A267] group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Active Selected Dzikir Card */}
                <div className="bg-[#141720] border border-[#C5A267]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {activeDzikir.categoryLabel}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">
                      {activeDzikir.source}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-serif mb-2">
                    {activeDzikir.title}
                  </h4>

                  {/* Arabic Text */}
                  <div className="p-3.5 bg-[#0B0D12] rounded-xl border border-[#252E3E] text-right font-serif text-lg leading-relaxed text-[#F3E8D2] tracking-wide my-2 selection:bg-[#C5A267]/40 select-text">
                    {activeDzikir.arabic}
                  </div>

                  {/* Latin & Translation */}
                  <p className="text-xs text-[#C5A267] italic font-serif leading-relaxed mt-2">
                    "{activeDzikir.transliteration}"
                  </p>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed mt-1.5">
                    {activeDzikir.translation}
                  </p>

                  {/* Psychological / Tazkiyah Benefit */}
                  <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-start space-x-2 text-[11px] text-[#E2E8F0]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A267] shrink-0 mt-0.5" />
                    <span className="leading-snug text-[#CBD5E1]">
                      <strong className="text-[#C5A267]">Khasiat Batin:</strong> {activeDzikir.benefit}
                    </span>
                  </div>
                </div>

                {/* Auto-Looping Ambient Audio Player (Murottal Quran & Soft Nasheed) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-[11px] font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      <span>Alunan Latar Dzikir (Auto-Loop)</span>
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Murottal • Nasheed • 528Hz
                    </span>
                  </div>
                  <AmbientDzikirAudioPlayer />
                </div>

                {/* Interactive Tasbih Circle Ring */}
                <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#141720] to-[#0D0F14] rounded-2xl border border-[#252E3E] shadow-xl">
                  
                  <div className="flex items-center justify-between w-full mb-3 text-xs text-[#94A3B8]">
                    <span>Target Putaran:</span>
                    <div className="flex space-x-1.5">
                      {[33, 100, 0].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTargetCount(t);
                            if (t > 0 && counter >= t) setCounter(0);
                          }}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                            targetCount === t
                              ? "bg-[#C5A267] text-black"
                              : "bg-[#181C26] text-[#94A3B8] border border-[#252E3E] hover:text-white"
                          }`}
                        >
                          {t === 0 ? "Bebas" : `${t}x`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Circular Button */}
                  <div className="relative my-2">
                    <button
                      id="tasbih-tap-btn"
                      onClick={handleTasbihTap}
                      className="w-36 h-36 rounded-full bg-gradient-to-b from-[#1A1F2C] to-[#12151E] border-4 border-[#C5A267]/50 hover:border-[#C5A267] active:scale-95 transition-all flex flex-col items-center justify-center shadow-2xl shadow-[#C5A267]/20 group cursor-pointer"
                    >
                      <span className="text-3xl font-bold font-mono text-white group-hover:text-[#C5A267] transition-colors">
                        {counter}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] tracking-widest uppercase mt-0.5">
                        {targetCount > 0 ? `/ ${targetCount}` : "Ketuk Dzikir"}
                      </span>
                      <span className="text-[9px] text-[#C5A267] opacity-80 mt-1 font-medium">
                        ✦ Sentuh ✦
                      </span>
                    </button>

                    {/* Progress Ring Visual */}
                    {targetCount > 0 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#C5A267] text-black text-[10px] font-bold rounded-full shadow-md whitespace-nowrap">
                        {Math.min(100, Math.round((counter / targetCount) * 100))}% Selesai
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-[#1F2937] w-full justify-center">
                    <button
                      onClick={handleResetCounter}
                      className="px-3 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 border border-[#252E3E] transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulang (Reset)</span>
                    </button>

                    <button
                      onClick={() => onOpenSpiritualModal(currentQuote)}
                      className="px-3 py-1.5 bg-[#C5A267]/15 hover:bg-[#C5A267]/30 text-[#C5A267] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#C5A267]/40 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Jeda Hati ({SPIRITUAL_QUOTES.length})</span>
                    </button>
                  </div>
                </div>

                {/* Quick Dzikir Selector List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Pilihan Dzikir Tazkiyah ({filteredDzikirs.length})
                    </h5>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-[#141720] border border-[#252E3E] text-[#C5A267] text-[11px] rounded-lg px-2 py-1 focus:outline-hidden"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="calm">Penenang Hati</option>
                      <option value="istighfar">Istighfar & Taubat</option>
                      <option value="healing">Penyembuhan Batin</option>
                      <option value="strength">Kekuatan & Tawakkul</option>
                      <option value="gratitude">Syukur & Tasbih</option>
                      <option value="morning_evening">Pagi & Petang</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    {filteredDzikirs.map((dzikir) => {
                      const isSelected = activeDzikir.id === dzikir.id;
                      return (
                        <div
                          key={dzikir.id}
                          onClick={() => handleSelectDzikir(dzikir)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#181C26] border-[#C5A267] shadow-md shadow-[#C5A267]/10"
                              : "bg-[#12151E] border-[#252E3E] hover:border-[#C5A267]/50 hover:bg-[#141720]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase text-[#C5A267]">
                              {dzikir.categoryLabel}
                            </span>
                            <span className="text-[10px] text-[#64748B]">
                              Target: {dzikir.targetCount}x
                            </span>
                          </div>
                          <h6 className="text-xs font-bold text-white">
                            {dzikir.title}
                          </h6>
                          <p className="text-[11px] text-[#94A3B8] font-serif line-clamp-1 mt-0.5">
                            {dzikir.transliteration}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: CHECKLIST SUNNAH & AMALAN HARIAN */}
            {/* ========================================================= */}
            {activeTab === "checklist" && (
              <div className="space-y-4 animate-fadeIn">
                <SpiritualDailyChecklist
                  onSelectDzikirToPractice={handleSelectDzikirByKeyword}
                  isSoundEnabled={isSoundEnabled}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: TADABBUR & REFLEKSI HATIKU */}
            {/* ========================================================= */}
            {activeTab === "reflection" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Quote of the Day */}
                <div className="bg-gradient-to-br from-[#181C26] to-[#0E1015] border border-[#C5A267]/40 rounded-2xl p-5 shadow-xl relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 bg-[#C5A267]/20 text-[#C5A267] rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Hikmah Tazkiyah Hari Ini
                    </span>
                    <button
                      onClick={() => handleCopyQuote(`"${currentQuote.quote}" - ${currentQuote.authorOrSource}`, currentQuote.id)}
                      className="text-[#94A3B8] hover:text-[#C5A267] text-[11px] flex items-center gap-1 transition-colors"
                      title="Salin Kutipan"
                    >
                      {copiedQuoteId === currentQuote.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedQuoteId === currentQuote.id ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>

                  <blockquote className="text-sm sm:text-base font-serif italic text-white leading-relaxed my-2">
                    "{currentQuote.quote}"
                  </blockquote>

                  <p className="text-xs font-bold text-[#C5A267] mt-2 font-serif text-right">
                    — {currentQuote.authorOrSource}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#1F2937] text-[11px] text-[#94A3B8] space-y-1">
                    <span className="font-bold text-white block">Tadabbur Jiwa:</span>
                    <p className="leading-relaxed text-[#CBD5E1]">
                      {currentQuote.tazkiyahExplanation}
                    </p>
                  </div>
                </div>

                {/* Mini Journal: Catatan Tazkiyah Hati */}
                <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#C5A267]" />
                      <span>Jurnal Hening & Refleksi Hati</span>
                    </h5>
                    <span className="text-[10px] text-[#64748B]">Tersimpan Lokal</span>
                  </div>

                  <p className="text-[11px] text-[#94A3B8]">
                    Apa yang sedang dirasakan hatimu saat ini? Tuliskan untuk melepaskan beban batin (*Catharsis*) ke hadirat Allah.
                  </p>

                  <form onSubmit={handleAddJournalEntry} className="space-y-3">
                    {/* Mood tag picker */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "tenteram", label: "🌿 Tenteram" },
                        { id: "bersyukur", label: "✨ Bersyukur" },
                        { id: "butuh_kekuatan", label: "🛡️ Butuh Penguat" },
                        { id: "muhasabah", label: "🪞 Muhasabah" },
                        { id: "pasrah", label: "🕊️ Pasrah & Ridha" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMoodTag(m.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            selectedMoodTag === m.id
                              ? "bg-[#C5A267] text-black font-bold"
                              : "bg-[#181C26] text-[#94A3B8] border border-[#252E3E] hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={newJournalNote}
                      onChange={(e) => setNewJournalNote(e.target.value)}
                      placeholder="Tuliskan curahan hatimu atau doa kecil hari ini..."
                      className="w-full p-2.5 bg-[#0B0D12] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />

                    <button
                      type="submit"
                      disabled={!newJournalNote.trim()}
                      className="w-full py-2 bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simpan Catatan Tazkiyah</span>
                    </button>
                  </form>

                  {/* History of notes */}
                  {journalEntries.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#1F2937] space-y-2 max-h-48 overflow-y-auto pr-1">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Riwayat Refleksi Sebelumnya ({journalEntries.length})
                      </span>
                      {journalEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-2.5 bg-[#0E1015] border border-[#1F2937] rounded-xl text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                            <span className="text-[#C5A267] font-semibold">
                              #{entry.moodTag}
                            </span>
                            <span>{entry.date}</span>
                          </div>
                          <p className="text-white text-[11px] leading-relaxed">
                            {entry.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: NAFAS SADAR & THUMA'NINAH (BREATHING EXERCISE) */}
            {/* ========================================================= */}
            {activeTab === "breathing" && (
              <div className="space-y-6 animate-fadeIn text-center">
                
                <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-5 shadow-xl">
                  <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-[10px] font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                    Latihan Pernafasan Thuma'ninah (4-4-6-2)
                  </span>
                  <h4 className="text-base font-bold text-white font-serif">
                    Penyelarasan Irama Nafas & Dzikir Kalbu
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Kombinasi regulasi sistem saraf parasimpatis dengan dzikir pelapang dada untuk meredakan ketegangan fisik dan kepanikan secara instan.
                  </p>

                  {/* Breathing Pulse Circle Animation */}
                  <div className="my-8 relative flex items-center justify-center">
                    <div
                      className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                        isBreathingActive
                          ? breathingStepIndex === 0
                            ? "scale-115 border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20"
                            : breathingStepIndex === 1
                            ? "scale-110 border-[#C5A267] bg-[#C5A267]/20 shadow-[#C5A267]/30"
                            : breathingStepIndex === 2
                            ? "scale-90 border-cyan-400 bg-cyan-950/40 shadow-cyan-500/20"
                            : "scale-100 border-[#64748B] bg-[#181C26]"
                          : "border-[#252E3E] bg-[#0E1015]"
                      }`}
                    >
                      <span className="text-3xl font-bold font-mono text-white mb-1">
                        {isBreathingActive ? breathingTimer : "4-4-6"}
                      </span>
                      <span className="text-xs font-bold text-[#C5A267] px-2">
                        {isBreathingActive
                          ? TAZKIYAH_BREATHING_STEPS[breathingStepIndex].instruction
                          : "Siap Memulai?"}
                      </span>
                      {isBreathingActive && (
                        <span className="text-[10px] text-white/80 font-serif mt-1 italic">
                          {TAZKIYAH_BREATHING_STEPS[breathingStepIndex].arabicFocus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsBreathingActive(!isBreathingActive);
                        if (!isBreathingActive) {
                          setBreathingStepIndex(0);
                          setBreathingTimer(TAZKIYAH_BREATHING_STEPS[0].duration);
                          if (isSoundEnabled) soundSynth.playGentleChime();
                        }
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isBreathingActive
                          ? "bg-rose-500 hover:bg-rose-600 text-white"
                          : "bg-[#C5A267] hover:bg-[#D8B57B] text-black"
                      }`}
                    >
                      {isBreathingActive ? "Hentikan Latihan" : "Mulai Nafas Thuma'ninah"}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[#64748B] p-3 bg-[#0B0D12] rounded-xl border border-[#1F2937] text-left">
                  💡 <strong>Panduan Medis-Ruhani:</strong> Lakukan siklus 4-4-6-2 selama 2-3 menit saat merasa terburu-buru, cemas, atau sebelum memulai sesi konseling.
                </div>

                {/* Ambient Soundscape for Breathing */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[11px] font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5 px-1">
                    <Music className="w-3.5 h-3.5" />
                    <span>Latar Audio Pendamping Nafas</span>
                  </span>
                  <AmbientDzikirAudioPlayer />
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: PENGATURAN PENGINGAT (NOTIFICATION SETTINGS) */}
            {/* ========================================================= */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Ambient Audio Configuration Card */}
                <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-[#C5A267]" />
                        <span>Alunan Latar Dzikir & Murottal</span>
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Pemutar audio berulang otomatis (auto-looping) untuk menemani sesi dzikir.
                      </p>
                    </div>
                  </div>
                  <AmbientDzikirAudioPlayer />
                </div>

                <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">
                        Pengingat Hati Tazkiyah Otomatis
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Notifikasi lembut & kutipan penyemangat berkala saat menggunakan aplikasi.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsReminderEnabled(!isReminderEnabled)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isReminderEnabled
                          ? "bg-emerald-500 text-black shadow-xs shadow-emerald-500/30"
                          : "bg-[#181C26] text-[#64748B] border border-[#252E3E]"
                      }`}
                    >
                      {isReminderEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                      <span>{isReminderEnabled ? "Aktif" : "Mati"}</span>
                    </button>
                  </div>

                  {/* Interval selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#C5A267] uppercase tracking-wider mb-2">
                      Frekuensi Notifikasi Berkala:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { min: 1, label: "Setiap 1 Menit (Uji Coba Cepat)" },
                        { min: 3, label: "Setiap 3 Menit (Fokus Singkat)" },
                        { min: 5, label: "Setiap 5 Menit (Rekomendasi)" },
                        { min: 15, label: "Setiap 15 Menit (Selingan Kerja)" },
                      ].map((item) => (
                        <button
                          key={item.min}
                          onClick={() => setReminderIntervalMinutes(item.min)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                            reminderIntervalMinutes === item.min
                              ? "bg-[#181C26] border-[#C5A267] text-white font-bold"
                              : "bg-[#0E1015] border-[#252E3E] text-[#94A3B8] hover:bg-[#141720]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            {reminderIntervalMinutes === item.min && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A267]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound Chime Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1F2937]">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Suara Lembut Chime (528Hz)
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Harmoni penyejuk pikiran saat notifikasi muncul
                      </span>
                    </div>
                    <button
                      onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        isSoundEnabled ? "bg-[#C5A267]" : "bg-[#252E3E]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                          isSoundEnabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Test button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (isSoundEnabled) soundSynth.playGentleChime();
                        onOpenSpiritualModal(currentQuote);
                      }}
                      className="w-full py-2.5 bg-[#181C26] hover:bg-[#C5A267] text-white hover:text-black rounded-xl text-xs font-bold border border-[#252E3E] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#C5A267]" />
                      <span>Uji Coba Tampilan Modal Notifikasi Sekarang</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#0B0D12] border border-[#1F2937] rounded-xl text-[11px] text-[#94A3B8] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#C5A267] shrink-0 mt-0.5" />
                  <span>
                    Notifikasi dirancang lembut dan tidak mengganggu aktivitas konsultasi medis Anda. Anda dapat menutup atau menundanya kapan saja.
                  </span>
                </div>

              </div>
            )}

          </div>

          {/* Footer inside sidebar */}
          <div className="p-4 border-t border-[#1F2937] bg-[#0E1015] flex items-center justify-between text-xs">
            <span className="text-[#64748B] text-[11px]">
              LimoCity Therapy Spiritual Wellness
            </span>
            <button
              onClick={() => onOpenSpiritualModal(currentQuote)}
              className="text-[#C5A267] font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Hikmah Tazkiyah</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
