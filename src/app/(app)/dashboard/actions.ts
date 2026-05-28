'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();

  const [prospectsRes, clientsRes, devisRes, interactionsRes, settingsRes] = await Promise.all([
    supabase.from('prospects').select('id, statut, motif_perte, created_at'),
    supabase.from('clients').select('id, mrr, created_at'),
    supabase.from('devis').select('id, montant_ht, montant_ttc, statut, created_at'),
    supabase.from('interactions').select('id, prospect_id, type, contenu, date_interaction, created_by, prospects(entreprise), profiles:created_by(full_name)').order('date_interaction', { ascending: false }).limit(8),
    supabase.from('settings').select('key, value'),
  ]);

  const prospects = prospectsRes.data ?? [];
  const clients = clientsRes.data ?? [];
  const devis = devisRes.data ?? [];
  const interactions = interactionsRes.data ?? [];

  const mrrTotal = clients.reduce((sum: number, c: { mrr: number }) => sum + (c.mrr || 0), 0);
  const prospectsActifs = prospects.filter((p: { statut: string }) => !['suivi', 'termine', 'perdu'].includes(p.statut));
  const devisEnCours = devis.filter((d: { statut: string }) => ['brouillon', 'envoye'].includes(d.statut));

  return {
    kpis: {
      prospectsActifs: prospectsActifs.length,
      clients: clients.length,
      mrrTotal,
      devisEnCours: devisEnCours.length,
      devisEnCoursMontant: devisEnCours.reduce((s: number, d: { montant_ttc: number }) => s + (d.montant_ttc || 0), 0),
    },
    prospects,
    interactions,
  };
}
