import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Star, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Clock, 
  Video, 
  Languages, 
  GraduationCap, 
  CheckCircle,
  X,
  Sparkles,
  UserCheck,
  Brain,
  SlidersHorizontal,
  Zap,
  Info
} from "lucide-react";
import { Therapist } from "../types";
import { 
  getActivePsychometricProfile, 
  computeTherapistMatches, 
  PsychometricProfile, 
  TherapistMatchResult 
} from "../utils/therapistMatcher";
import { TherapistMatcherCard } from "./TherapistMatcherCard";
import { TherapistMatchDetailModal } from "./TherapistMatchDetailModal";

interface TherapistDirectoryProps {
  therapists: Therapist[];
  onSelectTherapistForBooking: (therapistId: string, notes?: string) => void;
  onNavigateToScreening?: () => void;
}

export const TherapistDirectory: React.FC<TherapistDirectoryProps> = ({
  therapists,
  onSelectTherapistForBooking,
  onNavigateToScreening,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortMode, setSortMode] = useState<"ai_match" | "rating" | "experience" | "price_low">("ai_match");
  
  const [activeModalTherapist, setActiveModalTherapist] = useState<Therapist | null>(null);
  const [activeProfile, setActiveProfile] = useState<PsychometricProfile>(getActivePsychometricProfile());
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<TherapistMatchResult | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);

  // Sync profile when psychometric screening is updated
  useEffect(() => {
    const handleScreeningUpdated = () => {
      setActiveProfile(getActivePsychometricProfile());
    };
    window.addEventListener("limocity_screening_updated", handleScreeningUpdated);
    window.addEventListener("storage", handleScreeningUpdated);
    return () => {
      window.removeEventListener("limocity_screening_updated", handleScreeningUpdated);
      window.removeEventListener("storage", handleScreeningUpdated);
    };
  }, []);

  // Compute AI Match Results for all therapists
  const matchResults = useMemo(() => {
    return computeTherapistMatches(therapists, activeProfile);
  }, [therapists, activeProfile]);

  const topMatch = matchResults[0] || null;

  // Match lookup map by therapist ID for fast score rendering
  const matchMap = useMemo(() => {
    const map: Record<string, TherapistMatchResult> = {};
    matchResults.forEach((m) => {
      map[m.therapist.id] = m;
    });
    return map;
  }, [matchResults]);

  const tags = [
    { id: "all", label: "Semua Pakar" },
    { id: "Kecemasan", label: "Kecemasan & Panic" },
    { id: "Depresi", label: "Depresi & Burnout" },
    { id: "Tazkiyatun", label: "Tazkiyatun Nafs" },
    { id: "Keluarga", label: "Pernikahan Sakinah" },
    { id: "Psikiater", label: "Psikiatri (Sp.KJ)" },
    { id: "Remaja", label: "Remaja & Karier" },
  ];

  // Filter and sort therapists
  const filteredAndSortedTherapists = useMemo(() => {
    const filtered = therapists.filter((t) => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (selectedTag === "all") return matchesSearch;
      const matchesTag = 
        t.specialties.some(s => s.toLowerCase().includes(selectedTag.toLowerCase())) ||
        t.approach.some(a => a.toLowerCase().includes(selectedTag.toLowerCase())) ||
        t.title.toLowerCase().includes(selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "ai_match") {
        const scoreA = matchMap[a.id]?.compatibilityScore || 0;
        const scoreB = matchMap[b.id]?.compatibilityScore || 0;
        return scoreB - scoreA;
      }
      if (sortMode === "rating") {
        return b.rating - a.rating;
      }
      if (sortMode === "experience") {
        return b.experienceYears - a.experienceYears;
      }
      if (sortMode === "price_low") {
        return a.pricePerSession - b.pricePerSession;
      }
      return 0;
    });
  }, [therapists, searchQuery, selectedTag, sortMode, matchMap]);

  const handleOpenMatchModal = (match: TherapistMatchResult) => {
    setSelectedMatchForModal(match);
    setIsMatchModalOpen(true);
  };

  const handleBookTherapist = (therapist: Therapist) => {
    const match = matchMap[therapist.id];
    let notes = "";
    if (match) {
      notes = `[Rekomendasi AI Matcher (${match.compatibilityScore}% Cocok)]\n- Kategori: ${activeProfile.title}\n- Skor DASS-21: Depresi ${activeProfile.scores.depression}, Kecemasan ${activeProfile.scores.anxiety}, Stres ${activeProfile.scores.stress}\n- Fokus: ${match.recommendedModality}`;
    }
    onSelectTherapistForBooking(therapist.id, notes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E2E8F0]">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-3">
          Direktori Tenaga Medis & Psikolog Terpercaya
        </span>
        <h2 className="text-3xl font-bold font-serif text-white">
          Psikolog Klinis, Psikiater & Konselor Berlisensi Resmi
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
          Seluruh praktisi kami memegang Surat Izin Praktik Psikologi (SIPP) / STR Kemenkes aktif, 
          berpengalaman dalam psikoterapi modern dan penguatan ketenangan ruhaniyah Islam.
        </p>
      </div>

      {/* AI THERAPIST MATCHER SPOTLIGHT SECTION */}
      {topMatch && (
        <TherapistMatcherCard
          activeProfile={activeProfile}
          topMatch={topMatch}
          allMatches={matchResults}
          onSelectProfile={setActiveProfile}
          onSelectTherapistForBooking={onSelectTherapistForBooking}
          onNavigateToScreening={onNavigateToScreening}
          onOpenMatchDetailModal={handleOpenMatchModal}
        />
      )}

      {/* Search, Filter & Sort Bar */}
      <div className="bg-[#111318] p-4 sm:p-5 rounded-2xl border border-[#1F2937] shadow-xl mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#64748B] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama praktisi, keahlian (contoh: kecemasan, insomnia, keluarga)..."
              className="w-full pl-12 pr-4 py-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
            />
          </div>

          {/* Sort Mode Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center bg-[#0E1015] border border-[#252E3E] rounded-xl px-3 py-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C5A267] mr-2 shrink-0" />
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
                aria-label="Urutkan Direktori Praktisi"
                className="bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
              >
                <option value="ai_match" className="bg-[#111318] text-white">
                  🤖 Urutkan: Rekomendasi AI Match
                </option>
                <option value="rating" className="bg-[#111318] text-white">
                  ⭐ Urutkan: Rating Tertinggi
                </option>
                <option value="experience" className="bg-[#111318] text-white">
                  🏆 Urutkan: Pengalaman Terlama
                </option>
                <option value="price_low" className="bg-[#111318] text-white">
                  💰 Urutkan: Biaya Terjangkau
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag.id
                  ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20"
                  : "bg-[#141720] text-[#94A3B8] border border-[#252E3E] hover:bg-[#181C26] hover:text-white"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTherapists.map((therapist) => {
          const match = matchMap[therapist.id];
          const isTopOverall = topMatch?.therapist.id === therapist.id;

          return (
            <div
              key={therapist.id}
              className={`bg-[#111318] rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-xl ${
                isTopOverall
                  ? "border-[#C5A267] ring-1 ring-[#C5A267]/50 shadow-2xl shadow-[#C5A267]/10"
                  : "border-[#1F2937] hover:border-[#374151]"
              }`}
            >
              <div>
                {/* AI Compatibility Header Bar on Card */}
                {match && (
                  <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isTopOverall
                          ? "bg-[#C5A267] text-black shadow-sm"
                          : match.compatibilityScore >= 90
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-[#181C26] text-[#C5A267] border border-[#C5A267]/30"
                      }`}>
                        <Zap className="w-3 h-3" />
                        {match.compatibilityScore}% Cocok {isTopOverall ? "(Pilihan #1)" : `(${match.matchTier})`}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenMatchModal(match)}
                      className="text-[11px] text-[#94A3B8] hover:text-[#C5A267] flex items-center gap-1 font-medium cursor-pointer"
                      title="Lihat rincian analisis kecocokan AI"
                    >
                      <Info className="w-3 h-3" />
                      <span>Analisis AI</span>
                    </button>
                  </div>
                )}

                {/* Card Head & Avatar */}
                <div className="p-5 pb-0 flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={therapist.photoUrl}
                      alt={therapist.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C5A267]/40 group-hover:scale-105 transition-transform"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111318] ${
                      therapist.onlineStatus === "online" ? "bg-emerald-500" : "bg-slate-500"
                    }`} title={therapist.onlineStatus === "online" ? "Online Siap Telemedisin" : "Offline"}></span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-[#C5A267] font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#C5A267] text-[#C5A267]" />
                      <span>{therapist.rating}</span>
                      <span className="text-[#64748B] font-normal">({therapist.reviewsCount} ulasan)</span>
                    </div>

                    <h3 className="font-bold text-white text-base mt-1 leading-snug group-hover:text-[#C5A267] transition-colors font-serif">
                      {therapist.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#C5A267] mt-0.5">
                      {therapist.title}
                    </p>
                  </div>
                </div>

                {/* Verified License Badge */}
                <div className="px-5 mt-3">
                  <div className="p-2 bg-[#141720] border border-[#252E3E] rounded-lg flex items-center gap-2 text-[11px] text-[#94A3B8] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{therapist.licenseNumber} • {therapist.experienceYears} Thn Pengalaman</span>
                  </div>
                </div>

                {/* Bio Excerpt */}
                <div className="px-5 mt-3">
                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {therapist.bio}
                  </p>
                </div>

                {/* Specialties & Approaches */}
                <div className="px-5 mt-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {therapist.specialties.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#181C26] border border-[#252E3E] text-[#94A3B8] rounded-md text-[11px] font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & CTAs */}
              <div className="p-5 mt-5 border-t border-[#1F2937] bg-[#0E1015]/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#94A3B8]">Tarif per sesi 60 mnt:</span>
                  <span className="text-sm font-bold text-[#C5A267] font-mono">
                    Rp {therapist.pricePerSession.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalTherapist(therapist)}
                    className="py-2.5 px-3 border border-[#252E3E] hover:bg-[#181C26] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                  >
                    Profil Praktisi
                  </button>

                  <button
                    onClick={() => handleBookTherapist(therapist)}
                    className="py-2.5 px-3 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-xl text-xs font-bold shadow-md shadow-[#C5A267]/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    <span>Jadwalkan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Detail Modal */}
      {activeModalTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#111318] border border-[#1F2937] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-[#E2E8F0]">
            <button
              onClick={() => setActiveModalTherapist(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4 pb-6 border-b border-[#1F2937]">
              <img
                src={activeModalTherapist.photoUrl}
                alt={activeModalTherapist.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C5A267] shrink-0 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-1.5 text-[#C5A267] font-bold text-xs mb-1">
                  <Star className="w-4 h-4 fill-[#C5A267] text-[#C5A267]" />
                  <span>{activeModalTherapist.rating}</span>
                  <span className="text-[#64748B] font-normal">({activeModalTherapist.reviewsCount} Pasien Tertolong)</span>
                </div>
                <h3 className="text-xl font-bold text-white font-serif">
                  {activeModalTherapist.name}
                </h3>
                <p className="text-sm font-semibold text-[#C5A267]">
                  {activeModalTherapist.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#94A3B8]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-[#E2E8F0]">{activeModalTherapist.licenseNumber}</span>
                </div>
              </div>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm text-[#E2E8F0]">
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 font-serif">
                  Biografi & Pendekatan Klinis:
                </h4>
                <p className="leading-relaxed text-[#94A3B8]">{activeModalTherapist.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 font-serif">
                  <GraduationCap className="w-4 h-4 text-[#C5A267]" />
                  <span>Riwayat Pendidikan & Keahlian:</span>
                </h4>
                <p className="text-[#94A3B8]">{activeModalTherapist.education}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1.5 font-serif">
                  Metodologi Terapi yang Digunakan:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalTherapist.approach.map((app, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#141720] border border-[#C5A267]/30 text-[#C5A267] rounded-lg text-xs font-semibold">
                      ✓ {app}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-serif">
                  <Languages className="w-4 h-4 text-[#C5A267]" />
                  <span>Bahasa Konseling:</span>
                </h4>
                <div className="flex gap-2">
                  {activeModalTherapist.languages.map((lang, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#181C26] border border-[#252E3E] rounded text-[#94A3B8] text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F2937] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#94A3B8] block">Biaya Sesi 60 Menit:</span>
                <span className="text-base font-bold text-[#C5A267] font-mono">
                  Rp {activeModalTherapist.pricePerSession.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                onClick={() => {
                  const t = activeModalTherapist;
                  setActiveModalTherapist(null);
                  handleBookTherapist(t);
                }}
                className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-[#C5A267]/20 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Jadwalkan dengan Praktisi Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Match Detail Modal */}
      {isMatchModalOpen && selectedMatchForModal && (
        <TherapistMatchDetailModal
          match={selectedMatchForModal}
          profile={activeProfile}
          isOpen={isMatchModalOpen}
          onClose={() => setIsMatchModalOpen(false)}
          onBookTherapist={onSelectTherapistForBooking}
        />
      )}

    </div>
  );
};

