import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface CafeImageProps {
  src?: string;
  alt: string;
  filename?: string;
  caption?: string;
  category?: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
  overlay?: boolean;
  priority?: boolean;
  watermark?: boolean;
}

export const CafeImage: React.FC<CafeImageProps> = ({
  src,
  alt,
  filename,
  caption,
  category,
  title,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-video',
  overlay = false,
  watermark = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalize image source path
  const resolveSrc = (rawSrc?: string): string | undefined => {
    if (!rawSrc) return undefined;
    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://') || rawSrc.startsWith('data:')) {
      return rawSrc;
    }
    if (rawSrc.startsWith('/')) {
      return rawSrc;
    }
    if (rawSrc.startsWith('photos/')) {
      return `/${rawSrc}`;
    }
    return `/photos/${rawSrc}`;
  };

  const finalSrc = resolveSrc(src || filename);

  // Extract clean filename from filename prop, or src path, or default
  const displayFilename =
    filename ||
    (finalSrc && finalSrc.includes('/') ? finalSrc.split('/').pop()?.split('?')[0] : finalSrc) ||
    'photo.jpg';

  // Determine whether to show placeholder
  const shouldShowPlaceholder = !finalSrc || hasError;

  // Food & Drink product categories that should show watermark by default if category is passed
  const isProductCategory = category && [
    'drinks',
    'frappes',
    'takoyaki-waffle',
    'bubble-waffle',
    'crepes',
    'milk-tea',
    'fruit-tea',
    'ade',
    'fresh-juice',
    'bottled-canned',
    'mojito',
    'fruit-box',
    'combos',
    'menu',
  ].includes(category);

  const shouldRenderWatermark = (watermark || isProductCategory) && !shouldShowPlaceholder && isLoaded;

  return (
    <div
      className={`relative overflow-hidden bg-[#f4edd9] rounded-2xl ${aspectRatio} group select-none`}
    >
      {!shouldShowPlaceholder ? (
        <>
          <img
            src={finalSrc}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#f4edd9] animate-pulse flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#8c1c1c]/40" />
            </div>
          )}

          {/* Authentic Mister Bubble Product Photo Logo Watermark */}
          {shouldRenderWatermark && (
            <div className="absolute bottom-2 right-2 z-20 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-[#f2a900]/50 shadow-md transition-opacity duration-300 opacity-85 group-hover:opacity-95">
              <div className="w-5 h-5 rounded-full bg-[#8c1c1c] border border-[#f2a900] flex items-center justify-center overflow-hidden flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="#7a1414" />
                  <ellipse cx="50" cy="58" rx="19" ry="17" fill="#fbd39f" stroke="#1a1a1a" strokeWidth="1.5" />
                  <path d="M40 54 Q44 51 47 54" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M53 54 Q56 51 60 54" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M50 18 L15 48 L85 48 Z" fill="#e69500" stroke="#1a1a1a" strokeWidth="2" />
                  <path d="M50 18 L50 48" stroke="#b37400" strokeWidth="1.2" />
                  <path d="M50 18 L32 48" stroke="#b37400" strokeWidth="1" />
                  <path d="M50 18 L68 48" stroke="#b37400" strokeWidth="1" />
                  <path d="M42 62 Q50 64 50 67 Q50 64 58 62 Q55 68 50 78 Q45 68 42 62 Z" fill="#121212" />
                </svg>
              </div>
              <span className="font-bebas text-[11px] text-[#ffcc33] tracking-wider leading-none drop-shadow-xs">
                MISTER BUBBLE
              </span>
            </div>
          )}
        </>
      ) : (
        /* Branded Warm "REAL CAFÉ PHOTO" Placeholder */
        <div className="absolute inset-0 bg-gradient-to-br from-[#fcf8f0] via-[#f4edd9] to-[#ebd8c1] border border-[#ebd8c1] flex flex-col items-center justify-center p-3 text-center">
          {/* Red/Gold Circular Camera Icon */}
          <div className="w-10 h-10 rounded-full bg-[#8c1c1c] border-2 border-[#f2a900] flex items-center justify-center text-[#ffcc33] mb-2 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <Camera className="w-5 h-5 text-[#ffcc33]" />
          </div>

          {/* REAL CAFÉ PHOTO Badge */}
          <span className="text-[10px] font-bold text-[#8c1c1c] uppercase tracking-widest bg-[#ffffff] px-2.5 py-0.5 rounded-full border border-[#ebd8c1] shadow-xs mb-1">
            REAL CAFÉ PHOTO
          </span>

          {/* Expected Filename Caption */}
          <p className="text-[11px] text-[#554336] font-mono font-medium tracking-tight max-w-[90%] truncate">
            {displayFilename}
          </p>

          {title && (
            <span className="font-bebas text-xs text-[#2a1b12] tracking-wider block mt-0.5 truncate max-w-[90%]">
              {title}
            </span>
          )}

          {caption && (
            <p className="text-[9px] text-[#786555] mt-0.5 line-clamp-1 max-w-[85%]">
              {caption}
            </p>
          )}
        </div>
      )}

      {overlay && !shouldShowPlaceholder && isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a]/80 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};
