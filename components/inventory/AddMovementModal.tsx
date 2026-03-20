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
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
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

export function AddMovementModal() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { products } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: { type: "in" },
  });

  const onSubmit = async (data: MovementFormData) => {
    try {
      // 1. ulož pohyb do movements kolekce
      await addDoc(collection(db, "movements"), {
        ...data,
        createdBy: user?.uid ?? "",
        createdAt: new Date(),
      });

      // 2. aktualizuj quantity na produktu
      const productRef = doc(db, "products", data.productId);
      const quantityChange =
        data.type === "in"
          ? data.quantity
          : data.type === "out"
            ? -data.quantity
            : data.quantity; // adjustment nastaví absolutní hodnotu

      await updateDoc(productRef, {
        quantity: increment(quantityChange),
        updatedAt: new Date(),
      });

      reset();
      setOpen(false);
    } catch {
      console.error("Failed to add movement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Movement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Product</FieldLabel>
              <Select onValueChange={(val) => setValue("productId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="adjustment">Adjustment</SelectItem>
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
