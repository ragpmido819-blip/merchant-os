import { useState, useEffect } from 'react';
import { Search, X, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { customers, Customer } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Customers() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.city.includes(search)
  );

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
      <div className="relative">
        <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
        <input
          data-testid="input-search-customers"
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search')}
          className={cn('w-full max-w-sm h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.name')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.phone')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.city')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.totalOrders')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.lastOrder')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr
                  key={customer.id}
                  data-testid={`row-customer-${customer.id}`}
                  onClick={() => setSelected(customer)}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {customer.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{customer.phone}</td>
                  <td className="p-4 text-sm text-foreground">{customer.city}</td>
                  <td className="p-4 text-sm font-medium text-foreground">{customer.totalOrders}</td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
              <button data-testid="button-close-customer" onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{selected.city}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <ShoppingCart size={16} className="text-primary" />
                  <span className="text-sm text-foreground">
                    {language === 'ar' ? `${selected.totalOrders} طلب` : `${selected.totalOrders} orders`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('customers.lastOrder')}: {selected.lastOrder}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
