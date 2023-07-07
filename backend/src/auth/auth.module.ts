import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RegisterEmail, RegisterEmailSchema } from './registerEmail.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken, RefreshTokenSchema } from './refreshToken.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from "src/user/user.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
    }),
    MongooseModule.forFeature([
      { name: RegisterEmail.name, schema: RegisterEmailSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
