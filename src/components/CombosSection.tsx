import React, { useState } from 'react';
import { COMBO_DEALS } from '../data/combosData';
import { ComboDeal, MenuItem } from '../types';
import { PriceMedallion } from './PriceMedallion';
import { CafeImage } from './CafeImage';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Plus, Check, Tag, Package, Flame } from 'lucide-react';

interface CombosSectionProps {
  onAddToTray: (item: MenuItem) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({ onAddToTray }) => {
  const { t, language } = useLanguage();
  const [addedComboMap, setAddedComboMap] = useState<{ [key: string]: boolean }>({});

  const handleAddCombo = (combo: ComboDeal) => {
    const menuItem: MenuItem = {
      id: combo.id,
      name: language === 'ar' ? combo.nameArabic : language === 'fr' ? combo.nameFrench : combo.name,
      category: 'combo',
      price: combo.price,
      description: language === 'ar' ? combo.descriptionArabic : language === 'fr' ? combo.descriptionFrench : combo.description,
      tags: combo.tags,
      isHouseSpecial: combo.popular,
    };

    onAddToTray(menuItem);
    setAddedComboMap((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => {
      setAddedComboMap((prev) => ({ ...prev, [combo.id]: false }));
    }, 1500);
  };

  return (
    <div className="mb-20 scroll-mt-28" id="combos">
      {/* Amber Torn Ribbon Header for Combos */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative inline-block my-2">
          <div className="relative px-8 py-3.5 bg-gradient-to-r from-[#995c00] via-[#c67d00] to-[#804d00] shadow-[0_4px_20px_rgba(198,125,0,0.4)] border-y border-[#ffcc33]/60 flex items-center justify-center gap-3">
            <Package className="w-5 h-5 text-[#ffcc33]" />
            <h3 className="font-bebas text-2xl sm:text-3xl lg:text-4xl text-white tracking-widest leading-none drop-shadow">
              {t('combos.title')}
            </h3>
            {language === 'ar' && (
              <span className="font-arabic font-bold text-xl text-[#ffcc33]">
                عروض وتوفير
              </span>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-lg text-center mt-2">
          {t('combos.subtitle')}
        </p>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COMBO_DEALS.map((combo) => {
          const isAdded = addedComboMap[combo.id];
          const name = language === 'ar' ? combo.nameArabic : language === 'fr' ? combo.nameFrench : combo.name;
          const desc = language === 'ar' ? combo.descriptionArabic : language === 'fr' ? combo.descriptionFrench : combo.description;
          const savingsBadge = language === 'ar' ? combo.savingsBadgeArabic : language === 'fr' ? combo.savingsBadgeFrench : combo.savingsBadge;

          return (
            <div
              key={combo.id}
              className="relative rounded-3xl bg-gradient-to-br from-[#19161a] to-[#121118] border-2 border-[#b87300]/40 hover:border-[#ffcc33] p-6 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(184,115,0,0.25)] flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent opacity-50" />

              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#ffcc33] text-[#0d0d10] font-black text-[11px] uppercase tracking-wider shadow flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {savingsBadge}
                  </span>

                  {combo.popular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8c1c1c] text-[#ffcc33] font-bold text-[10px] uppercase tracking-wider border border-[#ffcc33]/40 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#ffcc33]" />
                      Popular Deal
                    </span>
                  )}
                </div>

                {/* Name & Pricing Medallion */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-bebas text-2xl sm:text-3xl text-white group-hover:text-[#ffcc33] transition-colors leading-tight">
                      {name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bebas text-2xl text-[#ffcc33] text-gold-glow">
                        {combo.price} DZD
                      </span>
                      <span className="text-xs text-[#9ca3af] line-through">
                        {combo.originalPrice} DZD
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <PriceMedallion price={combo.price} size="sm" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Included Items Checklist */}
                <div className="p-3.5 rounded-2xl bg-[#141219] border border-[#2a2430] mb-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] block">
                    {t('combos.included')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {combo.includedItemNames.map((itemStr, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-white">
                        <Check className="w-3.5 h-3.5 text-[#ffcc33] flex-shrink-0" />
                        <span className="truncate">{itemStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#26202c] flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {combo.tags.map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#241e2b] text-[#9ca3af]"
                    >
                      {tg}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleAddCombo(combo)}
                  className={`px-4 py-2.5 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#b3231c] via-[#8c1c1c] to-[#601212] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white border border-[#ffcc33]/60 shadow-[0_0_15px_rgba(179,35,28,0.4)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#ffcc33]" />
                      <span>{t('combos.addToCart')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
