'use client';

import { useState, useEffect, useCallback } from 'react';
import { Target, Users, TrendingUp, FileText, Trophy, BarChart3, Sparkles } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import MrrChart from '@/components/dashboard/MrrChart';
import PipelineOverview from '@/components/dashboard/PipelineOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import FunnelConversion from '@/components/dashboard/FunnelConversion';
import { formatCurrency } from '@/lib/utils';
import { getDashboardData } from './actions';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const result = await getDashboardData();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const { kpis, prospects, interactions } = data;

  const caGenere = kpis.caGenere2026 || 0;
  const caEstime = kpis.caEstime || 0;
  const objectif = kpis.objectif2026 || 100000;
  const potentielTotal = caGenere + caEstime;
  const pourcentage = Math.min(100, Math.round((caGenere / objectif) * 100));
  const pourcentagePotentiel = Math.min(100, Math.round((potentielTotal / objectif) * 100));

  return (
    <div className="space-y-6">
      {/* Hero CA 2026 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chiffre d&apos;affaires 2026</h2>
              <p className="text-sm text-gray-500">Objectif : {formatCurrency(objectif)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{pourcentage}%</div>
            <p className="text-xs text-gray-500">de l&apos;objectif</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            {/* Barre potentiel (estimé + généré) */}
            <div
              className="absolute inset-y-0 left-0 bg-brand-200 rounded-full transition-all duration-1000"
              style={{ width: `${pourcentagePotentiel}%` }}
            />
            {/* Barre CA généré (réel) */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-1000"
              style={{ width: `${pourcentage}%` }}
            />
            {/* Marker objectif */}
            <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-400" />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400">
            <span>0 €</span>
            <span>{formatCurrency(objectif)}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border-t border-gray-100">
          <div className="px-6 py-4 text-center border-r border-gray-100">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CA généré</span>
            </div>
            <div className="text-xl font-bold text-brand-700">{formatCurrency(caGenere)}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Réel encaissé</p>
          </div>
          <div className="px-6 py-4 text-center border-r border-gray-100">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CA estimé</span>
            </div>
            <div className="text-xl font-bold text-amber-600">{formatCurrency(caEstime)}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Prospects en cours</p>
          </div>
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Potentiel total</span>
            </div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(potentielTotal)}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">{pourcentagePotentiel}% de l&apos;objectif</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Prospects actifs"
          value={String(kpis.prospectsActifs)}
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />
        <KpiCard
          title="Clients"
          value={String(kpis.clients)}
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <KpiCard
          title="MRR"
          value={formatCurrency(kpis.mrrTotal)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <KpiCard
          title="Devis en cours"
          value={String(kpis.devisEnCours)}
          trend={{ value: `${formatCurrency(kpis.devisEnCoursMontant)} TTC`, direction: 'neutral' as const }}
          icon={<FileText className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MrrChart data={[]} />
        </div>
        <PipelineOverview prospects={prospects} />
      </div>

      {/* Funnel + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelConversion prospects={prospects} />
        <RecentActivity interactions={interactions} />
      </div>
    </div>
  );
}
