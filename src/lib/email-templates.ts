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

  // Prestations adaptees au secteur (grille 2x4 comme le vrai flyer)
  const prestationsSecteur: Record<string, { icon: string; titre: string; desc: string }[]> = {
    restauration: [
      { icon: '🌐', titre: 'Site vitrine', desc: 'Carte, photos, ambiance' },
      { icon: '📅', titre: 'Reservation en ligne', desc: 'Reservations 24h/24' },
      { icon: '🔍', titre: 'SEO local', desc: 'N°1 sur Google Maps' },
      { icon: '📸', titre: 'Photos pro', desc: 'Vos plats en valeur' },
      { icon: '⭐', titre: 'Avis Google', desc: 'Gestion & reponses' },
      { icon: '📱', titre: 'Reseaux sociaux', desc: 'Instagram & Facebook' },
      { icon: '📍', titre: 'Google Business', desc: 'Fiche optimisee' },
      { icon: '📊', titre: 'Strategie digitale', desc: 'Plan d\'action clair' },
    ],
    btp: [
      { icon: '🌐', titre: 'Site professionnel', desc: 'Credibilite & confiance' },
      { icon: '🏗️', titre: 'Portfolio projets', desc: 'Vos realisations en vitrine' },
      { icon: '🔍', titre: 'SEO local', desc: 'Visible dans votre zone' },
      { icon: '📋', titre: 'Devis en ligne', desc: 'Formulaire automatise' },
      { icon: '⭐', titre: 'Avis clients', desc: 'Temoignages & confiance' },
      { icon: '📱', titre: 'Reseaux sociaux', desc: 'Avant/apres chantiers' },
      { icon: '📍', titre: 'Google Business', desc: 'Fiche optimisee' },
      { icon: '📊', titre: 'Strategie digitale', desc: 'Plan d\'action clair' },
    ],
    immobilier: [
      { icon: '🌐', titre: 'Site immobilier', desc: 'Catalogue de biens' },
      { icon: '🏠', titre: 'Estimation en ligne', desc: 'Captation de mandats' },
      { icon: '🔍', titre: 'SEO local', desc: 'Visible sur Google' },
      { icon: '📸', titre: 'Visuels premium', desc: 'Photos & visites 3D' },
      { icon: '⭐', titre: 'Avis clients', desc: 'Reputation en ligne' },
      { icon: '📱', titre: 'Reseaux sociaux', desc: 'Biens & temoignages' },
      { icon: '📍', titre: 'Google Business', desc: 'Fiche optimisee' },
      { icon: '📊', titre: 'Strategie digitale', desc: 'Plan d\'action clair' },
    ],
    general: [
      { icon: '🌐', titre: 'Creation de site web', desc: 'Vitrine professionnelle' },
      { icon: '🔄', titre: 'Refonte de site', desc: 'Modernisation complete' },
      { icon: '🛠️', titre: 'Maintenance', desc: 'Mises a jour & evolution' },
      { icon: '🔍', titre: 'SEO & Referencement', desc: 'Visible sur Google' },
      { icon: '🛒', titre: 'E-commerce', desc: 'Vente en ligne' },
      { icon: '📱', titre: 'Reseaux sociaux', desc: 'Strategie & contenus' },
      { icon: '📍', titre: 'Google Business', desc: 'Fiche optimisee' },
      { icon: '📊', titre: 'Strategie digitale', desc: 'Plan d\'action clair' },
    ],
  };

  const prestations = prestationsSecteur[secteur] || prestationsSecteur.general;

  // Raisons "Pourquoi Solayia" adaptees au secteur
  const raisonsSecteur: Record<string, string[]> = {
    restauration: [
      'Un site attractif qui donne envie de reserver, pret en 4 semaines',
      'Une approche specialisee restauration, on connait votre metier',
      'Un accompagnement de A a Z, sans jargon technique',
      'Des resultats mesurables : plus de couverts, plus de reservations',
    ],
    btp: [
      'Un site professionnel qui inspire confiance, pret en 4 semaines',
      'Une vitrine de vos realisations qui parle pour vous',
      'Un accompagnement de A a Z, sans jargon technique',
      'Des resultats mesurables : plus de demandes de devis qualifiees',
    ],
    immobilier: [
      'Un site qui capte des mandats 24h/24, pret en 4 semaines',
      'Une approche adaptee a l\'immobilier et ses specificites',
      'Un accompagnement de A a Z, sans jargon technique',
      'Des resultats mesurables : plus de leads vendeurs et acheteurs',
    ],
    general: [
      'Un site professionnel, pret en 4 semaines',
      'Une approche personnalisee, adaptee a votre metier',
      'Un accompagnement de A a Z, sans jargon',
      'Des resultats mesurables, pas des promesses',
    ],
  };

  const raisons = raisonsSecteur[secteur] || raisonsSecteur.general;

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
<div style="max-width:600px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;background:#FFFFFF;overflow:hidden;border:1px solid #D4A84B;">

  <!-- ====== HEADER EDITORIAL ====== -->
  <div style="background:#0B1D3A;padding:36px 32px 28px;text-align:center;position:relative;">
    <!-- Ligne decorative gold -->
    <div style="width:60px;height:2px;background:#D4A84B;margin:0 auto 16px;"></div>
    <h1 style="color:#D4A84B;font-size:36px;margin:0 0 2px;font-weight:400;letter-spacing:0.08em;font-family:Georgia,'Times New Roman',serif;">SOLAYIA.</h1>
    <p style="color:#94A3B8;font-size:11px;margin:0 0 12px;letter-spacing:0.25em;font-family:'Inter',Arial,sans-serif;text-transform:uppercase;">l'agence digitale qui fait grandir les TPE</p>
    <div style="display:flex;justify-content:center;align-items:center;gap:12px;">
      <span style="color:#64748B;font-size:9px;letter-spacing:0.15em;font-family:'Inter',Arial,sans-serif;">EST. 2024</span>
      <span style="color:#D4A84B;font-size:8px;">◆</span>
      <span style="color:#64748B;font-size:9px;letter-spacing:0.15em;font-family:'Inter',Arial,sans-serif;">TOULOUSE · FRANCE</span>
    </div>
  </div>

  <!-- ====== HERO — ACCROCHE PERSONNALISEE ====== -->
  <div style="padding:36px 32px 28px;text-align:center;border-bottom:1px solid #F1F5F9;">
    ${entreprise !== 'votre entreprise' ? `<p style="color:#D4A84B;font-size:11px;margin:0 0 8px;letter-spacing:0.2em;font-family:'Inter',Arial,sans-serif;text-transform:uppercase;">Pour ${entreprise}</p>` : ''}
    <h2 style="color:#0B1D3A;font-size:24px;margin:0 0 16px;font-weight:400;line-height:1.3;font-family:Georgia,'Times New Roman',serif;">
      Votre presence en ligne<br>merite d'etre remarquee.
    </h2>
    <p style="color:#64748B;font-size:13px;line-height:1.7;margin:0;max-width:440px;display:inline-block;font-family:'Inter',Arial,sans-serif;">
      ${accroche}
    </p>
  </div>

  <!-- ====== NOS PRESTATIONS — Grille 2x4 ====== -->
  <div style="padding:28px 24px 20px;">
    <div style="text-align:center;margin-bottom:20px;">
      <div style="width:40px;height:1px;background:#D4A84B;margin:0 auto 12px;"></div>
      <h3 style="color:#0B1D3A;font-size:18px;margin:0;font-weight:400;font-family:Georgia,'Times New Roman',serif;">Nos prestations</h3>
    </div>

    <!-- Row 1 -->
    <div style="display:flex;gap:12px;margin-bottom:12px;">
      ${prestations.slice(0, 2).map(p => `
      <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 12px;text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">${p.icon}</div>
        <div style="color:#0B1D3A;font-size:12px;font-weight:700;margin-bottom:2px;font-family:'Inter',Arial,sans-serif;">${p.titre}</div>
        <div style="color:#94A3B8;font-size:10px;font-family:'Inter',Arial,sans-serif;">${p.desc}</div>
      </div>`).join('')}
    </div>
    <!-- Row 2 -->
    <div style="display:flex;gap:12px;margin-bottom:12px;">
      ${prestations.slice(2, 4).map(p => `
      <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 12px;text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">${p.icon}</div>
        <div style="color:#0B1D3A;font-size:12px;font-weight:700;margin-bottom:2px;font-family:'Inter',Arial,sans-serif;">${p.titre}</div>
        <div style="color:#94A3B8;font-size:10px;font-family:'Inter',Arial,sans-serif;">${p.desc}</div>
      </div>`).join('')}
    </div>
    <!-- Row 3 -->
    <div style="display:flex;gap:12px;margin-bottom:12px;">
      ${prestations.slice(4, 6).map(p => `
      <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 12px;text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">${p.icon}</div>
        <div style="color:#0B1D3A;font-size:12px;font-weight:700;margin-bottom:2px;font-family:'Inter',Arial,sans-serif;">${p.titre}</div>
        <div style="color:#94A3B8;font-size:10px;font-family:'Inter',Arial,sans-serif;">${p.desc}</div>
      </div>`).join('')}
    </div>
    <!-- Row 4 -->
    <div style="display:flex;gap:12px;">
      ${prestations.slice(6, 8).map(p => `
      <div style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 12px;text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">${p.icon}</div>
        <div style="color:#0B1D3A;font-size:12px;font-weight:700;margin-bottom:2px;font-family:'Inter',Arial,sans-serif;">${p.titre}</div>
        <div style="color:#94A3B8;font-size:10px;font-family:'Inter',Arial,sans-serif;">${p.desc}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- ====== STATS BAR ====== -->
  <div style="background:#0B1D3A;padding:20px 32px;display:flex;justify-content:space-around;align-items:center;">
    <div style="text-align:center;">
      <div style="color:#D4A84B;font-size:28px;font-weight:800;font-family:'Inter',Arial,sans-serif;">80%</div>
      <div style="color:#94A3B8;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Visibilite en hausse</div>
    </div>
    <div style="width:1px;height:36px;background:#1E3A5F;"></div>
    <div style="text-align:center;">
      <div style="color:#D4A84B;font-size:28px;font-weight:800;font-family:'Inter',Arial,sans-serif;">x3</div>
      <div style="color:#94A3B8;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Plus de leads</div>
    </div>
    <div style="width:1px;height:36px;background:#1E3A5F;"></div>
    <div style="text-align:center;">
      <div style="color:#D4A84B;font-size:28px;font-weight:800;font-family:'Inter',Arial,sans-serif;">100%</div>
      <div style="color:#94A3B8;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Sur-mesure</div>
    </div>
  </div>

  <!-- ====== POURQUOI SOLAYIA ====== -->
  <div style="padding:28px 32px;border-bottom:1px solid #F1F5F9;">
    <div style="text-align:center;margin-bottom:20px;">
      <div style="width:40px;height:1px;background:#D4A84B;margin:0 auto 12px;"></div>
      <h3 style="color:#0B1D3A;font-size:18px;margin:0;font-weight:400;font-family:Georgia,'Times New Roman',serif;">Pourquoi Solayia</h3>
    </div>
    ${raisons.map((r, i) => `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:${i < raisons.length - 1 ? '14' : '0'}px;">
      <div style="width:20px;height:20px;background:#0B1D3A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <span style="color:#D4A84B;font-size:10px;font-weight:700;font-family:'Inter',Arial,sans-serif;">${i + 1}</span>
      </div>
      <p style="color:#334155;font-size:13px;line-height:1.5;margin:0;font-family:'Inter',Arial,sans-serif;">${r}</p>
    </div>`).join('')}
  </div>

  <!-- ====== CTA ====== -->
  <div style="padding:28px 32px;text-align:center;background:#FAFBFC;">
    <p style="color:#0B1D3A;font-size:16px;margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;">
      Discutons de votre projet —
    </p>
    <p style="color:#D4A84B;font-size:13px;margin:0 0 18px;font-weight:600;font-family:'Inter',Arial,sans-serif;">
      le premier echange est offert.
    </p>
    <a href="mailto:contact@solayia.fr?subject=${encodeURIComponent(entreprise !== 'votre entreprise' ? `RDV Solayia x ${entreprise}` : 'RDV Solayia')}" style="display:inline-block;background:#0B1D3A;color:#D4A84B;text-decoration:none;padding:14px 36px;border-radius:4px;font-weight:700;font-size:13px;letter-spacing:0.05em;font-family:'Inter',Arial,sans-serif;border:1px solid #D4A84B;">
      PRENDRE RENDEZ-VOUS →
    </a>
  </div>

  <!-- ====== FOOTER ====== -->
  <div style="background:#0B1D3A;padding:24px 32px;text-align:center;">
    <p style="color:#D4A84B;font-size:20px;margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.05em;">SOLAYIA.</p>
    <p style="color:#94A3B8;font-size:10px;margin:0 0 10px;letter-spacing:0.15em;font-family:'Inter',Arial,sans-serif;">L'AGENCE DIGITALE QUI FAIT GRANDIR LES TPE</p>
    <div style="width:40px;height:1px;background:#D4A84B;margin:0 auto 10px;"></div>
    <p style="color:#64748B;font-size:11px;margin:0;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
      contact@solayia.fr · solayia.fr<br>
      Toulouse, France
    </p>
    <p style="color:#475569;font-size:10px;margin:10px 0 0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">
      Avec Solayia, les clients viennent a vous.
    </p>
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

// =============================================
// 4. EMAIL RELANCE — Suivi apres premier contact
// =============================================

export function generateEmailRelance(prospect: ProspectData): { subject: string; body: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || '';

  const subject = entreprise
    ? `${entreprise} — Suite a notre echange`
    : `Suite a notre echange`;

  const body = `Bonjour ${name},

Je me permets de revenir vers vous suite a notre dernier echange concernant ${entreprise ? `la presence digitale de ${entreprise}` : 'votre projet digital'}.

Je sais que le quotidien peut vite prendre le dessus, mais je voulais m'assurer que vous aviez bien recu toutes les informations et repondre a vos eventuelles questions.

Pour rappel, voici ce que nous avions evoque :

  • Un site web professionnel adapte a votre secteur
  • Un referencement local optimise (Google)
  • Un accompagnement personnalise de A a Z

Je reste disponible pour un echange rapide de 10-15 minutes, au moment qui vous arrange le mieux.

N'hesitez pas a me dire quel creneau vous conviendrait.

Bien cordialement,

Adrien Lechevalier
Co-fondateur — Solayia
contact@solayia.fr | solayia.fr`;

  return { subject, body };
}

// =============================================
// 5. EMAIL PROPOSITION — Envoi de proposition commerciale
// =============================================

interface ProspectDataExtended extends ProspectData {
  description_prestation: string | null;
  tarif_propose: number | null;
  adresse_chantier: string | null;
}

export function generateEmailProposition(prospect: ProspectDataExtended): { subject: string; body: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || '';
  const tarif = prospect.tarif_propose
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prospect.tarif_propose)
    : null;

  const subject = entreprise
    ? `Proposition commerciale — ${entreprise} x Solayia`
    : `Votre proposition commerciale Solayia`;

  const body = `Bonjour ${name},

Suite a nos echanges, j'ai le plaisir de vous transmettre notre proposition commerciale pour ${entreprise || 'votre projet'}.

${prospect.description_prestation ? `Prestation proposee :\n${prospect.description_prestation}\n` : ''}${tarif ? `Investissement : ${tarif} HT\n` : ''}
Vous trouverez ci-joint le detail complet de notre proposition, incluant :

  • Le perimetre de la prestation
  • Le planning previsionnel
  • Les conditions et modalites

Cette proposition est valable 30 jours. N'hesitez pas a me contacter si vous avez la moindre question ou si vous souhaitez ajuster certains elements.

Je suis convaincu que cette collaboration sera benefique pour ${entreprise || 'votre activite'} et j'ai hate de demarrer ce projet avec vous.

A tres bientot,

Adrien Lechevalier
Co-fondateur — Solayia
contact@solayia.fr | solayia.fr`;

  return { subject, body };
}

// =============================================
// 6. EMAIL REMERCIEMENT — Post-RDV
// =============================================

export function generateEmailRemerciement(prospect: ProspectData): { subject: string; body: string } {
  const name = getCivilite(prospect);
  const entreprise = prospect.entreprise || '';

  const subject = entreprise
    ? `Merci pour cet echange — ${entreprise}`
    : `Merci pour cet echange`;

  const body = `Bonjour ${name},

Je tenais a vous remercier pour le temps que vous m'avez accorde aujourd'hui. C'etait un plaisir d'en apprendre davantage sur ${entreprise || 'votre activite'} et vos ambitions.

Comme convenu, je vous enverrai rapidement :

  • Une proposition detaillee adaptee a vos besoins
  • Des exemples de realisations dans votre secteur
  • Un planning previsionnel pour le projet

En attendant, n'hesitez pas a me contacter si vous avez des questions ou des precisions a apporter.

Je suis enthousiaste a l'idee de collaborer avec vous !

Bien cordialement,

Adrien Lechevalier
Co-fondateur — Solayia
contact@solayia.fr | solayia.fr`;

  return { subject, body };
}
