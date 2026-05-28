'use client';

import { useState, useRef } from 'react';
import {
  X, Plus, Trash2, FileText, Printer, Download, Eye, Edit3,
  Building2, Calendar, Euro, Hash, ChevronDown, ChevronUp, GripVertical,
} from 'lucide-react';

interface LigneProposition {
  id: string;
  designation: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
}

interface ProposalData {
  // Prospect info
  prospect_nom: string;
  prospect_prenom: string;
  prospect_entreprise: string;
  prospect_email: string;
  prospect_telephone: string;
  prospect_adresse: string;
  // Prestation
  type_prestation: string;
  description_prestation: string;
  // Company info
  entreprise_nom: string;
  entreprise_forme: string;
  entreprise_siret: string;
  entreprise_rcs: string;
  entreprise_adresse: string;
  entreprise_capital: string;
}

interface ProposalEditorProps {
  prospectData: {
    nom: string;
    prenom: string;
    entreprise: string;
    email: string;
    telephone: string;
    adresse?: string;
    type_prestation?: string;
    description_prestation?: string;
    tarif_propose?: number;
    adresse_chantier?: string;
  };
  onClose: () => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const TVA_RATE = 20;

export default function ProposalEditor({ prospectData, onClose }: ProposalEditorProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Proposal metadata
  const [numero, setNumero] = useState(`PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [dateEmission, setDateEmission] = useState(new Date().toISOString().split('T')[0]);
  const [dateValidite, setDateValidite] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [objet, setObjet] = useState(
    prospectData.type_prestation
      ? `${prospectData.type_prestation} — ${prospectData.entreprise || `${prospectData.prenom} ${prospectData.nom}`.trim()}`
      : `Proposition commerciale — ${prospectData.entreprise || `${prospectData.prenom} ${prospectData.nom}`.trim()}`
  );

  // Line items
  const [lignes, setLignes] = useState<LigneProposition[]>(() => {
    if (prospectData.tarif_propose && prospectData.type_prestation) {
      return [{
        id: generateId(),
        designation: prospectData.type_prestation,
        description: prospectData.description_prestation || '',
        quantite: 1,
        prix_unitaire: prospectData.tarif_propose,
      }];
    }
    return [{
      id: generateId(),
      designation: '',
      description: '',
      quantite: 1,
      prix_unitaire: 0,
    }];
  });

  // Conditions
  const [conditions, setConditions] = useState(`Conditions de reglement :
- 30% a la signature
- 40% a la livraison de la maquette validee
- 30% a la mise en production

Delai de realisation : 4 a 6 semaines a compter de la reception de l'acompte.

Cette proposition est valable 30 jours a compter de sa date d'emission.`);

  const [notes, setNotes] = useState('');
  const [showConditions, setShowConditions] = useState(false);

  // Calculations
  const totalHT = lignes.reduce((sum, l) => sum + l.quantite * l.prix_unitaire, 0);
  const totalTVA = totalHT * (TVA_RATE / 100);
  const totalTTC = totalHT + totalTVA;

  const addLigne = () => {
    setLignes([...lignes, {
      id: generateId(),
      designation: '',
      description: '',
      quantite: 1,
      prix_unitaire: 0,
    }]);
  };

  const removeLigne = (id: string) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter(l => l.id !== id));
    }
  };

  const updateLigne = (id: string, field: keyof LigneProposition, value: string | number) => {
    setLignes(lignes.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${objet}</title>
        <style>
          @page { size: A4; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; }
          .page {
            width: 210mm; min-height: 297mm; padding: 24mm 20mm 20mm;
            margin: 0 auto; position: relative;
          }
          /* Header band */
          .header-band {
            position: absolute; top: 0; left: 0; right: 0; height: 8mm;
            background: linear-gradient(135deg, #0A1A3A, #1B2D5B);
          }
          .header-accent {
            position: absolute; top: 0; right: 0; width: 40%; height: 8mm;
            background: linear-gradient(135deg, #D4A84B, #B8902E);
            clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
          }
          /* Logo section */
          .logo-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8mm; }
          .logo-block h1 { font-size: 22pt; font-weight: 800; color: #0A1A3A; letter-spacing: -0.03em; }
          .logo-block p { font-size: 8pt; color: #64748B; letter-spacing: 0.15em; text-transform: uppercase; }
          .doc-info { text-align: right; }
          .doc-info .label { font-size: 7pt; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
          .doc-info .value { font-size: 9pt; color: #0A1A3A; font-weight: 600; }
          .doc-info .row { margin-bottom: 2mm; }
          /* Title */
          .proposal-title {
            background: linear-gradient(135deg, #0A1A3A, #1B2D5B);
            color: #fff; padding: 5mm 6mm; border-radius: 3mm; margin-bottom: 6mm;
          }
          .proposal-title h2 { font-size: 13pt; font-weight: 700; margin-bottom: 1mm; }
          .proposal-title p { font-size: 8pt; color: #CBD5E1; }
          /* Addresses */
          .addresses { display: flex; gap: 6mm; margin-bottom: 6mm; }
          .address-block { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 2mm; padding: 4mm; }
          .address-block .label { font-size: 7pt; color: #D4A84B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2mm; }
          .address-block .name { font-size: 10pt; font-weight: 700; color: #0A1A3A; }
          .address-block .detail { font-size: 8pt; color: #64748B; line-height: 1.5; }
          /* Table */
          .table-section { margin-bottom: 6mm; }
          table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
          thead th {
            background: #0A1A3A; color: #fff; padding: 3mm 3mm;
            text-align: left; font-weight: 600; font-size: 7pt;
            text-transform: uppercase; letter-spacing: 0.05em;
          }
          thead th:first-child { border-radius: 2mm 0 0 0; }
          thead th:last-child { border-radius: 0 2mm 0 0; text-align: right; }
          thead th.qty, thead th.pu, thead th.total { text-align: right; }
          tbody td { padding: 3mm; border-bottom: 1px solid #F1F5F9; vertical-align: top; }
          tbody td.qty, tbody td.pu, tbody td.total { text-align: right; white-space: nowrap; }
          tbody td .desc { font-size: 7.5pt; color: #94A3B8; margin-top: 1mm; }
          tbody tr:last-child td { border-bottom: 2px solid #E2E8F0; }
          /* Totals */
          .totals { display: flex; justify-content: flex-end; margin-bottom: 6mm; }
          .totals-box { width: 55mm; }
          .totals-row { display: flex; justify-content: space-between; padding: 1.5mm 0; font-size: 8.5pt; color: #64748B; }
          .totals-row.total-ttc {
            background: linear-gradient(135deg, #0A1A3A, #1B2D5B);
            color: #fff; font-weight: 700; font-size: 11pt;
            padding: 3mm 4mm; border-radius: 2mm; margin-top: 2mm;
          }
          /* Conditions */
          .conditions { margin-bottom: 6mm; }
          .conditions h3 { font-size: 9pt; font-weight: 700; color: #0A1A3A; margin-bottom: 2mm; border-bottom: 2px solid #D4A84B; display: inline-block; padding-bottom: 1mm; }
          .conditions p { font-size: 8pt; color: #64748B; line-height: 1.6; white-space: pre-line; }
          /* Signature */
          .signature-section { display: flex; gap: 6mm; margin-top: 8mm; }
          .signature-box { flex: 1; border: 1px solid #E2E8F0; border-radius: 2mm; padding: 4mm; min-height: 25mm; }
          .signature-box .label { font-size: 7pt; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2mm; }
          .signature-box .sublabel { font-size: 7pt; color: #CBD5E1; }
          /* Footer */
          .footer {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: #F8FAFC; border-top: 1px solid #E2E8F0;
            padding: 3mm 20mm; display: flex; justify-content: space-between;
            font-size: 6.5pt; color: #94A3B8;
          }
          .footer-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2mm; background: linear-gradient(135deg, #0A1A3A 60%, #D4A84B 60%); }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page { margin: 0; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const clientName = prospectData.entreprise || `${prospectData.prenom} ${prospectData.nom}`.trim();

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <FileText className="w-5 h-5 text-brand-600" />
          <div>
            <h2 className="text-sm font-bold text-gray-900">Proposition commerciale</h2>
            <p className="text-xs text-gray-500">{clientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="btn-secondary text-sm"
          >
            {mode === 'edit' ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span className="hidden sm:inline">{mode === 'edit' ? 'Apercu' : 'Editer'}</span>
          </button>
          <button onClick={handlePrint} className="btn-primary text-sm">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer / PDF</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100">
        {mode === 'edit' ? (
          /* EDIT MODE */
          <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
            {/* Metadata */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-brand-600" />
                Informations du document
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Numero</label>
                  <input value={numero} onChange={(e) => setNumero(e.target.value)} className="input-field font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date d&apos;emission</label>
                  <input type="date" value={dateEmission} onChange={(e) => setDateEmission(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valide jusqu&apos;au</label>
                  <input type="date" value={dateValidite} onChange={(e) => setDateValidite(e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Objet de la proposition</label>
                <input value={objet} onChange={(e) => setObjet(e.target.value)} className="input-field" />
              </div>
            </div>

            {/* Destinataire */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                Destinataire
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{prospectData.entreprise || '—'}</p>
                <p className="text-sm text-gray-600">{prospectData.prenom} {prospectData.nom}</p>
                {prospectData.email && <p className="text-xs text-gray-500 mt-1">{prospectData.email}</p>}
                {prospectData.telephone && <p className="text-xs text-gray-500">{prospectData.telephone}</p>}
                {(prospectData.adresse || prospectData.adresse_chantier) && (
                  <p className="text-xs text-gray-500">{prospectData.adresse || prospectData.adresse_chantier}</p>
                )}
              </div>
            </div>

            {/* Lignes de prestation */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Euro className="w-4 h-4 text-brand-600" />
                  Prestations
                </h3>
                <button onClick={addLigne} className="btn-primary text-xs px-3 py-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {lignes.map((ligne, idx) => (
                  <div key={ligne.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 group">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold text-gray-400 mt-2 w-5 text-center">{idx + 1}</span>
                      <div className="flex-1 space-y-3">
                        <input
                          value={ligne.designation}
                          onChange={(e) => updateLigne(ligne.id, 'designation', e.target.value)}
                          placeholder="Designation (ex: Creation site web vitrine)"
                          className="input-field font-medium"
                        />
                        <textarea
                          value={ligne.description}
                          onChange={(e) => updateLigne(ligne.id, 'description', e.target.value)}
                          placeholder="Description detaillee (optionnel)"
                          rows={2}
                          className="input-field text-sm"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Quantite</label>
                            <input
                              type="number" min="1" step="1"
                              value={ligne.quantite}
                              onChange={(e) => updateLigne(ligne.id, 'quantite', parseInt(e.target.value) || 1)}
                              className="input-field text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Prix unitaire HT</label>
                            <input
                              type="number" min="0" step="0.01"
                              value={ligne.prix_unitaire || ''}
                              onChange={(e) => updateLigne(ligne.id, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                              className="input-field text-right"
                              placeholder="0,00"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Total HT</label>
                            <div className="input-field bg-gray-100 text-right font-semibold text-gray-700">
                              {formatCurrency(ligne.quantite * ligne.prix_unitaire)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLigne(ligne.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total HT</span>
                    <span className="font-medium">{formatCurrency(totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">TVA ({TVA_RATE}%)</span>
                    <span className="font-medium">{formatCurrency(totalTVA)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold bg-brand-50 text-brand-700 -mx-3 px-3 py-2 rounded-lg">
                    <span>Total TTC</span>
                    <span>{formatCurrency(totalTTC)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="card p-5">
              <button
                onClick={() => setShowConditions(!showConditions)}
                className="flex items-center justify-between w-full"
              >
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  Conditions & Notes
                </h3>
                {showConditions ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {showConditions && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Conditions de reglement</label>
                    <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={6} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Notes supplementaires</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field text-sm" placeholder="Notes internes ou remarques pour le client..." />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PREVIEW MODE - A4 render */
          <div className="flex justify-center py-6 px-4">
            <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
              <div ref={printRef}>
                <div className="page" style={{ width: '210mm', minHeight: '297mm', padding: '24mm 20mm 20mm', position: 'relative', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", color: '#1a1a2e' }}>
                  {/* Header band */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8mm', background: 'linear-gradient(135deg, #0A1A3A, #1B2D5B)' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(135deg, #D4A84B, #B8902E)', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }} />
                  </div>

                  {/* Logo + Doc info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8mm' }}>
                    <div>
                      <h1 style={{ fontSize: '22pt', fontWeight: 800, color: '#0A1A3A', letterSpacing: '-0.03em', margin: 0 }}>SOLAYIA</h1>
                      <p style={{ fontSize: '8pt', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase' as const, margin: 0 }}>Agence Web & Digitale</p>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ marginBottom: '2mm' }}>
                        <div style={{ fontSize: '7pt', color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Reference</div>
                        <div style={{ fontSize: '9pt', color: '#0A1A3A', fontWeight: 600 }}>{numero}</div>
                      </div>
                      <div style={{ marginBottom: '2mm' }}>
                        <div style={{ fontSize: '7pt', color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Date</div>
                        <div style={{ fontSize: '9pt', color: '#0A1A3A', fontWeight: 600 }}>{formatDate(dateEmission)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '7pt', color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Validite</div>
                        <div style={{ fontSize: '9pt', color: '#0A1A3A', fontWeight: 600 }}>{formatDate(dateValidite)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Title band */}
                  <div style={{ background: 'linear-gradient(135deg, #0A1A3A, #1B2D5B)', color: '#fff', padding: '5mm 6mm', borderRadius: '3mm', marginBottom: '6mm' }}>
                    <h2 style={{ fontSize: '13pt', fontWeight: 700, margin: '0 0 1mm' }}>PROPOSITION COMMERCIALE</h2>
                    <p style={{ fontSize: '8pt', color: '#CBD5E1', margin: 0 }}>{objet}</p>
                  </div>

                  {/* Addresses */}
                  <div style={{ display: 'flex', gap: '6mm', marginBottom: '6mm' }}>
                    <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '2mm', padding: '4mm' }}>
                      <div style={{ fontSize: '7pt', color: '#D4A84B', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '2mm' }}>Emetteur</div>
                      <div style={{ fontSize: '10pt', fontWeight: 700, color: '#0A1A3A' }}>Solayia</div>
                      <div style={{ fontSize: '8pt', color: '#64748B', lineHeight: 1.5 }}>
                        SASU au capital de 1 000 EUR<br />
                        Toulouse, France<br />
                        contact@solayia.fr
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '2mm', padding: '4mm' }}>
                      <div style={{ fontSize: '7pt', color: '#D4A84B', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '2mm' }}>Destinataire</div>
                      <div style={{ fontSize: '10pt', fontWeight: 700, color: '#0A1A3A' }}>{prospectData.entreprise || `${prospectData.prenom} ${prospectData.nom}`.trim()}</div>
                      <div style={{ fontSize: '8pt', color: '#64748B', lineHeight: 1.5 }}>
                        {prospectData.entreprise && `${prospectData.prenom} ${prospectData.nom}`.trim()}{prospectData.entreprise && <br />}
                        {prospectData.email && <>{prospectData.email}<br /></>}
                        {prospectData.telephone && <>{prospectData.telephone}<br /></>}
                        {(prospectData.adresse || prospectData.adresse_chantier) && <>{prospectData.adresse || prospectData.adresse_chantier}</>}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5pt', marginBottom: '6mm' }}>
                    <thead>
                      <tr>
                        <th style={{ background: '#0A1A3A', color: '#fff', padding: '3mm', textAlign: 'left' as const, fontWeight: 600, fontSize: '7pt', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderRadius: '2mm 0 0 0' }}>Designation</th>
                        <th style={{ background: '#0A1A3A', color: '#fff', padding: '3mm', textAlign: 'right' as const, fontWeight: 600, fontSize: '7pt', textTransform: 'uppercase' as const, width: '15mm' }}>Qte</th>
                        <th style={{ background: '#0A1A3A', color: '#fff', padding: '3mm', textAlign: 'right' as const, fontWeight: 600, fontSize: '7pt', textTransform: 'uppercase' as const, width: '25mm' }}>P.U. HT</th>
                        <th style={{ background: '#0A1A3A', color: '#fff', padding: '3mm', textAlign: 'right' as const, fontWeight: 600, fontSize: '7pt', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderRadius: '0 2mm 0 0', width: '25mm' }}>Total HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.map((ligne) => (
                        <tr key={ligne.id}>
                          <td style={{ padding: '3mm', borderBottom: '1px solid #F1F5F9', verticalAlign: 'top' as const }}>
                            <div style={{ fontWeight: 600 }}>{ligne.designation || '—'}</div>
                            {ligne.description && <div style={{ fontSize: '7.5pt', color: '#94A3B8', marginTop: '1mm' }}>{ligne.description}</div>}
                          </td>
                          <td style={{ padding: '3mm', borderBottom: '1px solid #F1F5F9', textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{ligne.quantite}</td>
                          <td style={{ padding: '3mm', borderBottom: '1px solid #F1F5F9', textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{formatCurrency(ligne.prix_unitaire)}</td>
                          <td style={{ padding: '3mm', borderBottom: '1px solid #F1F5F9', textAlign: 'right' as const, whiteSpace: 'nowrap' as const, fontWeight: 600 }}>{formatCurrency(ligne.quantite * ligne.prix_unitaire)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6mm' }}>
                    <div style={{ width: '55mm' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5mm 0', fontSize: '8.5pt', color: '#64748B' }}>
                        <span>Total HT</span>
                        <span>{formatCurrency(totalHT)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5mm 0', fontSize: '8.5pt', color: '#64748B' }}>
                        <span>TVA ({TVA_RATE}%)</span>
                        <span>{formatCurrency(totalTVA)}</span>
                      </div>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, #0A1A3A, #1B2D5B)',
                        color: '#fff', fontWeight: 700, fontSize: '11pt',
                        padding: '3mm 4mm', borderRadius: '2mm', marginTop: '2mm'
                      }}>
                        <span>Total TTC</span>
                        <span>{formatCurrency(totalTTC)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Conditions */}
                  {conditions && (
                    <div style={{ marginBottom: '6mm' }}>
                      <h3 style={{ fontSize: '9pt', fontWeight: 700, color: '#0A1A3A', marginBottom: '2mm', borderBottom: '2px solid #D4A84B', display: 'inline-block', paddingBottom: '1mm' }}>Conditions</h3>
                      <p style={{ fontSize: '8pt', color: '#64748B', lineHeight: 1.6, whiteSpace: 'pre-line' as const }}>{conditions}</p>
                    </div>
                  )}

                  {/* Signature zones */}
                  <div style={{ display: 'flex', gap: '6mm', marginTop: '8mm' }}>
                    <div style={{ flex: 1, border: '1px solid #E2E8F0', borderRadius: '2mm', padding: '4mm', minHeight: '25mm' }}>
                      <div style={{ fontSize: '7pt', color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '2mm' }}>Signature Solayia</div>
                      <div style={{ fontSize: '7pt', color: '#CBD5E1' }}>Bon pour accord</div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #E2E8F0', borderRadius: '2mm', padding: '4mm', minHeight: '25mm' }}>
                      <div style={{ fontSize: '7pt', color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '2mm' }}>Signature client</div>
                      <div style={{ fontSize: '7pt', color: '#CBD5E1' }}>Bon pour accord — Date et signature</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
                    background: '#F8FAFC', borderTop: '1px solid #E2E8F0',
                    padding: '3mm 20mm', display: 'flex', justifyContent: 'space-between',
                    fontSize: '6.5pt', color: '#94A3B8'
                  }}>
                    <span>Solayia SASU — contact@solayia.fr — solayia.fr</span>
                    <span>{numero} — Page 1/1</span>
                  </div>
                  <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: '2mm', background: 'linear-gradient(135deg, #0A1A3A 60%, #D4A84B 60%)' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
