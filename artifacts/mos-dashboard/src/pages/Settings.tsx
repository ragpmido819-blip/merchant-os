import { useState } from 'react';
import {
  Instagram, Globe, MessageCircle,
  Check, Loader2, Link2, Unlink,
  Building2, CreditCard, Truck, Radio,
  ChevronRight, X,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);
  const show = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: { id: string; message: string; type: string }[] }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          'px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2',
          t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {t.type === 'success' ? <Check size={14} /> : <X size={14} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Section = 'general' | 'payment' | 'shipping' | 'channels';

interface Channel {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  username?: string;
}

// ─────────────────────────────────────────────
// General Settings
// ─────────────────────────────────────────────
function GeneralSection({ language, onSave }: { language: 'ar' | 'en'; onSave: () => void }) {
  const isRTL = language === 'ar';
  const [form, setForm] = useState({
    storeName: 'متجر MOS',
    storeNameEn: 'MOS Store',
    email: 'hello@mos.sa',
    phone: '+966 50 000 0000',
    address: 'الرياض، المملكة العربية السعودية',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
  });
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 1200);
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (AR)'}</label>
          <input
            data-testid="input-store-name-ar"
            value={form.storeName}
            onChange={e => setForm(p => ({ ...p, storeName: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (EN)'}</label>
          <input
            data-testid="input-store-name-en"
            value={form.storeNameEn}
            onChange={e => setForm(p => ({ ...p, storeNameEn: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
          <input
            data-testid="input-store-email"
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
          <input
            data-testid="input-store-phone"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'العنوان' : 'Address'}</label>
          <input
            data-testid="input-store-address"
            value={form.address}
            onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'العملة' : 'Currency'}</label>
          <select
            data-testid="select-currency"
            value={form.currency}
            onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="SAR">SAR — ريال سعودي</option>
            <option value="USD">USD — US Dollar</option>
            <option value="AED">AED — درهم إماراتي</option>
            <option value="KWD">KWD — دينار كويتي</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}</label>
          <select
            data-testid="select-timezone"
            value={form.timezone}
            onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}
            className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
            <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
            <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
          </select>
        </div>
      </div>
      <div className={cn('flex', isRTL ? 'justify-start' : 'justify-end')}>
        <button
          data-testid="button-save-general"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Payment Settings
// ─────────────────────────────────────────────
function PaymentSection({ language, onSave }: { language: 'ar' | 'en'; onSave: () => void }) {
  const isRTL = language === 'ar';
  const [methods, setMethods] = useState([
    { id: 'stc', label: 'STC Pay', labelAr: 'STC Pay', enabled: true, icon: '📱' },
    { id: 'mada', label: 'Mada', labelAr: 'مدى', enabled: true, icon: '💳' },
    { id: 'visa', label: 'Visa / Mastercard', labelAr: 'فيزا / ماستركارد', enabled: true, icon: '💳' },
    { id: 'cod', label: 'Cash on Delivery', labelAr: 'الدفع عند الاستلام', enabled: false, icon: '💵' },
    { id: 'apple', label: 'Apple Pay', labelAr: 'Apple Pay', enabled: false, icon: '🍎' },
    { id: 'tabby', label: 'Tabby (BNPL)', labelAr: 'Tabby — اشتري الآن وادفع لاحقاً', enabled: false, icon: '🛍️' },
  ]);
  const [saving, setSaving] = useState(false);

  function toggle(id: string) {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 1000);
  }

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className="text-sm text-muted-foreground">{language === 'ar' ? 'فعّل طرق الدفع المقبولة في متجرك' : 'Enable accepted payment methods for your store'}</p>
      <div className="space-y-3">
        {methods.map(method => (
          <div key={method.id} data-testid={`payment-method-${method.id}`} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <p className="text-sm font-medium text-foreground">{language === 'ar' ? method.labelAr : method.label}</p>
            </div>
            <button
              data-testid={`toggle-payment-${method.id}`}
              onClick={() => toggle(method.id)}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                method.enabled ? 'bg-primary' : 'bg-muted border border-border'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
                method.enabled ? (isRTL ? 'right-0.5' : 'left-5') : (isRTL ? 'right-5' : 'left-0.5')
              )} />
            </button>
          </div>
        ))}
      </div>
      <div className={cn('flex', isRTL ? 'justify-start' : 'justify-end')}>
        <button
          data-testid="button-save-payment"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shipping Settings
// ─────────────────────────────────────────────
function ShippingSection({ language, onSave }: { language: 'ar' | 'en'; onSave: () => void }) {
  const isRTL = language === 'ar';
  const [carriers, setCarriers] = useState([
    { id: 'smsa', label: 'SMSA Express', enabled: true, cost: 25 },
    { id: 'aramex', label: 'Aramex', enabled: true, cost: 30 },
    { id: 'dhl', label: 'DHL', enabled: false, cost: 45 },
    { id: 'naqel', label: 'Naqel', enabled: false, cost: 20 },
  ]);
  const [freeShippingMin, setFreeShippingMin] = useState(300);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 1000);
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">{language === 'ar' ? 'شركات الشحن' : 'Shipping Carriers'}</h4>
        <div className="space-y-3">
          {carriers.map(carrier => (
            <div key={carrier.id} data-testid={`carrier-${carrier.id}`} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{carrier.label}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">{language === 'ar' ? 'التكلفة (SAR):' : 'Cost (SAR):'}</label>
                  <input
                    data-testid={`input-carrier-cost-${carrier.id}`}
                    type="number"
                    value={carrier.cost}
                    onChange={e => setCarriers(prev => prev.map(c => c.id === carrier.id ? { ...c, cost: Number(e.target.value) } : c))}
                    className="w-20 h-7 px-2 bg-background border border-input rounded text-sm text-foreground outline-none text-center focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  data-testid={`toggle-carrier-${carrier.id}`}
                  onClick={() => setCarriers(prev => prev.map(c => c.id === carrier.id ? { ...c, enabled: !c.enabled } : c))}
                  className={cn('relative w-11 h-6 rounded-full transition-colors', carrier.enabled ? 'bg-primary' : 'bg-muted border border-border')}
                >
                  <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', carrier.enabled ? (isRTL ? 'right-0.5' : 'left-5') : (isRTL ? 'right-5' : 'left-0.5'))} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-card border border-border rounded-xl">
        <label className="text-sm font-medium text-foreground block mb-2">
          {language === 'ar' ? 'الحد الأدنى للشحن المجاني (SAR)' : 'Free Shipping Minimum (SAR)'}
        </label>
        <input
          data-testid="input-free-shipping-min"
          type="number"
          value={freeShippingMin}
          onChange={e => setFreeShippingMin(Number(e.target.value))}
          className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          {language === 'ar' ? 'الطلبات التي تتجاوز هذا المبلغ ستحصل على شحن مجاني' : 'Orders above this amount get free shipping'}
        </p>
      </div>
      <div className={cn('flex', isRTL ? 'justify-start' : 'justify-end')}>
        <button
          data-testid="button-save-shipping"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Channels Section
// ─────────────────────────────────────────────
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.13a8.16 8.16 0 004.77 1.52V7.21a4.85 4.85 0 01-1-.52z"/>
    </svg>
  );
}

function ChannelsSection({ language }: { language: 'ar' | 'en' }) {
  const isRTL = language === 'ar';
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      nameAr: 'إنستغرام',
      icon: <Instagram size={22} />,
      color: 'from-purple-500 via-pink-500 to-orange-400',
      connected: true,
      username: '@mos.store',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      nameAr: 'تيك توك',
      icon: <TikTokIcon size={22} />,
      color: 'from-black to-gray-800',
      connected: false,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      nameAr: 'فيسبوك',
      icon: <Globe size={22} />,
      color: 'from-blue-600 to-blue-800',
      connected: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      nameAr: 'واتساب للأعمال',
      icon: <MessageCircle size={22} />,
      color: 'from-green-500 to-emerald-700',
      connected: true,
      username: '+966 50 000 0000',
    },
  ]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toasts, show } = useToast();

  function handleConnect(id: string) {
    setConnecting(id);
    setTimeout(() => {
      setChannels(prev => prev.map(c => c.id === id ? { ...c, connected: true, username: `@${id}.account` } : c));
      setConnecting(null);
      show(language === 'ar' ? 'تم الربط بنجاح!' : 'Connected successfully!');
    }, 2000);
  }

  function handleDisconnect(id: string) {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, connected: false, username: undefined } : c));
    show(language === 'ar' ? 'تم إلغاء الربط' : 'Disconnected', 'error');
  }

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className="text-sm text-muted-foreground">
        {language === 'ar' ? 'ربط حسابات التواصل الاجتماعي بمتجرك' : 'Connect your social media accounts to your store'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map(channel => (
          <div
            key={channel.id}
            data-testid={`channel-${channel.id}`}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Header gradient */}
            <div className={cn('h-16 bg-gradient-to-r flex items-center px-4 gap-3 text-white', channel.color)}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                {channel.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{language === 'ar' ? channel.nameAr : channel.name}</p>
                {channel.connected && channel.username && (
                  <p className="text-xs opacity-80">{channel.username}</p>
                )}
              </div>
              {channel.connected && (
                <div className="ms-auto flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {language === 'ar' ? 'مرتبط' : 'Connected'}
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="p-4 flex items-center justify-between">
              {channel.connected ? (
                <>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Radio size={12} className="text-green-500" />
                    {language === 'ar' ? 'الحساب مرتبط ونشط' : 'Account linked and active'}
                  </span>
                  <button
                    data-testid={`button-disconnect-${channel.id}`}
                    onClick={() => handleDisconnect(channel.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <Unlink size={12} />
                    {language === 'ar' ? 'إلغاء الربط' : 'Disconnect'}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted-foreground">{language === 'ar' ? 'غير مرتبط' : 'Not connected'}</span>
                  <button
                    data-testid={`button-connect-${channel.id}`}
                    onClick={() => handleConnect(channel.id)}
                    disabled={connecting === channel.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {connecting === channel.id ? (
                      <><Loader2 size={12} className="animate-spin" />{language === 'ar' ? 'جاري الربط...' : 'Connecting...'}</>
                    ) : (
                      <><Link2 size={12} />{language === 'ar' ? 'ربط الحساب' : 'Connect'}</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Settings Page
// ─────────────────────────────────────────────
export default function Settings() {
  const { language } = useLanguage();
  const [section, setSection] = useState<Section>('general');
  const { toasts, show } = useToast();
  const isRTL = language === 'ar';

  const sections: Array<{ key: Section; label: string; labelAr: string; icon: React.ReactNode; desc: string; descAr: string }> = [
    { key: 'general', label: 'General', labelAr: 'عام', icon: <Building2 size={16} />, desc: 'Store info & preferences', descAr: 'معلومات المتجر والتفضيلات' },
    { key: 'payment', label: 'Payment', labelAr: 'الدفع', icon: <CreditCard size={16} />, desc: 'Payment methods', descAr: 'طرق الدفع المقبولة' },
    { key: 'shipping', label: 'Shipping', labelAr: 'الشحن', icon: <Truck size={16} />, desc: 'Carriers & rates', descAr: 'شركات الشحن والتكاليف' },
    { key: 'channels', label: 'Channels', labelAr: 'القنوات', icon: <Radio size={16} />, desc: 'Social integrations', descAr: 'ربط منصات التواصل' },
  ];

  const titles: Record<Section, { ar: string; en: string }> = {
    general: { ar: 'الإعدادات العامة', en: 'General Settings' },
    payment: { ar: 'إعدادات الدفع', en: 'Payment Settings' },
    shipping: { ar: 'إعدادات الشحن', en: 'Shipping Settings' },
    channels: { ar: 'قنوات التواصل', en: 'Channel Integrations' },
  };

  return (
    <div className="flex h-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar nav */}
      <div className="w-56 shrink-0 border-e border-border bg-card p-3 space-y-1">
        {sections.map(({ key, label, labelAr, icon }) => (
          <button
            key={key}
            data-testid={`settings-nav-${key}`}
            onClick={() => setSection(key)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-start transition-colors',
              section === key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
            )}
          >
            <span className={section === key ? 'text-primary-foreground' : 'text-muted-foreground'}>{icon}</span>
            {language === 'ar' ? labelAr : label}
            {section === key && <ChevronRight size={14} className={cn('ms-auto', isRTL ? 'rotate-180' : '')} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">{titles[section][language]}</h2>
        {section === 'general' && <GeneralSection language={language} onSave={() => show(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully')} />}
        {section === 'payment' && <PaymentSection language={language} onSave={() => show(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully')} />}
        {section === 'shipping' && <ShippingSection language={language} onSave={() => show(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully')} />}
        {section === 'channels' && <ChannelsSection language={language} />}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
