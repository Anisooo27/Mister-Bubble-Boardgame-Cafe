import React, { useEffect, useState, useRef } from 'react';
import { OrderDetails } from '../types';
import { Logo } from './Logo';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { useLanguage } from '../context/LanguageContext';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  QrCode,
  CheckCircle,
  Clock,
  MapPin,
  Utensils,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  Sparkles,
  Phone,
  Car,
  Bike,
  Send,
  MessageCircle,
  Hourglass
} from 'lucide-react';

interface InvoiceModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTracker?: (orderId: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenTracker,
}) => {
  const { t, isRTL, language } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (order) {
      const qrPayload = JSON.stringify({
        ref: order.orderId,
        customer: order.customerName,
        phone: order.customerPhone,
        type: order.orderType,
        table: order.tableNumber || null,
        total: `${order.total} DZD`,
        time: order.timestamp,
        items: order.items.map((i) => `${i.quantity}x ${i.item.name} (${i.calculatedPrice * i.quantity} DZD)`),
      });

      QRCode.toDataURL(qrPayload, {
        width: 260,
        margin: 1,
        color: {
          dark: '#0d0d12',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR Code', err));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error('Print failed', err);
    }
  };

  // Estimate wait time based on item count
  const totalItemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);
  const estimatedMins = totalItemCount > 4 ? '15–20' : '10–15';

  const generateWhatsAppUrl = () => {
    const itemsText = order.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.item.name} ${it.size ? `(${it.size})` : ''} — ${it.calculatedPrice * it.quantity} DZD`
      )
      .join('\n');

    let serviceInfo = `Service: ${order.orderType.toUpperCase()}`;
    if (order.tableNumber) serviceInfo += ` | Table: ${order.tableNumber}`;
    if (order.pickupTime) serviceInfo += ` | Pickup: ${order.pickupTime}`;
    if (order.deliveryAddress) serviceInfo += ` | Address: ${order.deliveryAddress}`;

    const text = `🧋 *MISTER BUBBLE CAFE — NEW ORDER* 🧋\n\n*Ref:* ${order.orderId}\n*Customer:* ${order.customerName} (${order.customerPhone})\n*${serviceInfo}*\n\n*Items Ordered:*\n${itemsText}\n\n*Total Payable:* *${order.total} DZD*\n${order.specialNotes ? `*Special Notes:* ${order.specialNotes}\n` : ''}\n📍 *Mister Bubble Boardgame Cafe — Salamandre, Mostaganem*`;

    return `https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  // Direct download receipt text & summary file
  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    try {
      const receiptContent = `===========================================
    MISTER BUBBLE BOARDGAME CAFE (السيد فقاعة)
    Salamandre, Mostaganem, Algeria
    WhatsApp: +213 550 00 00 00 | Instagram: @misterbubble.dz
===========================================
ORDER RECEIPT / DIGITAL FACTURE
Order Ref: ${order.orderId}
Date & Time: ${order.timestamp}
Customer: ${order.customerName} (${order.customerPhone})
Service Type: ${order.orderType.toUpperCase()} ${order.tableNumber ? `(Table #${order.tableNumber})` : ''}
Estimated Ready Time: ~${estimatedMins} minutes

-------------------------------------------
ITEMIZED DETAILS:
${order.items
  .map(
    (it) =>
      `• ${it.quantity}x ${it.item.name} ${it.size ? `[${it.size}]` : ''} - ${it.calculatedPrice * it.quantity} DZD (${it.calculatedPrice} DZD ea)`
  )
  .join('\n')}

-------------------------------------------
Subtotal: ${order.subtotal} DZD
Board Game Access: FREE (Dine-In)
TOTAL PAYABLE: ${order.total} DZD
Payment Mode: Pay In-Café / Upon Delivery
${order.specialNotes ? `\nSpecial Notes: ${order.specialNotes}` : ''}
===========================================
Thank you for visiting Mister Bubble Mostaganem!
Sip. Play. Delight.
===========================================`;

      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MisterBubble-Facture-${order.orderId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download receipt failed', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full bg-[#12121b] border-2 border-[#ffcc33]/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen ? 'max-w-4xl h-[95vh]' : 'max-w-2xl max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="p-4 bg-[#181826] border-b border-[#29293e] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bebas text-lg text-[#ffcc33] tracking-wide">
              {t('facture.present')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-lg bg-[#222234] hover:bg-[#2e2e46] text-[#9ca3af] hover:text-white transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Counter Presentation Mode'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#222234] hover:bg-[#2e2e46] text-[#9ca3af] hover:text-[#ffcc33] transition-colors"
              title="Print Facture / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#222234] hover:bg-[#2e2e46] text-[#9ca3af] hover:text-white transition-colors"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estimated Ready Time Banner (Part D.6) */}
        <div className="bg-gradient-to-r from-[#1f192b] via-[#2a1c2e] to-[#1f192b] px-6 py-2.5 border-b border-[#ffcc33]/20 flex items-center justify-between text-xs print:hidden">
          <div className="flex items-center gap-2 text-[#ffcc33]">
            <Hourglass className="w-4 h-4 animate-spin-slow text-[#ffcc33]" />
            <span className="font-bold">
              {language === 'ar'
                ? `الوقت المقدر للتجهيز: ~${estimatedMins} دقيقة`
                : language === 'fr'
                ? `Temps de préparation estimé : ~${estimatedMins} min`
                : `Estimated Prep Time: ~${estimatedMins} min`}
            </span>
          </div>
          {onOpenTracker && (
            <button
              onClick={() => onOpenTracker(order.orderId)}
              className="px-3 py-1 rounded-lg bg-[#3b2d4f] hover:bg-[#4d3b66] text-[#ffcc33] text-[11px] font-bold transition-colors"
            >
              {language === 'ar' ? 'تتبع الطلب مباشرة' : language === 'fr' ? 'Suivre la commande' : 'Track Live'}
            </button>
          )}
        </div>

        {/* Invoice Printable Sheet */}
        <div
          id="printable-facture"
          className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-[#14141e] to-[#0f0f18] text-[#f3f4f6] space-y-6"
        >
          {/* Header with Logo & Brand */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#28283e] text-center sm:text-left">
            <div>
              <Logo size="md" showArabic={true} />
              <p className="text-xs text-[#9ca3af] mt-2">
                Salamandre, Near Tramway Port Station, Mostaganem
              </p>
              <p className="text-xs text-[#ffcc33]">
                Instagram: {CAFE_CONFIG.instagramHandle} &bull; Rating: {CAFE_CONFIG.rating}★
              </p>
            </div>

            <div className="sm:text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/40 inline-block mb-1">
                {t('facture.title')}
              </span>
              <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-end gap-1.5 mt-1">
                <span>{order.orderId}</span>
                <button
                  onClick={handleCopyReference}
                  className="text-[#9ca3af] hover:text-[#ffcc33]"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">{order.timestamp}</p>
            </div>
          </div>

          {/* Customer & Service Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#1a1a27] border border-[#27273a] text-xs">
            <div>
              <span className="text-[#9ca3af] block text-[10px] uppercase font-bold">Customer Name</span>
              <span className="font-bold text-white text-sm">{order.customerName}</span>
              <div className="text-[#9ca3af] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#ffcc33]" />
                <span>{order.customerPhone}</span>
              </div>
            </div>

            <div>
              <span className="text-[#9ca3af] block text-[10px] uppercase font-bold">Service Type</span>
              <div className="font-bold text-[#ffcc33] text-sm flex items-center gap-1 mt-0.5">
                {order.orderType === 'dine-in' && <Utensils className="w-3.5 h-3.5" />}
                {order.orderType === 'pickup' && <Car className="w-3.5 h-3.5" />}
                {order.orderType === 'delivery' && <Bike className="w-3.5 h-3.5" />}
                <span className="capitalize">{order.orderType}</span>
              </div>
              <span className="text-[#cbd5e1] text-[11px]">
                {order.tableNumber && `Table: ${order.tableNumber}`}
                {order.pickupTime && `Time: ${order.pickupTime}`}
                {order.deliveryAddress && `Address: ${order.deliveryAddress}`}
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block text-[10px] uppercase font-bold">Payment Mode</span>
              <span className="font-bold text-emerald-400 text-sm">Pay In-Café / On Delivery</span>
              <span className="text-[#cbd5e1] block text-[10px]">Cash / Local Payment</span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="space-y-2">
            <h4 className="font-bebas text-lg text-white tracking-wider">Itemized Order Details</h4>
            <div className="rounded-xl border border-[#252538] overflow-hidden bg-[#161622]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1e1e2d] text-[#9ca3af] uppercase text-[10px] border-b border-[#29293e]">
                  <tr>
                    <th className="py-2.5 px-4">Item &amp; Options</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222234]">
                  {order.items.map((trayItem, idx) => (
                    <tr key={idx} className="hover:bg-[#1a1a28]">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{trayItem.item.name}</div>
                        {trayItem.size && (
                          <span className="text-[10px] text-[#ffcc33] uppercase">
                            Size: {trayItem.size}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-white">
                        {trayItem.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-[#9ca3af]">
                        {trayItem.calculatedPrice} DZD
                      </td>
                      <td className="py-3 px-4 text-right font-bebas text-base text-[#ffcc33]">
                        {trayItem.calculatedPrice * trayItem.quantity} DZD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes if any */}
          {order.specialNotes && (
            <div className="p-3 rounded-xl bg-[#181826] border border-[#28283c] text-xs">
              <span className="text-[#ffcc33] font-bold">Special Requests: </span>
              <span className="text-[#cbd5e1]">{order.specialNotes}</span>
            </div>
          )}

          {/* Summary & QR Verification Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-gradient-to-r from-[#171724] via-[#1c1724] to-[#171724] border-2 border-[#ffcc33]/30">
            {/* QR Code Container */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-[#ffcc33]">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Order QR Code ${order.orderId}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                    Generating QR...
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#ffcc33] uppercase tracking-wider mt-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                {t('facture.scanQr')}
              </span>
            </div>

            {/* Price Total Breakdown */}
            <div className="sm:col-span-7 space-y-3">
              <div className="space-y-1 text-xs text-[#9ca3af]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{order.subtotal} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Board Game Access:</span>
                  <span className="text-emerald-400 font-bold">FREE (Dine-In)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax &amp; Service:</span>
                  <span className="text-white">Included</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d2d42] flex items-baseline justify-between">
                <span className="font-bebas text-xl sm:text-2xl text-white">TOTAL PAYABLE:</span>
                <span className="font-bebas text-3xl sm:text-4xl text-[#ffcc33] text-gold-glow">
                  {order.total} DZD
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#222234] text-[11px] text-[#cbd5e1] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Show this screen or quote your order ID when ordering at the counter.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions with WhatsApp Order & Print / Download Buttons */}
        <div className="p-4 bg-[#181826] border-t border-[#29293e] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* WhatsApp Direct Button */}
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{t('facture.whatsapp')}</span>
            </a>

            {/* Print Button (Invokes window.print with dedicated @media print CSS) */}
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-[#222234] hover:bg-[#2c2c42] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              title="Print receipt cleanly on paper or export to PDF"
            >
              <Printer className="w-4 h-4 text-[#ffcc33]" />
              <span>{t('facture.print')}</span>
            </button>

            {/* Download Receipt Text Summary */}
            <button
              onClick={handleDownloadReceipt}
              className="py-2.5 px-3 rounded-xl bg-[#222234] hover:bg-[#2c2c42] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              title="Download text receipt copy"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isDownloading ? 'Saving...' : 'Download'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#cf2920] hover:to-[#9e1f1f] text-white font-bebas text-lg tracking-wider text-center shadow-lg border border-[#ffcc33]/40 transition-all"
          >
            {t('facture.done')}
          </button>
        </div>
      </div>
    </div>
  );
};
