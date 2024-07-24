import { Service, Inject } from 'typedi';
import config from '../../config';
import { Packaging } from '../domain/packaging/packaging';
import {
  ICreatePackagingDTO,
  GetPackagingDTO,
  UpdatePackagingDTO,
  IPackagingPaginationQuery,
} from '../dto/IPackagingDTO';
import IPackagingRepo from '../services/IRepos/IPackagingRepo';
import IPackagingService from './IServices/IPackagingService';
import { Result } from '../core/logic/Result';
import { PackagingMap } from '../mappers/PackagingMap';
import IWarehouseGateway from '../gateway/IGateway/IWarehouseGateway';
import { RecordResult } from '../dto/Pagination';
import { IAuthenticatedUser } from '../dto/IAuthDTO';

@Service()
export default class PackagingService implements IPackagingService {
  constructor(
    @Inject(config.repos.packaging.name) private packagingRepo: IPackagingRepo,
    @Inject(config.gateway.warehouse.name) private warehouseGateway: IWarehouseGateway,
  ) {}

  async getPackaging(packagingId: string): Promise<Result<GetPackagingDTO>> {
    try {
      const packaging = await this.packagingRepo.findById(packagingId);

      if (packaging === null) {
        return Result.fail<GetPackagingDTO>('packaging not found');
      } else {
        const resultDTO = PackagingMap.toDTO(packaging);
        return Result.ok<GetPackagingDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  async getPackagings(query: IPackagingPaginationQuery): Promise<Result<RecordResult<GetPackagingDTO>>> {
    try {
      const packagings = await this.packagingRepo.findAll(query);

      const resultDTO = packagings.records.map(item => PackagingMap.toDTO(item));
      return Result.ok<RecordResult<GetPackagingDTO>>({ records: resultDTO, count: packagings.count });
    } catch (e) {
      throw e;
    }
  }

  public async createPackaging(
    packagingDTO: ICreatePackagingDTO,
    user: IAuthenticatedUser,
  ): Promise<Result<GetPackagingDTO>> {
    try {
      const deliveryDTO = await this.warehouseGateway.getDelivery(packagingDTO.deliveryId, user.token);

      if (!deliveryDTO) {
        return Result.fail<GetPackagingDTO>('Delivery does not exist');
      }

      const packagingOrError = Packaging.create({
        xposition: packagingDTO.xposition,
        yposition: packagingDTO.yposition,
        zposition: packagingDTO.zposition,
        loadingTime: deliveryDTO.loadingTime,
        withdrawingTime: deliveryDTO.withdrawingTime,
        deliveryId: packagingDTO.deliveryId,
      });

      if (packagingOrError.isFailure) {
        return Result.fail<GetPackagingDTO>(packagingOrError.errorValue());
      }

      const packagingResult = packagingOrError.getValue();
      const packaging = await this.packagingRepo.save(packagingResult);
      const resultDTO = PackagingMap.toDTO(packaging);
      return Result.ok<GetPackagingDTO>(resultDTO);
    } catch (e) {
      throw e;
    }
  }

  async updatePackaging(packagingId: string, packagingDTO: UpdatePackagingDTO): Promise<Result<GetPackagingDTO>> {
    try {
      const packaging = await this.packagingRepo.findById(packagingId);

      if (packaging === null) {
        return Result.fail<GetPackagingDTO>('Packaging not found');
      } else {
        const PackagingOrError = Packaging.create(
          {
            xposition: packagingDTO.xposition ?? packaging.xposition.value,
            yposition: packagingDTO.yposition ?? packaging.yposition.value,
            zposition: packagingDTO.zposition ?? packaging.zposition.value,
            loadingTime: packaging.loadingTime.value,
            withdrawingTime: packaging.withdrawingTime.value,
            deliveryId: packaging.deliveryId.value,
          },
          packaging.id,
        );

        if (PackagingOrError.isFailure) {
          return Result.fail<GetPackagingDTO>(PackagingOrError.errorValue());
        }

        const packagingResult = PackagingOrError.getValue();
        const updatedPackaging = await this.packagingRepo.save(packagingResult);
        const resultDTO = PackagingMap.toDTO(updatedPackaging);
        return Result.ok<GetPackagingDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }
}
