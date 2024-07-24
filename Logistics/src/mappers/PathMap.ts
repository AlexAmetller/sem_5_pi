import { Mapper } from '../core/infra/Mapper';
import { IPathPersistence } from '../dataschema/IPathPersistence';
import IPathDTO, { IGetPathDTO, IPathPaginationQuery } from '../dto/IPathDTO';
import { Path } from '../domain/path/path';
import { PathId } from '../domain/path/pathId';
import { Request } from 'express';

export class PathMap extends Mapper<Path> {
  public static toDTO(path: Path): IGetPathDTO {
    const dto: IPathDTO = {
      id: path.id.toString(),
      truckId: path.truckId.toString(),
      startWarehouse: path.startWarehouse.value,
      endWarehouse: path.endWarehouse.value,
      distance: path.distance.value,
      time: path.time.value,
      batteryConsumption: path.batteryConsumption.value,
    };
    return dto;
  }

  public static toDomain(schema: IPathPersistence): Path {
    const id = PathId.create(schema.domainId);
    const model = Path.create(
      {
        startWarehouse: schema.startWarehouse,
        endWarehouse: schema.endWarehouse,
        distance: schema.distance,
        time: schema.time,
        batteryConsumption: schema.batteryConsumption,
        truckId: schema.truckId,
      },
      id.getValue(),
    );
    return model.getValue();
  }

  public static toPersistence(path: Path): IPathPersistence {
    return {
      domainId: path.id.toString(),
      truckId: path.truckId.toString(),
      startWarehouse: path.startWarehouse.value,
      endWarehouse: path.endWarehouse.value,
      distance: path.distance.value,
      time: path.time.value,
      batteryConsumption: path.batteryConsumption.value,
    };
  }
}
