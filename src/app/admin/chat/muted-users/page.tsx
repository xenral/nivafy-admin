/**
 * Muted Users Management Page
 * View and manage users muted from chat
 */

'use client';

import { useEffect, useState } from 'react';
import { chatService } from '@/lib/services';
import { ChatMute } from '@/types/services/chat.types';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VolumeX, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function MutedUsersPage() {
  const [mutedUsers, setMutedUsers] = useState<ChatMute[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [muteDialog, setMuteDialog] = useState<{ userId: string; username: string } | null>(null);
  const [muteForm, setMuteForm] = useState({ reason: '', durationHours: 24 });

  useEffect(() => {
    loadMutedUsers();
  }, [page]);

  const loadMutedUsers = async () => {
    setLoading(true);
    try {
      const response = await chatService.getMutedUsers({ page, limit: 20 });
      setMutedUsers(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load muted users');
    } finally {
      setLoading(false);
    }
  };

  const handleMute = async () => {
    if (!muteDialog) return;
    
    try {
      await chatService.muteUser(muteDialog.userId, {
        reason: muteForm.reason,
        durationHours: muteForm.durationHours,
      });
      toast.success('User muted successfully');
      loadMutedUsers();
      setMuteDialog(null);
      setMuteForm({ reason: '', durationHours: 24 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to mute user');
    }
  };

  const handleUnmute = async (userId: string) => {
    try {
      await chatService.unmuteUser(userId);
      toast.success('User unmuted successfully');
      loadMutedUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unmute user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Muted Users</h2>
        <p className="text-muted-foreground">Manage users restricted from sending messages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muted Users List</CardTitle>
          <CardDescription>Users temporarily or permanently restricted from chat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Muted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Muted At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : mutedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No muted users found
                    </TableCell>
                  </TableRow>
                ) : (
                  mutedUsers.map((mute) => (
                    <TableRow key={mute.id}>
                      <TableCell className="font-medium">
                        {mute.user?.username || `User ${mute.userId}`}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{mute.reason}</TableCell>
                      <TableCell>
                        {mute.mutedByUser?.username || `Admin ${mute.mutedBy}`}
                      </TableCell>
                      <TableCell>
                        {mute.isActive ? (
                          <Badge variant="destructive">
                            <VolumeX className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Volume2 className="mr-1 h-3 w-3" />
                            Expired
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {mute.expiresAt 
                          ? format(new Date(mute.expiresAt), 'MMM d, yyyy HH:mm')
                          : 'Permanent'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(mute.createdAt), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        {mute.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnmute(mute.userId)}
                          >
                            <Volume2 className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {mutedUsers.length} of {total} muted users
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={mutedUsers.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mute User Dialog */}
      <Dialog open={!!muteDialog} onOpenChange={() => setMuteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mute User</DialogTitle>
            <DialogDescription>
              Restrict {muteDialog?.username} from sending messages
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Spam, harassment, etc."
                value={muteForm.reason}
                onChange={(e) => setMuteForm({ ...muteForm, reason: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={muteForm.durationHours}
                onChange={(e) => setMuteForm({ ...muteForm, durationHours: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave as 0 for permanent mute
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMuteDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleMute} disabled={!muteForm.reason}>
              Mute User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
