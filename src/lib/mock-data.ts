import type {
  Profile, Prospect, Client, Devis, DevisLigne,
  Projet, Interaction, MrrDataPoint, Setting,
} from './types';

// --- Profiles ---
export const mockProfiles: Profile[] = [
  {
    id: 'u1', email: 'dolie@solayia.fr', full_name: 'David Olie',
    role: 'admin', avatar_url: null, created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 'u2', email: 'marie@solayia.fr', full_name: 'Marie Dupont',
    role: 'membre', avatar_url: null, created_at: '2024-03-01T09:00:00Z',
  },
];

// --- Prospects ---
export const mockProspects: Prospect[] = [
  {
    id: 'p1', nom: 'Bernard', prenom: 'Philippe', entreprise: 'Climatech Solutions',
    email: 'p.bernard@climatech.fr', telephone: '05 61 23 45 67',
    statut: 'nouveau', source: 'Site web', notes: 'A decouvert via Google',
    assigned_to: 'u1', created_at: '2026-05-20T10:00:00Z',
  },
  {
    id: 'p2', nom: 'Moreau', prenom: 'Sophie', entreprise: 'BTP Occitanie',
    email: 's.moreau@btp-occitanie.fr', telephone: '05 62 11 22 33',
    statut: 'qualifie', source: 'Salon professionnel', notes: 'Rencontree au salon BatiSud',
    assigned_to: 'u2', created_at: '2026-05-18T14:00:00Z',
  },
  {
    id: 'p3', nom: 'Lefebvre', prenom: 'Jean', entreprise: 'Restaurant Le Capitole',
    email: 'j.lefebvre@lecapitole.fr', telephone: '05 61 44 55 66',
    statut: 'premier_contact', source: 'Bouche a oreille', notes: 'Recommande par client existant',
    assigned_to: 'u1', created_at: '2026-05-15T09:30:00Z',
  },
  {
    id: 'p4', nom: 'Garcia', prenom: 'Maria', entreprise: 'Pharmacie du Pont Neuf',
    email: 'm.garcia@pharma-pontneuf.fr', telephone: '05 61 77 88 99',
    statut: 'rdv', source: 'Google Ads', notes: 'RDV prevu le 28/05',
    assigned_to: 'u2', created_at: '2026-05-10T11:00:00Z',
  },
  {
    id: 'p5', nom: 'Petit', prenom: 'Alain', entreprise: 'Garage Auto Blagnac',
    email: 'a.petit@garagealain.fr', telephone: '05 61 00 11 22',
    statut: 'devis', source: 'Recommandation', notes: 'Devis envoye pour clim atelier',
    assigned_to: 'u1', created_at: '2026-05-05T16:00:00Z',
  },
  {
    id: 'p6', nom: 'Roux', prenom: 'Catherine', entreprise: 'Cabinet Comptable Toulouse',
    email: 'c.roux@cabinet-roux.fr', telephone: '05 61 33 44 55',
    statut: 'nego', source: 'Reseaux sociaux', notes: 'Negocie les conditions de paiement',
    assigned_to: 'u1', created_at: '2026-04-28T10:00:00Z',
  },
  {
    id: 'p7', nom: 'Martin', prenom: 'Pierre', entreprise: 'Dr. Martin Dentiste',
    email: 'p.martin@dr-martin.fr', telephone: '05 61 55 66 77',
    statut: 'gagne', source: 'Site web', notes: 'Converti en client - installation clim cabinet',
    assigned_to: 'u2', created_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'p8', nom: 'Dubois', prenom: 'Laurent', entreprise: 'SCI Immo Garonne',
    email: 'l.dubois@immo-garonne.fr', telephone: '05 62 99 88 77',
    statut: 'perdu', source: 'Salon professionnel', notes: 'Budget insuffisant pour 2026',
    assigned_to: 'u1', created_at: '2026-04-10T14:00:00Z',
  },
  {
    id: 'p9', nom: 'Fournier', prenom: 'Isabelle', entreprise: 'Hotel Mercure Toulouse',
    email: 'i.fournier@mercure-tlse.fr', telephone: '05 61 22 33 44',
    statut: 'nouveau', source: 'Google Ads', notes: null,
    assigned_to: null, created_at: '2026-05-22T08:00:00Z',
  },
  {
    id: 'p10', nom: 'Bonnet', prenom: 'Francois', entreprise: 'Boulangerie Bonnet',
    email: 'f.bonnet@boulangerie-bonnet.fr', telephone: '05 61 88 77 66',
    statut: 'qualifie', source: 'Bouche a oreille', notes: 'Souhaite clim pour boutique',
    assigned_to: 'u2', created_at: '2026-05-19T10:00:00Z',
  },
  {
    id: 'p11', nom: 'Leroy', prenom: 'Nathalie', entreprise: 'Salon Coiffure Elegance',
    email: 'n.leroy@elegance.fr', telephone: '05 61 11 22 00',
    statut: 'premier_contact', source: 'Reseaux sociaux', notes: 'Interessee par PAC',
    assigned_to: 'u1', created_at: '2026-05-12T15:00:00Z',
  },
  {
    id: 'p12', nom: 'Simon', prenom: 'Eric', entreprise: 'Imprimerie Simon & Fils',
    email: 'e.simon@imprimerie-simon.fr', telephone: '05 62 44 55 66',
    statut: 'rdv', source: 'Site web', notes: 'Visite technique prevue',
    assigned_to: 'u2', created_at: '2026-05-08T09:00:00Z',
  },
  {
    id: 'p13', nom: 'Laurent', prenom: 'Camille', entreprise: 'Creche Les Petits Loups',
    email: 'c.laurent@petitsloups.fr', telephone: '05 61 66 77 88',
    statut: 'nouveau', source: 'Recommandation', notes: null,
    assigned_to: null, created_at: '2026-05-24T11:00:00Z',
  },
  {
    id: 'p14', nom: 'Rousseau', prenom: 'Marc', entreprise: 'Garage Moto 31',
    email: 'm.rousseau@moto31.fr', telephone: '05 61 99 00 11',
    statut: 'devis', source: 'Google Ads', notes: 'Devis en attente de validation',
    assigned_to: 'u1', created_at: '2026-04-25T14:30:00Z',
  },
];

// --- Clients ---
export const mockClients: Client[] = [
  {
    id: 'c1', nom: 'Martin', prenom: 'Pierre', entreprise: 'Dr. Martin Dentiste',
    email: 'p.martin@dr-martin.fr', telephone: '05 61 55 66 77',
    mrr: 350, prospect_origine_id: 'p7', notes: 'Client satisfait, maintenance mensuelle',
    created_at: '2026-04-20T09:00:00Z',
  },
  {
    id: 'c2', nom: 'Blanc', prenom: 'Antoine', entreprise: 'Agence Web Pixelia',
    email: 'a.blanc@pixelia.fr', telephone: '05 61 12 34 56',
    mrr: 200, prospect_origine_id: null, notes: 'Site web + maintenance SEO',
    created_at: '2025-11-15T09:00:00Z',
  },
  {
    id: 'c3', nom: 'Faure', prenom: 'Celine', entreprise: 'Cabinet Avocat Faure',
    email: 'c.faure@avocats-faure.fr', telephone: '05 62 78 90 12',
    mrr: 500, prospect_origine_id: null, notes: 'Contrat maintenance premium',
    created_at: '2025-09-01T09:00:00Z',
  },
  {
    id: 'c4', nom: 'Girard', prenom: 'Thomas', entreprise: 'Menuiserie Girard',
    email: 't.girard@menuiserie-girard.fr', telephone: '05 61 45 67 89',
    mrr: 150, prospect_origine_id: null, notes: 'Installation + entretien annuel',
    created_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'c5', nom: 'Mercier', prenom: 'Julie', entreprise: 'Opticien Mercier',
    email: 'j.mercier@optique-mercier.fr', telephone: '05 61 34 56 78',
    mrr: 250, prospect_origine_id: null, notes: 'Clim + deshumidificateur',
    created_at: '2025-06-20T09:00:00Z',
  },
  {
    id: 'c6', nom: 'Robert', prenom: 'Michel', entreprise: 'Patisserie Robert',
    email: 'm.robert@patisserie-robert.fr', telephone: '05 62 11 33 55',
    mrr: 400, prospect_origine_id: null, notes: 'Chambre froide + clim boutique',
    created_at: '2025-04-15T09:00:00Z',
  },
];

// --- Devis ---
export const mockDevisLignes: DevisLigne[] = [
  { id: 'dl1', devis_id: 'd1', designation: 'Climatiseur Daikin FTXM35', description: 'Unite murale 3.5kW', quantite: 2, prix_unitaire: 1200, montant: 2400 },
  { id: 'dl2', devis_id: 'd1', designation: 'Installation et mise en service', description: null, quantite: 1, prix_unitaire: 800, montant: 800 },
  { id: 'dl3', devis_id: 'd2', designation: 'PAC Air/Eau Atlantic', description: 'Alfeathermia 8kW', quantite: 1, prix_unitaire: 8500, montant: 8500 },
  { id: 'dl4', devis_id: 'd2', designation: 'Installation complete', description: 'Pose + raccordement + MES', quantite: 1, prix_unitaire: 3200, montant: 3200 },
  { id: 'dl5', devis_id: 'd3', designation: 'Climatiseur Mitsubishi MSZ-AP25', description: 'Mural 2.5kW', quantite: 3, prix_unitaire: 950, montant: 2850 },
  { id: 'dl6', devis_id: 'd3', designation: 'Pose et raccordement', description: null, quantite: 3, prix_unitaire: 450, montant: 1350 },
];

export const mockDevis: Devis[] = [
  {
    id: 'd1', numero: 'DEV-2026-001', prospect_id: 'p5', client_id: null,
    montant_ht: 3200, tva: 640, montant_ttc: 3840, statut: 'envoye',
    date_emission: '2026-05-10', date_validite: '2026-06-10',
    conditions: 'Paiement a 30 jours', notes: 'Clim atelier + bureau',
    created_at: '2026-05-10T09:00:00Z',
    lignes: mockDevisLignes.filter((l) => l.devis_id === 'd1'),
  },
  {
    id: 'd2', numero: 'DEV-2026-002', prospect_id: null, client_id: 'c3',
    montant_ht: 11700, tva: 2340, montant_ttc: 14040, statut: 'accepte',
    date_emission: '2026-04-20', date_validite: '2026-05-20',
    conditions: '40% acompte, solde a livraison', notes: 'Installation PAC cabinet',
    created_at: '2026-04-20T09:00:00Z',
    lignes: mockDevisLignes.filter((l) => l.devis_id === 'd2'),
  },
  {
    id: 'd3', numero: 'DEV-2026-003', prospect_id: 'p14', client_id: null,
    montant_ht: 4200, tva: 840, montant_ttc: 5040, statut: 'brouillon',
    date_emission: '2026-05-22', date_validite: '2026-06-22',
    conditions: null, notes: 'En attente validation technique',
    created_at: '2026-05-22T09:00:00Z',
    lignes: mockDevisLignes.filter((l) => l.devis_id === 'd3'),
  },
  {
    id: 'd4', numero: 'DEV-2026-004', prospect_id: 'p6', client_id: null,
    montant_ht: 5800, tva: 1160, montant_ttc: 6960, statut: 'envoye',
    date_emission: '2026-05-15', date_validite: '2026-06-15',
    conditions: 'Paiement a 30 jours fin de mois', notes: 'Clim open-space',
    created_at: '2026-05-15T09:00:00Z',
  },
  {
    id: 'd5', numero: 'DEV-2026-005', prospect_id: 'p8', client_id: null,
    montant_ht: 15000, tva: 3000, montant_ttc: 18000, statut: 'refuse',
    date_emission: '2026-04-05', date_validite: '2026-05-05',
    conditions: null, notes: 'Budget client insuffisant',
    created_at: '2026-04-05T09:00:00Z',
  },
];

// --- Projets ---
export const mockProjets: Projet[] = [
  {
    id: 'pr1', nom: 'Installation clim cabinet dentaire', client_id: 'c1',
    description: 'Pose de 2 unites murales Daikin dans les salles de soin',
    statut: 'en_cours', date_debut: '2026-05-01', date_fin_prevue: '2026-06-15',
    montant: 3840, created_at: '2026-04-25T09:00:00Z',
    client: mockClients[0],
  },
  {
    id: 'pr2', nom: 'Refonte site web Pixelia', client_id: 'c2',
    description: 'Redesign complet + migration vers Next.js',
    statut: 'en_cours', date_debut: '2026-03-15', date_fin_prevue: '2026-07-01',
    montant: 4800, created_at: '2026-03-10T09:00:00Z',
    client: mockClients[1],
  },
  {
    id: 'pr3', nom: 'PAC Cabinet Faure', client_id: 'c3',
    description: 'Installation pompe a chaleur air/eau 8kW',
    statut: 'en_preparation', date_debut: '2026-06-01', date_fin_prevue: '2026-07-15',
    montant: 14040, created_at: '2026-05-20T09:00:00Z',
    client: mockClients[2],
  },
  {
    id: 'pr4', nom: 'Maintenance annuelle Menuiserie', client_id: 'c4',
    description: 'Visite annuelle + nettoyage filtres + controle gaz',
    statut: 'termine', date_debut: '2026-04-01', date_fin_prevue: '2026-04-15',
    montant: 450, created_at: '2026-03-28T09:00:00Z',
    client: mockClients[3],
  },
  {
    id: 'pr5', nom: 'Chambre froide Patisserie Robert', client_id: 'c6',
    description: 'Installation chambre froide positive + climatisation boutique',
    statut: 'en_pause', date_debut: '2026-02-01', date_fin_prevue: '2026-04-30',
    montant: 9600, created_at: '2026-01-25T09:00:00Z',
    client: mockClients[5],
  },
];

// --- Interactions ---
export const mockInteractions: Interaction[] = [
  { id: 'i1', prospect_id: 'p1', type: 'note', contenu: 'Prospect decouvert via recherche Google, a rempli le formulaire de contact.', date_interaction: '2026-05-20T10:30:00Z', created_by: 'u1' },
  { id: 'i2', prospect_id: 'p2', type: 'rdv', contenu: 'Rencontre au salon BatiSud. Interessee par une solution de climatisation pour leurs bureaux.', date_interaction: '2026-05-18T15:00:00Z', created_by: 'u2' },
  { id: 'i3', prospect_id: 'p3', type: 'appel', contenu: 'Premier appel, tres receptif. A parle de ses besoins en clim pour la salle de restaurant.', date_interaction: '2026-05-16T11:00:00Z', created_by: 'u1' },
  { id: 'i4', prospect_id: 'p4', type: 'email', contenu: 'Email de confirmation du RDV pour visite technique le 28/05 a 14h.', date_interaction: '2026-05-14T09:00:00Z', created_by: 'u2' },
  { id: 'i5', prospect_id: 'p5', type: 'email', contenu: 'Devis DEV-2026-001 envoye par email. Relance prevue dans 7 jours.', date_interaction: '2026-05-10T10:00:00Z', created_by: 'u1' },
  { id: 'i6', prospect_id: 'p6', type: 'appel', contenu: 'Negociation en cours sur les conditions de paiement. Souhaite un echelonnement en 3 fois.', date_interaction: '2026-05-12T16:00:00Z', created_by: 'u1' },
  { id: 'i7', prospect_id: 'p7', type: 'rdv', contenu: 'Signature du contrat. Converti en client. Debut des travaux prevu le 01/05.', date_interaction: '2026-04-18T10:00:00Z', created_by: 'u2' },
  { id: 'i8', prospect_id: 'p4', type: 'appel', contenu: 'Rappel pour confirmer les horaires du RDV technique.', date_interaction: '2026-05-22T14:00:00Z', created_by: 'u2' },
  { id: 'i9', prospect_id: 'p10', type: 'appel', contenu: 'Prise de contact initiale, souhaite un devis pour climatisation de sa boulangerie.', date_interaction: '2026-05-21T10:00:00Z', created_by: 'u2' },
  { id: 'i10', prospect_id: 'p5', type: 'appel', contenu: 'Relance telephonique sur le devis. Demande un delai supplementaire.', date_interaction: '2026-05-19T15:00:00Z', created_by: 'u1' },
];

// --- MRR History (12 mois) ---
export const mockMrrHistory: MrrDataPoint[] = [
  { mois: 'Juin 25', mrr: 650 },
  { mois: 'Juil 25', mrr: 650 },
  { mois: 'Aout 25', mrr: 800 },
  { mois: 'Sep 25', mrr: 1050 },
  { mois: 'Oct 25', mrr: 1050 },
  { mois: 'Nov 25', mrr: 1050 },
  { mois: 'Dec 25', mrr: 1250 },
  { mois: 'Jan 26', mrr: 1400 },
  { mois: 'Fev 26', mrr: 1400 },
  { mois: 'Mar 26', mrr: 1550 },
  { mois: 'Avr 26', mrr: 1700 },
  { mois: 'Mai 26', mrr: 1850 },
];

// --- Settings ---
export const mockSettings: Setting[] = [
  { key: 'entreprise_nom', value: 'SOLAYIA', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_forme', value: 'SASU', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_capital', value: '', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_siret', value: '', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_rcs', value: '', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_adresse', value: '', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'entreprise_iban', value: '', updated_at: '2026-01-01T00:00:00Z' },
  { key: 'devis_conditions_default', value: 'Paiement a 30 jours fin de mois', updated_at: '2026-01-01T00:00:00Z' },
];
