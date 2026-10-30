import { z } from "zod";

export const AdminLockersLockerApiSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().int().safe().nonnegative()]).transform(String).optional(),
  lockerNumber: z.string().trim().min(1),
  isActive: z.boolean(),
}).passthrough();

export const AdminLockersSeatApiSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().int().safe().nonnegative()]).transform(String).optional(),
  seatNumber: z.string().trim().min(1),
  isActive: z.boolean(),
  status: z.string().optional(),
  student: z.string().optional(),
  smartId: z.string().optional(),
  phone: z.string().optional(),
  shift: z.string().optional(),
  plan: z.string().optional(),
  locker: z.string().optional(),
  validFrom: z.string().optional(),
  expiry: z.string().optional(),
}).passthrough();

export const AdminLockersLockerListSchema = z.array(AdminLockersLockerApiSchema);
export const AdminLockersSeatListSchema = z.array(AdminLockersSeatApiSchema);
