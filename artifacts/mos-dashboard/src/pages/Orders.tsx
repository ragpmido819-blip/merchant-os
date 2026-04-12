import { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, X, Package, MapPin, CreditCard, ChevronRight,
  Check, Truck, Ban, Phone, MessageCircle, Printer, Download,
  Copy, ExternalLink, AlertTriangle, FileText, StickyNote, Zap,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { orders as initialOrders, Order, OrderStatus, products } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: string; msg: string; type: ToastType }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (msg: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  return { toasts, show };
}

function Toasts({ toasts }: { toasts: Toast[] }) {
  const colors: Record<ToastType, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-primary text-primary-foreground',
    warning: 'bg-amber-500 text-white',
  };
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none min-w-[260px]">
      {toasts.map(t => (
        <div key={t.id} className={cn('px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-in slide-in-from-bottom-2', colors[t.type])}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Order Timeline (existing, unchanged) ────────────────────────────────────
const timelineSteps: Array<{ key: OrderStatus; label: string; labelAr: string }> = [
  { key: 'new', label: 'Created', labelAr: 'تم الإنشاء' },
  { key: 'confirmed', label: 'Confirmed', labelAr: 'مؤكد' },
  { key: 'shipped', label: 'Shipped', labelAr: 'مشحون' },
  { key: 'delivered', label: 'Delivered', labelAr: 'تم التوصيل' },
];
const stepIndex: Record<string, number> = { new: 0, confirmed: 1, shipped: 2, delivered: 3, cancelled: -1 };

function OrderTimeline({ status, language }: { status: OrderStatus; language: 'ar' | 'en' }) {
  const current = stepIndex[status] ?? -1;
  const cancelled = status === 'cancelled';
  return (
    <div className="w-full">
      {cancelled ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{language === 'ar' ? 'ملغى' : 'Cancelled'}</span>
        </div>
      ) : (
        <div className="flex items-center gap-0">
          {timelineSteps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            const isLast = i === timelineSteps.length - 1;
            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors', done ? 'bg-primary border-primary' : active ? 'bg-primary/20 border-primary' : 'bg-muted border-border')}>
                    {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={cn('text-[10px] mt-0.5 whitespace-nowrap', active ? 'text-primary font-semibold' : done ? 'text-muted-foreground' : 'text-muted-foreground/50')}>
                    {language === 'ar' ? step.labelAr : step.label}
                  </span>
                </div>
                {!isLast && <div className={cn('flex-1 h-0.5 mb-3 mx-1 transition-colors', done ? 'bg-primary' : 'bg-border')} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Payment Status Badge ────────────────────────────────────────────────────
function PaymentBadge({ status, language }: { status: 'paid' | 'unpaid'; language: 'ar' | 'en' }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
      {status === 'paid' ? (language === 'ar' ? 'مدفوع' : 'Paid') : (language === 'ar' ? 'غير مدفوع' : 'Unpaid')}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority, language }: { priority: 'normal' | 'urgent'; language: 'ar' | 'en' }) {
  if (priority === 'normal') return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <Zap size={10} />
      {language === 'ar' ? 'عاجل' : 'Urgent'}
    </span>
  );
}

// ─── Shipping Method Label ────────────────────────────────────────────────────
const shippingLabels: Record<string, { ar: string; en: string }> = {
  standard: { ar: 'عادي', en: 'Standard' },
  express: { ar: 'سريع', en: 'Express' },
  sameday: { ar: 'نفس اليوم', en: 'Same Day' },
};

// ─── Product color map (reuse from products data) ────────────────────────────
const productColorMap: Record<string, string> = {
  P001: 'from-blue-400 to-blue-600',
  P002: 'from-amber-700 to-amber-900',
  P003: 'from-gray-700 to-gray-900',
  P004: 'from-pink-400 to-rose-600',
  P005: 'from-purple-500 to-indigo-700',
  P006: 'from-emerald-500 to-teal-700',
  P007: 'from-blue-600 to-blue-900',
  P008: 'from-orange-300 to-orange-500',
  P009: 'from-slate-500 to-slate-700',
  P010: 'from-amber-800 to-amber-950',
  P011: 'from-red-500 to-red-700',
  P012: 'from-stone-400 to-stone-600',
};

// ─── Status Stepper (in drawer) ───────────────────────────────────────────────
const statusFlow: OrderStatus[] = ['new', 'confirmed', 'shipped', 'delivered'];
const statusLabelMap: Record<OrderStatus, { ar: string; en: string }> = {
  new: { ar: 'جديد', en: 'New' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  shipped: { ar: 'مشحون', en: 'Shipped' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغى', en: 'Cancelled' },
};

function StatusStepper({ status, language, onChange }: { status: OrderStatus; language: 'ar' | 'en'; onChange: (s: OrderStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid="button-update-order-status"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm text-foreground w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <StatusBadge status={status} language={language} />
        </div>
        <ChevronDown size={13} className={cn('text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl py-1 overflow-hidden">
          {statusFlow.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-start', s === status && 'text-primary font-semibold bg-primary/5')}
            >
              <StatusBadge status={s} language={language} />
              {s === status && <Check size={12} className="ms-auto text-primary" />}
            </button>
          ))}
          <div className="border-t border-border mx-2 my-1" />
          <button
            onClick={() => { onChange('cancelled'); setOpen(false); }}
            className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors text-start', status === 'cancelled' && 'font-semibold')}
          >
            <Ban size={12} />
            {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
            {status === 'cancelled' && <Check size={12} className="ms-auto" />}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Extended Order Detail Drawer ─────────────────────────────────────────────
function OrderDrawer({ order, language, onClose, onGoCustomer, onGoShipment, onGoReturn, onStatusChange }: {
  order: Order;
  language: 'ar' | 'en';
  onClose: () => void;
  onGoCustomer: (id: string) => void;
  onGoShipment: (id: string) => void;
  onGoReturn: (id: string) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const isRTL = language === 'ar';
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [itemQtys, setItemQtys] = useState<Record<string, number>>(
    Object.fromEntries(order.items.map(i => [i.productId, i.qty]))
  );
  const { toasts, show } = useToast();

  function copyAddress() {
    navigator.clipboard.writeText(order.address).then(() => show(language === 'ar' ? 'تم نسخ العنوان' : 'Address copied'));
  }

  function openMaps() {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(order.address + '، ' + order.city)}`, '_blank');
  }

  function whatsApp() {
    const phone = order.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  }

  function printInvoice() {
    show(language === 'ar' ? 'جاري طباعة الفاتورة...' : 'Printing invoice...', 'info');
  }

  function downloadPDF() {
    show(language === 'ar' ? 'جاري تحميل PDF...' : 'Downloading PDF...', 'info');
  }

  function saveNote() {
    setSavedNote(note);
    show(language === 'ar' ? 'تم حفظ الملاحظة' : 'Note saved');
  }

  function updateQty(productId: string, delta: number) {
    setItemQtys(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] ?? 1) + delta) }));
  }

  return (
    <div className="fixed inset-0 z-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-card border-s border-border flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-primary">{order.id}</p>
              {order.priority === 'urgent' && <PriorityBadge priority="urgent" language={language} />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.customer}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Timeline */}
          <div className="bg-muted/30 rounded-xl p-3">
            <OrderTimeline status={order.status} language={language} />
          </div>

          {/* Status Control */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'تحديث الحالة' : 'Update Status'}</p>
            <StatusStepper status={order.status} language={language} onChange={s => onStatusChange(order.id, s)} />
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              data-testid="button-drawer-print"
              onClick={printInvoice}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Printer size={15} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{language === 'ar' ? 'طباعة' : 'Print'}</span>
            </button>
            <button
              data-testid="button-drawer-pdf"
              onClick={downloadPDF}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Download size={15} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">PDF</span>
            </button>
            <button
              data-testid="button-drawer-whatsapp"
              onClick={whatsApp}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
            >
              <MessageCircle size={15} className="text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-700 dark:text-green-400">WhatsApp</span>
            </button>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'المنتجات' : 'Products'}</p>
            <div className="space-y-2">
              {order.items.map(item => {
                const gradColor = productColorMap[item.productId] || 'from-primary/50 to-primary';
                const qty = itemQtys[item.productId] ?? item.qty;
                return (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center', gradColor)}>
                      <Package size={13} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-tight">{language === 'ar' ? item.name : item.nameEn}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-5 h-5 rounded bg-muted hover:bg-border flex items-center justify-center text-xs font-bold">−</button>
                      <span className="text-sm font-semibold text-foreground w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-5 h-5 rounded bg-muted hover:bg-border flex items-center justify-center text-xs font-bold">+</button>
                    </div>
                    <p className="text-sm font-semibold text-foreground shrink-0">SAR {(item.price * qty).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span className="text-base font-bold text-primary">SAR {order.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'العنوان' : 'Address'}</p>
            <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg mb-2">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground flex-1">{order.address}</p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-address"
                onClick={copyAddress}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Copy size={12} />
                {language === 'ar' ? 'نسخ العنوان' : 'Copy Address'}
              </button>
              <button
                data-testid="button-open-maps"
                onClick={openMaps}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ExternalLink size={12} />
                {language === 'ar' ? 'فتح في الخريطة' : 'Open in Maps'}
              </button>
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'الدفع' : 'Payment'}</p>
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <CreditCard size={14} className="text-primary shrink-0" />
              <p className="text-sm text-foreground flex-1">{order.paymentMethod}</p>
              <PaymentBadge status={order.paymentStatus} language={language} />
            </div>
          </div>

          {/* Shipping Method */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'طريقة الشحن' : 'Shipping'}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <Truck size={14} className="text-primary shrink-0" />
              <p className="text-sm text-foreground">{shippingLabels[order.shippingMethod]?.[language] ?? order.shippingMethod}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</p>
            <div className="space-y-2">
              <button
                data-testid="button-drawer-go-customer"
                onClick={() => onGoCustomer(order.customerId)}
                className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
              >
                <span className="text-sm text-foreground">{language === 'ar' ? 'عرض العميل' : 'View Customer'}</span>
                <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary', isRTL ? 'rotate-180' : '')} />
              </button>
              {order.shipmentId && (
                <button
                  data-testid="button-drawer-go-shipment"
                  onClick={() => onGoShipment(order.shipmentId!)}
                  className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-foreground">{language === 'ar' ? 'تتبع الشحنة' : 'Track Shipment'}</span>
                  <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary', isRTL ? 'rotate-180' : '')} />
                </button>
              )}
              {order.returnId && (
                <button
                  data-testid="button-drawer-go-return"
                  onClick={() => onGoReturn(order.returnId!)}
                  className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-foreground">{language === 'ar' ? 'عرض الإرجاع' : 'Returns'}</span>
                  <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary', isRTL ? 'rotate-180' : '')} />
                </button>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StickyNote size={13} className="text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{language === 'ar' ? 'ملاحظات داخلية' : 'Admin Notes'}</p>
            </div>
            {savedNote && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg mb-2">
                <p className="text-sm text-amber-800 dark:text-amber-300">{savedNote}</p>
              </div>
            )}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={language === 'ar' ? 'أضف ملاحظة للفريق...' : 'Add a note for the team...'}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <button
              data-testid="button-save-note"
              onClick={saveNote}
              disabled={!note.trim()}
              className="mt-2 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {language === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
      <Toasts toasts={toasts} />
    </div>
  );
}

// ─── Main Orders Page ─────────────────────────────────────────────────────────
export default function Orders() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterShipping, setFilterShipping] = useState<'all' | 'standard' | 'express' | 'sameday'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      show(language === 'ar' ? '🔔 طلب جديد وارد: #ORD-1016' : '🔔 New order received: #ORD-1016', 'info');
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrderList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    const msgs: Record<OrderStatus, { ar: string; en: string }> = {
      new: { ar: 'تم تعيين الطلب كجديد', en: 'Order set to New' },
      confirmed: { ar: 'تم تأكيد الطلب', en: 'Order confirmed' },
      shipped: { ar: 'تم تأكيد الشحن', en: 'Order marked as Shipped' },
      delivered: { ar: 'تم تسليم الطلب', en: 'Order delivered' },
      cancelled: { ar: 'تم إلغاء الطلب', en: 'Order cancelled' },
    };
    show(msgs[status][language], status === 'cancelled' ? 'error' : 'success');
  }

  function quickConfirm(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    updateOrderStatus(id, 'confirmed');
  }
  function quickShip(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    updateOrderStatus(id, 'shipped');
  }
  function quickCancel(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    updateOrderStatus(id, 'cancelled');
  }

  const filtered = orderList.filter(o => {
    const matchSearch =
      o.customer.includes(search) ||
      o.id.includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchPayment = filterPayment === 'all' || o.paymentStatus === filterPayment;
    const matchShipping = filterShipping === 'all' || o.shippingMethod === filterShipping;
    const matchDateFrom = !dateFrom || o.date >= dateFrom;
    const matchDateTo = !dateTo || o.date <= dateTo;
    const matchPriceMin = !priceMin || o.price >= Number(priceMin);
    const matchPriceMax = !priceMax || o.price <= Number(priceMax);
    return matchSearch && matchStatus && matchPayment && matchShipping && matchDateFrom && matchDateTo && matchPriceMin && matchPriceMax;
  });

  const statuses: Array<OrderStatus | 'all'> = ['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-xl animate-pulse">
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Search + Status + Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <input
            data-testid="input-search-orders"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم أو رقم الطلب أو الجوال' : 'Search by name, order ID, or phone'}
            className={cn('w-full h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground shrink-0" />
          <select
            data-testid="select-filter-status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="h-9 px-3 bg-card border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
            {statuses.slice(1).map(s => (
              <option key={s} value={s}>{t(('status.' + s) as Parameters<typeof t>[0])}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={cn('h-9 px-3 rounded-lg border text-sm font-medium transition-colors', showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground')}
          >
            {language === 'ar' ? 'فلاتر' : 'Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'حالة الدفع' : 'Payment'}</label>
            <select value={filterPayment} onChange={e => setFilterPayment(e.target.value as typeof filterPayment)} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="paid">{language === 'ar' ? 'مدفوع' : 'Paid'}</option>
              <option value="unpaid">{language === 'ar' ? 'غير مدفوع' : 'Unpaid'}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'طريقة الشحن' : 'Shipping'}</label>
            <select value={filterShipping} onChange={e => setFilterShipping(e.target.value as typeof filterShipping)} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="standard">{language === 'ar' ? 'عادي' : 'Standard'}</option>
              <option value="express">{language === 'ar' ? 'سريع' : 'Express'}</option>
              <option value="sameday">{language === 'ar' ? 'نفس اليوم' : 'Same Day'}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'من تاريخ' : 'Date From'}</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'إلى تاريخ' : 'Date To'}</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'السعر من' : 'Min Price'}</label>
            <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0" className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'السعر إلى' : 'Max Price'}</label>
            <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="99999" className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none" />
          </div>
          <div className="col-span-2 md:col-span-3 flex justify-end">
            <button
              onClick={() => { setFilterPayment('all'); setFilterShipping('all'); setDateFrom(''); setDateTo(''); setPriceMin(''); setPriceMax(''); }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset filters'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.id')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.customer')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الجوال' : 'Phone'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden md:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'المسار' : 'Timeline'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.status')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الشحن' : 'Shipping'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الدفع' : 'Payment'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden xl:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الأولوية' : 'Priority'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.price')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.date')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr
                  key={order.id}
                  data-testid={`row-order-${order.id}`}
                  onClick={() => setSelected(order)}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-sm font-medium text-primary whitespace-nowrap">{order.id}</td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground lg:hidden">{order.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell whitespace-nowrap">{order.phone}</td>
                  <td className="p-4 hidden md:table-cell" style={{ minWidth: 200 }}>
                    <OrderTimeline status={order.status} language={language} />
                  </td>
                  <td className="p-4"><StatusBadge status={order.status} language={language} /></td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{shippingLabels[order.shippingMethod]?.[language]}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <PaymentBadge status={order.paymentStatus} language={language} />
                  </td>
                  <td className="p-4 hidden xl:table-cell">
                    <PriorityBadge priority={order.priority} language={language} />
                  </td>
                  <td className="p-4 text-sm text-foreground font-medium whitespace-nowrap">SAR {order.price.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{order.date}</td>
                  <td className="p-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {order.status === 'new' && (
                        <button
                          data-testid={`button-confirm-${order.id}`}
                          onClick={e => quickConfirm(e, order.id)}
                          title={language === 'ar' ? 'تأكيد' : 'Confirm'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-200 transition-colors"
                        >
                          <Check size={11} />
                          {language === 'ar' ? 'تأكيد' : 'Confirm'}
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          data-testid={`button-ship-${order.id}`}
                          onClick={e => quickShip(e, order.id)}
                          title={language === 'ar' ? 'شحن' : 'Ship'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium hover:bg-purple-200 transition-colors"
                        >
                          <Truck size={11} />
                          {language === 'ar' ? 'شحن' : 'Ship'}
                        </button>
                      )}
                      {(order.status === 'new' || order.status === 'confirmed') && (
                        <button
                          data-testid={`button-cancel-${order.id}`}
                          onClick={e => quickCancel(e, order.id)}
                          title={language === 'ar' ? 'إلغاء' : 'Cancel'}
                          className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      )}
                      <button
                        data-testid={`button-view-${order.id}`}
                        onClick={e => { e.stopPropagation(); setSelected(order); }}
                        className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        title={language === 'ar' ? 'عرض' : 'View'}
                      >
                        <FileText size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-10 text-center text-muted-foreground text-sm">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? `${filtered.length} طلب` : `${filtered.length} orders`}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{language === 'ar' ? 'عاجل:' : 'Urgent:'} {filtered.filter(o => o.priority === 'urgent').length}</span>
            <span>{language === 'ar' ? 'غير مدفوع:' : 'Unpaid:'} {filtered.filter(o => o.paymentStatus === 'unpaid').length}</span>
          </div>
        </div>
      </div>

      {selected && (
        <OrderDrawer
          order={orderList.find(o => o.id === selected.id) ?? selected}
          language={language}
          onClose={() => setSelected(null)}
          onGoCustomer={id => { setSelected(null); navigate('/customers?id=' + id); }}
          onGoShipment={id => { setSelected(null); navigate('/shipping?id=' + id); }}
          onGoReturn={id => { setSelected(null); navigate('/returns?id=' + id); }}
          onStatusChange={updateOrderStatus}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
