import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { shipments, Shipment, ShipmentStatus } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { AlertTriangle, ExternalLink, RefreshCw, X, ChevronDown, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

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

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<ShipmentStatus, { label: string; labelAr: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', labelAr: 'في الانتظار', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: <Clock size={12} /> },
  pickedUp: { label: 'Picked Up', labelAr: 'تم الاستلام', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <PackageCheck size={12} /> },
  inTransit: { label: 'In Transit', labelAr: 'في الطريق', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Truck size={12} /> },
  outForDelivery: { label: 'Out for Delivery', labelAr: 'خرج للتوصيل', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Truck size={12} /> },
  delivered: { label: 'Delivered', labelAr: 'تم التوصيل', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 size={12} /> },
  failed: { label: 'Failed', labelAr: 'فشل', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle size={12} /> },
};

const allStatuses: ShipmentStatus[] = ['pending', 'pickedUp', 'inTransit', 'outForDelivery', 'delivered', 'failed'];

function ShipmentStatusBadge({ status, language }: { status: ShipmentStatus; language: 'ar' | 'en' }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cfg.color)}>
      {cfg.icon}
      {language === 'ar' ? cfg.labelAr : cfg.label}
    </span>
  );
}

// ─── Update Status Popover ────────────────────────────────────────────────────
function UpdateStatusButton({ shipment, language, onUpdate }: {
  shipment: Shipment;
  language: 'ar' | 'en';
  onUpdate: (id: string, status: ShipmentStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        data-testid={`button-update-status-${shipment.id}`}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <RefreshCw size={11} />
        {language === 'ar' ? 'تحديث' : 'Update'}
        <ChevronDown size={11} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full mt-1 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[160px]" style={{ [language === 'ar' ? 'right' : 'left']: 0 }}>
            {allStatuses.map(s => (
              <button
                key={s}
                onClick={e => { e.stopPropagation(); onUpdate(shipment.id, s); setOpen(false); }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-start', s === shipment.status ? 'text-primary font-semibold' : 'text-foreground')}
              >
                {statusConfig[s].icon}
                {language === 'ar' ? statusConfig[s].labelAr : statusConfig[s].label}
                {s === shipment.status && <span className="ms-auto text-primary">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const carrierColors: Record<string, string> = {
  SMSA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Aramex: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  DHL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function Shipping() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [shipmentList, setShipmentList] = useState<Shipment[]>(shipments);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [simulating, setSimulating] = useState<string | null>(null);
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = statusFilter === 'all' ? shipmentList : shipmentList.filter(s => s.status === statusFilter);

  const failed = shipmentList.filter(s => s.status === 'failed');
  const late = shipmentList.filter(s => s.status === 'inTransit' && s.estimatedDelivery < new Date().toISOString().split('T')[0]);

  function updateStatus(id: string, status: ShipmentStatus) {
    setShipmentList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    show(language === 'ar' ? 'تم تحديث حالة الشحنة' : 'Shipment status updated');
  }

  function simulateUpdate(id: string) {
    setSimulating(id);
    setTimeout(() => {
      setShipmentList(prev => prev.map(s => {
        if (s.id !== id) return s;
        const nextMap: Record<ShipmentStatus, ShipmentStatus> = {
          pending: 'pickedUp', pickedUp: 'inTransit', inTransit: 'outForDelivery',
          outForDelivery: 'delivered', delivered: 'delivered', failed: 'pending',
        };
        return { ...s, status: nextMap[s.status] };
      }));
      setSimulating(null);
      show(language === 'ar' ? 'تحديث تلقائي من شركة الشحن' : 'Auto-updated from carrier API');
    }, 1500);
  }

  function cancelShipment(id: string) {
    setShipmentList(prev => prev.map(s => s.id === id ? { ...s, status: 'failed' } : s));
    show(language === 'ar' ? 'تم إلغاء الشحنة' : 'Shipment cancelled', 'error');
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
    <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Alert banners */}
      {failed.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
          <XCircle size={16} className="text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {language === 'ar' ? `${failed.length} شحنة فشلت في التوصيل — يرجى المراجعة` : `${failed.length} failed deliveries — review required`}
          </p>
        </div>
      )}
      {late.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            {language === 'ar' ? `${late.length} شحنة متأخرة عن موعد التسليم` : `${late.length} shipment(s) past estimated delivery`}
          </p>
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-colors', statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary')}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({shipmentList.length})
        </button>
        {allStatuses.map(s => {
          const count = shipmentList.filter(sh => sh.status === s).length;
          if (!count) return null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-colors', statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary')}
            >
              {language === 'ar' ? statusConfig[s].labelAr : statusConfig[s].label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{language === 'ar' ? 'الشحنات' : 'Shipments'}</h3>
          <span className="text-xs text-muted-foreground">{filtered.length} {language === 'ar' ? 'شحنة' : 'shipments'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  language === 'ar' ? 'رقم التتبع' : 'Tracking',
                  language === 'ar' ? 'العميل' : 'Customer',
                  language === 'ar' ? 'الناقل' : 'Carrier',
                  language === 'ar' ? 'الحالة' : 'Status',
                  language === 'ar' ? 'المدينة' : 'City',
                  language === 'ar' ? 'تاريخ الشحن' : 'Ship Date',
                  language === 'ar' ? 'التسليم المتوقع' : 'Est. Delivery',
                  language === 'ar' ? 'التكلفة' : 'Cost',
                  language === 'ar' ? 'الإجراءات' : 'Actions',
                ].map(h => (
                  <th key={h} className={cn('text-xs font-medium text-muted-foreground p-4 whitespace-nowrap', isRTL ? 'text-right' : 'text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(shipment => {
                const isLate = shipment.status === 'inTransit' && shipment.estimatedDelivery < new Date().toISOString().split('T')[0];
                return (
                  <tr
                    key={shipment.id}
                    data-testid={`row-shipment-${shipment.id}`}
                    className={cn('border-b border-border last:border-0 hover:bg-muted/40 transition-colors', isLate && 'bg-amber-50/30 dark:bg-amber-950/10')}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono text-primary">{shipment.tracking}</span>
                        {isLate && <AlertTriangle size={12} className="text-amber-500" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{shipment.customer}</td>
                    <td className="p-4">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', carrierColors[shipment.carrier] || 'bg-muted text-foreground')}>
                        {shipment.carrier}
                      </span>
                    </td>
                    <td className="p-4"><ShipmentStatusBadge status={shipment.status} language={language} /></td>
                    <td className="p-4 text-sm text-foreground">{shipment.city}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{shipment.date}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{shipment.estimatedDelivery}</td>
                    <td className="p-4 text-sm font-medium text-foreground">SAR {shipment.cost}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        <UpdateStatusButton shipment={shipment} language={language} onUpdate={updateStatus} />
                        <button
                          data-testid={`button-track-${shipment.id}`}
                          title={language === 'ar' ? 'تتبع' : 'Track'}
                          onClick={() => show(language === 'ar' ? 'فتح رابط التتبع...' : 'Opening tracking link...')}
                          className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          data-testid={`button-simulate-${shipment.id}`}
                          title={language === 'ar' ? 'تحديث API' : 'Simulate API'}
                          onClick={() => simulateUpdate(shipment.id)}
                          disabled={simulating === shipment.id}
                          className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors disabled:opacity-40"
                        >
                          <RefreshCw size={13} className={simulating === shipment.id ? 'animate-spin' : ''} />
                        </button>
                        {shipment.status !== 'delivered' && shipment.status !== 'failed' && (
                          <button
                            data-testid={`button-cancel-${shipment.id}`}
                            title={language === 'ar' ? 'إلغاء' : 'Cancel'}
                            onClick={() => cancelShipment(shipment.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                        <button
                          data-testid={`button-go-order-${shipment.id}`}
                          title={language === 'ar' ? 'الطلب' : 'Order'}
                          onClick={() => navigate('/orders')}
                          className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors text-xs font-medium"
                        >
                          {shipment.orderId}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Toasts toasts={toasts} />
    </div>
  );
}
