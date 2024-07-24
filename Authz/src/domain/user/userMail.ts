import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

export class UserMail extends UniqueEntityID {
  private constructor(id: string) {
    super(id);
  }

  get mail(): string {
    return String(this.toValue());
  }

  public static create(mail: string): Result<UserMail> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(mail, 'mail'),
      Guard.againstInvalidMail(mail, 'mail'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<UserMail>(guardResult.message);
    } else {
      return Result.ok<UserMail>(new UserMail(mail));
    }
  }
}
