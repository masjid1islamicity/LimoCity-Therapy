import React, { useState } from "react";
import {
  Award,
  Flame,
  Crown,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Wind,
  Heart,
  Star,
  Sun,
  Medal,
  Lock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Info,
  Filter,
  RefreshCw,
  Trophy,
  Sliders,
  CalendarCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import { SpiritualBadge, BadgeTier } from "../types";
import { getBadgeTierStyles } from "../data/spiritualBadgesData";
import { BadgeDetailModal } from "./BadgeDetailModal";

interface SpiritualBadgesGalleryProps {
  badges: SpiritualBadge[];
  currentStreak: number;
  onUpdateStreak?: (newStreak: number) => void;
  onSelectBadge?: (badge: SpiritualBadge) => void;
}

export const SpiritualBadgesGallery: React.FC<SpiritualBadgesGalleryProps> = ({
  badges,
  currentStreak,
  onUpdateStreak,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<SpiritualBadge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "locked" | "streak">("all");
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Helper to render icon
  const renderBadgeIcon = (iconName: string, className = "w-6 h-6") => {
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

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const totalXp = badges.filter((b) => b.isUnlocked).reduce((acc, curr) => acc + (curr.xpReward || 0), 0);

  // Calculate spiritual level
  const userLevel = Math.max(1, Math.floor(totalXp / 200) + 1);
  const levelTitle =
    currentStreak >= 30
      ? "Master Tazkiyah Qolbu"
      : currentStreak >= 7
      ? "Kesatria Istiqomah"
      : currentStreak >= 3
      ? "Penjaga Fajar"
      : "Pencari Ketenangan";

  const filteredBadges = badges.filter((b) => {
    if (activeFilter === "unlocked") return b.isUnlocked;
    if (activeFilter === "locked") return !b.isUnlocked;
    if (activeFilter === "streak") return b.category === "streak";
    return true;
  });

  const handleOpenBadge = (badge: SpiritualBadge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const handleSimulateStreak = (newStreak: number) => {
    if (onUpdateStreak) {
      onUpdateStreak(newStreak);
      if (newStreak >= 7) {
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#C5A267", "#FFD700", "#10B981", "#38BDF8", "#EC4899"],
          });
        } catch {}
      }
    }
  };

  // Find next upcoming streak badge
  const nextStreakBadge = badges
    .filter((b) => b.requiredStreakDays && !b.isUnlocked)
    .sort((a, b) => (a.requiredStreakDays || 0) - (b.requiredStreakDays || 0))[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Level, XP, and Next Milestone Spotlight */}
      <div className="bg-gradient-to-r from-[#141724] via-[#10121A] to-[#161324] border border-[#C5A267]/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Level & Stats */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#C5A267] to-[#8C6D37] p-0.5 shadow-lg shadow-[#C5A267]/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#111318] rounded-2xl flex flex-col items-center justify-center text-white">
                  <Trophy className="w-6 h-6 text-[#C5A267] mb-0.5" />
                  <span className="text-[10px] font-bold text-[#C5A267] uppercase">Lvl {userLevel}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 uppercase">
                  Peringkat Ruhani
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {totalXp} XP Terkumpul
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                {levelTitle}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {unlockedCount} dari {totalCount} Lencana Istiqomah Telah Diraih
              </p>
            </div>
          </div>

          {/* Center/Right: 7 & 30 Days Target Highlights */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            
            {/* 7 Days Spotlight Box */}
            <div
              onClick={() => {
                const b7 = badges.find((b) => b.id === "badge-streak-7");
                if (b7) handleOpenBadge(b7);
              }}
              className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                currentStreak >= 7
                  ? "bg-amber-950/40 border-[#C5A267] shadow-md shadow-[#C5A267]/10"
                  : "bg-[#141720] border-[#252E3E] hover:border-[#C5A267]/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentStreak >= 7 ? "bg-[#C5A267] text-black" : "bg-[#181C26] text-[#64748B]"
              }`}>
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">Lencana 7 Hari</span>
                  {currentStreak >= 7 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-[#C5A267] font-mono font-bold">({currentStreak}/7)</span>
                  )}
                </div>
                <span className="text-[10px] text-[#94A3B8] block">
                  {currentStreak >= 7 ? "✓ Terbuka (Pilar Jiwa)" : "Target Pekanan"}
                </span>
              </div>
            </div>

            {/* 30 Days Spotlight Box */}
            <div
              onClick={() => {
                const b30 = badges.find((b) => b.id === "badge-streak-30");
                if (b30) handleOpenBadge(b30);
              }}
              className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                currentStreak >= 30
                  ? "bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/20"
                  : "bg-[#141720] border-[#252E3E] hover:border-purple-400/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentStreak >= 30 ? "bg-gradient-to-br from-amber-300 to-purple-500 text-black" : "bg-[#181C26] text-[#64748B]"
              }`}>
                <Crown className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">Lencana 30 Hari</span>
                  {currentStreak >= 30 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-purple-300 font-mono font-bold">({currentStreak}/30)</span>
                  )}
                </div>
                <span className="text-[10px] text-[#94A3B8] block">
                  {currentStreak >= 30 ? "✓ Master Tazkiyah" : "Target Bulanan"}
                </span>
              </div>
            </div>

            {/* Simulator Toggle Button */}
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="p-3 bg-[#181C26] hover:bg-[#252E3E] border border-[#252E3E] text-[#94A3B8] hover:text-[#C5A267] rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buka Pengatur Simulasi Istiqomah untuk Pengujian Cepat"
            >
              <Sliders className="w-4 h-4 text-[#C5A267]" />
              <span className="hidden sm:inline">Uji Streak</span>
            </button>

          </div>

        </div>

        {/* Milestone Roadmap Timeline */}
        <div className="mt-5 pt-4 border-t border-[#1F2937]/80">
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-[#C5A267]" />
              Jalur Istiqomah Bertahap:
            </span>
            <span className="font-mono text-[#C5A267] font-bold">
              Hari Aktif: {currentStreak} Hari
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {[
              { days: 1, label: "1 Hari", icon: Sparkles, color: "text-amber-300" },
              { days: 3, label: "3 Hari", icon: Sun, color: "text-amber-400" },
              { days: 7, label: "7 Hari 🏆", icon: Flame, color: "text-[#C5A267]" },
              { days: 14, label: "14 Hari", icon: ShieldCheck, color: "text-emerald-400" },
              { days: 30, label: "30 Hari 👑", icon: Crown, color: "text-purple-400" },
              { days: 60, label: "60 Hari 🌟", icon: Star, color: "text-amber-200" },
            ].map((milestone) => {
              const isReached = currentStreak >= milestone.days;
              const IconComp = milestone.icon;

              return (
                <div
                  key={milestone.days}
                  onClick={() => {
                    const found = badges.find((b) => b.requiredStreakDays === milestone.days);
                    if (found) handleOpenBadge(found);
                  }}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isReached
                      ? "bg-gradient-to-b from-[#1C2030] to-[#121520] border-[#C5A267] shadow-sm shadow-[#C5A267]/10"
                      : "bg-[#0E1015] border-[#1F2937] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <IconComp className={`w-4 h-4 ${isReached ? milestone.color : "text-[#64748B]"}`} />
                  </div>
                  <span className={`text-[10px] font-bold block ${isReached ? "text-white" : "text-[#64748B]"}`}>
                    {milestone.label}
                  </span>
                  <span className="text-[9px] text-[#94A3B8]">
                    {isReached ? "✓ Diraih" : `${milestone.days}h`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Streak Tester / Simulator Drawer */}
        {showSimulator && (
          <div className="mt-4 p-4 bg-[#0A0B0E] border border-amber-500/40 rounded-2xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-300 block flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Simulasi Uji Coba Lencana & Istiqomah:
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  Pilih jumlah hari konsisten untuk menguji perubahan status lencana 7 atau 30 hari seketika.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSimulateStreak(1)}
                  className="px-2.5 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-white text-xs font-semibold rounded-lg border border-[#2E3646] cursor-pointer"
                >
                  1 Hari
                </button>
                <button
                  onClick={() => handleSimulateStreak(3)}
                  className="px-2.5 py-1.5 bg-[#181C26] hover:bg-[#252E3E] text-white text-xs font-semibold rounded-lg border border-[#2E3646] cursor-pointer"
                >
                  3 Hari
                </button>
                <button
                  onClick={() => handleSimulateStreak(7)}
                  className="px-3 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-[#C5A267]/20 flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5 text-black" />
                  <span>Set 7 Hari (Gold)</span>
                </button>
                <button
                  onClick={() => handleSimulateStreak(30)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-purple-500 hover:opacity-90 text-black text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-purple-500/20 flex items-center gap-1"
                >
                  <Crown className="w-3.5 h-3.5 text-black" />
                  <span>Set 30 Hari (Crown)</span>
                </button>
                <button
                  onClick={() => handleSimulateStreak(0)}
                  className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded-lg border border-rose-800/40 cursor-pointer"
                >
                  Reset (0)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[#1F2937] pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#C5A267] text-black"
                : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
            }`}
          >
            Semua Lencana ({badges.length})
          </button>
          
          <button
            onClick={() => setActiveFilter("streak")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "streak"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Target 7 & 30 Hari</span>
          </button>

          <button
            onClick={() => setActiveFilter("unlocked")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "unlocked"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Terbuka ({unlockedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter("locked")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "locked"
                ? "bg-slate-800 text-white border border-slate-600"
                : "bg-[#181C26] text-[#94A3B8] hover:text-white border border-[#252E3E]"
            }`}
          >
            <Lock className="w-3 h-3 text-[#64748B]" />
            <span>Terkunci ({totalCount - unlockedCount})</span>
          </button>
        </div>

        <span className="text-[11px] text-[#64748B] hidden sm:inline">
          Klik lencana untuk melihat fadhilah & dalil
        </span>
      </div>

      {/* Badges Grid (Icon-Based Reward Display) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const tierStyles = getBadgeTierStyles(badge.tier);
          const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleOpenBadge(badge)}
              className={`group relative rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-none ${
                badge.isUnlocked
                  ? "bg-[#12151F] border-[#C5A267]/50 hover:border-[#C5A267] hover:shadow-xl hover:shadow-[#C5A267]/10 hover:-translate-y-0.5"
                  : "bg-[#0E1015] border-[#1F2937] hover:border-[#374151] opacity-75 hover:opacity-95"
              }`}
            >
              {/* Background ambient glow for unlocked badges */}
              {badge.isUnlocked && (
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40 bg-gradient-to-br ${tierStyles.gradient}`}
                />
              )}

              <div>
                {/* Header: Icon + Tier Pill */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md ${
                        badge.isUnlocked
                          ? `${tierStyles.bg} ${tierStyles.border} ${tierStyles.text}`
                          : "bg-[#181C26] border-[#2A3447] text-[#64748B] grayscale"
                      }`}
                    >
                      {renderBadgeIcon(badge.iconName, "w-7 h-7")}
                    </div>

                    {/* Status Badge Pin */}
                    {badge.isUnlocked ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border border-emerald-400 rounded-full flex items-center justify-center text-black shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0A0B0E] border border-[#374151] rounded-full flex items-center justify-center text-[#94A3B8]">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${tierStyles.pill}`}
                    >
                      {tierStyles.label}
                    </span>

                    {badge.xpReward && (
                      <span className="text-[10px] text-[#C5A267] font-semibold flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        +{badge.xpReward} XP
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold font-serif text-white group-hover:text-[#F3E8D2] transition-colors leading-snug mb-1">
                  {badge.title}
                </h4>

                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Bottom: Progress Bar & Milestone Target */}
              <div className="pt-3 border-t border-[#1F2937]/70">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#94A3B8]">
                    {badge.isUnlocked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {badge.unlockedAt || "Telah Diraih"}
                      </span>
                    ) : (
                      <span>Progres Istiqomah:</span>
                    )}
                  </span>

                  <span className="font-mono text-white font-bold text-xs">
                    {badge.progress}/{badge.maxProgress} {badge.requiredStreakDays ? "Hari" : "Target"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#181C26] rounded-full overflow-hidden border border-[#252E3E]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked
                        ? "bg-gradient-to-r from-emerald-500 to-[#C5A267]"
                        : "bg-gradient-to-r from-[#C5A267] to-amber-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Interactive Detail Modal */}
      <BadgeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        badge={selectedBadge}
        currentStreak={currentStreak}
      />

    </div>
  );
};
