'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProspectStatut, ConversionData } from '@/lib/types';

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
    nom: formData.get('nom') as string || '',
    prenom: formData.get('prenom') as string || '',
    entreprise: formData.get('entreprise') as string || '',
    email: formData.get('email') as string || null,
    telephone: formData.get('telephone') as string || null,
    source: formData.get('source') as string || null,
    notes: formData.get('notes') as string || null,
    assigned_to: formData.get('assigned_to') as string || null,
    statut: 'prospect' as ProspectStatut,
    temperature: formData.get('temperature') as string || 'froid',
    type_contact: formData.get('type_contact') as string || 'prospect',
    produit_cible: formData.get('produit_cible') as string || 'Solayia',
    activite: (formData.get('activite') as string) || null,
    adresse: (formData.get('adresse') as string) || null,
    canaux_privilegies: (formData.get('canaux_privilegies') as string) || null,
    site_web: (formData.get('site_web') as string) || null,
    fonction: (formData.get('fonction') as string) || null,
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

// --- Fiche prospect detail ---

export async function getProspect(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*, assigned_profile:profiles!prospects_assigned_to_fkey(id, full_name, email)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getProspect error:', error);
    return null;
  }
  return data;
}

export async function updateProspect(id: string, formData: FormData) {
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    entreprise: formData.get('entreprise') as string,
    email: (formData.get('email') as string) || null,
    telephone: (formData.get('telephone') as string) || null,
    source: (formData.get('source') as string) || null,
    notes: (formData.get('notes') as string) || null,
    assigned_to: (formData.get('assigned_to') as string) || null,
    statut: (formData.get('statut') as string) || 'prospect',
    temperature: (formData.get('temperature') as string) || 'froid',
    type_contact: (formData.get('type_contact') as string) || 'prospect',
    produit_cible: (formData.get('produit_cible') as string) || '',
    type_prestation: (formData.get('type_prestation') as string) || null,
    description_prestation: (formData.get('description_prestation') as string) || null,
    adresse_chantier: (formData.get('adresse_chantier') as string) || null,
    urgence: (formData.get('urgence') as string) || 'normale',
    date_relance: (formData.get('date_relance') as string) || null,
    date_premier_contact: (formData.get('date_premier_contact') as string) || null,
    // Champs enrichis CRM
    activite: (formData.get('activite') as string) || null,
    adresse: (formData.get('adresse') as string) || null,
    canaux_privilegies: (formData.get('canaux_privilegies') as string) || null,
    dernier_canal: (formData.get('dernier_canal') as string) || null,
    derniere_communication: (formData.get('derniere_communication') as string) || null,
    drive_dedie: (formData.get('drive_dedie') as string) || null,
    fichiers_medias: (formData.get('fichiers_medias') as string) || null,
    fonction: (formData.get('fonction') as string) || null,
    maquette_solayia: (formData.get('maquette_solayia') as string) || null,
    pappers: (formData.get('pappers') as string) || null,
    prescripteur_ref: (formData.get('prescripteur_ref') as string) || null,
    site_web: (formData.get('site_web') as string) || null,
    traits_personnalite: (formData.get('traits_personnalite') as string) || null,
  };

  const tarif = formData.get('tarif_propose') as string;
  updates.tarif_propose = tarif ? parseFloat(tarif) : null;

  const tarifType = formData.get('tarif_type') as string;
  updates.tarif_type = tarifType || null;

  const duree = formData.get('duree_mois') as string;
  updates.duree_mois = duree ? parseInt(duree) : null;

  const ca = formData.get('ca_en_k') as string;
  updates.ca_en_k = ca ? parseFloat(ca) : null;

  const { error } = await supabase
    .from('prospects')
    .update(updates)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/prospects');
  revalidatePath(`/prospects/${id}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getProspectInteractions(prospectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interactions')
    .select('*, created_by_profile:profiles!interactions_created_by_fkey(id, full_name)')
    .eq('prospect_id', prospectId)
    .order('date_interaction', { ascending: false });

  if (error) {
    console.error('getProspectInteractions error:', error);
    return [];
  }
  return data ?? [];
}

export async function createInteraction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('interactions').insert({
    prospect_id: formData.get('prospect_id') as string,
    type: formData.get('type') as string,
    contenu: formData.get('contenu') as string,
    date_interaction: (formData.get('date_interaction') as string) || new Date().toISOString(),
    created_by: user?.id || null,
  });

  if (error) return { error: error.message };

  const prospectId = formData.get('prospect_id') as string;
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function deleteInteraction(id: string, prospectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('interactions').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function getProspectDevis(prospectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devis')
    .select('*')
    .eq('prospect_id', prospectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getProspectDevis error:', error);
    return [];
  }
  return data ?? [];
}

// --- Conversion prospect → client ---

export async function convertToClient(prospectId: string, financialData?: ConversionData) {
  const supabase = await createClient();

  // 1. Fetch prospect data
  const { data: prospect, error: fetchError } = await supabase
    .from('prospects')
    .select('nom, prenom, entreprise, email, telephone, notes, tarif_propose')
    .eq('id', prospectId)
    .single();

  if (fetchError || !prospect) {
    return { error: 'Prospect introuvable' };
  }

  // 2. Create client row with financial data
  const clientInsert: Record<string, unknown> = {
    nom: prospect.nom,
    prenom: prospect.prenom,
    entreprise: prospect.entreprise,
    email: prospect.email,
    telephone: prospect.telephone,
    notes: prospect.notes,
    mrr: financialData?.mrr || 0,
    prospect_origine_id: prospectId,
  };

  // Add financial fields (graceful: Supabase ignores unknown columns)
  if (financialData) {
    clientInsert.montant_one_shot = financialData.montant_one_shot || 0;
    clientInsert.acompte_paye = financialData.acompte_paye || false;
    clientInsert.solde_paye = financialData.solde_paye || false;
    clientInsert.mrr_date_debut = financialData.mrr_date_debut || null;
    clientInsert.duree_mois = financialData.duree_mois || null;
    clientInsert.type_prestation = financialData.type_prestation || null;
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert(clientInsert)
    .select('id')
    .single();

  if (clientError) {
    // Fallback: try with minimal fields if new columns don't exist yet
    const { data: clientFallback, error: fallbackError } = await supabase
      .from('clients')
      .insert({
        nom: prospect.nom,
        prenom: prospect.prenom,
        entreprise: prospect.entreprise,
        email: prospect.email,
        telephone: prospect.telephone,
        notes: prospect.notes,
        mrr: financialData?.mrr || 0,
        prospect_origine_id: prospectId,
      })
      .select('id')
      .single();

    if (fallbackError) {
      return { error: fallbackError.message };
    }

    // 3. Move prospect to first project stage
    await supabase.from('prospects').update({ statut: 'brief' }).eq('id', prospectId);
    revalidatePath('/prospects');
    revalidatePath('/clients');
    revalidatePath('/dashboard');
    return { success: true, clientId: clientFallback.id };
  }

  // 3. Move prospect to first project stage
  const { error: updateError } = await supabase
    .from('prospects')
    .update({ statut: 'brief' })
    .eq('id', prospectId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath('/prospects');
  revalidatePath('/clients');
  revalidatePath('/dashboard');

  return { success: true, clientId: client.id };
}

// --- Checklist de qualification ---

export async function updateProspectChecklist(
  prospectId: string,
  checklist: Record<string, boolean>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('prospects')
    .update({ prospect_checklist: checklist })
    .eq('id', prospectId);

  if (error) return { error: error.message };

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// --- Motif de perte ---

export async function updateMotifPerte(prospectId: string, motif: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('prospects')
    .update({ motif_perte: motif, statut: 'perdu' as ProspectStatut })
    .eq('id', prospectId);

  if (error) return { error: error.message };

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath('/prospects');
  revalidatePath('/dashboard');
  return { success: true };
}
