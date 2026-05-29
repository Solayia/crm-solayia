'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();

  const [prospectsRes, clientsRes, devisRes, interactionsRes, settingsRes] = await Promise.all([
    supabase.from('prospects').select('id, statut, motif_perte, created_at, tarif_propose, tarif_type, duree_mois, prestations'),
    supabase.from('clients').select('id, mrr, created_at, montant_one_shot, acompte_paye, solde_paye, mrr_date_debut, duree_mois, prestations'),
    supabase.from('devis').select('id, montant_ht, montant_ttc, statut, created_at'),
    supabase.from('interactions').select('id, prospect_id, type, contenu, date_interaction, created_by, prospects(entreprise), profiles:created_by(full_name)').order('date_interaction', { ascending: false }).limit(8),
    supabase.from('settings').select('key, value'),
  ]);

  const prospects = prospectsRes.data ?? [];
  const clients = clientsRes.data ?? [];
  const devis = devisRes.data ?? [];
  const interactions = interactionsRes.data ?? [];

  const mrrTotal = clients.reduce((sum: number, c: any) => {
    // Priorité aux multi-prestations JSON pour le MRR
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      return sum + c.prestations
        .filter((pr: any) => pr.mode === 'recurrent')
        .reduce((s: number, pr: any) => s + (pr.montant || 0), 0);
    }
    return sum + (c.mrr || 0);
  }, 0);
  const prospectsActifs = prospects.filter((p: any) => !['suivi', 'termine', 'perdu'].includes(p.statut));
  const devisEnCours = devis.filter((d: any) => ['brouillon', 'envoye'].includes(d.statut));

  // --- CA 2026 calculations ---
  const now = new Date();
  const annee = now.getFullYear();
  const debutAnnee = new Date(annee, 0, 1);    // 1er janvier
  const finAnnee = new Date(annee, 11, 31);     // 31 décembre

  // === CA Réalisé (payé) depuis les clients — borné à l'année en cours ===
  let caGenere2026 = 0;

  for (const c of clients as any[]) {
    // Priorité aux multi-prestations JSON
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      for (const pr of c.prestations) {
        if (pr.mode === 'one_shot') {
          // One-shot : on ne compte que si le client a été créé cette année
          const clientYear = new Date(c.created_at).getFullYear();
          if (clientYear !== annee) continue;
          const acompteMt = pr.acompte_montant || 0;
          const soldeMt = (pr.montant || 0) - acompteMt;
          if (pr.acompte_paye) caGenere2026 += acompteMt;
          if (pr.solde_paye) caGenere2026 += soldeMt;
        } else if (pr.mode === 'recurrent' && pr.date_debut) {
          // Récurrent : compter seulement les mois de l'année en cours
          const start = new Date(pr.date_debut);
          const end = pr.date_fin ? new Date(pr.date_fin) : null;
          const effectiveStart = start < debutAnnee ? debutAnnee : start;
          const effectiveEnd = end && end < now ? end : now;
          if (effectiveEnd > effectiveStart) {
            const months = (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12
              + (effectiveEnd.getMonth() - effectiveStart.getMonth())
              + (effectiveEnd.getDate() >= effectiveStart.getDate() ? 1 : 0);
            caGenere2026 += (pr.montant || 0) * Math.max(0, months);
          }
        }
      }
    } else {
      // Fallback legacy
      const clientCreated = new Date(c.created_at);
      if (clientCreated.getFullYear() === annee && (c.acompte_paye || c.solde_paye)) {
        caGenere2026 += c.montant_one_shot || 0;
      }
      if (c.mrr && c.mrr > 0 && c.mrr_date_debut) {
        const mrrStart = new Date(c.mrr_date_debut);
        const effectiveStart = mrrStart < debutAnnee ? debutAnnee : mrrStart;
        let effectiveEnd = now < finAnnee ? now : finAnnee;
        if (c.duree_mois) {
          const mrrEndDate = new Date(mrrStart);
          mrrEndDate.setMonth(mrrEndDate.getMonth() + c.duree_mois);
          if (mrrEndDate < effectiveEnd) effectiveEnd = mrrEndDate;
        }
        if (effectiveEnd > effectiveStart) {
          const months = (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12
            + (effectiveEnd.getMonth() - effectiveStart.getMonth())
            + (effectiveEnd.getDate() >= effectiveStart.getDate() ? 1 : 0);
          caGenere2026 += c.mrr * Math.max(0, months);
        }
      }
    }
  }

  // === CA Estimé = prospects actifs + impayés clients ===
  let caEstime = 0;

  // 1) Depuis les prospects actifs
  for (const p of prospectsActifs as any[]) {
    if (p.prestations && Array.isArray(p.prestations) && p.prestations.length > 0) {
      for (const pr of p.prestations) {
        if (pr.mode === 'recurrent') {
          caEstime += (pr.montant || 0) * (pr.duree_mois || 12);
        } else {
          caEstime += pr.montant || 0;
        }
      }
    } else {
      // Fallback legacy
      const tarif = p.tarif_propose || 0;
      if (tarif <= 0) continue;
      if (p.tarif_type === 'mensuel') {
        caEstime += tarif * (p.duree_mois || 12);
      } else {
        caEstime += tarif;
      }
    }
  }

  // 2) Depuis les clients : ce qui n'est pas encore payé (borné à l'année en cours)
  for (const c of clients as any[]) {
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      for (const pr of c.prestations) {
        if (pr.mode === 'one_shot') {
          // One-shot impayé : seulement si client créé cette année
          const clientYear = new Date(c.created_at).getFullYear();
          if (clientYear !== annee) continue;
          const acompteMt = pr.acompte_montant || 0;
          const soldeMt = (pr.montant || 0) - acompteMt;
          if (!pr.acompte_paye) caEstime += acompteMt;
          if (!pr.solde_paye) caEstime += soldeMt;
        } else if (pr.mode === 'recurrent' && pr.date_debut) {
          const end = pr.date_fin ? new Date(pr.date_fin) : null;
          if (!end || end > now) {
            // Borner la fin à décembre de l'année en cours maximum
            let futureEnd = end || finAnnee;
            if (futureEnd > finAnnee) futureEnd = finAnnee;
            const futureMonths = (futureEnd.getFullYear() - now.getFullYear()) * 12
              + (futureEnd.getMonth() - now.getMonth());
            caEstime += (pr.montant || 0) * Math.max(0, futureMonths);
          }
        }
      }
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
