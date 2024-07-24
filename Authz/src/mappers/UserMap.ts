import { Mapper } from '../core/infra/Mapper';
import { IUserPersistence } from '../dataschema/IUserPersistence';
import { IGetUserDTO } from '../dto/IUserDTO';
import { User } from '../domain/user/user';

export class UserMap extends Mapper<User> {
  public static toDTO(user: User): IGetUserDTO {
    const dto: IGetUserDTO = {
      mail: user.mail.toString(),
      name: user.name.value,
      role: user.role.value,
      status: user.status.value,
      phoneNumber: user.phoneNumber.value,
    };
    return dto;
  }

  public static toDomain(schema: IUserPersistence): User {
    const model = User.create(
      {
        name: schema.name,
        role: schema.role,
        salt: schema.salt,
        hash: schema.hash,
        status: schema.status,
        phoneNumber: schema.phoneNumber,
      },
      schema.mail,
    );
    return model.getValue();
  }

  public static toPersistence(user: User): IUserPersistence {
    return {
      mail: user.mail.toString(),
      name: user.name.value,
      role: user.role.value,
      salt: user.password.value.salt,
      hash: user.password.value.hash,
      status: user.status.value,
      phoneNumber: user.phoneNumber.value,
    };
  }
}
