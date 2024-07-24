import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingLoadingTimeProps {
  value: number;
}

export class PackagingLoadingTime extends ValueObject<PackagingLoadingTimeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PackagingLoadingTimeProps) {
    super(props);
  }

  public static create(loadingTime: number): Result<PackagingLoadingTime> {
    const guardResult = Guard.againstNullOrUndefined(loadingTime, 'LoadingTime');
    if (!guardResult.succeeded) {
      return Result.fail<PackagingLoadingTime>(guardResult.message);
    } else {
      return Result.ok<PackagingLoadingTime>(new PackagingLoadingTime({ value: loadingTime }));
    }
  }
}
