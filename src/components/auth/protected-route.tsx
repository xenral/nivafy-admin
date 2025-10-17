/**
 * Protected Route Component
 * Client-side route protection with role-based access control
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/nivafy';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole = UserRole.ADMIN,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give time for store to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      console.log('🔒 ProtectedRoute check:', { isAuthenticated, user: user?.username, role: user?.role, requiredRole });

      // Redirect if not authenticated
      if (!isAuthenticated || !user) {
        console.log('❌ Not authenticated, redirecting to login');
        router.replace(redirectTo);
        return;
      }

      // Check role requirement
      if (user.role < requiredRole) {
        console.log('❌ Insufficient role:', user.role, '<', requiredRole);
        router.replace('/admin/unauthorized');
        return;
      }

      console.log('✅ Auth check passed');
    }, 100); // Small delay to allow store hydration

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, requiredRole, redirectTo, router]);

  // Show loading while checking auth
  if (isChecking || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check role
  if (user.role < requiredRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
