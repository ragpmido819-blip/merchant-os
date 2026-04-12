import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, Package,
  TrendingUp, AlertTriangle, X, Check, BarChart2,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight,
  Tag, Layers,
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { products as initialProducts, Product, ProductVariant } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastItem { id: string; msg: string; type: ToastType }

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = (msg: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  return { toasts, show };
}
function Toasts({ toasts }: { toasts: ToastItem[] }) {
  const colors: Record<ToastType, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-primary text-primary-foreground',
    warning: 'bg-amber-500 text-white',
  };
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none min-w-[260px]">
      {toasts.map(t => (
        <div key={t.id} className={cn('px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-in slide-in-from-bottom-2', colors[t.type])}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Stock Status helpers ─────────────────────────────────────────────────────
function getStockStatus(product: Product): 'out' | 'low' | 'ok' {
  if (product.stock === 0) return 'out';
  if (product.stock <= product.stockAlertThreshold) return 'low';
  return 'ok';
}

function StockIndicator({ product, language }: { product: Product; language: 'ar' | 'en' }) {
  const s = getStockStatus(product);
  const cfg = {
    out: { label: language === 'ar' ? 'نفد المخزون' : 'Out of Stock', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    low: { label: language === 'ar' ? 'مخزون منخفض' : 'Low Stock', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    ok: { label: language === 'ar' ? 'متوفر' : 'In Stock', dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
  }[s];
  return (
    <div className={cn('flex items-center gap-1.5', cfg.text)}>
      <div className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      <span className="text-xs font-medium">{cfg.label}</span>
    </div>
  );
}

// ─── Quick Stock Update Popover ───────────────────────────────────────────────
function QuickStockUpdate({ product, language, onUpdate }: { product: Product; language: 'ar' | 'en'; onUpdate: (id: string, stock: number) => void }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(String(product.stock));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid={`button-stock-update-${product.id}`}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        title={language === 'ar' ? 'تحديث المخزون' : 'Update Stock'}
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <BarChart2 size={13} />
      </button>
      {open && (
        <div className="absolute z-30 bottom-full mb-1 left-0 bg-card border border-border rounded-xl shadow-xl p-3 w-40" dir="ltr">
          <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'المخزون الجديد' : 'New stock qty'}</p>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={val}
              onChange={e => setVal(e.target.value)}
              className="flex-1 w-full h-7 px-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground outline-none"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={e => { e.stopPropagation(); onUpdate(product.id, Number(val)); setOpen(false); }}
              className="h-7 w-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90"
            >
              <Check size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Variant Badge ────────────────────────────────────────────────────────────
function VariantBadge({ variant, language }: { variant: ProductVariant; language: 'ar' | 'en' }) {
  const label = [variant.size, variant.color, variant.customLabel].filter(Boolean).join(' / ') || variant.sku;
  return (
    <div className={cn('flex items-center justify-between p-2.5 rounded-lg border text-xs', variant.active ? 'border-border bg-muted/20' : 'border-border/50 bg-muted/10 opacity-60')}>
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground font-mono">{variant.sku}</p>
      </div>
      <div className="text-end">
        {variant.priceOverride && <p className="font-semibold text-primary">SAR {variant.priceOverride}</p>}
        <div className={cn('flex items-center gap-1', variant.stock === 0 ? 'text-red-500' : variant.stock <= 5 ? 'text-amber-500' : 'text-green-600')}>
          <div className={cn('w-1.5 h-1.5 rounded-full', variant.stock === 0 ? 'bg-red-500' : variant.stock <= 5 ? 'bg-amber-500' : 'bg-green-500')} />
          <span>{variant.stock}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail / Edit Drawer ─────────────────────────────────────────────
function ProductDrawer({ product, language, onClose, onSave, onDelete }: {
  product: Product;
  language: 'ar' | 'en';
  onClose: () => void;
  onSave: (updated: Product) => void;
  onDelete: (id: string) => void;
}) {
  const isRTL = language === 'ar';
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(product.name);
  const [nameEn, setNameEn] = useState(product.nameEn);
  const [desc, setDesc] = useState(product.description);
  const [descEn, setDescEn] = useState(product.descriptionEn);
  const [price, setPrice] = useState(String(product.price));
  const [discountPrice, setDiscountPrice] = useState(String(product.discountPrice ?? ''));
  const [stock, setStock] = useState(String(product.stock));
  const [threshold, setThreshold] = useState(String(product.stockAlertThreshold));
  const [status, setStatus] = useState<'active' | 'inactive'>(product.status);
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants ?? []);
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantColor, setNewVariantColor] = useState('');
  const [newVariantCustom, setNewVariantCustom] = useState('');
  const [newVariantStock, setNewVariantStock] = useState('0');
  const [newVariantPrice, setNewVariantPrice] = useState('');
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    onSave({
      ...product,
      name, nameEn,
      description: desc, descriptionEn: descEn,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      stockAlertThreshold: Number(threshold),
      status,
      variants,
    });
    setEditMode(false);
  }

  function addVariant() {
    if (!newVariantSize && !newVariantColor && !newVariantCustom) return;
    const label = [newVariantSize, newVariantColor, newVariantCustom].filter(Boolean).join('-');
    const newV: ProductVariant = {
      id: `${product.id}-V${Date.now()}`,
      sku: `${product.sku}-${label.toUpperCase()}`,
      size: newVariantSize || undefined,
      color: newVariantColor || undefined,
      customLabel: newVariantCustom || undefined,
      priceOverride: newVariantPrice ? Number(newVariantPrice) : undefined,
      stock: Number(newVariantStock),
      active: true,
    };
    setVariants(prev => [...prev, newV]);
    setNewVariantSize(''); setNewVariantColor(''); setNewVariantCustom(''); setNewVariantStock('0'); setNewVariantPrice('');
    setShowAddVariant(false);
  }

  function toggleVariant(id: string) {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
  }

  function removeVariant(id: string) {
    setVariants(prev => prev.filter(v => v.id !== id));
  }

  const stockStatus = getStockStatus({ ...product, stock: Number(stock), stockAlertThreshold: Number(threshold) });
  const inputCls = 'w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="fixed inset-0 z-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-card border-s border-border flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br shrink-0', product.color)} />
            <div>
              <p className="text-sm font-bold text-foreground">{language === 'ar' ? product.name : product.nameEn}</p>
              <p className="text-xs font-mono text-muted-foreground">{product.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditMode(e => !e)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', editMode ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted')}>
              <Edit2 size={12} className="inline me-1" />
              {editMode ? (language === 'ar' ? 'عرض' : 'View') : (language === 'ar' ? 'تعديل' : 'Edit')}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={16} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-base font-bold text-foreground">{product.views.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مشاهدة' : 'Views'}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-base font-bold text-foreground">{product.sales}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مبيعة' : 'Sold'}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-base font-bold text-foreground">{product.stock}</p>
              <StockIndicator product={product} language={language} />
            </div>
          </div>

          {editMode ? (
            <>
              {/* Edit Form */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                  <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                  <input value={nameEn} onChange={e => setNameEn(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (EN)'}</label>
                <textarea value={descEn} onChange={e => setDescEn(e.target.value)} rows={2} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'السعر الأساسي' : 'Base Price'} (SAR)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'سعر الخصم' : 'Discount Price'} (SAR)</label>
                  <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className={inputCls} placeholder={language === 'ar' ? 'اختياري' : 'Optional'} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'المخزون' : 'Stock'}</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'حد التنبيه' : 'Alert Threshold'}</label>
                  <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">{language === 'ar' ? 'حالة المنتج' : 'Product Status'}</p>
                  <p className="text-xs text-muted-foreground">{status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}</p>
                </div>
                <button onClick={() => setStatus(s => s === 'active' ? 'inactive' : 'active')} className="text-primary">
                  {status === 'active' ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-muted-foreground" />}
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditMode(false)} className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button data-testid={`button-save-product-${product.id}`} onClick={handleSave} className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">{language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}</button>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                  <Tag size={13} className="text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground">{language === 'ar' ? 'الفئة' : 'Category'}:</span>
                  <span className="text-sm text-foreground">{product.category}</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{language === 'ar' ? 'الوصف' : 'Description'}</p>
                  <p className="text-sm text-foreground">{language === 'ar' ? product.description : product.descriptionEn}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'السعر' : 'Price'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.discountPrice ? (
                        <>
                          <p className="text-base font-bold text-primary">SAR {product.discountPrice}</p>
                          <p className="text-xs text-muted-foreground line-through">SAR {product.price}</p>
                        </>
                      ) : (
                        <p className="text-base font-bold text-primary">SAR {product.price}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'تاريخ الإضافة' : 'Created'}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{product.createdDate}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers size={13} className="text-muted-foreground" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{language === 'ar' ? 'المتغيرات' : 'Variants'} ({variants.length})</p>
              </div>
              <button
                data-testid={`button-add-variant-${product.id}`}
                onClick={() => setShowAddVariant(s => !s)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Plus size={11} />
                {language === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>

            {showAddVariant && (
              <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input value={newVariantSize} onChange={e => setNewVariantSize(e.target.value)} placeholder={language === 'ar' ? 'مقاس' : 'Size'} className="h-8 px-2 bg-card border border-border rounded-lg text-xs text-foreground outline-none" />
                  <input value={newVariantColor} onChange={e => setNewVariantColor(e.target.value)} placeholder={language === 'ar' ? 'لون' : 'Color'} className="h-8 px-2 bg-card border border-border rounded-lg text-xs text-foreground outline-none" />
                  <input value={newVariantCustom} onChange={e => setNewVariantCustom(e.target.value)} placeholder={language === 'ar' ? 'خاص' : 'Custom'} className="h-8 px-2 bg-card border border-border rounded-lg text-xs text-foreground outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={newVariantStock} onChange={e => setNewVariantStock(e.target.value)} placeholder={language === 'ar' ? 'المخزون' : 'Stock'} className="h-8 px-2 bg-card border border-border rounded-lg text-xs text-foreground outline-none" />
                  <input type="number" value={newVariantPrice} onChange={e => setNewVariantPrice(e.target.value)} placeholder={language === 'ar' ? 'سعر مختلف (اختياري)' : 'Price override'} className="h-8 px-2 bg-card border border-border rounded-lg text-xs text-foreground outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddVariant(false)} className="flex-1 h-8 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                  <button onClick={addVariant} className="flex-1 h-8 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">{language === 'ar' ? 'إضافة' : 'Add Variant'}</button>
                </div>
              </div>
            )}

            {variants.length > 0 ? (
              <div className="space-y-2">
                {variants.map(v => (
                  <div key={v.id} className="group relative">
                    <VariantBadge variant={v} language={language} />
                    <div className="absolute top-2 end-2 hidden group-hover:flex items-center gap-1 bg-card border border-border rounded-lg shadow-sm px-1">
                      <button onClick={() => toggleVariant(v.id)} title={v.active ? 'Deactivate' : 'Activate'} className="p-1 text-muted-foreground hover:text-primary">
                        {v.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                      </button>
                      <button onClick={() => removeVariant(v.id)} title="Remove" className="p-1 text-muted-foreground hover:text-red-500">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-3">{language === 'ar' ? 'لا توجد متغيرات' : 'No variants yet'}</p>
            )}
          </div>

          {/* Danger zone */}
          {!editMode && (
            <div className="pt-2 border-t border-border">
              {!confirmDelete ? (
                <button
                  data-testid={`button-delete-product-${product.id}`}
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <Trash2 size={13} />
                  {language === 'ar' ? 'حذف المنتج' : 'Delete Product'}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                  <button onClick={() => onDelete(product.id)} className="flex-1 h-9 bg-red-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">{language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Product Modal (extended existing) ────────────────────────────────────
function AddProductModal({ language, onClose, onAdd }: { language: 'ar' | 'en'; onClose: () => void; onAdd: (p: Product) => void }) {
  const isRTL = language === 'ar';
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [sku, setSku] = useState('');
  const [desc, setDesc] = useState('');
  const [descEn, setDescEn] = useState('');
  const [category, setCategory] = useState('');
  const [enabled, setEnabled] = useState(true);
  const inputCls = 'w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30';

  function handleSave() {
    if (!name || !price || !stock) return;
    const newProduct: Product = {
      id: `P${Date.now()}`, name, nameEn: nameEn || name,
      description: desc, descriptionEn: descEn || desc,
      sku: sku || `SKU-NEW-${Date.now()}`, price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock), stockAlertThreshold: Number(threshold),
      status: enabled ? 'active' : 'inactive',
      category: category || (language === 'ar' ? 'عام' : 'General'),
      color: 'from-primary/50 to-primary', createdDate: new Date().toISOString().split('T')[0],
      views: 0, sales: 0,
    };
    onAdd(newProduct);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-foreground">{language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'الاسم بالعربي' : 'Name (Arabic)'} *</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'الاسم بالإنجليزي' : 'Name (English)'}</label>
              <input value={nameEn} onChange={e => setNameEn(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">SKU</label>
            <input value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU-XXX-000" className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'الوصف' : 'Description'}</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'السعر' : 'Price'} (SAR) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'سعر الخصم' : 'Discount Price'}</label>
              <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className={inputCls} placeholder={language === 'ar' ? 'اختياري' : 'Optional'} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'المخزون' : 'Stock'} *</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'حد التنبيه' : 'Alert Threshold'}</label>
              <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">{language === 'ar' ? 'الفئة' : 'Category'}</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className={inputCls} />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
            <p className="text-sm font-medium text-foreground">{language === 'ar' ? 'تفعيل المنتج' : 'Enable Product'}</p>
            <button onClick={() => setEnabled(e => !e)} className="text-primary">
              {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-muted-foreground" />}
            </button>
          </div>
        </div>
        <div className={cn('p-5 border-t border-border flex gap-3 shrink-0', isRTL ? 'flex-row-reverse' : 'flex-row')}>
          <button data-testid="button-cancel-add-product" onClick={onClose} className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
          <button data-testid="button-save-product" onClick={handleSave} disabled={!name || !price || !stock} className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">{language === 'ar' ? 'إضافة' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function Products() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const outOfStock = productList.filter(p => p.stock === 0);
      const lowStock = productList.filter(p => p.stock > 0 && p.stock <= p.stockAlertThreshold);
      if (outOfStock.length) show(language === 'ar' ? `⚠️ ${outOfStock.length} منتجات نفد مخزونها` : `⚠️ ${outOfStock.length} products out of stock`, 'error');
      if (lowStock.length) setTimeout(() => show(language === 'ar' ? `🔔 ${lowStock.length} منتجات بمخزون منخفض` : `🔔 ${lowStock.length} products low on stock`, 'warning'), 1000);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['all', ...Array.from(new Set(productList.map(p => p.category)))];

  const filtered = productList.filter(p => {
    const name = language === 'ar' ? p.name : p.nameEn;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const stock = getStockStatus(p);
    const matchAvail = availFilter === 'all' || availFilter === stock;
    const matchPriceMin = !priceMin || p.price >= Number(priceMin);
    const matchPriceMax = !priceMax || p.price <= Number(priceMax);
    return matchSearch && matchCategory && matchStatus && matchAvail && matchPriceMin && matchPriceMax;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateProductStock(id: string, stock: number) {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, stock } : p));
    show(language === 'ar' ? 'تم تحديث المخزون' : 'Stock updated');
  }

  function saveProduct(updated: Product) {
    setProductList(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProduct(updated);
    show(language === 'ar' ? 'تم حفظ المنتج' : 'Product saved');
  }

  function deleteProduct(id: string) {
    setProductList(prev => prev.filter(p => p.id !== id));
    setSelectedProduct(null);
    show(language === 'ar' ? 'تم حذف المنتج' : 'Product deleted', 'error');
  }

  function addProduct(p: Product) {
    setProductList(prev => [p, ...prev]);
    show(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
  }

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

      {/* Search + Add + Filters toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <input
            data-testid="input-search-products"
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={language === 'ar' ? 'بحث بالاسم أو SKU...' : 'Search by name or SKU...'}
            className={cn('w-full h-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4')}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={cn('h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors', showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground')}
          >
            <Filter size={13} />
            {language === 'ar' ? 'فلاتر' : 'Filters'}
          </button>
          <button
            data-testid="button-add-product"
            onClick={() => setShowModal(true)}
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={16} />
            {t('products.addProduct')}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الفئة' : 'Category'}</label>
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none">
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? (language === 'ar' ? 'الكل' : 'All') : c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'التوفر' : 'Availability'}</label>
            <select value={availFilter} onChange={e => { setAvailFilter(e.target.value as typeof availFilter); setPage(1); }} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="ok">{language === 'ar' ? 'متوفر' : 'In Stock'}</option>
              <option value="low">{language === 'ar' ? 'مخزون منخفض' : 'Low Stock'}</option>
              <option value="out">{language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'الحالة' : 'Status'}</label>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }} className="w-full h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === 'ar' ? 'نطاق السعر' : 'Price Range'}</label>
            <div className="flex items-center gap-1">
              <input type="number" value={priceMin} onChange={e => { setPriceMin(e.target.value); setPage(1); }} placeholder="0" className="w-full h-9 px-2 bg-muted/30 border border-border rounded-lg text-xs text-foreground outline-none" />
              <span className="text-muted-foreground text-xs">–</span>
              <input type="number" value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} placeholder="∞" className="w-full h-9 px-2 bg-muted/30 border border-border rounded-lg text-xs text-foreground outline-none" />
            </div>
          </div>
          <div className="col-span-2 md:col-span-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{filtered.length} {language === 'ar' ? 'نتيجة' : 'results'}</p>
            <button onClick={() => { setCategoryFilter('all'); setAvailFilter('all'); setStatusFilter('all'); setPriceMin(''); setPriceMax(''); setPage(1); }} className="text-xs text-muted-foreground hover:text-foreground underline">
              {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </button>
          </div>
        </div>
      )}

      {/* Stock alert summary */}
      {(() => {
        const outCount = productList.filter(p => p.stock === 0).length;
        const lowCount = productList.filter(p => p.stock > 0 && p.stock <= p.stockAlertThreshold).length;
        return (outCount > 0 || lowCount > 0) ? (
          <div className="flex flex-wrap gap-2">
            {outCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                  {outCount} {language === 'ar' ? 'منتجات نفد مخزونها' : 'products out of stock'}
                </p>
              </div>
            )}
            {lowCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
                <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  {lowCount} {language === 'ar' ? 'منتجات بمخزون منخفض' : 'products low on stock'}
                </p>
              </div>
            )}
          </div>
        ) : null;
      })()}

      {/* Card Grid (existing layout preserved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map(product => {
          const stockStatus = getStockStatus(product);
          const stockBorderColor = stockStatus === 'out' ? 'border-red-200 dark:border-red-900' : stockStatus === 'low' ? 'border-amber-200 dark:border-amber-800' : 'border-border';
          return (
            <div
              key={product.id}
              data-testid={`card-product-${product.id}`}
              className={cn('bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 group relative', stockBorderColor)}
              onClick={() => setSelectedProduct(product)}
            >
              {/* Existing gradient thumbnail */}
              <div className={cn('h-36 bg-gradient-to-br relative', product.color, 'flex items-center justify-center')}>
                <span className="text-white text-3xl font-bold opacity-30">{product.id}</span>
                {/* Best seller badge */}
                {product.sales > 80 && (
                  <div className="absolute top-2 start-2 flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white rounded-full text-xs font-semibold">
                    <TrendingUp size={10} />
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </div>
                )}
                {/* Stock out overlay */}
                {stockStatus === 'out' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-2 py-1 bg-red-600 rounded-full">{language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</span>
                  </div>
                )}
                {/* Quick actions overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    data-testid={`button-view-product-${product.id}`}
                    onClick={e => { e.stopPropagation(); setSelectedProduct(product); }}
                    className="p-2 bg-white/90 rounded-full shadow text-gray-700 hover:bg-white transition-colors"
                    title={language === 'ar' ? 'عرض' : 'View'}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    data-testid={`button-edit-product-${product.id}`}
                    onClick={e => { e.stopPropagation(); setSelectedProduct(product); }}
                    className="p-2 bg-white/90 rounded-full shadow text-gray-700 hover:bg-white transition-colors"
                    title={language === 'ar' ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>

              {/* Existing card body */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground leading-tight flex-1">
                    {language === 'ar' ? product.name : product.nameEn}
                  </h3>
                  <StatusBadge status={product.status} language={language} />
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-1">{product.sku}</p>
                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>

                {/* Stock indicator (new) */}
                <div className="flex items-center justify-between mb-2">
                  <StockIndicator product={product} language={language} />
                  {product.variants && <span className="text-xs text-muted-foreground">{product.variants.length} {language === 'ar' ? 'متغير' : 'variants'}</span>}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex items-center gap-1.5">
                        <p className="text-base font-bold text-primary">SAR {product.discountPrice}</p>
                        <p className="text-xs text-muted-foreground line-through">SAR {product.price}</p>
                      </div>
                    ) : (
                      <p className="text-base font-bold text-primary">SAR {product.price}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? `${product.stock}` : `${product.stock}`}
                    </p>
                    <QuickStockUpdate product={product} language={language} onUpdate={updateProductStock} />
                  </div>
                </div>

                {/* Performance mini stats */}
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>👁 {product.views.toLocaleString()}</span>
                  <span>📦 {product.sales} {language === 'ar' ? 'مبيعة' : 'sold'}</span>
                  <span className="opacity-60">{product.createdDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Package size={40} className="mb-3 opacity-30" />
          <p className="text-sm">{language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? `${filtered.length} منتج — صفحة ${page} من ${totalPages}` : `${filtered.length} products — Page ${page} of ${totalPages}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            >
              {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors', page === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted')}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            >
              {isRTL ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal (extended existing) */}
      {showModal && (
        <AddProductModal language={language} onClose={() => setShowModal(false)} onAdd={addProduct} />
      )}

      {/* Product Detail/Edit Drawer */}
      {selectedProduct && (
        <ProductDrawer
          product={productList.find(p => p.id === selectedProduct.id) ?? selectedProduct}
          language={language}
          onClose={() => setSelectedProduct(null)}
          onSave={saveProduct}
          onDelete={deleteProduct}
        />
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
