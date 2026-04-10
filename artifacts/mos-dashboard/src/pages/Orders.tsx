import { useState, useEffect } from 'react';
import { Search, Filter, X, Package, MapPin, CreditCard, ExternalLink, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { orders, Order, OrderStatus } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

// ─── Order Timeline ────────────────────────────────────────────────────────────
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
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                    done ? 'bg-primary border-primary' : active ? 'bg-primary/20 border-primary' : 'bg-muted border-border'
                  )}>
                    {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={cn('text-[10px] mt-0.5 whitespace-nowrap', active ? 'text-primary font-semibold' : done ? 'text-muted-foreground' : 'text-muted-foreground/50')}>
                    {language === 'ar' ? step.labelAr : step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className={cn('flex-1 h-0.5 mb-3 mx-1 transition-colors', done ? 'bg-primary' : 'bg-border')} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Order Detail Drawer ────────────────────────────────────────────────────────
function OrderDrawer({ order, language, onClose, onGoCustomer, onGoShipment, onGoReturn }: {
  order: Order;
  language: 'ar' | 'en';
  onClose: () => void;
  onGoCustomer: (id: string) => void;
  onGoShipment: (id: string) => void;
  onGoReturn: (id: string) => void;
}) {
  const isRTL = language === 'ar';
  return (
    <div className="fixed inset-0 z-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className={cn('w-full max-w-md bg-card border-s border-border flex flex-col shadow-2xl', isRTL ? 'border-e-0 border-s' : 'border-s')}>
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm font-bold text-primary">{order.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
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

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'المنتجات' : 'Products'}</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package size={12} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{language === 'ar' ? item.name : item.nameEn}</p>
                      <p className="text-xs text-muted-foreground">{language === 'ar' ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">SAR {(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span className="text-base font-bold text-primary">SAR {order.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'العنوان' : 'Address'}</p>
            <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{order.address}</p>
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'طريقة الدفع' : 'Payment'}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <CreditCard size={14} className="text-primary shrink-0" />
              <p className="text-sm text-foreground">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'روابط' : 'Links'}</p>
            <div className="space-y-2">
              <button
                onClick={() => onGoCustomer(order.customerId)}
                className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
              >
                <span className="text-sm text-foreground">{language === 'ar' ? 'عرض العميل' : 'View Customer'}</span>
                <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary transition-colors', isRTL ? 'rotate-180' : '')} />
              </button>
              {order.shipmentId && (
                <button
                  onClick={() => onGoShipment(order.shipmentId!)}
                  className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-foreground">{language === 'ar' ? 'عرض الشحنة' : 'View Shipment'}</span>
                  <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary transition-colors', isRTL ? 'rotate-180' : '')} />
                </button>
              )}
              {order.returnId && (
                <button
                  onClick={() => onGoReturn(order.returnId!)}
                  className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-foreground">{language === 'ar' ? 'عرض الإرجاع' : 'View Return'}</span>
                  <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary transition-colors', isRTL ? 'rotate-180' : '')} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Orders Page ────────────────────────────────────────────────────────────
export default function Orders() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.includes(search) || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <input
            data-testid="input-search-orders"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className={cn('w-full h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
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
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.id')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.customer')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden md:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'المسار' : 'Timeline'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.status')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.price')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.date')}</th>
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
                  <td className="p-4 text-sm font-medium text-primary">{order.id}</td>
                  <td className="p-4 text-sm text-foreground">{order.customer}</td>
                  <td className="p-4 hidden md:table-cell" style={{ minWidth: 200 }}>
                    <OrderTimeline status={order.status} language={language} />
                  </td>
                  <td className="p-4"><StatusBadge status={order.status} language={language} /></td>
                  <td className="p-4 text-sm text-foreground font-medium">SAR {order.price.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-muted-foreground text-sm">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? `${filtered.length} طلب` : `${filtered.length} orders`}
          </p>
        </div>
      </div>

      {selected && (
        <OrderDrawer
          order={selected}
          language={language}
          onClose={() => setSelected(null)}
          onGoCustomer={id => { setSelected(null); navigate('/customers?id=' + id); }}
          onGoShipment={id => { setSelected(null); navigate('/shipping?id=' + id); }}
          onGoReturn={id => { setSelected(null); navigate('/returns?id=' + id); }}
        />
      )}
    </div>
  );
}
