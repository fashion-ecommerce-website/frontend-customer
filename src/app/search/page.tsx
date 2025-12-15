'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchContainer } from '../../features/search';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const initialCategory = searchParams?.get('category') || undefined;

  return <SearchContainer initialQuery={initialQuery} initialCategory={initialCategory} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}