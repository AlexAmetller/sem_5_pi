/* eslint-disable @typescript-eslint/camelcase */
import { Service } from 'typedi';
import axios from 'axios';
import config from '../../config';
import Logger from '../loaders/logger';
import IPlanningGateway from './IGateway/IPlanningGateway';
import { PlanningResponseDTO } from '../dto/PlanningDTOs';
import { IWarehouseDTO, IDeliveryDTO } from '../dto/WarehouseDTOs';
import { IGetTruckDTO } from '../dto/ITruckDTO';
import { IGetPathDTO } from '../dto/IPathDTO';

@Service()
export default class PlanningGateway implements IPlanningGateway {
  public async generateSchedule({
    origin,
    truck,
    deliveries,
    paths,
  }: {
    origin: IWarehouseDTO;
    truck: IGetTruckDTO;
    deliveries: IDeliveryDTO[];
    paths: IGetPathDTO[];
  }): Promise<PlanningResponseDTO | null> {
    try {
      const warehouses = deliveries.map(delivery => delivery.destinationWarehouse);
      const body = {
        origem: origin.code,
        armazens: warehouses.map(w => ({ nome: w.description, id: w.code })),
        camiao: {
          nome: truck.id,
          tara: truck.tare,
          capacidade_carga: truck.maxWeight,
          carga_total_baterias: truck.maxCharge,
          autonomia: truck.range,
          tempo_recarga: truck.chargingTime,
        },
        entregas: deliveries.map(d => ({
          id: d.code,
          data: d.date,
          massa: d.mass,
          armazem: d.destinationWarehouse.code,
          tempo_colocacao: d.loadingTime,
          tempo_retirada: d.withdrawingTime,
        })),
        caminhos: paths.map(p => ({
          camiao: truck.id,
          origem: p.startWarehouse,
          destino: p.endWarehouse,
          tempo: p.time,
          energia: p.batteryConsumption,
        })),
      };
      const url = `${config.gateway.planning.url}/schedule`;
      const result = await axios.post<PlanningResponseDTO>(url, body, {
        validateStatus: function(status) {
          return status === 200 || status === 500;
        },
      });
      if (result.status !== 200) return null;
      return result.data;
    } catch (err) {
      Logger.error('Planning Gateway - %o', err.message);
      throw err;
    }
  }
}
