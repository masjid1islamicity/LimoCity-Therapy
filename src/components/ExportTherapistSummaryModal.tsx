import React, { useState } from "react";
import {
  X,
  Lock,
  Unlock,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Calendar,
  User,
  KeyRound,
  FileCheck,
  Share2,
  Clock,
  Flame,
  Award,
  CheckSquare,
  Square,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { Appointment, MoodLog, SunnahChecklistItem } from "../types";
import { 
  generateTherapistSummaryReport, 
  TherapistSummaryExportOptions, 
  SpiritualConsistencyReportData,
  DzikirLogSummary 
} from "../utils/pdfExport";
import { getPast7DaysDzikirHistory } from "../utils/dzikirHistory";
import { INITIAL_SUNNAH_CHECKLIST } from "../data/sunnahChecklistData";

interface ExportTherapistSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  moodLogs: MoodLog[];
}

export const ExportTherapistSummaryModal: React.FC<ExportTherapistSummaryModalProps> = ({
  isOpen,
  onClose,
  appointments,
  moodLogs,
}) => {
  // Patient details
  const [patientName, setPatientName] = useState<string>("Ahmad Rizky Pratama");
  const [patientEmail, setPatientEmail] = useState<string>("ahmad.rizky@example.com");
  const [patientPhone, setPatientPhone] = useState<string>("+62 812-8899-2311");
  const [emrNumber, setEmrNumber] = useState<string>("EMR-LC-2026-88492");
  
  // Default therapist name based on first appointment
  const latestTherapist = appointments.length > 0 
    ? `${appointments[0].therapistName} (${appointments[0].therapistTitle})`
    : "Dr. dr. H. Farhan Zulkarnain, Sp.KJ";
  const [therapistName, setTherapistName] = useState<string>(latestTherapist);

  // Filter & Scope Options
  const [dateRange, setDateRange] = useState<"all" | "last_30_days" | "last_7_days">("all");

  // Content Inclusions
  const [includeAppointmentHistory, setIncludeAppointmentHistory] = useState<boolean>(true);
  const [includeSpiritualConsistency, setIncludeSpiritualConsistency] = useState<boolean>(true);
  const [includeSunnahChecklist, setIncludeSunnahChecklist] = useState<boolean>(true);
  const [includeMoodHistory, setIncludeMoodHistory] = useState<boolean>(true);
  const [includeTherapistWorksheet, setIncludeTherapistWorksheet] = useState<boolean>(true);
  const [includeCustomNotes, setIncludeCustomNotes] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>(
    "Ingin mendiskusikan pengelolaan kecemasan saat beban kerja padat, keberlanjutan sholat tahajjud, dan evaluasi hasil latihan pernapasan thuma'ninah."
  );
  const [includeDoctorSeal, setIncludeDoctorSeal] = useState<boolean>(true);

  // Security / Password Protection
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("Terapis2026*");
  const [confirmPassword, setConfirmPassword] = useState<string>("Terapis2026*");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve current Sunnah Checklist state from localStorage
  const getStoredSunnahChecklist = (): SunnahChecklistItem[] => {
    if (typeof window === "undefined") return INITIAL_SUNNAH_CHECKLIST;
    const todayStr = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`limocity_sunnah_checklist_${todayStr}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SUNNAH_CHECKLIST;
      }
    }
    return INITIAL_SUNNAH_CHECKLIST;
  };

  const sunnahList = getStoredSunnahChecklist();
  const completedSunnah = sunnahList.filter(s => s.completed).length;
  const sunnahAdherence = Math.round((completedSunnah / sunnahList.length) * 100);

  // Retrieve Dzikir & Streak data
  const totalDzikirCount = parseInt(localStorage.getItem("limocity_total_dzikir_count") || "132", 10);
  const completedSessions = parseInt(localStorage.getItem("limocity_completed_sessions") || "4", 10);
  const streakCount = parseInt(localStorage.getItem("limocity_spiritual_streak") || "3", 10);
  const past7DaysData = getPast7DaysDzikirHistory();

  const dzikirSummary: DzikirLogSummary = {
    totalCount: totalDzikirCount,
    completedSessions: completedSessions,
    journalCount: 3,
    past7Days: past7DaysData.map((d) => ({
      dateFormatted: d.dateFormatted,
      dayName: d.dayName,
      count: d.count,
      target: d.target,
      completionRate: d.completionRate,
    })),
  };

  const spiritualReportData: SpiritualConsistencyReportData = {
    streakCount,
    dzikirSummary,
    sunnahChecklist: sunnahList.map(item => ({
      title: item.title,
      category: item.category,
      timeRecommendation: item.timeRecommendation,
      dalilReference: item.dalilReference,
      virtue: item.virtue,
      completed: item.completed,
      targetCountText: item.targetCountText,
    })),
    overallSakinahIndex: 88,
    weeklyConsistencyRate: 92,
  };

  const handleGenerateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(randomPin);
    setConfirmPassword(randomPin);
  };

  const handleExportPDF = async () => {
    setErrorMessage(null);

    if (isPasswordProtected) {
      if (!password || password.trim().length < 4) {
        setErrorMessage("Kata sandi minimal 4 karakter untuk melindungi kerahasiaan data medis & ibadah Anda.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
        return;
      }
    }

    if (!includeAppointmentHistory && !includeSpiritualConsistency && !includeMoodHistory) {
      setErrorMessage("Pilih minimal salah satu komponen data (Riwayat Janji Temu, Konsistensi Ruhani, atau Suasana Hati).");
      return;
    }

    setIsExporting(true);

    try {
      const options: TherapistSummaryExportOptions = {
        patientName,
        patientEmail,
        patientPhone,
        emrNumber,
        therapistName,
        password: isPasswordProtected ? password : undefined,
        dateRange,
        includeAppointmentHistory,
        includeSpiritualConsistency,
        includeSunnahChecklist,
        includeMoodHistory,
        includeTherapistWorksheet,
        includeCustomNotesForTherapist: includeCustomNotes,
        customNotesForTherapist: customNotes,
        includeDoctorSeal,
      };

      await generateTherapistSummaryReport(appointments, moodLogs, spiritualReportData, options);

      setExportSuccess(true);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#C5A267", "#10B981", "#E5C388", "#FFFFFF"]
        });
      } catch (e) {}

      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (err: any) {
      console.error("Therapist PDF Export error:", err);
      setErrorMessage("Gagal membuat ringkasan PDF untuk terapis. Silakan coba kembali.");
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      
      <div className="bg-gradient-to-b from-[#141722] via-[#0E1017] to-[#0A0B0E] border border-[#C5A267]/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 overflow-hidden">
        
        {/* Decorative Gold Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-full transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shrink-0 shadow-lg shadow-[#C5A267]/10">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C5A267]/15 border border-[#C5A267]/30 text-[#C5A267] rounded-full text-[10px] font-bold uppercase tracking-wider">
                Dokumen Kolaborasi Terapeutik
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                EMR & Tazkiyah Terintegrasi
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              Ekspor Ringkasan Konsultasi & Konsistensi Ruhani (PDF)
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              Kompilasi riwayat janji temu klinis, diagnosa, kepatuhan amalan sunnah harian, dan log suasana hati untuk dibagikan secara aman kepada psikolog/terapis Anda.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {exportSuccess && (
          <div className="mb-6 p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-start gap-3 animate-slideDown">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block mb-0.5">
                Dokumen Ringkasan Terapis Berhasil Diunduh!
              </span>
              <p className="text-emerald-200/90 leading-relaxed">
                {isPasswordProtected ? (
                  <>File Anda terlindungi dengan kata sandi: <strong className="font-mono bg-black/50 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">{password}</strong>. Berikan kata sandi ini kepada terapis Anda saat konsultasi.</>
                ) : (
                  <>File PDF ringkasan telah tersimpan di perangkat Anda dan siap dilampirkan sebelum sesi telemedisin.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-500/50 rounded-2xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <span className="font-bold block mb-0.5">Perhatian:</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Live Data Summary Pills Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#0E1015] border border-[#252E3E] rounded-2xl mb-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#C5A267]/15 text-[#C5A267] flex items-center justify-center font-bold">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] block">Janji Temu</span>
              <span className="font-bold text-white font-mono">{appointments.length} Sesi</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] block">Streak Istiqomah</span>
              <span className="font-bold text-white font-mono">{streakCount} Hari</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] block">Kepatuhan Sunnah</span>
              <span className="font-bold text-emerald-400 font-mono">{sunnahAdherence}%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] block">Log Emosi / Mood</span>
              <span className="font-bold text-white font-mono">{moodLogs.length} Entri</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="space-y-6 max-h-[58vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#252E3E]">
          
          {/* SECTION 1: IDENTITAS PASIEN & TERAPIS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A267] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>1. Identitas Pasien & Terapis Pembina</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                  Nama Lengkap Pasien
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                  Nomor Rekam Medis (EMR)
                </label>
                <input
                  type="text"
                  value={emrNumber}
                  onChange={(e) => setEmrNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                  Terapis / Psikolog Tujuan
                </label>
                <input
                  type="text"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                  Rentang Waktu Laporan
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267]"
                >
                  <option value="all">Semua Riwayat & Progres (Lengkap)</option>
                  <option value="last_30_days">30 Hari Terakhir (Satu Bulan)</option>
                  <option value="last_7_days">7 Hari Terakhir (Siklus Mingguan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: KOMPONEN YANG AKAN DISERTAKAN DALAM PDF */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A267] flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>2. Modul Data yang Disertakan ke Terapis</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Toggle: Appointment History */}
              <div 
                onClick={() => setIncludeAppointmentHistory(!includeAppointmentHistory)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeAppointmentHistory 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeAppointmentHistory ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Riwayat Janji Temu & Diagnosa EMR
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Tabel sesi konseling, diagnosa, dan action plan terapis terdahulu.
                  </span>
                </div>
              </div>

              {/* Toggle: Spiritual Consistency & Dzikir */}
              <div 
                onClick={() => setIncludeSpiritualConsistency(!includeSpiritualConsistency)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeSpiritualConsistency 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeSpiritualConsistency ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Progres Dzikir & Disiplin 7 Hari
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Grafik kepatuhan dzikir, streak istiqomah, dan putaran tasbih.
                  </span>
                </div>
              </div>

              {/* Toggle: Sunnah Daily Checklist */}
              <div 
                onClick={() => setIncludeSunnahChecklist(!includeSunnahChecklist)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeSunnahChecklist 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeSunnahChecklist ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Checklist Amalan Sunnah Harian
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Dzikir pagi/petang, sholat dhuha, rawatib, tilawah & sedekah.
                  </span>
                </div>
              </div>

              {/* Toggle: Mood History */}
              <div 
                onClick={() => setIncludeMoodHistory(!includeMoodHistory)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeMoodHistory 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeMoodHistory ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Log Suasana Hati (Mood Tracker)
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Fluktuasi emosi harian, tingkat energi batin, dan tadabbur.
                  </span>
                </div>
              </div>

              {/* Toggle: Therapist Worksheet */}
              <div 
                onClick={() => setIncludeTherapistWorksheet(!includeTherapistWorksheet)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeTherapistWorksheet 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeTherapistWorksheet ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Lembar Observasi & Tanda Tangan Terapis
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Kolom bergaris resmi untuk catatan langsung konselor saat sesi.
                  </span>
                </div>
              </div>

              {/* Toggle: Official Digital Seal */}
              <div 
                onClick={() => setIncludeDoctorSeal(!includeDoctorSeal)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  includeDoctorSeal 
                    ? "bg-[#181C26] border-[#C5A267]/60 ring-1 ring-[#C5A267]/20" 
                    : "bg-[#111318] border-[#1F2937] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {includeDoctorSeal ? (
                    <CheckSquare className="w-4 h-4 text-[#C5A267]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Stempel Verifikasi & Segel Digital
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Segel resmi komite medis psikologi klinis Islam LimoCity.
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: CATATAN KHUSUS / PERTANYAAN DARI PASIEN UNTUK TERAPIS */}
          <div className="p-4 bg-[#141720] border border-[#252E3E] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#E2E8F0] flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCustomNotes}
                  onChange={(e) => setIncludeCustomNotes(e.target.checked)}
                  className="rounded-sm accent-[#C5A267]"
                />
                <span>Sertakan Catatan Khusus / Pertanyaan Anda untuk Terapis</span>
              </label>
              <span className="text-[10px] text-[#94A3B8]">Opsional</span>
            </div>

            {includeCustomNotes && (
              <div>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Tuliskan hal yang paling ingin Anda bahas atau kendala yang dirasakan dalam menjalankan amalan..."
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                />
                <span className="text-[10px] text-[#94A3B8] italic mt-1 block">
                  Catatan ini akan dicetak di bagian atas laporan agar langsung terbaca oleh terapis Anda.
                </span>
              </div>
            )}
          </div>

          {/* SECTION 4: PENGATURAN KEAMANAN & PASSWORD AES */}
          <div className="p-4 bg-[#141720] border border-[#252E3E] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#C5A267]" />
                <span className="text-xs font-bold text-white">
                  Enkripsi & Proteksi Kata Sandi PDF
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isPasswordProtected
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#252E3E] text-[#94A3B8]"
                }`}
              >
                {isPasswordProtected ? "🔒 Aktif (Direkomendasikan)" : "Tanpa Password"}
              </button>
            </div>

            {isPasswordProtected ? (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] text-[#94A3B8]">
                  File PDF akan dienkripsi dengan standar AES. Berikan kata sandi ini kepada terapis Anda untuk membuka dokumen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1">
                      Kata Sandi Dokumen
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267] font-mono pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1">
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267] font-mono pr-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateRandomPin}
                    className="text-[11px] text-[#C5A267] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Buat PIN 6-Digit Acak</span>
                  </button>

                  <span className="text-[10px] text-[#64748B]">
                    Minimal 4 Karakter
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-amber-300/80 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                ⚠️ Catatan: Tanpa kata sandi, siapa saja yang memiliki file PDF ini dapat membaca riwayat kesehatan dan catatan ibadah Anda.
              </p>
            )}
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format PDF Resmi LimoCity Therapy (A4 Portrait)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#C5A267]/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyiapkan PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Unduh PDF Ringkasan Terapis</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
