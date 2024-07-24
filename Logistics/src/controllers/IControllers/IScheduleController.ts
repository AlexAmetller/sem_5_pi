import { Request, Response, NextFunction } from 'express';
import { ISchedulePaginationQuery } from '../../dto/IScheduleDTO';

export default interface IScheduleController {
  createSchedule(req: Request, res: Response, next: NextFunction): Promise<any>;
  findAll(req: Request<any, any, any, ISchedulePaginationQuery>, res: Response, next: NextFunction): Promise<any>;
  findById(req: Request, res: Response, next: NextFunction): Promise<any>;
}
