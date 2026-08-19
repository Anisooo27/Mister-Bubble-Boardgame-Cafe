import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MonsteraLeaf } from './MonsteraLeaf';
import {
  Star,
  MapPin,
  Clock,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Utensils,
  Car,
  Bike,
  Calendar,
  Flame,
  Moon,
  ArrowRight,
  Gift
} from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { DailySpecial } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenTray?: () => void;
  onAddItemDirect?: (itemId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTray, onAddItemDirect }) => {
  const { t, isRTL, language } = useLanguage();
  const [dailySpecial, setDailySpecial] = useState<DailySpecial | null>(null);
  const [isSeasonalActive, setIsSeasonalActive] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Daily special
      const savedSpecial = localStorage.getItem('mb_daily_special');
      if (savedSpecial) {
        setDailySpecial(JSON.parse(savedSpecial));
      } else {
        // Default special
        setDailySpecial({
          enabled: true,
          title: 'Piña Colada Bleu & Fresh Takoyaki Waffle Special',
          titleArabic: 'عرض اليوم: مشروب بينا كولادا الأزرق مع وافل التاكوياكي الطازج',
          titleFrench: 'Spécial du Jour : Piña Colada Bleu & Gaufre Takoyaki',
          subtitle: 'Order this duo today and get a complimentary extra boba topping or 100 DA off!',
          linkedItemId: 'mojito-pina-colada-bleu',
          specialPrice: 650,
          badge: 'Special Duo Promo',
        });
      }

      // Seasonal mode
      const savedSeason = localStorage.getItem('mb_seasonal_mode');
      if (savedSeason) {
        setIsSeasonalActive(JSON.parse(savedSeason));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOrderSpecial = () => {
    if (dailySpecial?.linkedItemId && onAddItemDirect) {
      onAddItemDirect(dailySpecial.linkedItemId);
    } else if (onOpenTray) {
      onOpenTray();
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#09090c] via-[#101017] to-[#0d0d12]"
    >
      {/* Background Ambient Glows and Texture */}
      <div className="absolute inset-0 bg-grunge pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-pattern-grid pointer-events-none opacity-40" />

      {/* Decorative Floating Tea Boba / Bubbles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-[#8c1c1c]/15 blur-2xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-[#f2a900]/10 blur-3xl" />

        {/* Floating Bubble particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-[#f2a900]/20 to-[#b3231c]/30 border border-[#ffcc33]/20 animate-bounce"
            style={{
              width: `${16 + i * 7}px`,
              height: `${16 + i * 7}px`,
              left: `${10 + i * 11}%`,
              bottom: `${5 + i * 9}%`,
              animationDuration: `${4 + i * 1.5}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Corner Tropical Leaf Elements */}
      <MonsteraLeaf position="top-left" opacity={0.35} className="hidden sm:block" />
      <MonsteraLeaf position="top-right" opacity={0.35} className="hidden sm:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Seasonal / Ramadan Hours Notification Banner (if active) */}
        {isSeasonalActive && (
          <div className="w-full max-w-2xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-[#231738] to-purple-950/90 border border-purple-500/50 shadow-xl shadow-purple-950/30 flex items-center justify-center gap-3 text-center animate-pulse">
            <Moon className="w-5 h-5 text-purple-300 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-purple-200">
              <strong className="text-white font-bebas text-base tracking-wider block sm:inline sm:mr-2">
                {language === 'ar'
                  ? CAFE_CONFIG.seasonalMode.nameArabic
                  : language === 'fr'
                  ? CAFE_CONFIG.seasonalMode.nameFrench
                  : CAFE_CONFIG.seasonalMode.name}:
              </strong>
              <span>
                {language === 'ar'
                  ? CAFE_CONFIG.seasonalMode.hoursArabic
                  : language === 'fr'
                  ? CAFE_CONFIG.seasonalMode.hoursFrench
                  : CAFE_CONFIG.seasonalMode.hours}
              </span>
            </div>
          </div>
        )}

        {/* Top Badges Row: 4.9★ Google Rating & Open Hours */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 animate-fade-in">
          {/* Google Review Badge */}
          <a
            href="#reviews"
            id="hero-google-badge"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1c28]/90 border border-[#f2a900]/40 text-xs sm:text-sm font-medium text-white shadow-[0_0_15px_rgba(242,169,0,0.2)] hover:border-[#f2a900] transition-all hover:scale-105"
          >
            <div className="flex items-center text-[#ffcc33]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#ffcc33]" />
              ))}
            </div>
            <span className="font-bold text-[#ffcc33]">{CAFE_CONFIG.rating}★</span>
            <span className="text-[#9ca3af]">({CAFE_CONFIG.reviewCount} Google reviews)</span>
          </a>

          {/* Daily Hours Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1c28]/90 border border-[#2a2a38] text-xs sm:text-sm font-medium text-[#d1d5db]">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open {isSeasonalActive ? CAFE_CONFIG.seasonalMode.hours : CAFE_CONFIG.hoursSummary}</span>
          </div>

          {/* Location City Pill */}
          <a
            href="#location"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1c28]/90 border border-[#2a2a38] text-xs sm:text-sm font-medium text-[#d1d5db] hover:border-[#b3231c]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#e6392f]" />
            <span>{CAFE_CONFIG.location.address}</span>
          </a>
        </div>

        {/* Central Brand Mark with Asian Character */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <Logo size="xl" showText={false} className="justify-center mx-auto" />
        </div>

        {/* Brand Name & Arabic Script */}
        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffea9f] via-[#ffcc33] to-[#e69500] leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] mb-1">
          MISTER BUBBLE
        </h1>
        <div className="font-arabic font-black text-2xl sm:text-3xl md:text-4xl text-[#f3f4f6] tracking-wide mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          السيد فقاعة <span className="text-sm sm:text-base font-normal text-[#ffcc33] opacity-80">• مستغانم</span>
        </div>

        {/* Real Brand Slogan / Tagline */}
        <div className="inline-block relative px-6 py-2 mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b3231c]/50 to-transparent rounded-full blur-sm" />
          <div className="relative font-bebas text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] text-[#f3f4f6] flex items-center justify-center gap-3">
            <span className="text-[#ffcc33]">SIP.</span>
            <span className="text-[#ff4d4d]">PLAY.</span>
            <span className="text-[#ffcc33]">DELIGHT.</span>
          </div>
        </div>

        {/* One-line Hook */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#d1d5db] leading-relaxed mb-6 font-normal">
          {t('hero.hook')}
        </p>

        {/* Daily Special Banner Callout (if enabled) */}
        {dailySpecial && dailySpecial.enabled && (
          <div className="w-full max-w-2xl mb-8 p-4 rounded-3xl bg-gradient-to-r from-[#20151a] via-[#1c1628] to-[#20151a] border-2 border-[#ffcc33]/60 shadow-[0_0_30px_rgba(255,204,51,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffcc33] to-[#b3231c] text-[#0f0f14] flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                <Flame className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="px-2 py-0.5 rounded-full bg-[#b3231c] text-[#ffcc33] text-[10px] font-bold font-bebas tracking-wider">
                    {t('hero.dailySpecial')}
                  </span>
                  {dailySpecial.specialPrice && (
                    <span className="font-mono text-xs font-bold text-[#ffcc33]">
                      {dailySpecial.specialPrice} DA ONLY
                    </span>
                  )}
                </div>
                <h4 className="font-bebas text-xl text-white tracking-wide mt-0.5">
                  {language === 'ar' && dailySpecial.titleArabic
                    ? dailySpecial.titleArabic
                    : language === 'fr' && dailySpecial.titleFrench
                    ? dailySpecial.titleFrench
                    : dailySpecial.title}
                </h4>
                <p className="text-xs text-[#cbd5e1] line-clamp-1">
                  {dailySpecial.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={handleOrderSpecial}
              className="px-4 py-2 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-base tracking-wider font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>{t('hero.orderSpecial')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Confirmed Service Options Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181824] border border-[#27273a] text-xs text-[#cbd5e1]">
            <Utensils className="w-3.5 h-3.5 text-[#ffcc33]" />
            <span>{t('hero.serviceDineIn')}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181824] border border-[#27273a] text-xs text-[#cbd5e1]">
            <Car className="w-3.5 h-3.5 text-[#2f9e44]" />
            <span>{t('hero.servicePickup')}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181824] border border-[#27273a] text-xs text-[#cbd5e1]">
            <Bike className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{t('hero.serviceDelivery')}</span>
          </span>
        </div>

        {/* Call-To-Action Buttons: Order Now, View Menu, Reserve Table */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl mx-auto">
          {/* 1. Order Now CTA */}
          <button
            onClick={onOpenTray}
            id="hero-order-cta"
            className="flex-1 min-w-[160px] py-3.5 px-6 bg-gradient-to-r from-[#b3231c] via-[#991b1b] to-[#7f1d1d] hover:from-[#d12a22] hover:to-[#991b1b] text-white font-bebas text-2xl tracking-widest rounded-xl shadow-[0_0_25px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-[#ffcc33]" />
            <span>{t('hero.btnOrder')}</span>
          </button>

          {/* 2. Reserve Table CTA */}
          <a
            href="#reservation"
            id="hero-reserve-cta"
            className="flex-1 min-w-[160px] py-3.5 px-6 bg-[#1b1928] hover:bg-[#252238] text-[#ffcc33] hover:text-[#ffe066] font-bebas text-2xl tracking-widest rounded-xl border border-[#ffcc33]/40 shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5 text-[#ffcc33]" />
            <span>{t('hero.btnReserve')}</span>
          </a>

          {/* 3. View Menu CTA */}
          <a
            href="#menu"
            id="hero-menu-cta"
            className="flex-1 min-w-[160px] py-3.5 px-6 bg-[#171722] hover:bg-[#20202e] text-[#f3f4f6] hover:text-[#ffcc33] font-bebas text-2xl tracking-widest rounded-xl border border-[#3b3b4f] hover:border-[#f2a900] shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-5 h-5 text-[#ffcc33]" />
            <span>{t('hero.btnMenu')}</span>
          </a>
        </div>

        {/* Price & Vibe Highlights Row */}
        <div className="mt-12 pt-8 border-t border-[#252535] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#ffcc33]">1–1,000 DZD</span>
            <span className="text-xs text-[#9ca3af] font-medium">{t('hero.statPriceSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#ffcc33]">50+ Games</span>
            <span className="text-xs text-[#9ca3af] font-medium">{t('hero.statGamesSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#ffcc33]">9 AM – Midnight</span>
            <span className="text-xs text-[#9ca3af] font-medium">{t('hero.statHoursSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#ffcc33]">Tramway Port</span>
            <span className="text-xs text-[#9ca3af] font-medium">{t('hero.statLocationSub')}</span>
          </div>
        </div>

        {/* Scroll down indicator */}
        <a
          href="#about"
          className="mt-10 text-[#6b7280] hover:text-[#ffcc33] transition-colors animate-bounce flex flex-col items-center gap-1 text-xs"
          aria-label="Scroll to about section"
        >
          <span>DISCOVER MISTER BUBBLE</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
