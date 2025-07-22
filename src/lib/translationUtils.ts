import { translatableKeys } from '@/functions/commonLists';

type TranslatableKey = {
  view: string;
  key: string;
  namespace: 'common' | 'headers' | 'pages';
};

/**
 * Checks if a value needs translation based on the view and key
 * @param key - The key in format 'view.key' (e.g., 'clients.status')
 * @returns boolean indicating if the value needs translation
 */
export const isTranslatableValue = (key: string): boolean => {
  const [view, field] = key.split('.');
  return translatableKeys.some(item => item.view === view && item.key === field);
};

/**
 * Gets the namespace for a translatable key
 * @param key - The key in format 'view.key' (e.g., 'clients.status')
 * @returns The namespace for the key or null if not found
 */
export const getTranslationNamespace = (key: string): string | null => {
  const [view, field] = key.split('.');
  const item = translatableKeys.find(item => item.view === view && item.key === field);
  return item ? item.namespace : null;
};

/**
 * Gets the full translation key for a translatable value
 * @param key - The key in format 'view.key' (e.g., 'clients.status')
 * @returns The full translation key (e.g., 'common:status') or null if not found
 */
export const getTranslationKey = (key: string): string | null => {
  return key ? `common:${key}` : key;
}; 