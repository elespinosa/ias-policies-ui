import { api } from "@/services/api";

// Utility for managing CSRF token
let csrfToken: string | null = null;

// Fetch the CSRF token from the server
export const fetchCsrfToken = async (): Promise<string> => {
  try {
    if (csrfToken) return csrfToken;
    
    const response = await api.get("/csrf-token");

    if (response.status >= 200 && response.status < 300) {
        csrfToken = response.data.csrfToken;
        return csrfToken;
    } else {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Get the stored token or fetch a new one
export const getCsrfToken = async (): Promise<string> => {
  if (!csrfToken) {
    console.log("Fetching CSRF token...");
    return fetchCsrfToken();
  }
  return csrfToken;
};