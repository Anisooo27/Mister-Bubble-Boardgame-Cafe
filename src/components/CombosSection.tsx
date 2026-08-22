import React from 'react';
import { COMBO_DEALS } from '../data/combosData';
import { ComboDeal } from '../types';
import { PriceMedallion } from './PriceMedallion';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Tag, Package, Flame, Check } from 'lucide-react';

export const CombosSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="mb-20 scroll-mt-28" id="combos">
      {/* Torn Ribbon Header for Combos */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative inline-block my-2">
          <div className="relative px-8 py-3.5 bg-gradient-to-r from-[#8c1c1c] via-[#b3231c] to-[#691111] shadow-md border-y border-[#ffcc33]/60 flex items-center justify-center gap-3">
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
        <p className="text-xs sm:text-sm text-[#786555] max-w-lg text-center mt-2 font-medium">
          {t('combos.subtitle')}
        </p>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COMBO_DEALS.map((combo) => {
          const name = language === 'ar' ? combo.nameArabic : language === 'fr' ? combo.nameFrench : combo.name;
          const desc = language === 'ar' ? combo.descriptionArabic : language === 'fr' ? combo.descriptionFrench : combo.description;
          const savingsBadge = language === 'ar' ? combo.savingsBadgeArabic : language === 'fr' ? combo.savingsBadgeFrench : combo.savingsBadge;

          return (
            <div
              key={combo.id}
              className="relative rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] hover:border-[#8c1c1c] p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#8c1c1c] text-white font-bold text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#ffcc33]" />
                    {savingsBadge}
                  </span>

                  {combo.popular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f4edd9] text-[#8e5b2e] font-bold text-[10px] uppercase tracking-wider border border-[#ebd8c1] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#f2a900]" />
                      Popular Deal
                    </span>
                  )}
                </div>

                {/* Name & Pricing Medallion */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-bebas text-2xl sm:text-3xl text-[#2a1b12] group-hover:text-[#8c1c1c] transition-colors leading-tight">
                      {name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bebas text-2xl text-[#8c1c1c]">
                        {combo.price} DZD
                      </span>
                      <span className="text-xs text-[#786555] line-through font-medium">
                        {combo.originalPrice} DZD
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <PriceMedallion price={combo.price} size="sm" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#665547] leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Included Items Checklist */}
                <div className="p-3.5 rounded-2xl bg-[#fcf8f0] border border-[#ebd8c1] mb-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c1c1c] block">
                    {t('combos.included')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {combo.includedItemNames.map((itemStr, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-[#3d2e24]">
                        <Check className="w-3.5 h-3.5 text-[#8c1c1c] flex-shrink-0" />
                        <span className="truncate font-medium">{itemStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action / Availability Note */}
              <div className="pt-3 border-t border-[#ebd8c1] flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {combo.tags.map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#f4edd9] text-[#786555] font-medium"
                    >
                      {tg}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-bold text-[#8c1c1c] bg-[#f4edd9] px-3 py-1.5 rounded-xl border border-[#ebd8c1]">
                  Order at Counter
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
