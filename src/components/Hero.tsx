import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CafeImage } from './CafeImage';
import {
  Star,
  MapPin,
  Clock,
  UtensilsCrossed,
  Calendar,
  Flame,
  Moon,
  ArrowRight,
  Navigation,
  Sparkles,
  ChevronDown,
  Utensils,
  Dices,
  Camera
} from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { DailySpecial } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const Hero: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const [dailySpecial, setDailySpecial] = useState<DailySpecial | null>({
    enabled: true,
    title: 'Piña Colada Bleu & Fresh Takoyaki Waffle Special',
    titleArabic: 'عرض اليوم: مشروب بينا كولادا الأزرق مع وافل التاكوياكي الطازج',
    titleFrench: 'Spécial du Jour : Piña Colada Bleu & Gaufre Takoyaki',
    subtitle: 'Visit today to enjoy our special combo pairing at the counter!',
    linkedItemId: 'mojito-pina-colada-bleu',
    specialPrice: 650,
    badge: 'Special Duo Promo',
  });
  const [isSeasonalActive, setIsSeasonalActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const special = await api.getDailySpecial();
        if (special) {
          setDailySpecial(special);
        }
        const seasonal = await api.getSeasonalMode();
        setIsSeasonalActive(seasonal);
      } catch {
        // ignore
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f7f2e7] to-[#f4edd9] text-[#2a1b12]"
    >
      {/* Background Ambient Glows and Warm Pattern Texture */}
      <div className="absolute inset-0 bg-grunge-warm pointer-events-none opacity-90" />
      <div className="absolute inset-0 bg-pattern-grid-warm pointer-events-none opacity-60" />

      {/* Decorative Floating Tea Boba / Bubbles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-[#c8935f]/15 blur-2xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-[#f2a900]/10 blur-3xl" />

        {/* Floating Bubble particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-[#f2a900]/25 to-[#8c1c1c]/20 border border-[#c8935f]/30 animate-bounce"
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
          <div className="w-full max-w-2xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-purple-100 via-white to-purple-100 border border-purple-300 shadow-md flex items-center justify-center gap-3 text-center animate-pulse">
            <Moon className="w-5 h-5 text-purple-700 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-purple-900">
              <strong className="text-purple-950 font-bebas text-base tracking-wider block sm:inline sm:mr-2">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#c8935f]/60 text-xs sm:text-sm font-semibold text-[#2a1b12] shadow-sm hover:border-[#8c1c1c] transition-all hover:scale-105"
          >
            <div className="flex items-center text-[#f2a900]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#f2a900]" />
              ))}
            </div>
            <span className="font-bold text-[#8e5b2e]">{CAFE_CONFIG.rating}★</span>
            <span className="text-[#786555]">({CAFE_CONFIG.reviewCount} Google reviews)</span>
          </a>

          {/* Daily Hours Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#ebd8c1] text-xs sm:text-sm font-medium text-[#3d2e24] shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open {isSeasonalActive ? CAFE_CONFIG.seasonalMode.hours : CAFE_CONFIG.hoursSummary}</span>
          </div>

          {/* Location City Pill */}
          <a
            href="#location"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#ebd8c1] text-xs sm:text-sm font-medium text-[#3d2e24] hover:border-[#8c1c1c] shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#8c1c1c]" />
            <span>{CAFE_CONFIG.location.address}</span>
          </a>
        </div>

        {/* Central Brand Mark with Asian Character */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <Logo size="xl" showText={false} className="justify-center mx-auto" />
        </div>

        {/* Brand Name & Arabic Script */}
        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-[#8c1c1c] leading-none drop-shadow-sm mb-1">
          MISTER BUBBLE
        </h1>
        <div className="font-arabic font-black text-2xl sm:text-3xl md:text-4xl text-[#2a1b12] tracking-wide mb-4">
          السيد فقاعة <span className="text-sm sm:text-base font-normal text-[#8e5b2e] opacity-90">• مستغانم</span>
        </div>

        {/* Real Brand Slogan / Tagline */}
        <div className="inline-block relative px-6 py-2 mb-4">
          <div className="absolute inset-0 bg-[#ebd8c1]/40 rounded-full blur-sm" />
          <div className="relative font-bebas text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] text-[#2a1b12] flex items-center justify-center gap-3">
            <span className="text-[#8e5b2e]">SIP.</span>
            <span className="text-[#8c1c1c]">PLAY.</span>
            <span className="text-[#8e5b2e]">DELIGHT.</span>
          </div>
        </div>

        {/* One-line Hook */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#665547] leading-relaxed mb-6 font-normal">
          {t('hero.hook')}
        </p>

        {/* Featured Storefront Photo Card Preview */}
        <div className="w-full max-w-xl mb-8 p-2 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-md hover:shadow-lg transition-shadow">
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#ebd8c1]">
            <CafeImage
              src="/photos/hero-exterior-night.jpg"
              filename="hero-exterior-night.jpg"
              alt="Mister Bubble Cafe Night Storefront in Salamandre Mostaganem"
              title="Illuminated Night Storefront"
              caption="Salamandre, Near Port Tramway Station"
              aspectRatio="aspect-auto h-full w-full"
              overlay={true}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <Camera className="w-3.5 h-3.5 text-[#ffcc33]" />
                <span className="text-[11px] font-bold">Real Storefront • Salamandre</span>
              </div>
              <a
                href="#gallery"
                className="pointer-events-auto text-[11px] font-bold bg-[#8c1c1c] hover:bg-[#a62222] text-white px-3 py-1 rounded-full shadow-sm transition-colors"
              >
                View 60+ Photos →
              </a>
            </div>
          </div>
        </div>

        {/* Daily Special Banner Callout (if enabled) */}
        {dailySpecial && dailySpecial.enabled && (
          <div className="w-full max-w-2xl mb-8 p-4 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all hover:border-[#c8935f]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f2a900] to-[#8c1c1c] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                <Flame className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="px-2 py-0.5 rounded-full bg-[#8c1c1c] text-[#ffcc33] text-[10px] font-bold font-bebas tracking-wider">
                    {t('hero.dailySpecial')}
                  </span>
                  {dailySpecial.specialPrice && (
                    <span className="font-mono text-xs font-bold text-[#8e5b2e]">
                      {dailySpecial.specialPrice} DA SPECIAL
                    </span>
                  )}
                </div>
                <h4 className="font-bebas text-xl text-[#2a1b12] tracking-wide mt-0.5">
                  {language === 'ar' && dailySpecial.titleArabic
                    ? dailySpecial.titleArabic
                    : language === 'fr' && dailySpecial.titleFrench
                    ? dailySpecial.titleFrench
                    : dailySpecial.title}
                </h4>
                <p className="text-xs text-[#786555] line-clamp-1">
                  {dailySpecial.subtitle}
                </p>
              </div>
            </div>

            <a
              href="#menu"
              className="px-4 py-2 rounded-xl bg-[#f4edd9] hover:bg-[#ebd8c1] text-[#8c1c1c] font-bebas text-base tracking-wider font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border border-[#ebd8c1]"
            >
              <span>EXPLORE MENU</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Atmosphere Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ffffff] border border-[#ebd8c1] text-xs font-medium text-[#3d2e24] shadow-sm">
            <Utensils className="w-3.5 h-3.5 text-[#8c1c1c]" />
            <span>Cozy Dine-In Lounge</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ffffff] border border-[#ebd8c1] text-xs font-medium text-[#3d2e24] shadow-sm">
            <Dices className="w-3.5 h-3.5 text-[#8e5b2e]" />
            <span>50+ Free Board Games</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ffffff] border border-[#ebd8c1] text-xs font-medium text-[#3d2e24] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#f2a900]" />
            <span>Resident Café Cats</span>
          </span>
        </div>

        {/* Primary Call-To-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-lg mx-auto">
          {/* 1. PRIMARY CTA: View Menu */}
          <a
            href="#menu"
            id="hero-menu-cta"
            className="flex-1 min-w-[200px] py-4 px-8 bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-2xl tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 border border-[#ffcc33]/30"
          >
            <UtensilsCrossed className="w-5 h-5 text-[#ffcc33]" />
            <span>{t('hero.btnMenu')}</span>
          </a>

          {/* 2. SECONDARY CTA: Reserve Table */}
          <a
            href="#reservation"
            id="hero-reserve-cta"
            className="min-w-[150px] py-3.5 px-6 bg-[#ffffff] hover:bg-[#fcf8f0] text-[#8e5b2e] hover:text-[#2a1b12] font-bebas text-xl tracking-wider rounded-2xl border-2 border-[#c8935f] shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#8e5b2e]" />
            <span>{t('hero.btnReserve')}</span>
          </a>

          {/* 3. TERTIARY CTA: Directions & Maps */}
          <a
            href="#location"
            id="hero-location-cta"
            className="min-w-[150px] py-3.5 px-6 bg-[#ffffff] hover:bg-[#f4edd9] text-[#3d2e24] hover:text-[#8c1c1c] font-bebas text-xl tracking-wider rounded-2xl border border-[#ebd8c1] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#8c1c1c]" />
            <span>FIND US</span>
          </a>
        </div>

        {/* Price & Vibe Highlights Row */}
        <div className="mt-12 pt-8 border-t border-[#ebd8c1] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#8c1c1c]">1–1,000 DZD</span>
            <span className="text-xs text-[#786555] font-medium">{t('hero.statPriceSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#8e5b2e]">50+ Games</span>
            <span className="text-xs text-[#786555] font-medium">{t('hero.statGamesSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#8c1c1c]">9 AM – Midnight</span>
            <span className="text-xs text-[#786555] font-medium">{t('hero.statHoursSub')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bebas text-2xl sm:text-3xl text-[#8e5b2e]">Tramway Port</span>
            <span className="text-xs text-[#786555] font-medium">{t('hero.statLocationSub')}</span>
          </div>
        </div>

        {/* Scroll down indicator */}
        <a
          href="#about"
          className="mt-10 text-[#786555] hover:text-[#8c1c1c] transition-colors animate-bounce flex flex-col items-center gap-1 text-xs font-semibold"
          aria-label="Scroll to about section"
        >
          <span>DISCOVER MISTER BUBBLE</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
