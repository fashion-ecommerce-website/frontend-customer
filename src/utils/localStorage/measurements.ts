/**
 * LocalStorage utilities for user measurements
 */

import { UserMeasurements } from '@/types/size-recommendation.types';

const MEASUREMENTS_KEY = 'user_measurements';

/**
 * Save user measurements to localStorage
 */
export function saveMeasurements(measurements: UserMeasurements): void {
  try {
    const data = {
      ...measurements,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving measurements to localStorage:', error);
  }
}

/**
 * Get user measurements from localStorage
 */
export function getMeasurements(): UserMeasurements | null {
  try {
    const data = localStorage.getItem(MEASUREMENTS_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as UserMeasurements;
  } catch (error) {
    console.error('Error reading measurements from localStorage:', error);
    return null;
  }
}

/**
 * Check if user has saved measurements
 */
export function hasMeasurements(): boolean {
  return getMeasurements() !== null;
}

/**
 * Clear user measurements from localStorage
 */
export function clearMeasurements(): void {
  try {
    localStorage.removeItem(MEASUREMENTS_KEY);
  } catch (error) {
    console.error('Error clearing measurements from localStorage:', error);
  }
}

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Validate measurements
 */
export function validateMeasurements(measurements: Partial<UserMeasurements>): string[] {
  const errors: string[] = [];
  
  // Height validation (145-185 cm for Southeast Asian)
  if (measurements.height && (measurements.height < 145 || measurements.height > 185)) {
    errors.push('Height must be between 145-185 cm');
  }
  
  // Weight validation (40-120 kg)
  if (measurements.weight && (measurements.weight < 40 || measurements.weight > 120)) {
    errors.push('Weight must be between 40-120 kg');
  }
  
  // Age validation
  if (measurements.age && (measurements.age < 18 || measurements.age > 100)) {
    errors.push('Age must be between 18-100 years');
  }
  
  // Chest validation (60-150 cm)
  if (measurements.chest && (measurements.chest < 60 || measurements.chest > 150)) {
    errors.push('Chest measurement must be between 60-150 cm');
  }
  
  // Waist validation (50-140 cm)
  if (measurements.waist && (measurements.waist < 50 || measurements.waist > 140)) {
    errors.push('Waist measurement must be between 50-140 cm');
  }
  
  // Hips validation (60-150 cm)
  if (measurements.hips && (measurements.hips < 60 || measurements.hips > 150)) {
    errors.push('Hips measurement must be between 60-150 cm');
  }
  
  return errors;
}
