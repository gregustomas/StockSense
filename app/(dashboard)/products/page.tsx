"use client";

import { AddMovementModal } from "@/components/inventory/AddMovementModal";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { EditProductModal } from "@/components/inventory/EditProductModal";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { ProductDetailModal } from "@/components/inventory/ProductDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useRole } from "@/hooks/useRole";
import { db } from "@/lib/firebase";
import { getCategoryName, timestampToDate } from "@/lib/utils";
import { deleteDoc, doc } from "firebase/firestore";
import { ArrowUpDown, Edit, Plus, Trash, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const { canEdit } = useRole();
  const { categories } = useCategories();

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    sort: "newest",
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(s) ||
          product.sku.toLowerCase().includes(s),
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (product) => product.categoryId === filters.category,
      );
    }

    if (filters.status != "all") {
      result = result.filter((product) => {
        const isLow = product.quantity <= product.minQuantity;
        return filters.status === "low" ? isLow : !isLow;
      });
    }

    result.sort((a, b) => {
      const dateA: Date = timestampToDate(a.createdAt);
      const dateB: Date = timestampToDate(b.createdAt);

      if (filters.sort === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    return result;
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({ search: "", category: "all", status: "all", sort: "newest" });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-muted-foreground text-sm">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        {canEdit && <AddProductModal />}
      </div>

      <InventoryFilters
        onFilterChange={setFilters}
        onFilterReset={resetFilters}
        activeFilters={filters}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Min Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            {canEdit && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No products yet
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No products match your filters
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductDetailModal product={product} />
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.minQuantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>
                  {getCategoryName(categories, product.categoryId)}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {canEdit && (
                    <div className="flex gap-2">
                      <AddMovementModal
                        productId={product.id}
                        size="sm"
                        icon={ArrowUpDown}
                      />
                      <EditProductModal product={product} icon={Edit} />
                      <ConfirmDialog
                        onConfirm={() => handleDelete(product.id)}
                        description="This will permanently delete the product."
                      >
                        <Button variant="destructive" size="sm">
                          <Trash2 />
                        </Button>
                      </ConfirmDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
