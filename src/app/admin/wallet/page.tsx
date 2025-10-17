/**
 * Wallet Service Overview Page
 * Main dashboard for wallet service management
 */

'use client';

import { useEffect, useState } from 'react';
import { walletService } from '@/lib/services';
import { WalletStats } from '@/types/services/wallet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WalletOverviewPage() {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await walletService.getStats();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet Service</h2>
        <p className="text-muted-foreground">Manage wallets, transactions, and revenue</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">From charges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeWallets.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">With balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits in Circulation</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCreditsInCirculation.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Total balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/wallet/transactions">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transactions
              </CardTitle>
              <CardDescription>View and manage all transactions</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/wallet/wallets">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallets
              </CardTitle>
              <CardDescription>Monitor user wallet balances</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/wallet/revenue">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue
              </CardTitle>
              <CardDescription>Revenue analytics (GOD only)</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/wallet/stats">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics
              </CardTitle>
              <CardDescription>Detailed metrics and stats</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
