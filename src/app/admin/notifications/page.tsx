/**
 * Notifications Management Page
 * View and manage system notifications
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Bell, Send, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Notification {
  _id: string;
  userId: number | null;
  template: {
    notificationType: string;
    notificationMethod: string;
    subject: string;
  };
  flgRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  useEffect(() => {
    // Read userId from URL params
    const userId = searchParams.get('userId');
    if (userId) {
      setUserIdFilter(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadNotifications();
  }, [page, userIdFilter, typeFilter, methodFilter, readFilter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      // const response = await notificationService.getNotifications({...});
      setNotifications([]);
      setTotal(0);
      toast.info('Notification API not yet connected');
    } catch (error: any) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearUserIdFilter = () => {
    setUserIdFilter('');
    router.push('/admin/notifications');
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      sms: 'bg-blue-500',
      email: 'bg-green-500',
      push: 'bg-purple-500',
      notice: 'bg-orange-500',
    };
    return <Badge className={colors[method] || 'bg-gray-500'}>{method.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Manage system notifications</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/notifications/templates">
              <Bell className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/notifications/broadcast">
              <Send className="mr-2 h-4 w-4" />
              Broadcast
            </Link>
          </Button>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {userIdFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            User ID: {userIdFilter}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={clearUserIdFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>View and filter notifications across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Filter by User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-[200px]"
              type="number"
            />

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="otp">OTP</SelectItem>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="like_post">Like Post</SelectItem>
                <SelectItem value="follow">Follow</SelectItem>
                <SelectItem value="charge">Charge</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="notice">Notice</SelectItem>
              </SelectContent>
            </Select>

            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadNotifications}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No notifications found</TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => (
                    <TableRow key={notification._id}>
                      <TableCell className="font-mono text-xs">{notification._id}</TableCell>
                      <TableCell>{notification.userId || 'Broadcast'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{notification.template.notificationType}</Badge>
                      </TableCell>
                      <TableCell>{getMethodBadge(notification.template.notificationMethod)}</TableCell>
                      <TableCell className="max-w-xs truncate">{notification.template.subject}</TableCell>
                      <TableCell>
                        {notification.flgRead ? (
                          <Badge variant="default" className="bg-green-500">Read</Badge>
                        ) : (
                          <Badge variant="secondary">Unread</Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {notifications.length} of {total} notifications
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * 20 >= total}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
