'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function VirtualTryOnBanner() {
  const [isHovered, setIsHovered] = useState(false);

  // High-quality fashion model photos for virtual try-on mockup
  const beforeImage = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80';
  const afterImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="w-full py-12 sm:py-16">
      <div 
        className="w-full relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl flex flex-col lg:flex-row items-stretch"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Interactive Mirror Frame */}
        <div className="w-full lg:w-1/2 relative min-h-[320px] sm:min-h-[400px] flex items-center justify-center bg-neutral-950 p-6 sm:p-10 overflow-hidden">
          {/* Neon scan lines / frame boundary */}
          <div className="absolute inset-4 sm:inset-6 border border-neutral-800/80 rounded-2xl pointer-events-none" />
          <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-purple-500/80 pointer-events-none" />
          <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-purple-500/80 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-purple-500/80 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-purple-500/80 pointer-events-none" />

          {/* Interactive AI Mirror Screen */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/60 bg-neutral-900 group">
            {/* Base Image */}
            <Image
              src={beforeImage}
              alt="Base model"
              fill
              className={`object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}
              sizes="320px"
            />

            {/* Simulated Tried Outfit (shown on hover) */}
            <Image
              src={afterImage}
              alt="Tried-on outfit"
              fill
              className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              sizes="320px"
            />

            {/* Laser scanning line effect on hover */}
            <div className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_12px_#a855f7] z-10 transition-all duration-1000 ${
              isHovered ? 'top-full opacity-100' : 'top-0 opacity-0'
            }`} />

            {/* Status tag */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-neutral-300">
                  {isHovered ? 'OUTFIT GENERATED' : 'WAITING FOR SOURCE'}
                </span>
              </div>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                FIT AI v1.0
              </span>
            </div>

            {/* Hover overlay hint */}
            {!isHovered && (
              <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center pointer-events-none group-hover:bg-transparent transition-all duration-300">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-white tracking-wider uppercase animate-pulse">
                  Hover to Try On
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Copywriting & CTA */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              AI SMART FITTING
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal leading-snug">
              Virtual Mirror <br />
              <span className="text-neutral-400">Fits You Instantly</span>
            </h2>
            <div className="w-16 h-0.5 bg-purple-500/60 rounded-full" />
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            Skip the returns and explore fashion interactively. Upload your portrait and see how our premium luxury dresses, jacket coats, and trousers look on your shape instantly before ordering.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-widest text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✦</span>
              <span>100% SECURE DATA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✦</span>
              <span>REALISTIC FABRIC DRAPE</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/cart/virtual-tryon"
              className="inline-flex items-center gap-3 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-950 bg-[#C5A880] hover:bg-[#B89762] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>ENTER FITTING ROOM</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
