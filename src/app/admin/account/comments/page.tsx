/**
 * Comments Management Page
 * View and moderate comments with advanced filtering
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { accountService } from '@/lib/services';
import { Comment } from '@/types/nivafy';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Trash2, RotateCcw, Eye, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CommentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted'>('all');
  const [postIdFilter, setPostIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [restoreDialog, setRestoreDialog] = useState<number | null>(null);

  useEffect(() => {
    // Read userId from URL params
    const userId = searchParams.get('userId');
    if (userId) {
      setUserIdFilter(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadComments();
  }, [page, statusFilter, userIdFilter]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        search: search || undefined,
        postId: postIdFilter ? parseInt(postIdFilter) : undefined,
        userId: userIdFilter ? parseInt(userIdFilter) : undefined,
        isDeleted: statusFilter === 'deleted' ? true : statusFilter === 'active' ? false : undefined,
      };

      const response = await accountService.getComments(params);
      setComments(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load comments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await accountService.deleteComment(commentId);
      toast.success('Comment deleted successfully');
      setDeleteDialog(null);
      loadComments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  const handleRestore = async (commentId: number) => {
    try {
      await accountService.restoreComment(commentId);
      toast.success('Comment restored successfully');
      setRestoreDialog(null);
      loadComments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore comment');
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadComments();
  };

  const clearUserIdFilter = () => {
    setUserIdFilter('');
    router.push('/admin/account/comments');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
        <p className="text-muted-foreground">Manage and moderate user comments</p>
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
          <CardTitle>All Comments</CardTitle>
          <CardDescription>View and moderate comments across all posts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by author or comment content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>

            <Input
              placeholder="Filter by Post ID"
              value={postIdFilter}
              onChange={(e) => setPostIdFilter(e.target.value)}
              className="w-[180px]"
              type="number"
            />

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
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
                setPostIdFilter('');
                setStatusFilter('all');
                setPage(1);
                setTimeout(loadComments, 100);
              }}>
                Clear Filters
              </Button>
            </div>
            {search && (
              <p className="text-xs text-muted-foreground">
                🔍 Searching in comment content and author names
              </p>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Likes</TableHead>
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
                ) : comments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No comments found</TableCell>
                  </TableRow>
                ) : (
                  comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="font-mono text-xs">#{comment.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{comment.user?.username || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {comment.userId}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{comment.content}</p>
                        {comment.parentCommentId && (
                          <span className="text-xs text-muted-foreground">
                            Reply to #{comment.parentCommentId}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://beta.nivafy.com/en/post/${comment.postId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <span className="text-xs">Post #{comment.postId}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>{comment.likesCount}</TableCell>
                      <TableCell>
                        {comment.isDeleted ? (
                          <Badge variant="destructive">Deleted</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-500">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!comment.isDeleted ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog(Number(comment.id))}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRestoreDialog(Number(comment.id))}
                            >
                              <RotateCcw className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {comments.length} of {total} comments
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
                disabled={comments.length < 20}
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
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action can be reversed later.
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
            <AlertDialogTitle>Restore Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this comment? It will be visible again.
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
