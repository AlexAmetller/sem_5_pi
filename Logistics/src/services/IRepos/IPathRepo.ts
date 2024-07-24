import { Repo } from '../../core/infra/Repo';
import { Path } from '../../domain/path/path';
import { IPathPaginationQuery } from '../../dto/IPathDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IPathRepo extends Repo<Path> {
  save(user: Path): Promise<Path>;
  findById(id: string): Promise<Path>;
  findAll(query: IPathPaginationQuery): Promise<RecordResult<Path>>;
  findUnique(truckId: string, startWarehouse: string, endWarehouse: string): Promise<Path>;
  findByTruck(truckId: string): Promise<Path[]>;
}
