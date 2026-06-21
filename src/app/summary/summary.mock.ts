import { PolicySummary } from './summary.interfaces';

export const POLICY_SUMMARY_MOCK: PolicySummary = {
  policyName: 'SecureLife Advantage',
  insuredName: 'Jane Doe',
  planTier: 'Gold',
  monthlyPremium: 187.65,
  totalSumInsured: 250000,
  riders: [
    { riderName: 'Critical Illness Rider', sum: 50000, premium: 58.25 },
    { riderName: 'Hospital Cash Rider', sum: 40000, premium: 55.75 },
    { riderName: 'Accident Protection Rider', sum: 20000, premium: 33.3 },
    { riderName: 'Equity Growth Rider', sum: 50000, premium: 75.5 },
  ],
};
