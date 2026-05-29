'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();

  const [prospectsRes, clientsRes, devisRes, interactionsRes, settingsRes] = await Promise.all([
    supabase.from('prospects').select('id, statut, motif_perte, created_at, tarif_propose, tarif_type, duree_mois'),
    supabase.from('clients').select('id, mrr, created_at, montant_one_shot, acompte_paye, solde_paye, mrr_date_debut, duree_mois'),
    supabase.from('devis').select('id, montant_ht, montant_ttc, statut, created_at'),
    supabase.from('interactions').select('id, prospect_id, type, contenu, date_interaction, created_by, prospects(entreprise), profiles:created_by(full_name)').order('date_interaction', { ascending: false }).limit(8),
    supabase.from('settings').select('key, value'),
  ]);

  const prospects = prospectsRes.data ?? [];
  const clients = clientsRes.data ?? [];
  const devis = devisRes.data ?? [];
  const interactions = interactionsRes.data ?? [];

  const mrrTotal = clients.reduce((sum: number, c: any) => sum + (c.mrr || 0), 0);
  const prospectsActifs = prospects.filter((p: any) => !['suivi', 'termine', 'perdu'].includes(p.statut));
  const devisEnCours = devis.filter((d: any) => ['brouillon', 'envoye'].includes(d.statut));

  // --- CA 2026 calculations ---
  const now = new Date();
  const year2026Start = new Date('2026-01-01');
  const year2026End = new Date('2026-12-31');

  // CA Généré 2026 (réel, depuis les clients)
  let caGenere2026 = 0;

  for (const c of clients as any[]) {
    const clientCreated = new Date(c.created_at);

    // One-shot : compter si le client a été créé en 2026 ET que acompte ou solde payé
    if (clientCreated.getFullYear() === 2026 && (c.acompte_paye || c.solde_paye)) {
      caGenere2026 += c.montant_one_shot || 0;
    }

    // MRR : calculer le nombre de mois écoulés en 2026 depuis mrr_date_debut
    if (c.mrr && c.mrr > 0 && c.mrr_date_debut) {
      const mrrStart = new Date(c.mrr_date_debut);
      // Le MRR commence au plus tôt le 1er janvier 2026
      const effectiveStart = mrrStart < year2026Start ? year2026Start : mrrStart;

      // Le MRR finit : soit aujourd'hui, soit à la fin de la durée, soit fin 2026
      let effectiveEnd = now < year2026End ? now : year2026End;
      if (c.duree_mois) {
        const mrrEndDate = new Date(mrrStart);
        mrrEndDate.setMonth(mrrEndDate.getMonth() + c.duree_mois);
        if (mrrEndDate < effectiveEnd) {
          effectiveEnd = mrrEndDate;
        }
      }

      if (effectiveEnd > effectiveStart) {
        // Nombre de mois entre effectiveStart et effectiveEnd
        const months = (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12
          + (effectiveEnd.getMonth() - effectiveStart.getMonth())
          + (effectiveEnd.getDate() >= effectiveStart.getDate() ? 1 : 0);
        caGenere2026 += c.mrr * Math.max(0, months);
      }
    }
  }

  // CA Estimé (depuis les prospects actifs non-perdus non-terminés)
  let caEstime = 0;

  for (const p of prospectsActifs as any[]) {
    const tarif = p.tarif_propose || 0;
    if (tarif <= 0) continue;

    if (p.tarif_type === 'mensuel') {
      // Mensuel : tarif × durée (ou 12 mois si indéfinie)
      const duree = p.duree_mois || 12;
      caEstime += tarif * duree;
    } else {
      // One-shot ou non défini : montant brut
      caEstime += tarif;
    }
  }

  const objectif2026 = 100000;

  return {
    kpis: {
      prospectsActifs: prospectsActifs.length,
      clients: clients.length,
      mrrTotal,
      devisEnCours: devisEnCours.length,
      devisEnCoursMontant: devisEnCours.reduce((s: number, d: any) => s + (d.montant_ttc || 0), 0),
      caGenere2026,
      caEstime,
      objectif2026,
    },
    prospects,
    interactions,
  };
}
