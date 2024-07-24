import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ScheduleDateProps {
  value: Date;
}

export class ScheduleDate extends ValueObject<ScheduleDateProps> {
  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ScheduleDateProps) {
    super(props);
  }

  public static create(date: string): Result<ScheduleDate> {
    const value = new Date(date);
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(value, 'Date'),
      Guard.againstInvalidDate(value, 'Date'),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<ScheduleDate>(guardResult.message);
    } else {
      return Result.ok<ScheduleDate>(new ScheduleDate({ value }));
    }
  }
}
