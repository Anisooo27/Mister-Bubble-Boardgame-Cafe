import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Menu } from './components/Menu';
import { BoardGames } from './components/BoardGames';
import { Events } from './components/Events';
import { HostEvent } from './components/HostEvent';
import { ReservationForm } from './components/ReservationForm';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { LoyaltyCard } from './components/LoyaltyCard';
import { StaffModal } from './components/StaffModal';
import { TableCardsModal } from './components/TableCardsModal';
import { CafeCatMascot } from './components/CafeCatMascot';
import { LanguageNudge } from './components/LanguageNudge';
import { ArrowUp, Award, X } from 'lucide-react';

function CafeApp() {
  const { isRTL, t } = useLanguage();

  // Table QR Detection from URL (e.g. ?table=3)
  const [tableParam, setTableParam] = useState<string | null>(null);
  const [showTableWelcome, setShowTableWelcome] = useState<boolean>(false);

  // Modals state
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isStaffOpen, setIsStaffOpen] = useState<boolean>(false);
  const [isTableCardsOpen, setIsTableCardsOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Check URL table parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('table');
    if (table) {
      setTableParam(table);
      setShowTableWelcome(true);
      try {
        localStorage.setItem('mb_current_table', table);
      } catch {
        // ignore
      }
    }
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#faf6ee] text-[#2a1b12] font-sans selection:bg-[#8c1c1c] selection:text-white relative ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* First-Visit Language Nudge Toast */}
      <LanguageNudge />

      {/* Table Scanned Notification Toast */}
      {showTableWelcome && tableParam && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg p-4 rounded-2xl bg-[#ffffff] border-2 border-[#c8935f] text-[#2a1b12] shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center font-bebas text-xl font-bold flex-shrink-0 shadow-sm">
              #{tableParam}
            </div>
            <div>
              <h4 className="font-bebas text-lg text-[#8c1c1c] leading-none">
                {t('tableTent.scannedWelcome')} Table {tableParam}!
              </h4>
              <p className="text-xs text-[#665547] mt-0.5 font-medium">
                {t('tableTent.scannedSub')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTableWelcome(false)}
            className="p-1.5 rounded-lg bg-[#f4edd9] text-[#786555] hover:text-[#2a1b12] hover:bg-[#ebd8c1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenStaff={() => setIsStaffOpen(true)}
      />

      <main>
        {/* Section 1: Hero Section */}
        <Hero />

        {/* Section 2: Menu & Combos Catalog */}
        <Menu />

        {/* Section 3: About & Story */}
        <About />

        {/* Section 5: 50+ Board Game Library & Community Player Board & Leaderboard & Quiz */}
        <BoardGames />

        {/* Section 6: Events & What's On */}
        <Events />

        {/* Section 7: Private Event Booking & Host Section */}
        <HostEvent />

        {/* Section 8: Table & Game Reservation Request */}
        <ReservationForm />

        {/* Section 9: Photo Gallery with Lightbox */}
        <Gallery />

        {/* Section 10: Customer Reviews & Rating Wall */}
        <Reviews />

        {/* Section 11: Location & Opening Hours */}
        <LocationHours />
      </main>

      {/* Footer */}
      <Footer
        onOpenStaff={() => setIsStaffOpen(true)}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenTableCards={() => setIsTableCardsOpen(true)}
      />

      {/* Animated Boba Cat Mascot */}
      <CafeCatMascot />

      {/* VIP Member Digital Loyalty Stamp Card & Referral System */}
      <LoyaltyCard
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
      />

      {/* Staff Order Queue & Management Portal */}
      <StaffModal
        isOpen={isStaffOpen}
        onClose={() => setIsStaffOpen(false)}
      />

      {/* Printable QR Table Cards (Tables 1-12) */}
      <TableCardsModal
        isOpen={isTableCardsOpen}
        onClose={() => setIsTableCardsOpen(false)}
      />

      {/* Floating Action Buttons */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex flex-col gap-3`}>
        {/* Loyalty Stamp Button */}
        <button
          onClick={() => setIsLoyaltyOpen(true)}
          id="floating-loyalty-btn"
          className="p-3 rounded-full bg-[#ffffff] border-2 border-[#c8935f] text-[#8e5b2e] shadow-xl hover:bg-[#fcf8f0] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="VIP Member Loyalty Stamp Card"
          aria-label="Loyalty Card"
        >
          <Award className="w-5 h-5 text-[#8e5b2e]" />
        </button>

        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className="p-3 rounded-full bg-[#ffffff]/90 hover:bg-[#f4edd9] text-[#786555] hover:text-[#8c1c1c] border border-[#ebd8c1] shadow-xl backdrop-blur-sm transition-all"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CafeApp />
    </LanguageProvider>
  );
}

