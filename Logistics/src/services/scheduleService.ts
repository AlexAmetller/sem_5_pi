import { Service, Inject } from 'typedi';
import config from '../../config';
import { Schedule } from '../domain/schedule/schedule';
import { ICreateScheduleDTO, IGetScheduleDTO, ISchedulePaginationQuery } from '../dto/IScheduleDTO';
import IScheduleRepo from '../services/IRepos/IScheduleRepo';
import IScheduleService from './IServices/IScheduleService';
import { Result } from '../core/logic/Result';
import { ScheduleMap } from '../mappers/ScheduleMap';
import IPlanningGateway from '../gateway/IGateway/IPlanningGateway';
import ITruckRepo from './IRepos/ITruckRepo';
import { TruckMap } from '../mappers/TruckMap';
import IWarehouseGateway from '../gateway/IGateway/IWarehouseGateway';
import IPathRepo from './IRepos/IPathRepo';
import { PathMap } from '../mappers/PathMap';
import { RecordResult } from '../dto/Pagination';
import { IAuthenticatedUser } from '../dto/IAuthDTO';

@Service()
export default class ScheduleService implements IScheduleService {
  constructor(
    @Inject(config.repos.schedule.name) private scheduleRepo: IScheduleRepo,
    @Inject(config.repos.truck.name) private truckRepo: ITruckRepo,
    @Inject(config.repos.path.name) private pathRepo: IPathRepo,
    @Inject(config.gateway.planning.name) private planningGateway: IPlanningGateway,
    @Inject(config.gateway.warehouse.name) private warehouseGateway: IWarehouseGateway,
  ) {}

  public async createSchedule(
    scheduleDTO: ICreateScheduleDTO,
    user: IAuthenticatedUser,
  ): Promise<Result<IGetScheduleDTO>> {
    try {
      const truck = await this.truckRepo.findById(scheduleDTO.truckId);
      if (truck === null) return Result.fail<IGetScheduleDTO>('Truck not found.');
      if (!truck.enabled) return Result.fail<IGetScheduleDTO>('Truck is disabled.');
      const truckDTO = TruckMap.toDTO(truck);

      const paths = await this.pathRepo.findByTruck(scheduleDTO.truckId);
      if (paths === null) return Result.fail<IGetScheduleDTO>('No path found.');
      const pathDTOs = paths.map(p => PathMap.toDTO(p));

      if (scheduleDTO.deliveryIds.length < 1) {
        return Result.fail<IGetScheduleDTO>('At least one delivery must be specified.');
      }

      const scheduleData = await this.fetchScheduleData(
        scheduleDTO.originWarehouseId,
        scheduleDTO.deliveryIds,
        user.token,
      );

      if (scheduleData.error !== null) return Result.fail<IGetScheduleDTO>(scheduleData.error);

      const dates = scheduleData.deliveries.map(delivery => new Date(delivery.date).getDay());
      const isSameDate = dates.every((val, _, arr) => val === arr[0]);
      if (!isSameDate) {
        return Result.fail<IGetScheduleDTO>('Not all deliveries are for the same day');
      }

      const isDeliveryToOrigin = scheduleData.deliveries.some(
        delivery => delivery.destinationWarehouse.code === scheduleDTO.originWarehouseId,
      );
      if (isDeliveryToOrigin) {
        return Result.fail<IGetScheduleDTO>('Deliveries cannot be intended to origin warehouse');
      }

      const planningResponse = await this.planningGateway.generateSchedule({
        origin: scheduleData.warehouse,
        truck: truckDTO,
        deliveries: scheduleData.deliveries,
        paths: pathDTOs,
      });

      if (!planningResponse) return Result.fail<IGetScheduleDTO>('Unable to find a schedule solution.');

      const deliveryOrder = planningResponse.trajeto
        .slice(1, -1)
        .map(warehouseId =>
          scheduleData.deliveries.find(delivery => delivery.destinationWarehouse.code === warehouseId),
        )
        .map(dto => dto.code);

      const scheduleOrError = Schedule.create({
        truck,
        deliveryIds: deliveryOrder,
        totalTime: planningResponse.tempo,
        originWarehouseId: scheduleDTO.originWarehouseId,
        date: scheduleData.deliveries[0].date,
      });

      if (scheduleOrError.isFailure) {
        return Result.fail<IGetScheduleDTO>(scheduleOrError.errorValue());
      }

      const scheduleResult = scheduleOrError.getValue();

      const schedule = await this.scheduleRepo.save(scheduleResult);

      const resultDTO = ScheduleMap.toDTO(schedule, scheduleData.deliveries, scheduleData.warehouse);

      return Result.ok<IGetScheduleDTO>(resultDTO);
    } catch (e) {
      throw e;
    }
  }

  public async getSchedule(scheduleId: string, user: IAuthenticatedUser): Promise<Result<IGetScheduleDTO>> {
    const schedule = await this.scheduleRepo.findById(scheduleId);

    if (schedule === null) return Result.fail<IGetScheduleDTO>('Schedule not found.');

    const scheduleData = await this.fetchScheduleData(
      schedule.originWarehouseId.value,
      schedule.deliveryIds.map(id => id.value),
      user.token,
    );

    if (scheduleData.error) Result.fail<IGetScheduleDTO>(scheduleData.error);

    const scheduleDTO = ScheduleMap.toDTO(schedule, scheduleData.deliveries, scheduleData.warehouse);

    return Result.ok<IGetScheduleDTO>(scheduleDTO);
  }

  public async getSchedules(
    query: ISchedulePaginationQuery,
    user: IAuthenticatedUser,
  ): Promise<Result<RecordResult<IGetScheduleDTO>>> {
    const schedules = await this.scheduleRepo.findAll(query);

    const resultDTO = (
      await Promise.all(
        schedules.records.map(async schedule => {
          const data = await this.fetchScheduleData(
            schedule.originWarehouseId.value,
            schedule.deliveryIds.map(id => id.value),
            user.token,
          );
          if (data.error) return null;
          return ScheduleMap.toDTO(schedule, data.deliveries, data.warehouse);
        }),
      )
    ).filter(dto => dto !== null);

    return Result.ok<RecordResult<IGetScheduleDTO>>({ records: resultDTO, count: schedules.count });
  }

  private async fetchScheduleData(originWarehouseId: string, deliveryIds: string[], token: string) {
    const warehouseDTO = await this.warehouseGateway.getWarehouse(originWarehouseId, token);

    const deliveryDTOs = await Promise.all(
      deliveryIds.map(async id => await this.warehouseGateway.getDelivery(id, token)),
    );

    const failedRequests = deliveryDTOs.filter(delivery => delivery === null);

    const error = !warehouseDTO
      ? `Warehouse not found ${originWarehouseId}`
      : failedRequests.length > 0
      ? `Deliveries not found.`
      : null;

    return {
      error,
      deliveries: deliveryDTOs,
      warehouse: warehouseDTO,
    };
  }
}
