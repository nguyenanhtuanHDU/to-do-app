export interface UserLogin {
  username?: string;
  email?: string;
  password: string;
}

export interface UserCreate extends UserLogin{
  gender: string
}
