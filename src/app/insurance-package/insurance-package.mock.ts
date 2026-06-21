import { Rider, RiderGroup } from './insurance-package.interfaces';

export function getMockRidersWithVariantCount(count: number): RiderGroup[] {
  return RIDER_GROUPS_MOCK.map((group) => ({
    ...group,
    riders: group.riders.map((rider) => ({
      ...rider,
      variants: rider.variants.slice(0, count),
    })),
  }));
}

export const RIDER_GROUPS_MOCK: RiderGroup[] = [
  {
    groupName: 'Health Riders',
    riders: [
      {
        riderName: 'Critical Illness Rider',
        variants: [
          { premium: 44.5, selected: false, sum: 30000 },
          { premium: 58.25, selected: true, sum: 50000 },
          { premium: 72.8, selected: false, sum: 70000 },
          { premium: 95.1, selected: false, sum: 100000 },
          { premium: 109.45, selected: false, sum: 120000 },
          { premium: 126.3, selected: false, sum: 150000 },
          { premium: 141.0, selected: false, sum: 180000 },
        ],
      },
      {
        riderName: 'Hospital Cash Rider',
        variants: [
          { premium: 24.15, selected: false, sum: 10000 },
          { premium: 39.2, selected: false, sum: 25000 },
          { premium: 55.75, selected: true, sum: 40000 },
          { premium: 67.0, selected: false, sum: 50000 },
          { premium: 78.55, selected: false, sum: 65000 },
          { premium: 92.1, selected: false, sum: 80000 },
          { premium: 106.35, selected: false, sum: 100000 },
        ],
      },
      {
        riderName: 'Accident Protection Rider',
        variants: [
          { premium: 33.3, selected: true, sum: 20000 },
          { premium: 47.9, selected: false, sum: 35000 },
          { premium: 62.4, selected: false, sum: 50000 },
          { premium: 79.0, selected: false, sum: 75000 },
          { premium: 91.6, selected: false, sum: 90000 },
          { premium: 108.25, selected: false, sum: 120000 },
          { premium: 124.8, selected: false, sum: 150000 },
        ],
      },
      {
        riderName: 'Family Income Rider',
        variants: [
          { premium: 18.6, selected: false, sum: 15000 },
          { premium: 28.7, selected: true, sum: 25000 },
          { premium: 37.1, selected: false, sum: 35000 },
          { premium: 49.2, selected: false, sum: 50000 },
          { premium: 59.8, selected: false, sum: 70000 },
          { premium: 71.45, selected: false, sum: 90000 },
          { premium: 85.9, selected: false, sum: 120000 },
        ],
      },
    ],
  },
  {
    groupName: 'Investment Riders',
    riders: [
      {
        riderName: 'Equity Growth Rider',
        variants: [
          { premium: 50.0, selected: false, sum: 25000 },
          { premium: 75.5, selected: true, sum: 50000 },
          { premium: 102.3, selected: false, sum: 75000 },
          { premium: 135.8, selected: false, sum: 100000 },
          { premium: 165.4, selected: false, sum: 150000 },
          { premium: 195.2, selected: false, sum: 200000 },
          { premium: 225.0, selected: false, sum: 250000 },
        ],
      },
      {
        riderName: 'Dividend Boost Rider',
        variants: [
          { premium: 35.2, selected: true, sum: 20000 },
          { premium: 52.1, selected: false, sum: 40000 },
          { premium: 68.9, selected: false, sum: 60000 },
          { premium: 88.5, selected: false, sum: 80000 },
          { premium: 110.3, selected: false, sum: 120000 },
          { premium: 132.7, selected: false, sum: 160000 },
          { premium: 155.0, selected: false, sum: 200000 },
        ],
      },
      {
        riderName: 'Bond Protection Rider',
        variants: [
          { premium: 28.6, selected: false, sum: 15000 },
          { premium: 41.3, selected: false, sum: 30000 },
          { premium: 54.8, selected: true, sum: 45000 },
          { premium: 71.2, selected: false, sum: 60000 },
          { premium: 87.9, selected: false, sum: 80000 },
          { premium: 104.5, selected: false, sum: 100000 },
          { premium: 122.0, selected: false, sum: 125000 },
        ],
      },
      {
        riderName: 'Portfolio Rebalance Rider',
        variants: [
          { premium: 42.0, selected: false, sum: 22000 },
          { premium: 63.5, selected: false, sum: 45000 },
          { premium: 85.2, selected: true, sum: 70000 },
          { premium: 112.8, selected: false, sum: 95000 },
          { premium: 138.6, selected: false, sum: 130000 },
          { premium: 165.3, selected: false, sum: 170000 },
          { premium: 192.0, selected: false, sum: 210000 },
        ],
      },
    ],
  },
];
