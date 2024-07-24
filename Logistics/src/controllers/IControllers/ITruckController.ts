import { Request, Response, NextFunction } from 'express';

export default interface ITruckController {
  createTruck(req: Request, res: Response, next: NextFunction): Promise<any>;
  findAll(req: Request, res: Response, next: NextFunction): Promise<any>;
  findById(req: Request, res: Response, next: NextFunction): Promise<any>;
  updateTruck(req: Request, res: Response, next: NextFunction): Promise<any>;
}
