import { fetchCollectionSchema } from "@/services/commonServices";
import { useQuery } from "@tanstack/react-query";

export interface CommonQueryConfig {
    staleTime?: number;
    gcTime?: number;
    retry?: boolean;
  }

// Common configuration
const defaultConfig: CommonQueryConfig = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: false
  };


export const useCollectionSchemaQuery = (table_name: string, config?: CommonQueryConfig) => {
    return useQuery({
      queryKey: ['collectionSchema', table_name],
      queryFn: async () => {
        const response = await fetchCollectionSchema(table_name);
        return response;
      },
      enabled: true,
      ...defaultConfig,
      ...config
    });
  };