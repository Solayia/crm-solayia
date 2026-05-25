'use client';

import { PROSPECT_STATUTS } from '@/lib/types';
import type { Prospect } from '@/lib/types';
import StatutBadge from '@/components/shared/StatutBadge';
import { getInitials } from '@/lib/utils';
import { mockProfiles } from '@/lib/mock-data';
import { Phone, Mail } from 'lucide-react';

interface ProspectKanbanProps {
  prospects: Prospect[];
}

const columnColors: Record<string, string> = {
  nouveau: 'border-t-gray-400',
  qualifie: 'border-t-blue-500',
  premier_contact: 'border-t-indigo-500',
  rdv: 'border-t-purple-500',
  devis: 'border-t-amber-500',
  nego: 'border-t-orange-500',
  gagne: 'border-t-green-500',
  perdu: 'border-t-red-500',
};

export default function ProspectKanban({ prospects }: ProspectKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {PROSPECT_STATUTS.map((statut) => {
        const items = prospects.filter((p) => p.statut === statut.value);
        return (
          <div key={statut.value} className="flex-shrink-0 w-72">
            {/* Column header */}
            <div className={`card border-t-4 ${columnColors[statut.value]} mb-3`}>
              <div className="px-3 py-2.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{statut.label}</span>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {items.map((prospect) => {
                const assignee = mockProfiles.find((p) => p.id === prospect.assigned_to);
                return (
                  <div
                    key={prospect.id}
                    className="card p-3 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                        {prospect.entreprise}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {prospect.prenom} {prospect.nom}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      {prospect.telephone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                        </span>
                      )}
                      {prospect.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                        </span>
                      )}
                      <span className="ml-auto text-[11px] px-1.5 py-0.5 bg-gray-50 rounded text-gray-500">
                        {prospect.source}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatutBadge statut={prospect.statut} />
                      {assignee && (
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold" title={assignee.full_name}>
                          {getInitials(assignee.full_name)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">
                  Aucun prospect
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
