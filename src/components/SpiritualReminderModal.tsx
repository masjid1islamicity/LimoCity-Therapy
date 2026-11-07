import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  X, 
  Heart, 
  Volume2, 
  VolumeX, 
  Wind, 
  ArrowRight, 
  Clock, 
  Share2, 
  CheckCircle2, 
  Copy,
  Flame
} from "lucide-react";
import { SpiritualQuote, DzikirItem, DZIKIR_COLLECTION, SPIRITUAL_QUOTES } from "../data/dzikirReflectionData";
import { soundSynth } from "../utils/audioChime";

interface SpiritualReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: SpiritualQuote;
  onOpenDzikirSidebar: (dzikirId?: string) => void;
  isSoundEnabled: boolean;
  onSnooze: (minutes: number) => void;
}

export const SpiritualReminderModal: React.FC<SpiritualReminderModalProps> = ({
  isOpen,
  onClose,
  quote,
  onOpenDzikirSidebar,
  isSoundEnabled,
  onSnooze,
}) => {
  const [activeQuote, setActiveQuote] = useState<SpiritualQuote>(
    quote || SPIRITUAL_QUOTES[0]
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Suggested quick dzikir
  const suggestedDzikir: DzikirItem = DZIKIR_COLLECTION[0]; // Doa Nabi Yunus

  useEffect(() => {
    if (quote) {
      setActiveQuote(quote);
    } else {
      // Pick random quote
      const rand = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
      setActiveQuote(rand);
    }
  }, [quote, isOpen]);

  // Handle copy
  const handleCopy = () => {
    navigator.clipboard.writeText(`"${activeQuote.quote}" — ${activeQuote.authorOrSource}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      
      <div className="bg-gradient-to-br from-[#141722] via-[#0E1017] to-[#0A0B0E] border border-[#C5A267]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Decorative Golden Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#C5A267]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white hover:bg-[#181C26] rounded-full transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 bg-[#C5A267]/20 text-[#C5A267] border border-[#C5A267]/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Jeda Hati • Tazkiyatun Nafs
          </span>
          <span className="text-xs text-[#94A3B8] font-medium">
            {activeQuote.themeLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-snug">
          Sejenak Meluruskan Hati Bersama Allah
        </h3>

        {/* Spiritual Quote Block */}
        <div className="my-5 p-5 bg-[#0B0D12]/90 border border-[#252E3E] rounded-2xl relative">
          <blockquote className="text-base sm:text-lg font-serif italic text-[#F3E8D2] leading-relaxed text-center">
            "{activeQuote.quote}"
          </blockquote>

          <p className="text-xs font-bold text-[#C5A267] text-center mt-3 font-serif">
            — {activeQuote.authorOrSource}
          </p>

          <div className="mt-4 pt-3 border-t border-[#1F2937] text-xs text-[#94A3B8] leading-relaxed">
            <strong className="text-white block mb-0.5">Hikmah Penyejuk Jiwa:</strong>
            {activeQuote.tazkiyahExplanation}
          </div>
        </div>

        {/* Quick 1-Minute Dzikir Suggestion */}
        <div className="p-3.5 bg-[#181C26]/80 rounded-xl border border-[#252E3E] flex items-center justify-between gap-3 my-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {suggestedDzikir.title}
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                Rekomendasi 33x tasbih untuk meluruhkan ketegangan batin
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenDzikirSidebar(suggestedDzikir.id);
            }}
            className="px-3 py-1.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black text-xs font-bold rounded-lg whitespace-nowrap transition-all shadow-sm"
          >
            Mulai Dzikir
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1F2937]">
          
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-xs text-[#94A3B8] hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Kutipan Tersalin" : "Salin Hikmah"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSnooze(5);
                onClose();
              }}
              className="px-3 py-2 bg-[#181C26] hover:bg-[#252E3E] text-[#94A3B8] hover:text-white rounded-xl text-xs font-medium border border-[#252E3E] transition-all"
            >
              Tunda 5 Menit
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenDzikirSidebar();
              }}
              className="px-4 py-2 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Buka Ruang Tazkiyah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
