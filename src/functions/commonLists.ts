export const policyStatusMap = (t: (key: string) => string) => {
  return {
    "active": { label: t('policyStatus:active'), class: 'bg-green-200 text-green-800 hover:bg-green-400' },
    "pending": { label: t('policyStatus:pending'), class: 'bg-orange-200 text-orange-800 hover:bg-orange-400' },
    "lapsed": { label: t('policyStatus:lapsed'), class: 'bg-red-200 text-red-800 hover:bg-red-400' },
    "cancelled": { label: t('policyStatus:cancelled'), class: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-400' },
    "expired": { label: t('policyStatus:expired'), class: 'bg-gray-200 text-gray-800 hover:bg-gray-400' },
  }
};


export const defaultCurrency = (t: (key: string) => string) => {
  return {
    "peso": {id: 'peso', label: t('currency:peso'), accessor: 'peso', icon: 'peso', symbol: '₱'},
    "dollar": {id: 'dollar', label: t('currency:dollar'), accessor: 'dollar', icon: 'dollar', symbol: '$'},
    "euro": {id: 'euro', label: t('currency:euro'), accessor: 'euro', icon: 'euro', symbol: '€'},
    "pound": {id: 'pound', label: t('currency:pound'), accessor: 'pound', icon: 'pound', symbol: '£'},
    "yen": {id: 'yen', label: t('currency:yen'), accessor: 'yen', icon: 'yen', symbol: '¥'},
    "rupee": {id: 'rupee', label: t('currency:rupee'), accessor: 'rupee', icon: 'rupee', symbol: '₹'},
    "dirham": {id: 'dirham', label: t('currency:dirham'), accessor: 'dirham', icon: 'dirham', symbol: 'د.إ'},
  }
}

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
    "approved_amount": {id: 'approved_amount', label: t('headers:approved_amount'), accessor: 'approved_amount', align: "right"},
    "active_policies": {id: 'active_policies', label: t('headers:active_policies'), accessor: 'active_policies', align: "right"},
    "amount": {id: 'amount', label: t('headers:amount'), accessor: 'amount', align: "right"},
    "actions": {id: 'actions', label: t('headers:actions'), accessor: 'actions', align: ""},
    "billing_address": {id: 'billing_address', label: t('headers:billing_address'), accessor: 'billing_address', align: ""},
    "claim_number": {id: 'claim_number', label: t('headers:claim_number'), accessor: 'claim_number', align: ""},
    "client": {id: 'client', label: t('headers:client'), accessor: 'client', align: ""},
    "client_name": {id: 'client_name', label: t('headers:client_name'), accessor: 'client_name', align: ""},
    "client_type": {id: 'client_type', label: t('headers:client_type'), accessor: 'client_type', align: "right"},
    "coverage": {id: 'coverage', label: t('headers:coverage'), accessor: 'coverage', align: "right"},
    "date_added": {id: 'date_added', label: t('headers:date_added'), accessor: 'date_added', align: ""},
    "date_created": {id: 'date_created', label: t('headers:date_created'), accessor: 'date_created', align: ""},
    "due_date": {id: 'due_date', label: t('headers:due_date'), accessor: 'due_date', align: ""},
    "documents": {id: 'documents', label: t('headers:documents'), accessor: 'documents', align: ""},
    "email": {id: 'email', label: t('headers:email'), accessor: 'email', align: ""},
    "id": {id: 'id', label: t('headers:id'), accessor: 'id', align: ""},
    "landline_phone": {id: 'landline_phone', label: t('headers:landline_phone'), accessor: 'landline_phone', align: ""},
    "mobile_phone": {id: 'mobile_phone', label: t('headers:mobile_phone'), accessor: 'mobile_phone', align: ""},
    "name": {id: 'name', label: t('headers:name'), accessor: 'name', align: ""},
    "occupation": {id: 'occupation', label: t('headers:occupation'), accessor: 'occupation', align: ""},
    "payment_date": {id: 'payment_date', label: t('headers:payment_date'), accessor: 'payment_date', align: ""},
    "payment_method": {id: 'payment_method', label: t('headers:payment_method'), accessor: 'payment_method', align: ""},
    "physical_address": {id: 'physical_address', label: t('headers:physical_address'), accessor: 'physical_address', align: ""},
    "policy_count": {id: 'policy_count', label: t('headers:policy_count'), accessor: 'policy_count', align: ""},
    "partner_name": {id: 'partner_name', label: t('headers:partner_name'), accessor: 'partner_name', align: ""},
    "product_name": {id: 'product_name', label: t('headers:product_name'), accessor: 'product_name', align: ""},
    "report_date": {id: 'report_date', label: t('headers:report_date'), accessor: 'report_date', align: ""},
    "rowno": {id: 'rowno', label: t('headers:rowno'), accessor: 'rowno', align: ""},
    "status": {id: 'status', label: t('headers:status'), accessor: 'status', align: ""},
    "type": {id: 'type', label: t('headers:type'), accessor: 'type', align: ""},
    "period": {id: 'period', label: t('headers:period'), accessor: 'period', align: ""},
    "policy_number": {id: 'policy_number', label: t('headers:policy_number'), accessor: 'policy_number', align: ""},
    "policy_type": {id: 'policy_type', label: t('headers:policy_type'), accessor: 'policy_type', align: ""},
    "policy_status": {id: 'policy_status', label: t('headers:policy_status'), accessor: 'policy_status', align: ""},
    "effective_date": {id: 'effective_date', label: t('headers:effective_date'), accessor: 'effective_date', align: ""},
    "expiry_date": {id: 'expiry_date', label: t('headers:expiry_date'), accessor: 'expiry_date', align: ""},
    "expiration_date": {id: 'expiration_date', label: t('headers:expiration_date'), accessor: 'expiration_date', align: ""},
    "premium": {id: 'premium', label: t('headers:premium'), accessor: 'premium', align: "right"},
    "premium_amount": {id: 'premium_amount', label: t('headers:premium_amount'), accessor: 'premium_amount', align: "right"},
    "payment" : {id: 'payment', label: t('headers:payment'), accessor: 'payment', align: "right"},
    "claim_numbers": {id: 'claim_numbers', label: t('headers:claim_numbers'), accessor: 'claim_numbers', align: ""} 
  };
};

export const getMonetaryHeaders = () => {
  return ['coverage', 'premium', 'premium_amount', 'payment'];
};

export const getDateHeaders = () => {
  return ['effective_date', 'expiry_date', 'expiration_date', 'updated_at', 'created_at', 'date_created'];
};


export const getPaymentTerms = (t: (key: string) => string) => {
  return {
    "monthly": { id: 'monthly', label: t('paymentTerms:monthly') },
    "quarterly": { id: 'quarterly', label: t('paymentTerms:quarterly') },
    "semi-annual": { id: 'semi-annual', label: t('paymentTerms:semi-annual') },
    "annual": { id: 'annual', label: t('paymentTerms:annual') },
    "one-time": { id: 'one-time', label: t('paymentTerms:one-time') }
  }
};


export const getPolicyTypes = (t: (key: string) => string) => {
  return {
    "auto": { id: 'auto', label: t('policyTypes:auto') },
    "engineering": { id: 'engineering', label: t('policyTypes:engineering') },
    "casualty": { id: 'casualty', label: t('policyTypes:casualty') },
    "marine_cargo": { id: 'marine_cargo', label: t('policyTypes:marine_cargo') },
    "personal_accident": { id: 'personal_accident', label: t('policyTypes:personal_accident') },
    "aviation": { id: 'aviation', label: t('policyTypes:aviation') },
    "surety": { id: 'surety', label: t('policyTypes:surety') },
    "property": { id: 'property', label: t('policyTypes:property') },
  }
};

export const getPartnerTypes = (t: (key: string) => string) => {
  return [
    { id: 'insurance_company', label: t('types:insurance_company') },
    { id: 'vendor', label: t('types:vendor') },
    { id: 'broker', label: t('types:broker') },
    { id: 'service_provider', label: t('types:service_provider') },
    { id: 'other', label: t('types:other') }
  ];
};

export const getPartnerStatus = (t: (key: string) => string) => {
  return [
    { id: 'active', label: t('status:active') },
    { id: 'inactive', label: t('status:inactive') },
    { id: 'pending', label: t('status:pending') },
    { id: 'terminated', label: t('status:terminated') }
  ];
};

export const getClientTypes = (t: (key: string) => string) => {
  return [
    { id: 'individual', label: t('common:individual') },
    { id: 'corporate', label: t('common:corporate') }
  ];
};

export const translatableKeys = [
  { view: 'policies', key: 'status', namespace: 'common' },
  { view: 'policies', key: 'type', namespace: 'policyTypes' },
  { view: 'policies', key: 'preferred_communication', namespace: 'common' },
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
