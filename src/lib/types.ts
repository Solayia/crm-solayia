// --- Enums / Union Types ---

export type ProspectStatut =
  | 'nouveau'
  | 'qualifie'
  | 'premier_contact'
  | 'rdv'
  | 'devis'
  | 'nego'
  | 'gagne'
  | 'perdu';

export const PROSPECT_STATUTS: { value: ProspectStatut; label: string; color: string }[] = [
  { value: 'nouveau', label: 'Nouveau', color: 'bg-gray-100 text-gray-700' },
  { value: 'qualifie', label: 'Qualifie', color: 'bg-blue-100 text-blue-700' },
  { value: 'premier_contact', label: 'Premier contact', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'rdv', label: 'RDV', color: 'bg-purple-100 text-purple-700' },
  { value: 'devis', label: 'Devis', color: 'bg-amber-100 text-amber-700' },
  { value: 'nego', label: 'Nego', color: 'bg-orange-100 text-orange-700' },
  { value: 'gagne', label: 'Gagne', color: 'bg-green-100 text-green-700' },
  { value: 'perdu', label: 'Perdu', color: 'bg-red-100 text-red-700' },
];

export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';

export const DEVIS_STATUTS: { value: DevisStatut; label: string; color: string }[] = [
  { value: 'brouillon', label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  { value: 'envoye', label: 'Envoye', color: 'bg-blue-100 text-blue-700' },
  { value: 'accepte', label: 'Accepte', color: 'bg-green-100 text-green-700' },
  { value: 'refuse', label: 'Refuse', color: 'bg-red-100 text-red-700' },
  { value: 'expire', label: 'Expire', color: 'bg-amber-100 text-amber-700' },
];

export type ProjetStatut = 'en_preparation' | 'en_cours' | 'en_pause' | 'termine' | 'annule';

export const PROJET_STATUTS: { value: ProjetStatut; label: string; color: string }[] = [
  { value: 'en_preparation', label: 'En preparation', color: 'bg-gray-100 text-gray-700' },
  { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-700' },
  { value: 'en_pause', label: 'En pause', color: 'bg-amber-100 text-amber-700' },
  { value: 'termine', label: 'Termine', color: 'bg-green-100 text-green-700' },
  { value: 'annule', label: 'Annule', color: 'bg-red-100 text-red-700' },
];

export type InteractionType = 'appel' | 'email' | 'rdv' | 'note';
export type UserRole = 'admin' | 'membre';

// --- Interfaces ---

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export type ProspectUrgence = 'basse' | 'normale' | 'haute' | 'urgente';

export const PROSPECT_URGENCES: { value: ProspectUrgence; label: string; color: string }[] = [
  { value: 'basse', label: 'Basse', color: 'bg-gray-100 text-gray-600' },
  { value: 'normale', label: 'Normale', color: 'bg-blue-100 text-blue-700' },
  { value: 'haute', label: 'Haute', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-700' },
];

export const TYPES_PRESTATION = [
  'Creation site web',
  'Refonte site web',
  'Maintenance web',
  'SEO / Referencement',
  'Application web',
  'E-commerce',
  'Climatisation',
  'Electricite',
  'Plomberie',
  'Multi-services',
  'Autre',
];

export interface Prospect {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
  telephone: string;
  statut: ProspectStatut;
  source: string;
  notes: string | null;
  assigned_to: string | null;
  assigned_profile?: Profile;
  type_prestation: string | null;
  description_prestation: string | null;
  adresse_chantier: string | null;
  tarif_propose: number | null;
  date_premier_contact: string | null;
  date_relance: string | null;
  urgence: ProspectUrgence;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
  telephone: string;
  mrr: number;
  prospect_origine_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface DevisLigne {
  id: string;
  devis_id: string;
  designation: string;
  description: string | null;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface Devis {
  id: string;
  numero: string;
  prospect_id: string | null;
  client_id: string | null;
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: DevisStatut;
  date_emission: string;
  date_validite: string;
  conditions: string | null;
  notes: string | null;
  created_at: string;
  prospect?: Prospect;
  client?: Client;
  lignes?: DevisLigne[];
}

export interface Projet {
  id: string;
  nom: string;
  client_id: string;
  description: string | null;
  statut: ProjetStatut;
  date_debut: string;
  date_fin_prevue: string | null;
  montant: number;
  created_at: string;
  client?: Client;
}

export interface Interaction {
  id: string;
  prospect_id: string;
  type: InteractionType;
  contenu: string;
  date_interaction: string;
  created_by: string;
  prospect?: Prospect;
  created_by_profile?: Profile;
}

export interface Site {
  id: string;
  client_id: string;
  url: string;
  nom: string;
  statut_tech: 'ok' | 'warning' | 'down' | 'unknown';
  derniere_verification: string | null;
}

export interface MrrDataPoint {
  mois: string;
  mrr: number;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}
