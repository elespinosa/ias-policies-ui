import { defaultCurrency } from "@/functions/commonLists";
import { clsx, type ClassValue } from "clsx";
import { t } from "i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createCSRFHeaders(): Promise<HeadersInit> {
  const { getCsrfToken } = await import("./csrfUtils");
  const token = await getCsrfToken();

  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": token,
  };
}

export function getDefaultCurrency() {
  return defaultCurrency(t)["peso"];
}

/**
 * Format a number as Philippine Peso currency without the currency symbol
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted number string with ₱ prefix
 */
export const formatCurrency = (
  amount: number | string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    withSymbol?: boolean;
    currencyCode?: string;
  } = {}
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    currencyCode,
    withSymbol = true,
  } = options;
  let currencies = defaultCurrency(t);
  let currency =
    Object.values(currencies).find(
      (currency) => currency.code === currencyCode
    ) ?? getDefaultCurrency();

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return currency.symbol + "0.00";
  }

  try {
    const formatted = numericAmount.toLocaleString("en-US", {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return `${withSymbol ? currency.symbol : ""}${formatted}`;
  } catch (error) {
    // Fallback formatting
    const formatted = numericAmount.toFixed(maximumFractionDigits);
    return `${withSymbol ? currency.symbol : ""}${formatted}`;
  }
};

/**
 * Unformat a money string by removing currency symbols, commas, and other formatting
 * @param formattedAmount - The formatted money string (e.g., "₱1,234.56", "$1,234.56", "1,234.56")
 * @returns The numeric value as a number, or 0 if invalid
 */
export const unformatMoney = (formattedAmount: string | number): number => {
  if (typeof formattedAmount === "number") {
    return formattedAmount;
  }

  if (typeof formattedAmount !== "string") {
    return 0;
  }

  // Remove all non-numeric characters except decimal points and minus signs
  // This handles currency symbols (₱, $, €, £, etc.), commas, spaces, and other formatting
  const cleanedString = formattedAmount
    .replace(/[^\d.-]/g, "") // Remove everything except digits, decimal points, and minus signs
    .replace(/^\./, "") // Remove leading decimal point
    .replace(/\.(?=.*\.)/g, ""); // Remove all decimal points except the last one

  const numericValue = parseFloat(cleanedString);

  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Unformat a money string and return as a string (useful for form inputs)
 * @param formattedAmount - The formatted money string
 * @returns The numeric value as a string, or "0" if invalid
 */
export const unformatMoneyToString = (
  formattedAmount: string | number
): string => {
  const numericValue = unformatMoney(formattedAmount);
  return numericValue.toString();
};
