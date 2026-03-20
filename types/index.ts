import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "manager" | "viewer";

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date | Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  description?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export type MovementType = "in" | "out" | "adjustment";

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  note?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
}
