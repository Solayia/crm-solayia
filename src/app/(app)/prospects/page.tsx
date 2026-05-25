'use client';

import { useState } from 'react';
import { Plus, LayoutGrid, List, Search, Upload, Filter } from 'lucide-react';
import StatutBadge from '@/components/shared/StatutBadge';
import ProspectKanban from '@/components/prospects/ProspectKanban';
import { mockProspects, mockProfiles } from '@/lib/mock-data';
import { formatDate, getInitials } from '@/lib/utils';
import type { ProspectStatut } from '@/lib/types';
import { PROSPECT_STATUTS } from '@/lib/types';
import Link from 'next/link';

type ViewMode = 'table' | 'kanban';

export default function ProspectsPage() {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<ProspectStatut | ''>('');

  const filtered = mockProspects.filter((p) => {
    const matchSearch =
      !search ||
      p.entreprise.toLowerCase().includes(search.toLowerCase()) ||
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un prospect..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Filter statut */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as ProspectStatut | '')}
              className="input-field pl-9 pr-8 appearance-none cursor-pointer"
            >
              <option value="">Tous les statuts</option>
              {PROSPECT_STATUTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link href="/prospects/import" className="btn-secondary">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import CSV</span>
          </Link>

          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'kanban' ? (
        <ProspectKanban prospects={filtered} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Entreprise</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Assigne</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((prospect) => {
                  const assignee = mockProfiles.find((p) => p.id === prospect.assigned_to);
                  return (
                    <tr key={prospect.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{prospect.entreprise}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{prospect.prenom} {prospect.nom}</p>
                        <p className="text-xs text-gray-400">{prospect.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatutBadge statut={prospect.statut} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{prospect.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                              {getInitials(assignee.full_name)}
                            </div>
                            <span className="text-xs text-gray-600">{assignee.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{formatDate(prospect.created_at)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            {filtered.length} prospect{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
