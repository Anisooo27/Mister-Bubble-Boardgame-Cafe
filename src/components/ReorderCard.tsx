import React, { useState, useEffect } from 'react';
import { OrderDetails, TrayItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RotateCcw, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

interface ReorderCardProps {
  onReorder: (items: TrayItem[]) => void;
}

export const ReorderCard: React.FC<ReorderCardProps> = ({ onReorder }) => {
  const { t, isRTL } = useLanguage();
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('mb_order_history');
      if (historyStr) {
        const history: OrderDetails[] = JSON.parse(historyStr);
        if (Array.isArray(history) && history.length > 0) {
          setLastOrder(history[0]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  if (!lastOrder || !lastOrder.items || lastOrder.items.length === 0) {
    return null;
  }

  const handleReorderClick = () => {
    onReorder(lastOrder.items);
  };

  return (
    <div className="max-w-4xl mx-auto mb-10 px-4">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1c1824] via-[#1f1622] to-[#171722] border-2 border-[#ffcc33]/40 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center flex-shrink-0 shadow-md border border-[#ffcc33]/30">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffcc33] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t('reorder.title')}
              </span>
              <span className="text-[10px] text-[#9ca3af]">
                ({lastOrder.timestamp})
              </span>
            </div>
            <h4 className="font-bebas text-xl text-white mt-0.5">
              {lastOrder.items.map((i) => `${i.quantity}x ${i.item.name}`).join(' • ')}
            </h4>
            <p className="text-xs text-[#cbd5e1] mt-0.5">
              {lastOrder.total} DZD &bull; {lastOrder.orderType.toUpperCase()} ({t('reorder.ref')}: {lastOrder.orderId})
            </p>
          </div>
        </div>

        <button
          onClick={handleReorderClick}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#cf2920] hover:to-[#9e1f1f] text-white font-bebas text-lg tracking-wider transition-all flex items-center justify-center gap-2 border border-[#ffcc33]/60 shadow-md whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4 text-[#ffcc33]" />
          <span>{t('reorder.btnReorder')}</span>
          <ArrowRight className={`w-4 h-4 text-white ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
