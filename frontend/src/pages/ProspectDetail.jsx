import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { prospectsApi } from '../api/prospects.api';

const TIER_INFO = {
  A: { label: 'Priority', color: 'bg-green-100 text-green-700', desc: 'Mobile/email + 5-15 avis Google' },
  B: { label: 'Standard', color: 'bg-blue-100 text-blue-700', desc: 'Mobile/email, hors sweet spot avis' },
  C: { label: 'Cold call', color: 'bg-amber-100 text-amber-700', desc: 'Telephone fixe seul' },
  D: { label: 'Reserve', color: 'bg-gray-100 text-gray-500', desc: 'Aucun contact exploitable' },
};

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'LOST'];

export default function ProspectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await prospectsApi.getById(id);
        setProspect(data);
      } catch (e) {
        navigate('/prospects');
      }
      setLoading(false);
    }
    load();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-gray-400">Chargement...</div>;
  if (!prospect) return null;

  const tier = TIER_INFO[prospect.tier] || TIER_INFO.D;

  async function handleStatusChange(newStatus) {
    try {
      await prospectsApi.updateStatus(prospect.id, newStatus);
      setProspect({ ...prospect, status: newStatus });
    } catch (e) { /* ignore */ }
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/prospects')}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1 transition-colors"
      >
        {'<'} Retour aux prospects
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{prospect.companyName}</h2>
            <p className="text-gray-500 mt-1">
              {prospect.categoryName || 'Non categorise'} — {prospect.city || 'Ville inconnue'}
            </p>
            {prospect.street && <p className="text-sm text-gray-400 mt-0.5">{prospect.street}</p>}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${tier.color}`}>
              Tier {prospect.tier}
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="text-lg">{'★'}</span>
              <span className="font-bold text-gray-900">{prospect.googleScore}</span>
              <span className="text-sm text-gray-400">({prospect.googleReviews} avis)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Infos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Coordonnees</h3>
            </div>
            <div className="p-5 space-y-3">
              <InfoRow label="Mobile" value={prospect.mobilePhone} type="phone" />
              <InfoRow label="Fixe" value={prospect.fixedPhone} type="phone" />
              <InfoRow label="Email" value={prospect.email} type="email" />
              <InfoRow label="Site web" value={prospect.website} type="link" />
              <InfoRow label="Google Maps" value={prospect.googleMapsUrl || 'Non disponible'} type="link" />
            </div>
          </div>

          {/* Categories */}
          {prospect.categories && prospect.categories.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Categories Google</h3>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {prospect.categories.map((cat, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactions */}
          {prospect.interactions && prospect.interactions.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Interactions</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {prospect.interactions.map((int) => (
                  <div key={int.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        {int.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(int.occurredAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {int.subject && <p className="text-sm font-medium text-gray-800">{int.subject}</p>}
                    <p className="text-sm text-gray-600 mt-0.5">{int.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Actions & Tier */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Statut</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    prospect.status === s
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tier info */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Classification</h3>
            <div className={`rounded-lg p-4 ${tier.color}`}>
              <p className="font-bold text-lg">Tier {prospect.tier} — {tier.label}</p>
              <p className="text-sm opacity-80 mt-1">{tier.desc}</p>
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>Source : {prospect.source || 'Manuel'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, type }) {
  if (!value) return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300">—</span>
    </div>
  );

  let display = value;
  if (type === 'phone') {
    display = <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
  } else if (type === 'email') {
    display = <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
  } else if (type === 'link' && value.startsWith('http')) {
    display = <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] inline-block">{value}</a>;
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{display}</span>
    </div>
  );
}
