import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckChargingTimeProps {
  value: number;
}

export class TruckChargingTime extends ValueObject<TruckChargingTimeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TruckChargingTimeProps) {
    super(props);
  }

  public static create(chargingTime: number): Result<TruckChargingTime> {
    const guardResult = Guard.againstNullOrUndefined(chargingTime, 'chargingTime');
    if (!guardResult.succeeded) {
      return Result.fail<TruckChargingTime>(guardResult.message);
    } else {
      return Result.ok<TruckChargingTime>(new TruckChargingTime({ value: chargingTime }));
    }
  }
}
