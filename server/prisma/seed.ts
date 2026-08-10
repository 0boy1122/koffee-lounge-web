import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ensureDevDatabase } from "../src/dev-db";
import { hashPassword } from "../src/lib/auth";

const menuItems = [
  {
    name: "Single Origin Espresso",
    description: "Double shot, Yirgacheffe beans roasted in-house.",
    price: 18,
    category: "Hot Coffee",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-cappuccino2.jpg",
    popular: true,
  },
  {
    name: "Flat White",
    description: "Silky microfoam over a double ristretto shot.",
    price: 24,
    category: "Hot Coffee",
    tags: ["gf"],
    image: "/gallery/flavor-cappuccino2.jpg",
    popular: true,
  },
  {
    name: "Cardamom Spiced Latte",
    description: "House espresso, steamed milk, cardamom and honey.",
    price: 27,
    category: "Hot Coffee",
    tags: ["gf"],
    image: "/gallery/menu-caramel-latte2.jpg",
  },
  {
    name: "Pour Over of the Day",
    description: "Rotating single-origin, brewed to order.",
    price: 22,
    category: "Hot Coffee",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-cappuccino2.jpg",
  },
  {
    name: "12-Hour Cold Brew",
    description: "Slow-steeped, served over ice with a citrus twist.",
    price: 25,
    category: "Cold Brews",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-mocha2.jpg",
    popular: true,
  },
  {
    name: "Iced Mocha",
    description: "Dark chocolate, espresso, cold milk, whipped cream.",
    price: 29,
    category: "Cold Brews",
    tags: ["gf"],
    image: "/gallery/flavor-mocha2.jpg",
  },
  {
    name: "Nitro Cold Brew",
    description: "Nitrogen-infused for a cascading, creamy pour.",
    price: 28,
    category: "Cold Brews",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-cappuccino2.jpg",
  },
  {
    name: "Hibiscus & Ginger Tea",
    description: "Caffeine-free, served hot or over ice.",
    price: 18,
    category: "Teas & Smoothies",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-caramel-latte2.jpg",
  },
  {
    name: "Mango Turmeric Smoothie",
    description: "Fresh mango, turmeric, oat milk, a hint of ginger.",
    price: 26,
    category: "Teas & Smoothies",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-caramel2.jpg",
    popular: true,
  },
  {
    name: "Butter Croissant",
    description: "Baked fresh each morning, laminated in-house.",
    price: 15,
    category: "Breakfast & Bakery",
    tags: [],
    image: "/gallery/menu-croissant2.jpg",
  },
  {
    name: "Banana Walnut Bread",
    description: "Moist banana loaf, toasted walnuts, cinnamon crumb.",
    price: 17,
    category: "Breakfast & Bakery",
    tags: ["nuts"],
    image: "/gallery/menu-croissant2.jpg",
  },
  {
    name: "Granola & Yoghurt Bowl",
    description: "House granola, seasonal fruit, honey drizzle.",
    price: 24,
    category: "Breakfast & Bakery",
    tags: ["nuts"],
    image: "/gallery/gallery-pastry-table2.jpg",
  },
  {
    name: "Roast Chicken Club",
    description: "Grilled chicken, avocado, bacon, on sourdough.",
    price: 42,
    category: "Lunch & Savory",
    tags: [],
    image: "/gallery/menu-sandwich2.jpg",
    popular: true,
  },
  {
    name: "Grilled Vegetable Wrap",
    description: "Charred peppers, hummus, spinach, whole-wheat wrap.",
    price: 34,
    category: "Lunch & Savory",
    tags: ["vegan"],
    image: "/gallery/menu-sandwich2.jpg",
  },
  {
    name: "Smoky Jollof Rice Bowl",
    description: "Koffee Lounge's take on the classic, with grilled plantain.",
    price: 38,
    category: "Lunch & Savory",
    tags: ["gf"],
    image: "/gallery/gallery-pastry-table2.jpg",
  },
  {
    name: "Executive Breakfast Platter",
    description: "Pastries, fruit, yoghurt cups — serves 8-10.",
    price: 320,
    category: "Catering Platters",
    tags: [],
    image: "/gallery/interior-counter2.jpg",
  },
  {
    name: "Boardroom Sandwich Platter",
    description: "Assorted finger sandwiches — serves 10-12.",
    price: 380,
    category: "Catering Platters",
    tags: [],
    image: "/gallery/menu-sandwich2.jpg",
  },
  {
    name: "Meeting Coffee Carafe",
    description: "1.5L carafe with cups, milk, and sugar on the side.",
    price: 140,
    category: "Catering Platters",
    tags: ["vegan", "gf"],
    image: "/gallery/gallery-pour-filter2.jpg",
  },
];

const promoCodes = [
  { code: "FIRST15", discountRate: 0.15 },
  { code: "OFFICE10", discountRate: 0.1 },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = await ensureDevDatabase();
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: item,
      create: item,
    });
  }

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@koffeelounge.test";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && !adminPassword) {
    throw new Error("SEED_ADMIN_PASSWORD must be set when seeding production.");
  }
  await prisma.staffUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Koffee Lounge Admin",
      passwordHash: await hashPassword(adminPassword ?? "changeme123"),
      role: "ADMIN",
    },
  });

  console.log(`Seeded ${menuItems.length} menu items, ${promoCodes.length} promo codes, 1 admin user.`);
  console.log(`Admin user seeded: ${adminEmail}`);

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
