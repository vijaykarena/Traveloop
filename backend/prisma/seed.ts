import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  // ── Cities ──────────────────────────────────────────────────────────────────

  const cities = await Promise.all([
    prisma.city.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Mumbai",
        costIndex: 1.5,
        popularity: 100,
        description:
          "India's financial capital — street food, colonial architecture, Bollywood, and the Arabian Sea.",
        imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800",
        latitude: 19.076,
        longitude: 72.8777,
      },
    }),
    prisma.city.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: "Delhi",
        costIndex: 1.2,
        popularity: 98,
        description:
          "India's capital blending Mughal monuments, bustling bazaars, and modern metro life.",
        imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        latitude: 28.6139,
        longitude: 77.209,
      },
    }),
    prisma.city.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: "Jaipur",
        costIndex: 0.9,
        popularity: 92,
        description:
          "The Pink City — forts, palaces, and vibrant bazaars in Rajasthan's royal heartland.",
        imageUrl: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33",
        latitude: 26.9124,
        longitude: 75.7873,
      },
    }),
    prisma.city.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: "Goa",
        costIndex: 1.1,
        popularity: 95,
        description:
          "Sun, sand, and spice — beach resorts, Portuguese churches, and vibrant nightlife.",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        latitude: 15.2993,
        longitude: 74.124,
      },
    }),
    prisma.city.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: "Varanasi",
        costIndex: 0.7,
        popularity: 88,
        description:
          "One of the world's oldest cities — ghats, temples, and the sacred Ganga Aarti.",
        imageUrl: "https://images.unsplash.com/photo-1627938823193-fd13c1c867dd?q=80&w=1170",
        latitude: 25.3176,
        longitude: 82.9739,
      },
    }),
    prisma.city.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: "Agra",
        costIndex: 0.8,
        popularity: 94,
        description:
          "Home to the Taj Mahal, Agra Fort, and Fatehpur Sikri — Mughal glory frozen in marble.",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
        latitude: 27.1767,
        longitude: 78.0081,
      },
    }),
    prisma.city.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: "Udaipur",
        costIndex: 1.0,
        popularity: 85,
        description:
          "City of Lakes — romantic palaces, lake-view rooftops, and Rajput heritage.",
        imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
        latitude: 24.5854,
        longitude: 73.7125,
      },
    }),
    prisma.city.upsert({
      where: { id: 8 },
      update: {},
      create: {
        name: "Kerala (Kochi)",
        costIndex: 1.0,
        popularity: 87,
        description:
          "Gateway to God's Own Country — backwaters, spice markets, and colonial Fort Kochi.",
        imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        latitude: 9.9312,
        longitude: 76.2673,
      },
    }),
  ]);

  console.log(`Created ${cities.length} cities`);

  // ── Activities ───────────────────────────────────────────────────────────────

  const activityData = [
    // Mumbai
    { cityId: 1, name: "Gateway of India", type: "SIGHTSEEING", estimatedCost: 0, durationHours: 1.5, description: "Iconic arch monument overlooking the Arabian Sea, built in 1924.", imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800" },
    { cityId: 1, name: "Elephanta Caves", type: "CULTURE", estimatedCost: 600, durationHours: 4, description: "UNESCO rock-cut cave temples on Elephanta Island, accessible by ferry.", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
    { cityId: 1, name: "Dharavi Street Food Tour", type: "FOOD", estimatedCost: 800, durationHours: 3, description: "Guided food walk through one of Asia's largest urban settlements.", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" },
    { cityId: 1, name: "Marine Drive Sunset Walk", type: "NATURE", estimatedCost: 0, durationHours: 1.5, description: "Queen's Necklace — the 3km promenade along the coast.", imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800" },
    { cityId: 1, name: "Bollywood Studio Tour", type: "CULTURE", estimatedCost: 1500, durationHours: 3, description: "Behind-the-scenes tour of Film City, Mumbai's legendary studio complex.", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" },
    { cityId: 1, name: "Colaba Causeway Shopping", type: "SHOPPING", estimatedCost: 2000, durationHours: 2.5, description: "Street market for antiques, clothes, jewellery, and curios.", imageUrl: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800" },

    // Delhi
    { cityId: 2, name: "Red Fort", type: "SIGHTSEEING", estimatedCost: 500, durationHours: 2.5, description: "Mughal fortress that served as the main residence of emperors for 200 years.", imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800" },
    { cityId: 2, name: "Qutub Minar", type: "SIGHTSEEING", estimatedCost: 300, durationHours: 2, description: "UNESCO minaret — tallest brick minaret in the world at 72.5m.", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800" },
    { cityId: 2, name: "Chandni Chowk Food Walk", type: "FOOD", estimatedCost: 700, durationHours: 3, description: "Taste paranthe, jalebi, and chaat in one of India's oldest markets.", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800" },
    { cityId: 2, name: "Humayun's Tomb", type: "CULTURE", estimatedCost: 350, durationHours: 2, description: "Inspiration for the Taj Mahal — first garden-tomb of the Indian subcontinent.", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800" },
    { cityId: 2, name: "Lodhi Garden Morning Walk", type: "WELLNESS", estimatedCost: 0, durationHours: 1.5, description: "15th-century tombs surrounded by parks and walking paths.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" },
    { cityId: 2, name: "Sarojini Nagar Market", type: "SHOPPING", estimatedCost: 1500, durationHours: 2, description: "Famous budget fashion market popular with college students.", imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800" },

    // Jaipur
    { cityId: 3, name: "Amber Fort", type: "SIGHTSEEING", estimatedCost: 550, durationHours: 3, description: "Hilltop Rajput fort with intricate mirror work, elephant rides, and panoramic views.", imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=800" },
    { cityId: 3, name: "Hawa Mahal", type: "SIGHTSEEING", estimatedCost: 100, durationHours: 1, description: "Palace of Winds — five-storey facade with 953 small windows.", imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800" },
    { cityId: 3, name: "Johri Bazaar Gem Shopping", type: "SHOPPING", estimatedCost: 3000, durationHours: 2.5, description: "Jaipur's famous jewellery market — gems, gold, and silver.", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800" },
    { cityId: 3, name: "City Palace Museum", type: "CULTURE", estimatedCost: 700, durationHours: 2, description: "Royal palace complex with museums displaying royal costumes and artefacts.", imageUrl: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800" },
    { cityId: 3, name: "Rajasthani Cooking Class", type: "FOOD", estimatedCost: 1200, durationHours: 3, description: "Learn dal baati churma, laal maas, and ghevar from local chefs.", imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800" },

    // Goa
    { cityId: 4, name: "Baga Beach", type: "NATURE", estimatedCost: 500, durationHours: 4, description: "North Goa's liveliest beach — water sports, shacks, and sunsets.", imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800" },
    { cityId: 4, name: "Old Goa Churches Tour", type: "CULTURE", estimatedCost: 0, durationHours: 3, description: "UNESCO heritage churches including Basilica of Bom Jesus.", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800" },
    { cityId: 4, name: "Dudhsagar Waterfall Trek", type: "ADVENTURE", estimatedCost: 1800, durationHours: 8, description: "Jeep safari + trek to one of India's tallest waterfalls.", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800" },
    { cityId: 4, name: "Anjuna Flea Market", type: "SHOPPING", estimatedCost: 1000, durationHours: 3, description: "Wednesday market with handicrafts, clothing, and antiques.", imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800" },
    { cityId: 4, name: "Goan Seafood Dinner Cruise", type: "FOOD", estimatedCost: 2200, durationHours: 3, description: "Sunset cruise on the Mandovi River with fresh seafood and live music.", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },

    // Varanasi
    { cityId: 5, name: "Ganga Aarti at Dashashwamedh Ghat", type: "CULTURE", estimatedCost: 0, durationHours: 2, description: "Spectacular evening fire ritual performed by priests on the ghats at sunset.", imageUrl: "https://images.unsplash.com/photo-1627938823193-fd13c1c867dd?w=800" },
    { cityId: 5, name: "Sunrise Boat Ride on the Ganga", type: "SIGHTSEEING", estimatedCost: 400, durationHours: 1.5, description: "Row past the ghats at dawn to witness bathing rituals and cremations.", imageUrl: "https://images.unsplash.com/photo-1561361058-c24e09c462e0?w=800" },
    { cityId: 5, name: "Sarnath Buddhist Circuit", type: "CULTURE", estimatedCost: 300, durationHours: 3, description: "Where Buddha gave his first sermon — deer park, stupa, and museum.", imageUrl: "https://images.unsplash.com/photo-1582531579210-5463be2c6a53?w=800" },
    { cityId: 5, name: "Banarasi Silk Weaving Tour", type: "CULTURE", estimatedCost: 200, durationHours: 2, description: "Visit master weavers in Old Varanasi making UNESCO-recognized silk sarees.", imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800" },
    { cityId: 5, name: "Chaat Trail at Kashi Chaat", type: "FOOD", estimatedCost: 300, durationHours: 2, description: "Famous tamatar chaat, kachori sabzi, and lassi of Varanasi.", imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800" },

    // Agra
    { cityId: 6, name: "Taj Mahal at Sunrise", type: "SIGHTSEEING", estimatedCost: 1100, durationHours: 3, description: "UNESCO wonder — white marble mausoleum of Mumtaz Mahal. Best at sunrise.", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" },
    { cityId: 6, name: "Agra Fort", type: "SIGHTSEEING", estimatedCost: 650, durationHours: 2.5, description: "Red sandstone Mughal fort with palaces, audience halls, and Taj views.", imageUrl: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800" },
    { cityId: 6, name: "Fatehpur Sikri", type: "CULTURE", estimatedCost: 610, durationHours: 3.5, description: "Abandoned Mughal capital — UNESCO site 40km from Agra.", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800" },
    { cityId: 6, name: "Petha & Street Food Walk", type: "FOOD", estimatedCost: 400, durationHours: 2, description: "Taste Agra's signature petha sweet and best street snacks.", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800" },

    // Udaipur
    { cityId: 7, name: "City Palace Udaipur", type: "SIGHTSEEING", estimatedCost: 300, durationHours: 3, description: "Massive palace complex overlooking Lake Pichola with museum and courtyards.", imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800" },
    { cityId: 7, name: "Lake Pichola Boat Ride", type: "NATURE", estimatedCost: 700, durationHours: 1.5, description: "Boat to Jag Mandir palace island with sunset views of the city.", imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=800" },
    { cityId: 7, name: "Vintage Car Museum", type: "CULTURE", estimatedCost: 250, durationHours: 1.5, description: "Royal collection of vintage Rolls-Royces, Cadillacs, and Mercedes.", imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800" },
    { cityId: 7, name: "Sajjangarh Monsoon Palace", type: "SIGHTSEEING", estimatedCost: 130, durationHours: 2, description: "Hilltop palace built to watch monsoon clouds — panoramic sunset views.", imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800" },

    // Kochi
    { cityId: 8, name: "Fort Kochi Heritage Walk", type: "CULTURE", estimatedCost: 0, durationHours: 3, description: "Walk past Chinese fishing nets, Dutch Palace, and Jewish Synagogue.", imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800" },
    { cityId: 8, name: "Kerala Backwater Houseboat", type: "NATURE", estimatedCost: 4500, durationHours: 8, description: "Day cruise through Alleppey backwaters on a traditional kettuvallam.", imageUrl: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800" },
    { cityId: 8, name: "Kathakali Performance", type: "CULTURE", estimatedCost: 350, durationHours: 2, description: "Classical Kerala dance-drama with elaborate costumes and face painting.", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
    { cityId: 8, name: "Spice Market Tour Mattancherry", type: "SHOPPING", estimatedCost: 500, durationHours: 2, description: "Explore centuries-old spice warehouses of cardamom, pepper, and cloves.", imageUrl: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800" },
    { cityId: 8, name: "Kerala Ayurvedic Massage", type: "WELLNESS", estimatedCost: 2000, durationHours: 2, description: "Traditional Abhyanga full-body oil massage at an authentic Ayurvedic centre.", imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800" },
  ];

  await prisma.activity.createMany({
    data: activityData.map((d) => ({
      cityId: d.cityId,
      name: d.name,
      type: d.type as never,
      estimatedCost: d.estimatedCost,
      durationHours: d.durationHours,
      description: d.description,
      imageUrl: d.imageUrl,
    })),
    skipDuplicates: true,
  });

  const allActivities = await prisma.activity.findMany({ select: { id: true, name: true } });
  const actById = (name: string) => allActivities.find((a) => a.name === name)?.id;

  console.log(`Created ${activityData.length} activities`);

  // ── Users ────────────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  const [adminUser, testUser1, testUser2, testUser3] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@traveloop.com" },
      update: {},
      create: {
        email: "admin@traveloop.com",
        password: adminHash,
        firstName: "Admin",
        lastName: "Traveloop",
        city: "Mumbai",
        country: "India",
        countryCode: "IN",
        phoneNo: "+910000000001",
        role: "ADMIN",
        bio: "Platform administrator.",
        language: "en",
      },
    }),
    prisma.user.upsert({
      where: { email: "raj@example.com" },
      update: {},
      create: {
        email: "raj@example.com",
        password: passwordHash,
        firstName: "Raj",
        lastName: "Sharma",
        city: "Delhi",
        country: "India",
        countryCode: "IN",
        phoneNo: "+911111111111",
        role: "USER",
        bio: "Solo traveler. Chai addict. Mountain lover.",
        language: "en",
      },
    }),
    prisma.user.upsert({
      where: { email: "priya@example.com" },
      update: {},
      create: {
        email: "priya@example.com",
        password: passwordHash,
        firstName: "Priya",
        lastName: "Singh",
        city: "Bangalore",
        country: "India",
        countryCode: "IN",
        phoneNo: "+919876543211",
        role: "USER",
        bio: "Weekend warrior. Loves food trails and heritage walks.",
        language: "en",
      },
    }),
    prisma.user.upsert({
      where: { email: "arjun@example.com" },
      update: {},
      create: {
        email: "arjun@example.com",
        password: passwordHash,
        firstName: "Arjun",
        lastName: "Mehta",
        city: "Mumbai",
        country: "India",
        countryCode: "IN",
        phoneNo: "+917654321098",
        role: "USER",
        bio: "Adventure seeker. Kerala backwaters changed my life.",
        language: "en",
      },
    }),
  ]);

  console.log(`Created 4 users (admin: admin@traveloop.com / admin123, users: *@example.com / password123)`);

  // ── Trip 1: Golden Triangle (Raj) ────────────────────────────────────────────

  const trip1 = await prisma.trip.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: testUser1.id,
      title: "Golden Triangle",
      destination: "Delhi → Agra → Jaipur",
      description: "Classic 10-day circuit through India's three most iconic cities.",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-10"),
      isPublic: true,
      publicSlug: "golden-triangle-raj2026",
      budgetLimit: 60000,
    },
  });

  const [stop1Delhi, stop1Agra, stop1Jaipur] = await Promise.all([
    prisma.tripStop.upsert({
      where: { tripId_order: { tripId: trip1.id, order: 1 } },
      update: {},
      create: {
        tripId: trip1.id,
        cityId: 2,
        order: 1,
        arrivalDate: new Date("2026-11-01"),
        departureDate: new Date("2026-11-03"),
        notes: "Arrive at IGI Airport T3. Metro to hotel.",
      },
    }),
    prisma.tripStop.upsert({
      where: { tripId_order: { tripId: trip1.id, order: 2 } },
      update: {},
      create: {
        tripId: trip1.id,
        cityId: 6,
        order: 2,
        arrivalDate: new Date("2026-11-03"),
        departureDate: new Date("2026-11-06"),
        notes: "Yamuna Expressway — 3hr drive or Gatimaan Express (1.5hr).",
      },
    }),
    prisma.tripStop.upsert({
      where: { tripId_order: { tripId: trip1.id, order: 3 } },
      update: {},
      create: {
        tripId: trip1.id,
        cityId: 3,
        order: 3,
        arrivalDate: new Date("2026-11-06"),
        departureDate: new Date("2026-11-10"),
        notes: "Hire a cab for day trips to Amber Fort.",
      },
    }),
  ]);

  // Idempotent derived data: delete then recreate
  await prisma.tripActivity.deleteMany({ where: { tripStop: { tripId: trip1.id } } });
  await Promise.all([
    prisma.tripActivity.create({ data: { tripStopId: stop1Delhi.id, activityId: actById("Red Fort")!, scheduledDate: new Date("2026-11-01T10:00:00Z"), actualCost: 500 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Delhi.id, activityId: actById("Chandni Chowk Food Walk")!, scheduledDate: new Date("2026-11-02T18:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Agra.id, activityId: actById("Taj Mahal at Sunrise")!, scheduledDate: new Date("2026-11-04T06:00:00Z"), actualCost: 1100 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Agra.id, activityId: actById("Agra Fort")!, scheduledDate: new Date("2026-11-04T10:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Jaipur.id, activityId: actById("Amber Fort")!, scheduledDate: new Date("2026-11-07T09:00:00Z"), actualCost: 550 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Jaipur.id, activityId: actById("Hawa Mahal")!, scheduledDate: new Date("2026-11-08T10:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop1Jaipur.id, activityId: actById("Rajasthani Cooking Class")!, scheduledDate: new Date("2026-11-09T17:00:00Z"), actualCost: 1200 } }),
  ]);

  await Promise.all([
    prisma.tripAccommodation.upsert({ where: { tripStopId: stop1Delhi.id }, update: {}, create: { tripStopId: stop1Delhi.id, name: "Zostel Delhi", address: "Paharganj, New Delhi", checkIn: new Date("2026-11-01T14:00:00Z"), checkOut: new Date("2026-11-03T11:00:00Z"), costPerNight: 800, bookingRef: "ZOS-DEL-001" } }),
    prisma.tripAccommodation.upsert({ where: { tripStopId: stop1Agra.id }, update: {}, create: { tripStopId: stop1Agra.id, name: "Hotel Taj Resorts", address: "Fatehabad Road, Agra", checkIn: new Date("2026-11-03T14:00:00Z"), checkOut: new Date("2026-11-06T11:00:00Z"), costPerNight: 2200, bookingRef: "HTR-AGR-221" } }),
    prisma.tripAccommodation.upsert({ where: { tripStopId: stop1Jaipur.id }, update: {}, create: { tripStopId: stop1Jaipur.id, name: "Pearl Palace Heritage", address: "Hari Kishan Somani Marg, Jaipur", checkIn: new Date("2026-11-06T14:00:00Z"), checkOut: new Date("2026-11-10T11:00:00Z"), costPerNight: 1800 } }),
  ]);

  await prisma.tripTransport.deleteMany({ where: { tripId: trip1.id } });
  await Promise.all([
    prisma.tripTransport.create({ data: { tripId: trip1.id, fromStopId: stop1Delhi.id, toStopId: stop1Agra.id, mode: "TRAIN", carrier: "Gatimaan Express", departureTime: new Date("2026-11-03T08:10:00Z"), arrivalTime: new Date("2026-11-03T09:50:00Z"), cost: 1200, bookingRef: "PNR-12345678" } }),
    prisma.tripTransport.create({ data: { tripId: trip1.id, fromStopId: stop1Agra.id, toStopId: stop1Jaipur.id, mode: "BUS", carrier: "Rajasthan Roadways", departureTime: new Date("2026-11-06T07:00:00Z"), arrivalTime: new Date("2026-11-06T11:30:00Z"), cost: 600 } }),
    prisma.tripTransport.create({ data: { tripId: trip1.id, toStopId: stop1Delhi.id, mode: "FLIGHT", carrier: "IndiGo", departureTime: new Date("2026-11-01T05:30:00Z"), arrivalTime: new Date("2026-11-01T07:45:00Z"), cost: 4500, bookingRef: "6E-2341" } }),
  ]);

  await prisma.tripExpense.deleteMany({ where: { tripId: trip1.id } });
  await Promise.all([
    prisma.tripExpense.create({ data: { tripId: trip1.id, tripStopId: stop1Delhi.id, category: "MEAL", description: "Dinner at Karim's, Old Delhi", amount: 950, expenseDate: new Date("2026-11-01") } }),
    prisma.tripExpense.create({ data: { tripId: trip1.id, tripStopId: stop1Delhi.id, category: "MISC", description: "Metro day pass", amount: 200, expenseDate: new Date("2026-11-02") } }),
    prisma.tripExpense.create({ data: { tripId: trip1.id, tripStopId: stop1Agra.id, category: "MEAL", description: "Lunch at Pinch of Spice", amount: 1100, expenseDate: new Date("2026-11-04") } }),
    prisma.tripExpense.create({ data: { tripId: trip1.id, tripStopId: stop1Jaipur.id, category: "MEAL", description: "Thali dinner at Chokhi Dhani", amount: 1400, expenseDate: new Date("2026-11-07") } }),
    prisma.tripExpense.create({ data: { tripId: trip1.id, category: "MISC", description: "Travel insurance", amount: 800 } }),
  ]);

  await prisma.packingItem.deleteMany({ where: { tripId: trip1.id } });
  const packingItems1 = [
    { name: "Passport", category: "DOCUMENTS", order: 1 },
    { name: "Travel insurance docs", category: "DOCUMENTS", order: 2 },
    { name: "Hotel booking printouts", category: "DOCUMENTS", order: 3 },
    { name: "Kurta (x3)", category: "CLOTHING", order: 4 },
    { name: "Comfortable walking shoes", category: "CLOTHING", order: 5 },
    { name: "Light jacket (Delhi nights are cold)", category: "CLOTHING", order: 6 },
    { name: "Sunscreen SPF 50", category: "TOILETRIES", order: 7 },
    { name: "Hand sanitiser", category: "TOILETRIES", order: 8 },
    { name: "Power bank", category: "ELECTRONICS", order: 9 },
    { name: "Universal adapter", category: "ELECTRONICS", order: 10 },
    { name: "Antidiarrheal tablets", category: "MEDICATIONS", order: 11 },
  ];
  await prisma.packingItem.createMany({
    data: packingItems1.map((item) => ({
      tripId: trip1.id,
      userId: testUser1.id,
      name: item.name,
      category: item.category as never,
      order: item.order,
    })),
  });

  await prisma.tripNote.deleteMany({ where: { tripId: trip1.id } });
  await Promise.all([
    prisma.tripNote.create({ data: { tripId: trip1.id, userId: testUser1.id, title: "Agra Taj entry tips", content: "Buy tickets online at asi.payumoney.com to avoid queues. Dawn entry (6am) is most photogenic. No food or tripods inside. Shoe covers provided free.", noteDate: new Date("2026-11-04"), tags: ["logistics", "monuments"] } }),
    prisma.tripNote.create({ data: { tripId: trip1.id, userId: testUser1.id, title: "Delhi contacts", content: "Driver: Suresh — +91 98765 00001\nHotel front desk: +91 11 2345 6789\nNearest hospital: Safdarjung, 10 min by auto.", noteDate: new Date("2026-11-01"), tags: ["contacts", "emergency"] } }),
    prisma.tripNote.create({ data: { tripId: trip1.id, userId: testUser1.id, title: "Budget tracker note", content: "Flight cheaper if booked 3 months out. Agra hotel price dropped 20% mid-week. Total spent so far within budget.", noteDate: new Date("2026-11-06"), tags: ["budget"] } }),
  ]);

  // ── Trip 2: Goa Beach Escape (Priya) ────────────────────────────────────────

  const trip2 = await prisma.trip.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: testUser2.id,
      title: "Goa Beach Escape",
      destination: "North Goa → South Goa",
      description: "5-day beach holiday with seafood, heritage walks, and one adventure day.",
      startDate: new Date("2026-12-20"),
      endDate: new Date("2026-12-25"),
      isPublic: false,
      budgetLimit: 25000,
    },
  });

  const stop2Goa = await prisma.tripStop.upsert({
    where: { tripId_order: { tripId: trip2.id, order: 1 } },
    update: {},
    create: {
      tripId: trip2.id,
      cityId: 4,
      order: 1,
      arrivalDate: new Date("2026-12-20"),
      departureDate: new Date("2026-12-25"),
      notes: "Fly into Dabolim or Manohar airport. Pre-book taxi.",
    },
  });

  await prisma.tripActivity.deleteMany({ where: { tripStop: { tripId: trip2.id } } });
  await Promise.all([
    prisma.tripActivity.create({ data: { tripStopId: stop2Goa.id, activityId: actById("Baga Beach")!, scheduledDate: new Date("2026-12-21T10:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop2Goa.id, activityId: actById("Old Goa Churches Tour")!, scheduledDate: new Date("2026-12-22T09:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop2Goa.id, activityId: actById("Dudhsagar Waterfall Trek")!, scheduledDate: new Date("2026-12-23T07:00:00Z"), actualCost: 1800 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop2Goa.id, activityId: actById("Goan Seafood Dinner Cruise")!, scheduledDate: new Date("2026-12-24T19:00:00Z"), actualCost: 2200 } }),
  ]);

  await prisma.tripAccommodation.upsert({ where: { tripStopId: stop2Goa.id }, update: {}, create: { tripStopId: stop2Goa.id, name: "The Leela Goa", address: "Mobor, Cavelossim, South Goa", checkIn: new Date("2026-12-20T14:00:00Z"), checkOut: new Date("2026-12-25T12:00:00Z"), costPerNight: 6500, bookingRef: "LEELA-GOA-88" } });

  await prisma.tripTransport.deleteMany({ where: { tripId: trip2.id } });
  await prisma.tripTransport.create({ data: { tripId: trip2.id, toStopId: stop2Goa.id, mode: "FLIGHT", carrier: "IndiGo", departureTime: new Date("2026-12-20T06:00:00Z"), arrivalTime: new Date("2026-12-20T07:50:00Z"), cost: 5200, bookingRef: "6E-4890" } });

  await prisma.tripExpense.deleteMany({ where: { tripId: trip2.id } });
  await Promise.all([
    prisma.tripExpense.create({ data: { tripId: trip2.id, tripStopId: stop2Goa.id, category: "MEAL", description: "Seafood at Fisherman's Wharf", amount: 2200, expenseDate: new Date("2026-12-21") } }),
    prisma.tripExpense.create({ data: { tripId: trip2.id, tripStopId: stop2Goa.id, category: "MISC", description: "Scooter rental (4 days)", amount: 1600, expenseDate: new Date("2026-12-21") } }),
  ]);

  await prisma.packingItem.deleteMany({ where: { tripId: trip2.id } });
  await prisma.packingItem.createMany({
    data: [
      { tripId: trip2.id, userId: testUser2.id, name: "Swimsuit (x2)", category: "CLOTHING" as never, order: 1 },
      { tripId: trip2.id, userId: testUser2.id, name: "Sunscreen SPF 50+", category: "TOILETRIES" as never, order: 2 },
      { tripId: trip2.id, userId: testUser2.id, name: "Passport", category: "DOCUMENTS" as never, order: 3 },
      { tripId: trip2.id, userId: testUser2.id, name: "Waterproof phone pouch", category: "ELECTRONICS" as never, order: 4 },
      { tripId: trip2.id, userId: testUser2.id, name: "Insect repellent", category: "TOILETRIES" as never, order: 5 },
    ],
  });

  await prisma.tripNote.deleteMany({ where: { tripId: trip2.id } });
  await Promise.all([
    prisma.tripNote.create({ data: { tripId: trip2.id, userId: testUser2.id, title: "Scooter hire spots", content: "Best rates near Calangute junction — ₹400/day for Activa. Bring licence. Fill tank before returning.", noteDate: new Date("2026-12-21"), tags: ["logistics", "transport"] } }),
    prisma.tripNote.create({ data: { tripId: trip2.id, userId: testUser2.id, title: "Beach restaurant recs", content: "Brittos at Baga — fish curry rice is unbeatable. La Plage at Ashvem for a quieter vibe. Book Fisherman's Wharf ahead.", noteDate: new Date("2026-12-22"), tags: ["food"] } }),
  ]);

  // ── Trip 3: Kerala & Kochi (Arjun) ──────────────────────────────────────────

  const trip3 = await prisma.trip.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: testUser3.id,
      title: "Kerala Backwaters & Kochi",
      destination: "Kochi → Alleppey → Munnar",
      description: "7-day journey through Fort Kochi, backwater houseboats, and misty tea estates.",
      startDate: new Date("2027-01-10"),
      endDate: new Date("2027-01-17"),
      isPublic: true,
      publicSlug: "kerala-arjun2027",
      budgetLimit: 45000,
    },
  });

  const [stop3Kochi, stop3Varanasi] = await Promise.all([
    prisma.tripStop.upsert({
      where: { tripId_order: { tripId: trip3.id, order: 1 } },
      update: {},
      create: {
        tripId: trip3.id,
        cityId: 8,
        order: 1,
        arrivalDate: new Date("2027-01-10"),
        departureDate: new Date("2027-01-14"),
        notes: "Fly into Cochin International. Fort Kochi is 30 min by ferry from Ernakulam.",
      },
    }),
    prisma.tripStop.upsert({
      where: { tripId_order: { tripId: trip3.id, order: 2 } },
      update: {},
      create: {
        tripId: trip3.id,
        cityId: 5,
        order: 2,
        arrivalDate: new Date("2027-01-14"),
        departureDate: new Date("2027-01-17"),
        notes: "Overnight train from Ernakulam to Varanasi — 36hr journey. Book 2A class.",
      },
    }),
  ]);

  await prisma.tripActivity.deleteMany({ where: { tripStop: { tripId: trip3.id } } });
  await Promise.all([
    prisma.tripActivity.create({ data: { tripStopId: stop3Kochi.id, activityId: actById("Fort Kochi Heritage Walk")!, scheduledDate: new Date("2027-01-10T09:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop3Kochi.id, activityId: actById("Kerala Backwater Houseboat")!, scheduledDate: new Date("2027-01-11T08:00:00Z"), actualCost: 4500 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop3Kochi.id, activityId: actById("Kathakali Performance")!, scheduledDate: new Date("2027-01-12T18:00:00Z"), actualCost: 350 } }),
    prisma.tripActivity.create({ data: { tripStopId: stop3Kochi.id, activityId: actById("Spice Market Tour Mattancherry")!, scheduledDate: new Date("2027-01-13T10:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop3Varanasi.id, activityId: actById("Ganga Aarti at Dashashwamedh Ghat")!, scheduledDate: new Date("2027-01-15T18:00:00Z") } }),
    prisma.tripActivity.create({ data: { tripStopId: stop3Varanasi.id, activityId: actById("Sunrise Boat Ride on the Ganga")!, scheduledDate: new Date("2027-01-16T05:30:00Z"), actualCost: 400 } }),
  ]);

  await Promise.all([
    prisma.tripAccommodation.upsert({ where: { tripStopId: stop3Kochi.id }, update: {}, create: { tripStopId: stop3Kochi.id, name: "Brunton Boatyard", address: "Calvathy Road, Fort Kochi", checkIn: new Date("2027-01-10T14:00:00Z"), checkOut: new Date("2027-01-14T11:00:00Z"), costPerNight: 5500, bookingRef: "BB-KCH-102" } }),
    prisma.tripAccommodation.upsert({ where: { tripStopId: stop3Varanasi.id }, update: {}, create: { tripStopId: stop3Varanasi.id, name: "Brijrama Palace", address: "Darbhanga Ghat, Varanasi", checkIn: new Date("2027-01-14T15:00:00Z"), checkOut: new Date("2027-01-17T11:00:00Z"), costPerNight: 3800, bookingRef: "BRIJ-VAR-07" } }),
  ]);

  await prisma.tripTransport.deleteMany({ where: { tripId: trip3.id } });
  await Promise.all([
    prisma.tripTransport.create({ data: { tripId: trip3.id, toStopId: stop3Kochi.id, mode: "FLIGHT", carrier: "Air India", departureTime: new Date("2027-01-10T07:00:00Z"), arrivalTime: new Date("2027-01-10T09:15:00Z"), cost: 6800, bookingRef: "AI-441" } }),
    prisma.tripTransport.create({ data: { tripId: trip3.id, fromStopId: stop3Kochi.id, toStopId: stop3Varanasi.id, mode: "TRAIN", carrier: "Ernakulam–Varanasi Express", departureTime: new Date("2027-01-14T19:30:00Z"), arrivalTime: new Date("2027-01-16T08:00:00Z"), cost: 2200, bookingRef: "PNR-87654321" } }),
  ]);

  await prisma.tripExpense.deleteMany({ where: { tripId: trip3.id } });
  await Promise.all([
    prisma.tripExpense.create({ data: { tripId: trip3.id, tripStopId: stop3Kochi.id, category: "MEAL", description: "Karimeen pollichathu at Old Harbour Hotel", amount: 1800, expenseDate: new Date("2027-01-10") } }),
    prisma.tripExpense.create({ data: { tripId: trip3.id, tripStopId: stop3Kochi.id, category: "MISC", description: "Spices and cashews at Mattancherry", amount: 2200, expenseDate: new Date("2027-01-13") } }),
    prisma.tripExpense.create({ data: { tripId: trip3.id, tripStopId: stop3Varanasi.id, category: "MEAL", description: "Lassi at Blue Lassi shop", amount: 120, expenseDate: new Date("2027-01-15") } }),
    prisma.tripExpense.create({ data: { tripId: trip3.id, category: "MISC", description: "Travel insurance", amount: 950 } }),
  ]);

  await prisma.packingItem.deleteMany({ where: { tripId: trip3.id } });
  await prisma.packingItem.createMany({
    data: [
      { tripId: trip3.id, userId: testUser3.id, name: "Passport", category: "DOCUMENTS" as never, order: 1 },
      { tripId: trip3.id, userId: testUser3.id, name: "Cotton kurtas (x4)", category: "CLOTHING" as never, order: 2 },
      { tripId: trip3.id, userId: testUser3.id, name: "Mosquito repellent", category: "TOILETRIES" as never, order: 3 },
      { tripId: trip3.id, userId: testUser3.id, name: "Camera (waterproof bag)", category: "ELECTRONICS" as never, order: 4 },
      { tripId: trip3.id, userId: testUser3.id, name: "Motion sickness tablets", category: "MEDICATIONS" as never, order: 5 },
      { tripId: trip3.id, userId: testUser3.id, name: "Flip-flops", category: "CLOTHING" as never, order: 6 },
    ],
  });

  await prisma.tripNote.deleteMany({ where: { tripId: trip3.id } });
  await Promise.all([
    prisma.tripNote.create({ data: { tripId: trip3.id, userId: testUser3.id, title: "Houseboat booking tips", content: "Book directly with operator at Alleppey jetty for better rates. Premium boats include AC bedroom, attached bath, meals. Overnight stay is worth the extra ₹2000.", noteDate: new Date("2027-01-11"), tags: ["accommodation", "budget"] } }),
    prisma.tripNote.create({ data: { tripId: trip3.id, userId: testUser3.id, title: "Ganga Aarti timing", content: "Starts at 6:30pm sharp in winter. Arrive at Dashashwamedh Ghat by 5:45pm for a good spot. Boat viewing (₹300) gives the best angle.", noteDate: new Date("2027-01-15"), tags: ["culture", "logistics"] } }),
    prisma.tripNote.create({ data: { tripId: trip3.id, userId: testUser3.id, title: "Kerala food must-tries", content: "Appam with stew (breakfast). Karimeen pollichathu. Prawn moilee. Parotta with beef curry. Kerala banana chips from Lulu Mall.", noteDate: new Date("2027-01-10"), tags: ["food"] } }),
  ]);

  // ── Saved Destinations ───────────────────────────────────────────────────────

  await Promise.all([
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser1.id, cityId: 4 } }, update: {}, create: { userId: testUser1.id, cityId: 4 } }),
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser1.id, cityId: 5 } }, update: {}, create: { userId: testUser1.id, cityId: 5 } }),
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser1.id, cityId: 8 } }, update: {}, create: { userId: testUser1.id, cityId: 8 } }),
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser2.id, cityId: 7 } }, update: {}, create: { userId: testUser2.id, cityId: 7 } }),
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser3.id, cityId: 1 } }, update: {}, create: { userId: testUser3.id, cityId: 1 } }),
    prisma.savedDestination.upsert({ where: { userId_cityId: { userId: testUser3.id, cityId: 4 } }, update: {}, create: { userId: testUser3.id, cityId: 4 } }),
  ]);

  console.log("Done. Seed complete.");
  console.log("");
  console.log("Test credentials:");
  console.log("  Admin  — admin@traveloop.com  / admin123");
  console.log("  User 1 — raj@example.com      / password123");
  console.log("  User 2 — priya@example.com    / password123");
  console.log("  User 3 — arjun@example.com    / password123");
  console.log("");
  console.log("Public trip slugs: golden-triangle-raj2026, kerala-arjun2027");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
