/**
 * Broadcast Notifications Page (GOD Only)
 * Send broadcast notifications to all or selected users
 */

'use client';

import { useState } from 'react';
import { notificationService } from '@/lib/services';
import { NotificationType } from '@/types/services/notification.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/nivafy';

export default function BroadcastPage() {
  const { user, hasRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: '' as string,
    method: 'notice' as string,
    targetUserIds: '',
  });

  if (!hasRole(UserRole.GOD)) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature is only available to GOD administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        title: formData.title,
        message: formData.message,
        type: formData.type || undefined,
        method: formData.method,
      };

      // Parse target user IDs if provided
      if (formData.targetUserIds.trim()) {
        const userIds = formData.targetUserIds
          .split(',')
          .map(id => id.trim())
          .filter(id => id.length > 0)
          .map(id => parseInt(id));
        
        if (userIds.length > 0) {
          payload.userIds = userIds;
        }
      }

      await notificationService.broadcast(payload);
      
      const targetCount = payload.userIds ? payload.userIds.length : 'all';
      toast.success(`Broadcast sent to ${targetCount} users!`);
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        type: '',
        method: 'notice',
        targetUserIds: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Broadcast Notification</h2>
        <p className="text-muted-foreground">Send notifications to all users or a specific group</p>
      </div>

      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>GOD Feature:</strong> Use this carefully. Broadcasts will be sent immediately to all targeted users.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Create Broadcast</CardTitle>
          <CardDescription>
            Compose and send a notification to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Notification Type (Optional)</Label>
                <Select
                  value={formData.type || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, type: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (System Broadcast)</SelectItem>
                    <SelectItem value={NotificationType.OTP}>OTP</SelectItem>
                    <SelectItem value={NotificationType.COMMENT}>Comment</SelectItem>
                    <SelectItem value={NotificationType.LIKE_COMMENT}>Like Comment</SelectItem>
                    <SelectItem value={NotificationType.REPLY_COMMENT}>Reply Comment</SelectItem>
                    <SelectItem value={NotificationType.LIKE_POST}>Like Post</SelectItem>
                    <SelectItem value={NotificationType.FOLLOW}>Follow</SelectItem>
                    <SelectItem value={NotificationType.CHARGE}>Charge</SelectItem>
                    <SelectItem value={NotificationType.MENTION_POST}>Mention in Post</SelectItem>
                    <SelectItem value={NotificationType.MENTION_COMMENT}>Mention in Comment</SelectItem>
                    <SelectItem value={NotificationType.TAG_POST}>Tag in Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Notification Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notice">In-App Notice</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message"
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUserIds">Target User IDs (Optional)</Label>
              <Textarea
                id="targetUserIds"
                value={formData.targetUserIds}
                onChange={(e) => setFormData({ ...formData, targetUserIds: e.target.value })}
                placeholder="Comma-separated user IDs (leave empty to broadcast to all users)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to send to all users, or enter specific user IDs separated by commas
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    Review Before Sending
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This notification will be sent immediately and cannot be recalled
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  title: '',
                  message: '',
                  type: '',
                  method: 'notice',
                  targetUserIds: '',
                })}
              >
                Reset
              </Button>
              <Button type="submit" disabled={loading || !formData.title || !formData.message}>
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {(formData.title || formData.message) && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preview</CardTitle>
            <CardDescription>How users will see this notification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{formData.title || 'Notification Title'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.message || 'Notification message will appear here'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
