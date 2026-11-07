import React, { useState, useEffect, useRef } from "react";
import { 
  HeartHandshake, 
  CalendarCheck, 
  Users, 
  Sparkles, 
  Video, 
  Activity, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Calendar,
  ArrowRight,
  Stethoscope,
  Smile,
  BrainCircuit,
  Lock,
  MessageSquareQuote,
  Star,
  Heart,
  BookOpen,
  Wind,
  Bell
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { AppointmentWizard } from "./components/AppointmentWizard";
import { TherapistDirectory } from "./components/TherapistDirectory";
import { TelemedicineRoom } from "./components/TelemedicineRoom";
import { AICounselorChat } from "./components/AICounselorChat";
import { PsychometricScreening } from "./components/PsychometricScreening";
import { PatientPortal } from "./components/PatientPortal";
import { TherapistPortal } from "./components/TherapistPortal";
import { SmartPartnershipHub } from "./components/SmartPartnershipHub";
import { EmergencyCrisisModal } from "./components/EmergencyCrisisModal";
import { QuickSOSButton } from "./components/QuickSOSButton";
import { SOSNotificationToast } from "./components/SOSNotificationToast";
import { DailyDzikirSidebar } from "./components/DailyDzikirSidebar";
import { SpiritualDailyGoals } from "./components/SpiritualDailyGoals";
import { DailyDzikirProgressChart } from "./components/DailyDzikirProgressChart";
import { SpiritualReminderModal } from "./components/SpiritualReminderModal";
import { SpiritualToastNotification } from "./components/SpiritualToastNotification";
import { ThumaninahBreathingGuide } from "./components/ThumaninahBreathingGuide";
import { Footer } from "./components/Footer";
import { Therapist, Appointment, EmergencyContact, SOSLogEntry } from "./types";
import { INITIAL_THERAPISTS, INITIAL_APPOINTMENTS } from "./data/initialData";
import { SPIRITUAL_QUOTES, SpiritualQuote } from "./data/dzikirReflectionData";
import { soundSynth } from "./utils/audioChime";

const DEFAULT_EMERGENCY_CONTACT: EmergencyContact = {
  name: "Kontak Keluarga Terdekat",
  relationship: "Keluarga / Kerabat",
  phoneNumber: "+6281234567890",
  email: "kontak.darurat@islamicity.tv",
  notifyViaWhatsApp: true,
  notifyViaSMS: true,
  silentNotificationEnabled: true,
  customSosMessage: "Pemberitahuan Darurat: Saya sedang mengalami krisis mental / kecemasan akut dan membutuhkan bantuan segera melalui LimoCity Therapy.",
  isConfigured: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [therapists, setTherapists] = useState<Therapist[]>(INITIAL_THERAPISTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeAppointmentInRoom, setActiveAppointmentInRoom] = useState<Appointment | null>(
    INITIAL_APPOINTMENTS[0] || null
  );
  
  // Modal & Navigation states
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isTherapistMode, setIsTherapistMode] = useState<boolean>(false);
  const [preselectedTherapistId, setPreselectedTherapistId] = useState<string | undefined>(undefined);
  const [prefilledNotes, setPrefilledNotes] = useState<string>("");

  // Quick SOS & Emergency Contact States
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(() => {
    const saved = localStorage.getItem("limocity_emergency_contact");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_EMERGENCY_CONTACT;
  });
  const [isQuickSOSTriggered, setIsQuickSOSTriggered] = useState<boolean>(false);
  const [lastSosTimestamp, setLastSosTimestamp] = useState<string>("");
  const [isSOSNotificationVisible, setIsSOSNotificationVisible] = useState<boolean>(false);

  // Save emergency contact to localStorage on change
  const handleUpdateEmergencyContact = (updated: EmergencyContact) => {
    setEmergencyContact(updated);
    localStorage.setItem("limocity_emergency_contact", JSON.stringify(updated));
  };

  // Quick SOS Trigger Handler (Long-Press Gesture / Shortcut)
  const handleTriggerQuickSOS = (contactToUse?: EmergencyContact) => {
    const targetContact = contactToUse || emergencyContact;
    const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";
    
    setLastSosTimestamp(nowStr);
    setIsQuickSOSTriggered(true);

    // Save emergency log
    try {
      const logsStr = localStorage.getItem("limocity_emergency_sos_logs");
      const logs: SOSLogEntry[] = logsStr ? JSON.parse(logsStr) : [];
      const newLog: SOSLogEntry = {
        id: `sos-${Date.now()}`,
        timestamp: nowStr,
        triggerType: "long_press_button",
        contactName: targetContact.name,
        contactPhone: targetContact.phoneNumber,
        messageDispatched: targetContact.customSosMessage,
        status: "dispatched",
      };
      localStorage.setItem("limocity_emergency_sos_logs", JSON.stringify([newLog, ...logs.slice(0, 49)]));
    } catch (err) {}

    // Open emergency crisis modal immediately
    setIsEmergencyModalOpen(true);
    // Show silent notification toast HUD
    setIsSOSNotificationVisible(true);

    // Audio chime confirmation
    soundSynth.playSoundByType("peaceful_bell");
  };

  // Daily Dzikir & Reflection (Tazkiyatun Nafs) States
  const [isDzikirSidebarOpen, setIsDzikirSidebarOpen] = useState<boolean>(false);
  const [selectedDzikirIdForSidebar, setSelectedDzikirIdForSidebar] = useState<string | undefined>(undefined);
  const [isSpiritualModalOpen, setIsSpiritualModalOpen] = useState<boolean>(false);
  const [activeSpiritualQuote, setActiveSpiritualQuote] = useState<SpiritualQuote | undefined>(undefined);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastQuote, setToastQuote] = useState<SpiritualQuote | null>(null);

  // Periodic Reminder Configuration (default 3 mins for active engagement)
  const [reminderIntervalMinutes, setReminderIntervalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem("limocity_reminder_interval");
    return saved ? parseInt(saved, 10) : 3;
  });
  const [isReminderEnabled, setIsReminderEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("limocity_reminder_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("limocity_sound_enabled");
    return saved !== null ? saved === "true" : true;
  });

  // Save reminder preferences
  useEffect(() => {
    localStorage.setItem("limocity_reminder_interval", reminderIntervalMinutes.toString());
    localStorage.setItem("limocity_reminder_enabled", isReminderEnabled.toString());
    localStorage.setItem("limocity_sound_enabled", isSoundEnabled.toString());
  }, [reminderIntervalMinutes, isReminderEnabled, isSoundEnabled]);

  // Periodic gentle notification trigger
  useEffect(() => {
    if (!isReminderEnabled || reminderIntervalMinutes <= 0) return;

    const intervalMs = reminderIntervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      // Pick random quote
      const randQuote = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
      setToastQuote(randQuote);
      setIsToastVisible(true);

      if (isSoundEnabled) {
        soundSynth.playGentleChime();
      }

      // Auto dismiss toast after 14 seconds if not clicked
      setTimeout(() => {
        setIsToastVisible(false);
      }, 14000);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isReminderEnabled, reminderIntervalMinutes, isSoundEnabled]);

  // Fetch therapists and appointments from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [therapistsRes, appointmentsRes] = await Promise.all([
          fetch("/api/therapists"),
          fetch("/api/appointments"),
        ]);

        if (therapistsRes.ok) {
          const tData = await therapistsRes.json();
          if (tData.success && tData.therapists?.length) {
            setTherapists(tData.therapists);
          }
        }

        if (appointmentsRes.ok) {
          const aData = await appointmentsRes.json();
          if (aData.success && aData.appointments?.length) {
            setAppointments(aData.appointments);
            if (!activeAppointmentInRoom) {
              setActiveAppointmentInRoom(aData.appointments[0]);
            }
          }
        }
      } catch (err) {
        console.warn("Using initial local seed data:", err);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleOpenBookingWithTherapist = (therapistId?: string, notes?: string) => {
    setPreselectedTherapistId(therapistId);
    setPrefilledNotes(notes || "");
    setActiveTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartBookingWithScreeningNotes = (notes: string) => {
    setPrefilledNotes(notes);
    setPreselectedTherapistId(undefined);
    setActiveTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    setActiveAppointmentInRoom(newAppointment);
  };

  const handleEnterTelemedicineRoom = (appointment: Appointment) => {
    setActiveAppointmentInRoom(appointment);
    setActiveTab("telemedicine-room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateAppointmentNotes = (appointmentId: string, notes: any) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, clinicalNotes: notes } : a))
    );
    // Also patch to server
    fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicalNotes: notes }),
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] font-sans text-[#E2E8F0] flex flex-col selection:bg-[#C5A267]/30 selection:text-[#F3E8D2]">
      
      {/* Universal Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBookingWithTherapist()}
        onOpenEmergency={() => {
          setIsQuickSOSTriggered(false);
          setIsEmergencyModalOpen(true);
        }}
        onTriggerSOS={() => handleTriggerQuickSOS()}
        appointmentsCount={appointments.length}
        isTherapistMode={isTherapistMode}
        setIsTherapistMode={setIsTherapistMode}
        onOpenDzikirSidebar={() => setIsDzikirSidebarOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        
        {/* VIEW 1: Home Dashboard */}
        {activeTab === "home" && (
          <div>
            <HeroBanner
              onStartBooking={() => handleOpenBookingWithTherapist()}
              onOpenAICounselor={() => {
                setActiveTab("ai-counselor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenScreening={() => {
                setActiveTab("screening");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenPartnerships={() => {
                setActiveTab("partnerships");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenBreathingGuide={() => {
                const el = document.getElementById("thumaninah-breathing-guide");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              therapists={therapists}
            />

            {/* Interactive Thuma'ninah Breathing Guide (4-4-6 Rhythmic Anti-Panic Visualizer) */}
            <ThumaninahBreathingGuide
              onOpenAICounselor={() => {
                setActiveTab("ai-counselor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenBooking={() => handleOpenBookingWithTherapist()}
              onTriggerSOS={() => handleTriggerQuickSOS()}
              onOpenDzikirSidebar={() => setIsDzikirSidebarOpen(true)}
            />

            {/* Spiritual Daily Goals Interactive Section */}
            <section className="py-8 sm:py-12 bg-gradient-to-b from-[#0A0B0D] to-[#0E1015] border-b border-[#1F2937]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SpiritualDailyGoals
                  onOpenDzikirSidebar={() => setIsDzikirSidebarOpen(true)}
                  onOpenHikmahModal={() => {
                    const rand = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
                    setActiveSpiritualQuote(rand);
                    setIsSpiritualModalOpen(true);
                  }}
                />
              </div>
            </section>

            {/* Daily Dzikir Progress Analytics & Recharts Line Visualization Section */}
            <section className="py-8 sm:py-12 bg-[#0A0B0D] border-b border-[#1F2937]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DailyDzikirProgressChart
                  onOpenDzikirSidebar={() => setIsDzikirSidebarOpen(true)}
                />
              </div>
            </section>

            {/* Quick 3-Pillars Section */}
            <section className="py-14 bg-[#0E1015] border-b border-[#1F2937]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-3">
                    Keunggulan Ekosistem Telemedisin LimoCity
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    Kombinasi Psikoterapi Berbasis Sains & Spiritualitas Islami
                  </h2>
                  <p className="text-sm text-[#94A3B8] mt-2">
                    Kami merancang layanan telemedisin yang memudahkan siapapun menjangkau bantuan ahli tanpa hambatan jarak, rasa canggung, atau kekhawatiran privasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="p-6 rounded-3xl bg-[#141720] border border-[#1F2937] hover:border-[#C5A267]/50 hover:shadow-xl transition-all space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C202C] border border-[#C5A267]/30 text-[#C5A267] flex items-center justify-center shadow-md">
                      <CalendarCheck className="w-6 h-6 text-[#C5A267]" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      Penjadwalan Otomatis & Cepat
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Pilih psikolog berlisensi, tentukan tanggal dan jam luang Anda secara real-time dalam hitungan menit, lengkap dengan integrasi pengingat WhatsApp dan sinkronisasi Google Calendar.
                    </p>
                    <button
                      onClick={() => handleOpenBookingWithTherapist()}
                      className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1"
                    >
                      <span>Coba Jadwalkan Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="p-6 rounded-3xl bg-[#141720] border border-[#1F2937] hover:border-[#C5A267]/50 hover:shadow-xl transition-all space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C202C] border border-[#C5A267]/30 text-[#C5A267] flex items-center justify-center shadow-md">
                      <BrainCircuit className="w-6 h-6 text-[#C5A267]" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      Konselor AI Tazkiyatun Nafs
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Didukung kecerdasan Gemini 3.7 Flash untuk triase awal, mendengarkan beban emosi 24/7, serta memberikan panduan refleksi kognitif islami (I-CBT) dan dzikir penenang hati.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab("ai-counselor");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1"
                    >
                      <span>Mulai Curhat dengan AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="p-6 rounded-3xl bg-[#141720] border border-[#1F2937] hover:border-[#C5A267]/50 hover:shadow-xl transition-all space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C202C] border border-[#C5A267]/30 text-[#C5A267] flex items-center justify-center shadow-md">
                      <Video className="w-6 h-6 text-[#C5A267]" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      Ruang Konsultasi Terenkripsi
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Sesi tatap muka virtual berkualitas HD dengan standar keamanan medis WebRTC TLS 1.3, sensor sentimen emosional real-time, dan lembar resep rekam medis digital (EMR).
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab("telemedicine-room");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1"
                    >
                      <span>Jelajahi Ruang Virtual</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* Tazkiyatun Nafs • Daily Dzikir & Reflection Showcase Banner */}
            <section className="py-12 bg-gradient-to-r from-[#12151F] via-[#0F1218] to-[#141824] border-b border-[#1F2937] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-[#141722]/90 border border-[#C5A267]/40 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                  
                  <div className="space-y-3 max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C5A267]/15 border border-[#C5A267]/30 text-[#C5A267] rounded-full text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                      <span>Fitur Ruhani • Tazkiyatun Nafs Harian</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white leading-tight">
                      Dzikir, Tasbih Digital & Refleksi Ketenangan Batin
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Latih ketenangan jiwa dengan koleksi dzikir shahih penenang gelisah, tasbih interaktif terpadu, pernafasan *thuma'ninah*, serta pengingat berkala untuk menjaga kebersihan hati (*Qolbun Salim*) di sela kesibukan Anda.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[#CBD5E1]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Tasbih Digital Interaktif
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Pengingat Hati Otomatis
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Nafas Thuma'ninah 4-4-6
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
                    <button
                      id="home-open-dzikir-sidebar-btn"
                      onClick={() => setIsDzikirSidebarOpen(true)}
                      className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-[#C5A267]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Buka Dzikir & Tasbih Sekarang</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>

                    <button
                      onClick={() => {
                        const rand = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
                        setActiveSpiritualQuote(rand);
                        setIsSpiritualModalOpen(true);
                      }}
                      className="bg-[#181C26] hover:bg-[#252E3E] text-[#E2E8F0] border border-[#252E3E] font-semibold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#C5A267]" />
                      <span>Lihat Hikmah Penyejuk Jiwa</span>
                    </button>
                  </div>

                </div>
              </div>
            </section>

            {/* Featured Therapists Carousel on Home */}
            <section className="py-14 bg-[#0A0B0D]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A267]">
                      Tim Profesional Kami
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                      Praktisi Psikolog & Psikiater Pilihan
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("therapists");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1.5"
                  >
                    <span>Lihat Semua Direktori Praktisi ({therapists.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {therapists.slice(0, 3).map((therapist) => (
                    <div
                      key={therapist.id}
                      className="bg-[#111318] rounded-3xl p-5 border border-[#1F2937] hover:border-[#C5A267]/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start space-x-3.5 mb-4">
                          <img
                            src={therapist.photoUrl}
                            alt={therapist.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A267]/30 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1 text-[#C5A267] font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-[#C5A267]" />
                              <span>{therapist.rating} ({therapist.reviewsCount})</span>
                            </div>
                            <h4 className="font-bold text-white text-sm mt-0.5 leading-snug">
                              {therapist.name}
                            </h4>
                            <p className="text-xs text-[#C5A267] font-medium">{therapist.title}</p>
                          </div>
                        </div>

                        <p className="text-xs text-[#94A3B8] line-clamp-2 mb-3">
                          {therapist.bio}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {therapist.specialties.slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#181C26] border border-[#252E3E] text-[#94A3B8] rounded text-[11px] font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          Rp {therapist.pricePerSession.toLocaleString("id-ID")}{" "}
                          <span className="text-[10px] font-normal text-[#64748B]">/ 60 mnt</span>
                        </span>

                        <button
                          onClick={() => handleOpenBookingWithTherapist(therapist.id)}
                          className="px-3.5 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-black" />
                          <span>Jadwalkan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Strategic Partnership Callout on Home */}
            <section className="py-14 bg-gradient-to-br from-[#12151E] via-[#0E1015] to-[#0A0B0D] border-t border-[#1F2937]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#141720] border border-[#C5A267]/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-center lg:text-left">
                    <span className="px-3.5 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block">
                      Induk Layanan Kesehatan LimoCity Therapy
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white leading-tight">
                      Bagaimana Cara Cerdas Berdaya Terbaik Kerjasama dengan Kami?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      Kami membuka kolaborasi strategis bagi <strong>Korporasi, Rumah Sakit/Faskes Rujukan, Praktisi Psikolog/Dokter Jiwa, serta Lembaga Dakwah & Pendidikan</strong> untuk menghadirkan layanan kesehatan mental telemedisin terintegrasi dengan prinsip syariah yang adil, transparan, dan berdaya guna tinggi.
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[#E2E8F0]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Corporate EAP 24/7
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Bridging API Rekam Medis
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                        Bagi Hasil Transparan 85%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab("partnerships");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-[#C5A267]/20 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Pelajari & Ajukan Kemitraan</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("partnerships");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E] font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                    >
                      <span>Simulasi Kalkulator Dampak</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials / Patient Impact */}
            <section className="py-14 bg-[#0E1015] border-t border-[#1F2937]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A267]">
                    Dampak Nyata Pasien
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                    Cerita Mereka yang Menemukan Kembali Titik Terang
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      quote: "Sesi konseling I-CBT bersama Dr. Aisyah benar-benar mengubah cara saya memandang kecemasan kerja. Saya diajarkan membedakan fakta dan asumsi overthinking sambil tetap bertawakkal.",
                      author: "Hendra K., 34 Thn",
                      focus: "Kecemasan Karier & Panic Attack"
                    },
                    {
                      quote: "Konseling pernikahan sakinah membantu kami menemukan bahasa cinta yang hilang. Sangat praktis, solutif, dan penuh bimbingan yang menyentuh nurani.",
                      author: "Fajar & Dina, Pasutri 5 Thn",
                      focus: "Resolusi Konflik Keluarga"
                    },
                    {
                      quote: "Fitur penjadwalan telemedisinnya sangat mudah. Hanya 3 menit saya sudah dapat slot dokter dan link konsultasi langsung masuk ke WhatsApp & kalender saya.",
                      author: "Rina S., 28 Thn",
                      focus: "Burnout & Self-Worth"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-[#141720] border border-[#1F2937] space-y-4 flex flex-col justify-between">
                      <p className="text-xs sm:text-sm text-[#E2E8F0] italic leading-relaxed">
                        "{item.quote}"
                      </p>
                      <div className="pt-3 border-t border-[#1F2937]">
                        <h5 className="font-bold text-white text-xs">{item.author}</h5>
                        <span className="text-[11px] text-[#C5A267] font-semibold">{item.focus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: Appointment Booking Wizard */}
        {activeTab === "booking" && (
          <AppointmentWizard
            therapists={therapists}
            onAppointmentCreated={handleAppointmentCreated}
            onEnterTelemedicineRoom={handleEnterTelemedicineRoom}
            preselectedTherapistId={preselectedTherapistId}
            prefilledNotes={prefilledNotes}
          />
        )}

        {/* VIEW 3: Therapist Directory */}
        {activeTab === "therapists" && (
          <TherapistDirectory
            therapists={therapists}
            onSelectTherapistForBooking={handleOpenBookingWithTherapist}
            onNavigateToScreening={() => {
              setActiveTab("screening");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* VIEW 4: AI Tazkiyah Counselor */}
        {activeTab === "ai-counselor" && (
          <AICounselorChat
            onBookSession={() => handleOpenBookingWithTherapist()}
          />
        )}

        {/* VIEW 5: Telemedicine Consultation Virtual Room */}
        {activeTab === "telemedicine-room" && (
          <TelemedicineRoom
            appointment={activeAppointmentInRoom}
            onLeaveRoom={() => setActiveTab("portal")}
          />
        )}

        {/* VIEW 6: Psychometric Screening DASS-21 */}
        {activeTab === "screening" && (
          <PsychometricScreening
            therapists={therapists}
            onStartBookingWithResults={handleStartBookingWithScreeningNotes}
            onSelectTherapistForBooking={handleOpenBookingWithTherapist}
          />
        )}

        {/* VIEW 7: Patient Portal (EMR & Mood Tracker & Daily Reflection Journal) */}
        {activeTab === "portal" && (
          <PatientPortal
            appointments={appointments}
            onEnterTelemedicineRoom={handleEnterTelemedicineRoom}
            onBookNewSession={() => handleOpenBookingWithTherapist()}
            onOpenDzikirSidebar={() => setIsDzikirSidebarOpen(true)}
          />
        )}

        {/* VIEW 8: Therapist / Doctor Clinical Portal */}
        {activeTab === "therapist-portal" && (
          <TherapistPortal
            appointments={appointments}
            onEnterTelemedicineRoom={handleEnterTelemedicineRoom}
            onUpdateAppointmentNotes={handleUpdateAppointmentNotes}
          />
        )}

        {/* VIEW 9: Smart Partnership Hub (Kemitraan Cerdas Berdaya) */}
        {activeTab === "partnerships" && (
          <SmartPartnershipHub
            onNavigateToBooking={() => handleOpenBookingWithTherapist()}
            onNavigateToAICounselor={() => {
              setActiveTab("ai-counselor");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

      </main>

      {/* Floating Quick-Access Daily Dzikir & Tazkiyah Button (Desktop & Mobile) */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center space-x-2">
        <button
          id="floating-dzikir-btn"
          onClick={() => setIsDzikirSidebarOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-2.5 bg-gradient-to-r from-[#181C26] to-[#12151E] hover:from-[#C5A267] hover:to-[#D8B57B] text-[#C5A267] hover:text-black rounded-full border border-[#C5A267]/50 shadow-xl shadow-black/60 transition-all duration-300 active:scale-95"
          title="Buka Dzikir & Refleksi Harian Tazkiyatun Nafs"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#C5A267] group-hover:text-black transition-colors" />
            <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-ping absolute -top-1 -right-1" />
          </div>
          <span className="text-xs font-bold font-serif tracking-wide hidden sm:inline">
            Dzikir & Refleksi Harian
          </span>
          <span className="text-xs font-bold font-serif sm:hidden">
            Dzikir
          </span>
        </button>
      </div>

      {/* Quick SOS Trigger Button (Long-Press 1.5s Gesture & Contact Config) */}
      <QuickSOSButton
        onTriggerSOS={handleTriggerQuickSOS}
        emergencyContact={emergencyContact}
        onUpdateEmergencyContact={handleUpdateEmergencyContact}
      />

      {/* Emergency Crisis Modal (Hotline 24/7 & Emergency Contact Dispatch) */}
      <EmergencyCrisisModal
        isOpen={isEmergencyModalOpen}
        onClose={() => {
          setIsEmergencyModalOpen(false);
          setIsQuickSOSTriggered(false);
        }}
        isQuickSOSTriggered={isQuickSOSTriggered}
        emergencyContact={emergencyContact}
        lastSosTimestamp={lastSosTimestamp}
      />

      {/* Silent SOS Notification Toast HUD */}
      <SOSNotificationToast
        isVisible={isSOSNotificationVisible}
        onDismiss={() => setIsSOSNotificationVisible(false)}
        onOpenCrisisModal={() => setIsEmergencyModalOpen(true)}
        contact={emergencyContact}
        timestamp={lastSosTimestamp}
      />

      {/* Daily Dzikir & Tazkiyatun Nafs Sidebar Drawer */}
      <DailyDzikirSidebar
        isOpen={isDzikirSidebarOpen}
        onClose={() => {
          setIsDzikirSidebarOpen(false);
          setSelectedDzikirIdForSidebar(undefined);
        }}
        selectedDzikirId={selectedDzikirIdForSidebar}
        onOpenSpiritualModal={(quote) => {
          setActiveSpiritualQuote(quote);
          setIsSpiritualModalOpen(true);
        }}
        reminderIntervalMinutes={reminderIntervalMinutes}
        setReminderIntervalMinutes={setReminderIntervalMinutes}
        isReminderEnabled={isReminderEnabled}
        setIsReminderEnabled={setIsReminderEnabled}
        isSoundEnabled={isSoundEnabled}
        setIsSoundEnabled={setIsSoundEnabled}
      />

      {/* Periodic Spiritual Encouragement Modal */}
      <SpiritualReminderModal
        isOpen={isSpiritualModalOpen}
        onClose={() => setIsSpiritualModalOpen(false)}
        quote={activeSpiritualQuote}
        onOpenDzikirSidebar={(dzikirId) => {
          setSelectedDzikirIdForSidebar(dzikirId);
          setIsDzikirSidebarOpen(true);
        }}
        isSoundEnabled={isSoundEnabled}
        onSnooze={(mins) => {
          setIsToastVisible(false);
        }}
      />

      {/* Subtle Toast Notification that gently pops up on periodic trigger */}
      <SpiritualToastNotification
        isVisible={isToastVisible}
        quote={toastQuote}
        onOpenFullModal={() => {
          setIsToastVisible(false);
          setActiveSpiritualQuote(toastQuote || undefined);
          setIsSpiritualModalOpen(true);
        }}
        onOpenSidebar={() => {
          setIsToastVisible(false);
          setIsDzikirSidebarOpen(true);
        }}
        onDismiss={() => setIsToastVisible(false)}
      />

      {/* Universal Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === "dzikir") {
            setIsDzikirSidebarOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

    </div>
  );
}
