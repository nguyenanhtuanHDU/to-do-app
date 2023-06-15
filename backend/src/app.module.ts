import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_LINK, {
      useNewUrlParser: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        // host: 'smtppro.zoho.in',
        port: 465,
        secure: true,
        auth: {
          user: 'todoapp0204@gmail.com', // bật xác minh 2 bước cho gmail
          pass: 'iinvtbxrsbdufotp', // mật khẩu ứng dụng
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '<modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates/email',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
