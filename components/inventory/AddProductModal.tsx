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
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function AddProductModal() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await addDoc(collection(db, "products"), {
        ...data,
        categoryId: "",
        createdAt: new Date(),
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
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} />
              {errors && (
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
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} />
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
