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
    <div className="min-h-screen lg:flex bg-gray-50">

      {/* ============ MOBILE: Branded header ============ */}
      <div className="lg:hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 pt-12 pb-8 relative overflow-hidden">
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
            {sent ? 'Email envoye' : 'Mot de passe oublie ?'}
          </h1>
          <p className="text-brand-200 text-sm mt-1">
            {sent ? 'Verifiez votre boite de reception' : 'On vous envoie un lien de reinitialisation'}
          </p>
        </div>
      </div>

      {/* ============ FORM SECTION ============ */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-5 sm:px-8 py-6 sm:py-8 lg:py-12 relative">
        <div className="hidden lg:block absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(37 99 235) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="w-full max-w-[400px] relative z-10 animate-fade-in">
          {/* Desktop-only logo */}
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
              {sent ? 'Email envoye' : 'Mot de passe oublie ?'}
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
              {sent ? 'Verifiez votre boite de reception' : 'Pas de panique, on vous envoie un lien de reinitialisation'}
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
                  Un lien de reinitialisation a ete envoye a{' '}
                  <strong className="font-semibold">{email}</strong>.
                  Verifiez votre boite de reception et vos spams.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[13px] text-gray-500 text-center leading-relaxed">
                  Pas recu ?{' '}
                  <button onClick={() => setSent(false)} className="text-brand-600 hover:text-brand-700 font-semibold hover:underline underline-offset-2 transition-colors">
                    Reessayez avec un autre email
                  </button>
                </p>
              </div>

              <Link href="/login" className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-[15px] sm:text-sm font-semibold rounded-xl border border-gray-200 transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-[0.98] duration-200">
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
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-colors group-focus-within:text-brand-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 text-base sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300"
                      placeholder="votre@email.fr"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-[15px] sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-700/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] duration-200">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors font-medium hover:underline underline-offset-2">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour a la connexion
                </Link>
              </div>
            </>
          )}

          <p className="lg:hidden text-center text-[11px] text-gray-400 mt-8 pb-2">
            Solayia CRM &mdash; Gestion commerciale simplifiee
          </p>
        </div>
      </div>

      {/* ============ DESKTOP: Right visual panel ============ */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 animate-gradient" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(at 20% 80%, rgba(255,255,255,0.3) 0, transparent 50%),
                           radial-gradient(at 80% 20%, rgba(255,255,255,0.2) 0, transparent 50%),
                           radial-gradient(at 50% 50%, rgba(255,255,255,0.1) 0, transparent 60%)`
        }} />
        <div className="absolute top-20 left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-brand-400/10 rounded-full blur-2xl animate-float-delayed" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 xl:px-16">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 animate-fade-in-up">
            <Send className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 text-center leading-tight animate-fade-in-up animation-delay-100">
            On vous envoie<br />un lien securise
          </h2>
          <p className="text-brand-200 text-base xl:text-lg leading-relaxed text-center max-w-sm animate-fade-in-up animation-delay-200">
            Verifiez votre boite email et cliquez sur le lien pour reinitialiser votre mot de passe en toute securite.
          </p>

          <div className="mt-10 space-y-3 w-full max-w-xs animate-fade-in-up animation-delay-300">
            {[
              { step: '1', text: 'Entrez votre adresse email' },
              { step: '2', text: 'Recevez le lien par email' },
              { step: '3', text: 'Choisissez un nouveau mot de passe' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-3.5 hover:bg-white/[0.12] transition-all duration-300">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{item.step}</span>
                </div>
                <p className="text-sm text-white/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
