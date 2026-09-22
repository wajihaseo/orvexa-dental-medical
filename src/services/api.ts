import { Appointment, Doctor, ReminderAlert, ChatMessage, ConsultationRecord, PatientReview, NotificationItem } from '../types';

export const api = {
  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      return [];
    }
  },

  async updateDoctorAvailability(
    doctorId: string,
    updates: {
      availableDays?: string[];
      availableHours?: { start: string; end: string };
      isAcceptingPatients?: boolean;
      slotDurationMinutes?: number;
      consultationFee?: number;
    }
  ): Promise<{ success: boolean; data?: Doctor; message?: string }> {
    try {
      const res = await fetch(`/api/doctors/${doctorId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to update doctor availability', err);
      return { success: false, message: 'Network error updating availability' };
    }
  },

  // Appointments
  async getAppointments(params?: { doctorId?: string; status?: string; date?: string }): Promise<Appointment[]> {
    try {
      const query = new URLSearchParams();
      if (params?.doctorId) query.set('doctorId', params.doctorId);
      if (params?.status) query.set('status', params.status);
      if (params?.date) query.set('date', params.date);

      const res = await fetch(`/api/appointments?${query.toString()}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch appointments', err);
      return [];
    }
  },

  async createAppointment(appointmentData: Partial<Appointment> & { depositAmount?: number }): Promise<{ success: boolean; data?: Appointment; message?: string }> {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to create appointment', err);
      return { success: false, message: 'Failed to create appointment. Please check network.' };
    }
  },

  async updateAppointmentStatus(
    id: string,
    payload: { status?: string; clinicalNotes?: string; prescriptions?: string[]; paymentStatus?: string }
  ): Promise<{ success: boolean; data?: Appointment; message?: string }> {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to update appointment', err);
      return { success: false, message: 'Update failed' };
    }
  },

  // Reminders
  async getReminders(): Promise<ReminderAlert[]> {
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch reminders', err);
      return [];
    }
  },

  async triggerReminder(id: string): Promise<{ success: boolean; data?: ReminderAlert; message?: string }> {
    try {
      const res = await fetch(`/api/reminders/${id}/trigger`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to trigger reminder', err);
      return { success: false, message: 'Dispatch failed' };
    }
  },

  async confirmReminderAttendance(id: string): Promise<{ success: boolean; data?: ReminderAlert; message?: string }> {
    try {
      const res = await fetch(`/api/reminders/${id}/confirm-attendance`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to confirm attendance', err);
      return { success: false, message: 'Confirmation failed' };
    }
  },

  // Chat
  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch chat messages', err);
      return [];
    }
  },

  async sendChatMessage(payload: {
    message: string;
    senderName?: string;
    doctorId?: string;
    isUrgent?: boolean;
  }): Promise<{ success: boolean; patientMessage?: ChatMessage; doctorReply?: ChatMessage }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to send chat message', err);
      return { success: false };
    }
  },

  // Consultations & Patient Records
  async getConsultations(email?: string): Promise<ConsultationRecord[]> {
    try {
      const url = email ? `/api/consultations?email=${encodeURIComponent(email)}` : '/api/consultations';
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch consultations', err);
      return [];
    }
  },

  async recordConsultation(recordData: Partial<ConsultationRecord>): Promise<{ success: boolean; data?: ConsultationRecord; message?: string }> {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to record consultation', err);
      return { success: false, message: 'Failed to record consultation' };
    }
  },

  // Payments
  async processPayment(payload: {
    appointmentId?: string;
    amount: number;
    paymentMethod: string;
    cardLast4?: string;
    patientName?: string;
  }): Promise<{ success: boolean; transactionId?: string; receiptUrl?: string; message?: string }> {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to process payment', err);
      return { success: false, message: 'Payment processing failed' };
    }
  },

  // Reviews
  async getReviews(): Promise<PatientReview[]> {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch reviews', err);
      return [];
    }
  },

  async submitReview(reviewData: Partial<PatientReview>): Promise<{ success: boolean; data?: PatientReview; message?: string }> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to submit review', err);
      return { success: false, message: 'Review submission failed' };
    }
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  },

  async markAllNotificationsRead(): Promise<boolean> {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  }
};
