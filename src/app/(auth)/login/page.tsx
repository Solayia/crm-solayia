'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen lg:flex bg-gray-50">

      {/* ============ MOBILE: Branded header ============ */}
      <div className="lg:hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 pt-12 pb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 -left-8 w-32 h-32 bg-brand-400/10 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-white tracking-tight">SOLAYIA</span>
              <span className="text-brand-200 text-[10px] font-bold uppercase tracking-widest">CRM</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white leading-snug">
            Bon retour parmi nous
          </h1>
          <p className="text-brand-200 text-sm mt-1">
            Connectez-vous a votre espace
          </p>
        </div>
      </div>

      {/* ============ FORM SECTION ============ */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-5 sm:px-8 py-6 sm:py-8 lg:py-12 relative">
        {/* Desktop: subtle dot pattern */}
        <div className="hidden lg:block absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(37 99 235) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="w-full max-w-[400px] relative z-10 animate-fade-in">
          {/* Desktop-only logo block */}
          <div className="hidden lg:block mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">SOLAYIA</span>
                <span className="text-brand-600 text-xs font-bold uppercase tracking-widest">CRM</span>
              </div>
            </div>
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Adresse email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors group-focus-within:text-brand-500" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-11 pr-4 py-3 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="votre@email.fr"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors group-focus-within:text-brand-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="w-full pl-11 pr-12 py-3 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot" className="text-[13px] text-brand-600 hover:text-brand-700 font-semibold transition-colors hover:underline underline-offset-2">
                Mot de passe oublie ?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-700/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] duration-200">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mobile: feature pills */}
          <div className="lg:hidden mt-6 flex flex-wrap gap-2 justify-center">
            {[
              { icon: Users, label: 'Prospects' },
              { icon: FileText, label: 'Devis' },
              { icon: BarChart3, label: 'Dashboard' },
              { icon: TrendingUp, label: 'Suivi' },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                <feat.icon className="w-3 h-3" />
                {feat.label}
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="mt-6 sm:mt-8 mb-5 sm:mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Info</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo hint */}
          <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[13px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Identifiants :</span>{' '}
              Utilisez le compte cree dans votre Supabase Dashboard.
            </p>
          </div>

          {/* Mobile: footer */}
          <p className="lg:hidden text-center text-[11px] text-gray-400 mt-6 pb-2">
            Solayia CRM &mdash; Gestion commerciale simplifiee
          </p>
        </div>
      </div>

      {/* ============ DESKTOP: Right visual panel ============ */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 animate-gradient" />

        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(at 20% 80%, rgba(255,255,255,0.3) 0, transparent 50%),
                           radial-gradient(at 80% 20%, rgba(255,255,255,0.2) 0, transparent 50%),
                           radial-gradient(at 50% 50%, rgba(255,255,255,0.1) 0, transparent 60%)`
        }} />

        {/* Floating shapes */}
        <div className="absolute top-20 left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-brand-400/10 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-2xl rotate-45 animate-float-slow" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 xl:px-16">
          {/* Logo icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 animate-fade-in-up">
            <span className="text-white text-2xl font-bold">S</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 text-center leading-tight animate-fade-in-up animation-delay-100">
            Gerez votre activite<br />en toute simplicite
          </h2>
          <p className="text-brand-200 text-base xl:text-lg leading-relaxed text-center max-w-sm mb-12 animate-fade-in-up animation-delay-200">
            Prospects, clients, devis et projets — pilotez votre business depuis un seul espace.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 xl:gap-4 w-full max-w-sm animate-fade-in-up animation-delay-300">
            {[
              { icon: Users, label: 'Prospects', desc: 'Pipeline commercial' },
              { icon: FileText, label: 'Devis', desc: 'Generation PDF' },
              { icon: BarChart3, label: 'Dashboard', desc: 'KPIs en temps reel' },
              { icon: TrendingUp, label: 'Suivi', desc: 'Projets et CA' },
            ].map((feat) => (
              <div key={feat.label} className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/[0.12] transition-all duration-300 group">
                <feat.icon className="w-5 h-5 text-brand-300 mb-2.5 group-hover:text-white transition-colors" />
                <p className="text-sm font-semibold text-white">{feat.label}</p>
                <p className="text-xs text-brand-300 mt-0.5">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-10 animate-fade-in-up animation-delay-400">
            {[
              { value: '150+', label: 'Prospects geres' },
              { value: '98%', label: 'Satisfaction' },
              { value: '24/7', label: 'Accessibilite' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-brand-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
