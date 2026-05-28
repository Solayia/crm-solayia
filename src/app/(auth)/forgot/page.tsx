'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { requestPasswordReset } from './actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await requestPasswordReset(email);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSent(true);
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
            {sent ? 'Email envoye' : 'Mot de passe\noublie ?'}
          </h1>
          <p className="text-blue-100/70 text-sm mt-2">
            {sent ? 'Verifiez votre boite de reception' : 'On vous envoie un lien securise'}
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
              {sent ? 'Email envoye' : 'Mot de passe oublie ?'}
            </h1>
            <p className="text-gray-500 mt-2.5 text-base">
              {sent ? 'Verifiez votre boite de reception' : 'Pas de panique, on vous envoie un lien securise'}
            </p>
          </div>

          {sent ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-green-800 mb-1.5">Email envoye avec succes !</h3>
                <p className="text-[13px] text-green-700 leading-relaxed">
                  Un lien a ete envoye a <strong>{email}</strong>. Verifiez aussi vos spams.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[13px] text-gray-500 text-center">
                  Pas recu ?{' '}
                  <button onClick={() => setSent(false)} className="text-brand-600 hover:text-brand-700 font-semibold hover:underline underline-offset-2 cursor-pointer">
                    Reessayer
                  </button>
                </p>
              </div>

              <Link href="/login" className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-[15px] sm:text-sm font-semibold rounded-xl border border-gray-200 transition-all duration-200 hover:border-gray-300 active:scale-[0.97] cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Retour a la connexion
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Adresse email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors duration-200 group-focus-within:text-brand-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-[3px] focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 shadow-sm"
                      placeholder="votre@email.fr"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-brand-600/20 hover:shadow-brand-500/30 focus:outline-none focus:ring-[3px] focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer group">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors duration-200 font-medium hover:underline underline-offset-2 cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour a la connexion
                </Link>
              </div>
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
              <Send className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl xl:text-[40px] font-bold text-white mb-4 text-center leading-[1.15] tracking-tight animate-fade-in-up animation-delay-100">
            On vous envoie<br />un lien securise
          </h2>
          <p className="text-blue-100/60 text-base xl:text-lg leading-relaxed text-center max-w-[380px] mb-14 animate-fade-in-up animation-delay-200">
            Verifiez votre boite email et cliquez sur le lien pour reinitialiser votre mot de passe.
          </p>

          <div className="space-y-3 w-full max-w-[340px] animate-fade-in-up animation-delay-300">
            {[
              { step: '1', text: 'Entrez votre adresse email' },
              { step: '2', text: 'Recevez le lien par email' },
              { step: '3', text: 'Choisissez un nouveau mot de passe' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3.5 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-300 cursor-default hover:translate-y-[-1px]">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <p className="text-sm text-white/80 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
