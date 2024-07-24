import { Mapper } from '../core/infra/Mapper';
import { ITruckPersistence } from '../dataschema/ITruckPersistence';
import ITruckDTO, { IGetTruckDTO } from '../dto/ITruckDTO';
import { Truck } from '../domain/truck/truck';
import { TruckId } from '../domain/truck/truckId';

export class TruckMap extends Mapper<Truck> {
  public static toDTO(truck: Truck): IGetTruckDTO {
    const dto: ITruckDTO = {
      id: truck.id.toString(),
      tare: truck.tare.value,
      maxWeight: truck.maxWeight.value,
      maxCharge: truck.maxCharge.value,
      range: truck.range.value,
      chargingTime: truck.chargingTime.value,
      enabled: truck.enabled.value,
    };
    return dto;
  }

  public static toDomain(schema: ITruckPersistence): Truck {
    const id = TruckId.create(schema.domainId);
    const model = Truck.create(
      {
        tare: schema.tare,
        maxWeight: schema.maxWeight,
        maxCharge: schema.maxCharge,
        range: schema.range,
        chargingTime: schema.chargingTime,
        enabled: schema.enabled,
      },
      id.getValue(),
    );
    return model.getValue();
  }

  public static toPersistence(truck: Truck): ITruckPersistence {
    return {
      domainId: truck.id.toString(),
      tare: truck.tare.value,
      maxWeight: truck.maxWeight.value,
      maxCharge: truck.maxCharge.value,
      range: truck.range.value,
      chargingTime: truck.chargingTime.value,
      enabled: truck.enabled.value,
    };
  }
}
