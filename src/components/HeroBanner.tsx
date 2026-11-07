import React from "react";
import { 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Video, 
  Clock, 
  CheckCircle2, 
  Award,
  ArrowRight,
  Heart,
  MessageSquareQuote,
  Wind
} from "lucide-react";
import { Therapist } from "../types";

interface HeroBannerProps {
  onStartBooking: () => void;
  onOpenAICounselor: () => void;
  onOpenScreening: () => void;
  onOpenPartnerships?: () => void;
  onOpenBreathingGuide?: () => void;
  therapists: Therapist[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartBooking,
  onOpenAICounselor,
  onOpenScreening,
  onOpenPartnerships,
  onOpenBreathingGuide,
  therapists,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0A0B0D] via-[#0E1015] to-[#0A0B0D] text-[#E2E8F0] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#1F2937]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C5A267_1px,transparent_1px)] [background-size:28px_28px]"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#141720] border border-[#252E3E] rounded-full px-3.5 py-1 text-xs font-medium text-[#C5A267]">
              <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-ping"></span>
              <span>Platform Induk Telemedisin Kesehatan Jiwa • Islamicity Health</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight text-white">
              Menemukan Ketenangan Jiwa Melalui{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E6C8] via-[#C5A267] to-[#D8B57B]">
                Konseling Holistik & Sains Berdaya
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
              Jadwalkan sesi telemedisin terenkripsi bersama Psikolog Klinis dan Psikiater berlisensi resmi. 
              Pendekatan integratif modern (I-CBT) berpadu dengan kearifan Tazkiyatun Nafs untuk menyembuhkan kecemasan, trauma, dan krisis batin.
            </p>

            {/* Key Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-book-now-cta"
                onClick={onStartBooking}
                className="w-full sm:w-auto bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-[#C5A267]/20 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-5 h-5 text-black" />
                <span>Jadwalkan Janji Temu Sekarang</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                id="hero-ai-triage-cta"
                onClick={onOpenAICounselor}
                className="w-full sm:w-auto bg-[#141720] hover:bg-[#1D2230] text-[#E2E8F0] border border-[#252E3E] hover:border-[#C5A267]/50 font-medium px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#C5A267]" />
                <span>Konsultasi Awal AI Tazkiyah</span>
              </button>

              <button
                id="hero-dass-screening-cta"
                onClick={onOpenScreening}
                className="w-full sm:w-auto text-[#C5A267] hover:text-[#D8B57B] text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cek Skrining DASS-21 →
              </button>

              {onOpenBreathingGuide && (
                <button
                  id="hero-breathing-guide-cta"
                  onClick={onOpenBreathingGuide}
                  className="w-full sm:w-auto text-[#34D399] hover:text-emerald-300 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Buka Latihan Nafas Thuma'ninah 4-4-6 untuk Redakan Cemas Akut"
                >
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nafas Thuma'ninah 4-4-6</span>
                </button>
              )}

              {onOpenPartnerships && (
                <button
                  id="hero-partnership-cta"
                  onClick={onOpenPartnerships}
                  className="w-full sm:w-auto text-[#94A3B8] hover:text-[#C5A267] text-xs font-semibold px-3 py-2 rounded-lg border border-[#252E3E] hover:border-[#C5A267]/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🤝 Kemitraan Cerdas Berdaya</span>
                </button>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-[#1F2937] text-xs text-[#94A3B8]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A267] shrink-0" />
                <span>100% Rahasia & Terenkripsi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#C5A267] shrink-0" />
                <span>SIPP & STR Resmi HIMPSI</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                <Video className="w-4 h-4 text-[#C5A267] shrink-0" />
                <span>Video HD & Catatan EMR</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Interactive Schedule & Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#111318] border border-[#1F2937] rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1F2937]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#C5A267] animate-pulse"></div>
                  <span className="text-sm font-semibold text-white">
                    Jadwal Telemedisin Hari Ini
                  </span>
                </div>
                <span className="text-xs bg-[#1A1D26] text-[#C5A267] font-medium px-2.5 py-1 rounded-full border border-[#C5A267]/30">
                  5 Slot Tersedia
                </span>
              </div>

              {/* Featured Available Therapists Preview */}
              <div className="space-y-3 mb-5">
                {therapists.slice(0, 2).map((therapist) => (
                  <div 
                    key={therapist.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#161922] border border-[#252E3E] hover:border-[#C5A267]/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={therapist.photoUrl} 
                        alt={therapist.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#C5A267]/40"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {therapist.name}
                        </h4>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {therapist.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B]">
                          <span className="text-[#C5A267] font-semibold flex items-center gap-0.5">
                            ★ {therapist.rating}
                          </span>
                          <span>•</span>
                          <span>{therapist.experienceYears}+ Thn Pengalaman</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onStartBooking}
                      className="px-3 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Pilih
                    </button>
                  </div>
                ))}
              </div>

              {/* Quote / Islamic Tazkiyah Reflection */}
              <div className="bg-[#161922] border border-[#C5A267]/30 rounded-xl p-3.5 flex items-start space-x-3">
                <MessageSquareQuote className="w-5 h-5 text-[#C5A267] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs italic text-[#E2E8F0] font-serif leading-relaxed">
                    "Dan janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya tiada berputus asa dari rahmat Allah, melainkan kaum yang kafir."
                  </p>
                  <p className="text-[10px] text-[#C5A267] font-medium mt-1">
                    — QS. Yusuf: 87 (Refleksi Harapan & Kesembuhan Batin)
                  </p>
                </div>
              </div>

              {/* Direct Booking Trigger */}
              <button
                onClick={onStartBooking}
                className="w-full mt-4 bg-gradient-to-r from-[#C5A267] to-[#D8B57B] hover:brightness-110 text-black font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C5A267]/15"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Pilih Terapis & Waktu Sesi (1-Click)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
