import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Plus,
  Send,
  Save,
  Activity,
  Edit,
  Sparkles,
  Phone,
  Mail,
  Filter
} from 'lucide-react';
import { Doctor, Appointment, AppointmentStatus, ConsultationRecord } from '../types';
import { api } from '../services/api';

interface DoctorDashboardProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onRefreshData: () => void;
  onOpenChatWithPatient: (patientName: string, doctorId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctors,
  appointments,
  onRefreshData,
  onOpenChatWithPatient
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-1');
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments' | 'notes'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Selected doctor
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Schedule edit states
  const [availableDays, setAvailableDays] = useState<string[]>(activeDoctor?.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startHour, setStartHour] = useState<string>(activeDoctor?.availableHours.start || '08:30 AM');
  const [endHour, setEndHour] = useState<string>(activeDoctor?.availableHours.end || '05:30 PM');
  const [slotDuration, setSlotDuration] = useState<number>(activeDoctor?.slotDurationMinutes || 45);
  const [consultFee, setConsultFee] = useState<number>(activeDoctor?.consultationFee || 150);
  const [isAccepting, setIsAccepting] = useState<boolean>(activeDoctor?.isAcceptingPatients ?? true);

  // Clinical note modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [targetAppointment, setTargetAppointment] = useState<Appointment | null>(null);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [prescriptionDrug, setPrescriptionDrug] = useState<string>('Amoxicillin 500mg (1 cap every 8h)');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(2450);

  // Sync state when doctor switch occurs
  const handleSwitchDoctor = (docId: string) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      setAvailableDays(doc.availableDays);
      setStartHour(doc.availableHours.start);
      setEndHour(doc.availableHours.end);
      setSlotDuration(doc.slotDurationMinutes);
      setConsultFee(doc.consultationFee);
      setIsAccepting(doc.isAcceptingPatients);
    }
  };

  const handleToggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSaveAvailability = async () => {
    setSaveSuccessMsg('');
    const res = await api.updateDoctorAvailability(selectedDoctorId, {
      availableDays,
      availableHours: { start: startHour, end: endHour },
      slotDurationMinutes: Number(slotDuration),
      consultationFee: Number(consultFee),
      isAcceptingPatients: isAccepting
    });

    if (res.success) {
      setSaveSuccessMsg('Doctor schedule & availability saved successfully!');
      onRefreshData();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    await api.updateAppointmentStatus(appointmentId, { status });
    onRefreshData();
  };

  const handleOpenConsultationModal = (apt: Appointment) => {
    setTargetAppointment(apt);
    setPrimaryDiagnosis(`Examination for ${apt.serviceCategory}. Surgical clearance approved.`);
    setClinicalNotes(apt.clinicalNotes || 'Patient presented with stable vital signs. Pre-op surgical plan confirmed.');
    setIsNoteModalOpen(true);
  };

  const handleSaveConsultation = async () => {
    if (!targetAppointment) return;

    await api.recordConsultation({
      patientName: targetAppointment.patientName,
      patientEmail: targetAppointment.patientEmail,
      doctorName: activeDoctor.name,
      specialty: activeDoctor.specialty,
      primaryDiagnosis,
      doctorNotes: clinicalNotes,
      prescriptions: [
        {
          drug: prescriptionDrug,
          dosage: 'Standard clinical dosage',
          frequency: 'As indicated',
          duration: '7 Days'
        }
      ],
      invoiceAmount: Number(invoiceAmount)
    });

    await api.updateAppointmentStatus(targetAppointment.id, {
      status: 'completed',
      clinicalNotes,
      prescriptions: [prescriptionDrug]
    });

    setIsNoteModalOpen(false);
    onRefreshData();
  };

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === selectedDoctorId);
  const displayedAppointments = doctorAppointments.filter(a => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'emergency') return a.isEmergency;
    return a.status === statusFilter;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-screen" id="doctor-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar: Doctor Profile Selector */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={activeDoctor.avatar}
              alt={activeDoctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Doctor Portal Active
                </span>
                <span className="text-xs text-slate-400">{activeDoctor.consultationRoom}</span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white mt-1">
                {activeDoctor.name}
              </h2>
              <p className="text-xs sm:text-sm text-teal-300 font-medium">
                {activeDoctor.title} ({activeDoctor.qualifications})
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Switch Doctor Profile:</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => handleSwitchDoctor(e.target.value)}
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={() => setActiveTab('schedule')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Manage Availability</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Doctor Bookings</span>
            <span className="font-heading text-2xl font-extrabold text-slate-900 mt-1 block">
              {doctorAppointments.length}
            </span>
            <span className="text-[11px] text-teal-700 font-medium">Active clinic schedule</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Confirmed / Scheduled</span>
            <span className="font-heading text-2xl font-extrabold text-teal-700 mt-1 block">
              {doctorAppointments.filter(a => a.status === 'confirmed').length}
            </span>
            <span className="text-[11px] text-slate-400">Automated reminders set</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Emergency Cases</span>
            <span className="font-heading text-2xl font-extrabold text-rose-600 mt-1 block">
              {doctorAppointments.filter(a => a.isEmergency).length}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">Priority triage chair</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Patient Rating</span>
            <span className="font-heading text-2xl font-extrabold text-amber-500 mt-1 block">
              {activeDoctor.rating} ★
            </span>
            <span className="text-[11px] text-slate-400">{activeDoctor.reviewCount} verified reviews</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointment Bookings ({doctorAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Availability & Working Hours</span>
          </button>
        </div>

        {/* ================= TAB 1: AVAILABILITY & SCHEDULE MANAGEMENT ================= */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Doctor Availability & Calendar Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Patients can only book time slots corresponding to your active days and clinical hours.
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isAccepting ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {isAccepting ? '● Accepting Patients' : '○ Schedule Paused'}
              </span>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Days Toggle */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Active In-Clinic Consultation Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                  const isSelected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {day} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours & Slot Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Clinical Shift Start</label>
                <input
                  type="text"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  placeholder="e.g. 08:30 AM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Clinical Shift End</label>
                <input
                  type="text"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  placeholder="e.g. 05:30 PM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Slot Duration (Minutes)</label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Standard)</option>
                  <option value={60}>60 Minutes (Comprehensive)</option>
                </select>
              </div>
            </div>

            {/* Fee & Accepting Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Base Consultation Fee ($)</label>
                <input
                  type="number"
                  value={consultFee}
                  onChange={(e) => setConsultFee(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mt-5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Accept New Patients</span>
                  <span className="text-[11px] text-slate-500">Enable online calendar reservations</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAccepting}
                  onChange={(e) => setIsAccepting(e.target.checked)}
                  className="w-5 h-5 accent-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAvailability}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Schedule Updates</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: APPOINTMENTS LIST ================= */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Patient Bookings for {activeDoctor.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Review upcoming cases, record clinical diagnoses, or update booking status.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                >
                  <option value="all">All Statuses ({doctorAppointments.length})</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="emergency">Emergency Cases</option>
                </select>
              </div>
            </div>

            {displayedAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No appointments found for the selected filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayedAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className={`py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                      apt.isEmergency ? 'bg-rose-50/40 -mx-6 px-6' : ''
                    }`}
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {apt.bookingReference}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{apt.patientName}</h4>
                        {apt.isEmergency && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-teal-100 text-teal-800'
                            : apt.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-teal-800">
                        {apt.serviceCategory}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{apt.date}</strong> at <strong>{apt.timeSlot}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {apt.patientPhone}
                        </span>
                        <span>•</span>
                        <span>Payment: <strong className="text-slate-700">{apt.paymentStatus}</strong></span>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                          <strong>Patient Note:</strong> {apt.notes}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'in_progress')}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                        >
                          Check-In Patient
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenConsultationModal(apt)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Clinical Notes & Rx</span>
                      </button>

                      <button
                        onClick={() => onOpenChatWithPatient(apt.patientName, activeDoctor.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5 text-teal-600" />
                        <span>Message Patient</span>
                      </button>

                      {apt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'completed')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CLINICAL NOTE & CONSULTATION MODAL ================= */}
        {isNoteModalOpen && targetAppointment && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">
                    Clinical Chart & Prescription
                  </h4>
                  <p className="text-xs text-slate-500">
                    Patient: <strong className="text-slate-900">{targetAppointment.patientName}</strong> (Ref: {targetAppointment.bookingReference})
                  </p>
                </div>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Clinical Diagnosis *</label>
                  <input
                    type="text"
                    value={primaryDiagnosis}
                    onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    placeholder="e.g. Edentulous ridge #19. Approved for 3D guided titanium implant."
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Consultation & Surgical Notes</label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Clinical findings, bone density classification (D1-D4), recommended stage..."
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prescription Medication</label>
                  <input
                    type="text"
                    value={prescriptionDrug}
                    onChange={(e) => setPrescriptionDrug(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Procedure Invoice Estimate ($)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConsultation}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow"
                >
                  Save to Patient Chart & Complete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
