import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckMaxChargeProps {
  value: number;
}

export class TruckMaxCharge extends ValueObject<TruckMaxChargeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TruckMaxChargeProps) {
    super(props);
  }

  public static create(maxCharge: number): Result<TruckMaxCharge> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(maxCharge, 'maxCharge'),
      Guard.inRange(maxCharge, 1, 101, 'maxCharge'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<TruckMaxCharge>(guardResult.message);
    } else {
      return Result.ok<TruckMaxCharge>(new TruckMaxCharge({ value: maxCharge }));
    }
  }
}
