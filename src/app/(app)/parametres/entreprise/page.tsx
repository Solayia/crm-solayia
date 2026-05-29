'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Upload, Building2, CreditCard, CheckCircle } from 'lucide-react';
import { getSettings, saveSettings } from './actions';

export default function EntreprisePage() {
  const [form, setForm] = useState({
    entreprise_nom: '',
    entreprise_forme: 'SASU',
    entreprise_capital: '',
    entreprise_siret: '',
    entreprise_rcs: '',
    entreprise_adresse: '',
    entreprise_iban: '',
    devis_conditions_default: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    const settings = await getSettings();
    const newForm = { ...form };
    settings.forEach((s: { key: string; value: string }) => {
      if (s.key in newForm) {
        (newForm as Record<string, string>)[s.key] = s.value || '';
      }
    });
    setForm(newForm);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const result = await saveSettings(form);
    setSaving(false);
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

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
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations légales</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse du siège</label>
            <input type="text" value={form.entreprise_adresse} onChange={(e) => update('entreprise_adresse', e.target.value)} className="input-field" placeholder="Adresse complète" />
          </div>
        </div>
      </div>

      {/* Banque */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          Coordonnées bancaires
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
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Paramètres des devis</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Conditions de règlement par défaut</label>
          <input type="text" value={form.devis_conditions_default} onChange={(e) => update('devis_conditions_default', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Enregistré
          </span>
        )}
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
