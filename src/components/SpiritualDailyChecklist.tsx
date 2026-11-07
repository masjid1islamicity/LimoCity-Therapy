import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Heart,
  Layers,
  Award,
  Share2,
  ExternalLink,
  ShieldCheck,
  Compass,
  Check,
  Zap,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { SunnahChecklistItem, SunnahCategory } from "../types";
import { INITIAL_SUNNAH_CHECKLIST } from "../data/sunnahChecklistData";
import { soundSynth } from "../utils/audioChime";

interface SpiritualDailyChecklistProps {
  onSelectDzikirToPractice?: (keyword: string) => void;
  isSoundEnabled?: boolean;
}

export const SpiritualDailyChecklist: React.FC<SpiritualDailyChecklistProps> = ({
  onSelectDzikirToPractice,
  isSoundEnabled = true,
}) => {
  // LocalStorage state key based on today's date
  const todayKey = new Date().toISOString().split("T")[0];

  const [checklist, setChecklist] = useState<SunnahChecklistItem[]>(() => {
    const saved = localStorage.getItem(`limocity_sunnah_checklist_${todayKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SUNNAH_CHECKLIST;
      }
    }
    return INITIAL_SUNNAH_CHECKLIST;
  });

  const [activeCategory, setActiveCategory] = useState<SunnahCategory>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Custom Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newSubtitle, setNewSubtitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<"dzikir" | "sholat_sunnah" | "tilawah_amal" | "malam">("dzikir");
  const [newTime, setNewTime] = useState<string>("");
  const [newVirtue, setNewVirtue] = useState<string>("");

  // Streak state
  const [streakDays, setStreakDays] = useState<number>(() => {
    const savedStreak = localStorage.getItem("limocity_sunnah_streak_count");
    return savedStreak ? parseInt(savedStreak, 10) : 3;
  });

  // Save checklist whenever modified
  useEffect(() => {
    localStorage.setItem(`limocity_sunnah_checklist_${todayKey}`, JSON.stringify(checklist));
  }, [checklist, todayKey]);

  // Calculate statistics
  const totalCount = checklist.length;
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle item completion
  const handleToggleItem = (id: string) => {
    const updated = checklist.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        return {
          ...item,
          completed: nextState,
          completedAt: nextState ? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : undefined,
        };
      }
      return item;
    });

    const targetItem = checklist.find((i) => i.id === id);
    const willBeCompleted = targetItem && !targetItem.completed;

    setChecklist(updated);

    if (willBeCompleted) {
      if (isSoundEnabled) {
        soundSynth.playTasbihClick();
      }

      // Check if this made all completed
      const newCompletedCount = updated.filter((i) => i.completed).length;
      if (newCompletedCount === updated.length && updated.length > 0) {
        if (isSoundEnabled) {
          soundSynth.playCompletionFanfare();
        }
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6, x: 0.8 },
            colors: ["#C5A267", "#10B981", "#F59E0B", "#FFFFFF"],
          });
        } catch (e) {}
      }
    }
  };

  // Reset checklist for today
  const handleResetChecklist = () => {
    if (window.confirm("Apakah Anda ingin mereset checklist amalan sunnah hari ini?")) {
      const resetList = checklist.map((item) => ({
        ...item,
        completed: false,
        completedAt: undefined,
      }));
      setChecklist(resetList);
      if (isSoundEnabled) {
        soundSynth.playGentleChime();
      }
    }
  };

  // Add custom sunnah item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: SunnahChecklistItem = {
      id: `custom-sunnah-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "Amalan sunnah istiqamah pribadi",
      category: newCategory,
      timeRecommendation: newTime.trim() || "Sesuai luang waktu harian",
      dalilReference: "Anjuran Sunnah & Istiqamah Kebaikan",
      virtue: newVirtue.trim() || "Menambah timbangan amal shalih dan mendekatkan diri kepada Allah.",
      targetCountText: "Harian",
      completed: false,
      isCustom: true,
    };

    setChecklist([newItem, ...checklist]);
    setNewTitle("");
    setNewSubtitle("");
    setNewTime("");
    setNewVirtue("");
    setIsAddModalOpen(false);

    if (isSoundEnabled) {
      soundSynth.playGentleChime();
    }
  };

  // Delete custom item
  const handleDeleteCustomItem = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  // Filter items based on category and completion status
  const filteredItems = checklist.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && item.completed) ||
      (filterStatus === "pending" && !item.completed);
    return matchCategory && matchStatus;
  });

  // Get motivational insight
  const getMotivationalMessage = () => {
    if (progressPercent === 100) return "Alhamdulillah! Seluruh amalan sunnah utama telah tertunai hari ini. Semoga Allah menerima istiqamah Anda.";
    if (progressPercent >= 70) return "Masya Allah, luar biasa! Sebentar lagi checklist sunnah harian Anda tuntas sempurna.";
    if (progressPercent >= 40) return "Langkah yang sangat berkah. Terus jaga ritme thuma'ninah dan kehadiran hati.";
    if (progressPercent > 0) return "Awal yang indah. Setiap satu sunnah yang dihidupkan adalah nur penyejuk kalbu.";
    return "Mulailah hari dengan Dzikir Pagi dan bismillah untuk membuka pintu keberkahan.";
  };

  return (
    <div className="space-y-4 animate-fadeIn text-[#E2E8F0]">
      
      {/* Overview Progress & Streak Card */}
      <div className="bg-gradient-to-br from-[#181C26] via-[#141720] to-[#0E1015] border border-[#C5A267]/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-serif flex items-center gap-1.5">
                <span>Checklist Sunnah Harian</span>
                <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[9px] font-mono px-1.5 py-0.2 rounded-md">
                  {completedCount}/{totalCount}
                </span>
              </h4>
              <p className="text-[10px] text-[#94A3B8]">
                Dzikir pagi/petang, sholat rawatib, & amalan thuma'ninah
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-800/40 text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streakDays} Hari</span>
            </div>
            <button
              onClick={handleResetChecklist}
              title="Reset Checklist Hari Ini"
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] text-[10px]">Pencapaian Hari Ini</span>
            <span className="font-bold text-[#C5A267] font-mono text-xs">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#0E1015] h-2 rounded-full overflow-hidden border border-[#252E3E]">
            <div
              className="bg-gradient-to-r from-[#93733E] via-[#C5A267] to-[#E6CA85] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Motivational Insight Note */}
        <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-start space-x-2 text-[10px] text-[#94A3B8]">
          <Heart className="w-3 h-3 text-[#C5A267] shrink-0 mt-0.5" />
          <span className="italic leading-snug">{getMotivationalMessage()}</span>
        </div>
      </div>

      {/* Category Tabs & Filter Row */}
      <div className="space-y-2">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "Semua" },
            { id: "dzikir", label: "Dzikir & Wirid" },
            { id: "sholat_sunnah", label: "Sholat Sunnah" },
            { id: "tilawah_amal", label: "Tilawah & Sedekah" },
            { id: "malam", label: "Qiyamul Lail" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SunnahCategory)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#C5A267] text-black shadow-xs"
                  : "bg-[#141720] hover:bg-[#1F2937] text-[#94A3B8] border border-[#252E3E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Status & Add Button */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center space-x-1 text-[#94A3B8]">
            <span>Filter:</span>
            {(["all", "pending", "completed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  filterStatus === st
                    ? "bg-[#252E3E] text-white font-bold"
                    : "hover:text-white"
                }`}
              >
                {st === "all" ? "Semua" : st === "pending" ? "Belum" : "Selesai"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-[#C5A267] hover:text-[#D8B57B] font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Sunnah</span>
          </button>
        </div>
      </div>

      {/* Checklist Items Container */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center bg-[#141720] border border-[#252E3E] rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#64748B] mx-auto opacity-50" />
            <p className="text-xs text-[#94A3B8]">Tidak ada amalan dalam kategori ini.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  item.completed
                    ? "bg-[#0E1713] border-[#10B981]/40 shadow-xs"
                    : "bg-[#141720] hover:bg-[#181C26] border-[#252E3E] hover:border-[#C5A267]/40"
                }`}
              >
                {/* Main Row */}
                <div className="p-3.5 flex items-start justify-between gap-3">
                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      item.completed
                        ? "bg-[#10B981] text-black shadow-md shadow-[#10B981]/20 scale-105"
                        : "bg-[#0E1015] border border-[#3E4A61] hover:border-[#C5A267] text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Title & Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5
                        className={`text-xs font-bold font-serif leading-snug transition-colors ${
                          item.completed ? "text-[#10B981] line-through opacity-90" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h5>
                      {item.targetCountText && (
                        <span className="text-[9px] bg-[#0E1015] border border-[#252E3E] text-[#C5A267] px-1.5 py-0.2 rounded-md font-mono">
                          {item.targetCountText}
                        </span>
                      )}
                      {item.completed && item.completedAt && (
                        <span className="text-[9px] text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.2 rounded-md font-mono">
                          ✓ {item.completedAt}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#C5A267]" />
                        {item.timeRecommendation}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {item.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomItem(item.id);
                        }}
                        className="p-1 text-[#64748B] hover:text-red-400 rounded-md transition-colors"
                        title="Hapus Amalan Kustom"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-1 text-[#94A3B8] hover:text-white rounded-md transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Dalil, Fadhilah & Quick Launch */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1F2937] bg-[#0E1015]/60 text-xs space-y-2.5 animate-fadeIn">
                    
                    {/* Fadhilah Batin */}
                    <div className="bg-[#141720] border border-[#252E3E] rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C5A267] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Fadhilah & Khasiat Batin:</span>
                      </div>
                      <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                        {item.virtue}
                      </p>
                    </div>

                    {/* Dalil / Hadits Reference */}
                    <div className="flex items-start gap-1.5 text-[10px] text-[#94A3B8]">
                      <BookOpen className="w-3 h-3 text-[#C5A267] shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-[#94A3B8]">Rujukan Dalil:</strong> {item.dalilReference}
                      </span>
                    </div>

                    {/* Action buttons (Practice / Connect) */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      {onSelectDzikirToPractice && (item.category === "dzikir" || item.id.includes("dzikir") || item.id.includes("sholawat")) && (
                        <button
                          type="button"
                          onClick={() => onSelectDzikirToPractice(item.title)}
                          className="px-2.5 py-1 bg-[#1C202C] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/30 hover:border-[#C5A267] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-[#C5A267]" />
                          <span>Buka di Tasbih Digital</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleItem(item.id)}
                        className={`ml-auto px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          item.completed
                            ? "bg-[#1F2937] hover:bg-[#2E374A] text-[#94A3B8]"
                            : "bg-[#10B981] hover:bg-[#059669] text-black shadow-xs font-bold"
                        }`}
                      >
                        {item.completed ? "Batalkan Checklist" : "Tandai Sudah Dikerjakan"}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Tambah Amalan Sunnah Kustom */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#141720] border border-[#C5A267]/40 rounded-2xl max-w-sm w-full p-5 text-[#E2E8F0] shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#252E3E] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267]">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white font-serif">
                  Tambah Amalan Sunnah
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#94A3B8] hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1 font-medium">Nama Amalan Sunnah *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Puasa Sunnah Senin / Sholat Isyraq"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1 font-medium">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white outline-hidden"
                >
                  <option value="dzikir">Dzikir & Wirid</option>
                  <option value="sholat_sunnah">Sholat Sunnah</option>
                  <option value="tilawah_amal">Tilawah & Amal</option>
                  <option value="malam">Qiyamul Lail / Malam</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1 font-medium">Waktu Pengerjaan</label>
                <input
                  type="text"
                  placeholder="Misal: 15 menit setelah terbit fajar"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1 font-medium">Fadhilah / Niat Hati</label>
                <textarea
                  rows={2}
                  placeholder="Hikmah atau motivasi spiritual..."
                  value={newVirtue}
                  onChange={(e) => setNewVirtue(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3 py-2 text-white outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#2E374A] text-[#94A3B8] hover:text-white rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs"
                >
                  Simpan Amalan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
