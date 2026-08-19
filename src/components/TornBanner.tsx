import React from 'react';

interface TornBannerProps {
  title: string;
  titleArabic?: string;
  gradient?: string;
  accentColor?: string;
  className?: string;
}

export const TornBanner: React.FC<TornBannerProps> = ({
  title,
  titleArabic,
  gradient = 'from-[#b3231c] via-[#8c1c1c] to-[#691111]',
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center my-3 ${className}`}>
      {/* Torn/Ribbon Banner Container */}
      <div
        className={`relative px-8 md:px-12 py-3 bg-gradient-to-r ${gradient} shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center gap-3 border-y border-[#ffcc33]/40`}
        style={{
          clipPath: 'polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%, 4% 50%)',
        }}
      >
        {/* Left Golden Rivet / Market Sign Dot */}
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#ffcc33] to-[#d97706] shadow-[0_0_8px_#ffcc33] border border-[#78350f] flex-shrink-0" />

        {/* Title text */}
        <div className="flex flex-col items-center justify-center text-center px-2">
          <h3 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-white tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
          {titleArabic && (
            <span className="font-arabic text-xs md:text-sm font-semibold text-[#ffcc33] opacity-95 tracking-wide mt-0.5">
              {titleArabic}
            </span>
          )}
        </div>

        {/* Right Golden Rivet / Market Sign Dot */}
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#ffcc33] to-[#d97706] shadow-[0_0_8px_#ffcc33] border border-[#78350f] flex-shrink-0" />
      </div>
    </div>
  );
};
