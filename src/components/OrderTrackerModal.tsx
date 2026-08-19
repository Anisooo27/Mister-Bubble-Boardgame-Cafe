import React, { useState, useEffect } from 'react';
import { OrderDetails } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Coffee, 
  Bell, 
  BellRing, 
  Search, 
  X, 
  Volume2, 
  VolumeX,
  AlertCircle,
  ShoppingBag,
  Flame,
  ArrowRight
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

// Pleasant 2-tone chime using Web Audio API for reliable cross-browser audio notification
const playReadyChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Upbeat C-Major chime: G5 -> C6
    playTone(784, 0, 0.25);
    playTone(1046.5, 0.2, 0.4);
  } catch (e) {
    console.log('Audio chime error:', e);
  }
};

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const { t, language } = useLanguage();
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [searchRef, setSearchRef] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [previousStatus, setPreviousStatus] = useState<string>('');

  // Load orders from localStorage
  const loadOrder = (refId?: string) => {
    try {
      const saved = localStorage.getItem('mb_order_history');
      if (saved) {
        const orders: OrderDetails[] = JSON.parse(saved);
        if (orders && orders.length > 0) {
          if (refId) {
            const found = orders.find(
              (o) => o.orderId.toLowerCase() === refId.trim().toLowerCase()
            );
            if (found) {
              setActiveOrder(found);
              setErrorMsg('');
              return;
            } else {
              setErrorMsg(`Order reference "${refId}" not found.`);
            }
          } else {
            // Default to most recent order
            setActiveOrder(orders[0]);
          }
        }
      } else {
        setErrorMsg('No recent orders found. Place an order to track it live!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrder(initialOrderId);
    }
  }, [isOpen, initialOrderId]);

  // Polling listener & storage sync to detect staff status updates
  useEffect(() => {
    if (!isOpen || !activeOrder) return;

    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('mb_order_history');
        if (saved) {
          const orders: OrderDetails[] = JSON.parse(saved);
          const updated = orders.find((o) => o.orderId === activeOrder.orderId);
          if (updated && updated.status !== activeOrder.status) {
            // Status changed!
            if (updated.status === 'ready' && soundEnabled) {
              playReadyChime();
              if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Mister Bubble Cafe 🧋', {
                  body: `Your order (${updated.orderId}) is READY at the counter!`,
                  icon: '/favicon.ico',
                });
              }
            }
            setActiveOrder(updated);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, activeOrder, soundEnabled, notificationsEnabled]);

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Browser push notifications are not supported in this browser. Sound alerts are enabled!');
      setNotificationsEnabled(true);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Mister Bubble Notifications Active!', {
          body: 'We will alert you the second your drinks and waffles are ready at the counter!',
        });
      } else {
        setNotificationsEnabled(false);
      }
    } catch (e) {
      console.error(e);
      setNotificationsEnabled(true);
    }
  };

  if (!isOpen) return null;

  const stages = [
    {
      id: 'placed',
      title: t('track.placed'),
      desc: t('track.placedDesc'),
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'preparing',
      title: t('track.preparing'),
      desc: t('track.preparingDesc'),
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'ready',
      title: t('track.ready'),
      desc: t('track.readyDesc'),
      icon: Coffee,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'completed',
      title: t('track.completed'),
      desc: t('track.completedDesc'),
      icon: CheckCircle2,
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const getStageIndex = (status?: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(activeOrder?.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#13131d] border border-[#2c2c40] rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-[#222234] bg-[#181827] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b3231c]/20 border border-[#b3231c]/50 flex items-center justify-center text-[#ffcc33]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bebas text-2xl tracking-wider text-[#ffcc33]">
                {t('track.title')}
              </h3>
              <p className="text-xs text-[#9ca3af]">
                {t('track.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-[#1e1e2f] text-[#ffcc33] border-[#ffcc33]/40'
                  : 'bg-[#181824] text-[#6b7280] border-[#2c2c3e]'
              }`}
              title={soundEnabled ? 'Chime Sound Active' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#222234] hover:bg-[#2e2e46] text-[#9ca3af] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Reference Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Enter Order Reference (e.g. MB-8472)..."
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadOrder(searchRef)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a28] border border-[#2e2e44] focus:border-[#ffcc33] rounded-xl text-sm text-white outline-none"
              />
            </div>
            <button
              onClick={() => loadOrder(searchRef)}
              className="px-4 py-2.5 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-lg tracking-wider font-bold transition-all"
            >
              TRACK
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#b3231c]/10 border border-[#b3231c]/40 text-xs text-[#ff8080] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeOrder ? (
            <>
              {/* Order Banner & Stage Highlight */}
              <div className="p-5 rounded-2xl bg-[#191929] border border-[#2d2d44] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider">
                      Live Order Reference
                    </span>
                    <div className="font-mono text-2xl font-black text-[#ffcc33]">
                      {activeOrder.orderId}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#ffcc33]/15 text-[#ffcc33] border border-[#ffcc33]/40 text-xs font-bold font-bebas tracking-wider">
                      {activeOrder.orderType.toUpperCase()}
                      {activeOrder.tableNumber ? ` • ${activeOrder.tableNumber}` : ''}
                    </span>
                    <span className="text-xs text-[#9ca3af] font-mono">
                      {activeOrder.timestamp}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-4">
                  <div className="h-2 bg-[#12121c] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#b3231c] via-[#f2a900] to-emerald-400 transition-all duration-700 ease-out"
                      style={{ width: `${((currentStageIndex + 1) / 4) * 100}%` }}
                    />
                  </div>

                  {/* 4 Step Markers */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {stages.map((stage, idx) => {
                      const Icon = stage.icon;
                      const isCurrent = idx === currentStageIndex;
                      const isPast = idx < currentStageIndex;

                      return (
                        <div key={stage.id} className="text-center">
                          <div
                            className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-[#ffcc33] text-[#0f0f14] shadow-[0_0_15px_rgba(242,169,0,0.6)] scale-110'
                                : isPast
                                ? 'bg-emerald-500 text-white'
                                : 'bg-[#222234] text-[#6b7280]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div
                            className={`font-bebas text-sm tracking-wider mt-1.5 ${
                              isCurrent ? 'text-[#ffcc33] font-bold' : isPast ? 'text-white' : 'text-[#6b7280]'
                            }`}
                          >
                            {stage.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Stage Status Callout */}
                <div className="p-4 rounded-xl bg-[#141420] border border-[#28283c] flex items-center justify-between gap-4 mt-4">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{stages[currentStageIndex]?.title}</span>
                    </div>
                    <p className="text-xs text-[#9ca3af] mt-0.5">
                      {stages[currentStageIndex]?.desc}
                    </p>
                  </div>

                  {activeOrder.status === 'ready' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bebas text-lg font-bold tracking-wider animate-bounce">
                      READY FOR PICKUP!
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-4 rounded-2xl bg-[#181826] border border-[#2b2b3d] space-y-3">
                <div className="font-bebas text-lg text-white tracking-wider flex items-center justify-between">
                  <span>Ordered Items ({activeOrder.items.length})</span>
                  <span className="text-[#ffcc33] font-mono font-bold">{activeOrder.total} DZD</span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                  {activeOrder.items.map((trayItem, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-[#cbd5e1] border-b border-[#222234] pb-1.5">
                      <div>
                        <span className="font-bold text-white">{trayItem.quantity}x</span> {trayItem.item.name}
                        {trayItem.size && <span className="text-[#ffcc33] ml-1">({trayItem.size})</span>}
                      </div>
                      <div className="font-mono text-[#9ca3af]">{trayItem.calculatedPrice} DZD</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications Toggle */}
              <div className="p-4 rounded-2xl bg-[#191929] border border-[#2d2d42] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#ffcc33]/15 text-[#ffcc33] flex items-center justify-center flex-shrink-0">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bebas text-lg text-white tracking-wide">
                      {t('track.notifyMe')}
                    </h5>
                    <p className="text-xs text-[#9ca3af]">
                      Receive a prompt chime on this screen when your order transitions to Ready.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRequestNotifications}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    notificationsEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#252538] hover:bg-[#32324c] text-white border border-[#3e3e5c]'
                  }`}
                >
                  {notificationsEnabled ? t('track.notificationsEnabled') : 'Enable Notifications'}
                </button>
              </div>
            </>
          ) : null}

        </div>

      </div>
    </div>
  );
};
