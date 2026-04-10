import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { shipments } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export default function Shipping() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-xl animate-pulse">
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  const carrierColors: Record<string, string> = {
    SMSA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Aramex: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    DHL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {language === 'ar' ? 'الشحنات' : 'Shipments'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('shipping.tracking')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.customer')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('shipping.carrier')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('common.status')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('customers.city')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.date')}</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (
                <tr
                  key={shipment.id}
                  data-testid={`row-shipment-${shipment.id}`}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-sm font-mono text-primary">{shipment.tracking}</td>
                  <td className="p-4 text-sm text-foreground">{shipment.customer}</td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', carrierColors[shipment.carrier] || 'bg-muted text-foreground')}>
                      {shipment.carrier}
                    </span>
                  </td>
                  <td className="p-4"><StatusBadge status={shipment.status} language={language} /></td>
                  <td className="p-4 text-sm text-foreground">{shipment.city}</td>
                  <td className="p-4 text-sm text-muted-foreground">{shipment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
