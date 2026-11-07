import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  Smile, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Share2, 
  Lock, 
  Tag, 
  Feather, 
  Wind, 
  Download, 
  Copy, 
  Check, 
  HelpCircle,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { soundSynth } from "../utils/audioChime";

export type SpiritualMoodTag = "tenteram" | "bersyukur" | "butuh_kekuatan" | "muhasabah" | "pasrah";

export interface DailyReflectionEntry {
  id: string;
  date: string;
  timestamp: string;
  moodTag: SpiritualMoodTag;
  dzikirTitle: string;
  dzikirCount: number;
  note: string;
  gratitudeNote?: string;
  sharedWithTherapist: boolean;
  tags?: string[];
  isPinned?: boolean;
}

const MOOD_CONFIG: Record<SpiritualMoodTag, {
  label: string;
  arabic: string;
  emoji: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  cardGlow: string;
  description: string;
}> = {
  tenteram: {
    label: "Tenteram (Sakinah)",
    arabic: "سَكِينَة",
    emoji: "🌸",
    badgeBg: "bg-emerald-950/40",
    badgeBorder: "border-emerald-500/40",
    textColor: "text-emerald-300",
    cardGlow: "hover:border-emerald-500/50",
    description: "Dada terasa sejuk, detak jantung teratur, batin hening bersama Allah.",
  },
  bersyukur: {
    label: "Bersyukur (Syukur)",
    arabic: "شُكْر",
    emoji: "🌿",
    badgeBg: "bg-teal-950/40",
    badgeBorder: "border-teal-500/40",
    textColor: "text-teal-300",
    cardGlow: "hover:border-teal-500/50",
    description: "Melihat begitu banyak nikmat Allah yang melimpah dan memeluk momen saat ini.",
  },
  butuh_kekuatan: {
    label: "Butuh Kekuatan (Sabr)",
    arabic: "صَبْر",
    emoji: "⚡",
    badgeBg: "bg-amber-950/40",
    badgeBorder: "border-amber-500/40",
    textColor: "text-amber-300",
    cardGlow: "hover:border-amber-500/50",
    description: "Sedang berjuang memikul ujian atau keletihan, memohon daya pertolongan Allah.",
  },
  muhasabah: {
    label: "Muhasabah & Taubat",
    arabic: "مُحَاسَبَة",
    emoji: "🪞",
    badgeBg: "bg-indigo-950/40",
    badgeBorder: "border-indigo-500/40",
    textColor: "text-indigo-300",
    cardGlow: "hover:border-indigo-500/50",
    description: "Merenungi kelemahan diri, memperbanyak istighfar, dan berniat memperbaiki esok.",
  },
  pasrah: {
    label: "Pasrah & Ridha (Tawakkul)",
    arabic: "تَوَكُّل",
    emoji: "🕊️",
    badgeBg: "bg-[#C5A267]/15",
    badgeBorder: "border-[#C5A267]/40",
    textColor: "text-[#F3E8D2]",
    cardGlow: "hover:border-[#C5A267]/60",
    description: "Menyerahkan kendali hasil masa depan sepenuhnya kepada Dzat Al-Wakil.",
  },
};

const COMMON_DZIKIR_OPTIONS = [
  "Doa Nabi Yunus (Pelepas Kegundahan - 33x)",
  "Istighfar & Taubat (100x)",
  "Tasbih & Tahmid Kalimah Tercinta (100x)",
  "Hauqalah (Laa Haula wa Laa Quwwata - 33x)",
  "Hasbi Rabbi Jalallah (33x)",
  "Benteng Perlindungan Bismillāhillażī (3x)",
  "Nafas Thuma'ninah 4-4-6 (Relaksasi Vagal)",
  "Dzikir Pagi / Petang Al-Ma'tsurat",
  "Tadabbur Ayat Al-Qur'an & Doa Kalbu",
  "Dzikir Bebas / Qiyamul Lail"
];

const REFLECTION_INSPIRATIONS = [
  "Apa perubahan rasa di dada Anda sebelum berdzikir vs sesudah berdzikir?",
  "Pikiran atau ketakutan apa yang berhasil Anda serahkan kepada Allah saat menahan nafas thuma'ninah?",
  "Satu nikmat kecil apa hari ini yang sebelumnya luput dari perhatian Anda?",
  "Jika beban hidup hari ini adalah sebuah pesan dari Allah, hikmah apa yang sedang Dia ajarkan?"
];

const INITIAL_REFLECTION_SEEDS: DailyReflectionEntry[] = [
  {
    id: "refl-01",
    date: "6 Nov 2026",
    timestamp: "14:15 WIB",
    moodTag: "tenteram",
    dzikirTitle: "Nafas Thuma'ninah 4-4-6 (Relaksasi Vagal)",
    dzikirCount: 4,
    note: "Setelah mempraktikkan nafas 4-4-6 selama 4 siklus sambil meresapi 'Subhanallah - Alhamdulillah - Astaghfirullah', rasa terburu-buru dan deg-degan karena tugas kerja langsung reda. Nafas menjadi lambat dan teratur.",
    gratitudeNote: "Alhamdulillah atas nikmat oksigen yang gratis dan detak jantung yang masih setia berdenyut.",
    sharedWithTherapist: true,
    tags: ["Anti-Panik", "Nafas446", "Ketenangan"],
    isPinned: true
  },
  {
    id: "refl-02",
    date: "5 Nov 2026",
    timestamp: "20:45 WIB",
    moodTag: "pasrah",
    dzikirTitle: "Doa Nabi Yunus (Pelepas Kegundahan - 33x)",
    dzikirCount: 33,
    note: "Membaca Laa ilaaha illaa Anta Subhaanaka inni kuntu minazh-zhaalimiin 33 kali di tempat hening. Menangis pelan karena menyadari selama ini terlalu memaksakan kehendak sendiri. Menyerahkan urusan esok pada Allah membuat kepala jauh lebih ringan.",
    gratitudeNote: "Bersyukur memiliki tempat bersujud saat seluruh dunia terasa menuntut.",
    sharedWithTherapist: true,
    tags: ["Tawakkal", "DoaNabiYunus", "LapangDada"]
  },
  {
    id: "refl-03",
    date: "4 Nov 2026",
    timestamp: "05:30 WIB",
    moodTag: "bersyukur",
    dzikirTitle: "Tasbih & Tahmid Kalimah Tercinta (100x)",
    dzikirCount: 100,
    note: "Subhanallahi wa bihamdihi, Subhanallahil Azhim setelah shalat Subuh berjamaah. Udara fajar begitu segar. Mulai hari ini dengan komitmen tidak membuka media sosial sebelum 1 jam pertama.",
    gratitudeNote: "Kesehatan keluarga dan sarapan hangat bersama orang tua.",
    sharedWithTherapist: false,
    tags: ["Fajar", "Syukur", "Mindfulness"]
  }
];

interface DailyReflectionJournalProps {
  patientName?: string;
  onOpenDzikirSidebar?: () => void;
  onShareToTherapistSession?: (entry: DailyReflectionEntry) => void;
}

export const DailyReflectionJournal: React.FC<DailyReflectionJournalProps> = ({
  patientName = "Ahmad Rizky Pratama",
  onOpenDzikirSidebar,
  onShareToTherapistSession,
}) => {
  // Load from local storage (synced with limocity_tazkiyah_journal)
  const [entries, setEntries] = useState<DailyReflectionEntry[]>(() => {
    const saved = localStorage.getItem("limocity_patient_reflection_journal");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    // Fallback: check if old format exists
    const legacySaved = localStorage.getItem("limocity_tazkiyah_journal");
    if (legacySaved) {
      try {
        const legacy = JSON.parse(legacySaved);
        if (Array.isArray(legacy) && legacy.length > 0) {
          const converted: DailyReflectionEntry[] = legacy.map((item: any, idx: number) => ({
            id: item.id || `refl-legacy-${idx}`,
            date: item.date || "22 Agt 2026",
            timestamp: "12:00 WIB",
            moodTag: (item.moodTag in MOOD_CONFIG) ? item.moodTag : "tenteram",
            dzikirTitle: "Sesi Dzikir Harian Tazkiyah",
            dzikirCount: item.dzikirDoneCount || 33,
            note: item.note || "",
            sharedWithTherapist: true,
            tags: ["RefleksiHarian"],
          }));
          return [...converted, ...INITIAL_REFLECTION_SEEDS.slice(1)];
        }
      } catch (e) {}
    }

    return INITIAL_REFLECTION_SEEDS;
  });

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("limocity_patient_reflection_journal", JSON.stringify(entries));

    // Also sync summary back to legacy limocity_tazkiyah_journal so sidebar sees them too
    const legacyCompatible = entries.map((e) => ({
      id: e.id,
      date: e.date,
      moodTag: e.moodTag,
      note: e.note,
      dzikirDoneCount: e.dzikirCount,
    }));
    localStorage.setItem("limocity_tazkiyah_journal", JSON.stringify(legacyCompatible));
  }, [entries]);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<SpiritualMoodTag>("tenteram");
  const [dzikirTitle, setDzikirTitle] = useState<string>(COMMON_DZIKIR_OPTIONS[0]);
  const [customDzikir, setCustomDzikir] = useState<string>("");
  const [dzikirCount, setDzikirCount] = useState<number>(33);
  const [noteContent, setNoteContent] = useState<string>("");
  const [gratitudeContent, setGratitudeContent] = useState<string>("");
  const [sharedWithTherapist, setSharedWithTherapist] = useState<boolean>(true);
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(["Ketenangan", "DzikirKalbu"]);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterMood, setFilterMood] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = entries.length;
    const sharedCount = entries.filter((e) => e.sharedWithTherapist).length;
    const moodCounts: Record<SpiritualMoodTag, number> = {
      tenteram: 0,
      bersyukur: 0,
      butuh_kekuatan: 0,
      muhasabah: 0,
      pasrah: 0,
    };
    let totalDzikirCount = 0;

    entries.forEach((e) => {
      if (e.moodTag in moodCounts) {
        moodCounts[e.moodTag]++;
      }
      totalDzikirCount += e.dzikirCount || 0;
    });

    // Find dominant mood
    let dominantMood: SpiritualMoodTag = "tenteram";
    let maxCount = 0;
    (Object.keys(moodCounts) as SpiritualMoodTag[]).forEach((m) => {
      if (moodCounts[m] > maxCount) {
        maxCount = moodCounts[m];
        dominantMood = m;
      }
    });

    return { total, sharedCount, dominantMood, totalDzikirCount };
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesMood = filterMood === "all" || entry.moodTag === filterMood;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        entry.note.toLowerCase().includes(q) ||
        entry.dzikirTitle.toLowerCase().includes(q) ||
        (entry.gratitudeNote && entry.gratitudeNote.toLowerCase().includes(q)) ||
        (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesMood && matchesSearch;
    });
  }, [entries, filterMood, searchQuery]);

  // Open Form for New Entry
  const handleOpenNewEntry = () => {
    setEditingEntryId(null);
    setSelectedMood("tenteram");
    setDzikirTitle(COMMON_DZIKIR_OPTIONS[0]);
    setCustomDzikir("");
    setDzikirCount(33);
    setNoteContent("");
    setGratitudeContent("");
    setSharedWithTherapist(true);
    setTags(["Ketenangan", "DzikirKalbu"]);
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const handleEditEntry = (entry: DailyReflectionEntry) => {
    setEditingEntryId(entry.id);
    setSelectedMood(entry.moodTag);
    if (COMMON_DZIKIR_OPTIONS.includes(entry.dzikirTitle)) {
      setDzikirTitle(entry.dzikirTitle);
      setCustomDzikir("");
    } else {
      setDzikirTitle("Kustom");
      setCustomDzikir(entry.dzikirTitle);
    }
    setDzikirCount(entry.dzikirCount);
    setNoteContent(entry.note);
    setGratitudeContent(entry.gratitudeNote || "");
    setSharedWithTherapist(entry.sharedWithTherapist);
    setTags(entry.tags || []);
    setIsFormOpen(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Add Tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle Form Submit
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const actualDzikir = dzikirTitle === "Kustom" && customDzikir.trim()
      ? customDzikir.trim()
      : dzikirTitle;

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    if (editingEntryId) {
      // Update existing
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntryId
            ? {
                ...entry,
                moodTag: selectedMood,
                dzikirTitle: actualDzikir,
                dzikirCount: dzikirCount,
                note: noteContent.trim(),
                gratitudeNote: gratitudeContent.trim() || undefined,
                sharedWithTherapist: sharedWithTherapist,
                tags: tags,
              }
            : entry
        )
      );
    } else {
      // Create new
      const newEntry: DailyReflectionEntry = {
        id: `refl-${Date.now()}`,
        date: dateStr,
        timestamp: timeStr,
        moodTag: selectedMood,
        dzikirTitle: actualDzikir,
        dzikirCount: dzikirCount,
        note: noteContent.trim(),
        gratitudeNote: gratitudeContent.trim() || undefined,
        sharedWithTherapist: sharedWithTherapist,
        tags: tags,
        isPinned: false,
      };

      setEntries((prev) => [newEntry, ...prev]);
    }

    // Play subtle bell
    soundSynth.playPeacefulBell();
    setIsFormOpen(false);
    setEditingEntryId(null);
  };

  // Delete Entry
  const handleDeleteEntry = (id: string) => {
    if (confirm("Hapus catatan refleksi ini? Tindakan ini tidak dapat dibatalkan.")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Toggle Pinned
  const handleTogglePin = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isPinned: !e.isPinned } : e))
    );
  };

  // Copy entry text
  const handleCopy = (entry: DailyReflectionEntry) => {
    const text = `[Refleksi Pasca Dzikir - ${entry.date} (${entry.timestamp})]\n` +
      `Amalan: ${entry.dzikirTitle} (${entry.dzikirCount}x)\n` +
      `Kondisi Hati: ${MOOD_CONFIG[entry.moodTag].label}\n\n` +
      `Catatan: ${entry.note}\n` +
      (entry.gratitudeNote ? `Syukur: ${entry.gratitudeNote}\n` : "") +
      `\n— Ditulis via LimoCity Therapy (${patientName})`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Daily Reflection Header & Insights */}
      <div className="bg-[#12151E] border border-[#252E3E] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A267]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#C5A267]" />
                <span>Jurnal Refleksi Harian (Pasca Dzikir)</span>
              </span>
              <span aria-hidden="true" className="text-[#475569]">·</span>
              <span className="text-[#94A3B8]">Tazkiyatun Nafs</span>
              <span aria-hidden="true" className="text-[#475569]">·</span>
              <span className="text-emerald-400 font-mono">Tersimpan di Perangkat (Lokal)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Ruang Hening Catatan Kalbu & Muhasabah
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Tuliskan kejernihan rasa, kelegaan dada, dan hikmah yang Allah hadirkan setelah Anda menuntaskan sesi dzikir atau latihan pernafasan thuma'ninah. Catatan ini tersimpan rapi di browser Anda dan dapat dibagikan kepada psikolog Anda saat sesi konsultasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenDzikirSidebar && (
              <button
                onClick={onOpenDzikirSidebar}
                className="bg-[#181C26] hover:bg-[#202738] border border-[#C5A267]/40 text-[#F3E8D2] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Wind className="w-4 h-4 text-[#C5A267]" />
                <span>Mulai Dzikir / Nafas Dahulu</span>
              </button>
            )}

            <button
              onClick={handleOpenNewEntry}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#C5A267]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              <span>+ Tulis Refleksi Baru</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip: Stats at a Glance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#1E2330]">
          <div className="p-3.5 bg-[#0E1015] rounded-2xl border border-[#1F2937]">
            <span className="text-[11px] text-[#94A3B8] block">Total Refleksi</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {stats.total}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">Catatan muhasabah</span>
          </div>

          <div className="p-3.5 bg-[#0E1015] rounded-2xl border border-[#1F2937]">
            <span className="text-[11px] text-[#94A3B8] block">Kondisi Hati Dominan</span>
            <span className="text-base sm:text-lg font-bold text-[#C5A267] flex items-center gap-1.5 mt-0.5">
              <span>{MOOD_CONFIG[stats.dominantMood].emoji}</span>
              <span className="truncate">{MOOD_CONFIG[stats.dominantMood].label.split(" ")[0]}</span>
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">Kecenderungan qalb</span>
          </div>

          <div className="p-3.5 bg-[#0E1015] rounded-2xl border border-[#1F2937]">
            <span className="text-[11px] text-[#94A3B8] block">Total Dzikir Terekam</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.totalDzikirCount.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">Hitungan tasbih</span>
          </div>

          <div className="p-3.5 bg-[#0E1015] rounded-2xl border border-[#1F2937]">
            <span className="text-[11px] text-[#94A3B8] block">Dibagikan ke Terapis</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {stats.sharedCount}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">Siap didiskusikan di EMR</span>
          </div>
        </div>
      </div>

      {/* Write / Edit Reflection Modal / Form Card */}
      {isFormOpen && (
        <div className="bg-[#141722] border-2 border-[#C5A267]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#252E3E]">
            <div className="flex items-center gap-2">
              <Feather className="w-5 h-5 text-[#C5A267]" />
              <h3 className="text-lg font-bold font-serif text-white">
                {editingEntryId ? "Sunting Catatan Refleksi" : "Tulis Refleksi Pasca Dzikir Baru"}
              </h3>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#1E2330] transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-6">
            
            {/* 1. Amalan Dzikir yang Baru Dituntaskan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span>Amalan / Dzikir yang Baru Dituntaskan:</span>
                </label>
                <select
                  value={dzikirTitle}
                  onChange={(e) => setDzikirTitle(e.target.value)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden transition-colors"
                >
                  {COMMON_DZIKIR_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#12151E] text-white">
                      {opt}
                    </option>
                  ))}
                  <option value="Kustom" className="bg-[#12151E] text-white">
                    + Amalan Lainnya (Tulis Manual)
                  </option>
                </select>

                {dzikirTitle === "Kustom" && (
                  <input
                    type="text"
                    value={customDzikir}
                    onChange={(e) => setCustomDzikir(e.target.value)}
                    placeholder="Contoh: Shalat Hajat 2 Rakaat & Istighfar..."
                    className="w-full mt-2 bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden"
                  />
                )}
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span>Hitungan / Siklus:</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={dzikirCount}
                  onChange={(e) => setDzikirCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden"
                />
              </div>
            </div>

            {/* 2. Suasana Hati / Kondisi Qalb Pasca Dzikir */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C5A267]" />
                <span>Kondisi Kalbu Pasca Dzikir:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(Object.keys(MOOD_CONFIG) as SpiritualMoodTag[]).map((moodKey) => {
                  const conf = MOOD_CONFIG[moodKey];
                  const isSelected = selectedMood === moodKey;
                  return (
                    <button
                      key={moodKey}
                      type="button"
                      onClick={() => setSelectedMood(moodKey)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? `${conf.badgeBg} ${conf.badgeBorder} shadow-lg ring-1 ring-[#C5A267]`
                          : "bg-[#0E1015] border-[#1F2937] text-[#94A3B8] hover:border-[#38445C]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{conf.emoji}</span>
                        <span className="text-[10px] font-serif text-[#C5A267] font-semibold">{conf.arabic}</span>
                      </div>
                      <span className={`text-xs font-bold block ${isSelected ? conf.textColor : "text-white"}`}>
                        {conf.label.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-[#64748B] line-clamp-1 block mt-0.5">
                        {conf.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Catatan Refleksi Utama */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span>Isi Refleksi & Muhasabah:</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const rand = REFLECTION_INSPIRATIONS[Math.floor(Math.random() * REFLECTION_INSPIRATIONS.length)];
                      setNoteContent((prev) => (prev ? `${prev}\n\n[Pemantik]: ${rand}` : `[Pemantik]: ${rand}\n`));
                    }}
                    className="text-[11px] text-[#C5A267] hover:text-[#D8B57B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Inspirasi Ide Menulis</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Bagikan apa yang Anda rasakan di dada saat melantunkan dzikir ini... Apakah pikiran Anda yang semula cemas kini terasa lebih lapang?"
                required
                className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-hidden leading-relaxed resize-y"
              />
            </div>

            {/* 4. Nikmat Spesifik yang Disyukuri (Gratitude Prompt) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Satu Nikmat Spesifik Hari Ini (Syukur Kalbu):</span>
              </label>
              <input
                type="text"
                value={gratitudeContent}
                onChange={(e) => setGratitudeContent(e.target.value)}
                placeholder="Contoh: Bersyukur atas kabar baik dari keluarga dan ketenangan saat shalat..."
                className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* 5. Tags & Sharing Options */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-[#1E2330]">
              
              <div className="md:col-span-7 space-y-2">
                <label className="text-xs font-bold text-[#94A3B8] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span>Label / Tagar Refleksi:</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-[#1C202E] border border-[#2B354A] text-xs text-[#CBD5E1] rounded-lg flex items-center gap-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-[#64748B] hover:text-rose-400 ml-1 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="+ Label (Enter)"
                      className="bg-[#0E1015] border border-[#252E3E] rounded-lg px-2 py-1 text-xs text-white w-28 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Share with therapist toggle */}
              <div className="md:col-span-5 bg-[#0E1015] p-3 rounded-2xl border border-[#252E3E] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Diskusikan dengan Terapis
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block">
                    Beri izin terapis membaca catatan ini pada sesi konseling.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={sharedWithTherapist}
                  onChange={(e) => setSharedWithTherapist(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A267] rounded cursor-pointer shrink-0"
                />
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2330]">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#252E3E] text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#C5A267]/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>{editingEntryId ? "Perbarui Refleksi" : "Simpan ke Jurnal Kalbu"}</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Filter, Search & Tab Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12151E] p-3 rounded-2xl border border-[#252E3E]">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari catatan refleksi, amalan dzikir, atau hikmah..."
            className="w-full bg-[#0E1015] border border-[#1F2937] focus:border-[#C5A267] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-hidden"
          />
        </div>

        {/* Mood Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterMood("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterMood === "all"
                ? "bg-[#C5A267] text-black font-bold shadow-xs"
                : "text-[#94A3B8] hover:text-white hover:bg-[#1A1F2C]"
            }`}
          >
            Semua ({entries.length})
          </button>

          {(Object.keys(MOOD_CONFIG) as SpiritualMoodTag[]).map((moodKey) => {
            const conf = MOOD_CONFIG[moodKey];
            const isSelected = filterMood === moodKey;
            const count = entries.filter((e) => e.moodTag === moodKey).length;
            if (count === 0 && !isSelected) return null;

            return (
              <button
                key={moodKey}
                onClick={() => setFilterMood(moodKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-[#C5A267] text-black font-bold shadow-xs"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1A1F2C]"
                }`}
              >
                <span>{conf.emoji}</span>
                <span>{conf.label.split(" ")[0]}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Entries List Cards */}
      {filteredEntries.length === 0 ? (
        <div className="bg-[#12151E] rounded-3xl p-10 border border-[#252E3E] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#181D29] border border-[#2E374A] text-[#C5A267] flex items-center justify-center mx-auto">
            <Feather className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white font-serif">
              Belum Ada Catatan Refleksi yang Cocok
            </h4>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              {searchQuery || filterMood !== "all"
                ? "Tidak menemukan catatan yang sesuai dengan kata kunci atau filter yang Anda pilih."
                : "Awali kebiasaan mencatat kondisi hati setelah melantunkan asma Allah agar jiwa senantiasa terjaga."}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleOpenNewEntry}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              + Tulis Refleksi Pertama Anda
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredEntries.map((entry) => {
            const mood = MOOD_CONFIG[entry.moodTag] || MOOD_CONFIG["tenteram"];
            return (
              <div
                key={entry.id}
                className={`bg-[#12151E] border border-[#252E3E] rounded-3xl p-6 sm:p-7 shadow-xl transition-all ${mood.cardGlow} space-y-4 relative group`}
              >
                {/* Card Header: Date, Mood Tag, Dzikir Practice Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2330] pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Mood Chip */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${mood.badgeBg} ${mood.badgeBorder} ${mood.textColor}`}>
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </span>

                    {/* Dzikir Tag */}
                    <span className="px-2.5 py-1 bg-[#181C26] border border-[#2B354A] rounded-full text-xs font-medium text-[#CBD5E1] flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-[#C5A267]" />
                      <span>{entry.dzikirTitle}</span>
                      <span className="font-mono text-[#C5A267] font-bold">({entry.dzikirCount}x)</span>
                    </span>

                    {/* Shared status */}
                    {entry.sharedWithTherapist ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-cyan-400" />
                        <span>Diskusikan di EMR</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#1C202C] border border-[#2E374A] text-[#94A3B8] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#64748B]" />
                        <span>Privat</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] self-end sm:self-auto font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span>{entry.date}</span>
                    <span className="text-[#475569]">·</span>
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>{entry.timestamp}</span>
                  </div>
                </div>

                {/* Card Body: Note Content */}
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed whitespace-pre-line font-normal">
                    {entry.note}
                  </p>

                  {/* Gratitude highlight if available */}
                  {entry.gratitudeNote && (
                    <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-teal-200">
                      <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-teal-300 block text-[11px] uppercase tracking-wider">
                          Syukur Spesifik Hari Ini:
                        </strong>
                        <span className="italic">{entry.gratitudeNote}</span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-medium text-[#94A3B8] hover:text-[#C5A267] transition-colors"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1E2330] text-xs">
                  <div className="text-[11px] text-[#64748B]">
                    Tersimpan lokal di browser • ID: {entry.id.slice(0, 10)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(entry)}
                      className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1C202C] rounded-lg transition-colors cursor-pointer"
                      title="Salin Teks Refleksi"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-2 text-[#94A3B8] hover:text-[#C5A267] hover:bg-[#1C202C] rounded-lg transition-colors cursor-pointer"
                      title="Sunting Catatan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-[#1C202C] rounded-lg transition-colors cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
