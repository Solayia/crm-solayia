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
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
  const strengthTextColors = ['', 'text-red-600', 'text-amber-600', 'text-blue-600', 'text-green-600'];

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8 sm:py-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(37 99 235) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="w-full max-w-[400px] relative z-10 animate-fade-in">
          {/* Logo */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">SOLAYIA</span>
                <span className="text-brand-600 text-xs font-bold uppercase tracking-widest">CRM</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
              {success ? 'Mot de passe modifie !' : 'Nouveau mot de passe'}
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
              {success ? 'Vous pouvez maintenant vous connecter' : 'Choisissez un mot de passe securise'}
            </p>
          </div>

          {success ? (
            /* Success state */
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-green-800 mb-1.5">Mot de passe mis a jour !</h3>
                <p className="text-[13px] text-green-700 leading-relaxed">
                  Votre mot de passe a ete modifie avec succes. Vous pouvez maintenant acceder a votre CRM.
                </p>
              </div>

              <Link href="/dashboard" className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-700/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-[0.98] duration-200">
                Acceder au CRM
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2.5 animate-shake">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors group-focus-within:text-brand-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
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
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors group-focus-within:text-brand-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`w-full pl-11 pr-12 py-3 text-sm border rounded-xl bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {confirmPassword && confirmPassword === password && (
                      <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-green-500" />
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-700/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] duration-200 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Reinitialiser le mot de passe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right: Visual */}
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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 xl:px-16">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 animate-fade-in-up">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 text-center leading-tight animate-fade-in-up animation-delay-100">
            Securisez<br />votre compte
          </h2>
          <p className="text-brand-200 text-base xl:text-lg leading-relaxed text-center max-w-sm animate-fade-in-up animation-delay-200">
            Choisissez un mot de passe fort pour proteger votre espace CRM Solayia.
          </p>

          {/* Security tips */}
          <div className="mt-10 space-y-3 w-full max-w-xs animate-fade-in-up animation-delay-300">
            {[
              '8 caracteres minimum',
              'Melangez lettres, chiffres et symboles',
              'Evitez les mots de passe courants',
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-3.5">
                <div className="w-5 h-5 rounded-full bg-brand-400/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-brand-300" />
                </div>
                <p className="text-sm text-white/90">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
