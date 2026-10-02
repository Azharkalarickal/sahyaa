import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Feather, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Flame,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPenName, setRegPenName] = useState('');
  const [regRole, setRegRole] = useState('writer');
  const [regBio, setRegBio] = useState('');
  const [regLocation, setRegLocation] = useState('Kerala, India');
  const [regGenres, setRegGenres] = useState(['Poetry', 'Short Stories']);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onAuthSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Incorrect email or password. Please try again.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          pen_name: regPenName || regName,
          role: regRole,
          bio: regBio || 'Crafting stories and verses on Sahyaa.',
          location: regLocation,
          genres: regGenres
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onAuthSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Registration failed. Please check your information.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGenre = (genre) => {
    if (regGenres.includes(genre)) {
      setRegGenres(regGenres.filter(g => g !== genre));
    } else {
      setRegGenres([...regGenres, genre]);
    }
  };

  const availableGenres = [
    'Poetry', 'Short Stories', 'Essays & Criticism', 
    'Monsoon Lore', 'Magic Realism', 'Malayalam Literature', 'Regional Translations'
  ];

  return (
    <div className="min-h-screen w-full bg-[#080c10] text-[#e2e8f0] flex flex-col justify-between font-ui relative overflow-hidden selection:bg-emerald-800/40 selection:text-emerald-200">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0c1015]/60 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-emerald-950">
            <Feather className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-wide bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-400 bg-clip-text text-transparent">
              Sahyaa
            </h1>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              Social Literary Network
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="hidden sm:inline-text text-slate-400">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMsg('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/20 transition-all"
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Left Side: Brand Value Proposition & Features */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect, Publish & Read South Asian & Western Ghats Literature</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
            Where Stories Bloom & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Verses Resonate
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-literary max-w-xl mx-auto lg:mx-0">
            Sahyaa brings poets, storytellers, critics, and readers together into a rich social network. Publish your work, create stories, pitch to literary journals, and discuss art with fellow writers.
          </p>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Writer Studio</h4>
                <p className="text-[11px] text-slate-400">Prose & poetry modes with live word & read time metrics.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Literary Journals</h4>
                <p className="text-[11px] text-slate-400">Submit directly to themed issues and digital magazines.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Stories & Fleets</h4>
                <p className="text-[11px] text-slate-400">Share snippets, verse excerpts, and daily musings.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start space-x-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Social Reactions</h4>
                <p className="text-[11px] text-slate-400">Like, love, applaud, comment, and generate quote cards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121820]/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/60 relative">
            
            {/* Form Toggle Header */}
            <div className="flex p-1 rounded-2xl bg-black/40 border border-white/5 text-xs mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  mode === 'login' 
                    ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  mode === 'register' 
                    ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-shake">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Email Address or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. author@sahyaa.org or bard"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-emerald-400/80 hover:text-emerald-300 cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In to Sahyaa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#121820] text-slate-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Create New Writer Account</span>
                </button>
              </form>
            ) : (
              /* ================= REGISTER FORM ================= */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arundhati Roy"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Pen Name / Handle
                    </label>
                    <div className="relative">
                      <Feather className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Bard of Nilgiri"
                        value={regPenName}
                        onChange={(e) => setRegPenName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Create Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Primary Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'writer', label: 'Writer / Poet' },
                      { id: 'reader', label: 'Avid Reader' },
                      { id: 'editor', label: 'Journal Curator' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegRole(r.id)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                          regRole === r.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Genres of Interest
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableGenres.map((g) => {
                      const active = regGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                            active
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-3"
                >
                  {isSubmitting ? (
                    <span>Creating account...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>Accounts and data are permanently saved to <code className="text-emerald-400 font-mono">sahyaa.db</code></span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-white/5 text-slate-500 text-xs">
        © {new Date().getFullYear()} Sahyaa Literary Social Network • All rights reserved.
      </footer>
    </div>
  );
}
