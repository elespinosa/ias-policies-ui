import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createCSRFHeaders(): Promise<HeadersInit> {
  const { getCsrfToken } = await import('./csrfUtils');
  const token = await getCsrfToken();
  
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
  };
}
