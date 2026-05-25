'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProspectStatut } from '@/lib/types';

export async function getProspects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*, assigned_profile:profiles!prospects_assigned_to_fkey(id, full_name, email)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getProspects error:', error);
    return [];
  }
  return data ?? [];
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name, email');
  return data ?? [];
}

export async function createProspect(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('prospects').insert({
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: formData.get('email') as string || null,
    telephone: formData.get('telephone') as string || null,
    source: formData.get('source') as string || null,
    notes: formData.get('notes') as string || null,
    assigned_to: formData.get('assigned_to') as string || null,
    statut: 'nouveau' as ProspectStatut,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/prospects');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateProspectStatut(id: string, statut: ProspectStatut) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('prospects')
    .update({ statut })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/prospects');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteProspect(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('prospects').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/prospects');
  revalidatePath('/dashboard');
  return { success: true };
}

// --- Fiche prospect detail ---

export async function getProspect(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*, assigned_profile:profiles!prospects_assigned_to_fkey(id, full_name, email)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getProspect error:', error);
    return null;
  }
  return data;
}

export async function updateProspect(id: string, formData: FormData) {
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: (formData.get('email') as string) || null,
    telephone: (formData.get('telephone') as string) || null,
    source: (formData.get('source') as string) || null,
    notes: (formData.get('notes') as string) || null,
    assigned_to: (formData.get('assigned_to') as string) || null,
    statut: (formData.get('statut') as string) || 'nouveau',
    type_prestation: (formData.get('type_prestation') as string) || null,
    description_prestation: (formData.get('description_prestation') as string) || null,
    adresse_chantier: (formData.get('adresse_chantier') as string) || null,
    urgence: (formData.get('urgence') as string) || 'normale',
    date_relance: (formData.get('date_relance') as string) || null,
    date_premier_contact: (formData.get('date_premier_contact') as string) || null,
  };

  const tarif = formData.get('tarif_propose') as string;
  updates.tarif_propose = tarif ? parseFloat(tarif) : null;

  const { error } = await supabase
    .from('prospects')
    .update(updates)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/prospects');
  revalidatePath(`/prospects/${id}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getProspectInteractions(prospectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interactions')
    .select('*, created_by_profile:profiles!interactions_created_by_fkey(id, full_name)')
    .eq('prospect_id', prospectId)
    .order('date_interaction', { ascending: false });

  if (error) {
    console.error('getProspectInteractions error:', error);
    return [];
  }
  return data ?? [];
}

export async function createInteraction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('interactions').insert({
    prospect_id: formData.get('prospect_id') as string,
    type: formData.get('type') as string,
    contenu: formData.get('contenu') as string,
    date_interaction: (formData.get('date_interaction') as string) || new Date().toISOString(),
    created_by: user?.id || null,
  });

  if (error) return { error: error.message };

  const prospectId = formData.get('prospect_id') as string;
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function deleteInteraction(id: string, prospectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('interactions').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function getProspectDevis(prospectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devis')
    .select('*')
    .eq('prospect_id', prospectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getProspectDevis error:', error);
    return [];
  }
  return data ?? [];
}
