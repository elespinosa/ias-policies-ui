import { addClaim, deleteClaim, updateClaim } from "@/services/claimsServices";
import { useMutation } from "@tanstack/react-query";

export const useAddClaimMutation = () => {
  return useMutation({
    mutationFn: addClaim,
  });
};

export const useUpdateClaimMutation = () => {
  return useMutation({
    mutationFn: updateClaim,
  });
}; 

export const useDeleteClaimMutation = () => {
  return useMutation({
    mutationFn: deleteClaim,
  });
}; 