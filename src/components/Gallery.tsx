import React, { useState, useEffect } from 'react';
import { PHOTO_MANIFEST, CafePhoto } from '../data/photoManifest';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CafeImage } from './CafeImage';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Camera } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeConfig';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'interior', label: 'Cafe Interior & Vibe' },
    { id: 'drinks', label: 'Bubble Teas & Ades' },
    { id: 'desserts', label: 'Pancakes & Waffles' },
    { id: 'games', label: 'Board Game Library' },
    { id: 'cats', label: 'Resident Cats' },
    { id: 'exterior', label: 'Night Facade' },
  ];

  const filteredItems = PHOTO_MANIFEST.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : (prev as number) - 1
    );
  };

  const nextImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : (prev as number) + 1
    );
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const currentItem: CafePhoto | undefined =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : undefined;

  return (
    <section
      id="gallery"
      className="relative py-20 lg:py-28 bg-[#0a0a0d] overflow-hidden border-t border-[#1e1e2c]"
    >
      <MonsteraLeaf position="top-left" opacity={0.3} />
      <MonsteraLeaf position="bottom-right" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <TornBanner
            title="REAL CAFÉ &amp; MOMENTS GALLERY"
            titleArabic="معرض الصور والأجواء الحقيقية"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#9ca3af] mt-3">
            Real snapshots from Mister Bubble in Mostaganem — refreshing boba drinks, sweet takoyaki treats, board games on the mezzanine, and our beloved resident cats.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white shadow-[0_0_12px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60'
                  : 'bg-[#14141e] text-[#9ca3af] hover:text-white hover:bg-[#1c1c28] border border-[#232332]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid using CafeImage for local photo mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="relative group rounded-2xl overflow-hidden cursor-pointer border border-[#242436] hover:border-[#f2a900]/60 bg-[#12121a] shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <CafeImage
                  src={item.expectedPath}
                  filename={item.filename}
                  alt={item.alt}
                  caption={item.caption}
                  aspectRatio="aspect-[4/3]"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-between p-5 pointer-events-none">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-lg bg-[#111118]/80 text-[#ffcc33] backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#ffcc33] uppercase tracking-widest px-2 py-0.5 rounded bg-[#b3231c]">
                      {item.category}
                    </span>
                    <h4 className="font-bebas text-2xl text-white tracking-wide mt-1 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#cbd5e1] line-clamp-2 mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Follow Callout */}
        <div className="mt-12 text-center">
          <a
            href={CAFE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14141f] border border-[#ffcc33]/30 hover:border-[#ffcc33] text-[#f3f4f6] hover:text-[#ffcc33] font-bebas text-xl tracking-wider transition-all"
          >
            <span>Follow {CAFE_CONFIG.instagramHandle} on Instagram (4,400+ Followers)</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-[#1e1e28] text-white hover:text-[#ffcc33] transition-colors border border-[#3a3a4c]"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous Image"
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-[#1e1e28]/80 hover:bg-[#b3231c] text-white transition-all border border-[#3a3a4c]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image and Caption Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[70vh] w-auto overflow-hidden rounded-xl border border-[#3a3a4c] shadow-2xl">
              <CafeImage
                src={currentItem.expectedPath}
                filename={currentItem.filename}
                alt={currentItem.alt}
                caption={currentItem.caption}
                aspectRatio="aspect-auto min-w-[300px] min-h-[250px]"
              />
            </div>
            <div className="text-center mt-4 max-w-xl">
              <span className="text-xs font-bold text-[#ffcc33] uppercase tracking-wider">
                {currentItem.category}
              </span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
                {currentItem.title}
              </h3>
              <p className="text-xs text-[#ffcc33] font-cairo">
                {currentItem.titleArabic}
              </p>
              <p className="text-sm text-[#cbd5e1] mt-1">
                {currentItem.caption}
              </p>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next Image"
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-[#1e1e28]/80 hover:bg-[#b3231c] text-white transition-all border border-[#3a3a4c]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
