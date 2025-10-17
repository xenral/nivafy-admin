/**
 * Strikes Management Page
 * View and manage user strikes with filtering
 */

'use client';

import { useEffect, useState } from 'react';
import { accountService } from '@/lib/services';
import { Strike, StrikeSeverity, StrikeReason } from '@/types/nivafy';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, AlertTriangle, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function StrikesPage() {
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [removeDialog, setRemoveDialog] = useState<{ userId: number; strikeId: number } | null>(null);
  const [issueDialog, setIssueDialog] = useState(false);
  const [issueData, setIssueData] = useState({
    userId: '',
    reason: StrikeReason.SPAM,
    severity: StrikeSeverity.MINOR,
    description: '',
  });

  useEffect(() => {
    loadStrikes();
  }, [page, statusFilter]);

  const loadStrikes = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        userId: userIdFilter ? parseInt(userIdFilter) : undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'expired' ? false : undefined,
      };

      const response = await accountService.getAllStrikes(params);
      setStrikes(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load strikes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueStrike = async () => {
    if (!issueData.userId || !issueData.reason || !issueData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await accountService.issueStrike(parseInt(issueData.userId), {
        reason: issueData.reason,
        severity: issueData.severity,
        description: issueData.description,
      });

      toast.success('Strike issued successfully');
      setIssueDialog(false);
      setIssueData({ userId: '', reason: StrikeReason.SPAM, severity: StrikeSeverity.MINOR, description: '' });
      loadStrikes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to issue strike');
    }
  };

  const handleRemoveStrike = async () => {
    if (!removeDialog) return;

    try {
      await accountService.removeStrike(removeDialog.userId, removeDialog.strikeId);
      toast.success('Strike removed successfully');
      setRemoveDialog(null);
      loadStrikes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove strike');
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadStrikes();
  };

  const getSeverityBadge = (severity: StrikeSeverity) => {
    const colors: Record<StrikeSeverity, string> = {
      [StrikeSeverity.WARNING]: 'bg-blue-500',
      [StrikeSeverity.MINOR]: 'bg-yellow-500',
      [StrikeSeverity.MODERATE]: 'bg-orange-500',
      [StrikeSeverity.SEVERE]: 'bg-red-500',
      [StrikeSeverity.CRITICAL]: 'bg-red-700',
    };

    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Strikes</h2>
          <p className="text-muted-foreground">Manage user strikes and violations</p>
        </div>
        <Button onClick={() => setIssueDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Issue Strike
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Strikes</CardTitle>
          <CardDescription>View and manage strikes issued to users</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Filter by User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-[200px]"
              type="number"
            />

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strikes</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="expired">Expired Only</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => {
              setUserIdFilter('');
              setStatusFilter('all');
              setPage(1);
              setTimeout(loadStrikes, 100);
            }}>
              Clear Filters
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : strikes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">No strikes found</TableCell>
                  </TableRow>
                ) : (
                  strikes.map((strike) => (
                    <TableRow key={strike.id}>
                      <TableCell className="font-mono text-xs">#{strike.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{strike.user?.username || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">ID: {strike.userId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{strike.reason}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {strike.description}
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(strike.severity)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{strike.points} pts</Badge>
                      </TableCell>
                      <TableCell>
                        {strike.isActive ? (
                          <Badge variant="destructive">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                        {strike.expiresAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Expires: {format(new Date(strike.expiresAt), 'MMM d, yyyy')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{strike.issuedByAdmin?.username || 'System'}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(strike.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {strike.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRemoveDialog({ userId: strike.userId, strikeId: Number(strike.id) })}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
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
              Showing {strikes.length} of {total} strikes
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
                disabled={strikes.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue Strike Dialog */}
      <Dialog open={issueDialog} onOpenChange={setIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Strike to User</DialogTitle>
            <DialogDescription>
              Issue a strike to a user for policy violations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                type="number"
                value={issueData.userId}
                onChange={(e) => setIssueData({ ...issueData, userId: e.target.value })}
                placeholder="Enter user ID"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={issueData.severity}
                onValueChange={(value) => setIssueData({ ...issueData, severity: value as StrikeSeverity })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StrikeSeverity.WARNING}>Warning (0 pts)</SelectItem>
                  <SelectItem value={StrikeSeverity.MINOR}>Minor (1 pt)</SelectItem>
                  <SelectItem value={StrikeSeverity.MODERATE}>Moderate (2 pts)</SelectItem>
                  <SelectItem value={StrikeSeverity.SEVERE}>Severe (3 pts - Auto-suspend)</SelectItem>
                  <SelectItem value={StrikeSeverity.CRITICAL}>Critical (Immediate ban)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Select
                value={issueData.reason}
                onValueChange={(value) => setIssueData({ ...issueData, reason: value as StrikeReason })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StrikeReason.SPAM}>Spam</SelectItem>
                  <SelectItem value={StrikeReason.HARASSMENT}>Harassment</SelectItem>
                  <SelectItem value={StrikeReason.HATE_SPEECH}>Hate Speech</SelectItem>
                  <SelectItem value={StrikeReason.VIOLENCE}>Violence</SelectItem>
                  <SelectItem value={StrikeReason.NUDITY}>Nudity</SelectItem>
                  <SelectItem value={StrikeReason.COPYRIGHT}>Copyright Violation</SelectItem>
                  <SelectItem value={StrikeReason.MISINFORMATION}>Misinformation</SelectItem>
                  <SelectItem value={StrikeReason.COMMUNITY_GUIDELINES}>Community Guidelines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={issueData.description}
                onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
                placeholder="Detailed description of the violation..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <AlertTriangle className="mr-2 inline h-4 w-4" />
                <strong>Note:</strong> Critical strikes result in immediate account ban. Severe strikes may auto-suspend the account.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueStrike} variant="destructive">
              Issue Strike
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Strike Confirmation */}
      <AlertDialog open={!!removeDialog} onOpenChange={() => setRemoveDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Strike</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this strike? This action cannot be undone and will reduce the user's strike count.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveStrike}>
              Remove Strike
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
