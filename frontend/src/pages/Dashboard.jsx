import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { prospectsApi } from '../api/prospects.api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, A: 0, B: 0, C: 0, D: 0 });
  const [recentA, setRecentA] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await prospectsApi.list({});
        setStats({ total: res.total, ...res.tierCounts });
        const tierA = res.data.filter((p) => p.tier === 'A').slice(0, 5);
        setRecentA(tierA);
      } catch (e) { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.fullName}
        </h2>
        <p className="text-gray-500 mt-1">Tableau de bord CRM Solayia</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total prospects" value={loading ? '...' : stats.total}
          subtitle="Base Apify Toulouse" color="blue"
          onClick={() => navigate('/prospects')}
        />
        <StatCard
          title="Tier A" value={loading ? '...' : stats.A}
          subtitle="Prioritaires (5-15 avis)" color="green"
          onClick={() => navigate('/prospects?tier=A')}
        />
        <StatCard
          title="Tier B" value={loading ? '...' : stats.B}
          subtitle="Standard (mobile/email)" color="amber"
          onClick={() => navigate('/prospects?tier=B')}
        />
        <StatCard
          title="Tier C/D" value={loading ? '...' : stats.C + stats.D}
          subtitle="Cold / Reserve" color="gray"
          onClick={() => navigate('/prospects?tier=C')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prospects Tier A */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Prospects Tier A — Prioritaires</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {stats.A} prospects
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentA.map((p) => (
              <div
                key={p.id}
                className="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => navigate(`/prospects/${p.id}`)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.companyName}</p>
                  <p className="text-xs text-gray-500">{p.categoryName} — {p.city}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <span>{'★'}</span>
                    <span>{p.googleScore}</span>
                    <span className="text-gray-400">({p.googleReviews})</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infos projet */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Stratification des tiers</h3>
            <div className="space-y-3">
              <TierBar label="A — Priority" count={stats.A} total={stats.total} color="bg-green-500" />
              <TierBar label="B — Standard" count={stats.B} total={stats.total} color="bg-blue-500" />
              <TierBar label="C — Cold call" count={stats.C} total={stats.total} color="bg-amber-500" />
              <TierBar label="D — Reserve" count={stats.D} total={stats.total} color="bg-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Mode demo</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Ce CRM fonctionne en mode demonstration avec des donnees reelles extraites d'Apify Google Places (Toulouse).</p>
              <p className="text-xs text-gray-400 mt-3">
                Login : dolie@solayia.fr / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, onClick }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-5 cursor-pointer transition-colors ${colorMap[color] || colorMap.gray}`}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs mt-1 opacity-60">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    NEW: 'bg-gray-100 text-gray-600',
    CONTACTED: 'bg-blue-100 text-blue-700',
    QUALIFIED: 'bg-green-100 text-green-700',
    LOST: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${map[status] || map.NEW}`}>
      {status}
    </span>
  );
}

function TierBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-medium">{count} ({pct.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
