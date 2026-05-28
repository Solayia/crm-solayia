-- Migration 004: Nouveau pipeline commercial complet + temperature + type_contact
-- Pipeline: prospect > prise_contact > r1 > r2 > proposition > acompte > brief > maquette > validation_maquette > pre_prod > validation_pre_prod > production > suivi | perdu
-- Temperature: chaud / tiede / froid
-- Type contact: prospect / prescripteur

-- Ajouter les nouvelles colonnes
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS temperature text DEFAULT 'froid';
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS type_contact text DEFAULT 'prospect';
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS produit_cible text DEFAULT 'Solayia';

-- Migrer les anciens statuts vers les nouveaux
UPDATE prospects SET statut = 'prospect' WHERE statut = 'nouveau';
UPDATE prospects SET statut = 'prise_contact' WHERE statut = 'premier_contact';
UPDATE prospects SET statut = 'prise_contact' WHERE statut = 'qualifie';
UPDATE prospects SET statut = 'r1' WHERE statut = 'rdv';
UPDATE prospects SET statut = 'proposition' WHERE statut = 'devis';
UPDATE prospects SET statut = 'negociation' WHERE statut = 'nego';
UPDATE prospects SET statut = 'suivi' WHERE statut = 'gagne';
-- 'perdu' reste 'perdu'

-- Index pour les nouveaux champs
CREATE INDEX IF NOT EXISTS idx_prospects_temperature ON prospects(temperature);
CREATE INDEX IF NOT EXISTS idx_prospects_type_contact ON prospects(type_contact);
CREATE INDEX IF NOT EXISTS idx_prospects_produit_cible ON prospects(produit_cible);
