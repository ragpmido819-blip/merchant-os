import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { products } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export default function Products() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = products.filter(p => {
    const name = language === 'ar' ? p.name : p.nameEn;
    return name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl animate-pulse">
              <div className="h-36 bg-muted rounded-t-xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <input
            data-testid="input-search-products"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className={cn('w-full h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
          />
        </div>
        <button
          data-testid="button-add-product"
          onClick={() => setShowModal(true)}
          className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={16} />
          {t('products.addProduct')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div
            key={product.id}
            data-testid={`card-product-${product.id}`}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <div className={cn('h-36 bg-gradient-to-br', product.color, 'flex items-center justify-center')}>
              <span className="text-white text-3xl font-bold opacity-30">{product.id}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground leading-tight">
                  {language === 'ar' ? product.name : product.nameEn}
                </h3>
                <StatusBadge status={product.status} language={language} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-primary">SAR {product.price}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? `مخزون: ${product.stock}` : `Stock: ${product.stock}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">{t('products.addProduct')}</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('products.name')}</label>
                <input className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('products.price')}</label>
                <input type="number" className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('products.stock')}</label>
                <input type="number" className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className={cn('p-5 border-t border-border flex gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <button
                data-testid="button-cancel-add-product"
                onClick={() => setShowModal(false)}
                className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                data-testid="button-save-product"
                onClick={() => setShowModal(false)}
                className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
