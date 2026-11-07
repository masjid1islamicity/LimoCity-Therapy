// Ambient audio engine for auto-looping soothing Quranic recitation, soft nasheed, and procedural meditative soundscapes

export interface AmbientTrack {
  id: string;
  title: string;
  artistOrQari: string;
  category: "quran" | "nasheed" | "meditation";
  categoryLabel: string;
  src?: string; // External audio URL or procedural marker
  type: "stream" | "procedural";
  proceduralType?: "solfeggio_528" | "calm_432" | "rain_breeze";
  description: string;
  durationLabel: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: "quran-rahman",
    title: "Surah Ar-Rahman (Tartil Merdu)",
    artistOrQari: "Misyari Rasyid Al-Afasy",
    category: "quran",
    categoryLabel: "Murottal Qur'an",
    type: "stream",
    src: "https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/55.mp3",
    description: "Ayat-ayat cinta, nikmat Ilahi, dan keagungan Ar-Rahman untuk melunakkan kalbu yang gelisah.",
    durationLabel: "13:00 (Auto-Loop)",
  },
  {
    id: "quran-mulk",
    title: "Surah Al-Mulk (Penentram Jiwa)",
    artistOrQari: "Misyari Rasyid Al-Afasy",
    category: "quran",
    categoryLabel: "Murottal Qur'an",
    type: "stream",
    src: "https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3",
    description: "Bacaan syahdu pelindung hati dari kegelapan dan kecemasan malam hari.",
    durationLabel: "08:15 (Auto-Loop)",
  },
  {
    id: "quran-insyirah",
    title: "Surah Al-Insyirah & Ad-Duha (Pelapang Dada)",
    artistOrQari: "Sheikh Abdul Basit (Murattal)",
    category: "quran",
    categoryLabel: "Murottal Qur'an",
    type: "stream",
    src: "https://download.quranicaudio.com/qdc/abdul_baset/murattal/94.mp3",
    description: "Surah pelipur lara penenang hati: 'Sesungguhnya bersama kesulitan ada kemudahan.'",
    durationLabel: "04:30 (Auto-Loop)",
  },
  {
    id: "nasheed-hasbi",
    title: "Hasbi Rabbi Jalallah (Dzikir Kalbu)",
    artistOrQari: "Vocal Akapela Lembut",
    category: "nasheed",
    categoryLabel: "Soft Nasheed / Dzikir",
    type: "stream",
    src: "https://ia801503.us.archive.org/15/items/HasbiRabbi_201705/Hasbi%20Rabbi.mp3",
    description: "Alunan dzikir lembut: Cukuplah Allah bagiku, tiada di dalam hatiku selain Allah.",
    durationLabel: "04:12 (Auto-Loop)",
  },
  {
    id: "nasheed-talaal",
    title: "Tala'al Badru 'Alayna (Shalawat Damai)",
    artistOrQari: "Akapela Tradisional",
    category: "nasheed",
    categoryLabel: "Soft Nasheed / Dzikir",
    type: "stream",
    src: "https://ia800301.us.archive.org/16/items/NasheedCollection_201605/Tala%27al%20Badru%20%27Alayna.mp3",
    description: "Kerinduan mendalam kepada Rasulullah SAW dengan nada menyejukkan hati.",
    durationLabel: "03:45 (Auto-Loop)",
  },
  {
    id: "synth-528",
    title: "Harmoni 528Hz Gelombang Cinta Ilahi",
    artistOrQari: "LimoCity Meditative Synth",
    category: "meditation",
    categoryLabel: "Gelombang Penenang (Offline)",
    type: "procedural",
    proceduralType: "solfeggio_528",
    description: "Frekuensi Solfeggio 528Hz murni untuk relaksasi saraf, menurunkan hormon stres kortisol, dan thuma'ninah.",
    durationLabel: "Tak Terbatas (Procedural)",
  },
  {
    id: "synth-432",
    title: "Drone 432Hz Thuma'ninah Kalbu",
    artistOrQari: "LimoCity Meditative Synth",
    category: "meditation",
    categoryLabel: "Gelombang Penenang (Offline)",
    type: "procedural",
    proceduralType: "calm_432",
    description: "Alunan frekuensi 432Hz yang selaras dengan ritme alam semesta dan detak jantung tenang.",
    durationLabel: "Tak Terbatas (Procedural)",
  },
  {
    id: "synth-rain",
    title: "Gemericik Air Wudhu & Angin Syahdu",
    artistOrQari: "Suasana Alamiah",
    category: "meditation",
    categoryLabel: "Gelombang Penenang (Offline)",
    type: "procedural",
    proceduralType: "rain_breeze",
    description: "Suara desau alam hening dan aliran air untuk membersihkan pikiran dari keruwetan duniawi.",
    durationLabel: "Tak Terbatas (Procedural)",
  },
];

class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private proceduralNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    noiseSource?: AudioBufferSourceNode;
  } | null = null;

  private currentTrack: AmbientTrack = AMBIENT_TRACKS[0];
  private isPlaying: boolean = false;
  private volume: number = 0.6;
  private isLoop: boolean = true;
  private onStateChangeCallback?: (isPlaying: boolean, track: AmbientTrack, volume: number) => void;

  constructor() {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("limocity_ambient_volume");
      if (savedVolume) {
        this.volume = Math.max(0.05, Math.min(1, parseFloat(savedVolume)));
      }
      const savedTrackId = localStorage.getItem("limocity_ambient_track_id");
      if (savedTrackId) {
        const found = AMBIENT_TRACKS.find((t) => t.id === savedTrackId);
        if (found) this.currentTrack = found;
      }
    }
  }

  public setListener(cb: (isPlaying: boolean, track: AmbientTrack, volume: number) => void) {
    this.onStateChangeCallback = cb;
  }

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isPlaying, this.currentTrack, this.volume);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getTrack(): AmbientTrack {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("limocity_ambient_volume", this.volume.toString());
    }

    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }

    if (this.proceduralNodes) {
      this.proceduralNodes.gains.forEach((g) => {
        try {
          if (this.audioCtx) {
            g.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime);
          }
        } catch (e) {}
      });
    }

    this.notify();
  }

  public setTrack(track: AmbientTrack) {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentTrack = track;
    if (typeof window !== "undefined") {
      localStorage.setItem("limocity_ambient_track_id", track.id);
    }

    if (wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.play();
      return true;
    }
  }

  public async play(): Promise<void> {
    this.stop();

    if (this.currentTrack.type === "procedural") {
      this.playProcedural(this.currentTrack.proceduralType || "solfeggio_528");
      this.isPlaying = true;
      this.notify();
      return;
    }

    // Stream playback
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = "anonymous";
    }

    this.audioElement.src = this.currentTrack.src || "";
    this.audioElement.loop = this.isLoop;
    this.audioElement.volume = this.volume;

    this.audioElement.onended = () => {
      if (this.isLoop) {
        this.audioElement?.play().catch(() => {});
      } else {
        this.isPlaying = false;
        this.notify();
      }
    };

    this.audioElement.onerror = () => {
      console.warn("Ambient stream audio error, falling back to soothing procedural harmonic synth");
      // Fallback gracefully to procedural 528Hz
      this.playProcedural("solfeggio_528");
      this.isPlaying = true;
      this.notify();
    };

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify();
    } catch (err) {
      console.warn("Audio play blocked or stream error, starting procedural audio generator:", err);
      this.playProcedural("solfeggio_528");
      this.isPlaying = true;
      this.notify();
    }
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
    }

    this.stopProcedural();
    this.isPlaying = false;
    this.notify();
  }

  // Generate soothing procedural soundscapes with Web Audio API
  private playProcedural(type: "solfeggio_528" | "calm_432" | "rain_breeze") {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopProcedural();

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    const filters: BiquadFilterNode[] = [];
    let noiseSource: AudioBufferSourceNode | undefined;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gains.push(masterGain);

    if (type === "solfeggio_528") {
      // 528Hz Solfeggio fundamental + octave sub + warm major 3rd/5th ambient chord
      const freqs = [528, 264, 660, 792];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle undulating LFO effect
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200 - idx * 200, ctx.currentTime);

        gain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        oscillators.push(osc);
        filters.push(filter);
      });
    } else if (type === "calm_432") {
      // 432Hz deep meditative grounding drone
      const freqs = [108, 216, 432, 864];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.09 / (idx + 1), ctx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        oscillators.push(osc);
      });
    } else {
      // Rain & soft breeze (procedural pink noise filtered with gentle resonance)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      whiteNoise.start();
      noiseSource = whiteNoise;
      filters.push(filter);
    }

    this.proceduralNodes = {
      oscillators,
      gains,
      filters,
      noiseSource,
    };
  }

  private stopProcedural() {
    if (this.proceduralNodes) {
      this.proceduralNodes.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      if (this.proceduralNodes.noiseSource) {
        try {
          this.proceduralNodes.noiseSource.stop();
          this.proceduralNodes.noiseSource.disconnect();
        } catch (e) {}
      }
      this.proceduralNodes.gains.forEach((g) => {
        try {
          g.disconnect();
        } catch (e) {}
      });
      this.proceduralNodes = null;
    }
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
