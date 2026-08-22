import React, { useState } from 'react';
import { TableReservation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  Clock,
  Users,
  Dices,
  Phone,
  User,
  CheckCircle,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReservationForm: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(4);
  const [dateTime, setDateTime] = useState('');
  const [preferredGame, setPreferredGame] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submittedReservation, setSubmittedReservation] = useState<TableReservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !dateTime.trim()) return;

    const newRes: TableReservation = {
      id: `res-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      partySize: Number(partySize) || 2,
      preferredDateTime: dateTime.trim(),
      preferredGame: preferredGame.trim() || undefined,
      specialNotes: specialNotes.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const stored = localStorage.getItem('mb_reservations') || '[]';
      const parsed: TableReservation[] = JSON.parse(stored);
      localStorage.setItem('mb_reservations', JSON.stringify([newRes, ...parsed]));
    } catch {
      // ignore
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffcc33', '#8c1c1c', '#ffffff'],
      });
    } catch {
      // ignore
    }

    setSubmittedReservation(newRes);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setPartySize(4);
    setDateTime('');
    setPreferredGame('');
    setSpecialNotes('');
    setSubmittedReservation(null);
  };

  return (
    <section id="reservation" className="py-16 lg:py-24 bg-[#fcf8f0] border-t border-[#ebd8c1] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f4edd9] border border-[#ebd8c1] text-[#8c1c1c] text-xs font-bold mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>VIP SEATING & GAME RESERVATIONS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-[#2a1b12] tracking-widest leading-none">
            {t('reserve.title')}
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#786555] mt-2 font-medium">
            {t('reserve.subtitle')}
          </p>
        </div>

        <div className="relative rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] p-6 sm:p-10 shadow-sm overflow-hidden">
          {submittedReservation ? (
            <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bebas text-3xl text-[#2a1b12] tracking-wider">
                  RESERVATION REQUEST SENT!
                </h3>
                <p className="text-sm text-[#8c1c1c] font-medium mt-1">
                  {t('reserve.success')}
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#fcf8f0] border border-[#ebd8c1] text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#786555]">Guest Name:</span>
                  <span className="font-bold text-[#2a1b12]">{submittedReservation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786555]">Phone:</span>
                  <span className="font-bold text-[#2a1b12]">{submittedReservation.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786555]">Party Size:</span>
                  <span className="font-bold text-[#8c1c1c]">{submittedReservation.partySize} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786555]">Preferred Time:</span>
                  <span className="font-bold text-[#2a1b12]">{submittedReservation.preferredDateTime}</span>
                </div>
                {submittedReservation.preferredGame && (
                  <div className="flex justify-between">
                    <span className="text-[#786555]">Reserved Game:</span>
                    <span className="font-bold text-[#8c1c1c]">{submittedReservation.preferredGame}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleReset}
                className="py-2.5 px-6 rounded-xl bg-[#f4edd9] hover:bg-[#ebd8c1] text-[#2a1b12] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8c1c1c]" />
                    <span>{t('reserve.name')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youssef Benali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8c1c1c]" />
                    <span>{t('reserve.phone')} *</span>
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

                {/* Party Size */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8c1c1c]" />
                    <span>{t('reserve.partySize')}</span>
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                  >
                    <option value={2}>2 Guests (Cozy Pair)</option>
                    <option value={4}>4 Guests (Standard Table)</option>
                    <option value={6}>6 Guests (Mezzanine Group)</option>
                    <option value={8}>8+ Guests (Large Party)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8c1c1c]" />
                    <span>{t('reserve.dateTime')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomorrow (Friday) at 8:00 PM"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                  />
                </div>

                {/* Preferred Game */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1.5 flex items-center gap-1.5">
                    <Dices className="w-3.5 h-3.5 text-[#8c1c1c]" />
                    <span>{t('reserve.game')}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Catan, Azul, Exploding Kittens..."
                    value={preferredGame}
                    onChange={(e) => setPreferredGame(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#554336] mb-1.5">
                  {t('reserve.notes')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Celebrating a birthday, please keep Mezzanine area if possible!"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-[#786555]">
                  No reservation fee required. We hold tables for 15 minutes past reserved time.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-xl tracking-wider border border-[#ffcc33]/40 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#ffcc33]" />
                  <span>{t('reserve.btn')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
