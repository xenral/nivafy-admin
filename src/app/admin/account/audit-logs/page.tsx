/**
 * Audit Logs Page (GOD Only)
 * View all admin actions and system events
 */

'use client';

import { useEffect, useState } from 'react';
import { accountService } from '@/lib/services';
import { AuditLog, AuditAction, UserRole } from '@/types/nivafy';
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
import { Search, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/auth.store';

export default function AuditLogsPage() {
  const { hasRole } = useAuthStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [adminIdFilter, setAdminIdFilter] = useState('');
  const [targetUserIdFilter, setTargetUserIdFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 50,
        action: actionFilter || undefined,
        adminId: adminIdFilter ? parseInt(adminIdFilter) : undefined,
        targetUserId: targetUserIdFilter ? parseInt(targetUserIdFilter) : undefined,
      };

      const response = await accountService.getAuditLogs(params);
      setLogs(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load audit logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadLogs();
  };

  const getActionBadge = (action: string) => {
    const actionColors: Record<string, string> = {
      USER_ROLE_CHANGED: 'bg-purple-500',
      USER_STATUS_CHANGED: 'bg-blue-500',
      USER_DELETED: 'bg-red-700',
      USER_BANNED: 'bg-red-500',
      USER_SUSPENDED: 'bg-orange-500',
      USER_SHADOW_BANNED: 'bg-yellow-500',
      USER_VERIFIED: 'bg-green-500',
      POST_DELETED: 'bg-red-400',
      COMMENT_DELETED: 'bg-red-400',
      REPORT_REVIEWED: 'bg-blue-400',
      STRIKE_ISSUED: 'bg-orange-600',
      STRIKE_REMOVED: 'bg-green-400',
    };

    return (
      <Badge className={actionColors[action] || 'bg-gray-500'}>
        {action.replace(/_/g, ' ')}
      </Badge>
    );
  };

  // Check if user is GOD
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
              This feature is only available to GOD administrators. Audit logs contain sensitive information about all admin actions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-red-500" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">Complete history of all admin actions (GOD Only)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Audit Logs</CardTitle>
          <CardDescription>Track and monitor all administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <Select
              value={actionFilter || 'all'}
              onValueChange={(value) => setActionFilter(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="USER_ROLE_CHANGED">Role Changed</SelectItem>
                <SelectItem value="USER_STATUS_CHANGED">Status Changed</SelectItem>
                <SelectItem value="USER_DELETED">User Deleted</SelectItem>
                <SelectItem value="USER_BANNED">User Banned</SelectItem>
                <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
                <SelectItem value="USER_SHADOW_BANNED">Shadow Banned</SelectItem>
                <SelectItem value="USER_VERIFIED">User Verified</SelectItem>
                <SelectItem value="POST_DELETED">Post Deleted</SelectItem>
                <SelectItem value="COMMENT_DELETED">Comment Deleted</SelectItem>
                <SelectItem value="REPORT_REVIEWED">Report Reviewed</SelectItem>
                <SelectItem value="STRIKE_ISSUED">Strike Issued</SelectItem>
                <SelectItem value="STRIKE_REMOVED">Strike Removed</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Admin ID"
              value={adminIdFilter}
              onChange={(e) => setAdminIdFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-[150px]"
              type="number"
            />

            <Input
              placeholder="Target User ID"
              value={targetUserIdFilter}
              onChange={(e) => setTargetUserIdFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-[150px]"
              type="number"
            />

            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => {
              setActionFilter('');
              setAdminIdFilter('');
              setTargetUserIdFilter('');
              setPage(1);
              setTimeout(loadLogs, 100);
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
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No audit logs found</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">#{log.id}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{log.admin?.username || 'System'}</div>
                        <div className="text-xs text-muted-foreground">ID: {log.adminId}</div>
                      </TableCell>
                      <TableCell>
                        {log.targetUserId ? (
                          <>
                            <div className="font-medium">{log.targetUser?.username || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">ID: {log.targetUserId}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {log.details ? (
                          <pre className="text-xs text-muted-foreground truncate">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
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
              Showing {logs.length} of {total} audit logs
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
                disabled={logs.length < 50}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="text-yellow-900 dark:text-yellow-100">
            <AlertTriangle className="mr-2 inline h-5 w-5" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-900 dark:text-yellow-100">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Audit logs are immutable and cannot be deleted</li>
            <li>All actions are logged with timestamp, IP address, and details</li>
            <li>Access to audit logs is restricted to GOD administrators only</li>
            <li>Regular review of audit logs is recommended for security compliance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
