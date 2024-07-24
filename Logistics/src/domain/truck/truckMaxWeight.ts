import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckMaxWeightProps {
  value: number;
}

export class TruckMaxWeight extends ValueObject<TruckMaxWeightProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TruckMaxWeightProps) {
    super(props);
  }

  public static create(maxWeight: number): Result<TruckMaxWeight> {
    const guardResult = Guard.againstNullOrUndefined(maxWeight, 'maxWeight');
    if (!guardResult.succeeded) {
      return Result.fail<TruckMaxWeight>(guardResult.message);
    } else {
      return Result.ok<TruckMaxWeight>(new TruckMaxWeight({ value: maxWeight }));
    }
  }
}
