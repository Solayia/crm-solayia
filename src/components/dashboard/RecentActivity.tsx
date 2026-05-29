import { formatDateShort } from '@/lib/utils';
import { Phone, Mail, Calendar, StickyNote } from 'lucide-react';

const typeConfig = {
  appel: { icon: Phone, color: 'bg-green-100 text-green-600', label: 'Appel' },
  email: { icon: Mail, color: 'bg-blue-100 text-blue-600', label: 'Email' },
  rdv: { icon: Calendar, color: 'bg-purple-100 text-purple-600', label: 'RDV' },
  note: { icon: StickyNote, color: 'bg-amber-100 text-amber-600', label: 'Note' },
};

interface RecentActivityProps {
  interactions: any[];
  limit?: number;
}

export default function RecentActivity({ interactions, limit = 6 }: RecentActivityProps) {
  const sorted = [...interactions]
    .sort((a, b) => new Date(b.date_interaction).getTime() - new Date(a.date_interaction).getTime())
    .slice(0, limit);

  if (sorted.length === 0) {
    return (
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Activité récente</h3>
          <p className="text-xs text-gray-500 mt-0.5">Dernières interactions</p>
        </div>
        <div className="px-5 py-8 text-center text-sm text-gray-400">
          Aucune interaction pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Activité récente</h3>
        <p className="text-xs text-gray-500 mt-0.5">Dernières interactions</p>
      </div>
      <div className="divide-y divide-gray-50">
        {sorted.map((interaction) => {
          const config = typeConfig[interaction.type as keyof typeof typeConfig] || typeConfig.note;
          const Icon = config.icon;
          // Supabase join: prospects(entreprise) -> interaction.prospects?.entreprise
          const entreprise = interaction.prospects?.entreprise || interaction.prospect?.entreprise;
          // Supabase join: profiles:created_by(full_name) -> interaction.profiles?.full_name
          const profileName = interaction.profiles?.full_name || interaction.created_by_profile?.full_name;

          return (
            <div key={interaction.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-1">
                    <span className="font-medium">{config.label}</span>
                    {entreprise && <span className="text-gray-500"> — {entreprise}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{interaction.contenu}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{formatDateShort(interaction.date_interaction)}</span>
                    {profileName && <span className="text-[11px] text-gray-400">par {profileName}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
