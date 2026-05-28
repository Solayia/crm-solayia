// --- Enums / Union Types ---

// Pipeline commercial complet : de la prospection au suivi
export type ProspectStatut =
  | 'prospect'
  | 'prise_contact'
  | 'r1'
  | 'r2'
  | 'proposition'
  | 'acompte'
  | 'brief'
  | 'maquette'
  | 'validation_maquette'
  | 'pre_prod'
  | 'validation_pre_prod'
  | 'production'
  | 'suivi'
  | 'perdu';

export const PROSPECT_STATUTS: { value: ProspectStatut; label: string; color: string; emoji: string }[] = [
  { value: 'prospect', label: 'Prospect', color: 'bg-gray-100 text-gray-700', emoji: '🔍' },
  { value: 'prise_contact', label: 'Prise de contact', color: 'bg-sky-100 text-sky-700', emoji: '📞' },
  { value: 'r1', label: 'R1', color: 'bg-blue-100 text-blue-700', emoji: '🤝' },
  { value: 'r2', label: 'R2', color: 'bg-indigo-100 text-indigo-700', emoji: '📋' },
  { value: 'proposition', label: 'Proposition', color: 'bg-violet-100 text-violet-700', emoji: '📄' },
  { value: 'acompte', label: 'Acompte', color: 'bg-purple-100 text-purple-700', emoji: '💰' },
  { value: 'brief', label: 'Brief', color: 'bg-fuchsia-100 text-fuchsia-700', emoji: '📝' },
  { value: 'maquette', label: 'Maquette', color: 'bg-pink-100 text-pink-700', emoji: '🎨' },
  { value: 'validation_maquette', label: 'Valid. maquette', color: 'bg-rose-100 text-rose-700', emoji: '✅' },
  { value: 'pre_prod', label: 'Pre-prod', color: 'bg-amber-100 text-amber-700', emoji: '🔧' },
  { value: 'validation_pre_prod', label: 'Valid. pre-prod', color: 'bg-orange-100 text-orange-700', emoji: '👁️' },
  { value: 'production', label: 'Production', color: 'bg-emerald-100 text-emerald-700', emoji: '🚀' },
  { value: 'suivi', label: 'Suivi', color: 'bg-green-100 text-green-700', emoji: '🏁' },
  { value: 'perdu', label: 'Perdu', color: 'bg-red-100 text-red-700', emoji: '❌' },
];

// Etapes avant signature (pipeline commercial)
export const PIPELINE_COMMERCIAL = PROSPECT_STATUTS.filter(
  s => ['prospect', 'prise_contact', 'r1', 'r2', 'proposition', 'acompte'].includes(s.value)
);

// Etapes apres signature (gestion de projet/chantier)
export const PIPELINE_PROJET = PROSPECT_STATUTS.filter(
  s => ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'].includes(s.value)
);

// Type de contact : prospect classique ou prescripteur
export type TypeContact = 'prospect' | 'prescripteur';

export const TYPES_CONTACT: { value: TypeContact; label: string; color: string; emoji: string }[] = [
  { value: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-700', emoji: '🎯' },
  { value: 'prescripteur', label: 'Prescripteur', color: 'bg-teal-100 text-teal-700', emoji: '🤝' },
];

// Temperature du prospect
export type ProspectTemperature = 'chaud' | 'tiede' | 'froid';

export const PROSPECT_TEMPERATURES: { value: ProspectTemperature; label: string; color: string; emoji: string }[] = [
  { value: 'chaud', label: 'Chaud', color: 'bg-red-100 text-red-700', emoji: '🔥' },
  { value: 'tiede', label: 'Tiede', color: 'bg-amber-100 text-amber-700', emoji: '🌤️' },
  { value: 'froid', label: 'Froid', color: 'bg-blue-100 text-blue-700', emoji: '❄️' },
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

export const SOURCES_PROSPECT = [
  'Site web',
  'Google Ads',
  'Bouche a oreille',
  'Recommandation',
  'Salon professionnel',
  'Reseaux sociaux',
  'Corporate Connections',
  'Prospection terrain',
  'Demarchage telephone',
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
  temperature: ProspectTemperature;
  type_contact: TypeContact;
  source: string;
  produit_cible: string;
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
