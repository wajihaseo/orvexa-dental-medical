import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database store with rich seed data for Orvexa Dental & Medical
let doctors = [
  {
    id: 'doc-1',
    name: 'Dr. Sofia Al-Mansoor',
    title: 'Chief Oral & Maxillofacial Implant Surgeon',
    qualifications: 'DDS, MS, FICOI, Diplomate ICOI',
    specialty: 'Dental Implants & Full Arch All-on-4',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    rating: 4.98,
    reviewCount: 312,
    experienceYears: 16,
    consultationFee: 150,
    bio: 'Dr. Sofia is an internationally recognized implantologist specializing in computer-guided 3D bone grafting, immediate load All-on-4 full arch restorations, and minimally invasive titanium implant integration.',
    education: [
      'Doctor of Dental Surgery (DDS) - Harvard School of Dental Medicine',
      'Advanced Surgical Implant Fellowship - International Congress of Oral Implantologists',
      'Master of Science in Periodontics & Regenerative Tissue'
    ],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableHours: { start: '08:30 AM', end: '05:30 PM' },
    slotDurationMinutes: 45,
    isAcceptingPatients: true,
    specialtiesList: ['All-on-4 Full Arch', 'Zygomatic Implants', 'Guided 3D Surgery', 'Bone Grafting'],
    consultationRoom: 'Surgical Suite 301'
  },
  {
    id: 'doc-2',
    name: 'Dr. Tariq Vance',
    title: 'Senior Prosthodontist & Digital Smile Designer',
    qualifications: 'DMD, FACP, Board Certified Prosthodontist',
    specialty: 'Cosmetic Dentistry & Smile Makeovers',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    rating: 4.95,
    reviewCount: 248,
    experienceYears: 14,
    consultationFee: 140,
    bio: 'Dr. Vance combines artistic finesse with state-of-the-art intraoral digital design. He specializes in handcrafted ultra-thin porcelain veneers, complete bite rehabilitation, and zirconia aesthetic crowns.',
    education: [
      'Doctor of Dental Medicine (DMD) - University of Pennsylvania',
      'Specialty Certificate in Prosthodontics - Columbia University',
      'Certified Digital Smile Design (DSD) Master'
    ],
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableHours: { start: '09:00 AM', end: '06:00 PM' },
    slotDurationMinutes: 45,
    isAcceptingPatients: true,
    specialtiesList: ['Porcelain Veneers', 'Digital Smile Design', 'Full Mouth Rehabilitation', 'Zirconia Bridges'],
    consultationRoom: 'Aesthetic Studio 204'
  },
  {
    id: 'doc-3',
    name: 'Dr. Maya Lin',
    title: 'Director of Periodontics & Laser Implant Care',
    qualifications: 'BDS, MDS, Periodontics & Implantology',
    specialty: 'Periodontal Regeneration & Laser Dentistry',
    avatar: 'https://images.unsplash.com/photo-1594824813583-149b5c393bdc?auto=format&fit=crop&q=80&w=400',
    rating: 4.92,
    reviewCount: 189,
    experienceYears: 11,
    consultationFee: 120,
    bio: 'Dr. Lin is renowned for gentle periodontal therapy, soft tissue micro-grafting for receding gums, and WaterLase gentle laser treatments eliminating the need for invasive incisions.',
    education: [
      'Master of Dental Surgery (MDS) in Periodontology - King’s College London',
      'Fellow of the Academy of Laser Dentistry (ALD)'
    ],
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    availableHours: { start: '09:30 AM', end: '05:00 PM' },
    slotDurationMinutes: 30,
    isAcceptingPatients: true,
    specialtiesList: ['Laser Gum Contouring', 'LANAP Therapy', 'Pinhole Surgical Technique', 'Deep Periodontal Therapy'],
    consultationRoom: 'Laser Suite 108'
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Sterling',
    title: 'Emergency Dentist & Endodontic Specialist',
    qualifications: 'DDS, Root Canal Specialist, AAE Member',
    specialty: 'Emergency Dental Care & Microscope Endodontics',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    rating: 4.96,
    reviewCount: 220,
    experienceYears: 12,
    consultationFee: 130,
    bio: 'Specializing in urgent pain relief, single-visit microscope-guided root canals, and trauma management. Dr. Sterling ensures patients in severe dental pain receive instant, soothing relief.',
    education: [
      'DDS - UCLA School of Dentistry',
      'Postgraduate Endodontics Residency - NYU College of Dentistry'
    ],
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    availableHours: { start: '08:00 AM', end: '07:00 PM' },
    slotDurationMinutes: 40,
    isAcceptingPatients: true,
    specialtiesList: ['Same-Day Pain Relief', 'Gentle Root Canal Therapy', 'Dental Trauma Repair', 'Wisdom Tooth Emergencies'],
    consultationRoom: 'Emergency Care 101'
  }
];

let appointments = [
  {
    id: 'apt-101',
    bookingReference: 'ORV-8921',
    patientName: 'Kareem Ahmed',
    patientEmail: 'kareem.a@example.com',
    patientPhone: '+1 (555) 349-2180',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sofia Al-Mansoor',
    serviceCategory: 'Dental Implants (Full Arch / Single)',
    date: '2026-09-24',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    isEmergency: false,
    notes: 'Missing upper premolar after sports injury. Interested in immediate 3D-guided implant and zirconia crown.',
    dentalHistory: 'No chronic conditions, non-smoker, healthy jaw bone density.',
    insuranceProvider: 'Delta Dental Premier (Pre-authorized)',
    paymentStatus: 'deposit_paid',
    paymentAmount: 150,
    paymentMethod: 'Visa ending in 4242',
    createdAt: '2026-09-21T14:20:00.000Z',
    remindersSent: [
      {
        id: 'rem-log-1',
        type: 'sms',
        timestamp: '2026-09-22T08:00:00.000Z',
        message: 'Reminder from Orvexa Dental: You have a scheduled 3D Implant Consultation on Sep 24 at 10:00 AM with Dr. Sofia Al-Mansoor.',
        status: 'delivered'
      }
    ],
    clinicalNotes: 'Initial CT scan scheduled. Patient cleared for titanium implant assessment.',
    prescriptions: ['Chlorhexidine 0.12% Oral Rinse - 1 bottle']
  },
  {
    id: 'apt-102',
    bookingReference: 'ORV-8922',
    patientName: 'Aisha Malik',
    patientEmail: 'aisha.m@example.com',
    patientPhone: '+1 (555) 782-9901',
    doctorId: 'doc-2',
    doctorName: 'Dr. Tariq Vance',
    serviceCategory: 'Smile Makeover / Porcelain Veneers',
    date: '2026-09-25',
    timeSlot: '02:30 PM',
    status: 'confirmed',
    isEmergency: false,
    notes: 'Interested in 8 upper porcelain veneers for minor spacing and natural shade brightening.',
    dentalHistory: 'No dental allergies, had orthodontic aligners 3 years ago.',
    insuranceProvider: 'Self-Pay / Dental Financing',
    paymentStatus: 'paid',
    paymentAmount: 140,
    paymentMethod: 'Mastercard ending in 8812',
    createdAt: '2026-09-21T16:45:00.000Z',
    remindersSent: [],
    clinicalNotes: 'Digital smile design mock-up requested prior to diagnostic wax-up.'
  },
  {
    id: 'apt-103',
    bookingReference: 'ORV-8923',
    patientName: 'David Chen',
    patientEmail: 'd.chen@example.com',
    patientPhone: '+1 (555) 234-5678',
    doctorId: 'doc-4',
    doctorName: 'Dr. Marcus Sterling',
    serviceCategory: 'Emergency Dental Pain Relief',
    date: '2026-09-23',
    timeSlot: '09:00 AM',
    status: 'in_progress',
    isEmergency: true,
    notes: 'Acute throbbing pain lower right molar #30. High sensitivity to hot & cold liquids.',
    dentalHistory: 'Penicillin allergy noted. Uses Ibuprofen for temporary pain management.',
    insuranceProvider: 'MetLife Dental',
    paymentStatus: 'deposit_paid',
    paymentAmount: 130,
    paymentMethod: 'Apple Pay',
    createdAt: '2026-09-22T04:15:00.000Z',
    remindersSent: [
      {
        id: 'rem-log-2',
        type: 'sms',
        timestamp: '2026-09-22T04:30:00.000Z',
        message: 'URGENT: Orvexa Emergency Dental confirmed your appointment for tomorrow at 09:00 AM with Dr. Sterling.',
        status: 'delivered'
      }
    ],
    clinicalNotes: 'Pulpitis diagnosis. Endodontic access planned with local anesthesia.'
  }
];

let automatedReminders = [
  {
    id: 'rem-1',
    appointmentId: 'apt-101',
    patientName: 'Kareem Ahmed',
    patientPhone: '+1 (555) 349-2180',
    patientEmail: 'kareem.a@example.com',
    doctorName: 'Dr. Sofia Al-Mansoor',
    appointmentDate: '2026-09-24',
    appointmentTime: '10:00 AM',
    channel: 'SMS',
    scheduledLeadTime: '24 Hours Before',
    status: 'dispatched',
    messageTemplate: 'Hi Kareem, your Orvexa Dental 3D Implant appointment with Dr. Sofia is in 24 hours. Please arrive 10 min early with your ID. Reply 1 to Confirm.',
    dispatchedAt: '2026-09-22T08:00:00.000Z'
  },
  {
    id: 'rem-2',
    appointmentId: 'apt-102',
    patientName: 'Aisha Malik',
    patientPhone: '+1 (555) 782-9901',
    patientEmail: 'aisha.m@example.com',
    doctorName: 'Dr. Tariq Vance',
    appointmentDate: '2026-09-25',
    appointmentTime: '02:30 PM',
    channel: 'WhatsApp',
    scheduledLeadTime: '24 Hours Before',
    status: 'scheduled',
    messageTemplate: 'Hello Aisha! Your Smile Makeover consultation with Dr. Tariq Vance is booked for Sep 25 at 02:30 PM at Orvexa Dental Suite 204.'
  },
  {
    id: 'rem-3',
    appointmentId: 'apt-103',
    patientName: 'David Chen',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'd.chen@example.com',
    doctorName: 'Dr. Marcus Sterling',
    appointmentDate: '2026-09-23',
    appointmentTime: '09:00 AM',
    channel: 'In-App Alert',
    scheduledLeadTime: '2 Hours Before',
    status: 'dispatched',
    messageTemplate: 'URGENT REMINDER: Emergency dental care slot ready in 2 hours with Dr. Marcus Sterling. Fasting not required unless IV sedation selected.',
    dispatchedAt: '2026-09-22T07:00:00.000Z'
  }
];

let chatMessages = [
  {
    id: 'msg-1',
    sender: 'system',
    senderName: 'Orvexa Dental Concierge',
    message: 'Welcome to Orvexa Dental & Medical. Our surgical specialists and clinical coordinators are online to answer questions regarding dental implants, smile makeovers, and immediate pain relief.',
    timestamp: '2026-09-22T04:00:00.000Z',
    isRead: true
  },
  {
    id: 'msg-2',
    sender: 'patient',
    senderName: 'Kareem Ahmed',
    doctorId: 'doc-1',
    message: 'Hello Dr. Sofia, do I need to stop taking my blood pressure medicine before the 3D implant consultation scan?',
    timestamp: '2026-09-22T04:30:00.000Z',
    isRead: true
  },
  {
    id: 'msg-3',
    sender: 'doctor',
    senderName: 'Dr. Sofia Al-Mansoor',
    doctorId: 'doc-1',
    message: 'Hello Kareem! For the initial 3D CT scan and surgical assessment, you should take all your prescribed blood pressure medications normally with a sip of water. We will review the entire medical protocol together.',
    timestamp: '2026-09-22T04:35:00.000Z',
    isRead: true
  }
];

let consultationRecords = [
  {
    id: 'rec-1',
    patientName: 'Kareem Ahmed',
    patientEmail: 'kareem.a@example.com',
    date: '2026-09-10',
    doctorName: 'Dr. Sofia Al-Mansoor',
    specialty: 'Oral Implantology',
    primaryDiagnosis: 'Partial edentulism in right maxillary quadrant #4. Severe alveolar atrophy.',
    treatmentPlan: [
      { step: 1, title: '3D CBCT Cone Beam Scan & Bone Density Analysis', description: 'High-resolution 3D volumetric mapping of bone ridge and sinus floor.', status: 'completed' },
      { step: 2, title: 'Minimally Invasive Bio-Oss Bone Grafting', description: 'Regeneration of supportive bone height with collagen membrane.', status: 'in_progress' },
      { step: 3, title: 'Straumann Roxolid Titanium Implant Placement', description: 'Computer-guided flapless implant installation with initial stability > 35 Ncm.', status: 'scheduled' },
      { step: 4, title: 'Custom Milled Zirconia Aesthetic Crown', description: 'Screw-retained monolithic zirconia restoration matching shade A2.', status: 'scheduled' }
    ],
    prescriptions: [
      { drug: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Every 8 hours', duration: '7 days' },
      { drug: 'Chlorhexidine Gluconate 0.12%', dosage: '15 ml rinse', frequency: 'Twice daily', duration: '14 days' },
      { drug: 'Ibuprofen 600mg', dosage: '1 tablet', frequency: 'As needed for discomfort', duration: '3 days' }
    ],
    xrayType: 'High-Definition Cone Beam 3D CT & Panoramic Scan',
    xraySummary: 'Bone density measured at D2 quality. Sinus floor clear with 11.4mm vertical clearance. Excellent candidate for immediate screw-retained implant.',
    doctorNotes: 'Patient is highly cooperative. Excellent gingival biotype. Anticipated success rate > 98.5%.',
    invoiceAmount: 2450,
    invoiceStatus: 'paid',
    followUpDate: '2026-10-15'
  },
  {
    id: 'rec-2',
    patientName: 'Aisha Malik',
    patientEmail: 'aisha.m@example.com',
    date: '2026-08-28',
    doctorName: 'Dr. Tariq Vance',
    specialty: 'Aesthetic Prosthodontics',
    primaryDiagnosis: 'Enamel hypoplasia, mild diastema between teeth #8 and #9, fluorosis discoloration.',
    treatmentPlan: [
      { step: 1, title: 'Intraoral 3D Digital Impression (iTero 5D)', description: 'Full digital scan for 3D smile contour simulation.', status: 'completed' },
      { step: 2, title: 'Digital Smile Design (DSD) Preview', description: 'Patient verified aesthetic proportions and incisal edge symmetry.', status: 'completed' },
      { step: 3, title: 'Minimal-Prep Feldspathic Porcelain Veneers (8 units)', description: 'Handcrafted master lab ceramic veneers with natural translucency.', status: 'scheduled' }
    ],
    prescriptions: [
      { drug: 'Sensodyne Rapid Relief Toothpaste', dosage: 'Brush twice daily', frequency: 'Daily', duration: 'Ongoing' }
    ],
    xrayType: 'Digital Bite-Wing and Periapical Radiograph Set',
    xraySummary: 'No subgingival caries. Periodontal bone levels within normal physiological limits.',
    doctorNotes: 'Expectation aligned with natural bleach shade BL3. Gum line is harmonious.',
    invoiceAmount: 4800,
    invoiceStatus: 'paid',
    followUpDate: '2026-09-25'
  }
];

let patientReviews = [
  {
    id: 'rev-1',
    patientName: 'Robert Vance',
    location: 'Scottsdale, AZ',
    rating: 5,
    date: '2026-09-18',
    treatment: 'All-on-4 Full Arch Dental Implants',
    doctorName: 'Dr. Sofia Al-Mansoor',
    comment: 'After struggling with ill-fitting dentures for 8 years, Dr. Sofia completely changed my life. The 3D guided surgery was painless, and I walked out with permanent, rock-solid teeth the very same day. Orvexa’s staff is world-class!',
    verified: true,
    badge: 'Verified Surgical Patient'
  },
  {
    id: 'rev-2',
    patientName: 'Elena Rostova',
    location: 'Phoenix, AZ',
    rating: 5,
    date: '2026-09-15',
    treatment: 'Porcelain Veneers & Smile Makeover',
    doctorName: 'Dr. Tariq Vance',
    comment: 'Dr. Vance is a true artist. He designed my veneers to match my facial features perfectly—not the fake chalky white you see elsewhere, but stunning, natural elegance. The automated reminders and digital portal kept me updated throughout.',
    verified: true,
    badge: 'Verified Cosmetic Patient'
  },
  {
    id: 'rev-3',
    patientName: 'Marcus Bennett',
    location: 'Mesa, AZ',
    rating: 5,
    date: '2026-09-08',
    treatment: 'Emergency Root Canal & Zirconia Crown',
    doctorName: 'Dr. Marcus Sterling',
    comment: 'I woke up on a Sunday with excruciating tooth pain. Orvexa answered my emergency call within 2 minutes. Dr. Sterling performed a gentle microscope root canal, and my pain was gone 100%. Highly recommended!',
    verified: true,
    badge: 'Verified Emergency Patient'
  },
  {
    id: 'rev-4',
    patientName: 'Samantha Green',
    location: 'Chandler, AZ',
    rating: 5,
    date: '2026-08-30',
    treatment: 'Single Tooth Implant & Bone Graft',
    doctorName: 'Dr. Sofia Al-Mansoor',
    comment: 'The 3D CT scan and detailed explanation gave me tremendous confidence. The titanium implant integrated seamlessly into my jawbone. Zero complications. Five stars all the way!',
    verified: true,
    badge: 'Verified Surgical Patient'
  }
];

let notifications = [
  {
    id: 'notif-1',
    title: 'New Appointment Booked',
    message: 'Kareem Ahmed has booked a 3D Implant Consultation on Sep 24 at 10:00 AM.',
    type: 'appointment',
    timestamp: '2026-09-22T05:10:00.000Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Automated SMS Reminder Dispatched',
    message: '24-hour pre-visit SMS reminder sent to Kareem Ahmed (+1 555-349-2180).',
    type: 'reminder',
    timestamp: '2026-09-22T04:45:00.000Z',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Patient Review Received',
    message: 'Robert Vance gave 5 stars for All-on-4 Full Arch Dental Implants.',
    type: 'doctor',
    timestamp: '2026-09-21T18:00:00.000Z',
    read: true
  }
];

// Lazy Gemini API client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// =================== REST API ROUTES ===================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    clinic: 'Orvexa Dental & Medical',
    serverTime: new Date().toISOString(),
    geminiActive: !!process.env.GEMINI_API_KEY
  });
});

// Doctors endpoints
app.get('/api/doctors', (req, res) => {
  res.json({ success: true, data: doctors });
});

app.put('/api/doctors/:id/availability', (req, res) => {
  const { id } = req.params;
  const { availableDays, availableHours, isAcceptingPatients, slotDurationMinutes, consultationFee } = req.body;
  
  const doctor = doctors.find(d => d.id === id);
  if (!doctor) {
    return res.status(404).json({ success: false, error: 'Doctor not found' });
  }

  if (availableDays) doctor.availableDays = availableDays;
  if (availableHours) doctor.availableHours = availableHours;
  if (typeof isAcceptingPatients === 'boolean') doctor.isAcceptingPatients = isAcceptingPatients;
  if (slotDurationMinutes) doctor.slotDurationMinutes = slotDurationMinutes;
  if (consultationFee) doctor.consultationFee = consultationFee;

  // Add notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Doctor Availability Updated',
    message: `${doctor.name} updated schedule settings (${doctor.availableDays.join(', ')}).`,
    type: 'doctor',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.json({ success: true, data: doctor, message: 'Availability schedule updated successfully' });
});

// Appointments endpoints
app.get('/api/appointments', (req, res) => {
  const { doctorId, status, date } = req.query;
  let filtered = [...appointments];

  if (doctorId) {
    filtered = filtered.filter(a => a.doctorId === doctorId);
  }
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post('/api/appointments', (req, res) => {
  const {
    patientName,
    patientEmail,
    patientPhone,
    doctorId,
    serviceCategory,
    date,
    timeSlot,
    isEmergency,
    notes,
    dentalHistory,
    insuranceProvider,
    paymentMethod,
    depositAmount
  } = req.body;

  if (!patientName || !doctorId || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: 'Missing required appointment fields' });
  }

  const doctor = doctors.find(d => d.id === doctorId);
  const doctorName = doctor ? doctor.name : 'Orvexa Specialist';
  const fee = depositAmount || (doctor ? doctor.consultationFee : 120);

  const refCode = `ORV-${Math.floor(1000 + Math.random() * 9000)}`;

  const newAppointment = {
    id: `apt-${Date.now()}`,
    bookingReference: refCode,
    patientName,
    patientEmail: patientEmail || 'patient@example.com',
    patientPhone: patientPhone || '+1 (555) 000-0000',
    doctorId,
    doctorName,
    serviceCategory: serviceCategory || 'Comprehensive Dental & Implant Consultation',
    date,
    timeSlot,
    status: 'confirmed' as const,
    isEmergency: !!isEmergency,
    notes: notes || '',
    dentalHistory: dentalHistory || 'No previous surgeries declared',
    insuranceProvider: insuranceProvider || 'Self-Pay',
    paymentStatus: paymentMethod ? ('deposit_paid' as const) : ('pending' as const),
    paymentAmount: fee,
    paymentMethod: paymentMethod || 'Pending at check-in',
    createdAt: new Date().toISOString(),
    remindersSent: [
      {
        id: `rem-init-${Date.now()}`,
        type: 'sms' as const,
        timestamp: new Date().toISOString(),
        message: `Orvexa Dental: Booking Confirmed! Ref: ${refCode}. Date: ${date} at ${timeSlot} with ${doctorName}.`,
        status: 'sent' as const
      }
    ],
    clinicalNotes: 'New consultation registered. Intake file opened.',
    prescriptions: []
  };

  appointments.unshift(newAppointment);

  // Automatically schedule 24-hour reminder alert
  automatedReminders.unshift({
    id: `rem-${Date.now()}`,
    appointmentId: newAppointment.id,
    patientName,
    patientPhone: newAppointment.patientPhone,
    patientEmail: newAppointment.patientEmail,
    doctorName,
    appointmentDate: date,
    appointmentTime: timeSlot,
    channel: 'SMS',
    scheduledLeadTime: '24 Hours Before',
    status: 'scheduled',
    messageTemplate: `Hi ${patientName}, your Orvexa Dental consultation (${serviceCategory}) with ${doctorName} is scheduled on ${date} at ${timeSlot}. Reply C to confirm.`
  });

  // Add in-app notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Appointment Booked',
    message: `${patientName} booked ${serviceCategory} on ${date} at ${timeSlot} (Ref: ${refCode}).`,
    type: 'appointment',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.status(201).json({
    success: true,
    data: newAppointment,
    message: 'Appointment successfully confirmed and scheduled'
  });
});

app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, clinicalNotes, prescriptions, paymentStatus } = req.body;

  const apt = appointments.find(a => a.id === id);
  if (!apt) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  if (status) apt.status = status;
  if (clinicalNotes !== undefined) apt.clinicalNotes = clinicalNotes;
  if (prescriptions) apt.prescriptions = prescriptions;
  if (paymentStatus) apt.paymentStatus = paymentStatus;

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Appointment Status Updated',
    message: `Appointment ${apt.bookingReference} for ${apt.patientName} changed to "${apt.status}".`,
    type: 'appointment',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.json({ success: true, data: apt, message: 'Appointment updated successfully' });
});

// Automated Reminders endpoints
app.get('/api/reminders', (req, res) => {
  res.json({ success: true, data: automatedReminders });
});

app.post('/api/reminders/:id/trigger', (req, res) => {
  const { id } = req.params;
  const reminder = automatedReminders.find(r => r.id === id);
  if (!reminder) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }

  reminder.status = 'dispatched';
  reminder.dispatchedAt = new Date().toISOString();

  // Also log into appointment
  const apt = appointments.find(a => a.id === reminder.appointmentId);
  if (apt) {
    apt.remindersSent.push({
      id: `rem-log-${Date.now()}`,
      type: (reminder.channel.toLowerCase().includes('sms') ? 'sms' : 'email') as any,
      timestamp: new Date().toISOString(),
      message: reminder.messageTemplate,
      status: 'delivered'
    });
  }

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `Automated ${reminder.channel} Reminder Dispatched`,
    message: `Sent to ${reminder.patientName} (${reminder.patientPhone}) for ${reminder.appointmentDate} appointment.`,
    type: 'reminder',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.json({
    success: true,
    data: reminder,
    message: `Automated reminder successfully dispatched via ${reminder.channel}`
  });
});

app.post('/api/reminders/:id/confirm-attendance', (req, res) => {
  const { id } = req.params;
  const reminder = automatedReminders.find(r => r.id === id);
  if (!reminder) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }

  reminder.status = 'confirmed_by_patient';

  const apt = appointments.find(a => a.id === reminder.appointmentId);
  if (apt) {
    apt.status = 'confirmed';
  }

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Patient Attendance Confirmed',
    message: `${reminder.patientName} confirmed their attendance via automated reminder link.`,
    type: 'appointment',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.json({ success: true, data: reminder, message: 'Attendance confirmed by patient' });
});

// Real-Time Chat & AI Dental Triage endpoints
app.get('/api/chat', (req, res) => {
  res.json({ success: true, data: chatMessages });
});

app.post('/api/chat', async (req, res) => {
  const { message, senderName, doctorId, isUrgent } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }

  const patientMsg = {
    id: `msg-${Date.now()}`,
    sender: 'patient' as const,
    senderName: senderName || 'Patient',
    doctorId: doctorId || 'doc-1',
    message: message.trim(),
    timestamp: new Date().toISOString(),
    isRead: false,
    isUrgent: !!isUrgent
  };

  chatMessages.push(patientMsg);

  // Auto-respond from doctor or clinical assistant
  let replyText = '';
  const selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];

  // Try Gemini if available
  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are the lead dental care coordinator and assistant for Orvexa Dental & Medical (inspired by premier implant centers like Sossaman Dental Implants). 
The patient just sent this message: "${message.trim()}".
The assigned doctor is ${selectedDoctor.name}, ${selectedDoctor.title}.
Provide a compassionate, authoritative, medically accurate response in 2 to 4 sentences. Address dental implant safety, 3D CT scan assessment, pain mitigation, or appointment scheduling clearly. Mention that Dr. ${selectedDoctor.name.split(' ')[1] || 'Sofia'} will review the patient's records during their in-clinic visit.`
              }
            ]
          }
        ]
      });

      if (response && response.text) {
        replyText = response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini chat generation failed, fallback to clinical rule-engine:', err);
    }
  }

  // Fallback clinical dental responses
  if (!replyText) {
    const lower = message.toLowerCase();
    if (lower.includes('pain') || lower.includes('hurt') || lower.includes('emergency') || lower.includes('swelling')) {
      replyText = `We take acute dental pain very seriously. Please take your approved pain medication and apply a cold compress to the exterior cheek (no direct heat). Our emergency suite with Dr. Sterling has been notified, and we can accommodate you right away today.`;
    } else if (lower.includes('cost') || lower.includes('price') || lower.includes('insurance') || lower.includes('financing')) {
      replyText = `At Orvexa Dental, we provide transparent upfront pricing and 0% APR financing options through CareCredit and LendingClub. Our Free 3D CT Scan ($450 value) is included with your comprehensive implant consultation to give you an exact, guaranteed quote.`;
    } else if (lower.includes('all-on-4') || lower.includes('full arch') || lower.includes('implant')) {
      replyText = `Dr. Sofia Al-Mansoor utilizes computer-guided 3D surgical templates for our titanium implants, ensuring minimal invasiveness and same-day provisional teeth. You will be completely comfortable throughout the procedure with our gentle sedation options.`;
    } else {
      replyText = `Thank you for reaching out to Orvexa Dental & Medical! Dr. ${selectedDoctor.name.split(' ')[1] || 'Sofia'} and our clinical surgical team have received your query. If you have any specific X-rays or prior dental records, you can bring them to your scheduled consultation.`;
    }
  }

  const doctorReplyMsg = {
    id: `msg-${Date.now() + 1}`,
    sender: 'doctor' as const,
    senderName: selectedDoctor.name,
    doctorId: selectedDoctor.id,
    message: replyText,
    timestamp: new Date(Date.now() + 800).toISOString(),
    isRead: false
  };

  chatMessages.push(doctorReplyMsg);

  res.status(201).json({
    success: true,
    patientMessage: patientMsg,
    doctorReply: doctorReplyMsg
  });
});

// Consultation History & Patient Records endpoints
app.get('/api/consultations', (req, res) => {
  const { email } = req.query;
  let records = [...consultationRecords];
  if (email) {
    records = records.filter(r => r.patientEmail.toLowerCase() === String(email).toLowerCase());
  }
  res.json({ success: true, data: records });
});

app.post('/api/consultations', (req, res) => {
  const {
    patientName,
    patientEmail,
    doctorName,
    specialty,
    primaryDiagnosis,
    treatmentPlan,
    prescriptions,
    xrayType,
    xraySummary,
    doctorNotes,
    invoiceAmount
  } = req.body;

  const newRecord = {
    id: `rec-${Date.now()}`,
    patientName: patientName || 'Patient',
    patientEmail: patientEmail || 'patient@example.com',
    date: new Date().toISOString().split('T')[0],
    doctorName: doctorName || 'Dr. Sofia Al-Mansoor',
    specialty: specialty || 'Oral & Maxillofacial Implantology',
    primaryDiagnosis: primaryDiagnosis || 'Comprehensive Clinical Exam & 3D Imaging Assessment',
    treatmentPlan: treatmentPlan || [
      { step: 1, title: 'Intraoral Digital Scanning', description: '3D virtual model generated.', status: 'completed' }
    ],
    prescriptions: prescriptions || [],
    xrayType: xrayType || 'High-Definition Cone Beam 3D CT',
    xraySummary: xraySummary || 'Stable bone density. No apical pathology observed.',
    doctorNotes: doctorNotes || 'Patient briefed on treatment roadmap.',
    invoiceAmount: invoiceAmount || 150,
    invoiceStatus: 'paid' as const,
    followUpDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  };

  consultationRecords.unshift(newRecord);
  res.status(201).json({ success: true, data: newRecord, message: 'Clinical consultation recorded' });
});

// Payments & Checkout endpoints
app.post('/api/payments', (req, res) => {
  const { appointmentId, amount, paymentMethod, cardLast4, patientName } = req.body;

  const transactionId = `TXN-ORV-${Math.floor(100000 + Math.random() * 900000)}`;

  // Update appointment payment if provided
  if (appointmentId) {
    const apt = appointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.paymentStatus = 'paid';
      apt.paymentMethod = `${paymentMethod || 'Card'} ending in ${cardLast4 || '4242'}`;
    }
  }

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Payment Received',
    message: `$${amount} received from ${patientName || 'Patient'} (Ref: ${transactionId}).`,
    type: 'payment',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.status(201).json({
    success: true,
    transactionId,
    amount,
    currency: 'USD',
    status: 'succeeded',
    receiptUrl: `/receipts/${transactionId}`,
    timestamp: new Date().toISOString()
  });
});

// Reviews & Feedback endpoints
app.get('/api/reviews', (req, res) => {
  res.json({ success: true, data: patientReviews });
});

app.post('/api/reviews', (req, res) => {
  const { patientName, location, rating, treatment, doctorName, comment } = req.body;

  if (!patientName || !comment || !rating) {
    return res.status(400).json({ success: false, error: 'Name, rating, and comment are required' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    patientName,
    location: location || 'Orvexa Verified Patient',
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    treatment: treatment || 'Comprehensive Dental Care',
    doctorName: doctorName || 'Dr. Sofia Al-Mansoor',
    comment,
    verified: true,
    badge: 'Verified Patient Review'
  };

  patientReviews.unshift(newReview);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Patient Feedback',
    message: `${patientName} posted a ${rating}-star review for ${treatment}.`,
    type: 'doctor',
    timestamp: new Date().toISOString(),
    read: false
  });

  res.status(201).json({ success: true, data: newReview, message: 'Review successfully submitted' });
});

// Notifications endpoints
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: notifications });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  notifications.forEach(n => { n.read = true; });
  res.json({ success: true });
});

// =================== VITE & STATIC SERVING ===================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Orvexa Dental & Medical server running on http://localhost:${PORT}`);
  });
}

startServer();
