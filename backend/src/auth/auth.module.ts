import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RegisterEmail, RegisterEmailSchema } from './registerEmail.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: RegisterEmail.name, schema: RegisterEmailSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
