import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

const REASONS = [
  'Plagiarism / Copyright Violation',
  'Hate Speech or Harassment',
  'Inappropriate / NSFW Content',
  'Misleading / Spam',
  'Defamation or Harmful Discourse'
];

export default function ReportModal({ targetPost, onClose, currentUser }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/moderation/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_id: currentUser?.id || 1,
          target_type: 'post',
          target_id: targetPost?.id,
          reason,
          details
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div 
        className="w-full max-w-lg rounded-3xl glass-panel-elevated bg-[#141219] border border-rose-500/30 p-6 sm:p-8 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Report Content</h3>
              <p className="text-xs text-slate-400 font-literary italic">Submit to Sahyaa Guardian Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-semibold text-emerald-200 text-sm">Report Submitted for Triage</h4>
            <p className="text-xs text-slate-400">Our Guardian moderators will review this piece against our literary community standards.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1 text-xs">
              <span className="text-slate-400">Target Piece:</span>
              <p className="font-semibold text-white truncate">{targetPost?.title}</p>
              <p className="text-slate-400 italic">By {targetPost?.author_name}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Violation Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
              >
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Context / Specific Details</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this content should be reviewed (e.g. copied lines without attribution, hate speech)..."
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none font-literary"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold text-rose-950 bg-rose-400 hover:bg-rose-300 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit to Moderation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
