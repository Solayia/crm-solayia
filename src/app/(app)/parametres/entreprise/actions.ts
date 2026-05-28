'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('key, value');

  if (error) {
    console.error('getSettings error:', error);
    return [];
  }
  return data ?? [];
}

export async function saveSettings(settings: Record<string, string>) {
  const supabase = await createClient();

  const upserts = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  }));

  const { error } = await supabase
    .from('settings')
    .upsert(upserts, { onConflict: 'key' });

  if (error) {
    console.error('saveSettings error:', error);
    return { error: error.message };
  }

  revalidatePath('/parametres/entreprise');
  revalidatePath('/dashboard');
  return { success: true };
}
