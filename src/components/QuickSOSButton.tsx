import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Phone,
  PhoneCall,
  MessageSquare,
  Settings,
  X,
  CheckCircle2,
  Bell,
  HeartPulse,
  UserCheck,
  Send,
  Sparkles,
  Info,
  Radio
} from "lucide-react";
import { EmergencyContact, SOSLogEntry } from "../types";
import { soundSynth } from "../utils/audioChime";

interface QuickSOSButtonProps {
  onTriggerSOS: (contact: EmergencyContact) => void;
  emergencyContact: EmergencyContact;
  onUpdateEmergencyContact: (contact: EmergencyContact) => void;
}

export const QuickSOSButton: React.FC<QuickSOSButtonProps> = ({
  onTriggerSOS,
  emergencyContact,
  onUpdateEmergencyContact,
}) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0); // 0 to 100
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showQuickTapNotice, setShowQuickTapNotice] = useState<boolean>(false);

  // Form states for configuration modal
  const [contactName, setContactName] = useState<string>(emergencyContact.name);
  const [contactRel, setContactRel] = useState<string>(emergencyContact.relationship);
  const [contactPhone, setContactPhone] = useState<string>(emergencyContact.phoneNumber);
  const [contactEmail, setContactEmail] = useState<string>(emergencyContact.email || "");
  const [notifyWA, setNotifyWA] = useState<boolean>(emergencyContact.notifyViaWhatsApp);
  const [notifySMS, setNotifySMS] = useState<boolean>(emergencyContact.notifyViaSMS);
  const [silentNotify, setSilentNotify] = useState<boolean>(emergencyContact.silentNotificationEnabled);
  const [customMsg, setCustomMsg] = useState<string>(emergencyContact.customSosMessage);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION_MS = 1500; // 1.5 seconds hold required

  // Sync form state when prop changes
  useEffect(() => {
    setContactName(emergencyContact.name);
    setContactRel(emergencyContact.relationship);
    setContactPhone(emergencyContact.phoneNumber);
    setContactEmail(emergencyContact.email || "");
    setNotifyWA(emergencyContact.notifyViaWhatsApp);
    setNotifySMS(emergencyContact.notifyViaSMS);
    setSilentNotify(emergencyContact.silentNotificationEnabled);
    setCustomMsg(emergencyContact.customSosMessage);
  }, [emergencyContact]);

  // Keyboard shortcut listener: Alt + S or triple Escape for rapid accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Alt+S or Alt+Shift+S
      if (e.altKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        triggerSOSActivation("keyboard_shortcut");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emergencyContact]);

  const triggerSOSActivation = (triggerType: "long_press_button" | "keyboard_shortcut" = "long_press_button") => {
    // Vibrate device if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch (err) {
        // Safe fallback
      }
    }

    // Play subtle alert tone
    soundSynth.playSoundByType("peaceful_bell");

    // Call SOS handler
    onTriggerSOS(emergencyContact);

    // Reset progress
    setHoldProgress(0);
    setIsHolding(false);
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default context menu on long touch
    setShowQuickTapNotice(false);
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();

    // Haptic feedback initial tap
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch {}
    }

    // Progress update loop
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / HOLD_DURATION_MS) * 100));
      setHoldProgress(progress);

      if (progress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        triggerSOSActivation("long_press_button");
      }
    }, 25);
  };

  const cancelHold = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // If released before 100% but user was pressing, show friendly instruction notice
    if (holdProgress > 5 && holdProgress < 100) {
      setShowQuickTapNotice(true);
      setTimeout(() => setShowQuickTapNotice(false), 3500);
    }

    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EmergencyContact = {
      name: contactName.trim() || "Kontak Darurat Utama",
      relationship: contactRel.trim() || "Keluarga / Kerabat",
      phoneNumber: contactPhone.trim() || "+6281234567890",
      email: contactEmail.trim() || undefined,
      notifyViaWhatsApp: notifyWA,
      notifyViaSMS: notifySMS,
      silentNotificationEnabled: silentNotify,
      customSosMessage:
        customMsg.trim() ||
        "Pemberitahuan Darurat: Saya sedang mengalami krisis mental / kecemasan akut dan membutuhkan bantuan segera melalui LimoCity Therapy.",
      isConfigured: true,
    };

    onUpdateEmergencyContact(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setIsConfigModalOpen(false);
    }, 1200);
  };

  // SVG Circular ring calculations (radius 26, perimeter ~163.36)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <>
      {/* Floating Quick SOS Trigger Button (Fixed at Bottom-Right or Accessible Float) */}
      <div 
        id="quick-sos-floating-container"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none"
      >
        {/* Quick tap helper tooltip */}
        {showQuickTapNotice && (
          <div className="mb-2 bg-rose-950/95 border-2 border-rose-500/80 text-white text-xs px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-2 max-w-xs text-right">
            <Info className="w-4 h-4 text-rose-300 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">
              <strong>Tekan & Tahan 1.5 detik</strong> untuk memicu Sinyal SOS Darurat & Notifikasi Kontak.
            </span>
          </div>
        )}

        {/* Hover / Active Instructions pill */}
        <div className="flex items-center gap-2">
          {/* Emergency Contact Quick Config Trigger */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2.5 rounded-full bg-[#141720]/90 hover:bg-[#1C2230] text-[#94A3B8] hover:text-[#C5A267] border border-[#252E3E] hover:border-[#C5A267]/50 shadow-lg backdrop-blur-md transition-all cursor-pointer"
            title="Pengaturan Kontak Darurat & Pesan Notifikasi Hening"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Main Long-Press SOS Trigger Action */}
          <div className="relative group">
            {/* Pulsing Backlight when holding */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
                isHolding
                  ? "bg-rose-600/40 blur-xl scale-150 animate-pulse"
                  : "bg-rose-700/15 blur-md group-hover:bg-rose-600/25"
              }`}
            />

            {/* Circular Progress Ring Overlay */}
            <svg
              className="absolute inset-0 -rotate-90 pointer-events-none z-10"
              width="60"
              height="60"
              viewBox="0 0 60 60"
            >
              {/* Background ring */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                stroke="#374151"
                strokeWidth="4"
                fill="transparent"
                opacity="0.3"
              />
              {/* Active animated progress ring */}
              {isHolding && (
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke="#F43F5E"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-75 ease-linear"
                />
              )}
            </svg>

            {/* Interactive SOS Button */}
            <button
              id="quick-sos-long-press-btn"
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onTouchCancel={cancelHold}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative z-20 w-15 h-15 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-2xl transition-all duration-150 cursor-pointer ${
                isHolding
                  ? "bg-gradient-to-br from-rose-600 to-rose-900 scale-95 ring-4 ring-rose-500/50 shadow-rose-600/50"
                  : "bg-gradient-to-br from-rose-700 via-rose-800 to-slate-950 border-2 border-rose-500/60 hover:border-rose-400 hover:scale-105 shadow-black/80"
              }`}
              style={{ width: "60px", height: "60px" }}
              aria-label="Quick SOS Darurat. Tekan dan tahan 1.5 detik."
            >
              <ShieldAlert className={`w-5 h-5 transition-transform ${isHolding ? "scale-110 text-white animate-pulse" : "text-rose-200"}`} />
              <span className="text-[9px] font-black tracking-tighter uppercase font-mono mt-0.5 leading-none">
                {isHolding ? `${Math.round(holdProgress)}%` : "SOS"}
              </span>
            </button>
          </div>
        </div>

        {/* Caption Label underneath button */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#94A3B8] bg-[#0E1015]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#1F2937]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold text-rose-300">Quick SOS:</span>
          <span>Tahan 1.5 detik</span>
        </div>
      </div>

      {/* Emergency Contact Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn text-[#E2E8F0]">
          <div className="bg-[#111318] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-900/60 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-3.5 pb-4 border-b border-[#1F2937]">
              <div className="p-3 bg-rose-950/80 text-rose-400 border border-rose-800/40 rounded-2xl shrink-0 shadow-lg">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Pengaturan Keamanan Personal
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-1">
                  Kontak Darurat & Notifikasi Hening (Quick SOS)
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Ketika tombol Quick SOS ditekan dan ditahan 1.5 detik, sistem akan membuka pusat bantuan krisis dan mengirimkan notifikasi siaga hening ke kontak pilihan Anda.
                </p>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveContact} className="py-4 space-y-4">
              {/* Contact Name & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                    Nama Kontak Darurat <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contoh: Siti Rahmawati / Dr. Hasan"
                    className="w-full bg-[#181C26] border border-[#252E3E] focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                    Hubungan / Relasi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactRel}
                    onChange={(e) => setContactRel(e.target.value)}
                    placeholder="Contoh: Pasangan / Ibu / Terapis / Sahabat"
                    className="w-full bg-[#181C26] border border-[#252E3E] focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Nomor WhatsApp / Telepon <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full bg-[#181C26] border border-[#252E3E] focus:border-rose-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#64748B] outline-none transition-colors font-mono"
                  />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  Gunakan format internasional (contoh: +6281234567890) untuk integrasi direct WhatsApp call/chat.
                </p>
              </div>

              {/* Optional Email */}
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="kontak.darurat@email.com"
                  className="w-full bg-[#181C26] border border-[#252E3E] focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] outline-none transition-colors"
                />
              </div>

              {/* Toggles */}
              <div className="p-3.5 rounded-2xl bg-[#141720] border border-[#252E3E] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Notifikasi Hening Aktif (Silent Dispatch)
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Kirim notifikasi tanpa memicu suara alarm keras di perangkat Anda.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={silentNotify}
                    onChange={(e) => setSilentNotify(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#1F2937] pt-2.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Koneksi Cepat WhatsApp Otomatis
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Sediakan tautan cepat pesan WhatsApp ke kontak darurat.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWA}
                    onChange={(e) => setNotifyWA(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Custom SOS Message */}
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Isi Pesan Siaga SOS Otomatis
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Tulis pesan darurat yang ingin dikirimkan saat SOS dipicu..."
                  className="w-full bg-[#181C26] border border-[#252E3E] focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-[#64748B] outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Test SOS Button and Save */}
              <div className="pt-3 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerSOSActivation("long_press_button");
                    setIsConfigModalOpen(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Uji Coba Pemicu SOS</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold text-xs shadow-lg shadow-[#C5A267]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Simpan Kontak</span>
                  </button>
                </div>
              </div>

              {saveSuccessNotice && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Data kontak darurat berhasil diperbarui & disimpan di penyimpanan lokal!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
