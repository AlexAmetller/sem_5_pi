import { Inject, Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { IPathPersistence } from '../dataschema/IPathPersistence';

import IPathRepo from '../services/IRepos/IPathRepo';
import { Path } from '../domain/path/path';
import { PathMap } from '../mappers/PathMap';
import { IPathPaginationQuery } from '../dto/IPathDTO';
import { RecordResult } from '../dto/Pagination';
import { makePipeline } from '../utils/QueryUtils';

@Service()
export default class PathRepo implements IPathRepo {
  constructor(@Inject('pathSchema') private pathSchema: Model<IPathPersistence & Document>) {}
  public async save(path: Path): Promise<Path> {
    const query = { domainId: path.id.toString() };

    const pathDocument = await this.pathSchema.findOne(query);

    const rawPath: IPathPersistence = PathMap.toPersistence(path);

    try {
      if (pathDocument === null) {
        const pathCreated = await this.pathSchema.create(rawPath);

        return PathMap.toDomain(pathCreated);
      } else {
        Object.assign(pathDocument, rawPath);

        await pathDocument.save();

        return path;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Path> {
    const record = await this.pathSchema.findOne({ domainId: id });

    if (record != null) {
      return PathMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findAll(query: IPathPaginationQuery): Promise<RecordResult<Path>> {
    const pipeline = makePipeline(query);

    const aggregation = await this.pathSchema.aggregate<{
      metadata: { count: number }[];
      records: IPathPersistence[];
    }>(pipeline);

    const count = aggregation[0].metadata[0]?.count ?? 0;
    const records = aggregation[0].records as IPathPersistence[];

    const recordDTO = records.map(item => PathMap.toDomain(item));
    return {
      count,
      records: recordDTO,
    };
  }

  public async findUnique(truckId: string, startWarehouse: string, endWarehouse: string): Promise<Path> {
    const record = await this.pathSchema.findOne({
      truckId,
      startWarehouse,
      endWarehouse,
    });

    if (record != null) {
      return PathMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findByTruck(truckId: string): Promise<Path[]> {
    const record = await this.pathSchema.find({ truckId });

    if (record != null) {
      const resultDTO = record.map(item => PathMap.toDomain(item));
      return resultDTO;
    } else {
      return null;
    }
  }

  public async exists(_: Path): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
