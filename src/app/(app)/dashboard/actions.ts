'use server';

import { createClient } from '@/lib/supabase/server';

// Étapes du pipeline "projet" (post-conversion) — à exclure du CA estimé prospect
const PIPELINE_PROJET_STATUTS = ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'];

export async function getDashboardData() {
  const supabase = await createClient();

  // --- Fetch data avec fallback si colonne prestations absente ---
  let prospects: any[] = [];
  let clients: any[] = [];

  // Prospects : essayer avec prestations, fallback sans
  const prospectsRes = await supabase
    .from('prospects')
    .select('id, statut, motif_perte, created_at, tarif_propose, tarif_type, duree_mois, prestations');
  if (prospectsRes.error) {
    // Colonne prestations n'existe probablement pas, retry sans
    const fallbackRes = await supabase
      .from('prospects')
      .select('id, statut, motif_perte, created_at, tarif_propose, tarif_type, duree_mois');
    prospects = fallbackRes.data ?? [];
  } else {
    prospects = prospectsRes.data ?? [];
  }

  // Clients : essayer avec prestations, fallback sans
  const clientsRes = await supabase
    .from('clients')
    .select('id, mrr, created_at, montant_one_shot, acompte_paye, solde_paye, mrr_date_debut, duree_mois, prestations');
  if (clientsRes.error) {
    // Fallback sans prestations ni champs financiers enrichis
    const fallbackRes = await supabase
      .from('clients')
      .select('id, mrr, created_at');
    clients = fallbackRes.data ?? [];
  } else {
    clients = clientsRes.data ?? [];
  }

  const [devisRes, interactionsRes, settingsRes] = await Promise.all([
    supabase.from('devis').select('id, montant_ht, montant_ttc, statut, created_at'),
    supabase.from('interactions').select('id, prospect_id, type, contenu, date_interaction, created_by, prospects(entreprise), profiles:created_by(full_name)').order('date_interaction', { ascending: false }).limit(8),
    supabase.from('settings').select('key, value'),
  ]);

  const devis = devisRes.data ?? [];
  const interactions = interactionsRes.data ?? [];

  // --- KPIs de base ---

  // MRR : filtrer par récurrents actifs (avec date_debut passée et pas encore terminés)
  const mrrTotal = clients.reduce((sum: number, c: any) => {
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      const now = new Date();
      return sum + c.prestations
        .filter((pr: any) => {
          if (pr.mode !== 'recurrent') return false;
          // Exclure si pas encore démarré
          if (pr.date_debut && new Date(pr.date_debut) > now) return false;
          // Exclure si terminé
          if (pr.date_fin && new Date(pr.date_fin) < now) return false;
          return true;
        })
        .reduce((s: number, pr: any) => s + (pr.montant || 0), 0);
    }
    return sum + (c.mrr || 0);
  }, 0);

  // Prospects actifs = pipeline commercial uniquement (pas les étapes projet post-conversion)
  const prospectsActifs = prospects.filter((p: any) =>
    !['perdu', ...PIPELINE_PROJET_STATUTS].includes(p.statut)
  );
  const devisEnCours = devis.filter((d: any) => ['brouillon', 'envoye'].includes(d.statut));

  // --- CA année en cours ---
  const now = new Date();
  const annee = now.getFullYear();
  const debutAnnee = new Date(annee, 0, 1);
  const finAnnee = new Date(annee, 11, 31);

  // === CA Réalisé (payé) depuis les clients — borné à l'année en cours ===
  let caGenere2026 = 0;

  for (const c of clients as any[]) {
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      for (const pr of c.prestations) {
        if (pr.mode === 'one_shot') {
          const clientYear = new Date(c.created_at).getFullYear();
          if (clientYear !== annee) continue;
          const acompteMt = pr.acompte_montant || 0;
          const soldeMt = (pr.montant || 0) - acompteMt;
          if (pr.acompte_paye) caGenere2026 += acompteMt;
          if (pr.solde_paye) caGenere2026 += soldeMt;
        } else if (pr.mode === 'recurrent' && pr.date_debut) {
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
      // Fallback legacy — split acompte/solde correctement
      const clientCreated = new Date(c.created_at);
      if (clientCreated.getFullYear() === annee) {
        const montant = c.montant_one_shot || 0;
        if (montant > 0) {
          // Legacy n'a pas de montant acompte séparé : si acompte payé, on compte tout ;
          // sinon si solde payé seulement (cas rare), on compte tout aussi
          if (c.acompte_paye) caGenere2026 += montant;
          else if (c.solde_paye) caGenere2026 += montant;
        }
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

  // === CA Estimé = prospects commerciaux + impayés clients ===
  let caEstime = 0;

  // 1) Prospects actifs (pipeline commercial uniquement, pas les étapes projet)
  for (const p of prospectsActifs as any[]) {
    if (p.prestations && Array.isArray(p.prestations) && p.prestations.length > 0) {
      for (const pr of p.prestations) {
        if (pr.mode === 'recurrent') {
          // Borner l'estimation à 12 mois max ou fin d'année
          const moisRestantsAnnee = 12 - now.getMonth();
          const dureeMois = pr.duree_mois || 12;
          caEstime += (pr.montant || 0) * Math.min(dureeMois, moisRestantsAnnee);
        } else {
          caEstime += pr.montant || 0;
        }
      }
    } else {
      // Fallback legacy
      const tarif = p.tarif_propose || 0;
      if (tarif <= 0) continue;
      if (p.tarif_type === 'mensuel') {
        const moisRestantsAnnee = 12 - now.getMonth();
        caEstime += tarif * Math.min(p.duree_mois || 12, moisRestantsAnnee);
      } else {
        caEstime += tarif;
      }
    }
  }

  // 2) Clients : ce qui n'est pas encore payé (borné à l'année en cours)
  for (const c of clients as any[]) {
    if (c.prestations && Array.isArray(c.prestations) && c.prestations.length > 0) {
      for (const pr of c.prestations) {
        if (pr.mode === 'one_shot') {
          const clientYear = new Date(c.created_at).getFullYear();
          if (clientYear !== annee) continue;
          const acompteMt = pr.acompte_montant || 0;
          const soldeMt = (pr.montant || 0) - acompteMt;
          if (!pr.acompte_paye) caEstime += acompteMt;
          if (!pr.solde_paye) caEstime += soldeMt;
        } else if (pr.mode === 'recurrent' && pr.date_debut) {
          const end = pr.date_fin ? new Date(pr.date_fin) : null;
          if (!end || end > now) {
            let futureEnd = end || finAnnee;
            if (futureEnd > finAnnee) futureEnd = finAnnee;
            const futureMonths = (futureEnd.getFullYear() - now.getFullYear()) * 12
              + (futureEnd.getMonth() - now.getMonth());
            caEstime += (pr.montant || 0) * Math.max(0, futureMonths);
          }
        }
      }
    } else {
      // Fallback legacy : impayés clients sans prestations JSON
      const clientCreated = new Date(c.created_at);
      if (clientCreated.getFullYear() === annee) {
        const montant = c.montant_one_shot || 0;
        if (montant > 0 && !c.acompte_paye && !c.solde_paye) {
          caEstime += montant;
        }
      }
      // Récurrent legacy : mois futurs jusqu'à fin d'année
      if (c.mrr && c.mrr > 0 && c.mrr_date_debut) {
        const mrrStart = new Date(c.mrr_date_debut);
        let mrrEnd = finAnnee;
        if (c.duree_mois) {
          const mrrEndDate = new Date(mrrStart);
          mrrEndDate.setMonth(mrrEndDate.getMonth() + c.duree_mois);
          if (mrrEndDate < mrrEnd) mrrEnd = mrrEndDate;
        }
        if (mrrEnd > now) {
          const futureMonths = (mrrEnd.getFullYear() - now.getFullYear()) * 12
            + (mrrEnd.getMonth() - now.getMonth());
          caEstime += c.mrr * Math.max(0, futureMonths);
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
