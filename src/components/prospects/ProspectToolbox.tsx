'use client';

import { useState } from 'react';
import {
  UserCheck, X, CheckSquare, Square, TrendingUp, AlertOctagon,
  Zap, Clock, Target, Mail, Phone, FileText, DollarSign,
  Thermometer, Timer, CalendarClock, RotateCcw, Send,
} from 'lucide-react';
import type { Prospect, Interaction, ConversionData } from '@/lib/types';
import { TYPES_PRESTATION } from '@/lib/types';
import { convertToClient, updateProspectChecklist, updateMotifPerte } from '@/app/(app)/prospects/actions';

// --- SCORING ---

const CHECKLIST_ITEMS = [
  { key: 'budget_confirme', label: 'Budget confirmé', emoji: '💰' },
  { key: 'decideur_identifie', label: 'Décideur identifié', emoji: '👤' },
  { key: 'besoin_valide', label: 'Besoin validé', emoji: '✅' },
  { key: 'timing_ok', label: 'Timing OK', emoji: '⏰' },
  { key: 'concurrence_identifiee', label: 'Concurrence identifiée', emoji: '🔍' },
];

const MOTIFS_PERTE = [
  { value: 'trop_cher', label: 'Trop cher', emoji: '💸' },
  { value: 'concurrent', label: 'Choisi un concurrent', emoji: '🏃' },
  { value: 'pas_de_besoin', label: 'Pas de besoin', emoji: '🚫' },
  { value: 'timing', label: 'Mauvais timing', emoji: '⏳' },
  { value: 'pas_de_reponse', label: 'Pas de réponse', emoji: '📵' },
  { value: 'budget_insuffisant', label: 'Budget insuffisant', emoji: '💰' },
  { value: 'projet_reporte', label: 'Projet reporté', emoji: '📅' },
  { value: 'autre', label: 'Autre', emoji: '❓' },
];

const RELANCE_SEQUENCES = [
  { jour: 3, label: 'J+3', type: 'relance_douce', description: 'Relance douce — vérifier la réception' },
  { jour: 7, label: 'J+7', type: 'relance_valeur', description: 'Relance de valeur — partager un cas client' },
  { jour: 15, label: 'J+15', type: 'relance_decision', description: 'Relance décision — deadline approche' },
  { jour: 30, label: 'J+30', type: 'relance_finale', description: 'Dernière relance — maintenant ou jamais' },
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
  details.push({ label: 'Température', points: tempScore, max: 30 });

  // Interactions (max 20, +5 par interaction)
  const interScore = Math.min(interactions.length * 5, 20);
  details.push({ label: 'Interactions', points: interScore, max: 20 });

  // Contact info (max 10)
  let contactScore = 0;
  if (prospect.email) contactScore += 5;
  if (prospect.telephone) contactScore += 5;
  details.push({ label: 'Coordonnées', points: contactScore, max: 10 });

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

  // --- Conversion form state (pré-rempli depuis le prospect) ---
  const [convPrestation, setConvPrestation] = useState(prospect.type_prestation || '');
  const [convOneShot, setConvOneShot] = useState(
    prospect.tarif_type !== 'mensuel' && prospect.tarif_propose ? String(prospect.tarif_propose) : ''
  );
  const [convAcompte, setConvAcompte] = useState(false);
  const [convSolde, setConvSolde] = useState(false);
  const [convMrr, setConvMrr] = useState(
    prospect.tarif_type === 'mensuel' && prospect.tarif_propose ? String(prospect.tarif_propose) : ''
  );
  const [convMrrDebut, setConvMrrDebut] = useState(new Date().toISOString().slice(0, 10));
  const [convDuree, setConvDuree] = useState(
    prospect.duree_mois ? String(prospect.duree_mois) : ''
  );
  const [convDureeIndef, setConvDureeIndef] = useState(!prospect.duree_mois && prospect.tarif_type === 'mensuel');

  const checklist = prospect.prospect_checklist || {};
  const { score, details } = calculateScore(prospect, interactions);

  // --- Convert to client ---
  const handleConvert = async () => {
    setConvertLoading(true);
    const financialData: ConversionData = {
      montant_one_shot: Number(convOneShot) || 0,
      acompte_paye: convAcompte,
      solde_paye: convSolde,
      mrr: Number(convMrr) || 0,
      mrr_date_debut: convMrr ? convMrrDebut : null,
      duree_mois: convDureeIndef ? null : (Number(convDuree) || null),
      type_prestation: convPrestation || null,
    };
    const result = await convertToClient(prospect.id, financialData);
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
              Séquences de relance
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
                <p className="text-[11px] text-green-600">Créer le client et démarrer le projet</p>
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

        {/* --- MOTIF DE PERTE DISPLAY (si déjà perdu) --- */}
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

      {/* --- MODAL CONVERSION ENRICHIE --- */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowConvertModal(false)}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Convertir en client</h3>
                <p className="text-sm text-gray-500">{prospect.entreprise || `${prospect.prenom} ${prospect.nom}`.trim()}</p>
              </div>
              <button onClick={() => setShowConvertModal(false)} className="ml-auto p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prestation */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Prestation</label>
              <select value={convPrestation} onChange={(e) => setConvPrestation(e.target.value)} className="input-field">
                <option value="">—</option>
                {TYPES_PRESTATION.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            {/* Section One-shot */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Paiement one-shot
              </h4>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Montant réel (€)</label>
                <input
                  type="number" step="0.01"
                  value={convOneShot}
                  onChange={(e) => setConvOneShot(e.target.value)}
                  className="input-field"
                  placeholder="1490.00"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={convAcompte}
                    onChange={(e) => setConvAcompte(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Acompte payé</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={convSolde}
                    onChange={(e) => setConvSolde(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Solde payé</span>
                </label>
              </div>
            </div>

            {/* Section MRR */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-5 space-y-3">
              <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Récurrent (MRR)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Montant mensuel (€/mois)</label>
                  <input
                    type="number" step="0.01"
                    value={convMrr}
                    onChange={(e) => setConvMrr(e.target.value)}
                    className="input-field"
                    placeholder="490.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date début MRR</label>
                  <input
                    type="date"
                    value={convMrrDebut}
                    onChange={(e) => setConvMrrDebut(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Durée d&apos;engagement</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={convDureeIndef ? '' : convDuree}
                    onChange={(e) => { setConvDuree(e.target.value); setConvDureeIndef(false); }}
                    className="input-field flex-1"
                    placeholder="12"
                    disabled={convDureeIndef}
                  />
                  <span className="text-xs text-gray-500 shrink-0">mois</span>
                  <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={convDureeIndef}
                      onChange={(e) => { setConvDureeIndef(e.target.checked); if (e.target.checked) setConvDuree(''); }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">Indéfinie</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Résumé */}
            {(convOneShot || convMrr) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">Résumé financier :</p>
                {convOneShot && <p>💵 One-shot : {Number(convOneShot).toLocaleString('fr-FR')} € {convAcompte && convSolde ? '(payé ✅)' : convAcompte ? '(acompte ✅)' : '(en attente)'}</p>}
                {convMrr && <p>🔄 MRR : {Number(convMrr).toLocaleString('fr-FR')} €/mois {convDureeIndef ? '(indéfini)' : convDuree ? `× ${convDuree} mois` : ''}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => setShowConvertModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={handleConvert} disabled={convertLoading} className="btn-primary flex-1 !bg-green-600 hover:!bg-green-700">
                {convertLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                {convertLoading ? 'Conversion...' : 'Convertir ✓'}
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Préciser le motif</label>
                <input
                  value={motifPerteCustom}
                  onChange={(e) => setMotifPerteCustom(e.target.value)}
                  className="input-field"
                  placeholder="Décrire le motif..."
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
