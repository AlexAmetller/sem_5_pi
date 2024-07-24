import { Service } from 'typedi';
import axios from 'axios';
import config from '../../config';
import Logger from '../loaders/logger';
import IWarehouseGateway from './IGateway/IWarehouseGateway';
import { IDeliveryDTO, IWarehouseDTO } from '../dto/WarehouseDTOs';

@Service()
export default class WarehouseGateway implements IWarehouseGateway {
  /**
   * Tests wether warehouse exists
   */
  public async checkWarehouse(code: string, token: string) {
    return (await this.getWarehouse(code, token)) === null ? false : true;
  }

  /**
   * Returns Delivery
   */
  public async getDelivery(code: string, token: string): Promise<IDeliveryDTO | null> {
    try {
      const url = `${config.gateway.warehouse.url}/delivery/${code}`;
      const result = await axios.get<IDeliveryDTO>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: function(status) {
          return status < 500;
        },
      });
      if (result.status === 200) {
        return result.data;
      }
      return null;
    } catch (err) {
      Logger.error('Warehouse Gateway - %o', err.message);
      throw err;
    }
  }

  /**
   * Returns Warehouse
   */
  public async getWarehouse(code: string, token: string): Promise<IWarehouseDTO | null> {
    try {
      const url = `${config.gateway.warehouse.url}/warehouse/${code}`;
      const result = await axios.get<IWarehouseDTO>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: function(status) {
          return status < 500;
        },
      });
      if (result.status === 200) {
        return result.data;
      }
      return null;
    } catch (err) {
      Logger.error('Warehouse Gateway - %o', err.message);
      throw err;
    }
  }
}
