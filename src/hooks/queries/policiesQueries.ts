import { useQuery } from '@tanstack/react-query';
import { fetchPolicies, fetchPolicy, preparePolicyData, 
  
  getTotalPolicies, fetchPolicyStatus, fetchPolicyMetrics, fetchPolicyProviders } from '@/services/policyServices';

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
  retry: false
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
    queryKey: ['policies', searchValue, status, provider, page, rowsPerPage],
    queryFn: async () => {
      const response = await fetchPolicies(searchValue, status, provider, page, rowsPerPage);
      return preparePolicyData(response);
    },
    enabled: true,
    ...defaultConfig,
    ...config
  });
};

// Policy detail query
export const usePolicyDetailQuery = (
  policyId: string,
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ['policyDetail', policyId],
    queryFn: async () => {
      const response = await fetchPolicy(policyId);
      return response;
    },
    enabled: !!policyId,
    ...defaultConfig,
    ...config
  });
};

// Policy status query
export const usePolicyStatusQuery = (
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ['policiesStatus'],
    queryFn: async () => {      
        const response = await fetchPolicyStatus();
        return response;
    },
    enabled: true, 
    ...defaultConfig,
    ...config
  });
};

// Policy providers query
export const usePolicyProvidersQuery = (
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ['policyProviders'],
    queryFn: async () => {
      const response = await fetchPolicyProviders();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config
  });
};

// Policy metrics query
export const usePolicyMetricsQuery = (
  config?: PolicyQueryConfig
) => {
  return useQuery({
    queryKey: ['policiesMetrics'],  
    queryFn: async () => {
      const response = await fetchPolicyMetrics();
      return response;
    },
    enabled: true,
    ...defaultConfig,
    ...config
  });
};

// Helper function for getting policy table options
// export const getPolicyTableOptions = (provider: string) => {
//   return getTableOptions(provider);
// };

// Helper function for getting total policy count
export const getPolicyTotalCount = (policyList: any[]) => {
  return getTotalPolicies(policyList);
};