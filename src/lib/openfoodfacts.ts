import type { OpenFoodFactsResponse } from './types';

export async function getProduct(barcode: string): Promise<OpenFoodFactsResponse | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Open Food Facts API error:', errorData);
      return null;
    }
    const data: OpenFoodFactsResponse = await response.json();
    if (data.status === 0) { // status 0 means product not found
        return null;
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    return null;
  }
}
