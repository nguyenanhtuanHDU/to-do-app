export interface UserLogin {
  username?: string;
  email?: string;
  password: string;
}

export interface UserCreate extends UserLogin {
  gender: string;
}

export interface User extends Omit<UserLogin, 'password'> {
  fullName: string;
  admin: boolean;
  avatar?: string
}
