import React from "react";
import {
  ShieldAlert,
  Radio,
  X,
  PhoneCall,
  MessageCircle,
  Clock,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { EmergencyContact } from "../types";

interface SOSNotificationToastProps {
  isVisible: boolean;
  onDismiss: () => void;
  onOpenCrisisModal: () => void;
  contact: EmergencyContact;
  timestamp: string;
}

export const SOSNotificationToast: React.FC<SOSNotificationToastProps> = ({
  isVisible,
  onDismiss,
  onOpenCrisisModal,
  contact,
  timestamp,
}) => {
  if (!isVisible) return null;

  const cleanPhone = contact.phoneNumber.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `${contact.customSosMessage}\n\n(Dikirimkan melalui Quick SOS LimoCity Therapy • ${timestamp})`
  )}`;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-slideIn">
      <div className="bg-[#111318]/95 backdrop-blur-md border-2 border-rose-600/80 rounded-2xl p-4 shadow-2xl shadow-rose-950/80 text-white relative">
        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#181C26] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-ping text-rose-400" />
                Sinyal SOS Aktif
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timestamp}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
              Notifikasi Hening Siaga Terkirim
            </h4>
            <p className="text-[11px] text-[#CBD5E1] mt-0.5 leading-relaxed">
              Pemberitahuan darurat telah disiagakan untuk <strong>{contact.name}</strong> ({contact.relationship}). Bantuan darurat 24 jam siap dihubungi.
            </p>

            {/* Actions inside Toast */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={onOpenCrisisModal}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Buka Pusat Bantuan</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hubungi WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
