import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
  minQuantity: z.coerce.number().min(0, "Min quantity must be 0 or more"),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
});

export const movementSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  type: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type MovementFormData = z.infer<typeof movementSchema>;
