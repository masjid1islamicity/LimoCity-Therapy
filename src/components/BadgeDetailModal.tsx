import React, { useState } from "react";
import {
  X,
  Lock,
  CheckCircle2,
  Share2,
  Sparkles,
  Flame,
  Crown,
  Award,
  ShieldCheck,
  BookOpen,
  Wind,
  Heart,
  Star,
  Sun,
  Medal,
  Calendar,
  Zap,
  Copy,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { SpiritualBadge } from "../types";
import { getBadgeTierStyles } from "../data/spiritualBadgesData";

interface BadgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: SpiritualBadge | null;
  currentStreak: number;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  isOpen,
  onClose,
  badge,
  currentStreak,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const tierStyles = getBadgeTierStyles(badge.tier);

  // Icon mapping
  const renderBadgeIcon = (iconName: string, className = "w-10 h-10") => {
    switch (iconName) {
      case "Flame":
        return <Flame className={className} />;
      case "Crown":
        return <Crown className={className} />;
      case "Award":
        return <Award className={className} />;
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "BookOpen":
        return <BookOpen className={className} />;
      case "Wind":
        return <Wind className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Star":
        return <Star className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Medal":
        return <Medal className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C5A267", "#10B981", "#38BDF8", "#F59E0B", "#FFFFFF"],
      });
    } catch {}
  };

  const handleShare = () => {
    const text = `🏆 Capaian Spiritual LimoCity: Saya telah meraih "${badge.title}" dalam perjalanan Tazkiyatun Nafs dan Istiqomah Harian! 🌿✨`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#111318] border border-[#C5A267]/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 overflow-hidden">
        
        {/* Glow behind badge */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A267]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-full transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Tier */}
        <div className="text-center pt-2 pb-4">
          <div className="relative inline-block mb-3">
            {/* Animated Glow Halo */}
            <div
              className={`absolute -inset-2 rounded-full blur-md opacity-70 animate-pulse bg-gradient-to-r ${tierStyles.gradient}`}
            />
            
            <div
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 flex items-center justify-center shadow-xl ${
                badge.isUnlocked
                  ? `${tierStyles.bg} ${tierStyles.border} ${tierStyles.text}`
                  : "bg-[#181C26] border-[#374151] text-[#64748B] grayscale"
              }`}
            >
              {renderBadgeIcon(badge.iconName, "w-10 h-10 sm:w-12 sm:h-12")}
              
              {!badge.isUnlocked && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#0E1015] border border-[#374151] rounded-full flex items-center justify-center text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}

              {badge.isUnlocked && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 border border-emerald-400 rounded-full flex items-center justify-center text-black shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${tierStyles.pill}`}
            >
              {tierStyles.label}
            </span>
            {badge.xpReward && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#181C26] border border-[#252E3E] text-[#C5A267] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#C5A267]" />
                +{badge.xpReward} XP Ruhani
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            {badge.title}
          </h3>

          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 leading-relaxed">
            {badge.description}
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-[#0A0B0E] border border-[#1F2937] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              {badge.isUnlocked ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Telah Terbuka</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 font-semibold">
                    Tersisa {badge.maxProgress - badge.progress} Hari Lagi
                  </span>
                </>
              )}
            </span>

            <span className="font-mono text-[#C5A267] font-bold">
              {badge.progress} / {badge.maxProgress} {badge.requiredStreakDays ? "Hari" : "Tugas"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#181C26] rounded-full overflow-hidden border border-[#252E3E]">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                badge.isUnlocked
                  ? "from-emerald-500 to-[#C5A267]"
                  : "from-[#C5A267] to-amber-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {badge.unlockedAt && (
            <div className="mt-2.5 pt-2 border-t border-[#181C26] text-[11px] text-[#64748B] flex items-center justify-between">
              <span>Tanggal Pembukaan:</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C5A267]" />
                {badge.unlockedAt}
              </span>
            </div>
          )}
        </div>

        {/* Spiritual Wisdom & Benefits */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-3.5">
            <span className="text-[11px] text-[#C5A267] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A267]" />
              Fadhilah & Manfaat Psikologis:
            </span>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {badge.spiritualBenefit}
            </p>
          </div>

          <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-3.5">
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-400" />
              Landasan Dalil & Hikmah:
            </span>
            <p className="text-xs text-[#94A3B8] italic leading-relaxed">
              "{badge.hadithOrVerseReference}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-[#E2E8F0] border border-[#252E3E] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#C5A267]" />
                <span>Salin Prestasi</span>
              </>
            )}
          </button>

          {badge.isUnlocked ? (
            <button
              onClick={handleCelebrate}
              className="flex-1 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#C5A267]/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Rayakan 🎉</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 bg-[#1A1F2C] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white border border-[#252E3E] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
