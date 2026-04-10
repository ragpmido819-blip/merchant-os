import { cn } from '@/lib/utils';

type StatusType =
  | 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  | 'inTransit' | 'pickedUp' | 'outForDelivery'
  | 'pending' | 'failed' | 'approved' | 'rejected'
  | 'pickedUp' | 'inspected' | 'refunded' | 'replaced'
  | 'active' | 'inactive';

const statusStyles: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  inTransit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pickedUp: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  outForDelivery: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  inspected: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  refunded: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  replaced: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  new: { ar: 'جديد', en: 'New' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  shipped: { ar: 'مشحون', en: 'Shipped' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغى', en: 'Cancelled' },
  inTransit: { ar: 'في الطريق', en: 'In Transit' },
  pickedUp: { ar: 'تم الاستلام', en: 'Picked Up' },
  outForDelivery: { ar: 'خرج للتوصيل', en: 'Out for Delivery' },
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  failed: { ar: 'فشل', en: 'Failed' },
  approved: { ar: 'مقبول', en: 'Approved' },
  rejected: { ar: 'مرفوض', en: 'Rejected' },
  inspected: { ar: 'تم الفحص', en: 'Inspected' },
  refunded: { ar: 'تم الاسترداد', en: 'Refunded' },
  replaced: { ar: 'تم الاستبدال', en: 'Replaced' },
  active: { ar: 'نشط', en: 'Active' },
  inactive: { ar: 'غير نشط', en: 'Inactive' },
};

interface StatusBadgeProps {
  status: string;
  language?: 'ar' | 'en';
}

export default function StatusBadge({ status, language = 'ar' }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-muted text-muted-foreground';
  const label = statusLabels[status]?.[language] ?? status;
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', style)}>
      {label}
    </span>
  );
}
