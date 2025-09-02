import { PolicyListing } from "@/lib/types";
import {
  fetchClientsLov,
  fetchCurrencyLov,
  fetchPaymentFrequencyLov,
  fetchPolicies,
  fetchPolicy,
  fetchPolicyMetrics,
  fetchPolicyProductsByType,
  fetchPolicyProviders,
  fetchPolicyStatus,
  fetchPolicyTypes,
  fetchQuotesLov,
  preparePolicyData,
} from "@/services/policyServices";
import { useQuery } from "@tanstack/react-query";

// Common types
export interface PolicyQueryConfig {
  staleTime?: number;
  gcTime?: number;
  retry?: boolean;
}

// Common configuration
const defaultConfig: PolicyQueryConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
  retry: false,
};

// Policy listing query
export const usePolicyListingQuery = (
  searchValue: string | null,
  status: string | null,
  provider: string | null,
  page: number,
  rowsPerPage: number,
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ["policies", searchValue, status, provider, page, rowsPerPage],
    queryFn: async () => {
      const response = await fetchPolicies(
        searchValue,
        status,
        provider,
        page,
        rowsPerPage
      );
      return preparePolicyData(response) as PolicyListing[];
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

// Policy detail query
export const usePolicyDetailQuery = (
  policyId: string | number,
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ["policyDetail", policyId],
    queryFn: async () => {
      const response = await fetchPolicy(policyId);
      return response;
    },
    enabled: !!policyId,
    ...defaultConfig,
    ...config,
  });
};

// Policy status query
export const usePolicyStatusQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["policiesStatus"],
    queryFn: async () => {
      const response = await fetchPolicyStatus();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

// Policy providers query
export const usePolicyProvidersQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["policyProviders"],
    queryFn: async () => {
      const response = await fetchPolicyProviders();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

// Policy metrics query
export const usePolicyMetricsQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["policiesMetrics"],
    queryFn: async () => {
      const response = await fetchPolicyMetrics();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

// Policy types query
export const usePolicyTypesQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["policiesTypes"],
    queryFn: fetchPolicyTypes,
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

// Policy provider per type
export const usePolicyProductsByTypeQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["fetchPolicyProductsByType"],
    queryFn: async () => {
      const response = await fetchPolicyProductsByType();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};
// Helper function for getting policy table options
// export const getPolicyTableOptions = (provider: string) => {
//   return getTableOptions(provider);
// };

// Common types

export const useClientsLovQuery = (
  searchValue: string | null,
  page: number,
  rowsPerPage: number,
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ["clients-policy", searchValue, page, rowsPerPage],
    queryFn: async () => {
      const response = await fetchClientsLov(searchValue, page, rowsPerPage);
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

export const useCurrencyLovQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["currency-lov"],
    queryFn: async () => {
      const response = await fetchCurrencyLov();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

export const usePaymentFrequencyLovQuery = (config?: PolicyQueryConfig) => {
  return useQuery({
    queryKey: ["payment-frequency-lov"],
    queryFn: async () => {
      const response = await fetchPaymentFrequencyLov();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};

export const useQuotesLovQuery = (
  searchValue: string | null,
  page: number,
  rowsPerPage: number,
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ["quotes-lov", searchValue, page, rowsPerPage],
    queryFn: async () => {
      const response = await fetchQuotesLov(searchValue, page, rowsPerPage);
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config,
  });
};
