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

export async function inviteMember(email: string, fullName: string, role: 'admin' | 'membre') {
  if (!email) return { error: 'Email requis' };
  if (!fullName) return { error: 'Nom complet requis' };

  const supabaseAdmin = createAdminClient();

  // Generer un mot de passe temporaire
  const tempPassword = `Solayia-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  // Creer l'utilisateur via Admin API avec metadata pour le trigger
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError) {
    console.error('inviteMember createUser error:', createError);
    if (createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
      return { error: 'Cet email est deja enregistre' };
    }
    // Si le trigger plante, on tente sans trigger en creant le profil manuellement
    if (createError.message?.includes('Database error')) {
      return await createUserManually(supabaseAdmin, email, fullName, role, tempPassword);
    }
    return { error: createError.message };
  }

  if (!newUser?.user) return { error: 'Erreur lors de la creation du compte' };

  // S'assurer que le profil existe (le trigger a pu echouer silencieusement)
  await ensureProfile(supabaseAdmin, newUser.user.id, email, fullName, role);

  revalidatePath('/parametres/equipe');
  return {
    success: true,
    tempPassword,
    message: `Compte cree pour ${email}`,
  };
}

async function createUserManually(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  email: string,
  fullName: string,
  role: 'admin' | 'membre',
  tempPassword: string
) {
  // Desactiver temporairement le trigger en creant d'abord l'utilisateur
  // sans s'appuyer sur le trigger : on utilise l'API Supabase GoTrue
  // qui bypass les triggers si on passe les bonnes options

  // Methode alternative : Creer le user via signUp (qui ne trigger pas toujours)
  const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
    app_metadata: { skip_trigger: true },
  });

  // Si ca echoue encore, on essaie de creer le profil manuellement
  // apres avoir verifie si le user auth existe deja
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  if (existingUser) {
    await ensureProfile(supabaseAdmin, existingUser.id, email, fullName, role);
    revalidatePath('/parametres/equipe');
    return {
      success: true,
      tempPassword,
      message: `Compte cree pour ${email}`,
    };
  }

  if (signUpData?.user) {
    await ensureProfile(supabaseAdmin, signUpData.user.id, email, fullName, role);
    revalidatePath('/parametres/equipe');
    return {
      success: true,
      tempPassword,
      message: `Compte cree pour ${email}`,
    };
  }

  return { error: signUpError?.message || 'Impossible de creer le compte. Verifiez la configuration Supabase.' };
}

async function ensureProfile(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  userId: string,
  email: string,
  fullName: string,
  role: 'admin' | 'membre'
) {
  // Verifier si le profil existe deja
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existing) {
    // Mettre a jour le role et le nom
    await supabaseAdmin
      .from('profiles')
      .update({ full_name: fullName, role })
      .eq('id', userId);
  } else {
    // Creer le profil manuellement
    await supabaseAdmin
      .from('profiles')
      .insert({ id: userId, email, full_name: fullName, role });
  }
}

export async function updateMemberRole(userId: string, role: 'admin' | 'membre') {
  const supabaseAdmin = createAdminClient();

  // Verifier qu'on ne retrograde pas le dernier admin
  if (role === 'membre') {
    const { data: admins } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length <= 1 && admins[0]?.id === userId) {
      return { error: 'Impossible de retrograder le dernier administrateur' };
    }
  }

  const { error } = await supabaseAdmin
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
  const supabaseAdmin = createAdminClient();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role === 'admin') {
    const { data: admins } = await supabaseAdmin
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

  // Supprimer l'utilisateur auth (cascade supprimera le profil grace a ON DELETE CASCADE)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    console.error('deleteMember auth error:', authError);
    // Fallback: supprimer le profil directement
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (profileError) return { error: profileError.message };
  }

  revalidatePath('/parametres/equipe');
  return { success: true };
}
