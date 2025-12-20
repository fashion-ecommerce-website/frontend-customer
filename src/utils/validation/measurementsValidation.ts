/**
 * Validation utilities for user measurements
 */

import { UserMeasurements } from '@/types/size-recommendation.types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation ranges for measurements
 */
const VALIDATION_RANGES = {
  height: { min: 140, max: 220 },
  weight: { min: 35, max: 200 },
  chest: { min: 60, max: 150 },
  waist: { min: 50, max: 150 },
  hips: { min: 60, max: 160 },
  bmi: { min: 15, max: 45 },
};

/**
 * Validate a single measurement field
 */
export function validateField(
  field: keyof UserMeasurements,
  value: string | number | boolean | undefined
): ValidationError | null {
  // Required fields check
  if (value === undefined || value === null || value === '') {
    return {
      field,
      message: `${getFieldLabel(field)} is required`,
    };
  }

  // Height validation
  if (field === 'height') {
    const height = Number(value);
    if (isNaN(height)) {
      return { field, message: 'Height must be a valid number' };
    }
    if (height < VALIDATION_RANGES.height.min) {
      return { field, message: `Height must be at least ${VALIDATION_RANGES.height.min}cm` };
    }
    if (height > VALIDATION_RANGES.height.max) {
      return { field, message: `Height must be less than ${VALIDATION_RANGES.height.max}cm` };
    }
  }

  // Weight validation
  if (field === 'weight') {
    const weight = Number(value);
    if (isNaN(weight)) {
      return { field, message: 'Weight must be a valid number' };
    }
    if (weight < VALIDATION_RANGES.weight.min) {
      return { field, message: `Weight must be at least ${VALIDATION_RANGES.weight.min}kg` };
    }
    if (weight > VALIDATION_RANGES.weight.max) {
      return { field, message: `Weight must be less than ${VALIDATION_RANGES.weight.max}kg` };
    }
  }

  // Chest validation
  if (field === 'chest') {
    const chest = Number(value);
    if (isNaN(chest)) {
      return { field, message: 'Chest measurement must be a valid number' };
    }
    if (chest < VALIDATION_RANGES.chest.min) {
      return { field, message: `Chest must be at least ${VALIDATION_RANGES.chest.min}cm` };
    }
    if (chest > VALIDATION_RANGES.chest.max) {
      return { field, message: `Chest must be less than ${VALIDATION_RANGES.chest.max}cm` };
    }
  }

  // Waist validation
  if (field === 'waist') {
    const waist = Number(value);
    if (isNaN(waist)) {
      return { field, message: 'Waist measurement must be a valid number' };
    }
    if (waist < VALIDATION_RANGES.waist.min) {
      return { field, message: `Waist must be at least ${VALIDATION_RANGES.waist.min}cm` };
    }
    if (waist > VALIDATION_RANGES.waist.max) {
      return { field, message: `Waist must be less than ${VALIDATION_RANGES.waist.max}cm` };
    }
  }

  // Hips validation
  if (field === 'hips') {
    const hips = Number(value);
    if (isNaN(hips)) {
      return { field, message: 'Hips measurement must be a valid number' };
    }
    if (hips < VALIDATION_RANGES.hips.min) {
      return { field, message: `Hips must be at least ${VALIDATION_RANGES.hips.min}cm` };
    }
    if (hips > VALIDATION_RANGES.hips.max) {
      return { field, message: `Hips must be less than ${VALIDATION_RANGES.hips.max}cm` };
    }
  }

  // BMI validation
  if (field === 'bmi') {
    const bmi = Number(value);
    if (isNaN(bmi)) {
      return { field, message: 'BMI must be a valid number' };
    }
    if (bmi < VALIDATION_RANGES.bmi.min) {
      return { field, message: `BMI is too low (${bmi.toFixed(1)}). Please check your measurements.` };
    }
    if (bmi > VALIDATION_RANGES.bmi.max) {
      return { field, message: `BMI is too high (${bmi.toFixed(1)}). Please check your measurements.` };
    }
  }

  // Gender validation
  if (field === 'gender') {
    if (value !== 'MALE' && value !== 'FEMALE') {
      return { field, message: 'Please select a valid gender' };
    }
  }

  // Body shape validations
  if (field === 'bellyShape') {
    if (!['FLAT', 'NORMAL', 'ROUND'].includes(String(value))) {
      return { field, message: 'Please select a valid belly shape' };
    }
  }

  if (field === 'hipShape') {
    if (!['NARROW', 'NORMAL', 'WIDE'].includes(String(value))) {
      return { field, message: 'Please select a valid hip shape' };
    }
  }

  if (field === 'chestShape') {
    if (!['SLIM', 'NORMAL', 'BROAD'].includes(String(value))) {
      return { field, message: 'Please select a valid chest shape' };
    }
  }

  // Fit preference validation
  if (field === 'fitPreference') {
    if (!['TIGHT', 'COMFORTABLE', 'LOOSE'].includes(String(value))) {
      return { field, message: 'Please select a valid fit preference' };
    }
  }

  return null;
}

/**
 * Validate entire measurements object
 */
export function validateMeasurements(measurements: Partial<UserMeasurements>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  const requiredFields: (keyof UserMeasurements)[] = [
    'gender',
    'height',
    'weight',
    'chest',
    'waist',
    'hips',
    'bellyShape',
    'hipShape',
    'fitPreference',
  ];

  // Add gender-specific required fields
  if (measurements.gender === 'MALE') {
    requiredFields.push('chestShape');
  }

  // Validate each required field
  for (const field of requiredFields) {
    const error = validateField(field, measurements[field]);
    if (error) {
      errors.push(error);
    }
  }

  // Cross-field validations
  if (measurements.height && measurements.weight) {
    const height = Number(measurements.height);
    const weight = Number(measurements.weight);
    
    if (!isNaN(height) && !isNaN(weight)) {
      const bmi = weight / Math.pow(height / 100, 2);
      
      if (bmi < VALIDATION_RANGES.bmi.min || bmi > VALIDATION_RANGES.bmi.max) {
        errors.push({
          field: 'bmi',
          message: `Your height and weight combination results in an unusual BMI (${bmi.toFixed(1)}). Please verify your measurements.`,
        });
      }
    }
  }

  // Logical validations
  if (measurements.waist && measurements.hips) {
    const waist = Number(measurements.waist);
    const hips = Number(measurements.hips);
    
    if (!isNaN(waist) && !isNaN(hips)) {
      // Waist should typically be smaller than hips
      if (waist > hips + 20) {
        errors.push({
          field: 'waist',
          message: 'Waist measurement seems unusually large compared to hips. Please verify.',
        });
      }
    }
  }

  if (measurements.chest && measurements.waist) {
    const chest = Number(measurements.chest);
    const waist = Number(measurements.waist);
    
    if (!isNaN(chest) && !isNaN(waist)) {
      // Chest should typically be larger than waist
      if (chest < waist - 10) {
        errors.push({
          field: 'chest',
          message: 'Chest measurement seems unusually small compared to waist. Please verify.',
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get user-friendly field label
 */
function getFieldLabel(field: keyof UserMeasurements): string {
  const labels: Record<string, string> = {
    gender: 'Gender',
    height: 'Height',
    weight: 'Weight',
    chest: 'Chest',
    waist: 'Waist',
    hips: 'Hips',
    bmi: 'BMI',
    bellyShape: 'Belly shape',
    hipShape: 'Hip shape',
    chestShape: 'Chest shape',
    fitPreference: 'Fit preference',
    hasReturnHistory: 'Return history',
  };
  return labels[field] || field;
}

/**
 * Check if measurements are complete
 */
export function isMeasurementsComplete(measurements: Partial<UserMeasurements>): boolean {
  const result = validateMeasurements(measurements);
  return result.isValid;
}

/**
 * Get validation ranges (for UI display)
 */
export function getValidationRanges() {
  return VALIDATION_RANGES;
}
