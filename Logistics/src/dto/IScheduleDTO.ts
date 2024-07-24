import { IGetTruckDTO } from './ITruckDTO';
import { dateFilterSchema, numberFilterSchema, paginationQuerySchema, stringFilterSchema } from './Pagination';
import { IDeliveryDTO, IWarehouseDTO } from './WarehouseDTOs';
import { z } from 'zod';

export interface ICreateScheduleDTO {
  originWarehouseId: string;
  truckId: string;
  deliveryIds: string[];
}

export interface IGetScheduleDTO {
  id: string;
  truck: IGetTruckDTO;
  originWarehouse: IWarehouseDTO;
  deliveries: IDeliveryDTO[];
  date: Date;
  totalTime: number;
}

export const schedulePaginatedQuerySchema = paginationQuerySchema
  .extend({
    truckId: stringFilterSchema,
    originWarehouseId: stringFilterSchema,
    totalTime: numberFilterSchema,
    date: dateFilterSchema,
  })
  .strip();

export type ISchedulePaginationQuery = z.infer<typeof schedulePaginatedQuerySchema>;
