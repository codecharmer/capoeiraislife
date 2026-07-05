// Structural store data (language-neutral). All display copy lives in /app/lib/i18n.jsx.
// Backend (Stripe/Printful/inventory) is handled separately — swap this with API data of the same shape.

const un = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const px = (url, w = 1200) => `${url}?auto=compress&cs=tinysrgb&w=${w}`;

export const LOGO =
  "https://customer-assets.emergentagent.com/job_capoeira-drc/artifacts/fd6e8g6c_Logo-without-wood.png";

export const HERO_IMAGE = un("1641688587310-8be6c75ac116", 2000);
export const HERO_2 = px("https://images.pexels.com/photos/31251238/pexels-photo-31251238.jpeg", 1600);
export const LIFE_1 = px("https://images.pexels.com/photos/37192943/pexels-photo-37192943.jpeg", 1200);
export const LIFE_2 = un("1641688587256-7b6549157cef", 1000);
export const LIFE_3 = un("1777375430966-c028cf6e3293", 1000);
export const LIFE_4 = un("1583166614297-a97b68d5cead", 1000);
const IG_A = un("1476525223214-c31ff100e1ae", 700);
const IG_B = un("1685811327876-8846c79e9b87", 700);
const IG_C = un("1555597673-b21d5c935865", 700);

const A1 = un("1616259179104-36bf5b49b6a0", 900);
const A2 = un("1595175131352-6f21585c43ef", 900);
const A3 = un("1595175131373-b4cc47e2fe1e", 900);
const A4 = un("1580794665070-65a7f2928c62", 900);
const A5 = un("1618355281782-b9475e02a65c", 900);
const A6 = un("1618355281346-66ac1663917d", 900);
const P1 = un("1516224498413-84ecf3a1e7fd", 500);
const T1 = un("1571455786673-9d9d6c194f90", 900);
const T2 = un("1583743814966-8936f5b7be1a", 900);
const F1 = un("1548690312-e3b507d8c110", 900);

const C = {
  black: { name: "Black", hex: "#141414" },
  bone: { name: "Bone", hex: "#E8E0CE" },
  olive: { name: "Olive", hex: "#46523B" },
  charcoal: { name: "Charcoal", hex: "#2B2B2B" },
  navy: { name: "Navy", hex: "#1B2A4A" },
};

const APP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ONE = ["One Size"];

export const products = [
  { id: "p1", slug: "movimento-tee", title: "Movimento Tee", catSlug: "t-shirts", price: 38, compareAt: 48, rating: 4.9, reviews: 214, badge: "Best Seller", colors: [C.black, C.bone, C.olive], sizes: APP_SIZES, images: [T1, A1] },
  { id: "p2", slug: "axe-heavyweight-hoodie", title: "Ax\u00e9 Heavyweight Hoodie", catSlug: "hoodies", price: 78, compareAt: 95, rating: 5.0, reviews: 132, badge: "Best Seller", colors: [C.black, C.charcoal, C.olive], sizes: APP_SIZES, images: [A2, A4] },
  { id: "p3", slug: "ginga-oversized-hoodie", title: "Ginga Oversized Hoodie", catSlug: "hoodies", price: 82, compareAt: null, rating: 4.8, reviews: 89, badge: "New Arrival", colors: [C.black, C.bone], sizes: APP_SIZES, images: [A5, A6] },
  { id: "p4", slug: "roda-tank", title: "Roda Tank", catSlug: "tank-tops", price: 32, compareAt: null, rating: 4.7, reviews: 76, badge: "Almost Gone", colors: [C.black, C.bone], sizes: APP_SIZES, images: [F1, A3] },
  { id: "p5", slug: "berimbau-graphic-tee", title: "Berimbau Graphic Tee", catSlug: "t-shirts", price: 40, compareAt: null, rating: 4.9, reviews: 158, badge: "Limited Drop", colors: [C.black, C.navy], sizes: APP_SIZES, images: [A1, T2] },
  { id: "p6", slug: "cordao-dad-cap", title: "Cord\u00e3o Dad Cap", catSlug: "hats", price: 28, compareAt: null, rating: 4.6, reviews: 54, badge: null, colors: [C.black, C.olive], sizes: ONE, images: [A6, A2] },
  { id: "p7", slug: "mandinga-long-sleeve", title: "Mandinga Long Sleeve", catSlug: "t-shirts", price: 46, compareAt: null, rating: 4.8, reviews: 63, badge: null, colors: [C.black, C.charcoal], sizes: APP_SIZES, images: [T1, A1] },
  { id: "p8", slug: "roda-tote", title: "Roda Tote Bag", catSlug: "accessories", price: 24, compareAt: null, rating: 4.7, reviews: 41, badge: null, colors: [C.bone, C.black], sizes: ONE, images: [T2, A2] },
];

export const collections = [
  { slug: "t-shirts", image: T1 },
  { slug: "hoodies", image: A2 },
  { slug: "tank-tops", image: F1 },
  { slug: "hats", image: A6 },
  { slug: "accessories", image: T2 },
];

export const testimonials = [
  { id: "t1", name: "Lucas Almeida", country: "Brazil", flag: "\ud83c\udde7\ud83c\uddf7", rating: 5, image: P1 },
  { id: "t2", name: "Sof\u00eda Ram\u00edrez", country: "Mexico", flag: "\ud83c\uddf2\ud83c\uddfd", rating: 5, image: A3 },
  { id: "t3", name: "James Carter", country: "USA", flag: "\ud83c\uddfa\ud83c\uddf8", rating: 5, image: A1 },
  { id: "t4", name: "Lena Fischer", country: "Germany", flag: "\ud83c\udde9\ud83c\uddea", rating: 5, image: F1 },
  { id: "t5", name: "Mia Thompson", country: "Australia", flag: "\ud83c\udde6\ud83c\uddfa", rating: 5, image: A5 },
  { id: "t6", name: "Diego Santos", country: "Brazil", flag: "\ud83c\udde7\ud83c\uddf7", rating: 5, image: A6 },
];

export const INSTAGRAM = [IG_A, IG_B, IG_C, LIFE_2, LIFE_3, LIFE_4, HERO_2, A3, F1, A5, A4, A6];
