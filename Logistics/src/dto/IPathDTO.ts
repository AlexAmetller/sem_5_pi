import { z } from 'zod';
import { numberFilterSchema, paginationQuerySchema, stringFilterSchema } from './Pagination';

export default interface IPathDTO {
  id: string;
  truckId: string;
  startWarehouse: string;
  endWarehouse: string;
  distance: number;
  time: number;
  batteryConsumption: number;
}

export type ICreatePathDTO = IPathDTO;
export type IUpdatePathDTO = Partial<Omit<IPathDTO, 'id'>>;
export type IGetPathDTO = IPathDTO;

export const pathPaginatedQuerySchema = paginationQuerySchema
  .extend({
    truckId: stringFilterSchema,
    startWarehouse: stringFilterSchema,
    endWarehouse: stringFilterSchema,
    distance: numberFilterSchema,
    time: numberFilterSchema,
    batteryConsumption: numberFilterSchema,
  })
  .strip();

export type IPathPaginationQuery = z.infer<typeof pathPaginatedQuerySchema>;
