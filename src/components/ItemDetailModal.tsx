import React, { useState } from 'react';
import { MenuItem } from '../types';
import { CafeImage } from './CafeImage';
import { PriceMedallion } from './PriceMedallion';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Heart,
  Flame,
  CheckCircle,
  Sparkles,
  MapPin,
  Utensils
} from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  isSoldOut?: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isSoldOut = false,
}) => {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large'>('regular');

  if (!isOpen || !item) return null;

  const hasTwoSizes = typeof item.price === 'object';
  const currentPrice = hasTwoSizes
    ? selectedSize === 'large'
      ? item.price.large
      : item.price.regular
    : item.price;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#ffffff] border-2 border-[#ebd8c1] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close & Favorite Top Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm'
                : 'bg-[#ffffff]/90 border-[#ebd8c1] text-[#786555] hover:text-[#8c1c1c]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#ffffff]/90 hover:bg-[#f4edd9] text-[#786555] hover:text-[#2a1b12] backdrop-blur-md border border-[#ebd8c1] transition-colors"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image Container using CafeImage with Fallback */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-[#f4edd9]">
          <CafeImage
            src={item.image}
            filename={item.imageFilename}
            alt={item.name}
            title={item.name}
            caption={item.description}
            category={item.category}
            watermark={true}
            aspectRatio="aspect-auto h-full w-full"
            overlay={true}
          />

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2">
            {item.isHouseSpecial && (
              <span className="px-3 py-1 rounded-full bg-[#8c1c1c] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                ★ House Special
              </span>
            )}
            {item.isPopular && !item.isHouseSpecial && (
              <span className="px-3 py-1 rounded-full bg-[#f2a900] text-[#2a1b12] text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Popular
              </span>
            )}
            {item.volume && (
              <span className="px-2.5 py-1 rounded-full bg-[#ffffff]/90 backdrop-blur-md text-[#2a1b12] text-xs font-mono font-bold border border-[#ebd8c1] shadow-xs">
                {item.volume}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 bg-[#ffffff]">
          {/* Title & Medallion */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#8c1c1c] uppercase tracking-wider block mb-1">
                {item.category.replace('-', ' ').toUpperCase()}
              </span>
              <h3
                id="item-detail-title"
                className="font-bebas text-3xl sm:text-4xl text-[#2a1b12] tracking-wide leading-none"
              >
                {item.name}
              </h3>
            </div>

            <div className="flex-shrink-0">
              <PriceMedallion price={currentPrice} size="md" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#665547] leading-relaxed font-medium">
            {item.description}
          </p>

          {/* Sharing Box Ingredients if applicable */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#fcf8f0] border border-[#ebd8c1]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c1c1c] block mb-2">
                Included in this Sharing Box:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#3d2e24]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#8c1c1c] flex-shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual Size / Flavor Option Selector */}
          {hasTwoSizes && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#786555] block">
                Flavor Option:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSize('regular')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSize === 'regular'
                      ? 'bg-[#f4edd9] border-[#8c1c1c] text-[#2a1b12] shadow-xs'
                      : 'bg-[#fcf8f0] border-[#ebd8c1] text-[#786555] hover:border-[#8c1c1c]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#2a1b12]">Coconut Option</div>
                  <div className="font-bebas text-lg text-[#8c1c1c]">
                    {typeof item.price === 'object' ? item.price.regular : item.price} DZD
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSize('large')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSize === 'large'
                      ? 'bg-[#f4edd9] border-[#8c1c1c] text-[#2a1b12] shadow-xs'
                      : 'bg-[#fcf8f0] border-[#ebd8c1] text-[#786555] hover:border-[#8c1c1c]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#2a1b12]">Caramel Option</div>
                  <div className="font-bebas text-lg text-[#8c1c1c]">
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
                  className="text-[11px] font-medium text-[#786555] px-2.5 py-0.5 rounded-lg bg-[#f4edd9] border border-[#ebd8c1]"
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Info Note */}
          <div className="pt-4 border-t border-[#ebd8c1] flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase text-[#786555] font-semibold">Official Price</span>
              <span className="font-bebas text-2xl sm:text-3xl text-[#8c1c1c]">
                {typeof currentPrice === 'number' ? `${currentPrice} DZD` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c1c1c] bg-[#f4edd9] px-4 py-2.5 rounded-xl border border-[#ebd8c1]">
              <Utensils className="w-4 h-4 text-[#8c1c1c]" />
              <span>Available for Dine-in &amp; Takeaway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
