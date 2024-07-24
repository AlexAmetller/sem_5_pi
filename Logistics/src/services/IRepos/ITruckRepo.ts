import { Repo } from '../../core/infra/Repo';
import { Truck } from '../../domain/truck/truck';

export default interface ITruckRepo extends Repo<Truck> {
  save(user: Truck): Promise<Truck>;
  findById(id: string, enabled?: boolean): Promise<Truck>;
  findAll(): Promise<Truck[]>;
}
