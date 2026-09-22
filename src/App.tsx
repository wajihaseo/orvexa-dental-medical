import React, { useState, useEffect } from 'react';
import {
  Navbar,
  TabType
} from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ImplantShowcase } from './components/ImplantShowcase';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { TechnologySection } from './components/TechnologySection';
import { BookingWizard } from './components/BookingWizard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AutomatedRemindersView } from './components/AutomatedRemindersView';
import { PatientPortalView } from './components/PatientPortalView';
import { LiveChatView } from './components/LiveChatView';
import { ReviewsSection } from './components/ReviewsSection';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';
import { api } from './services/api';
import {
  Doctor,
  Appointment,
  ReminderAlert,
  ConsultationRecord,
  PatientReview,
  AppNotification
} from './types';
import {
  MessageSquare,
  Calendar,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowUp
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDoctorView, setIsDoctorView] = useState<boolean>(false);

  // Core Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<ReminderAlert[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Workflow Handlers
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [chatDoctorId, setChatDoctorId] = useState<string | undefined>();

  // Payment Modal State
  const [paymentConfig, setPaymentConfig] = useState<{
    isOpen: boolean;
    appointmentId?: string;
    amount: number;
    patientName: string;
    procedureName: string;
  }>({
    isOpen: false,
    amount: 150,
    patientName: 'Patient',
    procedureName: 'Surgical Consultation Deposit'
  });

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [docs, apts, rems, cons, revs, notifs] = await Promise.all([
        api.getDoctors(),
        api.getAppointments(),
        api.getReminders(),
        api.getConsultations(),
        api.getReviews(),
        api.getNotifications()
      ]);

      setDoctors(docs);
      setAppointments(apts);
      setReminders(rems);
      setConsultations(cons);
      setReviews(revs);
      setNotifications(notifs);
    } catch (err) {
      console.error('Error loading initial clinic data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Navigations
  const handleNavigateToBooking = (serviceName?: string) => {
    if (serviceName) setPreselectedService(serviceName);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChatWithDoctor = (docNameOrId: string) => {
    const doc = doctors.find(d => d.name === docNameOrId || d.id === docNameOrId);
    if (doc) setChatDoctorId(doc.id);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaymentModal = (params: {
    appointmentId?: string;
    amount: number;
    patientName: string;
    procedureName: string;
  }) => {
    setPaymentConfig({
      isOpen: true,
      ...params
    });
  };

  const handleToggleDoctorView = () => {
    if (!isDoctorView) {
      setIsDoctorView(true);
      setActiveTab('dashboard');
      showToast('Switched to Doctor Clinic Management Portal');
    } else {
      setIsDoctorView(false);
      setActiveTab('home');
      showToast('Switched to Patient View');
    }
  };

  const handleBookingComplete = (apt: Appointment) => {
    showToast(`Appointment Confirmed! Reference: ${apt.bookingReference}`);
    loadAllData();

    // Prompt optional deposit payment
    setTimeout(() => {
      handleOpenPaymentModal({
        appointmentId: apt.id,
        amount: apt.isEmergency ? 250 : 150,
        patientName: apt.patientName,
        procedureName: `${apt.serviceCategory} Reservation Deposit`
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Global Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        notifications={notifications}
        onRefreshNotifications={loadAllData}
        isDoctorView={isDoctorView}
        onToggleDoctorView={handleToggleDoctorView}
        onOpenBooking={() => handleNavigateToBooking()}
      />

      {/* Global Interactive Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="p-1 rounded-full bg-teal-500/20 text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
              Orvexa System Notification
            </span>
            <p className="text-xs font-semibold text-slate-100">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* TAB: HOME LANDING VIEW */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* 1. Hero with immediate booking trigger */}
            <HeroSection
              onStartBooking={handleNavigateToBooking}
              onExploreServices={() => {
                const el = document.getElementById('implant-showcase');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Dental Implant Solutions & Financing Calculator */}
            <ImplantShowcase onSelectProcedure={handleNavigateToBooking} />

            {/* 3. Real Patient Before / After Interactive Slider */}
            <BeforeAfterGallery onBookConsultation={handleNavigateToBooking} />

            {/* 4. Clinic Technology & Surgical Robotics */}
            <TechnologySection onScheduleScan={() => handleNavigateToBooking('3D CBCT Surgical Scan')} />

            {/* 5. Verified Patient Reviews & Feedback */}
            <ReviewsSection
              reviews={reviews}
              doctors={doctors}
              onRefreshReviews={loadAllData}
              onStartBooking={handleNavigateToBooking}
            />
          </div>
        )}

        {/* TAB: ONLINE BOOKING WIZARD */}
        {activeTab === 'booking' && (
          <div className="animate-in fade-in duration-200">
            <BookingWizard
              doctors={doctors}
              preselectedService={preselectedService}
              onBookingSuccess={handleBookingComplete}
              onViewPortal={() => setActiveTab('patient-portal')}
            />
          </div>
        )}

        {/* TAB: DOCTOR DASHBOARD & SCHEDULE AVAILABILITY */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            <DoctorDashboard
              doctors={doctors}
              appointments={appointments}
              onRefreshData={loadAllData}
              onOpenChatWithPatient={(patientName, doctorId) => {
                setChatDoctorId(doctorId);
                setActiveTab('chat');
              }}
            />
          </div>
        )}

        {/* TAB: AUTOMATED MULTI-CHANNEL APPOINTMENT REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="animate-in fade-in duration-200">
            <AutomatedRemindersView
              reminders={reminders}
              onRefresh={loadAllData}
              onNavigateBooking={() => handleNavigateToBooking()}
            />
          </div>
        )}

        {/* TAB: ENCRYPTED PATIENT PORTAL & CONSULTATION HISTORY */}
        {activeTab === 'patient-portal' && (
          <div className="animate-in fade-in duration-200">
            <PatientPortalView
              consultations={consultations}
              onOpenChatWithDoctor={handleStartChatWithDoctor}
              onBookFollowUp={handleNavigateToBooking}
            />
          </div>
        )}

        {/* TAB: LIVE TELEHEALTH & TRIAGE CONSULTATION CHAT */}
        {activeTab === 'chat' && (
          <div className="animate-in fade-in duration-200">
            <LiveChatView
              doctors={doctors}
              initialDoctorId={chatDoctorId}
              onNavigateBooking={handleNavigateToBooking}
            />
          </div>
        )}

        {/* TAB: USER REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in duration-200">
            <ReviewsSection
              reviews={reviews}
              doctors={doctors}
              onRefreshReviews={loadAllData}
              onStartBooking={handleNavigateToBooking}
            />
          </div>
        )}
      </main>

      {/* Floating Action Quick-Access Pill (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {activeTab !== 'chat' && (
          <button
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5 border border-teal-500/30"
            title="Chat with On-Call Dental Surgeon"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Surgeon Online</span>
          </button>
        )}

        {activeTab !== 'booking' && (
          <button
            onClick={() => handleNavigateToBooking()}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5 border border-slate-700"
            title="Book Immediate Appointment"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Book Visit</span>
          </button>
        )}
      </div>

      {/* Global Payment & Deposit Checkout Modal */}
      <PaymentModal
        isOpen={paymentConfig.isOpen}
        onClose={() => setPaymentConfig(prev => ({ ...prev, isOpen: false }))}
        appointmentId={paymentConfig.appointmentId}
        amount={paymentConfig.amount}
        patientName={paymentConfig.patientName}
        procedureName={paymentConfig.procedureName}
        onPaymentSuccess={(txnId) => {
          showToast(`Payment of $${paymentConfig.amount} approved! Txn: ${txnId}`);
          loadAllData();
        }}
      />

      {/* Global Clinical Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartBooking={() => handleNavigateToBooking()}
      />
    </div>
  );
}
