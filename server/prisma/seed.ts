import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`;

const menu = [
  { id: 'burrata', cat: 'Starters', name: 'Burrata & Stone Fruit', price: 14, desc: 'Heirloom peach, basil oil, sea salt, toasted sourdough.', tags: ['veg'], hue: 28, image: u('1505253716362-afaea1d3d1af') },
  { id: 'shishito', cat: 'Starters', name: 'Charred Shishitos', price: 9, desc: 'Smoked salt, lime, sesame.', tags: ['veg', 'spicy'], hue: 95, image: u('1603360946369-dc9bb6258143') },
  { id: 'polenta', cat: 'Starters', name: 'Crispy Polenta Bites', price: 11, desc: 'Parmesan, fresno chili jam, herb aioli.', tags: ['veg'], hue: 42, image: u('1504674900247-0877df9cc836') },
  { id: 'oysters', cat: 'Starters', name: 'Half Dozen Oysters', price: 22, desc: "Today's east coast selection, mignonette.", tags: [], hue: 200, image: u('1694787534229-e8c7d8ed5db1') },
  { id: 'spicy-chicken', cat: 'Handhelds', name: 'Spicy Chicken Sandwich', price: 16, desc: 'Buttermilk-fried, calabrian chili mayo, slaw, brioche.', tags: ['spicy', 'popular'], hue: 18, image: u('1606755962773-d324e0a13086') },
  { id: 'brisket-burger', cat: 'Handhelds', name: 'Smoked Brisket Burger', price: 18, desc: 'Dry-aged blend, sharp cheddar, pickled onion, smoked aioli.', tags: ['popular'], hue: 12, image: u('1568901346375-23c9450c58cd') },
  { id: 'mushroom-melt', cat: 'Handhelds', name: 'Roasted Mushroom Melt', price: 14, desc: 'Maitake, gruyère, caramelized onion, sourdough.', tags: ['veg'], hue: 32, image: u('1546793665-c74683f339c1') },
  { id: 'grain-bowl', cat: 'Bowls', name: 'Harvest Grain Bowl', price: 15, desc: 'Farro, charred kale, roast squash, tahini, dukkah.', tags: ['veg'], hue: 85, image: u('1512621776951-a57141f2eefd') },
  { id: 'salmon', cat: 'Bowls', name: 'Chili-Lime Salmon', price: 22, desc: 'Jasmine rice, mango salsa, avocado, cilantro.', tags: ['popular'], hue: 8, image: u('1467003909585-2f8a72700288') },
  { id: 'bbq-tofu', cat: 'Bowls', name: 'Korean BBQ', price: 14, desc: 'Gochujang glaze, jasmine rice, kimchi, sesame.', tags: ['veg', 'spicy'], hue: 4, image: u('1708388064672-6536507fdf6e') },
  { id: 'margherita', cat: 'Wood-Fired', name: 'Margherita', price: 16, desc: 'San Marzano, fior di latte, basil, olive oil.', tags: ['veg', 'popular'], hue: 8, image: u('1565299624946-b28f40a0ae38') },
  { id: 'wild-mushroom', cat: 'Wood-Fired', name: 'Wild Mushroom', price: 18, desc: 'Taleggio, truffle oil, thyme, garlic confit.', tags: ['veg'], hue: 30, image: u('1513104890138-7c749659a591') },
  { id: 'soppressata', cat: 'Wood-Fired', name: 'Hot Soppressata', price: 17, desc: 'Spicy soppressata, ricotta, hot honey, oregano.', tags: ['spicy'], hue: 14, image: u('1574071318508-1cdbab80d002') },
  { id: 'truffle-fries', cat: 'Sides', name: 'Truffle Fries', price: 8, desc: 'Parmesan, parsley, black truffle.', tags: ['veg', 'popular'], hue: 42, image: u('1541592106381-b31e9677c0e5') },
  { id: 'brussels', cat: 'Sides', name: 'Roasted Brussels', price: 9, desc: 'Maple, chili crisp, lemon.', tags: ['veg', 'spicy'], hue: 90, image: u('1576045057995-568f588f82fb') },
  { id: 'salad', cat: 'Sides', name: 'House Salad', price: 7, desc: 'Little gem, radish, sherry vinaigrette.', tags: ['veg'], hue: 110, image: u('1512621776951-a57141f2eefd') },
  { id: 'water', cat: 'Drinks', name: 'Still Water', price: 0, desc: 'Filtered, complimentary.', tags: [], hue: 200, sizes: ['Small', 'Large'], image: u('1719032679635-fe02d53287e4') },
  { id: 'sparkling', cat: 'Drinks', name: 'Sparkling Water', price: 4, desc: 'Acqua Panna, 500ml.', tags: [], hue: 200, image: u('1665893986001-b617592dd717') },
  { id: 'lemonade', cat: 'Drinks', name: 'Viridien Lemonade', price: 5, desc: 'House lemonade, turmeric, ginger.', tags: ['veg', 'popular'], hue: 48, image: u('1695490454828-f8df9109da43') },
  { id: 'cold-brew', cat: 'Drinks', name: 'Cold Brew Coffee', price: 5, desc: 'Slow-steeped, single origin.', tags: [], hue: 24, image: u('1461023058943-07fcbe16d735') },
  { id: 'iced-tea', cat: 'Drinks', name: 'Hibiscus Iced Tea', price: 4, desc: 'Lightly sweetened, mint.', tags: ['veg'], hue: 350, image: u('1556679343-c7306c1976bc') },
  { id: 'red-wine', cat: 'Drinks', name: 'House Red, Glass', price: 12, desc: 'Sangiovese blend, Tuscany.', tags: [], hue: 0, image: u('1510812431401-41d2bd2722f3') },
  { id: 'ipa', cat: 'Drinks', name: 'Local IPA', price: 8, desc: 'Citrus, pine, draft.', tags: [], hue: 50, image: u('1535958636474-b021ee887b13') },
  { id: 'olive-oil-cake', cat: 'Desserts', name: 'Olive Oil Cake', price: 9, desc: 'Citrus glaze, crème fraîche.', tags: ['veg', 'popular'], hue: 50, image: u('1565958011703-44f9829ba187') },
  { id: 'chocolate-tart', cat: 'Desserts', name: 'Bittersweet Chocolate Tart', price: 10, desc: 'Sea salt, olive oil, hazelnut.', tags: ['veg'], hue: 22, image: u('1606313564200-e75d5e30476c') },
];

async function main() {
  await prisma.menuItem.deleteMany();
  for (const item of menu) {
    await prisma.menuItem.create({
      data: {
        ...item,
        tags: JSON.stringify(item.tags),
        sizes: item.sizes ? JSON.stringify(item.sizes) : null,
      },
    });
  }
  console.log(`Seeded ${menu.length} menu items.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
