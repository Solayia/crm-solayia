-- ============================================
-- CRM Solayia — Migration 002 : Storage buckets
-- ============================================

-- Bucket: devis (PDFs)
insert into storage.buckets (id, name, public)
values ('devis', 'devis', false)
on conflict (id) do nothing;

create policy "devis_read_authenticated" on storage.objects
  for select using (bucket_id = 'devis' and auth.role() = 'authenticated');

create policy "devis_insert_authenticated" on storage.objects
  for insert with check (bucket_id = 'devis' and auth.role() = 'authenticated');

-- Bucket: avatars (patch A.5)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_read_all" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_authenticated_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Bucket: branding (patch B.2 — logo)
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

create policy "branding_read_all" on storage.objects
  for select using (bucket_id = 'branding');

create policy "branding_admin_write" on storage.objects
  for insert with check (bucket_id = 'branding' and (select is_admin()));
