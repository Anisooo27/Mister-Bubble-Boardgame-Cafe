import React from 'react';

interface PriceMedallionProps {
  price: number | { regular: number; large: number };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceMedallion: React.FC<PriceMedallionProps> = ({
  price,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base',
  };

  const isDualPrice = typeof price === 'object';

  return (
    <div
      className={`relative rounded-full flex flex-col items-center justify-center select-none shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${sizeClasses[size]} ${className}`}
      style={{
        background: 'radial-gradient(circle, #9b1c1c 15%, #630a0a 90%)',
        border: '2.5px solid #f2a900',
        boxShadow: '0 0 10px rgba(242, 169, 0, 0.45), inset 0 0 8px rgba(0,0,0,0.7)',
      }}
    >
      {/* Chinese Key / Meander Geometric Decorative Inner Ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f2a900" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#ffcc33" strokeWidth="0.75" />
      </svg>

      {/* Price Text */}
      {isDualPrice ? (
        <div className="relative z-10 flex flex-col items-center leading-none text-center">
          <span className="font-bebas font-extrabold text-white text-base md:text-lg tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {price.regular}
            <span className="text-[10px] text-[#ffcc33]">/</span>
            {price.large}
          </span>
          <span className="text-[9px] md:text-[10px] font-bold text-[#ffcc33] tracking-wider uppercase mt-0.5">
            DZD
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center leading-none text-center">
          <span className="font-bebas font-black text-white text-lg md:text-2xl tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {price}
          </span>
          <span className="text-[9px] md:text-[11px] font-extrabold text-[#ffcc33] tracking-widest uppercase mt-0.5">
            DZD
          </span>
        </div>
      )}
    </div>
  );
};
