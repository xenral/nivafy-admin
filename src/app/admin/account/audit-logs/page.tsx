/**
 * Audit Logs Page (GOD Only)
 * View all admin actions and system events
 */

'use client';

import { Fragment, useEffect, useState } from 'react';
import { accountService } from '@/lib/services';
import { AuditLog, UserRole } from '@/types/nivafy';
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
import { Search, Shield, AlertTriangle, ChevronDown, ChevronRight, Wallet, DollarSign, Lock, Unlock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/auth.store';
import { AuditActionEnum, getAuditActionLabel, getAuditActionCategory } from '@/types/enums/audit-action.enum';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AuditLogsPage() {
  const { hasRole } = useAuthStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [adminIdFilter, setAdminIdFilter] = useState('');
  const [targetUserIdFilter, setTargetUserIdFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter, adminIdFilter, targetUserIdFilter]);

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

  const toggleRow = (id: number | string) => {
    const key = String(id);
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const getActionBadge = (action: string) => {
    const category = getAuditActionCategory(action as AuditActionEnum);
    const actionColors: Record<string, string> = {
      'User Management': 'bg-purple-500',
      'Content Moderation': 'bg-red-500',
      'Reports & Strikes': 'bg-orange-500',
      'Wallet & Payments': 'bg-green-500',
      'DMCA': 'bg-pink-500',
      'System': 'bg-blue-500',
    };

    return (
      <Badge className={actionColors[category] || 'bg-gray-500'}>
        {getAuditActionLabel(action as AuditActionEnum)}
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    if (action.includes('WALLET_FROZEN')) return <Lock className="h-4 w-4" />;
    if (action.includes('WALLET_UNFROZEN')) return <Unlock className="h-4 w-4" />;
    if (action.includes('CREDITS') || action.includes('BONUS')) return <DollarSign className="h-4 w-4" />;
    if (action.includes('TRANSACTION')) return <RefreshCw className="h-4 w-4" />;
    if (action.includes('PAYMENT') || action.includes('STRIPE')) return <Wallet className="h-4 w-4" />;
    return null;
  };

  const renderMetadata = (log: AuditLog) => {
    const metadata = log.metadata as any;
    if (!metadata) return null;

    const { body, params, service } = metadata;

    // Wallet actions
    if (service === 'wallet') {
      return (
        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Wallet className="h-4 w-4" />
            Wallet Service Action
          </div>
          
          {body?.amount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono font-semibold">{body.amount}</span>
            </div>
          )}
          
          {body?.assetId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset ID:</span>
              <span className="font-mono">{body.assetId}</span>
            </div>
          )}
          
          {body?.reason && (
            <div>
              <span className="text-muted-foreground">Reason:</span>
              <p className="mt-1 rounded bg-background p-2 text-xs">{body.reason}</p>
            </div>
          )}
          
          {params?.transactionId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-xs">{params.transactionId}</span>
            </div>
          )}
        </div>
      );
    }

    // User management actions
    if (body?.reason || body?.durationDays || body?.permanent) {
      return (
        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
          {body.reason && (
            <div>
              <span className="text-muted-foreground">Reason:</span>
              <p className="mt-1 rounded bg-background p-2 text-xs">{body.reason}</p>
            </div>
          )}
          
          {body.durationDays && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-semibold">{body.durationDays} days</span>
            </div>
          )}
          
          {body.permanent !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Permanent:</span>
              <Badge variant={body.permanent ? 'destructive' : 'secondary'}>
                {body.permanent ? 'Yes' : 'No'}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    return null;
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
                <SelectItem value="USER_BANNED">User Banned</SelectItem>
                <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
                <SelectItem value="USER_VERIFIED">User Verified</SelectItem>
                <SelectItem value="POST_DELETED">Post Deleted</SelectItem>
                <SelectItem value="COMMENT_DELETED">Comment Deleted</SelectItem>
                <SelectItem value="TRANSACTION_REFUNDED">Transaction Refunded</SelectItem>
                <SelectItem value="CREDITS_ADJUSTED">Credits Adjusted</SelectItem>
                <SelectItem value="BONUS_CREDITS_GRANTED">Bonus Granted</SelectItem>
                <SelectItem value="WALLET_FROZEN">Wallet Frozen</SelectItem>
                <SelectItem value="WALLET_UNFROZEN">Wallet Unfrozen</SelectItem>
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Details</TableHead>
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
                    <Fragment key={String(log.id)}>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRow(log.id)}>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            {expandedRows.has(String(log.id)) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            {getActionBadge(log.action)}
                          </div>
                        </TableCell>
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
                          ) : log.targetPostId ? (
                            <div className="text-xs text-muted-foreground">Post #{log.targetPostId}</div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {(log.metadata as any)?.service ? (
                            <Badge variant="outline" className="capitalize">
                              {(log.metadata as any).service}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Account</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                          >
                            View Full
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(String(log.id)) && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30">
                            <div className="space-y-3 py-3">
                              {renderMetadata(log)}

                              {log.notes && (
                                <div className="rounded-lg bg-background p-3 text-sm">
                                  <span className="font-semibold">Notes:</span>
                                  <p className="mt-1 text-muted-foreground">{log.notes}</p>
                                </div>
                              )}

                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <div>
                                  <span className="font-semibold">IP:</span> {log.ipAddress || 'N/A'}
                                </div>
                                <div className="max-w-md truncate">
                                  <span className="font-semibold">User Agent:</span> {log.userAgent || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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

      {/* Full Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this admin action
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Action</label>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Timestamp</label>
                  <p className="mt-1 text-sm">{format(new Date(selectedLog.createdAt), 'PPpp')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Admin</label>
                  <p className="mt-1 text-sm">
                    {selectedLog.admin?.username || 'System'} (ID: {selectedLog.adminId})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Target User</label>
                  <p className="mt-1 text-sm">
                    {selectedLog.targetUserId
                      ? `${selectedLog.targetUser?.username || 'Unknown'} (ID: ${selectedLog.targetUserId})`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {renderMetadata(selectedLog)}

              {selectedLog.notes && (
                <div>
                  <label className="text-sm font-semibold">Notes</label>
                  <p className="mt-1 rounded-lg bg-muted p-3 text-sm">{selectedLog.notes}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold">Technical Details</label>
                <div className="mt-1 space-y-2 rounded-lg bg-muted p-3 text-xs">
                  <div><span className="font-semibold">IP Address:</span> {selectedLog.ipAddress || 'N/A'}</div>
                  <div><span className="font-semibold">User Agent:</span> {selectedLog.userAgent || 'N/A'}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Raw Metadata (JSON)</label>
                <pre className="mt-1 max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
