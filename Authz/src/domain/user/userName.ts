import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(name: string): Result<UserName> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(name, 'name'),
      Guard.againstInvalidFullName(name, 'name'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserName>(guardResult.message);
    } else {
      return Result.ok<UserName>(new UserName({ value: name }));
    }
  }
}
