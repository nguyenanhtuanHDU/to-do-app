import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginUserDTO: LoginUserDTO): Promise<boolean> {
    const user = await this.userService.getByUsername(loginUserDTO.username);
    if (!user) throw new NotFoundException('User not found');
    const comparePassword = await bcrypt.compare(
      loginUserDTO.password,
      user.password,
    );
    if (!comparePassword) throw new UnauthorizedException('Invalid password');
    return true;
  }

  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    console.log(`🚀 ~ createUserDTO 1:`, createUserDTO);

    const userFind = await this.userService.getByUsername(
      createUserDTO.username,
    );
    if (userFind) throw new ConflictException('Username already exists');
    const user = await this.userService.create(createUserDTO);
    if (!user) throw new BadRequestException();
    return true;
  }

  async sendMail() {
    console.log('run');
    this.mailerService.sendMail({
      // to: 'anhtuan02042002@gmail.com', // list of receivers
      to: 'ledung160902@gmail.com',
      // from: 'anhtuan02042002@gmail.com', // sender address
      subject: 'To Do App Created By Tuanna ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>Welcome to my application !</b>', // HTML body content
    });
  }
}
