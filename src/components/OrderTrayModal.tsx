import React, { useState } from 'react';
import { TrayItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Check, Copy, Sparkles, Coffee } from 'lucide-react';

interface OrderTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  trayItems: TrayItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearTray: () => void;
}

export const OrderTrayModal: React.FC<OrderTrayModalProps> = ({
  isOpen,
  onClose,
  trayItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalDZD = trayItems.reduce(
    (sum, item) => sum + item.calculatedPrice * item.quantity,
    0
  );

  const totalCount = trayItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopySummary = () => {
    const lines = trayItems.map(
      (t) => `• ${t.quantity}x ${t.item.name} ${t.size ? `(${t.size})` : ''} — ${t.calculatedPrice * t.quantity} DZD`
    );
    const summary = `🧋 Mister Bubble Order Summary:\n${lines.join('\n')}\n\nTotal: ${totalDZD} DZD\n(Mostaganem - Salamandre)`;
    
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tray-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#14141e] border border-[#2b2b3e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#191926] border-b border-[#29293c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center shadow">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="tray-modal-title" className="font-bebas text-2xl text-white tracking-wide leading-none">
                YOUR CAFE ORDER TRAY
              </h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {totalCount} item{totalCount !== 1 ? 's' : ''} planned • Estimate your visit total
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Order Tray"
            className="p-2 rounded-lg bg-[#222233] text-[#9ca3af] hover:text-white hover:bg-[#2b2b40] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {trayItems.length === 0 ? (
            <div className="py-12 text-center text-[#9ca3af] space-y-3">
              <Coffee className="w-12 h-12 mx-auto text-[#4b4b60]" />
              <p className="text-sm font-medium">Your tray is currently empty.</p>
              <p className="text-xs text-[#6b7280]">
                Explore our Ade Drinks, Fruit Teas, and Takoyaki Waffles to add items to your tray!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trayItems.map((trayItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#1a1a28] border border-[#27273a] flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <h5 className="font-bebas text-lg text-[#ffcc33] leading-tight">
                      {trayItem.item.name}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-0.5">
                      {trayItem.size && (
                        <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#272738] text-white">
                          {trayItem.size}
                        </span>
                      )}
                      <span>{trayItem.calculatedPrice} DZD each</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(idx, trayItem.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-[#252536] hover:bg-[#313146] text-white flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-white w-5 text-center">
                      {trayItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(idx, trayItem.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[#252536] hover:bg-[#313146] text-white flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="text-right flex items-center gap-3">
                    <span className="font-bebas text-lg text-white">
                      {trayItem.calculatedPrice * trayItem.quantity} DZD
                    </span>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-[#ef4444] hover:text-red-300 p-1 transition-colors"
                      aria-label="Remove item from tray"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Actions */}
        {trayItems.length > 0 && (
          <div className="p-5 bg-[#191926] border-t border-[#29293c] space-y-3">
            {/* Total Row */}
            <div className="flex items-center justify-between">
              <span className="font-bebas text-xl text-[#9ca3af]">Estimated Tray Total:</span>
              <div className="text-right">
                <span className="font-bebas text-3xl text-[#ffcc33] text-gold-glow">
                  {totalDZD} DZD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopySummary}
                className="py-2.5 px-3 rounded-xl bg-[#252538] hover:bg-[#313148] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#ffcc33]" />
                    <span>Copy Order Text</span>
                  </>
                )}
              </button>

              <button
                onClick={onClearTray}
                className="py-2.5 px-3 rounded-xl bg-[#252538] hover:bg-rose-900/40 text-xs font-bold text-rose-300 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Tray</span>
              </button>
            </div>

            <p className="text-[11px] text-[#6b7280] text-center mt-1">
              Order at the counter or show this tray upon your visit to Mister Bubble in Salamandre!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
