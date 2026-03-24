"use client";

import { Search, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/useCategories";

export interface InventoryFilter {
  search: string;
  category: string;
  status: string;
  sort: string;
}

interface InventoryFiltersProps {
  activeFilters: InventoryFilter;
  onFilterChange: React.Dispatch<React.SetStateAction<InventoryFilter>>;
  onFilterReset: () => void;
}

export function InventoryFilters({
  onFilterChange,
  onFilterReset,
  activeFilters,
}: InventoryFiltersProps) {
  const { categories } = useCategories();

  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-card rounded-xl border shadow-sm">
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search SKU or name..."
          className="pl-9 bg-background w-full md:w-fit"
          value={activeFilters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row md:flex-row items-center gap-2">
        <Select
          value={activeFilters.category}
          onValueChange={(val) => updateFilter("category", val)}
        >
          <SelectTrigger className="w-full md:w-40 bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.status}
          onValueChange={(val) => updateFilter("status", val)}
        >
          <SelectTrigger className="w-full md:w-35 bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.sort}
          onValueChange={(val) => updateFilter("sort", val)}
        >
          <SelectTrigger className="w-full md:w-35 bg-background">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex shrink-0"
          title="Reset"
          onClick={onFilterReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="w-full md:hidden gap-2"
          onClick={onFilterReset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
