import React, { useState } from "react";
import {
  X,
  Bell,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Wind,
  Heart,
  Sliders,
  Play,
  ShieldCheck,
  Zap,
  ArrowRight,
  Plus
} from "lucide-react";
import { SpiritualDailyGoal, GoalCategory } from "../types";

interface GoalScheduleTimelineModalProps {
  goals: SpiritualDailyGoal[];
  isOpen: boolean;
  onClose: () => void;
  onOpenGoalConfig?: (goal: SpiritualDailyGoal) => void;
  onConfigureGoalReminder?: (goal: SpiritualDailyGoal) => void;
  onToggleGoalReminder: (goalId: string, enabled: boolean) => void;
  onToggleAllReminders: (enabled: boolean) => void;
  onTriggerTestPush: (goal: SpiritualDailyGoal) => void;
  onAddNewGoal?: () => void;
}

export const GoalScheduleTimelineModal: React.FC<GoalScheduleTimelineModalProps> = ({
  goals,
  isOpen,
  onClose,
  onOpenGoalConfig,
  onConfigureGoalReminder,
  onToggleGoalReminder,
  onToggleAllReminders,
  onTriggerTestPush,
  onAddNewGoal,
}) => {
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  if (!isOpen) return null;

  const handleOpenConfig = (goal: SpiritualDailyGoal) => {
    if (onConfigureGoalReminder) onConfigureGoalReminder(goal);
    else if (onOpenGoalConfig) onOpenGoalConfig(goal);
  };

  // Sort goals chronologically by reminder time
  const sortedGoals = [...goals].sort((a, b) => {
    const timeA = a.reminder?.time || "99:99";
    const timeB = b.reminder?.time || "99:99";
    return timeA.localeCompare(timeB);
  });

  const activeRemindersCount = goals.filter((g) => g.reminder?.enabled).length;

  const handleRequestNativePermission = async () => {
    if (typeof Notification !== "undefined") {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
      } catch (err) {
        // Fallback
      }
    }
  };

  const getCategoryIcon = (category: GoalCategory) => {
    switch (category) {
      case "quran":
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case "breathing":
        return <Wind className="w-4 h-4 text-sky-400" />;
      case "dzikir":
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case "gratitude":
      case "charity":
        return <Heart className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#C5A267]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#111318] border border-[#C5A267]/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-white shadow-2xl relative">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F2937]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#C5A267]/15 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shadow-sm shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-[#C5A267]/15 border border-[#C5A267]/30 text-[#C5A267] rounded-full text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                Agenda & Jadwal Harian • Spiritual Routine
              </span>
              <h3 className="text-xl font-bold font-serif text-white">
                Jadwal Pengingat Ruhani Terjadwal
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-xl transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Controls & Summary Banner */}
        <div className="mt-6 p-4 sm:p-5 bg-[#141720] border border-[#252E3E] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {activeRemindersCount} dari {goals.length} Pengingat Aktif
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                {Math.round((activeRemindersCount / (goals.length || 1)) * 100)}% Terjadwal
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Notifikasi suara & kartu push akan muncul sesuai jam yang telah Anda atur.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeRemindersCount < goals.length ? (
              <button
                type="button"
                onClick={() => onToggleAllReminders(true)}
                className="px-3 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Aktifkan Semua
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleAllReminders(false)}
                className="px-3 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white border border-[#252E3E] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Heningkan Semua
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const target = sortedGoals.find((g) => g.reminder?.enabled) || sortedGoals[0];
                if (target) onTriggerTestPush(target);
              }}
              className="px-3 py-1.5 bg-[#1C202C] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Uji coba notifikasi push langsung"
            >
              <Zap className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>Tes Notifikasi</span>
            </button>
          </div>
        </div>

        {/* Chronological Timeline List */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Urutan Kronologis Waktu Ibadah & Tazkiyah</span>
          </h4>

          <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#252E3E] before:hidden sm:before:block">
            {sortedGoals.map((goal) => {
              const reminder = goal.reminder;
              const isEnabled = reminder?.enabled ?? false;
              const timeDisplay = reminder?.time || "Belum diatur";
              const periodDisplay = reminder?.periodLabel || "Waktu Khusus";

              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative ${
                    isEnabled
                      ? "bg-[#0E1015] border-[#252E3E] hover:border-[#C5A267]/50"
                      : "bg-[#0E1015]/60 border-[#1F2937] opacity-70"
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    
                    {/* Time Pill Badge */}
                    <div className="flex flex-col items-center justify-center w-14 sm:w-16 py-2 px-1 rounded-xl bg-[#181C26] border border-[#252E3E] text-center shrink-0">
                      <span className="text-xs sm:text-sm font-mono font-bold text-[#C5A267]">
                        {timeDisplay}
                      </span>
                      <span className="text-[9px] text-[#94A3B8] truncate max-w-full font-semibold">
                        {periodDisplay.split("/")[0] || "Jadwal"}
                      </span>
                    </div>

                    {/* Goal Title & Category Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-5 h-5 rounded-md bg-[#1C202C] flex items-center justify-center shrink-0">
                          {getCategoryIcon(goal.category)}
                        </div>
                        <h5 className="text-sm font-bold text-white truncate">
                          {goal.title}
                        </h5>
                      </div>

                      <p className="text-xs text-[#94A3B8] line-clamp-1">
                        {reminder?.customMessage || goal.subtitle || "Pengingat ketenangan batin"}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C5A267]" />
                          ~{goal.estimatedMinutes || 3} mnt
                        </span>
                        {reminder?.soundEnabled !== false && (
                          <span className="flex items-center gap-1 text-emerald-400/80">
                            <Volume2 className="w-3 h-3" />
                            {reminder?.soundType ? reminder.soundType.replace("_", " ") : "Solfeggio 528Hz"}
                          </span>
                        )}
                        <span className="text-[#94A3B8]">
                          • {reminder?.repeatFrequency === "weekdays" ? "Sen-Jum" : reminder?.repeatFrequency === "weekends" ? "Sab-Ahd" : "Tiap Hari"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions: Toggle + Edit settings */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto border-t sm:border-t-0 border-[#1F2937] pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
                    
                    <button
                      type="button"
                      onClick={() => onToggleGoalReminder(goal.id, !isEnabled)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isEnabled
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-[#181C26] text-[#64748B] border-[#252E3E]"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isEnabled ? "Aktif" : "Nonaktif"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        handleOpenConfig(goal);
                      }}
                      className="px-3 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-[#C5A267] border border-[#252E3E] hover:border-[#C5A267]/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Atur Jam & Nada</span>
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Native Web Push Status Bar */}
        <div className="mt-6 p-4 bg-[#0E1015] border border-[#252E3E] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#94A3B8]">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Status Izin Push Notification</span>
              <span className="text-[11px]">
                {browserPermission === "granted"
                  ? "✓ Browser siap menerima notifikasi saat jam pengingat tiba."
                  : "Aktifkan notifikasi web browser untuk pengingat yang lebih andal."}
              </span>
            </div>
          </div>

          {browserPermission !== "granted" && typeof Notification !== "undefined" && (
            <button
              type="button"
              onClick={handleRequestNativePermission}
              className="px-4 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer shadow-md"
            >
              Izinkan Notifikasi Web
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between">
          {onAddNewGoal ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNewGoal();
              }}
              className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Target Baru</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E] rounded-xl text-xs font-semibold cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
