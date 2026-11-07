import React, { useState, useEffect } from "react";
import { X, Target, Check, RotateCcw, Sparkles } from "lucide-react";
import { SpiritualDailyGoal } from "../types";

interface GoalNumericalTargetModalProps {
  goal: SpiritualDailyGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveTarget: (goalId: string, targetCount: number, unitLabel: string, currentCount: number) => void;
}

const COMMON_PRESETS = [
  { count: 1, label: "1x (Tunggal)" },
  { count: 3, label: "3x (Sunnah)" },
  { count: 7, label: "7x" },
  { count: 11, label: "11x" },
  { count: 33, label: "33x (Tasbih)" },
  { count: 100, label: "100x (Istighfar/Shalawat)" },
  { count: 300, label: "300x" },
  { count: 1000, label: "1.000x (Dzikir Khusus)" },
];

const UNIT_PRESETS = [
  "x dzikir",
  "kali",
  "ayat",
  "rakaat",
  "siklus",
  "menit",
  "kebaikan",
  "wirid",
];

export const GoalNumericalTargetModal: React.FC<GoalNumericalTargetModalProps> = ({
  goal,
  isOpen,
  onClose,
  onSaveTarget,
}) => {
  const [targetCount, setTargetCount] = useState<number>(33);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [unitLabel, setUnitLabel] = useState<string>("x dzikir");

  useEffect(() => {
    if (goal) {
      setTargetCount(goal.targetCount || 33);
      setCurrentCount(goal.currentCount || 0);
      setUnitLabel(goal.unitLabel || "x dzikir");
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTarget = Math.max(1, targetCount);
    const finalCurrent = Math.max(0, Math.min(finalTarget, currentCount));
    onSaveTarget(goal.id, finalTarget, unitLabel.trim() || "kali", finalCurrent);
    onClose();
  };

  const percent = Math.min(100, Math.round(((currentCount || 0) / Math.max(1, targetCount)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#141722] border border-[#C5A267]/50 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white font-serif">Atur Target Hitungan Numerik</h4>
              <p className="text-[10px] text-[#94A3B8] truncate max-w-[240px]">{goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview of the Ring & Target */}
        <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
              Progres Hitungan
            </span>
            <div className="text-lg font-bold font-mono text-[#F3E8D2] mt-0.5">
              {currentCount} / {targetCount} <span className="text-xs text-[#C5A267]">{unitLabel}</span>
            </div>
            <span className="text-[11px] text-[#94A3B8]">{percent}% Tercapai Hari Ini</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentCount(0)}
              className="px-2.5 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-xl text-xs flex items-center gap-1 border border-[#252E3E] cursor-pointer"
              title="Reset hitungan ke 0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentCount(targetCount)}
              className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              title="Set penuh langsung"
            >
              <Check className="w-3 h-3" />
              <span>Penuh</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Count Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#CBD5E1]">
                Target Harian (Jumlah / Frekuensi) *
              </label>
              <span className="text-[10px] text-[#C5A267] font-mono">{targetCount} {unitLabel}</span>
            </div>
            <input
              type="number"
              min={1}
              max={100000}
              required
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
              className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none"
            />
          </div>

          {/* Quick Target Presets */}
          <div>
            <span className="block text-[10px] text-[#94A3B8] mb-1.5">Pilihan Cepat Target Sunnah:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p) => (
                <button
                  key={p.count}
                  type="button"
                  onClick={() => setTargetCount(p.count)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                    targetCount === p.count
                      ? "bg-[#C5A267] text-black font-bold border-[#C5A267]"
                      : "bg-[#181C26] text-[#94A3B8] hover:text-white border-[#252E3E]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Label */}
          <div>
            <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1.5">
              Satuan Amalan (Unit Label)
            </label>
            <input
              type="text"
              placeholder="Contoh: x dzikir, ayat, rakaat, kali"
              value={unitLabel}
              onChange={(e) => setUnitLabel(e.target.value)}
              className="w-full bg-[#0E1015] border border-[#252E3E] focus:border-[#C5A267] rounded-xl px-3.5 py-2 text-white outline-none mb-1.5"
            />
            <div className="flex flex-wrap gap-1">
              {UNIT_PRESETS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnitLabel(u)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    unitLabel === u
                      ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] font-semibold"
                      : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-[#1F2937]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] rounded-xl font-semibold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-[#C5A267]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Terapkan Target</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
