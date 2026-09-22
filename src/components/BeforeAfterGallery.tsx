import React, { useState } from 'react';
import { Sparkles, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BEFORE_AFTER_CASES } from '../data/servicesData';

interface BeforeAfterGalleryProps {
  onStartBooking?: (serviceName?: string) => void;
  onBookConsultation?: (serviceName?: string) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  onStartBooking,
  onBookConsultation
}) => {
  const handleBooking = onBookConsultation || onStartBooking || (() => {});
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100

  const currentCase = BEFORE_AFTER_CASES[activeCaseIndex];

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800" id="before-after-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Clinical Case Transformations
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Real Patient Smiles. Real Results.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            View actual patient transformations from our implant surgical suite. Drag the interactive comparison bar to reveal the change.
          </p>
        </div>

        {/* Case Study Card */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Split Image Viewer */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden select-none bg-slate-900 border border-slate-800">
                {/* After Image (Full background) */}
                <img
                  src={currentCase.afterImg}
                  alt={`After: ${currentCase.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-teal-600/90 text-white text-xs font-bold shadow">
                  After Transformation
                </span>

                {/* Before Image (Clipped overlay) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={currentCase.beforeImg}
                    alt={`Before: ${currentCase.title}`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', minWidth: '400px' }}
                  />
                  <span className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md bg-slate-900/90 text-amber-300 text-xs font-bold shadow">
                    Before Treatment
                  </span>
                </div>

                {/* Slider divider line */}
                <div
                  className="absolute inset-y-0 w-1 bg-white shadow-2xl cursor-ew-resize z-30"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
                    ⇄
                  </div>
                </div>

                {/* Invisible native range slider for smooth touch & drag */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  aria-label="Drag before and after transformation slider"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                />
              </div>

              {/* Slider instruction */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>◀ Slide left to reveal AFTER</span>
                <span className="text-teal-400 font-semibold">Interactive 360° Slider</span>
                <span>Slide right to reveal BEFORE ▶</span>
              </div>
            </div>

            {/* Right: Clinical Case Details */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300">
                  Case {activeCaseIndex + 1} of {BEFORE_AFTER_CASES.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCaseIndex((prev) => (prev > 0 ? prev - 1 : BEFORE_AFTER_CASES.length - 1))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                    aria-label="Previous patient case"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveCaseIndex((prev) => (prev < BEFORE_AFTER_CASES.length - 1 ? prev + 1 : 0))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                    aria-label="Next patient case"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  {currentCase.title}
                </h3>
                <p className="text-sm font-semibold text-teal-400 mt-0.5">
                  {currentCase.patient}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 font-semibold block">Pre-Op Diagnosis:</span>
                  <p className="text-slate-200 mt-0.5">{currentCase.issue}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Surgical Solution:</span>
                  <p className="text-teal-300 font-medium mt-0.5">{currentCase.solution}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Time to Final Smile:</span>
                  <p className="text-amber-300 font-medium mt-0.5">{currentCase.timeframe}</p>
                </div>
              </div>

              <blockquote className="italic text-xs sm:text-sm text-slate-300 border-l-2 border-amber-400 pl-3">
                {currentCase.quote}
              </blockquote>

              <button
                onClick={() => handleBooking(`Consultation based on: ${currentCase.title}`)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow transition"
              >
                Schedule Similar Smile Makeover &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
