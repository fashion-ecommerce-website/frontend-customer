'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserMeasurements, 
  Gender, 
  BellyShape, 
  HipShape, 
  FitPreference 
} from '@/types/size-recommendation.types';
import { 
  saveMeasurements, 
  getMeasurements, 
  calculateBMI,
  validateMeasurements 
} from '@/utils/localStorage/measurements';

interface MeasurementsFormProps {
  onSave: (measurements: UserMeasurements) => void;
  onCancel: () => void;
  initialData?: UserMeasurements | null;
}

export function MeasurementsForm({ onSave, onCancel, initialData }: MeasurementsFormProps) {
  const [formData, setFormData] = useState<Partial<UserMeasurements>>({
    gender: 'MALE',
    age: 25,
    height: 168,
    weight: 65,
    chest: 90,
    waist: 75,
    hips: 95,
    bellyShape: 'NORMAL',
    hipShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
    braSize: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState<string[]>([]);

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const bmi = calculateBMI(formData.height, formData.weight);
      setFormData(prev => ({ ...prev, bmi }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (field: keyof UserMeasurements, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateMeasurements(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Check required fields
    if (!formData.gender || !formData.height || !formData.weight || 
        !formData.chest || !formData.waist || !formData.hips) {
      setErrors(['Please fill in all required fields']);
      return;
    }
    
    const measurements: UserMeasurements = {
      ...formData as UserMeasurements,
      bmi: calculateBMI(formData.height!, formData.weight!),
      lastUpdated: new Date().toISOString()
    };
    
    saveMeasurements(measurements);
    onSave(measurements);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value as Gender)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="25"
              min="18"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Body Measurements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Body Measurements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="168"
              step="0.1"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="65"
              step="0.1"
            />
          </div>

          {/* Chest */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Chest (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.chest}
              onChange={(e) => handleChange('chest', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="90"
              step="0.1"
            />
          </div>

          {/* Waist */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Waist (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.waist}
              onChange={(e) => handleChange('waist', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="75"
              step="0.1"
            />
          </div>

          {/* Hips */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Hips (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.hips}
              onChange={(e) => handleChange('hips', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="95"
              step="0.1"
            />
          </div>

          {/* BMI (calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BMI (calculated)
            </label>
            <input
              type="text"
              value={formData.bmi?.toFixed(1) || '0.0'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
            />
          </div>
        </div>
      </div>

      {/* Body Shapes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Body Shape</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Belly Shape */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Belly Shape
            </label>
            <select
              value={formData.bellyShape}
              onChange={(e) => handleChange('bellyShape', e.target.value as BellyShape)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="FLAT">Flat</option>
              <option value="NORMAL">Normal</option>
              <option value="ROUND">Round</option>
            </select>
          </div>

          {/* Hip Shape */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hip Shape
            </label>
            <select
              value={formData.hipShape}
              onChange={(e) => handleChange('hipShape', e.target.value as HipShape)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="NARROW">Narrow</option>
              <option value="NORMAL">Normal</option>
              <option value="WIDE">Wide</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fit Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fit Preference
            </label>
            <select
              value={formData.fitPreference}
              onChange={(e) => handleChange('fitPreference', e.target.value as FitPreference)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="TIGHT">Tight / Fitted</option>
              <option value="COMFORTABLE">Comfortable / Regular</option>
              <option value="LOOSE">Loose / Oversized</option>
            </select>
          </div>

          {/* Bra Size (Female only) */}
          {formData.gender === 'FEMALE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bra Size (optional)
              </label>
              <input
                type="text"
                value={formData.braSize || ''}
                onChange={(e) => handleChange('braSize', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="e.g., 70B, 75A"
              />
            </div>
          )}
        </div>

        {/* Return History */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasReturnHistory"
            checked={formData.hasReturnHistory}
            onChange={(e) => handleChange('hasReturnHistory', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasReturnHistory" className="ml-2 text-sm text-gray-700">
            I have returned items due to sizing issues before
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Measurements
        </button>
      </div>
    </form>
  );
}
