import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface TruckTareProps {
  value: number;
}

export class TruckTare extends ValueObject<TruckTareProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TruckTareProps) {
    super(props);
  }

  public static create(tare: number): Result<TruckTare> {
    const guardResult = Guard.againstNullOrUndefined(tare, 'tare');
    if (!guardResult.succeeded) {
      return Result.fail<TruckTare>(guardResult.message);
    } else {
      return Result.ok<TruckTare>(new TruckTare({ value: tare }));
    }
  }
}
