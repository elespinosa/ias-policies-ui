import { Currency } from "@/lib/types";

export const policyStatusMap = (t: (key: string) => string) => {
  return {
    active: {
      label: t("status:active"),
      class: "bg-green-200 text-green-800 hover:bg-green-400",
    },
    pending: {
      label: t("status:pending"),
      class: "bg-orange-200 text-orange-800 hover:bg-orange-400",
    },
    lapsed: {
      label: t("status:lapsed"),
      class: "bg-red-200 text-red-800 hover:bg-red-400",
    },
    cancelled: {
      label: t("status:cancelled"),
      class: "bg-yellow-200 text-yellow-800 hover:bg-yellow-400",
    },
    expired: {
      label: t("status:expired"),
      class: "bg-gray-200 text-gray-800 hover:bg-gray-400",
    },
  };
};

export const quoteStatusMap = (t: (key: string) => string) => {
  return {
    approved: {
      label: t("quoteStatus:approved"),
      class: "bg-green-200 text-green-800 hover:bg-green-400",
    },
    draft: {
      label: t("quoteStatus:draft"),
      class: "bg-gray-200 text-gray-800 hover:bg-gray-400",
    },
    pending: {
      label: t("quoteStatus:pending"),
      class: "bg-orange-200 text-orange-800 hover:bg-orange-400",
    },
    rejected: {
      label: t("quoteStatus:rejected"),
      class: "bg-red-200 text-red-800 hover:bg-red-400",
    },
    converted: {
      label: t("quoteStatus:converted"),
      class: "bg-green-200 text-green-800 hover:bg-green-400",
    },
  };
};

export const defaultCurrency = (
  t: (key: string) => string
): Record<string, Currency> => {
  return {
    peso: {
      id: "peso",
      code: "PHP",
      label: t("currency:peso"),
      accessor: "peso",
      icon: "peso",
      symbol: "₱",
    },
    dollar: {
      id: "dollar",
      code: "USD",
      label: t("currency:dollar"),
      accessor: "dollar",
      icon: "dollar",
      symbol: "$",
    },
    euro: {
      id: "euro",
      code: "EUR",
      label: t("currency:euro"),
      accessor: "euro",
      icon: "euro",
      symbol: "€",
    },
    pound: {
      id: "pound",
      code: "GBP",
      label: t("currency:pound"),
      accessor: "pound",
      icon: "pound",
      symbol: "£",
    },
    yen: {
      id: "yen",
      code: "JPY",
      label: t("currency:yen"),
      accessor: "yen",
      icon: "yen",
      symbol: "¥",
    },
    rupee: {
      id: "rupee",
      code: "INR",
      label: t("currency:rupee"),
      accessor: "rupee",
      icon: "rupee",
      symbol: "₹",
    },
    dirham: {
      id: "dirham",
      code: "AED",
      label: t("currency:dirham"),
      accessor: "dirham",
      icon: "dirham",
      symbol: "د.إ",
    },
  };
};

// export const getHeaderLists = (t: (key: string) => string) => {
//   return [
//     { id: 'prod_name', label: t('common:product') },
//     { id: 'subprod_name', label: t('common:subproduct') },
//     { id: 'subprod_description', label: t('common:description') },
//     { id: 'subprod_status', label: t('common:status') },
//   ]
// };

export const getHeaderLists = (t: (key: string) => string) => {
  return {
    policy_number: {
      id: "policy_number",
      label: t("headers:policy_#"),
      accessor: "policy_number",
      align: "",
    },
    type: { id: "type", label: t("headers:type"), accessor: "type", align: "" },
    provider: {
      id: "provider",
      label: t("headers:provider"),
      accessor: "provider",
      align: "",
    },
    client: {
      id: "client",
      label: t("headers:client"),
      accessor: "client",
      align: "",
    },
    status: {
      id: "status",
      label: t("headers:status"),
      accessor: "status",
      align: "",
    },
    period: {
      id: "period",
      label: t("headers:period"),
      accessor: "period",
      align: "",
    },
    premium: {
      id: "premium",
      label: t("headers:premium"),
      accessor: "premium",
      align: "right",
    },
    actions: {
      id: "actions",
      label: t("headers:actions"),
      accessor: "actions",
      align: "",
    },
    client_type: {
      id: "client_type",
      label: "",
      accessor: "client_type",
      align: "",
    },
    name: {
      id: "name",
      label: t("headers:name"),
      accessor: "name",
      align: "",
    },
    email: {
      id: "email",
      label: t("headers:email"),
      accessor: "email",
      align: "",
    },
    customer_type: {
      id: "customer_type",
      label: t("headers:customer_type"),
      accessor: "customer_type",
      align: "",
    },
    amount: {
      id: "amount",
      label: t("headers:amount"),
      accessor: "amount",
      align: "right",
    },
    quote_number: {
      id: "quote_number",
      label: t("headers:quote_#"),
      accessor: "quote_number",
      align: "",
    },
    client_name: {
      id: "client_name",
      label: t("headers:client"),
      accessor: "client_name",
      align: "",
    },
    policy_type: {
      id: "policy_type",
      label: t("headers:type"),
      accessor: "policy_type",
      align: "",
    },

    row_no: {
      id: "row_no",
      label: t("uploading:row_no"),
      accessor: "row_no",
      align: "",
    },
    ref_policy_number: {
      id: "ref_policy_number",
      label: t("policies:ref_policy_number"),
      accessor: "ref_policy_number",
      align: "",
    },
    client_id: {
      id: "client_id",
      label: t("policies:client_id"),
      accessor: "client_id",
      align: "",
    },
    partner_id: {
      id: "partner_id",
      label: t("policies:partner_id"),
      accessor: "partner_id",
      align: "",
    },
    product_id: {
      id: "product_id",
      label: t("policies:product_id"),
      accessor: "product_id",
      align: "",
    },
    effective_date: {
      id: "effective_date",
      label: t("policies:effective_date"),
      accessor: "effective_date",
      align: "",
    },
    expiration_date: {
      id: "expiration_date",
      label: t("policies:expiration_date"),
      accessor: "expiration_date",
      align: "",
    },
    currency_code: {
      id: "currency_code",
      label: t("policies:currency_code"),
      accessor: "currency_code",
      align: "right",
    },
    currency_rate: {
      id: "currency_rate",
      label: t("policies:currency_rate"),
      accessor: "currency_rate",
      align: "right",
    },
    premium_amount: {
      id: "premium_amount",
      label: t("policies:premium_amount"),
      accessor: "premium_amount",
      align: "right",
    },
    payment_frequency: {
      id: "payment_frequency",
      label: t("policies:payment_frequency"),
      accessor: "payment_frequency",
      align: "",
    },
    coverage_amount: {
      id: "coverage_amount",
      label: t("policies:coverage_amount"),
      accessor: "coverage_amount",
      align: "right",
    },
    deductible_amount: {
      id: "deductible_amount",
      label: t("policies:deductible_amount"),
      accessor: "deductible_amount",
      align: "right",
    },
  };
};

export const getMonetaryHeaders = () => {
  return ["coverage", "premium", "premium_amount", "payment"];
};

export const getDateHeaders = () => {
  return [
    "effective_date",
    "expiry_date",
    "expiration_date",
    "updated_at",
    "created_at",
    "date_created",
  ];
};

export const getPaymentTerms = (t: (key: string) => string) => {
  return {
    monthly: { id: "monthly", label: t("paymentTerms:monthly") },
    quarterly: { id: "quarterly", label: t("paymentTerms:quarterly") },
    "semi-annual": { id: "semi-annual", label: t("paymentTerms:semi-annual") },
    annual: { id: "annual", label: t("paymentTerms:annual") },
    "one-time": { id: "one-time", label: t("paymentTerms:one-time") },
  };
};

export const getPolicyTypes = (t: (key: string) => string) => {
  return {
    auto: { id: "auto", label: t("policyTypes:auto") },
    engineering: { id: "engineering", label: t("policyTypes:engineering") },
    casualty: { id: "casualty", label: t("policyTypes:casualty") },
    marine_cargo: { id: "marine_cargo", label: t("policyTypes:marine_cargo") },
    personal_accident: {
      id: "personal_accident",
      label: t("policyTypes:personal_accident"),
    },
    aviation: { id: "aviation", label: t("policyTypes:aviation") },
    surety: { id: "surety", label: t("policyTypes:surety") },
    property: { id: "property", label: t("policyTypes:property") },
  };
};

// export const getPartnerTypes = (t: (key: string) => string) => {
//   return [
//     { id: "insurance_company", label: t("types:insurance_company") },
//     { id: "vendor", label: t("types:vendor") },
//     { id: "broker", label: t("types:broker") },
//     { id: "service_provider", label: t("types:service_provider") },
//     { id: "other", label: t("types:other") },
//   ];
// };

export const getPartnerStatus = (t: (key: string) => string) => {
  return [
    { id: "active", label: t("status:active") },
    { id: "inactive", label: t("status:inactive") },
    { id: "pending", label: t("status:pending") },
    { id: "terminated", label: t("status:terminated") },
  ];
};

export const getClientTypes = (t: (key: string) => string) => {
  return [
    { id: "individual", label: t("common:individual") },
    { id: "corporate", label: t("common:corporate") },
  ];
};

export const translatableKeys = [
  { view: "policies", key: "status", namespace: "common" },
  { view: "policies", key: "type", namespace: "policyTypes" },
  { view: "policies", key: "preferred_communication", namespace: "common" },
] as const;

export const gridColsClass = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  13: "grid-cols-13",
  14: "grid-cols-14",
  15: "grid-cols-15",
};
