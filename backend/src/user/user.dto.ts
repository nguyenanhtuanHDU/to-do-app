import { Exclude, Expose } from 'class-transformer';
import { IsBooleanString, IsEmail, IsIn, Length } from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';

export class UserDTO {
  @Expose()
  _id: string;

  @Expose()
  @Length(6)
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  // avatar: string
  @Expose()
  @Length(6)
  password: string;

  @Expose()
  @IsIn(['Male', 'Female'])
  gender: string;

  @Expose()
  @IsBooleanString()
  admin: string;
}

export class CreateUserDTO extends OmitType(UserDTO, [
  'email',
  '_id',
  'admin',
] as const) {}

export class CreateUserWithEmailDTO extends PickType(UserDTO, [
  'email',
] as const) {
  @Expose()
  @Length(6)
  password: string;
}

export class UpdateUserDTO extends CreateUserDTO {}

export class LoginUserDTO extends PartialType(
  PickType(UserDTO, ['username', 'email'] as const),
) {
  @Expose()
  @Length(6)
  password: string;
}
