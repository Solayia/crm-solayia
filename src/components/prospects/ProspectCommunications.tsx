'use client';

import { useState, useRef } from 'react';
import {
  Mail, FileImage, Monitor, X, Copy, ExternalLink, Check, Send,
  RotateCcw, FileText, Heart, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  generateEmailTexte, generateEmailFlyer, generateEmailMaquette,
  generateEmailRelance, generateEmailProposition, generateEmailRemerciement,
} from '@/lib/email-templates';

interface ProspectData {
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
  telephone: string;
  temperature: string;
  source: string;
  type_prestation: string | null;
  produit_cible: string;
  notes: string | null;
  description_prestation?: string | null;
  tarif_propose?: number | null;
  adresse_chantier?: string | null;
}

type ModalType = 'texte' | 'flyer' | 'maquette' | 'relance' | 'proposition' | 'remerciement' | null;

interface ProspectCommunicationsProps {
  prospect: ProspectData;
  statut?: string;
}

export default function ProspectCommunications({ prospect, statut }: ProspectCommunicationsProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyHtml = async () => {
    if (previewRef.current) {
      const html = previewRef.current.innerHTML;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([html], { type: 'text/plain' }),
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        await handleCopy(html);
      }
    }
  };

  const openMailto = (subject: string, body: string) => {
    const to = prospect.email || '';
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
  };

  // All 6 email types organized by category
  const prospectionCards = [
    {
      type: 'texte' as ModalType,
      icon: Mail,
      title: 'Email de prospection',
      description: 'Email texte personnalise adapte au secteur',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      hoverColor: 'hover:border-blue-400 hover:shadow-blue-100',
    },
    {
      type: 'flyer' as ModalType,
      icon: FileImage,
      title: 'Email + Flyer',
      description: 'Email avec flyer visuel personnalise',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      hoverColor: 'hover:border-amber-400 hover:shadow-amber-100',
    },
    {
      type: 'maquette' as ModalType,
      icon: Monitor,
      title: 'Email + Pre-maquette',
      description: 'Apercu de site web personnalise',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      hoverColor: 'hover:border-purple-400 hover:shadow-purple-100',
    },
  ];

  const suiviCards = [
    {
      type: 'relance' as ModalType,
      icon: RotateCcw,
      title: 'Email de relance',
      description: 'Suivi apres premier contact',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      hoverColor: 'hover:border-orange-400 hover:shadow-orange-100',
    },
    {
      type: 'proposition' as ModalType,
      icon: FileText,
      title: 'Email proposition',
      description: 'Envoi de proposition commerciale',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      hoverColor: 'hover:border-emerald-400 hover:shadow-emerald-100',
    },
    {
      type: 'remerciement' as ModalType,
      icon: Heart,
      title: 'Email remerciement',
      description: 'Merci post-rendez-vous',
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      hoverColor: 'hover:border-pink-400 hover:shadow-pink-100',
    },
  ];

  // Smart suggestion: highlight the most relevant email based on status
  const getSuggestedType = (): ModalType => {
    switch (statut) {
      case 'prospect': return 'texte';
      case 'prise_contact': return 'texte';
      case 'r1': return 'remerciement';
      case 'r2': return 'remerciement';
      case 'proposition': return 'proposition';
      default: return 'relance';
    }
  };

  const suggestedType = getSuggestedType();

  const getContent = () => {
    const extendedProspect = {
      ...prospect,
      description_prestation: prospect.description_prestation || null,
      tarif_propose: prospect.tarif_propose || null,
      adresse_chantier: prospect.adresse_chantier || null,
    };
    switch (activeModal) {
      case 'texte': return generateEmailTexte(prospect);
      case 'flyer': return generateEmailFlyer(prospect);
      case 'maquette': return generateEmailMaquette(prospect);
      case 'relance': return generateEmailRelance(prospect);
      case 'proposition': return generateEmailProposition(extendedProspect);
      case 'remerciement': return generateEmailRemerciement(prospect);
      default: return null;
    }
  };

  const content = activeModal ? getContent() : null;

  return (
    <>
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-600" />
            Communications automatiques
          </h2>
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-[11px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Voir tous les modeles
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Reduire
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Prospection emails */}
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Prospection</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prospectionCards.map((card) => (
              <button
                key={card.type}
                onClick={() => { setCopied(false); setActiveModal(card.type); }}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${card.color} ${card.hoverColor} hover:shadow-md group relative`}
              >
                {card.type === suggestedType && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-600 text-white">Suggere</span>
                )}
                <card.icon className="w-6 h-6 mb-2 transition-transform group-hover:scale-110" />
                <h3 className="text-sm font-semibold mb-1">{card.title}</h3>
                <p className="text-[11px] opacity-75 leading-relaxed">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Suivi emails - always visible or on toggle */}
        {showAll && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suivi & Conversion</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suiviCards.map((card) => (
                <button
                  key={card.type}
                  onClick={() => { setCopied(false); setActiveModal(card.type); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${card.color} ${card.hoverColor} hover:shadow-md group relative`}
                >
                  {card.type === suggestedType && (
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-600 text-white">Suggere</span>
                  )}
                  <card.icon className="w-6 h-6 mb-2 transition-transform group-hover:scale-110" />
                  <h3 className="text-sm font-semibold mb-1">{card.title}</h3>
                  <p className="text-[11px] opacity-75 leading-relaxed">{card.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick access to suivi when collapsed */}
        {!showAll && (
          <div className="flex items-center gap-2 mt-1">
            {suiviCards.map((card) => (
              <button
                key={card.type}
                onClick={() => { setCopied(false); setActiveModal(card.type); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${card.color} hover:shadow-sm`}
              >
                <card.icon className="w-3.5 h-3.5" />
                {card.title.replace('Email ', '')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de preview */}
      {activeModal && content && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeModal === 'texte' && '📧 Email de prospection'}
                  {activeModal === 'flyer' && '🎨 Email + Flyer personnalise'}
                  {activeModal === 'maquette' && '🖥️ Email + Pre-maquette site'}
                  {activeModal === 'relance' && '🔄 Email de relance'}
                  {activeModal === 'proposition' && '📄 Email proposition commerciale'}
                  {activeModal === 'remerciement' && '💝 Email de remerciement'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pour : {prospect.entreprise || `${prospect.prenom} ${prospect.nom}`.trim() || 'Prospect'}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Sujet email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Objet de l&apos;email</label>
                <div className="bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 border border-gray-200">
                  {content.subject}
                </div>
              </div>

              {/* Corps email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Corps de l&apos;email</label>
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 whitespace-pre-line border border-gray-200 leading-relaxed max-h-60 overflow-y-auto">
                  {content.body}
                </div>
              </div>

              {/* Visuel (flyer ou maquette) */}
              {'flyerHtml' in content && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Flyer personnalise</label>
                  <div ref={previewRef} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm" dangerouslySetInnerHTML={{ __html: (content as { flyerHtml: string }).flyerHtml }} />
                </div>
              )}
              {'mockupHtml' in content && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pre-maquette du site</label>
                  <div ref={previewRef} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm" dangerouslySetInnerHTML={{ __html: (content as { mockupHtml: string }).mockupHtml }} />
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Copier le texte */}
                <button
                  onClick={() => {
                    const textToCopy = `Objet: ${content.subject}\n\n${content.body}`;
                    handleCopy(textToCopy);
                  }}
                  className="btn-secondary flex-1 justify-center"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copie !' : 'Copier le texte'}
                </button>

                {/* Copier le visuel (flyer/maquette) */}
                {(activeModal === 'flyer' || activeModal === 'maquette') && (
                  <button onClick={handleCopyHtml} className="btn-secondary flex-1 justify-center">
                    <FileImage className="w-4 h-4" />
                    Copier le visuel
                  </button>
                )}

                {/* Ouvrir dans le mail */}
                <button
                  onClick={() => openMailto(content.subject, content.body)}
                  className="btn-primary flex-1 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir dans ma boite mail
                </button>
              </div>
              {!prospect.email && (
                <p className="text-[11px] text-amber-600 mt-2 text-center">
                  ⚠️ Aucun email renseigne pour ce prospect — pensez a le completer
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
