import { Inject, Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { ITruckPersistence } from '../dataschema/ITruckPersistence';

import ITruckRepo from '../services/IRepos/ITruckRepo';
import { Truck } from '../domain/truck/truck';
import { TruckMap } from '../mappers/TruckMap';

@Service()
export default class TruckRepo implements ITruckRepo {
  constructor(@Inject('truckSchema') private truckSchema: Model<ITruckPersistence & Document>) {}

  public async save(truck: Truck): Promise<Truck> {
    const query = { domainId: truck.id.toString() };
    const truckDocument = await this.truckSchema.findOne(query);
    const rawTruck: ITruckPersistence = TruckMap.toPersistence(truck);

    try {
      if (truckDocument === null) {
        const truckCreated = await this.truckSchema.create(rawTruck);

        return TruckMap.toDomain(truckCreated);
      } else {
        Object.assign(truckDocument, rawTruck);

        await truckDocument.save();

        return TruckMap.toDomain(truckDocument);
      }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string, enabled?: boolean): Promise<Truck> {
    const record = await this.truckSchema.findOne({ domainId: id, ...(enabled ? { enabled } : {}) });

    if (record != null) {
      return TruckMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findAll(): Promise<Truck[]> {
    const record = await this.truckSchema.find();

    if (record != null) {
      const resultDTO = record.map(item => TruckMap.toDomain(item));
      return resultDTO;
    } else {
      return null;
    }
  }

  exists(_t: Truck): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
