import React from 'react';
import { CAFE_EVENTS } from '../data/eventsData';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { Calendar, Clock, Sparkles, MessageCircle, Users, CheckCircle2, ChevronRight, Heart } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeConfig';

export const Events: React.FC = () => {
  return (
    <section
      id="events"
      className="relative py-20 lg:py-24 bg-[#faf6ee] overflow-hidden border-t border-[#ebd8c1]"
    >
      <MonsteraLeaf position="top-right" opacity={0.25} />
      <MonsteraLeaf position="bottom-left" opacity={0.2} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <TornBanner
            title="EVENTS & WHAT'S ON"
            titleArabic="الفعاليات والأنشطة المجتمعية"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#786555] mt-3 font-medium">
            More than just a café — we host language exchange sessions, friendly board game tournaments, and creative community meetups in Mostaganem.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {CAFE_EVENTS.map((event) => (
            <div
              key={event.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#ebd8c1] hover:border-[#8c1c1c] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md relative group"
            >
              {/* Event Category & Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#f4edd9] text-[#8c1c1c] border border-[#ebd8c1]">
                    {event.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fcf8f0] text-[#786555] border border-[#ebd8c1] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#f2a900]" />
                    {event.dayBadge}
                  </span>
                </div>

                <h3 className="font-bebas text-2xl text-[#2a1b12] group-hover:text-[#8c1c1c] transition-colors leading-tight mb-1">
                  {event.title}
                </h3>
                <p className="font-cairo text-xs text-[#786555] mb-4">
                  {event.titleArabic}
                </p>

                {/* Timing Details */}
                <div className="space-y-2 mb-4 p-3 rounded-2xl bg-[#fcf8f0] border border-[#ebd8c1] text-xs text-[#665547]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8c1c1c] flex-shrink-0" />
                    <span className="font-bold text-[#2a1b12]">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#665547] leading-relaxed mb-4">
                  {event.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-1.5 mb-6">
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#786555]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#ebd8c1] flex items-center justify-between">
                <span className="text-xs font-bold text-[#8c1c1c]">
                  {event.entryCost}
                </span>

                <a
                  href={CAFE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2a1b12] hover:text-[#8c1c1c] transition-colors"
                >
                  <span>RSVP on Instagram</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Host your own session callout banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8c1c1c] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bebas text-2xl text-[#2a1b12] tracking-wide">
                Want to host a Club or Game Tournament at Mister Bubble?
              </h4>
              <p className="text-xs sm:text-sm text-[#786555] mt-0.5">
                Book our mezzanine or reserved table cluster for your study group, book club, or gaming squad.
              </p>
            </div>
          </div>

          <a
            href={CAFE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#fcf8f0] hover:bg-[#f4edd9] text-[#2a1b12] hover:text-[#8c1c1c] border border-[#ebd8c1] hover:border-[#8c1c1c] text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#ec4899]" />
            <span>Send Instagram DM</span>
          </a>
        </div>
      </div>
    </section>
  );
};
