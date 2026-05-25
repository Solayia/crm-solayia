import { cn } from '@/lib/utils';
import { PROSPECT_STATUTS, DEVIS_STATUTS, PROJET_STATUTS } from '@/lib/types';
import type { ProspectStatut, DevisStatut, ProjetStatut } from '@/lib/types';

type StatutType = ProspectStatut | DevisStatut | ProjetStatut;

const allStatuts = [...PROSPECT_STATUTS, ...DEVIS_STATUTS, ...PROJET_STATUTS];

interface StatutBadgeProps {
  statut: StatutType;
  className?: string;
}

export default function StatutBadge({ statut, className }: StatutBadgeProps) {
  const config = allStatuts.find((s) => s.value === statut);

  if (!config) {
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600', className)}>
        {statut}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.color, className)}>
      {config.label}
    </span>
  );
}
