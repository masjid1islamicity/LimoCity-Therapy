import React, { useState } from "react";
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Search,
  Lock,
  Save,
  MessageSquare
} from "lucide-react";
import { Appointment } from "../types";

interface TherapistPortalProps {
  appointments: Appointment[];
  onEnterTelemedicineRoom: (appointment: Appointment) => void;
  onUpdateAppointmentNotes: (appointmentId: string, notes: any) => void;
}

export const TherapistPortal: React.FC<TherapistPortalProps> = ({
  appointments,
  onEnterTelemedicineRoom,
  onUpdateAppointmentNotes,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    appointments[0] || null
  );

  // EMR Note Editor form
  const [diagnosisText, setDiagnosisText] = useState<string>(
    selectedAppointment?.clinicalNotes?.diagnosis || "Generalized Anxiety Disorder (F41.1) dengan respon somatisasi ringan"
  );
  const [actionPlanInput, setActionPlanInput] = useState<string>(
    selectedAppointment?.clinicalNotes?.actionPlan?.join("\n") || 
    "- Latihan relaksasi otot progresif & pernapasan 4-7-8\n- Restrukturisasi pikiran otomatis negatif dengan I-CBT record\n- Dzikir pagi dan petang sebagai jangkar spiritual"
  );
  const [tazkiyahPrescription, setTazkiyahPrescription] = useState<string>(
    selectedAppointment?.clinicalNotes?.tazkiyahPrescription || "Tadabbur QS. Al-Baqarah: 286 dan amalan shalat sunnah taubat sebelum tidur"
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const actionArray = actionPlanInput.split("\n").map(s => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean);

    const updatedNotes = {
      diagnosis: diagnosisText,
      actionPlan: actionArray,
      tazkiyahPrescription,
    };

    onUpdateAppointmentNotes(selectedAppointment.id, updatedNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#E2E8F0]">
      
      {/* Therapist Header */}
      <div className="bg-gradient-to-r from-[#141720] via-[#1A1E2B] to-[#12141C] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#C5A267]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#181C26] border-2 border-[#C5A267]/60 flex items-center justify-center text-[#C5A267] shrink-0">
            <Stethoscope className="w-8 h-8 text-[#C5A267]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Panel Klinis Tenaga Medis
              </span>
              <span className="text-xs text-[#C5A267] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A267] animate-pulse"></span>
                Status: Online Siap Melayani
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-white">
              Portal Praktisi Psikolog Klinis & Psikiater
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Kelola antrean telemedisin, input rekam medis digital (EMR), dan buat resep self-care I-CBT untuk pasien.
            </p>
          </div>
        </div>

        <div className="text-right bg-[#0E1015] px-4 py-2.5 rounded-2xl border border-[#252E3E]">
          <span className="text-xs text-[#64748B] block font-medium">Antrean Pasien Hari Ini:</span>
          <span className="text-xl font-bold text-[#C5A267] font-serif">{appointments.length} Pasien</span>
        </div>
      </div>

      {/* Main Split: Patient Queue + EMR Note Writer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Patient Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C5A267]" />
              <span>Daftar Antrean Konseling</span>
            </h3>
            <span className="text-xs text-[#94A3B8] font-semibold">{appointments.length} Sesi Terjadwal</span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const isSelected = selectedAppointment?.id === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setDiagnosisText(apt.clinicalNotes?.diagnosis || "Evaluasi Awal Kecemasan & Penyelarasan Kognitif");
                    setActionPlanInput(apt.clinicalNotes?.actionPlan?.join("\n") || "- Latihan pernapasan 4-7-8\n- Catatan evaluasi distorsi kognitif");
                    setTazkiyahPrescription(apt.clinicalNotes?.tazkiyahPrescription || "Tadabbur QS. Ar-Ra'd: 28");
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all bg-[#111318] ${
                    isSelected
                      ? "border-[#C5A267] ring-2 ring-[#C5A267]/20 bg-[#181C26] shadow-md"
                      : "border-[#1F2937] hover:border-[#374151]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#C5A267] bg-[#141720] px-2 py-0.5 rounded border border-[#252E3E]">
                        {apt.bookingCode}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{apt.patientName}</h4>
                      <p className="text-xs text-[#94A3B8]">{apt.patientEmail} • {apt.patientPhone}</p>
                    </div>

                    <span className="px-2 py-0.5 bg-[#C5A267]/15 text-[#C5A267] border border-[#C5A267]/30 text-[10px] font-bold rounded-full uppercase">
                      {apt.consultationType}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-center justify-between text-xs">
                    <div className="text-[#94A3B8] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A267]" />
                      <span>{apt.date} • {apt.timeSlot}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterTelemedicineRoom(apt);
                      }}
                      className="px-3 py-1 bg-[#C5A267] hover:bg-[#D8B57B] text-black rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-black" />
                      <span>Mulai Video</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Clinical Note & EMR Writer */}
        <div className="lg:col-span-7">
          {selectedAppointment ? (
            <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-6 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                <div>
                  <span className="text-xs text-[#C5A267] font-bold uppercase tracking-wider">
                    Lembar Rekam Medis Psikologis (EMR)
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Pasien: {selectedAppointment.patientName} ({selectedAppointment.bookingCode})
                  </h3>
                </div>

                <button
                  onClick={() => onEnterTelemedicineRoom(selectedAppointment)}
                  className="bg-[#C5A267] hover:bg-[#D8B57B] text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-[#C5A267]/20"
                >
                  <Video className="w-4 h-4 text-black" />
                  <span>Buka Video Sesi</span>
                </button>
              </div>

              {/* Patient Concern Context */}
              <div className="p-3.5 bg-[#141720] rounded-2xl border border-[#252E3E] text-xs space-y-1">
                <span className="font-bold text-[#E2E8F0]">Keluhan Pasien saat Booking:</span>
                <p className="text-[#94A3B8]">
                  {selectedAppointment.notesFromPatient || "Tidak ada catatan awal tambahan."}
                </p>
                <div className="text-[#C5A267] font-semibold pt-1">
                  Fokus: {selectedAppointment.consultationFocus}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSaveNotes} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Diagnosa Kerja Klinis / Formulasi Kasus:
                  </label>
                  <input
                    type="text"
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    placeholder="Contoh: Generalized Anxiety Tendency dengan insomnia sekunder"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Rencana Tindak Lanjut & Latihan I-CBT Mandiri (1 per baris):
                  </label>
                  <textarea
                    rows={4}
                    value={actionPlanInput}
                    onChange={(e) => setActionPlanInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs font-mono text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    placeholder="- Latihan pernapasan 4-7-8\n- Jurnal restrukturisasi kognitif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Resep Spiritual Tazkiyatun Nafs (Tadabbur Ayat / Dzikir Penenang):
                  </label>
                  <input
                    type="text"
                    value={tazkiyahPrescription}
                    onChange={(e) => setTazkiyahPrescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0E1015] border border-[#252E3E] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#C5A267]"
                    placeholder="Contoh: Tadabbur QS. Ar-Ra'd: 28 dan zikir Hasbunallah"
                  />
                </div>

                <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between">
                  {isSaved ? (
                    <span className="text-xs font-bold text-[#C5A267] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A267]" />
                      Catatan EMR Berhasil Disimpan & Tersinkron ke Pasien!
                    </span>
                  ) : (
                    <span className="text-xs text-[#64748B]">
                      Catatan otomatis tersinkron ke Portal Pasien.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="bg-[#C5A267] hover:bg-[#D8B57B] text-black font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#C5A267]/20 transition-colors"
                  >
                    <Save className="w-4 h-4 text-black" />
                    <span>Simpan Rekam Medis</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="bg-[#111318] rounded-3xl border border-[#1F2937] p-8 text-center text-[#64748B]">
              Pilih salah satu pasien dari antrean untuk membuka rekam medis.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
