import React from 'react';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CafeImage } from './CafeImage';
import { MapPin, Clock, Navigation, Instagram, Train, Car, Camera } from 'lucide-react';

export const LocationHours: React.FC = () => {
  const daysOfWeek = [
    { day: 'Monday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Tuesday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Wednesday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Thursday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Friday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Saturday', hours: '9:00 AM – 12:00 AM', open: true },
    { day: 'Sunday', hours: '9:00 AM – 12:00 AM', open: true },
  ];

  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0

  return (
    <section
      id="location"
      className="relative py-20 lg:py-28 bg-[#faf6ee] overflow-hidden border-t border-[#ebd8c1]"
    >
      <MonsteraLeaf position="top-left" opacity={0.3} />
      <MonsteraLeaf position="bottom-right" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <TornBanner
            title="LOCATION & OPENING HOURS"
            titleArabic="الموقع وأوقات العمل"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#786555] mt-3 font-medium">
            Conveniently located in Salamandre, right next to the Tramway Port Station in Mostaganem.
          </p>
        </div>

        {/* 2-Column Location & Hours Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Details, Hours Timetable, Transit */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Location & Address Card */}
            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#ebd8c1] shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-2xl text-[#2a1b12] tracking-wide leading-none">
                    MISTER BUBBLE | السيد فقاعة
                  </h4>
                  <p className="text-xs sm:text-sm text-[#554336] mt-1 font-medium">
                    Salamandre, Near Tramway Port Station
                  </p>
                  <p className="text-xs text-[#786555]">
                    W3CC+77H, Mostaganem 27000, Algeria
                  </p>
                </div>
              </div>

              {/* Transit hints */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#ebd8c1]">
                <div className="flex items-center gap-2 text-xs text-[#554336] bg-[#fcf8f0] p-2.5 rounded-xl border border-[#ebd8c1]">
                  <Train className="w-4 h-4 text-[#8c1c1c] flex-shrink-0" />
                  <span className="font-medium">Station Port Tramway</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#554336] bg-[#fcf8f0] p-2.5 rounded-xl border border-[#ebd8c1]">
                  <Car className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span className="font-medium">Street Parking Nearby</span>
                </div>
              </div>
            </div>

            {/* Hours Table */}
            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#ebd8c1] shadow-sm flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#8c1c1c]" />
                  <h4 className="font-bebas text-xl text-[#2a1b12] tracking-wide">Opening Hours</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Open 7 Days a Week
                </span>
              </div>

              <div className="space-y-2">
                {daysOfWeek.map((item, idx) => {
                  const isToday = idx === currentDayIndex;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors ${
                        isToday
                          ? 'bg-[#f4edd9] text-[#2a1b12] font-bold border border-[#ebd8c1]'
                          : 'text-[#665547] hover:bg-[#fcf8f0]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#8c1c1c]" />}
                        {item.day}
                        {isToday && <span className="text-[10px] text-[#8c1c1c] uppercase font-bold">(Today)</span>}
                      </span>
                      <span className={isToday ? 'text-[#8c1c1c] font-bold' : 'text-[#554336]'}>
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Directions & Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://maps.app.goo.gl/4N8Emd2rZtxoBgHQ6"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-google-directions"
                className="py-3.5 px-4 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-xl tracking-wider text-center shadow-sm border border-[#ffcc33]/40 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#ffcc33]" />
                OPEN IN GOOGLE MAPS
              </a>

              <a
                href="https://www.instagram.com/misterbubble.dz/"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-instagram-link"
                className="py-3.5 px-4 rounded-xl bg-[#ffffff] hover:bg-[#fcf8f0] text-[#2a1b12] hover:text-[#8c1c1c] font-bebas text-xl tracking-wider text-center border border-[#ebd8c1] hover:border-[#8c1c1c] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Instagram className="w-4 h-4 text-[#ec4899]" />
                @MISTERBUBBLE.DZ
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Interactive Google Map & Visual Photo Preview */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Real Street & Entrance Visual Duo */}
            <div className="grid grid-cols-2 gap-3 h-44 sm:h-48">
              <div className="rounded-2xl overflow-hidden border border-[#ebd8c1] shadow-xs relative">
                <CafeImage
                  src="/photos/interior-ground-floor-view.jpg"
                  filename="interior-ground-floor-view.jpg"
                  alt="Ground floor cafe view at Mister Bubble"
                  title="Ground Floor Seating & Bar"
                  aspectRatio="aspect-auto h-full w-full"
                  overlay={true}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-bold">
                  Ground Floor Lounge
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#ebd8c1] shadow-xs relative">
                <CafeImage
                  src="/photos/hero-exterior-night.jpg"
                  filename="hero-exterior-night.jpg"
                  alt="Night facade of Mister Bubble Mostaganem"
                  title="Nighttime Exterior"
                  aspectRatio="aspect-auto h-full w-full"
                  overlay={true}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-bold">
                  Salamandre Storefront
                </div>
              </div>
            </div>

            {/* Google Maps Embed iframe */}
            <div className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden border-2 border-[#ebd8c1] shadow-md bg-[#f4edd9]">
              <iframe
                title="Mister Bubble Cafe Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.254199927909!2d0.071667!3d35.933333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12821df2666f2127%3A0xc3f5c0cf1ddaa8b9!2sSalamandre%2C%20Mostaganem%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
                className="w-full h-full border-0 filter contrast-105"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Floating Location Card */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-xl bg-[#ffffff]/95 backdrop-blur-md border border-[#ebd8c1] shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8c1c1c] flex items-center justify-center text-[#ffcc33] font-bebas text-lg">
                    MB
                  </div>
                  <div>
                    <h5 className="font-bebas text-lg text-[#2a1b12] leading-tight">Mister Bubble Cafe</h5>
                    <p className="text-[11px] text-[#8e5b2e] font-bold">W3CC+77H Mostaganem</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#786555] mt-2 border-t border-[#ebd8c1] pt-1.5">
                  Walk 2 mins from Port Tramway Station towards Salamandre waterfront.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
