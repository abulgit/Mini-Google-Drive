import { z } from "zod";

// File validation schemas
export const fileUploadSchema = z.object({
  originalFileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z
    .number()
    .positive("File size must be positive")
    .max(100 * 1024 * 1024, "File size exceeds 100MB"),
  blobUrl: z.string().url("Invalid blob URL"),
});

export const fileUpdateSchema = z
  .object({
    starred: z.boolean().optional(),
    originalFileName: z.string().min(1).max(255).optional(),
  })
  .refine(
    data => data.starred !== undefined || data.originalFileName !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

export const fileIdSchema = z.object({
  id: z.string().min(1, "File ID is required"),
});

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Storage validation
export const storageQuotaSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const fileFilterSchema = z.object({
  starred: z.coerce.boolean().optional(),
  deleted: z.coerce.boolean().optional(),
  fileType: z.string().optional(),
});

// Type exports
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type FileUpdateInput = z.infer<typeof fileUpdateSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FileFilterInput = z.infer<typeof fileFilterSchema>;
