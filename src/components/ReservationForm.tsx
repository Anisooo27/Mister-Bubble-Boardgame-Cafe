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
    <section id="reservation" className="py-16 lg:py-24 bg-[#0a0a0d] border-t border-[#1e1e2c] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1e1e2d] border border-[#f2a900]/40 text-[#ffcc33] text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>VIP SEATING &amp; GAME RESERVATIONS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest leading-none">
            {t('reserve.title')}
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#9ca3af] mt-2">
            {t('reserve.subtitle')}
          </p>
        </div>

        <div className="relative rounded-3xl bg-gradient-to-br from-[#171522] via-[#14131d] to-[#0f0e16] border-2 border-[#ffcc33]/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {submittedReservation ? (
            <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bebas text-3xl text-white tracking-wider">
                  RESERVATION REQUEST SENT!
                </h3>
                <p className="text-sm text-[#ffcc33] font-medium mt-1">
                  {t('reserve.success')}
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#1d1a29] border border-[#2e2a40] text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Guest Name:</span>
                  <span className="font-bold text-white">{submittedReservation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Phone:</span>
                  <span className="font-bold text-white">{submittedReservation.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Party Size:</span>
                  <span className="font-bold text-[#ffcc33]">{submittedReservation.partySize} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Preferred Time:</span>
                  <span className="font-bold text-white">{submittedReservation.preferredDateTime}</span>
                </div>
                {submittedReservation.preferredGame && (
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Reserved Game:</span>
                    <span className="font-bold text-[#ffcc33]">{submittedReservation.preferredGame}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleReset}
                className="py-2.5 px-6 rounded-xl bg-[#232032] hover:bg-[#2c283f] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ffcc33]" />
                    <span>{t('reserve.name')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youssef Benali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ffcc33]" />
                    <span>{t('reserve.phone')} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0550 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>

                {/* Party Size */}
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#ffcc33]" />
                    <span>{t('reserve.partySize')}</span>
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
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
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ffcc33]" />
                    <span>{t('reserve.dateTime')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomorrow (Friday) at 8:00 PM"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>

                {/* Preferred Game */}
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                    <Dices className="w-3.5 h-3.5 text-[#ffcc33]" />
                    <span>{t('reserve.game')}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Catan, Azul, Exploding Kittens..."
                    value={preferredGame}
                    onChange={(e) => setPreferredGame(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
                  {t('reserve.notes')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Celebrating a birthday, please keep Mezzanine area if possible!"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191724] border border-[#2c273c] text-sm text-white focus:outline-none focus:border-[#ffcc33] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-[#9ca3af]">
                  No reservation fee required. We hold tables for 15 minutes past reserved time.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#cf2920] hover:to-[#9e1f1f] text-white font-bebas text-xl tracking-wider border border-[#ffcc33]/60 shadow-[0_0_20px_rgba(179,35,28,0.5)] transition-all flex items-center justify-center gap-2"
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
