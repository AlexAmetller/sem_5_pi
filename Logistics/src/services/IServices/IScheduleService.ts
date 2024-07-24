import { Result } from '../../core/logic/Result';
import { IAuthenticatedUser } from '../../dto/IAuthDTO';
import { ICreateScheduleDTO, IGetScheduleDTO, ISchedulePaginationQuery } from '../../dto/IScheduleDTO';
import { RecordResult } from '../../dto/Pagination';

export default interface IScheduleService {
  createSchedule(scheduleDTO: ICreateScheduleDTO, user: IAuthenticatedUser): Promise<Result<IGetScheduleDTO>>;
  getSchedule(scheduleId: string, user: IAuthenticatedUser): Promise<Result<IGetScheduleDTO>>;
  getSchedules(
    query: ISchedulePaginationQuery,
    user: IAuthenticatedUser,
  ): Promise<Result<RecordResult<IGetScheduleDTO>>>;
}
