import React from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  Star,
  Brain,
  Award,
  HeartHandshake,
  Calendar,
  Activity,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import {
  TherapistMatchResult,
  PsychometricProfile
} from "../utils/therapistMatcher";

interface TherapistMatchDetailModalProps {
  match: TherapistMatchResult | null;
  profile: PsychometricProfile;
  isOpen: boolean;
  onClose: () => void;
  onBookTherapist: (therapistId: string, notes?: string) => void;
}

export const TherapistMatchDetailModal: React.FC<TherapistMatchDetailModalProps> = ({
  match,
  profile,
  isOpen,
  onClose,
  onBookTherapist,
}) => {
  if (!isOpen || !match) return null;

  const handleBook = () => {
    const prefilledText = `[Rekomendasi AI Therapist Matcher - ${match.compatibilityScore}% Match]\n- Profil: ${profile.title}\n- Skor DASS-21: Depresi ${profile.scores.depression} (${profile.severities.depression}), Kecemasan ${profile.scores.anxiety} (${profile.severities.anxiety}), Stres ${profile.scores.stress} (${profile.severities.stress})\n- Fokus Terapi: ${match.recommendedModality}\n- Rekomendasi Klinis: ${match.synergyReason}`;
    onClose();
    onBookTherapist(match.therapist.id, prefilledText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#111318] border border-[#C5A267]/60 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0] space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-4 pb-5 border-b border-[#1F2937]">
          <div className="relative shrink-0">
            <img
              src={match.therapist.photoUrl}
              alt={match.therapist.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C5A267] shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#C5A267] text-black text-[10px] font-bold rounded-md shadow-sm">
              {match.compatibilityScore}% MATCH
            </span>
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 text-[#C5A267] font-bold text-xs mb-1">
              <Star className="w-4 h-4 fill-[#C5A267] text-[#C5A267]" />
              <span>{match.therapist.rating}</span>
              <span className="text-[#64748B] font-normal">({match.therapist.reviewsCount} Pasien)</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              {match.therapist.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#C5A267]">
              {match.therapist.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{match.therapist.licenseNumber}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Summary Box */}
        <div className="p-4 rounded-2xl bg-[#141720] border border-[#252E3E] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#C5A267]" />
              Profil Pasien yang Dianalisis:
            </span>
            <span className="text-white font-bold">{profile.title}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#0E1015] border border-[#1F2937]">
              <span className="text-[#94A3B8] text-[10px] block">Skala Depresi</span>
              <span className="font-bold text-white">{profile.scores.depression} ({profile.severities.depression})</span>
            </div>
            <div className="p-2 rounded-xl bg-[#0E1015] border border-[#1F2937]">
              <span className="text-[#94A3B8] text-[10px] block">Skala Kecemasan</span>
              <span className="font-bold text-white">{profile.scores.anxiety} ({profile.severities.anxiety})</span>
            </div>
            <div className="p-2 rounded-xl bg-[#0E1015] border border-[#1F2937]">
              <span className="text-[#94A3B8] text-[10px] block">Skala Stres</span>
              <span className="font-bold text-white">{profile.scores.stress} ({profile.severities.stress})</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Sections */}
        <div className="space-y-4 text-xs sm:text-sm text-[#E2E8F0]">
          {/* Section 1: Clinical Synergy */}
          <div className="p-4 rounded-2xl bg-[#151924] border border-[#252E3E] space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-serif text-[#C5A267]">
              <Brain className="w-4 h-4 text-[#C5A267]" />
              <span>1. Keselarasan Klinis & Psikometrik:</span>
            </h4>
            <p className="text-[#94A3B8] leading-relaxed">
              {match.synergyReason}
            </p>
          </div>

          {/* Section 2: Modality */}
          <div className="p-4 rounded-2xl bg-[#151924] border border-[#252E3E] space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-serif text-sky-400">
              <HeartHandshake className="w-4 h-4 text-sky-400" />
              <span>2. Metodologi Terapi Terintegrasi:</span>
            </h4>
            <p className="text-[#E2E8F0] font-semibold">
              {match.recommendedModality}
            </p>
            <p className="text-xs text-[#94A3B8]">
              Menggabungkan protokol klinis empiris dengan prinsip Tazkiyatun Nafs untuk menyembuhkan luka batin secara holistik.
            </p>
          </div>

          {/* Section 3: Target Outcome */}
          <div className="p-4 rounded-2xl bg-[#151924] border border-[#252E3E] space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-serif text-emerald-400">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>3. Target Hasil Terapi (*Therapeutic Outcome*):</span>
            </h4>
            <p className="text-[#94A3B8] leading-relaxed">
              {match.keyBenefit}
            </p>
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#94A3B8] block">Tarif Sesi 60 Menit:</span>
            <span className="text-lg font-bold text-[#C5A267] font-mono">
              Rp {match.therapist.pricePerSession.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            onClick={handleBook}
            className="w-full sm:w-auto bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-7 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Jadwalkan Sesi Konsultasi Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
