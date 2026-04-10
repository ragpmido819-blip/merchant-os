import { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, TrendingUp, RotateCcw, ArrowUpRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { orders, weeklySalesData, orderStatusData } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="h-8 bg-muted rounded w-1/3 mb-2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: t('dashboard.ordersToday'),
      value: '47',
      change: '+12%',
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: t('dashboard.newMessages'),
      value: '12',
      change: '+3',
      icon: MessageSquare,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: t('dashboard.sales'),
      value: 'SAR 24,500',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: t('dashboard.returns'),
      value: '5',
      change: '-2',
      icon: RotateCcw,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
  ];

  const chartData = weeklySalesData.map(d => ({
    name: language === 'ar' ? d.day : d.dayEn,
    amount: d.amount,
  }));

  const pieData = orderStatusData.map(d => ({
    name: language === 'ar' ? d.name : d.nameEn,
    value: d.value,
    color: d.color,
  }));

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 animate-pulse h-64" />
          <div className="bg-card border border-border rounded-xl p-5 animate-pulse h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} data-testid={`card-stat-${label}`} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bg)}>
                <Icon size={20} className={color} />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <ArrowUpRight size={12} />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t('dashboard.weeklySales')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number) => [`SAR ${value.toLocaleString()}`, '']}
              />
              <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t('dashboard.orderStatus')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t('dashboard.recentOrders')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.id')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.customer')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.status')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('orders.price')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer" data-testid={`row-order-${order.id}`}>
                  <td className="p-4 text-sm font-medium text-primary">{order.id}</td>
                  <td className="p-4 text-sm text-foreground">{order.customer}</td>
                  <td className="p-4"><StatusBadge status={order.status} language={language} /></td>
                  <td className="p-4 text-sm text-foreground">SAR {order.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
