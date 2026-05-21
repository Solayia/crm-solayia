import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { prospectsApi } from '../api/prospects.api';

const TIER_COLORS = {
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-blue-100 text-blue-700 border-blue-300',
  C: 'bg-amber-100 text-amber-700 border-amber-300',
  D: 'bg-gray-100 text-gray-500 border-gray-300',
};

const STATUS_COLORS = {
  NEW: 'bg-gray-100 text-gray-600',
  CONTACTED: 'bg-blue-100 text-blue-700',
  QUALIFIED: 'bg-green-100 text-green-700',
  UNQUALIFIED: 'bg-red-100 text-red-600',
  CONVERTED: 'bg-purple-100 text-purple-700',
  LOST: 'bg-red-100 text-red-700',
};

export default function ProspectsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prospects, setProspects] = useState([]);
  const [tierCounts, setTierCounts] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeTier = searchParams.get('tier') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await prospectsApi.list({
          tier: activeTier || undefined,
          search: search || undefined,
        });
        setProspects(res.data);
        setTierCounts(res.tierCounts);
      } catch (e) { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [activeTier, search]);

  function setTierFilter(tier) {
    if (tier === activeTier) {
      searchParams.delete('tier');
    } else {
      searchParams.set('tier', tier);
    }
    setSearchParams(searchParams);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prospects</h2>
          <p className="text-gray-500 mt-1">
            {prospects.length} prospect{prospects.length > 1 ? 's' : ''} — Base Apify Toulouse
          </p>
        </div>
      </div>

      {/* Tier filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['A', 'B', 'C', 'D'].map((tier) => (
          <button
            key={tier}
            onClick={() => setTierFilter(tier)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeTier === tier
                ? TIER_COLORS[tier] + ' ring-2 ring-offset-1 ring-current'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            Tier {tier}
            <span className="ml-1.5 text-xs opacity-70">{tierCounts[tier]}</span>
          </button>
        ))}
        {activeTier && (
          <button
            onClick={() => { searchParams.delete('tier'); setSearchParams(searchParams); }}
            className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Effacer filtre
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom, secteur, ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement...</div>
        ) : prospects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucun prospect trouve</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Secteur</th>
                  <th className="px-4 py-3">Ville</th>
                  <th className="px-4 py-3 text-center">Tier</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Note</th>
                  <th className="px-4 py-3 text-center">Avis</th>
                  <th className="px-4 py-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prospects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/prospects/${p.id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{p.companyName}</p>
                      {p.street && <p className="text-xs text-gray-400 mt-0.5">{p.street}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.categoryName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.city || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-7 h-7 rounded-full text-xs font-bold leading-7 border ${TIER_COLORS[p.tier] || TIER_COLORS.D}`}>
                        {p.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[p.status] || STATUS_COLORS.NEW}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-yellow-600">{'★'} {p.googleScore || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {p.googleReviews || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.mobilePhone && (
                          <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded" title={p.mobilePhone}>
                            Mobile
                          </span>
                        )}
                        {p.email && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded" title={p.email}>
                            Email
                          </span>
                        )}
                        {p.fixedPhone && !p.mobilePhone && (
                          <span className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded" title={p.fixedPhone}>
                            Fixe
                          </span>
                        )}
                        {!p.mobilePhone && !p.email && !p.fixedPhone && (
                          <span className="text-xs text-gray-300">Aucun</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
