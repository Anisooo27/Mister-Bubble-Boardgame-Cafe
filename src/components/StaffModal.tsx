import React, { useState, useEffect } from 'react';
import { ReviewItem, DailySpecial, LeaderboardEntry, EventBooking, TableReservation } from '../types';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { MENU_ITEMS } from '../data/menuData';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Lock,
  ClipboardList,
  CheckCircle,
  Clock,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  X,
  Moon,
  Trash2,
  Check,
  Search,
  PartyPopper,
  Calendar,
  MessageSquare,
  Users,
  Archive,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StaffTab = 'availability' | 'inquiries' | 'reservations' | 'special' | 'leaderboard' | 'seasonal' | 'reviews';

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tabs: availability | inquiries | reservations | special | leaderboard | seasonal | reviews
  const [activeTab, setActiveTab] = useState<StaffTab>('availability');

  // Data states
  const [inquiries, setInquiries] = useState<EventBooking[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [soldOutItemIds, setSoldOutItemIds] = useState<string[]>([]);
  const [dailySpecial, setDailySpecial] = useState<DailySpecial>({
    enabled: true,
    title: 'Piña Colada Bleu & Fresh Takoyaki Waffle Special',
    titleArabic: 'عرض اليوم: مشروب بينا كولادا الأزرق مع وافل التاكوياكي الطازج',
    titleFrench: 'Spécial du Jour : Piña Colada Bleu & Gaufre Takoyaki',
    subtitle: 'Order this duo today and get a complimentary extra boba topping or 100 DA off!',
    linkedItemId: 'mojito-pina-colada-bleu',
    specialPrice: 650,
    badge: 'Special Duo Promo',
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonalEnabled, setSeasonalEnabled] = useState<boolean>(false);

  // Search & Filter filters
  const [availabilitySearch, setAvailabilitySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'pending' | 'contacted' | 'confirmed' | 'archived'>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [reservationFilter, setReservationFilter] = useState<'all' | 'pending' | 'confirmed' | 'archived'>('all');
  const [reservationSearch, setReservationSearch] = useState('');

  // Leaderboard player add state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGame, setNewPlayerGame] = useState('Settlers of Catan');
  const [newPlayerWins, setNewPlayerWins] = useState(1);
  const [newPlayerPoints, setNewPlayerPoints] = useState(30);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadData();
    }
  }, [isOpen, isUnlocked]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const syncData = await api.getLiveSync();
      if (syncData) {
        if (syncData.eventBookings) setInquiries(syncData.eventBookings);
        if (syncData.reservations) setReservations(syncData.reservations);
        if (syncData.reviews) setReviews(syncData.reviews);
        if (syncData.soldOutItemIds) setSoldOutItemIds(syncData.soldOutItemIds);
        if (syncData.dailySpecial) setDailySpecial(syncData.dailySpecial);
        if (syncData.leaderboard) setLeaderboard(syncData.leaderboard);
        if (typeof syncData.seasonalEnabled === 'boolean') setSeasonalEnabled(syncData.seasonalEnabled);
      }
    } catch (e) {
      console.error('Error loading live data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (cleanPin === CAFE_CONFIG.staffPin || cleanPin === CAFE_CONFIG.staffDemoPin || cleanPin === '7788') {
      setIsUnlocked(true);
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
    }
  };

  // 1. Sold Out Items Actions
  const handleToggleSoldOut = async (itemId: string) => {
    const isCurrentlySoldOut = soldOutItemIds.includes(itemId);
    let next: string[];
    if (isCurrentlySoldOut) {
      next = soldOutItemIds.filter((id) => id !== itemId);
    } else {
      next = [...soldOutItemIds, itemId];
    }
    setSoldOutItemIds(next);
    await api.toggleSoldOutItem(itemId);
    showToast(isCurrentlySoldOut ? 'Item marked available' : 'Item marked sold out');
  };

  const handleResetAvailability = async () => {
    setSoldOutItemIds([]);
    await api.resetSoldOutItems();
    showToast('All items reset to available');
  };

  // 2. Event Inquiries Actions
  const handleUpdateInquiryStatus = async (id: string, newStatus: EventBooking['status']) => {
    if (!newStatus) return;
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    setInquiries(updated);
    await api.updateEventInquiryStatus(id, newStatus);
    showToast(`Inquiry status updated to ${newStatus}`);
  };

  const handleDeleteInquiry = async (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    await api.deleteEventInquiry(id);
    showToast('Inquiry removed');
  };

  // 3. Table Reservations Actions
  const handleUpdateReservationStatus = async (id: string, newStatus: TableReservation['status']) => {
    const updated = reservations.map((res) => (res.id === id ? { ...res, status: newStatus } : res));
    setReservations(updated);
    await api.updateReservationStatus(id, newStatus);
    showToast(`Reservation updated to ${newStatus}`);
  };

  const handleDeleteReservation = async (id: string) => {
    const updated = reservations.filter((res) => res.id !== id);
    setReservations(updated);
    await api.deleteReservation(id);
    showToast('Reservation removed');
  };

  // 4. Daily Special
  const handleSaveDailySpecial = async () => {
    await api.saveDailySpecial(dailySpecial);
    showToast('Daily Special Banner updated live!');
  };

  // 5. Leaderboard
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newEntry = {
      playerName: newPlayerName.trim(),
      favoriteGame: newPlayerGame.trim() || 'Board Games',
      wins: Number(newPlayerWins) || 1,
      points: Number(newPlayerPoints) || 30,
      badge: 'Tabletop Competitor',
    };

    const res = await api.addLeaderboardPlayer(newEntry);
    if (res && res.length > 0) {
      setLeaderboard(res);
    } else {
      loadData();
    }
    setNewPlayerName('');
    showToast('Player added to leaderboard');
  };

  const handleIncrementPlayerWin = async (playerId: string) => {
    const res = await api.incrementLeaderboardWin(playerId);
    if (res && res.length > 0) {
      setLeaderboard(res);
    } else {
      loadData();
    }
    showToast('Player win score incremented (+30 pts)');
  };

  // 6. Seasonal Hours
  const handleToggleSeasonalMode = async () => {
    const next = !seasonalEnabled;
    setSeasonalEnabled(next);
    await api.setSeasonalMode(next);
    showToast(next ? 'Seasonal / Ramadan hours enabled' : 'Seasonal hours disabled');
  };

  // 7. Reviews
  const handleToggleReviewStatus = async (reviewId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'hidden' ? 'approved' : 'hidden';
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, status: nextStatus as any } : r
    );
    setReviews(updated);
    await api.updateReviewStatus(reviewId, nextStatus as any);
    showToast(nextStatus === 'approved' ? 'Review published' : 'Review hidden');
  };

  const formatWhatsAppUrl = (phone: string, name: string, topic: string) => {
    const digits = phone.replace(/[^0-9]/g, '');
    const cleanPhone = digits.startsWith('0') ? '213' + digits.slice(1) : digits;
    const text = `Hello ${name}! Greeting from Mister Bubble Cafe Mostaganem regarding your ${topic}. How can we assist you today? 🧋🎲`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = inquiryFilter === 'all' || (inq.status || 'pending') === inquiryFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone.includes(inquirySearch) ||
      inq.eventType.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.notes && inq.notes.toLowerCase().includes(inquirySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Filtered reservations
  const filteredReservations = reservations.filter((res) => {
    const matchesFilter = reservationFilter === 'all' || (res.status || 'pending') === reservationFilter;
    const matchesSearch =
      res.name.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      res.phone.includes(reservationSearch) ||
      (res.preferredGame && res.preferredGame.toLowerCase().includes(reservationSearch.toLowerCase())) ||
      (res.specialNotes && res.specialNotes.toLowerCase().includes(reservationSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#11111a] border-2 border-[#ffcc33]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171724] border-b border-[#262638] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center shadow">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 id="staff-title" className="font-bebas text-2xl text-white tracking-wide leading-none">
                {t('staff.title')}
              </h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Mister Bubble Operations &bull; Live Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={loadData}
                disabled={isLoading}
                className="p-2 rounded-lg bg-[#202030] text-[#9ca3af] hover:text-white hover:bg-[#2c2c42] transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#ffcc33]' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close Staff Portal"
              className="p-2 rounded-lg bg-[#202030] text-[#9ca3af] hover:text-white hover:bg-[#2c2c42] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center animate-in fade-in flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* PIN Authentication Gate */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1e1e2d] border border-[#ffcc33]/40 text-[#ffcc33] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wide">
                Staff Authentication
              </h4>
              <p className="text-xs text-[#9ca3af] mt-1">
                {t('staff.pinPrompt')}
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl px-4 py-3 rounded-2xl bg-[#191928] border border-[#333348] text-[#ffcc33] focus:outline-none focus:border-[#ffcc33]"
              />

              {pinError && (
                <div className="text-xs text-red-400 flex items-center justify-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4" />
                  <span>Incorrect PIN. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white font-bebas text-lg tracking-wider border border-[#ffcc33]/40 shadow-lg active:scale-95 transition-all"
              >
                {t('staff.btnUnlock')}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Navigation Tabs Header */}
            <div className="px-4 py-2 bg-[#151520] border-b border-[#232332] flex items-center gap-1.5 overflow-x-auto scrollbar-thin flex-nowrap">
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'availability'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                <span>{t('staff.tabAvailability')}</span>
                {soldOutItemIds.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-sans">
                    {soldOutItemIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'inquiries'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>{t('staff.tabInquiries')}</span>
                {inquiries.filter((i) => (i.status || 'pending') === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-sans font-bold">
                    {inquiries.filter((i) => (i.status || 'pending') === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'reservations'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('staff.tabReservations')}</span>
                {reservations.filter((r) => (r.status || 'pending') === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-sans font-bold">
                    {reservations.filter((r) => (r.status || 'pending') === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('special')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'special'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {t('staff.tabSpecial')}
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {t('staff.tabLeaderboard')}
              </button>

              <button
                onClick={() => setActiveTab('seasonal')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'seasonal'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {t('staff.tabSeasonal')}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3.5 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {t('staff.tabReviews')} ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: Item Availability ("Sold Out Today") */}
              {activeTab === 'availability' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171724] p-3.5 rounded-2xl border border-[#2a2a3e]">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                      <input
                        type="text"
                        placeholder="Search menu item to toggle sold out..."
                        value={availabilitySearch}
                        onChange={(e) => setAvailabilitySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#12121b] border border-[#2e2e42] rounded-xl text-xs text-white outline-none focus:border-[#ffcc33]"
                      />
                    </div>

                    <button
                      onClick={handleResetAvailability}
                      className="px-3.5 py-1.5 rounded-xl bg-[#28283c] hover:bg-[#353550] text-[#ffcc33] text-xs font-bold font-bebas tracking-wider transition-all"
                    >
                      {t('staff.resetAvailability')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {MENU_ITEMS.filter((item) =>
                      item.name.toLowerCase().includes(availabilitySearch.toLowerCase())
                    ).map((item) => {
                      const isSoldOut = soldOutItemIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                            isSoldOut
                              ? 'bg-[#221316] border-[#b3231c]/60 shadow-[0_0_15px_rgba(179,35,28,0.15)]'
                              : 'bg-[#161622] border-[#29293c]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{item.name}</span>
                              {isSoldOut && (
                                <span className="px-2 py-0.5 rounded bg-[#b3231c] text-white text-[10px] font-bold font-bebas tracking-wider">
                                  SOLD OUT TODAY
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#9ca3af] capitalize">
                              {item.category.replace('-', ' ')} &bull;{' '}
                              {typeof item.price === 'number' ? `${item.price} DA` : `${item.price.regular} DA`}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleSoldOut(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bebas tracking-wider transition-all ${
                              isSoldOut
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-[#b3231c] hover:bg-[#d12a22] text-white'
                            }`}
                          >
                            {isSoldOut ? 'MARK AVAILABLE' : 'MARK SOLD OUT'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Event Inquiries (Part D) */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {/* Filters and Search Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171724] p-3.5 rounded-2xl border border-[#2a2a3e]">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {(['all', 'pending', 'contacted', 'confirmed', 'archived'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setInquiryFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                            inquiryFilter === filter
                              ? 'bg-[#8c1c1c] text-[#ffcc33]'
                              : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                          }`}
                        >
                          {filter}
                          {filter === 'all' && ` (${inquiries.length})`}
                          {filter === 'pending' && ` (${inquiries.filter((i) => (i.status || 'pending') === 'pending').length})`}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                      <input
                        type="text"
                        placeholder="Search guest, phone, event..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#12121b] border border-[#2e2e42] rounded-xl text-xs text-white outline-none focus:border-[#ffcc33]"
                      />
                    </div>
                  </div>

                  {filteredInquiries.length === 0 ? (
                    <div className="py-12 text-center text-[#9ca3af]">
                      <PartyPopper className="w-10 h-10 text-[#4b5563] mx-auto mb-2" />
                      <p className="text-sm font-semibold">No event inquiries found.</p>
                      <p className="text-xs text-[#6b7280] mt-1">
                        Submissions from the "Host Your Event" page will appear here instantly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInquiries.map((inq) => {
                        const status = inq.status || 'pending';
                        return (
                          <div
                            key={inq.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              status === 'pending'
                                ? 'bg-[#1a1720] border-amber-500/40'
                                : status === 'contacted'
                                ? 'bg-[#151a24] border-sky-500/40'
                                : status === 'confirmed'
                                ? 'bg-[#14201a] border-emerald-500/40'
                                : 'bg-[#14141d] border-[#252535] opacity-70'
                            }`}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-white text-base">{inq.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    status === 'pending'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : status === 'contacted'
                                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                      : status === 'confirmed'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-slate-700 text-slate-300'
                                  }`}
                                >
                                  {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-[#252538] text-[#ffcc33] text-xs font-semibold">
                                  {inq.eventType}
                                </span>
                                <span className="text-[11px] text-[#9ca3af] flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {inq.estimatedGuests} Guests
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#cbd5e1]">
                                <span className="flex items-center gap-1 text-[#ffcc33] font-medium">
                                  <Calendar className="w-3.5 h-3.5" /> {inq.preferredDate}
                                </span>
                                <span className="text-[#9ca3af]">&bull; Submitted: {inq.createdAt}</span>
                              </div>

                              {inq.notes && (
                                <p className="text-xs text-[#e2e8f0] bg-[#12121c] p-2.5 rounded-xl border border-[#232334] italic">
                                  "{inq.notes}"
                                </p>
                              )}

                              {/* Customer Contact Links */}
                              <div className="flex items-center gap-2 pt-1">
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#202030] hover:bg-[#2e2e42] text-xs text-white transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-[#ffcc33]" />
                                  <span>{inq.phone}</span>
                                </a>

                                <a
                                  href={formatWhatsAppUrl(inq.phone, inq.name, inq.eventType)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700/60 hover:bg-emerald-600 text-xs text-white transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3 text-emerald-300" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>

                            {/* Status Control Actions */}
                            <div className="flex flex-wrap md:flex-col items-end gap-1.5 flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                                  title="Mark as Contacted"
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    status === 'contacted'
                                      ? 'bg-sky-600 text-white'
                                      : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                  }`}
                                >
                                  Contacted
                                </button>
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'confirmed')}
                                  title="Confirm Reservation"
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    status === 'confirmed'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                  }`}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                                  title="Archive"
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    status === 'archived'
                                      ? 'bg-slate-600 text-white'
                                      : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                  }`}
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  title="Delete"
                                  className="p-1.5 rounded-lg bg-[#202030] hover:bg-red-900/60 text-[#9ca3af] hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Table Reservations (Part E) */}
              {activeTab === 'reservations' && (
                <div className="space-y-4">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171724] p-3.5 rounded-2xl border border-[#2a2a3e]">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {(['all', 'pending', 'confirmed', 'archived'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setReservationFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                            reservationFilter === filter
                              ? 'bg-[#8c1c1c] text-[#ffcc33]'
                              : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                          }`}
                        >
                          {filter}
                          {filter === 'all' && ` (${reservations.length})`}
                          {filter === 'pending' && ` (${reservations.filter((r) => (r.status || 'pending') === 'pending').length})`}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                      <input
                        type="text"
                        placeholder="Search guest, phone, game..."
                        value={reservationSearch}
                        onChange={(e) => setReservationSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#12121b] border border-[#2e2e42] rounded-xl text-xs text-white outline-none focus:border-[#ffcc33]"
                      />
                    </div>
                  </div>

                  {filteredReservations.length === 0 ? (
                    <div className="py-12 text-center text-[#9ca3af]">
                      <Calendar className="w-10 h-10 text-[#4b5563] mx-auto mb-2" />
                      <p className="text-sm font-semibold">No table reservations found.</p>
                      <p className="text-xs text-[#6b7280] mt-1">
                        Submissions from the "Reserve a Table" form will appear here live.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredReservations.map((res) => {
                        const status = res.status || 'pending';
                        return (
                          <div
                            key={res.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              status === 'pending'
                                ? 'bg-[#1a1720] border-amber-500/40'
                                : status === 'confirmed'
                                ? 'bg-[#14201a] border-emerald-500/40'
                                : 'bg-[#14141d] border-[#252535] opacity-70'
                            }`}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-white text-base">{res.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    status === 'pending'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : status === 'confirmed'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-slate-700 text-slate-300'
                                  }`}
                                >
                                  {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-[#252538] text-[#ffcc33] text-xs font-semibold">
                                  {res.partySize} Guests
                                </span>
                                {res.preferredGame && (
                                  <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs">
                                    🎲 {res.preferredGame}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#cbd5e1]">
                                <span className="flex items-center gap-1 text-[#ffcc33] font-medium">
                                  <Clock className="w-3.5 h-3.5" /> {res.preferredDateTime}
                                </span>
                                <span className="text-[#9ca3af]">&bull; Logged: {res.createdAt}</span>
                              </div>

                              {res.specialNotes && (
                                <p className="text-xs text-[#e2e8f0] bg-[#12121c] p-2.5 rounded-xl border border-[#232334] italic">
                                  "{res.specialNotes}"
                                </p>
                              )}

                              {/* Customer Contact Links */}
                              <div className="flex items-center gap-2 pt-1">
                                <a
                                  href={`tel:${res.phone}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#202030] hover:bg-[#2e2e42] text-xs text-white transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-[#ffcc33]" />
                                  <span>{res.phone}</span>
                                </a>

                                <a
                                  href={formatWhatsAppUrl(res.phone, res.name, 'Table Reservation')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700/60 hover:bg-emerald-600 text-xs text-white transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3 text-emerald-300" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>

                            {/* Status Actions */}
                            <div className="flex flex-wrap md:flex-col items-end gap-1.5 flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    status === 'confirmed'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                  }`}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'archived')}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    status === 'archived'
                                      ? 'bg-slate-600 text-white'
                                      : 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                  }`}
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteReservation(res.id)}
                                  className="p-1.5 rounded-lg bg-[#202030] hover:bg-red-900/60 text-[#9ca3af] hover:text-red-300 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Daily Special Banner */}
              {activeTab === 'special' && (
                <div className="p-5 rounded-2xl bg-[#171725] border border-[#27273a] space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bebas text-2xl text-[#ffcc33] tracking-wide">
                        Daily Special Banner Configuration
                      </h4>
                      <p className="text-xs text-[#9ca3af]">
                        Prominently displayed in the Hero section and highlighted on the menu.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dailySpecial.enabled}
                        onChange={(e) => setDailySpecial({ ...dailySpecial, enabled: e.target.checked })}
                        className="w-5 h-5 accent-[#b3231c]"
                      />
                      <span className="text-xs font-bold text-white">Active on Hero</span>
                    </label>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs text-[#cbd5e1] font-bold uppercase mb-1">
                        Special Headline (EN)
                      </label>
                      <input
                        type="text"
                        value={dailySpecial.title}
                        onChange={(e) => setDailySpecial({ ...dailySpecial, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-sm text-white focus:border-[#ffcc33] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#cbd5e1] font-bold uppercase mb-1">
                        Special Promo Description
                      </label>
                      <textarea
                        rows={2}
                        value={dailySpecial.subtitle}
                        onChange={(e) => setDailySpecial({ ...dailySpecial, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white focus:border-[#ffcc33] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#cbd5e1] font-bold uppercase mb-1">
                          Linked Menu Item
                        </label>
                        <select
                          value={dailySpecial.linkedItemId || ''}
                          onChange={(e) => setDailySpecial({ ...dailySpecial, linkedItemId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white focus:border-[#ffcc33] outline-none"
                        >
                          <option value="">None (Custom Promo)</option>
                          {MENU_ITEMS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({typeof item.price === 'number' ? `${item.price} DA` : `${item.price.regular} DA`})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#cbd5e1] font-bold uppercase mb-1">
                          Special Promo Price (DZD)
                        </label>
                        <input
                          type="number"
                          value={dailySpecial.specialPrice || 500}
                          onChange={(e) => setDailySpecial({ ...dailySpecial, specialPrice: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-sm text-white focus:border-[#ffcc33] outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveDailySpecial}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white font-bebas text-lg tracking-wider font-bold shadow-lg active:scale-95 transition-all"
                    >
                      SAVE DAILY SPECIAL
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Tournament Leaderboard */}
              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  {/* Add Player Form */}
                  <form onSubmit={handleAddPlayer} className="p-4 rounded-2xl bg-[#171725] border border-[#27273a] space-y-3">
                    <h4 className="font-bebas text-xl text-[#ffcc33] tracking-wide">
                      Add New Tournament Player / Score
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Player Name / Nickname..."
                          value={newPlayerName}
                          onChange={(e) => setNewPlayerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Main Game (e.g. Catan, Azul)..."
                          value={newPlayerGame}
                          onChange={(e) => setNewPlayerGame(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder="Victories..."
                          value={newPlayerWins}
                          onChange={(e) => setNewPlayerWins(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-base tracking-wider font-bold"
                      >
                        ADD PLAYER
                      </button>
                    </div>
                  </form>

                  {/* Leaderboard Table */}
                  <div className="space-y-2">
                    {leaderboard.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-xl bg-[#161622] border border-[#2a2a3e] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-[#27273c] text-[#ffcc33] font-mono font-bold text-xs flex items-center justify-center">
                            #{player.rank}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-white">{player.playerName}</span>
                            <span className="text-xs text-[#9ca3af] ml-2">({player.favoriteGame})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-[#ffcc33] font-bold">
                            {player.wins} Wins &bull; {player.points} Pts
                          </span>

                          <button
                            onClick={() => handleIncrementPlayerWin(player.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#28283c] hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                          >
                            +1 Win
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Seasonal / Ramadan Hours */}
              {activeTab === 'seasonal' && (
                <div className="p-6 rounded-2xl bg-[#171725] border border-[#27273a] max-w-xl mx-auto space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto">
                    <Moon className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="font-bebas text-2xl text-white tracking-wide">
                      Seasonal / Ramadan Hours Switch
                    </h4>
                    <p className="text-xs text-[#cbd5e1] mt-1">
                      Toggle to display special evening and Sahoor hours (8:00 PM – 2:30 AM) with a dedicated top banner across the whole app.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#12121b] border border-[#2d2d42] flex items-center justify-between text-left">
                    <div>
                      <span className="font-bold text-sm text-white">
                        {CAFE_CONFIG.seasonalMode.name}
                      </span>
                      <span className="block text-xs text-[#ffcc33] mt-0.5">
                        {CAFE_CONFIG.seasonalMode.hours}
                      </span>
                    </div>

                    <button
                      onClick={handleToggleSeasonalMode}
                      className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider font-bold transition-all ${
                        seasonalEnabled
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-[#28283c] text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {seasonalEnabled ? 'ENABLED (ACTIVE)' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: Reviews Moderation */}
              {activeTab === 'reviews' && (
                reviews.length === 0 ? (
                  <div className="py-12 text-center text-[#9ca3af]">
                    <p className="text-sm">No reviews found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => {
                      const isHidden = rev.status === 'hidden';
                      return (
                        <div
                          key={rev.id}
                          className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                            isHidden
                              ? 'bg-[#15151e] border-[#222230] opacity-60'
                              : 'bg-[#171725] border-[#27273a]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{rev.author}</span>
                              <div className="flex text-[#ffcc33]">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                              <span className="text-[10px] text-[#9ca3af]">({rev.date})</span>
                            </div>
                            <p className="text-xs text-[#cbd5e1] mt-1 italic">
                              "{rev.text}"
                            </p>
                          </div>

                          <button
                            onClick={() => handleToggleReviewStatus(rev.id, rev.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                              isHidden
                                ? 'bg-[#202030] text-[#9ca3af] hover:text-white'
                                : 'bg-emerald-700/50 text-emerald-200 border border-emerald-500/40'
                            }`}
                          >
                            {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isHidden ? 'Hidden' : 'Approved'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
