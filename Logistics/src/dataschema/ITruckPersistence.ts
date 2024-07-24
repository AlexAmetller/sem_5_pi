export interface ITruckPersistence {
  domainId: string;
  tare: number;
  maxWeight: number;
  maxCharge: number;
  range: number;
  chargingTime: number;
  enabled: boolean;
}
