import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { returns, Return, ReturnStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Check, X, ChevronRight, Eye, ImagePlus, ArrowRight } from 'lucide-react';
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
const workflowSteps: Array<{ key: ReturnStatus; label: string; labelAr: string }> = [
  { key: 'pending', label: 'Pending', labelAr: 'في الانتظار' },
  { key: 'approved', label: 'Approved', labelAr: 'مقبول' },
  { key: 'pickedUp', label: 'Picked Up', labelAr: 'تم الاستلام' },
  { key: 'inspected', label: 'Inspected', labelAr: 'تم الفحص' },
  { key: 'refunded', label: 'Refunded', labelAr: 'تم الاسترداد' },
];

const statusBadge: Record<ReturnStatus, { label: string; labelAr: string; color: string }> = {
  pending: { label: 'Pending', labelAr: 'في الانتظار', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', labelAr: 'مقبول', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  pickedUp: { label: 'Picked Up', labelAr: 'تم الاستلام', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  inspected: { label: 'Inspected', labelAr: 'تم الفحص', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  refunded: { label: 'Refunded', labelAr: 'تم الاسترداد', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  replaced: { label: 'Replaced', labelAr: 'تم الاستبدال', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  rejected: { label: 'Rejected', labelAr: 'مرفوض', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const inspectionBadge: Record<string, { label: string; labelAr: string; color: string }> = {
  pending: { label: 'Pending', labelAr: 'في الانتظار', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  passed: { label: 'Passed', labelAr: 'ناجح', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Failed', labelAr: 'مرفوض', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

// ─── Return Workflow Progress ─────────────────────────────────────────────────
function ReturnWorkflow({ status, type, language }: { status: ReturnStatus; type: Return['type']; language: 'ar' | 'en' }) {
  if (status === 'rejected') {
    return (
      <span className="text-xs text-red-500 font-medium">{language === 'ar' ? 'مرفوض' : 'Rejected'}</span>
    );
  }
  const lastStep = type === 'replacement' ? 'replaced' : 'refunded';
  const steps = [...workflowSteps.filter(s => s.key !== 'refunded'), { key: lastStep as ReturnStatus, label: type === 'replacement' ? 'Replaced' : 'Refunded', labelAr: type === 'replacement' ? 'تم الاستبدال' : 'تم الاسترداد' }];
  const current = steps.findIndex(s => s.key === status);
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === steps.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className={cn('w-3 h-3 rounded-full border-2 shrink-0 transition-colors', done ? 'bg-primary border-primary' : active ? 'bg-primary/20 border-primary' : 'bg-muted border-border')} />
            {!isLast && <div className={cn('flex-1 h-0.5 mx-0.5 transition-colors', done ? 'bg-primary' : 'bg-border')} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Return Detail Drawer ─────────────────────────────────────────────────────
function ReturnDrawer({ ret, language, onClose, onUpdateStatus, onNavigateOrder, onNavigateCustomer }: {
  ret: Return;
  language: 'ar' | 'en';
  onClose: () => void;
  onUpdateStatus: (id: string, status: ReturnStatus) => void;
  onNavigateOrder: () => void;
  onNavigateCustomer: () => void;
}) {
  const isRTL = language === 'ar';
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setTimeout(() => {
      const previews = files.map(() => `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/200/200`);
      setImages(prev => [...prev, ...previews]);
      setUploading(false);
    }, 800);
  }

  const nextStatusMap: Partial<Record<ReturnStatus, ReturnStatus>> = {
    pending: 'approved',
    approved: 'pickedUp',
    pickedUp: 'inspected',
    inspected: ret.type === 'replacement' ? 'replaced' : 'refunded',
  };

  const nextStatus = nextStatusMap[ret.status];

  return (
    <div className="fixed inset-0 z-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-card border-s border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between shrink-0">
          <div>
            <p className="text-sm font-bold text-primary">{ret.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ret.date}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Workflow */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'مرحلة الإرجاع' : 'Return Progress'}</p>
            <ReturnWorkflow status={ret.status} type={ret.type} language={language} />
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'العميل' : 'Customer'}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{ret.customer}</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'نوع الإرجاع' : 'Return Type'}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {ret.type === 'refund' ? (language === 'ar' ? 'استرداد مالي' : 'Refund') : (language === 'ar' ? 'استبدال' : 'Replacement')}
              </p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Amount'}</p>
              <p className="text-sm font-bold text-primary mt-0.5">SAR {ret.amount.toLocaleString()}</p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'طريقة الاسترداد' : 'Refund Method'}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {ret.refundMethod === 'wallet' ? (language === 'ar' ? 'المحفظة' : 'Wallet') : (language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer')}
              </p>
            </div>
            <div className="bg-muted/20 rounded-xl p-3 col-span-2">
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'فحص المنتج' : 'Inspection Status'}</p>
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1', inspectionBadge[ret.inspectionStatus].color)}>
                {language === 'ar' ? inspectionBadge[ret.inspectionStatus].labelAr : inspectionBadge[ret.inspectionStatus].label}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-muted/20 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ar' ? 'سبب الإرجاع' : 'Reason'}</p>
            <p className="text-sm text-foreground">{language === 'ar' ? ret.reason : ret.reasonEn}</p>
          </div>

          {/* Product Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{language === 'ar' ? 'صور المنتج' : 'Product Images'}</p>
              <button
                data-testid={`button-upload-image-${ret.id}`}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
              >
                <ImagePlus size={12} />
                {uploading ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (language === 'ar' ? 'رفع صورة' : 'Upload')}
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-full aspect-square rounded-xl object-cover border border-border" />
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                <ImagePlus size={18} className="mb-1" />
                <p className="text-xs">{language === 'ar' ? 'اضغط لإضافة صور' : 'Click to add photos'}</p>
              </div>
            )}
          </div>

          {/* Advance workflow */}
          {nextStatus && ret.status !== 'rejected' && (
            <button
              data-testid={`button-advance-${ret.id}`}
              onClick={() => onUpdateStatus(ret.id, nextStatus)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              {language === 'ar' ? `تقدم إلى: ${statusBadge[nextStatus].labelAr}` : `Advance to: ${statusBadge[nextStatus].label}`}
            </button>
          )}

          {/* Links */}
          <div className="space-y-2">
            <button
              data-testid={`button-go-order-${ret.id}`}
              onClick={onNavigateOrder}
              className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
            >
              <span className="text-sm text-foreground">{language === 'ar' ? `عرض الطلب ${ret.orderId}` : `View Order ${ret.orderId}`}</span>
              <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary', isRTL ? 'rotate-180' : '')} />
            </button>
            <button
              data-testid={`button-go-customer-${ret.id}`}
              onClick={onNavigateCustomer}
              className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/5 rounded-lg transition-colors group"
            >
              <span className="text-sm text-foreground">{language === 'ar' ? `عرض العميل: ${ret.customer}` : `View Customer: ${ret.customer}`}</span>
              <ChevronRight size={14} className={cn('text-muted-foreground group-hover:text-primary', isRTL ? 'rotate-180' : '')} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Returns Page ────────────────────────────────────────────────────────
export default function Returns() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [returnsList, setReturnsList] = useState<Return[]>(returns);
  const [selected, setSelected] = useState<Return | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'all'>('all');
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  function updateStatus(id: string, status: ReturnStatus) {
    setReturnsList(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    show(language === 'ar' ? 'تم تحديث حالة الإرجاع' : 'Return status updated');
  }

  const allReturnStatuses: ReturnStatus[] = ['pending', 'approved', 'pickedUp', 'inspected', 'refunded', 'replaced', 'rejected'];
  const filtered = statusFilter === 'all' ? returnsList : returnsList.filter(r => r.status === statusFilter);

  const pendingCount = returnsList.filter(r => r.status === 'pending').length;

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
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{pendingCount}</div>
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            {language === 'ar' ? `${pendingCount} طلب إرجاع ينتظر المراجعة` : `${pendingCount} return request(s) pending review`}
          </p>
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-colors', statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary')}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({returnsList.length})
        </button>
        {allReturnStatuses.map(s => {
          const count = returnsList.filter(r => r.status === s).length;
          if (!count) return null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-colors', statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary')}
            >
              {language === 'ar' ? statusBadge[s].labelAr : statusBadge[s].label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{language === 'ar' ? 'طلبات الإرجاع' : 'Return Requests'}</h3>
          <span className="text-xs text-muted-foreground">{filtered.length} {language === 'ar' ? 'طلب' : 'requests'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  t('returns.id'),
                  t('orders.id'),
                  t('orders.customer'),
                  language === 'ar' ? 'النوع' : 'Type',
                  t('returns.reason'),
                  language === 'ar' ? 'المسار' : 'Progress',
                  language === 'ar' ? 'المبلغ' : 'Amount',
                  language === 'ar' ? 'فحص المنتج' : 'Inspection',
                  t('common.actions'),
                ].map(h => (
                  <th key={h} className={cn('text-xs font-medium text-muted-foreground p-4 whitespace-nowrap', isRTL ? 'text-right' : 'text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ret => (
                <tr
                  key={ret.id}
                  data-testid={`row-return-${ret.id}`}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-primary cursor-pointer" onClick={() => setSelected(ret)}>{ret.id}</td>
                  <td className="p-4 text-sm text-foreground">{ret.orderId}</td>
                  <td className="p-4 text-sm text-foreground">{ret.customer}</td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', ret.type === 'refund' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400')}>
                      {ret.type === 'refund' ? (language === 'ar' ? 'استرداد' : 'Refund') : (language === 'ar' ? 'استبدال' : 'Replacement')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[140px] truncate">
                    {language === 'ar' ? ret.reason : ret.reasonEn}
                  </td>
                  <td className="p-4" style={{ minWidth: 140 }}>
                    <ReturnWorkflow status={ret.status} type={ret.type} language={language} />
                  </td>
                  <td className="p-4 text-sm font-semibold text-foreground whitespace-nowrap">SAR {ret.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', inspectionBadge[ret.inspectionStatus].color)}>
                      {language === 'ar' ? inspectionBadge[ret.inspectionStatus].labelAr : inspectionBadge[ret.inspectionStatus].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ret.status === 'pending' && (
                        <>
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
                        </>
                      )}
                      <button
                        data-testid={`button-view-return-${ret.id}`}
                        onClick={() => setSelected(ret)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-muted/70 transition-colors"
                      >
                        <Eye size={12} />
                        {language === 'ar' ? 'عرض' : 'View'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ReturnDrawer
          ret={selected}
          language={language}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          onNavigateOrder={() => { setSelected(null); navigate('/orders'); }}
          onNavigateCustomer={() => { setSelected(null); navigate('/customers?id=' + selected.customerId); }}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
