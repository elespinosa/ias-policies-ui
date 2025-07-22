import axios from "axios";
import { handleLogout } from "./commonServices";
import { createCSRFHeaders } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import i18next from "i18next";


// const API_BASE_URL = 'http://192.168.30.22:3001'; 
// const API_BASE_URL = 'http://localhost:3001'; 
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Ensures cookies are sent
});

let csrfToken: string | null = null;

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          showToast(data.message || i18next.t('messages:session_expired'), "error");
          handleLogout();
          break;
        case 403:
          showToast(data.message || i18next.t('messages:no_permission'), "error");
          break;
        case 404:
          showToast(data.message || i18next.t('messages:not_found'), "error");
          break;
        case 500:
          showToast(data.message || i18next.t('messages:internal_server_error'), "error"); 
          break;
        default:
          showToast(data.message || i18next.t('messages:error'), "error");
      }
    } else if (error.request) {
      showToast(i18next.t('messages:no_response'), "error");
    } else {
      showToast(error.message, "error");
    }

    return Promise.reject(error);
  }
);

// // Helper function to fetch CSRF token
// export const fetchCsrfToken = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
//       withCredentials: true
//     });
//     csrfToken = response.data.csrfToken;
//     return csrfToken;
//   } catch (error) {
//     console.error('Failed to fetch CSRF token:', error);
//     throw error;
//   }
// };

export const getCsrfHeaders = async () => {
  const csrfHeaders = await createCSRFHeaders();
      // Make the request with CSRF token
  const headersObject: Record<string, string> = csrfHeaders instanceof Headers 
    ? Object.fromEntries(csrfHeaders.entries())
    : Array.isArray(csrfHeaders)
      ? Object.fromEntries(csrfHeaders)
      : csrfHeaders;
  return headersObject;
}

