import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Menu as MenuIcon,
  X,
  MapPin,
  Award,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage } from '../types';

interface NavbarProps {
  onOpenLoyalty: () => void;
  onOpenStaff: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
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
          ? 'bg-[#faf6ee]/95 backdrop-blur-md border-b border-[#ebd8c1] py-2.5 shadow-md'
          : 'bg-gradient-to-b from-[#faf6ee]/90 to-transparent py-4'
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
                className="px-2.5 py-1.5 text-xs font-semibold text-[#3d2e24] hover:text-[#8c1c1c] hover:bg-[#f4edd9] rounded-lg transition-all whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center p-1 bg-[#f4edd9] rounded-xl border border-[#ebd8c1]">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#8c1c1c] text-[#ffcc33]'
                    : 'text-[#665547] hover:text-[#2a1b12]'
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
                    : 'text-[#665547] hover:text-[#2a1b12]'
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
                    : 'text-[#665547] hover:text-[#2a1b12]'
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
              className="px-3 py-2 bg-[#ffffff] hover:bg-[#fcf8f0] border border-[#c8935f] text-[#8e5b2e] rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
              title="Open VIP Loyalty Stamp Card"
            >
              <Award className="w-4 h-4 text-[#8e5b2e]" />
              <span className="hidden md:inline">{t('nav.loyalty')}</span>
            </button>

            {/* Visit Us CTA */}
            <a
              href="#location"
              id="nav-visit-btn"
              className="px-4 py-2 bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-base tracking-wider rounded-xl shadow-md border border-[#ffcc33]/30 transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ffcc33]" />
              {t('nav.visitUs')}
            </a>
          </div>

          {/* Mobile Hamburger & Language Button */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Mobile Language Pill */}
            <div className="flex items-center p-0.5 bg-[#f4edd9] rounded-lg border border-[#ebd8c1]">
              <button
                onClick={() => handleLanguageChange(language === 'en' ? 'fr' : language === 'fr' ? 'ar' : 'en')}
                className="px-2 py-1 text-[11px] font-bold text-[#8c1c1c]"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              onClick={onOpenLoyalty}
              className="p-2 bg-[#ffffff] border border-[#c8935f] text-[#8e5b2e] rounded-xl text-sm shadow-sm"
              title="Loyalty Stamp Card"
            >
              <Award className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 bg-[#ffffff] hover:bg-[#f4edd9] border border-[#ebd8c1] text-[#2a1b12] rounded-xl transition-colors shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#8c1c1c]" /> : <MenuIcon className="w-6 h-6 text-[#2a1b12]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#faf6ee] border-b border-[#ebd8c1] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {/* Status info bar */}
          <div className="flex items-center justify-between p-3 bg-[#ffffff] rounded-xl border border-[#ebd8c1] mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-semibold text-[#2a1b12]">{isOpenNow ? 'Open Now (9AM – 12AM)' : 'Opens at 9:00 AM'}</span>
            </div>
            <span className="text-[11px] text-[#8e5b2e] font-bold">Salamandre</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-[#3d2e24] hover:text-[#8c1c1c] hover:bg-[#f4edd9] rounded-lg transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#786555]" />
              </a>
            ))}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-3 border-t border-[#ebd8c1] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoyalty();
                }}
                className="py-2.5 bg-[#ffffff] text-[#8e5b2e] font-bold text-xs uppercase tracking-wider text-center rounded-xl border border-[#c8935f] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>{t('nav.loyalty')}</span>
              </button>

              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 bg-[#8c1c1c] text-white font-bold text-xs uppercase tracking-wider text-center rounded-xl border border-[#ffcc33]/30 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-[#ffcc33]" />
                <span>{t('nav.visitUs')}</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ebd8c1] text-xs text-[#786555]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaff();
                }}
                className="flex items-center gap-1 hover:text-[#8c1c1c] font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('nav.staff')}</span>
              </button>
              <span className="font-medium">Mostaganem, DZ</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
