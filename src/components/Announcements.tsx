import React, { useState, useEffect } from 'react';
import { AnnouncementItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Megaphone, Calendar, Tag, Sparkles, Pin, Flame, ChevronRight } from 'lucide-react';

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    date: 'March 2026',
    category: 'Holiday',
    title: '🌙 Ramadan Nights & Sahoor Special Schedule',
    titleArabic: '🌙 مواعيد سهرات رمضان المبارك والسحور في مستر بابل',
    titleFrench: '🌙 Soirées de Ramadan & Horaires Spéciaux de Sahoor',
    content: 'Join us every night from 8:00 PM to 2:30 AM for cozy tabletop games, hot fresh crêpes, and sealed fruit teas before sahoor.',
    contentArabic: 'نسعد باستقبالكم يومياً طيلة الشهر الفضيل من 8:00 مساءً حتى 2:30 صباحاً للسهرات وجلسات الألعاب وتناول السحور.',
    contentFrench: 'Rejoignez-nous chaque soir de 20h00 à 02h30 pour vos parties de jeux et boissons scellées avant le sahoor.',
    pinned: true,
  },
  {
    id: 'ann-2',
    date: 'Spring 2026',
    category: 'Drink Drop',
    title: '🍍 New Series Drop: Sparkling Blue Piña Colada & Fruit Boxes',
    titleArabic: '🍍 تشكيلة جديدة: موهيتو بينا كولادا الأزرق وعلب الفواكه للمشاركة',
    titleFrench: '🍍 Nouvelle Gamme : Piña Colada Bleu & Boîtes de Fruits',
    content: 'Introducing our refreshing Piña Colada Bleu (500 DA) and 3 sharing fruit box sizes with chocolate dip for group gaming tables.',
    contentArabic: 'اكتشفوا مشروب بينا كولادا الأزرق الجديد وعلب الفواكه الفاخرة المشكلة مع صوص الشوكولاتة الذائبة.',
    contentFrench: 'Découvrez notre nouvelle Piña Colada Bleu et les boîtes de fruits frais à partager avec dip chocolat.',
    pinned: true,
  },
  {
    id: 'ann-3',
    date: 'Weekly Event',
    category: 'Tournament',
    title: '🏆 Friday Night Catan Championship (Salamandre League)',
    titleArabic: '🏆 دوري الجمعة لبطولة كاتان (دوري صلامندر)',
    titleFrench: '🏆 Tournoi Catan du Vendredi Soir (Ligue Salamandre)',
    content: 'Compete for the Mister Bubble Grandmaster Trophy and win 3 Free Bubble Teas! Register at the counter or in the Looking For Players board.',
    contentArabic: 'تنافس على كأس مستر بابل لبطولة كاتان واربح 3 مشروبات بوبا مجانية! سجل اسمك عند الكاونتر.',
    contentFrench: 'Affrontez les meilleurs joueurs et remportez le trophée + 3 Bubble Teas offerts ! Inscription au comptoir.',
    pinned: false,
  },
];

export const Announcements: React.FC = () => {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mb_announcements');
      if (saved) {
        setAnnouncements(JSON.parse(saved));
      } else {
        localStorage.setItem('mb_announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Holiday':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
      case 'Drink Drop':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
      case 'Tournament':
        return 'bg-red-950/70 text-red-300 border-red-500/40';
      default:
        return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <section id="announcements" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e1c2e] border border-[#ffcc33]/40 text-[#ffcc33] text-xs font-semibold mb-2">
              <Megaphone className="w-3.5 h-3.5" />
              <span>CAFÉ BULLETIN &amp; UPDATES</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide">
              {t('announcements.title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-xl mt-1">
              {t('announcements.subtitle')}
            </p>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => {
            const title =
              language === 'ar' && ann.titleArabic
                ? ann.titleArabic
                : language === 'fr' && ann.titleFrench
                ? ann.titleFrench
                : ann.title;

            const content =
              language === 'ar' && ann.contentArabic
                ? ann.contentArabic
                : language === 'fr' && ann.contentFrench
                ? ann.contentFrench
                : ann.content;

            return (
              <div
                key={ann.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  ann.pinned
                    ? 'bg-gradient-to-b from-[#1c1a2d] to-[#141420] border-[#ffcc33]/60 shadow-xl shadow-amber-950/20'
                    : 'bg-[#151522] border-[#2a2a3e] hover:border-[#3d3d58]'
                }`}
              >
                {ann.pinned && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold font-mono text-[#ffcc33] bg-[#2a2238] px-2.5 py-0.5 rounded-full border border-[#ffcc33]/40">
                    <Pin className="w-3 h-3 text-[#ffcc33]" />
                    <span>PINNED</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold font-bebas tracking-wider ${getCategoryBadgeClass(
                        ann.category
                      )}`}
                    >
                      {ann.category.toUpperCase()}
                    </span>

                    <span className="text-[11px] text-[#9ca3af] flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{ann.date}</span>
                    </span>
                  </div>

                  <h3 className="font-bebas text-2xl text-white tracking-wide leading-tight mb-2">
                    {title}
                  </h3>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#262638] flex items-center justify-between text-[11px] text-[#ffcc33] font-semibold">
                  <span>Mister Bubble Mostaganem</span>
                  <a href="#menu" className="flex items-center gap-1 hover:underline">
                    <span>View in Café</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
