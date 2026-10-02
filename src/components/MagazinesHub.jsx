import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  BookOpen, 
  Send, 
  Sparkles, 
  Award, 
  Calendar, 
  UserCheck, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Layers,
  ArrowUpRight,
  Feather,
  Quote
} from 'lucide-react';

export default function MagazinesHub({ 
  currentUser, 
  onSelectPost, 
  openStudio 
}) {
  const [magazines, setMagazines] = useState([]);
  const [selectedMag, setSelectedMag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [pitchNote, setPitchNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMagazines = () => {
    setLoading(true);
    fetch('/api/magazines')
      .then(r => r.json())
      .then(data => {
        setMagazines(data);
        if (data.length > 0 && !selectedMag) {
          fetchMagDetails(data[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchMagDetails = (id) => {
    fetch(`/api/magazines/${id}`)
      .then(r => r.json())
      .then(data => setSelectedMag(data));
  };

  useEffect(() => {
    fetchMagazines();
    // Fetch author's posts for submission picker
    if (currentUser?.id) {
      fetch(`/api/posts?author_id=${currentUser.id}`)
        .then(r => r.json())
        .then(posts => {
          setUserPosts(posts);
          if (posts.length > 0) setSelectedPostId(posts[0].id);
        });
    }
  }, [currentUser?.id]);

  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPostId || !selectedMag) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazine_id: selectedMag.id,
          post_id: Number(selectedPostId),
          author_id: currentUser?.id || 1,
          pitch_note: pitchNote || 'Submission to editorial committee.'
        })
      });

      if (res.ok) {
        setSuccessMsg('Your piece was submitted to the Editorial Board!');
        setTimeout(() => {
          setSuccessMsg('');
          setSubmitModalOpen(false);
          setPitchNote('');
        }, 2000);
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel-elevated bg-gradient-to-br from-[#06231c] via-[#0f1722] to-[#141b24] border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Curated Digital Publications</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Magazines & Literary Anthologies
          </h1>
          <p className="font-literary text-slate-300 text-base sm:text-lg italic leading-relaxed">
            Peer-curated journals publishing quarterly issues, regional translations, and groundbreaking voices from South Asia and the Western Ghats.
          </p>
        </div>
      </div>

      {/* Main Magazine Layout: Left Magazine Switcher, Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Magazine Directory */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">Active Journals</h3>
          
          <div className="space-y-3">
            {magazines.map(mag => (
              <div
                key={mag.id}
                onClick={() => fetchMagDetails(mag.id)}
                className={`p-5 rounded-2xl glass-panel border transition-all cursor-pointer flex items-start space-x-4 ${
                  selectedMag?.id === mag.id
                    ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg shadow-emerald-950/50'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <img
                  src={mag.cover_image}
                  alt={mag.title}
                  className="w-16 h-20 rounded-xl object-cover ring-1 ring-white/10 shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">{mag.frequency}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                      {mag.issues_count || 1} Issues
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-white truncate">{mag.title}</h4>
                  <p className="text-xs text-slate-400 font-literary italic line-clamp-2">{mag.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Magazine Issue & Submissions */}
        <div className="lg:col-span-2 space-y-8">
          {selectedMag ? (
            <div className="space-y-8">
              
              {/* Selected Journal Overview Card */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Literary Journal Profile</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">{selectedMag.title}</h2>
                    <p className="font-literary text-slate-300 italic text-sm mt-1">{selectedMag.tagline}</p>
                  </div>

                  {/* Submission Trigger Button */}
                  <button
                    onClick={() => setSubmitModalOpen(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Your Piece</span>
                  </button>
                </div>

                <p className="text-sm text-slate-300 font-literary leading-relaxed">
                  {selectedMag.description}
                </p>

                {/* Curator & Guidelines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Chief Curator & Editor</span>
                    <p className="text-sm font-semibold text-white">{selectedMag.curator_name || 'Dr. Ananya Roy'}</p>
                    <p className="text-xs text-slate-400 italic">{selectedMag.curator_bio || 'Literary Critic & Translator'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Submission Window</span>
                    <p className="text-sm font-semibold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Open for Issue Submissions</span>
                    </p>
                    <p className="text-xs text-slate-400">{selectedMag.submission_guidelines || 'Unpublished poetry & short fiction.'}</p>
                  </div>
                </div>
              </div>

              {/* Published Issues Section */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Published Editions & Issues</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMag.issues && selectedMag.issues.map(issue => (
                    <div key={issue.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                      {issue.cover_art && (
                        <img src={issue.cover_art} alt={issue.theme} className="w-full h-36 rounded-xl object-cover" />
                      )}
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                        <span>{issue.issue_number}</span>
                        <span>{issue.release_date}</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-white">{issue.theme}</h4>
                      <p className="text-xs text-slate-400 font-literary italic line-clamp-3">"{issue.curator_editorial}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Pieces in this Magazine */}
              {selectedMag.accepted_pieces && selectedMag.accepted_pieces.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Featured Works in this Anthology</span>
                  </h3>

                  <div className="space-y-3">
                    {selectedMag.accepted_pieces.map(piece => (
                      <div
                        key={piece.id}
                        onClick={() => onSelectPost({ id: piece.post_id, title: piece.title, excerpt: piece.excerpt, type: piece.type, genre: piece.genre, author_name: piece.author_name, cover_image: piece.cover_image })}
                        className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <Feather className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <div>
                            <h5 className="font-semibold text-white group-hover:text-emerald-300 transition-colors text-sm">{piece.title}</h5>
                            <p className="text-xs text-slate-400 font-literary italic">By {piece.pen_name || piece.author_name} • <span className="capitalize">{piece.type}</span></p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
              <p className="text-sm text-slate-400">Loading journal specifications...</p>
            </div>
          )}
        </div>

      </div>

      {/* Submit Pitch Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl glass-panel-elevated bg-[#131b26] border border-emerald-500/30 p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Submit to {selectedMag?.title}</h3>
                <p className="text-xs text-slate-400 italic">Chief Editor: {selectedMag?.curator_name}</p>
              </div>
              <button onClick={() => setSubmitModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="p-6 text-center space-y-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-emerald-200">{successMsg}</h4>
                <p className="text-xs text-slate-400">The Editorial Board will review your pitch in the Editorial Desk.</p>
              </div>
            ) : (
              <form onSubmit={handlePitchSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Select Piece from Your Archive</label>
                  {userPosts.length > 0 ? (
                    <select
                      value={selectedPostId}
                      onChange={(e) => setSelectedPostId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                    >
                      {userPosts.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.type})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-400 text-center">
                      <span>You haven't written any pieces yet.</span>
                      <button
                        type="button"
                        onClick={() => { setSubmitModalOpen(false); openStudio(); }}
                        className="ml-2 text-emerald-400 underline font-medium"
                      >
                        Open Writer Studio
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Author Pitch / Cover Letter</label>
                  <textarea
                    rows={4}
                    value={pitchNote}
                    onChange={(e) => setPitchNote(e.target.value)}
                    placeholder="Dear Editorial Board, I submit my piece for consideration for your upcoming issue..."
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none font-literary"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || userPosts.length === 0}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Pitch to Board'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
