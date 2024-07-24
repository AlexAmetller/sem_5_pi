import { Service, Inject } from 'typedi';
import config from '../../config';
import { Result } from '../core/logic/Result';
import { IAuthRequestDTO, IAuthResponseDTO, IGooleOAuthRequestDTO, IRenewRequestDTO } from '../dto/IAuthDTO';
import { verifyGoogleToken } from '../utils/OAuthUtils';
import { generateToken, verifyPassword, verifyRefreshToken } from '../utils/PasswordUtils';
import IUserRepo from './IRepos/IUserRepo';
import IAuthService from './IServices/IAuthService';

@Service()
export default class AuthService implements IAuthService {
  constructor(@Inject(config.repos.user.name) private userRepo: IUserRepo) {}

  async login(dto: IAuthRequestDTO): Promise<Result<IAuthResponseDTO>> {
    const user = await this.userRepo.findByMail(dto.mail);

    if (user === null) return Result.fail<IAuthResponseDTO>('Login failed.');

    if (user.status.value !== 'active') return Result.fail<IAuthResponseDTO>('User is deleted.');

    const correctPassword = await verifyPassword(user, dto.password);

    if (!correctPassword) return Result.fail<IAuthResponseDTO>('Login failed.');

    const { token, refresh } = generateToken(user);

    return Result.ok<IAuthResponseDTO>({ token, refresh });
  }

  async googleLogin(dto: IGooleOAuthRequestDTO): Promise<Result<IAuthResponseDTO>> {
    const result = await verifyGoogleToken(dto.credential);

    if (!result) return Result.fail<IAuthResponseDTO>('Invalid credential.');

    const user = await this.userRepo.findByMail(result.mail);

    if (user === null) return Result.fail<IAuthResponseDTO>('User is not registered.');

    const { token, refresh } = generateToken(user);

    return Result.ok<IAuthResponseDTO>({ token, refresh });
  }

  async renew(dto: IRenewRequestDTO): Promise<Result<IAuthResponseDTO>> {
    const renew = verifyRefreshToken(dto.refresh);

    if (renew.isFailure) return Result.fail<IAuthResponseDTO>('Invalid refresh token.');

    const user = await this.userRepo.findByMail(renew.getValue().mail);

    if (user === null) return Result.fail<IAuthResponseDTO>('User is not registered.');

    const { token, refresh } = generateToken(user);

    return Result.ok<IAuthResponseDTO>({ token, refresh });
  }
}
