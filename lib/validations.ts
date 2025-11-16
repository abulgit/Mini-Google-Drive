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

// Type exports
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type FileUpdateInput = z.infer<typeof fileUpdateSchema>;
