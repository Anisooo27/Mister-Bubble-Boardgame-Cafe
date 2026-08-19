import React, { useState, useEffect } from 'react';
import { TrayItem, OrderType, OrderDetails } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Coffee,
  CheckCircle,
  Clock,
  MapPin,
  Utensils,
  Car,
  Bike,
  AlertCircle,
  RotateCcw,
  Hourglass,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trayItems: TrayItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearTray: () => void;
  onOrderSuccess?: (order: OrderDetails) => void;
  onOrderComplete?: (order: OrderDetails) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  trayItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
  onOrderSuccess,
  onOrderComplete,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('In 10–15 minutes');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [hasSavedProfile, setHasSavedProfile] = useState(false);

  // Auto-fill from localStorage for returning customers
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mb_customer_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.customerPhone) setCustomerPhone(parsed.customerPhone);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.tableNumber) setTableNumber(parsed.tableNumber);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
        setHasSavedProfile(true);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearSavedInfo = () => {
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setDeliveryAddress('');
    setSpecialNotes('');
    setHasSavedProfile(false);
    try {
      localStorage.removeItem('mb_customer_profile');
    } catch {
      // ignore
    }
  };

  const totalDZD = trayItems.reduce(
    (sum, item) => sum + item.calculatedPrice * item.quantity,
    0
  );
  const totalCount = trayItems.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedMins = totalCount > 4 ? '15–20' : '10–15';

  const generateOrderId = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `MB-${dateStr}-${randomNum}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (trayItems.length === 0) {
      setValidationError('Your tray is empty. Add drinks or waffles first!');
      return;
    }

    if (!customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setValidationError('Please enter a valid phone number (e.g. 0550 12 34 56).');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber.trim()) {
      setValidationError('Please specify your table number or area (e.g. Table 4 or Mezzanine).');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setValidationError('Please provide your delivery address in Mostaganem.');
      return;
    }

    // Save profile for fast future checkout
    try {
      localStorage.setItem(
        'mb_customer_profile',
        JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          orderType,
          tableNumber: orderType === 'dine-in' ? tableNumber.trim() : '',
          deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : '',
        })
      );
    } catch {
      // ignore
    }

    const newOrder: OrderDetails = {
      orderId: generateOrderId(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber.trim() : undefined,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      specialNotes: specialNotes.trim() || undefined,
      items: [...trayItems],
      subtotal: totalDZD,
      total: totalDZD,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'placed',
    };

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f2a900', '#8c1c1c', '#ffffff'],
      });
    } catch {
      // ignore
    }

    const callback = onOrderSuccess || onOrderComplete;
    if (typeof callback === 'function') {
      callback(newOrder);
    }
    onClearTray();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-drawer-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#12121a] border-l border-[#28283c] h-full flex flex-col shadow-2xl text-[#f3f4f6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#171722] border-b border-[#252538] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="checkout-drawer-title" className="font-bebas text-2xl text-white tracking-wide leading-none">
                ONLINE ORDER &amp; TRAY
              </h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {totalCount} item{totalCount !== 1 ? 's' : ''} in your cart • Pay in-café
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-lg bg-[#20202e] text-[#9ca3af] hover:text-white hover:bg-[#28283c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Item List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bebas text-lg text-white tracking-wider">Your Selected Items</h4>
              {trayItems.length > 0 && (
                <button
                  onClick={onClearTray}
                  className="text-xs text-[#ef4444] hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {trayItems.length === 0 ? (
              <div className="py-12 text-center text-[#9ca3af] space-y-3 bg-[#171722] rounded-3xl border border-[#222232] p-6">
                <div className="w-14 h-14 rounded-2xl bg-[#222030] text-[#ffcc33] flex items-center justify-center mx-auto shadow-inner">
                  <Coffee className="w-7 h-7" />
                </div>
                <h5 className="font-bebas text-xl text-white tracking-wide">Your tray is currently empty</h5>
                <p className="text-xs text-[#8c8c9e] max-w-xs mx-auto leading-relaxed">
                  Browse our 12 categories: sweet boba teas, fresh fruit ades, crispy bubble waffles, and sharing fruit boxes!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-xl bg-[#8c1c1c] hover:bg-[#b3231c] text-[#ffcc33] font-bebas text-base tracking-wider transition-colors inline-block"
                >
                  Browse Full Menu
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {trayItems.map((trayItem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#181824] border border-[#262638] flex items-center justify-between gap-3 hover:border-[#383850] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bebas text-base text-[#ffcc33] truncate">
                        {trayItem.item.name}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                        {trayItem.size && (
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#252536] text-white">
                            {trayItem.size}
                          </span>
                        )}
                        <span>{trayItem.calculatedPrice} DZD</span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-[#202030] p-1 rounded-lg border border-[#2d2d40]">
                      <button
                        onClick={() => onUpdateQuantity(idx, trayItem.quantity - 1)}
                        className="w-6 h-6 rounded bg-[#272738] hover:bg-[#34344c] text-white flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-white w-4 text-center">
                        {trayItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, trayItem.quantity + 1)}
                        className="w-6 h-6 rounded bg-[#272738] hover:bg-[#34344c] text-white flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="font-bebas text-base text-white">
                        {trayItem.calculatedPrice * trayItem.quantity} DZD
                      </span>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-[#ef4444] hover:text-red-300 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Details Form */}
          {trayItems.length > 0 && (
            <form onSubmit={handlePlaceOrder} className="space-y-5 pt-2 border-t border-[#232334]">
              {/* Returning Customer Autofill Notice */}
              {hasSavedProfile && customerName && (
                <div className="p-3 rounded-xl bg-[#1b1928] border border-[#ffcc33]/30 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#ffcc33]">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Welcome back, <strong>{customerName}</strong>!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSavedInfo}
                    className="text-[11px] text-[#9ca3af] hover:text-white underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Not you? Clear</span>
                  </button>
                </div>
              )}

              {/* Order Type Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] uppercase tracking-wider mb-2">
                  1. Choose Service Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                      orderType === 'dine-in'
                        ? 'bg-[#8c1c1c] text-[#ffcc33] border-[#f2a900] shadow-md'
                        : 'bg-[#181824] text-[#9ca3af] border-[#29293c] hover:bg-[#202030]'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Dine-In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                      orderType === 'pickup'
                        ? 'bg-[#8c1c1c] text-[#ffcc33] border-[#f2a900] shadow-md'
                        : 'bg-[#181824] text-[#9ca3af] border-[#29293c] hover:bg-[#202030]'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Drive / Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                      orderType === 'delivery'
                        ? 'bg-[#8c1c1c] text-[#ffcc33] border-[#f2a900] shadow-md'
                        : 'bg-[#181824] text-[#9ca3af] border-[#29293c] hover:bg-[#202030]'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Conditional Location / Table Field */}
              {orderType === 'dine-in' && (
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Table Number or Area <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Table 4, Mezzanine Lounge, or Bar"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>
              )}

              {orderType === 'pickup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Estimated Pickup Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  >
                    <option value="In 10–15 minutes">In 10–15 minutes</option>
                    <option value="In 20–30 minutes">In 20–30 minutes</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="Later this evening">Later this evening (mention time in notes)</option>
                  </select>
                </div>
              )}

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Delivery Address (Salamandre / Mostaganem) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Neighborhood, building, landmark, floor..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Nom"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                  Special Requests / Sugar Level / Boba Toppings
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less ice, extra pearls, bueno drizzle..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181824] border border-[#2d2d40] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                />
              </div>

              {/* Estimated Prep Notice */}
              <div className="p-3 rounded-xl bg-[#1a1727] border border-[#ffcc33]/25 flex items-center gap-2.5 text-xs text-[#cbd5e1]">
                <Hourglass className="w-4 h-4 text-[#ffcc33] flex-shrink-0" />
                <span>Estimated fresh preparation time: <strong>~{estimatedMins} minutes</strong>.</span>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit & Generate Invoice */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-place-order"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#b3231c] via-[#8c1c1c] to-[#601212] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-xl tracking-wider text-center shadow-[0_0_20px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#ffcc33]" />
                  <span>PLACE ORDER &amp; GET DIGITAL FACTURE ({totalDZD} DZD)</span>
                </button>

                <p className="text-[11px] text-[#9ca3af] text-center mt-2">
                  No credit card required. A digital invoice with QR code will be generated to show at the counter or to our delivery courier.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
