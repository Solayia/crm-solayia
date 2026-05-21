const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;
  const hash = await bcrypt.hash(password, rounds);

  // Create admin users
  const dolie = await prisma.user.upsert({
    where: { email: 'dolie@solayia.fr' },
    update: {},
    create: {
      email: 'dolie@solayia.fr',
      passwordHash: hash,
      fullName: 'Dolié',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const associe = await prisma.user.upsert({
    where: { email: 'associe@solayia.fr' },
    update: {},
    create: {
      email: 'associe@solayia.fr',
      passwordHash: hash,
      fullName: 'Associé',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`Created admin users: ${dolie.email}, ${associe.email}`);

  // Create sample prospects for testing
  const sampleProspects = [
    {
      companyName: 'H2O Toulouse Plomberie',
      street: '97 Rue des Fontaines',
      city: 'Toulouse',
      mobilePhone: '+33 7 43 33 60 78',
      phone: '+33 7 43 33 60 78',
      googleScore: 5.0,
      googleReviews: 15,
      categories: ['Plombier'],
      categoryName: 'Plombier',
      tier: 'A',
      status: 'NEW',
      source: 'apify_google_places',
      ownerId: dolie.id,
    },
    {
      companyName: 'Artisan peintre l.Rubio',
      street: '82 Bd Jean Brunhes',
      city: 'Toulouse',
      mobilePhone: '+33 7 66 32 36 76',
      phone: '+33 7 66 32 36 76',
      email: 'jeanmichelrubio9@gmail.com',
      googleScore: 4.7,
      googleReviews: 15,
      categories: ['Peintre en bâtiment'],
      categoryName: 'Peintre en bâtiment',
      tier: 'A',
      status: 'NEW',
      source: 'apify_google_places',
      ownerId: dolie.id,
    },
    {
      companyName: 'ENTREPRISE couvreur rénovation',
      street: '6 Rue Maurice Hurel',
      city: 'Toulouse',
      mobilePhone: '+33 7 56 90 62 54',
      phone: '+33 7 56 90 62 54',
      googleScore: 4.9,
      googleReviews: 524,
      categories: ['Couvreur'],
      categoryName: 'Couvreur',
      tier: 'B',
      status: 'NEW',
      source: 'apify_google_places',
      ownerId: dolie.id,
    },
    {
      companyName: 'AUVILLE Peinture',
      street: "23 Av. de l'U.R.S.S.",
      city: 'Toulouse',
      fixedPhone: '+33 9 86 19 73 19',
      phone: '+33 9 86 19 73 19',
      googleScore: 4.3,
      googleReviews: 260,
      categories: ['Peintre en bâtiment'],
      categoryName: 'Peintre en bâtiment',
      tier: 'C',
      status: 'NEW',
      source: 'apify_google_places',
      ownerId: dolie.id,
    },
    {
      companyName: 'Pont de la Daurade',
      city: 'Toulouse',
      googleScore: 4.6,
      googleReviews: 25,
      categories: ['Site historique', 'Pont'],
      categoryName: 'Site historique',
      tier: 'D',
      status: 'NEW',
      source: 'apify_google_places',
      ownerId: dolie.id,
    },
  ];

  for (const prospect of sampleProspects) {
    await prisma.prospect.create({ data: prospect });
  }

  console.log(`Created ${sampleProspects.length} sample prospects`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
