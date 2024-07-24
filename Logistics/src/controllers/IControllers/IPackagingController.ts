import { Request, Response, NextFunction } from 'express';
import { IPackagingPaginationQuery } from '../../dto/IPackagingDTO';

export default interface IPackagingController {
  createPackaging(req: Request, res: Response, next: NextFunction): Promise<any>;
  findAll(req: Request<any, any, any, IPackagingPaginationQuery>, res: Response, next: NextFunction): Promise<any>;
  findById(req: Request, res: Response, next: NextFunction): Promise<any>;
  updatePackaging(req: Request, res: Response, next: NextFunction): Promise<any>;
}
