import { api } from "./api";


export const getTableOptions = () => {
  const permission = {
    "view": true,
    "edit": true,
    "delete": true,
    "applyPayment": true    
  }
  const options = {
    headers: [],
    actions: [
      {id:'edit', label: 'Edit', withIcon: true, type: 'default', action: "#edit", permission: permission.edit},
      {id:'delete', label: 'Delete', withIcon: true, type: 'default', action: "#delete", permission: permission.delete},
    ]
  }  
  return options;
}

export const fetchPartners = async () => {
  try {
    const response = await api.get("/api/partnersListing");
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch policy: " + (error.message || "Unknown error"));
  }
};

export const fetchPartnerProducts = async (id) => {
  try {
    const response = await api.get("/api/partnerProducts", { params: { id } });
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to fetch partner products: " + (error.message || "Unknown error"));
  }
};

export const addPartner = async (partner) => {
  try {
    const response = await api.post("/api/addPartner", partner);
    return response.data.data;
  } catch (error: any) {
    throw new Error("Failed to add partner: " + (error.message || "Unknown error"));
  }
};

export const updatePartner = async (partner) => {
  try {
    const response = await api.patch('/api/update-partner', partner);
    return response.data.data;
  } catch (error: any) {  
    throw new Error("Failed to update partner: " + (error.message || "Unknown error"));
  }
};


