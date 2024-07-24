import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ScheduleDeliveryIdProps {
  value: string;
}

export class ScheduleDeliveryId extends ValueObject<ScheduleDeliveryIdProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: ScheduleDeliveryIdProps) {
    super(props);
  }

  public static create(deliveryId: string): Result<ScheduleDeliveryId> {
    const guardResult = Guard.againstNullOrUndefined(deliveryId, 'Delivery');
    if (!guardResult.succeeded) {
      return Result.fail<ScheduleDeliveryId>(guardResult.message);
    } else {
      return Result.ok<ScheduleDeliveryId>(new ScheduleDeliveryId({ value: deliveryId }));
    }
  }
}
