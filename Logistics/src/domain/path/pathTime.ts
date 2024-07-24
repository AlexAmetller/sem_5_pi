import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PathTimeProps {
  value: number;
}

export class PathTime extends ValueObject<PathTimeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PathTimeProps) {
    super(props);
  }

  public static create(pathTime: number): Result<PathTime> {
    const guardResult = Guard.againstNullOrUndefined(pathTime, 'pathTime');
    if (!guardResult.succeeded) {
      return Result.fail<PathTime>(guardResult.message);
    } else {
      return Result.ok<PathTime>(new PathTime({ value: pathTime }));
    }
  }
}
