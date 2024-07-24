export default interface IUserDTO {
  mail: string;
  name: string;
  role: string;
  password: string;
  status: string;
  phoneNumber: string;
}

export type ICreateUserDTO = Pick<IUserDTO, 'mail' | 'name' | 'role' | 'password' | 'phoneNumber'>;
export type IUpdateUserDTO = Partial<Pick<IUserDTO, 'name' | 'role' | 'password' | 'phoneNumber'>>;
export type IGetUserDTO = Pick<IUserDTO, 'mail' | 'name' | 'role' | 'status' | 'phoneNumber'>;
