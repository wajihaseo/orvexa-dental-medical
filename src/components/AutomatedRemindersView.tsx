import React, { useState } from 'react';
import {
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Zap,
  RefreshCw,
  BellRing,
  Smartphone
} from 'lucide-react';
import { ReminderAlert } from '../types';
import { api } from '../services/api';

interface AutomatedRemindersViewProps {
  reminders: ReminderAlert[];
  onRefresh: () => void;
  onNavigateBooking: () => void;
}

export const AutomatedRemindersView: React.FC<AutomatedRemindersViewProps> = ({
  reminders,
  onRefresh,
  onNavigateBooking
}) => {
  const [triggerStatus, setTriggerStatus] = useState<string>('');
  const [simulatedMobilePreview, setSimulatedMobilePreview] = useState<ReminderAlert | null>(
    reminders[0] || null
  );

  const handleTrigger = async (reminderId: string) => {
    setTriggerStatus(`Dispatching automated reminder...`);
    const res = await api.triggerReminder(reminderId);
    if (res.success && res.data) {
      setTriggerStatus(`Automated reminder successfully dispatched via ${res.data.channel}!`);
      setSimulatedMobilePreview(res.data);
      onRefresh();
      setTimeout(() => setTriggerStatus(''), 4000);
    }
  };

  const handleConfirmAttendance = async (reminderId: string) => {
    setTriggerStatus(`Recording patient confirmation...`);
    const res = await api.confirmReminderAttendance(reminderId);
    if (res.success) {
      setTriggerStatus(`Patient attendance confirmed! Appointment marked verified.`);
      onRefresh();
      setTimeout(() => setTriggerStatus(''), 4000);
    }
  };

  const getChannelBadge = (channel: ReminderAlert['channel']) => {
    switch (channel) {
      case 'SMS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">SMS Text</span>;
      case 'WhatsApp':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">WhatsApp</span>;
      case 'Email':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Email</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">In-App Alert</span>;
    }
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen" id="automated-reminders">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <BellRing className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>Automated Practice Automation</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Automated Patient Appointment Reminders
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Reduce patient no-shows to under 1.2%. Our automated reminder engine dispatches scheduled multi-channel SMS and WhatsApp notifications with instant attendance confirmation links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Reminders</span>
            </button>
            <button
              onClick={onNavigateBooking}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow"
            >
              + New Appointment
            </button>
          </div>
        </div>

        {triggerStatus && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{triggerStatus}</span>
          </div>
        )}

        {/* 3-Step Reminder Pipeline Infographic */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
            Automated Delivery Cadence
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Step 1 • 48 Hours Prior
                </span>
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Pre-Op Fasting & History</h4>
              <p className="text-xs text-slate-500">
                Email notification with digital health questionnaire and fasting guidelines for sedation surgery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Step 2 • 24 Hours Prior
                </span>
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">SMS Direct Confirmation</h4>
              <p className="text-xs text-slate-500">
                Interactive SMS alert asking patient to reply "1" or tap secure link to lock attendance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Step 3 • 2 Hours Prior
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Arrival & GPS Navigation</h4>
              <p className="text-xs text-slate-500">
                Urgent push alert with clinic parking instructions and surgical suite check-in counter.
              </p>
            </div>
          </div>
        </div>

        {/* Reminders Queue & Interactive Mobile Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Reminders Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Active Reminder Schedule Queue ({reminders.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">Real-time status</span>
            </div>

            <div className="space-y-3">
              {reminders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No automated reminders currently queued. Book an appointment to trigger one.
                </div>
              ) : (
                reminders.map(rem => (
                  <div
                    key={rem.id}
                    onClick={() => setSimulatedMobilePreview(rem)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      simulatedMobilePreview?.id === rem.id
                        ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{rem.patientName}</h4>
                        {getChannelBadge(rem.channel)}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rem.status === 'confirmed_by_patient'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rem.status === 'dispatched'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rem.status === 'confirmed_by_patient'
                            ? '✓ Confirmed by Patient'
                            : rem.status === 'dispatched'
                            ? 'Sent / Dispatched'
                            : 'Scheduled Queue'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {rem.doctorName} • <strong>{rem.appointmentDate}</strong> at <strong>{rem.appointmentTime}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        "{rem.messageTemplate.slice(0, 75)}..."
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rem.status === 'scheduled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrigger(rem.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Now</span>
                        </button>
                      )}

                      {rem.status !== 'confirmed_by_patient' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmAttendance(rem.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Simulate Confirmation</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Live Simulated Mobile Phone Alert Screen */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border-4 border-slate-800 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5 font-bold text-teal-400">
                <Smartphone className="w-4 h-4" /> Live Mobile Device View
              </span>
              <span>9:41 AM</span>
            </div>

            {simulatedMobilePreview ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-400 flex items-center gap-1">
                      <BellRing className="w-3 h-3" /> Orvexa Dental Center
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {simulatedMobilePreview.messageTemplate}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleConfirmAttendance(simulatedMobilePreview.id)}
                      className="flex-1 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs text-center"
                    >
                      Confirm (1-Tap)
                    </button>
                    <a
                      href="tel:5559113368"
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs text-center font-medium"
                    >
                      Call Clinic
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Target Phone:</span>
                    <span className="font-mono text-slate-200">{simulatedMobilePreview.patientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Time:</span>
                    <span className="text-slate-200">{simulatedMobilePreview.scheduledLeadTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Status:</span>
                    <span className="text-teal-400 font-bold capitalize">{simulatedMobilePreview.status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Select a reminder from the queue to preview mobile notification delivery.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
