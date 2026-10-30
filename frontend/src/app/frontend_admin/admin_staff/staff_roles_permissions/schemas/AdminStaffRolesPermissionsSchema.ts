import { z } from 'zod';
const nonBlank = z.string().trim().min(1);
export const AdminStaffRolesPermissionsApiResponseSchema=z.array(z.object({module:nonBlank,actions:z.array(z.object({label:nonBlank,key:nonBlank,roles:z.record(z.boolean()).refine((roles)=>Object.keys(roles).length>0,'At least one role must be defined')}))}));
