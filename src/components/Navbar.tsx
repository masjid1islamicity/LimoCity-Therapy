import React from "react";
import { 
  HeartHandshake, 
  CalendarCheck, 
  Users, 
  Sparkles, 
  Video, 
  Activity, 
  UserCheck, 
  ShieldAlert,
  Stethoscope,
  ChevronRight,
  Handshake
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
  onTriggerSOS?: () => void;
  appointmentsCount: number;
  isTherapistMode: boolean;
  setIsTherapistMode: (val: boolean) => void;
  onOpenDzikirSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenEmergency,
  onTriggerSOS,
  appointmentsCount,
  isTherapistMode,
  setIsTherapistMode,
  onOpenDzikirSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0B0D]/95 backdrop-blur-md border-b border-[#1F2937] shadow-lg shadow-black/40">
      {/* Top Banner Notice */}
      <div className="bg-[#060709] text-[#94A3B8] text-xs px-4 py-1.5 flex items-center justify-between border-b border-[#181C26]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C5A267] animate-pulse"></span>
            <span className="font-medium tracking-wide text-xs">
              LimoCity Therapy • therapy.islamicity.tv — Jaringan Telemedisin & Konseling Mental Terpercaya
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <span className="text-[#64748B]">Enkripsi Medis End-to-End 256-Bit</span>
            <span className="text-[#2B3548]">•</span>
            {onTriggerSOS && (
              <button
                id="topbar-quick-sos-btn"
                onClick={onTriggerSOS}
                className="px-2 py-0.5 rounded-md bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-300 hover:text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Picu Quick SOS Darurat & Notifikasi Hening Kontak"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Quick SOS Darurat</span>
              </button>
            )}
            <span className="text-[#2B3548]">•</span>
            <button 
              onClick={onOpenEmergency}
              className="text-[#C5A267] hover:text-[#D8B57B] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Hotline Krisis 24/7 (119 Ext 8)
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1C202C] to-[#0F1118] border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shadow-md group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-[#C5A267]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  LimoCity <span className="text-[#C5A267]">Therapy</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded-full">
                  Telemedicine
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">
                therapy.islamicity.tv • Islamic CBT & Clinical Wellness
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-home-btn"
              onClick={() => setActiveTab("home")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "home"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              Beranda
            </button>

            <button
              id="nav-booking-wizard-btn"
              onClick={() => setActiveTab("booking")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "booking"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-[#C5A267]" />
              Jadwal Janji Temu
            </button>

            <button
              id="nav-therapists-btn"
              onClick={() => setActiveTab("therapists")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "therapists"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <Users className="w-4 h-4 text-[#C5A267]" />
              Direktori Psikolog
            </button>

            <button
              id="nav-ai-counselor-btn"
              onClick={() => setActiveTab("ai-counselor")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "ai-counselor"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A267] animate-pulse" />
              Konselor AI Tazkiyah
            </button>

            <button
              id="nav-virtual-room-btn"
              onClick={() => setActiveTab("telemedicine-room")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "telemedicine-room"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <Video className="w-4 h-4 text-[#C5A267]" />
              Ruang Konsultasi
            </button>

            <button
              id="nav-screening-btn"
              onClick={() => setActiveTab("screening")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "screening"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <Activity className="w-4 h-4 text-[#C5A267]" />
              Tes DASS-21
            </button>

            <button
              id="nav-partnerships-btn"
              onClick={() => setActiveTab("partnerships")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "partnerships"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <Handshake className="w-4 h-4 text-[#C5A267]" />
              Kemitraan Cerdas
            </button>

            <button
              id="nav-portal-btn"
              onClick={() => setActiveTab("portal")}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all relative ${
                activeTab === "portal"
                  ? "bg-[#181C26] text-[#C5A267] font-semibold border border-[#C5A267]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141720]"
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#C5A267]" />
              Portal Pasien
              {appointmentsCount > 0 && (
                <span className="w-4 h-4 bg-[#C5A267] text-black rounded-full text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {appointmentsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Daily Dzikir & Reflection Sidebar Trigger */}
            {onOpenDzikirSidebar && (
              <button
                id="header-dzikir-sidebar-btn"
                onClick={onOpenDzikirSidebar}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C5A267]/40 bg-[#C5A267]/10 hover:bg-[#C5A267]/25 text-[#C5A267] hover:text-[#F3E8D2] text-xs font-semibold transition-all shadow-xs relative"
                title="Buka Dzikir & Refleksi Harian (Tazkiyatun Nafs)"
              >
                <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-ping absolute -top-0.5 -right-0.5" />
                <span className="w-2 h-2 rounded-full bg-[#C5A267] absolute -top-0.5 -right-0.5" />
                <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                <span className="hidden sm:inline">Dzikir & Tazkiyah</span>
                <span className="sm:hidden">Dzikir</span>
              </button>
            )}

            {/* Therapist Mode Toggle */}
            <button
              id="therapist-mode-toggle"
              onClick={() => {
                const next = !isTherapistMode;
                setIsTherapistMode(next);
                if (next) setActiveTab("therapist-portal");
                else setActiveTab("home");
              }}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isTherapistMode 
                  ? "bg-[#181C26] text-[#C5A267] border-[#C5A267]/60 shadow-xs" 
                  : "bg-[#111318] text-[#94A3B8] border-[#252E3E] hover:border-[#374151] hover:text-white"
              }`}
              title="Ganti tampilan ke Portal Psikolog / Dokter"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>{isTherapistMode ? "Mode Terapis Aktif" : "Mode Terapis"}</span>
            </button>

            {/* Quick Book Appointment CTA */}
            <button
              id="header-book-appointment-btn"
              onClick={onOpenBooking}
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-[#C5A267]/20 flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Jadwalkan Konsultasi</span>
              <span className="sm:hidden">Jadwalkan</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2.5 border-t border-[#1F2937] no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "home" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "booking" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Jadwal Janji
          </button>
          <button
            onClick={() => setActiveTab("therapists")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "therapists" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Psikolog
          </button>
          <button
            onClick={() => setActiveTab("ai-counselor")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "ai-counselor" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Konselor AI
          </button>
          <button
            onClick={() => setActiveTab("telemedicine-room")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "telemedicine-room" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Ruang Video
          </button>
          <button
            onClick={() => setActiveTab("screening")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "screening" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Skrining DASS
          </button>
          {onOpenDzikirSidebar && (
            <button
              onClick={onOpenDzikirSidebar}
              className="px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 text-[#C5A267] bg-[#C5A267]/15 border border-[#C5A267]/30 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              🌿 Dzikir Harian
            </button>
          )}
          {onTriggerSOS && (
            <button
              onClick={onTriggerSOS}
              className="px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 text-rose-300 bg-rose-950/80 border border-rose-600/60 font-bold"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              🚨 Quick SOS
            </button>
          )}
          <button
            onClick={() => setActiveTab("partnerships")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "partnerships" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            Kemitraan Cerdas
          </button>
          <button
            onClick={() => setActiveTab("portal")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              activeTab === "portal" ? "bg-[#C5A267] text-black font-bold" : "text-[#94A3B8] bg-[#141720]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Portal ({appointmentsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
