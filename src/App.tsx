import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { MenuItem, TrayItem, OrderDetails } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Menu } from './components/Menu';
import { BoardGames } from './components/BoardGames';
import { Announcements } from './components/Announcements';
import { Events } from './components/Events';
import { HostEvent } from './components/HostEvent';
import { ReservationForm } from './components/ReservationForm';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { LoyaltyCard } from './components/LoyaltyCard';
import { StaffModal } from './components/StaffModal';
import { TableCardsModal } from './components/TableCardsModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CafeCatMascot } from './components/CafeCatMascot';
import { LanguageNudge } from './components/LanguageNudge';
import { MENU_ITEMS } from './data/menuData';
import { ShoppingBag, ArrowUp, Sparkles, Award, Radio, QrCode, MapPin, X } from 'lucide-react';

function CafeApp() {
  const { isRTL, t } = useLanguage();
  const [trayItems, setTrayItems] = useState<TrayItem[]>(() => {
    try {
      const saved = localStorage.getItem('mb_tray_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Table QR Detection from URL (e.g. ?table=3)
  const [tableParam, setTableParam] = useState<string | null>(null);
  const [showTableWelcome, setShowTableWelcome] = useState<boolean>(false);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeInvoice, setActiveInvoice] = useState<OrderDetails | null>(() => {
    try {
      const saved = localStorage.getItem('mb_last_invoice');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isStaffOpen, setIsStaffOpen] = useState<boolean>(false);
  const [isTableCardsOpen, setIsTableCardsOpen] = useState<boolean>(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  const [loyaltyPhone, setLoyaltyPhone] = useState<string>('');
  const [autoAddLoyaltyStamp, setAutoAddLoyaltyStamp] = useState<boolean>(false);
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

  // Save tray items to local storage
  useEffect(() => {
    try {
      localStorage.setItem('mb_tray_items', JSON.stringify(trayItems));
    } catch {
      // ignore
    }
  }, [trayItems]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToTray = (item: MenuItem, size?: 'regular' | 'large') => {
    setTrayItems((prev) => {
      const price =
        typeof item.price === 'object'
          ? size === 'large'
            ? item.price.large
            : item.price.regular
          : item.price;

      const existingIndex = prev.findIndex(
        (t) => t.item.id === item.id && t.size === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      } else {
        return [
          ...prev,
          {
            item,
            size,
            quantity: 1,
            calculatedPrice: price,
          },
        ];
      }
    });
  };

  const handleAddItemById = (itemId: string) => {
    const item = MENU_ITEMS.find((i) => i.id === itemId);
    if (item) {
      handleAddToTray(item);
      setIsCheckoutOpen(true);
    }
  };

  const handleReorderAll = (items: TrayItem[]) => {
    setTrayItems(items);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setTrayItems((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setTrayItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearTray = () => {
    setTrayItems([]);
  };

  const handleOrderSuccess = (order: OrderDetails) => {
    setActiveInvoice(order);
    try {
      // Save to order history list (latest first)
      const existingStr = localStorage.getItem('mb_order_history') || '[]';
      const existingHistory: OrderDetails[] = JSON.parse(existingStr);
      localStorage.setItem('mb_order_history', JSON.stringify([order, ...existingHistory]));
      localStorage.setItem('mb_last_invoice', JSON.stringify(order));
    } catch {
      // ignore
    }

    // Auto trigger loyalty stamp addition for user's phone
    if (order.customerPhone) {
      setLoyaltyPhone(order.customerPhone);
      setAutoAddLoyaltyStamp(true);
    }

    setTrayItems([]);
    setIsCheckoutOpen(false);
    setIsInvoiceOpen(true);
    setTrackingOrderId(order.orderId);
  };

  const handleOpenTrackerFromInvoice = (orderId: string) => {
    setIsInvoiceOpen(false);
    setTrackingOrderId(orderId);
    setIsOrderTrackerOpen(true);
  };

  const totalTrayCount = trayItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#0c0c0f] text-[#f3f4f6] font-sans selection:bg-[#b3231c] selection:text-white relative ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* First-Visit Language Nudge Toast */}
      <LanguageNudge />

      {/* Table Scanned Notification Toast */}
      {showTableWelcome && tableParam && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg p-4 rounded-2xl bg-[#1e1728] border-2 border-[#ffcc33] text-white shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center font-bebas text-xl font-bold flex-shrink-0">
              #{tableParam}
            </div>
            <div>
              <h4 className="font-bebas text-lg text-[#ffcc33] leading-none">
                {t('tableTent.scannedWelcome')} Table {tableParam}!
              </h4>
              <p className="text-xs text-[#cbd5e1] mt-0.5">
                {t('tableTent.scannedSub')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTableWelcome(false)}
            className="p-1.5 rounded-lg bg-[#2b2238] text-[#9ca3af] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        onOpenTray={() => setIsCheckoutOpen(true)}
        trayCount={totalTrayCount}
        onOpenLoyalty={() => {
          setAutoAddLoyaltyStamp(false);
          setIsLoyaltyOpen(true);
        }}
        onOpenStaff={() => setIsStaffOpen(true)}
      />

      <main>
        {/* Section 1: Hero Section */}
        <Hero
          onOpenTray={() => setIsCheckoutOpen(true)}
          onAddItemDirect={handleAddItemById}
        />

        {/* Section 2: Menu & Combos & Reorder & Sticky Cart */}
        <Menu
          onAddToTray={handleAddToTray}
          onReorderAll={handleReorderAll}
          trayItems={trayItems}
          onOpenTray={() => setIsCheckoutOpen(true)}
        />

        {/* Section 3: Announcements & Café Bulletins Feed */}
        <Announcements />

        {/* Section 4: About & Story */}
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
        onOpenLoyalty={() => {
          setAutoAddLoyaltyStamp(false);
          setIsLoyaltyOpen(true);
        }}
        onOpenTableCards={() => setIsTableCardsOpen(true)}
        onOpenOrderTracker={() => {
          if (activeInvoice?.orderId) {
            setTrackingOrderId(activeInvoice.orderId);
          }
          setIsOrderTrackerOpen(true);
        }}
      />

      {/* Animated Boba Cat Mascot (Part C) */}
      <CafeCatMascot />

      {/* Checkout & Tray Drawer */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        trayItems={trayItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearTray={handleClearTray}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Facture / Digital Invoice Screen with QR Code & WhatsApp Action */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        order={activeInvoice}
        onClose={() => setIsInvoiceOpen(false)}
        onOpenTracker={handleOpenTrackerFromInvoice}
      />

      {/* VIP Member Digital Loyalty Stamp Card & Referral System */}
      <LoyaltyCard
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        initialPhone={loyaltyPhone}
        autoStamp={autoAddLoyaltyStamp}
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

      {/* Live Order Status Tracker */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orderId={trackingOrderId || activeInvoice?.orderId}
      />

      {/* Floating Action Buttons */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex flex-col gap-3`}>
        
        {/* Track Active Order Button if exists */}
        {activeInvoice && (
          <button
            onClick={() => {
              setTrackingOrderId(activeInvoice.orderId);
              setIsOrderTrackerOpen(true);
            }}
            id="floating-tracker-btn"
            className="p-3 rounded-full bg-[#162035] border-2 border-blue-400/80 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-pulse"
            title="Track Live Order Status"
            aria-label="Track Live Order"
          >
            <Radio className="w-5 h-5" />
          </button>
        )}

        {/* Loyalty Stamp Button */}
        <button
          onClick={() => {
            setAutoAddLoyaltyStamp(false);
            setIsLoyaltyOpen(true);
          }}
          id="floating-loyalty-btn"
          className="p-3 rounded-full bg-[#1b1828] border-2 border-[#ffcc33]/60 text-[#ffcc33] shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="VIP Member Loyalty Stamp Card"
          aria-label="Loyalty Card"
        >
          <Award className="w-5 h-5 text-[#ffcc33]" />
        </button>

        {/* View Active Invoice Quick Button if exists */}
        {activeInvoice && !totalTrayCount && (
          <button
            onClick={() => setIsInvoiceOpen(true)}
            id="floating-last-invoice-btn"
            className="px-4 py-2.5 rounded-full bg-[#181826] border border-[#ffcc33]/60 text-[#ffcc33] text-xs font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            title="View your latest digital order facture"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Facture #{activeInvoice.orderId.slice(-4)}</span>
          </button>
        )}

        {/* Floating Cart Button */}
        {totalTrayCount > 0 && (
          <button
            onClick={() => setIsCheckoutOpen(true)}
            id="floating-tray-btn"
            className="p-3.5 rounded-full bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white shadow-[0_0_20px_rgba(179,35,28,0.6)] border-2 border-[#ffcc33] hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative"
            aria-label="Open your drink & snack tray"
          >
            <ShoppingBag className="w-6 h-6 text-[#ffcc33]" />
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#ffcc33] text-[#0d0d10] text-xs font-black flex items-center justify-center border border-[#111] shadow">
              {totalTrayCount}
            </span>
          </button>
        )}

        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className="p-3 rounded-full bg-[#1c1c28]/90 hover:bg-[#252536] text-[#9ca3af] hover:text-[#ffcc33] border border-[#2e2e42] shadow-xl backdrop-blur-sm transition-all"
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
      <Analytics />
    </LanguageProvider>
  );
}
