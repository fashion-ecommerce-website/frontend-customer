/**
 * Example usage of measurements validation
 * This file demonstrates how to use the validation utilities
 */

import { 
  validateField, 
  validateMeasurements, 
  isMeasurementsComplete,
  getValidationRanges 
} from './measurementsValidation';
import { UserMeasurements } from '@/types/size-recommendation.types';

// Example 1: Validate a single field
function exampleValidateSingleField() {
  console.log('=== Example 1: Validate Single Field ===');
  
  // Valid height
  const validHeight = validateField('height', 170);
  console.log('Valid height (170cm):', validHeight); // null (no error)
  
  // Invalid height (too short)
  const invalidHeight = validateField('height', 100);
  console.log('Invalid height (100cm):', invalidHeight?.message);
  // Output: "Height must be at least 140cm"
  
  // Invalid weight (too heavy)
  const invalidWeight = validateField('weight', 250);
  console.log('Invalid weight (250kg):', invalidWeight?.message);
  // Output: "Weight must be less than 200kg"
}

// Example 2: Validate complete measurements
function exampleValidateCompleteMeasurements() {
  console.log('\n=== Example 2: Validate Complete Measurements ===');
  
  const measurements: Partial<UserMeasurements> = {
    gender: 'MALE',
    age: 25,
    height: 175,
    weight: 70,
    chest: 95,
    waist: 80,
    hips: 90,
    bellyShape: 'NORMAL',
    hipShape: 'NORMAL',
    chestShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
  };
  
  const result = validateMeasurements(measurements);
  console.log('Is valid:', result.isValid);
  console.log('Errors:', result.errors);
  // Output: Is valid: true, Errors: []
}

// Example 3: Invalid measurements with multiple errors
function exampleInvalidMeasurements() {
  console.log('\n=== Example 3: Invalid Measurements ===');
  
  const invalidMeasurements: Partial<UserMeasurements> = {
    gender: 'MALE',
    age: 15, // Too young
    height: 250, // Too tall
    weight: 30, // Too light
    chest: 50, // Too small
    waist: 180, // Too large
    hips: 70,
    bellyShape: 'NORMAL',
    hipShape: 'NORMAL',
    chestShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
  };
  
  const result = validateMeasurements(invalidMeasurements);
  console.log('Is valid:', result.isValid);
  console.log('Number of errors:', result.errors.length);
  result.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
}

// Example 4: Check if measurements are complete
function exampleCheckComplete() {
  console.log('\n=== Example 4: Check if Complete ===');
  
  const incompleteMeasurements: Partial<UserMeasurements> = {
    gender: 'FEMALE',
    age: 28,
    height: 165,
    // Missing weight, chest, waist, hips, etc.
  };
  
  const isComplete = isMeasurementsComplete(incompleteMeasurements);
  console.log('Is complete:', isComplete); // false
}

// Example 5: Get validation ranges
function exampleGetRanges() {
  console.log('\n=== Example 5: Get Validation Ranges ===');
  
  const ranges = getValidationRanges();
  console.log('Height range:', ranges.height); // { min: 140, max: 220 }
  console.log('Weight range:', ranges.weight); // { min: 35, max: 200 }
  console.log('Age range:', ranges.age); // { min: 18, max: 100 }
}

// Example 6: Cross-field validation (BMI check)
function exampleCrossFieldValidation() {
  console.log('\n=== Example 6: Cross-Field Validation ===');
  
  const measurements: Partial<UserMeasurements> = {
    gender: 'MALE',
    age: 25,
    height: 180, // 180cm
    weight: 50,  // 50kg - Results in very low BMI (15.4)
    chest: 85,
    waist: 70,
    hips: 85,
    bellyShape: 'FLAT',
    hipShape: 'NARROW',
    chestShape: 'SLIM',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
  };
  
  const result = validateMeasurements(measurements);
  console.log('Is valid:', result.isValid);
  if (!result.isValid) {
    result.errors.forEach(error => {
      console.log(`- ${error.field}: ${error.message}`);
    });
  }
  // May show BMI warning
}

// Example 7: Proportional validation
function exampleProportionalValidation() {
  console.log('\n=== Example 7: Proportional Validation ===');
  
  const measurements: Partial<UserMeasurements> = {
    gender: 'MALE',
    age: 30,
    height: 175,
    weight: 75,
    chest: 70,  // Unusually small compared to waist
    waist: 100, // Large waist
    hips: 80,   // Smaller than waist
    bellyShape: 'ROUND',
    hipShape: 'NORMAL',
    chestShape: 'SLIM',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
  };
  
  const result = validateMeasurements(measurements);
  console.log('Is valid:', result.isValid);
  if (!result.isValid) {
    console.log('Proportional errors detected:');
    result.errors.forEach(error => {
      console.log(`- ${error.field}: ${error.message}`);
    });
  }
}

// Example 8: Using validation in a form
function exampleFormValidation() {
  console.log('\n=== Example 8: Form Validation ===');
  
  const formData: Partial<UserMeasurements> = {
    gender: 'FEMALE',
    age: 28,
    height: 165,
    weight: 55,
    chest: 85,
    waist: 68,
    hips: 92,
    bellyShape: 'NORMAL',
    hipShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
  };
  
  // Validate before submission
  const result = validateMeasurements(formData);
  
  if (result.isValid) {
    console.log('✓ Form is valid, ready to submit');
    // saveMeasurements(formData as UserMeasurements);
  } else {
    console.log('✗ Form has errors:');
    result.errors.forEach(error => {
      console.log(`  - ${error.field}: ${error.message}`);
    });
  }
}

// Run all examples
export function runAllExamples() {
  exampleValidateSingleField();
  exampleValidateCompleteMeasurements();
  exampleInvalidMeasurements();
  exampleCheckComplete();
  exampleGetRanges();
  exampleCrossFieldValidation();
  exampleProportionalValidation();
  exampleFormValidation();
}

// Uncomment to run examples:
// runAllExamples();
