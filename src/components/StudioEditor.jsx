import React, { useState } from 'react';
import { 
  X, 
  Feather, 
  BookOpen, 
  Sparkles, 
  Image as ImageIcon, 
  Send, 
  Save, 
  Eye, 
  Quote, 
  Layers, 
  HelpCircle,
  CheckCircle2,
  BookMarked
} from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Monsoon Rains', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Teak Library', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Western Ghats Mist', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Ancient Veranda', url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Midnight Transit', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80' },
];

export default function StudioEditor({ 
  onClose, 
  currentUser, 
  magazines = [], 
  onPublishSuccess 
}) {
  const [type, setType] = useState('poem'); // poem, story, essay, musing
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [genre, setGenre] = useState('Poetry');
  const [language, setLanguage] = useState('English');
  const [tagsInput, setTagsInput] = useState('Monsoon, Poetry, Sahyaa');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [featuredQuote, setFeaturedQuote] = useState('');
  const [submitToMagazine, setSubmitToMagazine] = useState(false);
  const [selectedMagazineId, setSelectedMagazineId] = useState(magazines[0]?.id || 1);
  const [pitchNote, setPitchNote] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live statistics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));
  const stanzaCount = type === 'poem' ? (content.split(/\n\s*\n/).filter(Boolean).length || 1) : null;

  const handleSubmit = async (targetStatus = 'published') => {
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and literary content.');
      return;
    }

    setIsSubmitting(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: currentUser?.id || 1,
          title,
          content,
          excerpt: excerpt || content.slice(0, 160).replace(/\n/g, ' ') + '...',
          type,
          genre,
          language,
          tags,
          cover_image: coverImage,
          featured_quote: featuredQuote,
          status: targetStatus,
          read_time_mins: readTime,
          submit_to_magazine_id: submitToMagazine ? selectedMagazineId : null,
          pitch_note: pitchNote
        })
      });

      if (res.ok) {
        const data = await res.json();
        onPublishSuccess(data, submitToMagazine);
        onClose();
      } else {
        const err = await res.json();
        alert(`Error publishing: ${err.error}`);
      }
    } catch (e) {
      alert('Network error while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div 
        className="w-full max-w-5xl min-h-screen sm:min-h-0 sm:rounded-3xl glass-panel-elevated bg-[#0e141c] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Studio Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#131b26]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Writer's Studio & Publishing Engine</h2>
              <p className="text-xs text-slate-400 font-literary italic">Author: {currentUser?.name} ({currentUser?.pen_name})</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                showPreview 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'glass-panel text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Edit Mode' : 'Live Preview'}</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-panel text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Direct Publish */}
            <button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitToMagazine ? 'Submit Pitch' : 'Publish Piece'}</span>
            </button>

            {/* Close Studio */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* Format Picker */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel bg-black/20 border border-white/5 w-fit">
            {[
              { id: 'poem', label: 'Lyrical Poetry / Verse', icon: Feather },
              { id: 'story', label: 'Short Story', icon: BookOpen },
              { id: 'essay', label: 'Literary Essay', icon: Sparkles },
              { id: 'musing', label: 'Micro-Musing', icon: Quote },
            ].map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setType(f.id);
                    if (f.id === 'poem') setGenre('Poetry');
                    if (f.id === 'story') setGenre('Short Stories');
                    if (f.id === 'essay') setGenre('Essays & Criticism');
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    type === f.id
                      ? 'bg-emerald-500 text-emerald-950 font-semibold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {!showPreview ? (
            /* Editing Workspace */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Main Title & Text Editor */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Title Input */}
                <input
                  type="text"
                  placeholder={type === 'poem' ? "Poem Title (e.g. The Monsoon Veranda)..." : "Story or Essay Title..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 rounded-2xl glass-panel bg-black/30 border border-white/10 font-display text-2xl sm:text-3xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />

                {/* Excerpt / Subtitle */}
                <input
                  type="text"
                  placeholder="Short excerpt or evocative subtitle (shown on social cards)..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-3 rounded-xl glass-panel bg-black/20 border border-white/10 text-sm font-literary italic text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />

                {/* Main Content Area */}
                <div className="relative">
                  <textarea
                    rows={14}
                    placeholder={
                      type === 'poem'
                        ? "Pen your verses here...\n\nLeave an empty line to separate stanzas.\nLet the rhythms and imagery breathe naturally."
                        : "Begin your narrative or essay here...\n\nCraft characters, dialogue, reflections, or philosophical inquiry."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full p-6 rounded-2xl glass-panel bg-black/40 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-literary ${
                      type === 'poem' ? 'poetry-content text-base sm:text-lg' : 'text-base sm:text-lg leading-relaxed'
                    }`}
                  />

                  {/* Live Word Count & Metrics Pill */}
                  <div className="absolute right-4 bottom-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-400 flex items-center space-x-3">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{readTime} min read</span>
                    {stanzaCount && (
                      <>
                        <span>•</span>
                        <span>{stanzaCount} stanzas</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Featured Quote Extractor */}
                <div className="p-4 rounded-2xl glass-panel bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-medium text-emerald-300">
                    <Quote className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Featured Quote (Highlighted on Social Feeds & Quote Cards)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="E.g., We do not write poetry to escape our histories; we write so longing has a sanctuary."
                    value={featuredQuote}
                    onChange={(e) => setFeaturedQuote(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs font-literary italic text-emerald-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

              </div>

              {/* Right Col: Metadata, Cover Art & Magazine Submission */}
              <div className="space-y-4">
                
                {/* Taxonomy & Genre */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Literary Metadata</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Primary Genre</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Poetry">Poetry & Verse</option>
                      <option value="Short Stories">Short Stories</option>
                      <option value="Essays & Criticism">Essays & Criticism</option>
                      <option value="Monsoon Lore">Monsoon Lore & Nature</option>
                      <option value="Magic Realism">Magic Realism & Folklore</option>
                      <option value="Translations">Regional Translations</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Language / Dialect</label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="English, Malayalam, etc."
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Cover Art Chooser */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Cover Art</h4>
                    <span className="text-[10px] text-emerald-400">Presets</span>
                  </div>
                  
                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {COVER_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCoverImage(p.url)}
                        className={`relative h-14 rounded-xl overflow-hidden border transition-all ${
                          coverImage === p.url ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] font-medium text-white px-1 text-center">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Custom Image URL..."
                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 focus:outline-none"
                  />
                </div>

                {/* Literary Magazine Submission Option */}
                <div className="p-5 rounded-2xl glass-panel bg-amber-950/15 border border-amber-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookMarked className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-semibold text-amber-200">Submit to Literary Journal</h4>
                    </div>
                    <input
                      type="checkbox"
                      checked={submitToMagazine}
                      onChange={(e) => setSubmitToMagazine(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 accent-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-literary">
                    Pitch this piece directly to peer-curated literary journals like <em className="text-amber-300">The Monsoon Review</em> for editorial review and issue publication.
                  </p>

                  {submitToMagazine && (
                    <div className="space-y-3 pt-2 border-t border-amber-500/20 animate-in fade-in duration-200">
                      <div>
                        <label className="text-[11px] text-amber-300/90 block mb-1">Target Journal</label>
                        <select
                          value={selectedMagazineId}
                          onChange={(e) => setSelectedMagazineId(Number(e.target.value))}
                          className="w-full p-2 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-white focus:outline-none"
                        >
                          {magazines.map(m => (
                            <option key={m.id} value={m.id}>{m.title} ({m.frequency})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-amber-300/90 block mb-1">Pitch Note to Chief Editor</label>
                        <textarea
                          rows={3}
                          value={pitchNote}
                          onChange={(e) => setPitchNote(e.target.value)}
                          placeholder="Dear Editor, I submit this lyrical piece exploring rain lore in Malabar..."
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-white placeholder-slate-600 focus:outline-none font-literary"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            /* Live Reader Preview Screen */
            <div className="max-w-2xl mx-auto p-8 rounded-3xl glass-panel border border-emerald-500/30 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase">Live Reader Preview</span>
                <h1 className="font-display text-3xl font-bold text-white">{title || 'Untitled Piece'}</h1>
                <p className="text-xs text-slate-400 italic">By {currentUser?.pen_name || currentUser?.name}</p>
              </div>

              {coverImage && (
                <img src={coverImage} alt="Cover" className="w-full h-64 rounded-2xl object-cover" />
              )}

              {featuredQuote && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border-l-4 border-emerald-500 italic text-emerald-300 font-literary">
                  "{featuredQuote}"
                </div>
              )}

              <div className={`text-slate-200 font-literary text-lg ${type === 'poem' ? 'poetry-content text-center' : 'leading-relaxed'}`}>
                {content || 'Your verses or story content will preview here...'}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
