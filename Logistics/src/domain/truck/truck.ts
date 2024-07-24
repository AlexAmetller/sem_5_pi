import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { TruckTare } from './truckTare';
import { TruckMaxWeight } from './truckMaxWeight';
import { TruckMaxCharge } from './truckMaxCharge';
import { TruckRange } from './truckRange';
import { TruckChargingTime } from './truckChargingTime';
import { TruckId } from './truckId';
import { TruckEnabled } from './truckEnabled';

export interface TruckProps {
  tare: TruckTare;
  maxWeight: TruckMaxWeight;
  maxCharge: TruckMaxCharge;
  range: TruckRange;
  chargingTime: TruckChargingTime;
  enabled: TruckEnabled;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Truck extends AggregateRoot<TruckProps> {
  // id is the truck name (matricula)
  get id(): TruckId {
    return this._id;
  }

  private constructor(props: TruckProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      tare: number;
      maxWeight: number;
      maxCharge: number;
      range: number;
      chargingTime: number;
      enabled: boolean;
    },
    id?: UniqueEntityID,
  ): Result<Truck> {
    const guardedProps = [
      { argument: props.tare, argumentName: 'tare' },
      { argument: props.maxWeight, argumentName: 'maxWeight' },
      { argument: props.maxCharge, argumentName: 'maxCharge' },
      { argument: props.range, argumentName: 'range' },
      { argument: props.chargingTime, argumentName: 'chargingTime' },
      { argument: props.enabled, argumentName: 'enabled' },
    ];

    const entityProps = {
      tare: TruckTare.create(props.tare),
      maxWeight: TruckMaxWeight.create(props.maxWeight),
      maxCharge: TruckMaxCharge.create(props.maxCharge),
      range: TruckRange.create(props.range),
      chargingTime: TruckChargingTime.create(props.chargingTime),
      enabled: TruckEnabled.create(props.enabled),
    };

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefinedBulk(guardedProps),
      Guard.againstFailedResults(Object.values(entityProps)),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Truck>(guardResult.errors);
    } else {
      const truck = new Truck(
        {
          tare: entityProps.tare.getValue(),
          maxWeight: entityProps.maxWeight.getValue(),
          maxCharge: entityProps.maxCharge.getValue(),
          range: entityProps.range.getValue(),
          chargingTime: entityProps.chargingTime.getValue(),
          enabled: entityProps.enabled.getValue(),
        },
        id,
      );
      return Result.ok<Truck>(truck);
    }
  }

  get tare(): TruckTare {
    return this.props.tare;
  }

  get maxWeight(): TruckMaxWeight {
    return this.props.maxWeight;
  }

  get maxCharge(): TruckMaxCharge {
    return this.props.maxCharge;
  }

  get range(): TruckRange {
    return this.props.range;
  }

  get chargingTime(): TruckChargingTime {
    return this.props.chargingTime;
  }

  get enabled(): TruckEnabled {
    return this.props.enabled;
  }
}
