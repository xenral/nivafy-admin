/**
 * Wallet Balances Management Page
 * View and manage user wallet balances
 */

'use client';

import { useEffect, useState } from 'react';
import { walletService } from '@/lib/services';
import { Balance } from '@/types/services/wallet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function WalletsPage() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdSearch, setUserIdSearch] = useState('');

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
    </div>
  );
}
