'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, LayoutGrid, List, Search, Upload, X, ChevronRight, Flame, Snowflake, Sun, Users } from 'lucide-react';
import ProspectKanban from '@/components/prospects/ProspectKanban';
import { formatDate, getInitials } from '@/lib/utils';
import type { ProspectStatut, ProspectTemperature, TypeContact } from '@/lib/types';
import { PROSPECT_STATUTS, PROSPECT_TEMPERATURES, TYPES_CONTACT, SOURCES_PROSPECT } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { getProspects, getProfiles, createProspect, deleteProspect, updateProspectStatut } from './actions';

type ViewMode = 'table' | 'kanban';

const tempIcons: Record<string, { icon: typeof Flame; color: string }> = {
  chaud: { icon: Flame, color: 'text-red-500' },
  tiede: { icon: Sun, color: 'text-amber-500' },
  froid: { icon: Snowflake, color: 'text-blue-500' },
};

export default function ProspectsPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<ProspectStatut | ''>('');
  const [filterTemp, setFilterTemp] = useState<ProspectTemperature | ''>('');
  const [filterType, setFilterType] = useState<TypeContact | ''>('');
  const [prospects, setProspects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const router = useRouter();

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

  const handleImport = async () => {
    if (!confirm('Importer les 44 contacts CRM dans Supabase ?')) return;
    setImporting(true);
    setImportMsg('');
    try {
      const res = await fetch('/api/import-prospects', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        setImportMsg(`Erreur : ${data.error}`);
      } else {
        setImportMsg(data.message);
        await loadData();
      }
    } catch {
      setImportMsg('Erreur réseau lors de l\'import.');
    }
    setImporting(false);
  };

  const filtered = prospects.filter((p) => {
    const matchSearch = !search ||
      p.entreprise?.toLowerCase().includes(search.toLowerCase()) ||
      p.nom?.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || p.statut === filterStatut;
    const matchTemp = !filterTemp || p.temperature === filterTemp;
    const matchType = !filterType || p.type_contact === filterType;
    return matchSearch && matchStatut && matchTemp && matchType;
  });

  // Compteurs
  const countChaud = prospects.filter(p => p.temperature === 'chaud').length;
  const countTiede = prospects.filter(p => p.temperature === 'tiede').length;
  const countFroid = prospects.filter(p => p.temperature === 'froid').length;
  const countPrescripteurs = prospects.filter(p => p.type_contact === 'prescripteur').length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats rapides temperature */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button onClick={() => setFilterTemp(filterTemp === 'chaud' ? '' : 'chaud')} className={`card p-3 text-left transition-all ${filterTemp === 'chaud' ? 'ring-2 ring-red-400' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Chauds</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{countChaud}</p>
        </button>
        <button onClick={() => setFilterTemp(filterTemp === 'tiede' ? '' : 'tiede')} className={`card p-3 text-left transition-all ${filterTemp === 'tiede' ? 'ring-2 ring-amber-400' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Tièdes</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{countTiede}</p>
        </button>
        <button onClick={() => setFilterTemp(filterTemp === 'froid' ? '' : 'froid')} className={`card p-3 text-left transition-all ${filterTemp === 'froid' ? 'ring-2 ring-blue-400' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Froids</span>
            <Snowflake className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{countFroid}</p>
        </button>
        <button onClick={() => setFilterType(filterType === 'prescripteur' ? '' : 'prescripteur')} className={`card p-3 text-left transition-all ${filterType === 'prescripteur' ? 'ring-2 ring-teal-400' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Prescripteurs</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{countPrescripteurs}</p>
        </button>
      </div>

      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom, entreprise, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value as ProspectStatut | '')} className="input-field w-auto shrink-0 text-sm">
            <option value="">Toutes étapes</option>
            {PROSPECT_STATUTS.filter(s => ['prospect','prise_contact','r1','r2','proposition','acompte','perdu'].includes(s.value)).map((s) => (
              <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setView('table')} className={`p-2 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setView('kanban')} className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleImport} disabled={importing} className="btn-secondary">
              {importing ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
              <span className="hidden sm:inline">{importing ? 'Import...' : 'Import CRM'}</span>
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nouveau</span></button>
          </div>
        </div>
      </div>

      {/* Import feedback */}
      {importMsg && (
        <div className={`p-3 rounded-lg text-sm font-medium flex items-center justify-between ${importMsg.startsWith('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {importMsg}
          <button onClick={() => setImportMsg('')} className="text-xs opacity-60 hover:opacity-100 ml-2">✕</button>
        </div>
      )}

      {/* Modal creation */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowForm(false)}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouveau prospect</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 -mr-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              {/* Type de contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contact</label>
                <select name="type_contact" className="input-field">
                  {TYPES_CONTACT.map((t) => (<option key={t.value} value={t.value}>{t.emoji} {t.label}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom</label><input name="nom" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label><input name="prenom" className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label><input name="entreprise" className="input-field" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input name="email" type="email" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label><input name="telephone" className="input-field" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Température</label>
                  <select name="temperature" className="input-field">
                    {PROSPECT_TEMPERATURES.map((t) => (<option key={t.value} value={t.value}>{t.emoji} {t.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select name="source" className="input-field">
                    <option value="">—</option>
                    {SOURCES_PROSPECT.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                  <select name="assigned_to" className="input-field">
                    <option value="">—</option>
                    {profiles.map((pr) => (<option key={pr.id} value={pr.id}>{pr.full_name}</option>))}
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea name="notes" rows={2} className="input-field" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 sm:flex-none">Annuler</button>
                <button type="submit" disabled={formLoading} className="btn-primary flex-1 sm:flex-none">{formLoading ? 'Création...' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Aucun prospect{search || filterStatut || filterTemp ? ' pour cette recherche' : ''}</p>
          {!search && !filterStatut && !filterTemp && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Ajouter un prospect</button>}
        </div>
      ) : view === 'kanban' ? (
        <ProspectKanban prospects={filtered} onStatutChange={handleStatutChange} />
      ) : (
        <>
          {/* Mobile: card view */}
          <div className="space-y-3 md:hidden">
            {filtered.map((p) => {
              const TempIcon = tempIcons[p.temperature]?.icon || Sun;
              const tempColor = tempIcons[p.temperature]?.color || 'text-gray-400';
              const displayName = p.entreprise || `${p.prenom} ${p.nom}`.trim() || 'Sans nom';
              const statutInfo = PROSPECT_STATUTS.find(s => s.value === p.statut);

              return (
                <div key={p.id} className="card p-4 cursor-pointer hover:border-brand-200 transition-colors" onClick={() => router.push(`/prospects/${p.id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                      {p.entreprise && (p.prenom || p.nom) && <p className="text-xs text-gray-500">{p.prenom} {p.nom}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TempIcon className={`w-4 h-4 ${tempColor}`} />
                      {p.type_contact === 'prescripteur' && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Prescripteur</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  {p.email && <p className="text-xs text-gray-400 mb-2">{p.email}</p>}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statutInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statutInfo?.emoji} {statutInfo?.label || p.statut}
                      </span>
                      {p.source && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{p.source}</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="text-xs text-red-400 hover:text-red-600 p-1 min-h-[32px]">Supprimer</button>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-500 text-center py-2">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</p>
          </div>

          {/* Desktop: table view */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Nom / Entreprise</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Temp.</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Étape</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Assigné</th>
                  <th className="px-4 py-3"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => {
                    const TempIcon = tempIcons[p.temperature]?.icon || Sun;
                    const tempColor = tempIcons[p.temperature]?.color || 'text-gray-400';
                    const tempLabel = PROSPECT_TEMPERATURES.find(t => t.value === p.temperature)?.label || '';
                    const displayName = p.entreprise || `${p.prenom} ${p.nom}`.trim() || 'Sans nom';

                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/prospects/${p.id}`)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{displayName}</p>
                            {p.type_contact === 'prescripteur' && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Prescr.</span>
                            )}
                          </div>
                          {p.entreprise && (p.prenom || p.nom) && <p className="text-xs text-gray-500">{p.prenom} {p.nom}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {p.telephone && <p className="text-sm text-gray-700">{p.telephone}</p>}
                          {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <TempIcon className={`w-4 h-4 ${tempColor}`} />
                            <span className="text-xs text-gray-600">{tempLabel}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select value={p.statut} onChange={(e) => { e.stopPropagation(); handleStatutChange(p.id, e.target.value as ProspectStatut); }} onClick={(e) => e.stopPropagation()} className="text-xs border border-gray-200 rounded-full px-2 py-0.5 bg-white cursor-pointer">
                            {PROSPECT_STATUTS.filter(s => ['prospect','prise_contact','r1','r2','proposition','acompte','perdu'].includes(s.value)).map((s) => (<option key={s.value} value={s.value}>{s.emoji} {s.label}</option>))}
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
