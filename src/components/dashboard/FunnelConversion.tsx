'use client';

import { PIPELINE_COMMERCIAL } from '@/lib/types';

interface FunnelConversionProps {
  prospects: Array<{ statut: string; motif_perte?: string | null }>;
}

export default function FunnelConversion({ prospects }: FunnelConversionProps) {
  // Count prospects at each stage
  const stageCounts = PIPELINE_COMMERCIAL.map(stage => {
    const count = prospects.filter(p => p.statut === stage.value).length;
    return { ...stage, count };
  });

  // Count prospects who passed through each stage (at or beyond)
  const stageOrder = PIPELINE_COMMERCIAL.map(s => s.value);
  const passedThrough = stageOrder.map((stage, idx) => {
    // Count prospects at this stage or any later stage
    const laterStages = stageOrder.slice(idx);
    const projectStages = ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'];
    const allLater = [...laterStages, ...projectStages];
    return prospects.filter(p => allLater.includes(p.statut)).length;
  });

  const totalProspects = prospects.filter(p => p.statut !== 'perdu').length;
  const perdus = prospects.filter(p => p.statut === 'perdu').length;
  const maxCount = Math.max(totalProspects, 1);

  // Motifs de perte
  const motifCounts: Record<string, number> = {};
  prospects
    .filter(p => p.statut === 'perdu' && p.motif_perte)
    .forEach(p => {
      const m = p.motif_perte as string;
      motifCounts[m] = (motifCounts[m] || 0) + 1;
    });

  const motifLabels: Record<string, string> = {
    trop_cher: 'Trop cher',
    concurrent: 'Concurrent',
    pas_de_besoin: 'Pas de besoin',
    timing: 'Mauvais timing',
    pas_de_reponse: 'Pas de reponse',
    budget_insuffisant: 'Budget insuffisant',
    projet_reporte: 'Projet reporte',
    autre: 'Autre',
  };

  const sortedMotifs = Object.entries(motifCounts).sort((a, b) => b[1] - a[1]);
  const maxMotifCount = sortedMotifs.length > 0 ? sortedMotifs[0][1] : 1;

  // Conversion rates
  const conversionRate = totalProspects > 0
    ? Math.round((prospects.filter(p => ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'].includes(p.statut)).length / (totalProspects + perdus)) * 100)
    : 0;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Funnel de conversion</h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
          {conversionRate}% conversion
        </span>
      </div>

      {/* Visual funnel */}
      <div className="space-y-1.5 mb-6">
        {stageCounts.map((stage, idx) => {
          const through = passedThrough[idx];
          const widthPct = maxCount > 0 ? Math.max((through / maxCount) * 100, 15) : 15;
          const rate = idx > 0 && passedThrough[idx - 1] > 0
            ? Math.round((through / passedThrough[idx - 1]) * 100)
            : 100;

          return (
            <div key={stage.value} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-24 truncate text-right">
                {stage.emoji} {stage.label}
              </span>
              <div className="flex-1 relative">
                <div
                  className="h-7 rounded-md flex items-center justify-between px-2 transition-all"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(135deg, ${idx === 0 ? '#3b82f6' : idx <= 2 ? '#6366f1' : idx <= 4 ? '#8b5cf6' : '#a855f7'}, ${idx === 0 ? '#60a5fa' : idx <= 2 ? '#818cf8' : idx <= 4 ? '#a78bfa' : '#c084fc'})`,
                  }}
                >
                  <span className="text-[10px] font-bold text-white">{stage.count}</span>
                  {idx > 0 && (
                    <span className="text-[9px] text-white/80">{rate}%</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Perdu */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-500 w-24 text-right">❌ Perdu</span>
          <div className="flex-1 relative">
            <div
              className="h-7 rounded-md flex items-center justify-between px-2"
              style={{
                width: `${maxCount > 0 ? Math.max((perdus / maxCount) * 100, perdus > 0 ? 15 : 5) : 5}%`,
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
              }}
            >
              <span className="text-[10px] font-bold text-white">{perdus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motifs de perte */}
      {sortedMotifs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Motifs de perte</h4>
          <div className="space-y-1.5">
            {sortedMotifs.map(([motif, count]) => (
              <div key={motif} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-28 truncate text-right">
                  {motifLabels[motif] || motif}
                </span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{ width: `${(count / maxMotifCount) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-600 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalProspects === 0 && perdus === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">Aucun prospect pour afficher le funnel</p>
        </div>
      )}
    </div>
  );
}
