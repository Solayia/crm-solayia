import type { PrestationLigneClient } from './types';

export interface ResumeFinancier {
  realise: number;
  estime: number;
}

/**
 * Calcule le résumé financier (réalisé vs estimé) pour un ensemble de prestations client.
 * Utilisé à la fois sur la fiche client et dans le dashboard.
 */
export function calculerResumeFinancier(prestations: PrestationLigneClient[]): ResumeFinancier {
  let realise = 0;
  let estime = 0;
  const now = new Date();

  for (const pr of prestations) {
    if (pr.mode === 'one_shot') {
      const acompteMt = pr.acompte_montant || 0;
      const soldeMt = (pr.montant || 0) - acompteMt;
      if (pr.acompte_paye) realise += acompteMt;
      else estime += acompteMt;
      if (pr.solde_paye) realise += soldeMt;
      else estime += soldeMt;
    } else if (pr.mode === 'recurrent' && pr.date_debut) {
      const start = new Date(pr.date_debut);
      const end = pr.date_fin ? new Date(pr.date_fin) : null;
      const effectiveEnd = end && end < now ? end : now;
      // Mois écoulés = réalisé
      if (effectiveEnd > start) {
        const moisEcoules = (effectiveEnd.getFullYear() - start.getFullYear()) * 12
          + (effectiveEnd.getMonth() - start.getMonth())
          + (effectiveEnd.getDate() >= start.getDate() ? 1 : 0);
        realise += pr.montant * Math.max(0, moisEcoules);
      }
      // Mois futurs = estimé (bornés à fin d'année)
      if (!end || end > now) {
        const finAnnee = new Date(now.getFullYear(), 11, 31);
        let futureEnd = end || finAnnee;
        if (futureEnd > finAnnee) futureEnd = finAnnee;
        const futureMonths = (futureEnd.getFullYear() - now.getFullYear()) * 12
          + (futureEnd.getMonth() - now.getMonth());
        estime += pr.montant * Math.max(0, futureMonths);
      }
    } else {
      // Récurrent sans date_debut : tout en estimé
      estime += pr.montant || 0;
    }
  }

  return { realise, estime };
}
