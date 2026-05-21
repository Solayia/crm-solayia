// Mock data — simule le backend pour la demo GitHub Pages
// Ces donnees viennent du seed Apify reel (prospects Toulouse)

export const MOCK_USERS = {
  'dolie@solayia.fr': {
    id: 'usr-001',
    email: 'dolie@solayia.fr',
    fullName: 'Dolié',
    role: 'ADMIN',
    password: 'admin123',
  },
};

export const MOCK_PROSPECTS = [
  // === TIER A — Prioritaires (5-15 avis + mobile/email) ===
  {
    id: 'p-001', companyName: 'H2O Toulouse Plomberie', city: 'Toulouse', street: '97 Rue des Fontaines',
    mobilePhone: '+33 7 43 33 60 78', email: null, website: null,
    googleScore: 5.0, googleReviews: 15, tier: 'A', status: 'NEW',
    categories: ['Plombier'], categoryName: 'Plombier', source: 'apify_google_places',
  },
  {
    id: 'p-002', companyName: 'Artisan peintre l.Rubio', city: 'Toulouse', street: '82 Bd Jean Brunhes',
    mobilePhone: '+33 7 66 32 36 76', email: 'jeanmichelrubio9@gmail.com', website: null,
    googleScore: 4.7, googleReviews: 15, tier: 'A', status: 'NEW',
    categories: ['Peintre en bâtiment'], categoryName: 'Peintre en bâtiment', source: 'apify_google_places',
  },
  {
    id: 'p-003', companyName: 'Runs Elec', city: 'Toulouse', street: '31 Rue des Polinaires',
    mobilePhone: '+33 7 81 97 25 95', email: null, website: null,
    googleScore: 5.0, googleReviews: 14, tier: 'A', status: 'NEW',
    categories: ['Électricien'], categoryName: 'Électricien', source: 'apify_google_places',
  },
  {
    id: 'p-004', companyName: 'KABLI peinture : Kabli Nabil', city: 'Toulouse', street: '35 Chem. de Nicol',
    mobilePhone: '+33 6 23 79 72 44', email: null, website: null,
    googleScore: 4.9, googleReviews: 14, tier: 'A', status: 'NEW',
    categories: ['Peintre en bâtiment'], categoryName: 'Peintre en bâtiment', source: 'apify_google_places',
  },
  {
    id: 'p-005', companyName: 'HOVE Fanuel', city: 'Toulouse', street: '1 Rue Luchet',
    mobilePhone: '+33 6 33 32 03 59', email: null, website: null,
    googleScore: 5.0, googleReviews: 12, tier: 'A', status: 'CONTACTED',
    categories: ['Électricien'], categoryName: 'Électricien', source: 'apify_google_places',
  },
  {
    id: 'p-006', companyName: 'GD2R', city: 'Toulouse', street: '194 Chem. du Sang de Serp',
    mobilePhone: '+33 6 81 44 19 74', email: null, website: null,
    googleScore: 5.0, googleReviews: 11, tier: 'A', status: 'NEW',
    categories: ['Entreprise de construction'], categoryName: 'Entreprise de construction', source: 'apify_google_places',
  },
  {
    id: 'p-007', companyName: 'Maupelec', city: 'Toulouse', street: '27 Rue Peyrouset',
    mobilePhone: '+33 6 14 75 22 04', email: 'maupelec.toulouse@gmail.com', website: null,
    googleScore: 5.0, googleReviews: 11, tier: 'A', status: 'NEW',
    categories: ['Électricien'], categoryName: 'Électricien', source: 'apify_google_places',
  },
  {
    id: 'p-008', companyName: 'Mallet Alexandre Artisan Peintre', city: 'Toulouse', street: '35 Rue Pierre Bourthoumieux',
    mobilePhone: '+33 6 06 49 80 60', email: null, website: null,
    googleScore: 5.0, googleReviews: 10, tier: 'A', status: 'QUALIFIED',
    categories: ['Peintre en bâtiment'], categoryName: 'Peintre en bâtiment', source: 'apify_google_places',
  },
  {
    id: 'p-009', companyName: 'Entreprise SAOUDI', city: 'Toulouse', street: '94 Av. Albert Bedouce',
    mobilePhone: '+33 7 68 49 04 13', email: null, website: null,
    googleScore: 4.8, googleReviews: 11, tier: 'A', status: 'NEW',
    categories: ['Peintre en bâtiment', 'Plâtrier.ère'], categoryName: 'Peintre en bâtiment', source: 'apify_google_places',
  },
  {
    id: 'p-010', companyName: 'Budakh artisan carreleur', city: 'Toulouse', street: '17 Chem. de Canto-Laouzeto',
    mobilePhone: '+33 7 73 42 84 84', email: null, website: null,
    googleScore: 5.0, googleReviews: 11, tier: 'A', status: 'NEW',
    categories: ['Carreleur', 'Service de pose de parquet'], categoryName: 'Carreleur', source: 'apify_google_places',
  },

  // === TIER B — Standard (mobile/email, hors sweet spot avis) ===
  {
    id: 'p-011', companyName: 'ENTREPRISE couvreur rénovation', city: 'Toulouse', street: '6 Rue Maurice Hurel',
    mobilePhone: '+33 7 56 90 62 54', email: null, website: null,
    googleScore: 4.9, googleReviews: 524, tier: 'B', status: 'NEW',
    categories: ['Couvreur'], categoryName: 'Couvreur', source: 'apify_google_places',
  },
  {
    id: 'p-012', companyName: 'Cordonnerie des minimes', city: 'Toulouse', street: '131 Av. des Minimes',
    mobilePhone: null, email: 'cordonneriedesminimes@gmail.com', website: null,
    googleScore: 4.6, googleReviews: 137, tier: 'B', status: 'NEW',
    categories: ['Cordonnier'], categoryName: 'Cordonnier', source: 'apify_google_places',
  },
  {
    id: 'p-013', companyName: 'FRGaz', city: 'Toulouse', street: '11 Imp. Amadeo Modigliani',
    mobilePhone: '+33 6 33 78 21 60', email: null, website: null,
    googleScore: 4.9, googleReviews: 58, tier: 'B', status: 'CONTACTED',
    categories: ['Plombier', 'Chauffagiste'], categoryName: 'Plombier', source: 'apify_google_places',
  },
  {
    id: 'p-014', companyName: 'BONNET ÉLECTRICITÉ', city: 'Toulouse', street: '116 Chem. de Gaillardie',
    mobilePhone: '+33 6 50 60 68 63', email: null, website: null,
    googleScore: 5.0, googleReviews: 35, tier: 'B', status: 'NEW',
    categories: ['Électricien'], categoryName: 'Électricien', source: 'apify_google_places',
  },
  {
    id: 'p-015', companyName: 'RG Carrelage', city: 'Toulouse', street: '8 Rue François Villon',
    mobilePhone: '+33 7 68 06 78 40', email: 'rgcreation.occitanie@gmail.com', website: null,
    googleScore: 5.0, googleReviews: 46, tier: 'B', status: 'NEW',
    categories: ['Carreleur'], categoryName: 'Carreleur', source: 'apify_google_places',
  },

  // === TIER C — Fixe seul ===
  {
    id: 'p-016', companyName: 'AUVILLE Peinture', city: 'Toulouse', street: "23 Av. de l'U.R.S.S.",
    mobilePhone: null, fixedPhone: '+33 9 86 19 73 19', email: null, website: null,
    googleScore: 4.3, googleReviews: 260, tier: 'C', status: 'NEW',
    categories: ['Peintre en bâtiment'], categoryName: 'Peintre en bâtiment', source: 'apify_google_places',
  },
  {
    id: 'p-017', companyName: 'VIR Transport', city: 'Toulouse', street: '8 Chem. de Fondeyre',
    mobilePhone: null, fixedPhone: '+33 5 34 46 05 10', email: null, website: null,
    googleScore: 1.9, googleReviews: 369, tier: 'C', status: 'NEW',
    categories: ['Société de transport routier'], categoryName: 'Société de transport routier', source: 'apify_google_places',
  },
  {
    id: 'p-018', companyName: 'ASMO-SUD', city: 'Toulouse', street: '9 Imp. Pierre Camo',
    mobilePhone: null, fixedPhone: '+33 5 62 72 01 01', email: null, website: null,
    googleScore: 3.8, googleReviews: 34, tier: 'C', status: 'NEW',
    categories: ['Cuisiniste'], categoryName: 'Cuisiniste', source: 'apify_google_places',
  },

  // === TIER D — Reserve (aucun contact exploitable) ===
  {
    id: 'p-019', companyName: 'Pont de la Daurade', city: 'Toulouse', street: null,
    mobilePhone: null, email: null, website: null,
    googleScore: 4.6, googleReviews: 25, tier: 'D', status: 'NEW',
    categories: ['Site historique', 'Pont'], categoryName: 'Site historique', source: 'apify_google_places',
  },
  {
    id: 'p-020', companyName: 'Sarl Udct', city: 'Toulouse', street: '33 Rue Achille Viadieu',
    mobilePhone: null, email: null, website: null,
    googleScore: 1.0, googleReviews: 17, tier: 'D', status: 'NEW',
    categories: ['Entrepreneur'], categoryName: 'Entrepreneur', source: 'apify_google_places',
  },
];

export const MOCK_INTERACTIONS = [
  {
    id: 'int-001', prospectId: 'p-005', type: 'CALL', subject: 'Premier contact',
    notes: 'Intéressé par un site vitrine. Rappeler semaine prochaine.', occurredAt: '2026-05-19T14:30:00Z',
  },
  {
    id: 'int-002', prospectId: 'p-008', type: 'MEETING', subject: 'R1 — Mini brief',
    notes: 'Veut un site simple avec galerie de réalisations. Budget OK pour offre Light.', occurredAt: '2026-05-18T10:00:00Z',
  },
  {
    id: 'int-003', prospectId: 'p-013', type: 'EMAIL', subject: 'Envoi documentation',
    notes: 'Envoyé la plaquette Solayia par email. Relancer dans 3 jours.', occurredAt: '2026-05-20T09:15:00Z',
  },
];
