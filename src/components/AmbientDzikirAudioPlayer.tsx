import React, { useState, useEffect } from "react";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Disc,
  Radio,
  Sliders,
  Check
} from "lucide-react";
import {
  ambientAudioEngine,
  AMBIENT_TRACKS,
  AmbientTrack,
} from "../utils/ambientAudioEngine";

interface AmbientDzikirAudioPlayerProps {
  isCompact?: boolean;
  className?: string;
}

export const AmbientDzikirAudioPlayer: React.FC<AmbientDzikirAudioPlayerProps> = ({
  isCompact = false,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(ambientAudioEngine.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack>(ambientAudioEngine.getTrack());
  const [volume, setVolume] = useState<number>(ambientAudioEngine.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  useEffect(() => {
    ambientAudioEngine.setListener((playing, track, vol) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
      setVolume(vol);
    });
  }, []);

  const handleTogglePlay = async () => {
    await ambientAudioEngine.toggle();
  };

  const handleSelectTrack = (track: AmbientTrack) => {
    ambientAudioEngine.setTrack(track);
    setIsDropdownOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    ambientAudioEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientAudioEngine.setVolume(volume || 0.5);
    } else {
      setIsMuted(true);
      ambientAudioEngine.setVolume(0);
    }
  };

  const filteredTracks = activeCategoryFilter === "all"
    ? AMBIENT_TRACKS
    : AMBIENT_TRACKS.filter((t) => t.category === activeCategoryFilter);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isPlaying
          ? "bg-linear-to-r from-[#171A24] via-[#1A202E] to-[#141722] border-[#C5A267]/60 shadow-lg shadow-[#C5A267]/10"
          : "bg-[#0E1015] border-[#252E3E] hover:border-[#38445C]"
      } ${className}`}
    >
      {/* Top Banner / Main Controls */}
      <div className="p-3.5 flex flex-col gap-3">
        
        {/* Row 1: Status Title, Animated Soundwave Bars, and Play/Pause */}
        <div className="flex items-center justify-between gap-2.5">
          
          {/* Left: Disc Icon + Track Info */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                isPlaying
                  ? "bg-[#C5A267]/20 border-[#C5A267] text-[#F3E8D2] shadow-xs shadow-[#C5A267]/30"
                  : "bg-[#181C26] border-[#2E374A] text-[#94A3B8]"
              }`}
            >
              {isPlaying ? (
                <Disc className="w-4 h-4 animate-spin text-[#C5A267]" style={{ animationDuration: "4s" }} />
              ) : (
                <Music className="w-4 h-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30">
                  {currentTrack.categoryLabel}
                </span>

                {/* Auto Loop Badge */}
                <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5" title="Otomatis Berulang Saat Dzikir">
                  <Repeat className="w-2.5 h-2.5" />
                  <span>Auto-Loop</span>
                </span>
              </div>

              <h5 className="text-xs font-bold text-white truncate mt-0.5">
                {currentTrack.title}
              </h5>
              <p className="text-[10px] text-[#94A3B8] truncate">
                {currentTrack.artistOrQari} • {currentTrack.durationLabel}
              </p>
            </div>
          </div>

          {/* Right: Soundwave Visualizer + Play/Pause Action */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Equalizer Soundwave Animation when playing */}
            {isPlaying && (
              <div className="flex items-end space-x-0.5 h-4 px-1.5 py-0.5 bg-black/40 rounded-md border border-[#C5A267]/30">
                <span className="w-0.5 bg-[#C5A267] rounded-full animate-pulse h-3" />
                <span className="w-0.5 bg-[#E5C388] rounded-full animate-bounce h-4" style={{ animationDelay: "150ms" }} />
                <span className="w-0.5 bg-[#C5A267] rounded-full animate-pulse h-2.5" style={{ animationDelay: "300ms" }} />
                <span className="w-0.5 bg-[#F3E8D2] rounded-full animate-bounce h-3.5" style={{ animationDelay: "450ms" }} />
              </div>
            )}

            <button
              type="button"
              onClick={handleTogglePlay}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                isPlaying
                  ? "bg-[#C5A267] hover:bg-[#D8B57B] text-black shadow-[#C5A267]/30"
                  : "bg-[#1F293D] hover:bg-[#C5A267] text-[#CBD5E1] hover:text-black border border-[#2E3D59]"
              }`}
              title={isPlaying ? "Jeda Latar Audio" : "Putar Latar Murottal/Nasheed"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Quick Volume Slider & Track Selector Toggle */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1F2937]/70 text-xs">
          
          {/* Volume Control */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={handleToggleMute}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Bunyikan" : "Senyapkan"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#C5A267]" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-28 h-1.5 bg-[#1F293D] rounded-lg appearance-none cursor-pointer accent-[#C5A267]"
              title={`Volume Audio: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
            <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Change Track Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-2.5 py-1 rounded-lg bg-[#141722] hover:bg-[#1A2030] border border-[#252E42] text-[#C5A267] hover:text-[#E5C388] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <span>Pilih Suara ({AMBIENT_TRACKS.length})</span>
            {isDropdownOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Dropdown Track Selector */}
        {isDropdownOpen && (
          <div className="mt-1 pt-2 border-t border-[#1F2937] space-y-2 animate-fadeIn">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "all", label: "Semua" },
                { id: "quran", label: "Murottal Qur'an" },
                { id: "nasheed", label: "Nasheed / Zikir" },
                { id: "meditation", label: "Gelombang Penenang" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? "bg-[#C5A267] text-black"
                      : "bg-[#141722] text-[#94A3B8] border border-[#252E42] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Track List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredTracks.map((track) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-[#181C28] border-[#C5A267] text-white shadow-xs"
                        : "bg-[#0E1015] border-[#1F2937] hover:border-[#C5A267]/50 hover:bg-[#141720] text-[#CBD5E1]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold uppercase text-[#C5A267]">
                          {track.categoryLabel}
                        </span>
                        <span className="text-[9px] text-[#64748B]">
                          • {track.durationLabel}
                        </span>
                      </div>
                      <h6 className={`text-xs font-bold ${isSelected ? "text-[#F3E8D2]" : "text-white"}`}>
                        {track.title}
                      </h6>
                      <p className="text-[10px] text-[#94A3B8] line-clamp-1 mt-0.5">
                        {track.description}
                      </p>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#C5A267] text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#2E374A] flex items-center justify-center text-[#64748B] hover:text-white">
                          <Play className="w-2.5 h-2.5 ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-[#64748B] text-center pt-1">
              Audio akan berulang otomatis (*seamless auto-loop*) mengiringi dzikir & tadabbur kalbu Anda.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
