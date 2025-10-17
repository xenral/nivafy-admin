/**
 * Admin Dashboard
 * Main dashboard with analytics from all microservices
 */

'use client';

import { useEffect, useState } from 'react';
import { accountService, chatService, fileService, notificationService, searchService, walletService } from '@/lib/services';
import { DashboardAnalytics } from '@/types/services/account.types';
import { ChatStats } from '@/types/services/chat.types';
import { FileStats } from '@/types/services/file.types';
import { NotificationStats } from '@/types/services/notification.types';
import { SearchStats } from '@/types/services/search.types';
import { WalletStats } from '@/types/services/wallet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageSquare, FileText, Bell, Search, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [accountStats, setAccountStats] = useState<DashboardAnalytics | null>(null);
  const [chatStats, setChatStats] = useState<ChatStats | null>(null);
  const [fileStats, setFileStats] = useState<FileStats | null>(null);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [searchStats, setSearchStats] = useState<SearchStats | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [account, chat, file, notification, search, wallet] = await Promise.allSettled([
        accountService.getDashboard(),
        chatService.getStats(),
        fileService.getStats(),
        notificationService.getStats(),
        searchService.getStats(),
        walletService.getStats(),
      ]);

      if (account.status === 'fulfilled') setAccountStats(account.value);
      if (chat.status === 'fulfilled') setChatStats(chat.value);
      if (file.status === 'fulfilled') setFileStats(file.value);
      if (notification.status === 'fulfilled') setNotificationStats(notification.value);
      if (search.status === 'fulfilled') setSearchStats(search.value);
      if (wallet.status === 'fulfilled') setWalletStats(wallet.value);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of all Nivafy services</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of all Nivafy services</p>
      </div>

      {/* Account Service Stats */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Account Service</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accountStats?.totalUsers != null
                  ? accountStats.totalUsers.toLocaleString()
                  : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                +{accountStats?.newUsersToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accountStats?.activeUsers != null
                  ? accountStats.activeUsers.toLocaleString()
                  : '0'}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accountStats?.totalPosts != null
                  ? accountStats.totalPosts.toLocaleString()
                  : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                +{accountStats?.postsToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accountStats?.totalComments != null
                  ? accountStats.totalComments.toLocaleString()
                  : '0'}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Other Services Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Chat Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat Service
            </CardTitle>
            <CardDescription>Messages and conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Messages</span>
              <span className="font-medium">
                {chatStats?.totalMessages != null
                  ? chatStats.totalMessages.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Messages Today</span>
              <span className="font-medium">
                {chatStats?.messagesToday != null
                  ? chatStats.messagesToday.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Conversations</span>
              <span className="font-medium">{chatStats?.activeConversations || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* File Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              File Service
            </CardTitle>
            <CardDescription>Files and AI generations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Files</span>
              <span className="font-medium">
                {fileStats?.totalFiles != null
                  ? fileStats.totalFiles.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Files Today</span>
              <span className="font-medium">{fileStats?.filesToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">AI Generations</span>
              <span className="font-medium">{fileStats?.totalAIGenerations || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Notification Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Service
            </CardTitle>
            <CardDescription>Notifications and delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Sent</span>
              <span className="font-medium">
                {notificationStats?.totalNotifications != null
                  ? notificationStats.totalNotifications.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sent Today</span>
              <span className="font-medium">
                {notificationStats?.notificationsToday != null
                  ? notificationStats.notificationsToday.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Delivery Rate</span>
              <span className="font-medium">
                {notificationStats?.deliveryRate != null
                  ? notificationStats.deliveryRate.toFixed(1)
                  : '0'}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Search Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Service
            </CardTitle>
            <CardDescription>Search queries and indexing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Searches</span>
              <span className="font-medium">
                {searchStats?.totalSearches != null
                  ? searchStats.totalSearches.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Searches Today</span>
              <span className="font-medium">{searchStats?.searchesToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Indexed Entities</span>
              <span className="font-medium">{searchStats?.totalIndexedEntities || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Wallet Service
            </CardTitle>
            <CardDescription>Wallet balances and revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Transactions</span>
              <span className="font-medium">
                {walletStats?.totalTransactions != null
                  ? walletStats.totalTransactions.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="font-medium">
                $
                {walletStats?.totalRevenue != null
                  ? walletStats.totalRevenue.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Wallets</span>
              <span className="font-medium">
                {walletStats?.activeWallets != null
                  ? walletStats.activeWallets.toLocaleString()
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Credits</span>
              <span className="font-medium">
                {walletStats?.totalCreditsInCirculation != null
                  ? walletStats.totalCreditsInCirculation.toLocaleString()
                  : '0'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
