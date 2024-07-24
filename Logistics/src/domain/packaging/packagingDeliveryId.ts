import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PackagingDeliveryIdProps {
  value: string;
}

export class PackagingDeliveryId extends ValueObject<PackagingDeliveryIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PackagingDeliveryIdProps) {
    super(props);
  }

  public static create(deliveryId: string): Result<PackagingDeliveryId> {
    const guardResult = Guard.againstNullOrUndefined(deliveryId, 'DeliveryId');
    if (!guardResult.succeeded) {
      return Result.fail<PackagingDeliveryId>(guardResult.message);
    } else {
      return Result.ok<PackagingDeliveryId>(new PackagingDeliveryId({ value: deliveryId }));
    }
  }
}
