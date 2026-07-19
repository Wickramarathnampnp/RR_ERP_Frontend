export const STOCK_TYPES = [
  'Building Material',
  'Electrical',
  'Plumbing',
  'Hardware',
  'Safety Equipment',
  'Tools',
] as const;

export const STOCK_CATEGORIES = [
  'Cement & Concrete',
  'Steel & Metal',
  'Timber',
  'Electrical Supplies',
  'Plumbing Supplies',
  'PPE',
  'Tools & Equipment',
] as const;

export const UOM_OPTIONS = [
  'Bag',
  'Box',
  'Each',
  'Kilogram',
  'Litre',
  'Metre',
  'Roll',
  'Set',
  'Tonne',
] as const;

export const FREIGHT_TYPES = [
  'Standard',
  'Express',
  'Supplier Delivery',
  'Pickup',
] as const;

export const PROJECTS = [
  { name: 'Harbour View Apartments', location: 'Colombo 03' },
  { name: 'Central Warehouse Expansion', location: 'Peliyagoda' },
  { name: 'Hillcrest Residences', location: 'Kandy' },
  { name: 'Southern Expressway Facility', location: 'Matara' },
] as const;
