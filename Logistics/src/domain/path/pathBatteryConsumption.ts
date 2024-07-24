import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface PathBatteryConsumptionProps {
  value: number;
}

export class PathBatteryConsumption extends ValueObject<PathBatteryConsumptionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PathBatteryConsumptionProps) {
    super(props);
  }

  public static create(pathBatteryConsumption: number): Result<PathBatteryConsumption> {
    const guardResult = Guard.againstNullOrUndefined(pathBatteryConsumption, 'pathTime');
    if (!guardResult.succeeded) {
      return Result.fail<PathBatteryConsumption>(guardResult.message);
    } else {
      return Result.ok<PathBatteryConsumption>(new PathBatteryConsumption({ value: pathBatteryConsumption }));
    }
  }
}
