'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserMeasurements, 
  Gender, 
  BellyShape, 
  HipShape,
  ChestShape,
  FitPreference 
} from '@/types/size-recommendation.types';
import { 
  saveMeasurements, 
  calculateBMI 
} from '@/utils/localStorage/measurements';

interface MeasurementsWizardProps {
  onSave: (measurements: UserMeasurements) => void;
  onCancel: () => void;
  initialData?: UserMeasurements | null;
  productImage?: string;
}

type Step = 
  | 'gender'
  | 'height-weight' 
  | 'measurements'
  | 'fit-preference'
  | 'age'
  | 'bra-size'
  | 'hip-shape'
  | 'chest-shape'
  | 'belly-shape';

export function MeasurementsWizard({ 
  onSave, 
  onCancel, 
  initialData,
  productImage 
}: MeasurementsWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('gender');
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
    chestShape: 'NORMAL',
    fitPreference: 'COMFORTABLE',
    hasReturnHistory: false,
    braSize: '',
    ...initialData
  });

  // Define step order based on gender
  const getStepOrder = (): Step[] => {
    const baseSteps: Step[] = ['gender', 'height-weight', 'measurements', 'fit-preference', 'age'];
    
    if (formData.gender === 'FEMALE') {
      return [...baseSteps, 'bra-size', 'hip-shape', 'belly-shape'];
    }
    
    // Male: chest shape instead of hip shape
    return [...baseSteps, 'chest-shape', 'belly-shape'];
  };

  const stepOrder = getStepOrder();
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleChange = (field: keyof UserMeasurements, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const measurements: UserMeasurements = {
      ...formData as UserMeasurements,
      bmi: calculateBMI(formData.height!, formData.weight!),
      lastUpdated: new Date().toISOString()
    };
    
    saveMeasurements(measurements);
    onSave(measurements);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'gender':
        return !!formData.gender;
      case 'height-weight':
        return !!formData.height && !!formData.weight;
      case 'measurements':
        return !!formData.chest && !!formData.waist && !!formData.hips;
      case 'fit-preference':
        return !!formData.fitPreference;
      case 'age':
        return !!formData.age && formData.age >= 18;
      case 'bra-size':
        return true; // Optional
      case 'hip-shape':
        return !!formData.hipShape;
      case 'chest-shape':
        return !!formData.chestShape;
      case 'belly-shape':
        return !!formData.bellyShape;
      default:
        return true;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="bg-blue-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
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
          {/* Product Image (if provided) */}
          {productImage && (
            <div className="mb-6 flex justify-center">
              <img 
                src={productImage} 
                alt="Product" 
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t px-6 py-4 bg-white">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                ? 'bg-red-600 hover:bg-red-700'
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
        return <GenderStep value={formData.gender!} onChange={(v) => handleChange('gender', v)} />;
      
      case 'height-weight':
        return (
          <HeightWeightStep
            height={formData.height!}
            weight={formData.weight!}
            onHeightChange={(v) => handleChange('height', v)}
            onWeightChange={(v) => handleChange('weight', v)}
          />
        );
      
      case 'measurements':
        return (
          <MeasurementsStep
            chest={formData.chest!}
            waist={formData.waist!}
            hips={formData.hips!}
            onChestChange={(v) => handleChange('chest', v)}
            onWaistChange={(v) => handleChange('waist', v)}
            onHipsChange={(v) => handleChange('hips', v)}
          />
        );
      
      case 'fit-preference':
        return (
          <FitPreferenceStep
            value={formData.fitPreference!}
            onChange={(v) => handleChange('fitPreference', v)}
          />
        );
      
      case 'age':
        return <AgeStep value={formData.age!} onChange={(v) => handleChange('age', v)} />;
      
      case 'bra-size':
        return (
          <BraSizeStep
            value={formData.braSize || ''}
            onChange={(v) => handleChange('braSize', v)}
          />
        );
      
      case 'hip-shape':
        return (
          <HipShapeStep
            value={formData.hipShape!}
            onChange={(v) => handleChange('hipShape', v)}
            gender={formData.gender!}
          />
        );
      
      case 'chest-shape':
        return (
          <ChestShapeStep
            value={formData.chestShape!}
            onChange={(v) => handleChange('chestShape', v)}
          />
        );
      
      case 'belly-shape':
        return (
          <BellyShapeStep
            value={formData.bellyShape!}
            onChange={(v) => handleChange('bellyShape', v)}
            gender={formData.gender!}
          />
        );
      
      default:
        return null;
    }
  }
}

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
      <h2 className="text-3xl font-bold text-black">What's your gender?</h2>
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
  onWeightChange 
}: { 
  height: number; 
  weight: number; 
  onHeightChange: (v: number) => void; 
  onWeightChange: (v: number) => void; 
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
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg"
              placeholder="168"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">cm</span>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 uppercase mb-2">Weight</label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value))}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg"
              placeholder="65"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
          </div>
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
  onHipsChange
}: {
  chest: number;
  waist: number;
  hips: number;
  onChestChange: (v: number) => void;
  onWaistChange: (v: number) => void;
  onHipsChange: (v: number) => void;
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
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg"
            placeholder="90"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">Waist (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => onWaistChange(parseFloat(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg"
            placeholder="75"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">Hips (cm)</label>
          <input
            type="number"
            value={hips}
            onChange={(e) => onHipsChange(parseFloat(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg"
            placeholder="95"
            step="0.1"
          />
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
        {/* Slider */}
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

function AgeStep({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">How old are you?</h2>
      </div>

      <div className="mt-8">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-black text-lg text-center"
          placeholder="25"
          min="18"
          max="100"
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-600">
          <strong>Why do we ask for this?</strong> Age has an impact on how your weight is distributed. 
          Knowing your age helps us recommend the right size.
        </p>
      </div>
    </div>
  );
}

function BraSizeStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const sizes = ['60', '65', '70', '75', '80', '85', '90', '95', '100', '105', '110', '115', '120', '125'];
  const cups = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Add bra size</h2>
        <p className="text-gray-600">Showing: European sizes</p>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Bust */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Bust</label>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onChange(size + (value.replace(/\d+/g, '') || 'B'))}
                  className={`p-2 border rounded text-sm ${
                    value.startsWith(size)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Cup</label>
            <div className="grid grid-cols-4 gap-2">
              {cups.map((cup) => (
                <button
                  key={cup}
                  onClick={() => onChange((value.match(/\d+/)?.[0] || '70') + cup)}
                  className={`p-2 border rounded text-sm ${
                    value.endsWith(cup)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {cup}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
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
