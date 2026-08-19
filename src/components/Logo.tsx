import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showArabic?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showArabic = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', title: 'text-base', arabic: 'text-xs' },
    md: { icon: 'w-12 h-12', title: 'text-xl', arabic: 'text-sm' },
    lg: { icon: 'w-20 h-20', title: 'text-3xl', arabic: 'text-lg' },
    xl: { icon: 'w-28 h-28', title: 'text-4xl', arabic: 'text-xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="brand-logo">
      {/* Asian Character Icon in Maroon Circle */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 rounded-full p-[2px] bg-gradient-to-br from-[#f2a900] via-[#b3231c] to-[#f2a900] shadow-[0_0_15px_rgba(179,35,28,0.5)]`}>
        <div className="w-full h-full rounded-full bg-[#8c1c1c] flex items-center justify-center overflow-hidden border border-[#f2a900]/60 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background subtle radial glow */}
            <circle cx="50" cy="50" r="48" fill="#7a1414" />
            <circle cx="50" cy="50" r="44" stroke="#f2a900" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            
            {/* Head and Skin */}
            <ellipse cx="50" cy="58" rx="19" ry="17" fill="#fbd39f" stroke="#1a1a1a" strokeWidth="1.5" />
            
            {/* Eyes - Asian calm stylized */}
            <path d="M40 54 Q44 51 47 54" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            <path d="M53 54 Q56 51 60 54" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            
            {/* Conical Straw Hat (Dougli) */}
            <path d="M50 18 L15 48 L85 48 Z" fill="#e69500" stroke="#1a1a1a" strokeWidth="2" />
            {/* Hat lines/ribs */}
            <path d="M50 18 L50 48" stroke="#b37400" strokeWidth="1.2" />
            <path d="M50 18 L32 48" stroke="#b37400" strokeWidth="1" />
            <path d="M50 18 L68 48" stroke="#b37400" strokeWidth="1" />
            <path d="M18 45 Q50 42 82 45" stroke="#ffcc33" strokeWidth="1.5" fill="none" />
            
            {/* Mustache and Beard */}
            <path d="M42 62 Q50 64 50 67 Q50 64 58 62 Q55 68 50 78 Q45 68 42 62 Z" fill="#121212" />
            <path d="M44 63 Q36 67 33 72 Q39 68 46 65" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M56 63 Q64 67 67 72 Q61 68 54 65" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Long Goatee / Chin Beard */}
            <path d="M48 68 Q50 86 50 88 Q50 86 52 68 Z" fill="#121212" />
          </svg>
        </div>
      </div>

      {/* Brand Text Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bebas tracking-wider text-[#ffcc33] leading-none ${currentSize.title} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
            MISTER BUBBLE
          </div>
          {showArabic && (
            <div className={`font-arabic font-bold text-[#f3f4f6] text-opacity-90 leading-none tracking-normal mt-0.5 ${currentSize.arabic}`}>
              السيد فقاعة
            </div>
          )}
        </div>
      )}
    </div>
  );
};
