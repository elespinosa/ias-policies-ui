import { api } from "./api";

export const getTableOptions = () => {
  const permission = {
    view: true,
    edit: true,
    delete: true,
  };
  const options = {
    headers: [],
    actions: [
      {
        id: "view",
        label: "View Details",
        withIcon: true,
        type: "icon",
        action: "#view",
        permission: permission.view,
      },
      {
        id: "edit",
        label: "Edit Claim",
        withIcon: true,
        type: "default",
        action: "#edit",
        permission: permission.edit,
      },
      {
        id: "delete",
        label: "Delete Claim",
        withIcon: true,
        type: "default",
        action: "#delete",
        permission: permission.delete,
        destructive: true,
      },
    ],
  };
  return options;
};

export const addClaim = async (claim) => {
  try {
    const response = await api.post("/api/claims", claim);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to add claim: " + (error.message || "Unknown error")
    );
  }
};

export const updateClaim = async (claim) => {
  try {
    const response = await api.patch("/api/claims", claim);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to update claim: " + (error.message || "Unknown error")
    );
  }
};

export const deleteClaim = async (claimId: string) => {
  try {
    const response = await api.delete(`/api/claim/${claimId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      "Failed to delete claim: " + (error.message || "Unknown error")
    );
  }
};
