'use server';

import { createClient } from '@/lib/supabase/server';

export async function requestPasswordReset(email: string) {
  if (!email) {
    return { error: 'Veuillez entrer votre adresse email.' };
  }

  const supabase = await createClient();

  // Determine the base URL for the redirect
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    // Ne pas reveler si l'email existe ou non (securite)
    // On retourne toujours un succes cote UI
    return { success: true };
  }

  return { success: true };
}
