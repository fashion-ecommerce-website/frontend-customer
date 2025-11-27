'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getMeasurements } from '@/utils/localStorage/measurements';
import { UserMeasurements, Size } from '@/types/size-recommendation.types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  productId: number;
  availableSizes: Size[];
  onSizeSelect?: (size: Size) => void;
  onAddMeasurements?: () => void;
}

export function SizeGuideModal({ 
  isOpen, 
  onClose, 
  category = 'Clothing',
  productId,
  availableSizes,
  onSizeSelect,
  onAddMeasurements
}: SizeGuideModalProps) {
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [recommendedSize, setRecommendedSize] = useState<Size | null>(null);
  const [alternativeSize, setAlternativeSize] = useState<Size | null>(null);
  const [sizeFitStats, setSizeFitStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Load measurements and calculate recommendation when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedMeasurements = getMeasurements();
      setMeasurements(savedMeasurements);
      
      if (savedMeasurements) {
        const { recommended, alternative } = calculateRecommendedSizes(
          savedMeasurements, 
          category,
          availableSizes
        );
        setRecommendedSize(recommended);
        setAlternativeSize(alternative);
      }

      // Load size fit statistics
      loadSizeFitStatistics();
    }
  }, [isOpen, category, availableSizes, productId]);

  const loadSizeFitStatistics = async () => {
    setLoadingStats(true);
    try {
      const { recommendationApi } = await import('@/services/api/recommendationApi');
      const response = await recommendationApi.getSizeFitStatistics(productId);
      if (response.success && response.data) {
        setSizeFitStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load size fit statistics:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSizeClick = (size: Size) => {
    if (onSizeSelect) {
      onSizeSelect(size);
    }
    onClose();
  };

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Size Guide</h2>
              <p className="text-sm text-gray-300">{category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 md:p-8 space-y-8">
          
          {/* Size Fit Finder Section - Based on purchase data */}
          {sizeFitStats && sizeFitStats.recommendedSize && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">Your best fit</h3>
                  <p className="text-sm text-black">Based on similar shoppers</p>
                </div>
              </div>

              {/* Size options with percentages */}
              <div className="space-y-3">
                {sizeFitStats.sizeFitData.map((sizeData: any) => (
                  <div key={sizeData.size} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-all cursor-pointer"
                       onClick={() => handleSizeClick(sizeData.size as Size)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-black">{sizeData.size}</span>
                        {sizeData.isRecommended && (
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-lg font-semibold text-black">{sizeData.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${sizeData.isRecommended ? 'bg-green-600' : 'bg-gray-400'}`}
                        style={{ width: `${sizeData.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-black">
                  {sizeFitStats.explanation}
                </p>
              </div>

              {/* Add to cart button */}
              {sizeFitStats.recommendedSize && (
                <button
                  onClick={() => handleSizeClick(sizeFitStats.recommendedSize as Size)}
                  className="w-full px-6 py-4 bg-red-600 text-white font-bold text-base rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  Add size {sizeFitStats.recommendedSize} to cart
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Divider */}
          {sizeFitStats && sizeFitStats.recommendedSize && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or use AI Size Recommendation</span>
              </div>
            </div>
          )}

          {/* AI Size Recommendation Section - Only show if measurements exist */}
          {measurements && recommendedSize ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">AI Size Recommendation</h3>
                  <p className="text-sm text-black">Based on your body measurements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommended Size */}
                <div className="bg-white border-2 border-blue-600 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                      <span className="text-3xl font-bold text-white">{recommendedSize}</span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Best Match
                      </span>
                    </div>
                    <p className="text-sm text-black mb-4">
                      Recommended size based on your measurements
                    </p>
                    <button
                      onClick={() => handleSizeClick(recommendedSize)}
                      className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select Size {recommendedSize}
                    </button>
                  </div>
                </div>

                {/* Alternative Size */}
                {alternativeSize && (
                  <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                        <span className="text-3xl font-bold text-black">{alternativeSize}</span>
                      </div>
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full">
                          Alternative
                        </span>
                      </div>
                      <p className="text-sm text-black mb-4">
                        Consider if you prefer {getSmallerSize(recommendedSize) === alternativeSize ? 'tighter' : 'looser'} fit
                      </p>
                      <button
                        onClick={() => handleSizeClick(alternativeSize)}
                        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Select Size {alternativeSize}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Measurements Summary */}
              <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-black flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Your Profile:</span>
                  {measurements.gender} • {measurements.height}cm • {measurements.weight}kg • 
                  BMI {measurements.bmi.toFixed(1)} • {measurements.fitPreference.toLowerCase()} fit
                  </p>

                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        if (onAddMeasurements) onAddMeasurements();
                      }}
                      className="px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Edit Measurements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Show "Add Measurements" button if no measurements */
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Get AI-Powered Size Recommendations</h3>
                <p className="text-black mb-6">
                  Add your measurements to receive personalized size suggestions based on your unique body type
                </p>
                <button
                  onClick={() => {
                    if (onAddMeasurements) {
                      onAddMeasurements();
                    }
                  }}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Add Your Measurements
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          {measurements && recommendedSize && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Traditional Size Charts</span>
              </div>
            </div>
          )}

          {/* How to Measure Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Measure
            </h3>
            <div className="space-y-3 text-sm text-black">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p><span className="font-semibold">Chest:</span> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p><span className="font-semibold">Waist:</span> Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p><span className="font-semibold">Hips:</span> Measure around the fullest part of your hips, approximately 20cm below your waist.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p><span className="font-semibold">Height:</span> Stand straight against a wall and measure from head to toe.</p>
              </div>
            </div>
          </div>

          {/* Size Chart for Tops (Shirts, T-shirts, Jackets, etc.) */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Size Chart - Tops</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-gray-700">Size</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">XS</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">S</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">M</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">L</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">XL</th>
                    <th className="px-4 py-3 text-center font-semibold">XXL</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Chest (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">80-85</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">86-91</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">92-97</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">98-103</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">104-109</td>
                    <td className="px-4 py-3 text-black text-center">110-115</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Waist (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">65-70</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">71-76</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">77-82</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">83-88</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">89-94</td>
                    <td className="px-4 py-3 text-black text-center">95-100</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Height (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">155-160</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">160-165</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">165-170</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">170-175</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">175-180</td>
                    <td className="px-4 py-3 text-black text-center">180-185</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Size Chart for Bottoms (Pants, Shorts, Skirts) */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Size Chart - Bottoms</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-gray-700">Size</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">XS</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">S</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">M</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">L</th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-gray-700">XL</th>
                    <th className="px-4 py-3 text-center font-semibold">XXL</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Waist (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">60-65</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">66-71</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">72-77</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">78-83</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">84-89</td>
                    <td className="px-4 py-3 text-black text-center">90-95</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Hips (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">85-90</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">91-96</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">97-102</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">103-108</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">109-114</td>
                    <td className="px-4 py-3 text-black text-center">115-120</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">Inseam (cm)</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">71-73</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">74-76</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">77-79</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">80-82</td>
                    <td className="px-4 py-3 text-center text-black border-r border-gray-200">83-85</td>
                    <td className="px-4 py-3 text-black text-center">86-88</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Tips */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Fit Tips
            </h3>
            <div className="space-y-2 text-sm text-black">
              <p>• <span className="font-semibold">Between sizes?</span> Choose the larger size for a more comfortable fit.</p>
              <p>• <span className="font-semibold">Tight fit preference?</span> Choose your exact measurement size.</p>
              <p>• <span className="font-semibold">Loose fit preference?</span> Go one size up from your measurement.</p>
              <p>• <span className="font-semibold">Different measurements?</span> Choose the size that fits your largest measurement.</p>
            </div>
          </div>

          {/* Note */}
          <div className="text-center text-sm text-gray-500 border-t pt-6">
            <p>
              📏 Still unsure? Use our <span className="text-blue-600 font-semibold">AI Size Recommendation</span> feature above for personalized sizing based on your body measurements!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


// Size chart data
const sizeCharts = {
  tops: {
    XS: { chest: [80, 85], waist: [65, 70], height: [155, 160] },
    S: { chest: [86, 91], waist: [71, 76], height: [160, 165] },
    M: { chest: [92, 97], waist: [77, 82], height: [165, 170] },
    L: { chest: [98, 103], waist: [83, 88], height: [170, 175] },
    XL: { chest: [104, 109], waist: [89, 94], height: [175, 180] },
    XXL: { chest: [110, 115], waist: [95, 100], height: [180, 185] }
  },
  bottoms: {
    XS: { waist: [60, 65], hips: [85, 90] },
    S: { waist: [66, 71], hips: [91, 96] },
    M: { waist: [72, 77], hips: [97, 102] },
    L: { waist: [78, 83], hips: [103, 108] },
    XL: { waist: [84, 89], hips: [109, 114] },
    XXL: { waist: [90, 95], hips: [115, 120] }
  }
};

function calculateRecommendedSizes(
  measurements: UserMeasurements,
  category: string,
  availableSizes: Size[]
): { recommended: Size; alternative: Size | null } {
  const { chest, waist, hips, height, fitPreference, bellyShape, hipShape, hasReturnHistory } = measurements;

  // Determine if it's bottoms or tops
  const isBottoms = category.toLowerCase().includes('pants') ||
    category.toLowerCase().includes('shorts') ||
    category.toLowerCase().includes('skirt') ||
    category.toLowerCase().includes('jeans') ||
    category.toLowerCase().includes('leggings');

  // Find best size based on measurements
  let recommendedSize: Size;
  if (isBottoms) {
    recommendedSize = findBestSizeForBottoms(waist, hips, availableSizes);
  } else {
    recommendedSize = findBestSizeForTops(chest, waist, height, availableSizes);
  }

  // Fit preference
  recommendedSize = adjustForFitPreference(recommendedSize, fitPreference, availableSizes);

  // Body shape
  recommendedSize = adjustForBodyShape(recommendedSize, bellyShape, hipShape, isBottoms, availableSizes);

  // Return history (be more conservative)
  if (hasReturnHistory) {
    recommendedSize = getLargerSize(recommendedSize) || recommendedSize;
  }

  // Ensure recommended size is available
  if (!availableSizes.includes(recommendedSize)) {
    recommendedSize = findClosestAvailableSize(recommendedSize, availableSizes);
  }

  // Alternative size
  let alternativeSize: Size | null = null;
  const largerSize = getLargerSize(recommendedSize);
  const smallerSize = getSmallerSize(recommendedSize);
  if (largerSize && availableSizes.includes(largerSize)) {
    alternativeSize = largerSize;
  } else if (smallerSize && availableSizes.includes(smallerSize)) {
    alternativeSize = smallerSize;
  }

  return { recommended: recommendedSize, alternative: alternativeSize };
}

function findBestSizeForTops(chest: number, waist: number, height: number, availableSizes: Size[]): Size {
  let bestSize: Size = 'M';
  let maxScore = -1;
  for (const size of availableSizes) {
    const ranges = sizeCharts.tops[size];
    if (!ranges) continue;
    let score = 0;
    // Chest is most important
    if (chest >= ranges.chest[0] && chest <= ranges.chest[1]) score += 3;
    else if (chest >= ranges.chest[0] - 2 && chest <= ranges.chest[1] + 2) score += 1;
    // Waist
    if (waist >= ranges.waist[0] && waist <= ranges.waist[1]) score += 2;
    else if (waist >= ranges.waist[0] - 2 && waist <= ranges.waist[1] + 2) score += 1;
    // Height
    if (height >= ranges.height[0] && height <= ranges.height[1]) score += 1;
    if (score > maxScore) {
      maxScore = score;
      bestSize = size;
    }
  }
  return bestSize;
}

function findBestSizeForBottoms(waist: number, hips: number, availableSizes: Size[]): Size {
  let bestSize: Size = 'M';
  let maxScore = -1;
  for (const size of availableSizes) {
    const ranges = sizeCharts.bottoms[size];
    if (!ranges) continue;
    let score = 0;
    // Waist is most important
    if (waist >= ranges.waist[0] && waist <= ranges.waist[1]) score += 3;
    else if (waist >= ranges.waist[0] - 2 && waist <= ranges.waist[1] + 2) score += 1;
    // Hips
    if (hips >= ranges.hips[0] && hips <= ranges.hips[1]) score += 3;
    else if (hips >= ranges.hips[0] - 2 && hips <= ranges.hips[1] + 2) score += 1;
    if (score > maxScore) {
      maxScore = score;
      bestSize = size;
    }
  }
  return bestSize;
}

function adjustForFitPreference(size: Size, fitPreference: string, availableSizes: Size[]): Size {
  let adjustedSize = size;
  if (fitPreference === 'TIGHT') {
    adjustedSize = getSmallerSize(size) || size;
  } else if (fitPreference === 'LOOSE') {
    adjustedSize = getLargerSize(size) || size;
  }
  if (!availableSizes.includes(adjustedSize)) {
    adjustedSize = size;
  }
  return adjustedSize;
}

function adjustForBodyShape(size: Size, bellyShape: string, hipShape: string, isBottoms: boolean, availableSizes: Size[]): Size {
  let adjustedSize = size;
  if (bellyShape === 'ROUND' && !isBottoms) {
    adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
  }
  if (hipShape === 'WIDE' && isBottoms) {
    adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
  }
  if (!availableSizes.includes(adjustedSize)) {
    adjustedSize = size;
  }
  return adjustedSize;
}

function findClosestAvailableSize(targetSize: Size, availableSizes: Size[]): Size {
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const targetIndex = sizes.indexOf(targetSize);
  let closestSize = availableSizes[0];
  let minDistance = Math.abs(sizes.indexOf(closestSize) - targetIndex);
  for (const size of availableSizes) {
    const distance = Math.abs(sizes.indexOf(size) - targetIndex);
    if (distance < minDistance) {
      minDistance = distance;
      closestSize = size;
    }
  }
  return closestSize;
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

