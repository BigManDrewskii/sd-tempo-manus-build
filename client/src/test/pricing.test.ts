import { describe, it, expect } from 'vitest';

// Pricing calculator logic (extracted from actual component logic)
interface PricingTier {
  id: string;
  name: string;
  basePrice: number;
  features: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

function calculateTotalPrice(tier: PricingTier | null, addOns: AddOn[]): number {
  if (!tier) return 0;
  
  const basePrice = tier.basePrice;
  const addOnsTotal = addOns
    .filter(addon => addon.selected)
    .reduce((sum, addon) => sum + addon.price, 0);
  
  return basePrice + addOnsTotal;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

describe('Pricing Calculator', () => {
  const mockTier: PricingTier = {
    id: 'professional',
    name: 'Professional',
    basePrice: 5000,
    features: ['Feature 1', 'Feature 2'],
  };

  const mockAddOns: AddOn[] = [
    { id: 'seo', name: 'SEO Optimization', price: 1000, selected: false },
    { id: 'analytics', name: 'Analytics Setup', price: 500, selected: false },
    { id: 'support', name: '6 Month Support', price: 2000, selected: false },
  ];

  it('should calculate base price with no add-ons', () => {
    const total = calculateTotalPrice(mockTier, mockAddOns);
    expect(total).toBe(5000);
  });

  it('should calculate price with one add-on selected', () => {
    const addOnsWithOne = [
      { ...mockAddOns[0], selected: true },
      mockAddOns[1],
      mockAddOns[2],
    ];
    const total = calculateTotalPrice(mockTier, addOnsWithOne);
    expect(total).toBe(6000); // 5000 + 1000
  });

  it('should calculate price with multiple add-ons selected', () => {
    const addOnsWithMultiple = [
      { ...mockAddOns[0], selected: true },
      { ...mockAddOns[1], selected: true },
      mockAddOns[2],
    ];
    const total = calculateTotalPrice(mockTier, addOnsWithMultiple);
    expect(total).toBe(6500); // 5000 + 1000 + 500
  });

  it('should calculate price with all add-ons selected', () => {
    const allSelected = mockAddOns.map(addon => ({ ...addon, selected: true }));
    const total = calculateTotalPrice(mockTier, allSelected);
    expect(total).toBe(8500); // 5000 + 1000 + 500 + 2000
  });

  it('should return 0 when no tier is selected', () => {
    const total = calculateTotalPrice(null, mockAddOns);
    expect(total).toBe(0);
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(5000)).toBe('$5,000');
    expect(formatCurrency(10500)).toBe('$10,500');
    expect(formatCurrency(0)).toBe('$0');
  });
});

