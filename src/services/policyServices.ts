import { PolicyListing } from "@/lib/types";
import { api } from "./api";

export const getTableOptions = (t: (key: string) => string) => {
  const permission = {
    view: true,
    edit: true,
    renew: true,
    fileClaim: true,
    applyPayment: true,
    cancel: true,
  };
  const options = {
    headers: [],
    actions: [
      {
        id: "view",
        label: t("rowButtons:view"),
        withIcon: true,
        type: "icon",
        action: "#view",
        permission: permission.view,
      },
      {
        id: "edit",
        label: t("common:edit"),
        withIcon: false,
        type: "default",
        action: "#edit",
        permission: permission.edit,
      },
      {
        id: "renew",
        label: t("rowButtons:renew"),
        withIcon: false,
        type: "default",
        action: "#renew",
        permission: permission.renew,
      },
      {
        id: "fileClaim",
        label: t("rowButtons:fileClaim"),
        withIcon: true,
        type: "default",
        action: "#fileClaim",
        permission: permission.fileClaim,
      },
      {
        id: "applyPayment",
        label: t("rowButtons:applyPayment"),
        withIcon: true,
        type: "default",
        action: "#applyPayment",
        permission: permission.applyPayment,
      },
      {
        id: "cancel",
        label: t("rowButtons:cancel"),
        withIcon: false,
        type: "default",
        destructive: true,
        action: "#cancel",
        permission: permission.cancel,
      },
    ].filter((option) => option.permission),
  };
  return options;
};

export const fetchPolicy = async (policyId: string | number) => {
  try {
    const response = await api.get<PolicyListing[]>("/api/policyDetails", {
      params: { id: policyId },
    });

    //@ts-ignore
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy: " + (error.message || "Unknown error")
    );
  }
};

export const fetchPolicies = async (
  searchValue: string,
  status: string,
  provider: string,
  pageNo?: any,
  rowPerPage?: any
): Promise<PolicyListing[]> => {
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
      {
        params: {
          p_search: searchValue ? searchValue : null,
          p_status: status ? status : null,
          p_page_no: offset,
          p_rows_per_page: rowPerPage,
          p_partner_id: provider,
        },
      }
      // {
      //   headers: headersObject,
      //   withCredentials: true // Important for cookies
      // }
    );
    //@ts-ignore
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy: " + (error.message || "Unknown error")
    );
  }
};

export const fetchPolicyStatus = async () => {
  try {
    const response = await api.get("/api/policyStatus");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy: " + (error.message || "Unknown error")
    );
  }
};

export const fetchPolicyProviders = async () => {
  try {
    const response = await api.get("/api/policy-providers");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy: " + (error.message || "Unknown error")
    );
  }
};

export const fetchPolicyMetrics = async () => {
  try {
    const response = await api.get("/api/policy-metrics");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy metrics: " + (error.message || "Unknown error")
    );
  }
};

export interface IPolicyType {
  type: string;
}

export const fetchPolicyTypes = async () => {
  try {
    const response = await api.get("/api/policy-types");
    return response.data.data as IPolicyType[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy types: " + (error.message || "Unknown error")
    );
  }
};

export interface IPolicyProviderPerType {
  providerId: number;
  provider: string;
  productId: number;
  productName: string;
}

export const fetchPolicyProductsByType = async (type?: string) => {
  try {
    const response = await api.get("/api/get-policy-products-by-type", {
      params: {
        p_type: type,
      },
    });
    return response.data.data as IPolicyProviderPerType[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch policy types: " + (error.message || "Unknown error")
    );
  }
};

export const getTotalPolicies = (policyList) => {
  const totalRecords = policyList[0]?.total_records;
  return totalRecords ? totalRecords : policyList.length;
};

export const preparePolicyData = (data) => {
  let counter = 1;
  const updatedData = data.map((row) => ({
    ...row,
    id: row.id ?? counter++,
  }));
  return updatedData;
};

export const renewPolicy = async (
  p_policy_id: number
): Promise<{ message: string } | null> => {
  try {
    const response = await api.post("/api/renew-policy", { p_policy_id });
    const data: any[] = response.data.data as any[];

    if (data.length === 0) {
      return { message: "success" };
    } else {
      return data[0];
    }
  } catch (error: any) {
    throw new Error(
      "Failed to update renewal status: " + (error.message || "Unknown error")
    );
  }
};

export const cancelPolicy = async (
  p_policy_id: number,
  p_cancellation_reason: string
) => {
  try {
    const response = await api.post("/api/cancel-policy", {
      p_policy_id,
      p_cancellation_reason,
    });
  } catch (error: any) {
    throw new Error(
      "Failed to cancel policy: " + (error.message || "Unknown error")
    );
  }
};

export const generateCSVExcel = async (fileType: String, data: String) => {
  try {
    const response = await api.get("/api/export-file", {
      params: {
        fileType: fileType,
        data: data,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Failed to generate CSV Excel: " + (error.message || "Unknown error")
    );
  }
};
export interface updatePolicyDetailsI {
  startDate: string;
  endDate: string;
  premium: number;
  coverage: number;
  deductible: number;
  beneficiaries?: string;
  notes?: string;
}

export const updatePolicy = async (
  policyId: number,
  policyDetails: updatePolicyDetailsI
) => {
  try {
    await api.post("/api/update-policy", {
      ...policyDetails,
      policyId: policyId,
    });
  } catch (error: any) {
    throw new Error(
      "Failed to update policy: " + (error.message || "Unknown error")
    );
  }
};
