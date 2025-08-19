import { t } from "i18next";
import { api } from "./api";

export const getTableOptions = () => {
  const permission = {
    // "view": true,
    mark_remitted: true, // hasPermission("mark_remitted_payments"),
    mark_collected: true, // hasPermission("mark_collected_payments"),
    edit: true, // hasPermission("update_payments"),
  };
  const options = {
    headers: [],
    actions: [
      {
        id: "mark_as_remitted",
        label: t("payments:mark_as_remitted"),
        withIcon: false,
        type: "default",
        action: "#mark_remitted",
        permission: permission.mark_remitted,
      },
      {
        id: "mark_as_collected",
        label: t("payments:mark_as_collected"),
        withIcon: false,
        type: "default",
        action: "#mark_collected",
        permission: permission.mark_collected,
      },
      {
        id: "_edit",
        label: t("common:edit"),
        withIcon: false,
        type: "default",
        action: "#edit",
        permission: permission.edit,
      },
    ].filter((action) => action.permission),
  };
  return options;
};

export const markPayment = async (
  id: number,
  status: string,
  reference_no?: string
) => {
  try {
    const response = await api.patch(`/api/payment/mark/${id}`, {
      status: status,
      reference_no: reference_no,
    });
  } catch (error: any) {
    throw new Error(
      "Failed to edit payment: " + (error.message || "Unknown error")
    );
  }
};

// get payment based on policy_id
interface Payment {
  policy_id: number;
  payment_id?: number;
  policy_number: string;
  client: string;
  provider: string;
  type: string;
  premium: number;
  status: string;
  reference_no: string;
  due_date: string;
  date: string;
}

export const fetchPaymentByPolicy = async (policy_id: number) => {
  try {
    const response = await api.get("/api/payment-by-policy", {
      params: {
        p_policy_id: policy_id,
      },
    });
    return response.data.data as Payment[];
  } catch (error: any) {
    throw new Error(
      "Failed to fetch fetchPaymentByPolicy: " +
        (error.message || "Unknown error")
    );
  }
};
