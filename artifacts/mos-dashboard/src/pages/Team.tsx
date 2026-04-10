import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { teamMembers } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  support: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
};

export default function Team() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const roleLabel = (role: string) => {
    const key = `team.role.${role}` as Parameters<typeof t>[0];
    return t(key);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-card border border-border rounded-xl p-5 h-36 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn('flex', isRTL ? 'justify-start' : 'justify-end')}>
        <button
          data-testid="button-add-member"
          onClick={() => setShowModal(true)}
          className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          {t('team.addMember')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div
            key={member.id}
            data-testid={`card-member-${member.id}`}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
                {member.avatar}
              </div>
              <StatusBadge status={member.status} language={language} />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">{member.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{member.email}</p>
            <div className="flex items-center justify-between">
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', roleColors[member.role])}>
                {roleLabel(member.role)}
              </span>
              <span className="text-xs text-muted-foreground">{member.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t('team.addMember')}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('customers.name')}</label>
                <input className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('team.email')}</label>
                <input type="email" className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">{t('team.role')}</label>
                <select className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="admin">{t('team.role.admin')}</option>
                  <option value="manager">{t('team.role.manager')}</option>
                  <option value="support">{t('team.role.support')}</option>
                  <option value="viewer">{t('team.role.viewer')}</option>
                </select>
              </div>
            </div>
            <div className={cn('p-5 border-t border-border flex gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <button
                data-testid="button-cancel-add-member"
                onClick={() => setShowModal(false)}
                className="flex-1 h-9 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                data-testid="button-save-member"
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
