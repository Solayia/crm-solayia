'use client';

import { useState, useEffect, useCallback } from 'react';
import { Target, Users, TrendingUp, FileText } from 'lucide-react';
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

  return (
    <div className="space-y-6">
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
