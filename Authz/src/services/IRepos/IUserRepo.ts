import { Repo } from '../../core/infra/Repo';
import { User } from '../../domain/user/user';

export default interface IUserRepo extends Repo<User> {
  save(user: User): Promise<User>;
  replace(mail: string, user: User): Promise<void>;
  findByMail(mail: string): Promise<User>;
  findAll(): Promise<User[]>;
}
