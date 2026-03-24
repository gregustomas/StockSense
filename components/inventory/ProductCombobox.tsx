"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/types";
import { useCategories } from "@/hooks/useCategories";

interface ProductComboboxProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
}

export function ProductCombobox({
  products,
  value,
  onChange,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();

  const selectedProduct = products.find((product) => product.id === value);

  const grouped = categories
    .map((category) => ({
      category,
      products: products.filter(
        (product) => product.categoryId === category.id,
      ),
    }))
    .filter((group) => group.products.length > 0);

  const uncategorized = products.filter(
    (product) =>
      !categories.find((category) => category.id === product.categoryId),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct ? selectedProduct.name : "Select product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search by name or SKU..." />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            {grouped.map(({ category, products }) => (
              <CommandGroup key={category.id} heading={category.name}>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.sku}`}
                    onSelect={() => {
                      onChange(product.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.sku}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {uncategorized.length > 0 && (
              <CommandGroup heading="Uncategorized">
                {uncategorized.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.sku}`}
                    onSelect={() => {
                      onChange(product.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.sku}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
