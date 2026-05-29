'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProspectStatut } from '@/lib/types';

export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getClients error:', error);
    return [];
  }
  return data ?? [];
}

export async function getClient(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getClient error:', error);
    return null;
  }
  return data;
}

export async function getClientProjets(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projets')
    .select('*')
    .eq('client_id', clientId)
    .order('date_debut', { ascending: false });

  if (error) {
    console.error('getClientProjets error:', error);
    return [];
  }
  return data ?? [];
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('clients').insert({
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: formData.get('email') as string || null,
    telephone: formData.get('telephone') as string || null,
    mrr: parseFloat(formData.get('mrr') as string) || 0,
    notes: formData.get('notes') as string || null,
  });

  if (error) return { error: error.message };

  revalidatePath('/clients');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: formData.get('email') as string || null,
    telephone: formData.get('telephone') as string || null,
    mrr: parseFloat(formData.get('mrr') as string) || 0,
    notes: formData.get('notes') as string || null,
    // Champs financiers enrichis
    montant_one_shot: parseFloat(formData.get('montant_one_shot') as string) || 0,
    acompte_paye: formData.get('acompte_paye') === 'true',
    solde_paye: formData.get('solde_paye') === 'true',
    mrr_date_debut: (formData.get('mrr_date_debut') as string) || null,
    duree_mois: parseInt(formData.get('duree_mois') as string) || null,
    type_prestation: (formData.get('type_prestation') as string) || null,
  };

  const { error } = await supabase.from('clients').update(updates).eq('id', id);

  if (error) {
    // Fallback sans les nouveaux champs si colonnes pas encore créées
    const { error: fallbackError } = await supabase.from('clients').update({
      nom: updates.nom, prenom: updates.prenom, entreprise: updates.entreprise,
      email: updates.email, telephone: updates.telephone, mrr: updates.mrr, notes: updates.notes,
    }).eq('id', id);
    if (fallbackError) return { error: fallbackError.message };
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${id}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/clients');
  revalidatePath('/dashboard');
  return { success: true };
}

// --- Pipeline projet (prospects passes en phase projet) ---

const PROJET_STATUTS_VALUES = ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'];

export async function getProjetProspects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*, assigned_profile:profiles!prospects_assigned_to_fkey(id, full_name, email)')
    .in('statut', PROJET_STATUTS_VALUES)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getProjetProspects error:', error);
    return [];
  }
  return data ?? [];
}

export async function updateProjetProspectStatut(id: string, statut: ProspectStatut) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('prospects')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/clients');
  revalidatePath('/prospects');
  revalidatePath('/dashboard');
  return { success: true };
}
