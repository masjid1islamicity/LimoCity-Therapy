import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Activity,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ChevronDown,
  Info,
  ShieldCheck,
  Star,
  Brain,
  HeartHandshake,
  RotateCcw,
  Zap
} from "lucide-react";
import { Therapist } from "../types";
import {
  PsychometricProfile,
  TherapistMatchResult,
  PRESET_PSYCHOMETRIC_PROFILES
} from "../utils/therapistMatcher";

interface TherapistMatcherCardProps {
  activeProfile: PsychometricProfile;
  topMatch: TherapistMatchResult;
  allMatches: TherapistMatchResult[];
  onSelectProfile: (profile: PsychometricProfile) => void;
  onSelectTherapistForBooking: (therapistId: string, notes?: string) => void;
  onNavigateToScreening?: () => void;
  onOpenMatchDetailModal: (match: TherapistMatchResult) => void;
}

export const TherapistMatcherCard: React.FC<TherapistMatcherCardProps> = ({
  activeProfile,
  topMatch,
  allMatches,
  onSelectProfile,
  onSelectTherapistForBooking,
  onNavigateToScreening,
  onOpenMatchDetailModal,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normal":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "ringan":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "sedang":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "parah":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "sangat parah":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      default:
        return "bg-[#C5A267]/15 text-[#C5A267] border-[#C5A267]/30";
    }
  };

  const handleBookTopMatch = () => {
    const prefilledText = `[Rekomendasi AI Therapist Matcher]\n- Profil Klien: ${activeProfile.title}\n- Skor DASS-21: Depresi ${activeProfile.scores.depression} (${activeProfile.severities.depression}), Kecemasan ${activeProfile.scores.anxiety} (${activeProfile.severities.anxiety}), Stres ${activeProfile.scores.stress} (${activeProfile.severities.stress})\n- Rekomendasi Terapi: ${topMatch.recommendedModality}\n- Alasan Kecocokan AI (${topMatch.compatibilityScore}%): ${topMatch.synergyReason}`;
    onSelectTherapistForBooking(topMatch.therapist.id, prefilledText);
  };

  return (
    <div className="bg-gradient-to-br from-[#131722] via-[#0E1015] to-[#161B26] border-2 border-[#C5A267]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-10 text-[#E2E8F0]">
      {/* Background Atmosphere Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner with Profile Selector */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#252E3E]">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-[#C5A267]/20 border border-[#C5A267]/50 text-[#C5A267] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>AI Therapist Matcher • Presisi Psikometri & Spiritual</span>
            </span>
            {activeProfile.isCustomAssessment && (
              <span className="hidden sm:inline-flex px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-semibold items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Data Skrining DASS-21 Riil
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <span>Rekomendasi Pakar Berdasarkan Profil Batin Anda</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Algoritma AI menganalisis hasil skrining DASS-21 Anda untuk merekomendasikan psikolog atau psikiater dengan pendekatan klinis dan bimbingan ruhani yang paling presisi.
          </p>
        </div>

        {/* Profile Preset Switcher Dropdown */}
        <div className="relative self-start lg:self-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="bg-[#181C26] hover:bg-[#222836] border border-[#C5A267]/40 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#C5A267]" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{activeProfile.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {onNavigateToScreening && (
              <button
                onClick={onNavigateToScreening}
                className="bg-[#141720] hover:bg-[#1C2230] border border-[#252E3E] text-[#C5A267] hover:text-white px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Isi atau perbarui tes DASS-21 lengkap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tes Ulang DASS-21</span>
              </button>
            )}
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141720] border border-[#C5A267]/40 rounded-2xl p-2 shadow-2xl z-30 animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#252E3E] text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Pilih Profil atau Simulasi Keluhan:
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 p-1">
                {PRESET_PSYCHOMETRIC_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProfile(p);
                      setIsProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                      activeProfile.id === p.id
                        ? "bg-[#C5A267]/20 border border-[#C5A267]/60 text-white font-bold"
                        : "text-[#94A3B8] hover:bg-[#181C26] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{p.title}</span>
                      {activeProfile.id === p.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A267]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#64748B] line-clamp-1">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Profile Score Indicator Pills */}
      <div className="relative z-10 my-5 bg-[#0E1015]/80 border border-[#252E3E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Brain className="w-4 h-4 text-[#C5A267]" />
          <span className="font-semibold text-white">Ringkasan Skor DASS-21 Anda:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Depression Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141720] border border-[#252E3E] rounded-xl text-xs">
            <span className="text-[#94A3B8]">Depresi:</span>
            <span className="font-mono font-bold text-white">{activeProfile.scores.depression}</span>
            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${getSeverityBadgeColor(activeProfile.severities.depression)}`}>
              {activeProfile.severities.depression}
            </span>
          </div>

          {/* Anxiety Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141720] border border-[#252E3E] rounded-xl text-xs">
            <span className="text-[#94A3B8]">Kecemasan:</span>
            <span className="font-mono font-bold text-white">{activeProfile.scores.anxiety}</span>
            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${getSeverityBadgeColor(activeProfile.severities.anxiety)}`}>
              {activeProfile.severities.anxiety}
            </span>
          </div>

          {/* Stress Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141720] border border-[#252E3E] rounded-xl text-xs">
            <span className="text-[#94A3B8]">Stres:</span>
            <span className="font-mono font-bold text-white">{activeProfile.scores.stress}</span>
            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${getSeverityBadgeColor(activeProfile.severities.stress)}`}>
              {activeProfile.severities.stress}
            </span>
          </div>
        </div>
      </div>

      {/* TOP MATCH RECOMMENDATION SPOTLIGHT */}
      {topMatch && (
        <div className="relative z-10 bg-[#11141E] border border-[#C5A267]/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#252E3E]">
            {/* Top Match Doctor Info */}
            <div className="flex items-start space-x-4">
              <div className="relative shrink-0">
                <img
                  src={topMatch.therapist.photoUrl}
                  alt={topMatch.therapist.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#C5A267] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-[#C5A267] text-black text-[10px] font-extrabold rounded-md shadow-sm">
                  #1 AI MATCH
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 text-[#C5A267] font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#C5A267] text-[#C5A267]" />
                    <span>{topMatch.therapist.rating}</span>
                    <span className="text-[#64748B] font-normal">({topMatch.therapist.reviewsCount} ulasan)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#C5A267]/20 border border-[#C5A267]/50 text-[#C5A267] rounded-md text-[11px] font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#C5A267]" />
                    {topMatch.compatibilityScore}% Kompatibel ({topMatch.matchTier})
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-white font-serif mt-1">
                  {topMatch.therapist.name}
                </h4>
                <p className="text-xs font-semibold text-[#C5A267]">
                  {topMatch.therapist.title}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{topMatch.therapist.licenseNumber} • Pengalaman {topMatch.therapist.experienceYears} Tahun</span>
                </p>
              </div>
            </div>

            {/* Quick Price & Action Group */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2 shrink-0 self-stretch sm:self-auto">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#94A3B8] block">Tarif Konsultasi:</span>
                <span className="text-base font-bold text-[#C5A267] font-mono">
                  Rp {topMatch.therapist.pricePerSession.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-[#94A3B8]">/ 60 mnt</span>
                </span>
              </div>

              <button
                onClick={handleBookTopMatch}
                className="w-full sm:w-auto bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-transform active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Jadwalkan dengan Rekomendasi AI</span>
              </button>
            </div>
          </div>

          {/* AI Clinical & Spiritual Rationale Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            {/* Rationale Box */}
            <div className="p-3.5 rounded-xl bg-[#151924] border border-[#252E3E] space-y-1">
              <span className="font-bold text-[#C5A267] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 text-[#C5A267]" />
                Alasan Kecocokan AI:
              </span>
              <p className="text-[#E2E8F0] leading-relaxed">
                {topMatch.synergyReason}
              </p>
            </div>

            {/* Recommended Modality */}
            <div className="p-3.5 rounded-xl bg-[#151924] border border-[#252E3E] space-y-1">
              <span className="font-bold text-sky-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5 text-sky-400" />
                Metodologi Rekomendasi:
              </span>
              <p className="text-[#E2E8F0] leading-relaxed font-semibold">
                {topMatch.recommendedModality}
              </p>
            </div>

            {/* Key Outcome */}
            <div className="p-3.5 rounded-xl bg-[#151924] border border-[#252E3E] space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Manfaat & Hasil Target:
              </span>
              <p className="text-[#E2E8F0] leading-relaxed">
                {topMatch.keyBenefit}
              </p>
            </div>
          </div>

          {/* Footer Highlights & Expand Detail */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {topMatch.highlightTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#1A1F2C] border border-[#C5A267]/30 text-[#C5A267] rounded-lg text-[11px] font-semibold"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onOpenMatchDetailModal(topMatch)}
              className="text-xs text-[#94A3B8] hover:text-[#C5A267] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Lihat Rincian Analisis Kecocokan Lengkap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
