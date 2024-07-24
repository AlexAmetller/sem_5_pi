import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { UserMail } from './userMail';
import { UserName } from './userName';
import { UserRole } from './userRole';
import { UserPassword } from './userPassword';
import { UserStatus } from './userStatus';
import { UserPhoneNumber } from './userPhone';
import { v4 as uuid } from 'uuid';

export interface UserProps {
  mail: UserMail;
  name: UserName;
  role: UserRole;
  phoneNumber: UserPhoneNumber;
  status: UserStatus;
  password: UserPassword;
}

export class User extends AggregateRoot<UserProps> {
  get id(): UserMail {
    return this.mail;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      name: string;
      role: string;
      hash: string;
      salt: string;
      status: string;
      phoneNumber: string;
    },
    mail: string,
  ): Result<User> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.hash, argumentName: 'hash' },
      { argument: props.salt, argumentName: 'salt' },
      { argument: props.status, argumentName: 'status' },
      { argument: props.phoneNumber, argumentName: 'phoneNumber' },
      { argument: mail, argumentName: 'mail' },
    ];

    const entityProps = {
      mail: UserMail.create(mail),
      name: UserName.create(props.name),
      role: UserRole.create(props.role),
      status: UserStatus.create(props.status),
      phoneNumber: UserPhoneNumber.create(props.phoneNumber),
      password: UserPassword.create(props.hash, props.salt),
    };

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefinedBulk(guardedProps),
      Guard.againstFailedResults(Object.values(entityProps)),
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.errors);
    } else {
      const user = new User(
        {
          mail: entityProps.mail.getValue(),
          name: entityProps.name.getValue(),
          role: entityProps.role.getValue(),
          status: entityProps.status.getValue(),
          phoneNumber: entityProps.phoneNumber.getValue(),
          password: entityProps.password.getValue(),
        },
        entityProps.mail.getValue(),
      );
      return Result.ok<User>(user);
    }
  }

  get mail(): UserMail {
    return this.props.mail;
  }

  get name(): UserName {
    return this.props.name;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get phoneNumber(): UserPhoneNumber {
    return this.props.phoneNumber;
  }

  anonymizedCopy(): User {
    const anonymizeMail = (mail: string): string => {
      const random = Buffer.from(uuid()).toString('base64');
      return mail.replace(/^(\S{3})(\S+)@(\S+)$/, '$1+' + random + '@$3');
    };
    const anonymizePhone = (phone: string): string => {
      return phone.replace(/[0-9]/g, '9');
    };
    const anonymizeName = (name: string): string => {
      return name.replace(/[a-z]/g, 'x');
    };
    return new User(
      {
        mail: UserMail.create(anonymizeMail(this.mail.toString())).getValue(),
        phoneNumber: UserPhoneNumber.create(anonymizePhone(this.phoneNumber.value)).getValue(),
        name: UserName.create(anonymizeName(this.name.value)).getValue(),
        status: UserStatus.create('deleted').getValue(),
        role: this.role,
        password: this.password,
      },
      this.mail,
    );
  }
}
