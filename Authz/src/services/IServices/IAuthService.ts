import { Result } from '../../core/logic/Result';
import { IAuthRequestDTO, IAuthResponseDTO, IGooleOAuthRequestDTO, IRenewRequestDTO } from '../../dto/IAuthDTO';

export default interface IAuthService {
  login(dto: IAuthRequestDTO): Promise<Result<IAuthResponseDTO>>;
  googleLogin(dto: IGooleOAuthRequestDTO): Promise<Result<IAuthResponseDTO>>;
  renew(dto: IRenewRequestDTO): Promise<Result<IAuthResponseDTO>>;
}
