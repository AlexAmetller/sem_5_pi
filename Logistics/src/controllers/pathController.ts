import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IPathController from './IControllers/IPathController';
import IPathService from '../services/IServices/IPathService';
import { ICreatePathDTO, IPathPaginationQuery } from '../dto/IPathDTO';
import { IUpdatePathDTO } from '../dto/IPathDTO';
import { IAuthenticatedUser } from '../dto/IAuthDTO';

@Service()
class PathController implements IPathController {
  constructor(@Inject(config.services.path.name) private pathServiceInstance: IPathService) {}

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const pathId = req.params['id'] as string;
      if (!pathId) return res.status(404).send({ message: 'Invalid id parameter.' });

      const pathOrError = await this.pathServiceInstance.getPath(pathId);

      if (pathOrError.isFailure) {
        return res.status(400).send({ errors: pathOrError.errorValue() });
      }

      const pathDTO = pathOrError.getValue();
      return res.status(200).json(pathDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async findAll(req: Request<any, any, any, IPathPaginationQuery>, res: Response, next: NextFunction) {
    try {
      const pathOrError = await this.pathServiceInstance.getPaths(req.query);

      if (pathOrError.isFailure) {
        return res.status(400).send({ errors: pathOrError.errorValue() });
      }

      const pathDTO = pathOrError.getValue();
      return res
        .status(200)
        .set('X-Total-Count', String(pathDTO.count))
        .set('Access-Control-Expose-Headers', ['X-Total-Count'])
        .json(pathDTO.records);
    } catch (e) {
      return next(e);
    }
  }

  public async updatePath(req: Request, res: Response, next: NextFunction) {
    try {
      const pathId = req.params['id'] as string;
      const dto = req.body as IUpdatePathDTO;
      const user = req['user'] as IAuthenticatedUser;

      if (!dto) return res.status(422).send({ message: 'Invalid path data' });

      const pathOrError = await this.pathServiceInstance.updatePath(pathId, dto, user);

      if (pathOrError.isFailure) {
        return res.status(400).send({ errors: pathOrError.errorValue() });
      }

      const pathDTO = pathOrError.getValue();
      return res.json(pathDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async createPath(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ICreatePathDTO;
      const user = req['user'] as IAuthenticatedUser;

      if (!dto) return res.status(422).send({ message: 'Invalid path data' });

      const pathOrError = await this.pathServiceInstance.createPath(dto, user);

      if (pathOrError.isFailure) {
        return res.status(400).send({ errors: pathOrError.errorValue() });
      }

      const pathDTO = pathOrError.getValue();
      return res.json(pathDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }
}

export default PathController;
