import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Feather } from 'lucide-react';

export default function InstallAppBanner({ openInstallModal }) {
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(Boolean(isPWA));

    const isDismissed = localStorage.getItem('sahyaa_pwa_banner_dismissed');
    if (isDismissed) setDismissed(true);
  }, []);

  if (dismissed || isStandalone) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('sahyaa_pwa_banner_dismissed', 'true');
  };

  return (
    <div className="md:hidden sticky top-14 z-30 bg-gradient-to-r from-emerald-950/95 via-[#0e1720]/95 to-teal-950/95 border-b border-emerald-500/30 px-3.5 py-2.5 backdrop-blur-md flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
          <Feather className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate flex items-center space-x-1">
            <span>Install Sahyaa on Phone</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-mono">App</span>
          </p>
          <p className="text-[10px] text-slate-300 truncate">Faster reading & full-screen experience</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
        <button
          onClick={openInstallModal}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-[11px] shadow-sm flex items-center space-x-1 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
