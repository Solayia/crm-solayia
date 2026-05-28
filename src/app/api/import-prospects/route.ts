'use server';

import { createClient } from '@/lib/supabase/server';
import { mockProspects } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  // Recuperer les prospects existants pour eviter les doublons
  const { data: existing } = await supabase
    .from('prospects')
    .select('email, entreprise, nom, prenom');

  const existingKeys = new Set(
    (existing ?? []).map(
      (p) => `${(p.nom || '').toLowerCase()}|${(p.prenom || '').toLowerCase()}|${(p.entreprise || '').toLowerCase()}`
    )
  );

  // Filtrer les prospects mock qui n'existent pas encore
  const toInsert = mockProspects
    .filter((p) => {
      const key = `${(p.nom || '').toLowerCase()}|${(p.prenom || '').toLowerCase()}|${(p.entreprise || '').toLowerCase()}`;
      return !existingKeys.has(key);
    })
    .map((p) => {
      // Retirer les champs qui ne sont pas dans la table Supabase (id, assigned_profile, etc.)
      const { id, assigned_to, ...rest } = p as unknown as Record<string, unknown>;
      return {
        ...rest,
        assigned_to: null, // On ne peut pas mapper les IDs mock vers Supabase
      };
    });

  if (toInsert.length === 0) {
    return NextResponse.json({ message: 'Tous les contacts sont deja importes.', imported: 0 });
  }

  const { data, error } = await supabase
    .from('prospects')
    .insert(toInsert)
    .select();

  if (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `${data.length} contacts importes avec succes.`,
    imported: data.length,
    total: (existing?.length ?? 0) + data.length,
  });
}
