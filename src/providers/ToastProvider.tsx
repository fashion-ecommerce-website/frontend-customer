'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps } from '../components/Toast';
import { ProductToast, ProductToastProps } from '../components/ProductToast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastProps['type'];
  duration?: number;
}

interface ProductToastItem {
  id: string;
  productImage: string;
  productTitle: string;
  productPrice: number;
  finalPrice?: number; // Price after promotion
  quantity?: number;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showProductToast: (data: Omit<ProductToastProps, 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [productToasts, setProductToasts] = useState<ProductToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastProps['type'], duration = 4000) => {
    const id = Date.now().toString();
    const newToast: ToastItem = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showProductToast = useCallback((data: Omit<ProductToastProps, 'onClose'>) => {
    const id = Date.now().toString();
    const newProductToast: ProductToastItem = { 
      id, 
      productImage: data.productImage,
      productTitle: data.productTitle,
      productPrice: data.productPrice,
      finalPrice: data.finalPrice,
      quantity: data.quantity,
      duration: data.duration || 4000
    };
    
    setProductToasts(prev => [...prev, newProductToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeProductToast = useCallback((id: string) => {
    setProductToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning, 
      showProductToast 
    }}>
      {children}
      
      {/* Render regular toasts */}
      <div className="fixed top-0 right-0 z-50">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id} 
            className="absolute right-4"
            style={{ top: `${16 + index * 80}px` }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>

      {/* Render product toasts */}
      <div className="fixed top-1/5 right-0 transform -translate-y-1/5 z-50">
        {productToasts.map((toast, index) => {
          return (
            <div 
              key={toast.id} 
              className="mb-4"
              style={{ marginTop: `${index * 10}px` }}
            >
              <ProductToast
                productImage={toast.productImage}
                productTitle={toast.productTitle}
                productPrice={toast.productPrice}
                finalPrice={toast.finalPrice}
                quantity={toast.quantity}
                duration={toast.duration}
                onClose={() => removeProductToast(toast.id)}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
