/**
 * Enhanced Users Management Page
 * Complete user management with advanced filtering and moderation actions
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { accountService } from '@/lib/services';
import { User, UserRole, UserStatus } from '@/types/nivafy';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { 
  MoreHorizontal, 
  Search, 
  UserCheck, 
  UserX, 
  Shield, 
  Eye, 
  Ban, 
  Clock,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Info,
  Users,
  FileText,
  Wallet,
  MessageSquare,
  Flag
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { format } from 'date-fns';

export default function UsersPage() {
  const { hasRole } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [shadowBanFilter, setShadowBanFilter] = useState<'all' | 'shadowBanned' | 'notShadowBanned'>('all');
  
  // Action dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banDialog, setBanDialog] = useState(false);
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [shadowBanDialog, setShadowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDays, setSuspendDays] = useState('7');
  const [shadowBanReason, setShadowBanReason] = useState('');
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [detailsUser, setDetailsUser] = useState<User | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter, verifiedFilter, shadowBanFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await accountService.getUsers(params);
      
      // Apply client-side filters for verified and shadow ban (if not supported by backend)
      let filteredData = response.data;
      
      if (verifiedFilter === 'verified') {
        filteredData = filteredData.filter(u => u.isVerified);
      } else if (verifiedFilter === 'unverified') {
        filteredData = filteredData.filter(u => !u.isVerified);
      }
      
      if (shadowBanFilter === 'shadowBanned') {
        filteredData = filteredData.filter(u => u.isShadowBanned);
      } else if (shadowBanFilter === 'notShadowBanned') {
        filteredData = filteredData.filter(u => !u.isShadowBanned);
      }

      setUsers(filteredData);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDetailsIfCurrent = async (userId: string) => {
    if (!detailsUser || detailsUser.id !== userId) {
      return;
    }
    try {
      const updatedUser = await accountService.getUserById(userId);
      setDetailsUser(updatedUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  // Action handlers
  const handleVerify = async (userId: string) => {
    try {
      await accountService.verifyUser(userId);
      toast.success('User verified successfully');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify user');
    }
  };

  const handleUnverify = async (userId: string) => {
    try {
      await accountService.unverifyUser(userId);
      toast.success('Verification removed successfully');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove verification');
    }
  };

  const handleBan = async () => {
    if (!selectedUser || !banReason) {
      toast.error('Please provide a ban reason');
      return;
    }

    try {
      const userId = selectedUser.id;
      await accountService.banUser(userId, { reason: banReason, permanent: true });
      toast.success('User banned successfully');
      setBanDialog(false);
      setBanReason('');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to ban user');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await accountService.unbanUser(userId);
      toast.success('User unbanned successfully');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to unban user');
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser || !suspendReason || !suspendDays) {
      toast.error('Please provide suspension reason and duration');
      return;
    }

    try {
      const userId = selectedUser.id;
      await accountService.suspendUser(userId, {
        reason: suspendReason,
        durationDays: parseInt(suspendDays),
      });
      toast.success('User suspended successfully');
      setSuspendDialog(false);
      setSuspendReason('');
      setSuspendDays('7');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to suspend user');
    }
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      await accountService.unsuspendUser(userId);
      toast.success('User unsuspended successfully');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to unsuspend user');
    }
  };

  const handleShadowBan = async () => {
    if (!selectedUser || !shadowBanReason) {
      toast.error('Please provide a shadow ban reason');
      return;
    }

    try {
      const userId = selectedUser.id;
      await accountService.shadowBanUser(userId, shadowBanReason);
      toast.success('User shadow banned successfully');
      setShadowBanDialog(false);
      setShadowBanReason('');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to shadow ban user');
    }
  };

  const handleRemoveShadowBan = async (userId: string) => {
    try {
      await accountService.removeShadowBan(userId);
      toast.success('Shadow ban removed successfully');
      await loadUsers();
      await refreshDetailsIfCurrent(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove shadow ban');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      [UserRole.USER]: 'bg-gray-500',
      [UserRole.ADMIN]: 'bg-blue-500',
      [UserRole.GOD]: 'bg-purple-600',
    };
    const labels = {
      [UserRole.USER]: 'User',
      [UserRole.ADMIN]: 'Admin',
      [UserRole.GOD]: 'GOD',
    };
    return <Badge className={colors[role]}>{labels[role]}</Badge>;
  };

  const getStatusBadge = (user: User) => {
    if (user.status === UserStatus.BANNED) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (user.status === UserStatus.INACTIVE) {
      return <Badge className="bg-slate-500">Inactive</Badge>;
    }
    if (user.status === UserStatus.SUSPENDED || user.suspendedUntil) {
      const daysLeft = user.suspendedUntil 
        ? Math.ceil((new Date(user.suspendedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      return (
        <div className="flex flex-col gap-1">
          <Badge className="bg-orange-500">Suspended</Badge>
          {user.suspendedUntil && daysLeft > 0 && (
            <span className="text-xs text-muted-foreground">
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      );
    }
    if (user.isShadowBanned) {
      return <Badge className="bg-yellow-600">Shadow Banned</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const handleViewDetails = async (userId: string) => {
    setLoadingDetails(true);
    setDetailsDialog(true);
    setActionsOpen(false);
    try {
      const user = await accountService.getUserById(userId);
      setDetailsUser(user);
    } catch (error: any) {
      toast.error('Failed to load user details');
      setDetailsDialog(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage users with advanced filtering and moderation tools</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and moderate user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username, email, name, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>

              <Select value={roleFilter.toString()} onValueChange={(value: any) => setRoleFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.USER.toString()}>Users</SelectItem>
                  <SelectItem value={UserRole.ADMIN.toString()}>Admins</SelectItem>
                  {hasRole(UserRole.GOD) && <SelectItem value={UserRole.GOD.toString()}>GODs</SelectItem>}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter === 'all' ? 'all' : statusFilter.toString()}
                onValueChange={(value: string) =>
                  setStatusFilter(value === 'all' ? 'all' : (Number(value) as UserStatus))
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={UserStatus.ACTIVE.toString()}>Active</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE.toString()}>Inactive</SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED.toString()}>Suspended</SelectItem>
                  <SelectItem value={UserStatus.BANNED.toString()}>Banned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={verifiedFilter} onValueChange={(value: any) => setVerifiedFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Select value={shadowBanFilter} onValueChange={(value: any) => setShadowBanFilter(value)}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Shadow Ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="shadowBanned">Shadow Banned</SelectItem>
                  <SelectItem value="notShadowBanned">Not Shadow Banned</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>Search</Button>
              <Button variant="outline" onClick={() => {
                setSearch('');
                setRoleFilter('all');
                setStatusFilter('all');
                setVerifiedFilter('all');
                setShadowBanFilter('all');
                setPage(1);
                setTimeout(loadUsers, 100);
              }}>
                Clear Filters
              </Button>
            </div>
            {search && (
              <p className="text-xs text-muted-foreground">
                🔍 Searching across: <strong>username</strong>, <strong>email</strong>, <strong>first name</strong>, <strong>last name</strong>, and <strong>phone number</strong>
              </p>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">No users found</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">#{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.avatar && (
                            <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />
                          )}
                          <div>
                            <div className="font-medium">@{user.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email || <span className="text-muted-foreground">-</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {user.cellphone}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge variant="default" className="bg-blue-500">
                            <UserCheck className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* View Details */}
                            <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                              <Info className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>View User Activity</DropdownMenuLabel>

                            {/* Deep Links */}
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/wallet/transactions?userId=${user.id}`}>
                                <Wallet className="mr-2 h-4 w-4" />
                                Transactions
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href={`/admin/account/posts?userId=${user.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Posts
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href={`/admin/account/comments?userId=${user.id}`}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Comments
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href={`/admin/account/reports?userId=${user.id}`}>
                                <Flag className="mr-2 h-4 w-4" />
                                Reports
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href={`/admin/account/strikes?userId=${user.id}`}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Strikes
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href={`/admin/chat/messages?userId=${user.id}`}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat Messages
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            
                            {/* Verification */}
                            {user.isVerified ? (
                              <DropdownMenuItem onClick={() => handleUnverify(user.id)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Remove Verification
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleVerify(user.id)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Verify User
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Moderation Actions */}
                            {user.status === UserStatus.BANNED ? (
                              <DropdownMenuItem onClick={() => handleUnban(user.id)}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setBanDialog(true);
                                }}
                              >
                                <Ban className="mr-2 h-4 w-4 text-red-600" />
                                Ban User
                              </DropdownMenuItem>
                            )}

                            {user.status === UserStatus.SUSPENDED || user.suspendedUntil ? (
                              <DropdownMenuItem onClick={() => handleUnsuspend(user.id)}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                Unsuspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSuspendDialog(true);
                                }}
                              >
                                <Clock className="mr-2 h-4 w-4 text-orange-600" />
                                Suspend User
                              </DropdownMenuItem>
                            )}

                            {user.isShadowBanned ? (
                              <DropdownMenuItem onClick={() => handleRemoveShadowBan(user.id)}>
                                <Eye className="mr-2 h-4 w-4 text-green-600" />
                                Remove Shadow Ban
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShadowBanDialog(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4 text-yellow-600" />
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

          {/* Pagination */}
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
              <span className="flex items-center px-3 text-sm">
                Page {page}
              </span>
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

      {/* Ban Dialog */}
      <Dialog open={banDialog} onOpenChange={setBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Permanently ban {selectedUser?.username}. This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="banReason">Ban Reason *</Label>
              <Textarea
                id="banReason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Provide a detailed reason for banning this user..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm text-red-900 dark:text-red-100">
                <AlertTriangle className="mr-2 inline h-4 w-4" />
                <strong>Warning:</strong> This will permanently ban the user from accessing the platform.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBan}>
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog} onOpenChange={setSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Temporarily suspend {selectedUser?.username} for a specified duration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="suspendDays">Suspension Duration (days) *</Label>
              <Input
                id="suspendDays"
                type="number"
                value={suspendDays}
                onChange={(e) => setSuspendDays(e.target.value)}
                placeholder="7"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="suspendReason">Suspension Reason *</Label>
              <Textarea
                id="suspendReason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Provide a reason for suspending this user..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSuspend} className="bg-orange-500 hover:bg-orange-600">
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shadow Ban Dialog */}
      <Dialog open={shadowBanDialog} onOpenChange={setShadowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shadow Ban User</DialogTitle>
            <DialogDescription>
              Shadow ban {selectedUser?.username}. Their content will be hidden from other users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="shadowBanReason">Shadow Ban Reason *</Label>
              <Textarea
                id="shadowBanReason"
                value={shadowBanReason}
                onChange={(e) => setShadowBanReason(e.target.value)}
                placeholder="Provide a reason for shadow banning this user..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <Eye className="mr-2 inline h-4 w-4" />
                <strong>Note:</strong> Shadow banned users can still use the platform, but their content won't be visible to others.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShadowBanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShadowBan} className="bg-yellow-600 hover:bg-yellow-700">
              Shadow Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog
        open={detailsDialog}
        onOpenChange={(open) => {
          setDetailsDialog(open);
          if (!open) {
            setActionsOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about this user account
                </DialogDescription>
              </div>
              {detailsUser && (
                <Popover open={actionsOpen} onOpenChange={setActionsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 space-y-2 p-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Moderation</p>
                      {detailsUser.status === UserStatus.BANNED ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            handleUnban(detailsUser.id);
                          }}
                        >
                          <UserCheck className="h-4 w-4 text-green-600" />
                          Unban User
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            setSelectedUser(detailsUser);
                            setBanDialog(true);
                          }}
                        >
                          <Ban className="h-4 w-4 text-red-600" />
                          Ban User
                        </Button>
                      )}
                      {detailsUser.status === UserStatus.SUSPENDED || detailsUser.suspendedUntil ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            handleUnsuspend(detailsUser.id);
                          }}
                        >
                          <UserCheck className="h-4 w-4 text-green-600" />
                          Unsuspend User
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            setSelectedUser(detailsUser);
                            setSuspendDialog(true);
                          }}
                        >
                          <Clock className="h-4 w-4 text-orange-600" />
                          Suspend User
                        </Button>
                      )}
                      {detailsUser.isShadowBanned ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            handleRemoveShadowBan(detailsUser.id);
                          }}
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                          Remove Shadow Ban
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            setSelectedUser(detailsUser);
                            setShadowBanDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-yellow-600" />
                          Shadow Ban
                        </Button>
                      )}
                      {detailsUser.isVerified ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            handleUnverify(detailsUser.id);
                          }}
                        >
                          <UserX className="h-4 w-4" />
                          Remove Verification
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setActionsOpen(false);
                            handleVerify(detailsUser.id);
                          }}
                        >
                          <UserCheck className="h-4 w-4" />
                          Verify User
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 border-t pt-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">View Activity</p>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/wallet/transactions?userId=${detailsUser.id}`}>
                          <Wallet className="h-4 w-4" />
                          Transactions
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/account/posts?userId=${detailsUser.id}`}>
                          <FileText className="h-4 w-4" />
                          Posts
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/account/comments?userId=${detailsUser.id}`}>
                          <MessageSquare className="h-4 w-4" />
                          Comments
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/account/reports?userId=${detailsUser.id}`}>
                          <Flag className="h-4 w-4" />
                          Reports
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/account/strikes?userId=${detailsUser.id}`}>
                          <AlertTriangle className="h-4 w-4" />
                          Strikes
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href={`/admin/chat/messages?userId=${detailsUser.id}`}>
                          <MessageSquare className="h-4 w-4" />
                          Chat Messages
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="py-8 text-center">Loading user details...</div>
          ) : detailsUser ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start gap-4">
                {detailsUser.avatar && (
                  <img src={detailsUser.avatar} alt="" className="h-20 w-20 rounded-full" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">@{detailsUser.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {detailsUser.firstName} {detailsUser.lastName}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getRoleBadge(detailsUser.role)}
                    {getStatusBadge(detailsUser)}
                    {detailsUser.isVerified && (
                      <Badge variant="default" className="bg-blue-500">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-2xl font-bold">{detailsUser.postsCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-2xl font-bold">{detailsUser.followersCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-2xl font-bold">{detailsUser.followingCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{detailsUser.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{detailsUser.cellphone}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {detailsUser.bio && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Bio</h4>
                  <p className="text-sm text-muted-foreground">{detailsUser.bio}</p>
                </div>
              )}

              {/* Account Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">Account Details</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono">#{detailsUser.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined:</span>
                    <span>{format(new Date(detailsUser.createdAt), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birth Date:</span>
                    <span>{format(new Date(detailsUser.birthDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sex:</span>
                    <span>{detailsUser.sex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Private Account:</span>
                    <span>{detailsUser.isPrivate ? 'Yes' : 'No'}</span>
                  </div>
                  {detailsUser.websiteUrl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Website:</span>
                      <a href={detailsUser.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {detailsUser.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Moderation Info */}
              {(detailsUser.status !== UserStatus.ACTIVE || detailsUser.isShadowBanned) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Moderation Status</h4>
                  <div className="grid gap-2 text-sm">
                    {detailsUser.status === UserStatus.BANNED && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Banned At:</span>
                          <span>{detailsUser.bannedAt ? format(new Date(detailsUser.bannedAt), 'MMM d, yyyy HH:mm') : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ban Reason:</span>
                          <span className="text-right max-w-xs">{detailsUser.banReason || '-'}</span>
                        </div>
                      </>
                    )}
                    {detailsUser.status === UserStatus.SUSPENDED && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Suspended Until:</span>
                          <span>{detailsUser.suspendedUntil ? format(new Date(detailsUser.suspendedUntil), 'MMM d, yyyy HH:mm') : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Suspension Reason:</span>
                          <span className="text-right max-w-xs">{detailsUser.suspensionReason || '-'}</span>
                        </div>
                      </>
                    )}
                    {detailsUser.isShadowBanned && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shadow Banned At:</span>
                          <span>{detailsUser.shadowBannedAt ? format(new Date(detailsUser.shadowBannedAt), 'MMM d, yyyy HH:mm') : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shadow Ban Reason:</span>
                          <span className="text-right max-w-xs">{detailsUser.shadowBanReason || '-'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Info */}
              {detailsUser.isVerified && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600">Verification</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified At:</span>
                      <span>{detailsUser.verifiedAt ? format(new Date(detailsUser.verifiedAt), 'MMM d, yyyy HH:mm') : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification Type:</span>
                      <span>{detailsUser.verificationType || 'INDIVIDUAL'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">No user data available</div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
