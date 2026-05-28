'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, BarChart3, Users, FileText, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { loginAction } from './actions';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] lg:flex bg-[#f8fafc]">

      {/* ============ MOBILE: Hero gradient header ============ */}
      <div className="lg:hidden relative overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 aurora-bg" />

        {/* Floating orbs */}
        <div className="absolute top-4 right-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-2 left-4 w-32 h-32 bg-indigo-400/15 rounded-full blur-2xl animate-float-delayed" />

        <div className="relative z-10 px-6 pt-safe-top pb-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 3rem)' }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white tracking-tight">SOLAYIA</span>
              <span className="text-blue-200/80 text-[10px] font-bold uppercase tracking-[0.2em]">CRM</span>
            </div>
          </div>
          <h1 className="text-[26px] font-bold text-white leading-tight tracking-tight">
            Bon retour<br />parmi nous
          </h1>
          <p className="text-blue-100/70 text-sm mt-2 leading-relaxed">
            Connectez-vous a votre espace de gestion
          </p>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,40 L0,20 Q720,0 1440,20 L1440,40 Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* ============ FORM SECTION ============ */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-5 sm:px-8 py-4 sm:py-6 lg:py-12 relative">
        {/* Desktop dot pattern */}
        <div className="hidden lg:block absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(15 23 42) 0.5px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />

        <div className="w-full max-w-[400px] relative z-10 animate-fade-in">
          {/* Desktop-only logo */}
          <div className="hidden lg:block mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-500/20 ring-1 ring-brand-400/20">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">SOLAYIA</span>
                <span className="text-brand-600 text-[11px] font-bold uppercase tracking-[0.2em]">CRM</span>
              </div>
            </div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-gray-500 mt-2.5 text-base">
              Connectez-vous pour acceder a votre espace de gestion
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2.5 animate-shake">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          {/* Form card — glass on mobile */}
          <div className="lg:bg-transparent">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Adresse email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors duration-200 group-focus-within:text-brand-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-[3px] focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 shadow-sm"
                    placeholder="votre@email.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors duration-200 group-focus-within:text-brand-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="w-full pl-11 pr-12 py-3.5 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-[3px] focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 shadow-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-0.5">
                <Link href="/forgot" className="text-[13px] text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-200 hover:underline underline-offset-2 cursor-pointer">
                  Mot de passe oublie ?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-brand-600/20 hover:shadow-brand-500/30 focus:outline-none focus:ring-[3px] focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer group">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile: features */}
          <div className="lg:hidden mt-6 flex flex-wrap gap-2 justify-center">
            {[
              { icon: Users, label: 'Prospects' },
              { icon: FileText, label: 'Devis' },
              { icon: BarChart3, label: 'Dashboard' },
              { icon: TrendingUp, label: 'Suivi' },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg text-xs font-medium border border-gray-100 shadow-sm">
                <feat.icon className="w-3.5 h-3.5 text-brand-500" />
                {feat.label}
              </div>
            ))}
          </div>

          {/* Info separator */}
          <div className="mt-6 sm:mt-8 mb-5 sm:mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* Demo hint */}
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-700 mb-0.5">Acces rapide</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Utilisez le compte cree dans votre Supabase Dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile footer */}
          <p className="lg:hidden text-center text-[11px] text-gray-400 mt-8 pb-4">
            &copy; {new Date().getFullYear()} Solayia &middot; CRM Professionnel
          </p>
        </div>
      </div>

      {/* ============ DESKTOP: Right visual panel ============ */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        {/* Multi-layer aurora background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 aurora-bg" />

        {/* Animated orbs */}
        <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-blue-400/15 rounded-full blur-[80px] animate-orb-1" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px] animate-orb-2" />
        <div className="absolute top-[50%] left-[40%] w-[200px] h-[200px] bg-cyan-400/10 rounded-full blur-[60px] animate-orb-3" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 xl:px-20">
          {/* Glowing logo */}
          <div className="relative mb-10 animate-fade-in-up">
            <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-white text-3xl font-bold">S</span>
            </div>
          </div>

          <h2 className="text-3xl xl:text-[40px] font-bold text-white mb-4 text-center leading-[1.15] tracking-tight animate-fade-in-up animation-delay-100">
            Pilotez votre activite<br />avec precision
          </h2>
          <p className="text-blue-100/60 text-base xl:text-lg leading-relaxed text-center max-w-[380px] mb-14 animate-fade-in-up animation-delay-200">
            Prospects, clients, devis et projets — votre business centralisé dans un espace intelligent.
          </p>

          {/* Feature cards with glass effect */}
          <div className="grid grid-cols-2 gap-3 xl:gap-4 w-full max-w-[380px] animate-fade-in-up animation-delay-300">
            {[
              { icon: Users, label: 'Prospects', desc: 'Pipeline commercial', color: 'from-blue-400/20 to-blue-500/10' },
              { icon: FileText, label: 'Devis', desc: 'Generation PDF', color: 'from-indigo-400/20 to-indigo-500/10' },
              { icon: BarChart3, label: 'Dashboard', desc: 'KPIs temps reel', color: 'from-cyan-400/20 to-cyan-500/10' },
              { icon: TrendingUp, label: 'Suivi', desc: 'Projets et CA', color: 'from-violet-400/20 to-violet-500/10' },
            ].map((feat) => (
              <div key={feat.label} className={`bg-gradient-to-br ${feat.color} backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 xl:p-5 hover:border-white/20 transition-all duration-300 group cursor-default hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/10`}>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/15 transition-colors duration-300">
                  <feat.icon className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-semibold text-white">{feat.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5 font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom stats with separator */}
          <div className="flex items-center gap-8 mt-12 animate-fade-in-up animation-delay-400">
            {[
              { value: '150+', label: 'Prospects' },
              { value: '98%', label: 'Satisfaction' },
              { value: '24/7', label: 'Accessible' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-white/40 mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
