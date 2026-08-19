import React, { useState } from 'react';
import { MenuItem } from '../types';
import { CafeImage } from './CafeImage';
import { PriceMedallion } from './PriceMedallion';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Plus,
  Check,
  Heart,
  Flame,
  Users,
  Sparkles,
  Utensils,
  CheckCircle,
  Coffee,
  Info
} from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToTray: (item: MenuItem, size?: 'regular' | 'large') => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  isSoldOut?: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToTray,
  isFavorite,
  onToggleFavorite,
  isSoldOut = false,
}) => {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large'>('regular');
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !item) return null;

  const hasTwoSizes = typeof item.price === 'object';
  const currentPrice = hasTwoSizes
    ? selectedSize === 'large'
      ? item.price.large
      : item.price.regular
    : item.price;

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToTray(item, hasTwoSizes ? selectedSize : undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#14141f] border-2 border-[#ffcc33]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close & Favorite Top Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-400'
                : 'bg-[#1b1b28]/80 border-[#2d2d42] text-[#9ca3af] hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#1b1b28]/80 hover:bg-[#8c1c1c] text-[#9ca3af] hover:text-white backdrop-blur-md border border-[#2d2d42] transition-colors"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image Container using CafeImage with Fallback */}
        <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-[#0d0d12]">
          <CafeImage
            src={item.image}
            filename={item.imageFilename}
            alt={item.name}
            title={item.name}
            caption={item.description}
            aspectRatio="aspect-auto h-full w-full"
            overlay={true}
          />

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2">
            {item.isHouseSpecial && (
              <span className="px-3 py-1 rounded-full bg-[#b3231c] text-white text-xs font-bold uppercase tracking-wider border border-[#ffcc33]/50 shadow-lg">
                ★ House Special
              </span>
            )}
            {item.isPopular && !item.isHouseSpecial && (
              <span className="px-3 py-1 rounded-full bg-[#e69500] text-[#0f0f14] text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Popular
              </span>
            )}
            {item.volume && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#cbd5e1] text-xs font-mono border border-white/20">
                {item.volume}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Title & Medallion */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#ffcc33] uppercase tracking-wider block mb-1">
                {item.category.replace('-', ' ').toUpperCase()}
              </span>
              <h3
                id="item-detail-title"
                className="font-bebas text-3xl sm:text-4xl text-white tracking-wide leading-none"
              >
                {item.name}
              </h3>
            </div>

            <div className="flex-shrink-0">
              <PriceMedallion price={currentPrice} size="md" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#cbd5e1] leading-relaxed">
            {item.description}
          </p>

          {/* Sharing Box Ingredients if applicable */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#1a1827] border border-[#2e2a42]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffcc33] block mb-2">
                Included in this Sharing Box:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#ffcc33] flex-shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual Size / Flavor Option Selector */}
          {hasTwoSizes && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] block">
                Choose Option / Syrup:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSize('regular')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSize === 'regular'
                      ? 'bg-[#8c1c1c]/40 border-[#ffcc33] text-white shadow-lg'
                      : 'bg-[#181826] border-[#2a2a3e] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm text-white">Coconut Option</div>
                  <div className="font-bebas text-lg text-[#ffcc33]">
                    {typeof item.price === 'object' ? item.price.regular : item.price} DZD
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSize('large')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSize === 'large'
                      ? 'bg-[#8c1c1c]/40 border-[#ffcc33] text-white shadow-lg'
                      : 'bg-[#181826] border-[#2a2a3e] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm text-white">Caramel Option</div>
                  <div className="font-bebas text-lg text-[#ffcc33]">
                    {typeof item.price === 'object' ? item.price.large : item.price} DZD
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tg, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium text-[#94a3b8] px-2.5 py-0.5 rounded-lg bg-[#1c1c2b] border border-[#27273a]"
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-3 border-t border-[#232336] flex items-center justify-between gap-4">
            <div className="text-xs text-[#9ca3af]">
              <span className="block text-[10px] uppercase">Price</span>
              <span className="font-bebas text-2xl sm:text-3xl text-[#ffcc33]">
                {typeof currentPrice === 'number' ? `${currentPrice} DZD` : ''}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={isSoldOut}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bebas text-xl tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                isSoldOut
                  ? 'bg-red-950/60 text-red-400 border border-red-800/40 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#b3231c] via-[#8c1c1c] to-[#601212] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white border border-[#ffcc33]/60'
              }`}
            >
              {isSoldOut ? (
                <span>SOLD OUT TODAY</span>
              ) : isAdded ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>ADDED TO TRAY!</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-[#ffcc33]" />
                  <span>ADD TO TRAY</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
