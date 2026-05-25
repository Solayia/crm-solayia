'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Calendar, Clock, X } from 'lucide-react';
import StatutBadge from '@/components/shared/StatutBadge';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { PROJET_STATUTS } from '@/lib/types';
import type { ProjetStatut } from '@/lib/types';
import { getProjets, getClientsForSelect, createProjetAction, updateProjetStatut, deleteProjet } from './actions';

export default function ProjetsPage() {
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<ProjetStatut | ''>('');
  const [projets, setProjets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [p, c] = await Promise.all([getProjets(), getClientsForSelect()]);
    setProjets(p);
    setClients(c);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createProjetAction(formData);
    if (!result.error) {
      setShowForm(false);
      await loadData();
    }
    setFormLoading(false);
  };

  const handleStatutChange = async (id: string, statut: ProjetStatut) => {
    await updateProjetStatut(id, statut);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await deleteProjet(id);
    await loadData();
  };

  const filtered = projets.filter((p) => {
    const matchSearch = !search || p.nom?.toLowerCase().includes(search.toLowerCase()) || p.client?.entreprise?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const enCours = projets.filter((p: any) => p.statut === 'en_cours');
  const montantTotal = projets.reduce((s: number, p: any) => s + (p.montant || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Projets en cours</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{enCours.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Total projets</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{projets.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">CA projets</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(montantTotal)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un projet..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value as ProjetStatut | '')} className="input-field w-auto">
            <option value="">Tous</option>
            {PROJET_STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau projet
        </button>
      </div>

      {/* Modal creation */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="card p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouveau projet</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet *</label><input name="nom" required className="input-field" /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <select name="client_id" required className="input-field">
                  <option value="">Selectionner...</option>
                  {clients.map((c) => (<option key={c.id} value={c.id}>{c.entreprise}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" rows={2} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date debut</label><input name="date_debut" type="date" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date fin prevue</label><input name="date_fin_prevue" type="date" className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label><input name="montant" type="number" step="0.01" defaultValue="0" className="input-field" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
                <button type="submit" disabled={formLoading} className="btn-primary">{formLoading ? 'Creation...' : 'Creer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Aucun projet{search || filterStatut ? ' pour cette recherche' : ''}</p>
          {!search && !filterStatut && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Creer un projet</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((projet) => {
            const progress = projet.statut === 'termine' ? 100 : projet.statut === 'en_cours' ? 60 : projet.statut === 'en_preparation' ? 10 : projet.statut === 'en_pause' ? 40 : 0;
            return (
              <div key={projet.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{projet.nom}</h3>
                    {projet.client && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded bg-brand-50 text-brand-700 flex items-center justify-center text-[9px] font-bold">
                          {getInitials(projet.client.entreprise)}
                        </div>
                        <span className="text-xs text-gray-500">{projet.client.entreprise}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={projet.statut}
                      onChange={(e) => handleStatutChange(projet.id, e.target.value as ProjetStatut)}
                      className="text-xs border border-gray-200 rounded-full px-2 py-0.5 bg-white cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {PROJET_STATUTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                    <button onClick={() => handleDelete(projet.id)} className="text-xs text-red-400 hover:text-red-600">×</button>
                  </div>
                </div>

                {projet.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{projet.description}</p>
                )}

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(projet.date_debut)}
                    </span>
                    {projet.date_fin_prevue && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(projet.date_fin_prevue)}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-700">{formatCurrency(projet.montant || 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
