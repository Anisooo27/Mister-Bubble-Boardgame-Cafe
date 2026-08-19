import React, { useState, useEffect } from 'react';
import { OrderDetails, ReviewItem, DailySpecial, AnnouncementItem, LeaderboardEntry } from '../types';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock,
  Unlock,
  ClipboardList,
  CheckCircle,
  Clock,
  Car,
  Bike,
  Utensils,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  X,
  Sparkles,
  Flame,
  Megaphone,
  Trophy,
  Moon,
  Ban,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Tag
} from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  
  // Tabs: orders | availability | special | announcements | leaderboard | seasonal | reviews
  const [activeTab, setActiveTab] = useState<'orders' | 'availability' | 'special' | 'announcements' | 'leaderboard' | 'seasonal' | 'reviews'>('orders');

  // Data states
  const [orders, setOrders] = useState<OrderDetails[]>([]);
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
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonalEnabled, setSeasonalEnabled] = useState<boolean>(false);

  // Search filter for item availability tab
  const [availabilitySearch, setAvailabilitySearch] = useState('');

  // Announcement form modal state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Drink Drop' | 'Tournament' | 'Holiday' | 'Community'>('Drink Drop');
  const [newAnnPinned, setNewAnnPinned] = useState(false);

  // Leaderboard player add state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGame, setNewPlayerGame] = useState('Settlers of Catan');
  const [newPlayerWins, setNewPlayerWins] = useState(1);
  const [newPlayerPoints, setNewPlayerPoints] = useState(30);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadData();
    }
  }, [isOpen, isUnlocked]);

  const loadData = () => {
    try {
      // Orders
      const ordersStr = localStorage.getItem('mb_order_history');
      if (ordersStr) setOrders(JSON.parse(ordersStr));

      // Reviews
      const reviewsStr = localStorage.getItem('mb_custom_reviews');
      if (reviewsStr) setReviews(JSON.parse(reviewsStr));

      // Sold Out items
      const soldOutStr = localStorage.getItem('mb_sold_out_items');
      if (soldOutStr) setSoldOutItemIds(JSON.parse(soldOutStr));

      // Daily Special
      const specialStr = localStorage.getItem('mb_daily_special');
      if (specialStr) setDailySpecial(JSON.parse(specialStr));

      // Announcements
      const annStr = localStorage.getItem('mb_announcements');
      if (annStr) setAnnouncements(JSON.parse(annStr));

      // Leaderboard
      const leadStr = localStorage.getItem('mb_leaderboard');
      if (leadStr) setLeaderboard(JSON.parse(leadStr));

      // Seasonal Mode
      const seasonStr = localStorage.getItem('mb_seasonal_mode');
      if (seasonStr) setSeasonalEnabled(JSON.parse(seasonStr));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === CAFE_CONFIG.staffDemoPin) {
      setIsUnlocked(true);
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
    }
  };

  // 1. Orders
  const handleStatusChange = (orderId: string, newStatus: OrderDetails['status']) => {
    const updated = orders.map((ord) =>
      ord.orderId === orderId ? { ...ord, status: newStatus } : ord
    );
    setOrders(updated);
    localStorage.setItem('mb_order_history', JSON.stringify(updated));
  };

  // 2. Sold Out Items
  const handleToggleSoldOut = (itemId: string) => {
    const isCurrentlySoldOut = soldOutItemIds.includes(itemId);
    let next: string[];
    if (isCurrentlySoldOut) {
      next = soldOutItemIds.filter((id) => id !== itemId);
    } else {
      next = [...soldOutItemIds, itemId];
    }
    setSoldOutItemIds(next);
    localStorage.setItem('mb_sold_out_items', JSON.stringify(next));
  };

  const handleResetAvailability = () => {
    setSoldOutItemIds([]);
    localStorage.setItem('mb_sold_out_items', JSON.stringify([]));
  };

  // 3. Daily Special
  const handleSaveDailySpecial = () => {
    localStorage.setItem('mb_daily_special', JSON.stringify(dailySpecial));
    alert("Daily Special Banner settings saved successfully!");
  };

  // 4. Announcements
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: newAnnCategory,
      title: newAnnTitle,
      content: newAnnContent,
      pinned: newAnnPinned,
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('mb_announcements', JSON.stringify(updated));
    setNewAnnTitle('');
    setNewAnnContent('');
  };

  const handleDeleteAnnouncement = (annId: string) => {
    const updated = announcements.filter((a) => a.id !== annId);
    setAnnouncements(updated);
    localStorage.setItem('mb_announcements', JSON.stringify(updated));
  };

  // 5. Leaderboard
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      id: `lead-${Date.now()}`,
      rank: leaderboard.length + 1,
      playerName: newPlayerName,
      favoriteGame: newPlayerGame,
      wins: newPlayerWins,
      points: newPlayerPoints,
      badge: 'Tabletop Competitor',
    };

    const updated = [...leaderboard, newEntry].sort((a, b) => b.points - a.points).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    setLeaderboard(updated);
    localStorage.setItem('mb_leaderboard', JSON.stringify(updated));
    setNewPlayerName('');
  };

  const handleIncrementPlayerWin = (playerId: string) => {
    const updated = leaderboard.map((p) => {
      if (p.id === playerId) {
        return { ...p, wins: p.wins + 1, points: p.points + 30 };
      }
      return p;
    }).sort((a, b) => b.points - a.points).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    setLeaderboard(updated);
    localStorage.setItem('mb_leaderboard', JSON.stringify(updated));
  };

  // 6. Seasonal Hours
  const handleToggleSeasonalMode = () => {
    const next = !seasonalEnabled;
    setSeasonalEnabled(next);
    localStorage.setItem('mb_seasonal_mode', JSON.stringify(next));
  };

  // 7. Reviews
  const handleToggleReviewStatus = (reviewId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'hidden' ? 'approved' : 'hidden';
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, status: nextStatus as any } : r
    );
    setReviews(updated);
    localStorage.setItem('mb_custom_reviews', JSON.stringify(updated));
  };

  if (!isOpen) return null;

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
                Mister Bubble Control Center • Live Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Staff Portal"
            className="p-2 rounded-lg bg-[#202030] text-[#9ca3af] hover:text-white hover:bg-[#2c2c42] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unlocked State vs PIN Gate */}
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
                placeholder="Enter PIN (7788)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl px-4 py-3 rounded-2xl bg-[#191928] border border-[#333348] text-[#ffcc33] focus:outline-none focus:border-[#ffcc33]"
              />

              {pinError && (
                <div className="text-xs text-red-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Incorrect PIN. Use demo code: 7788</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white font-bebas text-lg tracking-wider border border-[#ffcc33]/40 shadow-lg"
              >
                {t('staff.btnUnlock')}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Navigation Tabs Header */}
            <div className="px-4 py-2 bg-[#151520] border-b border-[#232332] flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabOrders')} ({orders.length})
                </button>

                <button
                  onClick={() => setActiveTab('availability')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'availability'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabAvailability')} ({soldOutItemIds.length})
                </button>

                <button
                  onClick={() => setActiveTab('special')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'special'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabSpecial')}
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'announcements'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabAnnouncements')} ({announcements.length})
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'leaderboard'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabLeaderboard')}
                </button>

                <button
                  onClick={() => setActiveTab('seasonal')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'seasonal'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabSeasonal')}
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider transition-all whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('staff.tabReviews')} ({reviews.length})
                </button>
              </div>

              <button
                onClick={loadData}
                className="p-1.5 rounded-lg bg-[#20202e] text-[#9ca3af] hover:text-white text-xs flex items-center gap-1 flex-shrink-0"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              
              {/* TAB 1: Live Orders Queue */}
              {activeTab === 'orders' && (
                orders.length === 0 ? (
                  <div className="py-12 text-center text-[#9ca3af]">
                    <p className="text-sm">No incoming orders in queue yet.</p>
                    <p className="text-xs text-[#6b7280] mt-1">
                      Orders placed via the online checkout or QR tents appear here live.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => {
                      const currentStatus = ord.status || 'placed';
                      return (
                        <div
                          key={ord.orderId}
                          className="p-4 rounded-2xl bg-[#171725] border border-[#27273a] hover:border-[#ffcc33]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#ffcc33]">
                                {ord.orderId}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#232336] text-white flex items-center gap-1">
                                {ord.orderType === 'dine-in' && <Utensils className="w-3 h-3" />}
                                {ord.orderType === 'pickup' && <Car className="w-3 h-3" />}
                                {ord.orderType === 'delivery' && <Bike className="w-3 h-3" />}
                                <span>{ord.orderType}</span>
                              </span>
                              <span className="text-[11px] text-[#9ca3af]">{ord.timestamp}</span>
                            </div>

                            <div className="font-bold text-white text-sm">
                              {ord.customerName} &bull; <span className="text-[#9ca3af] font-normal">{ord.customerPhone}</span>
                            </div>

                            <div className="text-xs text-[#cbd5e1]">
                              {ord.items.map((it) => `${it.quantity}x ${it.item.name}`).join(' • ')}
                            </div>

                            {ord.tableNumber && (
                              <div className="text-xs text-[#ffcc33] font-medium">
                                Table: {ord.tableNumber}
                              </div>
                            )}
                            {ord.perkApplied && (
                              <div className="text-xs text-emerald-400 font-medium">
                                Perk: {ord.perkApplied}
                              </div>
                            )}
                            {ord.specialNotes && (
                              <div className="text-xs text-amber-300 italic">
                                Note: {ord.specialNotes}
                              </div>
                            )}
                          </div>

                          {/* 4 Status Buttons */}
                          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                            <div className="font-bebas text-xl text-[#ffcc33]">
                              {ord.total} DZD
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={() => handleStatusChange(ord.orderId, 'placed')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  currentStatus === 'placed'
                                    ? 'bg-[#b3231c] text-white'
                                    : 'bg-[#202030] text-[#9ca3af] hover:bg-[#2b2b40]'
                                }`}
                              >
                                {t('staff.statusNew')}
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.orderId, 'preparing')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  currentStatus === 'preparing'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-[#202030] text-[#9ca3af] hover:bg-[#2b2b40]'
                                }`}
                              >
                                {t('staff.statusPreparing')}
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.orderId, 'ready')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  currentStatus === 'ready'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#202030] text-[#9ca3af] hover:bg-[#2b2b40]'
                                }`}
                              >
                                {t('staff.statusReady')}
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.orderId, 'completed')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  currentStatus === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#202030] text-[#9ca3af] hover:bg-[#2b2b40]'
                                }`}
                              >
                                {t('staff.statusCompleted')}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* TAB 2: Item Availability ("Sold Out Today") */}
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
                      className="px-3 py-1.5 rounded-xl bg-[#28283c] hover:bg-[#353550] text-[#ffcc33] text-xs font-bold font-bebas tracking-wider"
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
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                            isSoldOut
                              ? 'bg-[#201416] border-[#b3231c]/60'
                              : 'bg-[#161622] border-[#29293c]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{item.name}</span>
                              {isSoldOut && (
                                <span className="px-2 py-0.5 rounded bg-[#b3231c] text-white text-[10px] font-bold font-bebas">
                                  SOLD OUT TODAY
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#9ca3af] capitalize">
                              {item.category.replace('-', ' ')} &bull; {typeof item.price === 'number' ? `${item.price} DA` : `${item.price.regular} DA`}
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

              {/* TAB 3: Daily Special Banner */}
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
                          Linked Menu Item ID
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
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white font-bebas text-lg tracking-wider font-bold shadow-lg"
                    >
                      SAVE DAILY SPECIAL
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Announcements Feed Manager */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  {/* Create New Announcement Form */}
                  <form onSubmit={handleAddAnnouncement} className="p-4 rounded-2xl bg-[#171725] border border-[#27273a] space-y-3">
                    <h4 className="font-bebas text-xl text-[#ffcc33] tracking-wide">
                      Post New Café Announcement
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Announcement Title (e.g. New Sparkling Piña Colada Drop)..."
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none focus:border-[#ffcc33]"
                        />
                      </div>

                      <div>
                        <select
                          value={newAnnCategory}
                          onChange={(e) => setNewAnnCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none"
                        >
                          <option value="Drink Drop">Drink Drop</option>
                          <option value="Tournament">Tournament</option>
                          <option value="Holiday">Holiday / Ramadan</option>
                          <option value="Community">Community</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Announcement body content..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#12121b] border border-[#2d2d42] text-xs text-white outline-none focus:border-[#ffcc33]"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cbd5e1]">
                        <input
                          type="checkbox"
                          checked={newAnnPinned}
                          onChange={(e) => setNewAnnPinned(e.target.checked)}
                          className="w-4 h-4 accent-[#ffcc33]"
                        />
                        <span>Pin to top</span>
                      </label>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-base tracking-wider font-bold transition-all"
                      >
                        PUBLISH ANNOUNCEMENT
                      </button>
                    </div>
                  </form>

                  {/* List of Announcements */}
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3.5 rounded-2xl bg-[#161622] border border-[#2a2a3e] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#27273c] text-[10px] font-bold font-mono text-[#ffcc33]">
                              {ann.category}
                            </span>
                            <span className="font-bold text-sm text-white">{ann.title}</span>
                            {ann.pinned && (
                              <span className="text-[10px] text-amber-400 font-bold">★ PINNED</span>
                            )}
                          </div>
                          <p className="text-xs text-[#9ca3af] mt-1">{ann.content}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-2 rounded-xl bg-[#28181c] hover:bg-red-900 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Tournament Leaderboard Manager */}
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

              {/* TAB 6: Seasonal / Ramadan Hours Switch */}
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
                          ? 'bg-purple-600 text-white'
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
                    <p className="text-sm">No in-app submitted reviews yet.</p>
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
