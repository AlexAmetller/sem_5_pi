/* eslint-disable @typescript-eslint/no-use-before-define */
import { Mapper } from '../core/infra/Mapper';
import { ISchedulePersistence } from '../dataschema/ISchedulePersistence';
import { IGetScheduleDTO } from '../dto/IScheduleDTO';
import { Schedule } from '../domain/schedule/schedule';
import { ScheduleId } from '../domain/schedule/scheduleId';
import { TruckMap } from './TruckMap';
import { IDeliveryDTO, IWarehouseDTO } from '../dto/WarehouseDTOs';

export class ScheduleMap extends Mapper<Schedule> {
  public static toDTO(schedule: Schedule, deliveries: IDeliveryDTO[], originWarehouse: IWarehouseDTO): IGetScheduleDTO {
    const dto: IGetScheduleDTO = {
      id: schedule.id.toString(),
      truck: TruckMap.toDTO(schedule.truck),
      deliveries: deliveries,
      totalTime: schedule.totalTime.value,
      originWarehouse: originWarehouse,
      date: schedule.date.value,
    };
    return dto;
  }

  public static toDomain(schema: ISchedulePersistence): Schedule {
    const id = ScheduleId.create(schema.domainId);
    const model = Schedule.create(
      {
        truck: TruckMap.toDomain(schema.truck),
        totalTime: schema.totalTime,
        deliveryIds: schema.deliveryIds,
        originWarehouseId: schema.originWarehouseId,
        date: schema.date.toISOString(),
      },
      id.getValue(),
    );
    return model.getValue();
  }

  public static toPersistence(schedule: Schedule): ISchedulePersistence {
    const schema: ISchedulePersistence = {
      domainId: schedule.id.toString(),
      truck: TruckMap.toPersistence(schedule.truck),
      deliveryIds: schedule.deliveryIds.map(id => id.value),
      totalTime: schedule.totalTime.value,
      originWarehouseId: schedule.originWarehouseId.value,
      truckId: schedule.truck.id.toString(),
      date: schedule.date.value,
    };
    return schema;
  }
}
