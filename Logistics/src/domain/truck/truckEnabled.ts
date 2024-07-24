import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckEnabledProps {
  value: boolean;
}

export class TruckEnabled extends ValueObject<TruckEnabledProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: TruckEnabledProps) {
    super(props);
  }

  public static create(enabled: boolean): Result<TruckEnabled> {
    const guardResult = Guard.combine([Guard.againstNullOrUndefined(enabled, 'enabled')]);
    if (!guardResult.succeeded) {
      return Result.fail<TruckEnabled>(guardResult.message);
    } else {
      return Result.ok<TruckEnabled>(new TruckEnabled({ value: enabled }));
    }
  }
}
