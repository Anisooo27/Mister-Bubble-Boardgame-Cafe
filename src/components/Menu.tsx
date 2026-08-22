import React, { useState, useMemo, useEffect } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { MenuItem, MenuCategory } from '../types';
import { TornBanner } from './TornBanner';
import { PriceMedallion } from './PriceMedallion';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CombosSection } from './CombosSection';
import { WeatherNudge } from './WeatherNudge';
import { CafeImage } from './CafeImage';
import { ItemDetailModal } from './ItemDetailModal';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Sparkles,
  Info,
  Users,
  Utensils,
  Ban,
  Heart,
  Flame,
  Tag,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

export const Menu: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'under500' | 'specials' | 'boba' | 'desserts' | 'boxes'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  return (
    <section
      id="menu"
      className="relative py-20 lg:py-28 bg-[#faf6ee] overflow-hidden border-t border-[#ebd8c1]"
    >
      <div className="absolute inset-0 bg-grunge-warm opacity-70 pointer-events-none" />
      <MonsteraLeaf position="top-left" opacity={0.35} />
      <MonsteraLeaf position="bottom-right" opacity={0.3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Weather Aware Menu Nudge */}
        <WeatherNudge />

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#ffffff] border border-[#ebd8c1] text-[#8e5b2e] text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#f2a900]" />
            <span>OFFICIAL PRINTED MENU &amp; PRICES IN DZD / DA</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl text-[#8c1c1c] tracking-widest leading-none drop-shadow-sm">
            {t('menu.title')}
          </h2>
          <div className="font-arabic font-bold text-xl sm:text-2xl text-[#8e5b2e] mt-1">
            قائمة المشروبات والحلويات الرسمية
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#665547] mt-3 font-medium">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Search & Quick Filter Chips */}
        <div className="max-w-4xl mx-auto mb-8 space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e7b6d]" />
            <input
              type="text"
              placeholder="Search Taro milk tea, Bueno frappe, takoyaki waffles, mojitos, fruit boxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#ffffff] border border-[#ebd8c1] focus:border-[#8c1c1c] rounded-2xl text-sm text-[#2a1b12] placeholder-[#8e7b6d] outline-none transition-all shadow-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#786555] hover:text-[#2a1b12] bg-[#f4edd9] px-2 py-0.5 rounded font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-[#786555] flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-[#8e5b2e]" />
              Quick Filters:
            </span>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeFilter === 'all'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shadow-sm ${
                activeFilter === 'popular'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              <Flame className="w-3 h-3 text-[#f2a900]" />
              Popular
            </button>

            <button
              onClick={() => setActiveFilter('under500')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shadow-sm ${
                activeFilter === 'under500'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              <Tag className="w-3 h-3 text-emerald-600" />
              Under 500 DA
            </button>

            <button
              onClick={() => setActiveFilter('boba')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeFilter === 'boba'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              🧋 Boba Teas
            </button>

            <button
              onClick={() => setActiveFilter('desserts')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeFilter === 'desserts'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              🧇 Waffles &amp; Crêpes
            </button>

            <button
              onClick={() => setActiveFilter('boxes')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeFilter === 'boxes'
                  ? 'bg-[#8c1c1c] text-white shadow'
                  : 'bg-[#ffffff] text-[#3d2e24] hover:bg-[#f4edd9] border border-[#ebd8c1]'
              }`}
            >
              🍓 Sharing Boxes
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="relative mb-10">
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-[#ebd8c1]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#8c1c1c] text-white shadow-md border border-[#ffcc33]/40'
                  : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1] shadow-sm'
              }`}
            >
              <span>{t('menu.allCategories')}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/10 font-mono text-[#8c1c1c] font-bold">
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
                      ? 'bg-[#8c1c1c] text-white shadow-md border border-[#ffcc33]/40'
                      : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1] shadow-sm'
                  }`}
                >
                  <span>{language === 'ar' ? cat.titleArabic : cat.title}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/10 font-mono text-[#8c1c1c] font-bold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature: Handcrafted Combo Deals & Bundles */}
        <CombosSection />

        {/* Customer Favorites Shelf */}
        {favoriteItems.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-14 p-6 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-md">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-[#8c1c1c]">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <h3 className="font-bebas text-2xl text-[#2a1b12] tracking-wide">
                  YOUR SAVED FAVORITES ({favoriteItems.length})
                </h3>
              </div>
              <span className="text-xs text-[#786555] font-medium">Click any item for details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteItems.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => setActiveDetailItem(fav)}
                  className="p-3.5 rounded-2xl bg-[#fcf8f0] border border-[#ebd8c1] hover:border-[#8c1c1c] flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bebas text-lg text-[#2a1b12] truncate">{fav.name}</h4>
                    <span className="text-xs text-[#8c1c1c] font-bold">
                      {typeof fav.price === 'number' ? `${fav.price} DZD` : `${fav.price.regular} - ${fav.price.large} DZD`}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f4edd9] text-[#8c1c1c] flex items-center justify-center border border-[#ebd8c1]">
                    <Eye className="w-4 h-4" />
                  </div>
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
                  <p className="text-xs sm:text-sm text-[#786555] max-w-lg text-center mt-1 font-medium">
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

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveDetailItem(item)}
                        className={`relative rounded-3xl bg-[#ffffff] border ${
                          isSoldOut
                            ? 'border-red-300 opacity-75'
                            : isFruitBoxCategory
                            ? 'border-[#c8935f]'
                            : 'border-[#ebd8c1]'
                        } hover:border-[#8c1c1c] p-5 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between cursor-pointer`}
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
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4edd9] text-[#8e5b2e] text-[10px] font-black tracking-wider uppercase border border-[#ebd8c1] flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Sharing Box
                                  </span>
                                )}
                                {item.isHouseSpecial && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#8c1c1c] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                                    ★ House Special
                                  </span>
                                )}
                                {item.isPopular && !item.isHouseSpecial && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#f2a900] text-[#2a1b12] text-[10px] font-black tracking-wider uppercase">
                                    Popular
                                  </span>
                                )}
                                {item.volume && !isFruitBoxCategory && (
                                  <span className="text-[11px] text-[#786555] font-semibold px-2 py-0.5 rounded bg-[#f4edd9]">
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
                                : 'text-[#8e7b6d] hover:text-[#8c1c1c]'
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
                            <h4 className="font-bebas text-2xl sm:text-3xl text-[#2a1b12] tracking-wider leading-tight group-hover:text-[#8c1c1c] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#665547] leading-relaxed mt-1.5 font-medium">
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
                          <div className="mb-4 p-3 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c1c1c] block mb-1.5">
                              Included in this Sharing Box:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {item.ingredients.map((ing, ingIdx) => (
                                <div
                                  key={ingIdx}
                                  className="flex items-center gap-1.5 text-xs text-[#3d2e24]"
                                >
                                  <span className="text-[#8c1c1c] font-bold">•</span>
                                  <span className="truncate">{ing}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Product Image preview with Safe Fallback */}
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-3 border border-[#ebd8c1] bg-[#f4edd9]">
                          <CafeImage
                            src={item.image}
                            filename={item.imageFilename}
                            alt={item.name}
                            title={item.name}
                            category={item.category}
                            watermark={true}
                            aspectRatio="aspect-auto h-full w-full"
                          />
                        </div>

                        {/* Item Tags & Details Action */}
                        <div className="pt-3 border-t border-[#ebd8c1] flex items-center justify-between gap-2 mt-auto">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {item.tags?.slice(0, 2).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-medium text-[#786555] px-2 py-0.5 rounded bg-[#f4edd9]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Detail Click Hint */}
                          <div className="flex items-center gap-1 text-xs font-bold text-[#8c1c1c] group-hover:underline">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </div>
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
        <div className="mt-16 p-6 rounded-3xl bg-[#ffffff] border border-[#ebd8c1] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4edd9] border border-[#ebd8c1] flex items-center justify-center text-[#8c1c1c] flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bebas text-xl text-[#2a1b12] tracking-wide">Custom Boba &amp; Sweetness Levels</h5>
              <p className="text-xs text-[#786555] mt-0.5 font-medium">
                Adjust ice, sugar levels, or ask for extra Popping Boba &amp; Tapioca pearls at the counter!
              </p>
            </div>
          </div>
          <a
            href="#location"
            className="px-5 py-2.5 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-lg tracking-wider font-bold transition-colors whitespace-nowrap shadow-sm"
          >
            VISIT US IN SALAMANDRE
          </a>
        </div>
      </div>

      {/* Item Detail Quick-View Modal */}
      <ItemDetailModal
        item={activeDetailItem}
        isOpen={!!activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
        isFavorite={activeDetailItem ? favoriteItemIds.includes(activeDetailItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isSoldOut={activeDetailItem ? soldOutItemIds.includes(activeDetailItem.id) : false}
      />
    </section>
  );
};
