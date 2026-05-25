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
