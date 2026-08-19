import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, X, Check } from 'lucide-react';
import { AppLanguage } from '../types';

export const LanguageNudge: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [suggestedLang, setSuggestedLang] = useState<AppLanguage | null>(null);

  useEffect(() => {
    try {
      const hasChosen = localStorage.getItem('mb_lang_chosen_manual');
      if (hasChosen) return;

      const browserLang = (navigator.language || '').toLowerCase();
      if (browserLang.startsWith('ar') && language !== 'ar') {
        setSuggestedLang('ar');
        setIsVisible(true);
      } else if (browserLang.startsWith('fr') && language !== 'fr') {
        setSuggestedLang('fr');
        setIsVisible(true);
      }
    } catch {
      // ignore
    }
  }, [language]);

  if (!isVisible || !suggestedLang) return null;

  const handleAccept = () => {
    setLanguage(suggestedLang);
    try {
      localStorage.setItem('mb_lang_chosen_manual', 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('mb_lang_chosen_manual', 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Language selection suggestion"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#181624]/95 backdrop-blur-md border-2 border-[#ffcc33]/80 p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-4 duration-300 print:hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0 shadow">
            <Globe className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-bebas text-lg text-white leading-tight">
              {suggestedLang === 'ar' ? 'مرحباً بك في مستر بابل!' : 'Bienvenue chez Mister Bubble !'}
            </h4>
            <p className="text-xs text-[#cbd5e1] mt-0.5">
              {suggestedLang === 'ar'
                ? 'هل تفضل تصفح القائمة والموقع باللغة العربية؟'
                : 'Souhaitez-vous afficher le menu et le site en français ?'}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#252336] transition-colors"
          aria-label="Dismiss language suggestion"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-[#2a273c]">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9ca3af] hover:text-white"
        >
          {suggestedLang === 'ar' ? 'المتابعة بالإنجليزية' : 'Continuer en anglais'}
        </button>

        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg bg-[#8c1c1c] hover:bg-[#b3231c] text-[#ffcc33] font-bold text-xs flex items-center gap-1.5 border border-[#ffcc33]/50 shadow transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{suggestedLang === 'ar' ? 'عرض بالعربية' : 'Voir en Français'}</span>
        </button>
      </div>
    </div>
  );
};
