import React from 'react';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CafeImage } from './CafeImage';
import { CupSoda, Dices, Armchair, Cat, Heart, Sparkles, Coffee } from 'lucide-react';

export const About: React.FC = () => {
  const highlights = [
    {
      icon: <CupSoda className="w-6 h-6 text-[#ffcc33]" />,
      title: 'Handcrafted Bubble Tea',
      desc: 'Authentic brewed fruit teas, sparkling fruit ades, and popping boba made fresh daily.',
      badge: 'Sip',
    },
    {
      icon: <Dices className="w-6 h-6 text-[#ff4d4d]" />,
      title: '50+ Curated Board Games',
      desc: 'Strategy, party, and classic tabletop games free-to-play with any drink or dessert.',
      badge: 'Play',
    },
    {
      icon: <Armchair className="w-6 h-6 text-[#2f9e44]" />,
      title: 'Cozy Home-Like Decor',
      desc: 'Woven straw nest lamps, wisteria ceilings, purple neon lounge, and warm wooden booths.',
      badge: 'Relax',
    },
    {
      icon: <Cat className="w-6 h-6 text-[#f2a900]" />,
      title: 'Resident Café Cats',
      desc: 'Our beloved friendly furry hosts love napping in their bed under the wooden ladder.',
      badge: 'Delight',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 bg-[#0f0f14] overflow-hidden border-t border-[#20202d]"
    >
      <MonsteraLeaf position="bottom-left" opacity={0.3} />
      <MonsteraLeaf position="top-right" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <TornBanner
            title="OUR STORY &amp; PHILOSOPHY"
            titleArabic="قصتنا وفلسفة المكان"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#691111]"
          />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#9ca3af] mt-3">
            Born from a deep love for Asian cafe culture, delightful refreshments, and connecting people around table games.
          </p>
        </div>

        {/* 2-Column Story + Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-[#d1d5db] text-base sm:text-lg leading-relaxed">
              <div className="flex items-center gap-2 text-[#ffcc33] font-bebas text-2xl tracking-wider">
                <Sparkles className="w-5 h-5 text-[#ffcc33]" />
                <span>WELCOME TO MISTER BUBBLE | السيد فقاعة</span>
              </div>

              <p>
                <strong className="text-white font-semibold">Mister Bubble</strong> is an Asian-themed café located in <strong className="text-[#ffcc33]">Salamandre, Mostaganem</strong>, born from a passion for Asian culture, vibrant street-market refreshment, and genuine human connections.
              </p>

              <p>
                We created a dedicated sanctuary for bubble tea lovers and sweet-treat enthusiasts. Here, every drink is hand-shaken with precision — from our effervescent <em>Ade Drink Series</em> to our tropical <em>Fruit Tea infusions with popping boba</em> and warm, crispy <em>Takoyaki Waffle skewers</em>.
              </p>

              <p>
                Beyond delicious drinks, Mister Bubble is a place to play, laugh, and unwind. With a curated library of over 50 board games for all ages, friends and families gather to duel in Azul or Catan, strategize, or share lighthearted party rounds with no table rental fees.
              </p>

              <div className="p-4 rounded-xl bg-[#171722] border-l-4 border-[#b3231c] text-sm sm:text-base text-[#e5e7eb] italic">
                “Whether you come to work, play, or simply unwind after a long day, our goal is to make every single visit feel comforting and memorable — accompanied by our cozy ambiance and resident café cats.”
              </div>
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#15151e] border border-[#262638] hover:border-[#f2a900]/40 transition-all hover:bg-[#1a1a26] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-[#20202e] group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-bebas tracking-widest text-[#ffcc33] px-2 py-0.5 rounded bg-[#2a2a3a]">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-bebas text-xl text-white tracking-wide group-hover:text-[#ffcc33] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#9ca3af] leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Atmospheric Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              {/* Primary Large Atmospheric Image with real local mapping */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#333344] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <CafeImage
                  src="/photos/interior-wisteria-mezzanine.jpg"
                  filename="interior-wisteria-mezzanine.jpg"
                  alt="Cozy Mister Bubble Cafe interior with mezzanine, hanging straw lamps and purple wisteria"
                  aspectRatio="aspect-[4/5]"
                  caption="Mezzanine staircase with hanging woven straw nest lamps and wisteria ceiling"
                  overlay={true}
                />
                
                {/* Overlay Card on Main Photo */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#111118]/90 backdrop-blur-md border border-[#2a2a3c] z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8c1c1c] flex items-center justify-center text-[#ffcc33] flex-shrink-0">
                      <Cat className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bebas text-lg text-white leading-none">Resident Cafe Cats</h5>
                      <p className="text-xs text-[#9ca3af] mt-0.5">Meet our peaceful furry friends lounging nearby</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Mini Showcase */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-[#2e2e42]">
                  <CafeImage
                    src="/photos/menu-branded-drinks-pair.jpg"
                    filename="menu-branded-drinks-pair.jpg"
                    alt="Mister Bubble branded cups: Brown sugar boba & strawberry ade"
                    aspectRatio="aspect-square"
                    caption="Signature bubble tea & strawberry ade"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-[#2e2e42]">
                  <CafeImage
                    src="/photos/gallery-cats-sleeping.jpg"
                    filename="gallery-cats-sleeping.jpg"
                    alt="Two resident cats sleeping peacefully"
                    aspectRatio="aspect-square"
                    caption="Our two sweet café cats napping"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
