"use client";

import React, { useRef, useState, useCallback } from 'react';
import { ImageUploadProps } from '../types';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  userImage,
  disabled = false,
  onTryOn,
  canTryOn,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);

    // Upload file
    onImageUpload(file);
  }, [onImageUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileChange(imageFile);
    } else {
      alert('Please drop a valid image file');
    }
  }, [disabled, handleFileChange]);

  const displayImage = previewImage || userImage;

  return (
    <div className="space-y-4">
      {displayImage ? (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative max-w-md mx-auto">
            {/* Make the preview container taller so the uploaded photo fills more vertical space */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Uploaded user photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ✓ Uploaded
              </div>
            </div>
          </div>

          {/* Change Photo + Try It On Buttons */}
          <div className="text-center flex items-center justify-center gap-4">
            <button
              onClick={handleClick}
              disabled={disabled}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Photo
            </button>

            <button
              onClick={() => onTryOn && onTryOn()}
              disabled={disabled || !canTryOn}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all transform ${
                canTryOn
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Try It On Now
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-purple-400 bg-purple-50 scale-[1.02]'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          {/* Drag Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-semibold text-purple-700">Drop your photo here!</p>
              </div>
            </div>
          )}

          {/* Upload Content */}
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your Photo
              </p>
              <p className="text-gray-600 mb-4">
                Drag & drop your photo here or click to browse
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PNG, JPG up to 10MB
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  High quality recommended
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
