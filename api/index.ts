import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

// Load environment variables (.env.local for local dev, injected directly on Vercel)
dotenv.config({ path: '.env.local' });
dotenv.config();

/* =========================================================================
   TYPES
   ========================================================================= */

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  highlight?: string;
  source: 'Google Maps' | 'Instagram' | 'In-App Verified';
  visitType?: string;
  status?: 'approved' | 'pending' | 'hidden';
}

export interface EventBooking {
  id: string;
  name: string;
  phone: string;
  eventType: 'Birthday Party' | 'Game Tournament' | 'Group Gathering' | 'Corporate/Study';
  estimatedGuests: number;
  preferredDate: string;
  notes?: string;
  status?: 'pending' | 'contacted' | 'confirmed' | 'archived';
  createdAt: string;
}

export interface TableReservation {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  preferredDateTime: string;
  preferredGame?: string;
  specialNotes?: string;
  status: 'pending' | 'confirmed' | 'archived' | 'cancelled';
  createdAt: string;
}

export interface DailySpecial {
  enabled: boolean;
  title: string;
  titleArabic?: string;
  titleFrench?: string;
  subtitle: string;
  linkedItemId?: string;
  specialPrice?: number;
  badge?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  playerName: string;
  favoriteGame: string;
  wins: number;
  points: number;
  badge: string;
  recentAchievement?: string;
}

/* =========================================================================
   UPSTASH REDIS CLIENT & CONSTANTS
   ========================================================================= */

const rawUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || '';
const rawToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export const redis = new Redis({
  url: rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`,
  token: rawToken,
});

export const REDIS_KEYS = {
  REVIEWS: 'mb_custom_reviews',
  RESERVATIONS: 'mb_reservations',
  EVENT_BOOKINGS: 'mb_event_bookings',
  SOLD_OUT_ITEMS: 'mb_sold_out_items',
  LEADERBOARD: 'mb_leaderboard',
  DAILY_SPECIAL: 'mb_daily_special',
  SEASONAL_MODE: 'mb_seasonal_mode',
  LOYALTY_PREFIX: 'mb_loyalty:',
} as const;

export const DEFAULT_REVIEWS: ReviewItem[] = [
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
];

export const DEFAULT_EVENT_BOOKINGS: EventBooking[] = [
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
];

export const DEFAULT_RESERVATIONS: TableReservation[] = [
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
];

export const DEFAULT_DAILY_SPECIAL: DailySpecial = {
  enabled: true,
  title: 'Piña Colada Bleu & Fresh Takoyaki Waffle Special',
  titleArabic: 'عرض اليوم: مشروب بينا كولادا الأزرق مع وافل التاكوياكي الطازج',
  titleFrench: 'Spécial du Jour : Piña Colada Bleu & Gaufre Takoyaki',
  subtitle: 'Order this duo today and get a complimentary extra boba topping or 100 DA off!',
  linkedItemId: 'mojito-pina-colada-bleu',
  specialPrice: 650,
  badge: 'Special Duo Promo',
};

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
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
];

/* =========================================================================
   REDIS STORE HELPERS (With graceful fallbacks)
   ========================================================================= */

async function getReviewsFromStore(): Promise<ReviewItem[]> {
  try {
    const data = await redis.get<ReviewItem[]>(REDIS_KEYS.REVIEWS);
    if (Array.isArray(data) && data.length > 0) return data;
    await redis.set(REDIS_KEYS.REVIEWS, DEFAULT_REVIEWS);
    return DEFAULT_REVIEWS;
  } catch (err) {
    console.error('Redis getReviews error:', err);
    return DEFAULT_REVIEWS;
  }
}

async function getEventBookingsFromStore(): Promise<EventBooking[]> {
  try {
    const data = await redis.get<EventBooking[]>(REDIS_KEYS.EVENT_BOOKINGS);
    if (Array.isArray(data) && data.length > 0) return data;
    await redis.set(REDIS_KEYS.EVENT_BOOKINGS, DEFAULT_EVENT_BOOKINGS);
    return DEFAULT_EVENT_BOOKINGS;
  } catch (err) {
    console.error('Redis getEventBookings error:', err);
    return DEFAULT_EVENT_BOOKINGS;
  }
}

async function getReservationsFromStore(): Promise<TableReservation[]> {
  try {
    const data = await redis.get<TableReservation[]>(REDIS_KEYS.RESERVATIONS);
    if (Array.isArray(data) && data.length > 0) return data;
    await redis.set(REDIS_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
    return DEFAULT_RESERVATIONS;
  } catch (err) {
    console.error('Redis getReservations error:', err);
    return DEFAULT_RESERVATIONS;
  }
}

async function getSoldOutItemIdsFromStore(): Promise<string[]> {
  try {
    const data = await redis.get<string[]>(REDIS_KEYS.SOLD_OUT_ITEMS);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Redis getSoldOutItemIds error:', err);
    return [];
  }
}

async function getDailySpecialFromStore(): Promise<DailySpecial> {
  try {
    const data = await redis.get<DailySpecial>(REDIS_KEYS.DAILY_SPECIAL);
    if (data && typeof data === 'object' && data.title) return data;
    await redis.set(REDIS_KEYS.DAILY_SPECIAL, DEFAULT_DAILY_SPECIAL);
    return DEFAULT_DAILY_SPECIAL;
  } catch (err) {
    console.error('Redis getDailySpecial error:', err);
    return DEFAULT_DAILY_SPECIAL;
  }
}

async function getLeaderboardFromStore(): Promise<LeaderboardEntry[]> {
  try {
    const data = await redis.get<LeaderboardEntry[]>(REDIS_KEYS.LEADERBOARD);
    if (Array.isArray(data) && data.length > 0) return data;
    await redis.set(REDIS_KEYS.LEADERBOARD, DEFAULT_LEADERBOARD);
    return DEFAULT_LEADERBOARD;
  } catch (err) {
    console.error('Redis getLeaderboard error:', err);
    return DEFAULT_LEADERBOARD;
  }
}

async function getSeasonalModeFromStore(): Promise<boolean> {
  try {
    const data = await redis.get<boolean>(REDIS_KEYS.SEASONAL_MODE);
    return Boolean(data);
  } catch (err) {
    console.error('Redis getSeasonalMode error:', err);
    return false;
  }
}

/* =========================================================================
   EXPRESS SERVERLESS APP
   ========================================================================= */

export const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Full state live-sync endpoint for Staff Portal & App state
app.get('/api/live-sync', async (req, res) => {
  try {
    const [reviews, eventBookings, reservations, soldOutItemIds, dailySpecial, leaderboard, seasonalEnabled] =
      await Promise.all([
        getReviewsFromStore(),
        getEventBookingsFromStore(),
        getReservationsFromStore(),
        getSoldOutItemIdsFromStore(),
        getDailySpecialFromStore(),
        getLeaderboardFromStore(),
        getSeasonalModeFromStore(),
      ]);

    res.json({
      reviews,
      eventBookings,
      reservations,
      soldOutItemIds,
      dailySpecial,
      leaderboard,
      seasonalEnabled,
    });
  } catch (error) {
    console.error('Live-sync error:', error);
    res.status(500).json({ error: 'Failed to retrieve live sync state' });
  }
});

// 1. Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  const reviews = await getReviewsFromStore();
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const { author, rating, text, highlight, source, visitType } = req.body;
  if (!author || !rating || !text) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }
  const newReview: ReviewItem = {
    id: `rev-${Date.now()}`,
    author: String(author).trim(),
    rating: Number(rating) || 5,
    date: 'Just now',
    text: String(text).trim(),
    highlight: highlight ? String(highlight).trim() : undefined,
    source: (source || 'In-App Verified') as 'In-App Verified',
    visitType: visitType ? String(visitType).trim() : 'Dine-In & Games',
    status: 'approved',
  };

  try {
    const current = await getReviewsFromStore();
    const updated = [newReview, ...current];
    await redis.set(REDIS_KEYS.REVIEWS, updated);
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review to Redis:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

app.patch('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const current = await getReviewsFromStore();
    const target = current.find((r) => r.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (status) {
      target.status = status;
    }
    await redis.set(REDIS_KEYS.REVIEWS, current);
    res.json(target);
  } catch (error) {
    console.error('Error updating review status in Redis:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// 2. Event Inquiries endpoints
app.get('/api/event-inquiries', async (req, res) => {
  const bookings = await getEventBookingsFromStore();
  res.json(bookings);
});

app.post('/api/event-inquiries', async (req, res) => {
  const { name, phone, eventType, estimatedGuests, preferredDate, notes } = req.body;
  if (!name || !phone || !preferredDate) {
    return res.status(400).json({ error: 'Missing name, phone or date' });
  }
  const newInquiry: EventBooking = {
    id: `event-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    eventType: eventType || 'Birthday Party',
    estimatedGuests: Number(estimatedGuests) || 8,
    preferredDate: String(preferredDate).trim(),
    notes: notes ? String(notes).trim() : undefined,
    status: 'pending',
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };

  try {
    const current = await getEventBookingsFromStore();
    const updated = [newInquiry, ...current];
    await redis.set(REDIS_KEYS.EVENT_BOOKINGS, updated);
    res.status(201).json(newInquiry);
  } catch (error) {
    console.error('Error adding event booking to Redis:', error);
    res.status(500).json({ error: 'Failed to save event booking' });
  }
});

app.patch('/api/event-inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const current = await getEventBookingsFromStore();
    const target = current.find((b) => b.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Event inquiry not found' });
    }
    if (status) {
      target.status = status;
    }
    await redis.set(REDIS_KEYS.EVENT_BOOKINGS, current);
    res.json(target);
  } catch (error) {
    console.error('Error updating event booking status:', error);
    res.status(500).json({ error: 'Failed to update event booking' });
  }
});

app.delete('/api/event-inquiries/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const current = await getEventBookingsFromStore();
    const updated = current.filter((b) => b.id !== id);
    await redis.set(REDIS_KEYS.EVENT_BOOKINGS, updated);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event booking:', error);
    res.status(500).json({ error: 'Failed to delete event booking' });
  }
});

// 3. Reservations endpoints
app.get('/api/reservations', async (req, res) => {
  const list = await getReservationsFromStore();
  res.json(list);
});

app.post('/api/reservations', async (req, res) => {
  const { name, phone, partySize, preferredDateTime, preferredGame, specialNotes } = req.body;
  if (!name || !phone || !preferredDateTime) {
    return res.status(400).json({ error: 'Missing name, phone or dateTime' });
  }
  const newRes: TableReservation = {
    id: `res-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    partySize: Number(partySize) || 2,
    preferredDateTime: String(preferredDateTime).trim(),
    preferredGame: preferredGame ? String(preferredGame).trim() : undefined,
    specialNotes: specialNotes ? String(specialNotes).trim() : undefined,
    status: 'pending',
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };

  try {
    const current = await getReservationsFromStore();
    const updated = [newRes, ...current];
    await redis.set(REDIS_KEYS.RESERVATIONS, updated);
    res.status(201).json(newRes);
  } catch (error) {
    console.error('Error adding reservation to Redis:', error);
    res.status(500).json({ error: 'Failed to save reservation' });
  }
});

app.patch('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const current = await getReservationsFromStore();
    const target = current.find((r) => r.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    if (status) {
      target.status = status;
    }
    await redis.set(REDIS_KEYS.RESERVATIONS, current);
    res.json(target);
  } catch (error) {
    console.error('Error updating reservation in Redis:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const current = await getReservationsFromStore();
    const updated = current.filter((r) => r.id !== id);
    await redis.set(REDIS_KEYS.RESERVATIONS, updated);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// 4. Sold Out Items endpoints
app.get('/api/sold-out', async (req, res) => {
  const ids = await getSoldOutItemIdsFromStore();
  res.json(ids);
});

app.post('/api/sold-out', async (req, res) => {
  const { itemIds, toggleItemId } = req.body;

  try {
    let current = await getSoldOutItemIdsFromStore();
    if (Array.isArray(itemIds)) {
      current = itemIds;
    } else if (toggleItemId) {
      const exists = current.includes(toggleItemId);
      if (exists) {
        current = current.filter((id) => id !== toggleItemId);
      } else {
        current = [...current, toggleItemId];
      }
    }
    await redis.set(REDIS_KEYS.SOLD_OUT_ITEMS, current);
    res.json(current);
  } catch (error) {
    console.error('Error updating sold out items:', error);
    res.status(500).json({ error: 'Failed to update sold out items' });
  }
});

app.post('/api/sold-out/reset', async (req, res) => {
  try {
    await redis.set(REDIS_KEYS.SOLD_OUT_ITEMS, []);
    res.json([]);
  } catch (error) {
    console.error('Error resetting sold out items:', error);
    res.status(500).json({ error: 'Failed to reset sold out items' });
  }
});

// 5. Daily Special endpoints
app.get('/api/daily-special', async (req, res) => {
  const special = await getDailySpecialFromStore();
  res.json(special);
});

app.post('/api/daily-special', async (req, res) => {
  try {
    const current = await getDailySpecialFromStore();
    const updated = { ...current, ...req.body };
    await redis.set(REDIS_KEYS.DAILY_SPECIAL, updated);
    res.json(updated);
  } catch (error) {
    console.error('Error saving daily special:', error);
    res.status(500).json({ error: 'Failed to save daily special' });
  }
});

// 6. Leaderboard endpoints
app.get('/api/leaderboard', async (req, res) => {
  const list = await getLeaderboardFromStore();
  res.json(list);
});

app.post('/api/leaderboard', async (req, res) => {
  const { playerName, favoriteGame, wins, points, badge } = req.body;
  if (!playerName) {
    return res.status(400).json({ error: 'Player name required' });
  }
  const newEntry: LeaderboardEntry = {
    id: `lead-${Date.now()}`,
    rank: 1,
    playerName: String(playerName).trim(),
    favoriteGame: favoriteGame ? String(favoriteGame).trim() : 'Board Games',
    wins: Number(wins) || 1,
    points: Number(points) || 30,
    badge: badge ? String(badge).trim() : 'Tabletop Competitor',
  };

  try {
    const current = await getLeaderboardFromStore();
    const updated = [...current, newEntry]
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    await redis.set(REDIS_KEYS.LEADERBOARD, updated);
    res.status(201).json(updated);
  } catch (error) {
    console.error('Error saving player to leaderboard:', error);
    res.status(500).json({ error: 'Failed to save leaderboard player' });
  }
});

app.patch('/api/leaderboard/:id/win', async (req, res) => {
  const { id } = req.params;

  try {
    const current = await getLeaderboardFromStore();
    const updated = current
      .map((p) => {
        if (p.id === id) {
          return { ...p, wins: p.wins + 1, points: p.points + 30 };
        }
        return p;
      })
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    await redis.set(REDIS_KEYS.LEADERBOARD, updated);
    res.json(updated);
  } catch (error) {
    console.error('Error updating player win:', error);
    res.status(500).json({ error: 'Failed to increment player win' });
  }
});

// 7. Seasonal Mode endpoints
app.get('/api/seasonal-mode', async (req, res) => {
  const enabled = await getSeasonalModeFromStore();
  res.json({ enabled });
});

app.post('/api/seasonal-mode', async (req, res) => {
  const { enabled } = req.body;
  try {
    const val = Boolean(enabled);
    await redis.set(REDIS_KEYS.SEASONAL_MODE, val);
    res.json({ enabled: val });
  } catch (error) {
    console.error('Error setting seasonal mode:', error);
    res.status(500).json({ error: 'Failed to save seasonal mode' });
  }
});

// 8. Loyalty Stamp Card endpoints
app.get('/api/loyalty/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const key = `${REDIS_KEYS.LOYALTY_PREFIX}${phone}`;
    const card = await redis.get<{ stamps: number; referralCode: string; lastUpdated: string }>(key);
    if (card) {
      return res.json(card);
    }
    const defaultCard = {
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
      lastUpdated: new Date().toISOString(),
    };
    res.json(defaultCard);
  } catch (error) {
    console.error('Error fetching loyalty card:', error);
    res.json({
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
      lastUpdated: new Date().toISOString(),
    });
  }
});

app.post('/api/loyalty/:phone/stamp', async (req, res) => {
  const { phone } = req.params;
  const count = Number(req.body.count) || 1;

  try {
    const key = `${REDIS_KEYS.LOYALTY_PREFIX}${phone}`;
    const current = (await redis.get<{ stamps: number; referralCode: string; lastUpdated: string }>(key)) || {
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
      lastUpdated: new Date().toISOString(),
    };
    const newStamps = Math.min(8, current.stamps + count);
    const updated = {
      ...current,
      stamps: newStamps,
      lastUpdated: new Date().toISOString(),
    };
    await redis.set(key, updated);
    res.json(updated);
  } catch (error) {
    console.error('Error adding loyalty stamp:', error);
    res.status(500).json({ error: 'Failed to update loyalty stamps' });
  }
});

app.post('/api/loyalty/:phone/reset', async (req, res) => {
  const { phone } = req.params;

  try {
    const key = `${REDIS_KEYS.LOYALTY_PREFIX}${phone}`;
    const updated = {
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
      lastUpdated: new Date().toISOString(),
    };
    await redis.set(key, updated);
    res.json(updated);
  } catch (error) {
    console.error('Error resetting loyalty card:', error);
    res.status(500).json({ error: 'Failed to reset loyalty card' });
  }
});

export default app;
