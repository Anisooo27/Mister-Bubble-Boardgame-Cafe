import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import { ReviewItem, EventBooking, TableReservation, DailySpecial, LeaderboardEntry } from '../types';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || '';
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export const redis = new Redis({
  url: url.startsWith('http') ? url : `https://${url}`,
  token: token,
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
