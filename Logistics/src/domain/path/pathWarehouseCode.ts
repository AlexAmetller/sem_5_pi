import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PathWarehouseCodeProps {
  value: string;
}

export class PathWarehouseCode extends ValueObject<PathWarehouseCodeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PathWarehouseCodeProps) {
    super(props);
  }

  public static create(startWarehouse: string): Result<PathWarehouseCode> {
    const guardResult = Guard.againstNullOrUndefined(startWarehouse, 'startWarehouse');
    if (!guardResult.succeeded) {
      return Result.fail<PathWarehouseCode>(guardResult.message);
    } else {
      return Result.ok<PathWarehouseCode>(new PathWarehouseCode({ value: startWarehouse }));
    }
  }
}
