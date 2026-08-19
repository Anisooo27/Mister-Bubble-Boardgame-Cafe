import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import {
  X,
  Award,
  Sparkles,
  Coffee,
  Check,
  Gift,
  Phone,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Share2,
  Copy,
  CheckCheck,
  Trophy,
  Dices,
  Flame,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyCardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  autoStamp?: boolean;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  isOpen,
  onClose,
  initialPhone = '',
  autoStamp = false,
}) => {
  const { t, isRTL } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [stamps, setStamps] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
      loadStampsForPhone(initialPhone, autoStamp);
    } else {
      try {
        const lastPhone = localStorage.getItem('mb_last_loyalty_phone');
        if (lastPhone) {
          setPhoneNumber(lastPhone);
          loadStampsForPhone(lastPhone, false);
        }
      } catch {
        // ignore
      }
    }
  }, [initialPhone, isOpen]);

  const loadStampsForPhone = (phone: string, shouldAddStamp: boolean) => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone) return;

    try {
      localStorage.setItem('mb_last_loyalty_phone', cleanPhone);
      const key = `mb_loyalty_${cleanPhone}`;
      let currentStamps = parseInt(localStorage.getItem(key) || '0', 10);

      if (shouldAddStamp) {
        currentStamps = Math.min(8, currentStamps + 1);
        localStorage.setItem(key, currentStamps.toString());
        if (currentStamps === 8) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffcc33', '#8c1c1c', '#ffffff'],
            });
          } catch {
            // ignore
          }
        }
      }

      setStamps(currentStamps);
      setHasSearched(true);
    } catch {
      // ignore
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    loadStampsForPhone(phoneNumber, false);
  };

  const handleManualAddStamp = () => {
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '') || 'guest_user';
    const key = `mb_loyalty_${cleanPhone}`;
    const nextStamps = stamps >= 8 ? 1 : stamps + 1;
    setStamps(nextStamps);
    localStorage.setItem(key, nextStamps.toString());

    if (nextStamps === 8) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffcc33', '#8c1c1c', '#ffffff'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleResetCard = () => {
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '') || 'guest_user';
    const key = `mb_loyalty_${cleanPhone}`;
    setStamps(0);
    localStorage.setItem(key, '0');
  };

  // Generate a user referral code based on phone or unique digits
  const getReferralCode = () => {
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length >= 4) {
      return `MB-${cleanPhone.slice(-4)}`;
    }
    return 'MB-BUBBLE2026';
  };

  const referralCode = getReferralCode();

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareReferral = () => {
    const text = `Hey! Order bubble tea & play board games with me at Mister Bubble Cafe Mostaganem! Use my code "${referralCode}" at checkout to get a FREE Extra Boba Topping perk! 🧋🎲`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  const totalSlots = 8;
  const isRewardUnlocked = stamps >= 8;
  const remaining = Math.max(0, 8 - stamps);

  // Milestone Badges logic
  const badges = [
    {
      id: 'first_sip',
      title: 'First Sip',
      desc: 'Completed your first order at Mister Bubble',
      icon: Coffee,
      unlocked: stamps >= 1,
    },
    {
      id: 'flavor_explorer',
      title: 'Flavor Explorer',
      desc: 'Collected 3+ drink stamps across menus',
      icon: Flame,
      unlocked: stamps >= 3,
    },
    {
      id: 'tabletop_hero',
      title: 'Tabletop Hero',
      desc: 'Collected 5+ stamps & reserved game tables',
      icon: Dices,
      unlocked: stamps >= 5,
    },
    {
      id: 'vip_regular',
      title: 'VIP Master',
      desc: 'Completed 8 stamps and unlocked 9th Free Drink',
      icon: Crown,
      unlocked: stamps >= 8,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loyalty-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#14141e] border-2 border-[#ffcc33]/50 rounded-3xl shadow-[0_0_50px_rgba(242,169,0,0.2)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#191928] border-b border-[#29293e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2a900] to-[#8c1c1c] text-[#0d0d10] flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="loyalty-title" className="font-bebas text-2xl text-white tracking-wide leading-none">
                {t('loyalty.title')}
              </h3>
              <p className="text-xs text-[#ffcc33] mt-0.5 font-medium">
                {t('loyalty.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close loyalty card"
            className="p-2 rounded-lg bg-[#222234] hover:bg-[#2c2c42] text-[#9ca3af] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Phone Lookup Form */}
          <form onSubmit={handlePhoneSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-[#cbd5e1] uppercase tracking-wider">
              {t('loyalty.phonePrompt')}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                <input
                  type="tel"
                  placeholder={t('loyalty.phonePlaceholder')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1a1a27] border border-[#2e2e42] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-lg tracking-wider font-bold transition-all shadow"
              >
                {t('loyalty.btnCheck')}
              </button>
            </div>
          </form>

          {/* Stamp Card Visual Presentation */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1826] via-[#161420] to-[#12111a] border-2 border-[#ffcc33]/40 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffcc33]">
                  VIP MEMBER STAMP CARD
                </span>
                <h4 className="font-bebas text-2xl text-white">MISTER BUBBLE CAFÉ</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#8c1c1c] text-[#ffcc33] text-xs font-bold border border-[#ffcc33]/40 font-mono">
                {stamps} / 8 STAMPS
              </span>
            </div>

            {/* 8-Circle Stamp Grid */}
            <div className="grid grid-cols-4 gap-3.5 my-6">
              {Array.from({ length: totalSlots }).map((_, idx) => {
                const isStamped = idx < stamps;
                return (
                  <div key={idx} className="flex flex-col items-center justify-center gap-1">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isStamped
                          ? 'bg-gradient-to-br from-[#b3231c] via-[#8c1c1c] to-[#5e1111] text-[#ffcc33] border-2 border-[#ffcc33] shadow-[0_0_15px_rgba(242,169,0,0.5)] scale-105'
                          : 'bg-[#1e1e2d] border-2 border-dashed border-[#3a3a50] text-[#6b7280]'
                      }`}
                    >
                      {isStamped ? (
                        <div className="flex flex-col items-center">
                          <span className="font-bebas text-xl text-[#ffcc33] leading-none">茶</span>
                          <span className="text-[9px] font-bold text-white tracking-widest">#{idx + 1}</span>
                        </div>
                      ) : (
                        <span className="font-bebas text-lg text-[#55556a]">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 9th Free Drink Reward Banner */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                isRewardUnlocked
                  ? 'bg-gradient-to-r from-[#8c1c1c] to-[#b3231c] border-[#ffcc33] text-white shadow-lg animate-pulse'
                  : 'bg-[#181826] border-[#29293e] text-[#9ca3af]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isRewardUnlocked ? 'bg-[#ffcc33] text-[#0f0f14]' : 'bg-[#222234] text-[#6b7280]'
                }`}
              >
                <Gift className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h5 className={`font-bebas text-lg leading-tight ${isRewardUnlocked ? 'text-[#ffcc33]' : 'text-white'}`}>
                  {isRewardUnlocked ? 'FREE DRINK REWARD UNLOCKED!' : '9TH DRINK ON THE HOUSE'}
                </h5>
                <p className="text-xs mt-0.5">
                  {isRewardUnlocked
                    ? t('loyalty.rewardReady')
                    : `${remaining} ${t('loyalty.remaining')}`}
                </p>
              </div>
            </div>
          </div>

          {/* Member Achievement Badges */}
          <div className="space-y-3">
            <h5 className="font-bebas text-lg text-[#ffcc33] tracking-wide flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>{t('loyalty.badgesTitle')}</span>
            </h5>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      b.unlocked
                        ? 'bg-[#1e1c2e] border-[#ffcc33]/60 text-white shadow-md'
                        : 'bg-[#14141e] border-[#252536] text-[#6b7280] opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        b.unlocked ? 'bg-[#ffcc33] text-[#0f0f14]' : 'bg-[#222234] text-[#6b7280]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-bebas text-sm tracking-wide text-white">
                      {b.title}
                    </div>
                    <div className="text-[10px] text-[#9ca3af] leading-tight">
                      {b.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shareable Referral Code */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1d1b2d] to-[#161524] border border-[#ffcc33]/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bebas text-lg text-white tracking-wide">
                  {t('loyalty.referralTitle')}
                </h5>
                <p className="text-[11px] text-[#cbd5e1]">
                  {t('loyalty.referralSub')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2 rounded-xl bg-[#12121c] border border-[#ffcc33]/50 font-mono font-bold text-base text-[#ffcc33] tracking-widest text-center">
                {referralCode}
              </div>

              <button
                onClick={handleCopyReferral}
                className="px-3.5 py-2 rounded-xl bg-[#28283e] hover:bg-[#343450] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? t('loyalty.codeCopied') : t('loyalty.copyCode')}</span>
              </button>

              <button
                onClick={handleShareReferral}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                title="Share via WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Test / Counter Actions */}
          <div className="flex items-center justify-between text-xs text-[#9ca3af] pt-2 border-t border-[#232334]">
            <button
              onClick={handleManualAddStamp}
              className="text-[#ffcc33] hover:text-[#ffe066] font-medium flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Add Drink Stamp (+1)</span>
            </button>
            <button
              onClick={handleResetCard}
              className="text-[#ef4444] hover:text-red-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Card</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#181826] border-t border-[#29293e] flex items-center justify-between">
          <p className="text-[11px] text-[#9ca3af]">
            {t('loyalty.claimNote')}
          </p>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#222234] hover:bg-[#2c2c42] text-white text-xs font-bold tracking-wider uppercase transition-all"
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
