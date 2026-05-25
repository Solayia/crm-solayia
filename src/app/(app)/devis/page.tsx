'use client';

import { useState } from 'react';
import { Plus, Search, FileText, Download } from 'lucide-react';
import StatutBadge from '@/components/shared/StatutBadge';
import { mockDevis, mockProspects, mockClients } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DEVIS_STATUTS } from '@/lib/types';
import type { DevisStatut } from '@/lib/types';
import Link from 'next/link';

export default function DevisPage() {
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<DevisStatut | ''>('');

  const filtered = mockDevis.filter((d) => {
    const prospect = mockProspects.find((p) => p.id === d.prospect_id);
    const client = mockClients.find((c) => c.id === d.client_id);
    const name = prospect?.entreprise || client?.entreprise || '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || d.numero.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || d.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalHT = filtered.reduce((s, d) => s + d.montant_ht, 0);
  const enCours = mockDevis.filter((d) => ['brouillon', 'envoye'].includes(d.statut));
  const acceptes = mockDevis.filter((d) => d.statut === 'accepte');

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Devis en cours</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enCours.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(enCours.reduce((s, d) => s + d.montant_ht, 0))} HT</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Devis acceptes</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{acceptes.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(acceptes.reduce((s, d) => s + d.montant_ht, 0))} HT</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 font-medium">Taux de conversion</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{mockDevis.length > 0 ? Math.round((acceptes.length / mockDevis.length) * 100) : 0}%</p>
          <p className="text-xs text-gray-400 mt-0.5">{acceptes.length}/{mockDevis.length} devis</p>
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
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((devis) => {
                const prospect = mockProspects.find((p) => p.id === devis.prospect_id);
                const client = mockClients.find((c) => c.id === devis.client_id);
                const dest = prospect?.entreprise || client?.entreprise || '—';
                const isClient = !!client;

                return (
                  <tr key={devis.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
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
                      <StatutBadge statut={devis.statut} />
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
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 text-gray-400 hover:text-brand-600 rounded hover:bg-brand-50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
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
    </div>
  );
}
