import assert, { AssertionError } from 'assert';
import jwt, { Algorithm } from 'jsonwebtoken';
import config from '../../config';
import { IAuthenticatedUser } from '../dto/IAuthDTO';
import { Result } from '../core/logic/Result';

const algorithm = config.jwtAlgorithm as Algorithm;
const publicKey = config.jwtPublicKey;

export function parseToken(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: [algorithm],
    }) as Omit<IAuthenticatedUser, 'token'>;
    assert(decoded.mail, 'No mail defined');
    assert(decoded.name, 'No name defined');
    assert(decoded.role, 'No role defined');
    return Result.ok<IAuthenticatedUser>({ ...decoded, token });
  } catch (err) {
    if (err instanceof AssertionError) {
      return Result.fail<IAuthenticatedUser>(`Invalid token: {err.message}`);
    }
    return Result.fail<IAuthenticatedUser>('Invalid token');
  }
}
