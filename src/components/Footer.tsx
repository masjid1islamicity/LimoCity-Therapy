import React from "react";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Globe,
  Lock
} from "lucide-react";

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenEmergency,
}) => {
  return (
    <footer className="bg-[#08090C] text-[#94A3B8] text-xs border-t border-[#1F2937]">
      
      {/* Top Value Banner */}
      <div className="border-b border-[#1F2937] bg-[#0D0F14] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#141720] text-[#C5A267] rounded-2xl border border-[#C5A267]/30 shadow-md">
              <ShieldCheck className="w-5 h-5 text-[#C5A267]" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm font-serif">Privasi Medis Terjamin</h5>
              <p className="text-[#94A3B8] mt-0.5">Enkripsi 256-bit berstandar HIPAA & Permenkes RI.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#141720] text-[#C5A267] rounded-2xl border border-[#C5A267]/30 shadow-md">
              <Award className="w-5 h-5 text-[#C5A267]" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm font-serif">Psikolog & Dokter Ber-SIPP</h5>
              <p className="text-[#94A3B8] mt-0.5">Semua praktisi terverifikasi HIMPSI & Kemenkes.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#141720] text-[#C5A267] rounded-2xl border border-[#C5A267]/30 shadow-md">
              <HeartHandshake className="w-5 h-5 text-[#C5A267]" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm font-serif">Holistik & Tazkiyatun Nafs</h5>
              <p className="text-[#94A3B8] mt-0.5">Integrasi sains psikologi modern & nilai Islam.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2330] to-[#141720] border border-[#C5A267]/40 flex items-center justify-center text-white font-bold shadow-md shadow-[#C5A267]/10">
                <HeartHandshake className="w-6 h-6 text-[#C5A267]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base font-serif tracking-wide">
                  LimoCity <span className="text-[#C5A267]">Therapy</span>
                </h4>
                <p className="text-[11px] text-[#C5A267] font-semibold">
                  therapy.islamicity.tv
                </p>
              </div>
            </div>

            <p className="text-[#94A3B8] leading-relaxed text-xs">
              Induk infrastruktur & platform telemedisin kesehatan jiwa cerdas di bawah naungan Islamicity TV Health Network.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-[#64748B]">
              <Lock className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>TLS 1.3 WebRTC Encrypted Telehealth</span>
            </div>
          </div>

          {/* Col 2: Layanan & Fitur */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-serif">
              Layanan Utama
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate("booking")} className="hover:text-[#C5A267] transition-colors">
                  Jadwalkan Janji Temu Telemedisin
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("therapists")} className="hover:text-[#C5A267] transition-colors">
                  Direktori Psikolog Klinis & Psikiater
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("telemedicine-room")} className="hover:text-[#C5A267] transition-colors">
                  Ruang Konsultasi Virtual HD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("ai-counselor")} className="hover:text-[#C5A267] transition-colors">
                  Konselor Cerdas AI Tazkiyatun Nafs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("dzikir")} className="hover:text-[#C5A267] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A267]">🌿</span>
                  <span>Dzikir & Refleksi Harian (Tasbih)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("screening")} className="hover:text-[#C5A267] transition-colors">
                  Tes Skrining DASS-21 (Depresi/Cemas)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Bantuan */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-serif">
              Portal & Kemitraan
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate("partnerships")} className="text-[#C5A267] font-semibold hover:underline flex items-center gap-1">
                  <span>🤝 Kemitraan Cerdas Berdaya</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("portal")} className="hover:text-[#C5A267] transition-colors">
                  Portal Rekam Medis (EMR) Pasien
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("therapist-portal")} className="hover:text-[#C5A267] transition-colors">
                  Portal Khusus Psikolog / Terapis
                </button>
              </li>
              <li>
                <button onClick={onOpenEmergency} className="text-rose-400 font-bold hover:underline flex items-center gap-1">
                  <span>🚨 Bantuan Darurat & Hotline Krisis</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Lisensi */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-serif">
              Kontak & Operasional
            </h5>
            <div className="space-y-2 text-[#94A3B8] text-xs">
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-[#C5A267]" />
                <span>therapy.islamicity.tv</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A267]" />
                <span>hrd.islamicity@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A267]" />
                <span>Jakarta & Surabaya, Indonesia</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 pt-6 border-t border-[#1F2937] text-[#64748B] text-[11px] leading-relaxed space-y-2">
          <p>
            <strong className="text-[#94A3B8]">Disclaimer Medis:</strong> Layanan telemedisin LimoCity Therapy (therapy.islamicity.tv) ditujukan untuk pendampingan psikologis, evaluasi kesehatan mental, psikoterapi, dan konseling keluarga. Dalam kondisi gawat darurat psikiatri atau bahaya membahayakan diri sendiri/orang lain, harap segera menuju Instalasi Gawat Darurat (IGD) rumah sakit terdekat atau hubungi Hotline Kemenkes SEJIWA 119 Ext 8.
          </p>
          <p className="text-center text-[#64748B] pt-3">
            © {new Date().getFullYear()} LimoCity Therapy • Islamicity TV Health Network. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>

    </footer>
  );
};
