import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { OKRGoal, PerformanceReview } from '../types/ems';
import {
  Target,
  Award,
  Star,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  X,
  Sliders,
} from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { okrs, updateOKRProgress, reviews, addReview, employees } = useEMS();
  const [activeTab, setActiveTab] = useState<'okrs' | 'reviews'>('okrs');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // New review form state
  const [revieweeId, setRevieweeId] = useState(employees[3]?.id || employees[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [strengthsText, setStrengthsText] = useState('Deep domain knowledge, proactive problem solver');
  const [growthText, setGrowthText] = useState('Delegate more operational tasks');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Please include appraisal comments.');
      return;
    }
    const emp = employees.find((e) => e.id === revieweeId);
    if (!emp) return;

    addReview({
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      reviewerId: 'emp-admin',
      reviewerName: 'Kavita Patel (People Ops Director)',
      cycle: 'Q4 2026 Appraisal',
      rating,
      feedback,
      strengths: strengthsText.split(',').map((s) => s.trim()).filter(Boolean),
      areasForImprovement: growthText.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsReviewModalOpen(false);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('okrs')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'okrs'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Objectives & Key Results (OKRs)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'reviews'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            360° Appraisals & Feedback
          </button>
        </div>

        {activeTab === 'reviews' && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write Performance Appraisal</span>
          </button>
        )}
      </div>

      {activeTab === 'okrs' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>Quarter: <strong>Q3 FY26-27 Corporate OKRs (India)</strong></span>
            <span>Adjust sliders below to simulate progress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {okrs.map((okr) => {
              const percent = Math.min(100, Math.round((okr.currentValue / okr.targetValue) * 100));

              return (
                <div
                  key={okr.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4 shadow-xs hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                          {okr.category}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span className="text-[11px] text-neutral-500">{okr.department}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 mt-1 leading-snug">
                        {okr.title}
                      </h4>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                        okr.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : okr.status === 'On Track'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {okr.status}
                    </span>
                  </div>

                  {/* Progress Bar & Value */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono tabular-nums text-neutral-700">
                        {okr.currentValue} / {okr.targetValue} {okr.unit}
                      </span>
                      <span className="font-mono tabular-nums font-bold text-neutral-900">
                        {percent}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${
                          percent >= 100 ? 'bg-emerald-600' : percent >= 60 ? 'bg-neutral-900' : 'bg-amber-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Slider */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                    <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                      Update Value:
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={okr.targetValue}
                      step={okr.unit.includes('$M') ? 0.1 : 1}
                      value={okr.currentValue}
                      onChange={(e) => updateOKRProgress(okr.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                    />
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    Lead: <strong className="text-neutral-700">{okr.ownerName}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Performance Reviews List */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{rev.employeeName}</h4>
                    <p className="text-xs text-neutral-500">{rev.cycle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold font-mono text-neutral-800 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "{rev.feedback}"
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                      Demonstrated Strengths
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rev.strengths.map((str, i) => (
                        <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-neutral-600 uppercase">
                      Growth & Focus Areas
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rev.areasForImprovement.map((area, i) => (
                        <span key={i} className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 pt-1 flex justify-between font-mono">
                  <span>Reviewed by {rev.reviewerName}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Appraisal Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-base font-bold text-neutral-900">Write Performance Appraisal</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Employee to Review</label>
                <select
                  value={revieweeId}
                  onChange={(e) => setRevieweeId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-colors ${
                        rating === val
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Detailed Qualitative Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail sprint impact, teamwork, and technical contributions..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Key Strengths (comma-separated)
                </label>
                <input
                  type="text"
                  value={strengthsText}
                  onChange={(e) => setStrengthsText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Growth Areas (comma-separated)
                </label>
                <input
                  type="text"
                  value={growthText}
                  onChange={(e) => setGrowthText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Submit Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
