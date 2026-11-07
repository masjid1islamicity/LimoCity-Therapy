import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DzikirDayRecord } from "./dzikirHistory";

export interface DzikirPDFExportOptions {
  userName?: string;
  userEmail?: string;
  evaluationPeriod?: string;
  includeTable?: boolean;
  includeReflections?: boolean;
  includeRecommendations?: boolean;
}

interface StoredReflection {
  id?: string;
  date?: string;
  timestamp?: string;
  moodTag?: string;
  dzikirTitle?: string;
  dzikirCount?: number;
  note?: string;
  gratitudeNote?: string;
}

export const generateDzikirProgressPDF = async (
  records: DzikirDayRecord[],
  options: DzikirPDFExportOptions = {}
): Promise<void> => {
  const {
    userName = "Ahmad Rizky Pratama",
    userEmail = "ahmad.rizky@example.com",
    evaluationPeriod = "7 Hari Terakhir",
    includeTable = true,
    includeReflections = true,
    includeRecommendations = true,
  } = options;

  // Initialize jsPDF document in A4 portrait
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Color Palette
  const goldPrimary = [197, 162, 103]; // #C5A267
  const darkNavy = [18, 21, 31];       // #12151F
  const darkSurface = [24, 28, 38];    // #181C26
  const slateText = [100, 116, 139];   // #64748B
  const textDark = [30, 41, 59];       // #1E293B

  // Helper: Draw Header on the document
  const drawHeader = () => {
    // Top Gold Bar
    doc.setFillColor(197, 162, 103);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header Dark Background Box
    doc.setFillColor(18, 21, 31);
    doc.roundedRect(margin, 8, pageWidth - margin * 2, 25, 2, 2, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LIMOCITY THERAPY • EVALUASI DIRI DZIKIR HARIAN", margin + 6, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(197, 162, 103);
    doc.text("Laporan Visual Kemajuan Tazkiyatun Nafs & Ketenangan Jiwa (therapy.islamicity.tv)", margin + 6, 23);

    // Right Badge
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(pageWidth - margin - 52, 12, 46, 17, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN EVALUASI", pageWidth - margin - 49, 17);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(6.5);
    doc.text("✓ DOKUMEN PRIBADI", pageWidth - margin - 49, 23);
  };

  drawHeader();
  currentY = 38;

  // 1. User & Report Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 25, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(18, 21, 31);
  doc.text("INFORMASI EVALUASI DIRI PENGGUNA", margin + 5, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const timeFormatted = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  // Left col
  doc.text(`Nama Pengguna    : ${userName}`, margin + 5, currentY + 12);
  doc.text(`Email / Akun        : ${userEmail}`, margin + 5, currentY + 17);
  doc.text(`Periode Evaluasi  : ${evaluationPeriod}`, margin + 5, currentY + 22);

  // Right col
  const docId = `DZIKIR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
  doc.text(`Tanggal Cetak  : ${dateFormatted}, ${timeFormatted}`, pageWidth / 2 + 5, currentY + 12);
  doc.text(`Nomor Dokumen : ${docId}`, pageWidth / 2 + 5, currentY + 17);
  doc.text(`Target Acuan   : 100x Dzikir / Hari (Standar Tazkiyah)`, pageWidth / 2 + 5, currentY + 22);

  currentY += 30;

  // Compute Metrics
  const total7DaysCount = records.reduce((acc, curr) => acc + curr.count, 0);
  const averageDailyCount = records.length > 0 ? Math.round(total7DaysCount / records.length) : 0;
  let peakDay: DzikirDayRecord | null = null;
  records.forEach((curr) => {
    if (!peakDay || curr.count > peakDay.count) {
      peakDay = curr;
    }
  });
  const daysTargetMet = records.filter((d) => d.count >= d.target).length;
  const targetCompliancePercent = records.length > 0 ? Math.round((daysTargetMet / records.length) * 100) : 0;

  // 2. High-Level KPI Summary Grid (4 visual boxes)
  const boxWidth = (pageWidth - margin * 2 - 9) / 4;
  const boxHeight = 22;

  // Box 1: Total Dzikir
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL DZIKIR", margin + 4, currentY + 5);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(197, 162, 103);
  doc.text(`${total7DaysCount.toLocaleString("id-ID")}`, margin + 4, currentY + 13);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Akumulasi 7 Hari", margin + 4, currentY + 18);

  // Box 2: Rata-Rata Harian
  const b2X = margin + boxWidth + 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(b2X, currentY, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("RATA-RATA HARIAN", b2X + 4, currentY + 5);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(2, 132, 199);
  doc.text(`${averageDailyCount}x`, b2X + 4, currentY + 13);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Target: ≥100x / hari", b2X + 4, currentY + 18);

  // Box 3: Puncak Tertinggi
  const b3X = margin + (boxWidth + 3) * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(b3X, currentY, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("PUNCAK TERTINGGI", b3X + 4, currentY + 5);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(217, 119, 6);
  doc.text(`${peakDay ? peakDay.count : 0}x`, b3X + 4, currentY + 13);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(peakDay ? `Hari ${peakDay.dayName}` : "-", b3X + 4, currentY + 18);

  // Box 4: Capaian Target
  const b4X = margin + (boxWidth + 3) * 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(b4X, currentY, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("CAPAIAN TARGET", b4X + 4, currentY + 5);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`${targetCompliancePercent}%`, b4X + 4, currentY + 13);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`${daysTargetMet} dari 7 hari tercapai`, b4X + 4, currentY + 18);

  currentY += boxHeight + 7;

  // 3. Visual 7-Day Performance Table
  if (includeTable) {
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 21, 31);
    doc.text("TABEL RINCIAN CAPAIAN DZIKIR HARIAN", margin, currentY);

    const tableRows = records.map((rec, idx) => {
      const isMet = rec.count >= rec.target;
      const rate = rec.completionRate;
      
      // Visual ASCII progress indicator
      const filledBars = Math.min(10, Math.round(rate / 10));
      const visualBar = "█".repeat(filledBars) + "░".repeat(Math.max(0, 10 - filledBars));

      return [
        (idx + 1).toString(),
        `${rec.dayName}, ${rec.dateFormatted}${rec.isToday ? " (Hari Ini)" : ""}`,
        `${rec.count.toLocaleString("id-ID")} kali`,
        `${rec.target} kali`,
        `${rate}%`,
        visualBar,
        isMet ? "✓ TERCAPAI" : `Kurang ${rec.target - rec.count}x`
      ];
    });

    autoTable(doc, {
      startY: currentY + 3,
      head: [["No", "Hari & Tanggal", "Jumlah Dzikir", "Target", "Rasio", "Grafis Progres", "Status Evaluasi"]],
      body: tableRows,
      margin: { left: margin, right: margin },
      theme: "striped",
      styles: {
        fontSize: 7.5,
        cellPadding: 2.5,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [18, 21, 31],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 42, fontStyle: "bold" },
        2: { cellWidth: 26, halign: "right", fontStyle: "bold" },
        3: { cellWidth: 20, halign: "right" },
        4: { cellWidth: 18, halign: "center" },
        5: { cellWidth: 32, fontStyle: "bold", halign: "center" },
        6: { cellWidth: 36, fontStyle: "bold" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 6) {
          const text = String(data.cell.raw);
          if (text.includes("TERCAPAI")) {
            data.cell.styles.textColor = [16, 185, 129];
          } else {
            data.cell.styles.textColor = [217, 119, 6];
          }
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // 4. Latest Reflection Notes from Local Storage (Muhasabah Kalbu)
  if (includeReflections) {
    let reflections: StoredReflection[] = [];
    try {
      const stored = localStorage.getItem("limocity_patient_reflection_journal") ||
                     localStorage.getItem("limocity_tazkiyah_journal");
      if (stored) {
        reflections = JSON.parse(stored);
      }
    } catch (e) {}

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 21, 31);
    doc.text("CATATAN REFLEKSI & MUHASABAH PASCA DZIKIR TERAKHIR", margin, currentY);
    currentY += 4;

    if (reflections && reflections.length > 0) {
      const latestEntries = reflections.slice(0, 2);

      latestEntries.forEach((entry) => {
        // Check page overflow
        if (currentY > pageHeight - 45) {
          doc.addPage();
          drawHeader();
          currentY = 40;
        }

        const moodLabel = entry.moodTag ? entry.moodTag.toUpperCase() : "TENTERAM";
        const dzikirText = entry.dzikirTitle ? `${entry.dzikirTitle} (${entry.dzikirCount || 33}x)` : "Dzikir Harian";

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 2, 2, "FD");

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(197, 162, 103);
        doc.text(`[${entry.date || "Catatan Harian"}] ${dzikirText} • KONDISI HATI: ${moodLabel}`, margin + 4, currentY + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);

        const splitNote = doc.splitTextToSize(`"${entry.note || "Hati terasa lebih lapang dan tenang setelah berdzikir."}"`, pageWidth - margin * 2 - 8);
        doc.text(splitNote.slice(0, 2), margin + 4, currentY + 10);

        if (entry.gratitudeNote) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(7);
          doc.setTextColor(13, 148, 136);
          doc.text(`Syukur: ${entry.gratitudeNote}`, margin + 4, currentY + 18);
        }

        currentY += 25;
      });
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Belum ada catatan refleksi yang tersimpan di jurnal harian.", margin, currentY + 3);
      currentY += 10;
    }
  }

  // 5. Clinical & Spiritual Self-Evaluation Recommendations
  if (includeRecommendations) {
    if (currentY > pageHeight - 55) {
      doc.addPage();
      drawHeader();
      currentY = 40;
    }

    doc.setFillColor(254, 252, 246);
    doc.setDrawColor(197, 162, 103);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 34, 2, 2, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 162, 103);
    doc.text("PANDUAN EVALUASI DIRI (TAZKIYATUN NAFS & MINDFULNESS ISLAMI)", margin + 5, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    const r1 = "1. Kualitas di Atas Kuantitas: Pastikan thuma'ninah (keheningan hati) dan perenungan makna (tadabbur) menyertai setiap lantunan dzikir.";
    const r2 = "2. Jadikan Pagi & Petang Sebagai Perisai: Rutinitas 100x dzikir terbaik dilakukan usai fajar dan menjelang maghrib untuk membentengi batin.";
    const r3 = "3. Sambungkan dengan Pernafasan 4-4-6: Saat cemas datang, lakukan nafas teratur sambil melantunkan istighfar untuk menenangkan saraf vagus.";
    const r4 = "4. Istiqomah: Jangan berkecil hati jika ada hari yang belum memenuhi kuota. Lanjutkan dengan niat tulus dan lapang dada.";

    doc.text(r1, margin + 5, currentY + 12);
    doc.text(r2, margin + 5, currentY + 17);
    doc.text(r3, margin + 5, currentY + 22);
    doc.text(r4, margin + 5, currentY + 27);

    currentY += 40;
  }

  // 6. Hadith Quote Footer Box
  if (currentY > pageHeight - 35) {
    doc.addPage();
    drawHeader();
    currentY = 40;
  }

  doc.setFillColor(18, 21, 31);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 2, 2, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(197, 162, 103);
  doc.text("KEUTAMAAN AMALAN YANG BERKELANJUTAN (HR. MUSLIM NO. 783)", margin + 5, currentY + 6);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('"Amalan yang paling dicintai oleh Allah adalah amalan yang berkelanjutan (istiqomah), walaupun jumlahnya sedikit."', margin + 5, currentY + 11);

  // Bottom Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);

    doc.text(
      `Laporan Evaluasi Diri Dzikir • LimoCity Therapy Telemedicine (therapy.islamicity.tv) • Halaman ${i} dari ${totalPages}`,
      margin,
      pageHeight - 6
    );

    doc.text(
      `ID Validasi: ${docId}`,
      pageWidth - margin - 35,
      pageHeight - 6
    );
  }

  // Save the PDF
  const filename = `Laporan_Evaluasi_Dzikir_${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
