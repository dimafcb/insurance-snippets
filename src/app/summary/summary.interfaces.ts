export interface SelectedRiderSummary {
  riderName: string;
  sum: number;
  premium: number;
}

export interface PolicySummary {
  policyName: string;
  insuredName: string;
  planTier: string;
  monthlyPremium: number;
  totalSumInsured: number;
  riders: SelectedRiderSummary[];
}
