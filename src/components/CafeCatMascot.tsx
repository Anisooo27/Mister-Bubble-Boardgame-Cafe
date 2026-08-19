import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';

export const CafeCatMascot: React.FC = () => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  if (isDismissed) return null;

  const handleCatClick = () => {
    setIsInteracting(true);
    setShowHeart(true);
    setClickCount((prev) => prev + 1);

    setTimeout(() => {
      setShowHeart(false);
      setIsInteracting(false);
    }, 1200);
  };

  return (
    <div
      id="cat-mascot-container"
      className="fixed bottom-6 left-6 z-40 hidden md:flex flex-col items-center select-none print:hidden"
      aria-hidden="true"
    >
      {/* Floating Interactive Hearts Bubble on Tap */}
      {showHeart && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[#ff4d4d] heart-pop-anim pointer-events-none z-50">
          <Heart className="w-5 h-5 fill-[#ff4d4d]" />
          <span className="text-[11px] font-bold text-[#ffcc33] font-bebas bg-[#1a121e] px-2 py-0.5 rounded-full border border-[#ffcc33]/40 shadow-lg">
            {clickCount % 3 === 0 ? 'PURRR! 🧋' : clickCount % 2 === 0 ? 'MEOW! 🐾' : 'NYA~ ❤️'}
          </span>
        </div>
      )}

      {/* Cat Mascot Vector Stage */}
      <div
        onClick={handleCatClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isInteracting ? 'scale-115 -translate-y-2' : 'hover:scale-105'
        }`}
        title="Mister Bubble Resident Cat (Tap for love!)"
      >
        {/* Dismiss mini button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1e1c28] border border-[#ffcc33]/40 text-[#9ca3af] hover:text-white hover:bg-[#8c1c1c] text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-20"
          aria-label="Dismiss cat mascot"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Asian Conical Hat Vector Cat Illustration */}
        <div className="p-2.5 rounded-2xl bg-[#14121a]/85 backdrop-blur-sm border border-[#ffcc33]/40 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:border-[#ffcc33] transition-all">
          <svg
            width="68"
            height="68"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cat-float-anim overflow-visible"
          >
            {/* Soft Shadow */}
            <ellipse cx="50" cy="92" rx="28" ry="6" fill="#000000" fillOpacity="0.4" />

            {/* Animated Swishing Tail */}
            <g className="cat-tail-anim">
              <path
                d="M24 75 C10 70 8 48 20 45 C23 45 22 55 20 62 C18 69 22 75 28 78 Z"
                fill="#f5c26b"
                stroke="#c98a2c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Cat Body (Warm Cream / Gold) */}
            <ellipse cx="50" cy="72" rx="26" ry="20" fill="#fce4b8" stroke="#c98a2c" strokeWidth="2.5" />
            <path d="M38 70 Q50 62 62 70" stroke="#f5c26b" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Maroon / Crimson Collar with Little Gold Bell */}
            <path
              d="M34 60 C42 66 58 66 66 60"
              stroke="#8c1c1c"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="64" r="3.5" fill="#ffcc33" stroke="#805b00" strokeWidth="1" />

            {/* Cat Head */}
            <circle cx="50" cy="46" r="21" fill="#fce4b8" stroke="#c98a2c" strokeWidth="2.5" />

            {/* Left Ear with Twitch Animation */}
            <g className="cat-ear-anim">
              <polygon points="32,32 38,18 46,30" fill="#fce4b8" stroke="#c98a2c" strokeWidth="2" />
              <polygon points="35,30 39,22 43,29" fill="#fca5a5" />
            </g>

            {/* Right Ear */}
            <polygon points="68,32 62,18 54,30" fill="#fce4b8" stroke="#c98a2c" strokeWidth="2" />
            <polygon points="65,30 61,22 57,29" fill="#fca5a5" />

            {/* Asian Conical Bamboo Hat (Straw & Crimson Ribbon) */}
            <polygon
              points="16,34 50,8 84,34"
              fill="#e6b15c"
              stroke="#875317"
              strokeWidth="2.5"
            />
            {/* Hat Texture lines */}
            <line x1="50" y1="8" x2="32" y2="34" stroke="#c48a31" strokeWidth="1.5" />
            <line x1="50" y1="8" x2="68" y2="34" stroke="#c48a31" strokeWidth="1.5" />
            <line x1="50" y1="8" x2="50" y2="34" stroke="#c48a31" strokeWidth="1.5" />
            {/* Hat Crimson Ribbon Band */}
            <path d="M26 31 Q50 26 74 31" stroke="#8c1c1c" strokeWidth="3.5" fill="none" />

            {/* Cat Eyes (Blinking Animation) */}
            <g className="cat-eye-anim">
              {/* Left Eye */}
              <ellipse cx="42" cy="46" rx="2.5" ry="3.5" fill="#2d2215" />
              <circle cx="41" cy="44.5" r="1" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="58" cy="46" rx="2.5" ry="3.5" fill="#2d2215" />
              <circle cx="57" cy="44.5" r="1" fill="#ffffff" />
            </g>

            {/* Cute Nose & Whiskers */}
            <polygon points="48,51 52,51 50,53.5" fill="#f87171" />
            <path d="M47 54 Q50 56 53 54" stroke="#2d2215" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="38" y1="51" x2="26" y2="49" stroke="#996515" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="38" y1="54" x2="27" y2="55" stroke="#996515" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="62" y1="51" x2="74" y2="49" stroke="#996515" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="62" y1="54" x2="73" y2="55" stroke="#996515" strokeWidth="1.2" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="36" cy="52" r="3" fill="#fca5a5" fillOpacity="0.6" />
            <circle cx="64" cy="52" r="3" fill="#fca5a5" fillOpacity="0.6" />

            {/* Front Paws Resting */}
            <ellipse cx="44" cy="80" rx="4.5" ry="3.5" fill="#ffffff" stroke="#c98a2c" strokeWidth="1.5" />
            <ellipse cx="56" cy="80" rx="4.5" ry="3.5" fill="#ffffff" stroke="#c98a2c" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Small Caption Pill */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-bold text-[#ffcc33] font-mono tracking-wider bg-[#100f17] px-2 py-0.5 rounded-full border border-[#2b2738] shadow">
            🐾 Boba Cat
          </span>
        </div>
      </div>
    </div>
  );
};
