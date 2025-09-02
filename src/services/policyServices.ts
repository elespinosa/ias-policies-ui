import { InsertUpdatePolicyI, PolicyListing } from "@/lib/types";
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

export interface PolicyDetailI {
  policy_id: number;
  policy_number: string;
  ref_policy_number?: string;
  type: string;
  partner_id: number;
  partner_name: string;
  product_id: number;
  product_name: string;
  client_id: number;
  client_name: string;
  status: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  currency_rate: number;
  premium: string | number;
  payment_frequency: string;
  coverage: string | number;
  deductible: string | number;
  payment_method_id: number;
  auto_renewal: number;
  agent_id: number;
  commission_rate: number;
  insured_properties: string;
  underwriting_notes: string;

  client_type: string;
  preferred_communication: string;
  mobile_phone: string;
  landline_phone: string;
  billing_address: string;
  email: string;
  effective_date: string;
  expiration_date: string;
  date_created: string;
  updated_at: string;
}

export const fetchPolicy = async (policyId: string | number) => {
  try {
    console.log("policyId", policyId);
    const response = await api.get("/api/policyDetails", {
      params: { id: policyId },
    });

    return response.data.data as PolicyDetailI[];
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
  productType: string;
  isActive: number | string;
}

export const fetchPolicyProductsByType = async () => {
  try {
    const response = await api.get("/api/get-policy-products-by-type");
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
  insuredProperties?: string;
  notes?: string;
}

export const insertUpdatePolicy = async (
  policyDetails: InsertUpdatePolicyI
) => {
  try {
    await api.post("/api/createPolicy", policyDetails);
  } catch (error: any) {
    throw new Error(
      "Failed to update policy: " + (error.message || "Unknown error")
    );
  }
};

export interface IClientLov {
  id: number;
  client_type: string;
  name: string;
  email: string;
  customer_type: string;
  total_records: number;
}

export const fetchClientsLov = async (
  searchValue: string,
  rowFrom?: any,
  rowTo?: any
) => {
  try {
    const offset = (rowFrom - 1) * rowTo;
    const response = await api.get("/api/clients-lov", {
      params: {
        p_search: searchValue ? searchValue : null,
        p_page_no: offset,
        p_rows_per_page: rowTo,
      },
    });
    return response.data.data as IClientLov[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch claim policies: " + (error.message || "Unknown error")
    );
  }
};

export interface ICurrencyLov {
  currency_code: string;
  symbol: string;
  currency_name: string;
  currency_rate: number;
}

export const fetchCurrencyLov = async () => {
  try {
    const response = await api.get("/api/currency-lov", {});
    return response.data.data as ICurrencyLov[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch claim policies: " + (error.message || "Unknown error")
    );
  }
};

export interface IPaymentFrequencyLov {
  payment_frequency: string;
}

export const fetchPaymentFrequencyLov = async () => {
  try {
    const response = await api.get("/api/payment-frequency-lov", {});
    return response.data.data as IPaymentFrequencyLov[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch claim policies: " + (error.message || "Unknown error")
    );
  }
};

export interface IQuoteLov {
  id: number;
  quote_number: string;
  type: string;
  policy_type: string;
  client_id: number;
  client_name: string;
  partner_id: number;
  partner_name: string;
  product_id: number;
  product_name: string;
  start_date: string;
  end_date: string;
  quoted_premium: number | string;
  coverage_amount: number | string;
  deductible_amount: number | string;
  quote_data: string;
  status: string;
  total_records: number;
}

export const fetchQuotesLov = async (
  searchValue: string,
  rowFrom?: any,
  rowTo?: any
) => {
  try {
    const offset = (rowFrom - 1) * rowTo;
    const response = await api.get("/api/policy/quotes-lov", {
      params: {
        p_search: searchValue ? searchValue : null,
        p_page_no: offset,
        p_rows_per_page: rowTo,
      },
    });
    return response.data.data as IQuoteLov[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch claim policies: " + (error.message || "Unknown error")
    );
  }
};
