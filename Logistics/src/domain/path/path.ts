import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { PathDistance } from './pathDistance';
import { PathWarehouseCode } from './pathWarehouseCode';
import { PathTime } from './pathTime';
import { PathBatteryConsumption } from './pathBatteryConsumption';
import { PathId } from './pathId';
import { TruckId } from '../truck/truckId';

export interface PathProps {
  truckId: TruckId;
  startWarehouse: PathWarehouseCode;
  endWarehouse: PathWarehouseCode;
  distance: PathDistance;
  time: PathTime;
  batteryConsumption: PathBatteryConsumption;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Path extends AggregateRoot<PathProps> {
  get id(): PathId {
    return this._id;
  }

  private constructor(props: PathProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      truckId: string;
      startWarehouse: string;
      endWarehouse: string;
      distance: number;
      time: number;
      batteryConsumption: number;
    },
    id?: UniqueEntityID,
  ): Result<Path> {
    const guardedProps = [
      { argument: props.truckId, argumentName: 'truckId' },
      { argument: props.startWarehouse, argumentName: 'startWarehouse' },
      { argument: props.endWarehouse, argumentName: 'endWarehouse' },
      { argument: props.distance, argumentName: 'distance' },
      { argument: props.time, argumentName: 'time' },
      { argument: props.batteryConsumption, argumentName: 'batteryConsumption' },
    ];

    if (props.startWarehouse === props.endWarehouse) {
      return Result.fail<Path>('Starting point cannot be the same as endpoint.');
    }

    const entityProps = {
      truckId: TruckId.create(props.truckId),
      startWarehouse: PathWarehouseCode.create(props.startWarehouse),
      endWarehouse: PathWarehouseCode.create(props.endWarehouse),
      distance: PathDistance.create(props.distance),
      time: PathTime.create(props.time),
      batteryConsumption: PathBatteryConsumption.create(props.batteryConsumption),
    };

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefinedBulk(guardedProps),
      Guard.againstFailedResults(Object.values(entityProps)),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Path>(guardResult.errors);
    } else {
      const path = new Path(
        {
          truckId: entityProps.truckId.getValue(),
          startWarehouse: entityProps.startWarehouse.getValue(),
          endWarehouse: entityProps.endWarehouse.getValue(),
          distance: entityProps.distance.getValue(),
          time: entityProps.time.getValue(),
          batteryConsumption: entityProps.batteryConsumption.getValue(),
        },
        id,
      );
      return Result.ok<Path>(path);
    }
  }

  get truckId(): TruckId {
    return this.props.truckId;
  }

  get startWarehouse(): PathWarehouseCode {
    return this.props.startWarehouse;
  }

  get endWarehouse(): PathWarehouseCode {
    return this.props.endWarehouse;
  }

  get distance(): PathDistance {
    return this.props.distance;
  }

  get time(): PathTime {
    return this.props.time;
  }

  get batteryConsumption(): PathBatteryConsumption {
    return this.props.batteryConsumption;
  }
}
