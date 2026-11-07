import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Video, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Sun, 
  Moon, 
  Play, 
  Pause,
  Download,
  AlertCircle,
  Activity,
  Lock,
  ShieldCheck,
  History,
  TrendingUp,
  FileCheck,
  Feather,
  BookOpen
} from "lucide-react";
import { Appointment, MoodLog } from "../types";
import { ExportReportModal } from "./ExportReportModal";
import { ExportTherapistSummaryModal } from "./ExportTherapistSummaryModal";
import { ReflectiveJournaling } from "./ReflectiveJournaling";
import { DailyReflectionJournal } from "./DailyReflectionJournal";

interface PatientPortalProps {
  appointments: Appointment[];
  onEnterTelemedicineRoom: (appointment: Appointment) => void;
  onBookNewSession: () => void;
  onOpenDzikirSidebar?: () => void;
}

const DEFAULT_MOOD_LOGS: MoodLog[] = [
  {
    id: "mood-1",
    date: "22 Agt 2026",
    mood: "tenang",
    energyLevel: 8,
    notes: "Merasakan ketenangan batin yang sejuk setelah merutinkan istighfar dan membaca tadabbur QS. Ar-Ra'd 28.",
    aiReflection: "Ketenangan adalah karunia Allah yang turun saat hati senantiasa basah dengan mengingat-Nya.",
    shortPrayer: "Ya Muqallibal qulub, tsabbit qalbi 'ala dinik."
  },
  {
    id: "mood-2",
    date: "20 Agt 2026",
    mood: "cemas",
    energyLevel: 6,
    notes: "Sempat gelisah terkait proyek kerjaan, namun berhasil mereda setelah latihan pernafasan thuma'ninah 4-4-6.",
    aiReflection: "Urusan esok hari berada di tangan Dzat Yang Mengatur Alam Semesta. Cukupkan ikhtiar dan bertawakallah.",
    shortPrayer: "Hasbunallah wa ni'mal wakil, ni'mal maula wa ni'man nashir."
  },
  {
    id: "mood-3",
    date: "18 Agt 2026",
    mood: "sangat_tenang",
    energyLevel: 9,
    notes: "Sesi konseling bersama Dr. Aisyah memberikan perspektif baru dalam membedakan fakta vs asumsi negatif.",
    aiReflection: "Syukur melipatgandakan nikmat dan membuka pintu kejernihan akal.",
    shortPrayer: "Rabbi zidni 'ilman warzuqni fahman."
  }
];

export const PatientPortal: React.FC<PatientPortalProps> = ({
  appointments,
  onEnterTelemedicineRoom,
  onBookNewSession,
  onOpenDzikirSidebar,
}) => {
  // Tab Switcher State: "daily_reflection" | "ai_journal" | "emr" | "all"
  const [activePortalTab, setActivePortalTab] = useState<"daily_reflection" | "ai_journal" | "emr" | "all">("daily_reflection");

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTherapistSummaryModalOpen, setIsTherapistSummaryModalOpen] = useState<boolean>(false);

  // Mood Tracker State
  const [selectedMood, setSelectedMood] = useState<"sangat_tenang" | "tenang" | "netral" | "cemas" | "lelah_batin">("tenang");
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [moodNotes, setMoodNotes] = useState<string>("");
  const [isGeneratingReflection, setIsGeneratingReflection] = useState<boolean>(false);
  const [savedReflection, setSavedReflection] = useState<{ reflection: string; shortPrayer: string } | null>({
    reflection: "Hati yang bersyukur dan bersabar adalah benteng terkuat jiwa. Langkah kecil Anda hari ini bernilai besar di hadapan Allah.",
    shortPrayer: "Ya Muqallibal qulub, tsabbit qalbi 'ala dinik (Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu)."
  });

  // Mood History List from Local Storage
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem("limocity_patient_mood_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MOOD_LOGS;
      }
    }
    return DEFAULT_MOOD_LOGS;
  });

  useEffect(() => {
    localStorage.setItem("limocity_patient_mood_logs", JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Audio Dzikir Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioTitle, setActiveAudioTitle] = useState<string>("Audio Dzikir Pagi & Mindfulness Syukur (12 Mnt)");

  const handleSaveMood = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingReflection(true);
    try {
      const res = await fetch("/api/ai/mood-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, notes: moodNotes }),
      });
      const data = await res.json();
      if (data.success) {
        const newReflection = {
          reflection: data.reflection,
          shortPrayer: data.shortPrayer,
        };
        setSavedReflection(newReflection);

        // Add to mood history
        const newLog: MoodLog = {
          id: `mood-${Date.now()}`,
          date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          mood: selectedMood,
          energyLevel: energyLevel,
          notes: moodNotes.trim() || "Pencatatan kondisi suasana hati harian",
          aiReflection: data.reflection,
          shortPrayer: data.shortPrayer,
        };

        setMoodHistory((prev) => [newLog, ...prev]);
        setMoodNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const moodOptions = [
    { id: "sangat_tenang", label: "Sangat Tenang & Syukur", emoji: "🌸", color: "bg-emerald-100 border-emerald-400 text-emerald-900" },
    { id: "tenang", label: "Cukup Tenang", emoji: "🌿", color: "bg-teal-100 border-teal-400 text-teal-900" },
    { id: "netral", label: "Biasa Saja", emoji: "⛅", color: "bg-slate-100 border-slate-300 text-slate-800" },
    { id: "cemas", label: "Cemas & Overthinking", emoji: "🌧️", color: "bg-amber-100 border-amber-400 text-amber-900" },
    { id: "lelah_batin", label: "Lelah Batin / Burnout", emoji: "🍂", color: "bg-rose-100 border-rose-400 text-rose-900" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#E2E8F0]">
      
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#C5A267]/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block">
              Portal Rekam Medis & Kesejahteraan Pasien
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              EMR Terenkripsi AES
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Ahlan wa Sahlan, Ahmad Rizky Pratama
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Pantau jadwal telemedisin, rekam medis konsultasi psikolog (EMR), diagnosa klinis, dan catatan riwayat suasana hati (mood history) Anda secara aman.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* Therapist Summary PDF Export Button (Appointments + Spiritual Consistency) */}
          <button
            id="export-therapist-summary-btn"
            onClick={() => setIsTherapistSummaryModalOpen(true)}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-[#C5A267]/20 to-[#C5A267]/10 hover:from-[#C5A267]/30 hover:to-[#C5A267]/20 text-[#C5A267] hover:text-[#E5C388] border border-[#C5A267]/60 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/10 transition-all active:scale-95 cursor-pointer relative group"
            title="Ekspor ringkasan riwayat janji temu dan konsistensi ibadah harian untuk terapis (PDF)"
          >
            <FileText className="w-4 h-4 text-[#C5A267] group-hover:scale-110 transition-transform" />
            <span>Ringkasan untuk Terapis (PDF)</span>
            <span className="hidden xl:inline-block px-1.5 py-0.5 bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] rounded-md text-[10px] font-bold">
              Amalan & EMR
            </span>
          </button>

          {/* Secure PDF Export Button */}
          <button
            id="export-secure-pdf-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white border border-[#252E3E] font-medium px-3.5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            title="Ekspor rekam medis dan riwayat mood menjadi PDF dengan proteksi kata sandi"
          >
            <div className="relative">
              <Download className="w-4 h-4 text-[#94A3B8]" />
              <Lock className="w-2.5 h-2.5 text-[#C5A267] absolute -top-1 -right-1" />
            </div>
            <span>Rekam Medis EMR</span>
          </button>

          {/* Book Session Button */}
          <button
            onClick={onBookNewSession}
            className="flex-1 sm:flex-initial bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4.5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md shadow-[#C5A267]/20 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>+ Buat Janji Temu</span>
          </button>
        </div>
      </div>

      {/* Patient Portal Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111318] border border-[#252E3E] rounded-2xl">
          {/* Tab 1: Daily Reflection Journal (Post-Dzikir) */}
          <button
            id="tab-daily-reflection-btn"
            onClick={() => setActivePortalTab("daily_reflection")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "daily_reflection"
                ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jurnal Refleksi Harian</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
              activePortalTab === "daily_reflection" ? "bg-black/20 text-black" : "bg-[#252E3E] text-[#C5A267]"
            }`}>
              Pasca Dzikir
            </span>
          </button>

          {/* Tab 2: AI Tadabbur & Comprehensive Journal */}
          <button
            id="tab-ai-journal-btn"
            onClick={() => setActivePortalTab("ai_journal")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "ai_journal"
                ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Tadabbur & Analisis</span>
          </button>

          {/* Tab 3: Appointments & EMR */}
          <button
            id="tab-emr-btn"
            onClick={() => setActivePortalTab("emr")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "emr"
                ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal & EMR</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activePortalTab === "emr" ? "bg-black/20 text-black" : "bg-[#252E3E] text-[#94A3B8]"
            }`}>
              {appointments.length}
            </span>
          </button>

          {/* Tab 4: All Views */}
          <button
            id="tab-all-btn"
            onClick={() => setActivePortalTab("all")}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold hidden lg:flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "all"
                ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20 font-bold"
                : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Semua Tampilan</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sesi Aktif Pasien: Ahmad Rizky</span>
        </div>
      </div>

      {/* VIEW 1: DAILY REFLECTION JOURNAL (PASCA DZIKIR - LOCAL STORAGE) */}
      {(activePortalTab === "daily_reflection" || activePortalTab === "all") && (
        <div className="space-y-6">
          <DailyReflectionJournal
            patientName="Ahmad Rizky Pratama"
            onOpenDzikirSidebar={onOpenDzikirSidebar}
            onShareToTherapistSession={(entry) => {
              alert(`Refleksi amalan "${entry.dzikirTitle}" telah ditandai untuk dibahas bersama terapis pada sesi telemedisin mendatang.`);
            }}
          />
        </div>
      )}

      {/* VIEW 2: AI TADABBUR & EMOTIONAL SENTIMENT JOURNAL */}
      {(activePortalTab === "ai_journal" || activePortalTab === "all") && (
        <div className="space-y-6">
          {activePortalTab === "all" && (
            <div className="pt-6 border-t border-[#1F2937]">
              <h3 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A267]" />
                <span>Jurnal AI Tadabbur & Analisis Sentimen Sakinah</span>
              </h3>
            </div>
          )}
          <ReflectiveJournaling
            patientName="Ahmad Rizky Pratama"
            onShareWithTherapist={(entry) => {
              alert(`Refleksi "${entry.title}" telah ditandai untuk dibahas bersama terapis pada sesi telemedisin mendatang.`);
            }}
          />
        </div>
      )}

      {/* VIEW: APPOINTMENTS & EMR (Tab 2) */}
      {(activePortalTab === "emr" || activePortalTab === "all") && (
        <div className="space-y-6">
          {activePortalTab === "all" && (
            <div className="pt-6 border-t border-[#1F2937]">
              <h3 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C5A267]" />
                <span>Jadwal Sesi Telemedisin & Rekam Medis Klinis (EMR)</span>
              </h3>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (7 cols): Appointments List & Clinical EMR Records */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C5A267]" />
              <span>Jadwal Sesi Telemedisin & Rekam Medis (EMR)</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTherapistSummaryModalOpen(true)}
                className="text-xs text-[#C5A267] hover:text-[#E5C388] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                title="Ekspor ringkasan khusus untuk dibagikan kepada terapis Anda"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ringkasan Terapis (PDF)</span>
              </button>
              <span className="text-[#334155]">•</span>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="text-xs text-[#94A3B8] hover:text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Rekam Medis</span>
              </button>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-[#111318] rounded-3xl p-8 border border-[#1F2937] text-center space-y-3">
              <Calendar className="w-12 h-12 text-[#64748B] mx-auto" />
              <h4 className="font-bold text-white text-base">Belum Ada Janji Temu Aktif</h4>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Jadwalkan sesi konseling telemedisin pertama Anda bersama psikolog klinis berlisensi resmi.
              </p>
              <button
                onClick={onBookNewSession}
                className="mt-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-[#C5A267]/20 transition-colors cursor-pointer"
              >
                Pilih Jadwal Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#111318] rounded-3xl border border-[#1F2937] shadow-xl hover:border-[#374151] transition-all p-5 sm:p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Kode: {apt.bookingCode}
                        </span>
                        <span className="text-xs text-[#64748B] font-medium">
                          • {apt.consultationType.toUpperCase()} CALL
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">
                        {apt.therapistName}
                      </h4>
                      <p className="text-xs text-[#C5A267] font-semibold">{apt.therapistTitle}</p>
                    </div>

                    <span className="px-3 py-1 bg-[#C5A267]/15 border border-[#C5A267]/30 text-[#C5A267] rounded-full text-xs font-bold">
                      Terkonfirmasi
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#141720] rounded-2xl text-xs text-[#94A3B8] border border-[#252E3E]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A267]" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A267]" />
                      <span className="font-bold text-white">{apt.timeSlot}</span>
                    </div>
                  </div>

                  {/* Clinical EMR Notes Accordion */}
                  {apt.clinicalNotes && (
                    <div className="p-4 bg-[#141720] border border-[#C5A267]/30 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#C5A267] uppercase tracking-wider block flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#C5A267]" />
                          Catatan Resep & Tindak Lanjut Terapis:
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                          ✓ EMR Resmi
                        </span>
                      </div>
                      <p className="text-white font-semibold">
                        Diagnosa/Fokus: {apt.clinicalNotes.diagnosis}
                      </p>
                      <div className="text-[#94A3B8] space-y-1">
                        {apt.clinicalNotes.actionPlan?.map((plan, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A267] shrink-0 mt-0.5" />
                            <span>{plan}</span>
                          </div>
                        ))}
                      </div>
                      {apt.clinicalNotes.tazkiyahPrescription && (
                        <p className="text-[11px] text-[#E2E8F0] bg-[#181C26] border border-[#252E3E] p-2.5 rounded-lg italic">
                          📖 Resep Tazkiyah: {apt.clinicalNotes.tazkiyahPrescription}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onEnterTelemedicineRoom(apt)}
                      className="flex-1 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C5A267]/20 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-black" />
                      <span>Masuk Ruang Telemedisin Virtual</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Mood History Timeline Section */}
          <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#C5A267]" />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Riwayat Suasana Hati & Jurnal Emosi (Mood History)
                  </h4>
                  <span className="text-[11px] text-[#94A3B8]">
                    {moodHistory.length} entri tercatat untuk pemantauan evaluasi klinis
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="text-xs text-[#C5A267] hover:underline flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Riwayat PDF</span>
              </button>
            </div>

            <div className="space-y-3">
              {moodHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#141720] border border-[#252E3E] rounded-2xl space-y-2 hover:border-[#374151] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">
                        {item.mood === "sangat_tenang" ? "🌸" : item.mood === "tenang" ? "🌿" : item.mood === "netral" ? "⛅" : item.mood === "cemas" ? "🌧️" : "🍂"}
                      </span>
                      <span className="font-bold text-white capitalize">
                        {item.mood.replace("_", " ")}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#181C26] text-[#C5A267] border border-[#252E3E] rounded-md font-mono">
                        Energi: {item.energyLevel}/10
                      </span>
                    </div>

                    <span className="text-[11px] text-[#64748B] font-medium">{item.date}</span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] italic bg-[#0E1017] p-2.5 rounded-xl border border-[#1E2330]">
                    "{item.notes}"
                  </p>

                  {item.aiReflection && (
                    <div className="text-[11px] text-[#94A3B8] flex items-start gap-1.5 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A267] shrink-0 mt-0.5" />
                      <span>{item.aiReflection}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col (5 cols): Daily Mood Tracker & Tazkiyah Audio Guide */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Mood Check-In Widget */}
          <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-white text-sm">
                  Pelacak Suasana Hati (Daily Mood)
                </h4>
              </div>
              <span className="text-[11px] text-[#64748B] font-medium">Hari Ini</span>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                  Bagaimana getaran hati Anda saat ini?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedMood(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                        selectedMood === opt.id
                          ? `bg-[#C5A267]/20 border-[#C5A267] text-[#C5A267] font-bold ring-1 ring-[#C5A267]/30`
                          : "bg-[#141720] border-[#252E3E] hover:bg-[#181C26] text-[#94A3B8]"
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#94A3B8] mb-1">
                  <span>Tingkat Energi Batin:</span>
                  <span className="text-[#C5A267] font-bold">{energyLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Catatan Hati / Hal yang Disyukuri Hari Ini:
                </label>
                <textarea
                  rows={2}
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="Tuliskan 1 hal yang membuat Anda bersyukur atau apa yang sedang dirasakan..."
                  className="w-full px-3.5 py-2 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingReflection}
                className="w-full bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#C5A267]/20 transition-colors cursor-pointer"
              >
                {isGeneratingReflection ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Merangkai Refleksi AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Catat & Dapatkan Tadabbur Hati</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated AI Tadabbur Box */}
            {savedReflection && (
              <div className="p-4 bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-2xl border border-[#C5A267]/40 space-y-2 text-xs">
                <span className="text-[#C5A267] font-bold uppercase tracking-wider text-[10px] block">
                  Tadabbur Jiwa Hari Ini:
                </span>
                <p className="text-[#E2E8F0] leading-relaxed italic">
                  "{savedReflection.reflection}"
                </p>
                <div className="pt-2 border-t border-[#252E3E] text-[#94A3B8] text-[11px]">
                  <span className="text-[#C5A267] font-semibold">Doa Penenang: </span>
                  {savedReflection.shortPrayer}
                </div>
              </div>
            )}
          </div>

          {/* Self-Care & Dzikir Audio Library */}
          <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-5 sm:p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A267]" />
              <span>Panduan Audio Relaksasi & Ruqyah Mandiri</span>
            </h4>

            <div className="space-y-2.5">
              {[
                { title: "Audio Dzikir Pagi & Mindfulness Syukur", duration: "12 Menit", type: "Dzikir Harian" },
                { title: "Latihan Pernapasan Penurun Panic Attack (4-7-8)", duration: "8 Menit", type: "I-CBT Breathing" },
                { title: "Ruqyah Syari'iyyah Ketenangan Jiwa & Tidur Nyenyak", duration: "25 Menit", type: "Thibbun Nabawi" }
              ].map((audio, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#141720] hover:bg-[#181C26] border border-[#252E3E] rounded-2xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setActiveAudioTitle(audio.title);
                        setIsPlayingAudio(!isPlayingAudio);
                      }}
                      className="w-9 h-9 rounded-xl bg-[#C5A267] hover:bg-[#D8B57B] text-black flex items-center justify-center shrink-0 transition-colors shadow-md shadow-[#C5A267]/20 cursor-pointer"
                    >
                      {isPlayingAudio && activeAudioTitle === audio.title ? (
                        <Pause className="w-4 h-4 text-black" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5 text-black" />
                      )}
                    </button>
                    <div>
                      <h5 className="text-xs font-bold text-white">{audio.title}</h5>
                      <span className="text-[10px] text-[#94A3B8] font-medium">
                        {audio.type} • {audio.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isPlayingAudio && (
              <div className="p-3 bg-[#141720] text-white rounded-2xl border border-[#C5A267]/40 flex items-center justify-between text-xs animate-pulse">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-ping"></span>
                  <span className="truncate text-[#E2E8F0] font-medium">Sedang Memutar: {activeAudioTitle}</span>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(false)}
                  className="text-xs text-[#C5A267] font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
      </div>
      )}

      {/* Export Secure Password-Protected PDF Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appointments={appointments}
        moodLogs={moodHistory}
      />

      {/* Export Dedicated Therapist Consultation & Spiritual Consistency Summary PDF Modal */}
      <ExportTherapistSummaryModal
        isOpen={isTherapistSummaryModalOpen}
        onClose={() => setIsTherapistSummaryModalOpen(false)}
        appointments={appointments}
        moodLogs={moodHistory}
      />

    </div>
  );
};

