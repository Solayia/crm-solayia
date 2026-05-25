'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, TrendingUp, Building2, X } from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { getClients, createClientAction } from './actions';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getClients();
    setClients(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createClientAction(formData);
    if (!result.error) {
      setShowForm(false);
      await loadData();
    }
    setFormLoading(false);
  };

  const mrrTotal = clients.reduce((sum: number, c: any) => sum + (c.mrr || 0), 0);

  const filtered = clients.filter((c) =>
    !search ||
    c.entreprise?.toLowerCase().includes(search.toLowerCase()) ||
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="card p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{clients.length}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">Clients actifs</p>
          </div>
        </div>
        <div className="card p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{formatCurrency(mrrTotal)}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">MRR total</p>
          </div>
        </div>
        <div className="card p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{formatCurrency(mrrTotal * 12)}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">ARR estime</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau client</span>
        </button>
      </div>

      {/* Modal creation — bottom-sheet on mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowForm(false)}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouveau client</h3>
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
              <div><label className="block text-sm font-medium text-gray-700 mb-1">MRR (EUR/mois)</label><input name="mrr" type="number" step="0.01" defaultValue="0" className="input-field" /></div>
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
          <p className="text-gray-400 text-sm mb-3">Aucun client{search ? ' pour cette recherche' : ''}</p>
          {!search && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Ajouter un client</button>}
        </div>
      ) : (
        <>
          {/* Mobile: card view */}
          <div className="space-y-3 md:hidden">
            {filtered.map((client) => (
              <div key={client.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(client.entreprise)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{client.entreprise}</p>
                    <p className="text-xs text-gray-500">{client.prenom} {client.nom}</p>
                    {client.email && <p className="text-xs text-gray-400 truncate">{client.email}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(client.mrr || 0)}</p>
                    <p className="text-[10px] text-gray-400">/mois</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {client.telephone && <span className="text-xs text-gray-500">{client.telephone}</span>}
                  </div>
                  <span className="text-[11px] text-gray-400">Depuis {formatDate(client.created_at)}</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 text-center py-2">{filtered.length} client{filtered.length > 1 ? 's' : ''}</p>
          </div>

          {/* Desktop: table view */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Telephone</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">MRR</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Depuis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(client.entreprise)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{client.entreprise}</p>
                            {client.notes && <p className="text-xs text-gray-400 line-clamp-1">{client.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{client.prenom} {client.nom}</p>
                        <p className="text-xs text-gray-400">{client.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{client.telephone || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-green-600">{formatCurrency(client.mrr || 0)}/mois</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{formatDate(client.created_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              {filtered.length} client{filtered.length > 1 ? 's' : ''}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
