import React, { useEffect, useState } from "react";
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Wind,
  Heart,
  Volume2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { SpiritualDailyGoal, GoalCategory } from "../types";
import { soundSynth } from "../utils/audioChime";

interface GoalPushNotificationToastProps {
  goal: SpiritualDailyGoal | null;
  isVisible: boolean;
  onDismiss?: () => void;
  onClose?: () => void;
  onCompleteGoal: (goalId: string) => void;
  onExecuteGoalAction?: (goal: SpiritualDailyGoal) => void;
  onExecuteAction?: (goal: SpiritualDailyGoal) => void;
  onSnooze?: (goalId: string, minutes: number) => void;
  onSnoozeGoal?: (goalId: string, minutes: number) => void;
}

export const GoalPushNotificationToast: React.FC<GoalPushNotificationToastProps> = ({
  goal,
  isVisible,
  onDismiss,
  onClose,
  onCompleteGoal,
  onExecuteGoalAction,
  onExecuteAction,
  onSnooze,
  onSnoozeGoal,
}) => {
  const [isSnoozed, setIsSnoozed] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else if (onDismiss) onDismiss();
  };

  const handleSnooze = (minutes: number) => {
    if (!goal) return;
    setIsSnoozed(true);
    if (onSnoozeGoal) onSnoozeGoal(goal.id, minutes);
    else if (onSnooze) onSnooze(goal.id, minutes);
  };

  const handleAction = () => {
    if (!goal) return;
    if (onExecuteAction) onExecuteAction(goal);
    else if (onExecuteGoalAction) onExecuteGoalAction(goal);
  };

  useEffect(() => {
    if (isVisible && goal) {
      setIsSnoozed(false);
      // Play sound if configured
      if (goal.reminder?.soundEnabled !== false) {
        soundSynth.playSoundByType(goal.reminder?.soundType || "gentle_chime");
      }

      // Also trigger browser notification if permission granted
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification(`Pengingat Ruhani: ${goal.title}`, {
            body: goal.reminder?.customMessage || goal.subtitle || "Waktunya jeda sejenak untuk ketenangan hati.",
            icon: "/favicon.ico",
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isVisible, goal]);

  if (!isVisible || !goal) return null;

  // Category styling
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

  const timeLabel = goal.reminder?.time || "Sekarang";
  const periodLabel = goal.reminder?.periodLabel || "Waktu Terjadwal";
  const messageText =
    goal.reminder?.customMessage ||
    goal.subtitle ||
    `Luangkan ${goal.estimatedMinutes || 3} menit untuk merawat ketenangan jiwa Anda.`;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-slideDown shadow-2xl">
      <div className="bg-[#12151E]/95 border-2 border-[#C5A267] rounded-3xl p-5 text-white shadow-2xl backdrop-blur-md relative overflow-hidden ring-4 ring-[#C5A267]/15">
        
        {/* Top Glowing Ambient Accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A267]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C5A267] text-black flex items-center justify-center font-bold shadow-md shadow-[#C5A267]/30 shrink-0">
              {getCategoryIcon(goal.category)}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-[10px] font-bold uppercase tracking-wider">
                  🔔 Pengingat Ruhani
                </span>
                <span className="text-[11px] font-mono text-[#CBD5E1] font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C5A267]" />
                  {timeLabel} • {periodLabel}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-serif mt-0.5 leading-snug">
                {goal.title}
              </h4>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-[#94A3B8] hover:text-white p-1.5 hover:bg-[#1F2937] rounded-full transition-colors cursor-pointer shrink-0"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Quote Box */}
        <div className="my-3 p-3 bg-[#0B0D12]/90 border border-[#252E3E] rounded-xl relative z-10 text-xs text-[#E2E8F0] leading-relaxed">
          <p className="italic text-[#F3E8D2] font-serif">
            "{messageText}"
          </p>
          {goal.estimatedMinutes && (
            <span className="text-[10px] text-[#94A3B8] mt-1.5 block font-mono">
              ⏱️ Estimasi durasi: ~{goal.estimatedMinutes} menit
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1F2937] relative z-10">
          
          {/* Snooze button */}
          <button
            type="button"
            onClick={() => handleSnooze(10)}
            className="px-3 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3 h-3 text-[#C5A267]" />
            <span>Tunda 10 Menit</span>
          </button>

          <div className="flex items-center space-x-2">
            {/* Quick Action button */}
            {(onExecuteAction || onExecuteGoalAction) && (
              <button
                type="button"
                onClick={handleAction}
                className="px-3 py-1.5 bg-[#1C2230] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span>Mulai Sekarang</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Instant Mark Complete */}
            <button
              type="button"
              onClick={() => onCompleteGoal(goal.id)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Selesai</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
