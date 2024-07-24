import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IPackagingController from './IControllers/IPackagingController';
import IPackagingService from '../services/IServices/IPackagingService';
import { ICreatePackagingDTO, IPackagingPaginationQuery, UpdatePackagingDTO } from '../dto/IPackagingDTO';
import { IAuthenticatedUser } from '../dto/IAuthDTO';
// import Logger from '../loaders/logger';

@Service()
class PackagingController implements IPackagingController {
  constructor(@Inject(config.services.packaging.name) private packagingServiceInstance: IPackagingService) {}

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const packagingId = req.params['id'] as string;
      if (!packagingId) return res.status(404).send({ message: 'Invalid id parameter.' });

      const packagingOrError = await this.packagingServiceInstance.getPackaging(packagingId);

      if (packagingOrError.isFailure) {
        return res.status(400).send({ errors: packagingOrError.errorValue() });
      }

      const packagingDTO = packagingOrError.getValue();
      return res.status(201).json(packagingDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async findAll(req: Request<any, any, any, IPackagingPaginationQuery>, res: Response, next: NextFunction) {
    try {
      const packagingOrError = await this.packagingServiceInstance.getPackagings(req.query);

      if (packagingOrError.isFailure) {
        return res.status(400).send({ errors: packagingOrError.errorValue() });
      }

      const packagingDTO = packagingOrError.getValue();
      return res
        .status(200)
        .set('X-Total-Count', String(packagingDTO.count))
        .set('Access-Control-Expose-Headers', ['X-Total-Count'])
        .json(packagingDTO.records);
    } catch (e) {
      return next(e);
    }
  }

  public async createPackaging(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      const dto = req.body as ICreatePackagingDTO;

      if (!dto) return res.status(422).json({ message: 'Invalid packaging data' });

      const packagingOrError = await this.packagingServiceInstance.createPackaging(dto, user);

      if (packagingOrError.isFailure) {
        return res.status(400).json({ errors: packagingOrError.errorValue() });
      }

      const packagingDTO = packagingOrError.getValue();
      return res.json(packagingDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updatePackaging(req: Request, res: Response, next: NextFunction) {
    try {
      const packagingId = req.params['id'] as string;
      const dto = req.body as UpdatePackagingDTO;

      if (!packagingId) return res.status(404).json({ message: 'Invalid id parameter.' });

      const packagingOrError = await this.packagingServiceInstance.updatePackaging(packagingId, dto);

      if (packagingOrError.isFailure) {
        return res.status(400).json({ errors: packagingOrError.errorValue() });
      }

      const packagingDTO = packagingOrError.getValue();

      return res.status(200).json(packagingDTO);
    } catch (e) {
      return next(e);
    }
  }
}

export default PackagingController;
