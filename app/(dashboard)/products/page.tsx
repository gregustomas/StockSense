"use client";

import { AddProductModal } from "@/components/inventory/AddProductModal";
import { EditProductModal } from "@/components/inventory/EditProductModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getCategoryName } from "@/lib/utils";
import { deleteDoc, doc } from "firebase/firestore";

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const { canEdit } = useRole();
  const { categories } = useCategories();

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
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
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
                      <EditProductModal product={product} />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
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
