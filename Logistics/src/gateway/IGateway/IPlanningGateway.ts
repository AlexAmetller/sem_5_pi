import { IGetPathDTO } from '../../dto/IPathDTO';
import { IGetTruckDTO } from '../../dto/ITruckDTO';
import { PlanningResponseDTO } from '../../dto/PlanningDTOs';
import { IDeliveryDTO, IWarehouseDTO } from '../../dto/WarehouseDTOs';

export default interface IPlanningGateway {
  generateSchedule(props: {
    origin: IWarehouseDTO;
    truck: IGetTruckDTO;
    deliveries: IDeliveryDTO[];
    paths: IGetPathDTO[];
  }): Promise<PlanningResponseDTO | null>;
}
