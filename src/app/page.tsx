'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

// Dynamically import the App component with SSR turned off
const App = dynamic(() => import('@/components/ui/ui 2/src/App'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Icons.loader className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-foreground">Loading Application...</p>
    </div>
  ),
});

export default function HomePage() {
  return <App />;
}
