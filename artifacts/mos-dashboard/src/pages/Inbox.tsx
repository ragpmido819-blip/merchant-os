import { useState, useEffect, useRef } from 'react';
import { Send, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguage } from '@/i18n/LanguageContext';
import { conversations, messagesByConv, Conversation } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Inbox() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation>(conversations[0]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected]);

  const messages = messagesByConv[selected.id] || [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-xl h-[calc(100vh-8rem)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-card border border-border rounded-xl h-full flex overflow-hidden">
        {/* Conversations list */}
        <div className={cn('w-72 shrink-0 border-border flex flex-col', isRTL ? 'border-l' : 'border-r')}>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <input
                data-testid="input-search-inbox"
                placeholder={t('common.search')}
                className={cn('w-full h-8 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30', isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3')}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div
                key={conv.id}
                data-testid={`conv-${conv.id}`}
                onClick={() => setSelected(conv)}
                className={cn(
                  'flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border last:border-0',
                  selected.id === conv.id ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                )}
              >
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center shrink-0 font-medium">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
              {selected.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{selected.name}</p>
              <p className="text-xs text-green-500">{language === 'ar' ? 'متصل' : 'Online'}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                data-testid={`msg-${msg.id}`}
                className={cn('flex', msg.sent ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start'))}
              >
                <div className={cn(
                  'max-w-xs px-4 py-2.5 rounded-2xl text-sm',
                  msg.sent
                    ? 'bg-primary text-primary-foreground rounded-ee-sm'
                    : 'bg-muted text-foreground rounded-es-sm'
                )}>
                  <p>{msg.text}</p>
                  <p className={cn('text-xs mt-1', msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <input
                data-testid="input-message"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
                className="flex-1 h-10 px-4 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                data-testid="button-send"
                onClick={() => setInput('')}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
