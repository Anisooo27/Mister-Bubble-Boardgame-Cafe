export interface CafeEvent {
  id: string;
  title: string;
  titleArabic: string;
  category: 'Community' | 'Gaming' | 'Workshop' | 'Social';
  date: string;
  time: string;
  dayBadge: string;
  description: string;
  highlights: string[];
  entryCost: string;
  status: 'Upcoming' | 'Recurring' | 'Special';
}

export const CAFE_EVENTS: CafeEvent[] = [
  {
    id: 'event-english-session',
    title: 'English Speaking Session',
    titleArabic: 'جلسة محادثة باللغة الإنجليزية',
    category: 'Community',
    date: 'Every Tuesday & Thursday',
    time: '5:30 PM – 7:30 PM',
    dayBadge: 'Bi-Weekly',
    description:
      'Practice conversational English in a warm, relaxed, judgement-free environment. Connect with university students, travelers, and language enthusiasts over iced fruit teas.',
    highlights: ['Free Attendance (Order a drink)', 'All Proficiency Levels Welcome', 'Moderated Fun Icebreakers'],
    entryCost: 'Free with any Drink',
    status: 'Recurring',
  },
  {
    id: 'event-boardgame-duel',
    title: 'Friday Tabletop Game Night',
    titleArabic: 'سهرة ألعاب الطاولة يوم الجمعة',
    category: 'Gaming',
    date: 'Every Friday Evening',
    time: '6:00 PM – 11:30 PM',
    dayBadge: 'Weekly',
    description:
      'Gather your squad or join an open table for Azul, Catan, Ticket to Ride, and party card games. Staff are on hand to explain rules to beginners.',
    highlights: ['50+ Games Available', 'Rules Explainer On-Site', 'Special Waffle Combos'],
    entryCost: 'Free for Dine-In',
    status: 'Recurring',
  },
  {
    id: 'event-manga-boba-meet',
    title: 'Anime & Manga Tea Meetup',
    titleArabic: 'لقاء محبي الأنمي والمانجا وشاي الفقاعات',
    category: 'Social',
    date: 'Monthly Feature',
    time: '4:00 PM – 8:00 PM',
    dayBadge: 'Monthly',
    description:
      'Celebrate Japanese and East Asian pop culture, exchange manga recommendations, and try exclusive seasonal bubble tea flavor pairings under the cozy neon lounge.',
    highlights: ['Themed Boba Specials', 'Trivia & Mini Games', 'Manga Swap Table'],
    entryCost: 'Free Admission',
    status: 'Upcoming',
  },
];
