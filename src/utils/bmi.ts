/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}
