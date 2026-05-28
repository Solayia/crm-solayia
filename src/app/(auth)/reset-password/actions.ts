'use server';

import { createClient } from '@/lib/supabase/server';

export async function resetPassword(password: string) {
  if (!password || password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caracteres.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('Reset password error:', error);

    if (error.message?.includes('session')) {
      return { error: 'Le lien a expire. Veuillez refaire une demande de reinitialisation.' };
    }

    return { error: 'Une erreur est survenue. Veuillez reessayer.' };
  }

  return { success: true };
}
