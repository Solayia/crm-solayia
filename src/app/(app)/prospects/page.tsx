'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, LayoutGrid, List, Search, Upload, X } from 'lucide-react';
import ProspectKanban from '@/components/prospects/ProspectKanban';
import { formatDate, getInitials } from '@/lib/utils';
import type { ProspectStatut } from '@/lib/types';
import { PROSPECT_STATUTS } from '@/lib/types';
import Link from 'next/link';
import { getProspects, getProfiles, createProspect, deleteProspect, updateProspectStatut } from './actions';

type ViewMode = 'table' | 'kanban';

export default function ProspectsPage() {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<ProspectStatut | ''>('');
  const [prospects, setProspects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [p, pr] = await Promise.all([getProspects(), getProfiles()]);
    setProspects(p);
    setProfiles(pr);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createProspect(formData);
    if (!result.error) {
      setShowForm(false);
      await loadData();
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce prospect ?')) return;
    await deleteProspect(id);
    await loadData();
  };

  const handleStatutChange = async (id: string, statut: ProspectStatut) => {
    await updateProspectStatut(id, statut);
    await loadData();
  };

  const filtered = prospects.filter((p) => {
    const matchSearch = !search ||
      p.entreprise?.toLowerCase().includes(search.toLowerCase()) ||
      p.nom?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value as ProspectStatut | '')} className="input-field w-auto shrink-0">
            <option value="">Tous</option>
            {PROSPECT_STATUTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setView('table')} className={`p-2 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setView('kanban')} className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/prospects/import" className="btn-secondary"><Upload className="w-4 h-4" /><span className="hidden sm:inline">Import</span></Link>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nouveau</span></button>
          </div>
        </div>
      </div>

      {/* Modal creation */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowForm(false)}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouveau prospect</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 -mr-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label><input name="nom" required className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label><input name="prenom" className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label><input name="entreprise" required className="input-field" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input name="email" type="email" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label><input name="telephone" className="input-field" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select name="source" className="input-field">
                    <option value="">—</option>
                    <option>Site web</option><option>Google Ads</option><option>Bouche a oreille</option>
                    <option>Recommandation</option><option>Salon professionnel</option><option>Reseaux sociaux</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigne a</label>
                  <select name="assigned_to" className="input-field">
                    <option value="">—</option>
                    {profiles.map((p) => (<option key={p.id} value={p.id}>{p.full_name}</option>))}
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea name="notes" rows={2} className="input-field" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 sm:flex-none">Annuler</button>
                <button type="submit" disabled={formLoading} className="btn-primary flex-1 sm:flex-none">{formLoading ? 'Creation...' : 'Creer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Aucun prospect{search || filterStatut ? ' pour cette recherche' : ''}</p>
          {!search && !filterStatut && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Ajouter un prospect</button>}
        </div>
      ) : view === 'kanban' ? (
        <ProspectKanban prospects={filtered} onStatutChange={handleStatutChange} />
      ) : (
        <>
          {/* Mobile: card view */}
          <div className="space-y-3 md:hidden">
            {filtered.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.entreprise}</p>
                    <p className="text-xs text-gray-500">{p.prenom} {p.nom}</p>
                  </div>
                  {p.assigned_profile && (
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitials(p.assigned_profile.full_name)}
                    </div>
                  )}
                </div>
                {p.email && <p className="text-xs text-gray-400 mb-2">{p.email}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <select value={p.statut} onChange={(e) => handleStatutChange(p.id, e.target.value as ProspectStatut)} className="text-xs border border-gray-200 rounded-full px-2.5 py-1 bg-white min-h-[32px]">
                      {PROSPECT_STATUTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                    {p.source && <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{p.source}</span>}
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600 p-1 min-h-[32px]">Supprimer</button>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 text-center py-2">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</p>
          </div>

          {/* Desktop: table view */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Entreprise</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Assigne</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{p.entreprise}</p></td>
                      <td className="px-4 py-3"><p className="text-sm text-gray-700">{p.prenom} {p.nom}</p><p className="text-xs text-gray-400">{p.email}</p></td>
                      <td className="px-4 py-3">
                        <select value={p.statut} onChange={(e) => handleStatutChange(p.id, e.target.value as ProspectStatut)} className="text-xs border border-gray-200 rounded-full px-2 py-0.5 bg-white cursor-pointer">
                          {PROSPECT_STATUTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-500">{p.source || '—'}</span></td>
                      <td className="px-4 py-3">
                        {p.assigned_profile ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">{getInitials(p.assigned_profile.full_name)}</div>
                            <span className="text-xs text-gray-600">{p.assigned_profile.full_name}</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-500">{formatDate(p.created_at)}</span></td>
                      <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</div>
          </div>
        </>
      )}
    </div>
  );
}
