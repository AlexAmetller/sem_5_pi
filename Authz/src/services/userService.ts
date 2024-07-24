import { Service, Inject } from 'typedi';
import config from '../../config';
import { User } from '../domain/user/user';
import { ICreateUserDTO, IGetUserDTO, IUpdateUserDTO } from '../dto/IUserDTO';
import IUserRepo from '../services/IRepos/IUserRepo';
import IUserService from './IServices/IUserService';
import { Result } from '../core/logic/Result';
import { UserMap } from '../mappers/UserMap';
import { hashPassword } from '../utils/PasswordUtils';

@Service()
export default class UserService implements IUserService {
  constructor(@Inject(config.repos.user.name) private userRepo: IUserRepo) {}

  async getUser(mail: string): Promise<Result<IGetUserDTO>> {
    const user = await this.userRepo.findByMail(mail);

    if (user === null) return Result.fail<IGetUserDTO>('User not found.');

    const userDTO = UserMap.toDTO(user);

    return Result.ok<IGetUserDTO>(userDTO);
  }

  async getUsers(): Promise<Result<IGetUserDTO[]>> {
    try {
      const users = await this.userRepo.findAll();

      if (users === null) {
        return Result.fail<IGetUserDTO[]>('No user found');
      } else {
        const resultDTO = users.map(item => UserMap.toDTO(item));
        return Result.ok<IGetUserDTO[]>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createUser(userDTO: ICreateUserDTO): Promise<Result<IGetUserDTO>> {
    const { hash, salt } = await hashPassword(userDTO.password);
    try {
      const userOrError = User.create(
        {
          name: userDTO.name,
          role: userDTO.role,
          phoneNumber: userDTO.phoneNumber,
          status: 'active',
          hash,
          salt,
        },
        userDTO.mail,
      );

      if (userOrError.isFailure) {
        return Result.fail<IGetUserDTO>(userOrError.errorValue());
      }

      const existingUser = await this.userRepo.findByMail(userDTO.mail);

      if (existingUser !== null) {
        return Result.fail<IGetUserDTO>('User already exists');
      }

      const userResult = userOrError.getValue();
      const user = await this.userRepo.save(userResult);
      const resultDTO = UserMap.toDTO(user);
      return Result.ok<IGetUserDTO>(resultDTO);
    } catch (e) {
      throw e;
    }
  }

  async updateUser(mail: string, userDTO: IUpdateUserDTO): Promise<Result<IGetUserDTO>> {
    try {
      const user = await this.userRepo.findByMail(mail);

      if (user === null) {
        return Result.fail<IGetUserDTO>('User not found');
      } else {
        if (user.status.value === 'deleted') Result.fail<IGetUserDTO>('User is deleted.');

        const { salt, hash } = await (async () => {
          if (userDTO.password) return await hashPassword(userDTO.password);
          return { salt: undefined, hash: undefined };
        })();

        const userOrError = User.create(
          {
            name: userDTO.name ?? user.name.value,
            role: userDTO.role ?? user.role.value,
            phoneNumber: userDTO.phoneNumber ?? user.phoneNumber.value,
            status: user.status.value,
            salt: salt ?? user.password.value.salt,
            hash: hash ?? user.password.value.hash,
          },
          user.mail.toString(),
        );

        if (userOrError.isFailure) {
          return Result.fail<IGetUserDTO>(userOrError.errorValue());
        }

        const userResult = userOrError.getValue();
        const updatedUser = await this.userRepo.save(userResult);
        const resultDTO = UserMap.toDTO(updatedUser);
        return Result.ok<IGetUserDTO>(resultDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(mail: string): Promise<Result<boolean>> {
    try {
      const user = await this.userRepo.findByMail(mail);

      if (user === null) return Result.fail<boolean>('User not found.');

      if (user.status.value === 'deleted') Result.fail<boolean>('User is deleted.');

      const userResult = user.anonymizedCopy();
      await this.userRepo.replace(mail, userResult);
      return Result.ok<boolean>();
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
