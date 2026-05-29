'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Trash2, Building2, Mail, Phone, Euro, MapPin,
  User, Calendar, Clock, X, Plus, MessageSquare, PhoneCall, MailIcon,
  MessageCircle, Bell, AlertTriangle, Briefcase, FileText, ChevronDown,
  Flame, Snowflake, Sun, Users, Globe, ExternalLink, FolderOpen, Palette,
  Heart, Link2, Activity,
} from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import {
  PROSPECT_STATUTS, PROSPECT_URGENCES, TYPES_PRESTATION, TARIF_TYPES,
  PROSPECT_TEMPERATURES, TYPES_CONTACT, SOURCES_PROSPECT,
  PIPELINE_COMMERCIAL, PIPELINE_PROJET,
} from '@/lib/types';
import type { ProspectStatut, ProspectUrgence, ProspectTemperature, TypeContact, TarifType, PrestationLigneProspect } from '@/lib/types';
import {
  getProspect, getProfiles, updateProspect, deleteProspect,
  getProspectInteractions, createInteraction, deleteInteraction,
  getProspectDevis,
} from '../actions';
import ProspectCommunications from '@/components/prospects/ProspectCommunications';
import ProspectToolbox from '@/components/prospects/ProspectToolbox';
import ProposalEditor from '@/components/prospects/ProposalEditor';

const INTERACTION_TYPES = [
  { value: 'appel', label: 'Appel', icon: PhoneCall, color: 'text-green-600 bg-green-50' },
  { value: 'email', label: 'Email', icon: MailIcon, color: 'text-blue-600 bg-blue-50' },
  { value: 'rdv', label: 'RDV', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
  { value: 'note', label: 'Note / SMS', icon: MessageCircle, color: 'text-amber-600 bg-amber-50' },
];

const tempConfig: Record<string, { icon: typeof Flame; color: string; bg: string }> = {
  chaud: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
  tiede: { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  froid: { icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
};

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prospectId = params.id as string;

  const [prospect, setProspect] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [devis, setDevis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'prestation' | 'historique'>('info');
  const [showProposalEditor, setShowProposalEditor] = useState(false);

  // Form fields — Infos contact
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [source, setSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [statut, setStatut] = useState<ProspectStatut>('prospect');
  const [temperature, setTemperature] = useState<ProspectTemperature>('froid');
  const [typeContact, setTypeContact] = useState<TypeContact>('prospect');
  const [produitCible, setProduitCible] = useState('');
  const [notes, setNotes] = useState('');

  // Form fields — Prestations (multi-lignes)
  const [prestations, setPrestations] = useState<PrestationLigneProspect[]>([]);
  const [descriptionPrestation, setDescriptionPrestation] = useState('');
  const [adresseChantier, setAdresseChantier] = useState('');
  const [urgence, setUrgence] = useState<ProspectUrgence>('normale');
  const [datePremierContact, setDatePremierContact] = useState('');
  const [dateRelance, setDateRelance] = useState('');

  // Form fields — Enrichis CRM
  const [activite, setActivite] = useState('');
  const [adresse, setAdresse] = useState('');
  const [caEnK, setCaEnK] = useState('');
  const [canauxPrivilegies, setCanauxPrivilegies] = useState('');
  const [dernierCanal, setDernierCanal] = useState('');
  const [derniereCommunication, setDerniereCommunication] = useState('');
  const [driveDedie, setDriveDedie] = useState('');
  const [fichiersMedias, setFichiersMedias] = useState('');
  const [fonction, setFonction] = useState('');
  const [maquetteSolayia, setMaquetteSolayia] = useState('');
  const [pappers, setPappers] = useState('');
  const [prescripteurRef, setPrescripteurRef] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [traitsPersonnalite, setTraitsPersonnalite] = useState('');

  const loadData = useCallback(async () => {
    const [p, pr, inter, dev] = await Promise.all([
      getProspect(prospectId),
      getProfiles(),
      getProspectInteractions(prospectId),
      getProspectDevis(prospectId),
    ]);
    if (p) {
      setProspect(p);
      setNom(p.nom || '');
      setPrenom(p.prenom || '');
      setEntreprise(p.entreprise || '');
      setEmail(p.email || '');
      setTelephone(p.telephone || '');
      setSource(p.source || '');
      setAssignedTo(p.assigned_to || '');
      setStatut(p.statut || 'prospect');
      setTemperature(p.temperature || 'froid');
      setTypeContact(p.type_contact || 'prospect');
      setProduitCible(p.produit_cible || '');
      setNotes(p.notes || '');
      // Multi-prestations : depuis JSON ou reconstruction legacy
      if (p.prestations && Array.isArray(p.prestations) && p.prestations.length > 0) {
        setPrestations(p.prestations);
      } else if (p.type_prestation || p.tarif_propose) {
        setPrestations([{
          id: Math.random().toString(36).slice(2, 11),
          type_prestation: p.type_prestation || '',
          mode: p.tarif_type === 'mensuel' ? 'recurrent' : 'one_shot',
          montant: p.tarif_propose || 0,
          duree_mois: p.duree_mois || null,
          date_debut_estimee: null,
        }]);
      } else {
        setPrestations([]);
      }
      setDescriptionPrestation(p.description_prestation || '');
      setAdresseChantier(p.adresse_chantier || '');
      setUrgence(p.urgence || 'normale');
      setDatePremierContact(p.date_premier_contact || '');
      setDateRelance(p.date_relance || '');
      // Enrichis CRM
      setActivite(p.activite || '');
      setAdresse(p.adresse || '');
      setCaEnK(p.ca_en_k ? String(p.ca_en_k) : '');
      setCanauxPrivilegies(p.canaux_privilegies || '');
      setDernierCanal(p.dernier_canal || '');
      setDerniereCommunication(p.derniere_communication || '');
      setDriveDedie(p.drive_dedie || '');
      setFichiersMedias(p.fichiers_medias || '');
      setFonction(p.fonction || '');
      setMaquetteSolayia(p.maquette_solayia || '');
      setPappers(p.pappers || '');
      setPrescripteurRef(p.prescripteur_ref || '');
      setSiteWeb(p.site_web || '');
      setTraitsPersonnalite(p.traits_personnalite || '');
    }
    setProfiles(pr);
    setInteractions(inter);
    setDevis(dev);
    setLoading(false);
  }, [prospectId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set('nom', nom);
    formData.set('prenom', prenom);
    formData.set('entreprise', entreprise);
    formData.set('email', email);
    formData.set('telephone', telephone);
    formData.set('source', source);
    formData.set('assigned_to', assignedTo);
    formData.set('statut', statut);
    formData.set('temperature', temperature);
    formData.set('type_contact', typeContact);
    formData.set('produit_cible', produitCible);
    formData.set('notes', notes);
    formData.set('prestations', JSON.stringify(prestations));
    // Legacy fields depuis 1ère prestation (backward compat)
    const firstPresta = prestations[0];
    formData.set('type_prestation', firstPresta?.type_prestation || '');
    formData.set('tarif_propose', firstPresta ? String(firstPresta.montant) : '');
    formData.set('tarif_type', firstPresta?.mode === 'recurrent' ? 'mensuel' : 'one_shot');
    formData.set('duree_mois', firstPresta?.duree_mois ? String(firstPresta.duree_mois) : '');
    formData.set('description_prestation', descriptionPrestation);
    formData.set('adresse_chantier', adresseChantier);
    formData.set('urgence', urgence);
    formData.set('date_premier_contact', datePremierContact);
    formData.set('date_relance', dateRelance);
    // Champs enrichis CRM
    formData.set('activite', activite);
    formData.set('adresse', adresse);
    formData.set('ca_en_k', caEnK);
    formData.set('canaux_privilegies', canauxPrivilegies);
    formData.set('dernier_canal', dernierCanal);
    formData.set('derniere_communication', derniereCommunication);
    formData.set('drive_dedie', driveDedie);
    formData.set('fichiers_medias', fichiersMedias);
    formData.set('fonction', fonction);
    formData.set('maquette_solayia', maquetteSolayia);
    formData.set('pappers', pappers);
    formData.set('prescripteur_ref', prescripteurRef);
    formData.set('site_web', siteWeb);
    formData.set('traits_personnalite', traitsPersonnalite);

    const result = await updateProspect(prospectId, formData);
    setSaving(false);
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer le prospect "${entreprise || nom}" ? Cette action est irreversible.`)) return;
    const result = await deleteProspect(prospectId);
    if (!result.error) {
      router.push('/prospects');
    } else {
      alert(result.error);
    }
  };

  const handleCreateInteraction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInteractionLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('prospect_id', prospectId);
    const result = await createInteraction(formData);
    if (!result.error) {
      setShowInteractionForm(false);
      await loadData();
    }
    setInteractionLoading(false);
  };

  const handleDeleteInteraction = async (id: string) => {
    if (!confirm('Supprimer cette interaction ?')) return;
    await deleteInteraction(id, prospectId);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Prospect introuvable</p>
        <button onClick={() => router.push('/prospects')} className="btn-primary mt-4">Retour aux prospects</button>
      </div>
    );
  }

  const statutInfo = PROSPECT_STATUTS.find(s => s.value === statut);
  const urgenceInfo = PROSPECT_URGENCES.find(u => u.value === urgence);
  const tempInfo = tempConfig[temperature] || tempConfig.froid;
  const TempIcon = tempInfo.icon;
  const isRelancePassee = dateRelance && new Date(dateRelance) < new Date();
  const displayName = entreprise || `${prenom} ${nom}`.trim() || 'Sans nom';

  // Determiner la position dans le pipeline
  const allSteps = [...PIPELINE_COMMERCIAL.map(s => s.value), ...PIPELINE_PROJET.map(s => s.value)];
  const currentStepIdx = allSteps.indexOf(statut);
  const progressPct = currentStepIdx >= 0 ? Math.round(((currentStepIdx + 1) / allSteps.length) * 100) : 0;

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.push('/prospects')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shrink-0 border ${tempInfo.bg}`}>
            <TempIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${tempInfo.color}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{displayName}</h1>
              {typeContact === 'prescripteur' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 shrink-0">Prescripteur</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {entreprise && (prenom || nom) && <p className="text-sm text-gray-500">{prenom} {nom}</p>}
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statutInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                {statutInfo?.emoji} {statutInfo?.label || statut}
              </span>
              {urgence !== 'normale' && (
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${urgenceInfo?.color || ''}`}>
                  {urgenceInfo?.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setShowProposalEditor(true)} className="btn-secondary text-xs sm:text-sm" title="Creer une proposition">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Proposition</span>
          </button>
          <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Supprimer">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{saving ? 'Enregistrement...' : saved ? 'Enregistre !' : 'Enregistrer'}</span>
            <span className="sm:hidden">{saving ? '...' : saved ? '✓' : 'Sauver'}</span>
          </button>
        </div>
      </div>

      {/* Barre de progression pipeline */}
      {statut !== 'perdu' && currentStepIdx >= 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Progression</span>
            <span className="text-xs font-bold text-brand-600">{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400">Prospect</span>
            <span className="text-[10px] text-gray-400">Suivi</span>
          </div>
        </div>
      )}

      {/* Communications automatiques — visible a toutes les etapes */}
      {statut !== 'perdu' && (
        <ProspectCommunications
          prospect={{
            nom, prenom, entreprise, email, telephone,
            temperature, source,
            type_prestation: prestations[0]?.type_prestation || null,
            produit_cible: produitCible,
            notes: notes || null,
            description_prestation: descriptionPrestation || null,
            tarif_propose: prestations[0]?.montant || null,
            adresse_chantier: adresseChantier || null,
          }}
          statut={statut}
        />
      )}

      {/* Alerte relance */}
      {isRelancePassee && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm">
          <Bell className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-semibold">Relance en retard !</span> Prevue le {formatDate(dateRelance)}
          </div>
        </div>
      )}

      {/* Tabs navigation mobile */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 sm:hidden">
        {[
          { key: 'info' as const, label: 'Contact', icon: User },
          { key: 'prestation' as const, label: 'Prestation', icon: Briefcase },
          { key: 'historique' as const, label: 'Historique', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
              activeSection === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1 : Infos contact + statut + temperature */}
      <div className={`card p-5 sm:p-6 ${activeSection !== 'info' ? 'hidden sm:block' : ''}`}>
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          Informations contact
        </h2>
        <div className="space-y-4">
          {/* Type contact + Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type de contact</label>
              <select value={typeContact} onChange={(e) => setTypeContact(e.target.value as TypeContact)} className="input-field">
                {TYPES_CONTACT.map((t) => (<option key={t.value} value={t.value}>{t.emoji} {t.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Temperature</label>
              <div className="flex gap-2">
                {PROSPECT_TEMPERATURES.map((t) => {
                  const isActive = temperature === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTemperature(t.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        isActive
                          ? t.value === 'chaud' ? 'border-red-400 bg-red-50 text-red-700'
                            : t.value === 'tiede' ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Entreprise</label>
            <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</label>
              <input value={telephone} onChange={(e) => setTelephone(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Étape pipeline</label>
              <select value={statut} onChange={(e) => setStatut(e.target.value as ProspectStatut)} className="input-field">
                <optgroup label="Pipeline commercial">
                  {PIPELINE_COMMERCIAL.map((s) => (<option key={s.value} value={s.value}>{s.emoji} {s.label}</option>))}
                </optgroup>
                <optgroup label="Gestion projet">
                  {PIPELINE_PROJET.map((s) => (<option key={s.value} value={s.value}>{s.emoji} {s.label}</option>))}
                </optgroup>
                <option value="perdu">❌ Perdu</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="input-field">
                <option value="">—</option>
                {SOURCES_PROSPECT.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assigné à</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input-field">
                <option value="">—</option>
                {profiles.map((pr) => (<option key={pr.id} value={pr.id}>{pr.full_name}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Produit cible</label>
            <input value={produitCible} onChange={(e) => setProduitCible(e.target.value)} className="input-field" placeholder="Ex: Solayia, Installe ta Clim..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes internes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field" placeholder="Notes libres, remarques..." />
          </div>
        </div>
      </div>

      {/* Section 1b : Fiche CRM enrichie */}
      <div className={`card p-5 sm:p-6 ${activeSection !== 'info' ? 'hidden sm:block' : ''}`}>
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-600" />
          Fiche CRM enrichie
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Activité / Métier</label>
              <input value={activite} onChange={(e) => setActivite(e.target.value)} className="input-field" placeholder="Ex: Climatisation, Boulangerie..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fonction / Poste</label>
              <input value={fonction} onChange={(e) => setFonction(e.target.value)} className="input-field" placeholder="Ex: Dirigeant, DG, Fondateur..." />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Adresse</label>
              <input value={adresse} onChange={(e) => setAdresse(e.target.value)} className="input-field" placeholder="Adresse du prospect" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Euro className="w-3 h-3" /> CA (en K€)</label>
              <input type="number" value={caEnK} onChange={(e) => setCaEnK(e.target.value)} className="input-field" placeholder="Ex: 400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Canaux privilégiés</label>
              <input value={canauxPrivilegies} onChange={(e) => setCanauxPrivilegies(e.target.value)} className="input-field" placeholder="Email, SMS, Physique, Visio..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dernier canal / Date</label>
              <div className="flex gap-2">
                <input value={dernierCanal} onChange={(e) => setDernierCanal(e.target.value)} className="input-field flex-1" placeholder="Email, SMS..." />
                <input value={derniereCommunication} onChange={(e) => setDerniereCommunication(e.target.value)} className="input-field flex-1" placeholder="20 mai 2026" />
              </div>
            </div>
          </div>
          {/* Liens externes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Site web</label>
              <div className="flex gap-1">
                <input value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} className="input-field flex-1" placeholder="https://..." />
                {siteWeb && <a href={siteWeb} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg shrink-0"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Palette className="w-3 h-3" /> Maquette Solayia</label>
              <div className="flex gap-1">
                <input value={maquetteSolayia} onChange={(e) => setMaquetteSolayia(e.target.value)} className="input-field flex-1" placeholder="https://solayia.github.io/..." />
                {maquetteSolayia && <a href={maquetteSolayia} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg shrink-0"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Link2 className="w-3 h-3" /> Pappers</label>
              <div className="flex gap-1">
                <input value={pappers} onChange={(e) => setPappers(e.target.value)} className="input-field flex-1" placeholder="https://www.pappers.fr/..." />
                {pappers && <a href={pappers} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg shrink-0"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><FolderOpen className="w-3 h-3" /> Drive dédié</label>
              <div className="flex gap-1">
                <input value={driveDedie} onChange={(e) => setDriveDedie(e.target.value)} className="input-field flex-1" placeholder="https://drive.google.com/..." />
                {driveDedie && <a href={driveDedie} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg shrink-0"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prescripteur(s) référent(s)</label>
            <input value={prescripteurRef} onChange={(e) => setPrescripteurRef(e.target.value)} className="input-field" placeholder="Nom du prescripteur" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><Heart className="w-3 h-3" /> Traits de personnalité</label>
            <textarea value={traitsPersonnalite} onChange={(e) => setTraitsPersonnalite(e.target.value)} rows={2} className="input-field" placeholder="Douce, exigeante, sympathique..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fichiers & Médias</label>
            <input value={fichiersMedias} onChange={(e) => setFichiersMedias(e.target.value)} className="input-field" placeholder="Liens vers fichiers, présentations..." />
          </div>
        </div>
      </div>

      {/* Section 2 : Prestations estimées (multi-lignes) */}
      <div className={`card p-5 sm:p-6 ${activeSection !== 'prestation' ? 'hidden sm:block' : ''}`}>
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand-600" />
          Prestations estimées
        </h2>
        <div className="space-y-3">
          {prestations.map((pr, idx) => (
            <div key={pr.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Prestation #{idx + 1}</span>
                <button type="button" onClick={() => setPrestations(prev => prev.filter(x => x.id !== pr.id))} className="p-1 text-gray-400 hover:text-red-500 rounded"><X className="w-4 h-4" /></button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type de prestation</label>
                <select value={pr.type_prestation} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, type_prestation: e.target.value } : x))} className="input-field">
                  <option value="">—</option>
                  {TYPES_PRESTATION.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Type de tarif</label>
                <div className="flex gap-2">
                  {TARIF_TYPES.map((t) => (
                    <button key={t.value} type="button" onClick={() => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, mode: t.value === 'mensuel' ? 'recurrent' as const : 'one_shot' as const } : x))} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${(pr.mode === 'recurrent' ? 'mensuel' : 'one_shot') === t.value ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Montant estimé {pr.mode === 'recurrent' ? '(€/mois)' : '(€)'}</label>
                  <input type="number" step="0.01" value={pr.montant || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, montant: Number(e.target.value) || 0 } : x))} className="input-field" placeholder={pr.mode === 'recurrent' ? '490.00' : '1490.00'} />
                </div>
                {pr.mode === 'recurrent' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Durée (mois)</label>
                    <input type="number" value={pr.duree_mois || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, duree_mois: Number(e.target.value) || null } : x))} className="input-field" placeholder="Vide = indéfinie" />
                  </div>
                )}
              </div>
              {pr.mode === 'recurrent' && (
                <div className="sm:w-1/2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date début estimée</label>
                  <input type="date" value={pr.date_debut_estimee || ''} onChange={(e) => setPrestations(prev => prev.map(x => x.id === pr.id ? { ...x, date_debut_estimee: e.target.value || null } : x))} className="input-field" />
                </div>
              )}
              {pr.montant > 0 && (
                <div className="text-xs font-medium text-brand-700 pt-1 border-t border-gray-200">
                  {pr.mode === 'recurrent' && pr.duree_mois ? `📊 ${pr.montant.toLocaleString('fr-FR')} €/mois × ${pr.duree_mois} mois = ${(pr.montant * pr.duree_mois).toLocaleString('fr-FR')} €` : pr.mode === 'recurrent' ? `📊 ${pr.montant.toLocaleString('fr-FR')} €/mois (récurrent)` : `📊 ${pr.montant.toLocaleString('fr-FR')} € (one-shot)`}
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={() => setPrestations(prev => [...prev, { id: Math.random().toString(36).slice(2, 11), type_prestation: '', mode: 'one_shot', montant: 0, duree_mois: null, date_debut_estimee: null }])} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Ajouter une prestation</span>
          </button>

          {prestations.length > 0 && prestations.some(pr => pr.montant > 0) && (
            <div className="p-3 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center gap-2 mb-1">
                <Euro className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-brand-800">Total estimé</span>
              </div>
              <div className="text-lg font-bold text-brand-700">
                {prestations.reduce((sum, pr) => sum + (pr.mode === 'recurrent' ? pr.montant * (pr.duree_mois || 12) : pr.montant), 0).toLocaleString('fr-FR')} €
              </div>
              <div className="text-[11px] text-brand-600 space-y-0.5 mt-1">
                {prestations.some(pr => pr.mode === 'one_shot' && pr.montant > 0) && (
                  <p>💵 {prestations.filter(pr => pr.mode === 'one_shot').reduce((s, pr) => s + pr.montant, 0).toLocaleString('fr-FR')} € en one-shot</p>
                )}
                {prestations.some(pr => pr.mode === 'recurrent' && pr.montant > 0) && (
                  <p>🔄 {prestations.filter(pr => pr.mode === 'recurrent').reduce((s, pr) => s + pr.montant, 0).toLocaleString('fr-FR')} €/mois en récurrent</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-5 pt-5 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description de la prestation</label>
            <textarea value={descriptionPrestation} onChange={(e) => setDescriptionPrestation(e.target.value)} rows={3} className="input-field" placeholder="Détail de la prestation souhaitée ou proposée..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Adresse du chantier / intervention
            </label>
            <input value={adresseChantier} onChange={(e) => setAdresseChantier(e.target.value)} className="input-field" placeholder="Adresse complète" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Urgence
              </label>
              <select value={urgence} onChange={(e) => setUrgence(e.target.value as ProspectUrgence)} className="input-field">
                {PROSPECT_URGENCES.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Premier contact
              </label>
              <input type="date" value={datePremierContact} onChange={(e) => setDatePremierContact(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Bell className="w-3 h-3" /> Date de relance
              </label>
              <input type="date" value={dateRelance} onChange={(e) => setDateRelance(e.target.value)} className={`input-field ${isRelancePassee ? 'border-amber-400 bg-amber-50' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 : Historique des echanges */}
      <div className={`card p-5 sm:p-6 ${activeSection !== 'historique' ? 'hidden sm:block' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            Historique des echanges ({interactions.length})
          </h2>
          <button onClick={() => setShowInteractionForm(true)} className="btn-primary text-xs px-3 py-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>

        {interactions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400 mb-3">Aucun echange enregistre</p>
            <button onClick={() => setShowInteractionForm(true)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Ajouter le premier echange
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {interactions.map((inter) => {
              const typeConfig = INTERACTION_TYPES.find(t => t.value === inter.type);
              const TypeIcon = typeConfig?.icon || MessageSquare;
              return (
                <div key={inter.id} className="flex gap-3 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeConfig?.color || 'text-gray-500 bg-gray-50'}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-900">{typeConfig?.label || inter.type}</span>
                          <span className="text-[11px] text-gray-400">{formatDate(inter.date_interaction)}</span>
                          {inter.created_by_profile && (
                            <span className="text-[11px] text-gray-400">par {inter.created_by_profile.full_name}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line">{inter.contenu}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteInteraction(inter.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                        title="Supprimer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 4 : Devis lies */}
      {devis.length > 0 && (
        <div className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            Devis ({devis.length})
          </h2>
          <div className="space-y-2">
            {devis.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-brand-200 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-mono">{d.numero}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(d.montant_ttc)} TTC</span>
                  <span className="text-xs text-gray-400">{formatDate(d.date_emission)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5 : Toolbox — Scoring, Checklist, Relance, Conversion */}
      <ProspectToolbox
        prospect={{
          ...prospect,
          statut,
          temperature,
          email,
          telephone,
          type_prestation: prestations[0]?.type_prestation || null,
          tarif_propose: prestations[0]?.montant || null,
          prospect_checklist: prospect.prospect_checklist || null,
          motif_perte: prospect.motif_perte || null,
          date_premier_contact: datePremierContact || null,
          prestations: prestations.length > 0 ? prestations : null,
        }}
        interactions={interactions}
        onUpdate={loadData}
      />

      {/* Meta */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Cree le {formatDate(prospect.created_at)}
        {prospect.updated_at && prospect.updated_at !== prospect.created_at && (
          <> · Modifie le {formatDate(prospect.updated_at)}</>
        )}
      </p>

      {/* Editeur proposition A4 */}
      {showProposalEditor && (
        <ProposalEditor
          prospectData={{
            nom, prenom, entreprise, email, telephone,
            adresse: adresse || undefined,
            type_prestation: prestations[0]?.type_prestation || undefined,
            description_prestation: descriptionPrestation || undefined,
            tarif_propose: prestations[0]?.montant || undefined,
            adresse_chantier: adresseChantier || undefined,
          }}
          onClose={() => setShowProposalEditor(false)}
        />
      )}

      {/* Modal ajout interaction */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowInteractionForm(false)}>
          <div className="card p-5 sm:p-6 w-full sm:max-w-lg rounded-b-none sm:rounded-b-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouvel echange</h3>
              <button onClick={() => setShowInteractionForm(false)} className="p-2 text-gray-400 hover:text-gray-600 -mr-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateInteraction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d&apos;echange</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INTERACTION_TYPES.map((t) => (
                    <label key={t.value} className="cursor-pointer">
                      <input type="radio" name="type" value={t.value} required className="peer sr-only" defaultChecked={t.value === 'appel'} />
                      <div className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 border-gray-100 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all hover:border-gray-200`}>
                        <t.icon className="w-5 h-5 text-gray-500 peer-checked:text-brand-600" />
                        <span className="text-xs font-medium text-gray-600">{t.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                <textarea name="contenu" required rows={4} className="input-field" placeholder="Resumez l'echange : ce qui a ete dit, decide, la prochaine etape..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input name="date_interaction" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} className="input-field" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowInteractionForm(false)} className="btn-secondary flex-1 sm:flex-none">Annuler</button>
                <button type="submit" disabled={interactionLoading} className="btn-primary flex-1 sm:flex-none">
                  {interactionLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
