/**
 * Revenue Analytics Page
 * View detailed revenue analytics and insights (GOD only)
 */

'use client';

import { useEffect, useState } from 'react';
import { walletService } from '@/lib/services';
import { RevenueAnalytics } from '@/types/services/wallet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function RevenuePage() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await walletService.getRevenue();
      setAnalytics(data);
    } catch (error: any) {
      toast.error('Failed to load revenue analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
          <p className="text-muted-foreground">Detailed revenue insights and metrics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
        <p className="text-muted-foreground">Detailed revenue insights and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.totalRevenue.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.revenueToday || 0}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.revenueThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.revenueThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Month-over-month growth rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.revenueGrowth !== undefined
                ? `${analytics.revenueGrowth > 0 ? '+' : ''}${analytics.revenueGrowth.toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compared to last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Transaction Value</CardTitle>
            <CardDescription>Mean value per transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${analytics?.averageTransactionValue.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {analytics?.revenueByType && analytics.revenueByType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Type</CardTitle>
            <CardDescription>Breakdown by transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <p className="font-bold">${item.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
