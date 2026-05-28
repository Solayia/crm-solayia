'use client';

import { PIPELINE_PROJET, PROSPECT_STATUTS } from '@/lib/types';
import type { ProspectStatut } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Phone, Mail, Building2 } from 'lucide-react';
import Link from 'next/link';

interface ClientKanbanProps {
  prospects: any[];
  onStatutChange: (id: string, statut: ProspectStatut) => void;
}

const columnColors: Record<string, string> = {
  brief: 'border-t-fuchsia-500',
  maquette: 'border-t-pink-500',
  validation_maquette: 'border-t-rose-500',
  pre_prod: 'border-t-amber-500',
  validation_pre_prod: 'border-t-orange-500',
  production: 'border-t-emerald-500',
  suivi: 'border-t-green-500',
};

const projetStatutsOnly = PROSPECT_STATUTS.filter(s =>
  ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'].includes(s.value)
);

export default function ClientKanban({ prospects, onStatutChange }: ClientKanbanProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px]">
        {PIPELINE_PROJET.map((statut) => {
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
                        <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {getInitials(displayName)}
                        </div>
                      </div>
                      {prospect.entreprise && (prospect.prenom || prospect.nom) && (
                        <p className="text-xs text-gray-500 mb-1.5">
                          {prospect.prenom} {prospect.nom}
                        </p>
                      )}
                      {prospect.type_prestation && (
                        <p className="text-[10px] text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 inline-block mb-1.5">
                          {prospect.type_prestation}
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
                        {prospect.tarif_propose && (
                          <span className="ml-auto text-[10px] font-semibold text-green-600">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prospect.tarif_propose)}
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
                          {projetStatutsOnly.map((s) => (
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
                    Aucun projet
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
