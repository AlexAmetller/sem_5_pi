import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserStatusProps {
  value: string;
}

export class UserStatus extends ValueObject<UserStatusProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserStatusProps) {
    super(props);
  }

  public static create(status: string): Result<UserStatus> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(status, 'status'),
      Guard.isOneOf(status, ['active', 'deleted'], 'status'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserStatus>(guardResult.message);
    } else {
      return Result.ok<UserStatus>(new UserStatus({ value: status }));
    }
  }
}
