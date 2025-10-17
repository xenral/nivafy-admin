/**
 * Chat Service Overview Page
 * Main dashboard for chat service management
 */

'use client';

import { useEffect, useState } from 'react';
import { chatService } from '@/lib/services';
import { ChatStats } from '@/types/services/chat.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ChatOverviewPage() {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await chatService.getStats();
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
        <h2 className="text-3xl font-bold tracking-tight">Chat Service</h2>
        <p className="text-muted-foreground">Manage and moderate chat messages and conversations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.messagesToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messagesToday || 0}</div>
            <p className="text-xs text-muted-foreground">Sent in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/chat/messages">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>View and moderate all messages</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/chat/conversations">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>Manage user conversations</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/chat/muted-users">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Muted Users
              </CardTitle>
              <CardDescription>View restricted users</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/chat/stats">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics
              </CardTitle>
              <CardDescription>Detailed analytics</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
