"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDate, getProductName, timestampToDate } from "@/lib/utils";

export default function Dashboard() {
  const { products } = useProducts();
  const { movements } = useMovements();

  const lowStockCount = products.filter(
    (p) => p.quantity <= p.minQuantity,
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const movementsToday = movements.filter((m) => {
    const date = timestampToDate(m.createdAt);
    return date >= today;
  }).length;

  const recentMovements = movements.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movements Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{movementsToday}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
        </CardHeader>
        <CardContent>
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
              {recentMovements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No movements yet
                  </TableCell>
                </TableRow>
              ) : (
                recentMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {getProductName(products, movement.productId)}
                    </TableCell>
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
                    <TableCell>{formatDate(movement.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
