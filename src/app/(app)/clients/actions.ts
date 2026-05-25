'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

export async function getClientDevis(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devis')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getClientDevis error:', error);
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

  const { error } = await supabase.from('clients').update({
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: formData.get('email') as string || null,
    telephone: formData.get('telephone') as string || null,
    mrr: parseFloat(formData.get('mrr') as string) || 0,
    notes: formData.get('notes') as string || null,
  }).eq('id', id);

  if (error) return { error: error.message };

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
