import { Result } from '../../core/logic/Result';
import { ICreateTruckDTO, IGetTruckDTO, IUpdateTruckDTO } from '../../dto/ITruckDTO';

export default interface ITruckService {
  createTruck(truckDTO: ICreateTruckDTO): Promise<Result<IGetTruckDTO>>;
  updateTruck(truckId: string, truckDto: IUpdateTruckDTO): Promise<Result<IGetTruckDTO>>;
  getTruck(truckId: string): Promise<Result<IGetTruckDTO>>;
  getTrucks(): Promise<Result<IGetTruckDTO[]>>;
}
