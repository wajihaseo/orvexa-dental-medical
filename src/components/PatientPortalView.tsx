import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  Search,
  MessageSquare,
  AlertCircle,
  Pill,
  Activity
} from 'lucide-react';
import { ConsultationRecord } from '../types';

interface PatientPortalViewProps {
  consultations: ConsultationRecord[];
  onOpenChatWithDoctor: (doctorName: string) => void;
  onBookFollowUp: (serviceName?: string) => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  consultations,
  onOpenChatWithDoctor,
  onBookFollowUp
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(consultations[0]?.id || '');

  const filteredRecords = consultations.filter(c =>
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRecord = consultations.find(c => c.id === selectedRecordId) || consultations[0];

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen" id="patient-portal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Encrypted Digital Patient Records</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Consultation History & Treatment Roadmap
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Access your clinical diagnoses, 3D CBCT radiograph summaries, multi-stage implant progression, prescriptions, and official clinic receipts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Records List */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Clinical Visits & Summaries ({filteredRecords.length})
            </h3>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No consultation history found matching your query.
              </div>
            ) : (
              filteredRecords.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecordId(rec.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    selectedRecord?.id === rec.id
                      ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rec.patientName}</span>
                    <span className="text-slate-400 font-mono">{rec.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-teal-800 line-clamp-1">
                    {rec.primaryDiagnosis}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{rec.doctorName}</span>
                    <span className="font-bold text-slate-800">${rec.invoiceAmount} ({rec.invoiceStatus})</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Detailed Clinical Chart */}
          {selectedRecord ? (
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Header of Report */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-xl text-slate-900">
                      Medical Consultation Record
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Verified Clinical Summary
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Patient: <strong>{selectedRecord.patientName}</strong> • Attending: <strong>{selectedRecord.doctorName}</strong> ({selectedRecord.specialty})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintRecord}
                    className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    title="Print or Export PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Chart</span>
                  </button>
                  <button
                    onClick={() => onOpenChatWithDoctor(selectedRecord.doctorName)}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat With Doctor</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis & X-ray Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Primary Clinical Diagnosis
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {selectedRecord.primaryDiagnosis}
                  </p>
                  <p className="text-xs text-slate-600 pt-1">
                    {selectedRecord.doctorNotes}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Digital Imaging & Radiograph Report
                  </span>
                  <p className="text-xs font-bold text-teal-800">
                    {selectedRecord.xrayType}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedRecord.xraySummary}
                  </p>
                </div>
              </div>

              {/* Multi-Step Treatment Roadmap */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Treatment Plan Progression ({selectedRecord.treatmentPlan.length} Stages)
                </h4>
                <div className="space-y-2">
                  {selectedRecord.treatmentPlan.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-xl border border-slate-200 flex items-start gap-3 bg-white"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        step.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : step.status === 'in_progress'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {step.status === 'completed' ? '✓' : step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-slate-900">{step.title}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            step.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : step.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {step.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptions */}
              {selectedRecord.prescriptions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Prescribed Medications & Post-Op Protocol</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRecord.prescriptions.map((rx, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">{rx.drug}</span>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>{rx.dosage} • {rx.frequency}</span>
                          <span className="font-medium text-teal-800">{rx.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up & Financials Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Scheduled Follow-Up Examination:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRecord.followUpDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Invoice Total</span>
                    <span className="font-heading font-bold text-base text-slate-900">
                      ${selectedRecord.invoiceAmount.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onBookFollowUp(selectedRecord.primaryDiagnosis)}
                    className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold"
                  >
                    Schedule Next Visit &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 bg-white rounded-2xl p-12 text-center text-slate-400">
              No consultation selected.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
