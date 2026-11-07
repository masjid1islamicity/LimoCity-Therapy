import React, { useState } from "react";
import {
  X,
  Bell,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Play,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Sun,
  Moon,
  CloudSun,
  Sunrise,
  Sunset,
  Zap,
  Info
} from "lucide-react";
import { SpiritualDailyGoal, GoalReminderConfig, ReminderSoundType } from "../types";
import { soundSynth } from "../utils/audioChime";

interface GoalReminderConfigModalProps {
  goal: SpiritualDailyGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (goalId: string, reminderConfig: GoalReminderConfig) => void;
  onTriggerTestPush: (goal: SpiritualDailyGoal, customConfig?: GoalReminderConfig) => void;
}

const TIME_PRESETS = [
  { label: "Subuh / Fajar", time: "05:15", icon: Sunrise, desc: "Awal fajar penyejuk jiwa" },
  { label: "Dhuha / Pagi", time: "08:30", icon: Sun, desc: "Memulai aktivitas dengan thuma'ninah" },
  { label: "Dzuhur / Siang", time: "12:30", icon: CloudSun, desc: "Jeda batin di sela rutinitas kerja" },
  { label: "Ashar / Sore", time: "15:45", icon: Sunset, desc: "Menenangkan pikiran penat sore" },
  { label: "Isya / Malam", time: "20:00", icon: Moon, desc: "Refleksi syukur menutup hari" },
  { label: "Sebelum Tidur", time: "21:45", icon: Sparkles, desc: "Pelepas stres dan dzikir tidur" },
];

const SOUND_OPTIONS: { id: ReminderSoundType; label: string; desc: string }[] = [
  { id: "gentle_chime", label: "Harmoni Solfeggio 528Hz", desc: "Nada meditatif penenang gelombang otak" },
  { id: "singing_bowl", label: "Tibetan Singing Bowl (432Hz)", desc: "Dengung rendah untuk relaksasi mendalam" },
  { id: "peaceful_bell", label: "Lonceng Damai Fajar (D5)", desc: "Dentang jernih yang lembut dan teduh" },
  { id: "subtle_drop", label: "Tetes Air Penyejuk (Water Drop)", desc: "Suara riak air segar yang sangat subtil" },
];

const MOTIVATION_SUGGESTIONS = [
  "Luangkan sejenak 3-5 menit untuk menenangkan jiwa dan bernapas thuma'ninah.",
  "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram (QS. Ar-Ra'd: 28).",
  "Jeda sejenak dari kesibukan duniawi. Kembalikan ketenangan pada Sang Pencipta.",
  "1 kebaikan kecil yang konsisten lebih dicintai Allah daripada yang banyak namun terputus.",
];

export const GoalReminderConfigModal: React.FC<GoalReminderConfigModalProps> = ({
  goal,
  isOpen,
  onClose,
  onSaveReminder,
  onTriggerTestPush,
}) => {
  const [enabled, setEnabled] = useState<boolean>(goal?.reminder?.enabled ?? true);
  const [time, setTime] = useState<string>(goal?.reminder?.time || "08:30");
  const [periodLabel, setPeriodLabel] = useState<string>(goal?.reminder?.periodLabel || "Dhuha / Pagi");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(goal?.reminder?.soundEnabled ?? true);
  const [soundType, setSoundType] = useState<ReminderSoundType>(goal?.reminder?.soundType || "gentle_chime");
  const [repeatFrequency, setRepeatFrequency] = useState<"everyday" | "weekdays" | "weekends">(
    goal?.reminder?.repeatFrequency || "everyday"
  );
  const [customMessage, setCustomMessage] = useState<string>(
    goal?.reminder?.customMessage ||
      `Waktunya melaksanakan: ${goal?.title || "Amalan Harian"}. Luangkan ${goal?.estimatedMinutes || 3} menit untuk kedamaian batin Anda.`
  );

  // Synchronize state when selected goal changes
  React.useEffect(() => {
    if (goal) {
      setEnabled(goal.reminder?.enabled ?? true);
      setTime(goal.reminder?.time || "08:30");
      setPeriodLabel(goal.reminder?.periodLabel || "Dhuha / Pagi");
      setSoundEnabled(goal.reminder?.soundEnabled ?? true);
      setSoundType(goal.reminder?.soundType || "gentle_chime");
      setRepeatFrequency(goal.reminder?.repeatFrequency || "everyday");
      setCustomMessage(
        goal.reminder?.customMessage ||
          `Waktunya melaksanakan: ${goal.title}. Luangkan ${goal.estimatedMinutes || 3} menit untuk kedamaian batin Anda.`
      );
    }
  }, [goal]);

  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  if (!isOpen || !goal) return null;

  // Handle play sound preview
  const handlePlaySound = (typeToPlay: ReminderSoundType) => {
    setIsPlayingPreview(true);
    soundSynth.playSoundByType(typeToPlay);
    setTimeout(() => setIsPlayingPreview(false), 2000);
  };

  // Request browser native notification permission
  const handleRequestNativePermission = async () => {
    if (typeof Notification !== "undefined") {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
      } catch (err) {
        // Fallback gracefully
      }
    }
  };

  // Quick preset click
  const handleSelectPreset = (preset: typeof TIME_PRESETS[0]) => {
    setTime(preset.time);
    setPeriodLabel(preset.label);
  };

  // Save handler
  const handleSave = () => {
    if (!goal) return;
    const config: GoalReminderConfig = {
      enabled,
      time,
      periodLabel,
      soundEnabled,
      soundType,
      repeatFrequency,
      customMessage: customMessage.trim(),
    };
    onSaveReminder(goal.id, config);
    onClose();
  };

  // Test push notification simulation
  const handleTestNotification = () => {
    if (!goal) return;
    const temporaryConfig: GoalReminderConfig = {
      enabled: true,
      time,
      periodLabel,
      soundEnabled,
      soundType,
      repeatFrequency,
      customMessage: customMessage.trim(),
    };
    onTriggerTestPush(goal, temporaryConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#111318] border border-[#C5A267]/50 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 text-white shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F2937]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A267]/15 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shadow-sm shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A267] block">
                Pengaturan Pengingat Terjadwal • Push Notification
              </span>
              <h3 className="text-lg font-bold text-white font-serif leading-tight">
                Jadwalkan Pengingat: {goal.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-xl transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-5">
          
          {/* Master Enable Toggle */}
          <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                enabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-[#1C202C] text-[#64748B]"
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Aktifkan Notifikasi untuk Target Ini
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {enabled ? "Notifikasi push & suara akan aktif sesuai jadwal" : "Pengingat dinonaktifkan sementara"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                enabled ? "bg-[#C5A267]" : "bg-[#252E3E]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Time Picker & Quick Presets Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Waktu Pengingat (Jam & Menit)</span>
            </label>

            {/* Custom Precise Time Input */}
            <div className="flex items-center gap-3 bg-[#0E1015] border border-[#252E3E] rounded-2xl p-3.5">
              <div className="flex-1">
                <span className="text-[11px] text-[#94A3B8] block mb-1">Tentukan Jam Pengingat Spesifik:</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-[#181C26] border border-[#252E3E] rounded-xl px-4 py-2 text-white font-mono text-base font-bold focus:outline-hidden focus:border-[#C5A267] cursor-pointer"
                />
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#94A3B8] block">Label Waktu:</span>
                <input
                  type="text"
                  value={periodLabel}
                  onChange={(e) => setPeriodLabel(e.target.value)}
                  placeholder="Contoh: Dhuha / Pagi"
                  className="bg-[#181C26] border border-[#252E3E] rounded-xl px-3 py-1.5 text-xs text-[#E2E8F0] font-semibold mt-1 focus:outline-hidden focus:border-[#C5A267] max-w-[150px]"
                />
              </div>
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = time === preset.time;
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-[#C5A267]/20 border-[#C5A267] text-white shadow-sm"
                        : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:border-[#C5A267]/50 hover:text-white"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#C5A267]" : "text-[#64748B]"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold truncate block">{preset.label}</span>
                        <span className="text-[10px] font-mono font-bold text-[#C5A267] ml-1">{preset.time}</span>
                      </div>
                      <span className="text-[9px] text-[#64748B] truncate block">{preset.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Repeat Frequency */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Frekuensi Pengulangan</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "everyday", label: "Setiap Hari" },
                { id: "weekdays", label: "Senin - Jumat" },
                { id: "weekends", label: "Sabtu & Ahad" },
              ].map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setRepeatFrequency(freq.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer text-center ${
                    repeatFrequency === freq.id
                      ? "bg-[#C5A267] text-black font-bold border-[#C5A267]"
                      : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Notification Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nada & Suara Pengingat Batin</span>
              </label>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  soundEnabled
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-[#181C26] text-[#64748B] border-[#252E3E]"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>{soundEnabled ? "Suara Aktif" : "Hening (Mute)"}</span>
              </button>
            </div>

            {soundEnabled && (
              <div className="space-y-1.5">
                {SOUND_OPTIONS.map((opt) => {
                  const isSelected = soundType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSoundType(opt.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#181C26] border-[#C5A267] text-white"
                          : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:border-[#374151]"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#C5A267] bg-[#C5A267]" : "border-[#475569]"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{opt.label}</span>
                          <span className="text-[10px] text-[#64748B] block truncate">{opt.desc}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySound(opt.id);
                        }}
                        className="px-2.5 py-1 bg-[#252E3E] hover:bg-[#C5A267] hover:text-black text-[#CBD5E1] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
                        title="Dengarkan Contoh Nada"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Dengarkan</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pesan Motivasi Notifikasi</span>
            </label>

            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tulis pesan pengingat yang menenangkan hati..."
              className="w-full bg-[#0E1015] border border-[#252E3E] rounded-xl p-3 text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
            />

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-[#64748B] self-center">Pilihan Cepat:</span>
              {MOTIVATION_SUGGESTIONS.slice(0, 2).map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomMessage(sug)}
                  className="px-2 py-1 bg-[#141720] hover:bg-[#181C26] border border-[#252E3E] text-[10px] text-[#94A3B8] hover:text-[#C5A267] rounded-lg text-left transition-colors cursor-pointer truncate max-w-full"
                >
                  "{sug.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Browser Web Push Permission helper info */}
          <div className="p-3 bg-[#0B0D12] border border-[#252E3E] rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">
                {browserPermission === "granted"
                  ? "Notifikasi Web browser aktif di perangkat ini."
                  : "Notifikasi akan tampil secara interaktif di dalam aplikasi."}
              </span>
            </div>

            {browserPermission !== "granted" && typeof Notification !== "undefined" && (
              <button
                type="button"
                onClick={handleRequestNativePermission}
                className="px-2.5 py-1 bg-[#181C26] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/40 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer"
              >
                Izinkan Web Push
              </button>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Simulasikan bagaimana notifikasi ini akan muncul"
          >
            <Zap className="w-3.5 h-3.5 text-[#C5A267]" />
            <span>Uji Push Notifikasi</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#252E3E] hover:bg-[#181C26] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-xl text-xs shadow-lg shadow-[#C5A267]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Simpan Jadwal Pengingat</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
