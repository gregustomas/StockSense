"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, StockMovement } from "@/types";
import { formatDate, getProductName, timestampToDate } from "@/lib/utils";
import { ProductDetailModal } from "@/components/inventory/ProductDetailModal";

const PER_PAGE = 5;

interface RecentMovementsCardProps {
  movements: StockMovement[];
  products: Product[];
}

export function RecentMovementsCard({
  movements,
  products,
}: RecentMovementsCardProps) {
  const [page, setPage] = useState(0);

  // pohyby za posledních 7 dní
  const recentMovements = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    return movements.filter((m) => timestampToDate(m.createdAt) >= weekAgo);
  }, [movements]);

  const paginated = useMemo(
    () => recentMovements.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
    [recentMovements, page],
  );

  const totalPages = Math.ceil(recentMovements.length / PER_PAGE);

  const getProduct = (productId: string) =>
    products.find((p) => p.id === productId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Movements — Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No movements in the last 7 days
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    {getProduct(movement.productId) ? (
                      <ProductDetailModal
                        product={getProduct(movement.productId)!}
                      />
                    ) : (
                      getProductName(products, movement.productId)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        movement.type === "in" ? "default" : "destructive"
                      }
                    >
                      {movement.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {movement.type === "out" ? "-" : "+"}
                    {movement.quantity}
                  </TableCell>
                  <TableCell>{formatDate(movement.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {page + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
