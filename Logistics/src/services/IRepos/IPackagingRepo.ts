import { Repo } from '../../core/infra/Repo';
import { Packaging } from '../../domain/packaging/packaging';
import { IPackagingPaginationQuery } from '../../dto/IPackagingDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IPackagingRepo extends Repo<Packaging> {
  save(user: Packaging): Promise<Packaging>;
  findById(id: string): Promise<Packaging>;
  findAll(query: IPackagingPaginationQuery): Promise<RecordResult<Packaging>>;
}
