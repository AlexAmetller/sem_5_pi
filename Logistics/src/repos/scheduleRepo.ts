import { Inject, Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { ISchedulePersistence } from '../dataschema/ISchedulePersistence';

import IScheduleRepo from '../services/IRepos/IScheduleRepo';
import { Schedule } from '../domain/schedule/schedule';
import { ScheduleMap } from '../mappers/ScheduleMap';
import { RecordResult } from '../dto/Pagination';
import { ISchedulePaginationQuery } from '../dto/IScheduleDTO';
import { makePipeline } from '../utils/QueryUtils';

@Service()
export default class ScheduleRepo implements IScheduleRepo {
  constructor(@Inject('scheduleSchema') private scheduleSchema: Model<ISchedulePersistence & Document>) {}

  public async save(schedule: Schedule): Promise<Schedule> {
    const query = { domainId: schedule.id.toString() };
    const scheduleDocument = await this.scheduleSchema.findOne(query);
    const rawSchedule: ISchedulePersistence = ScheduleMap.toPersistence(schedule);

    try {
      if (scheduleDocument === null) {
        const scheduleCreated = await this.scheduleSchema.create(rawSchedule);

        return ScheduleMap.toDomain(scheduleCreated);
      } else {
        Object.assign(scheduleDocument, rawSchedule);

        await scheduleDocument.save();

        return ScheduleMap.toDomain(scheduleDocument);
      }
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }

  public async findById(id: string): Promise<Schedule> {
    const record = await this.scheduleSchema.findOne({ domainId: id }).populate('truck');

    if (record != null) {
      return ScheduleMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findAll(query: ISchedulePaginationQuery): Promise<RecordResult<Schedule>> {
    const pipeline = makePipeline(query);

    // console.log({ pipeline: JSON.stringify(pipeline, null, 2) });

    const aggregation = await this.scheduleSchema.aggregate<{
      metadata: { count: number }[];
      records: ISchedulePersistence[];
    }>(pipeline);

    const count = aggregation[0].metadata[0]?.count ?? 0;
    const records = aggregation[0].records as ISchedulePersistence[];

    await this.scheduleSchema.populate(records, { path: 'truck' });

    const recordDTO = records.map(item => ScheduleMap.toDomain(item));
    return {
      count,
      records: recordDTO,
    };
  }

  exists(_t: Schedule): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
