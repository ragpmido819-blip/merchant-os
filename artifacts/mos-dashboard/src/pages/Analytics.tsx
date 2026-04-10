import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { monthlySalesData, products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, ShoppingBag, RotateCcw, Percent } from 'lucide-react';

const dailyOrders = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  orders: Math.floor(Math.random() * 50 + 20),
}));

export default function Analytics() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const chartData = monthlySalesData.map(d => ({
    name: language === 'ar' ? d.month : d.monthEn,
    amount: d.amount,
  }));

  const stats = [
    { label: t('analytics.totalRevenue'), value: 'SAR 660,000', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: t('analytics.aov'), value: 'SAR 485', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: t('analytics.conversionRate'), value: '3.8%', icon: Percent, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    { label: t('analytics.returnRate'), value: '2.1%', icon: RotateCcw, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-card border border-border rounded-xl p-5 h-24 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 h-64 animate-pulse" />
          <div className="bg-card border border-border rounded-xl p-5 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', bg)}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t('analytics.monthlySales')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`SAR ${v.toLocaleString()}`, '']}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t('analytics.dailyOrders')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t('analytics.topProducts')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('products.name')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('products.price')}</th>
                <th className={cn('text-xs font-medium text-muted-foreground p-4', isRTL ? 'text-right' : 'text-left')}>{t('products.stock')}</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br', p.color)} />
                      <span className="text-sm text-foreground">{language === 'ar' ? p.name : p.nameEn}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground">SAR {p.price}</td>
                  <td className="p-4 text-sm text-muted-foreground">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
