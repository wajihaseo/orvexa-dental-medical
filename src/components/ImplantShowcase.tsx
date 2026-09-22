import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Smile,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  DollarSign,
  ArrowRight,
  Layers,
  Cpu,
  HeartHandshake
} from 'lucide-react';
import { DENTAL_SERVICES } from '../data/servicesData';
import { DentalService } from '../types';

interface ImplantShowcaseProps {
  onSelectService?: (service: DentalService) => void;
  onStartBooking?: (serviceName?: string) => void;
  onSelectProcedure?: (serviceName?: string) => void;
}

export const ImplantShowcase: React.FC<ImplantShowcaseProps> = ({
  onSelectService,
  onStartBooking,
  onSelectProcedure
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [financeAmount, setFinanceAmount] = useState<number>(8500);
  const [financeMonths, setFinanceMonths] = useState<number>(24);

  const handleBooking = onSelectProcedure || onStartBooking || (() => {});

  // Calculate monthly payment estimate
  const monthlyEstimate = Math.round(financeAmount / financeMonths);

  const procedureSteps = [
    {
      step: 1,
      title: '3D CBCT Imaging & Robotic Planning',
      time: 'Day 1 • 30 Mins',
      desc: 'We capture an ultra-precise 3D anatomical model of your jawbone, sinus boundaries, and nerves. Using surgical software, we pre-place implants virtually to the exact millimeter.',
      features: ['Zero radiation guess-work', 'No goopy dental impressions', 'Custom surgical template printed']
    },
    {
      step: 2,
      title: 'Computer-Guided Flapless Placement',
      time: 'Day of Surgery',
      desc: 'Under gentle IV twilight sedation, biocompatible medical-grade titanium posts are placed through the 3D surgical guide. Flapless technique means minimal swelling and rapid healing.',
      features: ['Virtually painless with sedation', 'Less than 1 hour per arch', 'High primary bone stability']
    },
    {
      step: 3,
      title: 'Same-Day Fixed Provisional Smile',
      time: 'Within 2 to 3 Hours',
      desc: 'You never leave our clinic without teeth! Our on-site dental laboratory attaches a fixed, rock-solid provisional smile that looks beautiful and allows you to smile immediately.',
      features: ['Walk out with teeth the same morning', 'Immediate bite stabilization', 'Natural tooth aesthetics']
    },
    {
      step: 4,
      title: 'Final Handcrafted Zirconia Bridge',
      time: 'After 8-12 Weeks',
      desc: 'Once the titanium implants fuse permanently with your jawbone (osseointegration), we deliver your permanent monolithic Prettau® Zirconia bridge, designed for a lifetime of chewing.',
      features: ['Unbreakable monolithic zirconia', 'Individualized natural tooth contour', 'Lifetime surgical warranty']
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200" id="implant-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
            Advanced Implant Solutions
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Permanent Dental Implants: Precision Engineered for Life
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Inspired by world-class implant surgical practices, Orvexa delivers permanent teeth that feel, look, and chew just like natural teeth—backed by computer-guided 3D technology.
          </p>
        </div>

        {/* Comparison: All-on-4 Permanent Implants vs Traditional Dentures */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
              Why Patients Choose Fixed Implants Over Removable Dentures
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Compare the life-changing benefits of fixed full arch titanium restorations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fixed Implants Card */}
            <div className="rounded-xl p-6 bg-teal-950 text-white border-2 border-teal-500/40 relative shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="font-heading font-bold text-lg text-white">
                    Orvexa Fixed All-on-4® Implants
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-bold uppercase">
                  Gold Standard
                </span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>100% Fixed & Permanent:</strong> Screwed securely into jawbone; never taken out at night.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Full Chewing Capacity:</strong> Eat steaks, crisp apples, nuts, and crunchy foods with confidence.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Prevents Facial Bone Loss:</strong> Stimulates bone density and prevents premature aging/sunken cheeks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>No Roof-of-Mouth Plastic:</strong> Open palate allows full taste and temperature sensation.</span>
                </li>
              </ul>
              <button
                onClick={() => handleBooking('All-on-4 Full Arch Dental Implants')}
                className="mt-6 w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition"
              >
                Schedule All-on-4 Consultation &rarr;
              </button>
            </div>

            {/* Traditional Dentures Card */}
            <div className="rounded-xl p-6 bg-slate-50 text-slate-800 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-bold text-lg text-slate-700">
                  Traditional Removable Dentures
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-semibold uppercase">
                  Temporary Fix
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Slipping & Clicking:</strong> Slips during conversations and requires messy adhesives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Only 20% Chewing Force:</strong> Forces patients onto soft food diets; painful chewing sores.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Accelerates Bone Atrophy:</strong> Pressure on gums accelerates progressive bone resorption.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Palate Blocked:</strong> Thick plastic covers roof of mouth, muting food flavors.</span>
                </li>
              </ul>
              <div className="mt-6 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center">
                Upgrade your current dentures to permanent fixed implants in a single visit!
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Procedure Walkthrough */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Transparent Surgical Process
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                The 4-Stage Computer-Guided Journey
              </h3>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              From your initial 3D scan to your final handcrafted zirconia smile, here is how our surgical team delivers predictable excellence:
            </p>
          </div>

          {/* Step Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {procedureSteps.map(step => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeStep === step.step
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeStep === step.step ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Stage {step.step}
                  </span>
                  <span className={`text-[11px] ${activeStep === step.step ? 'text-slate-400' : 'text-slate-400'}`}>
                    {step.time}
                  </span>
                </div>
                <h4 className="font-bold text-sm leading-snug line-clamp-2">
                  {step.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Active Step Detail Card */}
          {(() => {
            const current = procedureSteps.find(s => s.step === activeStep) || procedureSteps[0];
            return (
              <div className="p-6 sm:p-8 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                      {current.step}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-xl text-slate-900">{current.title}</h4>
                      <span className="text-xs font-semibold text-teal-700">{current.time}</span>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {current.desc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {current.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto" />
                  <h5 className="font-bold text-sm text-slate-900">Dr. Sofia Al-Mansoor</h5>
                  <p className="text-xs text-slate-500">
                    "Every case is planned virtually prior to surgery, eliminating unexpected variables and safeguarding nerve structures."
                  </p>
                  <button
                    onClick={() => handleBooking(`Consultation: ${current.title}`)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    Discuss Stage {current.step} with Surgeon
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 0% APR Financing Calculator */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                <DollarSign className="w-3.5 h-3.5" /> Flexible Dental Financing
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Affordable Monthly Payments With $0 Down & 0% APR
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe financial considerations should never stand between you and a healthy, permanent smile. We partner with CareCredit, Proceed Finance, and LendingClub to offer accessible payment terms.
              </p>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Estimated Treatment Investment:</span>
                    <span className="font-bold text-white">${financeAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="25000"
                    step="500"
                    value={financeAmount}
                    onChange={(e) => setFinanceAmount(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>$1,500 (Single Implant)</span>
                    <span>$25,000 (Full Arch Restorations)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Preferred Financing Term:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 48].map(months => (
                      <button
                        key={months}
                        onClick={() => setFinanceMonths(months)}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          financeMonths === months
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {months} Mo
                        {months === 12 && <span className="block text-[9px] font-normal text-teal-950">0% APR</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/80 rounded-xl p-6 border border-slate-700 text-center space-y-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Estimated Monthly Payment
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-amber-400">
                  ${monthlyEstimate}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-400">
                Based on ${financeAmount.toLocaleString()} over {financeMonths} months. Actual APR varies based on credit pre-qualification.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleBooking(`Financing Application: $${financeAmount}`)}
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow transition"
                >
                  Pre-Qualify in 60 Seconds
                </button>
                <button
                  onClick={() => handleBooking('Insurance Benefits Verification')}
                  className="py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition"
                >
                  Verify Dental Insurance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Complete Clinical Capabilities
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Comprehensive Dental & Surgical Services
              </h3>
            </div>
            <button
              onClick={() => handleBooking()}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View Full Booking Schedule &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DENTAL_SERVICES.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {service.category}
                    </span>
                    {service.isPopular && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Popular
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-xs font-medium text-teal-700">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-1.5 pt-2 text-xs text-slate-600">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Cost</span>
                    <span className="text-xs font-bold text-slate-800">{service.priceEstimate}</span>
                  </div>
                  <button
                    onClick={() => handleBooking(service.name)}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white text-xs font-semibold transition"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
