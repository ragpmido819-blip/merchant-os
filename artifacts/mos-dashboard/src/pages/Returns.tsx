import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { returns, Return, ReturnStatus } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export default function Returns() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [returnsList, setReturnsList] = useState<Return[]>(returns);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  function updateStatus(id: string, status: ReturnStatus) {
    setReturnsList(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

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

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {language === 'ar' ? 'طلبات الإرجاع' : 'Return Requests'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('returns.id')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.id')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.customer')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('returns.reason')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('common.status')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.date')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {returnsList.map(ret => (
                <tr
                  key={ret.id}
                  data-testid={`row-return-${ret.id}`}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-primary">{ret.id}</td>
                  <td className="p-4 text-sm text-foreground">{ret.orderId}</td>
                  <td className="p-4 text-sm text-foreground">{ret.customer}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[160px] truncate">
                    {language === 'ar' ? ret.reason : ret.reasonEn}
                  </td>
                  <td className="p-4"><StatusBadge status={ret.status} language={language} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{ret.date}</td>
                  <td className="p-4">
                    {ret.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          data-testid={`button-approve-${ret.id}`}
                          onClick={() => updateStatus(ret.id, 'approved')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <Check size={12} />
                          {t('returns.approve')}
                        </button>
                        <button
                          data-testid={`button-reject-${ret.id}`}
                          onClick={() => updateStatus(ret.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <X size={12} />
                          {t('returns.reject')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
