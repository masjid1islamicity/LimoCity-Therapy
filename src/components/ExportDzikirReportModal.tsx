import React, { useState } from "react";
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Check, 
  Eye, 
  Flame, 
  ShieldCheck,
  Layers,
  FileCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import { DzikirDayRecord } from "../utils/dzikirHistory";
import { generateDzikirProgressPDF, DzikirPDFExportOptions } from "../utils/dzikirPDFExport";
import { soundSynth } from "../utils/audioChime";

interface ExportDzikirReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DzikirDayRecord[];
  defaultUserName?: string;
}

export const ExportDzikirReportModal: React.FC<ExportDzikirReportModalProps> = ({
  isOpen,
  onClose,
  data,
  defaultUserName = "Ahmad Rizky Pratama",
}) => {
  const [userName, setUserName] = useState<string>(defaultUserName);
  const [userEmail, setUserEmail] = useState<string>("ahmad.rizky@example.com");
  const [includeTable, setIncludeTable] = useState<boolean>(true);
  const [includeReflections, setIncludeReflections] = useState<boolean>(true);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate Summary metrics
  const total7Days = data.reduce((acc, curr) => acc + curr.count, 0);
  const avgCount = data.length > 0 ? Math.round(total7Days / data.length) : 0;
  const daysMet = data.filter((d) => d.count >= d.target).length;
  const targetPct = data.length > 0 ? Math.round((daysMet / data.length) * 100) : 0;
  let peakDay: DzikirDayRecord | null = null;
  data.forEach((curr) => {
    if (!peakDay || curr.count > peakDay.count) {
      peakDay = curr;
    }
  });

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await generateDzikirProgressPDF(data, {
        userName: userName.trim() || "Pengguna LimoCity",
        userEmail: userEmail.trim(),
        evaluationPeriod: "7 Hari Terakhir",
        includeTable,
        includeReflections,
        includeRecommendations,
      });

      setExportSuccess(true);

      // Play soft celebratory chime
      try {
        soundSynth.playPeacefulBell();
      } catch (e) {}

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6, x: 0.5 },
          colors: ["#C5A267", "#10B981", "#38BDF8", "#FFFFFF"]
        });
      } catch (e) {}

      // Auto close after 2.5 seconds or let user close
      setTimeout(() => {
        setExportSuccess(false);
        setIsExporting(false);
      }, 3000);
    } catch (err) {
      console.error("Gagal mengekspor PDF:", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#12151E] border border-[#C5A267]/50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#E2E8F0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E2330]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shadow-sm">
              <Download className="w-5 h-5 text-[#C5A267]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <span>Unduh Laporan Evaluasi Diri (PDF)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267]">
                  Dzikir Harian
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Rangkuman visual konsistensi dan capaian dzikir 7 hari untuk evaluasi pribadi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E2330] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics Preview */}
          <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-4">
            <span className="text-[11px] font-bold text-[#C5A267] uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ringkasan Data yang Akan Dicetak ke PDF:</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-[#141722] border border-[#1E2330]">
                <span className="text-[10px] text-[#94A3B8] block">Total Dzikir</span>
                <span className="text-base font-bold font-mono text-white">
                  {total7Days.toLocaleString("id-ID")}x
                </span>
                <span className="text-[9px] text-[#64748B] block">7 Hari</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141722] border border-[#1E2330]">
                <span className="text-[10px] text-[#94A3B8] block">Rata-Rata</span>
                <span className="text-base font-bold font-mono text-sky-400">
                  {avgCount}x
                </span>
                <span className="text-[9px] text-[#64748B] block">per hari</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141722] border border-[#1E2330]">
                <span className="text-[10px] text-[#94A3B8] block">Capaian Target</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {targetPct}%
                </span>
                <span className="text-[9px] text-[#64748B] block">{daysMet}/7 hari</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141722] border border-[#1E2330]">
                <span className="text-[10px] text-[#94A3B8] block">Puncak</span>
                <span className="text-base font-bold font-mono text-amber-400">
                  {peakDay ? peakDay.count : 0}x
                </span>
                <span className="text-[9px] text-[#64748B] block">{peakDay?.dayName || "-"}</span>
              </div>
            </div>
          </div>

          {/* Form Options: User Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Nama Pengguna / Pasien di Dokumen:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Alamat Email (Opsional):
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Report Sections Customization */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-white block">
              Pilihan Komponen Dokumen PDF:
            </span>

            <div className="space-y-2">
              <label className="p-3 rounded-2xl bg-[#0E1015] border border-[#252E3E] flex items-center justify-between gap-3 cursor-pointer hover:border-[#38445C] transition-colors">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#C5A267] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Tabel Rincian 7 Hari & Grafis Progres
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Tabel tanggal demi tanggal lengkap dengan status target capaian dan progress bar visual.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeTable}
                  onChange={(e) => setIncludeTable(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A267] rounded cursor-pointer shrink-0"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#0E1015] border border-[#252E3E] flex items-center justify-between gap-3 cursor-pointer hover:border-[#38445C] transition-colors">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Catatan Refleksi & Muhasabah Kalbu Terakhir
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Menyertakan kutipan catatan perasaan pasca dzikir dan syukur yang tercatat di browser Anda.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeReflections}
                  onChange={(e) => setIncludeReflections(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A267] rounded cursor-pointer shrink-0"
                />
              </label>

              <label className="p-3 rounded-2xl bg-[#0E1015] border border-[#252E3E] flex items-center justify-between gap-3 cursor-pointer hover:border-[#38445C] transition-colors">
                <div className="flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Panduan Evaluasi Diri & Hikmah Istiqomah (HR. Muslim)
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Nasihat aplikatif tazkiyatun nafs dan kutipan hadits untuk menjaga kontinuitas amalan.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeRecommendations}
                  onChange={(e) => setIncludeRecommendations(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A267] rounded cursor-pointer shrink-0"
                />
              </label>
            </div>
          </div>

          {/* Success Alert */}
          {exportSuccess && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Alhamdulillah! Dokumen PDF evaluasi diri berhasil diunduh ke perangkat Anda.
              </span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#1E2330] bg-[#0E1015]">
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Format PDF Siap Cetak (A4)</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#252E3E] text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#C5A267]/20 transition-all cursor-pointer"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Berhasil Diunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Unduh Dokumen PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
