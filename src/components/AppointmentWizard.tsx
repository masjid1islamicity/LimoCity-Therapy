import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  Building, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  User, 
  Mail, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  Award, 
  Star,
  QrCode,
  Share2,
  Download,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import { Therapist, Appointment, ConsultationMode, PackageType, TriageResult } from "../types";

interface AppointmentWizardProps {
  therapists: Therapist[];
  onAppointmentCreated: (appointment: Appointment) => void;
  onEnterTelemedicineRoom: (appointment: Appointment) => void;
  preselectedTherapistId?: string;
  prefilledNotes?: string;
}

export const AppointmentWizard: React.FC<AppointmentWizardProps> = ({
  therapists,
  onAppointmentCreated,
  onEnterTelemedicineRoom,
  preselectedTherapistId,
  prefilledNotes = "",
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>("video");
  const [packageType, setPackageType] = useState<PackageType>("single");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  
  // Patient details form
  const [patientName, setPatientName] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [consultationFocus, setConsultationFocus] = useState<string>("");
  const [notesFromPatient, setNotesFromPatient] = useState<string>(prefilledNotes);
  const [sendWhatsAppReminder, setSendWhatsAppReminder] = useState<boolean>(true);

  // AI Triage Assist within Wizard
  const [isAiMatching, setIsAiMatching] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiTriageResult, setAiTriageResult] = useState<TriageResult | null>(null);

  // Created Appointment State
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize dates
  const nextDates = React.useMemo(() => {
    const list: { label: string; dateStr: string; dayName: string }[] = [];
    const daysIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthsIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = daysIndo[d.getDay()];
      const dateStr = d.toISOString().split("T")[0];
      const label = `${d.getDate()} ${monthsIndo[d.getMonth()]}`;
      list.push({ label, dateStr, dayName });
    }
    return list;
  }, []);

  useEffect(() => {
    if (nextDates.length > 0 && !selectedDate) {
      setSelectedDate(nextDates[0].dateStr);
    }
  }, [nextDates, selectedDate]);

  // Handle preselected therapist if passed
  useEffect(() => {
    if (preselectedTherapistId && therapists.length > 0) {
      const found = therapists.find((t) => t.id === preselectedTherapistId);
      if (found) {
        setSelectedTherapist(found);
        setStep(2);
      }
    }
  }, [preselectedTherapistId, therapists]);

  // Trigger AI Triage matchmaker
  const handleRunAiMatchmaker = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiMatching(true);
    try {
      const res = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: aiPrompt }),
      });
      const data = await res.json();
      if (data.success && data.triage) {
        setAiTriageResult(data.triage);
        setConsultationFocus(data.triage.recommendedSpecialty);
        if (data.triage.matchingTherapistId) {
          const match = therapists.find(t => t.id === data.triage.matchingTherapistId);
          if (match) setSelectedTherapist(match);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiMatching(false);
    }
  };

  // Filter therapists
  const filteredTherapists = therapists.filter((t) => {
    if (selectedCategory === "all") return true;
    return t.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())) ||
           t.approach.some(a => a.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  // Calculate pricing
  const calculateTotalAmount = () => {
    if (!selectedTherapist) return 0;
    const base = selectedTherapist.pricePerSession;
    if (packageType === "intensive-4") return base * 3.5;
    if (packageType === "couple-sakinah") return base * 1.5;
    return base;
  };

  // Submit Booking
  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTherapist || !selectedDate || !selectedSlot) {
      alert("Mohon lengkapi pilihan tanggal dan waktu sesi.");
      return;
    }
    if (!patientName || !patientEmail) {
      alert("Mohon isi nama dan email Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientName,
        patientEmail,
        patientPhone: patientPhone || "+62 812-3456-7890",
        therapistId: selectedTherapist.id,
        consultationType: consultationMode,
        date: selectedDate,
        timeSlot: selectedSlot,
        packageType,
        consultationFocus: consultationFocus || "Konseling Kesehatan Jiwa & Tazkiyatun Nafs",
        notesFromPatient: notesFromPatient || "Konsultasi mandiri via telemedisin LimoCity Therapy.",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.appointment) {
        setCreatedAppointment(data.appointment);
        onAppointmentCreated(data.appointment);
        setStep(5); // Success confirmation step

        // Celebration Confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#10b981", "#059669", "#f59e0b", "#0d9488"],
          });
        } catch (cErr) {
          // ignore if canvas blocked
        }
      } else {
        alert(data.message || "Gagal membuat janji temu. Silakan coba lagi.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#E2E8F0]">
      
      {/* Wizard Header Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider">
                Layanan Telemedisin
              </span>
              <span className="text-xs text-[#64748B] font-medium">• 100% Terenkripsi & Rahasia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
              {step === 5 ? "Janji Temu Berhasil Dijadwalkan" : "Penjadwalan Janji Temu Konseling"}
            </h2>
          </div>

          {step < 5 && (
            <div className="text-right">
              <span className="text-xs font-semibold text-[#C5A267] bg-[#181C26] px-3 py-1.5 rounded-lg border border-[#2B3548]">
                Langkah {step} dari 4
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar Indicator */}
        {step < 5 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-[#C5A267]" : "bg-[#1F2937]"}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-[#C5A267]" : "bg-[#1F2937]"}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-[#C5A267]" : "bg-[#1F2937]"}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 4 ? "bg-[#C5A267]" : "bg-[#1F2937]"}`}></div>
          </div>
        )}
      </div>

      {/* STEP 1: Select Therapist & Specialization (or AI Matchmaker) */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* AI Smart Matchmaker Banner */}
          <div className="bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-[#C5A267]/40">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-[#C5A267]/20 rounded-xl text-[#C5A267] shrink-0 border border-[#C5A267]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">
                  Butuh Bantuan Memilih Psikolog yang Tepat? (Pencocokan Cerdas AI)
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Tuliskan keluhan atau apa yang sedang Anda rasakan. AI Tazkiyatun Nafs kami akan menganalisis dan merekomendasikan spesialis terbaik.
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Contoh: Saya sering cemas berlebihan saat memikirkan pekerjaan dan sulit tidur..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1015] border border-[#252E3E] text-white placeholder-[#64748B] text-xs sm:text-sm focus:outline-hidden focus:border-[#C5A267]"
                  />
                  <button
                    onClick={handleRunAiMatchmaker}
                    disabled={isAiMatching || !aiPrompt.trim()}
                    className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-[#C5A267]/20"
                  >
                    {isAiMatching ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        <span>Menganalisis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Cocokkan Terapis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Triage Result Box */}
                {aiTriageResult && (
                  <div className="mt-4 p-4 rounded-xl bg-[#0E1015] border border-[#C5A267]/40 text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between font-semibold text-[#C5A267]">
                      <span>Rekomendasi Spesialisasi: {aiTriageResult.recommendedSpecialty}</span>
                      <span className="px-2 py-0.5 bg-[#181C26] text-[#C5A267] rounded text-[11px] border border-[#252E3E]">
                        Tingkat: {aiTriageResult.severityAssessment}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0]">{aiTriageResult.summaryEmosi}</p>
                    <div className="text-[11px] text-[#C5A267] italic bg-[#141720] p-2 rounded-lg border border-[#252E3E]">
                      💡 Refleksi Qur'ani: {aiTriageResult.quranicReflection}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Filter Berdasarkan Kebutuhan Konseling:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: "all", label: "Semua Terapis" },
                { id: "Kecemasan", label: "Kecemasan & Overthinking" },
                { id: "Depresi", label: "Depresi & Pemulihan Jiwa" },
                { id: "Keluarga", label: "Pernikahan & Keluarga Sakinah" },
                { id: "Remaja", label: "Remaja & Krisis Karier" },
                { id: "Psikosomatis", label: "Psikosomatis & Psikiater (Sp.KJ)" },
                { id: "Parenting", label: "Parenting & Anak" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#C5A267] text-black font-bold shadow-xs"
                      : "bg-[#141720] text-[#94A3B8] border border-[#252E3E] hover:bg-[#1D2230] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Therapist Selection Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTherapists.map((therapist) => {
              const isSelected = selectedTherapist?.id === therapist.id;
              return (
                <div
                  key={therapist.id}
                  onClick={() => setSelectedTherapist(therapist)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all bg-[#111318] hover:shadow-lg relative ${
                    isSelected
                      ? "border-[#C5A267] ring-2 ring-[#C5A267]/20 bg-[#181C26]"
                      : "border-[#1F2937] hover:border-[#374151]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-[#C5A267]">
                      <CheckCircle2 className="w-6 h-6 fill-[#C5A267] text-black" />
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <img
                      src={therapist.photoUrl}
                      alt={therapist.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A267]/30 shrink-0"
                    />
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-base leading-tight">
                          {therapist.name}
                        </h4>
                      </div>
                      <p className="text-xs font-semibold text-[#C5A267] mt-0.5">
                        {therapist.title}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1 text-[#C5A267] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#C5A267] text-[#C5A267]" />
                          {therapist.rating} ({therapist.reviewsCount})
                        </span>
                        <span>•</span>
                        <span>{therapist.experienceYears} Thn Pengalaman</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-[#1F2937]">
                    <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Spesialisasi & Pendekatan:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {therapist.specialties.map((spec, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#181C26] border border-[#252E3E] text-[#94A3B8] rounded-md text-[11px] font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">Tarif Sesi Telemedisin:</span>
                      <span className="text-sm font-bold text-white">
                        Rp {therapist.pricePerSession.toLocaleString("id-ID")}{" "}
                        <span className="text-[11px] font-normal text-[#64748B]">/ 60 mnt</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTherapist(therapist);
                        setStep(2);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected 
                          ? "bg-[#C5A267] text-black shadow-xs" 
                          : "bg-[#181C26] hover:bg-[#C5A267] hover:text-black text-[#C5A267] border border-[#252E3E]"
                      }`}
                    >
                      Pilih & Lanjut →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4">
            <button
              disabled={!selectedTherapist}
              onClick={() => setStep(2)}
              className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold px-7 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-[#C5A267]/20"
            >
              <span>Lanjut ke Metode & Paket</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Consultation Mode & Package Selection */}
      {step === 2 && selectedTherapist && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Selected Therapist Summary Header */}
          <div className="p-4 rounded-xl bg-[#141720] border border-[#252E3E] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={selectedTherapist.photoUrl}
                alt={selectedTherapist.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A267]"
              />
              <div>
                <span className="text-[11px] text-[#C5A267] font-bold uppercase tracking-wider">Terapis Terpilih:</span>
                <h4 className="font-bold text-white text-sm">{selectedTherapist.name}</h4>
                <p className="text-xs text-[#94A3B8]">{selectedTherapist.title}</p>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-[#C5A267] hover:text-[#D8B57B] underline"
            >
              Ganti Terapis
            </button>
          </div>

          {/* Consultation Mode Options */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">
              1. Pilih Media Konsultasi Telemedisin:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "video" as ConsultationMode,
                  title: "Video Call HD Terenkripsi",
                  desc: "Tatap muka virtual langsung, paling direkomendasikan untuk pembacaan emosi mendalam.",
                  icon: Video,
                  badge: "Paling Populer"
                },
                {
                  id: "voice" as ConsultationMode,
                  title: "Panggilan Suara Jernih",
                  desc: "Konsultasi audio tanpa kamera jika Anda membutuhkan privasi visual lebih santai.",
                  icon: Phone,
                },
                {
                  id: "chat" as ConsultationMode,
                  title: "Chat Konseling Interaktif",
                  desc: "Konseling tertulis terpandu untuk Anda yang lebih nyaman mengekspresikan via teks.",
                  icon: MessageSquare,
                },
                {
                  id: "clinic" as ConsultationMode,
                  title: "Tatap Muka Klinik Mitra",
                  desc: "Sesi offline di klinik rekanan LimoCity Therapy di Jakarta / Surabaya / Bandung.",
                  icon: Building,
                }
              ].map((mode) => {
                const isCurrent = consultationMode === mode.id;
                const Icon = mode.icon;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setConsultationMode(mode.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-[#111318] relative ${
                      isCurrent
                        ? "border-[#C5A267] bg-[#181C26] ring-2 ring-[#C5A267]/20"
                        : "border-[#1F2937] hover:border-[#374151]"
                    }`}
                  >
                    {mode.badge && (
                      <span className="absolute -top-2.5 right-3 bg-[#C5A267] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {mode.badge}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-[#1C202C] text-[#C5A267] border border-[#C5A267]/30 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#C5A267]" />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1">{mode.title}</h5>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{mode.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">
              2. Pilih Paket Konseling:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "single" as PackageType,
                  name: "Sesi Tunggal (Single Session)",
                  duration: "60 Menit",
                  price: selectedTherapist.pricePerSession,
                  desc: "Cocok untuk curhat terarah, penanganan krisis mendadak, atau sesi evaluasi berkala.",
                  features: ["1x Sesi Konsultasi Lengkap", "Catatan EMR & Resep Self-Care", "Rekaman Audio Dzikir Relaksasi"]
                },
                {
                  id: "intensive-4" as PackageType,
                  name: "Paket Pemulihan 4 Sesi (Best Value)",
                  duration: "4x 60 Menit (1 Bulan)",
                  price: selectedTherapist.pricePerSession * 3.5,
                  discountBadge: "Hemat 15%",
                  desc: "Program pendampingan berkelanjutan untuk penyembuhan trauma, depresi, atau kecemasan menahun.",
                  features: ["4x Sesi Terjadwal Fleksibel", "Lembar Kerja I-CBT Personal", "Prioritas Chat Darurat Antar Sesi"]
                },
                {
                  id: "couple-sakinah" as PackageType,
                  name: "Konseling Pasangan Sakinah",
                  duration: "90 Menit",
                  price: selectedTherapist.pricePerSession * 1.5,
                  desc: "Dikhususkan untuk suami-istri atau bimbingan pranikah dalam menyelaraskan visi hati.",
                  features: ["Sesi Bersama 90 Menit", "Panduan Komunikasi Rahmah", "Rencana Tindak Lanjut Sakinah"]
                }
              ].map((pkg) => {
                const isSelected = packageType === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setPackageType(pkg.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all bg-[#111318] relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#C5A267] bg-[#181C26] ring-2 ring-[#C5A267]/20"
                        : "border-[#1F2937] hover:border-[#374151]"
                    }`}
                  >
                    {pkg.discountBadge && (
                      <span className="absolute -top-2.5 right-3 bg-[#C5A267] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {pkg.discountBadge}
                      </span>
                    )}
                    <div>
                      <h5 className="font-bold text-white text-base">{pkg.name}</h5>
                      <span className="text-xs font-semibold text-[#C5A267] bg-[#C5A267]/15 border border-[#C5A267]/30 px-2 py-0.5 rounded inline-block mt-1">
                        Durasi: {pkg.duration}
                      </span>
                      <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{pkg.desc}</p>
                      
                      <ul className="mt-3 space-y-1.5 text-xs text-[#94A3B8]">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A267] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#1F2937] flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? "text-[#C5A267]" : "text-[#64748B]"}`}>
                        {isSelected ? "✓ Terpilih" : "Pilih"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-[#2B3548] hover:bg-[#181C26] text-[#94A3B8] text-sm font-medium flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-7 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-[#C5A267]/20"
            >
              <span>Lanjut ke Pilih Waktu</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Date & Time Slot Picker */}
      {step === 3 && selectedTherapist && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-4 rounded-xl bg-[#141720] border border-[#252E3E] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] font-medium">Terapis:</span>
              <h4 className="text-sm font-bold text-white">{selectedTherapist.name}</h4>
              <p className="text-xs text-[#C5A267] font-medium">
                Metode: {consultationMode.toUpperCase()} • {packageType}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#64748B]">Estimasi Biaya:</span>
              <p className="text-base font-bold text-[#C5A267]">
                Rp {calculateTotalAmount().toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Date Picker Carousel */}
          <div>
            <label className="block text-sm font-bold text-white mb-2.5 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#C5A267]" />
              <span>1. Pilih Tanggal Konsultasi:</span>
            </label>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {nextDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    onClick={() => {
                      setSelectedDate(item.dateStr);
                      setSelectedSlot(""); // reset slot on date change
                    }}
                    className={`min-w-[100px] p-3 rounded-xl border-2 text-center transition-all shrink-0 ${
                      isSelected
                        ? "border-[#C5A267] bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20"
                        : "border-[#1F2937] bg-[#111318] hover:border-[#374151] text-[#94A3B8]"
                    }`}
                  >
                    <span className={`block text-xs font-semibold uppercase ${isSelected ? "text-black" : "text-[#64748B]"}`}>
                      {item.dayName}
                    </span>
                    <span className="block text-sm font-bold mt-0.5">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker Grid */}
          <div>
            <label className="block text-sm font-bold text-white mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5A267]" />
              <span>2. Pilih Slot Jam Konsultasi yang Tersedia:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {selectedTherapist.availableSlots.map((slot, idx) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? "border-[#C5A267] bg-[#181C26] text-[#C5A267] font-bold ring-2 ring-[#C5A267]/20"
                        : "border-[#1F2937] bg-[#111318] hover:border-[#374151] text-[#94A3B8] text-xs font-medium"
                    }`}
                  >
                    <span className="block text-xs font-bold">{slot}</span>
                    <span className="text-[10px] text-[#C5A267] flex items-center justify-center gap-1 mt-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A267]"></span>
                      Tersedia
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timezone Note */}
          <div className="p-3 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-[#94A3B8] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C5A267] shrink-0" />
            <span>
              Waktu menggunakan zona Waktu Indonesia Barat (WIB). Tautan telemedisin akan aktif 10 menit sebelum sesi dimulai.
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-[#2B3548] hover:bg-[#181C26] text-[#94A3B8] text-sm font-medium flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(4)}
              className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black font-bold px-7 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-[#C5A267]/20"
            >
              <span>Lanjut ke Data Diri</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 4: Patient Info & Final Confirmation */}
      {step === 4 && selectedTherapist && (
        <form onSubmit={handleCompleteBooking} className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Form: Patient details */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-[#1F2937] pb-2">
                Informasi Pasien / Klien
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Nama Lengkap Pasien *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Nama lengkap Anda..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white focus:outline-hidden focus:border-[#C5A267]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Email Aktif *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                    No. WhatsApp / HP *
                  </label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Fokus / Topik Utama Konsultasi
                </label>
                <input
                  type="text"
                  value={consultationFocus}
                  onChange={(e) => setConsultationFocus(e.target.value)}
                  placeholder="Contoh: Mengatasi rasa cemas masa depan & insomnia"
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Catatan Ringkas / Gejala untuk Psikolog (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notesFromPatient}
                  onChange={(e) => setNotesFromPatient(e.target.value)}
                  placeholder="Ceritakan ringkas apa yang paling ingin Anda bahas atau jika ada hal penting yang perlu diketahui terapis..."
                  className="w-full px-4 py-2 bg-[#0E1015] border border-[#252E3E] rounded-xl text-sm text-white focus:outline-hidden focus:border-[#C5A267]"
                />
              </div>

              <div className="p-3 bg-[#141720] border border-[#252E3E] rounded-xl flex items-center space-x-3 text-xs text-[#94A3B8]">
                <input
                  type="checkbox"
                  id="wa-reminder"
                  checked={sendWhatsAppReminder}
                  onChange={(e) => setSendWhatsAppReminder(e.target.checked)}
                  className="rounded text-[#C5A267] focus:ring-[#C5A267] w-4 h-4 bg-[#0E1015] border-[#252E3E]"
                />
                <label htmlFor="wa-reminder" className="cursor-pointer font-medium text-[#E2E8F0]">
                  Kirimkan pengingat janji temu & tautan ruang telemedisin via WhatsApp & Email
                </label>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#111318] text-white rounded-2xl p-5 shadow-xl border border-[#1F2937] sticky top-24 space-y-4">
                <h4 className="text-sm font-bold text-[#C5A267] uppercase tracking-wider border-b border-[#1F2937] pb-2">
                  Ringkasan Janji Temu
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Terapis:</span>
                    <span className="font-bold text-white text-right">{selectedTherapist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Metode:</span>
                    <span className="font-semibold text-[#C5A267] uppercase">{consultationMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Tanggal:</span>
                    <span className="font-bold text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Waktu:</span>
                    <span className="font-bold text-[#C5A267]">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Paket:</span>
                    <span className="font-medium text-[#E2E8F0]">{packageType}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F2937] flex justify-between items-center">
                  <span className="text-xs text-[#94A3B8]">Total Biaya Sesi:</span>
                  <span className="text-lg font-bold text-[#C5A267]">
                    Rp {calculateTotalAmount().toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="bg-[#141720] p-3 rounded-xl border border-[#252E3E] text-[11px] text-[#94A3B8] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#C5A267]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Jaminan Kerahasiaan Medis (HIPAA / Permenkes)</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Data dan rekam konseling Anda terlindungi dengan standar enkripsi medis 256-bit.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#C5A267]/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Memproses Janji Temu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-black" />
                      <span>Konfirmasi & Jadwalkan Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-[#2B3548] hover:bg-[#181C26] text-[#94A3B8] text-sm font-medium flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>

        </form>
      )}

      {/* STEP 5: Success Confirmation & E-Ticket */}
      {step === 5 && createdAppointment && (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
          
          {/* E-Ticket Card */}
          <div className="bg-[#111318] rounded-3xl border-2 border-[#C5A267]/50 shadow-2xl overflow-hidden">
            
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-[#181C26] via-[#1A1E2A] to-[#12141C] text-white p-6 relative border-b border-[#252E3E]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#C5A267] uppercase">
                    E-Ticket Telemedisin LimoCity Therapy
                  </span>
                  <h3 className="text-xl font-bold font-serif mt-0.5 text-white">
                    Konfirmasi Janji Temu Konseling
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#1C202C] border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267]">
                  <CheckCircle2 className="w-7 h-7 text-[#C5A267]" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 bg-[#0E1015] px-3.5 py-2 rounded-xl text-xs border border-[#252E3E]">
                <span className="text-[#94A3B8]">Kode Booking:</span>
                <span className="font-mono font-bold text-[#C5A267] text-sm tracking-wider">
                  {createdAppointment.bookingCode}
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] block font-medium">Nama Pasien:</span>
                  <span className="text-sm font-bold text-white">{createdAppointment.patientName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Terapis / Konselor:</span>
                  <span className="text-sm font-bold text-white">{createdAppointment.therapistName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Jadwal Sesi:</span>
                  <span className="text-sm font-bold text-[#C5A267]">{createdAppointment.date}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Waktu Sesi:</span>
                  <span className="text-sm font-bold text-white">{createdAppointment.timeSlot}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#141720] rounded-xl border border-[#252E3E] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-[#C5A267]" />
                  <span className="font-semibold text-[#94A3B8]">Ruang Telemedisin Virtual:</span>
                </div>
                <span className="font-mono text-[#C5A267] text-[11px] font-bold">
                  {createdAppointment.meetingLink}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onEnterTelemedicineRoom(createdAppointment)}
                  className="w-full bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A267]/20 transition-all"
                >
                  <Video className="w-5 h-5 text-black" />
                  <span>Buka Ruang Konsultasi Virtual Sekarang</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Konseling+Telemedisin+LimoCity+Therapy+dengan+${encodeURIComponent(createdAppointment.therapistName)}&dates=20260825T070000Z/20260825T080000Z&details=Sesi+Konseling+Mental+LimoCity+Therapy.+Link:+${encodeURIComponent(createdAppointment.meetingLink || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 border border-[#252E3E] hover:bg-[#181C26] text-[#E2E8F0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span>Sync Google Calendar</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="p-2.5 border border-[#252E3E] hover:bg-[#181C26] text-[#E2E8F0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A267]" />
                    <span>Cetak E-Tiket (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setStep(1);
                setSelectedTherapist(null);
                setCreatedAppointment(null);
              }}
              className="text-xs font-semibold text-[#C5A267] hover:text-[#D8B57B] underline"
            >
              + Jadwalkan Janji Temu Lainnya
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
