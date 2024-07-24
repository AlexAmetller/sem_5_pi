import { Inject, Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { IPackagingPersistence } from '../dataschema/IPackagingPersistence';

import IPackagingRepo from '../services/IRepos/IPackagingRepo';
import { Packaging } from '../domain/packaging/packaging';
import { PackagingMap } from '../mappers/PackagingMap';
import { makePipeline } from '../utils/QueryUtils';
import { RecordResult } from '../dto/Pagination';
import { IPackagingPaginationQuery } from '../dto/IPackagingDTO';

@Service()
export default class PackagingRepo implements IPackagingRepo {
  constructor(@Inject('packagingSchema') private packagingSchema: Model<IPackagingPersistence & Document>) {}

  public async save(packaging: Packaging): Promise<Packaging> {
    const query = { domainId: packaging.id.toString() };
    const packagingDocument = await this.packagingSchema.findOne(query);
    const rawPackaging: IPackagingPersistence = PackagingMap.toPersistence(packaging);

    try {
      if (packagingDocument === null) {
        const packagingCreated = await this.packagingSchema.create(rawPackaging);

        return PackagingMap.toDomain(packagingCreated);
      } else {
        Object.assign(packagingDocument, rawPackaging);

        await packagingDocument.save();

        return PackagingMap.toDomain(packagingDocument);
      }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Packaging> {
    const record = await this.packagingSchema.findOne({ domainId: id });

    if (record != null) {
      return PackagingMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findAll(query: IPackagingPaginationQuery): Promise<RecordResult<Packaging>> {
    const pipeline = makePipeline(query);

    console.log({ pipeline: JSON.stringify(pipeline, null, 2) });

    const aggregation = await this.packagingSchema.aggregate<{
      metadata: { count: number }[];
      records: IPackagingPersistence[];
    }>(pipeline);

    const count = aggregation[0].metadata[0]?.count ?? 0;
    const records = aggregation[0].records as IPackagingPersistence[];

    const recordDTO = records.map(item => PackagingMap.toDomain(item));
    return {
      count,
      records: recordDTO,
    };
  }

  exists(_t: Packaging): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
