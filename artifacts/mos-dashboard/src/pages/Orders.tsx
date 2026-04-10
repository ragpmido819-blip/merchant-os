import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { orders, OrderStatus } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export default function Orders() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
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
        {/* Filter */}
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
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-sm font-medium text-primary">{order.id}</td>
                  <td className="p-4 text-sm text-foreground">{order.customer}</td>
                  <td className="p-4"><StatusBadge status={order.status} language={language} /></td>
                  <td className="p-4 text-sm text-foreground font-medium">SAR {order.price.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-muted-foreground text-sm">
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
    </div>
  );
}
