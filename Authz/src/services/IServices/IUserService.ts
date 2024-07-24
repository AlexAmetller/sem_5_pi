import { Result } from '../../core/logic/Result';
import { ICreateUserDTO, IGetUserDTO, IUpdateUserDTO } from '../../dto/IUserDTO';

export default interface IUserService {
  createUser(userDTO: ICreateUserDTO): Promise<Result<IGetUserDTO>>;
  updateUser(mail: string, userDto: IUpdateUserDTO): Promise<Result<IGetUserDTO>>;
  getUser(mail: string): Promise<Result<IGetUserDTO>>;
  getUsers(): Promise<Result<IGetUserDTO[]>>;
  deleteUser(mail: string): Promise<Result<boolean>>;
}
