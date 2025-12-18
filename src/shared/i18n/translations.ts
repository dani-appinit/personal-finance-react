// Internationalization - Translations
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

export const translations = {
  en: enTranslations,
  es: esTranslations,
};

export type TranslationKey = keyof typeof enTranslations;

export const useTranslation = (language: 'en' | 'es') => {
  return (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
};
