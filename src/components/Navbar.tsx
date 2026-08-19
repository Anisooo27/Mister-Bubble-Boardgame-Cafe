import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Menu as MenuIcon,
  X,
  MapPin,
  ShoppingBag,
  Award,
  Calendar,
  Lock,
  Globe,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage } from '../types';

interface NavbarProps {
  onOpenTray: () => void;
  trayCount: number;
  onOpenLoyalty: () => void;
  onOpenStaff: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTray,
  trayCount,
  onOpenLoyalty,
  onOpenStaff,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if open (9:00 AM - 12:00 AM Algerian Time, UTC+1)
    const checkOpenStatus = () => {
      const now = new Date();
      const algeriaHour = (now.getUTCHours() + 1) % 24;
      const open = algeriaHour >= 9 || algeriaHour < 0;
      setIsOpenNow(open);
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.menu'), href: '#menu' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.games'), href: '#games' },
    { label: t('nav.events'), href: '#events' },
    { label: t('nav.host'), href: '#host-event' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.reviews'), href: '#reviews' },
    { label: t('nav.location'), href: '#location' },
  ];

  const handleLanguageChange = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0d10]/95 backdrop-blur-md border-b border-[#2a2a35] py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#0d0d10]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center transition-transform hover:scale-105 active:scale-95"
            id="nav-logo-link"
          >
            <Logo size="sm" showArabic={true} />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-2.5 py-1.5 text-xs font-medium text-[#d1d5db] hover:text-[#ffcc33] hover:bg-[#1a1a24] rounded-lg transition-all whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center p-1 bg-[#161622] rounded-xl border border-[#2c2c3e]">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#8c1c1c] text-[#ffcc33]'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'fr'
                    ? 'bg-[#8c1c1c] text-[#ffcc33]'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-arabic transition-all ${
                  language === 'ar'
                    ? 'bg-[#8c1c1c] text-[#ffcc33]'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
                title="العربية"
              >
                عربي
              </button>
            </div>

            {/* Loyalty Card Stamp Trigger */}
            <button
              onClick={onOpenLoyalty}
              id="nav-loyalty-btn"
              className="px-3 py-2 bg-[#1a1826] hover:bg-[#252033] border border-[#ffcc33]/40 text-[#ffcc33] rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              title="Open VIP Loyalty Stamp Card"
            >
              <Award className="w-4 h-4 text-[#ffcc33]" />
              <span className="hidden md:inline">{t('nav.loyalty')}</span>
            </button>

            {/* Cart / Order Trigger Button */}
            <button
              onClick={onOpenTray}
              id="nav-order-now-btn"
              className="px-3.5 py-2 bg-[#1a1a24] hover:bg-[#252533] border border-[#f2a900]/40 hover:border-[#f2a900] text-[#ffcc33] rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
              title="Open your cart & digital order tray"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('nav.orderNow')}</span>
              {trayCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#b3231c] text-white text-xs font-bold flex items-center justify-center border border-[#ffcc33]/60 shadow-[0_0_8px_#b3231c]">
                  {trayCount}
                </span>
              )}
            </button>

            {/* Visit Us CTA */}
            <a
              href="#location"
              id="nav-visit-btn"
              className="px-3.5 py-2 bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-base tracking-wider rounded-xl shadow-[0_0_15px_rgba(179,35,28,0.4)] border border-[#ffcc33]/40 transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ffcc33]" />
              {t('nav.visitUs')}
            </a>
          </div>

          {/* Mobile Hamburger & Language & Cart Button */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Mobile Language Pill */}
            <div className="flex items-center p-0.5 bg-[#161622] rounded-lg border border-[#2c2c3e]">
              <button
                onClick={() => handleLanguageChange(language === 'en' ? 'fr' : language === 'fr' ? 'ar' : 'en')}
                className="px-2 py-1 text-[11px] font-bold text-[#ffcc33]"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              onClick={onOpenLoyalty}
              className="p-2 bg-[#1a1826] border border-[#ffcc33]/40 text-[#ffcc33] rounded-xl text-sm"
              title="Loyalty Stamp Card"
            >
              <Award className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTray}
              className="relative p-2 bg-[#1a1a24] border border-[#f2a900]/40 text-[#ffcc33] rounded-xl text-sm"
              aria-label="Order Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {trayCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b3231c] text-white text-[10px] font-bold flex items-center justify-center border border-[#ffcc33]">
                  {trayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 bg-[#1a1a24] hover:bg-[#252533] border border-[#2a2a36] text-[#f3f4f6] rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ffcc33]" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0e0e14] border-b border-[#2a2a35] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {/* Status info bar */}
          <div className="flex items-center justify-between p-3 bg-[#15151f] rounded-xl border border-[#252536] mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-semibold text-white">{isOpenNow ? 'Open Now (9AM – 12AM)' : 'Opens at 9:00 AM'}</span>
            </div>
            <span className="text-[11px] text-[#ffcc33] font-medium">Salamandre</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-sm font-medium text-[#e5e7eb] hover:text-[#ffcc33] hover:bg-[#1a1a28] rounded-lg transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#6b7280]" />
              </a>
            ))}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-3 border-t border-[#252536] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoyalty();
                }}
                className="py-2.5 bg-[#1b1828] text-[#ffcc33] font-bold text-xs uppercase tracking-wider text-center rounded-xl border border-[#ffcc33]/40 flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>{t('nav.loyalty')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTray();
                }}
                className="py-2.5 bg-[#1e1e2d] text-[#ffcc33] font-bold text-xs uppercase tracking-wider text-center rounded-xl border border-[#f2a900]/40 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('nav.orderNow')} ({trayCount})</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1f1f2e] text-xs text-[#9ca3af]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaff();
                }}
                className="flex items-center gap-1 hover:text-[#ffcc33]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('nav.staff')}</span>
              </button>
              <span>Mostaganem, DZ</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
