'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { MrrDataPoint } from '@/lib/types';

interface MrrChartProps {
  data: MrrDataPoint[];
}

export default function MrrChart({ data }: MrrChartProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">MRR - 12 derniers mois</h3>
          <p className="text-xs text-gray-500 mt-0.5">Revenu mensuel recurrent</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{data[data.length - 1]?.mrr?.toLocaleString('fr-FR')} EUR</p>
          <p className="text-xs text-green-600 font-medium">+8.8% vs mois dernier</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} EUR`} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value.toLocaleString('fr-FR')} EUR`, 'MRR']}
            />
            <Area type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={2.5} fill="url(#mrrGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
