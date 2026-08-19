import React from 'react';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { MapPin, Clock, Navigation, Instagram, Phone, Train, Car, Compass, ExternalLink } from 'lucide-react';

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
      className="relative py-20 lg:py-28 bg-[#09090c] overflow-hidden border-t border-[#1e1e2d]"
    >
      <MonsteraLeaf position="top-left" opacity={0.3} />
      <MonsteraLeaf position="bottom-right" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <TornBanner
            title="LOCATION &amp; OPENING HOURS"
            titleArabic="الموقع وأوقات العمل"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#9ca3af] mt-3">
            Conveniently located in Salamandre, right next to the Tramway Port Station in Mostaganem.
          </p>
        </div>

        {/* 2-Column Location & Hours Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Details, Hours Timetable, Transit */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Location & Address Card */}
            <div className="p-6 rounded-2xl bg-[#14141e] border border-[#262638] shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-2xl text-white tracking-wide leading-none">
                    MISTER BUBBLE | السيد فقاعة
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 font-medium">
                    Salamandre, Near Tramway Port Station
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    W3CC+77H, Mostaganem 27000, Algeria
                  </p>
                </div>
              </div>

              {/* Transit hints */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#232332]">
                <div className="flex items-center gap-2 text-xs text-[#d1d5db] bg-[#1a1a26] p-2.5 rounded-lg">
                  <Train className="w-4 h-4 text-[#ffcc33] flex-shrink-0" />
                  <span>Station Port Tramway</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#d1d5db] bg-[#1a1a26] p-2.5 rounded-lg">
                  <Car className="w-4 h-4 text-[#2f9e44] flex-shrink-0" />
                  <span>Street Parking Nearby</span>
                </div>
              </div>
            </div>

            {/* Hours Table */}
            <div className="p-6 rounded-2xl bg-[#14141e] border border-[#262638] shadow-lg flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#ffcc33]" />
                  <h4 className="font-bebas text-xl text-white tracking-wide">Opening Hours</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open 7 Days a Week
                </span>
              </div>

              <div className="space-y-2">
                {daysOfWeek.map((item, idx) => {
                  const isToday = idx === currentDayIndex;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        isToday
                          ? 'bg-[#222232] text-white font-bold border border-[#f2a900]/40'
                          : 'text-[#9ca3af] hover:bg-[#1a1a24]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#ffcc33]" />}
                        {item.day}
                        {isToday && <span className="text-[10px] text-[#ffcc33] uppercase font-bold">(Today)</span>}
                      </span>
                      <span className={isToday ? 'text-[#ffcc33]' : 'text-[#d1d5db]'}>
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
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-xl tracking-wider text-center shadow-[0_0_15px_rgba(179,35,28,0.4)] border border-[#ffcc33]/40 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#ffcc33]" />
                OPEN IN GOOGLE MAPS
              </a>

              <a
                href="https://www.instagram.com/misterbubble.dz/"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-instagram-link"
                className="py-3.5 px-4 rounded-xl bg-[#1a1a28] hover:bg-[#242436] text-[#f3f4f6] hover:text-[#ffcc33] font-bebas text-xl tracking-wider text-center border border-[#3b3b4f] hover:border-[#f2a900] transition-all flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4 text-[#ec4899]" />
                @MISTERBUBBLE.DZ
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Interactive Google Map & Visual */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[380px] lg:h-full min-h-[380px] rounded-2xl overflow-hidden border-2 border-[#2b2b3d] shadow-2xl bg-[#14141e]">
              {/* Google Maps Embed iframe */}
              <iframe
                title="Mister Bubble Cafe Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.254199927909!2d0.071667!3d35.933333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12821df2666f2127%3A0xc3f5c0cf1ddaa8b9!2sSalamandre%2C%20Mostaganem%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
                className="w-full h-full border-0 filter contrast-105"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Floating Location Card */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-xl bg-[#101018]/95 backdrop-blur-md border border-[#ffcc33]/40 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8c1c1c] flex items-center justify-center text-[#ffcc33] font-bebas text-lg">
                    MB
                  </div>
                  <div>
                    <h5 className="font-bebas text-lg text-white leading-tight">Mister Bubble Cafe</h5>
                    <p className="text-[11px] text-[#ffcc33]">W3CC+77H Mostaganem</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#cbd5e1] mt-2 border-t border-[#232332] pt-1.5">
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
