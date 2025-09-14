'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <div className={`px-6 py-4 bg-white ${className}`}>
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-300">&gt;</span>
            )}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-black bg-transparent border-none cursor-pointer p-0"
              >
                {item.label}
              </button>
            ) : item.href && !item.isActive ? (
              <Link 
                href={item.href} 
                className="text-black no-underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={item.isActive ? "text-black font-medium" : "text-gray-500"}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};
