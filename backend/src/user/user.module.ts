import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { RefreshToken, RefreshTokenSchema } from 'src/auth/refreshToken.schema';
import { AuthService } from 'src/auth/auth.service';
import {
  RegisterEmail,
  RegisterEmailSchema,
} from 'src/auth/registerEmail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RegisterEmail.name, schema: RegisterEmailSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
