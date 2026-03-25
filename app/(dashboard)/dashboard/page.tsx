"use client";

import { LowStockCard } from "@/components/dashboard/LowStockCard";
import { MovementsChart } from "@/components/dashboard/MovementsChart";
import { RecentMovementsCard } from "@/components/dashboard/RecentMovementsCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AddMovementModal } from "@/components/inventory/AddMovementModal";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMovements } from "@/hooks/useMovements";
import { useProducts } from "@/hooks/useProducts";
import { useRole } from "@/hooks/useRole";
import { timestampToDate } from "@/lib/utils";

export default function Dashboard() {
  const { products } = useProducts();
  const { movements } = useMovements();
  const { canEdit } = useRole();

  const lowStockCount = products.filter(
    (p) => p.quantity <= p.minQuantity,
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const movementsToday = movements.filter((m) => {
    const date = timestampToDate(m.createdAt);
    return date >= today;
  }).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <StatsCards
        cards={[
          { title: "Total Products", value: products.length },
          {
            title: "Low Stock",
            value: lowStockCount,
            className: lowStockCount > 0 ? "text-destructive" : "",
          },
          { title: "Movements Today", value: movementsToday },
        ]}
      />

      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <AddProductModal />
            <AddMovementModal />
          </CardContent>
        </Card>
      )}

      <RecentMovementsCard products={products} movements={movements} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LowStockCard products={products} />
        <MovementsChart movements={movements} />
      </div>
    </div>
  );
}
