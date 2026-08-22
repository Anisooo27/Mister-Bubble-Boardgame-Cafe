import React from 'react';
import { Logo } from './Logo';
import { Instagram, MapPin, Clock, Heart, Lock, Award, Calendar, QrCode, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenStaff?: () => void;
  onOpenLoyalty?: () => void;
  onOpenTableCards?: () => void;
  onOpenOrderTracker?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStaff,
  onOpenLoyalty,
  onOpenTableCards,
  onOpenOrderTracker,
}) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#20150e] border-t border-[#342419] pt-16 pb-12 overflow-hidden text-[#b8a99d]">
      {/* Background radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-[#8c1c1c]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#342419]">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showArabic={true} />

            <div className="font-bebas text-xl tracking-widest text-[#ffcc33] flex items-center gap-2">
              <span>SIP.</span>
              <span className="text-[#f87171]">PLAY.</span>
              <span>DELIGHT.</span>
            </div>

            <p className="text-xs sm:text-sm text-[#d4c8bd] leading-relaxed max-w-sm">
              Mostaganem’s premier Asian-themed bubble tea and board game café. Serving handcrafted sparkling fruit ades, Taro milk teas with boba, Bueno frappes, freshly baked bubble waffles, and over 50 tabletop games.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://www.instagram.com/misterbubble.dz/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#2e1f15] border border-[#453023] hover:border-[#ffcc33] text-[#ec4899] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://maps.app.goo.gl/4N8Emd2rZtxoBgHQ6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#2e1f15] border border-[#453023] hover:border-[#ffcc33] text-[#f2a900] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Google Maps Location"
              >
                <MapPin className="w-5 h-5" />
              </a>

              {onOpenLoyalty && (
                <button
                  onClick={onOpenLoyalty}
                  className="px-3 py-2 rounded-xl bg-[#2e1f15] border border-[#ffcc33]/40 hover:border-[#ffcc33] text-[#ffcc33] text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="VIP Member Loyalty Card"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('nav.loyalty')}</span>
                </button>
              )}

              {onOpenOrderTracker && (
                <button
                  onClick={onOpenOrderTracker}
                  className="px-3 py-2 rounded-xl bg-[#2e1f15] border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Track Live Order Status"
                >
                  <Radio className="w-4 h-4" />
                  <span>Track Order</span>
                </button>
              )}

              {onOpenTableCards && (
                <button
                  onClick={onOpenTableCards}
                  className="px-3 py-2 rounded-xl bg-[#2e1f15] border border-amber-600/40 hover:border-amber-500 text-[#ffcc33] text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Print Table QR Tents (Tables 1-12)"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Print Table QR Cards</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-bebas text-xl text-white tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-[#ffcc33] transition-colors">{t('nav.home')}</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#ffcc33] transition-colors">{t('nav.menu')}</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#ffcc33] transition-colors">{t('nav.about')}</a>
              </li>
              <li>
                <a href="#games" className="hover:text-[#ffcc33] transition-colors">{t('nav.games')}</a>
              </li>
              <li>
                <a href="#announcements" className="hover:text-[#ffcc33] transition-colors">Café Bulletins</a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#ffcc33] transition-colors">{t('nav.events')}</a>
              </li>
              <li>
                <a href="#host-event" className="hover:text-[#ffcc33] transition-colors">{t('nav.host')}</a>
              </li>
              <li>
                <a href="#reservation" className="hover:text-[#ffcc33] transition-colors">VIP Table Reservation</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#ffcc33] transition-colors">{t('nav.reviews')}</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Menu Highlights & Deals */}
          <div className="space-y-3">
            <h4 className="font-bebas text-xl text-white tracking-wider">Official Menu Series</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#combos" className="text-[#ffcc33] font-semibold hover:underline">★ Combo Bundles (Save DA)</a>
              </li>
              <li>
                <a href="#category-milk-tea" className="hover:text-[#ffcc33] transition-colors">Milk Tea Series (Taro, Tiger)</a>
              </li>
              <li>
                <a href="#category-frappes" className="hover:text-[#ffcc33] transition-colors">Sweet Frappes (Bueno, Speculos)</a>
              </li>
              <li>
                <a href="#category-bubble-waffle" className="hover:text-[#ffcc33] transition-colors">Bubble Waffles (Pistachio, Bueno)</a>
              </li>
              <li>
                <a href="#category-fruit-box" className="hover:text-[#ffcc33] transition-colors">Fruit Box Sharing Series</a>
              </li>
              <li>
                <a href="#category-mojito" className="hover:text-[#ffcc33] transition-colors">Virgin Mojitos (Pink Fresh)</a>
              </li>
              <li>
                <a href="#category-drinks" className="hover:text-[#ffcc33] transition-colors">Iced Lattes, Espresso & Teas</a>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-bebas text-xl text-white tracking-wider">Visit Us</h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#d4c8bd]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f87171] flex-shrink-0 mt-0.5" />
                <span>Salamandre, Near Tramway Port Station, Mostaganem 27000</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>9:00 AM – 12:00 AM (Midnight) Daily</span>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-[#ffcc33] flex-shrink-0 mt-0.5" />
                <span>@misterbubble.dz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7b70]">
          <div>
            © {new Date().getFullYear()} Mister Bubble Boardgame Cafe (السيد فقاعة). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#b8a99d]">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#e6392f] fill-[#e6392f]" />
              <span>in Mostaganem, Algeria</span>
            </div>

            {onOpenStaff && (
              <button
                onClick={onOpenStaff}
                className="flex items-center gap-1 text-[#8c7b70] hover:text-[#ffcc33] transition-colors"
                title="Staff Portal Login (Demo PIN: 7788)"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
