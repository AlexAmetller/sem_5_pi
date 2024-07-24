import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface UserPhoneNumberProps {
  value: string;
}

export class UserPhoneNumber extends ValueObject<UserPhoneNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPhoneNumberProps) {
    super(props);
  }

  public static create(phoneNumber: string): Result<UserPhoneNumber> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(phoneNumber, 'phone'),
      Guard.againstInvalidPhoneNumber(phoneNumber, 'phone'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserPhoneNumber>(guardResult.message);
    } else {
      return Result.ok<UserPhoneNumber>(new UserPhoneNumber({ value: phoneNumber }));
    }
  }
}
