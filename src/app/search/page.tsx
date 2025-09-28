'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchContainer } from '../../features/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  return <SearchContainer initialQuery={initialQuery} />;
}