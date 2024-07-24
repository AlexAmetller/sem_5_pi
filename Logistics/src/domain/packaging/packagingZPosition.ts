import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingZPositionProps {
  value: number;
}

export class PackagingZPosition extends ValueObject<PackagingZPositionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PackagingZPositionProps) {
    super(props);
  }

  public static create(zposition: number): Result<PackagingZPosition> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(zposition, 'zposition'),
      Guard.inRange(zposition, 0, 8, 'zposition'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<PackagingZPosition>(guardResult.message);
    } else {
      return Result.ok<PackagingZPosition>(new PackagingZPosition({ value: zposition }));
    }
  }
}
