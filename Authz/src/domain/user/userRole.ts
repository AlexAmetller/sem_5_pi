import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserRoleProps {
  value: string;
}

export class UserRole extends ValueObject<UserRoleProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserRoleProps) {
    super(props);
  }

  public static create(role: string): Result<UserRole> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(role, 'role'),
      Guard.isOneOf(role, ['admin', 'warehouse-manager', 'logistics-manager', 'fleet-manager'], 'status'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserRole>(guardResult.message);
    } else {
      return Result.ok<UserRole>(new UserRole({ value: role }));
    }
  }
}
