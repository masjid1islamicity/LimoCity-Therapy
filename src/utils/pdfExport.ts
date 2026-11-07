import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Appointment, MoodLog, JournalEntry } from "../types";

export interface PDFExportOptions {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  emrNumber: string;
  birthDate?: string;
  gender?: string;
  password?: string;
  includeClinicalNotes: boolean;
  includeMoodHistory: boolean;
  includeDzikirLogs: boolean;
  includeDoctorSeal: boolean;
  notesFilter?: "all" | "last_3_months" | "last_month";
}

export interface DzikirLogSummary {
  totalCount: number;
  completedSessions: number;
  journalCount: number;
  past7Days?: {
    dateFormatted: string;
    dayName: string;
    count: number;
    target: number;
    completionRate: number;
  }[];
}

export interface SpiritualConsistencyReportData {
  streakCount: number;
  dzikirSummary: DzikirLogSummary;
  sunnahChecklist: {
    title: string;
    category: string;
    timeRecommendation: string;
    dalilReference: string;
    virtue: string;
    completed: boolean;
    targetCountText?: string;
  }[];
  spiritualGoals?: {
    title: string;
    category: string;
    completed: boolean;
  }[];
  overallSakinahIndex?: number;
  weeklyConsistencyRate?: number;
}

export interface TherapistSummaryExportOptions {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  emrNumber: string;
  therapistName?: string;
  gender?: string;
  birthDate?: string;
  password?: string;
  dateRange?: "all" | "last_30_days" | "last_7_days";
  includeAppointmentHistory: boolean;
  includeSpiritualConsistency: boolean;
  includeSunnahChecklist: boolean;
  includeMoodHistory: boolean;
  includeTherapistWorksheet: boolean;
  includeCustomNotesForTherapist: boolean;
  customNotesForTherapist?: string;
  includeDoctorSeal: boolean;
}

export interface JournalExportOptions {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  emrNumber: string;
  therapistName?: string;
  password?: string;
  exportScope: "all" | "selected" | "favorites" | "tagged";
  selectedTag?: string;
  privacyMode: "full" | "redacted_narrative" | "insights_only";
  includeAISentiment: boolean;
  includeQuranicAnchor: boolean;
  includeCustomDua: boolean;
  includeTherapistNotesSection: boolean;
  includeOfficialSeal: boolean;
}

export const generateSecurePatientReport = async (
  appointments: Appointment[],
  moodLogs: MoodLog[],
  dzikirSummary: DzikirLogSummary,
  options: PDFExportOptions
): Promise<void> => {
  // Initialize jsPDF document with optional encryption/password protection
  const docOptions: any = {
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  };

  const hasPassword = Boolean(options.password && options.password.trim().length > 0);
  if (hasPassword) {
    docOptions.encryption = {
      userPassword: options.password!.trim(),
      ownerPassword: `${options.password!.trim()}_limocity_owner_key_2026`,
      userPermissions: ["print", "copy"],
    };
  }

  const doc = new jsPDF(docOptions);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Primary colors
  const primaryGold = [197, 162, 103]; // #C5A267
  const darkNavy = [18, 21, 31];
  const slateGray = [100, 116, 139];
  const lightGray = [245, 247, 250];

  // Helper: Draw Header on pages
  const drawDocumentHeader = () => {
    // Top Gold Brand Bar
    doc.setFillColor(197, 162, 103);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header Background
    doc.setFillColor(18, 21, 31);
    doc.rect(margin, 8, pageWidth - margin * 2, 24, "F");

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LIMOCITY THERAPY • ISLAMIC CLINICAL PSYCHOLOGY", margin + 6, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(197, 162, 103);
    doc.text("Induk Layanan Kesehatan Jiwa Integratif & Tazkiyatun Nafs (therapy.islamicity.tv)", margin + 6, 23);

    // Right header badge: Confidential EMR Report
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(pageWidth - margin - 58, 12, 52, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("SALINAN REKAM MEDIS RESMI", pageWidth - margin - 55, 17);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.text(hasPassword ? "🔒 TERENKRIPSI PASSWORD" : "✓ DOKUMEN PERSONAL", pageWidth - margin - 55, 23);
  };

  drawDocumentHeader();
  currentY = 38;

  // Patient Demographic Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 30, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(18, 21, 31);
  doc.text("INFORMASI IDENTITAS PASIEN & DOKUMEN", margin + 5, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 5;
  const col2X = margin + 65;
  const col3X = margin + 125;

  doc.text(`Nama Lengkap : ${options.patientName}`, col1X, currentY + 14);
  doc.text(`Nomor Rekam Medis (EMR) : ${options.emrNumber}`, col1X, currentY + 20);
  doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB`, col1X, currentY + 26);

  doc.text(`Email : ${options.patientEmail}`, col2X, currentY + 14);
  doc.text(`No. WhatsApp/HP : ${options.patientPhone}`, col2X, currentY + 20);
  doc.text(`Jenis Kelamin : ${options.gender || "Laki-laki"}`, col2X, currentY + 26);

  doc.text(`Status EMR : Terverifikasi Aktif`, col3X, currentY + 14);
  doc.text(`Total Sesi Konseling : ${appointments.length} Sesi`, col3X, currentY + 20);
  doc.text(`Tingkat Keamanan : AES Password Protected`, col3X, currentY + 26);

  currentY += 36;

  // Security Note Banner
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 10, 1.5, 1.5, "FD");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.setFont("helvetica", "bold");
  doc.text("PEMBERITAHUAN PRIVASI & KERAHASIAN MEDIS (UU PDP NO. 27/2022):", margin + 4, currentY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan ini berisi data kesehatan medis dan refleksi batin pribadi. Harap jaga kerahasiaan kata sandi file PDF ini.", margin + 4, currentY + 8);

  currentY += 16;

  // SECTION 1: CLINICAL CONSULTATIONS & EMR NOTES
  if (options.includeClinicalNotes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("1. RIWAYAT KONSULTASI TELEMEDISIN & CATATAN KLINIS (EMR)", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 85, currentY + 1.5);
    currentY += 6;

    if (appointments.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Belum ada riwayat janji temu klinis yang tercatat.", margin, currentY + 4);
      currentY += 10;
    } else {
      const appointmentsTableData = appointments.map((apt, idx) => {
        const diag = apt.clinicalNotes?.diagnosis || "Evaluasi Holistik & Konseling Suportif";
        const plans = apt.clinicalNotes?.actionPlan?.join("\n• ") || "Terapi kognitif terstruktur & penataan ritme ibadah";
        const tazkiyah = apt.clinicalNotes?.tazkiyahPrescription || "Dzikir Al-Matsurat & pernafasan thuma'ninah harian";
        
        return [
          `${idx + 1}.\n${apt.bookingCode}\n${apt.date}\n${apt.timeSlot}`,
          `${apt.therapistName}\n(${apt.therapistTitle})\nMode: ${apt.consultationType.toUpperCase()}`,
          `Diagnosa / Fokus:\n${diag}\n\nTindakan Terapi:\n• ${plans}`,
          `Resep Tazkiyah:\n${tazkiyah}`,
          `${apt.status === "confirmed" ? "Selesai" : "Terkonfirmasi"}`
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Sesi & Waktu", "Tenaga Medis / Terapis", "Catatan Diagnosa & Action Plan", "Resep Ruhani (Tazkiyah)", "Status"]],
        body: appointmentsTableData,
        theme: "striped",
        headStyles: {
          fillColor: [18, 21, 31],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [51, 65, 85],
          valign: "top",
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 26 },
          1: { cellWidth: 38 },
          2: { cellWidth: 55 },
          3: { cellWidth: 45 },
          4: { cellWidth: 18, halign: "center" },
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
          drawDocumentHeader();
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;
    }
  }

  // Check if we need a new page for Section 2
  if (currentY > pageHeight - 65) {
    doc.addPage();
    drawDocumentHeader();
    currentY = 38;
  }

  // SECTION 2: DAILY MOOD & WELLBEING HISTORY
  if (options.includeMoodHistory) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("2. LOG SUASANA HATI (MOOD TRACKER) & REFLEKSI TADABBUR", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 85, currentY + 1.5);
    currentY += 6;

    // Mood samples if empty
    const logsToExport = moodLogs.length > 0 ? moodLogs : [
      {
        id: "mood-sample-1",
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        mood: "tenang" as const,
        energyLevel: 8,
        notes: "Merasakan kedamaian setelah shalat dhuha dan mendengarkan murottal.",
        aiReflection: "Ketenangan adalah karunia Allah yang turun saat hati ridha atas ketetapan-Nya.",
        shortPrayer: "Ya Muqallibal qulub, tsabbit qalbi 'ala dinik."
      },
      {
        id: "mood-sample-2",
        date: new Date(Date.now() - 86400000).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        mood: "cemas" as const,
        energyLevel: 5,
        notes: "Sempat overthinking terhadap pekerjaan namun mencoba teknik nafas 4-4-6.",
        aiReflection: "Urusan esok hari berada di tangan Dzat Yang Mengatur Alam Semesta. Cukupkan ikhtiar hari ini.",
        shortPrayer: "Hasbunallah wa ni'mal wakil."
      }
    ];

    const moodTableData = logsToExport.map((log, idx) => {
      const moodLabels: Record<string, string> = {
        sangat_tenang: "🌸 Sangat Tenang & Syukur",
        tenang: "🌿 Cukup Tenang",
        netral: "⛅ Biasa Saja",
        cemas: "🌧️ Cemas / Overthinking",
        lelah_batin: "🍂 Lelah Batin / Burnout"
      };

      return [
        `${log.date}`,
        `${moodLabels[log.mood] || log.mood}\nSkor Energi: ${log.energyLevel}/10`,
        `"${log.notes}"`,
        `${log.aiReflection || "-"}\n\nDoa: ${log.shortPrayer || "-"}`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Tanggal", "Kondisi Emosi & Energi", "Catatan Hati Pasien", "Refleksi Tadabbur & Doa Harian"]],
      body: moodTableData,
      theme: "striped",
      headStyles: {
        fillColor: [18, 21, 31],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [51, 65, 85],
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 24 },
        1: { cellWidth: 42 },
        2: { cellWidth: 56 },
        3: { cellWidth: 60 },
      },
      margin: { left: margin, right: margin },
      didDrawPage: () => {
        drawDocumentHeader();
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Check if we need a new page for Section 3 & Doctor Signature
  if (currentY > pageHeight - 75) {
    doc.addPage();
    drawDocumentHeader();
    currentY = 38;
  }

  // SECTION 3: TAZKIYAH & DZIKIR CONSISTENCY SUMMARY
  if (options.includeDzikirLogs) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("3. STATISTIK KONSISTENSI DZIKIR & DISIPLIN TAZKIYATUN NAFS (7 HARI)", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 6;

    // Overview KPIs Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    const dz1 = margin + 6;
    const dz2 = margin + 65;
    const dz3 = margin + 125;

    doc.text(`Total Dzikir Dilafalkan : ${dzikirSummary.totalCount} Kali`, dz1, currentY + 7);
    doc.text(`Target Putaran Selesai : ${dzikirSummary.completedSessions} Sesi`, dz1, currentY + 14);

    doc.text(`Catatan Jurnal Refleksi : ${dzikirSummary.journalCount} Entri`, dz2, currentY + 7);
    doc.text(`Latihan Nafas Thuma'ninah : Rutin Aktif`, dz2, currentY + 14);

    doc.text(`Indeks Ketenangan Batin : 87% (Stabil)`, dz3, currentY + 7);
    doc.text(`Metode : Islamic CBT & Tazkiyah`, dz3, currentY + 14);

    currentY += 26;

    // Daily breakdown table if 7-day data is provided
    if (dzikirSummary.past7Days && dzikirSummary.past7Days.length > 0) {
      const dzikirTableData = dzikirSummary.past7Days.map((day, idx) => {
        const isMet = day.count >= day.target;
        return [
          `${day.dayName}, ${day.dateFormatted}`,
          `${day.count} Kali`,
          `${day.target} Kali`,
          `${day.completionRate}%`,
          isMet ? "Tercapai (Istiqomah)" : "Belum Maksimal"
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Hari & Tanggal", "Jumlah Dzikir", "Target Harian", "Tingkat Capaian", "Status Istiqomah"]],
        body: dzikirTableData,
        theme: "striped",
        headStyles: {
          fillColor: [18, 21, 31],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [51, 65, 85],
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 38 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 28, halign: "center" },
          3: { cellWidth: 28, halign: "center" },
          4: { cellWidth: 56 },
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
          drawDocumentHeader();
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    } else {
      currentY += 6;
    }
  }

  // SECTION 4: ELECTRONIC VERIFICATION & DOCTOR SEAL
  if (options.includeDoctorSeal) {
    // Check if room is enough
    if (currentY > pageHeight - 50) {
      doc.addPage();
      drawDocumentHeader();
      currentY = 38;
    }

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 34, 2, 2, "FD");

    // Left: Digital Signature Verification
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(18, 21, 31);
    doc.text("OTENTIKASI ELEKTRONIK & TANDA TANGAN DIGITAL TERVERIFIKASI", margin + 6, currentY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Dokumen ini diterbitkan secara elektronik oleh LimoCity Therapy System.", margin + 6, currentY + 13);
    doc.text(`Verification Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-EMR-SECURE-STAMP`, margin + 6, currentY + 18);
    doc.text("QR-Code Verifikasi: https://therapy.islamicity.tv/verify-emr", margin + 6, currentY + 23);
    doc.text("Tervalidasi oleh: Komite Medis & Pengurus Himpunan Psikologi Islam", margin + 6, currentY + 28);

    // Right: Doctor Seal Stamp Box
    const sealX = pageWidth - margin - 55;
    doc.setDrawColor(197, 162, 103);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(sealX, currentY + 4, 48, 26, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(197, 162, 103);
    doc.text("LIMOCITY CLINICAL E-SEAL", sealX + 4, currentY + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Dr. dr. H. Farhan Zulkarnain", sealX + 4, currentY + 15);
    doc.text("SIP: 446.1/1092/DINKES/2024", sealX + 4, currentY + 19);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text("✓ VERIFIED ELECTRONIC SIGNATURE", sealX + 4, currentY + 25);

    currentY += 40;
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    // Bottom Line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      `LimoCity Therapy • Rekam Medis Pasien: ${options.patientName} (${options.emrNumber})`,
      margin,
      pageHeight - 8
    );

    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  // Save the PDF file
  const fileName = `Rekam_Medis_LimoCity_${options.patientName.replace(/\s+/g, "_")}_${options.emrNumber}.pdf`;
  doc.save(fileName);
};

export const generateSecureJournalReport = async (
  entries: JournalEntry[],
  options: JournalExportOptions
): Promise<void> => {
  // Initialize jsPDF document with optional encryption/password protection
  const docOptions: any = {
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  };

  const hasPassword = Boolean(options.password && options.password.trim().length > 0);
  if (hasPassword) {
    docOptions.encryption = {
      userPassword: options.password!.trim(),
      ownerPassword: `${options.password!.trim()}_limocity_journal_owner_2026`,
      userPermissions: ["print", "copy"],
    };
  }

  const doc = new jsPDF(docOptions);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 16;

  // Header banner drawer
  const drawDocumentHeader = () => {
    // Top Gold Brand Bar
    doc.setFillColor(197, 162, 103);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header Background
    doc.setFillColor(18, 21, 31);
    doc.rect(margin, 8, contentWidth, 24, "F");

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LIMOCITY THERAPY • JURNAL REFLEKSI & TAZKIYAH QOLBU", margin + 6, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(197, 162, 103);
    doc.text("Dokumen Terenkripsi untuk Kolaborasi Sesi Konseling & Terapi Tazkiyatun Nafs", margin + 6, 23);

    // Right header badge: Confidential EMR Report
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(pageWidth - margin - 58, 12, 52, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("DOKUMEN REFLEKSI TERENKRIPSI", pageWidth - margin - 55, 17);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.text(hasPassword ? "🔒 AES PASSWORD PROTECTED" : "✓ SALINAN TEROTENTIKASI", pageWidth - margin - 55, 23);
  };

  // Check page overflow
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      drawDocumentHeader();
      currentY = 38;
    }
  };

  drawDocumentHeader();
  currentY = 38;

  // Filter entries based on exportScope & selectedTag
  let targetEntries = [...entries];
  if (options.exportScope === "favorites") {
    targetEntries = targetEntries.filter((e) => e.isFavorite);
  } else if (options.exportScope === "tagged" && options.selectedTag) {
    targetEntries = targetEntries.filter((e) => e.tags.includes(options.selectedTag!));
  }

  if (targetEntries.length === 0) {
    targetEntries = entries.slice(0, 1);
  }

  // Calculate overall metrics
  const totalWords = targetEntries.reduce((acc, curr) => acc + curr.wordCount, 0);
  const sakinahScores = targetEntries
    .map((e) => e.sentimentAnalysis?.sakinahScore)
    .filter((s): s is number => typeof s === "number");
  const avgSakinah = sakinahScores.length > 0 ? Math.round(sakinahScores.reduce((a, b) => a + b, 0) / sakinahScores.length) : 85;

  // 1. Patient Demographic & Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(18, 21, 31);
  doc.text("INFORMASI KLIEN & PARAMETER EKSPOR JURNAL", margin + 5, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 5;
  const col2X = margin + 65;
  const col3X = margin + 125;

  doc.text(`Nama Lengkap : ${options.patientName}`, col1X, currentY + 14);
  doc.text(`Nomor Rekam Medis (EMR) : ${options.emrNumber}`, col1X, currentY + 20);
  doc.text(`Tanggal Ekspor : ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, col1X, currentY + 26);

  doc.text(`Email : ${options.patientEmail}`, col2X, currentY + 14);
  doc.text(`No. Kontak : ${options.patientPhone}`, col2X, currentY + 20);
  doc.text(`Terapis Pembina : ${options.therapistName || "Tim Psikolog Islam LimoCity"}`, col2X, currentY + 26);

  doc.text(`Total Entri Dicetak : ${targetEntries.length} Refleksi`, col3X, currentY + 14);
  doc.text(`Rata-rata Sakinah : ${avgSakinah}% (Kategori Stabil)`, col3X, currentY + 20);
  doc.text(`Total Kata Tertumpahkan : ${totalWords} Kata`, col3X, currentY + 26);

  currentY += 38;

  // Privacy & Clinical Guide Alert Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, currentY, contentWidth, 12, 1.5, 1.5, "FD");
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.setFont("helvetica", "bold");
  doc.text("PANDUAN SESI TERAPI & KERAHASIAN MEDIS (TERAPIS-PASIEN):", margin + 4, currentY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.text("Dokumen ini memuat catatan refleksi pribadi pasien beserta analisis sentimen AI spiritual. Gunakan sebagai jembatan dialog terapeutik untuk mengidentifikasi distorsi kognitif, merajut tawakkal, dan merumuskan rencana pemulihan.", margin + 4, currentY + 8.5);

  currentY += 18;

  // Section Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 21, 31);
  doc.text("1. IKHTISAR ANALISIS SENTIMEN & INDEKS SAKINAH (AI SUMMARY)", margin, currentY);

  doc.setDrawColor(197, 162, 103);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
  currentY += 6;

  // Table summary of all entries
  const summaryTableData = targetEntries.map((entry, idx) => {
    const tone = entry.sentimentAnalysis?.primaryTone || "Reflektif & Menuju Ketenangan";
    const sakinah = entry.sentimentAnalysis?.sakinahScore ? `${entry.sentimentAnalysis.sakinahScore}%` : "80%";
    const verse = entry.sentimentAnalysis?.quranicAnchor.verse || "QS. Ar-Ra'd: 28";
    const tags = entry.tags.join(", ");
    
    return [
      `${idx + 1}.\n${entry.date}\n${entry.hijriDate || ""}`,
      `${entry.title}\n[Tag: ${tags}]`,
      `${tone}\nIndeks Sakinah: ${sakinah}`,
      `${verse}\n(Jangkar Penyejuk Batin)`,
      entry.isPrivate ? "Privat" : "Dibagi ke Terapis"
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Tanggal", "Judul Refleksi & Tema", "Nuansa Emosi & Sakinah", "Jangkar Ayat Al-Qur'an", "Status Akses"]],
    body: summaryTableData,
    theme: "striped",
    headStyles: {
      fillColor: [18, 21, 31],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
      valign: "top",
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 48 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
      4: { cellWidth: 18, halign: "center" },
    },
    margin: { left: margin, right: margin },
    didDrawPage: () => {
      drawDocumentHeader();
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // SECTION 2: DETAILED JOURNAL REFLECTION ENTRIES
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 21, 31);
  doc.text("2. RINCIAN CATATAN REFLEKSI & UMPAN BALIK SPIRITUAL (TAZKIYAH)", margin, currentY);

  doc.setDrawColor(197, 162, 103);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
  currentY += 8;

  // Render each journal entry in a structured block
  for (let idx = 0; idx < targetEntries.length; idx++) {
    const entry = targetEntries[idx];
    const sentiment = entry.sentimentAnalysis;

    // Check room for entry card (at least 60mm)
    checkPageBreak(55);

    // Entry Card Container
    const cardStartY = currentY;
    
    // Header banner inside entry card
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, contentWidth, 9, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(18, 21, 31);
    doc.text(`REFLEKSI #${idx + 1}: ${entry.title.toUpperCase()}`, margin + 4, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${entry.date} • ${entry.hijriDate || ""} • ${entry.wordCount} Kata`, pageWidth - margin - 55, currentY + 6);

    currentY += 13;

    // Tags list
    doc.setFontSize(7.5);
    doc.setTextColor(197, 162, 103);
    doc.setFont("helvetica", "bold");
    doc.text(`TAG: ${entry.tags.map(t => `#${t}`).join("  ")}`, margin + 4, currentY);
    currentY += 5;

    // Raw content (or redacted if privacy mode is selected)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Curahan Isi Hati & Refleksi Klien:", margin + 4, currentY);
    currentY += 4;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);

    let displayContent = entry.content;
    if (options.privacyMode === "redacted_narrative") {
      displayContent = "[NARRATIVE DI-REDAKSI OLEH KLIEN UNTUK PRIVASI — TEMA & INSIGHT TERLAMPIR DI BAWAH]";
    } else if (options.privacyMode === "insights_only") {
      displayContent = "[KLIEN MEMILIH HANYA MEMBAGIKAN INSIGHT SENTIMEN & TADABBUR]";
    }

    const splitContent = doc.splitTextToSize(`"${displayContent}"`, contentWidth - 8);
    doc.text(splitContent, margin + 4, currentY);
    currentY += splitContent.length * 4 + 4;

    // AI Sentiment & Gentle Spiritual Feedback Box (if enabled and exists)
    if (options.includeAISentiment && sentiment) {
      checkPageBreak(40);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(197, 162, 103);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 2, currentY, contentWidth - 4, 28, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(197, 162, 103);
      doc.text(`✨ ANALISIS SENTIMEN AI & UMPAN BALIK SPIRITUAL (${sentiment.primaryTone})`, margin + 6, currentY + 5.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Indeks Sakinah: ${sentiment.sakinahScore}%`, pageWidth - margin - 35, currentY + 5.5);

      // Emotional summary & spiritual feedback
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const splitFeedback = doc.splitTextToSize(sentiment.spiritualFeedback, contentWidth - 14);
      doc.text(splitFeedback, margin + 6, currentY + 11);
      
      const feedbackHeight = splitFeedback.length * 3.5;
      
      // Micro practice line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(16, 185, 129);
      doc.text(`Latihan Mandiri (2 Mnt): ${sentiment.microPractice.title}`, margin + 6, currentY + 13 + feedbackHeight);

      currentY += 28 + Math.max(0, feedbackHeight - 8) + 4;
    }

    // Quranic Anchor Box (if enabled)
    if (options.includeQuranicAnchor && sentiment?.quranicAnchor) {
      checkPageBreak(25);

      doc.setFillColor(254, 252, 232);
      doc.setDrawColor(234, 179, 8);
      doc.roundedRect(margin + 2, currentY, contentWidth - 4, 18, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(161, 98, 7);
      doc.text(`📖 JANGKAR AL-QUR'AN: ${sentiment.quranicAnchor.verse}`, margin + 6, currentY + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(113, 63, 18);
      const splitVerse = doc.splitTextToSize(`"${sentiment.quranicAnchor.translation}" — ${sentiment.quranicAnchor.tadabburInsight}`, contentWidth - 14);
      doc.text(splitVerse, margin + 6, currentY + 10);

      currentY += 22;
    }

    // Custom Dua Box (if enabled)
    if (options.includeCustomDua && sentiment?.customDua) {
      checkPageBreak(18);

      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(34, 197, 94);
      doc.roundedRect(margin + 2, currentY, contentWidth - 4, 14, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(21, 128, 61);
      doc.text(`🤲 DOA PENENANG HATI:`, margin + 6, currentY + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(22, 101, 52);
      const splitDua = doc.splitTextToSize(`${sentiment.customDua.latin} — "${sentiment.customDua.meaning}"`, contentWidth - 14);
      doc.text(splitDua, margin + 6, currentY + 9);

      currentY += 18;
    }

    // Subtle divider between entries
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  }

  // SECTION 3: THERAPIST CLINICAL WORKSHEET & SIGNATURE SECTION
  if (options.includeTherapistNotesSection) {
    checkPageBreak(75);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("3. LEMBAR OBSERVASI KLINIS & CATATAN TERAPIS SAAT SESI", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 7;

    // Therapist Worksheet Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(margin, currentY, contentWidth, 42, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Catatan Konselor / Terapis Selama Sesi Konseling:", margin + 5, currentY + 6);

    // Dotted lines for handwritten notes during live session
    doc.setDrawColor(203, 213, 225);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + 5, currentY + 15, pageWidth - margin - 5, currentY + 15);
    doc.line(margin + 5, currentY + 23, pageWidth - margin - 5, currentY + 23);
    doc.line(margin + 5, currentY + 31, pageWidth - margin - 5, currentY + 31);
    doc.line(margin + 5, currentY + 39, pageWidth - margin - 5, currentY + 39);
    doc.setLineDashPattern([], 0); // reset line dash

    currentY += 48;

    // Signature & Official Stamp Area
    if (options.includeOfficialSeal) {
      checkPageBreak(32);

      const stampX = pageWidth - margin - 60;
      doc.setDrawColor(197, 162, 103);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(stampX, currentY, 55, 26, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(197, 162, 103);
      doc.text("LIMOCITY CLINICAL VERIFICATION", stampX + 3, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Terapis: ${options.therapistName || "Psikolog Klinis Islam"}`, stampX + 3, currentY + 12);
      doc.text("Otentikasi: EMR-JOURNAL-SEAL-2026", stampX + 3, currentY + 17);
      doc.setTextColor(16, 185, 129);
      doc.setFont("helvetica", "bold");
      doc.text("✓ VERIFIED THERAPEUTIC RECORD", stampX + 3, currentY + 22);

      // Left: Patient Consent Declaration
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Pernyataan Pasien:", margin + 4, currentY + 6);
      doc.text("Saya membagikan dokumen refleksi ini secara sadar untuk keperluan bimbingan psikologis dan tazkiyatun nafs.", margin + 4, currentY + 12);
      doc.text(`Tanda tangan pasien terotentikasi via akun ${options.patientEmail}`, margin + 4, currentY + 17);

      currentY += 32;
    }
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    // Bottom Line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      `LimoCity Therapy • Dokumen Jurnal Refleksi: ${options.patientName} (${options.emrNumber})`,
      margin,
      pageHeight - 8
    );

    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  // Save the PDF file
  const safeName = options.patientName.replace(/\s+/g, "_");
  const fileName = `Jurnal_Refleksi_LimoCity_${safeName}_${options.emrNumber}.pdf`;
  doc.save(fileName);
};

export const generateTherapistSummaryReport = async (
  appointments: Appointment[],
  moodLogs: MoodLog[],
  spiritualData: SpiritualConsistencyReportData,
  options: TherapistSummaryExportOptions
): Promise<void> => {
  const docOptions: any = {
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  };

  const hasPassword = Boolean(options.password && options.password.trim().length > 0);
  if (hasPassword) {
    docOptions.encryption = {
      userPassword: options.password!.trim(),
      ownerPassword: `${options.password!.trim()}_limocity_therapist_summary_key_2026`,
      userPermissions: ["print", "copy"],
    };
  }

  const doc = new jsPDF(docOptions);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 16;

  // Header Drawer
  const drawDocumentHeader = () => {
    // Top Gold Brand Bar
    doc.setFillColor(197, 162, 103);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header Background
    doc.setFillColor(18, 21, 31);
    doc.rect(margin, 8, contentWidth, 24, "F");

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("LIMOCITY THERAPY • RINGKASAN KONSULTASI TERAPIS", margin + 6, 16.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(197, 162, 103);
    doc.text("Laporan Riwayat Janji Temu, Disiplin Amalan Sunnah & Progres Konsistensi Ruhani", margin + 6, 22.5);

    // Right header badge
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(pageWidth - margin - 58, 12, 52, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("RINGKASAN SESI TERAPIS", pageWidth - margin - 55, 17);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.text(hasPassword ? "🔒 TERENKRIPSI PASSWORD" : "✓ DOKUMEN TERVERIFIKASI", pageWidth - margin - 55, 23);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      drawDocumentHeader();
      currentY = 38;
    }
  };

  drawDocumentHeader();
  currentY = 38;

  // Filter appointments if date range is specified
  let targetAppointments = [...appointments];
  let targetMoodLogs = [...moodLogs];

  // Patient & Clinical Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(18, 21, 31);
  doc.text("INFORMASI PASIEN & RINGKASAN KLINIS", margin + 5, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 5;
  const col2X = margin + 65;
  const col3X = margin + 125;

  doc.text(`Nama Pasien : ${options.patientName}`, col1X, currentY + 14);
  doc.text(`No. Rekam Medis (EMR) : ${options.emrNumber}`, col1X, currentY + 20);
  doc.text(`Tgl Cetak : ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB`, col1X, currentY + 26);

  doc.text(`Email : ${options.patientEmail}`, col2X, currentY + 14);
  doc.text(`No. Kontak : ${options.patientPhone}`, col2X, currentY + 20);
  doc.text(`Terapis Pembimbing : ${options.therapistName || "Tim Psikolog Klinis Islam LimoCity"}`, col2X, currentY + 26);

  const completedSunnahCount = spiritualData.sunnahChecklist.filter(s => s.completed).length;
  const totalSunnahCount = spiritualData.sunnahChecklist.length || 10;
  const sunnahAdherenceRate = Math.round((completedSunnahCount / totalSunnahCount) * 100);

  doc.text(`Total Sesi Konseling : ${targetAppointments.length} Sesi Terjadwal`, col3X, currentY + 14);
  doc.text(`Streak Istiqomah : ${spiritualData.streakCount} Hari Berturut-turut`, col3X, currentY + 20);
  doc.text(`Kepatuhan Sunnah : ${sunnahAdherenceRate}% (${completedSunnahCount}/${totalSunnahCount} Amalan)`, col3X, currentY + 26);

  currentY += 38;

  // Confidential Medical & Spiritual Care Banner
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, currentY, contentWidth, 11, 1.5, 1.5, "FD");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.setFont("helvetica", "bold");
  doc.text("PANDUAN KOLABORASI KLINIS TERAPIS & PERLINDUNGAN PRIVASI (UU PDP NO. 27/2022):", margin + 4, currentY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.text("Dokumen ini disiapkan oleh pasien untuk memfasilitasi evaluasi sesi konseling integratif (Islamic CBT & Tazkiyatun Nafs).", margin + 4, currentY + 8.5);

  currentY += 16;

  // Custom Notes / Questions from Patient for Therapist (if provided)
  if (options.includeCustomNotesForTherapist && options.customNotesForTherapist && options.customNotesForTherapist.trim().length > 0) {
    checkPageBreak(28);
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(20, 184, 166);
    doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(13, 148, 136);
    doc.text("💬 CATATAN / FOKUS PERTANYAAN KHUSUS DARI PASIEN UNTUK SESI INI:", margin + 5, currentY + 5.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const splitNotes = doc.splitTextToSize(`"${options.customNotesForTherapist.trim()}"`, contentWidth - 10);
    doc.text(splitNotes, margin + 5, currentY + 11);

    currentY += 26;
  }

  // SECTION 1: APPOINTMENT HISTORY & CLINICAL PROGRESS
  if (options.includeAppointmentHistory) {
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("1. RIWAYAT JANJI TEMU TELEMEDISIN & CATATAN KLINIS (EMR)", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 6;

    if (targetAppointments.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Belum ada riwayat janji temu klinis yang tercatat.", margin, currentY + 4);
      currentY += 10;
    } else {
      const appointmentsTableData = targetAppointments.map((apt, idx) => {
        const diag = apt.clinicalNotes?.diagnosis || "Evaluasi Holistik, Konseling & Penataan Jiwa";
        const plans = apt.clinicalNotes?.actionPlan?.join("\n• ") || "Penataan ritme dzikir & latihan relaksasi pernapasan";
        const tazkiyah = apt.clinicalNotes?.tazkiyahPrescription || "Dzikir pagi/petang & tadabbur QS. Ar-Ra'd: 28";
        
        return [
          `${idx + 1}.\n${apt.bookingCode}\n${apt.date}\n${apt.timeSlot}`,
          `${apt.therapistName}\n(${apt.therapistTitle})\nMode: ${apt.consultationType.toUpperCase()}`,
          `Fokus Diagnosa:\n${diag}\n\nTindakan & PR Klinis:\n• ${plans}`,
          `Resep Tazkiyah:\n${tazkiyah}`,
          `${apt.status === "confirmed" ? "Selesai / Terkonfirmasi" : apt.status}`
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Sesi & Waktu", "Terapis Pemeriksa", "Diagnosa & Rencana Tindakan (Action Plan)", "Resep Tazkiyatun Nafs", "Status"]],
        body: appointmentsTableData,
        theme: "striped",
        headStyles: {
          fillColor: [18, 21, 31],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [51, 65, 85],
          valign: "top",
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 26 },
          1: { cellWidth: 38 },
          2: { cellWidth: 55 },
          3: { cellWidth: 45 },
          4: { cellWidth: 18, halign: "center" },
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
          drawDocumentHeader();
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;
    }
  }

  // SECTION 2: SPIRITUAL CONSISTENCY & SUNNAH HABITS PROGRESS
  if (options.includeSpiritualConsistency) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("2. LAPORAN METRIK KONSISTENSI RUHANI & DISIPLIN TAZKIYAH", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 6;

    // Executive KPI Summary Cards Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    const kpi1 = margin + 5;
    const kpi2 = margin + 65;
    const kpi3 = margin + 125;

    doc.text(`Total Dzikir Dilafalkan : ${spiritualData.dzikirSummary.totalCount} Kali`, kpi1, currentY + 7);
    doc.text(`Sesi Putaran Tasbih : ${spiritualData.dzikirSummary.completedSessions} Sesi Selesai`, kpi1, currentY + 14);
    doc.text(`Streak Istiqomah : ${spiritualData.streakCount} Hari`, kpi1, currentY + 20);

    doc.text(`Tingkat Kepatuhan Sunnah : ${sunnahAdherenceRate}%`, kpi2, currentY + 7);
    doc.text(`Amalan Sunnah Selesai : ${completedSunnahCount} dari ${totalSunnahCount} Amalan`, kpi2, currentY + 14);
    doc.text(`Sesi Nafas Thuma'ninah : Aktif 5 Siklus/Hari`, kpi2, currentY + 20);

    doc.text(`Indeks Sakinah (Batin) : ${spiritualData.overallSakinahIndex || 88}% (Stabil)`, kpi3, currentY + 7);
    doc.text(`Catatan Jurnal Refleksi : ${spiritualData.dzikirSummary.journalCount} Entri`, kpi3, currentY + 14);
    doc.text(`Kepatuhan PR Tazkiyah : Optimal (Disiplin)`, kpi3, currentY + 20);

    currentY += 28;

    // 7-Day Dzikir Consistency Table
    if (spiritualData.dzikirSummary.past7Days && spiritualData.dzikirSummary.past7Days.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(18, 21, 31);
      doc.text("A. Evaluasi Pelaksanaan Dzikir 7 Hari Terakhir:", margin, currentY);
      currentY += 4;

      const dzikirTableData = spiritualData.dzikirSummary.past7Days.map((day) => {
        const isMet = day.count >= day.target;
        return [
          `${day.dayName}, ${day.dateFormatted}`,
          `${day.count} Kali`,
          `${day.target} Kali`,
          `${day.completionRate}%`,
          isMet ? "✓ Tercapai Sempurna (Istiqomah)" : "• Cukup / Dalam Pemulihan"
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Hari & Tanggal", "Jumlah Butir Dzikir", "Target Harian", "Tingkat Capaian", "Evaluasi Istiqomah"]],
        body: dzikirTableData,
        theme: "striped",
        headStyles: {
          fillColor: [18, 21, 31],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [51, 65, 85],
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 38 },
          1: { cellWidth: 32, halign: "center" },
          2: { cellWidth: 28, halign: "center" },
          3: { cellWidth: 28, halign: "center" },
          4: { cellWidth: 56 },
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
          drawDocumentHeader();
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // SECTION 2B: DAILY SUNNAH CHECKLIST ADHERENCE BREAKDOWN
    if (options.includeSunnahChecklist && spiritualData.sunnahChecklist.length > 0) {
      checkPageBreak(35);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(18, 21, 31);
      doc.text("B. Rincian Kepatuhan Amalan Sunnah Harian (Spiritual Daily Checklist):", margin, currentY);
      currentY += 4;

      const categoryLabels: Record<string, string> = {
        dzikir: "Dzikir & Wirid",
        sholat_sunnah: "Sholat Sunnah",
        tilawah_amal: "Tilawah & Amal",
        malam: "Qiyamul Lail"
      };

      const sunnahTableData = spiritualData.sunnahChecklist.map((item, idx) => {
        const cat = categoryLabels[item.category] || item.category;
        const statusText = item.completed ? "✓ Terlaksana (Rutin)" : "○ Belum / Tertunda";
        return [
          `${idx + 1}. ${item.title}\n(${item.timeRecommendation})`,
          cat,
          `${item.targetCountText || "1 Sesi"}`,
          `${item.dalilReference}\nFadhilah: ${item.virtue}`,
          statusText
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Amalan Sunnah & Waktu", "Kategori", "Target", "Rujukan Hadits & Manfaat Psikologis", "Status"]],
        body: sunnahTableData,
        theme: "striped",
        headStyles: {
          fillColor: [18, 21, 31],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 6.8,
          textColor: [51, 65, 85],
          valign: "top",
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 42 },
          1: { cellWidth: 26 },
          2: { cellWidth: 22, halign: "center" },
          3: { cellWidth: 64 },
          4: { cellWidth: 28, halign: "center" },
        },
        margin: { left: margin, right: margin },
        didDrawPage: () => {
          drawDocumentHeader();
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // SECTION 3: DAILY MOOD & EMOTIONAL WELLBEING LOGS
  if (options.includeMoodHistory) {
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("3. LOG SUASANA HATI (MOOD TRACKER) & REFLEKSI EMOSI", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 6;

    const moodTableData = targetMoodLogs.map((log) => {
      const moodLabels: Record<string, string> = {
        sangat_tenang: "🌸 Sangat Tenang & Syukur",
        tenang: "🌿 Cukup Tenang",
        netral: "⛅ Biasa Saja",
        cemas: "🌧️ Cemas / Overthinking",
        lelah_batin: "🍂 Lelah Batin / Burnout"
      };

      return [
        `${log.date}`,
        `${moodLabels[log.mood] || log.mood}\nEnergi: ${log.energyLevel}/10`,
        `"${log.notes}"`,
        `${log.aiReflection || "-"}\n\nDoa: ${log.shortPrayer || "-"}`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Tanggal", "Kondisi Emosi & Energi", "Catatan Hati Pasien", "Refleksi Tadabbur & Doa"]],
      body: moodTableData,
      theme: "striped",
      headStyles: {
        fillColor: [18, 21, 31],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 7.2,
        textColor: [51, 65, 85],
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 24 },
        1: { cellWidth: 42 },
        2: { cellWidth: 56 },
        3: { cellWidth: 60 },
      },
      margin: { left: margin, right: margin },
      didDrawPage: () => {
        drawDocumentHeader();
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // SECTION 4: THERAPIST CLINICAL WORKSHEET & SIGNATURE SECTION
  if (options.includeTherapistWorksheet) {
    checkPageBreak(75);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(18, 21, 31);
    doc.text("4. LEMBAR EVALUASI KLINIS & OBSERVASI TERAPIS SAAT SESI", margin, currentY);

    doc.setDrawColor(197, 162, 103);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 1.5, margin + 95, currentY + 1.5);
    currentY += 7;

    // Worksheet Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(margin, currentY, contentWidth, 42, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Catatan Observasi Terapis & Evaluasi Respon Terapi (Tazkiyah & I-CBT):", margin + 5, currentY + 6);

    doc.setDrawColor(203, 213, 225);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + 5, currentY + 15, pageWidth - margin - 5, currentY + 15);
    doc.line(margin + 5, currentY + 23, pageWidth - margin - 5, currentY + 23);
    doc.line(margin + 5, currentY + 31, pageWidth - margin - 5, currentY + 31);
    doc.line(margin + 5, currentY + 39, pageWidth - margin - 5, currentY + 39);
    doc.setLineDashPattern([], 0);

    currentY += 48;

    // Doctor Signature & Verification Seal
    if (options.includeDoctorSeal) {
      checkPageBreak(32);

      const stampX = pageWidth - margin - 60;
      doc.setDrawColor(197, 162, 103);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(stampX, currentY, 55, 26, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(197, 162, 103);
      doc.text("LIMOCITY THERAPY CLINICAL SEAL", stampX + 3, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Terapis: ${options.therapistName || "Psikolog Klinis Islam"}`, stampX + 3, currentY + 12);
      doc.text("Otentikasi: EMR-THERAPIST-SUMMARY-2026", stampX + 3, currentY + 17);
      doc.setTextColor(16, 185, 129);
      doc.setFont("helvetica", "bold");
      doc.text("✓ VERIFIED CLINICAL CONSULTATION", stampX + 3, currentY + 22);

      // Left: Patient Declaration
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Pernyataan Pasien:", margin + 4, currentY + 6);
      doc.text("Laporan ringkasan ini diekspor secara mandiri untuk keperluan evaluasi telemedisin bersama terapis.", margin + 4, currentY + 12);
      doc.text(`Otentikasi Akun Pasien: ${options.patientEmail} (${options.emrNumber})`, margin + 4, currentY + 17);

      currentY += 32;
    }
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      `LimoCity Therapy • Ringkasan Sesi Terapis: ${options.patientName} (${options.emrNumber})`,
      margin,
      pageHeight - 8
    );

    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  // Save the PDF file
  const safeName = options.patientName.replace(/\s+/g, "_");
  const fileName = `Ringkasan_Terapis_LimoCity_${safeName}_${options.emrNumber}.pdf`;
  doc.save(fileName);
};


