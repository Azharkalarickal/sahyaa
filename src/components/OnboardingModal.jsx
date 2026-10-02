import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Feather, 
  BookOpen, 
  FileCheck2, 
  ShieldAlert, 
  Check, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

const GENRES = [
  'Poetry & Verse',
  'Short Fiction',
  'Essays & Criticism',
  'Monsoon Lore & Ecology',
  'Magic Realism',
  'Malayalam Literature',
  'Regional Translations',
  'Philosophy & Musings',
  'Oral Lore & Folklore'
];

export default function OnboardingModal({ 
  onClose, 
  onCompleteOnboarding 
}) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('writer');
  const [selectedGenres, setSelectedGenres] = useState(['Poetry & Verse', 'Monsoon Lore & Ecology']);
  const [name, setName] = useState('');
  const [penName, setPenName] = useState('');
  const [location, setLocation] = useState('Kerala, India');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGenre = (g) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter(item => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'New Bard',
          pen_name: penName || name || 'Bard',
          role: selectedRole,
          genres: selectedGenres,
          location: location || 'South Asia'
        })
      });

      if (res.ok) {
        const newUser = await res.json();
        onCompleteOnboarding(newUser);
        onClose();
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div 
        className="w-full max-w-xl rounded-3xl glass-panel-elevated bg-[#111722] border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Welcome to Sahyaa</h3>
              <p className="text-xs text-slate-400 font-literary italic">Calibrate your literary sanctuary</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Step {step} of 3</span>
          <div className="flex space-x-1.5">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-8 bg-emerald-400' : step > s ? 'w-4 bg-emerald-600' : 'w-4 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-white">How will you participate in Sahyaa?</h4>
              <p className="text-xs text-slate-300 font-literary italic">You can switch or expand your role anytime from the profile switcher.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'writer', title: 'Writer & Bard', desc: 'Publish poetry, stories, essays, and submit to magazines.', icon: Feather },
                { id: 'reader', title: 'Reader & Critic', desc: 'Immerse in literature, applaud, bookmark, and share quotes.', icon: BookOpen },
                { id: 'editor', title: 'Journal Curator', desc: 'Manage submissions and publish curated issues.', icon: FileCheck2 },
                { id: 'moderator', title: 'Guardian', desc: 'Safeguard literary standards & ethics.', icon: ShieldAlert },
              ].map(r => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      selectedRole === r.id
                        ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-500/40 text-white'
                        : 'border-white/10 glass-panel hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      {selectedRole === r.id && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <h5 className="font-semibold text-sm">{r.title}</h5>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Literary Interests / Taxonomy */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-white">Select your literary interests</h4>
              <p className="text-xs text-slate-300 font-literary italic">We customize your discover feed around these themes.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {GENRES.map(genre => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'glass-panel text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{genre}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pen Name & Region Registration */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-white">Your Literary Identity</h4>
              <p className="text-xs text-slate-300 font-literary italic">How should readers and editors address your work?</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamala Das"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Pen Name / Bard Handle (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Madhavikutty"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Location / Regional Landscape</label>
                <input
                  type="text"
                  placeholder="e.g. Malabar, Kerala, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20"
              >
                <UserCheck className="w-4 h-4 text-emerald-950" />
                <span>{isSubmitting ? 'Calibrating...' : 'Enter Sahyaa'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
