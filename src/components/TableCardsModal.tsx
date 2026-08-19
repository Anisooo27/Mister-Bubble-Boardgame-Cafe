import React, { useEffect, useRef } from 'react';
import { CAFE_CONFIG, CafeTable } from '../data/cafeConfig';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { X, Printer, QrCode, Sparkles, Utensils, Dices, ChevronRight } from 'lucide-react';

interface TableCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate simple SVG QR code representation for printing
const generateSvgQr = (url: string) => {
  // Use public high-reliability QR code image service or SVG data
  const encoded = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=8c1c1c&bgcolor=ffffff&qzone=1`;
};

export const TableCardsModal: React.FC<TableCardsModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getTableUrl = (tableId: number) => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?table=${tableId}`;
    }
    return `https://misterbubble.dz?table=${tableId}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-5xl bg-[#12121b] border border-[#2a2a3c] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] print:max-h-none print:border-0 print:bg-white print:rounded-none print:shadow-none text-white print:text-black">
        
        {/* Header (Hidden when printing) */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#252538] bg-[#171724] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b3231c]/20 border border-[#b3231c]/50 flex items-center justify-center text-[#ffcc33]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bebas text-2xl tracking-wider text-[#ffcc33]">
                {t('tableCards.title')}
              </h3>
              <p className="text-xs text-[#9ca3af]">
                {t('tableCards.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-lg tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t('tableCards.btnPrint')}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#232336] hover:bg-[#31314a] text-[#9ca3af] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Grid of Table Tents */}
        <div className="p-6 overflow-y-auto space-y-8 print:p-2 print:overflow-visible">
          
          <div className="bg-[#191928] p-4 rounded-2xl border border-[#2e2e46] text-xs text-[#cbd5e1] flex items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ffcc33] flex-shrink-0" />
              <span>
                <strong>Print Instruction:</strong> Click the Print button above. Each table tent is styled with front &amp; back panels and dashed fold-lines for tabletop acrylic holders or folded card stock tents.
              </span>
            </div>
          </div>

          {/* Table Cards Grid (2 per row on print, responsive on screen) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
            {CAFE_CONFIG.tables.map((table) => {
              const tableUrl = getTableUrl(table.id);
              const qrSrc = generateSvgQr(tableUrl);

              return (
                <div
                  key={table.id}
                  className="rounded-2xl border-2 border-dashed border-[#ffcc33]/40 bg-[#161622] p-5 print:bg-white print:border-2 print:border-black print:text-black shadow-xl page-break-inside-avoid flex flex-col justify-between"
                  style={{ minHeight: '380px' }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#2d2d42] pb-3 mb-4 print:border-black">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#b3231c] flex items-center justify-center text-[#ffcc33] font-bold text-xs font-bebas">
                        MB
                      </div>
                      <div>
                        <div className="font-bebas text-lg tracking-wider text-white print:text-black">
                          MISTER BUBBLE CAFE
                        </div>
                        <div className="text-[10px] text-[#9ca3af] print:text-gray-600 font-arabic">
                          مقهى السيد فقاعة • صلامندر
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-[#ffcc33] text-[#0f0f14] font-bebas text-lg font-black tracking-wider shadow-sm">
                        {table.label}
                      </span>
                      <span className="block text-[10px] text-[#9ca3af] print:text-gray-600 mt-0.5">
                        {table.zone.toUpperCase()} ZONE • {table.seats} SEATS
                      </span>
                    </div>
                  </div>

                  {/* QR Code & Center Content */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 my-2">
                    {/* QR Code Container */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#ffcc33]/60 print:border-black shadow-inner flex flex-col items-center">
                      <img
                        src={qrSrc}
                        alt={`QR Code for ${table.label}`}
                        className="w-36 h-36 object-contain"
                      />
                      <span className="text-[9px] font-mono font-bold text-[#8c1c1c] mt-1 tracking-wider uppercase">
                        TABLE #{table.id} • DINE-IN
                      </span>
                    </div>

                    {/* Scan Instructions */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="font-bebas text-2xl text-[#ffcc33] print:text-[#8c1c1c] tracking-wide leading-tight">
                        SCAN TO ORDER AT THIS TABLE
                      </div>
                      <div className="font-arabic font-bold text-sm text-[#ffcc33] print:text-black">
                        امسح الرمز للطلب مباشرة على هذه الطاولة
                      </div>
                      <p className="text-xs text-[#cbd5e1] print:text-gray-800 leading-relaxed">
                        Open your phone camera to view our official menu, customize your sweetness &amp; boba, and place your order directly.
                      </p>

                      <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-[11px] text-[#ffcc33] print:text-black font-semibold">
                        <span className="flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-[#b3231c]" /> Dine-In
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Dices className="w-3 h-3 text-[#b3231c]" /> 50+ Free Games
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Fold Line */}
                  <div className="pt-3 border-t border-dashed border-[#2d2d42] print:border-black flex items-center justify-between text-[10px] text-[#9ca3af] print:text-gray-600 mt-2">
                    <span>Salamandre, Near Port Tramway Station</span>
                    <span>Free Wi-Fi &amp; Board Games</span>
                    <span>✂ Cut &amp; Fold Tent Line</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
