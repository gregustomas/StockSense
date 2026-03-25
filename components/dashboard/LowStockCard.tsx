"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";

const PER_PAGE = 3;

interface LowStockCardProps {
  products: Product[];
}

export function LowStockCard({ products }: LowStockCardProps) {
  const [page, setPage] = useState(0);

  const lowStock = useMemo(
    () => products.filter((p) => p.quantity <= p.minQuantity),
    [products],
  );

  const paginated = useMemo(
    () => lowStock.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
    [lowStock, page],
  );

  const totalPages = Math.ceil(lowStock.length / PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {lowStock.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            All products are sufficiently stocked.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {paginated.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {product.quantity} / {product.minQuantity}
                  </Badge>
                </div>
              ))}
            </div>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
