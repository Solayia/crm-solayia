'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getProfiles error:', error);
    return [];
  }
  return data ?? [];
}

export async function inviteMember(email: string, role: 'admin' | 'membre') {
  if (!email) return { error: 'Email requis' };

  const supabaseAdmin = createAdminClient();

  // Generer un mot de passe temporaire
  const tempPassword = `Solayia-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  // Creer l'utilisateur via Admin API
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createError) {
    console.error('inviteMember createUser error:', createError);
    if (createError.message?.includes('already been registered')) {
      return { error: 'Cet email est deja enregistre' };
    }
    return { error: createError.message };
  }

  if (!newUser?.user) return { error: 'Erreur lors de la creation du compte' };

  // Mettre a jour le role dans profiles (le trigger handle_new_user cree le profil automatiquement)
  // Attendre un peu que le trigger s'execute
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', newUser.user.id);

  if (updateError) {
    console.error('inviteMember update role error:', updateError);
  }

  revalidatePath('/parametres/equipe');
  return {
    success: true,
    tempPassword,
    message: `Compte cree pour ${email}. Mot de passe temporaire : ${tempPassword}`,
  };
}

export async function updateMemberRole(userId: string, role: 'admin' | 'membre') {
  const supabase = await createClient();

  // Verifier qu'on ne retrograde pas le dernier admin
  if (role === 'membre') {
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length <= 1 && admins[0]?.id === userId) {
      return { error: 'Impossible de retrograder le dernier administrateur' };
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return { error: error.message };

  revalidatePath('/parametres/equipe');
  return { success: true };
}

export async function deleteMember(userId: string) {
  const supabase = await createClient();

  // Verifier que ce n'est pas le dernier admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role === 'admin') {
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length <= 1) {
      return { error: 'Impossible de supprimer le dernier administrateur' };
    }
  }

  // Verifier qu'on ne se supprime pas soi-meme
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === userId) {
    return { error: 'Vous ne pouvez pas supprimer votre propre compte' };
  }

  // Supprimer le profil (la suppression du user auth necessite le service role)
  const supabaseAdmin = createAdminClient();

  // Supprimer le profil d'abord
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) return { error: profileError.message };

  // Supprimer l'utilisateur auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    console.error('deleteMember auth error:', authError);
  }

  revalidatePath('/parametres/equipe');
  return { success: true };
}
