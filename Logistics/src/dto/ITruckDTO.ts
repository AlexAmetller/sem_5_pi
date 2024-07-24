export default interface ITruckDTO {
  id: string;
  tare: number;
  maxWeight: number;
  maxCharge: number;
  range: number;
  chargingTime: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ICreateTruckDTO = Omit<ITruckDTO, 'createdAt' | 'updatedAt' | 'enabled'>;
export type IUpdateTruckDTO = Partial<Omit<ITruckDTO, 'createdAt' | 'updatedAt' | 'id'>>;
export type IGetTruckDTO = Omit<ITruckDTO, 'createdAt' | 'updatedAt'>;
