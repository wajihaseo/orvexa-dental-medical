import React, { useState } from 'react';
import {
  PhoneCall,
  Calendar,
  Sparkles,
  Stethoscope,
  Clock,
  MessageSquare,
  Star,
  FileText,
  Menu,
  X,
  Shield,
  UserCheck,
  ChevronRight,
  Award
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationItem } from '../types';

export type TabType =
  | 'home'
  | 'booking'
  | 'dashboard'
  | 'reminders'
  | 'patient-portal'
  | 'chat'
  | 'reviews'
  | 'book'
  | 'doctor-dashboard'
  | 'portal'
  | string;

export interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: any) => void;
  notifications: NotificationItem[];
  onRefreshNotifications: () => void | Promise<void>;
  isDoctorMode?: boolean;
  isDoctorView?: boolean;
  onToggleDoctorMode?: () => void;
  onToggleDoctorView?: () => void;
  onOpenQuickBook?: () => void;
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  notifications,
  onRefreshNotifications,
  isDoctorMode = false,
  isDoctorView,
  onToggleDoctorMode,
  onToggleDoctorView,
  onOpenQuickBook,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const effectiveDoctorMode = isDoctorView !== undefined ? isDoctorView : isDoctorMode;
  const handleToggle = onToggleDoctorView || onToggleDoctorMode || (() => {});
  const handleBook = onOpenBooking || onOpenQuickBook || (() => onSelectTab('booking'));

  // Normalize active tab for highlighting
  const isTabActive = (itemId: string) => {
    if (activeTab === itemId) return true;
    if (itemId === 'book' && activeTab === 'booking') return true;
    if (itemId === 'booking' && activeTab === 'book') return true;
    if (itemId === 'doctor-dashboard' && activeTab === 'dashboard') return true;
    if (itemId === 'dashboard' && activeTab === 'doctor-dashboard') return true;
    if (itemId === 'portal' && activeTab === 'patient-portal') return true;
    if (itemId === 'patient-portal' && activeTab === 'portal') return true;
    return false;
  };

  const navItems = [
    { id: 'home', label: 'Home & Implants', icon: Sparkles },
    { id: 'booking', label: 'Book Appointment', icon: Calendar, badge: 'Instant' },
    { id: 'dashboard', label: 'Doctor Portal', icon: UserCheck, doctorOnly: true },
    { id: 'patient-portal', label: 'Patient Chart', icon: FileText },
    { id: 'reminders', label: 'Automated Reminders', icon: Clock, badge: 'Live' },
    { id: 'chat', label: 'Live Triage Chat', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top Hotline & Announcement Bar */}
      <div className="bg-slate-950 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-3 h-3" /> Special Offer
            </span>
            <span className="font-medium text-slate-300">
              Complimentary 3D CBCT Cone Beam Scan & Implant Consultation ($450 Value)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="tel:5559113368"
              className="flex items-center gap-1.5 font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>24/7 Dental Emergency: (555) 911-DENT</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Mon - Sat: 8:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 via-teal-900 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-950/20 border border-teal-600/30 group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <Shield className="w-6 h-6 text-teal-300" />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-xs">
                  O
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-950">
                  Orvexa
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
                  Dental & Medical
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide">
                Advanced Implants • Digital Smiles • 24/7 Care
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Doctor View Switcher */}
            <button
              id="doctor-mode-toggle"
              onClick={handleToggle}
              title={effectiveDoctorMode ? 'Switch to Patient View' : 'Switch to Doctor & Staff Portal'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                effectiveDoctorMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{effectiveDoctorMode ? 'Doctor Mode: Active' : 'Doctor Portal'}</span>
            </button>

            {/* In-App Notifications */}
            <NotificationDropdown
              notifications={notifications}
              onRefresh={onRefreshNotifications}
              onNavigateTab={onSelectTab}
            />

            {/* Primary Action Button */}
            <button
              id="quick-book-nav-btn"
              onClick={handleBook}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-md shadow-teal-900/15 transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={() => {
                handleToggle();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700"
            >
              {effectiveDoctorMode ? 'Exit Doctor Mode' : 'Switch to Doctor Portal'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                handleBook();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-700 text-white font-semibold shadow"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </button>

            <a
              href="tel:5559113368"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-teal-400 text-sm font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency: (555) 911-DENT</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
