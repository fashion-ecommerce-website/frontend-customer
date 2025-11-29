import React, { useState, useRef, useEffect } from 'react';

interface ComparisonViewProps {
  beforeImage: string;
  afterImage: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  beforeImage,
  afterImage,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] rounded-xl overflow-hidden cursor-ew-resize select-none group touch-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${afterImage})` }}
      />

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center border-r-2 border-white shadow-xl"
        style={{ 
          backgroundImage: `url(${beforeImage})`,
          width: `${sliderPosition}%` 
        }}
      />

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 transform transition-transform group-hover:scale-110">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm pointer-events-none">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-purple-600/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm pointer-events-none">
        Virtual Try-On
      </div>
    </div>
  );
};
