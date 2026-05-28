'use client';

import { useState } from 'react';
import { PROSPECT_STATUTS, PIPELINE_COMMERCIAL, PIPELINE_PROJET, PROSPECT_TEMPERATURES } from '@/lib/types';
import type { ProspectStatut } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Phone, Mail, Flame, Snowflake, Sun } from 'lucide-react';
import Link from 'next/link';

interface ProspectKanbanProps {
  prospects: any[];
  onStatutChange: (id: string, statut: ProspectStatut) => void;
}

const columnColors: Record<string, string> = {
  prospect: 'border-t-gray-400',
  prise_contact: 'border-t-sky-500',
  r1: 'border-t-blue-500',
  r2: 'border-t-indigo-500',
  proposition: 'border-t-violet-500',
  acompte: 'border-t-purple-500',
  brief: 'border-t-fuchsia-500',
  maquette: 'border-t-pink-500',
  validation_maquette: 'border-t-rose-500',
  pre_prod: 'border-t-amber-500',
  validation_pre_prod: 'border-t-orange-500',
  production: 'border-t-emerald-500',
  suivi: 'border-t-green-500',
  perdu: 'border-t-red-500',
};

const tempIcons: Record<string, { icon: typeof Flame; color: string }> = {
  chaud: { icon: Flame, color: 'text-red-500' },
  tiede: { icon: Sun, color: 'text-amber-500' },
  froid: { icon: Snowflake, color: 'text-blue-500' },
};

type KanbanView = 'commercial' | 'projet' | 'all';

export default function ProspectKanban({ prospects, onStatutChange }: ProspectKanbanProps) {
  const [kanbanView, setKanbanView] = useState<KanbanView>('commercial');

  const statuts = kanbanView === 'commercial'
    ? [...PIPELINE_COMMERCIAL, PROSPECT_STATUTS.find(s => s.value === 'perdu')!]
    : kanbanView === 'projet'
    ? PIPELINE_PROJET
    : PROSPECT_STATUTS;

  return (
    <div className="space-y-3">
      {/* Toggle Commercial / Projet / Tout */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
        {[
          { key: 'commercial' as KanbanView, label: 'Commercial', emoji: '💼' },
          { key: 'projet' as KanbanView, label: 'Projet', emoji: '🔧' },
          { key: 'all' as KanbanView, label: 'Tout', emoji: '📊' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setKanbanView(tab.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              kanbanView === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px]">
        {statuts.map((statut) => {
          const items = prospects.filter((p) => p.statut === statut.value);
          return (
            <div key={statut.value} className="flex-shrink-0 w-64">
              {/* Column header */}
              <div className={`card border-t-4 ${columnColors[statut.value]} mb-3`}>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <span>{statut.emoji}</span>
                    {statut.label}
                  </span>
                  <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {items.map((prospect) => {
                  const TempIcon = tempIcons[prospect.temperature]?.icon || Sun;
                  const tempColor = tempIcons[prospect.temperature]?.color || 'text-gray-400';
                  const displayName = prospect.entreprise || `${prospect.prenom} ${prospect.nom}`.trim() || 'Sans nom';

                  return (
                    <Link
                      key={prospect.id}
                      href={`/prospects/${prospect.id}`}
                      className="card p-3 hover:shadow-md transition-shadow cursor-pointer group block"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors leading-tight flex-1 mr-2">
                          {displayName}
                        </h4>
                        <TempIcon className={`w-4 h-4 shrink-0 ${tempColor}`} />
                      </div>
                      {prospect.entreprise && (prospect.prenom || prospect.nom) && (
                        <p className="text-xs text-gray-500 mb-1.5">
                          {prospect.prenom} {prospect.nom}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        {prospect.telephone && (
                          <span className="flex items-center gap-0.5">
                            <Phone className="w-3 h-3" />
                          </span>
                        )}
                        {prospect.email && (
                          <span className="flex items-center gap-0.5">
                            <Mail className="w-3 h-3" />
                          </span>
                        )}
                        {prospect.source && (
                          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-50 rounded text-gray-500 truncate max-w-[100px]">
                            {prospect.source}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <select
                          value={prospect.statut}
                          onChange={(e) => { e.preventDefault(); e.stopPropagation(); onStatutChange(prospect.id, e.target.value as ProspectStatut); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="text-[11px] border border-gray-200 rounded-full px-2 py-0.5 bg-white cursor-pointer max-w-[130px]"
                        >
                          {PROSPECT_STATUTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
                          ))}
                        </select>
                        {prospect.assigned_profile && (
                          <div
                            className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold"
                            title={prospect.assigned_profile.full_name}
                          >
                            {getInitials(prospect.assigned_profile.full_name)}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center py-6 text-[11px] text-gray-400">
                    Aucun prospect
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
