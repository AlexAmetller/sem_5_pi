import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingYPositionProps {
  value: number;
}

export class PackagingYPosition extends ValueObject<PackagingYPositionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PackagingYPositionProps) {
    super(props);
  }

  public static create(yposition: number): Result<PackagingYPosition> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(yposition, 'yposition'),
      Guard.inRange(yposition, 0, 20, 'yposition'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<PackagingYPosition>(guardResult.message);
    } else {
      return Result.ok<PackagingYPosition>(new PackagingYPosition({ value: yposition }));
    }
  }
}
