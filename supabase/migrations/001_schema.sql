-- ============================================
-- CRM Solayia — Migration 001 : Schema complet
-- ============================================

-- Fonction utilitaire : verifier si l'utilisateur est admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- ============================================
-- TABLE: profiles (liee a auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'membre' check (role in ('admin', 'membre')),
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles_select" on profiles for select
  using (auth.role() = 'authenticated');

create policy "profiles_update_self" on profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from profiles where id = auth.uid())
  );

-- Trigger : creer un profil automatiquement a l'inscription
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case
      when (select count(*) from profiles) = 0 then 'admin'
      else 'membre'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- TABLE: prospects
-- ============================================
create table prospects (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null default '',
  entreprise text not null default '',
  email text,
  telephone text,
  statut text not null default 'nouveau' check (statut in (
    'nouveau', 'qualifie', 'premier_contact', 'rdv', 'devis', 'nego', 'gagne', 'perdu'
  )),
  source text,
  notes text,
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table prospects enable row level security;

create policy "prospects_select" on prospects for select
  using (auth.role() = 'authenticated');
create policy "prospects_insert" on prospects for insert
  with check (auth.role() = 'authenticated');
create policy "prospects_update" on prospects for update
  using (auth.role() = 'authenticated');
create policy "prospects_delete" on prospects for delete
  using (is_admin());

-- ============================================
-- TABLE: clients
-- ============================================
create table clients (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null default '',
  entreprise text not null default '',
  email text,
  telephone text,
  mrr numeric(10, 2) not null default 0,
  prospect_origine_id uuid references prospects(id) on delete set null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clients enable row level security;

create policy "clients_select" on clients for select
  using (auth.role() = 'authenticated');
create policy "clients_insert" on clients for insert
  with check (auth.role() = 'authenticated');
create policy "clients_update" on clients for update
  using (auth.role() = 'authenticated');
create policy "clients_delete" on clients for delete
  using (is_admin());

-- ============================================
-- TABLE: interactions
-- ============================================
create table interactions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  type text not null check (type in ('appel', 'email', 'rdv', 'note')),
  contenu text not null default '',
  date_interaction timestamptz not null default now(),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table interactions enable row level security;

create policy "interactions_select" on interactions for select
  using (auth.role() = 'authenticated');
create policy "interactions_insert" on interactions for insert
  with check (auth.role() = 'authenticated');
create policy "interactions_update" on interactions for update
  using (auth.role() = 'authenticated');
create policy "interactions_delete" on interactions for delete
  using (is_admin());

-- ============================================
-- TABLE: devis
-- ============================================
create table devis (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  prospect_id uuid references prospects(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  montant_ht numeric(10, 2) not null default 0,
  tva numeric(10, 2) not null default 0,
  montant_ttc numeric(10, 2) not null default 0,
  statut text not null default 'brouillon' check (statut in (
    'brouillon', 'envoye', 'accepte', 'refuse', 'expire'
  )),
  date_emission date not null default current_date,
  date_validite date not null default (current_date + interval '30 days'),
  conditions text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table devis enable row level security;

create policy "devis_select" on devis for select
  using (auth.role() = 'authenticated');
create policy "devis_insert" on devis for insert
  with check (auth.role() = 'authenticated');
create policy "devis_update" on devis for update
  using (auth.role() = 'authenticated');
create policy "devis_delete" on devis for delete
  using (is_admin());

-- ============================================
-- TABLE: devis_lignes
-- ============================================
create table devis_lignes (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references devis(id) on delete cascade,
  designation text not null,
  description text,
  quantite numeric(10, 2) not null default 1,
  prix_unitaire numeric(10, 2) not null default 0,
  montant numeric(10, 2) not null default 0
);

alter table devis_lignes enable row level security;

create policy "devis_lignes_select" on devis_lignes for select
  using (auth.role() = 'authenticated');
create policy "devis_lignes_insert" on devis_lignes for insert
  with check (auth.role() = 'authenticated');
create policy "devis_lignes_update" on devis_lignes for update
  using (auth.role() = 'authenticated');
create policy "devis_lignes_delete" on devis_lignes for delete
  using (auth.role() = 'authenticated');

-- ============================================
-- TABLE: projets
-- ============================================
create table projets (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  client_id uuid not null references clients(id) on delete cascade,
  description text,
  statut text not null default 'en_preparation' check (statut in (
    'en_preparation', 'en_cours', 'en_pause', 'termine', 'annule'
  )),
  date_debut date not null default current_date,
  date_fin_prevue date,
  montant numeric(10, 2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table projets enable row level security;

create policy "projets_select" on projets for select
  using (auth.role() = 'authenticated');
create policy "projets_insert" on projets for insert
  with check (auth.role() = 'authenticated');
create policy "projets_update" on projets for update
  using (auth.role() = 'authenticated');
create policy "projets_delete" on projets for delete
  using (is_admin());

-- ============================================
-- TABLE: sites
-- ============================================
create table sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  url text not null,
  nom text not null,
  statut_tech text not null default 'unknown' check (statut_tech in ('ok', 'warning', 'down', 'unknown')),
  derniere_verification timestamptz,
  created_at timestamptz default now()
);

alter table sites enable row level security;

create policy "sites_select" on sites for select
  using (auth.role() = 'authenticated');
create policy "sites_insert" on sites for insert
  with check (auth.role() = 'authenticated');
create policy "sites_update" on sites for update
  using (auth.role() = 'authenticated');
create policy "sites_delete" on sites for delete
  using (is_admin());

-- ============================================
-- TABLE: mrr_history (patch A.3)
-- ============================================
create table mrr_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  montant numeric(10, 2) not null,
  date_effet date not null default current_date,
  created_at timestamptz default now()
);

alter table mrr_history enable row level security;

create policy "mrr_history_select" on mrr_history for select
  using (auth.role() = 'authenticated');
create policy "mrr_history_insert" on mrr_history for insert
  with check (auth.role() = 'authenticated');
create policy "mrr_history_delete" on mrr_history for delete
  using (is_admin());

-- Trigger MRR (patch A.3)
create or replace function track_mrr_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT' and new.mrr > 0) or
     (tg_op = 'UPDATE' and new.mrr is distinct from old.mrr) then
    insert into mrr_history (client_id, montant, date_effet)
    values (new.id, new.mrr, current_date);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_clients_mrr_history
  after insert or update of mrr on clients
  for each row execute function track_mrr_change();

-- ============================================
-- TABLE: settings (patch B.1)
-- ============================================
create table settings (
  key text primary key check (key ~ '^[a-z_]+$'),
  value text not null,
  updated_at timestamptz default now()
);

alter table settings enable row level security;

create policy "settings_read" on settings for select
  using (auth.role() = 'authenticated');
create policy "settings_admin_update" on settings for update
  using (is_admin());
create policy "settings_admin_insert" on settings for insert
  with check (is_admin());
create policy "settings_admin_delete" on settings for delete
  using (is_admin());

-- Seed settings
insert into settings (key, value) values
  ('entreprise_nom', 'SOLAYIA'),
  ('entreprise_forme', 'SASU'),
  ('entreprise_capital', ''),
  ('entreprise_siret', ''),
  ('entreprise_rcs', ''),
  ('entreprise_adresse', ''),
  ('entreprise_iban', ''),
  ('devis_conditions_default', 'Paiement a 30 jours fin de mois');

-- ============================================
-- FUNCTION: next_devis_numero (patch A.4)
-- ============================================
create or replace function next_devis_numero()
returns text as $$
declare
  current_year int := extract(year from now())::int;
  next_num int;
begin
  lock table devis in share row exclusive mode;
  select coalesce(max(
    cast(split_part(numero, '-', 3) as int)
  ), 0) + 1
  into next_num
  from devis
  where numero like 'DEV-' || current_year::text || '-%';
  return 'DEV-' || current_year::text || '-' || lpad(next_num::text, 3, '0');
end;
$$ language plpgsql;

-- ============================================
-- INDEX (patch A.6)
-- ============================================
create index idx_prospects_statut on prospects(statut);
create index idx_prospects_assigned on prospects(assigned_to);
create index idx_prospects_source on prospects(source);
create index idx_prospects_email_lower on prospects(lower(email));
create index idx_interactions_prospect on interactions(prospect_id);
create index idx_interactions_date on interactions(date_interaction desc);
create index idx_clients_prospect_origine on clients(prospect_origine_id);
create index idx_projets_client on projets(client_id);
create index idx_projets_statut on projets(statut);
create index idx_sites_client on sites(client_id);
create index idx_devis_prospect on devis(prospect_id);
create index idx_devis_client on devis(client_id);
create index idx_devis_statut on devis(statut);
create index idx_devis_lignes_devis on devis_lignes(devis_id);
create index idx_mrr_history_client on mrr_history(client_id);
create index idx_mrr_history_date on mrr_history(date_effet desc);

-- ============================================
-- Trigger updated_at
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_prospects_updated_at before update on prospects for each row execute function update_updated_at();
create trigger trg_clients_updated_at before update on clients for each row execute function update_updated_at();
create trigger trg_devis_updated_at before update on devis for each row execute function update_updated_at();
create trigger trg_projets_updated_at before update on projets for each row execute function update_updated_at();
