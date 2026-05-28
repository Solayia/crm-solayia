// Generateur automatique d'emails de prospection Solayia
// Adapte au prospect selon : entreprise, secteur, temperature, source

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
}

// --- Helpers ---

function getDisplayName(p: ProspectData): string {
  if (p.prenom && p.nom) return `${p.prenom} ${p.nom}`;
  if (p.nom) return p.nom;
  if (p.prenom) return p.prenom;
  return 'Madame, Monsieur';
}

function getCivilite(p: ProspectData): string {
  if (p.prenom && p.nom) return `${p.prenom}`;
  return 'Madame, Monsieur';
}

function getSecteur(p: ProspectData): string {
  const e = (p.entreprise || '').toLowerCase();
  const n = (p.notes || '').toLowerCase();
  if (e.includes('restaurant') || e.includes('bistrot') || e.includes('brasserie') || e.includes('bar') || e.includes('cafe') || e.includes('rita') || e.includes('gougnotte') || e.includes('chimere') || e.includes('italien') || e.includes('hayuco') || e.includes('mayumi') || e.includes('trio gourmand') || e.includes('ytaing') || e.includes('estaminot') || e.includes('pecheur') || e.includes('tinto')) return 'restauration';
  if (e.includes('boulang') || e.includes('fournil') || e.includes('panivore') || e.includes('patisser')) return 'boulangerie';
  if (e.includes('boucherie') || e.includes('fontaines')) return 'commerce_alimentaire';
  if (e.includes('bati') || e.includes('construct') || e.includes('compagnon') || e.includes('couvreur') || e.includes('stylobat') || e.includes('canalisateur') || n.includes('btp')) return 'btp';
  if (e.includes('immo') || e.includes('sci')) return 'immobilier';
  if (e.includes('mutuelle') || e.includes('assur') || e.includes('abeille')) return 'assurance';
  if (e.includes('club') || e.includes('sport') || e.includes('universite')) return 'association';
  if (e.includes('somafi') || e.includes('kesame')) return 'entreprise_services';
  return 'general';
}

function getAccrocheSecteur(secteur: string): string {
  const accroches: Record<string, string> = {
    restauration: 'Dans la restauration, vos clients vous cherchent sur Google avant de pousser la porte. Un site web attractif et bien reference, c\'est plus de couverts remplis chaque semaine.',
    boulangerie: 'Vos clients du quartier vous connaissent, mais ceux qui demenagent ou passent dans le coin vous cherchent en ligne. Un site vitrine + Google Business optimise, c\'est la recette pour attirer de nouveaux fideles.',
    commerce_alimentaire: 'Les commerces de bouche qui ont une presence en ligne attirent en moyenne 40% de clients en plus. Un site bien reference localement fait toute la difference.',
    btp: 'Dans le BTP, la credibilite passe par le digital. Un site professionnel avec vos realisations et avis clients, c\'est le meilleur commercial qui travaille 24h/24.',
    immobilier: 'Dans l\'immobilier, la premiere visite se fait en ligne. Un site performant avec vos biens, vos avis clients et un bon referencement local, c\'est la cle pour capter plus de mandats.',
    assurance: 'Vos prospects comparent en ligne avant de choisir leur conseiller. Un site clair, rassurant et bien reference vous positionne comme la reference locale.',
    association: 'Une presence digitale forte, c\'est plus de visibilite, plus d\'adhesions et une communaute plus engagee autour de votre structure.',
    entreprise_services: 'Vos concurrents sont deja en ligne. Un site web professionnel et une strategie digitale adaptee, c\'est ce qui fait la difference pour capter de nouveaux clients.',
    general: 'Aujourd\'hui, 80% des consommateurs recherchent en ligne avant d\'acheter. Sans presence digitale optimisee, vous passez a cote de clients qui sont deja prets a acheter.',
  };
  return accroches[secteur] || accroches.general;
}

function getServicesSuggeres(secteur: string): string[] {
  const base = ['Creation de site web vitrine', 'Referencement local (SEO)', 'Fiche Google Business optimisee'];
  const extras: Record<string, string[]> = {
    restauration: ['Menu en ligne & reservation', 'Gestion des avis Google', 'Photos pro de vos plats'],
    boulangerie: ['Commande en ligne', 'Galerie photos produits', 'Fidelisation digitale'],
    commerce_alimentaire: ['Click & Collect', 'Vitrine produits en ligne', 'Programme fidelite digital'],
    btp: ['Portfolio de realisations', 'Demande de devis en ligne', 'Temoignages clients'],
    immobilier: ['Catalogue de biens en ligne', 'Estimation en ligne', 'Capture de leads vendeurs'],
    assurance: ['Simulateur en ligne', 'Prise de RDV automatisee', 'Espace client'],
    association: ['Espace adhesion en ligne', 'Agenda des evenements', 'Newsletter & communication'],
    entreprise_services: ['Presentation des services', 'Demande de devis en ligne', 'Temoignages & cas clients'],
    general: ['Presentation de vos services', 'Formulaire de contact optimise', 'Strategie de contenu'],
  };
  return [...base, ...(extras[secteur] || extras.general)];
}

// =============================================
// 1. EMAIL TEXTE — Prospection pure
// =============================================

export function generateEmailTexte(prospect: ProspectData): { subject: string; body: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || '';
  const secteur = getSecteur(prospect);
  const accroche = getAccrocheSecteur(secteur);
  const services = getServicesSuggeres(secteur);

  const subjectVariants = entreprise
    ? [
        `${entreprise} — Votre visibilite en ligne merite mieux`,
        `Une idee pour ${entreprise}`,
        `${entreprise} + Solayia = plus de clients`,
      ]
    : [
        `Boostez votre activite grace au digital`,
        `Votre presence en ligne, on s'en occupe`,
        `Plus de clients, moins d'efforts — decouvrez comment`,
      ];

  const subject = subjectVariants[Math.floor(Math.random() * subjectVariants.length)];

  const body = `Bonjour ${name},

Je me permets de vous contacter car ${entreprise ? `j'ai decouvert ${entreprise}` : 'votre activite a attire mon attention'} et je pense sincerement qu'on peut vous aider a developper votre clientele.

${accroche}

Chez Solayia, on accompagne les professionnels comme vous avec des solutions concretes :

${services.map(s => `  • ${s}`).join('\n')}

Notre approche est simple : on cree pour vous une presence digitale qui attire vos prospects et les transforme en clients. Pas de jargon, pas de promesses en l'air — juste des resultats mesurables.

Je serais ravi d'echanger 15 minutes avec vous pour voir comment on peut concretement booster votre visibilite.

Est-ce que vous seriez disponible cette semaine ou la semaine prochaine pour un rapide appel ?

Bien cordialement,

Adrien Lechevalier
Co-fondateur — Solayia
Agence web au service de votre croissance
contact@solayia.fr | solayia.fr`;

  return { subject, body };
}

// =============================================
// 2. EMAIL + FLYER — Visuel personnalise
// =============================================

export function generateEmailFlyer(prospect: ProspectData): { subject: string; body: string; flyerHtml: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || 'votre entreprise';
  const secteur = getSecteur(prospect);
  const services = getServicesSuggeres(secteur);
  const accroche = getAccrocheSecteur(secteur);

  const subject = entreprise !== 'votre entreprise'
    ? `${entreprise} — Decouvrez ce qu'on peut faire pour vous`
    : `Votre croissance digitale commence ici`;

  const body = `Bonjour ${name},

Je vous partage un apercu de ce que Solayia peut apporter a ${entreprise}.

Vous trouverez ci-dessous notre proposition adaptee a votre secteur d'activite.

Si ca vous parle, je serais ravi d'en discuter autour d'un cafe ou par telephone.

A bientot,

Adrien Lechevalier
Co-fondateur — Solayia
contact@solayia.fr`;

  const flyerHtml = `
<div style="max-width:600px;margin:0 auto;font-family:'Inter',Arial,sans-serif;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0A1A3A 0%,#1B2D5B 100%);padding:40px 32px;text-align:center;">
    <h1 style="color:#D4A84B;font-size:28px;margin:0 0 4px;font-weight:800;letter-spacing:-0.02em;">SOLAYIA</h1>
    <p style="color:#CBD5E1;font-size:13px;margin:0;letter-spacing:0.1em;">AGENCE WEB & DIGITALE</p>
  </div>

  <!-- Accroche personnalisee -->
  <div style="padding:32px;text-align:center;background:#FAFAFA;">
    <h2 style="color:#0A1A3A;font-size:20px;margin:0 0 8px;font-weight:700;">
      ${entreprise !== 'votre entreprise' ? entreprise + ',' : ''} Et si vos clients venaient a vous ?
    </h2>
    <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0;">
      ${accroche}
    </p>
  </div>

  <!-- Services -->
  <div style="padding:24px 32px;">
    <h3 style="color:#1B2D5B;font-size:16px;margin:0 0 16px;font-weight:700;text-align:center;">
      Ce qu'on peut faire pour vous
    </h3>
    ${services.map(s => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F1F5F9;">
      <div style="width:32px;height:32px;background:#FEF3C7;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="color:#D4A84B;font-size:16px;">✦</span>
      </div>
      <span style="color:#0F172A;font-size:14px;font-weight:500;">${s}</span>
    </div>`).join('')}
  </div>

  <!-- Stats -->
  <div style="padding:24px 32px;background:#F8FAFC;text-align:center;">
    <div style="display:inline-block;margin:0 16px;text-align:center;">
      <div style="color:#1B2D5B;font-size:28px;font-weight:800;">+80%</div>
      <div style="color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Visibilite</div>
    </div>
    <div style="display:inline-block;margin:0 16px;text-align:center;">
      <div style="color:#1B2D5B;font-size:28px;font-weight:800;">x3</div>
      <div style="color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Leads / mois</div>
    </div>
    <div style="display:inline-block;margin:0 16px;text-align:center;">
      <div style="color:#1B2D5B;font-size:28px;font-weight:800;">100%</div>
      <div style="color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Sur-mesure</div>
    </div>
  </div>

  <!-- CTA -->
  <div style="padding:32px;text-align:center;">
    <p style="color:#64748B;font-size:14px;margin:0 0 16px;">Pret a passer a l'action ?</p>
    <a href="mailto:contact@solayia.fr?subject=RDV%20Solayia" style="display:inline-block;background:linear-gradient(135deg,#D4A84B,#B8902E);color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;">
      Prendre rendez-vous →
    </a>
  </div>

  <!-- Footer -->
  <div style="background:#0A1A3A;padding:20px 32px;text-align:center;">
    <p style="color:#D4A84B;font-size:14px;font-weight:700;margin:0 0 4px;">Solayia</p>
    <p style="color:#94A3B8;font-size:12px;margin:0;">contact@solayia.fr — solayia.fr — Toulouse</p>
    <p style="color:#64748B;font-size:11px;margin:8px 0 0;">Avec Solayia, les clients viennent a vous.</p>
  </div>
</div>`;

  return { subject, body, flyerHtml };
}

// =============================================
// 3. EMAIL + PRE-MAQUETTE SITE — Apercu site web
// =============================================

export function generateEmailMaquette(prospect: ProspectData): { subject: string; body: string; mockupHtml: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || 'Votre Entreprise';
  const secteur = getSecteur(prospect);
  const services = getServicesSuggeres(secteur);

  const secteurThemes: Record<string, { heroText: string; color1: string; color2: string; sections: string[] }> = {
    restauration: {
      heroText: 'Decouvrez notre cuisine authentique',
      color1: '#1a1a2e', color2: '#e94560',
      sections: ['Notre carte', 'Reservation en ligne', 'Galerie', 'Avis clients', 'Contact'],
    },
    boulangerie: {
      heroText: 'Le gout de l\'artisanat depuis toujours',
      color1: '#2c1810', color2: '#d4a84b',
      sections: ['Nos produits', 'Commande en ligne', 'Notre savoir-faire', 'Horaires', 'Contact'],
    },
    commerce_alimentaire: {
      heroText: 'Produits frais & qualite au quotidien',
      color1: '#1b4332', color2: '#52b788',
      sections: ['Nos produits', 'Click & Collect', 'Notre engagement', 'Horaires', 'Contact'],
    },
    btp: {
      heroText: 'Construction & renovation de confiance',
      color1: '#1B2D5B', color2: '#D4A84B',
      sections: ['Nos realisations', 'Nos services', 'Demande de devis', 'Temoignages', 'Contact'],
    },
    immobilier: {
      heroText: 'Votre projet immobilier commence ici',
      color1: '#0f172a', color2: '#3b82f6',
      sections: ['Nos biens', 'Estimation gratuite', 'Notre equipe', 'Avis clients', 'Contact'],
    },
    assurance: {
      heroText: 'Protegez ce qui compte vraiment',
      color1: '#1e3a5f', color2: '#4ade80',
      sections: ['Nos offres', 'Simuler en ligne', 'Nos conseillers', 'FAQ', 'Contact'],
    },
    association: {
      heroText: 'Ensemble, allons plus loin',
      color1: '#312e81', color2: '#818cf8',
      sections: ['Nos activites', 'Adherer', 'Evenements', 'Actualites', 'Contact'],
    },
    entreprise_services: {
      heroText: 'L\'expertise au service de votre reussite',
      color1: '#1B2D5B', color2: '#D4A84B',
      sections: ['Nos services', 'Nos references', 'Demander un devis', 'A propos', 'Contact'],
    },
    general: {
      heroText: 'Bienvenue chez nous',
      color1: '#1B2D5B', color2: '#D4A84B',
      sections: ['Nos services', 'A propos', 'Realisations', 'Temoignages', 'Contact'],
    },
  };

  const theme = secteurThemes[secteur] || secteurThemes.general;

  const subject = `${entreprise} — Apercu de votre futur site web par Solayia`;

  const body = `Bonjour ${name},

Et si ${entreprise} avait un site web a la hauteur de votre savoir-faire ?

Je me suis permis de creer un apercu de ce que pourrait etre votre site internet. C'est une premiere ebauche, mais ca vous donnera une idee du resultat.

Bien sur, tout est personnalisable : couleurs, contenu, fonctionnalites... On s'adapte a 100% a vos besoins.

On en parle ?

Adrien Lechevalier
Co-fondateur — Solayia
contact@solayia.fr`;

  const mockupHtml = `
<div style="max-width:600px;margin:0 auto;font-family:'Inter',Arial,sans-serif;border-radius:16px;overflow:hidden;border:2px solid #E2E8F0;background:#fff;">
  <!-- Badge Solayia -->
  <div style="background:#FAFAFA;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E2E8F0;">
    <span style="font-size:11px;color:#64748B;font-weight:500;">🎨 Pre-maquette par Solayia</span>
    <span style="font-size:11px;color:#D4A84B;font-weight:700;">APERCU</span>
  </div>

  <!-- Browser mockup bar -->
  <div style="background:#F1F5F9;padding:8px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #E2E8F0;">
    <div style="display:flex;gap:4px;">
      <div style="width:10px;height:10px;border-radius:50%;background:#ef4444;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#f59e0b;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#22c55e;"></div>
    </div>
    <div style="flex:1;background:#fff;border-radius:6px;padding:4px 12px;font-size:11px;color:#94a3b8;border:1px solid #E2E8F0;">
      www.${(entreprise || 'monsite').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.fr
    </div>
  </div>

  <!-- Hero section -->
  <div style="background:linear-gradient(135deg,${theme.color1} 0%,${theme.color1}dd 100%);padding:48px 32px;text-align:center;position:relative;">
    <h1 style="color:#FFFFFF;font-size:22px;margin:0 0 4px;font-weight:800;letter-spacing:-0.02em;">${entreprise}</h1>
    <p style="color:${theme.color2};font-size:14px;margin:0 0 20px;font-weight:500;">${theme.heroText}</p>
    <div style="display:inline-block;background:${theme.color2};color:#FFFFFF;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;">
      Nous contacter →
    </div>
  </div>

  <!-- Navigation -->
  <div style="background:#FFFFFF;padding:12px 16px;display:flex;justify-content:center;gap:16px;border-bottom:1px solid #F1F5F9;flex-wrap:wrap;">
    ${theme.sections.map(s => `<span style="font-size:11px;color:#64748B;font-weight:500;">${s}</span>`).join('')}
  </div>

  <!-- Content sections preview -->
  <div style="padding:24px 32px;">
    <!-- Section 1 -->
    <div style="margin-bottom:24px;">
      <h3 style="color:${theme.color1};font-size:15px;margin:0 0 8px;font-weight:700;">${theme.sections[0]}</h3>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;height:64px;background:linear-gradient(135deg,#F1F5F9,#E2E8F0);border-radius:8px;"></div>
        <div style="flex:1;height:64px;background:linear-gradient(135deg,#F1F5F9,#E2E8F0);border-radius:8px;"></div>
        <div style="flex:1;height:64px;background:linear-gradient(135deg,#F1F5F9,#E2E8F0);border-radius:8px;"></div>
      </div>
    </div>

    <!-- Section 2 - Stats -->
    <div style="background:#FAFAFA;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-around;">
        <div>
          <div style="color:${theme.color1};font-size:24px;font-weight:800;">+150</div>
          <div style="color:#64748B;font-size:11px;">Clients satisfaits</div>
        </div>
        <div>
          <div style="color:${theme.color1};font-size:24px;font-weight:800;">5★</div>
          <div style="color:#64748B;font-size:11px;">Note Google</div>
        </div>
        <div>
          <div style="color:${theme.color1};font-size:24px;font-weight:800;">10+</div>
          <div style="color:#64748B;font-size:11px;">Ans d'experience</div>
        </div>
      </div>
    </div>

    <!-- Section 3 - CTA -->
    <div style="text-align:center;padding:20px;background:linear-gradient(135deg,${theme.color1}0a,${theme.color2}15);border-radius:12px;border:1px dashed ${theme.color2};">
      <p style="color:${theme.color1};font-size:14px;margin:0 0 12px;font-weight:600;">Interesse ? Contactez-nous</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <div style="background:${theme.color2};color:#fff;padding:8px 20px;border-radius:6px;font-size:12px;font-weight:600;">Appeler</div>
        <div style="background:${theme.color1};color:#fff;padding:8px 20px;border-radius:6px;font-size:12px;font-weight:600;">Email</div>
      </div>
    </div>
  </div>

  <!-- Footer site -->
  <div style="background:${theme.color1};padding:16px 32px;text-align:center;">
    <p style="color:#FFFFFF;font-size:13px;font-weight:600;margin:0 0 2px;">${entreprise}</p>
    <p style="color:#94A3B8;font-size:11px;margin:0;">Tous droits reserves</p>
  </div>

  <!-- Solayia badge -->
  <div style="background:#FAFAFA;padding:12px 16px;text-align:center;border-top:1px solid #E2E8F0;">
    <p style="margin:0;font-size:11px;color:#64748B;">
      Maquette realisee par <strong style="color:#D4A84B;">Solayia</strong> — votre agence web a Toulouse
    </p>
  </div>
</div>`;

  return { subject, body, mockupHtml };
}
