'use client';

import { useState } from 'react';
import { Search, Plus, TrendingUp, Building2 } from 'lucide-react';
import { mockClients } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

export default function ClientsPage() {
  const [search, setSearch] = useState('');

  const mrrTotal = mockClients.reduce((sum, c) => sum + c.mrr, 0);

  const filtered = mockClients.filter((c) =>
    !search ||
    c.entreprise.toLowerCase().includes(search.toLowerCase()) ||
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
            <p className="text-xs text-gray-500">Clients actifs</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(mrrTotal)}</p>
            <p className="text-xs text-gray-500">MRR total</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(mrrTotal * 12)}</p>
            <p className="text-xs text-gray-500">ARR estime</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau client</span>
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
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
                    <span className="text-sm text-gray-600">{client.telephone}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(client.mrr)}/mois</span>
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
    </div>
  );
}
