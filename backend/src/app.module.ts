import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TaskModule } from './tasks/task.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProjectModule } from './projects/project.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    ProjectModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_LINK, {
      useNewUrlParser: true,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('is connected');
        });
        connection.on('disconnected', () => {
          console.log('DB disconnected');
        });
        connection.on('error', (error) => {
          console.log('DB connection failed! for error: ', error);
        });
        return connection;
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
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
    ServeStaticModule.forRoot({
      rootPath: join('./src/assets/images'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
