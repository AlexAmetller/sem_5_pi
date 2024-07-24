import assert, { AssertionError } from 'assert';
import bcrypt from 'bcrypt';
import { User } from '../domain/user/user';
import jwt, { Algorithm } from 'jsonwebtoken';
import config from '../../config';
import { IAuthenticatedUser } from '../dto/IAuthDTO';
import { Result } from '../core/logic/Result';

const saltRounds = 5;

const algorithm = config.jwtAlgorithm as Algorithm;
const privateKey = config.jwtPrivateKey;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return {
    hash,
    salt,
  };
}

export async function verifyPassword(user: User, password: string) {
  const hash = await bcrypt.hash(password, user.password.value.salt);
  return hash === user.password.value.hash;
}

export function generateToken(user: User) {
  const token = jwt.sign(
    {
      mail: user.mail.toString(),
      name: user.name.value,
      role: user.role.value,
      phoneNumber: user.phoneNumber.value,
      status: user.status.value,
    },
    privateKey,
    {
      expiresIn: '1d',
      algorithm,
    },
  );
  const refresh = jwt.sign(
    {
      mail: user.mail.toString(),
    },
    privateKey,
    {
      expiresIn: '7d',
      algorithm,
    },
  );
  return { token, refresh };
}

export function parseToken(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey, {
      algorithms: [algorithm],
    }) as IAuthenticatedUser;
    assert(decoded.mail, 'No mail defined');
    assert(decoded.name, 'No name defined');
    assert(decoded.role, 'No role defined');
    return Result.ok<IAuthenticatedUser>(decoded);
  } catch (err) {
    if (err instanceof AssertionError) {
      return Result.fail<IAuthenticatedUser>(`Invalid token: {err.message}`);
    }
    return Result.fail<IAuthenticatedUser>('Invalid token');
  }
}

export function verifyRefreshToken(renew: string) {
  try {
    const decoded = jwt.verify(renew, privateKey, {
      algorithms: [algorithm],
    });
    assert(decoded['mail'], 'No mail defined');
    return Result.ok<{ mail: string }>({ mail: decoded['mail'] });
  } catch (err) {
    if (err instanceof AssertionError) {
      return Result.fail<{ mail: string }>(`Invalid token: {err.message}`);
    }
    return Result.fail<{ mail: string }>('Invalid token');
  }
}
