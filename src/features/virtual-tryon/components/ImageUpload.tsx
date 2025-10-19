"use client";

import React, { useRef } from 'react';
import { ImageUploadProps } from '../types';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  userImage,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Your Photo
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a clear photo of yourself to try on the selected product
        </p>

        {userImage ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userImage}
              alt="Uploaded user"
              className="max-w-full h-auto max-h-64 rounded-lg mx-auto shadow-md"
            />
            <button
              onClick={handleClick}
              disabled={disabled}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Photo
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-12 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
            } transition-colors`}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
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
              <p className="text-gray-600 font-medium mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
