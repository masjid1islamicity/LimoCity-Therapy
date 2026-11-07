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
  HelpCircle,
  RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";
import { Appointment, MoodLog } from "../types";
import { generateSecurePatientReport, PDFExportOptions, DzikirLogSummary } from "../utils/pdfExport";
import { getPast7DaysDzikirHistory } from "../utils/dzikirHistory";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  moodLogs: MoodLog[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  appointments,
  moodLogs,
}) => {
  // Form options
  const [patientName, setPatientName] = useState<string>("Ahmad Rizky Pratama");
  const [patientEmail, setPatientEmail] = useState<string>("ahmad.rizky@example.com");
  const [patientPhone, setPatientPhone] = useState<string>("+62 812-8899-2311");
  const [emrNumber, setEmrNumber] = useState<string>("EMR-LC-2026-88492");
  const [gender, setGender] = useState<string>("Laki-laki");
  const [birthDate, setBirthDate] = useState<string>("1994-05-14");

  // Content Toggles
  const [includeClinicalNotes, setIncludeClinicalNotes] = useState<boolean>(true);
  const [includeMoodHistory, setIncludeMoodHistory] = useState<boolean>(true);
  const [includeDzikirLogs, setIncludeDzikirLogs] = useState<boolean>(true);
  const [includeDoctorSeal, setIncludeDoctorSeal] = useState<boolean>(true);

  // Password & Security State
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("LimoCity2026*");
  const [confirmPassword, setConfirmPassword] = useState<string>("LimoCity2026*");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Dzikir stats from localStorage
  const totalDzikirCount = parseInt(localStorage.getItem("limocity_total_dzikir_count") || "132", 10);
  const completedSessions = parseInt(localStorage.getItem("limocity_completed_sessions") || "4", 10);
  const rawJournal = localStorage.getItem("limocity_tazkiyah_journal");
  const journalCount = rawJournal ? JSON.parse(rawJournal).length : 3;
  const past7DaysData = getPast7DaysDzikirHistory();

  const dzikirSummary: DzikirLogSummary = {
    totalCount: totalDzikirCount,
    completedSessions: completedSessions,
    journalCount: journalCount,
    past7Days: past7DaysData.map((d) => ({
      dateFormatted: d.dateFormatted,
      dayName: d.dayName,
      count: d.count,
      target: d.target,
      completionRate: d.completionRate,
    })),
  };

  // Password validation
  const passwordsMatch = !isPasswordProtected || (password === confirmPassword && password.length >= 4);

  const handleGenerateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(randomPin);
    setConfirmPassword(randomPin);
  };

  const handleExportPDF = async () => {
    setErrorMessage(null);

    if (isPasswordProtected) {
      if (!password || password.trim().length < 4) {
        setErrorMessage("Kata sandi minimal 4 karakter untuk melindungi dokumen medis Anda.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
        return;
      }
    }

    if (!includeClinicalNotes && !includeMoodHistory && !includeDzikirLogs) {
      setErrorMessage("Pilih setidaknya satu komponen laporan (Catatan Klinis, Suasana Hati, atau Statistik Dzikir).");
      return;
    }

    setIsExporting(true);

    try {
      const options: PDFExportOptions = {
        patientName,
        patientEmail,
        patientPhone,
        emrNumber,
        gender,
        birthDate,
        password: isPasswordProtected ? password : undefined,
        includeClinicalNotes,
        includeMoodHistory,
        includeDzikirLogs,
        includeDoctorSeal,
      };

      await generateSecurePatientReport(appointments, moodLogs, dzikirSummary, options);

      setExportSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A267", "#10B981", "#FFFFFF"]
        });
      } catch (e) {}

      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (err: any) {
      console.error("PDF Export error:", err);
      setErrorMessage("Gagal membuat dokumen PDF. Silakan coba lagi.");
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      
      <div className="bg-gradient-to-b from-[#141722] via-[#0E1017] to-[#0A0B0E] border border-[#C5A267]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 overflow-hidden">
        
        {/* Header Gold Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-full transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Ekspor Rekam Medis & Riwayat Mood Terenkripsi (PDF)
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Unduh salinan resmi catatan klinis EMR, evaluasi I-CBT, dan log suasana hati untuk arsip pribadi.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {exportSuccess && (
          <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-start gap-3 animate-slideDown">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block mb-0.5">
                Dokumen PDF Terenkripsi Berhasil Dibuat & Diunduh!
              </span>
              <p className="text-emerald-200/90 leading-relaxed">
                {isPasswordProtected ? (
                  <>File Anda dilindungi kata sandi: <strong className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-emerald-300">{password}</strong>. Gunakan kata sandi ini saat membuka PDF.</>
                ) : (
                  <>File PDF rekam medis telah tersimpan di folder Unduhan perangkat Anda.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-6 max-h-[68vh] overflow-y-auto pr-1.5 custom-scrollbar">
          
          {/* 1. Patient Profile Information Review */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C5A267]" />
                1. Data Identitas Pasien
              </span>
              <span className="text-[10px] text-[#C5A267] font-mono font-semibold">{emrNumber}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">Nama Lengkap Pasien:</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">Nomor Rekam Medis (EMR):</label>
                <input
                  type="text"
                  value={emrNumber}
                  onChange={(e) => setEmrNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">Email:</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">No. WhatsApp / HP:</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>
            </div>
          </div>

          {/* 2. Content Checklist Selector */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1F2937] pb-2">
              <FileCheck className="w-3.5 h-3.5 text-[#C5A267]" />
              2. Komponen Laporan yang Disertakan
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                includeClinicalNotes 
                  ? "bg-[#181C26] border-[#C5A267]/60 text-white" 
                  : "bg-[#0A0B0E] border-[#252E3E] text-[#64748B]"
              }`}>
                <input
                  type="checkbox"
                  checked={includeClinicalNotes}
                  onChange={(e) => setIncludeClinicalNotes(e.target.checked)}
                  className="mt-0.5 rounded-sm text-[#C5A267] accent-[#C5A267]"
                />
                <div>
                  <span className="text-xs font-bold block text-white">Catatan Klinis EMR ({appointments.length} Sesi)</span>
                  <span className="text-[10px] text-[#94A3B8]">Diagnosa psikolog, action plan, resep Tazkiyah</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                includeMoodHistory 
                  ? "bg-[#181C26] border-[#C5A267]/60 text-white" 
                  : "bg-[#0A0B0E] border-[#252E3E] text-[#64748B]"
              }`}>
                <input
                  type="checkbox"
                  checked={includeMoodHistory}
                  onChange={(e) => setIncludeMoodHistory(e.target.checked)}
                  className="mt-0.5 rounded-sm text-[#C5A267] accent-[#C5A267]"
                />
                <div>
                  <span className="text-xs font-bold block text-white">Riwayat Suasana Hati & Tadabbur</span>
                  <span className="text-[10px] text-[#94A3B8]">Log mood harian, energi batin & refleksi AI</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                includeDzikirLogs 
                  ? "bg-[#181C26] border-[#C5A267]/60 text-white" 
                  : "bg-[#0A0B0E] border-[#252E3E] text-[#64748B]"
              }`}>
                <input
                  type="checkbox"
                  checked={includeDzikirLogs}
                  onChange={(e) => setIncludeDzikirLogs(e.target.checked)}
                  className="mt-0.5 rounded-sm text-[#C5A267] accent-[#C5A267]"
                />
                <div>
                  <span className="text-xs font-bold block text-white">Statistik Tazkiyatun Nafs</span>
                  <span className="text-[10px] text-[#94A3B8]">Total {totalDzikirCount} dzikir, {completedSessions} putaran tasbih</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                includeDoctorSeal 
                  ? "bg-[#181C26] border-[#C5A267]/60 text-white" 
                  : "bg-[#0A0B0E] border-[#252E3E] text-[#64748B]"
              }`}>
                <input
                  type="checkbox"
                  checked={includeDoctorSeal}
                  onChange={(e) => setIncludeDoctorSeal(e.target.checked)}
                  className="mt-0.5 rounded-sm text-[#C5A267] accent-[#C5A267]"
                />
                <div>
                  <span className="text-xs font-bold block text-white">Stempel & E-Signature Dokter</span>
                  <span className="text-[10px] text-[#94A3B8]">Segel resmi LimoCity & hash verifikasi QR</span>
                </div>
              </label>

            </div>
          </div>

          {/* 3. Password Protection Settings */}
          <div className="bg-[#111318] border border-[#C5A267]/40 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    3. Proteksi Enkripsi Kata Sandi (AES Encryption)
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    Mencegah pihak lain membuka rekam medis Anda tanpa izin
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isPasswordProtected
                    ? "bg-[#C5A267] text-black shadow-xs"
                    : "bg-[#1F2937] text-[#94A3B8]"
                }`}
              >
                {isPasswordProtected ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isPasswordProtected ? "Terenkripsi Aktif" : "Tanpa Password"}</span>
              </button>
            </div>

            {isPasswordProtected ? (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-white">
                        Kata Sandi PDF Baru:
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateRandomPin}
                        className="text-[10px] text-[#C5A267] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Acak 6-Digit PIN</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full px-3 py-2 pr-10 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#64748B] hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white mb-1">
                      Konfirmasi Kata Sandi:
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi..."
                      className={`w-full px-3 py-2 bg-[#0A0B0E] border rounded-xl text-xs text-white focus:outline-hidden font-mono ${
                        confirmPassword && password !== confirmPassword
                          ? "border-rose-500 text-rose-300"
                          : "border-[#252E3E] focus:border-[#C5A267]"
                      }`}
                    />
                  </div>
                </div>

                {/* Password Notice */}
                <div className="p-2.5 bg-[#0B0D12] rounded-xl border border-[#1F2937] flex items-start gap-2 text-[11px] text-[#94A3B8]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C5A267] shrink-0 mt-0.5" />
                  <span>
                    <strong>Tips Mengingat:</strong> Anda dapat menggunakan tanggal lahir (format: <code className="text-[#C5A267]">DDMMYYYY</code>) atau nomor PIN rahasia yang mudah Anda ingat.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Dokumen akan diekspor tanpa enkripsi password. Pastikan Anda menyimpannya di perangkat pribadi yang aman.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#94A3B8]">
            Format: <strong className="text-white">PDF A4 Resmi</strong> • Standar Privasi EMR Medis
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold border border-[#252E3E] transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting || (isPasswordProtected && (!password || password !== confirmPassword))}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-all cursor-pointer"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Mengekspor & Mengenkripsi...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Unduh PDF {isPasswordProtected ? "Terenkripsi" : ""}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
