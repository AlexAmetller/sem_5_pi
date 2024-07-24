import { IDeliveryDTO, IWarehouseDTO } from '../../dto/WarehouseDTOs';

export default interface IWarehouseGateway {
  checkWarehouse(code: string, token: string): Promise<boolean>;
  getDelivery(code: string, token: string): Promise<IDeliveryDTO | null>;
  getWarehouse(code: string, token: string): Promise<IWarehouseDTO | null>;
}
