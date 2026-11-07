export type ConsultationMode = "video" | "voice" | "chat" | "clinic";
export type PackageType = "single" | "intensive-4" | "couple-sakinah";
export type AppointmentStatus = "confirmed" | "in-session" | "completed" | "rescheduled" | "cancelled";

export interface Therapist {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specialties: string[];
  approach: string[];
  licenseNumber: string;
  bio: string;
  pricePerSession: number;
  availableDays: string[];
  availableSlots: string[];
  onlineStatus: "online" | "in-session" | "offline";
  education: string;
  languages: string[];
}

export interface Appointment {
  id: string;
  bookingCode: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  therapistId: string;
  therapistName: string;
  therapistTitle: string;
  consultationType: ConsultationMode;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  packageType: PackageType;
  consultationFocus: string;
  notesFromPatient?: string;
  meetingLink?: string;
  amount: number;
  createdAt: string;
  clinicalNotes?: {
    diagnosis?: string;
    actionPlan?: string[];
    prescribedSelfCare?: string;
    tazkiyahPrescription?: string;
  };
}

export interface TriageResult {
  severityAssessment: "Ringan" | "Sedang" | "Butuh Perhatian Khusus" | "Urgent";
  summaryEmosi: string;
  recommendedSpecialty: string;
  immediateCopingTips: string[];
  suggestedScreeningTool: string;
  quranicReflection: string;
  matchingTherapistId: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isTriage?: boolean;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGroundedWithSearch?: boolean;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: "sangat_tenang" | "tenang" | "netral" | "cemas" | "lelah_batin";
  energyLevel: number; // 1-10
  notes: string;
  aiReflection?: string;
  shortPrayer?: string;
}

export type PartnershipTrack = 
  | "practitioner" 
  | "corporate" 
  | "healthcare" 
  | "education" 
  | "insurance_tech";

export interface PartnershipApplication {
  id: string;
  registrationCode: string;
  institutionName: string;
  picName: string;
  picRole: string;
  picEmail: string;
  picPhone: string;
  city: string;
  track: PartnershipTrack;
  scaleEstimate: string;
  collaborationGoals: string;
  status: "submitted" | "in_review" | "approved";
  createdAt: string;
  aiEvaluation?: {
    synergyScore: number;
    strategicFitAnalysis: string;
    recommendedRoadmap: string[];
    potentialImpactMetrics: {
      reachEstimate: string;
      wellnessIndexBoost: string;
      estimatedCostEfficiency: string;
    };
    suggestedServices: string[];
  };
}

export type GoalCategory = "quran" | "breathing" | "dzikir" | "gratitude" | "charity" | "prayer" | "custom";

export type ReminderSoundType = "gentle_chime" | "singing_bowl" | "peaceful_bell" | "subtle_drop";

export interface GoalReminderConfig {
  enabled: boolean;
  time: string; // "HH:mm" e.g., "05:30", "09:00", "13:00", "20:00"
  periodLabel?: string; // "Subuh / Fajar", "Dhuha / Pagi", "Dzuhur / Siang", "Ashar / Sore", "Isya / Malam", "Sebelum Tidur"
  soundEnabled?: boolean;
  soundType?: ReminderSoundType;
  customMessage?: string;
  repeatFrequency?: "everyday" | "weekdays" | "weekends";
  lastNotifiedDate?: string; // "YYYY-MM-DD" to avoid repeated firing
}

export interface SpiritualDailyGoal {
  id: string;
  title: string;
  subtitle?: string;
  category: GoalCategory;
  estimatedMinutes?: number;
  completed: boolean;
  completedAt?: string;
  isCustom?: boolean;
  actionType?: "breathing" | "dzikir" | "quote" | "quran";
  reminder?: GoalReminderConfig;
  targetCount?: number; // Numerical target (e.g. 33, 100, 7, 1)
  currentCount?: number; // Current completed repetitions/count
  unitLabel?: string; // Unit label (e.g. "x dzikir", "kali", "ayat", "rakaat", "siklus")
}

export interface JournalSentimentAnalysis {
  primaryTone: string;
  valence: "positif" | "tenang" | "reflektif" | "berat_butuh_dukungan" | "cemas";
  sakinahScore: number; // 0-100 (Indeks ketenangan & ketangguhan jiwa)
  emotionalSummary: string;
  spiritualFeedback: string;
  quranicAnchor: {
    verse: string;
    arabic?: string;
    translation: string;
    tadabburInsight: string;
  };
  microPractice: {
    title: string;
    description: string;
  };
  customDua: {
    arabic: string;
    latin: string;
    meaning: string;
  };
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  hijriDate?: string;
  content: string;
  tags: string[];
  isPrivate: boolean; // Private for patient only vs shared with therapist
  isFavorite?: boolean;
  sentimentAnalysis?: JournalSentimentAnalysis;
  wordCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type BadgeTier = "bronze" | "silver" | "gold" | "emerald" | "platinum" | "royal";

export type SunnahCategory = "all" | "dzikir" | "sholat_sunnah" | "tilawah_amal" | "malam";

export interface SunnahChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  category: "dzikir" | "sholat_sunnah" | "tilawah_amal" | "malam";
  timeRecommendation: string;
  dalilReference: string;
  virtue: string;
  completed: boolean;
  targetCountText?: string;
  completedAt?: string;
  isCustom?: boolean;
  dzikirIdRef?: string;
}

export interface SpiritualBadge {
  id: string;
  title: string;
  code: string;
  category: "streak" | "mastery" | "tazkiyah" | "habit";
  tier: BadgeTier;
  iconName: string; // "Flame" | "Crown" | "Award" | "ShieldCheck" | "Sparkles" | "BookOpen" | "Wind" | "Heart" | "Star" | "Sun"
  requiredStreakDays?: number;
  description: string;
  spiritualBenefit: string;
  hadithOrVerseReference: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rewardTitle?: string;
  xpReward?: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  notifyViaWhatsApp: boolean;
  notifyViaSMS: boolean;
  silentNotificationEnabled: boolean;
  customSosMessage: string;
  isConfigured: boolean;
}

export interface SOSLogEntry {
  id: string;
  timestamp: string;
  triggerType: "long_press_button" | "keyboard_shortcut" | "nav_button" | "manual_hotline";
  contactName: string;
  contactPhone: string;
  messageDispatched: string;
  status: "dispatched" | "acknowledged" | "resolved";
}

