export interface RiderVariant {
  premium: number;
  selected: boolean;
  sum: number;
}

export interface Rider {
  riderName: string;
  variants: RiderVariant[];
  variantsCount?: number;
}

export interface RiderGroup {
  groupName: string;
  riders: Rider[];
}
