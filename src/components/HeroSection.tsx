import React from 'react';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  PhoneCall,
  Clock,
  Star,
  Zap,
  Activity
} from 'lucide-react';

interface HeroSectionProps {
  onStartBooking: (serviceName?: string) => void;
  onExploreCases?: () => void;
  onExploreServices?: () => void;
  onOpenTriage?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onExploreCases,
  onExploreServices,
  onOpenTriage
}) => {
  const handleCases = onExploreCases || onExploreServices || (() => {
    document.getElementById('before-after-gallery')?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleTriage = onOpenTriage || (() => {
    document.getElementById('live-chat')?.scrollIntoView({ behavior: 'smooth' });
  });
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      {/* Subtle ambient lighting circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              <span>Center of Excellence for Full Arch & Dental Implants</span>
              <span className="text-teal-600">•</span>
              <span className="text-amber-300 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> 4.98 (840+ Reviews)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Life-Changing <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-cyan-400">Dental Implants</span> & Permanent Smiles.
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              Restore your chewing power and self-confidence with computer-guided All-on-4® full arch restorations and aesthetic porcelain makeovers. Enjoy same-day fixed teeth, zero bone-graft surgery options, and gentle twilight sedation.
            </p>

            {/* Key Clinical Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Same-Day Fixed Teeth</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Lifetime Fixture Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero-Anxiety Sedation</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
              <button
                id="hero-book-now-btn"
                onClick={() => onStartBooking()}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-900/30 transition-all active:scale-95 group"
              >
                <Calendar className="w-5 h-5 text-teal-200 group-hover:scale-110 transition-transform" />
                <span>Book Patient Consultation</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </button>

              <button
                id="hero-cases-btn"
                onClick={handleCases}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>View Before & Afters</span>
              </button>

              <button
                id="hero-triage-btn"
                onClick={handleTriage}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-teal-300 font-medium text-sm border border-teal-800/40 transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Live Dental Triage</span>
              </button>
            </div>

            {/* Emergency note */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>In severe dental pain? Call our 24/7 priority emergency line:</span>
              <a href="tel:5559113368" className="text-amber-400 font-bold hover:underline">
                (555) 911-DENT
              </a>
            </div>
          </div>

          {/* Right Column: Free 3D CT Scan Offer & Clinical Feature Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900/90 p-6 sm:p-7 border border-teal-500/30 shadow-2xl shadow-slate-950">
              {/* Highlight ribbon */}
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> $450 Value • Zero Obligation
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      Complimentary 3D CT Scan & Implant Blueprint
                    </h3>
                    <p className="text-xs text-slate-400">
                      High-Definition CBCT Diagnostic Imaging & Surgical Assessment
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>High-Resolution 3D Cone Beam Scan:</strong> Evaluates jawbone density, nerve channels, and sinus cavities.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Doctor Consultation with Surgical Director:</strong> 1-on-1 assessment with Dr. Sofia Al-Mansoor or Dr. Tariq Vance.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Transparent Cost Breakdown:</strong> Itemized surgical quote with 0% APR financing options ($0 Down).</span>
                  </div>
                </div>

                {/* Instant Claim Button */}
                <button
                  id="claim-scan-btn"
                  onClick={() => onStartBooking('Complimentary 3D CT Scan & Implant Consultation')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Claim Your Free 3D CT Scan Voucher</span>
                </button>

                {/* Stat Bar */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
                  <div>
                    <div className="font-heading font-extrabold text-xl text-teal-300">99.4%</div>
                    <div className="text-[11px] text-slate-400">Implant Success</div>
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-xl text-white">16,000+</div>
                    <div className="text-[11px] text-slate-400">Smiles Created</div>
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-xl text-amber-400">0% APR</div>
                    <div className="text-[11px] text-slate-400">Financing Plans</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
