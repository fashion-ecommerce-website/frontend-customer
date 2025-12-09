'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getMeasurements, saveMeasurements } from '@/utils/localStorage/measurements';
import { UserMeasurements, Size } from '@/types/size-recommendation.types';
import { getSizeChartByCategory, getSizeChartMapByCategory, topsSizeCharts, bottomsSizeCharts, type SizeChart } from '@/data/sizeCharts';
import { SizeChartTable } from './SizeChartTable';
import { recommendationApi } from '@/services/api/recommendationApi';
import {
  SizeRecommendationResponse,
  ConfidenceLevel,
  DataQuality
} from '@/types/size-recommendation.types';
import {
  buildRecommendationReasoning,
  getConfidenceBadgeColor,
  getConfidenceBadgeLabel,
  getDataQualityIcon
} from '@/utils/size-recommendation';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  categorySlug?: string;
  productId: number;
  availableSizes: Size[];
  onSizeSelect?: (size: Size) => void;
  onAddMeasurements?: () => void;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  category = 'Clothing',
  categorySlug = '',
  productId,
  availableSizes,
  onSizeSelect,
  onAddMeasurements
}: SizeGuideModalProps) {
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [sizeChart, setSizeChart] = useState<SizeChart | null>(null);

  // API recommendation state
  const [apiRecommendation, setApiRecommendation] = useState<SizeRecommendationResponse | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  // Load measurements and calculate recommendation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Load size chart based on category
      if (categorySlug) {
        const chart = getSizeChartByCategory(categorySlug);
        setSizeChart(chart);
      }

      // Try to fetch latest measurements from backend first
      setLoadingRecommendation(true);
      
      console.log('🔍 Fetching measurements from backend...');
      
      recommendationApi.getMeasurements()
        .then(response => {
          console.log('✅ Backend response:', response);
          
          if (response.success && response.data) {
            console.log('✅ Measurements found in backend:', response.data);
            // Update state with backend data
            setMeasurements(response.data);
            // Sync to local storage
            saveMeasurements(response.data as any);
            // Load recommendation with backend data
            loadSizeRecommendation();
          } else {
            console.log('⚠️ No measurements in backend, checking localStorage...');
            // No measurements in backend, check localStorage as fallback
            const savedMeasurements = getMeasurements();
            if (savedMeasurements) {
              console.log('📦 Found measurements in localStorage:', savedMeasurements);
              setMeasurements(savedMeasurements);
              // Try to sync localStorage to backend
              console.log('🔄 Syncing localStorage to backend...');
              recommendationApi.saveMeasurements(savedMeasurements)
                .then((syncResponse) => {
                  console.log('✅ Synced to backend:', syncResponse);
                })
                .catch(err => {
                  console.error('❌ Failed to sync measurements:', err);
                });
            } else {
              console.log('❌ No measurements found in localStorage either');
            }
            setLoadingRecommendation(false);
          }
        })
        .catch((error) => {
          console.error('❌ Failed to fetch measurements from backend:', error);
          // Fallback to localStorage
          const savedMeasurements = getMeasurements();
          if (savedMeasurements) {
            console.log('📦 Using localStorage fallback:', savedMeasurements);
          } else {
            console.log('❌ No measurements available anywhere');
          }
          setMeasurements(savedMeasurements);
          setLoadingRecommendation(false);
        });
    }
  }, [isOpen, category, categorySlug, availableSizes, productId]);

  const fallbackToLocalRecommendation = () => {
    if (measurements) {
      const localRec = calculateRecommendedSizes(measurements, category, availableSizes);
      setApiRecommendation({
        recommendedSize: localRec.recommended,
        confidence: 0.7,
        alternatives: localRec.alternative ? [{ size: localRec.alternative, confidence: 0.5 }] : [],
        metadata: {
          totalSimilarUsers: 0,
          totalPurchases: 0,
          averageRating: 0,
          highRatingRatio: 0,
          confidenceLevel: 'MEDIUM',
          dataQuality: 'LIMITED',
          hasCloseAlternative: !!localRec.alternative
        },
        hasMeasurements: true
      });
    }
  };

  const loadSizeRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      console.log('🔍 Calling size recommendation API for product:', productId);
      const response = await recommendationApi.getSizeRecommendation(productId);
      
      if (response.success && response.data) {
        console.log('✅ Size recommendation received:', response.data);
        setApiRecommendation(response.data);
      } else {
        console.warn('⚠️ Size recommendation API returned unsuccessful response:', response.message);
        fallbackToLocalRecommendation();
      }
    } catch (error) {
      console.error('❌ Failed to load size recommendation:', error);
      fallbackToLocalRecommendation();
    } finally {
      setLoadingRecommendation(false);
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

          {/* Size Recommendation Section */}
          {measurements && apiRecommendation ? (
            apiRecommendation.recommendedSize ? (
              /* Case 1: Measurements exist AND Recommendation exists */
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Size Recommendation</h3>
                    <p className="text-sm text-black">Based on your body measurements</p>
                  </div>
                </div>

                {/* Confidence Badge */}
                {apiRecommendation.metadata && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceBadgeColor(apiRecommendation.metadata.confidenceLevel)}`}>
                      {getConfidenceBadgeLabel(
                        apiRecommendation.metadata.confidenceLevel, 
                        'en',
                        apiRecommendation.metadata.totalSimilarUsers === 0
                      )}
                    </span>
                    {/* Only show data quality if we have actual user data (not rule-based) */}
                    {apiRecommendation.metadata.totalSimilarUsers > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        Data Quality: {getDataQualityIcon(apiRecommendation.metadata.dataQuality)}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recommended Size */}
                  <div className="bg-white border-2 border-blue-600 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <span className="text-3xl font-bold text-white">{apiRecommendation.recommendedSize}</span>
                      </div>
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Best Match
                        </span>
                      </div>
                      <p className="text-sm text-black mb-4">
                        {apiRecommendation.metadata.totalSimilarUsers > 0
                          ? `${((apiRecommendation.confidence || 0) * 100).toFixed(0)}% of similar users chose this size`
                          : 'Recommended size based on your measurements'}
                      </p>
                      <button
                        onClick={() => handleSizeClick(apiRecommendation.recommendedSize as Size)}
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select Size {apiRecommendation.recommendedSize}
                      </button>
                    </div>
                  </div>

                  {/* Alternative Size */}
                  {apiRecommendation.alternatives && apiRecommendation.alternatives.length > 0 && (
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                          <span className="text-3xl font-bold text-black">{apiRecommendation.alternatives[0].size}</span>
                        </div>
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full">
                            Alternative
                          </span>
                        </div>
                        <p className="text-sm text-black mb-4">
                          {apiRecommendation.metadata.totalSimilarUsers > 0
                            ? `${((apiRecommendation.alternatives[0].confidence || 0) * 100).toFixed(0)}% of similar users chose this size`
                            : 'May also fit if you prefer a looser fit'}
                        </p>
                        <button
                          onClick={() => handleSizeClick(apiRecommendation.alternatives[0].size as Size)}
                          className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Select Size {apiRecommendation.alternatives[0].size}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning Message */}
                <div className="bg-white/80 rounded-lg p-4 border border-blue-100 mt-4">
                  <p className="text-sm text-black whitespace-pre-line">
                    {buildRecommendationReasoning(apiRecommendation, 'en')}
                  </p>
                </div>

                {/* User Measurements Summary */}
                <div className="bg-white/80 rounded-lg p-4 border border-blue-100 mt-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-black flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Your Profile:</span>
                      {measurements.gender} • {measurements.height}cm • {measurements.weight}kg
                      {measurements.bmi !== undefined && ` • BMI ${measurements.bmi.toFixed(1)}`}
                      {measurements.fitPreference && ` • ${measurements.fitPreference.toLowerCase()} fit`}
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
              /* Case 2: Measurements exist but NO Recommendation (e.g. not enough data) */
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Recommendation Unavailable</h3>
                    <p className="text-sm text-black">We have your measurements, but need more data for this product.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-black mb-3">
                    We couldn't confidently recommend a size for this specific item based on your profile. This usually happens with new products or unique fits.
                  </p>
                  <p className="text-sm text-black font-medium">
                    Please refer to the Size Chart below for the most accurate fit.
                  </p>
                </div>

                {/* User Measurements Summary (Still show this so they know we have their data) */}
                <div className="bg-white/80 rounded-lg p-4 border border-gray-200 mt-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-black flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Your Profile:</span>
                      {measurements.gender} • {measurements.height}cm • {measurements.weight}kg
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
            )
          ) : (
            /* Case 3: No measurements - Show "Add Measurements" button */
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Get Personalized Size Recommendations</h3>
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

          {/* Dynamic Size Chart based on Category */}
          {sizeChart && <SizeChartTable sizeChart={sizeChart} />}

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
              📏 Still unsure? Use our <span className="text-blue-600 font-semibold">Size Recommendation</span> feature above for personalized sizing based on your body measurements!
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

function adjustForFitPreference(size: Size, fitPreference: string | undefined, availableSizes: Size[]): Size {
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

function adjustForBodyShape(size: Size, bellyShape: string | undefined, hipShape: string | undefined, isBottoms: boolean, availableSizes: Size[]): Size {
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

