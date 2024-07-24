import { Result } from '../../core/logic/Result';
import { IAuthenticatedUser } from '../../dto/IAuthDTO';
import { ICreatePathDTO, IGetPathDTO, IPathPaginationQuery, IUpdatePathDTO } from '../../dto/IPathDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IPathService {
  createPath(pathDTO: ICreatePathDTO, user: IAuthenticatedUser): Promise<Result<IGetPathDTO>>;
  updatePath(pathId: string, truckDto: IUpdatePathDTO, user: IAuthenticatedUser): Promise<Result<IGetPathDTO>>;
  getPath(pathId: string): Promise<Result<IGetPathDTO>>;
  getPaths(query: IPathPaginationQuery): Promise<Result<RecordResult<IGetPathDTO>>>;
}
