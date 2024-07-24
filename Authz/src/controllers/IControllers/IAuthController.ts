import { Request, Response, NextFunction } from 'express';

export default interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<any>;
  googleLogin(req: Request, res: Response, next: NextFunction): Promise<any>;
  renew(req: Request, res: Response, next: NextFunction): Promise<any>;
}
