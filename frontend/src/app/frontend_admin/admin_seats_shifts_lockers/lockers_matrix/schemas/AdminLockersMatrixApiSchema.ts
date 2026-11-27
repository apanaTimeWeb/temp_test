import { z } from "zod";

export const AdminLockersLockerApiSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().int().safe().nonnegative()]).transform(String).optional(),
  lockerNumber: z.string().trim().min(1),
  isActive: z.boolean(),
}).passthrough();

export const AdminLockersLockerListSchema = z.array(AdminLockersLockerApiSchema);
