'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 tracking-wide">SOLAYIA</span>
                <span className="text-brand-600 text-sm ml-1 font-semibold">CRM</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mot de passe oublie</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              {sent ? 'Verifiez votre boite email' : 'Entrez votre email pour recevoir un lien de reinitialisation'}
            </p>
          </div>

          {sent ? (
            /* Success state */
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-green-800 mb-1">Email envoye !</h3>
                <p className="text-xs text-green-700 leading-relaxed">
                  Un lien de reinitialisation a ete envoye a <strong>{email}</strong>.
                  Verifiez votre boite de reception (et vos spams).
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Pas recu ? Verifiez vos spams ou{' '}
                  <button onClick={() => setSent(false)} className="text-brand-600 hover:text-brand-700 font-medium">
                    reessayez avec un autre email
                  </button>
                </p>
              </div>

              <Link href="/login" className="btn-secondary w-full justify-center">
                <ArrowLeft className="w-4 h-4" />
                Retour a la connexion
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-field pl-10"
                      placeholder="adrien@solayia.fr"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
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

              <div className="mt-4 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-brand-600 inline-flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour a la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            On vous envoie un lien
          </h2>
          <p className="text-brand-200 text-lg leading-relaxed">
            Verifiez votre boite email et cliquez sur le lien pour reinitialiser votre mot de passe.
          </p>
        </div>
      </div>
    </div>
  );
}
