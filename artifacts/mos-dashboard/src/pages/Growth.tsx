import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Plus, Trash2, Eye, Save, Globe,
  Send, Copy, Check, ExternalLink, Users, MessageSquare,
  Zap, ChevronRight, X, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = 'funnels' | 'retargeting' | 'affiliates';

interface FunnelSection {
  id: string;
  type: 'hero' | 'product' | 'testimonials' | 'cta';
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  bgColor: string;
}

interface Campaign {
  id: string;
  name: string;
  nameAr: string;
  audience: 'abandoned_cart' | 'old_customers';
  channel: 'sms' | 'whatsapp';
  message: string;
  status: 'active' | 'draft';
  createdAt: string;
}

interface Affiliate {
  id: string;
  name: string;
  commission: number;
  link: string;
  sales: number;
  status: 'active' | 'inactive';
}

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: { id: string; message: string; type: string }[] }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          'px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto animate-in slide-in-from-bottom-2',
          t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {t.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Initial data
// ─────────────────────────────────────────────
const defaultSections: FunnelSection[] = [
  { id: 's1', type: 'hero', title: 'Hero Section', titleAr: 'القسم الرئيسي', content: 'Your headline goes here', contentAr: 'العنوان الرئيسي هنا', bgColor: 'from-indigo-500 to-blue-600' },
  { id: 's2', type: 'product', title: 'Product Showcase', titleAr: 'عرض المنتج', content: 'Showcase your best product', contentAr: 'اعرض منتجك الأفضل', bgColor: 'from-purple-500 to-violet-600' },
  { id: 's3', type: 'testimonials', title: 'Testimonials', titleAr: 'آراء العملاء', content: 'What customers say...', contentAr: 'ما يقوله عملاؤنا...', bgColor: 'from-teal-500 to-emerald-600' },
  { id: 's4', type: 'cta', title: 'Call to Action', titleAr: 'دعوة للعمل', content: 'Buy Now — Limited Offer', contentAr: 'اشتر الآن - عرض محدود', bgColor: 'from-orange-500 to-red-500' },
];

const defaultCampaigns: Campaign[] = [
  { id: 'c1', name: 'Abandoned Cart Recovery', nameAr: 'استعادة سلة التسوق', audience: 'abandoned_cart', channel: 'whatsapp', message: 'مرحباً، لقد تركت منتجات في سلة التسوق! أكمل طلبك الآن واحصل على خصم 10%', status: 'active', createdAt: '2026-04-05' },
  { id: 'c2', name: 'Win-back Campaign', nameAr: 'حملة استعادة العملاء', audience: 'old_customers', channel: 'sms', message: 'اشتقنا إليك! عد إلينا واحصل على خصم حصري 15% على طلبك القادم', status: 'active', createdAt: '2026-04-02' },
  { id: 'c3', name: 'Weekend Promo', nameAr: 'عروض نهاية الأسبوع', audience: 'old_customers', channel: 'whatsapp', message: 'عروض نهاية الأسبوع! خصم 20% على جميع المنتجات', status: 'draft', createdAt: '2026-04-08' },
];

const defaultAffiliates: Affiliate[] = [
  { id: 'a1', name: 'سلمى الراشد', commission: 12, link: 'https://mos.sa/ref/salma-rashid', sales: 45, status: 'active' },
  { id: 'a2', name: 'أحمد الغامدي', commission: 10, link: 'https://mos.sa/ref/ahmed-ghamdi', sales: 28, status: 'active' },
  { id: 'a3', name: 'نورة القحطاني', commission: 15, link: '', sales: 0, status: 'inactive' },
  { id: 'a4', name: 'فيصل المطيري', commission: 8, link: 'https://mos.sa/ref/faisal-mutairi', sales: 62, status: 'active' },
];

// ─────────────────────────────────────────────
// Sortable Section Item
// ─────────────────────────────────────────────
interface SortableSectionProps {
  section: FunnelSection;
  isSelected: boolean;
  language: 'ar' | 'en';
  onSelect: () => void;
  onRemove: () => void;
}

function SortableSection({ section, isSelected, language, onSelect, onRemove }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      data-testid={`funnel-section-${section.id}`}
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 select-none',
        isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'ring-1 ring-border hover:ring-primary/50 hover:shadow-md'
      )}
    >
      <div className={cn('bg-gradient-to-r p-6 text-white', section.bgColor)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              onClick={e => e.stopPropagation()}
              className="p-1 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={14} />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              {language === 'ar' ? section.titleAr : section.title}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded bg-white/20 hover:bg-red-500/80 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
        <p className="text-sm opacity-90">{language === 'ar' ? section.contentAr : section.content}</p>
      </div>
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-primary rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Funnels Tab
// ─────────────────────────────────────────────
function FunnelsTab({ language }: { language: 'ar' | 'en' }) {
  const isRTL = language === 'ar';
  const [sections, setSections] = useState<FunnelSection[]>(defaultSections);
  const [selected, setSelected] = useState<string | null>('s1');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [published, setPublished] = useState(false);
  const { toasts, show } = useToast();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const selectedSection = sections.find(s => s.id === selected);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections(prev => {
        const oldIndex = prev.findIndex(s => s.id === active.id);
        const newIndex = prev.findIndex(s => s.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function handleSave() {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      show(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully');
      setTimeout(() => setSaveState('idle'), 2000);
    }, 1200);
  }

  function handlePublish() {
    setPublished(true);
    show(language === 'ar' ? 'تم النشر بنجاح!' : 'Published successfully!');
  }

  function addSection(type: FunnelSection['type']) {
    const templates: Record<FunnelSection['type'], Partial<FunnelSection>> = {
      hero: { title: 'Hero Section', titleAr: 'القسم الرئيسي', content: 'New headline', contentAr: 'عنوان جديد', bgColor: 'from-indigo-500 to-blue-600' },
      product: { title: 'Product Showcase', titleAr: 'عرض المنتج', content: 'Product details', contentAr: 'تفاصيل المنتج', bgColor: 'from-purple-500 to-violet-600' },
      testimonials: { title: 'Testimonials', titleAr: 'آراء العملاء', content: 'Customer reviews', contentAr: 'آراء العملاء', bgColor: 'from-teal-500 to-emerald-600' },
      cta: { title: 'Call to Action', titleAr: 'دعوة للعمل', content: 'Click here', contentAr: 'اضغط هنا', bgColor: 'from-orange-500 to-red-500' },
    };
    const newSection: FunnelSection = {
      id: `s${Date.now()}`,
      type,
      ...templates[type],
    } as FunnelSection;
    setSections(prev => [...prev, newSection]);
    setSelected(newSection.id);
  }

  function updateSelected(field: keyof FunnelSection, value: string) {
    if (!selected) return;
    setSections(prev => prev.map(s => s.id === selected ? { ...s, [field]: value } : s));
  }

  function removeSection(id: string) {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selected === id) setSelected(null);
  }

  const sectionTypes: Array<{ type: FunnelSection['type']; label: string; labelAr: string }> = [
    { type: 'hero', label: 'Hero', labelAr: 'رئيسي' },
    { type: 'product', label: 'Product', labelAr: 'منتج' },
    { type: 'testimonials', label: 'Testimonials', labelAr: 'آراء' },
    { type: 'cta', label: 'CTA', labelAr: 'دعوة' },
  ];

  return (
    <div className="flex flex-col h-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {sectionTypes.map(({ type, label, labelAr }) => (
            <button
              key={type}
              data-testid={`button-add-section-${type}`}
              onClick={() => addSection(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={12} />
              {language === 'ar' ? labelAr : label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs', saveState === 'saving' ? 'text-amber-500' : saveState === 'saved' ? 'text-green-500' : 'text-muted-foreground')}>
            {saveState === 'saving' ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') :
             saveState === 'saved' ? (language === 'ar' ? 'تم الحفظ' : 'Saved') :
             (language === 'ar' ? 'لم يتم الحفظ' : 'Unsaved')}
          </span>
          <button
            data-testid="button-save-funnel"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Save size={12} />
            {language === 'ar' ? 'حفظ' : 'Save'}
          </button>
          <button
            data-testid="button-preview-funnel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground hover:bg-muted transition-colors"
          >
            <Eye size={12} />
            {language === 'ar' ? 'معاينة' : 'Preview'}
          </button>
          <button
            data-testid="button-publish-funnel"
            onClick={handlePublish}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              published ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            <Globe size={12} />
            {published ? (language === 'ar' ? 'تم النشر' : 'Published') : (language === 'ar' ? 'نشر' : 'Publish')}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl text-muted-foreground">
              <Zap size={32} className="mb-3 opacity-30" />
              <p className="text-base font-medium">{language === 'ar' ? 'ابدأ ببناء المسار' : 'Start building your funnel'}</p>
              <p className="text-sm mt-1">{language === 'ar' ? 'أضف قسماً من الأعلى' : 'Add a section from above'}</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 max-w-2xl mx-auto">
                  {sections.map(section => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      isSelected={selected === section.id}
                      language={language}
                      onSelect={() => setSelected(section.id)}
                      onRemove={() => removeSection(section.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Right Editing Panel */}
        {selectedSection && (
          <div className="w-72 shrink-0 border-s border-border bg-card overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {language === 'ar' ? 'تحرير القسم' : 'Edit Section'}
              </p>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-muted transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  data-testid="input-section-title-ar"
                  value={selectedSection.titleAr}
                  onChange={e => updateSelected('titleAr', e.target.value)}
                  className="w-full h-8 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                </label>
                <input
                  data-testid="input-section-title-en"
                  value={selectedSection.title}
                  onChange={e => updateSelected('title', e.target.value)}
                  className="w-full h-8 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'}
                </label>
                <textarea
                  data-testid="input-section-content-ar"
                  value={selectedSection.contentAr}
                  onChange={e => updateSelected('contentAr', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {language === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'}
                </label>
                <textarea
                  data-testid="input-section-content-en"
                  value={selectedSection.content}
                  onChange={e => updateSelected('content', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {language === 'ar' ? 'لون الخلفية' : 'Background Style'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'from-indigo-500 to-blue-600',
                    'from-purple-500 to-violet-600',
                    'from-teal-500 to-emerald-600',
                    'from-orange-500 to-red-500',
                    'from-pink-500 to-rose-600',
                    'from-slate-600 to-gray-800',
                    'from-amber-500 to-yellow-400',
                    'from-cyan-500 to-sky-600',
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => updateSelected('bgColor', color)}
                      className={cn(
                        'h-8 rounded-lg bg-gradient-to-r transition-all',
                        color,
                        selectedSection.bgColor === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => removeSection(selectedSection.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                  {language === 'ar' ? 'حذف القسم' : 'Remove Section'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Retargeting Tab
// ─────────────────────────────────────────────
function RetargetingTab({ language }: { language: 'ar' | 'en' }) {
  const isRTL = language === 'ar';
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', nameAr: '', audience: 'abandoned_cart' as Campaign['audience'], channel: 'whatsapp' as Campaign['channel'], message: '' });
  const [creating, setCreating] = useState(false);
  const { toasts, show } = useToast();

  function handleCreate() {
    if (!form.message.trim()) { show(language === 'ar' ? 'أدخل نص الرسالة' : 'Enter message content', 'error'); return; }
    setCreating(true);
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: `c${Date.now()}`,
        name: form.name || 'New Campaign',
        nameAr: form.nameAr || 'حملة جديدة',
        audience: form.audience,
        channel: form.channel,
        message: form.message,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      setShowCreate(false);
      setCreating(false);
      setForm({ name: '', nameAr: '', audience: 'abandoned_cart', channel: 'whatsapp', message: '' });
      show(language === 'ar' ? 'تم إنشاء الحملة بنجاح!' : 'Campaign created successfully!');
    }, 1500);
  }

  const audienceLabels: Record<Campaign['audience'], { ar: string; en: string }> = {
    abandoned_cart: { ar: 'سلة التسوق المهجورة', en: 'Abandoned Cart' },
    old_customers: { ar: 'العملاء القدامى', en: 'Old Customers' },
  };

  const channelIcons: Record<Campaign['channel'], string> = {
    sms: '📱',
    whatsapp: '💬',
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          {language === 'ar' ? 'حملات إعادة الاستهداف' : 'Retargeting Campaigns'}
        </h3>
        <button
          data-testid="button-create-campaign"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          {language === 'ar' ? 'حملة جديدة' : 'New Campaign'}
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map(camp => (
          <div key={camp.id} data-testid={`campaign-${camp.id}`} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{channelIcons[camp.channel]}</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{language === 'ar' ? camp.nameAr : camp.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{audienceLabels[camp.audience][language]} · {camp.createdAt}</p>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 max-w-md">{camp.message}</p>
              </div>
            </div>
            <span className={cn(
              'shrink-0 px-2 py-0.5 rounded-full text-xs font-medium',
              camp.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'
            )}>
              {camp.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'مسودة' : 'Draft')}
            </span>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{language === 'ar' ? 'إنشاء حملة جديدة' : 'Create Campaign'}</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'اسم الحملة (عربي)' : 'Campaign Name (AR)'}</label>
                <input
                  data-testid="input-campaign-name-ar"
                  value={form.nameAr}
                  onChange={e => setForm(p => ({ ...p, nameAr: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</label>
                <select
                  data-testid="select-campaign-audience"
                  value={form.audience}
                  onChange={e => setForm(p => ({ ...p, audience: e.target.value as Campaign['audience'] }))}
                  className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="abandoned_cart">{language === 'ar' ? 'سلة التسوق المهجورة' : 'Abandoned Cart'}</option>
                  <option value="old_customers">{language === 'ar' ? 'العملاء القدامى' : 'Old Customers'}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'قناة الإرسال' : 'Channel'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['sms', 'whatsapp'] as Campaign['channel'][]).map(ch => (
                    <button
                      key={ch}
                      data-testid={`select-channel-${ch}`}
                      onClick={() => setForm(p => ({ ...p, channel: ch }))}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors',
                        form.channel === ch ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'
                      )}
                    >
                      <MessageSquare size={15} />
                      {ch === 'sms' ? 'SMS' : 'WhatsApp'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'نص الرسالة' : 'Message'}</label>
                <textarea
                  data-testid="input-campaign-message"
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  placeholder={language === 'ar' ? 'اكتب نص رسالتك هنا...' : 'Write your message here...'}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
            <div className={cn('p-5 border-t border-border flex gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <button onClick={() => setShowCreate(false)} className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button
                data-testid="button-submit-campaign"
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}</>
                ) : (
                  <><Send size={14} />{language === 'ar' ? 'إنشاء الحملة' : 'Create Campaign'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Affiliates Tab
// ─────────────────────────────────────────────
function AffiliatesTab({ language }: { language: 'ar' | 'en' }) {
  const isRTL = language === 'ar';
  const [affiliates, setAffiliates] = useState<Affiliate[]>(defaultAffiliates);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const { toasts, show } = useToast();

  function generateLink(id: string) {
    setGenerating(id);
    setTimeout(() => {
      const affiliate = affiliates.find(a => a.id === id);
      if (!affiliate) return;
      const slug = affiliate.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const link = `https://mos.sa/ref/${slug}-${Math.random().toString(36).slice(2, 6)}`;
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, link, status: 'active' } : a));
      setGenerating(null);
      show(language === 'ar' ? 'تم إنشاء الرابط!' : 'Referral link generated!');
    }, 1500);
  }

  function copyLink(id: string, link: string) {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(id);
    show(language === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!');
    setTimeout(() => setCopied(null), 2000);
  }

  function updateCommission(id: string, value: number) {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, commission: value } : a));
  }

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          {language === 'ar' ? 'برنامج الشركاء' : 'Affiliate Program'}
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{affiliates.filter(a => a.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'شريك نشط' : 'Active Partners'}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{affiliates.reduce((s, a) => s + a.sales, 0)}</p>
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {affiliates.map(affiliate => (
          <div key={affiliate.id} data-testid={`affiliate-${affiliate.id}`} className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {affiliate.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{affiliate.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? `${affiliate.sales} مبيعة` : `${affiliate.sales} sales`}
                  </p>
                </div>
              </div>

              {/* Commission */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">{language === 'ar' ? 'العمولة:' : 'Commission:'}</label>
                {editingCommission === affiliate.id ? (
                  <input
                    data-testid={`input-commission-${affiliate.id}`}
                    type="number"
                    min={0}
                    max={100}
                    value={affiliate.commission}
                    onChange={e => updateCommission(affiliate.id, Number(e.target.value))}
                    onBlur={() => { setEditingCommission(null); show(language === 'ar' ? 'تم تحديث العمولة' : 'Commission updated'); }}
                    autoFocus
                    className="w-16 h-7 px-2 bg-background border border-primary rounded text-sm text-foreground outline-none text-center"
                  />
                ) : (
                  <button
                    data-testid={`button-edit-commission-${affiliate.id}`}
                    onClick={() => setEditingCommission(affiliate.id)}
                    className="px-2 py-0.5 rounded text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    {affiliate.commission}%
                  </button>
                )}
              </div>

              {/* Link actions */}
              <div className="flex items-center gap-2">
                {affiliate.link ? (
                  <>
                    <span className="text-xs text-muted-foreground truncate max-w-[140px] hidden sm:block">{affiliate.link}</span>
                    <button
                      data-testid={`button-copy-link-${affiliate.id}`}
                      onClick={() => copyLink(affiliate.id, affiliate.link)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        copied === affiliate.id
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'border border-border hover:bg-muted text-foreground'
                      )}
                    >
                      {copied === affiliate.id ? <Check size={12} /> : <Copy size={12} />}
                      {copied === affiliate.id ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}
                    </button>
                  </>
                ) : (
                  <button
                    data-testid={`button-generate-link-${affiliate.id}`}
                    onClick={() => generateLink(affiliate.id)}
                    disabled={generating === affiliate.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {generating === affiliate.id ? (
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : <ExternalLink size={12} />}
                    {language === 'ar' ? 'إنشاء رابط' : 'Generate Link'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        data-testid="button-add-affiliate"
        onClick={() => {
          const newAffiliate: Affiliate = {
            id: `a${Date.now()}`,
            name: language === 'ar' ? 'شريك جديد' : 'New Affiliate',
            commission: 10,
            link: '',
            sales: 0,
            status: 'inactive',
          };
          setAffiliates(prev => [...prev, newAffiliate]);
        }}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Users size={15} />
        {language === 'ar' ? 'إضافة شريك جديد' : 'Add New Affiliate'}
      </button>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Growth Page
// ─────────────────────────────────────────────
export default function Growth() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>('funnels');

  const tabs: Array<{ key: Tab; label: string; labelAr: string; icon: React.ReactNode }> = [
    { key: 'funnels', label: 'Funnels', labelAr: 'مسارات التحويل', icon: <Zap size={15} /> },
    { key: 'retargeting', label: 'Retargeting', labelAr: 'إعادة الاستهداف', icon: <ChevronRight size={15} /> },
    { key: 'affiliates', label: 'Affiliates', labelAr: 'الشركاء', icon: <Users size={15} /> },
  ];

  return (
    <div className="flex flex-col h-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Tab bar */}
      <div className="border-b border-border bg-card px-6">
        <div className="flex items-center gap-1 -mb-px">
          {tabs.map(({ key, label, labelAr, icon }) => (
            <button
              key={key}
              data-testid={`tab-growth-${key}`}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {icon}
              {language === 'ar' ? labelAr : label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'funnels' && <FunnelsTab language={language} />}
        {tab === 'retargeting' && <RetargetingTab language={language} />}
        {tab === 'affiliates' && <AffiliatesTab language={language} />}
      </div>
    </div>
  );
}
