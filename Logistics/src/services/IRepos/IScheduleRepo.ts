import { Repo } from '../../core/infra/Repo';
import { Schedule } from '../../domain/schedule/schedule';
import { ISchedulePaginationQuery } from '../../dto/IScheduleDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IScheduleRepo extends Repo<Schedule> {
  save(user: Schedule): Promise<Schedule>;
  findById(id: string): Promise<Schedule>;
  findAll(query: ISchedulePaginationQuery): Promise<RecordResult<Schedule>>;
}
