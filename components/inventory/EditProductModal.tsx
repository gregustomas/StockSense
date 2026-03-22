"use client";

import { ProductFormData, productSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types";

interface EditProductModalProps {
  product: Product;
}

export function EditProductModal({ product }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      minQuantity: product.minQuantity,
      unit: product.unit,
      categoryId: product.categoryId,
      description: product.description ?? "",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        ...data,
        updatedAt: new Date(),
      });

      reset();
      setOpen(false);
    } catch {
      console.error("Failed to add product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Edit Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel>SKU</FieldLabel>
              <Input {...register("sku")} />
              {errors.sku && (
                <p className="text-red-500 text-sm">{errors.sku.message}</p>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Quantity</FieldLabel>
                <Input type="number" {...register("quantity")} />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel>Min Quantity</FieldLabel>
                <Input type="number" {...register("minQuantity")} />
                {errors.minQuantity && (
                  <p className="text-red-500 text-sm">
                    {errors.minQuantity.message}
                  </p>
                )}
              </Field>
            </div>
            <Field>
              <FieldLabel>Unit</FieldLabel>
              <Input {...register("unit")} placeholder="pcs, kg, l..." />
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                defaultValue={product.categoryId}
                onValueChange={(val) => setValue("categoryId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} />
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
