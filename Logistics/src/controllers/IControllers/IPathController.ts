import { Request, Response, NextFunction } from 'express';
import { IPathPaginationQuery } from '../../dto/IPathDTO';

export default interface IPathController {
  createPath(req: Request, res: Response, next: NextFunction): void;
  findAll(req: Request<any, any, any, IPathPaginationQuery>, res: Response, next: NextFunction): void;
  findById(req: Request, res: Response, next: NextFunction): void;
  updatePath(req: Request, res: Response, next: NextFunction): void;
}
