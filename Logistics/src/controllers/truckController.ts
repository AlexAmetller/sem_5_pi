import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import ITruckController from './IControllers/ITruckController';
import ITruckService from '../services/IServices/ITruckService';
import { ICreateTruckDTO, IUpdateTruckDTO } from '../dto/ITruckDTO';
// import Logger from '../loaders/logger';

@Service()
class TruckController implements ITruckController {
  constructor(@Inject(config.services.truck.name) private truckServiceInstance: ITruckService) {}

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const truckId = req.params['id'] as string;
      if (!truckId) return res.status(404).send({ message: 'Invalid id parameter.' });

      const truckOrError = await this.truckServiceInstance.getTruck(truckId);

      if (truckOrError.isFailure) {
        return res.status(404).send({ errors: truckOrError.errorValue() });
      }

      const truckDTO = truckOrError.getValue();
      return res.status(200).json(truckDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const truckOrError = await this.truckServiceInstance.getTrucks();

      if (truckOrError.isFailure) {
        return res.status(400).send({ errors: truckOrError.errorValue() });
      }

      const truckDTO = truckOrError.getValue();
      return res.status(200).json(truckDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async createTruck(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ICreateTruckDTO;
      // Logger.info(`createTruck: {%o}`, dto);

      if (!dto) return res.status(422).json({ message: 'Invalid truck data' });

      const truckOrError = await this.truckServiceInstance.createTruck(dto);

      if (truckOrError.isFailure) {
        return res.status(400).json({ errors: truckOrError.errorValue() });
      }

      const truckDTO = truckOrError.getValue();
      return res.json(truckDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateTruck(req: Request, res: Response, next: NextFunction) {
    try {
      const truckId = req.params['id'] as string;
      const dto = req.body as IUpdateTruckDTO;

      if (!truckId) return res.status(404).json({ message: 'Invalid id parameter.' });

      const truckOrError = await this.truckServiceInstance.updateTruck(truckId, dto);

      if (truckOrError.isFailure) {
        return res.status(400).json({ errors: truckOrError.errorValue() });
      }

      const truckDTO = truckOrError.getValue();

      return res.status(200).json(truckDTO);
    } catch (e) {
      return next(e);
    }
  }
}

export default TruckController;
