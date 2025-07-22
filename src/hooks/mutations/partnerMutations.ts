import { addPartner, updatePartner } from "@/services/partnerServices";
import { useMutation } from "@tanstack/react-query";



export const useAddPartnerMutation = () => {
    return useMutation({
      mutationFn: addPartner,
    });
  };
  
  export const useUpdatePartnerMutation = () => {
    return useMutation({
      mutationFn: updatePartner,
    });
  }; 