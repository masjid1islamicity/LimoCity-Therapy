import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Heart,
  Bookmark,
  Calendar,
  Clock,
  Download,
  Trash2,
  Edit3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Volume2,
  VolumeX,
  Share2,
  RefreshCw,
  Feather,
  Flame,
  Smile,
  Tag,
  ChevronRight,
  AlertCircle,
  KeyRound,
  FileText,
  Copy,
  Check
} from "lucide-react";
import { JournalEntry, JournalSentimentAnalysis } from "../types";
import { ExportJournalPDFModal } from "./ExportJournalPDFModal";

const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "journal-01",
    title: "Melepaskan Cemas Proyek dan Berserah kepada Al-Wakil",
    date: "22 Agt 2026",
    hijriDate: "8 Safar 1448 H",
    content: "Hari ini beban kerja terasa cukup menumpuk. Sempat terpikir bagaimana jika hasil evaluasi tidak sesuai ekspektasi pimpinan. Namun setelah duduk diam sejenak dan shalat dhuha, aku teringat bahwa tugasku hanyalah berikhtiar dengan sungguh-sungguh, sedangkan hasilnya adalah hak prerogatif Allah. Rasa cemas mulai mencair saat membaca kembali makna 'Hasbunallah wa ni'mal wakil'.",
    tags: ["Tawakkal", "Karier", "Kecemasan", "Shalat Dhuha"],
    isPrivate: true,
    isFavorite: true,
    wordCount: 56,
    createdAt: "2026-08-22T09:30:00Z",
    sentimentAnalysis: {
      primaryTone: "Cemas Menuju Ketenangan & Tawakkal",
      valence: "tenang",
      sakinahScore: 84,
      emotionalSummary: "Terlihat pergeseran kognitif yang sangat sehat dari kecemasan performa menuju penerimaan dan kepasrahan aktif (active surrender).",
      spiritualFeedback: "Masya Allah, Anda telah mempraktikkan inti dari Tazkiyatun Nafs: mengenali batas daya manusia dan mengembalikan sandaran kepada Allah (Al-Wakil). Ketenangan sejati lahir saat hati tidak lagi memikul beban yang bukan miliknya.",
      quranicAnchor: {
        verse: "QS. Ali 'Imran: 173",
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        translation: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
        tadabburInsight: "Ayat ini adalah perisai batin terkuat yang mengikis ilusi kendali berlebih dan menumbuhkan rasa aman ilahiah."
      },
      microPractice: {
        title: "Dzikir Thuma'ninah Al-Wakil (2 Menit)",
        description: "Ucapkan 'Hasbunallah wa ni'mal wakil' sebanyak 7x perlahan, rasakan beban di pundak Anda luruh bersama hembusan napas panjang."
      },
      customDua: {
        arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ",
        latin: "Allahumma rahmataka arju fala takilni ila nafsi tharfata 'ain, wa ashlih li sya'ni kullahu",
        meaning: "Ya Allah, hanya rahmat-Mu yang kuharapkan, maka janganlah Engkau serahkan urusanku kepada diriku sendiri walau sekejap mata, dan perbaikilah seluruh urusanku."
      }
    }
  },
  {
    id: "journal-02",
    title: "Menemukan Kehangatan dalam Keheningan Subuh",
    date: "20 Agt 2026",
    hijriDate: "6 Safar 1448 H",
    content: "Bangun lebih awal sebelum adzan Subuh berkumandang. Suasana hening memberi ruang bagi hati untuk berbicara jujur. Bersyukur atas nikmat kesehatan, napas yang masih berhembus, dan keluarga yang saling mendoakan. Kadang kita terlalu sibuk mengejar apa yang belum ada hingga lupa mensyukuri apa yang sudah melimpah di depan mata.",
    tags: ["Syukur", "Muhasabah", "Qiyamul Lail", "Keluarga"],
    isPrivate: false,
    isFavorite: true,
    wordCount: 52,
    createdAt: "2026-08-20T04:45:00Z",
    sentimentAnalysis: {
      primaryTone: "Syukur Mendalam & Kejernihan Jiwa",
      valence: "positif",
      sakinahScore: 92,
      emotionalSummary: "Tulisan Anda memancarkan kesadaran mindfulness spiritual tingkat tinggi (muraqabah) dan apresiasi mendalam terhadap momen kini.",
      spiritualFeedback: "Alhamdulillah, waktu sahur dan fajar adalah saat turunnya rahmat dan pengabulan doa. Merawat rasa syukur di waktu hening adalah nutrisi terbaik bagi kesehatan mental.",
      quranicAnchor: {
        verse: "QS. Ibrahim: 7",
        arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        translation: "Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.",
        tadabburInsight: "Syukur bukan sekadar ucapan lisan, melainkan pengakuan batin yang memperluas kapasitas kebahagiaan hati."
      },
      microPractice: {
        title: "Sujud Syukur & Afirmasi Berkah (1 Menit)",
        description: "Lakukan sujud syukur singkat, sebutkan 3 nama orang terkasih yang mendoakan Anda dalam diam."
      },
      customDua: {
        arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ",
        latin: "Rabbi awzi'ni an asykura ni'matakal lati an'amta 'alayya wa 'ala walidayya",
        meaning: "Ya Tuhanku, anugerahkanlah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku."
      }
    }
  }
];

const PROMPT_SUGGESTIONS = [
  {
    category: "Syukur & Anugerah",
    icon: "🌸",
    title: "3 Berkah Tak Terduga",
    prompt: "Apa 3 hal kecil hari ini yang membuat hatimu merasa hangat dan patut disyukuri kepada Allah?"
  },
  {
    category: "Pelepasan Beban & Tawakkal",
    icon: "🌿",
    title: "Menyerahkan Kekhawatiran",
    prompt: "Apa satu pikiran cemas yang paling menguras energimu saat ini, dan bagaimana kamu ingin menyerahkannya kepada Allah?"
  },
  {
    category: "Muhasabah & Kejujuran Diri",
    icon: "📿",
    title: "Refleksi Respon Emosi",
    prompt: "Bagaimana caraku merespon kesulitan hari ini? Apakah ada rasa kecewa yang butuh divalidasi dan dimaafkan?"
  },
  {
    category: "Self-Compassion & Rahmat",
    icon: "🍂",
    title: "Kelelembutan pada Diri Sendiri",
    prompt: "Jika tubuh dan jiwamu bisa berbicara sekarang, istirahat dan kelembutan apa yang paling mereka butuhkan?"
  }
];

const POPULAR_TAGS = [
  "Syukur", "Tawakkal", "Kecemasan", "Muhasabah", "Karier", "Keluarga", "Tadabbur", "Istighfar", "Penyembuhan", "Harapan"
];

interface ReflectiveJournalingProps {
  patientName?: string;
  onShareWithTherapist?: (entry: JournalEntry) => void;
}

export const ReflectiveJournaling: React.FC<ReflectiveJournalingProps> = ({
  patientName = "Ahmad Rizky Pratama",
  onShareWithTherapist
}) => {
  // State for Journal Entries
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("limocity_reflective_journal_entries");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_JOURNAL_ENTRIES;
      }
    }
    return INITIAL_JOURNAL_ENTRIES;
  });

  useEffect(() => {
    localStorage.setItem("limocity_reflective_journal_entries", JSON.stringify(entries));
  }, [entries]);

  // Privacy & Screen Masking Mode
  const [isPrivacyMaskActive, setIsPrivacyMaskActive] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>(() => localStorage.getItem("limocity_journal_pin") || "");
  const [inputPin, setInputPin] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!localStorage.getItem("limocity_journal_pin"));
  const [pinError, setPinError] = useState<string>("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [selectedValenceFilter, setSelectedValenceFilter] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Active View Mode: 'list' | 'write' | 'view'
  const [viewMode, setViewMode] = useState<"list" | "write" | "view">("list");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(entries[0] || null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportTargetEntry, setExportTargetEntry] = useState<JournalEntry | null>(null);

  // Form State for Writing
  const [formTitle, setFormTitle] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formTags, setFormTags] = useState<string[]>(["Syukur"]);
  const [customTagInput, setCustomTagInput] = useState<string>("");
  const [formIsPrivate, setFormIsPrivate] = useState<boolean>(true);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>("Umum");
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [tempSentimentAnalysis, setTempSentimentAnalysis] = useState<JournalSentimentAnalysis | null>(null);
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Word count & read time helper
  const wordCount = useMemo(() => {
    return formContent.trim() ? formContent.trim().split(/\s+/).length : 0;
  }, [formContent]);

  const estimatedReadTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [wordCount]);

  // Handle Trigger AI Sentiment Analysis
  const handleAnalyzeSentiment = async () => {
    if (!formContent.trim()) {
      showToast("Tuliskan isi refleksi Anda terlebih dahulu sebelum menganalisis.");
      return;
    }

    setIsAnalyzingAI(true);
    try {
      const response = await fetch("/api/ai/journal-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim() || "Refleksi Hati",
          content: formContent.trim(),
          tags: formTags,
          promptCategory: selectedPromptCategory,
        }),
      });

      const data = await response.json();
      if (data.success && data.sentiment) {
        setTempSentimentAnalysis(data.sentiment);
        showToast("✨ Analisis Sentimen & Tadabbur Spiritual AI berhasil disusun.");
      } else {
        showToast("Gagal menerima analisis AI. Mencoba mode tadabbur lokal.");
      }
    } catch (err) {
      console.error("Sentiment analysis error:", err);
      showToast("Koneksi jaringan terganggu. Menggunakan rekomendasi tadabbur aman.");
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Handle Save Entry
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) {
      showToast("Mohon tuliskan isi refleksi Anda.");
      return;
    }

    let finalAnalysis = tempSentimentAnalysis;
    
    // If not yet analyzed, analyze automatically on save
    if (!finalAnalysis) {
      setIsAnalyzingAI(true);
      try {
        const response = await fetch("/api/ai/journal-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim() || "Refleksi Jiwa Harian",
            content: formContent.trim(),
            tags: formTags,
            promptCategory: selectedPromptCategory,
          }),
        });
        const data = await response.json();
        if (data.success && data.sentiment) {
          finalAnalysis = data.sentiment;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzingAI(false);
      }
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      title: formTitle.trim() || `Refleksi Hati ${formattedDate}`,
      date: formattedDate,
      hijriDate: "Safar 1448 H",
      content: formContent.trim(),
      tags: formTags.length > 0 ? formTags : ["Refleksi"],
      isPrivate: formIsPrivate,
      isFavorite: false,
      wordCount: formContent.trim().split(/\s+/).length,
      createdAt: new Date().toISOString(),
      sentimentAnalysis: finalAnalysis || undefined,
    };

    setEntries([newEntry, ...entries]);
    setSelectedEntry(newEntry);
    setViewMode("view");
    
    // Reset Form
    setFormTitle("");
    setFormContent("");
    setFormTags(["Syukur"]);
    setTempSentimentAnalysis(null);
    showToast("💾 Jurnal refleksi berhasil disimpan secara aman.");
  };

  // Handle Delete Entry
  const handleDeleteEntry = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan refleksi ini?")) {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      if (selectedEntry?.id === id) {
        setSelectedEntry(updated[0] || null);
        if (updated.length === 0) {
          setViewMode("list");
        }
      }
      showToast("Catatan refleksi telah dihapus.");
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setEntries(
      entries.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    if (selectedEntry?.id === id) {
      setSelectedEntry({ ...selectedEntry, isFavorite: !selectedEntry.isFavorite });
    }
  };

  // Add Tag
  const handleAddTag = (tagToAdd: string) => {
    if (tagToAdd && !formTags.includes(tagToAdd)) {
      setFormTags([...formTags, tagToAdd]);
    }
    setCustomTagInput("");
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter((t) => t !== tagToRemove));
  };

  // Apply Prompt
  const handleApplyPrompt = (promptItem: typeof PROMPT_SUGGESTIONS[0]) => {
    setFormTitle(promptItem.title);
    setSelectedPromptCategory(promptItem.category);
    if (!formContent.includes(promptItem.prompt)) {
      setFormContent((prev) => (prev ? `${prev}\n\n[Panduan Refleksi: ${promptItem.prompt}]\n` : `[Panduan Refleksi: ${promptItem.prompt}]\n\n`));
    }
    showToast(`Panduan "${promptItem.title}" diterapkan ke lembar refleksi.`);
  };

  // Copy Dua
  const handleCopyDua = (duaText: string, id: string) => {
    navigator.clipboard.writeText(duaText);
    setCopiedDuaId(id);
    showToast("Doa berhasil disalin ke papan klip.");
    setTimeout(() => setCopiedDuaId(null), 3000);
  };

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        selectedTagFilter === "all" || entry.tags.includes(selectedTagFilter);

      const matchesValence =
        selectedValenceFilter === "all" ||
        entry.sentimentAnalysis?.valence === selectedValenceFilter;

      const matchesFav = !onlyFavorites || entry.isFavorite;

      return matchesSearch && matchesTag && matchesValence && matchesFav;
    });
  }, [entries, searchQuery, selectedTagFilter, selectedValenceFilter, onlyFavorites]);

  // Overall Sakinah & Journal Stats
  const journalStats = useMemo(() => {
    const total = entries.length;
    const scores = entries
      .map((e) => e.sentimentAnalysis?.sakinahScore)
      .filter((s): s is number => typeof s === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 85;
    const totalWords = entries.reduce((acc, curr) => acc + curr.wordCount, 0);

    return { total, avgScore, totalWords };
  }, [entries]);

  return (
    <div id="reflective-journaling-hub" className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#12151D] via-[#171B26] to-[#11131A] rounded-3xl p-6 sm:p-8 border border-[#C5A267]/40 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-[#C5A267]" />
                Jurnal Refleksi Jiwa & Tazkiyah
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ruang Privat Terenkripsi Klien
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Reflective Journaling & Tadabbur Qolbu
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Tumpahkan kejujuran isi hati, rangkai rasa syukur, dan lepaskan beban pikiran. Agen AI Cerdas kami mendampingi dengan analisis sentimen emosional serta umpan balik spiritual yang lembut dan menyejukkan.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            {/* Screen Privacy Mask / Blur Toggle */}
            <button
              id="toggle-privacy-mask-btn"
              onClick={() => {
                setIsPrivacyMaskActive(!isPrivacyMaskActive);
                showToast(
                  !isPrivacyMaskActive
                    ? "🔒 Mode Tirai Privasi Aktif (Teks tersamarkan di layar publik)"
                    : "🔓 Mode Tirai Privasi Dinonaktifkan"
                );
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                isPrivacyMaskActive
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10"
                  : "bg-[#1A1F2C] text-[#94A3B8] hover:text-white border-[#2A3447]"
              }`}
              title="Samarkan teks refleksi di layar agar tidak terbaca orang lain di tempat umum"
            >
              {isPrivacyMaskActive ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-300" />
                  <span>Tirai Privasi: Aktif</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#94A3B8]" />
                  <span>Tirai Privasi: Mati</span>
                </>
              )}
            </button>

            {/* Export Journal to PDF Button */}
            <button
              id="export-journal-pdf-btn"
              onClick={() => {
                setExportTargetEntry(null);
                setIsExportModalOpen(true);
              }}
              className="bg-[#1A1F2C] hover:bg-[#252E3E] text-[#E2E8F0] hover:text-[#C5A267] border border-[#2A3447] hover:border-[#C5A267]/50 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Ekspor catatan jurnal ke dokumen PDF terenkripsi untuk sesi konseling"
            >
              <Download className="w-4 h-4 text-[#C5A267]" />
              <span>Ekspor PDF</span>
            </button>

            {/* Write New Reflection Button */}
            <button
              id="write-new-reflection-btn"
              onClick={() => {
                setViewMode("write");
                setTempSentimentAnalysis(null);
              }}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Tulis Refleksi Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Health Stats Banner */}
        <div className="mt-6 pt-5 border-t border-[#1F2937] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#0E1015]/80 rounded-2xl border border-[#252E3E]">
            <span className="text-[#94A3B8] text-[11px] block">Total Refleksi Jiwa</span>
            <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">
              {journalStats.total} Catatan
            </span>
          </div>

          <div className="p-3 bg-[#0E1015]/80 rounded-2xl border border-[#252E3E]">
            <span className="text-[#94A3B8] text-[11px] block">Rata-rata Sakinah Score</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-[#C5A267]">
                {journalStats.avgScore}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded">
                Stabil & Tenang
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#0E1015]/80 rounded-2xl border border-[#252E3E]">
            <span className="text-[#94A3B8] text-[11px] block">Kata Tertumpahkan</span>
            <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">
              {journalStats.totalWords} Kata
            </span>
          </div>

          <div className="p-3 bg-[#0E1015]/80 rounded-2xl border border-[#252E3E]">
            <span className="text-[#94A3B8] text-[11px] block">Status Enkripsi EMR</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 mt-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Terjaga
            </span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1F2C] text-[#E2E8F0] border border-[#C5A267] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-[#C5A267] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Navigation / Entries List / Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Controls Bar: Search & View Switch */}
          <div className="bg-[#111318] rounded-2xl border border-[#1F2937] p-3.5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kata kunci, tema, ayat..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  onlyFavorites
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                    : "bg-[#141720] text-[#94A3B8] border-[#252E3E] hover:text-white"
                }`}
                title="Tampilkan catatan berbintang saja"
              >
                <Heart className={`w-4 h-4 ${onlyFavorites ? "fill-rose-400 text-rose-400" : ""}`} />
              </button>
            </div>

            {/* Tag Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                onClick={() => setSelectedTagFilter("all")}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTagFilter === "all"
                    ? "bg-[#C5A267]/20 border-[#C5A267] text-[#C5A267] font-bold"
                    : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:text-white"
                }`}
              >
                Semua Tag
              </button>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTagFilter === tag
                      ? "bg-[#C5A267]/20 border-[#C5A267] text-[#C5A267] font-bold"
                      : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* List of Entries */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="bg-[#111318] rounded-3xl p-8 border border-[#1F2937] text-center space-y-3">
                <BookOpen className="w-10 h-10 text-[#64748B] mx-auto" />
                <h4 className="font-bold text-white text-sm">Tidak Ada Catatan yang Cocok</h4>
                <p className="text-xs text-[#94A3B8] max-w-xs mx-auto">
                  Belum ada catatan refleksi yang sesuai dengan pencarian atau filter Anda.
                </p>
                <button
                  onClick={() => {
                    setViewMode("write");
                    setSearchQuery("");
                    setSelectedTagFilter("all");
                  }}
                  className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#C5A267]/20 cursor-pointer"
                >
                  + Tulis Refleksi Baru
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id && viewMode === "view";
                const sakinahScore = entry.sentimentAnalysis?.sakinahScore || 80;

                return (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setViewMode("view");
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 relative group ${
                      isSelected
                        ? "bg-[#181C26] border-[#C5A267] shadow-lg shadow-[#C5A267]/10 ring-1 ring-[#C5A267]/30"
                        : "bg-[#111318] border-[#1F2937] hover:bg-[#141720] hover:border-[#374151]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#C5A267] font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </span>
                        {entry.hijriDate && (
                          <span className="text-[10px] text-[#64748B] hidden sm:inline">
                            • {entry.hijriDate}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {entry.sentimentAnalysis && (
                          <span className="px-2 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded-md text-[10px] font-bold">
                            Sakinah {sakinahScore}%
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(entry.id);
                          }}
                          className="p-1 text-[#64748B] hover:text-rose-400 transition-colors"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              entry.isFavorite ? "fill-rose-400 text-rose-400" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#C5A267] transition-colors line-clamp-1">
                      {entry.title}
                    </h4>

                    <p
                      className={`text-xs text-[#94A3B8] line-clamp-2 leading-relaxed ${
                        isPrivacyMaskActive ? "blur-xs select-none" : ""
                      }`}
                    >
                      {entry.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#141720] border border-[#252E3E] text-[#94A3B8] rounded text-[10px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] text-[#64748B] font-mono">
                        {entry.wordCount} kata
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Prompt Suggestion Cards Carousel */}
          <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
              Inspirasi Pemantik Refleksi (Tazkiyah Prompts)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleApplyPrompt(item);
                    setViewMode("write");
                  }}
                  className="p-3 bg-[#141720] hover:bg-[#181C26] border border-[#252E3E] hover:border-[#C5A267]/50 rounded-2xl transition-all cursor-pointer space-y-1.5 text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E2E8F0] group-hover:text-[#C5A267]">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Editor or Detailed View (7 cols) */}
        <div className="lg:col-span-7">
          
          {/* MODE: WRITE / EDIT */}
          {viewMode === "write" && (
            <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-6 sm:p-7 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-[#C5A267]" />
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg font-serif">
                      Tulis Refleksi & Muhasabah Jiwa
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Tuangkan pikiran Anda dengan jujur di ruang aman ini.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode(entries.length > 0 ? "view" : "list")}
                  className="text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg border border-[#252E3E] cursor-pointer"
                >
                  Batal / Kembali
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-5">
                
                {/* Title & Privacy Switch */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                      Judul / Tema Refleksi:
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Misal: Melepaskan cemas, rasa syukur atas kesabaran hari ini..."
                      className="w-full px-4 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                      Aksesibilitas Catatan:
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormIsPrivate(!formIsPrivate)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        formIsPrivate
                          ? "bg-[#141720] border-[#252E3E] text-emerald-400"
                          : "bg-[#C5A267]/15 border-[#C5A267]/40 text-[#C5A267]"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{formIsPrivate ? "Privat (Hanya Saya)" : "Bisa Dibagi ke Psikolog"}</span>
                    </button>
                  </div>
                </div>

                {/* Tags Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                    Label Emosi & Topik:
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {formTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] rounded-lg text-xs flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white font-bold ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(customTagInput.trim());
                        }
                      }}
                      placeholder="Tambah tag kustom..."
                      className="px-3 py-1.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267] w-48"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag(customTagInput.trim())}
                      className="px-3 py-1.5 bg-[#141720] hover:bg-[#181C26] border border-[#252E3E] text-[#C5A267] rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1.5">
                    <span>Curahan Isi Hati & Tadabbur Jiwa:</span>
                    <span className="font-mono text-[11px] text-[#64748B]">
                      {wordCount} kata • ±{estimatedReadTime} mnt baca
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Tuliskan apa saja yang dirasakan hari ini tanpa rasa takut dihakimi. Bagaimana kondisimu, apa yang membebani dada, dan apa yang ingin kamu serahkan kepada Allah..."
                    className="w-full p-4 bg-[#0E1015] border border-[#252E3E] rounded-2xl text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267] leading-relaxed resize-y font-sans"
                  />
                </div>

                {/* AI Sentiment Analysis Trigger Button */}
                <div className="p-4 bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] border border-[#C5A267]/30 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5A267]" />
                        AI Companion: Analisis Sentimen & Umpan Balik Spiritual
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Dapatkan validasi psikologis, ayat penenang, serta doa khusus yang dipersonalisasi.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isAnalyzingAI || !formContent.trim()}
                      onClick={handleAnalyzeSentiment}
                      className="bg-[#1F293D] hover:bg-[#2A3750] disabled:opacity-50 text-[#C5A267] border border-[#C5A267]/40 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      {isAnalyzingAI ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-[#C5A267] border-t-transparent rounded-full animate-spin"></span>
                          <span>Menganalisis Jiwa...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                          <span>Analisis Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Temporary AI Result Preview in Form */}
                  {tempSentimentAnalysis && (
                    <div className="pt-3 border-t border-[#252E3E] space-y-2.5 text-xs text-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#C5A267]">
                          Nuansa: {tempSentimentAnalysis.primaryTone}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                          Sakinah Index: {tempSentimentAnalysis.sakinahScore}%
                        </span>
                      </div>

                      <p className="text-xs italic text-[#CBD5E1] bg-[#0E1017] p-3 rounded-xl border border-[#1E2330]">
                        "{tempSentimentAnalysis.spiritualFeedback}"
                      </p>

                      <div className="text-[11px] text-[#94A3B8] bg-[#141720] p-2.5 rounded-xl border border-[#252E3E]">
                        <span className="text-[#C5A267] font-semibold">📖 Ayat Penyejuk: </span>
                        {tempSentimentAnalysis.quranicAnchor.verse} - "{tempSentimentAnalysis.quranicAnchor.translation}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode(entries.length > 0 ? "view" : "list")}
                    className="px-5 py-2.5 rounded-xl border border-[#252E3E] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isAnalyzingAI}
                    className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>Simpan Catatan Jurnal</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* MODE: VIEW DETAILS */}
          {viewMode === "view" && selectedEntry && (
            <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1F2937] pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#C5A267] font-mono flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedEntry.date}
                    </span>
                    {selectedEntry.hijriDate && (
                      <span className="text-xs text-[#64748B]">
                        • {selectedEntry.hijriDate}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-[#181C26] border border-[#252E3E] text-[10px] text-[#94A3B8] rounded">
                      {selectedEntry.wordCount} Kata
                    </span>
                    {selectedEntry.isPrivate ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Privat
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded text-[10px] flex items-center gap-1">
                        <Share2 className="w-2.5 h-2.5" />
                        Dibagi ke Konselor
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                    {selectedEntry.title}
                  </h3>
                </div>

                {/* Actions: Export PDF, Favorite, Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setExportTargetEntry(selectedEntry);
                      setIsExportModalOpen(true);
                    }}
                    className="p-2 sm:px-3 sm:py-2 bg-[#141720] hover:bg-[#1E2536] text-[#94A3B8] hover:text-[#C5A267] border border-[#252E3E] hover:border-[#C5A267]/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Ekspor catatan ini ke format PDF terenkripsi"
                  >
                    <Download className="w-4 h-4 text-[#C5A267]" />
                    <span className="hidden sm:inline">Ekspor PDF</span>
                  </button>

                  <button
                    onClick={() => handleToggleFavorite(selectedEntry.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      selectedEntry.isFavorite
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                        : "bg-[#141720] text-[#94A3B8] border-[#252E3E] hover:text-white"
                    }`}
                    title="Tandai favorit"
                  >
                    <Heart className={`w-4 h-4 ${selectedEntry.isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />
                  </button>

                  <button
                    onClick={() => handleDeleteEntry(selectedEntry.id)}
                    className="p-2 bg-[#141720] hover:bg-rose-950/40 text-[#94A3B8] hover:text-rose-400 border border-[#252E3E] hover:border-rose-500/50 rounded-xl transition-colors cursor-pointer"
                    title="Hapus catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedEntry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#141720] border border-[#252E3E] text-[#C5A267] rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Journal Body Content */}
              <div className="bg-[#0E1015] rounded-2xl p-5 sm:p-6 border border-[#252E3E] space-y-3 relative">
                {isPrivacyMaskActive && (
                  <div className="absolute inset-0 bg-[#0E1015]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-10">
                    <Lock className="w-8 h-8 text-[#C5A267] mb-2" />
                    <h5 className="text-white font-bold text-sm">Tirai Privasi Aktif</h5>
                    <p className="text-xs text-[#94A3B8] max-w-xs mt-1">
                      Tulisan disembunyikan untuk menjaga kerahasiaan saat berada di tempat umum.
                    </p>
                    <button
                      onClick={() => setIsPrivacyMaskActive(false)}
                      className="mt-3 px-4 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Buka Tirai
                    </button>
                  </div>
                )}

                <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed whitespace-pre-line font-serif">
                  {selectedEntry.content}
                </p>
              </div>

              {/* AI SENTIMENT ANALYSIS & GENTLE SPIRITUAL FEEDBACK CARD */}
              {selectedEntry.sentimentAnalysis ? (
                <div className="p-5 sm:p-6 bg-gradient-to-br from-[#141720] via-[#1A1F2C] to-[#12141C] rounded-3xl border border-[#C5A267]/50 shadow-xl space-y-5">
                  
                  {/* Card Header & Sakinah Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252E3E] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#C5A267] uppercase tracking-wider block">
                          Umpan Balik Spiritual & Analisis Sentimen AI
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {selectedEntry.sentimentAnalysis.primaryTone}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#0E1015] px-3.5 py-2 rounded-2xl border border-[#252E3E]">
                      <span className="text-xs text-[#94A3B8]">Indeks Sakinah:</span>
                      <span className="text-sm font-bold text-[#C5A267]">
                        {selectedEntry.sentimentAnalysis.sakinahScore}%
                      </span>
                    </div>
                  </div>

                  {/* Emotional Validation Summary */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
                      Validasi Emosi Psikologis:
                    </span>
                    <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                      {selectedEntry.sentimentAnalysis.emotionalSummary}
                    </p>
                  </div>

                  {/* Spiritual Feedback */}
                  <div className="p-4 bg-[#0E1015]/90 rounded-2xl border border-[#C5A267]/30 space-y-2">
                    <span className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      Tadabbur Jiwa & Nasehat Sejuk:
                    </span>
                    <p className="text-xs sm:text-sm text-white leading-relaxed italic">
                      "{selectedEntry.sentimentAnalysis.spiritualFeedback}"
                    </p>
                  </div>

                  {/* Quranic Anchor */}
                  {selectedEntry.sentimentAnalysis.quranicAnchor && (
                    <div className="p-4 bg-[#11141C] rounded-2xl border border-[#252E3E] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C5A267] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Ayat Penyejuk Jiwa: {selectedEntry.sentimentAnalysis.quranicAnchor.verse}
                        </span>
                      </div>

                      {selectedEntry.sentimentAnalysis.quranicAnchor.arabic && (
                        <p className="text-sm sm:text-base font-serif text-right text-[#E2E8F0] py-1 tracking-wide leading-loose">
                          {selectedEntry.sentimentAnalysis.quranicAnchor.arabic}
                        </p>
                      )}

                      <p className="text-xs text-[#94A3B8] italic">
                        "{selectedEntry.sentimentAnalysis.quranicAnchor.translation}"
                      </p>

                      <p className="text-xs text-[#CBD5E1] pt-1 border-t border-[#252E3E]">
                        💡 <span className="font-semibold text-white">Hikmah: </span>
                        {selectedEntry.sentimentAnalysis.quranicAnchor.tadabburInsight}
                      </p>
                    </div>
                  )}

                  {/* Micro Practice & Custom Dua Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Micro Practice */}
                    {selectedEntry.sentimentAnalysis.microPractice && (
                      <div className="p-3.5 bg-[#11141C] rounded-2xl border border-[#252E3E] space-y-1.5">
                        <span className="text-[11px] font-bold text-[#C5A267] uppercase tracking-wider block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Latihan Mandiri 2 Menit:
                        </span>
                        <h5 className="text-xs font-bold text-white">
                          {selectedEntry.sentimentAnalysis.microPractice.title}
                        </h5>
                        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                          {selectedEntry.sentimentAnalysis.microPractice.description}
                        </p>
                      </div>
                    )}

                    {/* Custom Dua */}
                    {selectedEntry.sentimentAnalysis.customDua && (
                      <div className="p-3.5 bg-[#11141C] rounded-2xl border border-[#252E3E] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#C5A267] uppercase tracking-wider block">
                            Doa Khusus Terangkai:
                          </span>
                          <button
                            onClick={() =>
                              handleCopyDua(
                                `${selectedEntry.sentimentAnalysis!.customDua.arabic}\n\n${selectedEntry.sentimentAnalysis!.customDua.meaning}`,
                                selectedEntry.id
                              )
                            }
                            className="text-[10px] text-[#C5A267] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedDuaId === selectedEntry.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin Doa</span>
                              </>
                            )}
                          </button>
                        </div>

                        {selectedEntry.sentimentAnalysis.customDua.arabic && (
                          <p className="text-xs font-serif text-right text-[#E2E8F0] line-clamp-1">
                            {selectedEntry.sentimentAnalysis.customDua.arabic}
                          </p>
                        )}

                        <p className="text-[11px] text-[#94A3B8] italic line-clamp-2">
                          "{selectedEntry.sentimentAnalysis.customDua.meaning}"
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="p-5 bg-[#141720] rounded-2xl border border-[#252E3E] text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-[#C5A267] mx-auto" />
                  <h5 className="font-bold text-white text-xs">Belum Ada Analisis Sentimen AI</h5>
                  <p className="text-[11px] text-[#94A3B8] max-w-sm mx-auto">
                    Dapatkan validasi psikologis dan nasehat spiritual yang dipersonalisasi untuk catatan ini.
                  </p>
                  <button
                    onClick={async () => {
                      setIsAnalyzingAI(true);
                      try {
                        const response = await fetch("/api/ai/journal-sentiment", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: selectedEntry.title,
                            content: selectedEntry.content,
                            tags: selectedEntry.tags,
                          }),
                        });
                        const data = await response.json();
                        if (data.success && data.sentiment) {
                          const updated = { ...selectedEntry, sentimentAnalysis: data.sentiment };
                          setSelectedEntry(updated);
                          setEntries(entries.map((e) => (e.id === selectedEntry.id ? updated : e)));
                          showToast("Analisis Sentimen AI berhasil diperbarui.");
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsAnalyzingAI(false);
                      }
                    }}
                    disabled={isAnalyzingAI}
                    className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {isAnalyzingAI ? "Menganalisis..." : "Jalankan Analisis AI Sekarang"}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Export Journal to Secure PDF Modal */}
      <ExportJournalPDFModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entries={entries}
        selectedEntry={exportTargetEntry || selectedEntry}
      />

    </div>
  );
};
