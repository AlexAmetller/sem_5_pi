import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckRangeProps {
  value: number;
}

export class TruckRange extends ValueObject<TruckRangeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TruckRangeProps) {
    super(props);
  }

  public static create(range: number): Result<TruckRange> {
    const guardResult = Guard.againstNullOrUndefined(range, 'range');
    if (!guardResult.succeeded) {
      return Result.fail<TruckRange>(guardResult.message);
    } else {
      return Result.ok<TruckRange>(new TruckRange({ value: range }));
    }
  }
}
