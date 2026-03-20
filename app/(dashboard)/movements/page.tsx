"use client";

import { AddMovementModal } from "@/components/inventory/AddMovementModal";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMovements } from "@/hooks/useMovements";
import { useProducts } from "@/hooks/useProducts";
import { formatDate, getProductName } from "@/lib/utils";

export default function MovementsPage() {
  const { movements, loading } = useMovements();
  const { products } = useProducts();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Movements</h1>
        <AddMovementModal />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No movements yet
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  {getProductName(products, movement.productId)}
                </TableCell>
                <TableCell>{movement.type}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.note ?? "-"}</TableCell>
                <TableCell>{formatDate(movement.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
