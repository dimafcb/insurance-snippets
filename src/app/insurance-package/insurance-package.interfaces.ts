export interface RiderVariant {
  premium: number;
  selected: boolean;
  sum: number;
}

export interface InsuranceRider {
  riderName: string;
  variants: RiderVariant[];
}