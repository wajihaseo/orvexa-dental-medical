import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Heart,
  Calendar,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: any) => void;
  onStartBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartBooking }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900" id="clinic-footer">
      {/* Emergency CTA Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-teal-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 text-teal-400">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-teal-300">
                24/7 Dental Emergency Care Hotline
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Severe Tooth Pain, Broken Teeth, or Implant Issues?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:5559113368"
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition"
            >
              Call (555) 911-DENT
            </a>
            <button
              onClick={onStartBooking}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              Book Priority Triage
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs text-slate-400">
        {/* Col 1: Brand & Credentials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-extrabold font-heading text-lg">
              O
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight block">
                ORVEXA
              </span>
              <span className="text-[10px] text-teal-300 tracking-widest font-semibold block uppercase">
                Dental & Medical Center
              </span>
            </div>
          </div>

          <p className="leading-relaxed text-slate-300">
            Center of Excellence for Full-Arch Dental Implants, 3D Guided Maxillofacial Surgery, and Computerized Smile Restoration.
          </p>

          <div className="flex items-center gap-2 pt-2 text-teal-400 text-[11px] font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>HIPAA Compliant & Fully Accredited</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Patient Portal & Services
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-teal-400 transition"
              >
                Implant Procedures & Technology
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('booking')}
                className="hover:text-teal-400 transition"
              >
                Online Appointment Booking
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('reminders')}
                className="hover:text-teal-400 transition"
              >
                Automated SMS Reminders
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('patient-portal')}
                className="hover:text-teal-400 transition"
              >
                Consultation History & Prescriptions
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('chat')}
                className="hover:text-teal-400 transition"
              >
                Live Doctor Consultation Chat
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-teal-400 transition font-semibold text-teal-400"
              >
                Doctor Schedule Management &rarr;
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Clinical Hours */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Clinical Operating Hours
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Monday – Friday</span>
              <span className="font-semibold text-slate-200">7:30 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Saturday</span>
              <span className="font-semibold text-slate-200">8:00 AM – 3:30 PM</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Sunday</span>
              <span className="font-semibold text-rose-400">Emergency On-Call Only</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Same-day emergency surgical appointments guaranteed for severe acute trauma and pain.
          </p>
        </div>

        {/* Col 4: Location & Contact */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Center Location
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>4800 Surgical Pavilion Blvd, Suite 300, Phoenix, AZ 85016</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <span>(555) 911-3368 / (555) 800-ORVEXA</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>care@orvexadental.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Orvexa Dental & Medical Center. All rights reserved.</span>
          <span>Designed with clinical-grade encryption, automated multi-channel reminders, and telehealth workflows.</span>
        </div>
      </div>
    </footer>
  );
};
