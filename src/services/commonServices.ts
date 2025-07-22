import { api } from "./api";
import { createCSRFHeaders } from "@/lib/utils";

export const fetchCgRefCodesRvDomain = async (rvDomain) => {
    try {
      // Get CSRF headers
      // const headersObject = await getCsrfHeaders();

        
      const response = await api.post(
        "/api/cg_ref_codes_listing",
        { p_rv_domain: rvDomain},     
        // {
        //   headers: headersObject,
        //   withCredentials: true // Important for cookies
        // }
      );
      // console.log("cg_ref_codes_listing : ", response.data.data);
      return response.data.data;
    } catch (error: any) {
      throw new Error("Failed to fetch claims: " + (error.message || "Unknown error"));
    }
  }

export const handleLogout = () => {
  // Clear any stored credentials
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  
  // Redirect to login page
  window.location.href = '/';
};

export const fetchCollectionSchema = async (table_name: string) => {
  try {
    const response = await api.get(`/api/collectionsSchema`, {
      params: {
        p_table_name: table_name
      }
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error('Failed to get collection schema: ' + (error.message || 'Unknown error'));
  }
};