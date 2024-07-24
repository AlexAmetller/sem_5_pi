import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IUserController from './IControllers/IUserController';
import IUserService from '../services/IServices/IUserService';
import { ICreateUserDTO, IUpdateUserDTO } from '../dto/IUserDTO';
import { IAuthenticatedUser } from '../dto/IAuthDTO';

@Service()
class UserController implements IUserController {
  constructor(@Inject(config.services.user.name) private userServiceInstance: IUserService) {}
  public async findByMail(req: Request, res: Response, next: NextFunction) {
    try {
      const mail = req.params['mail'] as string;
      if (!mail) return res.status(404).send({ message: 'Invalid mail parameter.' });

      const userOrError = await this.userServiceInstance.getUser(mail);

      if (userOrError.isFailure) {
        return res.status(400).send({ errors: userOrError.errorValue() });
      }

      const userDTO = userOrError.getValue();
      return res.status(201).json(userDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      if (user.role !== 'admin') return res.status(401).send({ message: 'Unauthorized.' });

      const userOrError = await this.userServiceInstance.getUsers();

      if (userOrError.isFailure) {
        return res.status(400).send({ errors: userOrError.errorValue() });
      }

      const userDTO = userOrError.getValue();
      return res.status(200).json(userDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      if (user.role !== 'admin') return res.status(401).send({ message: 'Unauthorized.' });

      const dto = req.body as ICreateUserDTO;

      if (!dto) return res.status(422).json({ message: 'Invalid user data' });

      const userOrError = await this.userServiceInstance.createUser(dto);

      if (userOrError.isFailure) {
        return res.status(400).json({ errors: userOrError.errorValue() });
      }

      const userDTO = userOrError.getValue();
      return res.json(userDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;
      if (user.role !== 'admin') return res.status(401).send({ message: 'Unauthorized.' });

      const mail = req.params['mail'] as string;
      const dto = req.body as IUpdateUserDTO;

      if (!mail) return res.status(404).json({ message: 'Invalid mail parameter.' });

      const userOrError = await this.userServiceInstance.updateUser(mail, dto);

      if (userOrError.isFailure) {
        return res.status(400).json({ errors: userOrError.errorValue() });
      }

      const userDTO = userOrError.getValue();

      return res.status(200).json(userDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req['user'] as IAuthenticatedUser;

      if (user.role !== 'admin') return res.status(401).send({ message: 'Unauthorized.' });

      const mail = req.params['mail'] as string;

      if (!mail) return res.status(404).json({ message: 'Invalid mail parameter.' });

      const successOrError = await this.userServiceInstance.deleteUser(mail);

      if (successOrError.isFailure) {
        return res.status(404).json({ errors: successOrError.errorValue() });
      }

      return res.status(200).send();
    } catch (e) {
      return next(e);
    }
  }
}

export default UserController;
