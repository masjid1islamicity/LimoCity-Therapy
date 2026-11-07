import { Therapist } from "../types";

export interface PsychometricScores {
  depression: number;
  anxiety: number;
  stress: number;
}

export interface PsychometricSeverities {
  depression: string;
  anxiety: string;
  stress: string;
}

export interface UserSymptomTag {
  id: string;
  label: string;
  category: "anxiety" | "depression" | "stress" | "somatic" | "relational" | "spiritual" | "parenting";
  description: string;
  targetSpecialties: string[];
}

export interface PsychometricProfile {
  id: string;
  title: string;
  description: string;
  dateRecorded: string;
  isCustomAssessment?: boolean;
  scores: PsychometricScores;
  severities: PsychometricSeverities;
  primaryConcern: string;
  selectedSymptoms?: string[];
}

export interface TherapistMatchResult {
  therapist: Therapist;
  compatibilityScore: number; // 0 - 100
  matchTier: "Sempurna" | "Sangat Tinggi" | "Tinggi" | "Kompatibel";
  priorityLevel: "Pilihan Utama #1" | "Sangat Direkomendasikan" | "Rekomendasi Spesialis" | "Opsi Tambahan";
  synergyReason: string;
  recommendedModality: string;
  keyBenefit: string;
  highlightTags: string[];
  matchedSymptoms: string[];
  matchedSpecialties: string[];
  clinicalFocusAreas: string[];
}

export const STORAGE_KEY_PSYCHOMETRIC = "limocity_dass21_latest_result";
export const STORAGE_KEY_SELECTED_SYMPTOMS = "limocity_user_selected_symptoms";

// Master List of User Symptom / Complaint Tags
export const AVAILABLE_SYMPTOM_TAGS: UserSymptomTag[] = [
  {
    id: "sym-overthinking",
    label: "Overthinking & Cemas Berlebih",
    category: "anxiety",
    description: "Pikiran terus berputar memikirkan skenario terburuk, sulit tenang saat istirahat.",
    targetSpecialties: ["Kecemasan & Overthinking", "Islamic Cognitive Behavioral Therapy (I-CBT)", "Mindfulness Dzikir"]
  },
  {
    id: "sym-panic",
    label: "Dada Berdebar / Serangan Panik",
    category: "anxiety",
    description: "Sensasi nafas pendek, jantung berdetak kencang mendadak, rasa tercekik atau takut hilang kendali.",
    targetSpecialties: ["Kecemasan & Overthinking", "Psikosomatis", "Mindful Breathing"]
  },
  {
    id: "sym-insomnia",
    label: "Insomnia & Gangguan Tidur",
    category: "somatic",
    description: "Sulit memulai tidur, sering terbangun tengah malam dengan gelisah, bangun dalam keadaan lelah.",
    targetSpecialties: ["Insomnia Kronis", "Psikosomatis", "Psikofarmakoterapi Holistik"]
  },
  {
    id: "sym-burnout",
    label: "Burnout & Kelelahan Kerja",
    category: "stress",
    description: "Kehilangan energi mental akibat beban kerja berkepanjangan, sinisme, dan performa menurun.",
    targetSpecialties: ["Burnout Pekerjaan", "Quarter-Life Crisis", "Compassion-Focused Therapy"]
  },
  {
    id: "sym-hopeless",
    label: "Hampa, Murung & Kehilangan Minat",
    category: "depression",
    description: "Merasa kehilangan semangat pada hal yang biasanya disukai, rasa hampa emosional berkepanjangan.",
    targetSpecialties: ["Depresi Klinis", "Gangguan Mood Bipolar", "Tazkiyatun Nafs"]
  },
  {
    id: "sym-somatic",
    label: "Psikosomatis (Maag/Asam Lambung & Pusing)",
    category: "somatic",
    description: "Keluhan fisik berulang tanpa kelainan struktural organ, dipicu oleh tekanan emosi batin.",
    targetSpecialties: ["Psikosomatis", "Insomnia Kronis", "Neuro-Sains Medis"]
  },
  {
    id: "sym-marriage",
    label: "Konflik Rumah Tangga & Pasangan",
    category: "relational",
    description: "Kebuntuan komunikasi dengan pasangan, pertengkaran berulang, atau duka keretakan hubungan.",
    targetSpecialties: ["Konflik Rumah Tangga", "Keluarga & Sakinah", "Family Systems Therapy"]
  },
  {
    id: "sym-spiritual",
    label: "Was-Was Ibadah & Krisis Keimanan",
    category: "spiritual",
    description: "Rasa ragu-ragu berulang saat wudhu/sholat, beban rasa bersalah spiritual, krisis makna hidup.",
    targetSpecialties: ["Tazkiyatun Nafs", "Mindfulness Dzikir", "Tadabbur Healing"]
  },
  {
    id: "sym-insecurity",
    label: "Insecurity, Perfeksionisme & Self-Worth",
    category: "stress",
    description: "Merasa selalu kurang berharga, takut dihakimi orang lain, standar diri yang menyiksa batin.",
    targetSpecialties: ["Insecurity & Social Anxiety", "Self-Worth", "Compassion-Focused Therapy"]
  },
  {
    id: "sym-parenting",
    label: "Stres Pengasuhan & Emosi Anak",
    category: "parenting",
    description: "Kewalahan menghadapi tantrum anak, kecanduan gadget, atau rasa bersalah sebagai orang tua.",
    targetSpecialties: ["Parenting Nabawiyah", "Tantrum & Regulasi Emosi Anak", "Positive Parenting"]
  },
  {
    id: "sym-grief",
    label: "Duka Kehilangan & Trauma Masa Lalu",
    category: "depression",
    description: "Kesedihan mendalam pasca wafatnya orang terkasih atau peristiwa traumatis yang belum tuntas.",
    targetSpecialties: ["Grief & Duka Kehilangan", "Trauma Masa Kecil", "Expressive Art & Writing Therapy"]
  }
];

// Helper to get severity label based on DASS-21 standard norms
export function getDASS21Severity(category: "depression" | "anxiety" | "stress", score: number): string {
  if (category === "depression") {
    if (score <= 9) return "Normal";
    if (score <= 13) return "Ringan";
    if (score <= 20) return "Sedang";
    if (score <= 27) return "Parah";
    return "Sangat Parah";
  } else if (category === "anxiety") {
    if (score <= 7) return "Normal";
    if (score <= 9) return "Ringan";
    if (score <= 14) return "Sedang";
    if (score <= 19) return "Parah";
    return "Sangat Parah";
  } else {
    // stress
    if (score <= 14) return "Normal";
    if (score <= 18) return "Ringan";
    if (score <= 25) return "Sedang";
    if (score <= 33) return "Parah";
    return "Sangat Parah";
  }
}

// Preset profiles for quick testing/switching in the UI
export const PRESET_PSYCHOMETRIC_PROFILES: PsychometricProfile[] = [
  {
    id: "preset-anxiety",
    title: "Kecemasan & Overthinking (Anxiety Dominan)",
    description: "Dominasi rasa was-was, dada berdebar, overthinking masa depan, dan sulit menenangkan pikiran.",
    dateRecorded: "Terbaru",
    scores: { depression: 8, anxiety: 18, stress: 22 },
    severities: { depression: "Normal", anxiety: "Parah", stress: "Sedang" },
    primaryConcern: "Generalized Anxiety & Overthinking",
    selectedSymptoms: ["sym-overthinking", "sym-panic", "sym-spiritual"]
  },
  {
    id: "preset-burnout",
    title: "Burnout Pekerjaan & Quarter-Life Crisis",
    description: "Kelelahan emosional akibat tuntutan karier, kehilangan motivasi kerja, dan krisis identitas.",
    dateRecorded: "Terbaru",
    scores: { depression: 14, anxiety: 12, stress: 26 },
    severities: { depression: "Sedang", anxiety: "Sedang", stress: "Parah" },
    primaryConcern: "Workplace Burnout & Self-Worth",
    selectedSymptoms: ["sym-burnout", "sym-insecurity", "sym-overthinking"]
  },
  {
    id: "preset-depression",
    title: "Depresi & Kehilangan Makna Hidup",
    description: "Perasaan hampa, duka mendalam, kehilangan minat beraktivitas, dan keputusasaan batin.",
    dateRecorded: "Terbaru",
    scores: { depression: 24, anxiety: 12, stress: 16 },
    severities: { depression: "Parah", anxiety: "Sedang", stress: "Ringan" },
    primaryConcern: "Depresi Klinis & Krisis Eksistensial",
    selectedSymptoms: ["sym-hopeless", "sym-grief", "sym-spiritual"]
  },
  {
    id: "preset-somatic",
    title: "Psikosomatis & Gangguan Tidur (Insomnia)",
    description: "Kecemasan yang bermanifestasi ke fisik seperti insomnia kronis, asam lambung, dan pusing tegang.",
    dateRecorded: "Terbaru",
    scores: { depression: 12, anxiety: 22, stress: 28 },
    severities: { depression: "Ringan", anxiety: "Sangat Parah", stress: "Parah" },
    primaryConcern: "Psikosomatis & Sleep Disturbance",
    selectedSymptoms: ["sym-insomnia", "sym-somatic", "sym-panic"]
  },
  {
    id: "preset-family",
    title: "Konflik Pernikahan & Stres Hubungan",
    description: "Tegangan komunikasi dengan pasangan, duka perpisahan, dan beban emosional keluarga.",
    dateRecorded: "Terbaru",
    scores: { depression: 16, anxiety: 10, stress: 22 },
    severities: { depression: "Sedang", anxiety: "Sedang", stress: "Sedang" },
    primaryConcern: "Family Relational Conflict & Grief",
    selectedSymptoms: ["sym-marriage", "sym-grief", "sym-parenting"]
  }
];

// Helper to auto-suggest symptom tags based on DASS-21 score spikes
export function getSuggestedSymptomsFromScores(scores: PsychometricScores): string[] {
  const suggested: string[] = [];

  if (scores.anxiety >= 10) {
    suggested.push("sym-overthinking", "sym-panic");
  }
  if (scores.stress >= 18) {
    suggested.push("sym-burnout");
  }
  if (scores.depression >= 14) {
    suggested.push("sym-hopeless");
  }
  if (scores.anxiety >= 15 || scores.stress >= 24) {
    suggested.push("sym-insomnia");
  }
  if (suggested.length === 0) {
    suggested.push("sym-overthinking", "sym-burnout");
  }

  return Array.from(new Set(suggested));
}

export function getActivePsychometricProfile(): PsychometricProfile {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY_PSYCHOMETRIC);
    const rawSymptoms = localStorage.getItem(STORAGE_KEY_SELECTED_SYMPTOMS);
    let selectedSymptoms: string[] = [];

    if (rawSymptoms) {
      try {
        selectedSymptoms = JSON.parse(rawSymptoms);
      } catch (e) {
        selectedSymptoms = [];
      }
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.scores) {
          const scores: PsychometricScores = {
            depression: Number(parsed.scores.depression || 0),
            anxiety: Number(parsed.scores.anxiety || 0),
            stress: Number(parsed.scores.stress || 0),
          };

          const defaultSymptoms = selectedSymptoms.length > 0
            ? selectedSymptoms
            : getSuggestedSymptomsFromScores(scores);

          return {
            id: "user-latest",
            title: "Hasil Skrining DASS-21 Anda",
            description: "Profil psikometrik aktual dari instrumen skrining yang telah Anda isi.",
            dateRecorded: parsed.dateFormatted || "Hari Ini",
            isCustomAssessment: true,
            scores,
            severities: {
              depression: parsed.severity?.depression || getDASS21Severity("depression", scores.depression),
              anxiety: parsed.severity?.anxiety || getDASS21Severity("anxiety", scores.anxiety),
              stress: parsed.severity?.stress || getDASS21Severity("stress", scores.stress),
            },
            primaryConcern: parsed.primaryConcern || "Kesehatan Mental & Ketenangan Jiwa",
            selectedSymptoms: defaultSymptoms
          };
        }
      } catch (e) {
        // fallback
      }
    }
  }

  // Default engageable preset profile
  return PRESET_PSYCHOMETRIC_PROFILES[0];
}

export function savePsychometricResult(
  scores: PsychometricScores, 
  severities: PsychometricSeverities,
  symptoms?: string[]
) {
  if (typeof window !== "undefined") {
    const now = new Date();
    const effectiveSymptoms = symptoms && symptoms.length > 0 
      ? symptoms 
      : getSuggestedSymptomsFromScores(scores);

    const payload = {
      timestamp: now.toISOString(),
      dateFormatted: now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      scores,
      severity: severities,
      selectedSymptoms: effectiveSymptoms,
      primaryConcern: scores.anxiety > 14 
        ? "Kecemasan & Overthinking" 
        : scores.depression > 14 
        ? "Depresi & Suasana Hati" 
        : "Stres & Kebugaran Mental"
    };

    localStorage.setItem(STORAGE_KEY_PSYCHOMETRIC, JSON.stringify(payload));
    localStorage.setItem(STORAGE_KEY_SELECTED_SYMPTOMS, JSON.stringify(effectiveSymptoms));
    window.dispatchEvent(new CustomEvent("limocity_screening_updated", { detail: payload }));
  }
}

export function saveSelectedSymptoms(symptoms: string[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SELECTED_SYMPTOMS, JSON.stringify(symptoms));
    window.dispatchEvent(new CustomEvent("limocity_screening_updated"));
  }
}

/**
 * Enhanced Therapist Matcher Engine:
 * Analyzes DASS-21 numerical scores, severity classifications, and active user symptom tags
 * against each therapist's specialty tags, clinical approaches, and credentials.
 */
export function computeTherapistMatches(
  therapists: Therapist[],
  profile: PsychometricProfile,
  customSymptoms?: string[]
): TherapistMatchResult[] {
  const { depression, anxiety, stress } = profile.scores;
  const activeSymptoms = customSymptoms || profile.selectedSymptoms || getSuggestedSymptomsFromScores(profile.scores);

  // Map symptom objects for rich text & specialty extraction
  const symptomObjects = AVAILABLE_SYMPTOM_TAGS.filter(s => activeSymptoms.includes(s.id));
  const activeSymptomLabels = symptomObjects.map(s => s.label);

  const results: TherapistMatchResult[] = therapists.map((t) => {
    let score = 70; // baseline compatibility
    let synergyReason = "";
    let recommendedModality = "";
    let keyBenefit = "";
    let highlightTags: string[] = [];
    let matchedSymptoms: string[] = [];
    let matchedSpecialties: string[] = [];
    let clinicalFocusAreas: string[] = [];

    // Find specialty intersections
    t.specialties.forEach(spec => {
      const isMatched = symptomObjects.some(s => 
        s.targetSpecialties.some(ts => ts.toLowerCase().includes(spec.toLowerCase()) || spec.toLowerCase().includes(ts.toLowerCase()))
      );
      if (isMatched) {
        matchedSpecialties.push(spec);
      }
    });

    symptomObjects.forEach(s => {
      const hasOverlap = t.specialties.some(spec => 
        s.targetSpecialties.some(ts => ts.toLowerCase().includes(spec.toLowerCase()) || spec.toLowerCase().includes(ts.toLowerCase()))
      ) || t.approach.some(app => 
        s.targetSpecialties.some(ts => ts.toLowerCase().includes(app.toLowerCase()) || app.toLowerCase().includes(ts.toLowerCase()))
      );

      if (hasOverlap) {
        matchedSymptoms.push(s.label);
      }
    });

    // Specialty & DASS-21 Rule Matrix per Therapist Specialty Profile:

    // 1. Dr. Hj. Aisyah Wardani (th-1) - Lead Clinical Psychologist & Islamic CBT
    if (t.id === "th-1") {
      let scoreBoost = 0;
      if (anxiety >= 10) scoreBoost += 12;
      if (depression >= 10) scoreBoost += 8;
      if (stress >= 12) scoreBoost += 6;
      if (activeSymptoms.includes("sym-overthinking")) scoreBoost += 5;
      if (activeSymptoms.includes("sym-spiritual")) scoreBoost += 4;
      if (activeSymptoms.includes("sym-panic")) scoreBoost += 3;

      score = Math.min(99, 76 + scoreBoost);
      highlightTags = ["Pilihan #1 Kecemasan & I-CBT", "Tazkiyatun Nafs", "Kecerdasan Spiritual"];
      clinicalFocusAreas = ["Restrukturisasi Kognitif Islami", "Terapi Was-Was", "Regulasi Kecemasan"];
      recommendedModality = "Islamic Cognitive Behavioral Therapy (I-CBT) + Tazkiyatun Nafs";
      keyBenefit = "Mengurai distorsi pikiran overthinking, meredakan was-was, dan mengokohkan ketenangan tawakkal.";

      const symptomClause = matchedSymptoms.length > 0 
        ? `keluhan Anda terkait ${matchedSymptoms.slice(0, 2).join(" & ")}`
        : "gejala kecemasan dan stres yang Anda alami";

      synergyReason = `Sangat optimal untuk mengatasi skor Kecemasan (${profile.severities.anxiety}) dan Stres (${profile.severities.stress}) serta ${symptomClause} melalui restrukturisasi kognitif berlandaskan tauhid dan dzikir penenang hati.`;
    }

    // 2. dr. Muhammad Farhan, Sp.KJ (th-2) - Psychiatrist (Medical & Psychosomatic)
    else if (t.id === "th-2") {
      let scoreBoost = 0;
      if (anxiety >= 15) scoreBoost += 10;
      if (stress >= 20) scoreBoost += 10;
      if (depression >= 16) scoreBoost += 8;
      if (activeSymptoms.includes("sym-insomnia")) scoreBoost += 8;
      if (activeSymptoms.includes("sym-somatic")) scoreBoost += 8;
      if (activeSymptoms.includes("sym-panic")) scoreBoost += 4;

      score = Math.min(98, 70 + scoreBoost);
      highlightTags = ["Dokter Spesialis Jiwa (Sp.KJ)", "Penanganan Psikosomatis", "Terapi Insomnia Medis"];
      clinicalFocusAreas = ["Regulasi Neurotransmiter", "Evaluasi Psikosomatis", "Manajemen Tidur Holistik"];
      recommendedModality = "Psikofarmakoterapi Terukur + Neuro-Sains Holistik & Thibbun Nabawi";
      keyBenefit = "Menstabilkan respon biologis otak, meredakan ketegangan fisik syaraf, dan mengatasi insomnia secara tuntas.";

      const somaticSpecific = activeSymptoms.includes("sym-insomnia") || activeSymptoms.includes("sym-somatic")
        ? "gangguan tidur dan keluhan fisik psikosomatis"
        : "ketegangan fisik dan kecemasan tinggi";

      synergyReason = `Sangat direkomendasikan untuk evaluasi medis-psikiatris bila skor kecemasan/stres Anda (${profile.severities.anxiety}/${profile.severities.stress}) memicu ${somaticSpecific} yang memerlukan diagnosa klinis komprehensif.`;
    }

    // 3. Ustadz H. Salman Al-Farisi (th-3) - Family, Marriage, Relational Grief & Tadabbur
    else if (t.id === "th-3") {
      let scoreBoost = 0;
      if (activeSymptoms.includes("sym-marriage")) scoreBoost += 18;
      if (activeSymptoms.includes("sym-grief")) scoreBoost += 10;
      if (activeSymptoms.includes("sym-parenting")) scoreBoost += 6;
      if (depression >= 12) scoreBoost += 6;
      if (stress >= 14) scoreBoost += 4;

      score = Math.min(97, 68 + scoreBoost);
      highlightTags = ["Pakar Konseling Keluarga", "Tadabbur Healing", "Resolusi Konflik Pasangan"];
      clinicalFocusAreas = ["Family Systems Therapy", "Penyembuhan Duka Batin", "Komunikasi Hati Pasutri"];
      recommendedModality = "Family Systems Therapy + Qur'anic Tadabbur Healing";
      keyBenefit = "Membuka sumbatan komunikasi hati, memulihkan kedamaian rumah tangga, dan merawat luka kehilangan.";

      synergyReason = `Pilihan utama untuk mengatasi dinamika konflik relasi keluarga, duka kehilangan (grief), serta mencari bimbingan sakinah dengan sentuhan tadabbur ayat-ayat Al-Qur'an yang menyejukkan hati.`;
    }

    // 4. Nadia Rahmadina, M.Psi (th-4) - Young Adults, Burnout, Self-Worth & ACT
    else if (t.id === "th-4") {
      let scoreBoost = 0;
      if (stress >= 16) scoreBoost += 12;
      if (depression >= 10 && depression <= 22) scoreBoost += 8;
      if (activeSymptoms.includes("sym-burnout")) scoreBoost += 10;
      if (activeSymptoms.includes("sym-insecurity")) scoreBoost += 8;
      if (activeSymptoms.includes("sym-overthinking")) scoreBoost += 4;

      score = Math.min(98, 72 + scoreBoost);
      highlightTags = ["Pilihan #1 Burnout Karier", "Quarter-Life Crisis", "Self-Compassion"];
      clinicalFocusAreas = ["Terapi Kasih Sayang Diri", "Pelepasan Perfeksionisme", "Mindful Expressive Writing"];
      recommendedModality = "Compassion-Focused Therapy + Expressive Writing Therapy";
      keyBenefit = "Melepaskan beban perfeksionisme, meredakan kelelahan kerja (burnout), dan menumbuhkan rasa berharga diri.";

      synergyReason = `Sangat adaptif mendampingi Anda melewati kejenuhan karier (burnout), krisis usia 20-30an (quarter-life crisis), serta rasa ragu pada diri sendiri dengan suasana konseling yang hangat dan suportif.`;
    }

    // 5. Khadijah Putri, M.Psi (th-5) - Child Psychologist & Parenting Nabawiyah
    else if (t.id === "th-5") {
      let scoreBoost = 0;
      if (activeSymptoms.includes("sym-parenting")) scoreBoost += 20;
      if (stress >= 14) scoreBoost += 6;
      if (anxiety >= 10) scoreBoost += 4;

      score = Math.min(96, 68 + scoreBoost);
      highlightTags = ["Parenting Nabawiyah", "Regulasi Emosi Anak", "Keharmonisan Ibu & Buah Hati"];
      clinicalFocusAreas = ["Positive Parenting", "Attachment-Based Bonding", "Manajemen Tantrum"];
      recommendedModality = "Positive Parenting + Attachment-Based Therapy";
      keyBenefit = "Membangun kedekatan emosional (rahmah) antara orang tua dan anak tanpa kemarahan destruktif.";

      synergyReason = `Sangat tepat bagi orang tua yang merasakan stres pengasuhan anak, membutuhkan panduan regulasi emosi rumah tangga, dan ingin mempraktikkan pengasuhan berlandaskan teladan Nabawi.`;
    }

    // Add extra points for symptom matching count
    if (matchedSymptoms.length > 0) {
      score = Math.min(99, score + Math.min(6, matchedSymptoms.length * 2));
    }

    // Determine Match Tier & Priority Level
    let matchTier: "Sempurna" | "Sangat Tinggi" | "Tinggi" | "Kompatibel" = "Kompatibel";
    let priorityLevel: "Pilihan Utama #1" | "Sangat Direkomendasikan" | "Rekomendasi Spesialis" | "Opsi Tambahan" = "Opsi Tambahan";

    if (score >= 95) {
      matchTier = "Sempurna";
      priorityLevel = "Pilihan Utama #1";
    } else if (score >= 90) {
      matchTier = "Sangat Tinggi";
      priorityLevel = "Sangat Direkomendasikan";
    } else if (score >= 82) {
      matchTier = "Tinggi";
      priorityLevel = "Rekomendasi Spesialis";
    }

    return {
      therapist: t,
      compatibilityScore: score,
      matchTier,
      priorityLevel,
      synergyReason,
      recommendedModality,
      keyBenefit,
      highlightTags,
      matchedSymptoms,
      matchedSpecialties: matchedSpecialties.length > 0 ? matchedSpecialties : t.specialties.slice(0, 2),
      clinicalFocusAreas
    };
  });

  // Sort descending by compatibility score
  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

/**
 * Top-level utility function to evaluate psychometric test results and user symptoms,
 * returning full actionable recommendations.
 */
export function analyzePsychometricAndSymptoms(
  scores: PsychometricScores,
  userSymptoms: string[],
  therapists: Therapist[]
): {
  topMatch: TherapistMatchResult;
  rankedMatches: TherapistMatchResult[];
  activeProfile: PsychometricProfile;
  symptomSummary: string;
} {
  const severities: PsychometricSeverities = {
    depression: getDASS21Severity("depression", scores.depression),
    anxiety: getDASS21Severity("anxiety", scores.anxiety),
    stress: getDASS21Severity("stress", scores.stress),
  };

  const activeProfile: PsychometricProfile = {
    id: "analyzed-custom",
    title: "Hasil Skrining Psikometri Anda",
    description: "Analisis komprehensif DASS-21 dan profil keluhan aktif pengguna.",
    dateRecorded: "Terbaru",
    isCustomAssessment: true,
    scores,
    severities,
    primaryConcern: scores.anxiety > 14 
      ? "Kecemasan & Overthinking" 
      : scores.depression > 14 
      ? "Depresi & Suasana Hati" 
      : "Stres & Kebugaran Mental",
    selectedSymptoms: userSymptoms
  };

  const rankedMatches = computeTherapistMatches(therapists, activeProfile, userSymptoms);
  const topMatch = rankedMatches[0];

  const symptomLabels = AVAILABLE_SYMPTOM_TAGS
    .filter(s => userSymptoms.includes(s.id))
    .map(s => s.label);

  const symptomSummary = symptomLabels.length > 0
    ? symptomLabels.join(", ")
    : "Evaluasi Kebugaran Mental Umum";

  return {
    topMatch,
    rankedMatches,
    activeProfile,
    symptomSummary
  };
}
