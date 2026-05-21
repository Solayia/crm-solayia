import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.fullName}
        </h2>
        <p className="text-gray-500 mt-1">Tableau de bord CRM Solayia</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Prospects" value="-" subtitle="Total" color="blue" />
        <StatCard title="Tier A" value="-" subtitle="Prioritaires" color="green" />
        <StatCard title="Tier B" value="-" subtitle="Standard" color="yellow" />
        <StatCard title="Tier C/D" value="-" subtitle="Cold / Reserve" color="gray" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 0 - Fondations</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>&#x2705; Authentification JWT fonctionnelle</p>
          <p>&#x2705; Base de donnees PostgreSQL + Prisma</p>
          <p>&#x2705; Interface React + Tailwind</p>
          <p>&#x23F3; Phase 1 : CRM core (prospects, clients, interactions)</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className={`rounded-lg border p-5 ${colorMap[color] || colorMap.gray}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs mt-1 opacity-60">{subtitle}</p>
    </div>
  );
}
