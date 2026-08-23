import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to durable persistent local store file
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'live-store.json');

// Interface for live store state
interface StoreState {
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    date: string;
    text: string;
    highlight?: string;
    source: 'Google Maps' | 'Instagram' | 'In-App Verified';
    visitType?: string;
    status: 'approved' | 'pending' | 'hidden';
  }>;
  eventBookings: Array<{
    id: string;
    name: string;
    phone: string;
    eventType: 'Birthday Party' | 'Game Tournament' | 'Group Gathering' | 'Corporate/Study';
    estimatedGuests: number;
    preferredDate: string;
    notes?: string;
    status: 'pending' | 'contacted' | 'confirmed' | 'archived';
    createdAt: string;
  }>;
  reservations: Array<{
    id: string;
    name: string;
    phone: string;
    partySize: number;
    preferredDateTime: string;
    preferredGame?: string;
    specialNotes?: string;
    status: 'pending' | 'confirmed' | 'archived' | 'cancelled';
    createdAt: string;
  }>;
  soldOutItemIds: string[];
  dailySpecial: {
    enabled: boolean;
    title: string;
    titleArabic?: string;
    titleFrench?: string;
    subtitle: string;
    linkedItemId?: string;
    specialPrice?: number;
    badge?: string;
  };
  leaderboard: Array<{
    id: string;
    rank: number;
    playerName: string;
    favoriteGame: string;
    wins: number;
    points: number;
    badge: string;
    recentAchievement?: string;
  }>;
  seasonalEnabled: boolean;
  loyaltyCards: Record<string, { stamps: number; referralCode: string; lastUpdated: string }>;
}

const DEFAULT_STORE: StoreState = {
  reviews: [
    {
      id: 'rev-1',
      author: 'Amina B.',
      rating: 5,
      date: '2 weeks ago',
      highlight: 'Cozy, home-like space with adorable resident cats!',
      text: 'A wonderfully warm and welcoming atmosphere. The decor feels genuinely cozy like home, and playing board games while the resident cats snooze nearby was such a great bonus! The fruit teas are super refreshing. Definitely the best hangout spot in Mostaganem.',
      source: 'Google Maps',
      visitType: 'Friends Gathering',
      status: 'approved',
    },
    {
      id: 'rev-2',
      author: 'Yassine M.',
      rating: 5,
      date: '1 month ago',
      highlight: 'Everything about this place — drinks & food — was exceptional.',
      text: 'Returning customer here! The Bueno Takoyaki Waffle is out of this world, and the Mango Fruit Tea with popping boba is our absolute favorite. Outstanding service from the staff and such a chill Asian-inspired aesthetic. We will definitely be back every weekend!',
      source: 'Google Maps',
      visitType: 'Weekend Game Night',
      status: 'approved',
    },
    {
      id: 'rev-3',
      author: 'Sara K.',
      rating: 5,
      date: '3 weeks ago',
      highlight: 'One of the best coffee & boba spots around Mostaganem!',
      text: 'Great hospitality, fast service, and the fruit ades are so invigorating on warm days. The board game collection has something for everyone from quick card games to deep strategy. Highly recommended for couples, groups of friends, and families.',
      source: 'Google Maps',
      visitType: 'Afternoon Tea',
      status: 'approved',
    },
    {
      id: 'rev-4',
      author: 'Rayan D.',
      rating: 5,
      date: '2 months ago',
      highlight: 'Perfect vibe near the tramway station.',
      text: 'Super easy to reach right by the Port tramway station in Salamandre. Loved the dark moody aesthetic and gold lighting. Clean, respectful environment with great prices in DZD. A true gem in Mostaganem!',
      source: 'Google Maps',
      visitType: 'Casual Hangout',
      status: 'approved',
    },
  ],
  eventBookings: [
    {
      id: 'event-demo-1',
      name: 'Nassim Z.',
      phone: '0552148796',
      eventType: 'Birthday Party',
      estimatedGuests: 12,
      preferredDate: 'Saturday, 18:00',
      notes: 'Planning a surprise birthday for 12 friends with Takoyaki waffles and Taro milk tea tower on the Mezzanine lounge.',
      status: 'pending',
      createdAt: 'Today at 14:20',
    },
    {
      id: 'event-demo-2',
      name: 'Walid K.',
      phone: '0663892105',
      eventType: 'Game Tournament',
      estimatedGuests: 16,
      preferredDate: 'Friday, 16:30',
      notes: 'Catan & 7 Wonders tournament session. Need 2 large tables joined together.',
      status: 'contacted',
      createdAt: 'Yesterday at 18:45',
    },
  ],
  reservations: [
    {
      id: 'res-demo-1',
      name: 'Karim L.',
      phone: '0770981234',
      partySize: 4,
      preferredDateTime: 'Tonight at 20:30',
      preferredGame: 'Settlers of Catan',
      specialNotes: 'Window table preferred if available.',
      status: 'pending',
      createdAt: 'Today, 15:10',
    },
    {
      id: 'res-demo-2',
      name: 'Imane S.',
      phone: '0541238970',
      partySize: 6,
      preferredDateTime: 'Tomorrow at 19:00',
      preferredGame: 'Dixit Odyssey',
      specialNotes: 'Celebrating end of exams!',
      status: 'confirmed',
      createdAt: 'Yesterday, 17:30',
    },
  ],
  soldOutItemIds: [],
  dailySpecial: {
    enabled: true,
    title: 'Piña Colada Bleu & Fresh Takoyaki Waffle Special',
    titleArabic: 'عرض اليوم: مشروب بينا كولادا الأزرق مع وافل التاكوياكي الطازج',
    titleFrench: 'Spécial du Jour : Piña Colada Bleu & Gaufre Takoyaki',
    subtitle: 'Order this duo today and get a complimentary extra boba topping or 100 DA off!',
    linkedItemId: 'mojito-pina-colada-bleu',
    specialPrice: 650,
    badge: 'Special Duo Promo',
  },
  leaderboard: [
    {
      id: 'lead-1',
      rank: 1,
      playerName: 'Yassine M.',
      favoriteGame: 'Settlers of Catan',
      wins: 14,
      points: 420,
      badge: 'Grandmaster Strategist',
      recentAchievement: 'Longest Road Victory Streak',
    },
    {
      id: 'lead-2',
      rank: 2,
      playerName: 'Amina B.',
      favoriteGame: 'Exploding Kittens',
      wins: 11,
      points: 330,
      badge: 'Party Game Royalty',
      recentAchievement: 'Defused 5 Bombs in One Match',
    },
    {
      id: 'lead-3',
      rank: 3,
      playerName: 'Rayan D.',
      favoriteGame: 'Codenames',
      wins: 9,
      points: 270,
      badge: 'Master Spymaster',
      recentAchievement: 'Guessed 4 Words on Clue 1',
    },
    {
      id: 'lead-4',
      rank: 4,
      playerName: 'Sara K.',
      favoriteGame: '7 Wonders Duel',
      wins: 8,
      points: 240,
      badge: 'Duelist Champion',
      recentAchievement: 'Military Supremacy Win',
    },
    {
      id: 'lead-5',
      rank: 5,
      playerName: 'Nassim Z.',
      favoriteGame: 'Azul',
      wins: 6,
      points: 180,
      badge: 'Tile Artisan',
      recentAchievement: 'Flawless Wall Completion',
    },
  ],
  seasonalEnabled: false,
  loyaltyCards: {},
};

// In-memory state cache
let store: StoreState = { ...DEFAULT_STORE };

// Load store from disk
function loadStoreFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      store = { ...DEFAULT_STORE, ...parsed };
    } else {
      saveStoreToDisk();
    }
  } catch (err) {
    console.error('Error loading store from disk:', err);
  }
}

// Save store to disk
function saveStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store to disk:', err);
  }
}

loadStoreFromDisk();

/* =========================================================================
   API ROUTES (Shared Backend for Real Cross-Device Synchronization)
   ========================================================================= */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sync All endpoint: Return full state in one request
app.get('/api/live-sync', (req, res) => {
  res.json(store);
});

// Reviews endpoints
app.get('/api/reviews', (req, res) => {
  res.json(store.reviews);
});

app.post('/api/reviews', (req, res) => {
  const { author, rating, text, highlight, source, visitType } = req.body;
  if (!author || !rating || !text) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    author: String(author).trim(),
    rating: Number(rating) || 5,
    date: 'Just now',
    text: String(text).trim(),
    highlight: highlight ? String(highlight).trim() : undefined,
    source: (source || 'In-App Verified') as 'In-App Verified',
    visitType: visitType ? String(visitType).trim() : 'Dine-In & Games',
    status: 'approved' as const,
  };
  store.reviews = [newReview, ...store.reviews];
  saveStoreToDisk();
  res.status(201).json(newReview);
});

app.patch('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const target = store.reviews.find((r) => r.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Review not found' });
  }
  if (status) {
    target.status = status;
  }
  saveStoreToDisk();
  res.json(target);
});

// Event Inquiries endpoints
app.get('/api/event-inquiries', (req, res) => {
  res.json(store.eventBookings);
});

app.post('/api/event-inquiries', (req, res) => {
  const { name, phone, eventType, estimatedGuests, preferredDate, notes } = req.body;
  if (!name || !phone || !preferredDate) {
    return res.status(400).json({ error: 'Missing name, phone or date' });
  }
  const newInquiry = {
    id: `event-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    eventType: eventType || 'Birthday Party',
    estimatedGuests: Number(estimatedGuests) || 8,
    preferredDate: String(preferredDate).trim(),
    notes: notes ? String(notes).trim() : undefined,
    status: 'pending' as const,
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
  store.eventBookings = [newInquiry, ...store.eventBookings];
  saveStoreToDisk();
  res.status(201).json(newInquiry);
});

app.patch('/api/event-inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const target = store.eventBookings.find((b) => b.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Event inquiry not found' });
  }
  if (status) {
    target.status = status;
  }
  saveStoreToDisk();
  res.json(target);
});

app.delete('/api/event-inquiries/:id', (req, res) => {
  const { id } = req.params;
  store.eventBookings = store.eventBookings.filter((b) => b.id !== id);
  saveStoreToDisk();
  res.json({ success: true });
});

// Reservations endpoints
app.get('/api/reservations', (req, res) => {
  res.json(store.reservations);
});

app.post('/api/reservations', (req, res) => {
  const { name, phone, partySize, preferredDateTime, preferredGame, specialNotes } = req.body;
  if (!name || !phone || !preferredDateTime) {
    return res.status(400).json({ error: 'Missing name, phone or dateTime' });
  }
  const newRes = {
    id: `res-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    partySize: Number(partySize) || 2,
    preferredDateTime: String(preferredDateTime).trim(),
    preferredGame: preferredGame ? String(preferredGame).trim() : undefined,
    specialNotes: specialNotes ? String(specialNotes).trim() : undefined,
    status: 'pending' as const,
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
  store.reservations = [newRes, ...store.reservations];
  saveStoreToDisk();
  res.status(201).json(newRes);
});

app.patch('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const target = store.reservations.find((r) => r.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  if (status) {
    target.status = status;
  }
  saveStoreToDisk();
  res.json(target);
});

app.delete('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  store.reservations = store.reservations.filter((r) => r.id !== id);
  saveStoreToDisk();
  res.json({ success: true });
});

// Sold Out Items endpoints
app.get('/api/sold-out', (req, res) => {
  res.json(store.soldOutItemIds);
});

app.post('/api/sold-out', (req, res) => {
  const { itemIds, toggleItemId } = req.body;
  if (Array.isArray(itemIds)) {
    store.soldOutItemIds = itemIds;
  } else if (toggleItemId) {
    const exists = store.soldOutItemIds.includes(toggleItemId);
    if (exists) {
      store.soldOutItemIds = store.soldOutItemIds.filter((id) => id !== toggleItemId);
    } else {
      store.soldOutItemIds = [...store.soldOutItemIds, toggleItemId];
    }
  }
  saveStoreToDisk();
  res.json(store.soldOutItemIds);
});

app.post('/api/sold-out/reset', (req, res) => {
  store.soldOutItemIds = [];
  saveStoreToDisk();
  res.json(store.soldOutItemIds);
});

// Daily Special Banner endpoints
app.get('/api/daily-special', (req, res) => {
  res.json(store.dailySpecial);
});

app.post('/api/daily-special', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    store.dailySpecial = { ...store.dailySpecial, ...req.body };
    saveStoreToDisk();
  }
  res.json(store.dailySpecial);
});

// Leaderboard / Tournament Points endpoints
app.get('/api/leaderboard', (req, res) => {
  res.json(store.leaderboard);
});

app.post('/api/leaderboard', (req, res) => {
  const { playerName, favoriteGame, wins, points, badge } = req.body;
  if (!playerName) {
    return res.status(400).json({ error: 'Player name required' });
  }
  const newEntry = {
    id: `lead-${Date.now()}`,
    rank: store.leaderboard.length + 1,
    playerName: String(playerName).trim(),
    favoriteGame: favoriteGame ? String(favoriteGame).trim() : 'Board Games',
    wins: Number(wins) || 1,
    points: Number(points) || 30,
    badge: badge ? String(badge).trim() : 'Tabletop Competitor',
  };
  const updated = [...store.leaderboard, newEntry]
    .sort((a, b) => b.points - a.points)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
  store.leaderboard = updated;
  saveStoreToDisk();
  res.status(201).json(store.leaderboard);
});

app.patch('/api/leaderboard/:id/win', (req, res) => {
  const { id } = req.params;
  const updated = store.leaderboard
    .map((p) => {
      if (p.id === id) {
        return { ...p, wins: p.wins + 1, points: p.points + 30 };
      }
      return p;
    })
    .sort((a, b) => b.points - a.points)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
  store.leaderboard = updated;
  saveStoreToDisk();
  res.json(store.leaderboard);
});

// Seasonal / Ramadan Hours Mode endpoints
app.get('/api/seasonal-mode', (req, res) => {
  res.json({ enabled: store.seasonalEnabled });
});

app.post('/api/seasonal-mode', (req, res) => {
  const { enabled } = req.body;
  store.seasonalEnabled = Boolean(enabled);
  saveStoreToDisk();
  res.json({ enabled: store.seasonalEnabled });
});

// Loyalty Stamp Card endpoints
app.get('/api/loyalty/:phone', (req, res) => {
  const { phone } = req.params;
  const card = store.loyaltyCards[phone] || {
    stamps: 0,
    referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    lastUpdated: new Date().toISOString(),
  };
  res.json(card);
});

app.post('/api/loyalty/:phone/stamp', (req, res) => {
  const { phone } = req.params;
  const count = Number(req.body.count) || 1;
  const current = store.loyaltyCards[phone] || {
    stamps: 0,
    referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    lastUpdated: new Date().toISOString(),
  };
  const newStamps = Math.min(8, current.stamps + count);
  store.loyaltyCards[phone] = {
    ...current,
    stamps: newStamps,
    lastUpdated: new Date().toISOString(),
  };
  saveStoreToDisk();
  res.json(store.loyaltyCards[phone]);
});

app.post('/api/loyalty/:phone/reset', (req, res) => {
  const { phone } = req.params;
  const current = store.loyaltyCards[phone] || {
    stamps: 0,
    referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    lastUpdated: new Date().toISOString(),
  };
  store.loyaltyCards[phone] = {
    ...current,
    stamps: 0,
    lastUpdated: new Date().toISOString(),
  };
  saveStoreToDisk();
  res.json(store.loyaltyCards[phone]);
});

/* =========================================================================
   VITE & STATIC ASSETS INTEGRATION
   ========================================================================= */

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mister Bubble Server active at http://0.0.0.0:${PORT}`);
  });
}

start();
