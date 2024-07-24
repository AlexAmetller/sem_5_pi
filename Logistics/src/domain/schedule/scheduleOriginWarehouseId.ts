import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ScheduleWarehouseIdProps {
  value: string;
}

export class ScheduleWarehouseId extends ValueObject<ScheduleWarehouseIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ScheduleWarehouseIdProps) {
    super(props);
  }

  public static create(warehouseId: string): Result<ScheduleWarehouseId> {
    const guardResult = Guard.againstNullOrUndefined(warehouseId, 'Warehouse ID');
    if (!guardResult.succeeded) {
      return Result.fail<ScheduleWarehouseId>(guardResult.message);
    } else {
      return Result.ok<ScheduleWarehouseId>(new ScheduleWarehouseId({ value: warehouseId }));
    }
  }
}
