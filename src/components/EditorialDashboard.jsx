import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Clock, 
  Feather, 
  User, 
  Sparkles, 
  BookMarked,
  Filter
} from 'lucide-react';

export default function EditorialDashboard({ currentUser, onSelectPost }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchSubmissions = () => {
    setLoading(true);
    const url = statusFilter === 'all' ? '/api/submissions' : `/api/submissions?status=${statusFilter}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setSubmissions(data);
        if (data.length > 0 && !selectedSub) setSelectedSub(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleReviewAction = async (newStatus) => {
    if (!selectedSub) return;
    try {
      const res = await fetch(`/api/submissions/${selectedSub.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          editorial_feedback: feedback || (newStatus === 'accepted' ? 'Accepted with distinction.' : 'Declined for this issue.')
        })
      });

      if (res.ok) {
        setActionSuccess(`Submission marked as ${newStatus.toUpperCase()}!`);
        setTimeout(() => setActionSuccess(''), 2500);
        fetchSubmissions();
      }
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Editorial Header Banner */}
      <div className="rounded-3xl p-8 glass-panel-elevated bg-gradient-to-r from-[#20180a] via-[#141c26] to-[#0c1015] border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Curator & Editorial Desk</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Submissions & Peer Review Hub
          </h1>
          <p className="font-literary text-slate-300 text-sm italic">
            Review literary pitches, evaluate poetry and essays, and curate upcoming anthology releases.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          {['all', 'pending', 'accepted', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                statusFilter === st ? 'bg-amber-500 text-amber-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Two Column Layout: Submissions List & Detailed Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Submission Queue */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
            Submitted Works ({submissions.length})
          </h3>

          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                onClick={() => { setSelectedSub(sub); setFeedback(sub.editorial_feedback || ''); }}
                className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer space-y-2 ${
                  selectedSub?.id === sub.id
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-md'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    sub.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    sub.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {sub.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{sub.magazine_title}</span>
                </div>

                <h4 className="font-display text-base font-bold text-white truncate">{sub.post_title}</h4>
                <p className="text-xs text-slate-300 font-literary italic">Author: {sub.author_pen_name || sub.author_name}</p>
                <p className="text-xs text-slate-400 line-clamp-2 italic">"{sub.pitch_note}"</p>
              </div>
            ))}

            {submissions.length === 0 && (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-xs text-slate-400">
                No submissions matching "{statusFilter}".
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Detailed Submission Reader & Action Desk */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSub ? (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
              
              {/* Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase">Target Journal: {selectedSub.magazine_title}</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">{selectedSub.post_title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted by <strong className="text-white">{selectedSub.author_name}</strong> ({selectedSub.author_pen_name}) • <span className="capitalize">{selectedSub.post_type}</span>
                  </p>
                </div>

                <button
                  onClick={() => onSelectPost({ id: selectedSub.post_id, title: selectedSub.post_title, content: selectedSub.post_content, author_name: selectedSub.author_name, type: selectedSub.post_type })}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium glass-panel text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center space-x-1"
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>Open Full Reader</span>
                </button>
              </div>

              {/* Pitch Note */}
              <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block">Author Pitch Note</span>
                <p className="font-literary italic text-slate-300 text-sm leading-relaxed">
                  "{selectedSub.pitch_note}"
                </p>
              </div>

              {/* Content Preview */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400">Literary Work Extract</span>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 font-literary text-slate-200 text-base leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                  {selectedSub.post_content}
                </div>
              </div>

              {/* Editorial Decision Box */}
              <div className="p-6 rounded-2xl bg-amber-950/15 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">Editorial Feedback & Decision</h4>
                  <span className="text-xs text-slate-400">Current Status: <strong className="text-white uppercase">{selectedSub.status}</strong></span>
                </div>

                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive critique or congratulations to author..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none font-literary"
                />

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleReviewAction('rejected')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Decline Piece</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('accepted')}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>Accept for Anthology Issue</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
              <p className="text-sm text-slate-400">Select a submission from the left queue to begin review.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
