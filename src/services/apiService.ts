import type { MappingTemplate } from "@/utils/localStorage";

const API_BASE_URL = "http://localhost:3001/api"; // Change to your API base URL if needed

// Helper function to clean mappings before sending to API
const cleanMappingsForAPI = (mappings: any[]) => {
  return mappings.map((mapping) => ({
    ...mapping,
    tableColumn: mapping.tableColumn || "", // Convert null to empty string
    skip: String(mapping.skip), // Convert boolean to string
    useDefaultValue: String(mapping.useDefaultValue), // Convert boolean to string
  }));
};

// Helper function to create a template object from input data
const createTemplateFromInput = (
  template: Omit<MappingTemplate, "id" | "createdAt">
): MappingTemplate => {
  return {
    id: Date.now().toString(), // Generate a temporary ID
    name: template.name,
    tableName: template.tableName,
    mappings: template.mappings,
    createdAt: new Date().toISOString(),
  };
};

// Helper function to transform backend template format to frontend format
const transformBackendTemplate = (backendTemplate: any): MappingTemplate => {
  // Transform mappings to convert string booleans to actual booleans
  const transformedMappings = (backendTemplate.mappings || []).map(
    (mapping: any) => ({
      fileHeader: mapping.fileHeader,
      tableColumn: mapping.tableColumn || null,
      skip: mapping.skip === "true" || mapping.skip === true, // Convert string to boolean
      useDefaultValue:
        mapping.useDefaultValue === "true" || mapping.useDefaultValue === true, // Convert string to boolean
    })
  );

  return {
    id: String(backendTemplate.id), // Convert number to string
    name: backendTemplate.name,
    tableName: backendTemplate.table_name, // Convert table_name to tableName
    mappings: transformedMappings,
    createdAt: backendTemplate.created_at || new Date().toISOString(), // Convert created_at to createdAt
  };
};

export const apiService = {
  async getTemplates(): Promise<MappingTemplate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("GET /templates Error Response:", errorText);
        throw new Error(
          `Failed to fetch templates: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("GET /templates response:", responseData);

      // Check if the response has the expected structure
      if (responseData.success && Array.isArray(responseData.data)) {
        // Transform backend format to frontend format
        const templates = responseData.data.map(transformBackendTemplate);
        console.log("Transformed templates:", templates);
        return templates;
      } else {
        console.warn("Unexpected response structure:", responseData);
        return [];
      }
    } catch (error) {
      console.error("Error in getTemplates:", error);
      return []; // Return empty array instead of throwing
    }
  },

  async getTemplatesForTable(tableName: string): Promise<MappingTemplate[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/templates?table=${encodeURIComponent(tableName)}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("GET /templates?table Error Response:", errorText);
        throw new Error(
          `Failed to fetch templates for table: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("GET /templates?table response:", responseData);

      // Check if the response has the expected structure
      if (responseData.success && Array.isArray(responseData.data)) {
        // Transform backend format to frontend format
        const templates = responseData.data.map(transformBackendTemplate);
        console.log("Transformed templates for table:", templates);
        return templates;
      } else {
        console.warn("Unexpected response structure:", responseData);
        return [];
      }
    } catch (error) {
      console.error("Error in getTemplatesForTable:", error);
      return []; // Return empty array instead of throwing
    }
  },

  async saveTemplate(
    template: Omit<MappingTemplate, "id" | "createdAt">
  ): Promise<MappingTemplate> {
    const cleanedTemplate = {
      ...template,
      mappings: cleanMappingsForAPI(template.mappings),
    };

    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedTemplate),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to save template: ${response.status} ${response.statusText}`
      );
    }

    // Since your backend returns database query results instead of JSON,
    // we'll create a template object from the input data
    const savedTemplate = createTemplateFromInput(template);
    console.log("Template saved successfully, returning:", savedTemplate);
    return savedTemplate;
  },

  async updateTemplate(
    id: string,
    template: Partial<MappingTemplate>
  ): Promise<MappingTemplate> {
    const cleanedTemplate = {
      ...template,
      mappings: template.mappings
        ? cleanMappingsForAPI(template.mappings)
        : undefined,
    };

    console.log("Sending update request:", cleanedTemplate);

    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedTemplate),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to update template: ${response.status} ${response.statusText}`
      );
    }

    // Parse the backend response
    try {
      const responseData = await response.json();
      console.log("Update response:", responseData);

      if (responseData.success) {
        if (responseData.data && responseData.data.length > 0) {
          // Backend returned partial data - merge with input data
          console.log("Backend returned partial data, merging with input");
          const backendData = responseData.data[0]; // Get the first object from the array

          const updatedTemplate = {
            id,
            name: backendData.name || cleanedTemplate.name || "",
            tableName: cleanedTemplate.tableName || "",
            mappings: cleanedTemplate.mappings || [],
            createdAt: new Date().toISOString(),
          };
          console.log(
            "Template updated successfully, returning:",
            updatedTemplate
          );
          return updatedTemplate;
        } else {
          // Backend returned success but no data - create template from input data
          console.log(
            "Backend returned success but no data, creating template from input"
          );
          const updatedTemplate = {
            id,
            name: cleanedTemplate.name || "",
            tableName: cleanedTemplate.tableName || "",
            mappings: cleanedTemplate.mappings || [],
            createdAt: new Date().toISOString(),
          };
          console.log(
            "Template updated successfully, returning:",
            updatedTemplate
          );
          return updatedTemplate;
        }
      } else {
        console.warn("Backend returned success: false:", responseData);
        throw new Error("Update failed on server");
      }
    } catch (jsonError) {
      console.error("Failed to parse update response:", jsonError);
      throw new Error("Invalid response from server");
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete template");
  },

  async getTemplateById(id: string): Promise<MappingTemplate> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("GET /templates/:id Error Response:", errorText);
        throw new Error(
          `Failed to fetch template: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("GET /templates/:id response:", responseData);

      // Check if the response has the expected structure
      if (responseData.success && responseData.data) {
        return transformBackendTemplate(responseData.data);
      } else {
        console.warn("Unexpected response structure:", responseData);
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error in getTemplateById:", error);
      throw new Error("Failed to fetch template");
    }
  },
};
