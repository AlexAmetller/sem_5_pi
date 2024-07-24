import { ITruckPersistence } from './ITruckPersistence';

export interface ISchedulePersistence {
  domainId: string;
  totalTime: number;
  deliveryIds: string[];
  truck: ITruckPersistence;
  truckId: string;
  originWarehouseId: string;
  date: Date;
}
