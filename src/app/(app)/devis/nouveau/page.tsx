'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { mockProspects, mockClients } from '@/lib/mock-data';

interface LigneDevis {
  id: number;
  designation: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
}

export default function NouveauDevisPage() {
  const [destinataireType, setDestinataireType] = useState<'prospect' | 'client'>('prospect');
  const [destinataireId, setDestinataireId] = useState('');
  const [conditions, setConditions] = useState('Paiement a 30 jours fin de mois');
  const [notes, setNotes] = useState('');
  const [lignes, setLignes] = useState<LigneDevis[]>([
    { id: 1, designation: '', description: '', quantite: 1, prix_unitaire: 0 },
  ]);

  const addLigne = () => {
    setLignes([...lignes, { id: Date.now(), designation: '', description: '', quantite: 1, prix_unitaire: 0 }]);
  };

  const removeLigne = (id: number) => {
    if (lignes.length > 1) setLignes(lignes.filter((l) => l.id !== id));
  };

  const updateLigne = (id: number, field: keyof LigneDevis, value: string | number) => {
    setLignes(lignes.map((l) => l.id === id ? { ...l, [field]: value } : l));
  };

  const totalHT = lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;

  const destinataires = destinataireType === 'prospect'
    ? mockProspects.map((p) => ({ id: p.id, label: p.entreprise }))
    : mockClients.map((c) => ({ id: c.id, label: c.entreprise }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/devis" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nouveau devis</h2>
            <p className="text-xs text-gray-500">Le numero sera genere automatiquement</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Brouillon
          </button>
          <button className="btn-primary">
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </div>

      {/* Destinataire */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Destinataire</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <select
              value={destinataireType}
              onChange={(e) => { setDestinataireType(e.target.value as 'prospect' | 'client'); setDestinataireId(''); }}
              className="input-field"
            >
              <option value="prospect">Prospect</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {destinataireType === 'prospect' ? 'Prospect' : 'Client'}
            </label>
            <select value={destinataireId} onChange={(e) => setDestinataireId(e.target.value)} className="input-field">
              <option value="">Selectionner...</option>
              {destinataires.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lignes */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Lignes du devis</h3>
          <button onClick={addLigne} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {lignes.map((ligne, idx) => (
            <div key={ligne.id} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg">
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Designation</label>
                <input
                  type="text"
                  value={ligne.designation}
                  onChange={(e) => updateLigne(ligne.id, 'designation', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Ex: Climatiseur Daikin FTXM35"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Qte</label>
                <input
                  type="number"
                  min="1"
                  value={ligne.quantite}
                  onChange={(e) => updateLigne(ligne.id, 'quantite', parseInt(e.target.value) || 0)}
                  className="input-field text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Prix unit. EUR</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ligne.prix_unitaire}
                  onChange={(e) => updateLigne(ligne.id, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                  className="input-field text-sm"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Total</label>
                <p className="text-sm font-semibold text-gray-900 py-2">{formatCurrency(ligne.quantite * ligne.prix_unitaire)}</p>
              </div>
              <div className="col-span-1 flex items-end pb-2">
                <button onClick={() => removeLigne(ligne.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total HT</span>
              <span className="font-medium text-gray-900">{formatCurrency(totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">TVA (20%)</span>
              <span className="text-gray-700">{formatCurrency(tva)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total TTC</span>
              <span className="text-brand-600">{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Conditions & Notes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Conditions de reglement</label>
            <input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes internes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Notes visibles uniquement en interne" />
          </div>
        </div>
      </div>
    </div>
  );
}
