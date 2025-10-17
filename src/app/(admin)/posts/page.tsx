'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Star,
  Download,
  Upload,
  CheckCircle2,
  Archive,
} from 'lucide-react';

// Import post data and utilities
import { postStats, categories, statusIconMap } from '@/data/(admin)/data';
import {
  filterPosts,
  sortPosts,
  formatPublishedDate,
  formatNumber,
  getUniqueAuthors,
  getBadgeStatusColor,
} from '@/utils/(admin)/utils';
import { PostVariantType } from '@/types/(admin)/enum';
import { AdminPostsService, useApiData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function PostsManagementPage() {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    'createdAt' | 'likesCount' | 'commentsCount'
  >('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const { data: postsData, loading, error, refresh } = useApiData(
    AdminPostsService.list,
    []
  );

  const [creating, setCreating] = useState(false);
  const [actingIds, setActingIds] = useState<Record<number, boolean>>({});

  // Filter and sort posts
  const sourcePosts = postsData || [];
  const filteredPosts = filterPosts(sourcePosts, {
    search: searchTerm,
    status: statusFilter,
    category: categoryFilter,
    author: authorFilter,
  });

  const sortedPosts = sortPosts(filteredPosts, sortBy, sortOrder);

  // Get unique authors for filter
  const uniqueAuthors = getUniqueAuthors(sourcePosts);

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === sortedPosts.length
        ? []
        : sortedPosts.map((post) => post.id)
    );
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIconMap.get(status);
    return IconComponent || FileText;
  };

  const handleCreatePost = async () => {
    try {
      setCreating(true);
      // Simple demo payload; wire to dialog inputs as needed
      await AdminPostsService.create({
        description: 'New post',
        type: PostVariantType.NORMAL,
        slides: [],
      });
      toast({ title: 'Post created' });
      setIsCreateDialogOpen(false);
      refresh();
    } catch (e: any) {
      toast({ title: 'Failed to create post', description: e?.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const withActing = async (id: number, fn: () => Promise<void>, success: string) => {
    try {
      setActingIds((m) => ({ ...m, [id]: true }));
      await fn();
      toast({ title: success });
      refresh();
    } catch (e: any) {
      toast({ title: 'Action failed', description: e?.message, variant: 'destructive' });
    } finally {
      setActingIds((m) => ({ ...m, [id]: false }));
    }
  };

  const handleLikeToggle = (postId: number, isLiked: boolean) =>
    withActing(
      postId,
      () => (isLiked ? AdminPostsService.unlike(postId) : AdminPostsService.like(postId)),
      isLiked ? 'Post unliked' : 'Post liked'
    );

  const handleArchive = (postId: number) =>
    withActing(postId, () => AdminPostsService.archive(postId), 'Post archived');

  const handleDelete = (postId: number) =>
    withActing(postId, () => AdminPostsService.remove(postId), 'Post deleted');

  const handleBulkArchive = async () => {
    if (selectedPosts.length === 0) return;
    try {
      await AdminPostsService.bulkArchive(selectedPosts);
      toast({ title: 'Selected posts archived' });
      setSelectedPosts([]);
      refresh();
    } catch (e: any) {
      toast({ title: 'Bulk archive failed', description: e?.message, variant: 'destructive' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    try {
      await AdminPostsService.bulkRemove(selectedPosts);
      toast({ title: 'Selected posts deleted' });
      setSelectedPosts([]);
      refresh();
    } catch (e: any) {
      toast({ title: 'Bulk delete failed', description: e?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Posts</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Posts Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create, edit, and manage your blog posts and articles
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post or article.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter post title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    rows={8}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold">{postStats.totalPosts}</p>
                </div>
                <FileText className="text-muted-foreground h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {postStats.publishedPosts}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Drafts
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {postStats.draftPosts}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(postStats.totalViews)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold text-pink-600">
                    {formatNumber(postStats.totalLikes)}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Comments
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(postStats.totalComments)}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Posts</CardTitle>
              <CardDescription>
                Manage and monitor your blog posts ({sortedPosts.length} of{' '}
                {sourcePosts.length} posts shown)
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 space-x-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
              {selectedPosts.length > 0 && (
            <div className="bg-muted mb-4 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {selectedPosts.length} post
                  {selectedPosts.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Bulk Edit
                  </Button>
                      <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPosts.length === sortedPosts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.map((post, index) => {
                  const StatusIcon = getStatusIcon(post.type);
                  return (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="group"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={() => handleSelectPost(post.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-md items-start space-x-3">
                          <img
                            src={post.slides[0].media.metadata.url}
                            alt={post.description || 'Post image'}
                            className="h-12 w-12 flex-shrink-0 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {post.description}
                            </div>
                            <div className="text-muted-foreground truncate text-sm">
                              {post.location?.address}
                            </div>
                            <div className="mt-1 flex items-center space-x-2">
                              {post.isLiked && (
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                {post.likesCount} likes
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={post.user?.avatar || ''}
                              alt={post.user?.username}
                            />
                            <AvatarFallback className="text-xs">
                              {post.user?.username
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {post.user?.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge
                            variant={
                              getBadgeStatusColor(post.type) as
                                | 'default'
                                | 'secondary'
                                | 'destructive'
                                | 'outline'
                            }
                          >
                            {post.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {post.location?.address}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Eye className="text-muted-foreground h-3 w-3" />
                          <span className="text-sm">
                            {formatNumber(post.likesCount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart className="text-muted-foreground h-3 w-3" />
                            <span className="text-xs">
                              {formatNumber(post.likesCount)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="text-muted-foreground h-3 w-3" />
                            <span className="text-xs">
                              {post.commentsCount}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatPublishedDate(post.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => {}}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Post
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => {}}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleLikeToggle(post.id, post.isLiked)}>
                              <Star className="mr-2 h-4 w-4" />
                              {post.isLiked ? 'Unlike' : 'Like'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleArchive(post.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onSelect={() => handleDelete(post.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {sortedPosts.length === 0 && (
            <div className="py-8 text-center">
              <FileText className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold">No posts found</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
