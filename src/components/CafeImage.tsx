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
}

export const CafeImage: React.FC<CafeImageProps> = ({
  src,
  alt,
  filename,
  caption,
  title,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-video',
  overlay = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract clean filename from filename prop, or src path, or default
  const displayFilename =
    filename ||
    (src && src.includes('/') ? src.split('/').pop()?.split('?')[0] : src) ||
    'photo.jpg';

  // Determine whether to show placeholder
  const shouldShowPlaceholder = !src || hasError;

  return (
    <div
      className={`relative overflow-hidden bg-[#12121c] rounded-2xl ${aspectRatio} group select-none`}
    >
      {!shouldShowPlaceholder ? (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} transition-transform duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#161622] animate-pulse flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#4a4a60]" />
            </div>
          )}
        </>
      ) : (
        /* Branded "REAL CAFÉ PHOTO" Placeholder */
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b1728] via-[#14121d] to-[#0f0e16] border border-[#2a273c] flex flex-col items-center justify-center p-3 text-center">
          {/* Red/Gold Circular Camera Icon */}
          <div className="w-11 h-11 rounded-full bg-[#8c1c1c] border-2 border-[#ffcc33] flex items-center justify-center text-[#ffcc33] mb-2 shadow-[0_0_12px_rgba(255,204,51,0.25)] group-hover:scale-105 transition-transform flex-shrink-0">
            <Camera className="w-5 h-5 text-[#ffcc33]" />
          </div>

          {/* REAL CAFÉ PHOTO Badge */}
          <span className="text-[10px] font-bold text-[#ffcc33] uppercase tracking-widest bg-[#271d2c] px-2 py-0.5 rounded-full border border-[#ffcc33]/30 mb-1">
            REAL CAFÉ PHOTO
          </span>

          {/* Expected Filename Caption */}
          <p className="text-[11px] text-[#cbd5e1] font-mono tracking-tight max-w-[90%] truncate">
            {displayFilename}
          </p>

          {title && (
            <span className="font-bebas text-xs text-[#9ca3af] tracking-wider block mt-0.5 truncate max-w-[90%]">
              {title}
            </span>
          )}

          {caption && (
            <p className="text-[9px] text-[#6b7280] mt-0.5 line-clamp-1 max-w-[85%]">
              {caption}
            </p>
          )}
        </div>
      )}

      {overlay && !shouldShowPlaceholder && isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
};
