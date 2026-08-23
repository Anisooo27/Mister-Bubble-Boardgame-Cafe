export type MenuCategoryId =
  | 'drinks'
  | 'frappes'
  | 'takoyaki-waffle'
  | 'bubble-waffle'
  | 'crepes'
  | 'milk-tea'
  | 'fruit-tea'
  | 'ade'
  | 'fresh-juice'
  | 'bottled-canned'
  | 'mojito'
  | 'fruit-box'
  | 'combo';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryId;
  price: number | { regular: number; large: number };
  description: string;
  image?: string;
  imageFilename?: string;
  isPopular?: boolean;
  isHouseSpecial?: boolean;
  tags?: string[];
  volume?: string;
  ingredients?: string[];
}

export interface ComboDeal {
  id: string;
  name: string;
  nameArabic: string;
  nameFrench: string;
  description: string;
  descriptionArabic: string;
  descriptionFrench: string;
  includedItemNames: string[];
  price: number;
  originalPrice: number;
  savingsBadge: string;
  savingsBadgeArabic: string;
  savingsBadgeFrench: string;
  popular?: boolean;
  tags: string[];
  imageFilename?: string;
}

export interface MenuCategory {
  id: MenuCategoryId;
  title: string;
  titleArabic?: string;
  subtitle: string;
  bannerGradient: string;
  bannerTextColor?: string;
  accentColor: string;
}

export interface BoardGame {
  id: string;
  title: string;
  category: 'Strategy' | 'Party & Social' | 'Card Games' | 'Family Classics' | '2-Player Duels';
  players: string;
  duration: string;
  complexity: 'Easy' | 'Medium' | 'Challenging';
  description: string;
  popular?: boolean;
  tags: string[];
}

export interface PlayerPost {
  id: string;
  author: string;
  gameName: string;
  seatsNeeded: number;
  timeDescription: string;
  notes?: string;
  createdAt: string;
  isUserCreated?: boolean;
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

export interface GalleryItem {
  id: string;
  title: string;
  category: 'vibe' | 'drinks' | 'waffles' | 'gaming' | 'cats';
  caption: string;
  imageUrl: string;
  aspect?: 'landscape' | 'portrait' | 'square';
}

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

export interface TrayItem {
  item: MenuItem;
  size?: 'regular' | 'large';
  sweetness?: string;
  iceLevel?: string;
  toppings?: string[];
  quantity: number;
  calculatedPrice: number;
}

export type OrderType = 'dine-in' | 'pickup' | 'delivery';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  pickupTime?: string;
  deliveryAddress?: string;
  specialNotes?: string;
  referralCode?: string;
  perkApplied?: string;
  items: TrayItem[];
  subtotal: number;
  total: number;
  timestamp: string;
  status: 'placed' | 'preparing' | 'ready' | 'completed';
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

export interface AnnouncementItem {
  id: string;
  date: string;
  category: 'Drink Drop' | 'Tournament' | 'Holiday' | 'Community';
  title: string;
  titleArabic?: string;
  titleFrench?: string;
  content: string;
  contentArabic?: string;
  contentFrench?: string;
  imageFilename?: string;
  pinned?: boolean;
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

export interface LoyaltyBadge {
  id: string;
  title: string;
  titleArabic: string;
  titleFrench: string;
  description: string;
  descriptionArabic: string;
  descriptionFrench: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type AppLanguage = 'en' | 'fr' | 'ar';
