import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  Sparkles,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
  RotateCcw,
  Zap,
  Heart,
  BarChart3,
  LineChart as LineChartIcon,
  Download
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  getPast7DaysDzikirHistory,
  incrementTodayDzikirCount,
  resetTodayDzikirCount,
  DzikirDayRecord
} from "../utils/dzikirHistory";
import { soundSynth } from "../utils/audioChime";
import { ExportDzikirReportModal } from "./ExportDzikirReportModal";

interface DailyDzikirProgressChartProps {
  onOpenDzikirSidebar?: () => void;
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DzikirDayRecord = payload[0].payload;
    const isTargetMet = data.count >= data.target;

    return (
      <div className="bg-[#141722] border border-[#C5A267]/60 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md min-w-[200px] text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-[#252E3E] pb-2 mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A267]" />
            {data.dayName}, {data.dateFormatted}
          </span>
          {data.isToday && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-bold">
              Hari Ini
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A267]" />
              Total Dzikir:
            </span>
            <span className="font-bold font-mono text-base text-[#C5A267]">
              {data.count.toLocaleString("id-ID")}{" "}
              <span className="text-[10px] font-normal text-[#94A3B8]">kali</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Target Harian:</span>
            <span className="font-mono text-white font-semibold">
              {data.target} kali
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Sesi / Putaran:</span>
            <span className="font-mono text-white">
              ~{data.sessions} putaran
            </span>
          </div>

          <div className="pt-1.5 border-t border-[#1F2937] flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">Status Capaian:</span>
            {isTargetMet ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                Tercapai ({data.completionRate}%)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold text-[11px]">
                Kurang {data.target - data.count}x ({data.completionRate}%)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const DailyDzikirProgressChart: React.FC<DailyDzikirProgressChartProps> = ({
  onOpenDzikirSidebar
}) => {
  const [data, setData] = useState<DzikirDayRecord[]>([]);
  const [chartViewMode, setChartViewMode] = useState<"count" | "rate">("count");
  const [justAddedCount, setJustAddedCount] = useState<boolean>(false);
  const [isExportPDFModalOpen, setIsExportPDFModalOpen] = useState<boolean>(false);

  // Load and subscribe to dzikir updates
  const refreshData = () => {
    const history = getPast7DaysDzikirHistory();
    setData(history);
  };

  useEffect(() => {
    refreshData();

    const handleUpdate = () => {
      refreshData();
    };

    window.addEventListener("limocity_dzikir_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("limocity_dzikir_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Calculate high-level summary metrics
  const total7DaysCount = data.reduce((acc, curr) => acc + curr.count, 0);
  const averageDailyCount = data.length > 0 ? Math.round(total7DaysCount / data.length) : 0;
  
  const peakDay = data.reduce<DzikirDayRecord | null>((max, curr) => {
    if (!max || curr.count > max.count) return curr;
    return max;
  }, null);

  const daysTargetMet = data.filter((d) => d.count >= d.target).length;
  const targetCompliancePercent = data.length > 0 ? Math.round((daysTargetMet / data.length) * 100) : 0;

  // Handle Quick Tap +33 Dzikir right from the chart section
  const handleQuickAddDzikir = () => {
    const updated = incrementTodayDzikirCount(33);
    setData(updated);
    setJustAddedCount(true);
    setTimeout(() => setJustAddedCount(false), 2000);

    try {
      soundSynth.playTasbihClick();
    } catch (e) {}

    // If today reached target, trigger celebration
    const todayRec = updated.find((d) => d.isToday);
    if (todayRec && todayRec.count >= todayRec.target) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6, x: 0.5 },
          colors: ["#C5A267", "#E6CA85", "#FFFFFF", "#10B981"]
        });
      } catch (e) {}
    }
  };

  const handleResetToday = () => {
    if (confirm("Reset hitungan dzikir hari ini kembali ke 0?")) {
      const updated = resetTodayDzikirCount();
      setData(updated);
    }
  };

  return (
    <div className="bg-[#111318] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#C5A267]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1F2937]">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-[#C5A267]/15 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>Visualisasi Kemajuan Ruhani • 7-Day Dzikir Analytics</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#94A3B8] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <span>7 Hari Terakhir</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Grafik Konsistensi & Capaian Dzikir Harian
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Pantau fluktuasi zikir dan istiqomah hati Anda sepanjang 7 hari terakhir untuk memelihara motivasi spiritual serta ketenteraman batin (*Thuma'ninah*).
          </p>
        </div>

        {/* View Mode & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* Chart Toggle View */}
          <div className="bg-[#181C26] border border-[#252E3E] rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setChartViewMode("count")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartViewMode === "count"
                  ? "bg-[#C5A267] text-black font-bold shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>Jumlah Dzikir</span>
            </button>
            <button
              onClick={() => setChartViewMode("rate")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartViewMode === "rate"
                  ? "bg-[#C5A267] text-black font-bold shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Persentase Target (%)</span>
            </button>
          </div>

          {/* Quick Add +33 Button */}
          <button
            onClick={handleQuickAddDzikir}
            className={`px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              justAddedCount ? "ring-2 ring-emerald-300 scale-105" : ""
            }`}
            title="Tambah 1 putaran tasbih (+33 dzikir) untuk hari ini"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+33 Hari Ini</span>
          </button>

          {/* Download Visual PDF Report Button */}
          <button
            id="download-dzikir-pdf-btn"
            onClick={() => setIsExportPDFModalOpen(true)}
            className="px-3.5 py-2 bg-[#181C26] hover:bg-[#202534] border border-[#C5A267]/50 text-[#C5A267] hover:text-[#F3E8D2] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Unduh Laporan Visual Evaluasi Diri Dzikir Harian (PDF)"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A267]" />
            <span>Unduh PDF</span>
          </button>

          {/* Open Full Sidebar */}
          {onOpenDzikirSidebar && (
            <button
              onClick={onOpenDzikirSidebar}
              className="px-3.5 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Buka Tasbih</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        {/* Metric 1: 7-Day Total */}
        <div className="bg-[#0E1015] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total 7 Hari</span>
            <div className="w-7 h-7 rounded-lg bg-[#C5A267]/15 flex items-center justify-center text-[#C5A267]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">
              {total7DaysCount.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-[#94A3B8]">kali</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">
            Akumulasi dzikir shahih
          </p>
        </div>

        {/* Metric 2: Daily Average */}
        <div className="bg-[#0E1015] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Rata-Rata Harian</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-sky-400">
              {averageDailyCount}
            </span>
            <span className="text-xs text-[#94A3B8]">kali / hari</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">
            Target ideal: ≥100 kali
          </p>
        </div>

        {/* Metric 3: Peak Day */}
        <div className="bg-[#0E1015] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Puncak Tertinggi</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {peakDay ? peakDay.count : 0}
            </span>
            <span className="text-xs text-[#94A3B8]">kali</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1 truncate">
            {peakDay ? `Tercatat pada ${peakDay.dayName}` : "Belum ada data"}
          </p>
        </div>

        {/* Metric 4: Target Compliance */}
        <div className="bg-[#0E1015] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Capaian Target</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {targetCompliancePercent}%
            </span>
            <span className="text-xs text-[#94A3B8]">({daysTargetMet}/7 hari)</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">
            Hari memenuhi kuota 100x
          </p>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="relative z-10 bg-[#0E1015] border border-[#1F2937] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#C5A267] shadow-sm shadow-[#C5A267]/50" />
            <span className="text-xs font-bold text-white">
              {chartViewMode === "count" ? "Trend Dzikir Harian (Kali)" : "Persentase Pemenuhan Target Harian (%)"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-[#C5A267]" />
              <span>Realisasi Dzikir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-emerald-500/60 border-b border-dashed border-emerald-400" />
              <span>Garis Target (100x)</span>
            </div>
          </div>
        </div>

        {/* Recharts Component */}
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="dzikirGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A267" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C5A267" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />

              <XAxis
                dataKey="shortLabel"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#252E3E" }}
              />

              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#252E3E" }}
                domain={chartViewMode === "count" ? [0, "auto"] : [0, 120]}
                unit={chartViewMode === "rate" ? "%" : ""}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Target Benchmark Reference Line */}
              {chartViewMode === "count" ? (
                <ReferenceLine
                  y={100}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.8}
                  label={{
                    value: "Target 100",
                    fill: "#10B981",
                    fontSize: 10,
                    position: "insideTopRight"
                  }}
                />
              ) : (
                <ReferenceLine
                  y={100}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.8}
                  label={{
                    value: "100%",
                    fill: "#10B981",
                    fontSize: 10,
                    position: "insideTopRight"
                  }}
                />
              )}

              {/* Shaded Area */}
              <Area
                type="monotone"
                dataKey={chartViewMode === "count" ? "count" : "completionRate"}
                stroke={chartViewMode === "count" ? "#C5A267" : "#10B981"}
                strokeWidth={3}
                fillOpacity={1}
                fill={chartViewMode === "count" ? "url(#dzikirGradient)" : "url(#rateGradient)"}
                activeDot={{
                  r: 6,
                  fill: chartViewMode === "count" ? "#C5A267" : "#10B981",
                  stroke: "#FFFFFF",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Small Bottom Day Tracker Pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-4 pt-4 border-t border-[#1F2937]">
          {data.map((day) => (
            <div
              key={day.dateKey}
              className={`p-2 rounded-xl border text-center transition-all ${
                day.isToday
                  ? "bg-[#C5A267]/15 border-[#C5A267] text-[#C5A267] font-bold"
                  : day.count >= day.target
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-400"
                  : "bg-[#141720] border-[#1F2937] text-[#94A3B8]"
              }`}
            >
              <span className="text-[10px] block uppercase font-medium">
                {day.dayOnly}
              </span>
              <span className="text-xs font-mono font-bold block text-white mt-0.5">
                {day.count}x
              </span>
              <span className="text-[9px] block text-[#64748B]">
                {day.isToday ? "Hari Ini" : day.dateFormatted}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Istiqomah Hadith Footer Banner */}
      <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-[#181C26] via-[#141722] to-[#181C26] border border-[#252E3E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shrink-0 mt-0.5">
            <Heart className="w-4 h-4 text-[#C5A267]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Hikmah Keutamaan Istiqomah</span>
              <span className="text-[10px] text-[#C5A267] font-normal">• HR. Muslim No. 783</span>
            </h5>
            <p className="text-xs text-[#94A3B8] italic mt-0.5 leading-relaxed">
              "Amalan yang paling dicintai oleh Allah Ta'ala adalah amalan yang berkelanjutan (istiqomah), walaupun jumlahnya sedikit."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleResetToday}
            className="text-[11px] text-[#64748B] hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset capaian hari ini jika ingin mengulang"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Hari Ini</span>
          </button>
        </div>
      </div>

      {/* Export Dzikir Progress PDF Report Modal */}
      <ExportDzikirReportModal
        isOpen={isExportPDFModalOpen}
        onClose={() => setIsExportPDFModalOpen(false)}
        data={data}
      />
    </div>
  );
};
