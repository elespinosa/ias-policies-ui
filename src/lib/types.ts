// Type definitions for the CRM application

export type Tenant = {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  createdAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
  lastLogin?: Date;
};

export enum UserRole {
  AGENT = "agent",
  COMPANY_ADMIN = "company_admin",
  SYSTEM_ADMIN = "system_admin",
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: CustomerStatus;
  assignedToId?: string;
  tenantId: string;
  createdAt: Date;
};

export enum CustomerStatus {
  LEAD = "lead",
  PROSPECT = "prospect",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type Policy = {
  id: string;
  number: string;
  type: PolicyType;
  customerId: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  status: PolicyStatus;
  tenantId: string;
  createdAt: Date;
};

export enum PolicyType {
  AUTO = "auto",
  HOME = "home",
  HEALTH = "health",
  LIFE = "life",
  BUSINESS = "business",
  OTHER = "other",
}

export enum PolicyStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  PENDING_RENEWAL = "pending_renewal",
}

export type Claim = {
  id: string;
  number: string;
  policyId: string;
  customerId: string;
  dateOfIncident: Date;
  description: string;
  amount: number;
  status: ClaimStatus;
  tenantId: string;
  createdAt: Date;
};

export enum ClaimStatus {
  NEW = "new",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  PAID = "paid",
  DENIED = "denied",
  CLOSED = "closed",
}

export type PolicyListing = {
  client: string;
  id: number;
  period: string;
  policy_number: string;
  currency_code: string;
  premium: number;
  provider: string;
  status: string;
  total_records: number;
  type: string;
};

export type Activity = {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  action: string;
  description: string;
  timestamp: Date;
  tenantId: string;
};

export interface Currency {
  id: string;
  code: string;
  label: string;
  accessor: string;
  icon: string;
  symbol: string;
}

export interface InsertUpdatePolicyI {
  quote_id?: number;
  policy_id?: number;
  policy_number?: string;
  ref_policy_number?: string;
  client_id: number;
  partner_id: number;
  product_id: number;
  currency_code: string;
  currency_rate: number;
  premium_amount: number;
  coverage_amount: number;
  deductible_amount: number;
  insured_properties?: string;
  status: string;
  effective_date: string;
  expiration_date: string;
  payment_frequency: string;
  payment_method_id?: number;
  auto_renewal: 1 | 0;
  underwriting_notes?: string;
  agent_id?: number;
  commission_rate?: number;
}

export enum EntityType {
  CUSTOMER = "customer",
  POLICY = "policy",
  CLAIM = "claim",
  USER = "user",
}

export interface ClaimListing {
  id: string;
  claimNumber: string;
  policyNumber: string;
  clientName: string;
  status: string;
  type: string;
  dateSubmitted: string;
  amount: string;
  description: string;
  assignedTo?: string;
  notes?: string;
  documents?: Document[];
  TOTAL_RECORDS?: number;
}

// Mock data for development
export const MOCK_CURRENT_USER: User = {
  id: "u1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: UserRole.COMPANY_ADMIN,
  tenantId: "t1",
  avatar: "https://i.pravatar.cc/150?img=1",
  lastLogin: new Date(),
};

export const MOCK_CURRENT_TENANT: Tenant = {
  id: "t1",
  name: "Acme Insurance",
  logo: "",
  primaryColor: "#0EA5E9",
  createdAt: new Date(),
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234 567 8901",
    address: "123 Main St, Anytown, CA 12345",
    status: CustomerStatus.ACTIVE,
    assignedToId: "u1",
    tenantId: "t1",
    createdAt: new Date(2023, 0, 15),
  },
  {
    id: "c2",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 234 567 8902",
    status: CustomerStatus.LEAD,
    tenantId: "t1",
    createdAt: new Date(2023, 1, 20),
  },
  {
    id: "c3",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 234 567 8903",
    address: "456 Oak Ave, Somewhere, NY 67890",
    status: CustomerStatus.PROSPECT,
    assignedToId: "u1",
    tenantId: "t1",
    createdAt: new Date(2023, 2, 5),
  },
  {
    id: "c4",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 234 567 8904",
    address: "789 Pine Blvd, Nowhere, TX 13579",
    status: CustomerStatus.ACTIVE,
    assignedToId: "u1",
    tenantId: "t1",
    createdAt: new Date(2023, 3, 10),
  },
  {
    id: "c5",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    phone: "+1 234 567 8905",
    status: CustomerStatus.INACTIVE,
    tenantId: "t1",
    createdAt: new Date(2023, 4, 25),
  },
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: "p1",
    number: "POL-001-2023",
    type: PolicyType.AUTO,
    customerId: "c1",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    premium: 1200.0,
    status: PolicyStatus.ACTIVE,
    tenantId: "t1",
    createdAt: new Date(2022, 11, 15),
  },
  {
    id: "p2",
    number: "POL-002-2023",
    type: PolicyType.HOME,
    customerId: "c1",
    startDate: new Date(2023, 2, 1),
    endDate: new Date(2024, 1, 29),
    premium: 950.0,
    status: PolicyStatus.ACTIVE,
    tenantId: "t1",
    createdAt: new Date(2023, 1, 15),
  },
  {
    id: "p3",
    number: "POL-003-2023",
    type: PolicyType.BUSINESS,
    customerId: "c3",
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2024, 2, 31),
    premium: 2500.0,
    status: PolicyStatus.ACTIVE,
    tenantId: "t1",
    createdAt: new Date(2023, 2, 20),
  },
  {
    id: "p4",
    number: "POL-004-2023",
    type: PolicyType.HEALTH,
    customerId: "c4",
    startDate: new Date(2023, 1, 1),
    endDate: new Date(2023, 12, 31),
    premium: 3800.0,
    status: PolicyStatus.PENDING_RENEWAL,
    tenantId: "t1",
    createdAt: new Date(2023, 0, 10),
  },
  {
    id: "p5",
    number: "POL-005-2023",
    type: PolicyType.AUTO,
    customerId: "c5",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 5, 30),
    premium: 870.0,
    status: PolicyStatus.EXPIRED,
    tenantId: "t1",
    createdAt: new Date(2022, 11, 20),
  },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: "cl1",
    number: "CLM-001-2023",
    policyId: "p1",
    customerId: "c1",
    dateOfIncident: new Date(2023, 3, 15),
    description: "Car accident on highway 101",
    amount: 5000.0,
    status: ClaimStatus.APPROVED,
    tenantId: "t1",
    createdAt: new Date(2023, 3, 16),
  },
  {
    id: "cl2",
    number: "CLM-002-2023",
    policyId: "p2",
    customerId: "c1",
    dateOfIncident: new Date(2023, 5, 10),
    description: "Water damage from broken pipe",
    amount: 2300.0,
    status: ClaimStatus.PAID,
    tenantId: "t1",
    createdAt: new Date(2023, 5, 11),
  },
  {
    id: "cl3",
    number: "CLM-003-2023",
    policyId: "p3",
    customerId: "c3",
    dateOfIncident: new Date(2023, 6, 5),
    description: "Business equipment theft",
    amount: 8700.0,
    status: ClaimStatus.UNDER_REVIEW,
    tenantId: "t1",
    createdAt: new Date(2023, 6, 7),
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    userId: "u1",
    entityType: EntityType.POLICY,
    entityId: "p1",
    action: "create",
    description: "Created new auto policy POL-001-2023",
    timestamp: new Date(2022, 11, 15, 10, 30),
    tenantId: "t1",
  },
  {
    id: "a2",
    userId: "u1",
    entityType: EntityType.CUSTOMER,
    entityId: "c2",
    action: "create",
    description: "Added new lead Robert Johnson",
    timestamp: new Date(2023, 1, 20, 14, 15),
    tenantId: "t1",
  },
  {
    id: "a3",
    userId: "u1",
    entityType: EntityType.CLAIM,
    entityId: "cl1",
    action: "update",
    description: "Updated claim CLM-001-2023 status to Approved",
    timestamp: new Date(2023, 4, 5, 11, 45),
    tenantId: "t1",
  },
  {
    id: "a4",
    userId: "u1",
    entityType: EntityType.POLICY,
    entityId: "p4",
    action: "update",
    description: "Updated policy POL-004-2023 status to Pending Renewal",
    timestamp: new Date(2023, 6, 12, 9, 20),
    tenantId: "t1",
  },
  {
    id: "a5",
    userId: "u1",
    entityType: EntityType.CLAIM,
    entityId: "cl2",
    action: "update",
    description: "Updated claim CLM-002-2023 status to Paid",
    timestamp: new Date(2023, 6, 18, 16, 30),
    tenantId: "t1",
  },
];
