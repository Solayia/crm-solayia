'use client';

import { useState } from 'react';
import { Save, Upload, Building2, CreditCard } from 'lucide-react';
import { mockSettings } from '@/lib/mock-data';

export default function EntreprisePage() {
  const getSetting = (key: string) => mockSettings.find((s) => s.key === key)?.value || '';

  const [form, setForm] = useState({
    entreprise_nom: getSetting('entreprise_nom'),
    entreprise_forme: getSetting('entreprise_forme'),
    entreprise_capital: getSetting('entreprise_capital'),
    entreprise_siret: getSetting('entreprise_siret'),
    entreprise_rcs: getSetting('entreprise_rcs'),
    entreprise_adresse: getSetting('entreprise_adresse'),
    entreprise_iban: getSetting('entreprise_iban'),
    devis_conditions_default: getSetting('devis_conditions_default'),
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="max-w-3xl space-y-6">
      {/* Logo */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          Logo de l&apos;entreprise
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-400">S</span>
          </div>
          <div>
            <button className="btn-secondary text-sm">
              <Upload className="w-4 h-4" />
              Uploader un logo
            </button>
            <p className="text-xs text-gray-400 mt-1">SVG, PNG ou JPG. Max 2 Mo.</p>
          </div>
        </div>
      </div>

      {/* Infos entreprise */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations legales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l&apos;entreprise</label>
            <input type="text" value={form.entreprise_nom} onChange={(e) => update('entreprise_nom', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Forme juridique</label>
            <select value={form.entreprise_forme} onChange={(e) => update('entreprise_forme', e.target.value)} className="input-field">
              <option value="SASU">SASU</option>
              <option value="SAS">SAS</option>
              <option value="SARL">SARL</option>
              <option value="EURL">EURL</option>
              <option value="EI">Entreprise Individuelle</option>
              <option value="SA">SA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Capital social (EUR)</label>
            <input type="text" value={form.entreprise_capital} onChange={(e) => update('entreprise_capital', e.target.value)} className="input-field" placeholder="Ex: 1000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SIRET</label>
            <input type="text" value={form.entreprise_siret} onChange={(e) => update('entreprise_siret', e.target.value)} className="input-field" placeholder="XXX XXX XXX XXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">RCS</label>
            <input type="text" value={form.entreprise_rcs} onChange={(e) => update('entreprise_rcs', e.target.value)} className="input-field" placeholder="RCS Toulouse" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse du siege</label>
            <input type="text" value={form.entreprise_adresse} onChange={(e) => update('entreprise_adresse', e.target.value)} className="input-field" placeholder="Adresse complete" />
          </div>
        </div>
      </div>

      {/* Banque */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          Coordonnees bancaires
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">IBAN</label>
            <input type="text" value={form.entreprise_iban} onChange={(e) => update('entreprise_iban', e.target.value)} className="input-field font-mono" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
          </div>
        </div>
      </div>

      {/* Devis defaults */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Parametres des devis</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Conditions de reglement par defaut</label>
          <input type="text" value={form.devis_conditions_default} onChange={(e) => update('devis_conditions_default', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
