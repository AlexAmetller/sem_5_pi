import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingXPositionProps {
  value: number;
}

export class PackagingXPosition extends ValueObject<PackagingXPositionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PackagingXPositionProps) {
    super(props);
  }

  public static create(xposition: number): Result<PackagingXPosition> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(xposition, 'xposition'),
      Guard.inRange(xposition, 0, 10, 'xposition'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<PackagingXPosition>(guardResult.message);
    } else {
      return Result.ok<PackagingXPosition>(new PackagingXPosition({ value: xposition }));
    }
  }
}
