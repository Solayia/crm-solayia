'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, FileText, Download, Trash2 } from 'lucide-react';
import StatutBadge from '@/components/shared/StatutBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DEVIS_STATUTS } from '@/lib/types';
import type { DevisStatut } from '@/lib/types';
import Link from 'next/link';
import { getDevis, updateDevisStatut, deleteDevis } from './actions';

export default function DevisPage() {
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<DevisStatut | ''>('');
  const [devisList, setDevisList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const data = await getDevis();
    setDevisList(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatutChange = async (id: string, statut: DevisStatut) => {
    await updateDevisStatut(id, statut);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return;
    await deleteDevis(id);
    await loadData();
  };

  const filtered = devisList.filter((d) => {
    const name = d.prospect?.entreprise || d.client?.entreprise || '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || d.numero?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || d.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalHT = filtered.reduce((s: number, d: any) => s + (d.montant_ht || 0), 0);
  const enCours = devisList.filter((d: any) => ['brouillon', 'envoye'].includes(d.statut));
  const acceptes = devisList.filter((d: any) => d.statut === 'accepte');

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Devis en cours</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enCours.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(enCours.reduce((s: number, d: any) => s + (d.montant_ht || 0), 0))} HT</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Devis acceptes</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{acceptes.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(acceptes.reduce((s: number, d: any) => s + (d.montant_ht || 0), 0))} HT</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Taux de conversion</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{devisList.length > 0 ? Math.round((acceptes.length / devisList.length) * 100) : 0}%</p>
          <p className="text-xs text-gray-400 mt-0.5">{acceptes.length}/{devisList.length} devis</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un devis..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value as DevisStatut | '')} className="input-field w-auto">
            <option value="">Tous</option>
            {DEVIS_STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <Link href="/devis/nouveau" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau devis
        </Link>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Aucun devis{search || filterStatut ? ' pour cette recherche' : ''}</p>
          {!search && !filterStatut && <Link href="/devis/nouveau" className="btn-primary"><Plus className="w-4 h-4" />Creer un devis</Link>}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Numero</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Destinataire</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Montant HT</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">TTC</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Emission</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Validite</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((devis) => {
                  const dest = devis.prospect?.entreprise || devis.client?.entreprise || '—';
                  const isClient = !!devis.client;

                  return (
                    <tr key={devis.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-mono font-medium text-gray-900">{devis.numero}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{dest}</p>
                        <p className="text-[11px] text-gray-400">{isClient ? 'Client' : 'Prospect'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={devis.statut}
                          onChange={(e) => handleStatutChange(devis.id, e.target.value as DevisStatut)}
                          className="text-xs border border-gray-200 rounded-full px-2 py-0.5 bg-white cursor-pointer"
                        >
                          {DEVIS_STATUTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(devis.montant_ht)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-500">{formatCurrency(devis.montant_ttc)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{formatDate(devis.date_emission)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{formatDate(devis.date_validite)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(devis.id)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{filtered.length} devis</span>
            <span>Total : {formatCurrency(totalHT)} HT</span>
          </div>
        </div>
      )}
    </div>
  );
}
