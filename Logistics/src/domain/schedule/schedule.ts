import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { ScheduleId } from './scheduleId';
import { Truck } from '../truck/truck';
import { ScheduleTotalTime } from './scheduleTotalTime';
import { ScheduleDeliveryId } from './scheduleDeliveryId';
import { ScheduleWarehouseId } from './scheduleOriginWarehouseId';
import { ScheduleDate } from './scheduleDate';

export interface ScheduleProps {
  truck: Truck;
  deliveryIds: ScheduleDeliveryId[];
  totalTime: ScheduleTotalTime;
  originWarehouseId: ScheduleWarehouseId;
  date: ScheduleDate;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Schedule extends AggregateRoot<ScheduleProps> {
  get id(): ScheduleId {
    return this._id;
  }

  private constructor(props: ScheduleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      truck: Truck;
      deliveryIds: string[];
      totalTime: number;
      originWarehouseId: string;
      date: string;
    },
    id?: UniqueEntityID,
  ): Result<Schedule> {
    const guardedProps = [
      { argument: props.truck, argumentName: 'truck' },
      { argument: props.totalTime, argumentName: 'totalTime' },
      { argument: props.deliveryIds, argumentName: 'deliveries' },
      { argument: props.originWarehouseId, argumentName: 'originWarehouse' },
      { argument: props.date, argumentName: 'date' },
    ];

    const entityProps = {
      truck: props.truck,
      deliveryIds: props.deliveryIds.map(id => ScheduleDeliveryId.create(id)),
      totalTime: ScheduleTotalTime.create(props.totalTime),
      originWarehouseId: ScheduleWarehouseId.create(props.originWarehouseId),
      date: ScheduleDate.create(props.date),
    };

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefinedBulk(guardedProps),
      Guard.againstFailedResults([
        ...entityProps.deliveryIds,
        entityProps.totalTime,
        entityProps.originWarehouseId,
        entityProps.date,
      ]),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Schedule>(guardResult.errors);
    } else {
      const schedule = new Schedule(
        {
          truck: entityProps.truck,
          deliveryIds: entityProps.deliveryIds.map(id => id.getValue()),
          totalTime: entityProps.totalTime.getValue(),
          originWarehouseId: entityProps.originWarehouseId.getValue(),
          date: entityProps.date.getValue(),
        },
        id,
      );
      return Result.ok<Schedule>(schedule);
    }
  }

  get truck(): Truck {
    return this.props.truck;
  }

  get deliveryIds(): ScheduleDeliveryId[] {
    return this.props.deliveryIds;
  }

  get totalTime(): ScheduleTotalTime {
    return this.props.totalTime;
  }

  get originWarehouseId(): ScheduleWarehouseId {
    return this.props.originWarehouseId;
  }

  get date(): ScheduleDate {
    return this.props.date;
  }
}
