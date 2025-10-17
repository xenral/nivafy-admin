/**
 * Wallet Transactions Management Page
 * View and manage wallet transactions
 */

'use client';

import { useEffect, useState } from 'react';
import { walletService } from '@/lib/services';
import { Transaction, TransactionStatus, TransactionType } from '@/types/services/wallet.types';
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
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const [refundDialog, setRefundDialog] = useState<Transaction | null>(null);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [page, typeFilter, statusFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      };
      const response = await walletService.getTransactions(params);
      setTransactions(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!refundDialog) return;

    try {
      await walletService.refundTransaction(refundDialog.id, { reason: refundReason });
      toast.success('Transaction refunded successfully');
      setRefundDialog(null);
      setRefundReason('');
      loadTransactions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to refund transaction');
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <Badge variant="outline">Pending</Badge>;
      case TransactionStatus.COMPLETED:
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case TransactionStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case TransactionStatus.REFUNDED:
        return <Badge variant="secondary">Refunded</Badge>;
    }
  };

  const getTypeBadge = (type: TransactionType) => {
    const colors: Record<TransactionType, string> = {
      [TransactionType.CREDIT]: 'bg-green-500',
      [TransactionType.DEBIT]: 'bg-red-500',
      [TransactionType.REFUND]: 'bg-blue-500',
      [TransactionType.BONUS]: 'bg-purple-500',
      [TransactionType.ADJUSTMENT]: 'bg-orange-500',
    };
    
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">View and manage wallet transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Monitor and manage wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionType | '')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value={TransactionType.CREDIT}>Credit</SelectItem>
                <SelectItem value={TransactionType.DEBIT}>Debit</SelectItem>
                <SelectItem value={TransactionType.REFUND}>Refund</SelectItem>
                <SelectItem value={TransactionType.BONUS}>Bonus</SelectItem>
                <SelectItem value={TransactionType.ADJUSTMENT}>Adjustment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | '')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                <SelectItem value={TransactionStatus.REFUNDED}>Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell className="font-medium">
                        ${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{format(new Date(transaction.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        {transaction.status === TransactionStatus.COMPLETED && 
                         transaction.type !== TransactionType.REFUND && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRefundDialog(transaction)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refund
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
              Showing {transactions.length} of {total} transactions
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
                disabled={transactions.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={!!refundDialog} onOpenChange={() => setRefundDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Transaction</DialogTitle>
            <DialogDescription>
              Transaction ID: {refundDialog?.id.slice(0, 16)}...
            </DialogDescription>
          </DialogHeader>
          
          {refundDialog && (
            <div className="space-y-4">
              <div>
                <Label>Amount</Label>
                <p className="mt-1 text-lg font-bold">${refundDialog.amount.toFixed(2)}</p>
              </div>
              
              <div>
                <Label>Original Description</Label>
                <p className="mt-1 text-sm">{refundDialog.description}</p>
              </div>
              
              <div>
                <Label htmlFor="refundReason">Refund Reason</Label>
                <Textarea
                  id="refundReason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefund} disabled={!refundReason}>
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
