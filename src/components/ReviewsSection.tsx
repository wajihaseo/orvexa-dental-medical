import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquarePlus,
  XCircle,
  Award,
  Filter,
  ThumbsUp
} from 'lucide-react';
import { PatientReview, Doctor } from '../types';
import { api } from '../services/api';

interface ReviewsSectionProps {
  reviews: PatientReview[];
  doctors: Doctor[];
  onRefreshReviews: () => void;
  onStartBooking: (serviceName?: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  doctors,
  onRefreshReviews,
  onStartBooking
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  // Form states
  const [reviewerName, setReviewerName] = useState<string>('');
  const [location, setLocation] = useState<string>('Phoenix, AZ');
  const [rating, setRating] = useState<number>(5);
  const [treatment, setTreatment] = useState<string>('All-on-4 Full Arch Dental Implants');
  const [doctorName, setDoctorName] = useState<string>(doctors[0]?.name || 'Dr. Sofia Al-Mansoor');
  const [comment, setComment] = useState<string>('');

  const filteredReviews = reviews.filter(r => {
    if (filterCategory === 'all') return true;
    return r.treatment.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const res = await api.submitReview({
      patientName: reviewerName.trim(),
      location: location.trim(),
      rating,
      treatment,
      doctorName,
      comment: comment.trim()
    });

    if (res.success) {
      setSubmitSuccess('Thank you! Your feedback has been verified and published.');
      onRefreshReviews();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess('');
        setComment('');
        setReviewerName('');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Aggregate Rating */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
              Verified Patient Stories
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Patient Experiences & Feedback
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Real testimonials from patients who recovered their chewing comfort, natural smiles, and confidence at Orvexa Dental & Medical.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="font-heading font-extrabold text-3xl text-slate-900">
                4.98
              </div>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">840+ Verified Reviews</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow transition flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave Patient Review</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Filter by procedure:</span>
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'implant', label: 'Dental Implants' },
            { id: 'veneer', label: 'Smile Makeover' },
            { id: 'emergency', label: 'Emergency Care' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-teal-500/50 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{rev.patientName}</h4>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{rev.location}</span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-semibold text-teal-800 bg-teal-50/60 px-2.5 py-1 rounded-lg inline-block">
                  {rev.treatment} • <span className="text-slate-600 font-normal">Treated by {rev.doctorName}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Date: {rev.date}</span>
                <span className="text-teal-700 font-semibold flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> Recommended
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= WRITE REVIEW MODAL ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Submit Patient Feedback
                  </h3>
                  <p className="text-xs text-slate-500">Share your dental transformation journey with future patients.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-900">{submitSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City, State</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Scottsdale, AZ"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Star Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Procedure</label>
                      <select
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="All-on-4 Full Arch Dental Implants">All-on-4 Full Arch</option>
                        <option value="Single Tooth Dental Implant">Single Tooth Implant</option>
                        <option value="Porcelain Veneers & Smile Makeover">Porcelain Veneers</option>
                        <option value="Emergency Tooth Pain Relief">Emergency Dental</option>
                        <option value="3D CT Scan & Implant Consultation">3D Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Treating Surgeon</label>
                      <select
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        {doctors.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe your surgical experience, pain management, staff care, or results..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
