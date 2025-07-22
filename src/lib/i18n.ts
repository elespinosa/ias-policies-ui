import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enCommon from '../translations/en/common.json';
import frCommon from '../translations/fr/common.json';
import zhCommon from '../translations/zh/common.json';
import esCommon from '../translations/es/common.json';
import koCommon from '../translations/ko/common.json';
import jaCommon from '../translations/ja/common.json';
import arCommon from '../translations/ar/common.json';
import viCommon from '../translations/vi/common.json';
import deCommon from '../translations/de/common.json';

// Get all available namespaces from the English translation file
const availableNamespaces = Object.keys(enCommon);

// Create resources object dynamically
const resources = {
  en: Object.fromEntries(availableNamespaces.map(ns => [ns, enCommon[ns]])),
  fr: Object.fromEntries(availableNamespaces.map(ns => [ns, frCommon[ns] || {}])),
  zh: Object.fromEntries(availableNamespaces.map(ns => [ns, zhCommon[ns] || {}])),
  es: Object.fromEntries(availableNamespaces.map(ns => [ns, esCommon[ns] || {}])),
  ko: Object.fromEntries(availableNamespaces.map(ns => [ns, koCommon[ns] || {}])),
  ja: Object.fromEntries(availableNamespaces.map(ns => [ns, jaCommon[ns] || {}])),
  ar: Object.fromEntries(availableNamespaces.map(ns => [ns, arCommon[ns] || {}])),
  vi: Object.fromEntries(availableNamespaces.map(ns => [ns, viCommon[ns] || {}])),
  de: Object.fromEntries(availableNamespaces.map(ns => [ns, deCommon[ns] || {}])),
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
    defaultNS: 'common', // Default namespace
    ns: availableNamespaces, // Available namespaces
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Listen for language changes from the shell
window.addEventListener('languageChange', ((event: CustomEvent) => {
  const newLanguage = event.detail?.language;
  if (newLanguage && i18n.languages.includes(newLanguage)) {
    i18n.changeLanguage(newLanguage);
  }
}) as EventListener);

export default i18n; 