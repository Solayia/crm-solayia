'use client';

import { useState } from 'react';
import {
  UserCheck, X, CheckSquare, Square, TrendingUp, AlertOctagon,
  Zap, Clock, Target, Mail, Phone, FileText, DollarSign,
  Thermometer, Timer, CalendarClock, RotateCcw, Send,
} from 'lucide-react';
import type { Prospect, Interaction } from '@/lib/types';
import { convertToClient, updateProspectChecklist, updateMotifPerte } from '@/app/(app)/prospects/actions';

// --- SCORING ---

const CHECKLIST_ITEMS = [
  { key: 'budget_confirme', label: 'Budget confirme', emoji: '💰' },
  { key: 'decideur_identifie', label: 'Decideur identifie', emoji: '👤' },
  { key: 'besoin_valide', label: 'Besoin valide', emoji: '✅' },
  { key: 'timing_ok', label: 'Timing OK', emoji: '⏰' },
  { key: 'concurrence_identifiee', label: 'Concurrence identifiee', emoji: '🔍' },
];

const MOTIFS_PERTE = [
  { value: 'trop_cher', label: 'Trop cher', emoji: '💸' },
  { value: 'concurrent', label: 'Choisi un concurrent', emoji: '🏃' },
  { value: 'pas_de_besoin', label: 'Pas de besoin', emoji: '🚫' },
  { value: 'timing', label: 'Mauvais timing', emoji: '⏳' },
  { value: 'pas_de_reponse', label: 'Pas de reponse', emoji: '📵' },
  { value: 'budget_insuffisant', label: 'Budget insuffisant', emoji: '💰' },
  { value: 'projet_reporte', label: 'Projet reporte', emoji: '📅' },
  { value: 'autre', label: 'Autre', emoji: '❓' },
];

const RELANCE_SEQUENCES = [
  { jour: 3, label: 'J+3', type: 'relance_douce', description: 'Relance douce — verifier la reception' },
  { jour: 7, label: 'J+7', type: 'relance_valeur', description: 'Relance de valeur — partager un cas client' },
  { jour: 15, label: 'J+15', type: 'relance_decision', description: 'Relance decision — deadline approche' },
  { jour: 30, label: 'J+30', type: 'relance_finale', description: 'Derniere relance — maintenant ou jamais' },
];

interface ProspectToolboxProps {
  prospect: Prospect;
  interactions: Interaction[];
  onUpdate: () => void;
}

function calculateScore(prospect: Prospect, interactions: Interaction[]): {
  score: number;
  details: { label: string; points: number; max: number }[];
} {
  const details: { label: string; points: number; max: number }[] = [];

  // Temperature (max 30)
  const tempScore = prospect.temperature === 'chaud' ? 30 : prospect.temperature === 'tiede' ? 15 : 0;
  details.push({ label: 'Temperature', points: tempScore, max: 30 });

  // Interactions (max 20, +5 par interaction)
  const interScore = Math.min(interactions.length * 5, 20);
  details.push({ label: 'Interactions', points: interScore, max: 20 });

  // Contact info (max 10)
  let contactScore = 0;
  if (prospect.email) contactScore += 5;
  if (prospect.telephone) contactScore += 5;
  details.push({ label: 'Coordonnees', points: contactScore, max: 10 });

  // Prestation (max 15)
  let prestaScore = 0;
  if (prospect.type_prestation) prestaScore += 5;
  if (prospect.tarif_propose) prestaScore += 10;
  details.push({ label: 'Prestation & Tarif', points: prestaScore, max: 15 });

  // Checklist (max 25, 5 par item)
  const checklist = prospect.prospect_checklist || {};
  const checkScore = Object.values(checklist).filter(Boolean).length * 5;
  details.push({ label: 'Qualification', points: Math.min(checkScore, 25), max: 25 });

  const score = details.reduce((sum, d) => sum + d.points, 0);
  return { score, details };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'Faible';
}

// --- COMPONENT ---

export default function ProspectToolbox({ prospect, interactions, onUpdate }: ProspectToolboxProps) {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showMotifPerteModal, setShowMotifPerteModal] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [motifPerte, setMotifPerte] = useState(prospect.motif_perte || '');
  const [motifPerteCustom, setMotifPerteCustom] = useState('');
  const [motifLoading, setMotifLoading] = useState(false);
  const [checklistLoading, setChecklistLoading] = useState(false);

  const checklist = prospect.prospect_checklist || {};
  const { score, details } = calculateScore(prospect, interactions);

  // --- Convert to client ---
  const handleConvert = async () => {
    setConvertLoading(true);
    const result = await convertToClient(prospect.id);
    setConvertLoading(false);
    if (result.success) {
      setShowConvertModal(false);
      onUpdate();
    } else {
      alert(result.error || 'Erreur lors de la conversion');
    }
  };

  // --- Checklist ---
  const toggleChecklistItem = async (key: string) => {
    setChecklistLoading(true);
    const newChecklist = { ...checklist, [key]: !checklist[key] };
    await updateProspectChecklist(prospect.id, newChecklist);
    setChecklistLoading(false);
    onUpdate();
  };

  // --- Motif de perte ---
  const handleMotifPerte = async () => {
    setMotifLoading(true);
    const motif = motifPerte === 'autre' ? motifPerteCustom : motifPerte;
    if (!motif) { setMotifLoading(false); return; }
    const result = await updateMotifPerte(prospect.id, motif);
    setMotifLoading(false);
    if (result.success) {
      setShowMotifPerteModal(false);
      onUpdate();
    }
  };

  // --- Relance dates ---
  const getRelanceDates = () => {
    const base = prospect.date_premier_contact ? new Date(prospect.date_premier_contact) : new Date(prospect.created_at);
    return RELANCE_SEQUENCES.map(seq => {
      const d = new Date(base);
      d.setDate(d.getDate() + seq.jour);
      const isPast = d < new Date();
      return { ...seq, date: d, isPast };
    });
  };

  const relanceDates = getRelanceDates();
  const completedChecklist = Object.values(checklist).filter(Boolean).length;
  const isCommercialPhase = ['prospect', 'prise_contact', 'r1', 'r2', 'proposition', 'acompte'].includes(prospect.statut);

  return (
    <>
      <div className="space-y-4">
        {/* --- SCORING CARD --- */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-600" />
            Score de conversion
          </h3>

          {/* Score circular */}
          <div className="flex items-center gap-5 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                <circle
                  cx="36" cy="36" r="30"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 188.5} 188.5`}
                  className={getScoreColor(score)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black ${getScoreColor(score)}`}>{score}</span>
                <span className="text-[9px] text-gray-400 -mt-0.5">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
              </div>
              {details.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-24 truncate">{d.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getScoreBg(d.max > 0 ? (d.points / d.max) * 100 : 0)}`}
                      style={{ width: `${d.max > 0 ? (d.points / d.max) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 w-8 text-right">{d.points}/{d.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CHECKLIST QUALIFICATION --- */}
        {isCommercialPhase && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-600" />
                Qualification
              </h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {completedChecklist}/{CHECKLIST_ITEMS.length}
              </span>
            </div>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const checked = !!checklist[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    disabled={checklistLoading}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left ${
                      checked
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {checked
                      ? <CheckSquare className="w-4 h-4 text-green-600 shrink-0" />
                      : <Square className="w-4 h-4 text-gray-300 shrink-0" />
                    }
                    <span className="text-sm">{item.emoji} {item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${(completedChecklist / CHECKLIST_ITEMS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- SEQUENCES RELANCE --- */}
        {isCommercialPhase && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-brand-600" />
              Sequences de relance
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />

              <div className="space-y-3">
                {relanceDates.map((seq, idx) => {
                  const isToday = seq.date.toDateString() === new Date().toDateString();
                  return (
                    <div key={seq.jour} className="flex items-start gap-3 relative">
                      {/* Dot */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isToday
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                          : seq.isPast
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {seq.isPast && !isToday ? (
                          <CheckSquare className="w-3 h-3" />
                        ) : (
                          <span className="text-[8px] font-bold">{seq.label}</span>
                        )}
                      </div>

                      <div className={`flex-1 p-2.5 rounded-lg border ${
                        isToday
                          ? 'bg-brand-50 border-brand-200'
                          : seq.isPast
                            ? 'bg-gray-50 border-gray-100 opacity-60'
                            : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isToday ? 'text-brand-700' : 'text-gray-700'}`}>
                            {seq.description}
                          </span>
                          {isToday && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">Aujourd&apos;hui</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {seq.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- ACTIONS CONVERSION --- */}
        {isCommercialPhase && (
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Actions
            </h3>

            {/* Convert button */}
            <button
              onClick={() => setShowConvertModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-800 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Convertir en client</p>
                <p className="text-[11px] text-green-600">Creer le client et demarrer le projet</p>
              </div>
            </button>

            {/* Marquer comme perdu */}
            <button
              onClick={() => setShowMotifPerteModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-800 hover:border-red-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Marquer comme perdu</p>
                <p className="text-[11px] text-red-600">Enregistrer le motif de perte</p>
              </div>
            </button>
          </div>
        )}

        {/* --- MOTIF DE PERTE DISPLAY (si deja perdu) --- */}
        {prospect.statut === 'perdu' && prospect.motif_perte && (
          <div className="card p-5 border-red-200 bg-red-50">
            <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              Prospect perdu
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-red-700">Motif :</span>
              <span className="text-sm text-red-600">
                {MOTIFS_PERTE.find(m => m.value === prospect.motif_perte)?.label || prospect.motif_perte}
              </span>
            </div>
            <button
              onClick={() => setShowMotifPerteModal(true)}
              className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Modifier le motif
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL CONVERSION --- */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowConvertModal(false)}>
          <div className="card p-6 w-full sm:max-w-md rounded-b-none sm:rounded-b-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Convertir en client</h3>
                <p className="text-sm text-gray-500">{prospect.entreprise || `${prospect.prenom} ${prospect.nom}`.trim()}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <p className="text-sm text-gray-600">Cette action va :</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  Creer une fiche client avec les infos du prospect
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  Passer le statut en &quot;Brief&quot; (pipeline projet)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  Lier le client au prospect d&apos;origine
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowConvertModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={handleConvert} disabled={convertLoading} className="btn-primary flex-1 !bg-green-600 hover:!bg-green-700">
                {convertLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                {convertLoading ? 'Conversion...' : 'Convertir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL MOTIF PERTE --- */}
      {showMotifPerteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowMotifPerteModal(false)}>
          <div className="card p-6 w-full sm:max-w-md rounded-b-none sm:rounded-b-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Motif de perte</h3>
                  <p className="text-xs text-gray-500">Pourquoi ce prospect est perdu ?</p>
                </div>
              </div>
              <button onClick={() => setShowMotifPerteModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {MOTIFS_PERTE.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMotifPerte(m.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    motifPerte === m.value
                      ? 'border-red-400 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-sm font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            {motifPerte === 'autre' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Preciser le motif</label>
                <input
                  value={motifPerteCustom}
                  onChange={(e) => setMotifPerteCustom(e.target.value)}
                  className="input-field"
                  placeholder="Decrire le motif..."
                />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setShowMotifPerteModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button
                onClick={handleMotifPerte}
                disabled={motifLoading || !motifPerte || (motifPerte === 'autre' && !motifPerteCustom)}
                className="btn-primary flex-1 !bg-red-600 hover:!bg-red-700"
              >
                {motifLoading ? 'Enregistrement...' : 'Marquer comme perdu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
