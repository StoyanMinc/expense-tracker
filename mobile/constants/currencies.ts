export const CURRENCIES = ['€', '$', 'лв.'] as const;

export type Currency = typeof CURRENCIES[number];
