import { useTranslation } from 'react-i18next';
import { getHeaderLists } from './commonLists';
import i18next, { t } from 'i18next';
import { format, Locale, parseISO } from 'date-fns';
import { enUS, de, fr, ja, zhCN } from 'date-fns/locale';


type Header = { id: string; label: string; accessor: string; align: string };

export const getHeaders = (data: any[], t: (key: string) => string): Header[] => {  
  // console.log("Header Data",data);
  const keys = Object.keys(data[0] || {});
  const headers: Header[] = [];
  const idToCheck = ["id", "rowno"];
  const headerLists = getHeaderLists(t);

  // Add headers based on the keys in the data
  keys.forEach(key => {
    const headerKey = key.toLowerCase().replace(/\s+/g, '_');
    if (headerLists[headerKey]) {
      headers.push(headerLists[headerKey]);
    } else if(headerKey !== "total_records") {
      const defaultHeader = { id: headerKey, label: headerKey, accessor: headerKey, align: "" }
      headers.push(defaultHeader);
    }
  });
  return headers;
};


export function formatNumberShortLocalized(value: number): string {
  const locale = i18next.language || 'en-US';

  let shortValue: number;
  let suffix = '';

  if (value >= 1_000_000_000) {
    shortValue = value / 1_000_000_000;
    suffix = t('number_suffix:billion');
  } else if (value >= 1_000_000) {
    shortValue = value / 1_000_000;
    suffix = t('number_suffix:million');
  } else if (value >= 1_000) {
    shortValue = value / 1_000;
    suffix = t('number_suffix:thousand');
  } else {
    shortValue = value;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: shortValue < 10 && suffix ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(shortValue);

  return `${formatted}${suffix}`;
}

/**
 * Map i18n language codes to date-fns locale objects
 */
const dateFnsLocaleMap: Record<string, Locale> = {
  'en': enUS,
  'en-US': enUS,
  'de': de,
  'fr': fr,
  'ja': ja,
  'zh': zhCN,
  'zh-CN': zhCN,
  // Add more as needed
};

/**
 * Gets the best matching date-fns locale from i18n
 */
function getDateFnsLocale(): Locale {
  const lng = i18next.language || 'en';
  return dateFnsLocaleMap[lng] || enUS;
}

/**
 * Format number with separators and locale from i18n
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(i18next.language || 'en-US').format(value);
}

/**
 * Format DateTime to 'YYYY-MM-DD'
 */
export function formatDateOnly(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd', { locale: getDateFnsLocale() });
}

/**
 * Format DateTime to 'YYYY-MM-DD h:mmA'
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd h:mma', { locale: getDateFnsLocale() });
}

/**
 * Format DateTime to 'h:mmA'
 */
export function formatTimeOnly(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mma', { locale: getDateFnsLocale() });
}

