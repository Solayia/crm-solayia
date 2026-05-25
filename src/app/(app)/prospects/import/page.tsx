'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';

type ImportStep = 'upload' | 'mapping' | 'preview' | 'done';

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | null) => {
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      setStep('mapping');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/prospects" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Import de prospects</h2>
          <p className="text-xs text-gray-500">Importez des prospects depuis un fichier CSV</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[
          { key: 'upload', label: '1. Fichier' },
          { key: 'mapping', label: '2. Mapping' },
          { key: 'preview', label: '3. Apercu' },
          { key: 'done', label: '4. Termine' },
        ].map((s, idx) => (
          <div key={s.key} className="flex items-center gap-2">
            {idx > 0 && <div className="w-8 h-px bg-gray-200" />}
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              step === s.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          className={`card p-12 text-center border-2 border-dashed transition-colors ${
            dragOver ? 'border-brand-400 bg-brand-50' : 'border-gray-200'
          }`}
        >
          <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">Glissez votre fichier CSV ici</p>
          <p className="text-xs text-gray-400 mb-4">ou cliquez pour parcourir</p>
          <label className="btn-secondary cursor-pointer inline-flex">
            <Upload className="w-4 h-4" />
            Choisir un fichier
            <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </label>
          <p className="text-[11px] text-gray-400 mt-3">
            Colonnes attendues : nom, prenom, entreprise, email, telephone, source
          </p>
        </div>
      )}

      {/* Step: Mapping */}
      {step === 'mapping' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900">{fileName}</span>
              </div>
              <button onClick={() => { setStep('upload'); setFileName(''); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Associez les colonnes du CSV aux champs du CRM :</p>

            <div className="space-y-3">
              {['Nom', 'Prenom', 'Entreprise', 'Email', 'Telephone', 'Source'].map((field) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-28">{field}</span>
                  <span className="text-gray-300">→</span>
                  <select className="input-field flex-1">
                    <option value="">— Selectionner la colonne —</option>
                    <option value={field.toLowerCase()}>{field.toLowerCase()}</option>
                    <option value="col_a">Colonne A</option>
                    <option value="col_b">Colonne B</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setStep('upload')} className="btn-secondary">Retour</button>
            <button onClick={() => setStep('preview')} className="btn-primary">Continuer</button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recapitulatif</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">25</p>
                <p className="text-xs text-gray-500">Total lignes</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xl font-bold text-green-600">20</p>
                <p className="text-xs text-gray-500">Nouveaux</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-xl font-bold text-amber-600">3</p>
                <p className="text-xs text-gray-500">Doublons</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-400">2</p>
                <p className="text-xs text-gray-500">Sans email</p>
              </div>
            </div>

            {/* Doublons */}
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-800">3 doublons detectes</span>
              </div>
              <p className="text-xs text-amber-600 mb-3">
                Ces emails existent deja dans la base. Que souhaitez-vous faire ?
              </p>
              <div className="space-y-2">
                {[
                  { value: 'skip', label: 'Ignorer les doublons', desc: 'Les lignes en doublon ne seront pas importees' },
                  { value: 'create', label: 'Creer quand meme', desc: 'Creer de nouveaux prospects meme si le mail existe' },
                  { value: 'update', label: 'Mettre a jour', desc: 'Remplacer les champs non-vides sur les existants' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 p-2 rounded-lg hover:bg-amber-100/50 cursor-pointer">
                    <input type="radio" name="doublon_action" value={opt.value} className="mt-0.5" defaultChecked={opt.value === 'skip'} />
                    <div>
                      <p className="text-sm font-medium text-amber-900">{opt.label}</p>
                      <p className="text-xs text-amber-600">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setStep('mapping')} className="btn-secondary">Retour</button>
            <button onClick={() => setStep('done')} className="btn-primary">Importer {20} prospects</button>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="card p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Import termine !</h3>
          <p className="text-sm text-gray-500 mb-6">20 prospects ont ete importes avec succes.</p>
          <Link href="/prospects" className="btn-primary">
            Voir les prospects
          </Link>
        </div>
      )}
    </div>
  );
}
