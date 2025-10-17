/**
 * Posts Management Page
 * View and moderate posts with images and platform links
 */

'use client';

import { useEffect, useState } from 'react';
import { accountService } from '@/lib/services';
import { Post } from '@/types/nivafy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Trash2, RotateCcw, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'POST' | 'REEL'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted'>('all');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [restoreDialog, setRestoreDialog] = useState<number | null>(null);

  useEffect(() => {
    loadPosts();
  }, [page, typeFilter, statusFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        search: search || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        isDeleted: statusFilter === 'deleted' ? true : statusFilter === 'active' ? false : undefined,
      };

      const response = await accountService.getPosts(params);
      setPosts(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await accountService.deletePost(postId);
      toast.success('Post deleted successfully');
      setDeleteDialog(null);
      loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const handleRestore = async (postId: number) => {
    try {
      await accountService.restorePost(postId);
      toast.success('Post restored successfully');
      setRestoreDialog(null);
      loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore post');
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadPosts();
  };

  const getFirstImage = (post: Post) => {
    if (!post.slides || post.slides.length === 0) return null;
    const firstSlide = post.slides[0];
    if (firstSlide.media.type === 'image') {
      const thumbnails = firstSlide.media.metadata.thumbnails;
      return thumbnails && thumbnails.length > 0
        ? thumbnails[0].url
        : firstSlide.media.metadata.url;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
        <p className="text-muted-foreground">Manage and moderate user posts with media preview</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>View and moderate posts across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username, name, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="POST">Posts Only</SelectItem>
                <SelectItem value="REEL">Reels Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="deleted">Deleted Only</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>Search</Button>
              <Button variant="outline" onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setStatusFilter('all');
                setPage(1);
                setTimeout(loadPosts, 100);
              }}>
                Clear Filters
              </Button>
            </div>
            {search && (
              <p className="text-xs text-muted-foreground">
                🔍 Searching across: <strong>username</strong>, <strong>first name</strong>, <strong>last name</strong>, and <strong>post description</strong>
              </p>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No posts found</TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => {
                    const imageUrl = getFirstImage(post);
                    const hasVideo = post.slides?.some(s => s.media.type === 'video');

                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          <a
                            href={`https://beta.nivafy.com/en/post/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            {imageUrl ? (
                              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={imageUrl}
                                  alt="Post"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                {hasVideo && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Video className="h-6 w-6 text-white" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{post.user?.username || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">ID: {post.userId}</div>
                        </TableCell>
                        <TableCell className="max-w-sm">
                          <p className="truncate text-sm">{post.description || 'No description'}</p>
                          <a
                            href={`https://beta.nivafy.com/en/post/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            View on Platform
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.type === 'REEL' ? 'secondary' : 'outline'}>
                            {post.type}
                          </Badge>
                          {post.isPrivate && (
                            <Badge variant="outline" className="ml-1">Private</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>❤️ {post.likesCount}</div>
                            <div>💬 {post.commentsCount}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {statusFilter === 'deleted' || post.isDeleted ? (
                            <Badge variant="destructive">Deleted</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-500">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!post.isDeleted ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteDialog(Number(post.id))}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRestoreDialog(Number(post.id))}
                              >
                                <RotateCcw className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {posts.length} of {total} posts
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={posts.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!restoreDialog} onOpenChange={() => setRestoreDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this post? It will be visible again on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => restoreDialog && handleRestore(restoreDialog)}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
