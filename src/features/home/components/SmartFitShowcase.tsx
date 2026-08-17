'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function SmartFitShowcase() {
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(65);  // kg
  const [fit, setFit] = useState<'slim' | 'regular' | 'loose'>('regular');
  const [recommendedSize, setRecommendedSize] = useState('M');

  // Dynamic size logic simulating the backend sizing algorithm
  useEffect(() => {
    // Simple sizing algorithm based on BMI and fit preference
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    
    let baseSizeValue = 0; // 0=S, 1=M, 2=L, 3=XL, 4=XXL

    if (height < 160) {
      if (bmi < 19) baseSizeValue = 0; // S
      else if (bmi < 24) baseSizeValue = 1; // M
      else baseSizeValue = 2; // L
    } else if (height < 175) {
      if (bmi < 20) baseSizeValue = 0; // S
      else if (bmi < 24) baseSizeValue = 1; // M
      else if (bmi < 28) baseSizeValue = 2; // L
      else baseSizeValue = 3; // XL
    } else {
      if (bmi < 20) baseSizeValue = 1; // M
      else if (bmi < 24) baseSizeValue = 2; // L
      else if (bmi < 28) baseSizeValue = 3; // XL
      else baseSizeValue = 4; // XXL
    }

    // Adjust size value based on fit preference
    if (fit === 'slim') {
      baseSizeValue = Math.max(0, baseSizeValue - 1);
    } else if (fit === 'loose') {
      baseSizeValue = Math.min(4, baseSizeValue + 1);
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    setRecommendedSize(sizes[baseSizeValue]);
  }, [height, weight, fit]);

  return (
    <div className="w-full py-12 sm:py-16">
      <div className="w-full bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Left column: copywriting */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">
              AI SIZE ENGINE
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-neutral-900 font-normal leading-snug">
              Find Your Perfect Fit <br />
              <span className="text-neutral-500">In 30 Seconds</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A880] rounded-full" />
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            No tape measures required. Our intelligent sizing engine analyzes your body proportions and fit preferences to recommend the ideal size across all categories with 98% accuracy.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs">✓</div>
              <span className="text-xs text-neutral-700 font-medium">Personalized recommendations for tops, bottoms, and jackets</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs">✓</div>
              <span className="text-xs text-neutral-700 font-medium">Adapts dynamically to slim, regular, or loose fit styles</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-neutral-900 text-neutral-950 hover:bg-neutral-950 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <span>EXPLORE PRODUCTS</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right column: interactive calculator */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-neutral-50 border border-neutral-200/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6">
            {/* Widget Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-xs font-bold text-neutral-800 tracking-wider">FIT ANALYZER WIDGET</span>
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold border border-green-200 shadow-2xs">ACTIVE</span>
            </div>

            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Height</label>
                <span className="text-sm font-bold text-neutral-900">{height} cm</span>
              </div>
              <input
                type="range"
                min="150"
                max="200"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
              />
            </div>

            {/* Weight Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Weight</label>
                <span className="text-sm font-bold text-neutral-900">{weight} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="110"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
              />
            </div>

            {/* Fit Preference Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Fit Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(['slim', 'regular', 'loose'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setFit(option)}
                    className={`py-2 text-xs font-bold rounded-lg border uppercase tracking-wider cursor-pointer transition-all active:scale-95 ${
                      fit === option
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-neutral-900 rounded-xl p-4 sm:p-5 flex items-center justify-between text-white border border-neutral-850 relative overflow-hidden group">
              {/* Highlight background lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-1 z-10">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">RECOMMENDED SIZE</span>
                <span className="text-xs text-amber-400 font-medium">98.4% Match probability</span>
              </div>

              {/* Big bold size indicator */}
              <div className="text-4xl sm:text-5xl font-black text-[#C5A880] select-none z-10 animate-bounce">
                {recommendedSize}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
