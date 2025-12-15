import type { UserMeasurements, Size } from '../types';

export function calculateRecommendedSize(measurements: UserMeasurements, category: string): Size {
  const { bmi = 22, fitPreference, bellyShape, hipShape, hasReturnHistory, gender } = measurements;
  
  let baseSize: number;
  
  // Base size from BMI (adjusted for Southeast Asian)
  if (gender === 'FEMALE') {
    if (bmi < 17.5) baseSize = 0; // XS
    else if (bmi < 19) baseSize = 1; // S
    else if (bmi < 22) baseSize = 2; // M
    else if (bmi < 25) baseSize = 3; // L
    else if (bmi < 27) baseSize = 4; // XL
    else baseSize = 5; // XXL
  } else {
    if (bmi < 18.5) baseSize = 0; // XS
    else if (bmi < 20.5) baseSize = 1; // S
    else if (bmi < 23) baseSize = 2; // M
    else if (bmi < 25) baseSize = 3; // L
    else if (bmi < 27) baseSize = 4; // XL
    else baseSize = 5; // XXL
  }
  
  // Adjust for fit preference
  if (fitPreference === 'TIGHT') baseSize -= 1;
  else if (fitPreference === 'LOOSE') baseSize += 1;
  
  // Adjust for body shapes
  if (bellyShape === 'ROUND') baseSize += 1;
  if (hipShape === 'WIDE' && category === 'PANTS') baseSize += 1;
  
  // Adjust for return history (more cautious)
  if (hasReturnHistory) baseSize += 1;
  
  // Clamp to valid range
  baseSize = Math.max(0, Math.min(5, baseSize));
  
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return sizes[baseSize];
}

export function getSmallerSize(size: Size): Size | null {
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(size);
  return index > 0 ? sizes[index - 1] : null;
}

export function getLargerSize(size: Size): Size | null {
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(size);
  return index < sizes.length - 1 ? sizes[index + 1] : null;
}

export function generateReasoning(measurements: UserMeasurements, recommendedSize: Size, category: string): string {
  const { bmi = 22, fitPreference, gender } = measurements;
  
  let reasoning = `Based on your ${gender.toLowerCase()} body measurements (BMI: ${bmi.toFixed(1)}), `;
  
  if (fitPreference === 'TIGHT') {
    reasoning += 'and your preference for tight/fitted clothing, ';
  } else if (fitPreference === 'LOOSE') {
    reasoning += 'and your preference for loose/comfortable clothing, ';
  } else {
    reasoning += 'and your preference for regular fit, ';
  }
  
  reasoning += `we recommend size ${recommendedSize} for this ${category.toLowerCase()}.`;
  
  return reasoning;
}
