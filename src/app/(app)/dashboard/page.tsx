'use client';

import { Target, Users, TrendingUp, FileText } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import MrrChart from '@/components/dashboard/MrrChart';
import PipelineOverview from '@/components/dashboard/PipelineOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { mockProspects, mockClients, mockDevis, mockMrrHistory, mockInteractions } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const prospectsActifs = mockProspects.filter((p) => !['gagne', 'perdu'].includes(p.statut));
  const devisEnCours = mockDevis.filter((d) => ['brouillon', 'envoye'].includes(d.statut));
  const mrrTotal = mockClients.reduce((sum, c) => sum + c.mrr, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Prospects actifs"
          value={String(prospectsActifs.length)}
          trend={{ value: '+3 ce mois', direction: 'up' }}
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />
        <KpiCard
          title="Clients"
          value={String(mockClients.length)}
          trend={{ value: '+1 ce mois', direction: 'up' }}
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <KpiCard
          title="MRR"
          value={formatCurrency(mrrTotal)}
          trend={{ value: '+8.8%', direction: 'up' }}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <KpiCard
          title="Devis en cours"
          value={String(devisEnCours.length)}
          trend={{ value: `${formatCurrency(devisEnCours.reduce((s, d) => s + d.montant_ttc, 0))} TTC`, direction: 'neutral' }}
          icon={<FileText className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MrrChart data={mockMrrHistory} />
        </div>
        <PipelineOverview prospects={mockProspects} />
      </div>

      {/* Activity */}
      <RecentActivity interactions={mockInteractions} />
    </div>
  );
}
