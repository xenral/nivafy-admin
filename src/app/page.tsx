'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Root page - redirects to login
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
