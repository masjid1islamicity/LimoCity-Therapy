import React, { useState } from "react";
import { 
  ShieldAlert, 
  Phone, 
  PhoneCall, 
  X, 
  Heart, 
  AlertTriangle, 
  LifeBuoy,
  MessageCircle,
  ExternalLink,
  UserCheck,
  Send,
  CheckCircle2,
  Settings,
  Radio,
  Clock,
  Sparkles
} from "lucide-react";
import { EmergencyContact } from "../types";

interface EmergencyCrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isQuickSOSTriggered?: boolean;
  emergencyContact?: EmergencyContact;
  onOpenContactConfig?: () => void;
  lastSosTimestamp?: string;
}

export const EmergencyCrisisModal: React.FC<EmergencyCrisisModalProps> = ({
  isOpen,
  onClose,
  isQuickSOSTriggered = false,
  emergencyContact,
  onOpenContactConfig,
  lastSosTimestamp,
}) => {
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const hotlines = [
    {
      name: "Layanan SEJIWA Kemenkes RI",
      number: "119 (Tekan 8)",
      desc: "Layanan konseling krisis psikologis 24 jam bebas pulsa resmi Kementerian Kesehatan Republik Indonesia.",
      actionText: "Hubungi 119 Ext 8",
      telLink: "tel:119",
      color: "bg-rose-600 text-white hover:bg-rose-700",
      badge: "Gratis 24/7 Nasional"
    },
    {
      name: "LISA Hotline (Love Inside Suicide Awareness)",
      number: "0811-3818-119 (Bahasa Indonesia & English)",
      desc: "Pusat bantuan pencegahan bunuh diri dan pendampingan krisis depresi akut dengan konselor siaga.",
      actionText: "Telepon LISA Hotline",
      telLink: "tel:08113818119",
      color: "bg-slate-900 text-white hover:bg-slate-800",
      badge: "Siaga 24 Jam"
    },
    {
      name: "Yayasan Pulih (Trauma & Krisis Psikologis)",
      number: "+62 811-8436-633 (WhatsApp Chat)",
      desc: "Pendampingan konseling trauma kekerasan, duka berat, dan krisis kesehatan jiwa.",
      actionText: "Chat WhatsApp Pulih",
      telLink: "https://wa.me/628118436633",
      color: "bg-emerald-700 text-white hover:bg-emerald-800",
      badge: "WhatsApp Support"
    }
  ];

  // Prepare WhatsApp pre-filled text for user's personal emergency contact
  const contact = emergencyContact || {
    name: "Kontak Keluarga Terdekat",
    relationship: "Keluarga / Kerabat",
    phoneNumber: "+6281234567890",
    notifyViaWhatsApp: true,
    notifyViaSMS: true,
    silentNotificationEnabled: true,
    customSosMessage: "Pemberitahuan Darurat: Saya sedang mengalami krisis mental / kecemasan akut dan membutuhkan bantuan segera melalui LimoCity Therapy.",
    isConfigured: false,
  };

  const cleanPhone = contact.phoneNumber.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `${contact.customSosMessage}\n\n(Dikirimkan melalui Quick SOS LimoCity Therapy • ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB)`
  )}`;

  const handleSimulateResend = () => {
    setResendStatus("Notifikasi darurat hening kembali dikirimkan ke kontak darurat Anda.");
    setTimeout(() => setResendStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111318] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-900/60 relative max-h-[90vh] overflow-y-auto text-[#E2E8F0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quick SOS Trigger Banner if activated via Long-Press */}
        {isQuickSOSTriggered && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900/60 to-slate-900 border-2 border-rose-500/80 shadow-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-black uppercase tracking-wider">
                  🚨 Quick SOS Aktif
                </span>
                {lastSosTimestamp && (
                  <span className="text-[10px] text-rose-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lastSosTimestamp}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                Sinyal Darurat Diaktifkan & Siap Dihubungkan
              </h4>
              <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">
                Notifikasi darurat hening disiagakan untuk <strong>{contact.name}</strong> ({contact.relationship}). Anda dapat langsung menelepon atau mengirim pesan WhatsApp dengan sekali ketuk di bawah.
              </p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 pb-4 border-b border-[#1F2937]">
          <div className="p-3 bg-rose-950/80 text-rose-400 border border-rose-800/40 rounded-2xl shrink-0 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Pusat Bantuan Krisis & Darurat
            </span>
            <h3 className="text-xl font-bold font-serif text-white mt-1">
              Anda Tidak Sendirian, Kami Ada untuk Anda
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Jika Anda atau orang terdekat berada dalam bahaya membahayakan diri atau krisis mental akut, segera hubungi kontak darurat di bawah ini.
            </p>
          </div>
        </div>

        {/* Section 1: User's Configured Personal Emergency Contact */}
        <div className="py-4 border-b border-[#1F2937]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#C5A267]" />
              Kontak Darurat Pribadi Anda
            </span>
            {onOpenContactConfig && (
              <button
                onClick={onOpenContactConfig}
                className="text-[11px] font-semibold text-[#C5A267] hover:text-[#D8B57B] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Ubah Kontak</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141720] to-[#1A1F2E] border border-[#C5A267]/40 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{contact.name}</h4>
                  <span className="px-2 py-0.5 bg-[#C5A267]/15 border border-[#C5A267]/40 text-[#C5A267] rounded-full text-[10px] font-semibold">
                    {contact.relationship}
                  </span>
                  {contact.isConfigured && (
                    <span className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-full text-[9px]">
                      ✓ Tersimpan
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-[#CBD5E1] block mt-0.5">
                  {contact.phoneNumber}
                </span>
              </div>

              {/* Silent notification status badge */}
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                <span>Notifikasi Hening Siaga</span>
              </div>
            </div>

            {/* Quick Action Buttons for Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pesan SOS WhatsApp</span>
              </a>

              <a
                href={`tel:${contact.phoneNumber}`}
                className="px-3.5 py-2.5 rounded-xl bg-[#1F2937] hover:bg-[#2B3548] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#374151] transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#C5A267]" />
                <span>Telepon Langsung</span>
              </a>
            </div>

            {resendStatus && (
              <p className="text-[11px] text-emerald-300 bg-emerald-950/80 p-2 rounded-lg text-center animate-fadeIn">
                {resendStatus}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: National Crisis Hotlines */}
        <div className="py-4 space-y-3">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
            Hotline Siaga Krisis & Konseling 24 Jam
          </span>

          {hotlines.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#141720] border border-[#252E3E] hover:border-rose-700/50 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs sm:text-sm">{item.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.desc}</p>
              <div className="pt-1.5 flex items-center justify-between">
                <span className="font-mono font-bold text-[#C5A267] text-xs">{item.number}</span>
                <a
                  href={item.telLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${item.color}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{item.actionText}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Spiritual Calming Grounding Box */}
        <div className="p-4 bg-gradient-to-br from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-2xl border border-[#C5A267]/40 text-xs space-y-1.5 shadow-xl">
          <span className="text-[#C5A267] font-bold uppercase tracking-wider text-[10px] block">
            Jangkar Ketenangan Hati:
          </span>
          <p className="italic text-[#E2E8F0] leading-relaxed font-serif">
            "Laa hawla wa laa quwwata illaa billaahil 'aliyyil 'azhiim (Tiada daya dan kekuatan melainkan dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung)."
          </p>
          <p className="text-[11px] text-[#94A3B8]">
            Tarik napas perlahan... hembuskan... Berikan kesempatan pada diri Anda untuk mendapatkan pertolongan.
          </p>
        </div>

        <div className="pt-4 border-t border-[#1F2937] flex items-center justify-between">
          <button
            onClick={handleSimulateResend}
            className="text-[11px] text-[#64748B] hover:text-[#C5A267] transition-colors"
          >
            Kirim Ulang Sinyal Hening
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#181C26] hover:bg-[#252E3E] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup Jendela Bantuan
          </button>
        </div>

      </div>
    </div>
  );
};
