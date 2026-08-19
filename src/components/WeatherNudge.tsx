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
    nudgeText: 'Great weather for a Sparkling Blue Lagoon Ade or Iced Fruit Tea!',
    targetCategory: 'ade',
  });

  // INTEGRATION POINT FOR REAL WEATHER API:
  // To connect OpenWeatherMap or Tomorrow.io in production:
  // 1. Fetch `https://api.openweathermap.org/data/2.5/weather?lat=35.9333&lon=0.0716&appid=YOUR_API_KEY&units=metric`
  // 2. Set temperature and condition accordingly.
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour < 7) {
      setWeatherState({
        temperature: 18,
        condition: 'evening',
        title: 'Cozy Evening Lounge in Mostaganem (18°C)',
        nudgeText: 'Warm up your game night with hot Takoyaki Waffles & rich Caramel Espresso!',
        targetCategory: 'waffle',
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
        nudgeText: 'Handcrafted Sparkling Ades (250 DZD) freshly sealed for you.',
        targetCategory: 'ade',
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 mb-8 relative z-20">
      <div className="rounded-2xl bg-[#171622]/90 border border-[#f2a900]/30 backdrop-blur-md p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0 shadow">
            {weatherState.condition === 'sunny' && <Sun className="w-5 h-5" />}
            {weatherState.condition === 'breezy' && <CloudSun className="w-5 h-5" />}
            {weatherState.condition === 'evening' && <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffcc33]">
                {weatherState.title}
              </span>
            </div>
            <p className="text-xs text-[#cbd5e1] mt-0.5">
              {weatherState.nudgeText}
            </p>
          </div>
        </div>

        <a
          href="#menu"
          className="px-3.5 py-1.5 rounded-xl bg-[#232132] hover:bg-[#ffcc33] text-[#ffcc33] hover:text-[#0d0d10] text-xs font-bold transition-all border border-[#ffcc33]/40 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recommended Drinks</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </a>
      </div>
    </div>
  );
};
