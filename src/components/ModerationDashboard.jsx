import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  FileText, 
  UserX, 
  Check, 
  Clock, 
  Lock,
  Feather
} from 'lucide-react';

export default function ModerationDashboard({ currentUser, onSelectPost }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/moderation/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data);
        if (data.length > 0 && !selectedReport) setSelectedReport(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveAction = async (newStatus) => {
    if (!selectedReport) return;
    try {
      const res = await fetch(`/api/moderation/resolve/${selectedReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolution_note: resolutionNote || `Action taken: ${newStatus}`,
          action_taken_by: currentUser?.id || 5
        })
      });

      if (res.ok) {
        setActionSuccess(`Report resolved as ${newStatus.replace('_', ' ').toUpperCase()}`);
        setTimeout(() => setActionSuccess(''), 2500);
        fetchReports();
      }
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Moderation Banner */}
      <div className="rounded-3xl p-8 glass-panel-elevated bg-gradient-to-r from-[#260f15] via-[#141c26] to-[#0c1015] border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sahyaa Guardian Desk</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Community Guidelines & Moderation Triage
          </h1>
          <p className="font-literary text-slate-300 text-sm italic">
            Safeguarding literary authenticity, copyright provenance, plagiarism detection, and civil literary discourse.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300">
          <span className="text-rose-400 font-bold">{reports.filter(r => r.status === 'pending').length}</span> Pending Triage
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Two Column Layout: Report Queue & Resolution Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Report List */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
            Flagged Items Queue ({reports.length})
          </h3>

          <div className="space-y-3">
            {reports.map(rep => (
              <div
                key={rep.id}
                onClick={() => { setSelectedReport(rep); setResolutionNote(rep.resolution_note || ''); }}
                className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer space-y-2 ${
                  selectedReport?.id === rep.id
                    ? 'border-rose-500/60 bg-rose-950/20 shadow-md'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    rep.status === 'pending' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    rep.status === 'content_removed' ? 'bg-red-500/30 text-red-200' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {rep.status}
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono font-medium">{rep.reason}</span>
                </div>

                <p className="text-xs text-slate-200 font-semibold truncate">Target ID #{rep.target_id} ({rep.target_type})</p>
                <p className="text-xs text-slate-400 font-literary italic line-clamp-2">"{rep.details || 'No additional notes provided by reporter.'}"</p>
                <p className="text-[10px] text-slate-500 font-mono">Reported by: {rep.reporter_name}</p>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-xs text-slate-400">
                All reports cleared. Platform healthy.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Resolution Console */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReport ? (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-rose-400 uppercase">Violation Triage Protocol</span>
                  <h2 className="font-display text-2xl font-bold text-white mt-1">Report #{selectedReport.id} — {selectedReport.reason}</h2>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/40 border border-white/10 text-slate-300">
                  Target: {selectedReport.target_type} #{selectedReport.target_id}
                </span>
              </div>

              {/* Reporter Info & Claim */}
              <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-rose-300 uppercase tracking-wider block">Reporter Claim & Context</span>
                <p className="font-literary italic text-slate-200 text-sm leading-relaxed">
                  "{selectedReport.details || 'Flagged for violating community standards.'}"
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Submitted by <strong>{selectedReport.reporter_name}</strong> on {new Date(selectedReport.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Resolution Form & Actions */}
              <div className="p-6 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold">Guardian Resolution Action</h4>
                
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Explain resolution audit note (e.g., Reviewed piece: verified original folklore adaptation, cleared)..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none font-literary"
                />

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleResolveAction('reviewed_cleared')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Clear & Dismiss (No Violation)</span>
                  </button>

                  <button
                    onClick={() => handleResolveAction('user_warned')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Issue Author Warning</span>
                  </button>

                  <button
                    onClick={() => handleResolveAction('content_removed')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-950 bg-rose-400 hover:bg-rose-300 shadow-md shadow-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-rose-950" />
                    <span>Quarantine & Remove Content</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
              <p className="text-sm text-slate-400">Select a report from the queue.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
