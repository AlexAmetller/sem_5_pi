import { Inject, Service } from 'typedi';

import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserRepo from '../services/IRepos/IUserRepo';
import { User } from '../domain/user/user';
import { UserMap } from '../mappers/UserMap';

@Service()
export default class UserRepo implements IUserRepo {
  constructor(@Inject('userSchema') private userSchema: Model<IUserPersistence & Document>) {}

  public async save(user: User): Promise<User> {
    const query = { mail: user.mail.toString() };
    const userDocument = await this.userSchema.findOne(query);
    const rawUser: IUserPersistence = UserMap.toPersistence(user);

    try {
      if (userDocument === null) {
        const userCreated = await this.userSchema.create(rawUser);

        return UserMap.toDomain(userCreated);
      } else {
        Object.assign(userDocument, rawUser);

        await userDocument.save();

        return UserMap.toDomain(userDocument);
      }
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }

  public async findByMail(mail: string): Promise<User> {
    const record = await this.userSchema.findOne({ mail });

    if (record != null) {
      return UserMap.toDomain(record);
    } else {
      return null;
    }
  }

  public async findAll(): Promise<User[]> {
    const record = await this.userSchema.find();

    if (record != null) {
      const resultDTO = record.map(item => UserMap.toDomain(item));
      return resultDTO;
    } else {
      return null;
    }
  }

  exists(_t: User): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async replace(mail: string, user: User): Promise<void> {
    try {
      const query = { mail: mail.toString() };
      const rawUser: IUserPersistence = UserMap.toPersistence(user);
      await this.userSchema.updateOne(query, rawUser);
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
