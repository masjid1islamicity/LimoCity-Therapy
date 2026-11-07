import React, { useState, useMemo } from "react";
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
  RefreshCw,
  Feather,
  BookOpen,
  Filter,
  Check,
  Copy,
  Layers,
  Shield
} from "lucide-react";
import confetti from "canvas-confetti";
import { JournalEntry } from "../types";
import { generateSecureJournalReport, JournalExportOptions } from "../utils/pdfExport";

interface ExportJournalPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  selectedEntry?: JournalEntry | null;
  patientName?: string;
}

export const ExportJournalPDFModal: React.FC<ExportJournalPDFModalProps> = ({
  isOpen,
  onClose,
  entries,
  selectedEntry,
  patientName = "Ahmad Rizky Pratama"
}) => {
  // Client & Clinical Demographics
  const [formPatientName, setFormPatientName] = useState<string>(patientName);
  const [patientEmail, setPatientEmail] = useState<string>("ahmad.rizky@example.com");
  const [patientPhone, setPatientPhone] = useState<string>("+62 812-8899-2311");
  const [emrNumber, setEmrNumber] = useState<string>("EMR-LC-2026-88492");
  const [therapistName, setTherapistName] = useState<string>("dr. Nurul Hidayati, Sp.KJ, M.Kes");

  // Export Scope Selection
  const [exportScope, setExportScope] = useState<"all" | "selected" | "favorites" | "tagged">(
    selectedEntry ? "selected" : "all"
  );
  const [selectedTag, setSelectedTag] = useState<string>("Syukur");

  // Privacy & Sharing Mode
  const [privacyMode, setPrivacyMode] = useState<"full" | "redacted_narrative" | "insights_only">("full");

  // Content Customization Toggles
  const [includeAISentiment, setIncludeAISentiment] = useState<boolean>(true);
  const [includeQuranicAnchor, setIncludeQuranicAnchor] = useState<boolean>(true);
  const [includeCustomDua, setIncludeCustomDua] = useState<boolean>(true);
  const [includeTherapistNotesSection, setIncludeTherapistNotesSection] = useState<boolean>(true);
  const [includeOfficialSeal, setIncludeOfficialSeal] = useState<boolean>(true);

  // Password & Security State
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("LimoCity2026*");
  const [confirmPassword, setConfirmPassword] = useState<string>("LimoCity2026*");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [entries]);

  // Compute filtered count and stats
  const previewEntries = useMemo(() => {
    if (exportScope === "selected" && selectedEntry) {
      return [selectedEntry];
    }
    if (exportScope === "favorites") {
      return entries.filter((e) => e.isFavorite);
    }
    if (exportScope === "tagged") {
      return entries.filter((e) => e.tags.includes(selectedTag));
    }
    return entries;
  }, [entries, exportScope, selectedEntry, selectedTag]);

  const previewStats = useMemo(() => {
    const count = previewEntries.length;
    const totalWords = previewEntries.reduce((acc, curr) => acc + curr.wordCount, 0);
    const scores = previewEntries
      .map((e) => e.sentimentAnalysis?.sakinahScore)
      .filter((s): s is number => typeof s === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 85;
    const estimatedPages = Math.max(1, Math.ceil(count * 1.2) + (includeTherapistNotesSection ? 1 : 0));

    return { count, totalWords, avgScore, estimatedPages };
  }, [previewEntries, includeTherapistNotesSection]);

  if (!isOpen) return null;

  const handleGenerateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(randomPin);
    setConfirmPassword(randomPin);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 3000);
  };

  const handleExportPDF = async () => {
    setErrorMessage(null);

    if (isPasswordProtected) {
      if (!password || password.trim().length < 4) {
        setErrorMessage("Kata sandi minimal 4 karakter untuk mengamankan data refleksi batin Anda.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
        return;
      }
    }

    if (previewEntries.length === 0) {
      setErrorMessage("Tidak ada catatan jurnal yang terpilih untuk diekspor.");
      return;
    }

    setIsExporting(true);

    try {
      const options: JournalExportOptions = {
        patientName: formPatientName,
        patientEmail,
        patientPhone,
        emrNumber,
        therapistName,
        password: isPasswordProtected ? password : undefined,
        exportScope,
        selectedTag: exportScope === "tagged" ? selectedTag : undefined,
        privacyMode,
        includeAISentiment,
        includeQuranicAnchor,
        includeCustomDua,
        includeTherapistNotesSection,
        includeOfficialSeal,
      };

      await generateSecureJournalReport(previewEntries, options);

      setExportSuccess(true);
      try {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#C5A267", "#10B981", "#FFFFFF"]
        });
      } catch (e) {}

      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (err: any) {
      console.error("Journal PDF Export error:", err);
      setErrorMessage("Gagal membuat dokumen PDF. Silakan coba lagi.");
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      
      <div className="bg-gradient-to-b from-[#141722] via-[#0E1017] to-[#0A0B0E] border border-[#C5A267]/60 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 overflow-hidden">
        
        {/* Header Gold Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-full transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shrink-0 mt-0.5">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-[10px] font-bold uppercase rounded-full">
                Fitur Ekspor Terenkripsi
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Kerahasiaan Medis & Tazkiyah
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Ekspor Jurnal Refleksi & Kolaborasi Terapis (PDF)
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Unduh salinan jurnal refleksi masa lalu dalam format PDF terenkripsi untuk dibagikan secara aman dan didiskusikan bersama psikolog/konselor saat sesi terapi.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {exportSuccess && (
          <div className="mb-5 p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-start gap-3 animate-slideDown">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <span className="font-bold text-white block mb-0.5">
                Dokumen PDF Jurnal Refleksi Berhasil Dibuat & Diunduh!
              </span>
              <p className="text-emerald-200/90 leading-relaxed">
                {isPasswordProtected ? (
                  <span className="flex flex-wrap items-center gap-2 mt-1">
                    <span>File dilindungi kata sandi:</span>
                    <strong className="font-mono bg-black/50 px-2 py-0.5 rounded text-emerald-300 text-xs">
                      {password}
                    </strong>
                    <button
                      onClick={handleCopyPassword}
                      className="px-2 py-0.5 bg-emerald-800/40 hover:bg-emerald-700/50 rounded text-[11px] text-emerald-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPin ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPin ? "Tersalin!" : "Salin Sandi"}</span>
                    </button>
                  </span>
                ) : (
                  <>File PDF jurnal telah tersimpan di folder Unduhan perangkat Anda.</>
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

        {/* Form Body with Scroll */}
        <div className="space-y-5 max-h-[64vh] overflow-y-auto pr-1.5 custom-scrollbar">
          
          {/* 1. Scope Selection (Which entries to export) */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A267]" />
                1. Cakupan Catatan yang Ingin Diekspor
              </span>
              <span className="text-[11px] text-[#C5A267] font-bold">
                {previewStats.count} Catatan Terpilih
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              
              {/* Option A: All Entries */}
              <label
                onClick={() => setExportScope("all")}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  exportScope === "all"
                    ? "bg-[#181C28] border-[#C5A267] shadow-sm shadow-[#C5A267]/10"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  checked={exportScope === "all"}
                  onChange={() => setExportScope("all")}
                  className="mt-0.5 text-[#C5A267] focus:ring-[#C5A267]"
                />
                <div>
                  <span className="font-bold text-white block">Semua Riwayat Jurnal ({entries.length})</span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Ekspor seluruh arsip refleksi dan muhasabah yang pernah Anda tulis.
                  </span>
                </div>
              </label>

              {/* Option B: Selected / Active Entry */}
              <label
                onClick={() => setExportScope("selected")}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  exportScope === "selected"
                    ? "bg-[#181C28] border-[#C5A267] shadow-sm shadow-[#C5A267]/10"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  checked={exportScope === "selected"}
                  onChange={() => setExportScope("selected")}
                  className="mt-0.5 text-[#C5A267] focus:ring-[#C5A267]"
                />
                <div>
                  <span className="font-bold text-white block">
                    Hanya Refleksi Saat Ini (1 Catatan)
                  </span>
                  <span className="text-[11px] text-[#94A3B8] line-clamp-1">
                    "{selectedEntry?.title || entries[0]?.title || "Refleksi Terpilih"}"
                  </span>
                </div>
              </label>

              {/* Option C: Favorites Only */}
              <label
                onClick={() => setExportScope("favorites")}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  exportScope === "favorites"
                    ? "bg-[#181C28] border-[#C5A267] shadow-sm shadow-[#C5A267]/10"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  checked={exportScope === "favorites"}
                  onChange={() => setExportScope("favorites")}
                  className="mt-0.5 text-[#C5A267] focus:ring-[#C5A267]"
                />
                <div>
                  <span className="font-bold text-white block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    Hanya Catatan Favorit / Berbintang ({entries.filter(e => e.isFavorite).length})
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Hanya mencetak entri yang Anda tandai sebagai catatan paling penting.
                  </span>
                </div>
              </label>

              {/* Option D: Filtered by Tag */}
              <label
                onClick={() => setExportScope("tagged")}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  exportScope === "tagged"
                    ? "bg-[#181C28] border-[#C5A267] shadow-sm shadow-[#C5A267]/10"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  checked={exportScope === "tagged"}
                  onChange={() => setExportScope("tagged")}
                  className="mt-0.5 text-[#C5A267] focus:ring-[#C5A267]"
                />
                <div className="w-full">
                  <span className="font-bold text-white block">Filter Berdasarkan Label / Tag</span>
                  {exportScope === "tagged" ? (
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1.5 w-full px-2 py-1 bg-[#0A0B0E] border border-[#252E3E] rounded-lg text-xs text-[#C5A267] font-semibold"
                    >
                      {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                          #{tag} ({entries.filter(e => e.tags.includes(tag)).length} entri)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[11px] text-[#94A3B8]">
                      Pilih kategori khusus (Tawakkal, Syukur, Kecemasan, dll).
                    </span>
                  )}
                </div>
              </label>

            </div>
          </div>

          {/* 2. Privacy & Clinical Sharing Mode */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#C5A267]" />
                2. Tingkat Sensor Privasi untuk Sesi Terapi
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">
                Kontrol Penuh di Tangan Klien
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              
              {/* Mode 1: Full Narrative */}
              <div
                onClick={() => setPrivacyMode("full")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === "full"
                    ? "bg-[#181C28] border-[#C5A267] ring-1 ring-[#C5A267]/30"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#C5A267]" />
                  <span>Transparan Penuh</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Menampilkan seluruh narasi curahan hati asli, analisis sentimen AI, dan ayat Al-Qur'an.
                </p>
              </div>

              {/* Mode 2: Redacted Narrative */}
              <div
                onClick={() => setPrivacyMode("redacted_narrative")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === "redacted_narrative"
                    ? "bg-[#181C28] border-[#C5A267] ring-1 ring-[#C5A267]/30"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sensor Teks Sensitif</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Menyamarkan paragraf tulisan pribadi, tetapi mempertahankan tema, skor Sakinah, dan tadabbur.
                </p>
              </div>

              {/* Mode 3: Insights Only */}
              <div
                onClick={() => setPrivacyMode("insights_only")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  privacyMode === "insights_only"
                    ? "bg-[#181C28] border-[#C5A267] ring-1 ring-[#C5A267]/30"
                    : "bg-[#0E1015] border-[#252E3E] hover:border-[#374151]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Insight Emosi Saja</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Hanya mencetak rangkuman tren psikologis dan resep tazkiyah untuk bahan diskusi konseling.
                </p>
              </div>

            </div>
          </div>

          {/* 3. Security & Password Protection (AES-128 Encryption) */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C5A267]" />
                3. Proteksi Sandi & Enkripsi Dokumen PDF
              </span>

              <button
                type="button"
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                  isPasswordProtected
                    ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/50"
                    : "bg-[#1A1F2C] text-[#94A3B8] border-[#252E3E]"
                }`}
              >
                {isPasswordProtected ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isPasswordProtected ? "Proteksi Aktif (Direkomendasikan)" : "Tanpa Sandi"}</span>
              </button>
            </div>

            {isPasswordProtected ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#94A3B8] text-[11px] mb-1">
                      Kata Sandi / PIN PDF:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan sandi atau PIN..."
                        className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#C5A267]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] text-[11px] mb-1">
                      Konfirmasi Kata Sandi:
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi..."
                      className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateRandomPin}
                    className="text-[11px] text-[#C5A267] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Buat PIN Klinis 6-Digit Otomatis</span>
                  </button>

                  <span className="text-[11px] text-[#64748B]">
                    Enkripsi AES terpasang langsung di dalam file PDF.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Dokumen akan diekspor tanpa kata sandi. Pastikan Anda hanya membagikan file ini kepada psikolog/terapis yang terpercaya.
                </span>
              </div>
            )}
          </div>

          {/* 4. Content Elements Customization */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#1F2937] pb-2">
              4. Komponen Laporan yang Disertakan
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-[#0E1015] border border-[#252E3E] rounded-xl cursor-pointer hover:border-[#374151]">
                <input
                  type="checkbox"
                  checked={includeAISentiment}
                  onChange={(e) => setIncludeAISentiment(e.target.checked)}
                  className="rounded text-[#C5A267] focus:ring-[#C5A267]"
                />
                <span className="text-[#E2E8F0]">Analisis Sentimen & Umpan Balik AI</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0E1015] border border-[#252E3E] rounded-xl cursor-pointer hover:border-[#374151]">
                <input
                  type="checkbox"
                  checked={includeQuranicAnchor}
                  onChange={(e) => setIncludeQuranicAnchor(e.target.checked)}
                  className="rounded text-[#C5A267] focus:ring-[#C5A267]"
                />
                <span className="text-[#E2E8F0]">Jangkar Ayat Al-Qur'an & Tadabbur</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0E1015] border border-[#252E3E] rounded-xl cursor-pointer hover:border-[#374151]">
                <input
                  type="checkbox"
                  checked={includeCustomDua}
                  onChange={(e) => setIncludeCustomDua(e.target.checked)}
                  className="rounded text-[#C5A267] focus:ring-[#C5A267]"
                />
                <span className="text-[#E2E8F0]">Doa Penenang Jiwa & Latihan Mandiri</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0E1015] border border-[#252E3E] rounded-xl cursor-pointer hover:border-[#374151]">
                <input
                  type="checkbox"
                  checked={includeTherapistNotesSection}
                  onChange={(e) => setIncludeTherapistNotesSection(e.target.checked)}
                  className="rounded text-[#C5A267] focus:ring-[#C5A267]"
                />
                <span className="text-[#E2E8F0]">Lembar Catatan Terapis (Sesi Live)</span>
              </label>
            </div>
          </div>

          {/* 5. Patient & Therapist Details for Header */}
          <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#1F2937] pb-2">
              5. Informasi Identitas pada Lembar Laporan
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">Nama Lengkap Klien:</label>
                <input
                  type="text"
                  value={formPatientName}
                  onChange={(e) => setFormPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] text-[11px] mb-1">Nama Terapis / Konselor:</label>
                <input
                  type="text"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#252E3E] rounded-xl text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions & Summary */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-xs text-[#94A3B8] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C5A267]" />
            <span>
              Estimasi: <strong>{previewStats.count} Catatan</strong> • ±{previewStats.estimatedPages} Halaman PDF
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#252E3E] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer w-1/2 sm:w-auto"
            >
              Tutup
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportPDF}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-all active:scale-95 cursor-pointer w-1/2 sm:w-auto"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyiapkan PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Unduh PDF Terenkripsi</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
