/**
 * Files Dashboard - Overview and Statistics
 * Main dashboard for file service with real-time stats
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Image, 
  Video, 
  Zap, 
  Database, 
  HardDrive,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FileStats {
  images: {
    total: number;
    deleted: number;
    storageBytes: number;
    storageGB: string;
  };
  videos: {
    total: number;
    deleted: number;
    storageBytes: number;
    storageGB: string;
  };
  ai: {
    totalGeneratedImages: number;
    totalConversations: number;
  };
  storage: {
    totalBytes: number;
    totalGB: string;
  };
}

export default function FilesDashboardPage() {
  const [stats, setStats] = useState<FileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/files/stats');
      if (!response.ok) throw new Error('Failed to load stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files Dashboard</h2>
          <p className="text-muted-foreground">File service overview and statistics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Files Dashboard</h2>
        <p className="text-muted-foreground">File service overview and statistics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.images.total.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.images.deleted || 0} deleted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.videos.total.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.videos.deleted || 0} deleted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.ai.totalGeneratedImages.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.ai.totalConversations || 0} conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.storage.totalGB || '0'} GB</div>
            <p className="text-xs text-muted-foreground">Combined storage</p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Image Storage</CardTitle>
            <CardDescription>Storage usage for images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Images</p>
                  <p className="text-2xl font-bold">{stats?.images.storageGB || '0'} GB</p>
                </div>
                <HardDrive className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                {stats?.images.total.toLocaleString() || 0} files
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Storage</CardTitle>
            <CardDescription>Storage usage for videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Videos</p>
                  <p className="text-2xl font-bold">{stats?.videos.storageGB || '0'} GB</p>
                </div>
                <HardDrive className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                {stats?.videos.total.toLocaleString() || 0} files
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management</CardTitle>
          <CardDescription>Quick access to file management tools</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/files/images">
            <Button variant="outline" className="w-full justify-start">
              <Image className="h-4 w-4 mr-2" />
              Manage Images
            </Button>
          </Link>
          <Link href="/admin/files/videos">
            <Button variant="outline" className="w-full justify-start">
              <Video className="h-4 w-4 mr-2" />
              Manage Videos
            </Button>
          </Link>
          <Link href="/admin/files/ai">
            <Button variant="outline" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              AI Management
            </Button>
          </Link>
          <Link href="/admin/files/audit">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
