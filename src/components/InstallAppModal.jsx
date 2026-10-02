import React from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  Sparkles, 
  Feather,
  Zap,
  BookOpen
} from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose, deferredPrompt, isInstalled }) {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onClose();
      }
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#121924] border border-emerald-500/30 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-emerald-950">
              <Feather className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Install Sahyaa App</h3>
              <p className="text-xs text-emerald-400 font-medium">Add to your Phone Home Screen</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="space-y-2.5 py-1">
          <div className="flex items-center space-x-3 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Opens in full-screen standalone mobile app mode</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Fast instant launch with zero app-store download waiting</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
            <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Seamless reading, writing, and notifications</span>
          </div>
        </div>

        {/* Action button based on platform */}
        {deferredPrompt ? (
          <button
            onClick={handleInstallClick}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Install App on Phone</span>
          </button>
        ) : isIOS ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
            <p className="font-semibold text-emerald-300 flex items-center space-x-1.5">
              <span>How to Install on iPhone / iPad:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Tap the <span className="text-white font-bold inline-flex items-center"><Share2 className="w-3.5 h-3.5 mx-1" /> Share</span> button at the bottom of Safari.</li>
              <li>Scroll down and tap <span className="text-white font-bold inline-flex items-center"><PlusSquare className="w-3.5 h-3.5 mx-1" /> Add to Home Screen</span>.</li>
              <li>Tap <span className="text-emerald-400 font-bold">Add</span> in the top right corner.</li>
            </ol>
          </div>
        ) : isInstalled ? (
          <div className="p-3 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 text-xs text-emerald-300 text-center font-medium flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sahyaa App is already installed on this device!</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-white">To install on your mobile browser:</p>
            <p className="text-slate-400">
              Open your browser menu (three dots <span className="text-white font-bold">⋮</span> in Chrome/Edge or Share in Safari) and select <span className="text-emerald-400 font-bold">"Add to Home screen"</span> or <span className="text-emerald-400 font-bold">"Install app"</span>.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
