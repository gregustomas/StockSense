"use client";

import { MovementFormData, movementSchema } from "@/lib/validations";
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
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LucideIcon } from "lucide-react";
import { getProductName } from "@/lib/utils";
import { ProductCombobox } from "./ProductCombobox";

interface AddMovementModalProps {
  productId?: string;
  size?: "default" | "sm";
  icon?: LucideIcon;
  label?: string;
  className?: string;
}

export function AddMovementModal({
  productId,
  size,
  icon: Icon,
  label,
  className,
}: AddMovementModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { products } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: "in",
      productId: productId ?? "",
    },
  });

  const onSubmit = async (data: MovementFormData) => {
    try {
      // 0. validace
      if (data.type === "out") {
        const product = products.find((p) => p.id === data.productId);
        if (!product || product.quantity < data.quantity) {
          setError("quantity", {
            message: `Not enough stock. Available: ${product?.quantity ?? 0}`,
          });
          return;
        }
      }

      // 1. ulož pohyb do movements kolekce
      const batch = writeBatch(db);

      const quantityChange =
        data.type === "in" ? data.quantity : -data.quantity;

      const movementRef = collection(db, "movements");
      batch.set(doc(movementRef), {
        ...data,
        createdBy: user?.uid,
        createdAt: new Date(),
      });
      batch.update(doc(db, "products", data.productId), {
        quantity: increment(quantityChange),
        updatedAt: new Date(),
      });

      await batch.commit();

      reset();
      setOpen(false);
    } catch {
      console.error("Failed to add movement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} className={className}>
          {Icon && <Icon className="h-4 w-4" />}
          {label && <span>{label}</span>}
          {!label && !Icon && "Add Movement"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Product</FieldLabel>
              {productId ? (
                <Input value={getProductName(products, productId)} disabled />
              ) : (
                <ProductCombobox
                  products={products}
                  value={watch("productId")}
                  onChange={(val) => setValue("productId", val)}
                />
              )}

              {errors.productId && (
                <p className="text-red-500 text-sm">
                  {errors.productId.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                defaultValue="in"
                onValueChange={(val) =>
                  setValue("type", val as "in" | "out" | "adjustment")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                  {/* <SelectItem value="adjustment">Adjustment</SelectItem> */}
                </SelectContent>
              </Select>
            </Field>
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
              <FieldLabel>Note</FieldLabel>
              <Input {...register("note")} />
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Movement"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
