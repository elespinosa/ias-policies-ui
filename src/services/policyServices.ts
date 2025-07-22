import { PolicyListing } from "@/lib/types";
import { api } from "./api";
import { createCSRFHeaders } from "@/lib/utils";


export const getTableOptions = (t: (key: string) => string) => {

  const permission = {
    "view": true,
    "edit": true,
    "renew": true,
    "fileClaim": true,
    "applyPayment": true    
  }
  const options = {
    headers: [],
    actions: [
      {id:'view', label: t('rowButtons:view'), withIcon: true, type: 'icon', action: "#view", permission: permission.view},
      {id:'edit', label: t('common:edit'), withIcon: true, type: 'default', action: "#edit", permission: permission.edit},
      {id:'renew', label: t('rowButtons:renew'), withIcon: true, type: 'default', action: "#renew", permission: permission.renew},
      {id:'fileClaim', label: t('rowButtons:fileClaim'), withIcon: true, type: 'default', action: "#fileClaim", permission: permission.fileClaim},
      {id:'applyPayment', label: t('rowButtons:applyPayment'), withIcon: true, type: 'default', action: "#applyPayment", permission: permission.applyPayment},
    ].filter(option => option.permission)
  }  
  return options;
}

export const fetchPolicy = async (policyId: string) => {
  try {
    
    const response = await api.get<PolicyListing[]>(
      "/api/policyDetails",
      { params: { id: policyId } },
    );
    //@ts-ignore
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy: " + (error.message || "Unknown error"));
  }
}


export const fetchPolicies = async (searchValue: string, status: string, provider: string, pageNo?: any, rowPerPage?: any): Promise<PolicyListing[]> => {
  try {
    // Get CSRF headers
    // const csrfHeaders = await createCSRFHeaders();
    // Make the request with CSRF token
    const offset = (pageNo - 1) * rowPerPage;
    // const headersObject: Record<string, string> = csrfHeaders instanceof Headers 
    //   ? Object.fromEntries(csrfHeaders.entries())
    //   : Array.isArray(csrfHeaders)
    //     ? Object.fromEntries(csrfHeaders)
    //     : csrfHeaders;
    const response = await api.get<PolicyListing[]>(
      "/api/policyListing",
      { params: { p_search: searchValue ? searchValue : null,
        p_status: status ? status : null,
        p_page_no: offset,
        p_rows_per_page: rowPerPage,
        p_partner_id: provider } },
      // {
      //   headers: headersObject,
      //   withCredentials: true // Important for cookies
      // }
    );
    //@ts-ignore
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy: " + (error.message || "Unknown error"));
  }
};

export const fetchPolicyStatus = async () => {
  try {
    const response = await api.get("/api/policyStatus");
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy: " + (error.message || "Unknown error"));
  }
}

export const fetchPolicyProviders = async () => {
  try {
    const response = await api.get("/api/policy-providers");
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy: " + (error.message || "Unknown error"));
  }
}


export const fetchPolicyMetrics = async () => {
  try {
    const response = await api.get("/api/policy-metrics");
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy metrics: " + (error.message || "Unknown error"));
  }
}


export const getTotalPolicies = (policyList) => {
  const totalRecords = policyList[0]?.total_records;
  return totalRecords ? totalRecords : policyList.length;
}

export const preparePolicyData = (data) => {
  let counter = 1;
  const updatedData = data.map(row => ({
    ...row,
    id: row.id ?? counter++ 
  }));
  return updatedData;
}
