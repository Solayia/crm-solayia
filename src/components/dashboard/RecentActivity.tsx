import { formatDateShort } from '@/lib/utils';
import { Phone, Mail, Calendar, StickyNote } from 'lucide-react';
import type { Interaction } from '@/lib/types';
import { mockProspects, mockProfiles } from '@/lib/mock-data';

const typeConfig = {
  appel: { icon: Phone, color: 'bg-green-100 text-green-600', label: 'Appel' },
  email: { icon: Mail, color: 'bg-blue-100 text-blue-600', label: 'Email' },
  rdv: { icon: Calendar, color: 'bg-purple-100 text-purple-600', label: 'RDV' },
  note: { icon: StickyNote, color: 'bg-amber-100 text-amber-600', label: 'Note' },
};

interface RecentActivityProps {
  interactions: Interaction[];
  limit?: number;
}

export default function RecentActivity({ interactions, limit = 6 }: RecentActivityProps) {
  const sorted = [...interactions]
    .sort((a, b) => new Date(b.date_interaction).getTime() - new Date(a.date_interaction).getTime())
    .slice(0, limit);

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Activite recente</h3>
        <p className="text-xs text-gray-500 mt-0.5">Dernieres interactions</p>
      </div>
      <div className="divide-y divide-gray-50">
        {sorted.map((interaction) => {
          const config = typeConfig[interaction.type];
          const Icon = config.icon;
          const prospect = mockProspects.find((p) => p.id === interaction.prospect_id);
          const profile = mockProfiles.find((p) => p.id === interaction.created_by);

          return (
            <div key={interaction.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-1">
                    <span className="font-medium">{config.label}</span>
                    {prospect && <span className="text-gray-500"> — {prospect.entreprise}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{interaction.contenu}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{formatDateShort(interaction.date_interaction)}</span>
                    {profile && <span className="text-[11px] text-gray-400">par {profile.full_name}</span>}
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
