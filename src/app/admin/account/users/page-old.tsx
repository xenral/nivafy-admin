/**
 * Users Management Page
 * View and manage all users with moderation actions
 */

'use client';

import { useEffect, useState } from 'react';
import { accountService } from '@/lib/services';
import { User, UserRole, UserStatus } from '@/types/nivafy';
import { PaginationParams } from '@/types/nivafy';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Search, UserCheck, UserX, Shield, Eye, Ban, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

export default function UsersPage() {
  const { isGod } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    type: 'ban' | 'suspend' | 'shadow-ban' | null;
    reason: string;
    duration: string;
  }>({ type: null, reason: '', duration: '' });

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: PaginationParams & { search?: string } = {
        page,
        limit: 20,
        search: search || undefined,
      };
      const response = await accountService.getUsers(params);
      setUsers(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (user: User, action: string) => {
    setSelectedUser(user);
    
    try {
      switch (action) {
        case 'verify':
          await accountService.verifyUser(user.id);
          toast.success('User verified successfully');
          break;
        case 'unverify':
          await accountService.unverifyUser(user.id);
          toast.success('User verification removed');
          break;
        case 'unban':
          await accountService.unbanUser(user.id);
          toast.success('User unbanned successfully');
          break;
        case 'unsuspend':
          await accountService.unsuspendUser(user.id);
          toast.success('User suspension removed');
          break;
        case 'remove-shadow-ban':
          await accountService.removeShadowBan(user.id);
          toast.success('Shadow ban removed');
          break;
        case 'ban':
        case 'suspend':
        case 'shadow-ban':
          setActionDialog({ type: action as any, reason: '', duration: '' });
          return; // Don't reload yet, wait for dialog
        default:
          return;
      }
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    }
  };

  const executeAction = async () => {
    if (!selectedUser || !actionDialog.type) return;

    try {
      switch (actionDialog.type) {
        case 'ban':
          await accountService.banUser(selectedUser.id, {
            reason: actionDialog.reason,
            permanent: !actionDialog.duration,
            durationDays: actionDialog.duration ? parseInt(actionDialog.duration) : undefined,
          });
          toast.success('User banned successfully');
          break;
        case 'suspend':
          await accountService.suspendUser(selectedUser.id, {
            reason: actionDialog.reason,
            durationDays: parseInt(actionDialog.duration) || 7,
          });
          toast.success('User suspended successfully');
          break;
        case 'shadow-ban':
          await accountService.shadowBanUser(selectedUser.id, actionDialog.reason);
          toast.success('User shadow banned successfully');
          break;
      }
      setActionDialog({ type: null, reason: '', duration: '' });
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.GOD:
        return <Badge variant="destructive">GOD</Badge>;
      case UserRole.ADMIN:
        return <Badge variant="default">ADMIN</Badge>;
      default:
        return <Badge variant="secondary">USER</Badge>;
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.status === UserStatus.BANNED || user.bannedAt) {
      return <Badge variant="destructive">Banned</Badge>;
    }

    if (user.status === UserStatus.SUSPENDED || user.suspendedUntil) {
      return <Badge variant="outline">Suspended</Badge>;
    }

    if (user.isShadowBanned) return <Badge variant="secondary">Shadow Banned</Badge>;
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage all users and moderation actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={loadUsers}>Search</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.cellphone}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <UserX className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>{user.followersCount || 0}</TableCell>
                      <TableCell>{user.postsCount || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            {!user.isVerified ? (
                              <DropdownMenuItem onClick={() => handleAction(user, 'verify')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Verify User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction(user, 'unverify')}>
                                <UserX className="mr-2 h-4 w-4" />
                                Remove Verification
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {user.status === UserStatus.BANNED || user.bannedAt ? (
                              <DropdownMenuItem onClick={() => handleAction(user, 'unban')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction(user, 'ban')}>
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            
                            {user.status === UserStatus.SUSPENDED || user.suspendedUntil ? (
                              <DropdownMenuItem onClick={() => handleAction(user, 'unsuspend')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Remove Suspension
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction(user, 'suspend')}>
                                <Clock className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            )}
                            
                            {user.isShadowBanned ? (
                              <DropdownMenuItem onClick={() => handleAction(user, 'remove-shadow-ban')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Remove Shadow Ban
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction(user, 'shadow-ban')}>
                                <Shield className="mr-2 h-4 w-4" />
                                Shadow Ban
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {total} users
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
                disabled={users.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog.type} onOpenChange={() => setActionDialog({ type: null, reason: '', duration: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'ban' && 'Ban User'}
              {actionDialog.type === 'suspend' && 'Suspend User'}
              {actionDialog.type === 'shadow-ban' && 'Shadow Ban User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.username} ({selectedUser?.cellphone})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={actionDialog.reason}
                onChange={(e) => setActionDialog({ ...actionDialog, reason: e.target.value })}
                placeholder="Enter reason for this action..."
                className="mt-1"
              />
            </div>
            
            {(actionDialog.type === 'ban' || actionDialog.type === 'suspend') && (
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={actionDialog.duration}
                  onChange={(e) => setActionDialog({ ...actionDialog, duration: e.target.value })}
                  placeholder={actionDialog.type === 'ban' ? 'Leave empty for permanent' : '7'}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ type: null, reason: '', duration: '' })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeAction} disabled={!actionDialog.reason}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
