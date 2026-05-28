'use client';

import { PROSPECT_STATUTS, PIPELINE_COMMERCIAL } from '@/lib/types';
import type { Prospect } from '@/lib/types';

interface PipelineOverviewProps {
  prospects: Prospect[];
}

const barColors: Record<string, string> = {
  prospect: 'bg-gray-400',
  prise_contact: 'bg-sky-500',
  r1: 'bg-blue-500',
  r2: 'bg-indigo-500',
  proposition: 'bg-violet-500',
  acompte: 'bg-purple-500',
  brief: 'bg-fuchsia-500',
  maquette: 'bg-pink-500',
  validation_maquette: 'bg-rose-500',
  pre_prod: 'bg-amber-500',
  validation_pre_prod: 'bg-orange-500',
  production: 'bg-emerald-500',
  suivi: 'bg-green-500',
};

export default function PipelineOverview({ prospects }: PipelineOverviewProps) {
  // On affiche le pipeline commercial (avant signature) sur le dashboard
  const pipelineStatuts = PIPELINE_COMMERCIAL;
  const total = prospects.length || 1;

  const counts = pipelineStatuts.map((s) => ({
    ...s,
    count: prospects.filter((p) => p.statut === s.value).length,
  }));

  const enChantier = prospects.filter((p) =>
    ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production'].includes(p.statut)
  ).length;

  const enSuivi = prospects.filter((p) => p.statut === 'suivi').length;
  const perdus = prospects.filter((p) => p.statut === 'perdu').length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Pipeline commercial</h3>
          <p className="text-xs text-gray-500 mt-0.5">{prospects.length} contacts au total</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {counts.map((item) => {
          const pct = (item.count / total) * 100;
          return (
            <div key={item.value}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {item.emoji} {item.label}
                </span>
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColors[item.value] || 'bg-gray-400'}`}
                  style={{ width: `${Math.max(pct, item.count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections resume */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-fuchsia-600">🔧 En chantier</span>
          <span className="text-xs font-bold text-fuchsia-600">{enChantier}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-green-600">🏁 En suivi</span>
          <span className="text-xs font-bold text-green-600">{enSuivi}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-500">❌ Perdu</span>
          <span className="text-xs font-bold text-red-500">{perdus}</span>
        </div>
      </div>
    </div>
  );
}
