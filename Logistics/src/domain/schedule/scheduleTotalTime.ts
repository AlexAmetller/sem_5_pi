import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ScheduleTotalTimeProps {
  value: number;
}

export class ScheduleTotalTime extends ValueObject<ScheduleTotalTimeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: ScheduleTotalTimeProps) {
    super(props);
  }

  public static create(totalTime: number): Result<ScheduleTotalTime> {
    const guardResult = Guard.againstNullOrUndefined(totalTime, 'TotalTime');
    if (!guardResult.succeeded) {
      return Result.fail<ScheduleTotalTime>(guardResult.message);
    } else {
      return Result.ok<ScheduleTotalTime>(new ScheduleTotalTime({ value: totalTime }));
    }
  }
}
