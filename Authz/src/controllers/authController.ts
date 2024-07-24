import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IAuthController from './IControllers/IAuthController';
import IAuthService from '../services/IServices/IAuthService';
import { IAuthRequestDTO, IGooleOAuthRequestDTO, IRenewRequestDTO } from '../dto/IAuthDTO';

@Service()
class AuthController implements IAuthController {
  constructor(@Inject(config.services.auth.name) private authServiceInstance: IAuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IAuthRequestDTO;

      if (!dto) return res.status(422).send({ message: 'Invalid login data: user mail, password' });

      const loginOrError = await this.authServiceInstance.login(dto);

      if (loginOrError.isFailure) {
        return res.status(401).send({ errors: loginOrError.errorValue() });
      }

      const loginDTO = loginOrError.getValue();
      return res.json(loginDTO).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IGooleOAuthRequestDTO;

      if (!dto) return res.status(400).send({ message: 'Invalid request data.' });

      const loginOrError = await this.authServiceInstance.googleLogin(dto);

      if (loginOrError.isFailure) {
        return res.status(401).send({ errors: loginOrError.errorValue() });
      }

      const loginDTO = loginOrError.getValue();
      return res.json(loginDTO).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async renew(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IRenewRequestDTO;

      if (!dto) return res.status(400).send({ message: 'Invalid request data.' });

      const renewOrError = await this.authServiceInstance.renew(dto);

      if (renewOrError.isFailure) {
        return res.status(401).send({ errors: renewOrError.errorValue() });
      }

      const renewDTO = renewOrError.getValue();
      return res.json(renewDTO).status(200);
    } catch (e) {
      return next(e);
    }
  }
}

export default AuthController;
