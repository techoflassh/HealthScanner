import type { Product } from './types';

export function calculateHealthScore(product: Product): { score: number; remarks: string[] } {
  let score = 5; // Start at a neutral 5
  const remarks: string[] = [];

  const sugar = Number(product.nutriments.sugars_100g) || 0;
  if (sugar > 15) {
    score -= 2;
    remarks.push('High sugar content.');
  } else if (sugar > 5) {
    score -= 1;
    remarks.push('Moderate sugar content.');
  } else {
    score += 1;
    remarks.push('Low sugar content.');
  }

  const sodium = Number(product.nutriments.sodium_100g) || 0;
  if (sodium > 0.6) { // 600mg
    score -= 2;
    remarks.push('High sodium content.');
  } else if (sodium > 0.12) { // 120mg
    score -= 1;
    remarks.push('Moderate sodium content.');
  } else {
    score += 1;
    remarks.push('Low sodium content.');
  }

  const fiber = Number(product.nutriments.fiber_100g) || 0;
  if (fiber > 6) {
    score += 2;
    remarks.push('Excellent source of fiber.');
  } else if (fiber > 3) {
    score += 1;
    remarks.push('Good source of fiber.');
  }

  const protein = Number(product.nutriments.proteins_100g) || 0;
  if (protein > 15) {
    score += 1;
    remarks.push('High in protein.');
  }

  if (product.nova_group === 4) {
    score -= 2;
    remarks.push('Ultra-processed food.');
  } else if (product.nova_group === 3) {
    score -= 1;
    remarks.push('Processed food.');
  }

  if (product.additives_tags && product.additives_tags.length > 5) {
    score -= 1;
    remarks.push('Contains multiple additives.');
  }
  
  // Clamp score between 1 and 10
  score = Math.max(1, Math.min(10, Math.round(score)));

  return { score, remarks };
}
