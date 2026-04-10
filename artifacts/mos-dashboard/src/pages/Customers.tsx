import { useState, useEffect } from 'react';
import { Search, X, Phone, MapPin, ShoppingCart, Star, RotateCcw, Ban, MessageCircle, Plus, TrendingUp, ChevronRight, Filter } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { customers, Customer, CustomerSegment, orders, returns } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

// ─── Segment Badge ────────────────────────────────────────────────────────────
const segmentConfig: Record<CustomerSegment, { label: string; labelAr: string; className: string }> = {
  vip: { label: 'VIP', labelAr: 'VIP', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
  new: { label: 'New', labelAr: 'جديد', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' },
  inactive: { label: 'Inactive', labelAr: 'غير نشط', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700' },
  regular: { label: 'Regular', labelAr: 'عادي', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' },
};

function SegmentBadge({ segment, language }: { segment: CustomerSegment; language: 'ar' | 'en' }) {
  const cfg = segmentConfig[segment];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', cfg.className)}>
      {language === 'ar' ? cfg.labelAr : cfg.label}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: string }[]>([]);
  const show = (msg: string, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}
function Toasts({ toasts }: { toasts: { id: string; msg: string; type: string }[] }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={cn('px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2', t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white')}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Customer Profile Drawer ──────────────────────────────────────────────────
function CustomerDrawer({ customer, language, onClose, onGoOrders, onBlockToggle }: {
  customer: Customer;
  language: 'ar' | 'en';
  onClose: () => void;
  onGoOrders: () => void;
  onBlockToggle: () => void;
}) {
  const isRTL = language === 'ar';
  const customerOrders = orders.filter(o => o.customerId === customer.id);
  const customerReturns = returns.filter(r => r.customerId === customer.id);
  const [, navigate] = useLocation();

  return (
    <div className="fixed inset-0 z-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-card border-s border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white', customer.segment === 'vip' ? 'bg-amber-500' : 'bg-primary/80')}>
              {customer.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{customer.name}</p>
                <SegmentBadge segment={customer.segment} language={language} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{customer.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'طلب' : 'Orders'}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-foreground">SAR {(customer.totalSpending / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي' : 'Spending'}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{customer.returnsCount}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'إرجاع' : 'Returns'}</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <Phone size={13} className="text-primary shrink-0" />
              <span className="text-sm text-foreground">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <MapPin size={13} className="text-primary shrink-0" />
              <span className="text-sm text-foreground">{customer.city}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <TrendingUp size={13} className="text-primary shrink-0" />
              <span className="text-xs text-muted-foreground">{language === 'ar' ? 'آخر نشاط:' : 'Last order:'}</span>
              <span className="text-sm text-foreground">{customer.lastOrder}</span>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{language === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}</p>
              <button onClick={onGoOrders} className="text-xs text-primary hover:underline flex items-center gap-1">
                {language === 'ar' ? 'عرض الكل' : 'View all'}
                <ChevronRight size={11} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </div>
            <div className="space-y-2">
              {customerOrders.slice(0, 3).map(o => (
                <div key={o.id} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-primary">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} language={language} />
                    <span className="text-xs font-semibold text-foreground">SAR {o.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {customerOrders.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">{language === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</p>}
            </div>
          </div>

          {/* Returns */}
          {customerReturns.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'المرتجعات' : 'Returns'}</p>
              <div className="space-y-2">
                {customerReturns.slice(0, 2).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.id}</p>
                      <p className="text-xs text-muted-foreground">{language === 'ar' ? r.reason : r.reasonEn}</p>
                    </div>
                    <button
                      onClick={() => { onClose(); navigate('/returns?id=' + r.id); }}
                      className="text-xs text-primary hover:underline"
                    >
                      {language === 'ar' ? 'عرض' : 'View'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{language === 'ar' ? 'إجراءات' : 'Actions'}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                data-testid={`button-create-order-${customer.id}`}
                className="flex items-center gap-1.5 justify-center p-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Plus size={13} />
                {language === 'ar' ? 'إنشاء طلب' : 'Create Order'}
              </button>
              <button
                data-testid={`button-whatsapp-${customer.id}`}
                className="flex items-center gap-1.5 justify-center p-2.5 rounded-lg border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp
              </button>
              <button
                data-testid={`button-block-${customer.id}`}
                onClick={onBlockToggle}
                className={cn(
                  'col-span-2 flex items-center gap-1.5 justify-center p-2.5 rounded-lg text-sm transition-colors',
                  customer.blocked
                    ? 'border border-border text-foreground hover:bg-muted'
                    : 'border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                )}
              >
                <Ban size={13} />
                {customer.blocked ? (language === 'ar' ? 'رفع الحظر' : 'Unblock') : (language === 'ar' ? 'حظر العميل' : 'Block Customer')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Customers Page ──────────────────────────────────────────────────────
export default function Customers() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | 'all'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [customerList, setCustomerList] = useState<Customer[]>(customers);
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const cities = ['all', ...Array.from(new Set(customers.map(c => c.city)))];

  const filtered = customerList.filter(c => {
    const matchSearch = c.name.includes(search) || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.city.includes(search);
    const matchSegment = segmentFilter === 'all' || c.segment === segmentFilter;
    const matchCity = cityFilter === 'all' || c.city === cityFilter;
    return matchSearch && matchSegment && matchCity;
  });

  function toggleBlock(id: string) {
    setCustomerList(prev => prev.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c));
    const customer = customerList.find(c => c.id === id);
    if (customer) {
      show(customer.blocked
        ? (language === 'ar' ? 'تم رفع الحظر عن العميل' : 'Customer unblocked')
        : (language === 'ar' ? 'تم حظر العميل' : 'Customer blocked'),
        customer.blocked ? 'success' : 'error'
      );
      setSelected(prev => prev?.id === id ? { ...prev, blocked: !prev.blocked } : prev);
    }
  }

  const segments: Array<CustomerSegment | 'all'> = ['all', 'vip', 'new', 'inactive', 'regular'];
  const segmentLabels: Record<string, { ar: string; en: string }> = {
    all: { ar: 'الكل', en: 'All' }, vip: { ar: 'VIP', en: 'VIP' },
    new: { ar: 'جديد', en: 'New' }, inactive: { ar: 'غير نشط', en: 'Inactive' }, regular: { ar: 'عادي', en: 'Regular' },
  };

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
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <input
            data-testid="input-search-customers"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className={cn('w-full h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground shrink-0" />
          <select
            data-testid="select-filter-segment"
            value={segmentFilter}
            onChange={e => setSegmentFilter(e.target.value as CustomerSegment | 'all')}
            className="h-9 px-3 bg-card border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            {segments.map(s => <option key={s} value={s}>{segmentLabels[s][language]}</option>)}
          </select>
          <select
            data-testid="select-filter-city"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="h-9 px-3 bg-card border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            {cities.map(c => <option key={c} value={c}>{c === 'all' ? (language === 'ar' ? 'كل المدن' : 'All Cities') : c}</option>)}
          </select>
        </div>
      </div>

      {/* Segment Quick Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {segments.map(s => (
          <button
            key={s}
            onClick={() => setSegmentFilter(s)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              segmentFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
            )}
          >
            {segmentLabels[s][language]}
            {s !== 'all' && (
              <span className="ms-1 opacity-60">{customerList.filter(c => c.segment === s).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.name')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.phone')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell', isRTL ? 'text-right' : 'text-left')}>{t('customers.city')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.totalOrders')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden md:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الإنفاق' : 'Spending'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4 hidden md:table-cell', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'الإرجاع' : 'Returns'}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{language === 'ar' ? 'التصنيف' : 'Segment'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr
                  key={customer.id}
                  data-testid={`row-customer-${customer.id}`}
                  onClick={() => setSelected(customer)}
                  className={cn('border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer', customer.blocked && 'opacity-50')}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0', customer.segment === 'vip' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-primary/10 text-primary')}>
                        {customer.segment === 'vip' ? <Star size={14} /> : customer.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{customer.name}</p>
                          {customer.blocked && <span className="text-xs text-red-500">{language === 'ar' ? 'محظور' : 'Blocked'}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{customer.phone}</td>
                  <td className="p-4 text-sm text-foreground hidden sm:table-cell">{customer.city}</td>
                  <td className="p-4 text-sm font-medium text-foreground">{customer.totalOrders}</td>
                  <td className="p-4 text-sm font-semibold text-foreground hidden md:table-cell">SAR {customer.totalSpending.toLocaleString()}</td>
                  <td className="p-4 text-sm text-foreground hidden md:table-cell">
                    <span className={cn('font-medium', customer.returnsCount > 2 ? 'text-red-500' : 'text-muted-foreground')}>{customer.returnsCount}</span>
                  </td>
                  <td className="p-4">
                    <SegmentBadge segment={customer.segment} language={language} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">{language === 'ar' ? `${filtered.length} عميل` : `${filtered.length} customers`}</p>
        </div>
      </div>

      {selected && (
        <CustomerDrawer
          customer={selected}
          language={language}
          onClose={() => setSelected(null)}
          onGoOrders={() => { setSelected(null); navigate('/orders'); }}
          onBlockToggle={() => toggleBlock(selected.id)}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
