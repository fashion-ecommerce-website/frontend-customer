'use client';

import React, { useState } from 'react';
import type { 
  UserMeasurements, 
  Gender, 
  BellyShape, 
  HipShape,
  ChestShape,
  FitPreference,
  MeasurementsWizardProps
} from '../types';
import { calculateBMI } from '@/utils/bmi';
import { 
  validateField, 
  validateMeasurements
} from '@/utils/validation/measurementsValidation';

type Step = 
  | 'gender'
  | 'height-weight' 
  | 'measurements'
  | 'fit-preference'
  | 'hip-shape'
  | 'chest-shape'
  | 'belly-shape';

export const MeasurementsWizard: React.FC<MeasurementsWizardProps> = ({ 
  onSave, 
  initialData,
  productImage 
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('gender');
  const [formData, setFormData] = useState<Partial<UserMeasurements>>({
    gender: 'MALE',
    height: 168,
    weight: 65,
    chest: 90,
    waist: 75,
    hips: 95,
    bellyShape: 'NORMAL',
    hipShape: 'NORMAL',
    chestShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
    ...initialData
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [, setShowValidationErrors] = useState(false);

  const getStepOrder = (): Step[] => {
    const baseSteps: Step[] = ['gender', 'height-weight', 'measurements', 'fit-preference'];
    
    if (formData.gender === 'FEMALE') {
      return [...baseSteps, 'hip-shape', 'belly-shape'];
    }
    return [...baseSteps, 'chest-shape', 'belly-shape'];
  };

  const stepOrder = getStepOrder();
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const getFieldsForStep = (step: Step): (keyof UserMeasurements)[] => {
    switch (step) {
      case 'gender': return ['gender'];
      case 'height-weight': return ['height', 'weight'];
      case 'measurements': return ['chest', 'waist', 'hips'];
      case 'fit-preference': return ['fitPreference'];
      case 'hip-shape': return ['hipShape'];
      case 'chest-shape': return ['chestShape'];
      case 'belly-shape': return ['bellyShape'];
      default: return [];
    }
  };

  const handleNext = () => {
    const stepFields = getFieldsForStep(currentStep);
    const stepErrors: Record<string, string> = {};
    
    for (const field of stepFields) {
      const value = formData[field];
      if (value !== undefined && value !== null) {
        const error = validateField(field, value);
        if (error) {
          stepErrors[field] = error.message;
        }
      }
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors(stepErrors);
      setShowValidationErrors(true);
      return;
    }
    
    setFieldErrors({});
    setShowValidationErrors(false);
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    setShowValidationErrors(false);
    
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleChange = (field: keyof UserMeasurements, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const validationResult = validateMeasurements(formData);
    
    if (!validationResult.isValid) {
      const errorFields = validationResult.errors.map(e => e.field);
      for (let i = 0; i < stepOrder.length; i++) {
        const stepFields = getFieldsForStep(stepOrder[i]);
        const hasError = stepFields.some(field => errorFields.includes(field as string));
        if (hasError) {
          setCurrentStep(stepOrder[i]);
          const errors: Record<string, string> = {};
          validationResult.errors.forEach(error => {
            if (stepFields.includes(error.field as keyof UserMeasurements)) {
              errors[error.field] = error.message;
            }
          });
          setFieldErrors(errors);
          setShowValidationErrors(true);
          return;
        }
      }
      return;
    }
    
    const measurements: UserMeasurements = {
      ...formData as UserMeasurements,
      bmi: calculateBMI(formData.height!, formData.weight!)
    };
    
    onSave(measurements);
  };

  const canProceed = (): boolean => {
    const stepFields = getFieldsForStep(currentStep);
    for (const field of stepFields) {
      const value = formData[field];
      if (value === undefined || value === null) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="bg-blue-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Step {currentStepIndex + 1} of {totalSteps}</p>
          <div className="flex gap-2">
            {stepOrder.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {productImage && (
            <div className="mb-6 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={productImage} 
                alt="Product" 
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t px-6 py-4 bg-white">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 font-bold text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
              canProceed()
                ? 'bg-black cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {currentStepIndex === stepOrder.length - 1 ? 'Finish' : 'Continue'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  function renderStepContent() {
    switch (currentStep) {
      case 'gender':
        return <GenderStep value={formData.gender!} onChange={(v: Gender) => handleChange('gender', v)} />;
      case 'height-weight':
        return (
          <HeightWeightStep
            height={formData.height!}
            weight={formData.weight!}
            onHeightChange={(v: number) => handleChange('height', v)}
            onWeightChange={(v: number) => handleChange('weight', v)}
            errors={fieldErrors}
          />
        );
      case 'measurements':
        return (
          <MeasurementsStep
            chest={formData.chest!}
            waist={formData.waist!}
            hips={formData.hips!}
            onChestChange={(v: number) => handleChange('chest', v)}
            onWaistChange={(v: number) => handleChange('waist', v)}
            onHipsChange={(v: number) => handleChange('hips', v)}
            errors={fieldErrors}
          />
        );
      case 'fit-preference':
        return (
          <FitPreferenceStep
            value={formData.fitPreference!}
            onChange={(v: FitPreference) => handleChange('fitPreference', v)}
          />
        );
      case 'hip-shape':
        return (
          <HipShapeStep
            value={formData.hipShape!}
            onChange={(v: HipShape) => handleChange('hipShape', v)}
            gender={formData.gender!}
          />
        );
      case 'chest-shape':
        return (
          <ChestShapeStep
            value={formData.chestShape!}
            onChange={(v: ChestShape) => handleChange('chestShape', v)}
          />
        );
      case 'belly-shape':
        return (
          <BellyShapeStep
            value={formData.bellyShape!}
            onChange={(v: BellyShape) => handleChange('bellyShape', v)}
            gender={formData.gender!}
          />
        );
      default:
        return null;
    }
  }
};


// Helper component for body shape selection
function BodyShapeButton({ 
  isSelected, 
  onClick, 
  imageUrl, 
  label 
}: { 
  isSelected: boolean; 
  onClick: () => void; 
  imageUrl: string; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative text-center transition-all"
    >
      <div className={`mb-4 flex justify-center bg-white rounded-xl p-6 transition-all ${
        isSelected
          ? 'shadow-lg ring-2 ring-blue-600'
          : 'shadow-md hover:shadow-xl'
      }`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl}
          alt={label}
          className="h-40 w-auto object-contain"
        />
      </div>
      <div className="font-semibold text-black text-lg">{label}</div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Step Components
function GenderStep({ value, onChange }: { value: Gender; onChange: (v: Gender) => void }) {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-black">What&apos;s your gender?</h2>
      <p className="text-gray-600">This helps us provide better size recommendations</p>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => onChange('MALE')}
          className={`p-8 border-2 rounded-xl transition-all ${
            value === 'MALE'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="font-semibold text-black text-2xl">Male</div>
        </button>
        
        <button
          onClick={() => onChange('FEMALE')}
          className={`p-8 border-2 rounded-xl transition-all ${
            value === 'FEMALE'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="font-semibold text-black text-2xl">Female</div>
        </button>
      </div>
    </div>
  );
}

function HeightWeightStep({ 
  height, 
  weight, 
  onHeightChange, 
  onWeightChange,
  errors 
}: { 
  height: number; 
  weight: number; 
  onHeightChange: (v: number) => void; 
  onWeightChange: (v: number) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Your measurements</h2>
        <p className="text-gray-600">Find the size that fits you best based on people just like you</p>
      </div>

      <div className="space-y-6 mt-8">
        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 uppercase mb-2">Height</label>
          <div className="relative">
            <input
              type="number"
              value={height}
              onChange={(e) => onHeightChange(parseFloat(e.target.value))}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none text-black text-lg ${
                errors?.height 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-gray-900'
              }`}
              placeholder="168"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">cm</span>
          </div>
          {errors?.height && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.height}
            </p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 uppercase mb-2">Weight</label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value))}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none text-black text-lg ${
                errors?.weight 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-gray-900'
              }`}
              placeholder="65"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
          </div>
          {errors?.weight && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.weight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MeasurementsStep({
  chest,
  waist,
  hips,
  onChestChange,
  onWaistChange,
  onHipsChange,
  errors
}: {
  chest: number;
  waist: number;
  hips: number;
  onChestChange: (v: number) => void;
  onWaistChange: (v: number) => void;
  onHipsChange: (v: number) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Body measurements</h2>
        <p className="text-gray-600">Measure around the fullest part</p>
      </div>

      <div className="space-y-4 mt-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">Chest (cm)</label>
          <input
            type="number"
            value={chest}
            onChange={(e) => onChestChange(parseFloat(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-black text-lg ${
              errors?.chest 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="90"
            step="0.1"
          />
          {errors?.chest && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.chest}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">Waist (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => onWaistChange(parseFloat(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-black text-lg ${
              errors?.waist 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="75"
            step="0.1"
          />
          {errors?.waist && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.waist}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">Hips (cm)</label>
          <input
            type="number"
            value={hips}
            onChange={(e) => onHipsChange(parseFloat(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-black text-lg ${
              errors?.hips 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-gray-300 focus:border-gray-900'
            }`}
            placeholder="95"
            step="0.1"
          />
          {errors?.hips && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.hips}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FitPreferenceStep({ 
  value, 
  onChange 
}: { 
  value: FitPreference; 
  onChange: (v: FitPreference) => void 
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Fit preference</h2>
        <p className="text-gray-600">I want this item to fit...</p>
      </div>

      <div className="mt-8">
        <div className="relative px-4">
          <input
            type="range"
            min="0"
            max="2"
            value={value === 'TIGHT' ? 0 : value === 'COMFORTABLE' ? 1 : 2}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onChange(val === 0 ? 'TIGHT' : val === 1 ? 'COMFORTABLE' : 'LOOSE');
            }}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-600">« TIGHTER</span>
            <span className="font-semibold text-black uppercase">
              {value === 'TIGHT' ? 'Tight' : value === 'COMFORTABLE' ? 'Average' : 'Loose'}
            </span>
            <span className="text-gray-600">LOOSER »</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
function HipShapeStep({ 
  value, 
  onChange,
  gender 
}: { 
  value: HipShape; 
  onChange: (v: HipShape) => void;
  gender: Gender;
}) {
  const shapes = [
    { 
      value: 'NARROW' as HipShape, 
      label: 'Straighter',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B2.H1.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.H1.png'
    },
    { 
      value: 'NORMAL' as HipShape, 
      label: 'Average',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B2.H2.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.H2.png'
    },
    { 
      value: 'WIDE' as HipShape, 
      label: 'Wider',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B2.H3.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.H3.png'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Your hip shape</h2>
        <p className="text-gray-600">Possible shapes for your height & weight</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {shapes.map((shape) => (
          <BodyShapeButton
            key={shape.value}
            isSelected={value === shape.value}
            onClick={() => onChange(shape.value)}
            imageUrl={gender === 'FEMALE' ? shape.imageFemale : shape.imageMale}
            label={shape.label}
          />
        ))}
      </div>
    </div>
  );
}

function BellyShapeStep({ 
  value, 
  onChange,
  gender 
}: { 
  value: BellyShape; 
  onChange: (v: BellyShape) => void;
  gender: Gender;
}) {
  const shapes = [
    { 
      value: 'FLAT' as BellyShape, 
      label: 'Flatter',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B1.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.B1.png'
    },
    { 
      value: 'NORMAL' as BellyShape, 
      label: 'Average',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B2.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.B2.png'
    },
    { 
      value: 'ROUND' as BellyShape, 
      label: 'Curvier',
      imageFemale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/F.32.B3.png',
      imageMale: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.32.B3.png'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Your belly shape</h2>
        <p className="text-gray-600">Possible shapes for your height & weight</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {shapes.map((shape) => (
          <BodyShapeButton
            key={shape.value}
            isSelected={value === shape.value}
            onClick={() => onChange(shape.value)}
            imageUrl={gender === 'FEMALE' ? shape.imageFemale : shape.imageMale}
            label={shape.label}
          />
        ))}
      </div>
    </div>
  );
}

function ChestShapeStep({ 
  value, 
  onChange 
}: { 
  value: ChestShape; 
  onChange: (v: ChestShape) => void;
}) {
  const shapes = [
    { 
      value: 'SLIM' as ChestShape, 
      label: 'Slimmer',
      image: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.24.B3.C1.png'
    },
    { 
      value: 'NORMAL' as ChestShape, 
      label: 'Average',
      image: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.24.B3.C2.png'
    },
    { 
      value: 'BROAD' as ChestShape, 
      label: 'Broader',
      image: 'https://media.fitanalytics.com/widget_v2/bodyshapes-20151211/M.24.B3.C3.png'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Your chest shape</h2>
        <p className="text-gray-600">Possible shapes for your height & weight</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {shapes.map((shape) => (
          <BodyShapeButton
            key={shape.value}
            isSelected={value === shape.value}
            onClick={() => onChange(shape.value)}
            imageUrl={shape.image}
            label={shape.label}
          />
        ))}
      </div>
    </div>
  );
}
