/**
 * Admin Sidebar Navigation
 * Sidebar with navigation for all Nivafy microservices
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/nivafy';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Bell,
  Search,
  Wallet,
  Shield,
  Flag,
  AlertTriangle,
  Settings,
  ScrollText,
  TrendingUp,
  Image,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  godOnly?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Account Service',
    href: '/admin/account',
    icon: Users,
    children: [
      { title: 'Users', href: '/admin/account/users', icon: Users },
      { title: 'Posts', href: '/admin/account/posts', icon: FileText },
      { title: 'Comments', href: '/admin/account/comments', icon: MessageSquare },
      { title: 'Reports', href: '/admin/account/reports', icon: Flag },
      { title: 'Strikes', href: '/admin/account/strikes', icon: AlertTriangle },
      { title: 'Audit Logs', href: '/admin/account/audit-logs', icon: ScrollText, godOnly: true },
    ],
  },
  {
    title: 'Chat Service',
    href: '/admin/chat',
    icon: MessageSquare,
    children: [
      { title: 'Messages', href: '/admin/chat/messages', icon: MessageSquare },
      { title: 'Conversations', href: '/admin/chat/conversations', icon: Users },
      { title: 'Muted Users', href: '/admin/chat/muted-users', icon: Shield },
      { title: 'Statistics', href: '/admin/chat/stats', icon: TrendingUp },
    ],
  },
  {
    title: 'File Service',
    href: '/admin/files',
    icon: Image,
    disabled: true,
    badge: 'Coming Soon',
    children: [
      { title: 'Files', href: '/admin/files/files', icon: FileText, disabled: true },
      { title: 'AI Generations', href: '/admin/files/ai-generations', icon: Zap, disabled: true },
      { title: 'Blocked Users', href: '/admin/files/blocked', icon: Shield, disabled: true },
      { title: 'Statistics', href: '/admin/files/stats', icon: TrendingUp, disabled: true },
    ],
  },
  {
    title: 'Notification Service',
    href: '/admin/notifications',
    icon: Bell,
    children: [
      { title: 'All Notifications', href: '/admin/notifications', icon: Bell },
      { title: 'Templates', href: '/admin/notifications/templates', icon: FileText },
      { title: 'Broadcast', href: '/admin/notifications/broadcast', icon: Zap, godOnly: true, disabled: true, badge: 'Coming Soon' },
      { title: 'Statistics', href: '/admin/notifications/stats', icon: TrendingUp },
    ],
  },
  {
    title: 'Search Service',
    href: '/admin/search',
    icon: Search,
    disabled: true,
    badge: 'Coming Soon',
    children: [
      { title: 'Search Queries', href: '/admin/search/queries', icon: Search, disabled: true },
      { title: 'Trending', href: '/admin/search/trending', icon: TrendingUp, disabled: true },
      { title: 'Popular', href: '/admin/search/popular', icon: TrendingUp, disabled: true },
      { title: 'Reindex', href: '/admin/search/reindex', icon: Settings, godOnly: true, disabled: true },
    ],
  },
  {
    title: 'Wallet Service',
    href: '/admin/wallet',
    icon: Wallet,
    children: [
      { title: 'Transactions', href: '/admin/wallet/transactions', icon: FileText },
      { title: 'Wallets', href: '/admin/wallet/wallets', icon: Wallet },
      { title: 'Revenue', href: '/admin/wallet/revenue', icon: TrendingUp, godOnly: true },
      { title: 'Statistics', href: '/admin/wallet/stats', icon: TrendingUp },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isGod } = useAuthStore();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const isGodAdmin = isGod();

  const filteredNavigation = useMemo(() => {
    const filterNavItems = (items: NavItem[]): NavItem[] => {
      return items
        .filter((item) => !item.godOnly || isGodAdmin)
        .map((item) => ({
          ...item,
          children: item.children ? filterNavItems(item.children) : undefined,
        }));
    };

    return filterNavItems(navigation);
  }, [isGodAdmin]);

  useEffect(() => {
    const activeParentTitles = filteredNavigation
      .filter(
        (item) =>
          item.children &&
          (pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            item.children.some(
              (child) =>
                pathname === child.href || pathname.startsWith(`${child.href}/`)
            ))
      )
      .map((item) => item.title);

    if (activeParentTitles.length === 0) {
      return;
    }

    setOpenSections((prev) => {
      const merged = [...prev];
      let changed = false;

      activeParentTitles.forEach((title) => {
        if (!merged.includes(title)) {
          merged.push(title);
          changed = true;
        }
      });

      return changed ? merged : prev;
    });
  }, [pathname, filteredNavigation]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Nivafy Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavigation.map((item) => {
          const children = item.children ?? [];
          const hasChildren = children.length > 0;
          const isParentActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            children.some(
              (child) =>
                pathname === child.href || pathname.startsWith(`${child.href}/`)
            );

          if (hasChildren) {
            return (
              <div key={item.title}>
                <Collapsible
                  open={openSections.includes(item.title)}
                  onOpenChange={() => toggleSection(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      disabled={item.disabled}
                      className={cn(
                        'w-full justify-between',
                        item.disabled
                          ? 'cursor-not-allowed opacity-50'
                          : isParentActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <span className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          openSections.includes(item.title) && 'rotate-180'
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    {children.map((child) => {
                      const isChildActive =
                        pathname === child.href ||
                        pathname.startsWith(`${child.href}/`);

                      return (
                        <Link
                          key={child.href}
                          href={child.disabled ? '#' : child.href}
                          onClick={(e) => {
                            if (child.disabled) {
                              e.preventDefault();
                            }
                          }}
                          className={cn(
                            'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                            child.disabled
                              ? 'cursor-not-allowed opacity-50'
                              : isChildActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.title}
                          {child.badge && (
                            <span className="ml-auto text-xs text-blue-500">
                              {child.badge}
                            </span>
                          )}
                          {child.godOnly && !child.badge && (
                            <span className="ml-auto text-xs text-yellow-500">
                              GOD
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          }

          return (
            <div key={item.title}>
              <Link
                href={item.disabled ? '#' : item.href}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : isParentActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
                {item.badge && (
                  <span className="ml-auto rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.username}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.role === UserRole.GOD ? 'GOD Admin' : 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
