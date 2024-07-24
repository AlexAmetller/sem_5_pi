import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

/*
 *
 */
export class PackagingId extends UniqueEntityID {
  private constructor(id: string) {
    super(id);
  }

  public static create(id: string): Result<PackagingId> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(id, 'id'),
      Guard.againstInvalidLicensePlate(id, 'id'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<PackagingId>(guardResult.message);
    } else {
      return Result.ok<PackagingId>(new PackagingId(id));
    }
  }
}
