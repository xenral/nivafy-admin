/**
 * Notification Templates Management Page
 * Manage notification templates across all methods
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Template {
  _id: string;
  notificationType: string;
  notificationMethod: string;
  subject: string;
  pattern?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    notificationType: '',
    notificationMethod: '',
    subject: '',
    pattern: '',
    externalId: '',
  });

  useEffect(() => {
    loadTemplates();
  }, [page, typeFilter, methodFilter]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      setTemplates([]);
      setTotal(0);
      toast.info('Template API not yet connected');
    } catch (error: any) {
      toast.error('Failed to load templates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      // TODO: Implement API call
      toast.success('Template created successfully');
      setCreateDialog(false);
      setFormData({
        notificationType: '',
        notificationMethod: '',
        subject: '',
        pattern: '',
        externalId: '',
      });
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to create template');
    }
  };

  const handleUpdate = async () => {
    if (!editDialog) return;
    try {
      // TODO: Implement API call
      toast.success('Template updated successfully');
      setEditDialog(null);
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to update template');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      // TODO: Implement API call
      toast.success('Template deleted successfully');
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to delete template');
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Notification Templates</h2>
          <p className="text-muted-foreground">Manage templates for all notification types</p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>Configure notification templates for different types and methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="otp">OTP</SelectItem>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="like_comment">Like Comment</SelectItem>
                <SelectItem value="like_post">Like Post</SelectItem>
                <SelectItem value="follow">Follow</SelectItem>
                <SelectItem value="charge">Charge</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[200px]">
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Pattern</TableHead>
                  <TableHead>External ID</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No templates found</TableCell>
                  </TableRow>
                ) : (
                  templates.map((template) => (
                    <TableRow key={template._id}>
                      <TableCell>
                        <Badge variant="outline">{template.notificationType}</Badge>
                      </TableCell>
                      <TableCell>{getMethodBadge(template.notificationMethod)}</TableCell>
                      <TableCell className="font-medium">{template.subject}</TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                        {template.pattern || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{template.externalId || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditDialog(template);
                              setFormData({
                                notificationType: template.notificationType,
                                notificationMethod: template.notificationMethod,
                                subject: template.subject,
                                pattern: template.pattern || '',
                                externalId: template.externalId || '',
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
            <div className="text-sm text-muted-foreground">
              Showing {templates.length} of {total} templates
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

      {/* Create Template Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Notification Template</DialogTitle>
            <DialogDescription>
              Configure a new notification template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={formData.notificationType}
                  onValueChange={(value) => setFormData({ ...formData, notificationType: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otp">OTP</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="like_comment">Like Comment</SelectItem>
                    <SelectItem value="like_post">Like Post</SelectItem>
                    <SelectItem value="follow">Follow</SelectItem>
                    <SelectItem value="charge">Charge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="method">Notification Method</Label>
                <Select
                  value={formData.notificationMethod}
                  onValueChange={(value) => setFormData({ ...formData, notificationMethod: value })}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter template subject"
              />
            </div>
            <div>
              <Label htmlFor="pattern">Pattern (Optional)</Label>
              <Textarea
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                placeholder="Enter template pattern with variables like {{username}}"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="externalId">External ID (Optional)</Label>
              <Input
                id="externalId"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                placeholder="External template ID (e.g., for email services)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate}>
              <FileText className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notification Template</DialogTitle>
            <DialogDescription>
              Update template configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Notification Type</Label>
                <Input value={formData.notificationType} disabled />
              </div>
              <div>
                <Label>Notification Method</Label>
                <Input value={formData.notificationMethod} disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-pattern">Pattern</Label>
              <Textarea
                id="edit-pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-externalId">External ID</Label>
              <Input
                id="edit-externalId"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>
              <Edit className="mr-2 h-4 w-4" />
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
