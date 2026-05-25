'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { DevisStatut } from '@/lib/types';

export async function getDevis() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devis')
    .select('*, prospect:prospects(id, entreprise), client:clients(id, entreprise)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getDevis error:', error);
    return [];
  }
  return data ?? [];
}

export async function getDestinataires() {
  const supabase = await createClient();
  const [prospectsRes, clientsRes] = await Promise.all([
    supabase.from('prospects').select('id, entreprise').order('entreprise'),
    supabase.from('clients').select('id, entreprise').order('entreprise'),
  ]);
  return {
    prospects: prospectsRes.data ?? [],
    clients: clientsRes.data ?? [],
  };
}

export async function createDevisAction(formData: {
  prospect_id: string | null;
  client_id: string | null;
  conditions: string;
  notes: string;
  lignes: { designation: string; description: string; quantite: number; prix_unitaire: number }[];
  statut: DevisStatut;
}) {
  const supabase = await createClient();

  // Calculer les totaux
  const montant_ht = formData.lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);
  const tva = montant_ht * 0.2;
  const montant_ttc = montant_ht + tva;

  // Generer le numero via RPC (ou fallback)
  let numero = '';
  const { data: numData, error: numError } = await supabase.rpc('next_devis_numero');
  if (numError || !numData) {
    // Fallback: generer un numero simple
    const now = new Date();
    numero = `DEV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
  } else {
    numero = numData;
  }

  const today = new Date().toISOString().split('T')[0];
  const validite = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Creer le devis
  const { data: devis, error } = await supabase
    .from('devis')
    .insert({
      numero,
      prospect_id: formData.prospect_id || null,
      client_id: formData.client_id || null,
      montant_ht,
      tva,
      montant_ttc,
      statut: formData.statut,
      date_emission: today,
      date_validite: validite,
      conditions: formData.conditions || null,
      notes: formData.notes || null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Creer les lignes
  if (devis && formData.lignes.length > 0) {
    const lignesData = formData.lignes.map((l) => ({
      devis_id: devis.id,
      designation: l.designation,
      description: l.description || null,
      quantite: l.quantite,
      prix_unitaire: l.prix_unitaire,
      montant: l.quantite * l.prix_unitaire,
    }));
    await supabase.from('devis_lignes').insert(lignesData);
  }

  revalidatePath('/devis');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateDevisStatut(id: string, statut: DevisStatut) {
  const supabase = await createClient();
  const { error } = await supabase.from('devis').update({ statut }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/devis');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteDevis(id: string) {
  const supabase = await createClient();
  // Supprimer d'abord les lignes
  await supabase.from('devis_lignes').delete().eq('devis_id', id);
  const { error } = await supabase.from('devis').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/devis');
  revalidatePath('/dashboard');
  return { success: true };
}
