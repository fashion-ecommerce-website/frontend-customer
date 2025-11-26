import React from 'react';
import { VirtualTryOnProduct } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  product: VirtualTryOnProduct;
  userImage: string;
  resultImage: string;
}

interface TryOnHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const TryOnHistory: React.FC<TryOnHistoryProps> = ({
  history,
  onSelect,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No History Yet</h3>
        <p className="text-sm text-gray-500">Your virtual try-on results will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {history.map((item) => (
        <div 
          key={item.id}
          onClick={() => onSelect(item)}
          className="group cursor-pointer relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-purple-200"
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.resultImage} 
              alt="Try-on result" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-xs font-medium truncate w-full">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.product.imageUrl} 
              alt={item.product.productTitle} 
              className="w-8 h-8 rounded-md object-cover border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {item.product.productTitle}
              </p>
              <p className="text-[10px] text-gray-500">
                {item.product.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
