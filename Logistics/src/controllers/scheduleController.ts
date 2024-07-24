import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IScheduleController from './IControllers/IScheduleController';
import IScheduleService from '../services/IServices/IScheduleService';
import { ICreateScheduleDTO, ISchedulePaginationQuery } from '../dto/IScheduleDTO';
import { IAuthenticatedUser } from '../dto/IAuthDTO';
// import Logger from '../loaders/logger';

@Service()
class ScheduleController implements IScheduleController {
  constructor(@Inject(config.services.schedule.name) private scheduleServiceInstance: IScheduleService) {}

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      const scheduleId = req.params['id'] as string;
      if (!scheduleId) return res.status(404).send({ message: 'Invalid id parameter.' });

      const scheduleOrError = await this.scheduleServiceInstance.getSchedule(scheduleId, user);

      if (scheduleOrError.isFailure) {
        return res.status(404).send({ errors: scheduleOrError.errorValue() });
      }

      const scheduleDTO = scheduleOrError.getValue();
      return res.status(200).json(scheduleDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async findAll(req: Request<any, any, any, ISchedulePaginationQuery>, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      const scheduleOrError = await this.scheduleServiceInstance.getSchedules(req.query, user);

      if (scheduleOrError.isFailure) {
        return res.status(400).send({ errors: scheduleOrError.errorValue() });
      }

      const scheduleDTO = scheduleOrError.getValue();
      return res
        .status(200)
        .set('X-Total-Count', String(scheduleDTO.count))
        .set('Access-Control-Expose-Headers', ['X-Total-Count'])
        .json(scheduleDTO.records);
    } catch (e) {
      return next(e);
    }
  }

  public async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ICreateScheduleDTO;
      const user = req['user'] as IAuthenticatedUser;

      if (!dto) return res.status(422).json({ message: 'Invalid schedule data' });

      const scheduleOrError = await this.scheduleServiceInstance.createSchedule(dto, user);

      if (scheduleOrError.isFailure) {
        return res.status(400).json({ errors: scheduleOrError.errorValue() });
      }

      const scheduleDTO = scheduleOrError.getValue();
      return res.json(scheduleDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }
}

export default ScheduleController;
