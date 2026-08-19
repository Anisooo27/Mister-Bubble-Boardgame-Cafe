import React from 'react';

interface MonsteraLeafProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  opacity?: number;
}

export const MonsteraLeaf: React.FC<MonsteraLeafProps> = ({
  position = 'top-left',
  className = '',
  opacity = 0.4,
}) => {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-6 -translate-y-6',
    'top-right': 'top-0 right-0 translate-x-6 -translate-y-6 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 -translate-x-6 translate-y-6 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 translate-x-6 translate-y-6 scale-[-1]',
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none z-0 overflow-hidden ${positionClasses[position]} ${className}`}
      style={{ opacity }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#2f9e44] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      >
        <path
          d="M20 180 C40 120 70 60 150 20 C180 60 180 120 140 160 C100 190 50 190 20 180 Z"
          fill="url(#leaf-grad-1)"
          opacity="0.9"
        />
        {/* Leaf cuts / Monstera fenestrations */}
        <path d="M120 60 C105 70 95 90 90 100" stroke="#0e3d16" strokeWidth="4" strokeLinecap="round" />
        <path d="M140 90 C120 105 105 125 100 135" stroke="#0e3d16" strokeWidth="4" strokeLinecap="round" />
        <path d="M150 130 C130 140 115 155 110 160" stroke="#0e3d16" strokeWidth="4" strokeLinecap="round" />
        {/* Secondary leaf blade */}
        <path
          d="M10 190 C60 160 120 160 170 110 C160 160 110 190 10 190 Z"
          fill="url(#leaf-grad-2)"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="leaf-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e5e2b" />
            <stop offset="50%" stopColor="#2f9e44" />
            <stop offset="100%" stopColor="#51cf66" />
          </linearGradient>
          <linearGradient id="leaf-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0e3814" />
            <stop offset="100%" stopColor="#2b8a3e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
