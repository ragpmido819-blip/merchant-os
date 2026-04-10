import { cn } from '@/lib/utils';

type StatusType = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'inTransit' | 'pending' | 'failed' | 'approved' | 'rejected' | 'active' | 'inactive';

const statusStyles: Record<StatusType, string> = {
  new: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  inTransit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
};

const statusLabels: Record<StatusType, { ar: string; en: string }> = {
  new: { ar: 'جديد', en: 'New' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  shipped: { ar: 'مشحون', en: 'Shipped' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغى', en: 'Cancelled' },
  inTransit: { ar: 'في الطريق', en: 'In Transit' },
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  failed: { ar: 'فشل', en: 'Failed' },
  approved: { ar: 'مقبول', en: 'Approved' },
  rejected: { ar: 'مرفوض', en: 'Rejected' },
  active: { ar: 'نشط', en: 'Active' },
  inactive: { ar: 'غير نشط', en: 'Inactive' },
};

interface StatusBadgeProps {
  status: StatusType;
  language?: 'ar' | 'en';
}

export default function StatusBadge({ status, language = 'ar' }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusStyles[status])}>
      {statusLabels[status][language]}
    </span>
  );
}
