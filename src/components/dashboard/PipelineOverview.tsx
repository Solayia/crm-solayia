'use client';

import { PROSPECT_STATUTS } from '@/lib/types';
import type { Prospect } from '@/lib/types';

interface PipelineOverviewProps {
  prospects: Prospect[];
}

export default function PipelineOverview({ prospects }: PipelineOverviewProps) {
  const pipelineStatuts = PROSPECT_STATUTS.filter((s) => s.value !== 'perdu');
  const total = prospects.length || 1;

  const counts = pipelineStatuts.map((s) => ({
    ...s,
    count: prospects.filter((p) => p.statut === s.value).length,
  }));

  const barColors: Record<string, string> = {
    nouveau: 'bg-gray-400',
    qualifie: 'bg-blue-500',
    premier_contact: 'bg-indigo-500',
    rdv: 'bg-purple-500',
    devis: 'bg-amber-500',
    nego: 'bg-orange-500',
    gagne: 'bg-green-500',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Pipeline commercial</h3>
          <p className="text-xs text-gray-500 mt-0.5">{prospects.length} prospects actifs</p>
        </div>
      </div>

      <div className="space-y-3">
        {counts.map((item) => {
          const pct = (item.count / total) * 100;
          return (
            <div key={item.value}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
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

      {/* Perdu */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-500">Perdu</span>
          <span className="text-xs font-bold text-red-500">
            {prospects.filter((p) => p.statut === 'perdu').length}
          </span>
        </div>
      </div>
    </div>
  );
}
