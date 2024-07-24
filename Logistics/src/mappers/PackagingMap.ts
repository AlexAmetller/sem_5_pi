import { Mapper } from '../core/infra/Mapper';
import { IPackagingPersistence } from '../dataschema/IPackagingPersistence';
import PackagingDTO, { GetPackagingDTO } from '../dto/IPackagingDTO';
import { Packaging } from '../domain/packaging/packaging';
import { PackagingId } from '../domain/packaging/packagingId';

export class PackagingMap extends Mapper<Packaging> {
  public static toDTO(packaging: Packaging): GetPackagingDTO {
    const dto: PackagingDTO = {
      id: packaging.id.toString(),
      xposition: packaging.xposition.value,
      yposition: packaging.yposition.value,
      zposition: packaging.zposition.value,
      loadingTime: packaging.loadingTime.value,
      withdrawingTime: packaging.withdrawingTime.value,
      deliveryId: packaging.deliveryId.value,
    };
    return dto;
  }

  public static toDomain(schema: IPackagingPersistence): Packaging {
    const id = PackagingId.create(schema.domainId);
    const model = Packaging.create(
      {
        xposition: schema.xposition,
        yposition: schema.yposition,
        zposition: schema.zposition,
        loadingTime: schema.loadingTime,
        withdrawingTime: schema.withdrawingTime,
        deliveryId: schema.deliveryId,
      },
      id.getValue(),
    );
    return model.getValue();
  }

  public static toPersistence(packaging: Packaging): IPackagingPersistence {
    return {
      domainId: packaging.id.toString(),
      xposition: packaging.xposition.value,
      yposition: packaging.yposition.value,
      zposition: packaging.zposition.value,
      loadingTime: packaging.loadingTime.value,
      withdrawingTime: packaging.withdrawingTime.value,
      deliveryId: packaging.deliveryId.value,
    };
  }
}
