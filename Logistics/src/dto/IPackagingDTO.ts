import { numberFilterSchema, paginationQuerySchema, stringFilterSchema } from './Pagination';
import { z } from 'zod';

export default interface PackagingDTO {
  id: string;
  xposition: number;
  yposition: number;
  zposition: number;
  loadingTime: number;
  withdrawingTime: number;
  deliveryId: string;
}

export type ICreatePackagingDTO = Omit<
  PackagingDTO,
  'createdAt' | 'updatedAt' | 'loadingTime' | 'withdrawingTime' | 'id'
>;
export type UpdatePackagingDTO = Omit<
  PackagingDTO,
  'createdAt' | 'updatedAt' | 'loadingTime' | 'withdrawingTime' | 'id' | 'deliveryId'
>;

export type GetPackagingDTO = Omit<PackagingDTO, 'createdAt' | 'updatedAt'>;

export const packagingPaginatedQuerySchema = paginationQuerySchema
  .extend({
    deliveryId: stringFilterSchema,
    loadingTime: numberFilterSchema,
    withdrawingTime: numberFilterSchema,
  })
  .strip();

export type IPackagingPaginationQuery = z.infer<typeof packagingPaginatedQuerySchema>;
