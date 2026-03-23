"use client";

import { useCategories } from "@/hooks/useCategories";
import { useMovements } from "@/hooks/useMovements";
import { Product } from "@/types";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { formatDate, getCategoryName } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProductDetailModalProps {
  product: Product;
}

const ITEMS_PER_PAGE = 5;

export function ProductDetailModal({ product }: ProductDetailModalProps) {
  const { movements } = useMovements();
  const { categories } = useCategories();
  const [page, setPage] = useState(0);

  const productMovements = useMemo(
    () => movements.filter((m) => m.productId === product.id),
    [movements, product.id],
  );

  const totalPages = Math.ceil(productMovements.length / ITEMS_PER_PAGE);

  const paginatedMovements = useMemo(
    () =>
      productMovements.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE,
      ),
    [productMovements, page],
  );

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer font-semibold">
        {product.name}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">
                {getCategoryName(categories, product.categoryId)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">
                {product.quantity} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Min Quantity</p>
              <p className="font-medium">
                {product.minQuantity} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={
                  product.quantity <= product.minQuantity
                    ? "destructive"
                    : "default"
                }
              >
                {product.quantity <= product.minQuantity
                  ? "Low Stock"
                  : "In Stock"}
              </Badge>
            </div>
            {product.description && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{product.description}</p>
              </div>
            )}
          </div>

          {/* Movement History */}
          <div>
            <h3 className="font-semibold mb-3">
              Movement History ({productMovements.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productMovements.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No movements yet
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "in"
                              ? "default"
                              : movement.type === "out"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {movement.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {movement.type === "out" ? "-" : "+"}
                        {movement.quantity}
                      </TableCell>
                      <TableCell>{movement.note ?? "-"}</TableCell>
                      <TableCell>{formatDate(movement.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
