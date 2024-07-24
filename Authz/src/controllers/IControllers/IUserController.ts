import { Request, Response, NextFunction } from 'express';

export default interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): void;
  findAll(req: Request, res: Response, next: NextFunction): void;
  findByMail(req: Request, res: Response, next: NextFunction): void;
  updateUser(req: Request, res: Response, next: NextFunction): void;
  deleteUser(req: Request, res: Response, next: NextFunction): void;
}
