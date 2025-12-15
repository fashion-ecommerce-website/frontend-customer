"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VirtualTryOnProduct, HistoryItem } from '../types';

interface VirtualTryOnContextType {
  selectedProduct: VirtualTryOnProduct | null;
  selectedLowerProduct: VirtualTryOnProduct | null;
  userImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
  error: string | null;
  history: HistoryItem[];
  activeSlot: 'upper' | 'lower';
  minimized: boolean;
  
  setSelectedProduct: (product: VirtualTryOnProduct | null) => void;
  setSelectedLowerProduct: (product: VirtualTryOnProduct | null) => void;
  setUserImage: (image: string | null) => void;
  setResultImage: (image: string | null) => void;
  setActiveSlot: (slot: 'upper' | 'lower') => void;
  setMinimized: (minimized: boolean) => void;
  
  handleProductSelect: (product: VirtualTryOnProduct) => void;
  handleImageUpload: (file: File) => void;
  handleTryOn: () => Promise<void>;
  handleReset: () => void;
  handleHistorySelect: (item: HistoryItem) => void;
  dismissResult: () => void;
  clearSlot: (slot: 'upper' | 'lower') => void;
}

const VirtualTryOnContext = createContext<VirtualTryOnContextType | undefined>(undefined);

const STORAGE_KEY = 'virtual_tryon_history';

export const VirtualTryOnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<VirtualTryOnProduct | null>(null);
  const [selectedLowerProduct, setSelectedLowerProduct] = useState<VirtualTryOnProduct | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeSlot, setActiveSlot] = useState<'upper' | 'lower'>('upper');
  const [minimized, setMinimized] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load try-on history', e);
      }
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Handle product selection based on active slot
  const handleProductSelect = useCallback((product: VirtualTryOnProduct) => {
    // Place product in the active slot
    if (activeSlot === 'lower') {
      setSelectedLowerProduct(product);
    } else {
      setSelectedProduct(product);
    }
    
    setError(null);
  }, [activeSlot]);
  
  // Clear a specific slot
  const clearSlot = useCallback((slot: 'upper' | 'lower') => {
    if (slot === 'upper') {
      setSelectedProduct(null);
    } else {
      setSelectedLowerProduct(null);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, []);

  // Helper: Convert base64 to File
  const base64ToFile = async (base64: string, filename: string): Promise<File> => {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // Handle virtual try-on
  const handleTryOn = useCallback(async () => {
    if (!userImage) {
      setError('Please upload your photo');
      return;
    }

    // Check if at least one product is selected
    if (!selectedProduct && !selectedLowerProduct) {
      setError('Please select at least one item');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMinimized(true); // Minimize when starting processing

    try {
      // Convert base64 user image to File
      const userImageFile = await base64ToFile(userImage, 'user-photo.jpg');
      
      // Create FormData for API request
      const formData = new FormData();
      formData.append('model_image', userImageFile);
      
      // Determine cloth type based on selected products
      let clothType: 'upper' | 'lower' | 'combo' = 'upper';
      
      if (selectedProduct && selectedLowerProduct) {
        // Both upper and lower selected - combo mode
        clothType = 'combo';
        
        // Add upper garment
        const upperImageResponse = await fetch(selectedProduct.imageUrl);
        const upperImageBlob = await upperImageResponse.blob();
        const upperImageFile = new File([upperImageBlob], 'upper-product.jpg', { type: 'image/jpeg' });
        formData.append('cloth_image', upperImageFile);
        
        // Add lower garment
        const lowerImageResponse = await fetch(selectedLowerProduct.imageUrl);
        const lowerImageBlob = await lowerImageResponse.blob();
        const lowerImageFile = new File([lowerImageBlob], 'lower-product.jpg', { type: 'image/jpeg' });
        formData.append('lower_cloth_image', lowerImageFile);
        
      } else if (selectedProduct) {
        // Only upper selected
        clothType = 'upper';
        const productImageResponse = await fetch(selectedProduct.imageUrl);
        const productImageBlob = await productImageResponse.blob();
        const productImageFile = new File([productImageBlob], 'product.jpg', { type: 'image/jpeg' });
        formData.append('cloth_image', productImageFile);
        
      } else if (selectedLowerProduct) {
        // Only lower selected
        clothType = 'lower';
        const productImageResponse = await fetch(selectedLowerProduct.imageUrl);
        const productImageBlob = await productImageResponse.blob();
        const productImageFile = new File([productImageBlob], 'product.jpg', { type: 'image/jpeg' });
        formData.append('cloth_image', productImageFile);
      }

      formData.append('cloth_type', clothType);

      // Step 1: Create virtual try-on task
      const createResponse = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create virtual try-on task');
      }

      const createData = await createResponse.json();
      
      if (!createData.success || !createData.taskId) {
        throw new Error(createData.error || 'Failed to create task');
      }

      const taskId = createData.taskId;
      console.log('✅ Task created:', taskId);

      // Step 2: Poll for task completion
      const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max
      const pollInterval = 2000; // 2 seconds

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Wait before polling
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const statusResponse = await fetch(`/api/virtual-tryon?taskId=${taskId}`);
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check task status');
        }

        const statusData = await statusResponse.json();

        if (!statusData.success) {
          throw new Error(statusData.error || 'Failed to get status');
        }

        console.log(`📊 Task status (attempt ${attempt + 1}):`, statusData.status);

        // Check if completed
        if (statusData.status === 'COMPLETED' && statusData.resultImageUrl) {
          setResultImage(statusData.resultImageUrl);
          setIsProcessing(false); // Ensure processing state is updated
          
          // Save to history
          saveToHistory({
            id: taskId,
            timestamp: Date.now(),
            product: selectedProduct!,
            userImage: userImage,
            resultImage: statusData.resultImageUrl
          });

          console.log('✅ Virtual try-on completed!');
          return;
        }

        // Check if failed
        if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Virtual try-on processing failed');
        }

        // Continue polling for 'pending' or 'processing' status
      }

      // If we reach here, it timed out
      throw new Error('Virtual try-on timed out. Please try again.');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process virtual try-on. Please try again.');
      console.error('Virtual try-on error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedProduct, selectedLowerProduct, userImage, saveToHistory]);

  // Handle reset
  const handleReset = useCallback(() => {
    setResultImage(null);
    setError(null);
    setMinimized(false);
  }, []);

  // Handle history selection
  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setSelectedProduct(item.product);
    setUserImage(item.userImage);
    setResultImage(item.resultImage);
    setError(null);
    setMinimized(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const dismissResult = useCallback(() => {
    setResultImage(null);
    setMinimized(false);
  }, []);

  return (
    <VirtualTryOnContext.Provider
      value={{
        selectedProduct,
        selectedLowerProduct,
        userImage,
        resultImage,
        isProcessing,
        error,
        history,
        activeSlot,
        minimized,
        setSelectedProduct,
        setSelectedLowerProduct,
        setUserImage,
        setResultImage,
        setActiveSlot,
        setMinimized,
        handleProductSelect,
        handleImageUpload,
        handleTryOn,
        handleReset,
        handleHistorySelect,
        dismissResult,
        clearSlot
      }}
    >
      {children}
    </VirtualTryOnContext.Provider>
  );
};

export const useVirtualTryOn = () => {
  const context = useContext(VirtualTryOnContext);
  if (context === undefined) {
    throw new Error('useVirtualTryOn must be used within a VirtualTryOnProvider');
  }
  return context;
};
