// utils/size-recommendation.ts
import type {
    SizeRecommendationResponse,
    ConfidenceLevel,
    DataQuality
} from '@/types/size-recommendation.types';

/**
 * Build human-readable reasoning message from recommendation metadata
 * Supports Vietnamese and English
 */
export function buildRecommendationReasoning(
    data: SizeRecommendationResponse,
    language: 'en' | 'vi' = 'vi'
): string {
    // No measurements case
    if (!data.hasMeasurements) {
        return language === 'vi'
            ? 'Vui lòng thêm số đo cơ thể để nhận đề xuất size phù hợp với bạn'
            : 'Please add your body measurements for personalized size recommendations';
    }

    // No recommendation available
    if (!data.recommendedSize || !data.metadata) {
        return language === 'vi'
            ? 'Không có đủ dữ liệu để đề xuất size. Vui lòng tham khảo bảng size chi tiết.'
            : 'Insufficient data for recommendation. Please check the detailed size chart.';
    }

    const { recommendedSize, confidence, metadata, alternatives } = data;
    const confPercent = ((confidence ?? 0) * 100).toFixed(0);

    // HIGH CONFIDENCE
    if (metadata.confidenceLevel === 'HIGH') {
        if (metadata.dataQuality === 'EXCELLENT') {
            const highRatingNote = metadata.highRatingRatio > 0.7
                ? (language === 'vi'
                    ? '\nHầu hết đơn hàng đều có đánh giá cao (4+ sao), cho thấy sự hài lòng với size này.'
                    : '\nMost purchases received high ratings (4+ stars), indicating good fit satisfaction.')
                : '';

            return language === 'vi'
                ? `Đề xuất mạnh: ${confPercent}% trong số ${metadata.totalSimilarUsers} người dùng có số đo tương tự đã chọn size ${recommendedSize}.${highRatingNote}`
                : `Strong recommendation: ${confPercent}% of ${metadata.totalSimilarUsers} similar users chose size ${recommendedSize}.${highRatingNote}`;
        } else {
            return language === 'vi'
                ? `Đề xuất với độ tin cậy cao: ${confPercent}% trong số ${metadata.totalSimilarUsers} người dùng tương tự đã chọn size ${recommendedSize}.\nDữ liệu còn hạn chế, hãy cân nhắc thử size kế bên nếu bạn nằm ở giữa 2 số đo.`
                : `Recommended with high confidence: ${confPercent}% of ${metadata.totalSimilarUsers} similar users chose size ${recommendedSize}.\nLimited data available. Consider adjacent sizes if you're between measurements.`;
        }
    }

    // MEDIUM CONFIDENCE
    if (metadata.confidenceLevel === 'MEDIUM') {
        // Check if this is rule-based (no similar users data)
        const isRuleBased = metadata.totalSimilarUsers === 0 || metadata.dataQuality === 'LIMITED';
        
        let msg = '';
        
        if (isRuleBased) {
            // Rule-based recommendation message
            msg = language === 'vi'
                ? `Size ${recommendedSize} được đề xuất dựa trên số đo cơ thể của bạn và bảng size chuẩn`
                : `Size ${recommendedSize} recommended based on your body measurements and standard size chart`;
        } else {
            // Data-based recommendation message
            msg = language === 'vi'
                ? `Size ${recommendedSize} được đề xuất dựa trên ${metadata.totalSimilarUsers} người dùng có số đo tương tự`
                : `Size ${recommendedSize} recommended based on ${metadata.totalSimilarUsers} similar users`;
        }

        // Add alternative note if close
        if (metadata.hasCloseAlternative && alternatives.length > 0) {
            const altSize = alternatives[0].size;

            if (isRuleBased) {
                msg += language === 'vi'
                    ? `.\nSize ${altSize} cũng có thể phù hợp nếu bạn thích rộng hơn hoặc nằm giữa 2 số đo.`
                    : `.\nSize ${altSize} may also fit if you prefer a looser fit or are between measurements.`;
            } else {
                const altConf = (alternatives[0].confidence * 100).toFixed(0);
                msg += language === 'vi'
                    ? `, nhưng ${altConf}% cũng chọn size ${altSize}.\nNếu bạn thích rộng hơn, có thể cân nhắc size ${altSize}.`
                    : `, but ${altConf}% also chose size ${altSize}.\nIf you prefer a looser fit, consider size ${altSize}.`;
            }
        } else {
            msg += language === 'vi'
                ? '.\nCân nhắc thử size kế bên nếu bạn nằm ở giữa 2 số đo.'
                : '.\nConsider adjacent sizes if youre between measurements.';
        }

        return msg;
    }

    // LOW CONFIDENCE
    const isRuleBased = metadata.totalSimilarUsers === 0 || metadata.dataQuality === 'LIMITED';
    
    if (alternatives.length > 0) {
        const altSize = alternatives[0].size;

        if (isRuleBased) {
            // Rule-based with low confidence
            return language === 'vi'
                ? `Dựa trên số đo của bạn, size ${recommendedSize} hoặc ${altSize} đều có thể phù hợp.\nKhuyến nghị tham khảo bảng size chi tiết và cân nhắc sở thích về độ rộng của bạn.`
                : `Based on your measurements, both size ${recommendedSize} and ${altSize} may fit.\nWe recommend checking the detailed size chart and considering your fit preference.`;
        } else {
            // Data-based with low confidence
            const altConf = (alternatives[0].confidence * 100).toFixed(0);
            return language === 'vi'
                ? `Người dùng tương tự chia đều giữa size ${recommendedSize} (${confPercent}%) và ${altSize} (${altConf}%).\nKhuyến nghị tham khảo bảng size để chọn chính xác hơn dựa trên số đo cụ thể.`
                : `Similar users are split between size ${recommendedSize} (${confPercent}%) and ${altSize} (${altConf}%).\nWe recommend checking the size chart for exact measurements.`;
        }
    }

    // Low confidence, no alternatives
    if (isRuleBased) {
        return language === 'vi'
            ? `Size ${recommendedSize} được đề xuất dựa trên số đo cơ thể của bạn.\nKhuyến nghị kiểm tra kỹ bảng size và cân nhắc thử size kế bên nếu bạn nằm giữa 2 số đo.`
            : `Size ${recommendedSize} recommended based on your body measurements.\nWe recommend checking the size chart and considering adjacent sizes if you're between measurements.`;
    } else {
        return language === 'vi'
            ? `Size ${recommendedSize} dựa trên dữ liệu còn hạn chế từ ${metadata.totalSimilarUsers} người dùng.\nKhuyến nghị kiểm tra kỹ bảng size trước khi đặt hàng.`
            : `Size ${recommendedSize} based on limited data from ${metadata.totalSimilarUsers} users.\nWe recommend checking the size chart before ordering.`;
    }
}

/**
 * Get confidence badge color based on level
 */
export function getConfidenceBadgeColor(level: ConfidenceLevel): string {
    switch (level) {
        case 'HIGH':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'MEDIUM':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'LOW':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

/**
 * Get confidence badge label
 * @param level Confidence level
 * @param language Language preference
 * @param isRuleBased Whether this is a rule-based recommendation (no user data)
 */
export function getConfidenceBadgeLabel(
    level: ConfidenceLevel, 
    language: 'en' | 'vi' = 'vi',
    isRuleBased: boolean = false
): string {
    // For rule-based recommendations, use different labels
    if (isRuleBased) {
        if (language === 'vi') {
            switch (level) {
                case 'HIGH': return 'Khớp chính xác';
                case 'MEDIUM': return 'Phù hợp';
                case 'LOW': return 'Cần xem xét';
                default: return 'Không xác định';
            }
        } else {
            switch (level) {
                case 'HIGH': return 'Exact Match';
                case 'MEDIUM': return 'Good Fit';
                case 'LOW': return 'Consider Carefully';
                default: return 'Unknown';
            }
        }
    }
    
    // For data-based recommendations, use confidence labels
    if (language === 'vi') {
        switch (level) {
            case 'HIGH': return 'Độ tin cậy cao';
            case 'MEDIUM': return 'Độ tin cậy trung bình';
            case 'LOW': return 'Độ tin cậy thấp';
            default: return 'Không xác định';
        }
    } else {
        switch (level) {
            case 'HIGH': return 'High Confidence';
            case 'MEDIUM': return 'Medium Confidence';
            case 'LOW': return 'Low Confidence';
            default: return 'Unknown';
        }
    }
}

/**
 * Get data quality icon
 */
export function getDataQualityIcon(quality: DataQuality): string {
    switch (quality) {
        case 'EXCELLENT': return '⭐⭐⭐';
        case 'GOOD': return '⭐⭐';
        case 'FAIR': return '⭐';
        case 'LIMITED': return '⚠️';
        default: return '';
    }
}

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}
