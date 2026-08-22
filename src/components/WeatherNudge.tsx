import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WeatherNudge: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [weatherState, setWeatherState] = useState<{
    temperature: number;
    condition: 'sunny' | 'breezy' | 'evening';
    title: string;
    nudgeText: string;
    targetCategory: string;
  }>({
    temperature: 24,
    condition: 'sunny',
    title: 'Sunny Salamandre Coastal Breeze (24°C)',
    nudgeText: 'Great weather for a Sparkling Blue Lagoon Ade or Iced Fruit Tea with boba!',
    targetCategory: 'ade',
  });

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour < 7) {
      setWeatherState({
        temperature: 18,
        condition: 'evening',
        title: 'Cozy Evening Lounge in Mostaganem (18°C)',
        nudgeText: 'Warm up your game night with hot Takoyaki Waffles & rich Caramel Espresso!',
        targetCategory: 'takoyaki-waffle',
      });
    } else if (currentHour >= 12 && currentHour < 17) {
      setWeatherState({
        temperature: 27,
        condition: 'sunny',
        title: 'Sunny Afternoon at Salamandre Beach (27°C)',
        nudgeText: 'Beat the afternoon heat with an icy Fruit Tea & Popping Boba (500ml)!',
        targetCategory: 'fruit-tea',
      });
    } else {
      setWeatherState({
        temperature: 22,
        condition: 'breezy',
        title: 'Pleasant Coastal Breeze (22°C)',
        nudgeText: 'Handcrafted Sparkling Ades & Boba drinks freshly shaken daily.',
        targetCategory: 'fruit-tea',
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 mb-8 relative z-20">
      <div className="rounded-2xl bg-[#ffffff] border border-[#ebd8c1] p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f4edd9] text-[#8c1c1c] flex items-center justify-center flex-shrink-0 border border-[#ebd8c1]">
            {weatherState.condition === 'sunny' && <Sun className="w-5 h-5 text-[#f2a900]" />}
            {weatherState.condition === 'breezy' && <CloudSun className="w-5 h-5 text-[#8e5b2e]" />}
            {weatherState.condition === 'evening' && <Moon className="w-5 h-5 text-[#8c1c1c]" />}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c1c1c]">
                {weatherState.title}
              </span>
            </div>
            <p className="text-xs text-[#665547] mt-0.5 font-medium">
              {weatherState.nudgeText}
            </p>
          </div>
        </div>

        <a
          href="#menu"
          className="px-3.5 py-1.5 rounded-xl bg-[#f4edd9] hover:bg-[#ebd8c1] text-[#8c1c1c] text-xs font-bold transition-all border border-[#ebd8c1] flex items-center gap-1.5 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f2a900]" />
          <span>Recommended Drinks</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </a>
      </div>
    </div>
  );
};
