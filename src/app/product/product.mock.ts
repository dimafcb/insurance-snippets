import { Product } from './product.interfaces';

export const PRODUCTS_MOCK: Product[] = [
  {
    id: 'securelife-advantage',
    name: 'SecureLife Advantage',
    description: 'Whole life coverage with flexible rider options for health and income protection.',
    category: 'Life Insurance',
    startingPremium: 45.0,
  },
  {
    id: 'health-shield-plus',
    name: 'HealthShield Plus',
    description: 'Comprehensive health plan covering hospitalization, critical illness, and outpatient care.',
    category: 'Health Insurance',
    startingPremium: 62.5,
  },
  {
    id: 'wealth-builder-invest',
    name: 'WealthBuilder Invest',
    description: 'Investment-linked plan combining market growth potential with life protection.',
    category: 'Investment',
    startingPremium: 100.0,
  },
  {
    id: 'family-income-secure',
    name: 'Family Income Secure',
    description: 'Guarantees a steady income stream to your family in the event of unforeseen circumstances.',
    category: 'Life Insurance',
    startingPremium: 28.75,
  },
];
