'use client';

import { useState } from 'react';
import { Search, Plus, Calendar, Clock } from 'lucide-react';
import StatutBadge from '@/components/shared/StatutBadge';
import { mockProjets } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { PROJET_STATUTS } from '@/lib/types';
import type { ProjetStatut } from '@/lib/types';

export default function ProjetsPage() {
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<ProjetStatut | ''>('');

  const filtered = mockProjets.filter((p) => {
    const matchSearch = !search || p.nom.toLowerCase().includes(search.toLowerCase()) || p.client?.entreprise?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const enCours = mockProjets.filter((p) => p.statut === 'en_cours');
  const montantTotal = mockProjets.reduce((s, p) => s + p.montant, 0);

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
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockProjets.length}</p>
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
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau projet
        </button>
      </div>

      {/* Cards */}
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
                <StatutBadge statut={projet.statut} />
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
                <span className="font-semibold text-gray-700">{formatCurrency(projet.montant)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
