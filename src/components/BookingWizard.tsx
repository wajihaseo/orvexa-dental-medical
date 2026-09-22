import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Send,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  Star,
  FileCheck
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import { DENTAL_SERVICES } from '../data/servicesData';
import { api } from '../services/api';

interface BookingWizardProps {
  doctors: Doctor[];
  initialService?: string;
  preselectedService?: string;
  onBookingSuccess: (appointment: Appointment) => void;
  onNavigateReminders?: () => void;
  onNavigateHistory?: () => void;
  onViewPortal?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  doctors,
  initialService,
  preselectedService,
  onBookingSuccess,
  onNavigateReminders,
  onNavigateHistory,
  onViewPortal
}) => {
  const effectiveInitialService = preselectedService || initialService;
  const handleViewHistory = onViewPortal || onNavigateHistory || (() => {});
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Form states
  const [selectedService, setSelectedService] = useState<string>(
    effectiveInitialService || 'All-on-4® Full Arch Dental Implants'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    doctors[0]?.id || 'doc-1'
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [dentalHistory, setDentalHistory] = useState<string>('');
  const [insuranceProvider, setInsuranceProvider] = useState<string>('Self-Pay / Dental Financing');
  const [paymentOption, setPaymentOption] = useState<'pay_deposit' | 'pay_at_clinic'>('pay_deposit');
  const [reminderChannel, setReminderChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Generate slots for the doctor
  const timeSlots = [
    '08:30 AM',
    '09:15 AM',
    '10:00 AM',
    '10:45 AM',
    '11:30 AM',
    '01:15 PM',
    '02:00 PM',
    '02:45 PM',
    '03:30 PM',
    '04:15 PM',
    '05:00 PM'
  ];

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1 && !selectedService) {
      setErrorMsg('Please select a dental procedure to proceed.');
      return;
    }
    if (step === 2 && !selectedDoctorId) {
      setErrorMsg('Please choose your specialist.');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTimeSlot)) {
      setErrorMsg('Please select appointment date and time slot.');
      return;
    }
    if (step === 4) {
      if (!patientName.trim()) {
        setErrorMsg('Please enter your full legal name.');
        return;
      }
      if (!patientPhone.trim() || patientPhone.length < 7) {
        setErrorMsg('Please enter a valid contact phone number for automated reminders.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim() || `${patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        patientPhone: patientPhone.trim(),
        doctorId: selectedDoctorId,
        serviceCategory: selectedService,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        isEmergency,
        notes: notes.trim(),
        dentalHistory: dentalHistory.trim(),
        insuranceProvider,
        paymentMethod: paymentOption === 'pay_deposit' ? 'Credit Card Deposit ($150)' : 'Pay upon arrival at clinic',
        depositAmount: selectedService.toLowerCase().includes('free') ? 0 : 150
      };

      const result = await api.createAppointment(payload);
      if (result.success && result.data) {
        setConfirmedApt(result.data);
        onBookingSuccess(result.data);
      } else {
        setErrorMsg(result.message || 'Unable to confirm appointment. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calendar iCal download simulator
  const handleDownloadCalendar = () => {
    if (!confirmedApt) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Orvexa Dental & Medical//EN
BEGIN:VEVENT
SUMMARY:Orvexa Dental Consultation - ${confirmedApt.serviceCategory}
DESCRIPTION:Appointment with ${confirmedApt.doctorName}. Ref: ${confirmedApt.bookingReference}.
DTSTART:${confirmedApt.date.replace(/-/g, '')}T090000Z
LOCATION:Orvexa Dental & Medical Center, Surgical Wing 301
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orvexa-${confirmedApt.bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen" id="booking-wizard">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
            Secure Patient Portal
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900">
            Book Your Dental Consultation
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Reserve your chair with Arizona's leading dental implantologists. Automated reminders and immediate confirmation sent directly to your phone.
          </p>
        </div>

        {/* Wizard Progress Indicator */}
        {!confirmedApt && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              {[
                { s: 1, label: 'Service' },
                { s: 2, label: 'Specialist' },
                { s: 3, label: 'Date & Time' },
                { s: 4, label: 'Patient Info' },
                { s: 5, label: 'Confirm' }
              ].map((item, idx, arr) => (
                <React.Fragment key={item.s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === item.s
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : step > item.s
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
                    </div>
                    <span className="text-[11px] font-semibold mt-1 text-slate-600 hidden sm:inline">
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        step > item.s ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: SERVICE SELECTION ================= */}
        {step === 1 && !confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Step 1: Choose Dental Service or Procedure
              </h3>
              <span className="text-xs text-slate-500 font-medium">Select one</span>
            </div>

            {/* Special Voucher option */}
            <div
              onClick={() => setSelectedService('Complimentary 3D CT Scan & Implant Consultation')}
              className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${
                selectedService === 'Complimentary 3D CT Scan & Implant Consultation'
                  ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                  : 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Complimentary 3D CT Scan & Full Arch Consultation
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      $450 FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Includes 3D bone mapping, sinus clearance check, and 1-on-1 surgical plan. Zero obligation.
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="service"
                checked={selectedService === 'Complimentary 3D CT Scan & Implant Consultation'}
                onChange={() => setSelectedService('Complimentary 3D CT Scan & Implant Consultation')}
                className="w-5 h-5 accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DENTAL_SERVICES.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv.name)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedService === srv.name
                      ? 'border-teal-600 bg-teal-50/60 shadow-xs ring-2 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {srv.category}
                      </span>
                      <span className="text-xs font-semibold text-teal-700">{srv.duration}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{srv.priceEstimate}</span>
                    <span className="text-teal-700 font-bold">Select</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Checkbox */}
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-rose-900 block">
                    Is this an urgent dental emergency?
                  </span>
                  <span className="text-[11px] text-rose-700">
                    Severe throbbing pain, dental abscess, knocked-out tooth, or trauma.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* ================= STEP 2: DOCTOR SELECTION ================= */}
        {step === 2 && !confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Step 2: Choose Your Dental Specialist
                </h3>
                <p className="text-xs text-slate-500">
                  Selected service: <span className="font-semibold text-teal-800">{selectedService}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedDoctorId === doc.id
                      ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {doc.experienceYears}+ yrs
                          </span>
                        </div>
                        <p className="text-xs text-teal-700 font-medium">{doc.specialty}</p>
                        <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800">{doc.rating}</span>
                          <span className="text-[11px] text-slate-400">({doc.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {doc.specialtiesList.slice(0, 3).map((sp, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Active Days</span>
                      <span className="font-semibold text-slate-700">{doc.availableDays.join(', ')}</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-teal-600 text-white font-bold text-xs">
                      {selectedDoctorId === doc.id ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: DATE & TIME ================= */}
        {step === 3 && !confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Step 3: Select Date & Available Time Slot
                </h3>
                <p className="text-xs text-slate-500">
                  Consultation with <span className="font-semibold text-teal-800">{selectedDoctor?.name}</span> ({selectedDoctor?.consultationRoom})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Date Input */}
              <div className="md:col-span-5 space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Doctor Working Days:</span>
                    <span className="font-bold text-slate-900">{selectedDoctor?.availableDays.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Clinical Hours:</span>
                    <span className="font-bold text-slate-900">
                      {selectedDoctor?.availableHours.start} - {selectedDoctor?.availableHours.end}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="md:col-span-7 space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Time Slot ({selectedDoctor?.slotDurationMinutes} Mins)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        selectedTimeSlot === slot
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-400'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PATIENT INFORMATION ================= */}
        {step === 4 && !confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Step 4: Patient Details & Medical History
              </h3>
              <span className="text-xs text-slate-500 font-medium">HIPAA Compliant & Secure</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Mobile Phone (For SMS Reminders) *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Insurance or Payment Type</label>
                <select
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="Self-Pay / Dental Financing">Self-Pay / 0% APR Financing (CareCredit)</option>
                  <option value="Delta Dental Premier">Delta Dental Premier</option>
                  <option value="MetLife Dental PPO">MetLife Dental PPO</option>
                  <option value="Cigna Dental">Cigna Dental</option>
                  <option value="Aetna Dental">Aetna Dental</option>
                  <option value="Guardian Dental">Guardian Dental</option>
                  <option value="Other Dental Insurance">Other Dental Insurance</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Primary Symptoms & Dental Goals
              </label>
              <textarea
                rows={2}
                placeholder="Describe any missing teeth, pain level (1-10), bone loss history, or desire for smile transformation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Medical History & Medications (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. High blood pressure, penicillin allergy, taking blood thinners..."
                value={dentalHistory}
                onChange={(e) => setDentalHistory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 5: REVIEW, REMINDER PREFERENCES & CONFIRM ================= */}
        {step === 5 && !confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Step 5: Review & Confirm Appointment
              </h3>
              <span className="text-xs font-bold text-teal-700">Final Verification</span>
            </div>

            {/* Booking Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Procedure / Service:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedService}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Specialist Surgeon:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedDoctor?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date & Time:</span>
                  <span className="font-bold text-teal-800 text-sm">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Patient Contact:</span>
                  <span className="font-bold text-slate-900 text-sm">{patientName} • {patientPhone}</span>
                </div>
              </div>
            </div>

            {/* Automated Reminder Channel Preference */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Automated Appointment Reminder Preference
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'SMS', label: 'SMS Text Message', icon: Phone },
                  { id: 'WhatsApp', label: 'WhatsApp Alert', icon: Send },
                  { id: 'Email', label: 'Email Reminder', icon: Mail }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setReminderChannel(item.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition ${
                        reminderChannel === item.id
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-teal-600" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                You will automatically receive a 24-hour reminder alert and a 2-hour pre-visit arrival notification with clinical preparation notes.
              </p>
            </div>

            {/* Payment Method Option */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Consultation Payment Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentOption('pay_deposit')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentOption === 'pay_deposit'
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Pre-Authorize Deposit ($150)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Locks in priority surgical suite reservation. Applied directly to your treatment.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentOption('pay_at_clinic')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentOption === 'pay_at_clinic'
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Pay / Claim at Clinic
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay via Dental Insurance, Cash, Card, or Financing plan on the day of visit.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                &larr; Back
              </button>

              <button
                id="submit-booking-btn"
                type="button"
                disabled={loading}
                onClick={handleSubmitBooking}
                className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Securing Reservation...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Confirm & Schedule Appointment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Controls for Steps 1-4 */}
        {!confirmedApt && step < 5 && (
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow transition"
            >
              <span>Continue to Step {step + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= CONFIRMATION SUCCESS VIEW ================= */}
        {confirmedApt && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-emerald-300 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Reservation Confirmed
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                You're Scheduled at Orvexa Dental!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Booking Reference Code:{' '}
                <span className="font-mono font-bold text-slate-900 text-base bg-slate-100 px-2 py-0.5 rounded">
                  {confirmedApt.bookingReference}
                </span>
              </p>
            </div>

            {/* Appointment Card Summary */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{confirmedApt.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Specialist:</span>
                <span className="font-bold text-slate-900">{confirmedApt.doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Procedure:</span>
                <span className="font-semibold text-teal-800">{confirmedApt.serviceCategory}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900">{confirmedApt.date} at {confirmedApt.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Automated Reminder:</span>
                <span className="font-medium text-emerald-700">Active (SMS to {confirmedApt.patientPhone})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <Download className="w-4 h-4" />
                <span>Add to Calendar (.ics)</span>
              </button>

              {onNavigateReminders && (
                <button
                  onClick={onNavigateReminders}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-semibold"
                >
                  <Clock className="w-4 h-4" />
                  <span>View Automated Reminders Center</span>
                </button>
              )}

              <button
                onClick={handleViewHistory}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <span>View Patient Chart & History</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setConfirmedApt(null);
                  setStep(1);
                  setPatientName('');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Book another appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
