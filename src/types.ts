export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  specialty: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  bio: string;
  education: string[];
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  slotDurationMinutes: number;
  isAcceptingPatients: boolean;
  specialtiesList: string[];
  consultationRoom: string;
}

export type AppointmentStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
export type PaymentStatus = 'paid' | 'pending' | 'deposit_paid' | 'financing_approved';

export interface ReminderLog {
  id: string;
  type: 'sms' | 'email' | 'whatsapp' | 'in_app';
  timestamp: string;
  message: string;
  status: 'sent' | 'delivered' | 'confirmed';
}

export interface Appointment {
  id: string;
  bookingReference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  serviceCategory: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: AppointmentStatus;
  isEmergency: boolean;
  notes: string;
  dentalHistory?: string;
  insuranceProvider?: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentMethod?: string;
  createdAt: string;
  remindersSent: ReminderLog[];
  clinicalNotes?: string;
  prescriptions?: string[];
}

export interface ReminderAlert {
  id: string;
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  channel: 'SMS' | 'Email' | 'WhatsApp' | 'In-App Alert';
  scheduledLeadTime: string; // e.g. "24 Hours Before" or "2 Hours Before"
  status: 'scheduled' | 'dispatched' | 'confirmed_by_patient';
  messageTemplate: string;
  dispatchedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor' | 'coordinator' | 'system';
  senderName: string;
  doctorId?: string;
  appointmentId?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isUrgent?: boolean;
}

export interface TreatmentStep {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export interface Prescription {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ConsultationRecord {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  doctorName: string;
  specialty: string;
  primaryDiagnosis: string;
  treatmentPlan: TreatmentStep[];
  prescriptions: Prescription[];
  xrayType: string;
  xraySummary: string;
  doctorNotes: string;
  invoiceAmount: number;
  invoiceStatus: 'paid' | 'insurance_claim';
  followUpDate: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  location: string;
  rating: number;
  date: string;
  treatment: string;
  doctorName: string;
  comment: string;
  verified: boolean;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'chat' | 'payment' | 'doctor';
  timestamp: string;
  read: boolean;
  actionPayload?: string;
}

export type AppNotification = NotificationItem;

export interface DentalService {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  duration: string;
  priceEstimate: string;
  isPopular?: boolean;
  features: string[];
  iconName: string;
}
