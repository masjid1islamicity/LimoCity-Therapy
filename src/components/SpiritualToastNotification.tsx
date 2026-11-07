import React from "react";
import { Sparkles, X, Heart, ArrowRight } from "lucide-react";
import { SpiritualQuote } from "../data/dzikirReflectionData";

interface SpiritualToastNotificationProps {
  isVisible: boolean;
  quote: SpiritualQuote | null;
  onOpenFullModal: () => void;
  onOpenSidebar: () => void;
  onDismiss: () => void;
}

export const SpiritualToastNotification: React.FC<SpiritualToastNotificationProps> = ({
  isVisible,
  quote,
  onOpenFullModal,
  onOpenSidebar,
  onDismiss,
}) => {
  if (!isVisible || !quote) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-[#141722]/95 border border-[#C5A267]/60 rounded-2xl p-4 text-white shadow-2xl backdrop-blur-md animate-slideUp">
      <div className="flex items-start justify-between gap-2">
        
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#C5A267]/20 border border-[#C5A267]/40 flex items-center justify-center text-[#C5A267] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A267] block">
              Pengingat Tazkiyah Hati
            </span>
            <span className="text-xs font-semibold text-white">
              {quote.themeLabel}
            </span>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-[#94A3B8] hover:text-white p-1 rounded-md transition-colors"
          title="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs font-serif italic text-[#F3E8D2] my-2.5 line-clamp-2 leading-relaxed">
        "{quote.quote}"
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-[#1F2937] text-[11px]">
        <button
          onClick={onOpenFullModal}
          className="text-[#94A3B8] hover:text-[#C5A267] font-medium transition-colors"
        >
          Lihat Hikmah Lengkap
        </button>

        <button
          onClick={onOpenSidebar}
          className="px-2.5 py-1 bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-sm transition-all"
        >
          <Heart className="w-3 h-3 text-black" />
          <span>Dzikir Sejenak</span>
        </button>
      </div>
    </div>
  );
};
