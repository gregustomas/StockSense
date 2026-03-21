"use client";

import { AddCategoryModal } from "@/components/inventory/AddCategoryModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { useRole } from "@/hooks/useRole";

export default function SettingsPage() {
  const { categories, loading } = useCategories();
  const { isAdmin } = useRole();

  if (!isAdmin)
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Access denied.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <AddCategoryModal />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground">No categories yet</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between border rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
