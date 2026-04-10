import { useLanguage } from './LanguageContext';
import ar from './ar.json';
import en from './en.json';

const translations = { ar, en };

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof ar) => {
    return translations[language][key] || key;
  };
  
  return { t, language };
}
