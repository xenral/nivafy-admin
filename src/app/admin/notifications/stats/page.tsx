/**
 * Notification Statistics Page
 * View notification delivery metrics and statistics
 */

'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/lib/services';
import { NotificationStats } from '@/types/services/notification.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Send, CheckCircle, XCircle, Eye, Users, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationStatsPage() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getStats();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color || 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24" />
            {description && <Skeleton className="mt-1 h-4 w-32" />}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Statistics</h2>
        <p className="text-muted-foreground">Overview of notification delivery and engagement</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Notifications"
          value={stats?.totalNotifications.toLocaleString() || '0'}
          icon={Bell}
          description="All time"
        />

        <StatCard
          title="Unread"
          value={stats?.unreadCount.toLocaleString() || '0'}
          icon={Eye}
          description="Pending user attention"
          color="text-orange-500"
        />

        <StatCard
          title="Read"
          value={stats?.readCount.toLocaleString() || '0'}
          icon={CheckCircle}
          description="Successfully viewed"
          color="text-green-500"
        />

        <StatCard
          title="Delivery Rate"
          value={`${stats?.deliveryRate.toFixed(1) || '0'}%`}
          icon={Send}
          description="Read / Total ratio"
          color="text-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Today"
          value={stats?.notificationsToday.toLocaleString() || '0'}
          icon={Calendar}
          description={`+${stats?.growthToday || 0} new`}
          color="text-purple-500"
        />

        <StatCard
          title="This Week"
          value={stats?.notificationsThisWeek.toLocaleString() || '0'}
          icon={TrendingUp}
          description={`+${stats?.growthThisWeek || 0} growth`}
          color="text-cyan-500"
        />

        <StatCard
          title="This Month"
          value={stats?.notificationsThisMonth.toLocaleString() || '0'}
          icon={TrendingUp}
          description={`+${stats?.growthThisMonth || 0} growth`}
          color="text-indigo-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications by Type</CardTitle>
            <CardDescription>Distribution of notification types</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : stats?.notificationsByType && stats.notificationsByType.length > 0 ? (
              <div className="space-y-3">
                {stats.notificationsByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[120px]">
                        <p className="text-sm font-medium capitalize">{item.type}</p>
                        <p className="text-xs text-muted-foreground">{item.count.toLocaleString()} notifications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="min-w-[48px] text-sm font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications by Method</CardTitle>
            <CardDescription>Delivery method breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : stats?.notificationsByMethod && stats.notificationsByMethod.length > 0 ? (
              <div className="space-y-3">
                {stats.notificationsByMethod.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[120px]">
                        <p className="text-sm font-medium capitalize">{item.method}</p>
                        <p className="text-xs text-muted-foreground">{item.count.toLocaleString()} notifications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="min-w-[48px] text-sm font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Delivery</CardTitle>
          <CardDescription>
            Overview of notification delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Read Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Successfully viewed by users
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.readCount.toLocaleString() || '0'}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium">Unread Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Waiting for user attention
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.unreadCount.toLocaleString() || '0'}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Total Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      All notifications sent
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.totalNotifications.toLocaleString() || '0'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
          <CardDescription>
            Daily notification trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{item.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.readCount} read • {item.unreadCount} unread
                    </p>
                  </div>
                  <p className="text-xl font-bold">{item.count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalTemplates.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">Configured message templates</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Push Tokens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalPushTokens.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">Active device tokens</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.readRate.toFixed(1) || '0'}%</div>
                <p className="text-xs text-muted-foreground">Overall engagement rate</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
