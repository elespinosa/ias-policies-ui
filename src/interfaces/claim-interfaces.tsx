export interface Claim {
	id: string;
	claim_number: string;
	policy_id: string;
	policy_number: string;
	client_id: string;
	claim_type: string;
	agent_id: string;
	report_date: string;
	incident_date: string;
	total_amount_claimed: string;
	approved_amount: string;
	deductible_applied: string;
	status: string;
	location: string;
	description: string;
	denial_reason: string;
	documents?: Document[];
};


export interface ClaimData {
	id: string;
	claim_number: string;
	policy_id: string;
	policy_number: string;
	client_id: string;
	claim_type: string;
	agent_id: string;
	report_date: string;
	incident_date: string;
	total_amount_claimed: string;
	approved_amount: string;
	deductible_applied: string;
	status: string;
	location: string;
	description: string;
	denial_reason: string;
}
  
export interface ClaimType {
	claim_type: string;
}
  
export interface ClaimStatus {
	claim_status: string;
}
  