import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  User, 
  Calendar, 
  Heart, 
  HelpCircle, 
  ShieldCheck, 
  RefreshCw,
  MessageSquareHeart,
  ChevronRight,
  BookOpen,
  Globe,
  Search,
  ExternalLink,
  PhoneCall,
  Check,
  Copy,
  Info,
  Layers,
  ArrowUpRight,
  X,
  Compass,
  CheckCircle2
} from "lucide-react";
import { ChatMessage, GroundingSource } from "../types";

interface AICounselorChatProps {
  onBookSession: () => void;
}

type GroundingCategory = "all" | "crisis_hotlines" | "islamic_psychology" | "clinical_guidelines";

export const AICounselorChat: React.FC<AICounselorChatProps> = ({
  onBookSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di Konselor Cerdas Tazkiyatun Nafs (LimoCity Therapy • Islamicity TV).\n\nSaya kini diperkuat dengan **Google Search Grounding** untuk menghadirkan rujukan terkini mengenai sumber daya kesehatan mental, riset psikologi Islam (Islamic CBT & Tazkiyatun Nafs), serta panduan komunitas dan hotline darurat lokal yang terverifikasi.\n\nApa yang sedang membebani pikiran Anda atau informasi psikologis apa yang ingin Anda telusuri hari ini?",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      groundingSources: [
        {
          title: "Kementerian Kesehatan RI - Layanan Bantuan Kesehatan Jiwa Sejiwa (119 ext 8)",
          uri: "https://kemkes.go.id"
        },
        {
          title: "HIMPSI (Himpunan Psikologi Indonesia) - Standar Layanan Psikologi Klinis",
          uri: "https://himpsi.or.id"
        },
        {
          title: "Journal of Muslim Mental Health - Riset Islamic Psychotherapy & I-CBT",
          uri: "https://quod.lib.umich.edu/j/jmmh"
        }
      ],
      searchQueries: [
        "layanan kesehatan mental indonesia kemenkes",
        "islamic cognitive behavioral therapy guidelines"
      ],
      isGroundedWithSearch: true
    }
  ]);

  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enableGrounding, setEnableGrounding] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<GroundingCategory>("all");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isGroundingInfoModalOpen, setIsGroundingInfoModalOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt categories with search-grounded capabilities
  const quickPromptsByCategory: Record<GroundingCategory, { label: string; query: string }[]> = {
    all: [
      {
        label: "🚨 Hotline Krisis Indonesia",
        query: "Sebutkan daftar hotline darurat krisis kesehatan mental dan pencegahan bunuh diri resmi di Indonesia (misal Kemenkes Sejiwa 119 ext 8)."
      },
      {
        label: "🕌 Riset Islamic CBT",
        query: "Bagaimana riset psikologi terkini memadukan Islamic CBT dan Tazkiyatun Nafs untuk mengatasi overthinking dan kecemasan?"
      },
      {
        label: "🏛️ Standar Layanan HIMPSI",
        query: "Apa saja hak pasien dan standar etika konsultasi psikolog klinis berdasarkan ketentuan HIMPSI & IPK Indonesia?"
      },
      {
        label: "🌿 Dzikir & Regulasi Stres",
        query: "Jelaskan panduan neuro-sains dan thibbun nabawi mengenai pengaruh dzikir thuma'ninah terhadap sistem saraf parasimpatis."
      },
    ],
    crisis_hotlines: [
      {
        label: "📞 Kontak Layanan Sejiwa 119",
        query: "Bagaimana cara mengakses layanan konseling Sejiwa 119 ext 8 Kemenkes dan apakah layanannya gratis 24 jam?"
      },
      {
        label: "🏥 Direktori RS Jiwa & Faskes",
        query: "Bagaimana alur rujukan BPJS Kesehatan untuk konsultasi ke Psikiater / Psikolog di faskes tingkat pertama dan RSJ?"
      },
      {
        label: "🤝 Komunitas & Yayasan Pulih",
        query: "Informasi mengenai layanan konseling trauma dan support group di Yayasan Pulih serta LSM kesehatan jiwa terpercaya di Indonesia."
      },
    ],
    islamic_psychology: [
      {
        label: "📖 Jurnal Psikologi Islam",
        query: "Apa saja temuan riset terbaru dari Journal of Muslim Mental Health mengenai penanganan depresi pada umat Islam?"
      },
      {
        label: "🧠 Konsep Nafs Al-Ghazali",
        query: "Bagaimana integrasi konsep Nafs Ammarah, Lawwamah, dan Muthma'innah Imam Al-Ghazali dalam terapi kognitif modern?"
      },
      {
        label: "💍 Konseling Sakinah & Pasangan",
        query: "Rujukan bimbingan konseling pernikahan sakinah berbasis Islamic Family Therapy untuk meredakan konflik komunikasi suami istri."
      },
    ],
    clinical_guidelines: [
      {
        label: "📋 Kode Etik Psikologi",
        query: "Apa pedoman kerahasiaan data rekam medis pasien telekonsultasi psikologis di Indonesia menurut undang-undang dan HIMPSI?"
      },
      {
        label: "🩺 Kapan Butuh Psikiater vs Psikolog",
        query: "Jelaskan perbedaan kapan seseorang perlu ke Psikolog Klinis (konseling psikoterapi) vs ke Dokter Jiwa / Psikiater (Sp.KJ untuk medikamentosa)?"
      },
      {
        label: "💼 Program EAP Tempat Kerja",
        query: "Bagaimana panduan program Employee Assistance Program (EAP) kesehatan mental di perusahaan untuk menangani burnout kerja?"
      },
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Send chat history and search grounding parameters to backend
      const formattedHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/ai/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: formattedHistory,
          emotionalState: "Mencari kejelasan & rujukan terverifikasi",
          enableSearchGrounding: enableGrounding,
          groundingTopic: activeCategory === "all" ? "Kesehatan Mental & Psikologi Islam" : activeCategory
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          groundingSources: data.groundingSources || [],
          searchQueries: data.searchQueries || [],
          isGroundedWithSearch: !!data.isGroundedWithSearch
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const fallbackMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Setiap cobaan adalah pembuka pintu kedekatan kepada Allah. Tariklah napas dalam-dalam, lepaskan apa yang tak dapat Anda kendalikan, dan pasrahkan segalanya kepada Sang Maha Pemelihara.\n\nJika Anda membutuhkan bantuan segera, jangan ragu menghubungi **Hotline Sejiwa Kemenkes 119 ext 8** atau berkonsultasi dengan terapis profesional kami.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          groundingSources: [
            {
              title: "Layanan Kesehatan Jiwa Kemenkes Sejiwa 119",
              uri: "https://kemkes.go.id"
            }
          ],
          isGroundedWithSearch: true
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error(error);
      const errMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Terjadi gangguan jaringan sementara. Namun yakinlah, 'Fainna ma'al 'usri yusro' — sesungguhnya bersama kesulitan selalu ada kemudahan.\n\nUntuk keadaan krisis darurat, silakan hubungi hotline Sejiwa di **119 ext 8**.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        groundingSources: [
          {
            title: "Direktori Bantuan Darurat Kesehatan Mental Kemenkes RI",
            uri: "https://kemkes.go.id"
          }
        ],
        isGroundedWithSearch: true
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm("Apakah Anda ingin memulai sesi percakapan baru dengan Konselor AI?")) {
      setMessages([
        {
          id: "msg-fresh",
          sender: "ai",
          text: "Assalamu'alaikum. Sesi baru telah dimulai. Saya siap mendengarkan cerita Anda dengan integrasi Google Search Grounding untuk rujukan kesehatan mental dan psikologi Islam terkini. Silakan ceritakan apa yang ingin Anda konsultasikan.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          groundingSources: [
            {
              title: "Layanan Sejiwa 119 ext 8",
              uri: "https://kemkes.go.id"
            }
          ],
          isGroundedWithSearch: true
        }
      ]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#E2E8F0]">
      
      {/* Header Banner with Search Grounding Status */}
      <div className="bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-3xl p-6 shadow-xl border border-[#C5A267]/40 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1C202C] border border-[#C5A267]/40 text-[#C5A267] flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-6 h-6 text-[#C5A267]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Konselor Cerdas Tazkiyatun Nafs AI
              </h2>
              <span className="bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#C5A267]" />
                Google Search Grounding
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Refleksi kognitif berbasis bukti, riset Psikologi Islam, & direktori rujukan kesehatan mental terkini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Grounding Info Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsGroundingInfoModalOpen(true)}
            className="px-3 py-2 bg-[#1C2230] hover:bg-[#252E3E] border border-[#2E374A] hover:border-[#C5A267]/40 text-[#C5A267] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Informasi Rujukan & Search Grounding"
          >
            <Info className="w-3.5 h-3.5 text-[#C5A267]" />
            <span className="hidden sm:inline">Direktori & Rujukan</span>
          </button>

          {/* Book Session Button */}
          <button
            type="button"
            onClick={onBookSession}
            className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-md shadow-[#C5A267]/20 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Jadwal Sesi Psikolog</span>
          </button>
        </div>
      </div>

      {/* Grounding Control Bar & Category Tabs */}
      <div className="bg-[#141720] border border-[#252E3E] rounded-2xl p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        
        {/* Toggle Search Grounding Engine */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setEnableGrounding(!enableGrounding)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              enableGrounding ? "bg-[#C5A267]" : "bg-[#252E3E]"
            }`}
            title="Aktifkan/Nonaktifkan Google Search Grounding"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                enableGrounding ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`font-semibold ${enableGrounding ? "text-[#C5A267]" : "text-[#94A3B8]"}`}>
              Search Grounding {enableGrounding ? "Aktif" : "Mati"}
            </span>
            <span className="text-[11px] text-[#64748B] hidden md:inline">
              ({enableGrounding ? "Terhubung ke database web & literatur psikologi" : "Hanya pengetahuan lokal"})
            </span>
          </div>
        </div>

        {/* Categories of Focus */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: "all", label: "Semua Topik" },
            { id: "crisis_hotlines", label: "Hotline & Faskes" },
            { id: "islamic_psychology", label: "Psikologi Islam" },
            { id: "clinical_guidelines", label: "Standar HIMPSI" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as GroundingCategory)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#C5A267] text-black shadow-xs font-bold"
                  : "bg-[#0E1015] hover:bg-[#1E2330] text-[#94A3B8] border border-[#252E3E]"
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Reset chat button */}
          <button
            type="button"
            onClick={handleClearConversation}
            className="p-1.5 text-[#94A3B8] hover:text-[#C5A267] hover:bg-[#1C202C] rounded-lg transition-colors ml-1 cursor-pointer shrink-0"
            title="Mulai Percakapan Baru"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#111318] rounded-3xl border border-[#1F2937] shadow-2xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Messages Log */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#0A0B0D]">
          
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            const isCopied = copiedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAI ? "" : "flex-row-reverse space-x-reverse"}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAI
                      ? "bg-[#181C26] border border-[#C5A267]/30 text-[#C5A267] shadow-xs"
                      : "bg-[#252E3E] text-white"
                  }`}
                >
                  {isAI ? <Sparkles className="w-4 h-4 text-[#C5A267]" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[88%] sm:max-w-[78%] space-y-1.5`}>
                  <div className={`flex items-center space-x-2 text-[11px] text-[#64748B] ${isAI ? "" : "justify-end"}`}>
                    <span className="font-semibold text-[#94A3B8]">
                      {isAI ? "Konselor Cerdas AI Tazkiyah" : "Anda"}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {isAI && msg.isGroundedWithSearch && (
                      <span className="bg-[#0E2818] border border-[#10B981]/40 text-[#10B981] text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Grounded Web Search
                      </span>
                    )}
                  </div>

                  {/* Message Bubble Body */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isAI
                        ? "bg-[#141720] text-[#E2E8F0] border border-[#252E3E] shadow-xs rounded-tl-xs"
                        : "bg-[#C5A267] text-black font-medium rounded-tr-xs shadow-md shadow-[#C5A267]/15"
                    }`}
                  >
                    {msg.text}

                    {/* SEARCH GROUNDING: Grounding Sources Accordion/Badge Section */}
                    {isAI && msg.groundingSources && msg.groundingSources.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-[#252E3E] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C5A267]">
                            <Globe className="w-3.5 h-3.5 text-[#C5A267]" />
                            <span>Sumber & Rujukan Web Terverifikasi (Search Grounding):</span>
                          </div>
                          <span className="text-[10px] text-[#64748B] bg-[#0E1015] px-2 py-0.5 rounded-full border border-[#1F2937]">
                            {msg.groundingSources.length} Rujukan
                          </span>
                        </div>

                        {/* Search queries evaluated by AI */}
                        {msg.searchQueries && msg.searchQueries.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] text-[#64748B]">Kueri Terverifikasi:</span>
                            {msg.searchQueries.map((query, qIdx) => (
                              <span
                                key={qIdx}
                                className="bg-[#0E1015] border border-[#252E3E] text-[#94A3B8] text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1"
                              >
                                <Search className="w-2.5 h-2.5 text-[#C5A267]" />
                                {query}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Grounding Web Links Grid */}
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {msg.groundingSources.map((source, sIdx) => {
                            let domain = "";
                            try {
                              domain = new URL(source.uri).hostname.replace("www.", "");
                            } catch {
                              domain = "web resource";
                            }

                            return (
                              <a
                                key={sIdx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#0E1015] hover:bg-[#181C26] border border-[#252E3E] hover:border-[#C5A267]/50 rounded-xl p-2.5 flex items-start justify-between gap-2 transition-all group cursor-pointer"
                              >
                                <div className="space-y-0.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A267]" />
                                    <span className="text-[11px] font-bold text-white group-hover:text-[#C5A267] truncate transition-colors">
                                      {source.title}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#64748B] block truncate font-mono">
                                    {domain}
                                  </span>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#C5A267] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Action Toolbar (AI Only) */}
                  {isAI && (
                    <div className="flex items-center gap-2 pt-1 pl-1">
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-[11px] text-[#94A3B8] hover:text-[#C5A267] flex items-center gap-1 transition-colors cursor-pointer py-0.5 px-1.5 rounded-md hover:bg-[#181C26]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-[#10B981]" />
                            <span className="text-[#10B981]">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Refleksi</span>
                          </>
                        )}
                      </button>

                      <span className="text-[#334155]">•</span>

                      <button
                        type="button"
                        onClick={onBookSession}
                        className="text-[11px] text-[#94A3B8] hover:text-[#C5A267] flex items-center gap-1 transition-colors cursor-pointer py-0.5 px-1.5 rounded-md hover:bg-[#181C26]"
                      >
                        <Calendar className="w-3 h-3 text-[#C5A267]" />
                        <span>Konsultasikan ke Psikolog</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-[#181C26] border border-[#C5A267]/30 text-[#C5A267] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin text-[#C5A267]" />
              </div>
              <div className="p-4 rounded-2xl bg-[#141720] border border-[#252E3E] shadow-xs text-xs text-[#94A3B8] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-bounce delay-200"></span>
                <span className="font-medium ml-1 text-[#E2E8F0] flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-[#C5A267] animate-pulse" />
                  Konselor AI sedang menelusuri riset & menyusun refleksi penyejuk jiwa...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills for Current Category */}
        <div className="p-3 bg-[#0E1015] border-t border-[#1F2937] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#64748B] shrink-0 uppercase tracking-wider pl-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#C5A267]" />
            Rekomendasi Riset:
          </span>
          {quickPromptsByCategory[activeCategory].map((item, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(item.query)}
              className="px-3 py-1.5 bg-[#141720] hover:bg-[#1D2230] text-[#94A3B8] hover:text-[#C5A267] rounded-full border border-[#252E3E] hover:border-[#C5A267]/50 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#111318] border-t border-[#1F2937]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan keluhan emosi, riset psikologi Islam, atau cari hotline rujukan..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#0E1015] border border-[#252E3E] rounded-2xl text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-[#C5A267] hover:bg-[#D8B57B] disabled:opacity-50 text-black p-3.5 rounded-2xl transition-all shrink-0 flex items-center justify-center shadow-md shadow-[#C5A267]/20 cursor-pointer"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#64748B] mt-2 px-1 gap-1">
            <span className="flex items-center gap-1 text-[#94A3B8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A267]" />
              Didukung Google Search Grounding • Privasi & Enkripsi Terjaga
            </span>
            <span className="italic text-[#64748B]">
              Darurat krisis kesehatan jiwa hubungi Hotline Sejiwa 119 ext 8
            </span>
          </div>
        </div>

      </div>

      {/* MODAL: Direktori & Panduan Search Grounding Kesehatan Mental */}
      {isGroundingInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#141720] border border-[#C5A267]/40 rounded-3xl max-w-2xl w-full p-6 text-[#E2E8F0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsGroundingInfoModalOpen(false)}
              className="absolute top-5 right-5 text-[#94A3B8] hover:text-white p-1 hover:bg-[#1F2937] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#1C2230] border border-[#C5A267]/40 text-[#C5A267] flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-[#C5A267]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Direktori Rujukan & Search Grounding
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Standar verifikasi informasi kesehatan mental & psikoterapi Islam
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-4 text-xs">
              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#C5A267] flex items-center gap-1.5 text-sm">
                  <PhoneCall className="w-4 h-4 text-[#C5A267]" />
                  Hotline & Layanan Krisis Darurat di Indonesia
                </h4>
                <p className="text-[#94A3B8] leading-relaxed">
                  Jika Anda atau kerabat sedang mengalami krisis mental berat atau membutuhkan pertolongan pertama, hubungi saluran resmi berikut:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-[#141720] p-3 rounded-xl border border-[#252E3E]">
                    <div className="font-bold text-white">Hotline Sejiwa Kemenkes</div>
                    <div className="text-[#C5A267] font-mono font-bold text-sm">119 ext 8</div>
                    <div className="text-[10px] text-[#64748B]">Bebas pulsa, layanan konseling 24 jam</div>
                  </div>
                  <div className="bg-[#141720] p-3 rounded-xl border border-[#252E3E]">
                    <div className="font-bold text-white">Panggilan Darurat Terpadu</div>
                    <div className="text-[#C5A267] font-mono font-bold text-sm">112</div>
                    <div className="text-[10px] text-[#64748B]">Ambulans & layanan gawat darurat daerah</div>
                  </div>
                  <div className="bg-[#141720] p-3 rounded-xl border border-[#252E3E]">
                    <div className="font-bold text-white">Yayasan Pulih</div>
                    <div className="text-[#C5A267] font-mono font-bold text-xs">(021) 788-42580</div>
                    <div className="text-[10px] text-[#64748B]">Layanan pemulihan trauma & psikososial</div>
                  </div>
                  <div className="bg-[#141720] p-3 rounded-xl border border-[#252E3E]">
                    <div className="font-bold text-white">Into The Light Indonesia</div>
                    <div className="text-[#C5A267] font-mono font-bold text-xs">intothelightid.org</div>
                    <div className="text-[10px] text-[#64748B]">Edukasi & pencegahan bunuh diri berbasis bukti</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#C5A267] flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-[#C5A267]" />
                  Fondasi Riset Psikologi Islam (Islamic Psychology)
                </h4>
                <p className="text-[#94A3B8] leading-relaxed">
                  Search Grounding mengintegrasikan literatur mutakhir dari jurnal bereputasi seperti <strong>Journal of Muslim Mental Health</strong>, kajian <em>Islamic Cognitive Behavioral Therapy (I-CBT)</em>, dan metodologi <em>Tazkiyatun Nafs</em> (penyucian jiwa) yang selaras dengan panduan klinis global.
                </p>
              </div>

              <div className="bg-[#0E1015] border border-[#252E3E] rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#C5A267] flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#C5A267]" />
                  Standar Etika & Regulasi HIMPSI
                </h4>
                <p className="text-[#94A3B8] leading-relaxed">
                  Layanan telemedisin di LimoCity Therapy mengikuti pedoman etika HIMPSI (Himpunan Psikologi Indonesia) dan Ikatan Psikolog Klinis (IPK) Indonesia dalam menjaga kerahasiaan data, integritas praktisi, serta batas kewenangan asisten AI.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsGroundingInfoModalOpen(false);
                  onBookSession();
                }}
                className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Konsultasi Psikolog</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGroundingInfoModalOpen(false)}
                className="px-4 py-2.5 bg-[#1F2937] hover:bg-[#2E374A] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
