import React, { useState } from 'react';
import { EventBooking } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CafeImage } from './CafeImage';
import {
  PartyPopper,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Gift,
  Music,
  Coffee,
  Check,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HostEvent: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<'Birthday Party' | 'Game Tournament' | 'Group Gathering' | 'Corporate/Study'>('Birthday Party');
  const [estimatedGuests, setEstimatedGuests] = useState(8);
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !preferredDate.trim()) return;

    const booking: EventBooking = {
      id: `event-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      eventType,
      estimatedGuests: Number(estimatedGuests) || 8,
      preferredDate: preferredDate.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('mb_event_bookings') || '[]';
      const list = JSON.parse(stored);
      localStorage.setItem('mb_event_bookings', JSON.stringify([booking, ...list]));
    } catch {
      // ignore
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f2a900', '#8c1c1c', '#ffffff'],
      });
    } catch {
      // ignore
    }

    setIsSuccess(true);
  };

  return (
    <section id="host-event" className="py-20 lg:py-28 bg-[#f4edd9] border-t border-[#ebd8c1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#ffffff] border border-[#c8935f] text-[#8c1c1c] text-xs font-bold font-bebas tracking-wider mb-3 shadow-xs">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>PRIVATE CELEBRATIONS &amp; TOURNAMENTS</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl text-[#8c1c1c] tracking-widest leading-none drop-shadow-xs">
            {t('host.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-[#665547] mt-2 font-medium">
            {t('host.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Perks and Photo Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#ebd8c1] shadow-md h-64 sm:h-72">
              <CafeImage
                src="/photos/event-mezzanine-lounge.jpg"
                filename="event-mezzanine-lounge.jpg"
                alt="Exclusive Mezzanine Lounge Space at Mister Bubble"
                title="Exclusive Mezzanine Space"
                caption="Cozy Japanese-Inspired Lounge"
                className="w-full h-full object-cover"
                aspectRatio="aspect-auto h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-[#ffcc33] tracking-widest block drop-shadow">
                  Exclusive Mezzanine Space
                </span>
                <h4 className="font-bebas text-2xl text-white drop-shadow">Cozy Japanese-Inspired Lounge</h4>
              </div>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-[#2a1b12] text-sm">{t('host.feature1')}</h5>
                  <p className="text-[11px] text-[#786555] mt-0.5">Accommodates groups of up to 25 people comfortably.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-[#2a1b12] text-sm">{t('host.feature2')}</h5>
                  <p className="text-[11px] text-[#786555] mt-0.5">Tournaments, trivia, and curated party games.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-[#2a1b12] text-sm">{t('host.feature3')}</h5>
                  <p className="text-[11px] text-[#786555] mt-0.5">Bubble tea towers, custom ade dispensers & waffle skewers.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-[#2a1b12] text-sm">{t('host.feature4')}</h5>
                  <p className="text-[11px] text-[#786555] mt-0.5">Personalized music playlist & photo-ready backdrops.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Event Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] p-6 sm:p-8 shadow-md">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-bebas text-3xl text-[#2a1b12]">EVENT INQUIRY RECEIVED!</h3>
                  <p className="text-xs sm:text-sm text-[#665547] max-w-md mx-auto">
                    Thank you {name}! Our event coordinator will get in touch with you shortly on {phone} or via Instagram DM to tailor your group package.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="py-2.5 px-6 rounded-xl bg-[#f4edd9] hover:bg-[#ebd8c1] text-[#8c1c1c] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <h4 className="font-bebas text-2xl text-[#8c1c1c] border-b border-[#ebd8c1] pb-2">
                    Request an Event Package
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                        Organizer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0550 12 34 56"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                      >
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Game Tournament">Game Tournament</option>
                        <option value="Group Gathering">Group Gathering / Meetup</option>
                        <option value="Corporate/Study">Study / Club Session</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                        Estimated Group Size
                      </label>
                      <select
                        value={estimatedGuests}
                        onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                      >
                        <option value={6}>6–10 Guests</option>
                        <option value={15}>11–18 Guests</option>
                        <option value={25}>20–30 Guests (Full Mezzanine)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                      Preferred Date &amp; Time *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next Saturday, 6:00 PM – 9:00 PM"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3d2e24] mb-1">
                      Special Catering or Game Requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need 15x Boba cups, birthday cake setup, and Uno/Catan tournament rules."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-xl tracking-wider border border-[#ffcc33]/40 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-[#ffcc33]" />
                    <span>REQUEST EVENT PACKAGE</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
