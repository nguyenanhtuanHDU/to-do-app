import { Exclude, Expose } from 'class-transformer';
import { IsBooleanString, IsEmail, IsIn, Length } from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';

export class UserDTO {
  @Expose()
  @Length(6)
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  // avatar: string

  @Exclude()
  @Length(6)
  password: string;

  @Expose()
  @IsIn(['Male', 'Female'])
  gender: string;

  @Expose()
  @IsBooleanString()
  admin: boolean;
}

export class CreateUserDTO extends OmitType(UserDTO, ['password'] as const) {
  @Expose()
  @Length(6)
  password: string;
}

export class UpdateUserDTO extends OmitType(CreateUserDTO, [
  'admin',
] as const) {}
