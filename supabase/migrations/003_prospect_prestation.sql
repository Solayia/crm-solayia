-- ============================================
-- CRM Solayia — Migration 003 : Champs prestation & tarif sur prospects
-- ============================================

-- Ajout des champs prestation et tarif
alter table prospects add column if not exists type_prestation text;
alter table prospects add column if not exists description_prestation text;
alter table prospects add column if not exists adresse_chantier text;
alter table prospects add column if not exists tarif_propose numeric(10, 2);
alter table prospects add column if not exists date_premier_contact date;
alter table prospects add column if not exists date_relance date;
alter table prospects add column if not exists urgence text default 'normale' check (urgence in ('basse', 'normale', 'haute', 'urgente'));

-- Index sur les nouveaux champs
create index if not exists idx_prospects_type_prestation on prospects(type_prestation);
create index if not exists idx_prospects_date_relance on prospects(date_relance);
create index if not exists idx_prospects_urgence on prospects(urgence);
