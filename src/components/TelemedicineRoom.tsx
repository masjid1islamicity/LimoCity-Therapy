import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Share2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Heart,
  Send,
  Lock,
  Smile,
  AlertCircle,
  HelpCircle,
  Activity,
  Zap,
  Sliders
} from "lucide-react";
import { Appointment } from "../types";
import { BiometricStressHUD } from "./BiometricStressHUD";

interface TelemedicineRoomProps {
  appointment: Appointment | null;
  onLeaveRoom: () => void;
}

export const TelemedicineRoom: React.FC<TelemedicineRoomProps> = ({
  appointment,
  onLeaveRoom,
}) => {
  // Video & audio states
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isMutedSpeaker, setIsMutedSpeaker] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeSidePanel, setActiveSidePanel] = useState<"chat" | "emr" | "dzikir">("chat");
  const [isBiometricHUDOpen, setIsBiometricHUDOpen] = useState<boolean>(true);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // In-session Chat messages
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isTherapist: boolean }>>([
    {
      sender: appointment?.therapistName || "Dr. Hj. Aisyah Wardani, M.Psi.",
      text: "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di ruang telemedisin LimoCity Therapy. Bagaimana kabar hati Anda hari ini?",
      time: "14:02",
      isTherapist: true,
    }
  ]);
  const [inputChat, setInputChat] = useState<string>("");

  // EMR Action plan live check items
  const [actionPlanList, setActionPlanList] = useState<string[]>([
    "Latihan pernapasan diafragma 4-7-8 saat mendeteksi pemicu cemas",
    "Jurnal kognitif I-CBT: Tuliskan bukti nyata vs dugaan overthinking",
    "Dzikir pagi & petang 15 menit dengan kesadaran penuh (Mindful Dzikir)",
    "Batasi konsumsi berita negatif & media sosial sebelum jam 21:00"
  ]);
  const [newActionItem, setNewActionItem] = useState<string>("");

  // AI Sentiment State
  const [aiEmotionalScore, setAiEmotionalScore] = useState<number>(78);
  const [sentimentLabel, setSentimentLabel] = useState<string>("Tingkat Ketenangan: Meningkat (Stabil & Menerima)");

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg = {
      sender: appointment?.patientName || "Anda (Pasien)",
      text: inputChat,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isTherapist: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputChat("");

    // Simulated empathetic therapist response after 2 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: appointment?.therapistName || "Dr. Hj. Aisyah Wardani, M.Psi.",
          text: "Saya sangat memahami apa yang Anda rasakan. Tarik napas perlahan, mari kita uraikan bersama satu per satu.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          isTherapist: true,
        },
      ]);
      setAiEmotionalScore((prev) => Math.min(100, prev + 5));
      setSentimentLabel("Sentimen: Lega & Terbuka (Validasi Emosional Berhasil)");
    }, 2000);
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItem.trim()) return;
    setActionPlanList((prev) => [...prev, newActionItem.trim()]);
    setNewActionItem("");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0A0B0D] text-[#E2E8F0] flex flex-col">
      
      {/* Top Telemedicine Navigation Bar */}
      <div className="bg-[#111318] border-b border-[#1F2937] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#181C26] border border-[#C5A267]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#C5A267]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A267] animate-pulse"></span>
            <span>SESI AKTIF: {formatTime(secondsElapsed)}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#94A3B8]">
            <Lock className="w-3.5 h-3.5 text-[#C5A267]" />
            <span>Enkripsi Medis End-to-End (WebRTC TLS 1.3)</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-[#94A3B8] font-medium hidden md:inline">
            Ruang: <span className="font-mono text-[#C5A267] font-bold">{appointment?.bookingCode || "LIMO-2026-LIVE"}</span>
          </span>
          <button
            onClick={onLeaveRoom}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Akhiri Sesi</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stage + Side Tool Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Video Canvas & Controls */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          
          {/* Main Therapist Video Feed */}
          <div className="relative flex-1 min-h-[380px] bg-[#111318] rounded-3xl border border-[#1F2937] overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Main Video Simulated Stream */}
            <div className="absolute inset-0">
              <img
                src={appointment?.therapistId === "th-2" 
                  ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200" 
                  : appointment?.therapistId === "th-3"
                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200"
                  : "https://images.unsplash.com/photo-1594824813596-f94e1e355c2f?auto=format&fit=crop&q=80&w=1200"
                }
                alt="Therapist Stream"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/90 via-transparent to-black/30"></div>
            </div>

            {/* Therapist Label Badge */}
            <div className="absolute top-4 left-4 bg-[#0E1015]/90 backdrop-blur-md border border-[#252E3E] px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A267]"></span>
              <span className="text-xs font-bold text-white">
                {appointment?.therapistName || "Dr. Hj. Aisyah Wardani, M.Psi., Psikolog"}
              </span>
              <span className="text-[10px] bg-[#C5A267]/20 text-[#C5A267] border border-[#C5A267]/30 px-1.5 py-0.5 rounded">
                Terapis
              </span>
            </div>

            {/* AI Emotional State Indicator Meter */}
            <div className="absolute top-4 right-4 bg-[#141720]/90 backdrop-blur-md border border-[#C5A267]/40 p-2.5 rounded-2xl max-w-xs shadow-lg hidden sm:block">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#E2E8F0] mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A267]" />
                  AI Empathy Sense
                </span>
                <span className="font-bold text-[#C5A267]">{aiEmotionalScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#0E1015] rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-gradient-to-r from-[#C5A267] to-[#E5C388] transition-all duration-500" 
                  style={{ width: `${aiEmotionalScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-[#94A3B8] leading-tight">
                {sentimentLabel}
              </p>
            </div>

            {/* Self Video PIP (Picture In Picture) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-52 h-28 sm:h-38 rounded-2xl bg-[#141720] border-2 border-[#C5A267]/60 overflow-hidden shadow-2xl group">
              {isVideoOn ? (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                    alt="Self camera"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Optical rPPG Face Scanning Reticle Overlay */}
                  {isBiometricHUDOpen && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-2">
                      <div className="w-20 h-24 sm:w-28 sm:h-30 border border-[#C5A267]/70 rounded-xl relative animate-pulse">
                        <span className="w-2 h-2 border-t-2 border-l-2 border-[#C5A267] absolute -top-1 -left-1" />
                        <span className="w-2 h-2 border-t-2 border-r-2 border-[#C5A267] absolute -top-1 -right-1" />
                        <span className="w-2 h-2 border-b-2 border-l-2 border-[#C5A267] absolute -bottom-1 -left-1" />
                        <span className="w-2 h-2 border-b-2 border-r-2 border-[#C5A267] absolute -bottom-1 -right-1" />
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-[#C5A267] font-mono tracking-tighter whitespace-nowrap">
                          rPPG Sensor Active
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{appointment?.patientName || "Anda (Pasien)"}</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] bg-[#0E1015]">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Kamera Mati</span>
                </div>
              )}
            </div>

            {/* Speaking audio wave indicator */}
            {isMicOn && (
              <div className="absolute bottom-4 left-4 bg-[#0E1015]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#252E3E] flex items-center space-x-1.5">
                <div className="w-1 h-3 bg-[#C5A267] animate-pulse"></div>
                <div className="w-1 h-5 bg-[#C5A267] animate-pulse delay-75"></div>
                <div className="w-1 h-2 bg-[#C5A267] animate-pulse delay-150"></div>
                <span className="text-[11px] text-[#94A3B8] font-medium ml-1">Audio Terhubung</span>
              </div>
            )}
          </div>

          {/* Real-time Biometric Stress & Heart Rate HUD */}
          {isBiometricHUDOpen && (
            <BiometricStressHUD
              isVideoActive={isVideoOn}
              onTriggerCalmGuide={() => {
                setActiveSidePanel("dzikir");
              }}
            />
          )}

          {/* Bottom Floating Control Bar */}
          <div className="bg-[#111318]/90 backdrop-blur-md border border-[#1F2937] rounded-2xl p-3 flex items-center justify-center space-x-3 sm:space-x-4">
            
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 rounded-2xl font-semibold transition-all cursor-pointer ${
                isMicOn 
                  ? "bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E]" 
                  : "bg-rose-600 text-white"
              }`}
              title={isMicOn ? "Matikan Mikrofon" : "Nyalakan Mikrofon"}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 rounded-2xl font-semibold transition-all cursor-pointer ${
                isVideoOn 
                  ? "bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E]" 
                  : "bg-rose-600 text-white"
              }`}
              title={isVideoOn ? "Matikan Kamera" : "Nyalakan Kamera"}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Biometric Sensor HUD Toggle */}
            <button
              onClick={() => setIsBiometricHUDOpen(!isBiometricHUDOpen)}
              className={`p-3.5 rounded-2xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isBiometricHUDOpen 
                  ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20" 
                  : "bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] border border-[#252E3E]"
              }`}
              title={isBiometricHUDOpen ? "Sembunyikan Sensor Detak Jantung" : "Tampilkan Sensor Detak Jantung"}
            >
              <Heart className={`w-5 h-5 ${isBiometricHUDOpen ? "fill-black" : ""}`} />
            </button>

            {/* Speaker Sound Toggle */}
            <button
              onClick={() => setIsMutedSpeaker(!isMutedSpeaker)}
              className={`p-3.5 rounded-2xl font-semibold transition-all cursor-pointer ${
                !isMutedSpeaker 
                  ? "bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E]" 
                  : "bg-amber-600 text-white"
              }`}
              title={isMutedSpeaker ? "Nyalakan Speaker" : "Bisukan Speaker"}
            >
              {!isMutedSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* End Call CTA */}
            <button
              onClick={onLeaveRoom}
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Keluar Sesi</span>
            </button>

          </div>
        </div>

        {/* Right Side: Side Panels (Chat, EMR Action Plan, Tazkiyah Dzikir Audio) */}
        <div className="lg:col-span-4 flex flex-col bg-[#111318] border border-[#1F2937] rounded-3xl overflow-hidden min-h-[500px]">
          
          {/* Panel Selector Tabs */}
          <div className="grid grid-cols-3 bg-[#0E1015] p-1 border-b border-[#1F2937] text-xs font-semibold">
            <button
              onClick={() => setActiveSidePanel("chat")}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === "chat" ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Sesi</span>
            </button>

            <button
              onClick={() => setActiveSidePanel("emr")}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === "emr" ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Catatan EMR</span>
            </button>

            <button
              onClick={() => setActiveSidePanel("dzikir")}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeSidePanel === "dzikir" ? "bg-[#C5A267] text-black font-bold shadow-md shadow-[#C5A267]/20" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tazkiyah</span>
            </button>
          </div>

          {/* TAB 1: Real-time In-Call Chat */}
          {activeSidePanel === "chat" && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-[#0A0B0D]">
              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                <div className="text-center">
                  <span className="text-[10px] bg-[#141720] border border-[#252E3E] text-[#94A3B8] px-3 py-1 rounded-full">
                    Sesi Konsultasi Terenkripsi Dimulai
                  </span>
                </div>

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.isTherapist ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-[#64748B]">
                      <span className="font-semibold text-[#94A3B8]">{m.sender}</span>
                      <span>•</span>
                      <span>{m.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        m.isTherapist
                          ? "bg-[#141720] text-[#E2E8F0] rounded-tl-xs border border-[#252E3E]"
                          : "bg-[#C5A267] text-black font-medium rounded-tr-xs shadow-md shadow-[#C5A267]/20"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-[#1F2937] flex gap-2">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Ketik pesan privat untuk terapis..."
                  className="flex-1 bg-[#0E1015] border border-[#252E3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                />
                <button
                  type="submit"
                  className="bg-[#C5A267] hover:bg-[#D8B57B] text-black p-2.5 rounded-xl shrink-0 transition-colors shadow-md shadow-[#C5A267]/20"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Live EMR Action Plan */}
          {activeSidePanel === "emr" && (
            <div className="flex-1 p-4 flex flex-col justify-between text-xs bg-[#0A0B0D]">
              <div className="space-y-3">
                <div className="p-3 bg-[#141720] border border-[#C5A267]/30 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-[#C5A267] block mb-1">
                    Diagnosa Kerja & Fokus Sesi
                  </span>
                  <p className="text-white font-medium">
                    {appointment?.consultationFocus || "Regulasi Kecemasan & Penyelarasan Kognitif Islami (I-CBT)"}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-[#94A3B8] uppercase tracking-wider text-[11px] mb-2">
                    Daftar Rencana Tindak Lanjut (Action Plan Mandiri):
                  </h5>
                  <div className="space-y-2">
                    {actionPlanList.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-[#141720] rounded-xl border border-[#252E3E] flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A267] shrink-0 mt-0.5" />
                        <span className="text-[#E2E8F0] leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddActionItem} className="mt-4 pt-3 border-t border-[#1F2937] flex gap-2">
                <input
                  type="text"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  placeholder="+ Tambah latihan/tugas mandiri..."
                  className="flex-1 bg-[#0E1015] border border-[#252E3E] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                />
                <button
                  type="submit"
                  className="bg-[#C5A267] hover:bg-[#D8B57B] text-black px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-md shadow-[#C5A267]/20"
                >
                  Tambah
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Tazkiyatun Nafs & Calming Ambiance */}
          {activeSidePanel === "dzikir" && (
            <div className="flex-1 p-4 space-y-4 text-xs overflow-y-auto bg-[#0A0B0D]">
              <div className="p-3.5 bg-gradient-to-br from-[#141720] via-[#1A1E2B] to-[#12141C] border border-[#C5A267]/40 rounded-2xl">
                <span className="text-[#C5A267] font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Panduan Pernapasan & Doa Penenang Hati
                </span>
                <p className="text-sm font-serif italic text-white leading-relaxed mb-2">
                  "Allāhumma innī a’ūzu bika minal-hammi wal-ḥazan..."
                </p>
                <p className="text-[11px] text-[#94A3B8] leading-normal">
                  "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari rasa gundah gulana dan rasa sedih..."
                </p>
              </div>

              <div className="bg-[#141720] p-3.5 rounded-2xl border border-[#252E3E] space-y-2">
                <h5 className="font-bold text-white text-xs">
                  Latihan Napas Menenangkan (4-7-8 Istighfar)
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[#94A3B8] text-[11px]">
                  <li>Tarik napas lewat hidung selama 4 detik sambil berniat berserah diri.</li>
                  <li>Tahan napas selama 7 detik dalam keadaan tenang.</li>
                  <li>Hembuskan perlahan lewat mulut selama 8 detik sambil berbisik: *Astaghfirullāh*.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
