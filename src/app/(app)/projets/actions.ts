'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProjetStatut } from '@/lib/types';

export async function getProjets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projets')
    .select('*, client:clients(id, entreprise)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getProjets error:', error);
    return [];
  }
  return data ?? [];
}

export async function getClientsForSelect() {
  const supabase = await createClient();
  const { data } = await supabase.from('clients').select('id, entreprise').order('entreprise');
  return data ?? [];
}

export async function createProjetAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('projets').insert({
    nom: formData.get('nom') as string,
    client_id: formData.get('client_id') as string,
    description: formData.get('description') as string || null,
    statut: 'en_preparation' as ProjetStatut,
    date_debut: formData.get('date_debut') as string || new Date().toISOString().split('T')[0],
    date_fin_prevue: formData.get('date_fin_prevue') as string || null,
    montant: parseFloat(formData.get('montant') as string) || 0,
  });

  if (error) return { error: error.message };

  revalidatePath('/projets');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateProjetStatut(id: string, statut: ProjetStatut) {
  const supabase = await createClient();
  const { error } = await supabase.from('projets').update({ statut }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/projets');
  return { success: true };
}

export async function deleteProjet(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('projets').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/projets');
  revalidatePath('/dashboard');
  return { success: true };
}
