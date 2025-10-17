'use client';

import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
