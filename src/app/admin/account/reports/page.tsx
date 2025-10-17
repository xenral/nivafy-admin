/**
 * Reports Management Page
 * View and manage user reports
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { accountService } from '@/lib/services';
import { Report, ReportStatus, ReportType } from '@/types/nivafy';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ReportType | ''>('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'dismiss'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    // Read userId from URL params
    const userId = searchParams.get('userId');
    if (userId) {
      setUserIdFilter(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadReports();
  }, [page, statusFilter, typeFilter, userIdFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        userId: userIdFilter ? parseInt(userIdFilter) : undefined,
      };
      const response = await accountService.getReports(params);
      setReports(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedReport) return;

    try {
      if (reviewAction === 'dismiss') {
        await accountService.dismissReport(Number(selectedReport.id), reviewNotes);
      } else {
        await accountService.takeActionOnReport(Number(selectedReport.id), {
          action: reviewAction,
          notes: reviewNotes,
        });
      }
      toast.success(`Report ${reviewAction === 'approve' ? 'approved' : 'dismissed'} successfully`);
      setReviewDialog(false);
      setSelectedReport(null);
      setReviewNotes('');
      loadReports();
    } catch (error: any) {
      toast.error(error.message || 'Failed to review report');
    }
  };

  const handleEscalate = async (reportId: number) => {
    try {
      await accountService.escalateReport(reportId, 'Escalated for senior review');
      toast.success('Report escalated successfully');
      loadReports();
    } catch (error: any) {
      toast.error(error.message || 'Failed to escalate report');
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return <Badge variant="outline">Pending</Badge>;
      case ReportStatus.UNDER_REVIEW:
        return <Badge variant="default">Under Review</Badge>;
      case ReportStatus.RESOLVED:
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>;
      case ReportStatus.DISMISSED:
        return <Badge variant="secondary">Dismissed</Badge>;
      case ReportStatus.ESCALATED:
        return <Badge variant="destructive">Escalated</Badge>;
    }
  };

  const getTypeBadge = (type: ReportType) => {
    const colors: Record<ReportType, string> = {
      [ReportType.SPAM]: 'bg-yellow-500',
      [ReportType.HARASSMENT]: 'bg-orange-500',
      [ReportType.HATE_SPEECH]: 'bg-red-500',
      [ReportType.VIOLENCE]: 'bg-red-600',
      [ReportType.NUDITY]: 'bg-pink-500',
      [ReportType.MISINFORMATION]: 'bg-purple-500',
      [ReportType.TERRORISM]: 'bg-red-700',
      [ReportType.COPYRIGHT]: 'bg-blue-500',
      [ReportType.SELF_HARM]: 'bg-red-800',
      [ReportType.CHILD_SAFETY]: 'bg-red-900',
      [ReportType.FAKE_ACCOUNT]: 'bg-indigo-500',
      [ReportType.OTHER]: 'bg-gray-500',
    };
    
    return <Badge className={colors[type]}>{type.replace(/_/g, ' ')}</Badge>;
  };

  const clearUserIdFilter = () => {
    setUserIdFilter('');
    router.push('/admin/account/reports');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">Review and manage user reports</p>
      </div>

      {/* Active Filter Indicators */}
      {userIdFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            User ID: {userIdFilter}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={clearUserIdFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>Review reported content and users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value as ReportStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ReportStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ReportStatus.UNDER_REVIEW}>Under Review</SelectItem>
                <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
                <SelectItem value={ReportStatus.ESCALATED}>Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter || 'all'} onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value as ReportType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={ReportType.SPAM}>Spam</SelectItem>
                <SelectItem value={ReportType.HARASSMENT}>Harassment</SelectItem>
                <SelectItem value={ReportType.HATE_SPEECH}>Hate Speech</SelectItem>
                <SelectItem value={ReportType.VIOLENCE}>Violence</SelectItem>
                <SelectItem value={ReportType.NUDITY}>Nudity</SelectItem>
                <SelectItem value={ReportType.MISINFORMATION}>Misinformation</SelectItem>
                <SelectItem value={ReportType.COPYRIGHT}>Copyright</SelectItem>
                <SelectItem value={ReportType.TERRORISM}>Terrorism</SelectItem>
                <SelectItem value={ReportType.SELF_HARM}>Self Harm</SelectItem>
                <SelectItem value={ReportType.CHILD_SAFETY}>Child Safety</SelectItem>
                <SelectItem value={ReportType.FAKE_ACCOUNT}>Fake Account</SelectItem>
                <SelectItem value={ReportType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setStatusFilter('');
              setTypeFilter('');
              setPage(1);
              setTimeout(loadReports, 100);
            }}>
              Clear Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{getTypeBadge(report.type)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{report.reportableType}</div>
                        <div className="text-xs text-muted-foreground">{report.reportableId.slice(0, 8)}</div>
                      </TableCell>
                      <TableCell>{report.reporter?.username || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{format(new Date(report.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setReviewDialog(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {reports.length} of {total} reports
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
                disabled={reports.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              {selectedReport && `${selectedReport.type} - ${selectedReport.reportableType}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-sm">{selectedReport.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reporter</Label>
                  <p className="mt-1 text-sm">{selectedReport.reporter?.username || 'Unknown'}</p>
                </div>
                <div>
                  <Label>Reported At</Label>
                  <p className="mt-1 text-sm">{format(new Date(selectedReport.createdAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
              </div>
              
              <div>
                <Label>Action</Label>
                <Select value={reviewAction} onValueChange={(value) => setReviewAction(value as 'approve' | 'dismiss')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve (Take Action)</SelectItem>
                    <SelectItem value="dismiss">Dismiss (No Action)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReview}>
              {reviewAction === 'approve' ? (
                <><CheckCircle className="mr-2 h-4 w-4" /> Approve</>
              ) : (
                <><XCircle className="mr-2 h-4 w-4" /> Reject</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
