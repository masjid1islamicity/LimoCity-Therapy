import React, { useState, useEffect, useMemo } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Calendar, 
  Sparkles, 
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Star,
  Brain,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Check,
  Tag
} from "lucide-react";
import { DASS21_QUESTIONS, INITIAL_THERAPISTS } from "../data/initialData";
import { Therapist } from "../types";
import { 
  savePsychometricResult, 
  saveSelectedSymptoms,
  computeTherapistMatches,
  AVAILABLE_SYMPTOM_TAGS,
  getSuggestedSymptomsFromScores,
  getDASS21Severity,
  PsychometricProfile,
  TherapistMatchResult
} from "../utils/therapistMatcher";
import { TherapistMatchDetailModal } from "./TherapistMatchDetailModal";

interface PsychometricScreeningProps {
  therapists?: Therapist[];
  onStartBookingWithResults: (notes: string) => void;
  onSelectTherapistForBooking?: (therapistId: string, notes?: string) => void;
}

export const PsychometricScreening: React.FC<PsychometricScreeningProps> = ({
  therapists = INITIAL_THERAPISTS,
  onStartBookingWithResults,
  onSelectTherapistForBooking,
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<TherapistMatchResult | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / DASS21_QUESTIONS.length) * 100);

  const handleSelectOption = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Calculate Subscale Scores (DASS-21 raw scores multiplied by 2 according to standard DASS-21 manual)
  const results = useMemo(() => {
    let depRaw = 0;
    let anxRaw = 0;
    let strRaw = 0;

    DASS21_QUESTIONS.forEach((q) => {
      const val = answers[q.id] || 0;
      if (q.category === "depression") depRaw += val;
      if (q.category === "anxiety") anxRaw += val;
      if (q.category === "stress") strRaw += val;
    });

    const depressionScore = depRaw * 2;
    const anxietyScore = anxRaw * 2;
    const stressScore = strRaw * 2;

    const getDepressionSeverity = (score: number) => {
      if (score <= 9) return { label: "Normal", color: "text-[#C5A267] bg-[#C5A267]/15 border border-[#C5A267]/30" };
      if (score <= 13) return { label: "Ringan", color: "text-blue-400 bg-blue-500/15 border border-blue-500/30" };
      if (score <= 20) return { label: "Sedang", color: "text-amber-400 bg-amber-500/15 border border-amber-500/30" };
      if (score <= 27) return { label: "Parah", color: "text-orange-400 bg-orange-500/15 border border-orange-500/30" };
      return { label: "Sangat Parah", color: "text-rose-400 bg-rose-500/15 border border-rose-500/30" };
    };

    const getAnxietySeverity = (score: number) => {
      if (score <= 7) return { label: "Normal", color: "text-[#C5A267] bg-[#C5A267]/15 border border-[#C5A267]/30" };
      if (score <= 9) return { label: "Ringan", color: "text-blue-400 bg-blue-500/15 border border-blue-500/30" };
      if (score <= 14) return { label: "Sedang", color: "text-amber-400 bg-amber-500/15 border border-amber-500/30" };
      if (score <= 19) return { label: "Parah", color: "text-orange-400 bg-orange-500/15 border border-orange-500/30" };
      return { label: "Sangat Parah", color: "text-rose-400 bg-rose-500/15 border border-rose-500/30" };
    };

    const getStressSeverity = (score: number) => {
      if (score <= 14) return { label: "Normal", color: "text-[#C5A267] bg-[#C5A267]/15 border border-[#C5A267]/30" };
      if (score <= 18) return { label: "Ringan", color: "text-blue-400 bg-blue-500/15 border border-blue-500/30" };
      if (score <= 25) return { label: "Sedang", color: "text-amber-400 bg-amber-500/15 border border-amber-500/30" };
      if (score <= 33) return { label: "Parah", color: "text-orange-400 bg-orange-500/15 border border-orange-500/30" };
      return { label: "Sangat Parah", color: "text-rose-400 bg-rose-500/15 border border-rose-500/30" };
    };

    return {
      depression: { score: depressionScore, ...getDepressionSeverity(depressionScore) },
      anxiety: { score: anxietyScore, ...getAnxietySeverity(anxietyScore) },
      stress: { score: stressScore, ...getStressSeverity(stressScore) },
    };
  }, [answers]);

  // When test is submitted, initialize suggested symptoms based on scores
  const handleCompleteScreening = () => {
    const scores = {
      depression: results.depression.score,
      anxiety: results.anxiety.score,
      stress: results.stress.score,
    };
    const severities = {
      depression: results.depression.label,
      anxiety: results.anxiety.label,
      stress: results.stress.label,
    };
    const autoSymptoms = getSuggestedSymptomsFromScores(scores);
    setSelectedSymptoms(autoSymptoms);
    setIsCompleted(true);
    savePsychometricResult(scores, severities, autoSymptoms);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      const updated = prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId];
      saveSelectedSymptoms(updated);
      return updated;
    });
  };

  // Build active profile for matcher calculation
  const currentProfile: PsychometricProfile = useMemo(() => {
    return {
      id: "screening-active",
      title: "Hasil Skrining DASS-21 Anda",
      description: "Profil psikometrik terkini yang dievaluasi sesuai norma baku internasional.",
      dateRecorded: "Hari Ini",
      isCustomAssessment: true,
      scores: {
        depression: results.depression.score,
        anxiety: results.anxiety.score,
        stress: results.stress.score,
      },
      severities: {
        depression: results.depression.label,
        anxiety: results.anxiety.label,
        stress: results.stress.label,
      },
      primaryConcern: results.anxiety.score > 14 
        ? "Kecemasan & Overthinking" 
        : results.depression.score > 14 
        ? "Depresi & Suasana Hati" 
        : "Stres & Kebugaran Mental",
      selectedSymptoms
    };
  }, [results, selectedSymptoms]);

  // Compute matched therapists based on scores + selected symptoms
  const matchResults = useMemo(() => {
    return computeTherapistMatches(therapists, currentProfile, selectedSymptoms);
  }, [therapists, currentProfile, selectedSymptoms]);

  const topMatch = matchResults[0];

  const handleBookWithTherapist = (match: TherapistMatchResult) => {
    const symptomLabels = AVAILABLE_SYMPTOM_TAGS
      .filter((s) => selectedSymptoms.includes(s.id))
      .map((s) => s.label);

    const prefilledText = `[Rekomendasi AI Therapist Matcher - ${match.compatibilityScore}% Cocok]\n- Skor DASS-21: Depresi ${currentProfile.scores.depression} (${currentProfile.severities.depression}), Kecemasan ${currentProfile.scores.anxiety} (${currentProfile.severities.anxiety}), Stres ${currentProfile.scores.stress} (${currentProfile.severities.stress})\n- Keluhan Spesifik: ${symptomLabels.length > 0 ? symptomLabels.join(", ") : "Umum"}\n- Pendekatan Disarankan: ${match.recommendedModality}\n- Keselarasan Klinis: ${match.synergyReason}`;

    if (onSelectTherapistForBooking) {
      onSelectTherapistForBooking(match.therapist.id, prefilledText);
    } else {
      onStartBookingWithResults(prefilledText);
    }
  };

  const handleGeneralBooking = () => {
    const symptomLabels = AVAILABLE_SYMPTOM_TAGS
      .filter((s) => selectedSymptoms.includes(s.id))
      .map((s) => s.label);

    const summaryText = `[Hasil Skrining DASS-21 LimoCity Therapy]\n- Depresi: Skor ${results.depression.score} (${results.depression.label})\n- Kecemasan: Skor ${results.anxiety.score} (${results.anxiety.label})\n- Stres: Skor ${results.stress.score} (${results.stress.label})\n- Keluhan Aktif: ${symptomLabels.length > 0 ? symptomLabels.join(", ") : "Tidak ada gejala tambahan yang dipilih"}\n\nKlien membutuhkan pendampingan konseling telemedisin untuk memulihkan kestabilan mental dan ketenangan batin.`;
    onStartBookingWithResults(summaryText);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#E2E8F0]">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
          Instrumen Skrining Validasi Internasional
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
          Uji Skrining DASS-21 (Depresi, Kecemasan & Stres)
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
          Pilihlah seberapa sering pernyataan di bawah ini menggambarkan kondisi Anda selama <strong>1 pekan terakhir</strong>. 
          Hasil analisis akan mencocokkan Anda secara otomatis dengan psikolog atau psikiater yang paling tepat.
        </p>
      </div>

      {!isCompleted ? (
        /* Questionnaire Form */
        <div className="bg-[#111318] rounded-3xl border border-[#1F2937] shadow-2xl p-6 sm:p-8 space-y-8">
          
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="font-semibold">
                Progress Pengisian: {answeredCount} dari {DASS21_QUESTIONS.length} Soal
              </span>
              <span className="font-bold text-[#C5A267]">{progressPercent}% Selesai</span>
            </div>
            <div className="w-full bg-[#181C26] h-2 rounded-full overflow-hidden border border-[#252E3E]">
              <div
                className="bg-[#C5A267] h-full transition-all duration-300 rounded-full shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Scale Legend */}
          <div className="p-4 bg-[#141720] rounded-2xl border border-[#252E3E] text-xs text-[#94A3B8] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div><strong className="text-white">0 =</strong> Tidak pernah dialami</div>
            <div><strong className="text-white">1 =</strong> Kadang-kadang dialami</div>
            <div><strong className="text-white">2 =</strong> Sering dialami</div>
            <div><strong className="text-white">3 =</strong> Hampir setiap saat dialami</div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {DASS21_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  answers[q.id] !== undefined
                    ? "bg-[#141720] border-[#C5A267]/40 shadow-sm"
                    : "bg-[#0E1015] border-[#1F2937] hover:border-[#2E384D]"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#181C26] border border-[#252E3E] text-[11px] font-bold flex items-center justify-center text-[#C5A267]">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                </div>

                {/* 4 Option Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {[
                    { value: 0, label: "0 - Tidak Pernah" },
                    { value: 1, label: "1 - Kadang-kadang" },
                    { value: 2, label: "2 - Sering" },
                    { value: 3, label: "3 - Hampir Selalu" },
                  ].map((opt) => {
                    const isSelected = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.value)}
                        className={`py-2 px-2.5 rounded-xl text-xs transition-all text-center cursor-pointer ${
                          isSelected
                            ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20 ring-2 ring-[#C5A267]/30"
                            : "bg-[#0E1015] text-[#94A3B8] border border-[#252E3E] hover:bg-[#181C26] hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#1F2937] flex justify-end">
            <button
              disabled={answeredCount < DASS21_QUESTIONS.length}
              onClick={handleCompleteScreening}
              className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-[#C5A267]/20 transition-all cursor-pointer"
            >
              <span>Lihat Hasil & Rekomendasi Terapis</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </div>
      ) : (
        /* Completed Results Screen with Integrated Therapist Matcher */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main DASS-21 Score Breakdown */}
          <div className="bg-[#111318] rounded-3xl border border-[#1F2937] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
              <div>
                <h3 className="text-xl font-bold font-serif text-white">
                  Hasil Analisis Skala DASS-21 Anda
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Dievaluasi secara otomatis sesuai norma psikometrik terstandar
                </p>
              </div>

              <button
                onClick={() => {
                  setAnswers({});
                  setIsCompleted(false);
                }}
                className="p-2 text-[#94A3B8] hover:text-[#C5A267] text-xs flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Tes</span>
              </button>
            </div>

            {/* Score 3-Col Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Depression Card */}
              <div className="p-5 rounded-2xl bg-[#141720] border border-[#252E3E] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Skala Depresi
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold font-serif text-white">{results.depression.score}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${results.depression.color}`}>
                      {results.depression.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Mengukur tingkat suasana hati murung, kehilangan motivasi, dan evaluasi diri yang rendah.
                  </p>
                </div>
              </div>

              {/* Anxiety Card */}
              <div className="p-5 rounded-2xl bg-[#141720] border border-[#252E3E] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Skala Kecemasan (Anxiety)
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold font-serif text-white">{results.anxiety.score}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${results.anxiety.color}`}>
                      {results.anxiety.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Mengukur ketegangan fisik, jantung berdebar, reaksi panik, dan kekhawatiran situasional.
                  </p>
                </div>
              </div>

              {/* Stress Card */}
              <div className="p-5 rounded-2xl bg-[#141720] border border-[#252E3E] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Skala Stres
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold font-serif text-white">{results.stress.score}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${results.stress.color}`}>
                      {results.stress.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Mengukur tingkat iritabilitas, sulit bersantai, dan respon berlebihan terhadap tekanan harian.
                  </p>
                </div>
              </div>

            </div>

            {/* Tazkiyah Spiritual Perspective Box */}
            <div className="p-5 bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-2xl border border-[#C5A267]/40 space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A267] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C5A267]" />
                <span>Rekomendasi Tindak Lanjut Holistik (Tazkiyatun Nafs):</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                Skor Anda menunjukkan perlunya ruang aman untuk melepaskan beban batin. Pendekatan integratif Islamic CBT bersama Psikolog Klinis kami akan membantu Anda memilah pikiran negatif, menyelaraskan kembali tujuan hidup, dan mengembalikan kedamaian ruhani.
              </p>
            </div>
          </div>

          {/* AI THERAPIST MATCHER SECTION */}
          <div className="bg-gradient-to-br from-[#131722] via-[#0E1015] to-[#161B26] border-2 border-[#C5A267]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#252E3E]">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-[#C5A267]/20 border border-[#C5A267]/50 text-[#C5A267] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span>AI Therapist Matcher • Presisi Spesialisasi</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Rekomendasi Terapis Berdasarkan Profil Anda
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Algoritma mencocokkan kombinasi skor DASS-21 dan tag keluhan spesifik Anda dengan keahlian klinis para praktisi.
                </p>
              </div>
            </div>

            {/* Interactive Symptom Selector Chips */}
            <div className="relative z-10 space-y-3 bg-[#0A0C10] p-5 rounded-2xl border border-[#252E3E]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A267]" />
                  Pilih Keluhan & Gejala Spesifik Anda (Opsional):
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {selectedSymptoms.length} dipilih
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Centang keluhan yang paling Anda rasakan saat ini untuk menyempurnakan kalkulasi kecocokan praktisi:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_SYMPTOM_TAGS.map((tag) => {
                  const isSelected = selectedSymptoms.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleSymptom(tag.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20 border border-[#C5A267]"
                          : "bg-[#141720] text-[#94A3B8] border border-[#252E3E] hover:border-[#C5A267]/40 hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      ) : (
                        <Tag className="w-3 h-3 text-[#64748B]" />
                      )}
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Ranked Therapists Display */}
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A267] flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#C5A267]" />
                Hasil Urutan Keselarasan Terapis:
              </h4>

              <div className="grid grid-cols-1 gap-4">
                {matchResults.slice(0, 3).map((match, idx) => {
                  const isTopRanked = idx === 0;

                  return (
                    <div
                      key={match.therapist.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isTopRanked
                          ? "bg-gradient-to-r from-[#181C26] via-[#141822] to-[#12151D] border-[#C5A267] shadow-xl ring-1 ring-[#C5A267]/30"
                          : "bg-[#141720] border-[#252E3E] hover:border-[#38455C]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        {/* Therapist Info Row */}
                        <div className="flex items-start space-x-4">
                          <img
                            src={match.therapist.photoUrl}
                            alt={match.therapist.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-2xl object-cover border border-[#C5A267]/60 shrink-0 shadow-md"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-[#C5A267] text-black font-extrabold text-[11px] rounded-md shadow-sm">
                                {match.compatibilityScore}% COCOK
                              </span>
                              <span className="px-2 py-0.5 bg-[#181C26] text-[#C5A267] border border-[#C5A267]/40 text-[11px] font-semibold rounded-md">
                                {match.priorityLevel}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] text-[#C5A267] font-semibold">
                                <Star className="w-3.5 h-3.5 fill-[#C5A267]" />
                                <span>{match.therapist.rating}</span>
                              </div>
                            </div>

                            <h5 className="font-bold text-white text-base font-serif">
                              {match.therapist.name}
                            </h5>
                            <p className="text-xs text-[#94A3B8] mt-0.5">
                              {match.therapist.title}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#252E3E]">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-[#94A3B8] block">Tarif Sesi:</span>
                            <span className="text-sm font-bold text-[#C5A267] font-mono">
                              Rp {match.therapist.pricePerSession.toLocaleString("id-ID")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMatchForModal(match);
                                setIsMatchModalOpen(true);
                              }}
                              className="px-3 py-2 bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Detail
                            </button>

                            <button
                              type="button"
                              onClick={() => handleBookWithTherapist(match)}
                              className="px-4 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#C5A267]/20 transition-all cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5 text-black" />
                              <span>Pilih Jadwal</span>
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Synergy Reason */}
                      <div className="mt-4 pt-3 border-t border-[#252E3E] space-y-2 text-xs">
                        <p className="text-[#CBD5E1] leading-relaxed">
                          <strong className="text-[#C5A267]">Mengapa Cocok:</strong> {match.synergyReason}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold text-[#64748B] mr-1">Spesialisasi:</span>
                          {match.matchedSpecialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-[#0E1015] border border-[#252E3E] text-[11px] text-[#94A3B8]"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Direct Booking Action CTA */}
            <div className="pt-4 border-t border-[#252E3E] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <ShieldCheck className="w-4 h-4 text-[#C5A267] shrink-0" />
                <span>Hasil ini akan otomatis dilampirkan ke catatan konsultasi telemedisin Anda.</span>
              </div>

              <button
                type="button"
                onClick={handleGeneralBooking}
                className="w-full sm:w-auto bg-[#181C26] hover:bg-[#252E3E] border border-[#C5A267]/50 text-[#C5A267] hover:text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Lanjut ke Formulir Jadwal Umum</span>
              </button>
            </div>

          </div>

          {/* Therapist Match Detail Modal */}
          {selectedMatchForModal && (
            <TherapistMatchDetailModal
              match={selectedMatchForModal}
              profile={currentProfile}
              isOpen={isMatchModalOpen}
              onClose={() => setIsMatchModalOpen(false)}
              onBookTherapist={(therapistId, notes) => {
                setIsMatchModalOpen(false);
                if (onSelectTherapistForBooking) {
                  onSelectTherapistForBooking(therapistId, notes);
                } else {
                  onStartBookingWithResults(notes || "");
                }
              }}
            />
          )}

        </div>
      )}

    </div>
  );
};
