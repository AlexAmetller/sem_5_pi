import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

/*
 * TruckId is a valid Matricula
 */
export class TruckId extends UniqueEntityID {
  private constructor(id: string) {
    super(id);
  }

  public static create(id: string): Result<TruckId> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(id, 'id'),
      Guard.againstInvalidLicensePlate(id, 'id'),
    ]);
    if (!guardResult.succeeded) {
      return Result.fail<TruckId>(guardResult.message);
    } else {
      return Result.ok<TruckId>(new TruckId(id));
    }
  }
}
