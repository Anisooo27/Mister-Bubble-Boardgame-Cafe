import React, { useState, useMemo, useEffect } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { MenuItem, MenuCategory, TrayItem } from '../types';
import { TornBanner } from './TornBanner';
import { PriceMedallion } from './PriceMedallion';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CombosSection } from './CombosSection';
import { ReorderCard } from './ReorderCard';
import { WeatherNudge } from './WeatherNudge';
import { CafeImage } from './CafeImage';
import { ItemDetailModal } from './ItemDetailModal';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Sparkles,
  Plus,
  Check,
  Info,
  Users,
  Utensils,
  Ban,
  Heart,
  Flame,
  Tag,
  ShoppingBag,
  ArrowRight,
  SlidersHorizontal,
  XCircle,
  Eye
} from 'lucide-react';

interface MenuProps {
  onAddToTray: (item: MenuItem, size?: 'regular' | 'large') => void;
  onReorderAll?: (items: TrayItem[]) => void;
  trayItems?: TrayItem[];
  onOpenTray?: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  onAddToTray,
  onReorderAll,
  trayItems = [],
  onOpenTray,
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'under500' | 'specials' | 'boba' | 'desserts' | 'boxes'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemMap, setAddedItemMap] = useState<{ [key: string]: boolean }>({});
  const [soldOutItemIds, setSoldOutItemIds] = useState<string[]>([]);
  const [favoriteItemIds, setFavoriteItemIds] = useState<string[]>([]);
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);

  // Load sold-out items
  useEffect(() => {
    const loadSoldOut = () => {
      try {
        const saved = localStorage.getItem('mb_sold_out_items');
        if (saved) {
          setSoldOutItemIds(JSON.parse(saved));
        } else {
          setSoldOutItemIds([]);
        }
      } catch {
        // ignore
      }
    };

    loadSoldOut();
    window.addEventListener('storage', loadSoldOut);
    return () => window.removeEventListener('storage', loadSoldOut);
  }, []);

  // Load customer favorites from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('mb_favorite_items');
      if (savedFavs) {
        setFavoriteItemIds(JSON.parse(savedFavs));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleFavorite = (itemId: string) => {
    setFavoriteItemIds((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      try {
        localStorage.setItem('mb_favorite_items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleAddClick = (e: React.MouseEvent, item: MenuItem, size?: 'regular' | 'large') => {
    e.stopPropagation();
    if (soldOutItemIds.includes(item.id)) return;
    onAddToTray(item, size);
    const key = size ? `${item.id}-${size}` : item.id;
    setAddedItemMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // Quick Filter Logic
  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return MENU_CATEGORIES;
    }
    return MENU_CATEGORIES.filter((cat) => cat.id === selectedCategory);
  }, [selectedCategory]);

  const favoriteItems = useMemo(() => {
    return MENU_ITEMS.filter((i) => favoriteItemIds.includes(i.id));
  }, [favoriteItemIds]);

  const totalTrayCount = trayItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalTrayPrice = trayItems.reduce(
    (sum, item) => sum + item.calculatedPrice * item.quantity,
    0
  );

  return (
    <section
      id="menu"
      className="relative py-20 lg:py-28 bg-[#0b0b0e] overflow-hidden border-t border-[#1f1f2b]"
    >
      <div className="absolute inset-0 bg-grunge opacity-60 pointer-events-none" />
      <MonsteraLeaf position="top-left" opacity={0.35} />
      <MonsteraLeaf position="bottom-right" opacity={0.3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Weather Aware Menu Nudge */}
        <WeatherNudge />

        {/* Reorder Previous Visit Card */}
        {onReorderAll && <ReorderCard onReorder={onReorderAll} />}

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1e1e2c] border border-[#f2a900]/40 text-[#ffcc33] text-xs font-semibold mb-3 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL PRINTED MENU &amp; PRICES IN DZD / DA</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl text-white tracking-widest leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {t('menu.title')}
          </h2>
          <div className="font-arabic font-bold text-xl sm:text-2xl text-[#ffcc33] mt-1">
            قائمة المشروبات والحلويات الرسمية
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#cbd5e1] mt-3">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Search & Quick Filter Chips */}
        <div className="max-w-4xl mx-auto mb-8 space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search Taro milk tea, Bueno frappe, takoyaki waffles, mojitos, fruit boxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#14141d] border border-[#2c2c3e] focus:border-[#f2a900] rounded-2xl text-sm text-white placeholder-[#6b7280] outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af] hover:text-white bg-[#222232] px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-[#9ca3af] flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-[#ffcc33]" />
              Quick Filters:
            </span>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeFilter === 'popular'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              <Flame className="w-3 h-3 text-[#e69500]" />
              Popular
            </button>

            <button
              onClick={() => setActiveFilter('under500')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeFilter === 'under500'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              <Tag className="w-3 h-3 text-emerald-400" />
              Under 500 DA
            </button>

            <button
              onClick={() => setActiveFilter('boba')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'boba'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              🧋 Boba Teas
            </button>

            <button
              onClick={() => setActiveFilter('desserts')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'desserts'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              🧇 Waffles &amp; Crêpes
            </button>

            <button
              onClick={() => setActiveFilter('boxes')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'boxes'
                  ? 'bg-[#ffcc33] text-[#0f0f14]'
                  : 'bg-[#181826] text-[#cbd5e1] hover:text-white border border-[#28283a]'
              }`}
            >
              🍓 Sharing Boxes
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="relative mb-10">
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-[#2b2b3d]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white shadow-[0_0_15px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60'
                  : 'bg-[#151520] text-[#9ca3af] hover:text-white hover:bg-[#1f1f2e] border border-[#252538]'
              }`}
            >
              <span>{t('menu.allCategories')}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/40 font-mono text-[#ffcc33]">
                {MENU_ITEMS.length}
              </span>
            </button>

            {MENU_CATEGORIES.map((cat) => {
              const count = MENU_ITEMS.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white shadow-[0_0_15px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60'
                      : 'bg-[#151520] text-[#9ca3af] hover:text-white hover:bg-[#1f1f2e] border border-[#252538]'
                  }`}
                >
                  <span>{language === 'ar' ? cat.titleArabic : cat.title}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/40 font-mono text-[#ffcc33]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature: Handcrafted Combo Deals & Bundles */}
        <CombosSection onAddToTray={onAddToTray} />

        {/* Customer Favorites Shelf (Part D.4) */}
        {favoriteItems.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-14 p-6 rounded-3xl bg-gradient-to-r from-[#1c1829] via-[#241724] to-[#1c1829] border-2 border-[#ffcc33]/40 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-[#ffcc33]">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <h3 className="font-bebas text-2xl text-white tracking-wide">
                  YOUR SAVED FAVORITES ({favoriteItems.length})
                </h3>
              </div>
              <span className="text-xs text-[#cbd5e1]">Quick 1-tap re-order</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteItems.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => setActiveDetailItem(fav)}
                  className="p-3.5 rounded-2xl bg-[#14121d] border border-[#ffcc33]/30 hover:border-[#ffcc33] flex items-center justify-between gap-3 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bebas text-lg text-[#ffcc33] truncate">{fav.name}</h4>
                    <span className="text-xs text-[#9ca3af]">
                      {typeof fav.price === 'number' ? `${fav.price} DZD` : 'Multi-size'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleAddClick(e, fav)}
                    className="p-2 rounded-xl bg-[#8c1c1c] hover:bg-[#b3231c] text-[#ffcc33] flex items-center justify-center transition-colors shadow"
                    title="Add to Tray"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Categories & Item Grid */}
        <div className="space-y-16">
          {filteredCategories.map((category) => {
            const items = MENU_ITEMS.filter((item) => {
              const matchesCategory = item.category === category.id;
              const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                item.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

              let matchesFilter = true;
              if (activeFilter === 'popular') matchesFilter = !!item.isPopular || !!item.isHouseSpecial;
              if (activeFilter === 'under500') {
                const p = typeof item.price === 'number' ? item.price : item.price.regular;
                matchesFilter = p <= 500;
              }
              if (activeFilter === 'boba') matchesFilter = item.category === 'milk-tea' || item.category === 'fruit-tea';
              if (activeFilter === 'desserts') matchesFilter = item.category === 'takoyaki-waffle' || item.category === 'bubble-waffle' || item.category === 'crepes';
              if (activeFilter === 'boxes') matchesFilter = item.category === 'fruit-box';

              return matchesCategory && (searchQuery ? matchesSearch : true) && matchesFilter;
            });

            if (items.length === 0) return null;

            const isFruitBoxCategory = category.id === 'fruit-box';

            return (
              <div key={category.id} className="relative scroll-mt-28" id={`category-${category.id}`}>
                {/* Torn Ribbon Category Header */}
                <div className="flex flex-col items-center mb-8">
                  <TornBanner
                    title={category.title}
                    titleArabic={category.titleArabic}
                    gradient={category.bannerGradient}
                  />
                  <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-lg text-center mt-1">
                    {category.subtitle}
                  </p>
                </div>

                {/* Items Grid */}
                <div
                  className={`grid gap-6 ${
                    isFruitBoxCategory
                      ? 'grid-cols-1 md:grid-cols-3'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {items.map((item) => {
                    const isSoldOut = soldOutItemIds.includes(item.id);
                    const isFavorite = favoriteItemIds.includes(item.id);
                    const isAddedSimple = addedItemMap[item.id];
                    const isAddedReg = addedItemMap[`${item.id}-regular`];
                    const isAddedLrg = addedItemMap[`${item.id}-large`];

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveDetailItem(item)}
                        className={`relative rounded-3xl bg-[#14141d]/95 border ${
                          isSoldOut
                            ? 'border-red-900/40 opacity-75'
                            : isFruitBoxCategory
                            ? 'border-[#f2a900]/40'
                            : 'border-[#262638]'
                        } hover:border-[#f2a900]/70 p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] group flex flex-col justify-between cursor-pointer`}
                      >
                        {/* Top Highlights: Favorite heart, House special, Popular, or Sold Out badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isSoldOut ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#8c1c1c] text-white text-[10px] font-bold tracking-wider uppercase border border-red-500 flex items-center gap-1">
                                <Ban className="w-3 h-3" />
                                {t('menu.soldOutBadge')}
                              </span>
                            ) : (
                              <>
                                {isFruitBoxCategory && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#78350f] text-[#ffcc33] text-[10px] font-black tracking-wider uppercase border border-[#ffcc33]/50 flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Sharing Box
                                  </span>
                                )}
                                {item.isHouseSpecial && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#b3231c]/90 text-white text-[10px] font-bold tracking-wider uppercase border border-[#ffcc33]/40">
                                    ★ House Special
                                  </span>
                                )}
                                {item.isPopular && !item.isHouseSpecial && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#e69500]/90 text-[#0f0f14] text-[10px] font-black tracking-wider uppercase">
                                    Popular
                                  </span>
                                )}
                                {item.volume && !isFruitBoxCategory && (
                                  <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded bg-[#1f1f2c]">
                                    {item.volume}
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* Heart toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(item.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isFavorite
                                ? 'text-rose-500 hover:text-rose-400'
                                : 'text-[#6b7280] hover:text-[#ffcc33]'
                            }`}
                            title={isFavorite ? 'Remove favorite' : 'Save to favorites'}
                            aria-label="Toggle favorite"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Middle Content: Name, Description, Price Medallion */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h4 className="font-bebas text-2xl sm:text-3xl text-[#ffcc33] text-gold-glow tracking-wider leading-tight group-hover:text-[#ffe066] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mt-1.5">
                              {item.description}
                            </p>
                          </div>

                          {/* Authentic Red-Gold Price Medallion */}
                          <div className="flex-shrink-0 transform group-hover:scale-105 transition-transform">
                            <PriceMedallion price={item.price} size="md" />
                          </div>
                        </div>

                        {/* Ingredients checklist for Fruit Box Series */}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="mb-4 p-3 rounded-xl bg-[#1b1926] border border-[#302d42]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffcc33] block mb-1.5">
                              Included in this Sharing Box:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {item.ingredients.map((ing, ingIdx) => (
                                <div
                                  key={ingIdx}
                                  className="flex items-center gap-1.5 text-xs text-[#cbd5e1]"
                                >
                                  <Check className="w-3 h-3 text-[#ffcc33] flex-shrink-0" />
                                  <span className="truncate">{ing}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Product Image preview with Safe Fallback */}
                        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 border border-[#232332]">
                          <CafeImage
                            src={item.image}
                            filename={item.imageFilename}
                            alt={item.name}
                            title={item.name}
                            aspectRatio="aspect-auto h-full w-full"
                          />
                        </div>

                        {/* Item Tags & Tray Action */}
                        <div className="pt-3 border-t border-[#222233] flex items-center justify-between gap-2 mt-auto">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {item.tags?.slice(0, 2).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-medium text-[#94a3b8] px-2 py-0.5 rounded bg-[#1c1c28]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Add to Tray Button / Sold Out State */}
                          {isSoldOut ? (
                            <div className="px-3 py-1.5 rounded-lg bg-[#24171a] border border-red-900/50 text-red-400 text-xs font-bold font-bebas tracking-wider flex items-center gap-1">
                              <Ban className="w-3.5 h-3.5" />
                              <span>{t('menu.soldOutToday')}</span>
                            </div>
                          ) : typeof item.price === 'object' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => handleAddClick(e, item, 'regular')}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                  isAddedReg
                                    ? 'bg-emerald-600 text-white border-emerald-400'
                                    : 'bg-[#1e1e2d] hover:bg-[#b3231c] text-white border-[#37374e] hover:border-[#ffcc33]'
                                }`}
                                title="Add Coconut (450 DA) to Tray"
                              >
                                {isAddedReg ? '✓ Coconut' : `+ Coconut (${item.price.regular} DA)`}
                              </button>
                              <button
                                onClick={(e) => handleAddClick(e, item, 'large')}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                  isAddedLrg
                                    ? 'bg-emerald-600 text-white border-emerald-400'
                                    : 'bg-[#1e1e2d] hover:bg-[#b3231c] text-white border-[#37374e] hover:border-[#ffcc33]'
                                }`}
                                title="Add Caramel (500 DA) to Tray"
                              >
                                {isAddedLrg ? '✓ Caramel' : `+ Caramel (${item.price.large} DA)`}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleAddClick(e, item)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isAddedSimple
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#1e1e2d] hover:bg-gradient-to-r hover:from-[#b3231c] hover:to-[#8c1c1c] text-[#ffcc33] hover:text-white border border-[#37374e] hover:border-[#ffcc33]/60'
                              }`}
                            >
                              {isAddedSimple ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{t('menu.addToTray')}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu Note / Custom Boba Advice */}
        <div className="mt-16 p-6 rounded-3xl bg-[#161622] border border-[#2b2b3d] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-center sm:text-left shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b3231c]/20 border border-[#b3231c]/40 flex items-center justify-center text-[#ffcc33] flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bebas text-xl text-white tracking-wide">Custom Boba &amp; Sweetness Levels</h5>
              <p className="text-xs text-[#cbd5e1] mt-0.5">
                Adjust ice, sugar levels, or ask for extra Popping Boba &amp; Tapioca pearls at the counter!
              </p>
            </div>
          </div>
          <a
            href="#location"
            className="px-5 py-2.5 rounded-xl bg-[#ffcc33] hover:bg-[#ffd966] text-[#0f0f14] font-bebas text-lg tracking-wider font-bold transition-colors whitespace-nowrap shadow"
          >
            ORDER AT THE CAFE
          </a>
        </div>
      </div>

      {/* Item Detail Quick-View Modal (Part D.3) */}
      <ItemDetailModal
        item={activeDetailItem}
        isOpen={!!activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
        onAddToTray={onAddToTray}
        isFavorite={activeDetailItem ? favoriteItemIds.includes(activeDetailItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isSoldOut={activeDetailItem ? soldOutItemIds.includes(activeDetailItem.id) : false}
      />

      {/* Sticky Mini-Cart Bar (Part D.1) */}
      {totalTrayCount > 0 && onOpenTray && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#161424]/95 backdrop-blur-md border-2 border-[#ffcc33] p-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center font-bold font-bebas text-base shadow">
              {totalTrayCount}
            </div>
            <div>
              <div className="font-bebas text-base text-white leading-tight">
                {totalTrayCount} Item{totalTrayCount > 1 ? 's' : ''} in Tray
              </div>
              <div className="font-bebas text-lg text-[#ffcc33] text-gold-glow leading-none">
                {totalTrayPrice} DZD
              </div>
            </div>
          </div>

          <button
            onClick={onOpenTray}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b3231c] via-[#8c1c1c] to-[#601212] hover:from-[#d12a22] text-white font-bebas text-base tracking-wider flex items-center gap-1.5 border border-[#ffcc33]/60 shadow"
          >
            <span>VIEW CART &amp; ORDER</span>
            <ArrowRight className="w-4 h-4 text-[#ffcc33]" />
          </button>
        </div>
      )}
    </section>
  );
};
