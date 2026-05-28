import type {
  Profile, Prospect, Client, Devis, DevisLigne,
  Projet, Interaction, MrrDataPoint, Setting,
} from './types';

// --- Profiles ---
export const mockProfiles: Profile[] = [
  {
    id: 'u1', email: 'kevin@solayia.fr', full_name: 'Kevin',
    role: 'admin', avatar_url: null, created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 'u2', email: 'adrien@solayia.fr', full_name: 'Adrien Lechevalier',
    role: 'membre', avatar_url: null, created_at: '2024-03-01T09:00:00Z',
  },
];

// Helper pour creer un prospect rapidement
function p(
  id: string, nom: string, prenom: string, entreprise: string,
  email: string, telephone: string,
  temperature: 'chaud' | 'tiede' | 'froid',
  statut: string,
  source: string,
  type_contact: 'prospect' | 'prescripteur',
  notes: string | null,
  date: string,
): Prospect {
  return {
    id, nom, prenom, entreprise, email, telephone,
    statut: statut as Prospect['statut'],
    temperature,
    type_contact,
    source,
    produit_cible: 'Solayia',
    notes,
    assigned_to: 'u2',
    type_prestation: null,
    description_prestation: null,
    adresse_chantier: null,
    tarif_propose: null,
    date_premier_contact: null,
    date_relance: null,
    urgence: temperature === 'froid' ? 'basse' as const : 'normale' as const,
    created_at: `${date}T09:00:00Z`,
    updated_at: `${date}T09:00:00Z`,
  };
}

// --- Prospects (donnees reelles CRM Solayia) ---
export const mockProspects: Prospect[] = [

  // ============================
  // 🔥 CHAUDS
  // ============================
  p('p1',  'TAIANA',    'Bruno',        '',                       'brunotaiana@hotmail.fr',              '06 85 62 16 85', 'chaud', 'prise_contact', '',                       'prospect', null, '2026-05-01'),
  p('p2',  'KERBRAT',   'Anthony',      '',                       'anthony.kerbrat31@gmail.com',         '06 51 49 95 59', 'chaud', 'prise_contact', '',                       'prospect', null, '2026-05-01'),
  p('p3',  'SALLES',    'Fabien',       '',                       '',                                    '06 73 31 74 55', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-02'),
  p('p4',  'CAYLA',     'Laurent',      '',                       '',                                    '06 01 33 61 60', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-02'),
  p('p5',  'MOYNET',    'Nicolas',      '',                       '',                                    '06 87 38 93 02', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-03'),
  p('p6',  'DOHA',      'Marie-Cecile', '',                       'mc.doha@territoria-mutuelle.org',     '06 18 41 79 85', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-03'),
  p('p7',  'PEDO',      'Beatrice',     '',                       '',                                    '06 75 52 35 43', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-04'),
  p('p8',  'MAURY',     'Benoit',       'Toulouse Universite Club','directeur@toulouseuniversiteclub.fr','06 30 03 04 16', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-04'),
  p('p9',  'ROLLIN',    'Nicolas',      'Abeille Verte',          'nicolas.rollin@abeilleverte.fr',      '06 37 00 57 96', 'chaud', 'prise_contact', 'Corporate Connections',  'prospect', null, '2026-05-05'),
  p('p10', 'GIACOSA',   'Ludyvine',     '',                       '',                                    '06 48 29 27 52', 'chaud', 'prise_contact', '',                       'prospect', null, '2026-05-05'),

  // ============================
  // 🌤️ TIEDES
  // ============================
  p('p11', 'AUJOULAT',         'Maite',     '',         'maite.aujoulat@immo35am.com', '06 64 21 52 00', 'tiede', 'prospect', '',  'prospect', null, '2026-05-06'),
  p('p12', 'DAMBRE',           'Elodie',    '',         '',                            '06 25 32 55 83', 'tiede', 'prospect', '',  'prospect', null, '2026-05-06'),
  p('p13', 'SENDRA',           'Fabrice',   'Stylobat', 'stylobat31@gmail.com',        '06 22 25 50 51', 'tiede', 'prospect', '',  'prospect', null, '2026-05-07'),
  p('p14', 'CHASTRE-SARIEGO',  'Stephanie', '',         '',                            '07 82 78 15 76', 'tiede', 'prospect', '',  'prospect', null, '2026-05-07'),

  // ============================
  // ❄️ FROIDS — Commerces / Restaurants (Prospection terrain)
  // ============================
  p('p15', 'PRIMAUX', 'Cedric', 'Le Ravelin (bar St Cyprien)',         'cedricprimaux@famillywebdiffusion.com', '05 82 95 14 50', 'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p16', '',        '',       'Le Pere Boulange (St Cyprien)',       '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p17', '',        '',       'Boucherie Les Fontaines',             '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p18', '',        '',       'Manolita',                            '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p19', '',        '',       'La Gougnotte',                        '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p20', '',        '',       'Restaurant Ytaing Toulouse',          '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-08'),
  p('p21', '',        '',       'Le Panivore',                         '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-09'),
  p('p22', '',        '',       'BASTA',                               '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-09'),
  p('p23', '',        '',       'Antho & Rita',                        '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-09'),
  p('p24', '',        '',       'Le Trio Gourmand St Cyprien',         '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-09'),
  p('p25', '',        '',       'Les Chimeres',                        '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-10'),
  p('p26', '',        '',       'Le Fournil De La Place Toulouse',     '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-10'),
  p('p27', '',        '',       'Tinto - Cafe d\'altitude Toulouse',   '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-10'),
  p('p28', '',        '',       'Mayumi',                              '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-10'),
  p('p29', '',        '',       'Bistrot 12',                          '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-11'),
  p('p30', '',        '',       'L\'Estaminot',                        '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-11'),
  p('p31', '',        '',       'L\'Italien Toulouse',                 '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-11'),
  p('p32', '',        '',       'Hayuco',                              '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-12'),
  p('p33', '',        '',       'L\'Atelier du Pecheur',               '',  '',  'froid', 'prospect', 'Prospection terrain', 'prospect', null, '2026-05-12'),

  // ============================
  // ❄️ FROIDS — Contacts / Entreprises
  // ============================
  p('p34', 'GUILLOT',  'Virginie',   '',                            '',                                    '06 59 42 83 48', 'froid', 'prospect', '',                      'prospect', null, '2026-05-13'),
  p('p35', 'BOYER',    'Frederique', 'Kesame',                      'frederic.boyer@kesame.fr',            '06 51 28 32 43', 'froid', 'prospect', 'Corporate Connections', 'prospect', null, '2026-05-13'),
  p('p36', 'SANGARE',  'Moussa',     '',                            '',                                    '07 66 86 71 76', 'froid', 'prospect', '',                      'prospect', null, '2026-05-14'),
  p('p37', 'CLIMENT',  'Anais',      '',                            '',                                    '06 40 16 85 08', 'froid', 'prospect', '',                      'prospect', null, '2026-05-14'),
  p('p38', '',         '',           'Les Canalisateurs',           'info@canalisateurs.com',              '',               'froid', 'prospect', '',                      'prospect', null, '2026-05-15'),
  p('p39', '',         '',           'Bati France Construction',    'contact@batifranceconstruction.com',  '06 34 35 36 29', 'froid', 'prospect', '',                      'prospect', 'Second tel: 06 27 43 18 46', '2026-05-15'),
  p('p40', '',         '',           'Somafi Group',                'sav@somafi.net',                      '',               'froid', 'prospect', '',                      'prospect', null, '2026-05-16'),
  p('p41', 'BARANES',  'Daniel',     '',                            'daniel.baranes@dbmail.com',           '07 88 24 98 12', 'froid', 'prospect', '',                      'prospect', null, '2026-05-16'),
  p('p42', 'MADRANGES','Helene',     'Les Compagnons Midi-Pyrenees','couvreur3119@gmail.com',              '',               'froid', 'prospect', '',                      'prospect', null, '2026-05-16'),
];

// --- Clients ---
export const mockClients: Client[] = [];

// --- Devis ---
export const mockDevisLignes: DevisLigne[] = [];
export const mockDevis: Devis[] = [];

// --- Projets ---
export const mockProjets: Projet[] = [];

// --- Interactions ---
export const mockInteractions: Interaction[] = [];

// --- MRR History (12 mois) ---
export const mockMrrHistory: MrrDataPoint[] = [
  { mois: 'Juin 25', mrr: 0 },
  { mois: 'Juil 25', mrr: 0 },
  { mois: 'Aout 25', mrr: 0 },
  { mois: 'Sep 25', mrr: 0 },
  { mois: 'Oct 25', mrr: 0 },
  { mois: 'Nov 25', mrr: 0 },
  { mois: 'Dec 25', mrr: 0 },
  { mois: 'Jan 26', mrr: 0 },
  { mois: 'Fev 26', mrr: 0 },
  { mois: 'Mar 26', mrr: 0 },
  { mois: 'Avr 26', mrr: 0 },
  { mois: 'Mai 26', mrr: 0 },
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
