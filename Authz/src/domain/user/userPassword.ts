import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserPasswordProps {
  hash: string;
  salt: string;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value() {
    return {
      salt: this.props.salt,
      hash: this.props.hash,
    };
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static create(hash: string, salt: string): Result<UserPassword> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(hash, 'hash'),
      Guard.againstNullOrUndefined(salt, 'salt'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserPassword>(guardResult.message);
    } else {
      return Result.ok<UserPassword>(new UserPassword({ hash, salt }));
    }
  }
}
