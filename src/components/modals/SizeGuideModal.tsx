'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { UserMeasurements, Size } from '@/types/size-recommendation.types';
import { calculateRecommendedSizes } from '@/features/size-recommendation/utils/sizeCalculation';
import { getSizeChartByCategory, type SizeChart } from '@/data/sizeCharts';
import { SizeChartTable } from './SizeChartTable';
import { recommendationApi } from '@/services/api/recommendationApi';
import {
  SizeRecommendationResponse
} from '@/types/size-recommendation.types';
import {
  buildRecommendationReasoning,
  getConfidenceBadgeColor,
  getConfidenceBadgeLabel,
  getDataQualityIcon
} from '@/utils/size-recommendation';
import { ConfirmModal } from './ConfirmModal';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

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
  const { translations, lang } = useLanguage();
  const t = translations.sizeGuide;
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [sizeChart, setSizeChart] = useState<SizeChart | null>(null);

  // API recommendation state
  const [apiRecommendation, setApiRecommendation] = useState<SizeRecommendationResponse | null>(null);
  const [, setLoadingRecommendation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle delete measurements
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await recommendationApi.deleteMeasurements();
      if (response.success) {
        // Clear state
        setMeasurements(null);
        setApiRecommendation(null);
        setShowDeleteConfirm(false);
        console.log('✅ Measurements deleted successfully');
      } else {
        console.error('❌ Failed to delete measurements:', response.message);
      }
    } catch (error) {
      console.error('❌ Error deleting measurements:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

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
            const backendMeasurements = response.data;
            setMeasurements(backendMeasurements);
            loadSizeRecommendation(backendMeasurements);
          } else {
            console.log('⚠️ No measurements in backend');
            setMeasurements(null);
            setLoadingRecommendation(false);
          }
        })
        .catch((error) => {
          console.error('❌ Failed to fetch measurements from backend:', error);
          setMeasurements(null);
          setLoadingRecommendation(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category, categorySlug, availableSizes, productId]);

  const fallbackToLocalRecommendation = (userMeasurements?: UserMeasurements | null) => {
    const measurementsToUse = userMeasurements || measurements;
    if (measurementsToUse) {
      const localRec = calculateRecommendedSizes(measurementsToUse, categorySlug || category, availableSizes);
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

  // Minimum confidence threshold - below this, fallback to rule-based recommendation
  const MIN_CONFIDENCE_THRESHOLD = 0.5;

  const loadSizeRecommendation = async (userMeasurements?: UserMeasurements | null) => {
    setLoadingRecommendation(true);
    try {
      console.log('🔍 Calling size recommendation API for product:', productId);
      const response = await recommendationApi.getSizeRecommendation(productId);
      
      if (response.success && response.data) {
        // Check if backend has collaborative data (recommendedSize not null)
        if (response.data.recommendedSize) {
          // Check confidence threshold - if too low, use rule-based instead
          const confidence = response.data.confidence ?? 0;
          if (confidence < MIN_CONFIDENCE_THRESHOLD) {
            console.log(`⚠️ Confidence too low (${confidence} < ${MIN_CONFIDENCE_THRESHOLD}), using rule-based recommendation`);
            fallbackToLocalRecommendation(userMeasurements);
          } else {
            console.log('✅ Size recommendation received from collaborative filtering:', response.data);
            setApiRecommendation(response.data);
          }
        } else {
          // Backend returned no data (no similar users or no order history)
          // Use frontend rule-based recommendation with detailed size charts
          console.log('ℹ️ No collaborative data available, using frontend rule-based recommendation');
          fallbackToLocalRecommendation(userMeasurements);
        }
      } else {
        console.warn('⚠️ Size recommendation API returned unsuccessful response:', response.message);
        fallbackToLocalRecommendation(userMeasurements);
      }
    } catch (error) {
      console.error('❌ Failed to load size recommendation:', error);
      fallbackToLocalRecommendation(userMeasurements);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  // Handle add measurements click - redirect to login if not authenticated
  const handleAddMeasurementsClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname || window.location.pathname);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      onClose();
      return;
    }
    
    if (onAddMeasurements) {
      onAddMeasurements();
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
      className="fixed inset-0 flex items-center justify-center z-[9999] px-2 sm:px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black">{t.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600">{category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-80px)] p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

          {/* Size Recommendation Section */}
          {measurements && apiRecommendation ? (
            apiRecommendation.recommendedSize ? (
              /* Case 1: Measurements exist AND Recommendation exists */
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-black">{t.sizeRecommendation}</h3>
                    <p className="text-xs sm:text-sm text-black">{t.basedOnMeasurements}</p>
                  </div>
                </div>

                {/* Confidence Badge */}
                {apiRecommendation.metadata && (
                  <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceBadgeColor(apiRecommendation.metadata.confidenceLevel)}`}>
                      {getConfidenceBadgeLabel(
                        apiRecommendation.metadata.confidenceLevel, 
                        lang,
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Recommended Size */}
                  <div className="bg-white border-2 border-gray-700 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full mb-3 sm:mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-white">{apiRecommendation.recommendedSize}</span>
                      </div>
                      <div className="mb-3 sm:mb-4">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full">
                          {t.bestMatch}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-black mb-3 sm:mb-4">
                        {apiRecommendation.metadata?.totalSimilarUsers && apiRecommendation.metadata.totalSimilarUsers > 0
                          ? `${((apiRecommendation.confidence || 0) * 100).toFixed(0)}${t.similarUsersChose}`
                          : t.recommendedBasedOnMeasurements}
                      </p>
                      <button
                        onClick={() => handleSizeClick(apiRecommendation.recommendedSize as Size)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors text-sm sm:text-base"
                      >
                        {t.selectSize} {apiRecommendation.recommendedSize}
                      </button>
                    </div>
                  </div>

                  {/* Alternative Size */}
                  {apiRecommendation.alternatives && apiRecommendation.alternatives.length > 0 && (
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4">
                          <span className="text-2xl sm:text-3xl font-bold text-black">{apiRecommendation.alternatives[0].size}</span>
                        </div>
                        <div className="mb-3 sm:mb-4">
                          <span className="inline-block px-2 sm:px-3 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full">
                            {t.alternative}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-black mb-3 sm:mb-4">
                          {apiRecommendation.metadata?.totalSimilarUsers && apiRecommendation.metadata.totalSimilarUsers > 0
                            ? `${((apiRecommendation.alternatives[0].confidence || 0) * 100).toFixed(0)}${t.similarUsersChose}`
                            : t.mayAlsoFitLooser}
                        </p>
                        <button
                          onClick={() => handleSizeClick(apiRecommendation.alternatives[0].size as Size)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                        >
                          {t.selectSize} {apiRecommendation.alternatives[0].size}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning Message */}
                <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-gray-200 mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-black whitespace-pre-line">
                    {buildRecommendationReasoning(apiRecommendation, lang)}
                  </p>
                </div>

                {/* User Measurements Summary */}
                <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-gray-200 mt-3 sm:mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <p className="text-xs text-black flex items-center gap-2 flex-wrap">
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{t.yourProfile}</span>
                      <span className="break-all">
                        {measurements.gender} • {measurements.height}cm • {measurements.weight}kg
                        {measurements.bmi !== undefined && ` • BMI ${measurements.bmi.toFixed(1)}`}
                        {measurements.fitPreference && ` • ${measurements.fitPreference.toLowerCase()} fit`}
                      </span>
                    </p>

                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={handleAddMeasurementsClick}
                        className="px-2 sm:px-3 py-1.5 bg-black text-white text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="px-2 sm:px-3 py-1.5 bg-black text-white text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? t.deleting : t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Case 2: Measurements exist but NO Recommendation (e.g. not enough data) */
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-black">{t.recommendationUnavailable}</h3>
                    <p className="text-xs sm:text-sm text-black">{t.needMoreData}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <p className="text-xs sm:text-sm text-black mb-2 sm:mb-3">
                    {t.couldNotRecommend}
                  </p>
                  <p className="text-xs sm:text-sm text-black font-medium">
                    {t.referToSizeChart}
                  </p>
                </div>

                {/* User Measurements Summary (Still show this so they know we have their data) */}
                <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-gray-200 mt-3 sm:mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <p className="text-xs text-black flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{t.yourProfile}</span>
                      {measurements.gender} • {measurements.height}cm • {measurements.weight}kg
                    </p>

                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={handleAddMeasurementsClick}
                        className="px-2 sm:px-3 py-1.5 bg-black text-white text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="px-2 sm:px-3 py-1.5 bg-black text-white text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? t.deleting : t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Case 3: No measurements - Show "Add Measurements" button */
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300 rounded-xl p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">{t.getPersonalizedRecommendations}</h3>
                <p className="text-sm sm:text-base text-black mb-4 sm:mb-6">
                  {t.addMeasurementsDesc}
                </p>
                <button
                  onClick={handleAddMeasurementsClick}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t.addYourMeasurements}
                </button>
              </div>
            </div>
          )}

          {/* How to Measure Section */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.howToMeasure}
            </h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-black">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p><span className="font-semibold">{lang === 'vi' ? 'Ngực:' : 'Chest:'}</span> {t.chestMeasure}</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p><span className="font-semibold">{lang === 'vi' ? 'Eo:' : 'Waist:'}</span> {t.waistMeasure}</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p><span className="font-semibold">{lang === 'vi' ? 'Hông:' : 'Hips:'}</span> {t.hipsMeasure}</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p><span className="font-semibold">{lang === 'vi' ? 'Chiều cao:' : 'Height:'}</span> {t.heightMeasure}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Size Chart based on Category */}
          {sizeChart && <SizeChartTable sizeChart={sizeChart} />}

          {/* Fit Tips */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {t.fitTips}
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-black">
              <p>• <span className="font-semibold">{t.betweenSizes}</span> {t.betweenSizesTip}</p>
              <p>• <span className="font-semibold">{t.tightFit}</span> {t.tightFitTip}</p>
              <p>• <span className="font-semibold">{t.looseFit}</span> {t.looseFitTip}</p>
              <p>• <span className="font-semibold">{t.differentMeasurements}</span> {t.differentMeasurementsTip}</p>
            </div>
          </div>

          {/* Note */}
          <div className="text-center text-xs sm:text-sm text-gray-500 border-t pt-4 sm:pt-6">
            <p>
              📏 {t.stillUnsure} <span className="text-gray-700 font-semibold">{t.sizeRecommendation}</span> {t.useFeatureAbove}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white rounded-lg cursor-pointer transition-colors font-medium text-sm sm:text-base"
          >
            {t.gotItThanks}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t.deleteMeasurements}
        message={t.deleteConfirmMessage}
        confirmText={t.delete}
        cancelText={translations.common.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        type="info"
      />
    </div>,
    document.body
  );
}




