import { ApiResponse } from '../../types/api.types';

// Fitroom API Configuration
const FITROOM_API_BASE = 'https://platform.fitroom.app/api/tryon/v2';
const FITROOM_API_KEY = process.env.NEXT_PUBLIC_FITROOM_API_KEY || '';
const FITROOM_STATUS_API_KEY = process.env.NEXT_PUBLIC_FITROOM_STATUS_API_KEY || '';

export interface FitroomTaskResponse {
  task_id: string;
  status: string;
  message?: string;
}

export interface FitroomStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_signed_url?: string;
  message?: string;
  error?: string;
}

export interface CreateTryOnTaskParams {
  modelImage: File | Blob;
  clothImage: string; 
  lowerClothImage?: string; 
  clothType?: 'upper' | 'lower' | 'full_set' | 'combo';
}

export interface TryOnTaskResult {
  taskId: string;
  status: string;
  message?: string;
}

export interface TryOnStatusResult {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultImageUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Virtual Try-On API Service Class
 */
export class VirtualTryOnApiService {
  /**
   * Create a virtual try-on task
   */
  async createTryOnTask(params: CreateTryOnTaskParams): Promise<ApiResponse<TryOnTaskResult>> {
    try {
      const { modelImage, clothImage, lowerClothImage, clothType = 'upper' } = params;

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('model_image', modelImage);
      
      // If clothImage is a URL, fetch it first
      if (clothImage.startsWith('http://') || clothImage.startsWith('https://')) {
        const clothImageResponse = await fetch(clothImage);
        const clothImageBlob = await clothImageResponse.blob();
        formData.append('cloth_image', clothImageBlob);
      } else if (clothImage.startsWith('data:')) {
        // Convert base64 to blob
        const blob = await this.base64ToBlob(clothImage);
        formData.append('cloth_image', blob);
      } else {
        throw new Error('Invalid cloth image format');
      }

      // Handle lower cloth image for combo
      if (clothType === 'combo' && lowerClothImage) {
        if (lowerClothImage.startsWith('http://') || lowerClothImage.startsWith('https://')) {
          const lowerClothResponse = await fetch(lowerClothImage);
          const lowerClothBlob = await lowerClothResponse.blob();
          formData.append('lower_cloth_image', lowerClothBlob);
        } else if (lowerClothImage.startsWith('data:')) {
          const blob = await this.base64ToBlob(lowerClothImage);
          formData.append('lower_cloth_image', blob);
        }
      }
      
      formData.append('cloth_type', clothType);

      const response = await fetch(`${FITROOM_API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'X-API-KEY': FITROOM_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fitroom API error: ${response.status} - ${errorText}`);
      }

      const data: FitroomTaskResponse = await response.json();

      return {
        success: true,
        data: {
          taskId: data.task_id,
          status: data.status,
          message: data.message,
        },
        message: 'Task created successfully',
      };
    } catch (error) {
      console.error('Error creating Fitroom task:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to create virtual try-on task',
      };
    }
  }

  /**
   * Check the status of a virtual try-on task
   */
  async checkTaskStatus(taskId: string): Promise<ApiResponse<TryOnStatusResult>> {
    try {
      const response = await fetch(`${FITROOM_API_BASE}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': FITROOM_STATUS_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fitroom status API error: ${response.status} - ${errorText}`);
      }

      const data: FitroomStatusResponse = await response.json();

      return {
        success: true,
        data: {
          taskId: data.task_id,
          status: data.status,
          resultImageUrl: data.download_signed_url,
          message: data.message,
          error: data.error,
        },
        message: `Task status: ${data.status}`,
      };
    } catch (error) {
      console.error('Error checking Fitroom task status:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to check task status',
      };
    }
  }

  /**
   * Poll task status until completion or timeout
   */
  async pollTaskStatus(
    taskId: string,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (status: string) => void;
    } = {}
  ): Promise<ApiResponse<TryOnStatusResult>> {
    const { maxAttempts = 60, intervalMs = 2000, onProgress } = options;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await this.checkTaskStatus(taskId);

      if (!response.success || !response.data) {
        return response;
      }

      const { status, resultImageUrl, error } = response.data;

      // Call progress callback
      if (onProgress) {
        onProgress(status);
      }

      // Check if completed
      if (status === 'completed' && resultImageUrl) {
        return response;
      }

      // Check if failed
      if (status === 'failed') {
        return {
          success: false,
          data: response.data,
          message: error || 'Virtual try-on processing failed',
        };
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    return {
      success: false,
      data: null,
      message: 'Virtual try-on timed out',
    };
  }

  /**
   * Helper: Convert base64 to Blob
   */
  private async base64ToBlob(base64: string): Promise<Blob> {
    const response = await fetch(base64);
    return response.blob();
  }
}

// Export singleton instance
export const virtualTryOnApiService = new VirtualTryOnApiService();
