import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingWithdrawingTimeProps {
  value: number;
}

export class PackagingWithdrawingTime extends ValueObject<PackagingWithdrawingTimeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PackagingWithdrawingTimeProps) {
    super(props);
  }

  public static create(withdrawingTime: number): Result<PackagingWithdrawingTime> {
    const guardResult = Guard.againstNullOrUndefined(withdrawingTime, 'WithdrawingTime');
    if (!guardResult.succeeded) {
      return Result.fail<PackagingWithdrawingTime>(guardResult.message);
    } else {
      return Result.ok<PackagingWithdrawingTime>(new PackagingWithdrawingTime({ value: withdrawingTime }));
    }
  }
}
