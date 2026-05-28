'use client';

import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from './actions';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getStrength = (pw: string) => {
    if (pw.length >= 12) return 4;
    if (pw.length >= 8) return 3;
    if (pw.length >= 6) return 2;
    return 1;
  };

  const strengthLabels = ['', 'Faible', 'Moyen', 'Bon', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthTextColors = ['', 'text-red-600', 'text-amber-600', 'text-blue-600', 'text-emerald-600'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] lg:flex bg-[#f8fafc]">

      {/* ============ MOBILE: Hero header ============ */}
      <div className="lg:hidden relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 aurora-bg" />
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
            {success ? 'Mot de passe\nmodifie !' : 'Nouveau\nmot de passe'}
          </h1>
          <p className="text-blue-100/70 text-sm mt-2">
            {success ? 'Vous pouvez vous connecter' : 'Choisissez un mot de passe securise'}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,40 L0,20 Q720,0 1440,20 L1440,40 Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* ============ FORM SECTION ============ */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-5 sm:px-8 py-4 sm:py-6 lg:py-12 relative">
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
              {success ? 'Mot de passe modifie !' : 'Nouveau mot de passe'}
            </h1>
            <p className="text-gray-500 mt-2.5 text-base">
              {success ? 'Vous pouvez maintenant vous connecter' : 'Choisissez un mot de passe securise'}
            </p>
          </div>

          {success ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-green-800 mb-1.5">Mot de passe mis a jour !</h3>
                <p className="text-[13px] text-green-700 leading-relaxed">
                  Votre mot de passe a ete modifie. Vous pouvez acceder a votre CRM.
                </p>
              </div>

              <Link href="/dashboard" className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-brand-600/20 active:scale-[0.97] cursor-pointer group">
                Acceder au CRM
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2.5 animate-shake">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors duration-200 group-focus-within:text-brand-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-12 py-3.5 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-[3px] focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 shadow-sm"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= getStrength(password) ? strengthColors[getStrength(password)] : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${strengthTextColors[getStrength(password)]}`}>
                        {strengthLabels[getStrength(password)]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Confirmer le mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors duration-200 group-focus-within:text-brand-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`w-full pl-11 pr-12 py-3.5 text-base sm:text-sm border rounded-xl bg-white focus:ring-[3px] outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 shadow-sm ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                          : 'border-gray-200 focus:ring-brand-500/10 focus:border-brand-500'
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {confirmPassword && confirmPassword === password && (
                      <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-emerald-500" />
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-brand-600/20 hover:shadow-brand-500/30 focus:outline-none focus:ring-[3px] focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer group mt-1"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Reinitialiser
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="lg:hidden text-center text-[11px] text-gray-400 mt-8 pb-4">
            &copy; {new Date().getFullYear()} Solayia &middot; CRM Professionnel
          </p>
        </div>
      </div>

      {/* ============ DESKTOP: Right visual panel ============ */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-blue-400/15 rounded-full blur-[80px] animate-orb-1" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px] animate-orb-2" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 xl:px-20">
          <div className="relative mb-10 animate-fade-in-up">
            <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl xl:text-[40px] font-bold text-white mb-4 text-center leading-[1.15] tracking-tight animate-fade-in-up animation-delay-100">
            Securisez<br />votre compte
          </h2>
          <p className="text-blue-100/60 text-base xl:text-lg leading-relaxed text-center max-w-[380px] mb-14 animate-fade-in-up animation-delay-200">
            Choisissez un mot de passe fort pour proteger votre espace CRM.
          </p>

          <div className="space-y-3 w-full max-w-[340px] animate-fade-in-up animation-delay-300">
            {[
              '8 caracteres minimum',
              'Melangez lettres, chiffres et symboles',
              'Evitez les mots de passe courants',
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-3.5 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-300 cursor-default hover:translate-y-[-1px]">
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-300" />
                </div>
                <p className="text-sm text-white/80 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
