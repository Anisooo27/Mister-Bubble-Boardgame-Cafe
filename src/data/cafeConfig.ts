/**
 * Mister Bubble Cafe Configuration
 * Central source of truth for cafe hours, contact, services, location, WhatsApp, tables, seasonal hours, and staff demo PIN.
 */

export interface DaySchedule {
  day: string;
  dayArabic: string;
  dayFrench: string;
  hours: string;
  isOpen: boolean;
}

export interface ServiceOption {
  id: string;
  title: string;
  titleArabic: string;
  titleFrench: string;
  description: string;
  descriptionArabic: string;
  descriptionFrench: string;
  badge: string;
  available: boolean;
}

export interface CafeTable {
  id: number;
  label: string;
  labelArabic: string;
  labelFrench: string;
  zone: 'ground' | 'mezzanine' | 'window';
  seats: number;
}

export interface SeasonalModeConfig {
  enabled: boolean;
  name: string;
  nameArabic: string;
  nameFrench: string;
  hours: string;
  hoursArabic: string;
  hoursFrench: string;
  bannerMessage: string;
  bannerMessageArabic: string;
  bannerMessageFrench: string;
  badge: string;
}

export const CAFE_CONFIG = {
  name: 'Mister Bubble Boardgame Cafe',
  nameArabic: 'السيد فقاعة',
  nameFrench: 'Mister Bubble Café & Jeux de Société',
  tagline: 'SIP. PLAY. DELIGHT.',
  taglineArabic: 'ارتشف. العب. استمتع.',
  taglineFrench: 'SAVOUREZ. JOUEZ. DÉCOUVREZ.',
  type: 'Asian-themed bubble tea & board game café',
  rating: 4.9,
  reviewCount: 49,
  priceRange: '1–1,000 DZD per person',
  
  // WhatsApp ordering fallback number (Standard Algerian format without + sign for wa.me)
  whatsappNumber: '213550123456',
  whatsappDisplay: '+213 550 12 34 56',
  
  // Staff Portal access PIN gate (Centralized for easy updating by cafe owner)
  staffPin: '7788',
  staffDemoPin: '7788',

  instagramHandle: '@misterbubble.dz',
  instagramUrl: 'https://www.instagram.com/misterbubble.dz/',
  googleMapsUrl: 'https://maps.app.goo.gl/4N8Emd2rZtxoBgHQ6',
  googleMapsQuery: 'Mister+Bubble+Boardgame+Cafe+Salamandre+Mostaganem',
  
  location: {
    address: 'Salamandre (near Tramway Port Station)',
    addressArabic: 'مستغانم، صلامندر، محطة الميناء ترامواي',
    addressFrench: 'Salamandre (près de la Station Tramway Port)',
    plusCode: 'W3CC+77H',
    city: 'Mostaganem',
    postalCode: '27000',
    country: 'Algeria',
    geoCoordinates: {
      latitude: 35.933333,
      longitude: 0.071667,
    },
    directionsHint: 'Directly facing the arches, 2 minutes walk from the Port Tramway Station in Salamandre.',
    directionsHintArabic: 'أمام الأقواس مباشرة، على بعد دقيقتين سيراً على الأقدام من محطة ترامواي الميناء في صلامندر.',
    directionsHintFrench: 'Directement en face des arcades, à 2 minutes à pied de la station de tramway Port à Salamandre.',
  },
  
  // Default year-round schedule
  hoursSummary: '9:00 AM – 12:00 AM Daily',
  hoursSummaryArabic: 'يومياً من 9:00 صباحاً حتى منتصف الليل',
  hoursSummaryFrench: 'Tous les jours de 9h00 à 00h00',
  
  hoursSchedule: [
    { day: 'Monday', dayArabic: 'الإثنين', dayFrench: 'Lundi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Tuesday', dayArabic: 'الثلاثاء', dayFrench: 'Mardi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Wednesday', dayArabic: 'الأربعاء', dayFrench: 'Mercredi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Thursday', dayArabic: 'الخميس', dayFrench: 'Jeudi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Friday', dayArabic: 'الجمعة', dayFrench: 'Vendredi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Saturday', dayArabic: 'السبت', dayFrench: 'Samedi', hours: '9:00 AM – 12:00 AM', isOpen: true },
    { day: 'Sunday', dayArabic: 'الأحد', dayFrench: 'Dimanche', hours: '9:00 AM – 12:00 AM', isOpen: true },
  ] as DaySchedule[],

  // Phase 4: Seasonal / Ramadan-Aware Hours Override
  seasonalMode: {
    enabled: false,
    name: 'Ramadan Nights & Sahoor Hours',
    nameArabic: 'سهرات رمضان المبارك وساعات السحور',
    nameFrench: 'Soirées de Ramadan & Horaires de Sahoor',
    hours: '8:00 PM – 2:30 AM Daily',
    hoursArabic: 'يومياً من 8:00 مساءً حتى 2:30 صباحاً (السحور)',
    hoursFrench: 'Tous les jours de 20h00 à 02h30',
    bannerMessage: '🌙 Ramadan Kareem! Adjusted evening & sahoor opening hours in effect.',
    bannerMessageArabic: '🌙 رمضان مبارك! مواعيد السهرات الرمضانية والسحور من 8:00 مساءً حتى 2:30 صباحاً.',
    bannerMessageFrench: '🌙 Ramadan Moubarak ! Horaires spéciaux de soirée et sahoor de 20h00 à 02h30.',
    badge: 'Ramadan Hours',
  } as SeasonalModeConfig,

  // Phase 4: Configurable Table Tents (Tables 1-12)
  tables: [
    { id: 1, label: 'Table 1', labelArabic: 'طاولة 1', labelFrench: 'Table 1', zone: 'window', seats: 2 },
    { id: 2, label: 'Table 2', labelArabic: 'طاولة 2', labelFrench: 'Table 2', zone: 'window', seats: 2 },
    { id: 3, label: 'Table 3', labelArabic: 'طاولة 3', labelFrench: 'Table 3', zone: 'ground', seats: 4 },
    { id: 4, label: 'Table 4', labelArabic: 'طاولة 4', labelFrench: 'Table 4', zone: 'ground', seats: 4 },
    { id: 5, label: 'Table 5', labelArabic: 'طاولة 5', labelFrench: 'Table 5', zone: 'ground', seats: 6 },
    { id: 6, label: 'Table 6 (Big Boardgame Table)', labelArabic: 'طاولة 6 (طاولة الألعاب الكبرى)', labelFrench: 'Table 6 (Grande Table Jeux)', zone: 'ground', seats: 8 },
    { id: 7, label: 'Table 7 (Mezzanine Cozy)', labelArabic: 'طاولة 7 (ميزانين دافئ)', labelFrench: 'Table 7 (Mezzanine Cosy)', zone: 'mezzanine', seats: 2 },
    { id: 8, label: 'Table 8 (Mezzanine Wisteria)', labelArabic: 'طاولة 8 (تحت أزهار الويستيريا)', labelFrench: 'Table 8 (Sous Glycines)', zone: 'mezzanine', seats: 4 },
    { id: 9, label: 'Table 9 (Mezzanine Corner)', labelArabic: 'طاولة 9 (ركن الميزانين الهادئ)', labelFrench: 'Table 9 (Coin Calme)', zone: 'mezzanine', seats: 4 },
    { id: 10, label: 'Table 10 (Neon Lounge)', labelArabic: 'طاولة 10 (ركن النيون)', labelFrench: 'Table 10 (Salon Néon)', zone: 'ground', seats: 4 },
    { id: 11, label: 'Table 11 (Cat Tree Nook)', labelArabic: 'طاولة 11 (بجوار ركن القطط)', labelFrench: 'Table 11 (Coin Chats)', zone: 'ground', seats: 2 },
    { id: 12, label: 'Table 12 (Mezzanine Squad)', labelArabic: 'طاولة 12 (شلة الميزانين)', labelFrench: 'Table 12 (Équipe Mezzanine)', zone: 'mezzanine', seats: 6 },
  ] as CafeTable[],

  // Service options confirmed on Google Business
  services: [
    {
      id: 'dine-in',
      title: 'Dine-In & Play',
      titleArabic: 'تناول في المقهى ولعب ألعاب الطاولة',
      titleFrench: 'Sur Place & Jeux de Société',
      description: 'Relax in our cozy ground-floor or mezzanine lounge with free access to 50+ board games.',
      descriptionArabic: 'استرخ في صالتنا الدافئة أو الميزانين مع دخول مجاني لأكثر من 50 لعبة طاولة.',
      descriptionFrench: 'Détendez-vous dans notre salon chaleureux ou mezzanine avec accès gratuit à plus de 50 jeux.',
      badge: 'Free Games',
      available: true,
    },
    {
      id: 'pickup',
      title: 'Drive-Through & Pickup',
      titleArabic: 'طلب خارجي واستلام سريع',
      titleFrench: 'À Emporter & Drive',
      description: 'Order your bubble tea and takoyaki waffles ahead for quick curbside or counter pickup.',
      descriptionArabic: 'اطلب شاي البوبا والوافل مسبقاً لاستلام سريع عند الكاونتر أو السيارة.',
      descriptionFrench: 'Commandez vos bubble teas et gaufres takoyaki à l’avance pour un retrait rapide.',
      badge: 'Fast Pickup',
      available: true,
    },
    {
      id: 'delivery',
      title: 'Contactless Delivery',
      titleArabic: 'توصيل للمنازل بدون تلامس',
      titleFrench: 'Livraison Sans Contact',
      description: 'Freshly sealed bubble teas and warm crêpes delivered to your doorstep in Mostaganem.',
      descriptionArabic: 'شاي بوبا محكم الإغلاق ووافل طازج يصلك حتى باب منزلك في مستغانم.',
      descriptionFrench: 'Bubble teas scellés et gaufres chaudes livrés directement chez vous à Mostaganem.',
      badge: 'Salamandre & City',
      available: true,
    },
  ] as ServiceOption[],
};
