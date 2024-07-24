import IUserDTO from './IUserDTO';

export interface IAuthRequestDTO {
  mail: string;
  password: string;
}

export interface IAuthResponseDTO {
  token: string;
  refresh: string;
}

export interface IGooleOAuthRequestDTO {
  credential: string;
}

export interface IRenewRequestDTO {
  refresh: string;
}

export type IAuthenticatedUser = Pick<IUserDTO, 'mail' | 'name' | 'role' | 'phoneNumber' | 'status'>;
