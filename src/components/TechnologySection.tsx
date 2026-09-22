import React from 'react';
import { Cpu, Scan, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { CLINIC_TECHNOLOGY } from '../data/servicesData';

interface TechnologySectionProps {
  onScheduleScan?: () => void;
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({ onScheduleScan }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Scan className="w-6 h-6 text-teal-600" />;
      case 1: return <Cpu className="w-6 h-6 text-cyan-600" />;
      case 2: return <ShieldCheck className="w-6 h-6 text-amber-600" />;
      default: return <Zap className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200" id="technology">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
            Digital Surgical Suite
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Advanced Clinical Technology
          </h2>
          <p className="text-base text-slate-600">
            We invest in surgical innovations that make dental implant procedures faster, minimally invasive, and virtually pain-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CLINIC_TECHNOLOGY.map((tech, idx) => (
            <div
              key={tech.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                  {getIcon(idx)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                    {tech.tag}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mt-2">
                    {tech.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-teal-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {tech.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {onScheduleScan && (
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-lg text-white">Experience Guided Surgical Precision</h4>
              <p className="text-xs text-slate-300">Book your complimentary high-definition 3D Cone Beam CT scan today ($450 value, zero obligation).</p>
            </div>
            <button
              onClick={onScheduleScan}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition whitespace-nowrap"
            >
              Schedule 3D Scan &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
