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
  } = {}
): string => {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
  const currency = getDefaultCurrency();

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
    return `${currency.symbol}${formatted}`;
  } catch (error) {
    // Fallback formatting
    const formatted = numericAmount.toFixed(maximumFractionDigits);
    return `${currency.symbol}${formatted}`;
  }
};
