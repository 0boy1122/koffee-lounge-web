export type DietaryTag = "vegan" | "gf" | "nuts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: DietaryTag[];
  image: string;
  popular?: boolean;
}

export const dietaryLabels: Record<DietaryTag, { label: string; mark: string }> = {
  vegan: { label: "Vegan", mark: "V" },
  gf: { label: "Gluten-free", mark: "GF" },
  nuts: { label: "Contains nuts", mark: "N" },
};

export const categories = [
  "Hot Coffee",
  "Cold Brews",
  "Teas & Smoothies",
  "Breakfast & Bakery",
  "Lunch & Savory",
  "Catering Platters",
] as const;

export const menuItems: MenuItem[] = [
  {
    id: "espresso",
    name: "Single Origin Espresso",
    description: "Double shot, Yirgacheffe beans roasted in-house.",
    price: 18,
    category: "Hot Coffee",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-cappuccino2.jpg",
    popular: true,
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Silky microfoam over a double ristretto shot.",
    price: 24,
    category: "Hot Coffee",
    tags: ["gf"],
    image: "/gallery/flavor-cappuccino2.jpg",
    popular: true,
  },
  {
    id: "spiced-latte",
    name: "Cardamom Spiced Latte",
    description: "House espresso, steamed milk, cardamom and honey.",
    price: 27,
    category: "Hot Coffee",
    tags: ["gf"],
    image: "/gallery/menu-caramel-latte2.jpg",
  },
  {
    id: "pour-over",
    name: "Pour Over of the Day",
    description: "Rotating single-origin, brewed to order.",
    price: 22,
    category: "Hot Coffee",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-cappuccino2.jpg",
  },
  {
    id: "cold-brew",
    name: "12-Hour Cold Brew",
    description: "Slow-steeped, served over ice with a citrus twist.",
    price: 25,
    category: "Cold Brews",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-mocha2.jpg",
    popular: true,
  },
  {
    id: "iced-mocha",
    name: "Iced Mocha",
    description: "Dark chocolate, espresso, cold milk, whipped cream.",
    price: 29,
    category: "Cold Brews",
    tags: ["gf"],
    image: "/gallery/flavor-mocha2.jpg",
  },
  {
    id: "nitro",
    name: "Nitro Cold Brew",
    description: "Nitrogen-infused for a cascading, creamy pour.",
    price: 28,
    category: "Cold Brews",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-cappuccino2.jpg",
  },
  {
    id: "hibiscus-tea",
    name: "Hibiscus & Ginger Tea",
    description: "Caffeine-free, served hot or over ice.",
    price: 18,
    category: "Teas & Smoothies",
    tags: ["vegan", "gf"],
    image: "/gallery/menu-caramel-latte2.jpg",
  },
  {
    id: "mango-smoothie",
    name: "Mango Turmeric Smoothie",
    description: "Fresh mango, turmeric, oat milk, a hint of ginger.",
    price: 26,
    category: "Teas & Smoothies",
    tags: ["vegan", "gf"],
    image: "/gallery/flavor-caramel2.jpg",
    popular: true,
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    description: "Baked fresh each morning, laminated in-house.",
    price: 15,
    category: "Breakfast & Bakery",
    tags: [],
    image: "/gallery/menu-croissant2.jpg",
  },
  {
    id: "banana-bread",
    name: "Banana Walnut Bread",
    description: "Moist banana loaf, toasted walnuts, cinnamon crumb.",
    price: 17,
    category: "Breakfast & Bakery",
    tags: ["nuts"],
    image: "/gallery/menu-croissant2.jpg",
  },
  {
    id: "granola-bowl",
    name: "Granola & Yoghurt Bowl",
    description: "House granola, seasonal fruit, honey drizzle.",
    price: 24,
    category: "Breakfast & Bakery",
    tags: ["nuts"],
    image: "/gallery/gallery-pastry-table2.jpg",
  },
  {
    id: "club-sandwich",
    name: "Roast Chicken Club",
    description: "Grilled chicken, avocado, bacon, on sourdough.",
    price: 42,
    category: "Lunch & Savory",
    tags: [],
    image: "/gallery/menu-sandwich2.jpg",
    popular: true,
  },
  {
    id: "veg-wrap",
    name: "Grilled Vegetable Wrap",
    description: "Charred peppers, hummus, spinach, whole-wheat wrap.",
    price: 34,
    category: "Lunch & Savory",
    tags: ["vegan"],
    image: "/gallery/menu-sandwich2.jpg",
  },
  {
    id: "jollof-bowl",
    name: "Smoky Jollof Rice Bowl",
    description: "Koffee Lounge's take on the classic, with grilled plantain.",
    price: 38,
    category: "Lunch & Savory",
    tags: ["gf"],
    image: "/gallery/gallery-pastry-table2.jpg",
  },
  {
    id: "breakfast-platter",
    name: "Executive Breakfast Platter",
    description: "Pastries, fruit, yoghurt cups — serves 8-10.",
    price: 320,
    category: "Catering Platters",
    tags: [],
    image: "/gallery/interior-counter2.jpg",
  },
  {
    id: "sandwich-platter",
    name: "Boardroom Sandwich Platter",
    description: "Assorted finger sandwiches — serves 10-12.",
    price: 380,
    category: "Catering Platters",
    tags: [],
    image: "/gallery/menu-sandwich2.jpg",
  },
  {
    id: "coffee-carafe",
    name: "Meeting Coffee Carafe",
    description: "1.5L carafe with cups, milk, and sugar on the side.",
    price: 140,
    category: "Catering Platters",
    tags: ["vegan", "gf"],
    image: "/gallery/gallery-pour-filter2.jpg",
  },
];
