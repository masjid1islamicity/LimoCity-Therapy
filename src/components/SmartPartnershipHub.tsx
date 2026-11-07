import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Handshake, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Users, 
  Stethoscope, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Calculator, 
  Send, 
  Download, 
  ChevronRight, 
  HelpCircle, 
  Lock, 
  Layers, 
  Activity, 
  HeartHandshake, 
  ArrowRight,
  ExternalLink,
  Zap,
  Clock,
  MapPin,
  Mail,
  Phone,
  Printer
} from "lucide-react";
import { PartnershipApplication, PartnershipTrack } from "../types";

interface SmartPartnershipHubProps {
  onNavigateToBooking: () => void;
  onNavigateToAICounselor: () => void;
}

export const SmartPartnershipHub: React.FC<SmartPartnershipHubProps> = ({
  onNavigateToBooking,
  onNavigateToAICounselor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "simulator" | "apply" | "partners" | "faq">("overview");

  // Partnership Applications state
  const [partnerships, setPartnerships] = useState<PartnershipApplication[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<PartnershipApplication | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    institutionName: "",
    picName: "",
    picRole: "",
    picEmail: "",
    picPhone: "",
    city: "",
    track: "corporate" as PartnershipTrack,
    scaleEstimate: "500 - 1.000 Karyawan / Jiwa",
    collaborationGoals: "",
  });

  // AI Evaluation Result preview
  const [aiEvaluationResult, setAiEvaluationResult] = useState<any | null>(null);

  // Simulator State
  const [simTrack, setSimTrack] = useState<PartnershipTrack>("corporate");
  const [simPopulation, setSimPopulation] = useState<number>(350);
  const [simFocus, setSimFocus] = useState<string>("burnout_stress");

  // Fetch registered partnerships
  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      const res = await fetch("/api/partnerships");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.partnerships) {
          setPartnerships(data.partnerships);
        }
      }
    } catch (err) {
      console.warn("Could not fetch partnerships list:", err);
    }
  };

  // Handle AI Evaluation
  const handleTriggerAiEvaluation = async () => {
    if (!formData.institutionName || !formData.collaborationGoals) {
      alert("Mohon isi Nama Institusi dan Visi/Tujuan Kerjasama terlebih dahulu untuk dianalisis oleh AI.");
      return;
    }

    setIsAiEvaluating(true);
    try {
      const res = await fetch("/api/ai/partnership-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.evaluation) {
          setAiEvaluationResult(data.evaluation);
        }
      }
    } catch (err) {
      console.error("AI Evaluation failed:", err);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // Handle Form Submit
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institutionName || !formData.picName || !formData.picEmail) {
      alert("Mohon lengkapi data nama institusi, PIC, dan email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        aiEvaluation: aiEvaluationResult || undefined,
      };

      const res = await fetch("/api/partnerships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.partnership) {
          setSubmissionSuccess(data.partnership);
          setPartnerships((prev) => [data.partnership, ...prev]);
        }
      } else {
        alert("Terjadi kesalahan saat mendaftarkan kemitraan.");
      }
    } catch (err) {
      console.error("Failed submitting partnership:", err);
      alert("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulator Calculations
  const calculateSimStats = () => {
    const pop = simPopulation;
    let costPerIncident = 1500000;
    let estimatedAtRiskPct = 0.18; // 18% people facing stress/burnout
    let productivityHoursPerPerson = 45; // hours saved per year

    if (simTrack === "healthcare") {
      costPerIncident = 2800000;
      estimatedAtRiskPct = 0.35;
    } else if (simTrack === "education") {
      costPerIncident = 950000;
      estimatedAtRiskPct = 0.22;
    } else if (simTrack === "practitioner") {
      costPerIncident = 1200000;
      estimatedAtRiskPct = 0.50;
    }

    const atRiskCount = Math.round(pop * estimatedAtRiskPct);
    const totalSavingRp = atRiskCount * (costPerIncident * 0.48);
    const totalHoursSaved = atRiskCount * productivityHoursPerPerson;
    const satisfactionIncrease = Math.min(68, 35 + Math.round(pop / 100));

    return {
      atRiskCount,
      totalSavingRp,
      totalHoursSaved,
      satisfactionIncrease,
    };
  };

  const simStats = calculateSimStats();

  const tracksData = [
    {
      id: "corporate",
      title: "Korporasi & BUMN (Corporate Wellness & EAP)",
      icon: Briefcase,
      badge: "B2B Enterprise",
      highlight: "Employee Assistance Program 24/7 & Deteksi Burnout",
      description: "Solusi kesehatan jiwa menyeluruh untuk menjaga produktivitas tim, menekan absenteeism, dan membangun budaya kerja berlandaskan Qolbun Salim.",
      benefits: [
        "Akses telemedisin 1-on-1 tanpa batas untuk karyawan & keluarga",
        "Executive Dashboard Analitik Kesejahteraan Agregat (100% Anonim)",
        "Webinar Berkala: Resiliensi Kerja, Manajemen Beban Pikiran & I-CBT",
        "Dedicated Case Manager & Jalur Cepat Psikiatri Klinis",
      ],
      sla: "Respon Krisis < 15 Menit • SLA Layanan 99.9%",
    },
    {
      id: "healthcare",
      title: "Rumah Sakit, Klinik & Faskes (Dual Referral Bridge)",
      icon: Stethoscope,
      badge: "Jaringan Rujukan Medis",
      highlight: "Sistem Rujukan Digital Interoperabel & Second Opinion",
      description: "Integrasi sistem rujukan digital dua arah untuk memperluas jangkauan poli jiwa, telemedicine pra/pasca rawat inap, dan telekonsultasi multidisiplin.",
      benefits: [
        "Bridging API Rekam Medis Elektronik (EMR) berstandar SatuSehat & HIPAA",
        "Case Conference bersama Tim Dokter Spesialis Kedokteran Jiwa (Sp.KJ)",
        "Pendampingan pasca rawat inap untuk mencegah relapse",
        "Optimalisasi kapasitas faskes tanpa perlu ekspansi ruang fisik",
      ],
      sla: "Integrasi API REST/FHIR • Enkripsi TLS 1.3 256-Bit",
    },
    {
      id: "practitioner",
      title: "Praktisi Medis & Psikolog Klinis (SIPP/STR)",
      icon: Users,
      badge: "Kemitraan Praktisi",
      highlight: "Kemandirian Praktik Cloud, Bagi Hasil Adil & Modul I-CBT",
      description: "Wadah berdaya bagi Psikiater, Psikolog Klinis, dan Konselor Berlisensi untuk memperluas dakwah penyembuhan dengan dukungan infrastruktur digital mutakhir.",
      benefits: [
        "Bagi hasil transparan hingga 85% untuk mitra praktisi",
        "Sistem EMR SOAP terpadu, e-Prescription & scheduling otomatis",
        "Asuransi perlindungan malpraktik & legalitas medis resmi",
        "Sertifikasi Pelatihan Islamic CBT & Tazkiyatun Nafs gratis",
      ],
      sla: "Pencairan Honor Mingguan Fleksibel • Jadwal Praktik Mandiri",
    },
    {
      id: "education",
      title: "Pesantren, Universitas & Lembaga Dakwah",
      icon: GraduationCap,
      badge: "Pendidikan & Sosial",
      highlight: "Skrining Massal Santri/Mahasiswa & Pengasuhan Nabawiyah",
      description: "Program sinergi kesehatan mental terjangkau untuk lembaga pendidikan Islam, santri, mahasiswa, serta keluarga dhuafa melalui subsidi ZISWAF.",
      benefits: [
        "Skrining massal periodik DASS-21 / PHQ-9 terotomatisasi",
        "Pelatihan P3K Psikologis (Psychological First Aid) untuk asatidz/dosen",
        "Klinik konseling virtual kampus / pesantren bersubsidi",
        "Riset bersama pengembangan Psikologi Islam & Tazkiyah",
      ],
      sla: "Subsidi Khusus Lembaga Dakwah • Layanan Berbasis Maslahat",
    },
    {
      id: "insurance_tech",
      title: "Asuransi Kesehatan & Digital Health Ecosystem",
      icon: TrendingUp,
      badge: "Payor & Insurtech",
      highlight: "Direct Billing Telemedisin & Pencegahan Klaim Katastropik",
      description: "Kemitraan strategis dengan perusahaan asuransi jiwa/kesehatan dan agregator benefit untuk penyediaan tele-konseling cashless berstandar klinis.",
      benefits: [
        "Direct API Integration untuk otorisasi klaim cashless realtime",
        "Laporan utilisasi medis transparan & fraud-detection",
        "Pencegahan komplikasi psikosomatis berbiaya tinggi",
        "Dukungan jaringan farmasi & e-resep resmi terantar",
      ],
      sla: "API Uptime 99.95% • Auto-Settlement T+3",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E2E8F0] animate-fadeIn">
      
      {/* Top Value Banner */}
      <div className="bg-gradient-to-br from-[#12151E] via-[#0E1017] to-[#0A0B0F] border border-[#C5A267]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#C5A267]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3.5 py-1 bg-[#C5A267]/20 text-[#C5A267] border border-[#C5A267]/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Induk Layanan Kesehatan LimoCity Therapy
            </span>
            <span className="px-3 py-1 bg-[#1A1F2C] text-[#94A3B8] border border-[#252E3E] rounded-full text-xs font-medium">
              Islamicity TV Health Network • therapy.islamicity.tv
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Bagaimana Cara Cerdas Berdaya Terbaik Kerjasama dengan <span className="text-[#C5A267]">Induk Layanan Kesehatan LimoCity Therapy</span>
          </h1>

          <p className="text-[#94A3B8] text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            Selamat datang di ekosistem kemitraan strategis LimoCity Therapy. Kami membuka sinergi cerdas, berkeadilan syariah, dan berdaya guna tinggi bagi <strong>Korporasi, Rumah Sakit/Faskes, Praktisi Medis/Psikolog, serta Institusi Pendidikan & Dakwah</strong> untuk mewujudkan kesehatan mental yang holistik, ilmiah, dan berlandaskan kedamaian spiritual Tazkiyatun Nafs.
          </p>

          {/* 4 Quick Value Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#1F2937]/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shrink-0">
                <Handshake className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Akad Berkeadilan Syariah</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">SIPP & STR Kemenkes</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">API EMR 256-Bit</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A267]/15 border border-[#C5A267]/30 flex items-center justify-center text-[#C5A267] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Dampak Nyata & Terukur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div className="bg-[#111318] p-1.5 rounded-2xl border border-[#1F2937] shadow-xl flex items-center justify-between overflow-x-auto no-scrollbar gap-1 mb-8">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "overview"
              ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
              : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
          }`}
        >
          <Layers className="w-4 h-4" />
          5 Pilar & Roadmap Cerdas
        </button>

        <button
          onClick={() => setActiveSubTab("simulator")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "simulator"
              ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
              : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
          }`}
        >
          <Calculator className="w-4 h-4" />
          Kalkulator Sinergi & Dampak
        </button>

        <button
          onClick={() => setActiveSubTab("apply")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "apply"
              ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
              : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
          }`}
        >
          <Send className="w-4 h-4" />
          Ajukan Kemitraan & AI Matcher
        </button>

        <button
          onClick={() => setActiveSubTab("partners")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "partners"
              ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
              : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Portofolio Mitra Terdaftar ({partnerships.length})
        </button>

        <button
          onClick={() => setActiveSubTab("faq")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "faq"
              ? "bg-[#C5A267] text-black shadow-md shadow-[#C5A267]/20"
              : "text-[#94A3B8] hover:text-white hover:bg-[#181C26]"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Panduan & FAQ Resmi
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: OVERVIEW (5 Pilar & 4-Step Roadmap) */}
      {/* ========================================================================= */}
      {activeSubTab === "overview" && (
        <div className="space-y-12 animate-fadeIn">
          
          {/* Section 1: 5 Strategic Tracks */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A267]">
                Pilihan Model Kolaborasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                5 Jalur Kemitraan Cerdas Berdaya LimoCity Therapy
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
                Pilih skema kerjasama yang paling sesuai dengan kebutuhan organisasi, profesi, atau institusi Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracksData.map((track) => {
                const IconComponent = track.icon;
                return (
                  <div
                    key={track.id}
                    className="bg-[#111318] border border-[#1F2937] hover:border-[#C5A267]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#181C26] border border-[#252E3E] flex items-center justify-center text-[#C5A267] group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6 text-[#C5A267]" />
                        </div>
                        <span className="px-2.5 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {track.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#C5A267] transition-colors leading-snug">
                        {track.title}
                      </h3>

                      <p className="text-xs font-semibold text-[#C5A267] mt-1">
                        ★ {track.highlight}
                      </p>

                      <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed">
                        {track.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#1F2937] space-y-2">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                          Keunggulan Berdaya:
                        </span>
                        {track.benefits.map((b, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-[#94A3B8]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A267] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1F2937]">
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                        <span>Standar SLA:</span>
                        <span className="font-mono text-[#94A3B8]">{track.sla}</span>
                      </div>
                      <button
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, track: track.id as PartnershipTrack }));
                          setActiveSubTab("apply");
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className="w-full py-2.5 px-3 bg-[#181C26] hover:bg-[#C5A267] text-white hover:text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-[#252E3E] group-hover:border-[#C5A267]"
                      >
                        <span>Pilih Jalur Kemitraan Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 4-Step Roadmap "Cara Cerdas Berdaya" */}
          <div className="bg-[#0E1015] border border-[#1F2937] rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                Tata Kelola & Alur Integrasi
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                4 Tahapan Cerdas Menjalin Kerjasama Berkelanjutan
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
                Proses transparan, terukur, dan cepat dari penjajakan awal hingga peluncuran operasional telemedisin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-[#141720] p-6 rounded-2xl border border-[#252E3E] relative flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#C5A267] text-black font-bold text-base flex items-center justify-center font-serif shadow-md mb-4">
                    01
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">
                    Asesmen Kebutuhan & Skala
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Pengisian profil institusi, identifikasi tantangan kesehatan mental tim/pasien, serta pemetaan populasi sasaran.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1F2937] text-[11px] text-[#C5A267]">
                  Estimasi Waktu: 1 - 2 Hari Kerja
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#141720] p-6 rounded-2xl border border-[#252E3E] relative flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#C5A267] text-black font-bold text-base flex items-center justify-center font-serif shadow-md mb-4">
                    02
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">
                    Penyelarasan MoU Syariah & SLA
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Penyusunan Perjanjian Kerjasama (MoU) dengan prinsip keadilan, ketiadaan gharar, transparansi biaya, dan komitmen SLA medis.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1F2937] text-[11px] text-[#C5A267]">
                  Estimasi Waktu: 3 - 5 Hari Kerja
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#141720] p-6 rounded-2xl border border-[#252E3E] relative flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#C5A267] text-black font-bold text-base flex items-center justify-center font-serif shadow-md mb-4">
                    03
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">
                    Integrasi Sistem & Pelatihan
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Penyediaan akses Portal EMR, integrasi API/SSO jika dibutuhkan, serta pelatihan intensif bagi koordinator dan operator internal.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1F2937] text-[11px] text-[#C5A267]">
                  Estimasi Waktu: 3 - 7 Hari Kerja
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#141720] p-6 rounded-2xl border border-[#252E3E] relative flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#C5A267] text-black font-bold text-base flex items-center justify-center font-serif shadow-md mb-4">
                    04
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">
                    Go-Live & Monitoring Dampak
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Peluncuran resmi layanan konseling, pelaksanaan webinar pembuka, serta penerbitan laporan analitik berkala bulanan.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1F2937] text-[11px] text-[#C5A267]">
                  Monitoring Berkelanjutan 24/7
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setActiveSubTab("apply");
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-[#C5A267]/20 transition-all inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Mulai Pengajuan Kemitraan Cerdas Sekarang</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: INTERACTIVE SIMULATOR (Kalkulator Sinergi & Dampak) */}
      {/* ========================================================================= */}
      {activeSubTab === "simulator" && (
        <div className="bg-[#111318] border border-[#1F2937] rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeIn">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
              Kalkulator Kemitraan Strategis
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Simulasi Pemberdayaan & Penghematan Dampak Kemitraan
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Kalkulasikan proyeksi penghematan operasional, jam kerja/belajar terselamatkan, serta peningkatan indeks ketenangan jiwa (Qolbun Salim) secara objektif.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Controls (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0E1015] p-6 rounded-2xl border border-[#252E3E] space-y-6">
              
              {/* Select Track */}
              <div>
                <label className="block text-xs font-bold text-[#C5A267] uppercase tracking-wider mb-2">
                  1. Tipe Institusi / Mitra:
                </label>
                <select
                  value={simTrack}
                  onChange={(e) => setSimTrack(e.target.value as PartnershipTrack)}
                  className="w-full p-3 bg-[#141720] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267]"
                >
                  <option value="corporate">🏢 Perusahaan / Korporasi / BUMN</option>
                  <option value="healthcare">🏥 Rumah Sakit / Klinik / Faskes Rujukan</option>
                  <option value="education">🎓 Pesantren / Universitas / Sekolah</option>
                  <option value="practitioner">👨‍⚕️ Praktisi Klinis Mandiri / Konselor</option>
                  <option value="insurance_tech">🛡️ Asuransi / Insurtech Payor</option>
                </select>
              </div>

              {/* Population Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#C5A267] uppercase tracking-wider">
                    2. Estimasi Jumlah Jiwa / Populasi:
                  </label>
                  <span className="text-sm font-bold font-mono text-white bg-[#181C26] px-2.5 py-0.5 rounded-md border border-[#252E3E]">
                    {simPopulation.toLocaleString("id-ID")} Orang
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="3000"
                  step="20"
                  value={simPopulation}
                  onChange={(e) => setSimPopulation(Number(e.target.value))}
                  className="w-full accent-[#C5A267] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
                  <span>20 Orang</span>
                  <span>1.000 Orang</span>
                  <span>3.000+ Orang</span>
                </div>
              </div>

              {/* Priority Focus */}
              <div>
                <label className="block text-xs font-bold text-[#C5A267] uppercase tracking-wider mb-2">
                  3. Fokus Utama Intervensi:
                </label>
                <div className="space-y-2">
                  {[
                    { id: "burnout_stress", label: "Penurunan Burnout, Kelelahan Mental & Stres Kerja" },
                    { id: "crisis_depression", label: "Skrining DASS-21, Deteksi Dini & Pencegahan Krisis" },
                    { id: "family_sakinah", label: "Konseling Keluarga Sakinah & Keseimbangan Hidup" },
                    { id: "clinical_referral", label: "Integrasi Telemedisin & Rujukan Medis Spesialistik" },
                  ].map((f) => (
                    <label
                      key={f.id}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        simFocus === f.id
                          ? "bg-[#181C26] border-[#C5A267] text-white font-medium"
                          : "bg-[#141720] border-[#252E3E] text-[#94A3B8] hover:bg-[#181C26]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="simFocus"
                        checked={simFocus === f.id}
                        onChange={() => setSimFocus(f.id)}
                        className="accent-[#C5A267]"
                      />
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Output Projection Display (7 Cols) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#141720] to-[#0D0F14] p-6 sm:p-8 rounded-2xl border border-[#C5A267]/30 flex flex-col justify-between shadow-xl">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">
                      Proyeksi Nilai Pemberdayaan Kemitraan
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Berdasarkan parameter {simPopulation} jiwa pada model {simTrack}
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#C5A267]/15 rounded-xl border border-[#C5A267]/30 text-[#C5A267]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  
                  <div className="bg-[#111318] p-4 rounded-xl border border-[#252E3E] text-center">
                    <span className="text-[11px] text-[#94A3B8] block mb-1">Populasi Tertolong Dini:</span>
                    <span className="text-2xl font-bold font-serif text-[#C5A267]">
                      {simStats.atRiskCount}
                    </span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Jiwa Tercegah dari Relapse</span>
                  </div>

                  <div className="bg-[#111318] p-4 rounded-xl border border-[#252E3E] text-center">
                    <span className="text-[11px] text-[#94A3B8] block mb-1">Estimasi Efisiensi Biaya:</span>
                    <span className="text-xl font-bold font-serif text-emerald-400">
                      Rp {(simStats.totalSavingRp / 1000000).toFixed(1)} Juta
                    </span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">per Tahun Anggaran</span>
                  </div>

                  <div className="bg-[#111318] p-4 rounded-xl border border-[#252E3E] text-center">
                    <span className="text-[11px] text-[#94A3B8] block mb-1">Jam Produktif Terselamatkan:</span>
                    <span className="text-2xl font-bold font-serif text-[#C5A267]">
                      {simStats.totalHoursSaved.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Jam Kerja & Belajar</span>
                  </div>

                </div>

                {/* Qualitative Spiritual Impact Box */}
                <div className="p-4 bg-[#181C26] border border-[#252E3E] rounded-xl space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-[#C5A267] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Dampak Holistik & Kesejahteraan Jiwa:</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Implementasi kemitraan ini diproyeksikan meningkatkan <strong>Indeks Qolbun Salim & Ketenangan Jiwa hingga +{simStats.satisfactionIncrease}%</strong>, mengurangi konflik relasional, dan mengukuhkan komitmen nilai-nilai ketakwaan serta etos kerja positif.
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#94A3B8]">
                  Ingin implementasi langsung untuk <strong>{simPopulation} orang</strong>?
                </div>
                <button
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      track: simTrack,
                      scaleEstimate: `${simPopulation} Orang`,
                    }));
                    setActiveSubTab("apply");
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Lanjutkan ke Formulir Pengajuan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: APPLICATION FORM & AI PROPOSAL MATCHER */}
      {/* ========================================================================= */}
      {activeSubTab === "apply" && (
        <div className="space-y-8 animate-fadeIn">
          
          {submissionSuccess ? (
            /* Success State Card */
            <div className="bg-[#111318] border border-[#C5A267]/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#C5A267]/20 border border-[#C5A267]/40 text-[#C5A267] flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full text-xs font-bold uppercase tracking-wider">
                Permohonan Kemitraan Berhasil Didaftarkan
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-3">
                Nomor Registrasi Kemitraan:
              </h3>
              
              <div className="my-4 inline-block px-6 py-2.5 bg-[#181C26] border border-[#C5A267] rounded-xl font-mono text-xl font-bold text-[#C5A267] shadow-lg">
                {submissionSuccess.registrationCode}
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
                Terima kasih <strong>{submissionSuccess.picName}</strong> dari <strong>{submissionSuccess.institutionName}</strong>. Proposal kemitraan Anda telah tercatat dalam sistem Induk Layanan Kesehatan LimoCity Therapy. Tim Eksekutif Kemitraan kami akan menghubungi email ({submissionSuccess.picEmail}) atau WhatsApp Anda dalam waktu 1x24 jam kerja.
              </p>

              {/* AI Strategic Fit Summary if available */}
              {submissionSuccess.aiEvaluation && (
                <div className="my-6 p-6 bg-[#0E1015] border border-[#252E3E] rounded-2xl text-left text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
                    <span className="font-bold text-[#C5A267] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Lembar Rekomendasi Sinergi Cerdas (AI Analysis):
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#C5A267]/20 text-[#C5A267] rounded-md font-bold">
                      Skor Sinergi: {submissionSuccess.aiEvaluation.synergyScore}%
                    </span>
                  </div>

                  <p className="text-white leading-relaxed">
                    {submissionSuccess.aiEvaluation.strategicFitAnalysis}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#94A3B8] block mb-1">
                      Rekomendasi Roadmap 90 Hari:
                    </span>
                    <ul className="space-y-1 text-[#94A3B8]">
                      {submissionSuccess.aiEvaluation.recommendedRoadmap.map((r: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#C5A267] font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-[#181C26] hover:bg-[#252E3E] text-white border border-[#252E3E] rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#C5A267]" />
                  <span>Cetak Tanda Terima Registrasi</span>
                </button>

                <button
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setAiEvaluationResult(null);
                    setFormData({
                      institutionName: "",
                      picName: "",
                      picRole: "",
                      picEmail: "",
                      picPhone: "",
                      city: "",
                      track: "corporate",
                      scaleEstimate: "500 - 1.000 Karyawan / Jiwa",
                      collaborationGoals: "",
                    });
                    setActiveSubTab("partners");
                  }}
                  className="px-5 py-2.5 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-xl text-xs font-bold shadow-md"
                >
                  Lihat Portofolio Mitra Terdaftar
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="bg-[#111318] border border-[#1F2937] rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              <div className="text-center max-w-3xl mx-auto mb-8">
                <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                  Formulir Kemitraan Terpadu
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  Pengajuan Kemitraan Cerdas Berdaya LimoCity Therapy
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
                  Lengkapi data institusi Anda untuk mendapatkan analisis kecocokan AI instan serta penjadwalan audiensi resmi bersama Direksi LimoCity Therapy.
                </p>
              </div>

              <form onSubmit={handleSubmitApplication} className="max-w-4xl mx-auto space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Institution Name */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Nama Institusi / Perusahaan / Praktisi: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Medika Insan Sejahtera / RS Islam"
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* Track Selection */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Jalur Kemitraan yang Dipilih: <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value as PartnershipTrack })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#C5A267]"
                    >
                      <option value="corporate">🏢 Korporasi / BUMN (Corporate EAP 24/7)</option>
                      <option value="healthcare">🏥 Rumah Sakit / Klinik / Puskesmas (Dual Referral)</option>
                      <option value="practitioner">👨‍⚕️ Praktisi Medis / Psikolog SIPP Mandiri</option>
                      <option value="education">🎓 Pesantren / Universitas / Lembaga Dakwah</option>
                      <option value="insurance_tech">🛡️ Asuransi Kesehatan / Health-Tech Payor</option>
                    </select>
                  </div>

                  {/* PIC Name */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Nama Lengkap PIC (Penanggung Jawab): <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama & Gelar Lengkap"
                      value={formData.picName}
                      onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* PIC Role */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Jabatan / Divisi:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: HR Director / Kepala Pelayanan Medis"
                      value={formData.picRole}
                      onChange={(e) => setFormData({ ...formData, picRole: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* PIC Email */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Alamat Email Resmi PIC: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@perusahaan.co.id"
                      value={formData.picEmail}
                      onChange={(e) => setFormData({ ...formData, picEmail: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* PIC Phone / WA */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Nomor WhatsApp / Telepon: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+62 812-xxxx-xxxx"
                      value={formData.picPhone}
                      onChange={(e) => setFormData({ ...formData, picPhone: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Kota & Provinsi Operasional:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                  {/* Scale Estimate */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Estimasi Skala Populasi Sasaran:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 850 Karyawan / 1.500 Santri"
                      value={formData.scaleEstimate}
                      onChange={(e) => setFormData({ ...formData, scaleEstimate: e.target.value })}
                      className="w-full p-3 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    />
                  </div>

                </div>

                {/* Goals */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    Visi, Harapan & Sasaran Sinergi Kemitraan: <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan gambaran kebutuhan kerjasama Anda, target penanganan kesehatan mental, kebutuhan integrasi sistem, atau program kerja yang ingin dicapai bersama LimoCity Therapy..."
                    value={formData.collaborationGoals}
                    onChange={(e) => setFormData({ ...formData, collaborationGoals: e.target.value })}
                    className="w-full p-3.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267] leading-relaxed"
                  ></textarea>
                </div>

                {/* AI Proposal Analyzer Bar */}
                <div className="p-5 bg-gradient-to-br from-[#181C26] to-[#12151E] border border-[#C5A267]/40 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5A267]" />
                        Evaluasi Kecocokan Sinergi Instan (Gemini AI Powered)
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Dapatkan estimasi skor kecocokan, proyeksi dampak, dan rancangan roadmap 90 hari sebelum submit.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerAiEvaluation}
                      disabled={isAiEvaluating}
                      className="px-4 py-2 bg-[#1E2433] hover:bg-[#252E3E] text-[#C5A267] border border-[#C5A267]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAiEvaluating ? "animate-spin" : ""}`} />
                      <span>{isAiEvaluating ? "Menganalisis..." : "Uji Sinergi AI"}</span>
                    </button>
                  </div>

                  {aiEvaluationResult && (
                    <div className="pt-3 border-t border-[#252E3E] text-xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Tingkat Kecocokan Strategis:</span>
                        <span className="font-bold text-[#C5A267] font-serif text-sm">
                          {aiEvaluationResult.synergyScore}% Sangat Potensial
                        </span>
                      </div>
                      <p className="text-[#94A3B8] italic">
                        "{aiEvaluationResult.strategicFitAnalysis}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-8 py-3.5 rounded-xl text-xs shadow-xl shadow-[#C5A267]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-black" />
                    <span>{isSubmitting ? "Mendaftarkan Proposal..." : "Kirim Permohonan Kemitraan Resmi"}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: REGISTERED PARTNERS PORTFOLIO */}
      {/* ========================================================================= */}
      {activeSubTab === "partners" && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
              Jaringan Mitra LimoCity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Portofolio Mitra & Institusi Terakreditasi
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Lembaga dan faskes yang telah terintegrasi dalam jaringan telemedisin dan pendampingan mental Tazkiyatun Nafs LimoCity Therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerships.map((p) => (
              <div
                key={p.id}
                className="bg-[#111318] border border-[#1F2937] hover:border-[#C5A267]/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                    <span className="font-mono text-xs text-[#C5A267] font-bold">
                      {p.registrationCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === "approved"
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                        : "bg-[#1A1F2C] text-[#C5A267] border border-[#C5A267]/30"
                    }`}>
                      {p.status === "approved" ? "Mitra Aktif Berdaya" : "Dalam Peninjauan"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-white mt-3">
                    {p.institutionName}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#181C26] text-[#94A3B8] border border-[#252E3E] rounded text-[11px]">
                      📍 {p.city}
                    </span>
                    <span className="px-2 py-0.5 bg-[#181C26] text-[#94A3B8] border border-[#252E3E] rounded text-[11px]">
                      👥 {p.scaleEstimate}
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                    {p.collaborationGoals}
                  </p>

                  {p.aiEvaluation && (
                    <div className="mt-4 p-3.5 bg-[#141720] border border-[#252E3E] rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[#C5A267] font-bold text-[11px]">
                        <span>Skor Sinergi Kemitraan:</span>
                        <span>{p.aiEvaluation.synergyScore}%</span>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                        {p.aiEvaluation.strategicFitAnalysis}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs text-[#64748B]">
                  <span>PIC: {p.picName} ({p.picRole})</span>
                  <span>{new Date(p.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: FAQ & OFFICIAL DOCUMENTS */}
      {/* ========================================================================= */}
      {activeSubTab === "faq" && (
        <div className="bg-[#111318] border border-[#1F2937] rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeIn space-y-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="px-3 py-1 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
              Pusat Informasi Kemitraan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Pertanyaan yang Sering Diajukan (FAQ) & Legalitas
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Klarifikasi lengkap seputar kepatuhan hukum medis, akad syariah, proteksi privasi pasien, dan dukungan teknis.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                q: "Bagaimana legalitas praktik dan izin operasional telemedisin LimoCity Therapy?",
                a: "LimoCity Therapy beroperasi di bawah naungan resmi Islamicity TV Health Network dengan seluruh tenaga medis (Dokter Spesialis Jiwa / Psikiater) memegang STR Kemenkes aktif dan Psikolog Klinis memegang Surat Izin Praktik Psikologi (SIPP) dari HIMPSI. Seluruh sistem telemedisin memenuhi standar Permenkes No. 20 Tahun 2019 tentang Penyelenggaraan Telemedicine.",
              },
              {
                q: "Bagaimana prinsip syariah diterapkan dalam kerjasama kemitraan ini?",
                a: "Kemitraan berlandaskan akad yang jelas (Syirkah/Ijarah/Wakalah) yang bebas dari unsur gharar (ketidakjelasan), riba, dan maysir. Bagi hasil untuk mitra praktisi dan tarif B2B korporat diatur secara transparan, berkeadilan, dan disertai alokasi dana sosial/dakwah kesehatan mental bagi kaum dhuafa.",
              },
              {
                q: "Apakah data rekam medis pasien/karyawan terjamin kerahasiaannya?",
                a: "Sangat terjamin. Seluruh data rekam medis dienkripsi dengan standar TLS 1.3 dan AES-256 bit end-to-end. Untuk laporan korporat (EAP), data yang diserahkan berupa analitik agregat tanpa pernah membuka identitas atau isi sesi privat karyawan.",
              },
              {
                q: "Berapa lama proses dari pengajuan proposal hingga implementasi go-live?",
                a: "Untuk skema standar Korporat EAP atau Pesantren, proses onboarding memakan waktu 5 hingga 10 hari kerja. Untuk integrasi API mendalam dengan Rumah Sakit/Asuransi, proses integrasi teknis memerlukan waktu 2 hingga 3 pekan.",
              },
              {
                q: "Bagaimana jika ada kondisi pasien darurat psikiatri yang membutuhkan penanganan fisik segera?",
                a: "LimoCity Therapy memiliki protokol triase darurat terpadu. Pasien dalam risiko krisis akut langsung dialihkan ke IGD Rumah Sakit jejaring terdekat serta dihubungkan ke Hotline Krisis Kemenkes SEJIWA 119 Ext 8 dengan pendampingan tim medis siaga.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#0E1015] border border-[#252E3E] rounded-2xl space-y-2"
              >
                <h4 className="font-bold text-white text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#C5A267] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#94A3B8] pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Official Contact Box */}
          <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#181C26] to-[#12151E] border border-[#C5A267]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white uppercase tracking-wider block">
                Sekretariat Kemitraan & Transformasi Medis:
              </span>
              <p className="text-[#94A3B8]">
                Email Resmi: <span className="text-[#C5A267] font-semibold">hrd.islamicity@gmail.com</span> • Portal: <span className="text-[#C5A267] font-semibold">therapy.islamicity.tv</span>
              </p>
            </div>
            <a
              href="mailto:hrd.islamicity@gmail.com?subject=Permohonan%20Kemitraan%20Strategis%20LimoCity%20Therapy"
              className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all whitespace-nowrap"
            >
              Hubungi Tim Kemitraan
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
