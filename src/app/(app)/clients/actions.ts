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
