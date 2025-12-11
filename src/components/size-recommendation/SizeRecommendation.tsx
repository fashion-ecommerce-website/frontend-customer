'use client';

import React, { useState, useEffect } from 'react';
import { UserMeasurements, Size, SizeRecommendationResponse } from '@/types/size-recommendation.types';
import { getMeasurements } from '@/utils/localStorage/measurements';
import { MeasurementsForm } from './MeasurementsForm';

interface SizeRecommendationProps {
  category: string;
  availableSizes: Size[];
  onSizeSelect?: (size: Size) => void;
}

export function SizeRecommendation({ 
  category, 
  availableSizes,
  onSizeSelect 
}: SizeRecommendationProps) {
  const [showForm, setShowForm] = useState(false);
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [recommendation, setRecommendation] = useState<SizeRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load measurements from localStorage on mount
  useEffect(() => {
    const savedMeasurements = getMeasurements();
    setMeasurements(savedMeasurements);
  }, []);

  // Get recommendation when measurements are available
  const getRecommendation = async (userMeasurements: UserMeasurements) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Call backend API when ready
      // For now, use simple logic based on BMI and preferences
      const recommendedSize = calculateRecommendedSize(userMeasurements, category);
      
      const altSizes: { size: string; confidence: number }[] = [];
      const smaller = getSmallerSize(recommendedSize);
      const larger = getLargerSize(recommendedSize);
      if (smaller && availableSizes.includes(smaller)) {
        altSizes.push({ size: smaller, confidence: 0.15 });
      }
      if (larger && availableSizes.includes(larger)) {
        altSizes.push({ size: larger, confidence: 0.10 });
      }
      
      setRecommendation({
        recommendedSize,
        confidence: 0.75,
        alternatives: altSizes,
        metadata: null,
        hasMeasurements: true
      });
    } catch (err) {
      setError('Unable to get size recommendation. Please try again.');
      console.error('Error getting recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeasurements = (newMeasurements: UserMeasurements) => {
    setMeasurements(newMeasurements);
    setShowForm(false);
    getRecommendation(newMeasurements);
  };

  const handleGetRecommendation = () => {
    if (measurements) {
      getRecommendation(measurements);
    } else {
      setShowForm(true);
    }
  };

  const handleSizeClick = (size: Size) => {
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Size Recommendation</h3>
            <p className="text-sm text-gray-600">Get personalized size suggestion</p>
          </div>
        </div>
        
        {measurements && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit Measurements
          </button>
        )}
      </div>

      {/* Show form if no measurements or editing */}
      {showForm && (
        <div className="border-t pt-6">
          <MeasurementsForm
            onSave={handleSaveMeasurements}
            onCancel={() => setShowForm(false)}
            initialData={measurements}
          />
        </div>
      )}

      {/* Show recommendation or prompt */}
      {!showForm && (
        <>
          {recommendation ? (
            <div className="space-y-4">
              {/* Recommended Size */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-800">Recommended Size</span>
                  {recommendation.confidence && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {(recommendation.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
                
                {recommendation.recommendedSize && (
                  <button
                    onClick={() => handleSizeClick(recommendation.recommendedSize as Size)}
                    className="w-full bg-white border-2 border-blue-600 rounded-lg px-6 py-4 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-3xl font-bold text-blue-600">
                      {recommendation.recommendedSize}
                    </span>
                  </button>
                )}
              </div>

              {/* Reasoning */}
              {measurements && (
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Why this size?</p>
                  <p>{generateReasoning(measurements, recommendation.recommendedSize as Size, category)}</p>
                </div>
              )}

              {/* Alternative Sizes */}
              {recommendation.alternatives.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Alternative Sizes</p>
                  <div className="flex gap-3">
                    {recommendation.alternatives.map((alt) => (
                      <button
                        key={alt.size}
                        onClick={() => handleSizeClick(alt.size as Size)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-xl font-semibold text-gray-900">{alt.size}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(alt.confidence * 100).toFixed(0)}% match
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User Info Summary */}
              {measurements && (
                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p>
                    Based on: {measurements.gender} • {measurements.height}cm • {measurements.weight}kg • BMI {measurements.bmi?.toFixed(1) ?? 'N/A'} • {measurements.fitPreference?.toLowerCase() ?? 'comfortable'} fit preference
                  </p>
                </div>
              )}

              <button
                onClick={() => getRecommendation(measurements!)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ↻ Recalculate Recommendation
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {measurements ? 'Get Your Size Recommendation' : 'Add Your Measurements'}
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                {measurements 
                  ? 'Click below to get AI-powered size suggestion based on your body measurements'
                  : 'Provide your measurements to get personalized size recommendations'
                }
              </p>
              
              <button
                onClick={handleGetRecommendation}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Calculating...
                  </span>
                ) : measurements ? (
                  'Get Size Recommendation'
                ) : (
                  'Add Measurements'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper functions for size calculation (temporary until backend is ready)
function calculateRecommendedSize(measurements: UserMeasurements, category: string): Size {
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

function getSmallerSize(size: Size): Size | null {
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(size);
  return index > 0 ? sizes[index - 1] : null;
}

function getLargerSize(size: Size): Size | null {
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(size);
  return index < sizes.length - 1 ? sizes[index + 1] : null;
}

function generateReasoning(measurements: UserMeasurements, recommendedSize: Size, category: string): string {
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
