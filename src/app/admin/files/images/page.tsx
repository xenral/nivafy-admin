/**
 * Images Management Page
 * Manage user-uploaded images with filtering, soft-delete, and restoration
 */

'use client';

import { useEffect, useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, RotateCcw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fileService } from '@/lib/services';

interface ImageMetadata {
  _id: string;
  name: string;
  url: string;
  userId: number;
  size: number;
  width: number;
  height: number;
  contentType: string;
  deletedAt?: string;
  createdAt: string;
}

interface PaginatedResponse {
  data: ImageMetadata[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadImages();
  }, [page, includeDeleted]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data: PaginatedResponse = await fileService.getImages({
        page,
        limit: 20,
        includeDeleted,
        ...(search && { search }),
      });
      setImages(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadImages();
  };

  const handleSoftDelete = async (imageId: string) => {
    try {
      await fileService.softDeleteImage(imageId);
      toast.success('Image soft-deleted successfully');
      loadImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleRestore = async (imageId: string) => {
    try {
      await fileService.restoreImage(imageId);
      toast.success('Image restored successfully');
      loadImages();
    } catch (error) {
      toast.error('Failed to restore image');
    }
  };

  const handleHardDelete = async () => {
    if (!selectedImage) return;
    
    try {
      await fileService.hardDeleteImage(selectedImage._id);
      toast.success('Image permanently deleted');
      setDeleteDialogOpen(false);
      setSelectedImage(null);
      loadImages();
    } catch (error) {
      toast.error('Failed to permanently delete image');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Images Management</h2>
        <p className="text-muted-foreground">Manage user-uploaded images</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>View and manage all images in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by name or URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <Select
              value={includeDeleted ? 'true' : 'false'}
              onValueChange={(value) => setIncludeDeleted(value === 'true')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active Only</SelectItem>
                <SelectItem value="true">Include Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No images found
                      </TableCell>
                    </TableRow>
                  ) : (
                    images.map((image) => (
                      <TableRow key={image._id}>
                        <TableCell>
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-[200px] truncate">
                          {image.name}
                        </TableCell>
                        <TableCell>{image.userId}</TableCell>
                        <TableCell>{formatBytes(image.size)}</TableCell>
                        <TableCell>
                          {image.width} × {image.height}
                        </TableCell>
                        <TableCell>
                          {image.deletedAt ? (
                            <Badge variant="destructive">Deleted</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(image.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {image.deletedAt ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRestore(image._id)}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Restore
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSoftDelete(image._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedImage(image);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image from storage. This action cannot be undone.
              <br />
              <br />
              Image: <strong>{selectedImage?.name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHardDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
