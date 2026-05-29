'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Building2, Mail, Phone, Euro, Calendar, Clock, X, Plus, DollarSign, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { PROJET_STATUTS, TYPES_PRESTATION } from '@/lib/types';
import type { ProjetStatut, PrestationLigneClient } from '@/lib/types';
import { getClient, getClientProjets, updateClientAction, deleteClientAction } from '../actions';
import { updateProjetAction, createProjetAction, deleteProjet } from '../../projets/actions';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [projets, setProjets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editProjet, setEditProjet] = useState<any>(null);
  const [showNewProjet, setShowNewProjet] = useState(false);
  const [projetLoading, setProjetLoading] = useState(false);

  // Form fields
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [notes, setNotes] = useState('');
  // Multi-prestations client (avec suivi paiement)
  const [prestations, setPrestations] = useState<PrestationLigneClient[]>([]);

  const loadData = useCallback(async () => {
    const [c, p] = await Promise.all([
      getClient(clientId),
      getClientProjets(clientId),
    ]);
    if (c) {
      setClient(c);
      setNom(c.nom || '');
      setPrenom(c.prenom || '');
      setEntreprise(c.entreprise || '');
      setEmail(c.email || '');
      setTelephone(c.telephone || '');
      setNotes(c.notes || '');
      // Multi-prestations : depuis JSON ou reconstruction legacy
      if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
        setPrestations(c.prestations);
      } else {
        const legacy: PrestationLigneClient[] = [];
        if ((c.montant_one_shot && c.montant_one_shot > 0) || c.type_prestation) {
          legacy.push({
            id: Math.random().toString(36).slice(2, 11),
            type_prestation: c.type_prestation || '',
            mode: 'one_shot',
            montant: c.montant_one_shot || 0,
            acompte_montant: 0,
            acompte_paye: !!c.acompte_paye,
            solde_paye: !!c.solde_paye,
          });
        }
        if (c.mrr && c.mrr > 0) {
          legacy.push({
            id: Math.random().toString(36).slice(2, 11),
            type_prestation: c.type_prestation || '',
            mode: 'recurrent',
            montant: c.mrr,
            date_debut: c.mrr_date_debut || null,
            date_fin: null,
          });
        }
        setPrestations(legacy);
      }
    }
    setProjets(p);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set('nom', nom);
    formData.set('prenom', prenom);
    formData.set('entreprise', entreprise);
    formData.set('email', email);
    formData.set('telephone', telephone);
    formData.set('notes', notes);
    formData.set('prestations', JSON.stringify(prestations));
    // Legacy fields (backward compat)
    const oneShots = prestations.filter(p => p.mode === 'one_shot');
    const recurrents = prestations.filter(p => p.mode === 'recurrent');
    formData.set('montant_one_shot', String(oneShots.reduce((s, p) => s + p.montant, 0)));
    formData.set('acompte_paye', String(oneShots.length > 0 && oneShots.every(p => p.acompte_paye)));
    formData.set('solde_paye', String(oneShots.length > 0 && oneShots.every(p => p.solde_paye)));
    formData.set('mrr', String(recurrents.reduce((s, p) => s + p.montant, 0)));
    formData.set('mrr_date_debut', recurrents[0]?.date_debut || '');
    formData.set('duree_mois', '');
    formData.set('type_prestation', prestations[0]?.type_prestation || '');

    const result = await updateClientAction(clientId, formData);
    setSaving(false);
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer le client "${entreprise}" et tous ses projets ? Cette action est irréversible.`)) return;
    const result = await deleteClientAction(clientId);
    if (!result.error) {
      router.push('/clients');
    } else {
      alert(result.error);
    }
  };

  const handleSaveProjet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProjetLoading(true);
    const formData = new FormData(e.currentTarget);

    if (editProjet?.id) {
      await updateProjetAction(editProjet.id, formData);
    } else {
      formData.set('client_id', clientId);
      await createProjetAction(formData);
    }

    setEditProjet(null);
    setShowNewProjet(false);
    setProjetLoading(false);
    await loadData();
  };

  const handleDeleteProjet = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await deleteProjet(id);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client introuvable</p>
        <button onClick={() => router.push('/clients')} className="btn-primary mt-4">Retour aux clients</button>
      </div>
    );
  }

  const projetModal = editProjet || showNewProjet;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.push('/clients')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">
            {getInitials(entreprise)}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{entreprise}</h1>
            <p className="text-sm text-gray-500">{prenom} {nom}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Supprimer">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}</span>
            <span className="sm:hidden">{saving ? '...' : saved ? '✓' : 'Sauver'}</span>
          </button>
        </div>
      </div>

      {/* Client info form */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-600" />
          Informations client
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Entreprise *</label>
            <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Téléphone
              </label>
              <input value={telephone} onChange={(e) => setTelephone(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field" />
          </div>
        </div>
      </div>

      {/* Section financière — Multi-prestations */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Euro className="w-4 h-4 text-brand-600" />
          Prestations & Paiements
        </h2>
        <div className="space-y-3">
          {prestations.map((pr, idx) => (
            <div key={pr.id} className={`p-4 rounded-xl border space-y-3 ${pr.mode === 'one_shot' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <h4 className={`text-xs font-bold flex items-center gap-1.5 ${pr.mode === 'one_shot' ? 'text-amber-800' : 'text-blue-800'}`}>
                  {pr.mode === 'one_shot' ? <DollarSign className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  Prestation #{idx + 1} — {pr.mode === 'one_shot' ? 'One-shot' : 'Récurrent'}
                </h4>
                <button type="button" onClick={() => setPrestations(prev => prev.filter(x => x.id !== pr.id))} className="p-1 text-gray-400 hover:text-red-500 rounded"><X className="w-4 h-4" /></button>
              </div>

              {/* Type + Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type de prestation</label>
                  <select value={pr.type_prestation} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, type_prestation: e.target.value } : x))} className="input-field">
                    <option value="">—</option>
                    {TYPES_PRESTATION.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, mode: 'one_shot' as const } : x))} className={`flex-1 py-2 px-3 rounded-lg border-2 text-xs font-medium transition-all ${pr.mode === 'one_shot' ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-gray-200 bg-white text-gray-500'}`}>💵 One-shot</button>
                    <button type="button" onClick={() => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, mode: 'recurrent' as const } : x))} className={`flex-1 py-2 px-3 rounded-lg border-2 text-xs font-medium transition-all ${pr.mode === 'recurrent' ? 'border-blue-400 bg-blue-100 text-blue-800' : 'border-gray-200 bg-white text-gray-500'}`}>🔄 Récurrent</button>
                  </div>
                </div>
              </div>

              {/* Montant */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Montant {pr.mode === 'recurrent' ? '(€/mois)' : 'total (€)'}</label>
                <input type="number" step="0.01" value={pr.montant || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, montant: Number(e.target.value) || 0 } : x))} className="input-field" />
              </div>

              {/* One-shot: acompte + solde */}
              {pr.mode === 'one_shot' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Montant acompte (€)</label>
                      <input type="number" step="0.01" value={pr.acompte_montant || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, acompte_montant: Number(e.target.value) || 0 } : x))} className="input-field" placeholder="0" />
                    </div>
                    <button type="button" onClick={() => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, acompte_paye: !x.acompte_paye } : x))} className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${pr.acompte_paye ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                      {pr.acompte_paye ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      Acompte {pr.acompte_paye ? 'payé' : 'en attente'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div className="text-sm text-gray-700">
                      Solde restant : <span className="font-bold">{((pr.montant || 0) - (pr.acompte_montant || 0)).toLocaleString('fr-FR')} €</span>
                    </div>
                    <button type="button" onClick={() => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, solde_paye: !x.solde_paye } : x))} className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${pr.solde_paye ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                      {pr.solde_paye ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      Solde {pr.solde_paye ? 'payé' : 'en attente'}
                    </button>
                  </div>
                  {/* Résumé paiement one-shot */}
                  <div className="text-xs pt-2 border-t border-amber-200 space-y-0.5">
                    <p className="font-semibold text-amber-900">Total payé : {((pr.acompte_paye ? (pr.acompte_montant || 0) : 0) + (pr.solde_paye ? (pr.montant || 0) - (pr.acompte_montant || 0) : 0)).toLocaleString('fr-FR')} € / {(pr.montant || 0).toLocaleString('fr-FR')} €</p>
                  </div>
                </div>
              )}

              {/* Récurrent: dates */}
              {pr.mode === 'recurrent' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date début</label>
                      <input type="date" value={pr.date_debut || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, date_debut: e.target.value || null } : x))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date fin (vide = indéfinie)</label>
                      <input type="date" value={pr.date_fin || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, date_fin: e.target.value || null } : x))} className="input-field" />
                    </div>
                  </div>
                  {pr.date_debut && (
                    <div className="text-xs pt-2 border-t border-blue-200 text-blue-900">
                      {(() => {
                        const start = new Date(pr.date_debut);
                        const end = pr.date_fin ? new Date(pr.date_fin) : new Date();
                        const now = new Date();
                        const effectiveEnd = end < now ? end : now;
                        if (effectiveEnd <= start) return <p>Pas encore démarré</p>;
                        const moisEcoules = (effectiveEnd.getFullYear() - start.getFullYear()) * 12 + (effectiveEnd.getMonth() - start.getMonth()) + (effectiveEnd.getDate() >= start.getDate() ? 1 : 0);
                        return <p className="font-semibold">{moisEcoules} mois écoulés = {(pr.montant * Math.max(0, moisEcoules)).toLocaleString('fr-FR')} € encaissés</p>;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Bouton ajouter */}
          <button type="button" onClick={() => setPrestations(prev => [...prev, { id: Math.random().toString(36).slice(2, 11), type_prestation: '', mode: 'one_shot', montant: 0, acompte_montant: 0, acompte_paye: false, solde_paye: false }])} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Ajouter une prestation</span>
          </button>

          {/* Résumé global */}
          {prestations.length > 0 && prestations.some(pr => pr.montant > 0) && (() => {
            let realise = 0;
            let estime = 0;
            for (const pr of prestations) {
              if (pr.mode === 'one_shot') {
                const acompteMt = pr.acompte_montant || 0;
                const soldeMt = (pr.montant || 0) - acompteMt;
                if (pr.acompte_paye) realise += acompteMt;
                else estime += acompteMt;
                if (pr.solde_paye) realise += soldeMt;
                else estime += soldeMt;
              } else if (pr.mode === 'recurrent' && pr.date_debut) {
                const start = new Date(pr.date_debut);
                const now = new Date();
                const end = pr.date_fin ? new Date(pr.date_fin) : null;
                const effectiveEnd = end && end < now ? end : now;
                if (effectiveEnd > start) {
                  const moisEcoules = (effectiveEnd.getFullYear() - start.getFullYear()) * 12 + (effectiveEnd.getMonth() - start.getMonth()) + (effectiveEnd.getDate() >= start.getDate() ? 1 : 0);
                  realise += pr.montant * Math.max(0, moisEcoules);
                }
                if (!end || end > now) {
                  const futureEnd = end || new Date(now.getFullYear(), 11, 31);
                  const futureMonths = (futureEnd.getFullYear() - now.getFullYear()) * 12 + (futureEnd.getMonth() - now.getMonth());
                  estime += pr.montant * Math.max(0, futureMonths);
                }
              } else {
                estime += pr.montant || 0;
              }
            }
            return (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900 text-sm">Résumé financier</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-[11px] text-green-600 font-medium">Réalisé (payé)</p>
                    <p className="text-lg font-bold text-green-700">{realise.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                    <p className="text-[11px] text-amber-600 font-medium">Estimé restant</p>
                    <p className="text-lg font-bold text-amber-700">{estime.toLocaleString('fr-FR')} €</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Projets section */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            Projets ({projets.length})
          </h2>
          <button onClick={() => { setEditProjet(null); setShowNewProjet(true); }} className="btn-primary text-xs px-3 py-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>

        {projets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucun projet pour ce client</p>
        ) : (
          <div className="space-y-3">
            {projets.map((projet) => {
              const progress = projet.statut === 'termine' ? 100 : projet.statut === 'en_cours' ? 60 : projet.statut === 'en_preparation' ? 10 : projet.statut === 'en_pause' ? 40 : 0;
              const statutInfo = PROJET_STATUTS.find(s => s.value === projet.statut);
              return (
                <div
                  key={projet.id}
                  onClick={() => setEditProjet(projet)}
                  className="border border-gray-100 rounded-lg p-4 hover:border-brand-200 hover:bg-brand-50/30 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{projet.nom}</h3>
                      {projet.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{projet.description}</p>}
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${statutInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                      {statutInfo?.label || projet.statut}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(projet.date_debut)}</span>
                      {projet.date_fin_prevue && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(projet.date_fin_prevue)}</span>}
                    </div>
                    <span className="font-semibold text-gray-700">{formatCurrency(projet.montant || 0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Client since */}
      <p className="text-xs text-gray-400 text-center">Client depuis le {formatDate(client.created_at)}</p>

      {/* Modal edition/creation projet */}
      {projetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => { setEditProjet(null); setShowNewProjet(false); }}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editProjet?.id ? 'Modifier le projet' : 'Nouveau projet'}</h3>
              <button onClick={() => { setEditProjet(null); setShowNewProjet(false); }} className="p-2 text-gray-400 hover:text-gray-600 -mr-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProjet} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet *</label>
                <input name="nom" required defaultValue={editProjet?.nom || ''} className="input-field" />
              </div>
              {editProjet?.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select name="statut" defaultValue={editProjet?.statut || 'en_preparation'} className="input-field">
                    {PROJET_STATUTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                  </select>
                </div>
              )}
              {!editProjet?.id && <input type="hidden" name="statut" value="en_preparation" />}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editProjet?.description || ''} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                  <input name="date_debut" type="date" defaultValue={editProjet?.date_debut || ''} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin prévue</label>
                  <input name="date_fin_prevue" type="date" defaultValue={editProjet?.date_fin_prevue || ''} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
                <input name="montant" type="number" step="0.01" defaultValue={editProjet?.montant || 0} className="input-field" />
              </div>
              <div className="flex gap-2 pt-2">
                {editProjet?.id && (
                  <button type="button" onClick={() => { handleDeleteProjet(editProjet.id); setEditProjet(null); }} className="text-red-500 hover:text-red-700 text-sm px-3 py-2">
                    Supprimer
                  </button>
                )}
                <div className="flex-1" />
                <button type="button" onClick={() => { setEditProjet(null); setShowNewProjet(false); }} className="btn-secondary flex-1 sm:flex-none">Annuler</button>
                <button type="submit" disabled={projetLoading} className="btn-primary flex-1 sm:flex-none">
                  {projetLoading ? 'Enregistrement...' : editProjet?.id ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
