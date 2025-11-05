export type DietaryPreference = 'vegan' | 'gluten-free' | 'diabetic-friendly' | 'low-sodium' | 'keto';

export interface UserPreferences {
  dietaryRestrictions: DietaryPreference[];
}

export interface Product {
  code: string;
  product_name: string;
  product_name_en?: string;
  brands: string;
  image_url: string;
  nutriments: { [key: string]: number | string };
  ingredients_text_with_allergens_en?: string;
  ingredients_text: string;
  additives_tags: string[];
  nova_group?: number;
  nutriscore_grade?: string;
}

export interface OpenFoodFactsResponse {
  product?: Product;
  status: number;
  code: string;
}

export interface ScanHistoryItem {
  barcode: string;
  productName: string;
  imageUrl?: string;
  scannedAt: string;
}
