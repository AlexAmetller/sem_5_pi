import { Result } from '../../core/logic/Result';
import { IAuthenticatedUser } from '../../dto/IAuthDTO';
import {
  ICreatePackagingDTO,
  GetPackagingDTO,
  UpdatePackagingDTO,
  IPackagingPaginationQuery,
} from '../../dto/IPackagingDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IPackagingService {
  createPackaging(packagingDTO: ICreatePackagingDTO, user: IAuthenticatedUser): Promise<Result<GetPackagingDTO>>;
  updatePackaging(packagingId: string, packagingDto: UpdatePackagingDTO): Promise<Result<GetPackagingDTO>>;
  getPackaging(packagingId: string): Promise<Result<GetPackagingDTO>>;
  getPackagings(query: IPackagingPaginationQuery): Promise<Result<RecordResult<GetPackagingDTO>>>;
}
