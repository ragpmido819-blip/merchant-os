import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  BarChart2,
  Truck,
  RotateCcw,
  UserCog,
  TrendingUp,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { key: 'nav.dashboard', icon: LayoutDashboard, path: '/' },
  { key: 'nav.orders', icon: ShoppingCart, path: '/orders' },
  { key: 'nav.products', icon: Package, path: '/products' },
  { key: 'nav.customers', icon: Users, path: '/customers' },
  { key: 'nav.inbox', icon: MessageSquare, path: '/inbox' },
  { key: 'nav.analytics', icon: BarChart2, path: '/analytics' },
  { key: 'nav.shipping', icon: Truck, path: '/shipping' },
  { key: 'nav.returns', icon: RotateCcw, path: '/returns' },
  { key: 'nav.team', icon: UserCog, path: '/team' },
  { key: 'nav.growth', icon: TrendingUp, path: '/growth' },
  { key: 'nav.settings', icon: Settings, path: '/settings' },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = language === 'ar';

  const isDark = theme === 'dark';

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  function toggleLanguage() {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="font-bold text-sm text-sidebar-foreground">MOS</p>
            <p className="text-xs text-muted-foreground">Merchant OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ key, icon: Icon, path }) => {
          const isActive = path === '/' ? location === '/' : location.startsWith(path);
          return (
            <Link key={path} href={path}>
              <div
                data-testid={`nav-${path.replace('/', '') || 'dashboard'}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group',
                  isRTL ? 'flex-row' : 'flex-row',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon size={18} className={cn('shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
                <span className="text-sm font-medium">{t(key as Parameters<typeof t>[0])}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">أ</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">أحمد بن عبدالله</p>
            <p className="text-xs text-muted-foreground truncate">مدير</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('flex h-screen bg-background overflow-hidden', isRTL ? 'flex-row-reverse' : 'flex-row')}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-sidebar border-sidebar-border" style={{ borderInlineStart: '1px solid hsl(var(--sidebar-border))' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={cn(
                'fixed top-0 z-50 w-64 h-full bg-sidebar shadow-xl lg:hidden',
                isRTL ? 'right-0' : 'left-0'
              )}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="h-14 shrink-0 bg-card border-b border-border flex items-center justify-between px-4 gap-4">
          <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
            <button
              data-testid="button-toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground">
                {navItems.find(item => item.path === '/' ? location === '/' : location.startsWith(item.path))
                  ? t(navItems.find(item => item.path === '/' ? location === '/' : location.startsWith(item.path))!.key as Parameters<typeof t>[0])
                  : 'MOS'}
              </h1>
            </div>
          </div>

          <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
            {/* Language Toggle */}
            <button
              data-testid="button-toggle-language"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors text-foreground"
            >
              {language === 'ar' ? 'EN' : 'عر'}
            </button>

            {/* Theme Toggle */}
            <button
              data-testid="button-toggle-theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-muted transition-colors relative text-muted-foreground hover:text-foreground">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer hover:bg-primary/30 transition-colors">
              أ
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
