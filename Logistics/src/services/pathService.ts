import { Service, Inject } from 'typedi';
import config from '../../config';
import { Path } from '../domain/path/path';
import IPathRepo from '../services/IRepos/IPathRepo';
import IPathService from './IServices/IPathService';
import { Result } from '../core/logic/Result';
import { PathMap } from '../mappers/PathMap';
import { ICreatePathDTO, IGetPathDTO, IPathPaginationQuery, IUpdatePathDTO } from '../dto/IPathDTO';
import IWarehouseGateway from '../gateway/IGateway/IWarehouseGateway';
import ITruckRepo from './IRepos/ITruckRepo';
import { RecordResult } from '../dto/Pagination';
import { IAuthenticatedUser } from '../dto/IAuthDTO';

@Service()
export default class PathService implements IPathService {
  constructor(
    @Inject(config.repos.path.name) private pathRepo: IPathRepo,
    @Inject(config.repos.truck.name) private truckRepo: ITruckRepo,
    @Inject(config.gateway.warehouse.name) private warehouseGateway: IWarehouseGateway,
  ) {}

  async createPath(pathDTO: ICreatePathDTO, user: IAuthenticatedUser): Promise<Result<IGetPathDTO>> {
    try {
      const pathOrError = Path.create(pathDTO);
      if (pathOrError.isFailure) {
        return Result.fail<IGetPathDTO>(pathOrError.errorValue());
      }

      const pathResult = pathOrError.getValue();

      const truck = await this.truckRepo.findById(pathDTO.truckId);

      if (truck === null) {
        return Result.fail<IGetPathDTO>('Truck does not exist.');
      }

      const existingPath = await this.pathRepo.findUnique(
        pathDTO.truckId,
        pathDTO.startWarehouse,
        pathDTO.endWarehouse,
      );

      if (existingPath !== null) {
        return Result.fail<IGetPathDTO>('A path already exists between these warehouses for this truck.');
      }

      if (!(await this.warehouseGateway.checkWarehouse(pathResult.startWarehouse.value, user.token))) {
        return Result.fail<IGetPathDTO>('Starting warehouse does not exist.');
      }

      if (!(await this.warehouseGateway.checkWarehouse(pathResult.endWarehouse.value, user.token))) {
        return Result.fail<IGetPathDTO>('Ending warehouse does not exist.');
      }

      const path = await this.pathRepo.save(pathResult);
      const resultDTO = PathMap.toDTO(path);
      return Result.ok<IGetPathDTO>(resultDTO);
    } catch (e) {
      throw e;
    }
  }

  async updatePath(pathId: string, pathDto: IUpdatePathDTO, user: IAuthenticatedUser): Promise<Result<IGetPathDTO>> {
    try {
      const path = await this.pathRepo.findById(pathId);

      if (path === null) {
        return Result.fail<IGetPathDTO>('Path not found');
      } else {
        const pathOrError = Path.create(
          {
            truckId: pathDto.truckId ?? path.truckId.toString(),
            startWarehouse: pathDto.startWarehouse ?? path.startWarehouse.value,
            endWarehouse: pathDto.endWarehouse ?? path.endWarehouse.value,
            batteryConsumption: pathDto.batteryConsumption ?? path.batteryConsumption.value,
            distance: pathDto.distance ?? path.distance.value,
            time: pathDto.time ?? path.time.value,
          },
          path.id,
        );

        if (pathOrError.isFailure) {
          return Result.fail<IGetPathDTO>(pathOrError.errorValue());
        }

        const pathResult = pathOrError.getValue();

        if (!(await this.warehouseGateway.checkWarehouse(pathResult.startWarehouse.value, user.token))) {
          return Result.fail<IGetPathDTO>('Starting warehouse does not exist.');
        }

        if (!(await this.warehouseGateway.checkWarehouse(pathResult.endWarehouse.value, user.token))) {
          return Result.fail<IGetPathDTO>('Ending warehouse does not exist.');
        }

        const updatedPath = await this.pathRepo.save(pathResult);
        const resultDTO = PathMap.toDTO(updatedPath);
        return Result.ok<IGetPathDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  async getPath(pathId: string): Promise<Result<IGetPathDTO>> {
    try {
      const path = await this.pathRepo.findById(pathId);

      if (path === null) {
        return Result.fail<IGetPathDTO>('Path not found');
      } else {
        const resultDTO = PathMap.toDTO(path);
        return Result.ok<IGetPathDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  async getPaths(query: IPathPaginationQuery): Promise<Result<RecordResult<IGetPathDTO>>> {
    try {
      const paths = await this.pathRepo.findAll(query);

      const resultDTO = paths.records.map(item => PathMap.toDTO(item));
      return Result.ok<RecordResult<IGetPathDTO>>({ records: resultDTO, count: paths.count });
    } catch (e) {
      throw e;
    }
  }
}
