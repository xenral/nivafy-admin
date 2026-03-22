/**
 * Wallet Balances Management Page
 * View and manage user wallet balances
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { walletService } from '@/lib/services';
import { Balance } from '@/types/services/wallet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Wallet, MoreVertical, Lock, Unlock, DollarSign, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type DialogType = 'freeze' | 'unfreeze' | 'adjust' | 'grant' | null;

export default function WalletsPage() {
  const searchParams = useSearchParams();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdSearch, setUserIdSearch] = useState(searchParams.get('userId') || '');
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [assetId, setAssetId] = useState<number>(1);

  useEffect(() => {
    loadBalances();
  }, [page]);

  const loadBalances = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
        userId: userIdSearch ? parseInt(userIdSearch) : undefined,
        minBalance: 0,
      };
      const response = await walletService.getWallets(params);
      setBalances(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error('Failed to load wallet balances');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadBalances();
  };

  const openDialog = (type: DialogType, balance: Balance) => {
    setDialogType(type);
    setSelectedBalance(balance);
    setReason('');
    setAmount('');
    setAssetId(balance.assetId || 10); // Default to balance's asset or 1
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedBalance(null);
    setReason('');
    setAmount('');
    setAssetId(1);
  };

  const handleFreezeWallet = async () => {
    if (!selectedBalance || !reason) return;
    try {
      await walletService.freezeWallet(String(selectedBalance.userId), { reason, assetId });
      toast.success('Wallet frozen successfully');
      closeDialog();
      loadBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to freeze wallet');
    }
  };

  const handleUnfreezeWallet = async () => {
    if (!selectedBalance) return;
    try {
      await walletService.unfreezeWallet(String(selectedBalance.userId), assetId);
      toast.success('Wallet unfrozen successfully');
      closeDialog();
      loadBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unfreeze wallet');
    }
  };

  const handleAdjustCredits = async () => {
    if (!selectedBalance || !amount || !reason) return;
    try {
      await walletService.adjustCredits(String(selectedBalance.userId), {
        amount: parseFloat(amount),
        reason,
        assetId,
      });
      toast.success('Credits adjusted successfully');
      closeDialog();
      loadBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to adjust credits');
    }
  };

  const handleGrantCredits = async () => {
    if (!selectedBalance || !amount || !reason) return;
    try {
      await walletService.grantBonusCredits(String(selectedBalance.userId), {
        amount: parseFloat(amount),
        reason,
        assetId,
      });
      toast.success('Bonus credits granted successfully');
      closeDialog();
      loadBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to grant bonus credits');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet Balances</h2>
        <p className="text-muted-foreground">View and monitor user wallet balances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Wallets</CardTitle>
          <CardDescription>User wallet balances and asset holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by User ID..."
                value={userIdSearch}
                onChange={(e) => setUserIdSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Total Balance</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Frozen</TableHead>
                  <TableHead>Last Updated</TableHead>
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
                ) : balances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No wallet balances found
                    </TableCell>
                  </TableRow>
                ) : (
                  balances.map((balance) => (
                    <TableRow key={balance.id}>
                      <TableCell className="font-medium">{balance.userId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          {balance.asset?.name || 'Unknown'} ({balance.asset?.symbol || 'N/A'})
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {parseFloat(balance.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {parseFloat(balance.available).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {parseFloat(balance.frozen).toFixed(2)}
                      </TableCell>
                      <TableCell>{format(new Date(balance.updatedAt || balance.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Wallet Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDialog('freeze', balance)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Freeze Wallet
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog('unfreeze', balance)}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unfreeze Wallet
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>GOD Only</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDialog('adjust', balance)}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Adjust Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog('grant', balance)}>
                              <Gift className="mr-2 h-4 w-4" />
                              Grant Bonus
                            </DropdownMenuItem>
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
              Showing {balances.length} of {total} wallet balances
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
                disabled={balances.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Freeze Wallet Dialog */}
      <Dialog open={dialogType === 'freeze'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze Wallet</DialogTitle>
            <DialogDescription>
              User ID: {selectedBalance?.userId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="freezeAssetId">Asset ID</Label>
              <Input
                id="freezeAssetId"
                type="number"
                min="1"
                value={assetId}
                onChange={(e) => setAssetId(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Current: {selectedBalance?.asset?.name || 'Unknown'}</p>
            </div>
            <div>
              <Label htmlFor="freezeReason">Reason for Freezing</Label>
              <Textarea
                id="freezeReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for freezing wallet..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleFreezeWallet} disabled={!reason}>
              <Lock className="mr-2 h-4 w-4" />
              Freeze Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unfreeze Wallet Dialog */}
      <Dialog open={dialogType === 'unfreeze'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfreeze Wallet</DialogTitle>
            <DialogDescription>
              User ID: {selectedBalance?.userId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="unfreezeAssetId">Asset ID</Label>
              <Input
                id="unfreezeAssetId"
                type="number"
                min="1"
                value={assetId}
                onChange={(e) => setAssetId(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Current: {selectedBalance?.asset?.name || 'Unknown'}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to unfreeze this wallet? The user will be able to make transactions again.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleUnfreezeWallet}>
              <Unlock className="mr-2 h-4 w-4" />
              Unfreeze Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Credits Dialog */}
      <Dialog open={dialogType === 'adjust'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Credits (GOD Only)</DialogTitle>
            <DialogDescription>
              User ID: {selectedBalance?.userId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adjustAssetId">Asset ID</Label>
              <Input
                id="adjustAssetId"
                type="number"
                min="1"
                value={assetId}
                onChange={(e) => setAssetId(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Current: {selectedBalance?.asset?.name || 'Unknown'}</p>
            </div>
            <div>
              <Label htmlFor="adjustAmount">Amount (use negative for deduction)</Label>
              <Input
                id="adjustAmount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100 or -50"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="adjustReason">Reason</Label>
              <Textarea
                id="adjustReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for adjustment..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleAdjustCredits} disabled={!amount || !reason}>
              <DollarSign className="mr-2 h-4 w-4" />
              Adjust Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Bonus Credits Dialog */}
      <Dialog open={dialogType === 'grant'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Bonus Credits (GOD Only)</DialogTitle>
            <DialogDescription>
              User ID: {selectedBalance?.userId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="grantAssetId">Asset ID</Label>
              <Input
                id="grantAssetId"
                type="number"
                min="1"
                value={assetId}
                onChange={(e) => setAssetId(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Current: {selectedBalance?.asset?.name || 'Unknown'}</p>
            </div>
            <div>
              <Label htmlFor="grantAmount">Amount</Label>
              <Input
                id="grantAmount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="grantReason">Reason</Label>
              <Textarea
                id="grantReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for bonus grant..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleGrantCredits} disabled={!amount || !reason}>
              <Gift className="mr-2 h-4 w-4" />
              Grant Bonus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
