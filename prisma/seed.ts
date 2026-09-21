import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Offside Community...');

  // App config
  await prisma.appConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      upiId: 'offside@upi',
      upiName: 'Offside Community',
      qrCodeUrl: 'https://res.cloudinary.com/demo/image/upload/v1/offside-qr.png',
      contactPhone: '9313074629',
      instagramHandle: '@theoffsidesociety'
    }
  });

  // Cities
  const vadodara = await prisma.city.upsert({
    where: { slug: 'vadodara' },
    update: {},
    create: {
      name: 'Vadodara',
      slug: 'vadodara',
      chiefName: 'Parth',
      chiefPhone: '9313074629',
      isActive: true,
    }
  });

  const ahmedabad = await prisma.city.upsert({
    where: { slug: 'ahmedabad' },
    update: {},
    create: {
      name: 'Ahmedabad',
      slug: 'ahmedabad',
      chiefName: 'Rudra',
      chiefPhone: '9313074629',
      isActive: true,
    }
  });

  // Venues
  const sportingo = await prisma.venue.upsert({
    where: { id: 'venue_sportingo_seed' },
    update: {},
    create: {
      id: 'venue_sportingo_seed',
      name: 'Sportingo Turf',
      address: 'Vadodara, Gujarat',
      mapLink: 'https://maps.app.goo.gl/PsPSaG8aWEnbuKgv8?g_st=ic',
      cityId: vadodara.id,
      isActive: true,
    }
  });

  const amdVenue = await prisma.venue.upsert({
    where: { id: 'venue_ahmedabad_seed' },
    update: {},
    create: {
      id: 'venue_ahmedabad_seed',
      name: 'Ahmedabad Turf (TBD)',
      address: 'Ahmedabad, Gujarat',
      mapLink: null,
      cityId: ahmedabad.id,
      isActive: true,
    }
  });

  // Admin user
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@theoffsidecommunity.com' },
    update: {},
    create: {
      name: 'Offside Admin',
      email: 'admin@theoffsidecommunity.com',
      phone: '9313074629',
      passwordHash: adminHash,
      role: 'ADMIN',
      city: 'Vadodara',
      isVerified: true,
    }
  });

  // Demo player
  const playerHash = await bcrypt.hash('Player@123', 12);
  await prisma.user.upsert({
    where: { email: 'player@test.com' },
    update: {},
    create: {
      name: 'Test Player',
      email: 'player@test.com',
      phone: '9876543210',
      passwordHash: playerHash,
      role: 'PLAYER',
      city: 'Vadodara',
      position: 'Midfielder',
      isVerified: true,
    }
  });

  // Seed 4 upcoming matches (next Sunday schedule)
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  
  const matches = [
    {
      venueId: sportingo.id,
      date: new Date(nextSunday.setHours(7,0,0,0)),
      startTime: new Date(new Date(nextSunday).setHours(7,0,0,0)),
      endTime: new Date(new Date(nextSunday).setHours(8,30,0,0)),
      category: 'STANDARD' as const,
      price: 299,
      maxPlayers: 14,
      createdById: admin.id,
    },
    {
      venueId: sportingo.id,
      date: new Date(new Date(nextSunday).setHours(18,0,0,0)),
      startTime: new Date(new Date(nextSunday).setHours(18,0,0,0)),
      endTime: new Date(new Date(nextSunday).setHours(19,30,0,0)),
      category: 'PLUS' as const,
      price: 449,
      maxPlayers: 14,
      createdById: admin.id,
    },
    {
      venueId: amdVenue.id,
      date: new Date(new Date(nextSunday).setDate(nextSunday.getDate()+1)),
      startTime: new Date(new Date(nextSunday).setDate(nextSunday.getDate()+1)),
      endTime: new Date(new Date(nextSunday).setDate(nextSunday.getDate()+1)),
      category: 'STANDARD' as const,
      price: 299,
      maxPlayers: 14,
      createdById: admin.id,
    }
  ];

  // Fix times properly
  const m1date = new Date();
  m1date.setDate(m1date.getDate() + ((7 - m1date.getDay()) % 7 || 7));
  m1date.setHours(7,0,0,0);

  const createMatches = [
    {
      venueId: sportingo.id,
      date: m1date,
      startTime: m1date,
      endTime: new Date(m1date.getTime() + 90*60000),
      category: 'STANDARD' as const,
      price: 299,
      maxPlayers: 14,
      status: 'OPEN' as const,
      createdById: admin.id,
      notes: 'Morning Standard - Water, MVP medal included'
    },
    {
      venueId: sportingo.id,
      date: new Date(m1date.getTime() + 11*3600000),
      startTime: new Date(m1date.getTime() + 11*3600000),
      endTime: new Date(m1date.getTime() + 12.5*3600000),
      category: 'PLUS' as const,
      price: 449,
      maxPlayers: 14,
      status: 'OPEN' as const,
      createdById: admin.id,
      notes: 'Evening PLUS - Recording + Energy drink'
    }
  ];

  for (const m of createMatches) {
    const exists = await prisma.match.findFirst({
      where: { venueId: m.venueId, startTime: m.startTime }
    });
    if (!exists) {
      await prisma.match.create({ data: m });
    }
  }

  // Reviews
  const player = await prisma.user.findUnique({ where: { email: 'player@test.com' }});
  if (player) {
    await prisma.review.createMany({
      data: [
        { userId: player.id, rating: 5, comment: 'Proper football. Balanced teams, great turf, no politics. Offside Society is legit.', visible: true },
        { userId: admin.id, rating: 5, comment: 'Best community matches in Vadodara. PLUS recording is fire.', visible: true },
      ],
      skipDuplicates: true
    });
  }

  console.log('✅ Seed complete');
  console.log('Admin: admin@theoffsidecommunity.com / Admin@123');
  console.log('Player: player@test.com / Player@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
