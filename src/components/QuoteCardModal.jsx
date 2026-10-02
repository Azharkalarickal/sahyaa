import React, { useState } from 'react';
import { 
  X, 
  Quote, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Feather, 
  Layers,
  Palette
} from 'lucide-react';

const STYLES = [
  { id: 'emerald', label: 'Emerald Rain', bgClass: 'quote-bg-emerald', border: 'border-emerald-500/40' },
  { id: 'midnight', label: 'Royal Midnight', bgClass: 'quote-bg-midnight', border: 'border-indigo-500/40' },
  { id: 'parchment', label: 'Warm Parchment', bgClass: 'quote-bg-parchment', border: 'border-amber-700/30' },
  { id: 'sunset', label: 'Sunset Amber', bgClass: 'quote-bg-sunset', border: 'border-amber-500/40' },
  { id: 'minimal', label: 'Obsidian Minimal', bgClass: 'quote-bg-minimal', border: 'border-zinc-700' },
];

export default function QuoteCardModal({ 
  post, 
  onClose, 
  currentUser 
}) {
  const [style, setStyle] = useState('emerald');
  const [quoteText, setQuoteText] = useState(
    post?.featured_quote || 
    post?.excerpt || 
    (post?.content ? post.content.slice(0, 160) + '...' : 'We do not write poetry to escape our histories; we write so that longing has a sanctuary.')
  );
  const [authorName, setAuthorName] = useState(post?.pen_name || post?.author_name || currentUser?.pen_name || 'Kamala Das');
  const [workTitle, setWorkTitle] = useState(post?.title || 'The Scent of Wet Red Mud');
  const [copied, setCopied] = useState(false);
  const [savedToArchive, setSavedToArchive] = useState(false);

  const selectedStyle = STYLES.find(s => s.id === style) || STYLES[0];

  const handleCopyText = () => {
    const formatted = `"${quoteText}"\n\n— ${authorName}, "${workTitle}"\nRead on Sahyaa: ${window.location.origin}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToArchive = async () => {
    try {
      await fetch('/api/quote-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post?.id || 1,
          quote_text: quoteText,
          author_name: authorName,
          work_title: workTitle,
          theme_style: style
        })
      });
      setSavedToArchive(true);
      setTimeout(() => setSavedToArchive(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div 
        className="w-full max-w-2xl rounded-3xl glass-panel-elevated bg-[#121822] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Visual Quote Card Creator</h3>
              <p className="text-xs text-slate-400 font-literary italic">Craft & share memorable literary excerpts</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Palette Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>Card Aesthetics & Texture</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  style === s.id
                    ? 'border-emerald-400 ring-2 ring-emerald-500/40 bg-white/10 font-bold text-white'
                    : 'border-white/5 glass-panel text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Visual Card Preview */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-500">Live Preview</span>
          
          <div 
            id="quote-card-preview"
            className={`relative p-8 sm:p-12 rounded-3xl ${selectedStyle.bgClass} ${selectedStyle.border} shadow-2xl space-y-6 transition-all duration-300 overflow-hidden`}
          >
            {/* Ambient Watermark / Quote Mark */}
            <Quote className="absolute -top-4 -left-4 w-28 h-28 opacity-10 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <p className="font-literary text-xl sm:text-2xl italic leading-relaxed font-medium">
                "{quoteText}"
              </p>

              <div className="pt-4 border-t border-current/20 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base">{authorName}</h4>
                  <p className="text-xs opacity-80 font-literary italic">{workTitle}</p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono opacity-80">
                  <Feather className="w-3.5 h-3.5" />
                  <span>Sahyaa Lit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Inputs */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Quote Line</label>
            <textarea
              rows={2}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none font-literary italic"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Author Name / Pen Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Work Title</label>
              <input
                type="text"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handleSaveToArchive}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{savedToArchive ? 'Saved to Sahyaa Cards!' : 'Save to Platform Gallery'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md shadow-emerald-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Quote'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
