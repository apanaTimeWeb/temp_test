import { z } from "zod";

export const AdminSeatMatrixLockerApiSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().int().safe().nonnegative()]).transform(String).optional(),
  lockerNumber: z.string().trim().min(1),
  isActive: z.boolean(),
}).passthrough();

export const AdminSeatMatrixSeatApiSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().int().safe().nonnegative()]).transform(String).optional(),
  seatNumber: z.string().trim().min(1),
  isActive: z.boolean(),
  status: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  student: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  smartId: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  phone: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  shift: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  plan: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  locker: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  validFrom: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
  expiry: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().optional()),
}).passthrough();

export const AdminSeatMatrixLockerListSchema = z.array(AdminSeatMatrixLockerApiSchema);
export const AdminSeatMatrixSeatListSchema = z.array(AdminSeatMatrixSeatApiSchema);
