import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDTO,
  CreateUserWithEmailDTO,
  LoginUserDTO,
} from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterEmail } from './registerEmail.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RegisterEmail.name)
    private registerEmailModel: Model<RegisterEmail>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 10000);
    const paddedNumber = randomNumber.toString().padStart(4, '0');
    console.log(`🚀 ~ paddedNumber:`, paddedNumber);
    return paddedNumber;
  }

  async getAllCode() {
    return await this.registerEmailModel.find();
  }

  async login(loginUserDTO: LoginUserDTO): Promise<boolean> {
    const userFindByUsername = await this.userService.getByUsername(
      loginUserDTO.username,
    );
    const userFindByEmail = await this.userService.getByEmail(
      loginUserDTO.username,
    );
    if (!userFindByUsername && !userFindByEmail) {
      throw new NotFoundException('User not found');
    }
    let comparePassword = false;
    if (userFindByUsername) {
      comparePassword = await bcrypt.compare(
        loginUserDTO.password,
        userFindByUsername.password,
      );
      console.log(`🚀 ~ comparePassword username:`, comparePassword);
    } else if (userFindByEmail) {
      comparePassword = await bcrypt.compare(
        loginUserDTO.password,
        userFindByEmail.password,
      );
      console.log(`🚀 ~ comparePassword email:`, comparePassword);
    }
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

  async signUpWithEmail(userInfo: CreateUserWithEmailDTO) {
    userInfo.password = await bcrypt.hash(userInfo.password, 10);

    const user = await this.userService.createWithEmail(
      plainToClass(CreateUserWithEmailDTO, userInfo, {
        excludeExtraneousValues: true,
      }),
    );

    return user;
  }

  async verifyCode(data: any) {
    console.log(`🚀 ~ data:`, data);
    const registerEmail = await this.registerEmailModel
      .findOne({ email: data.email })
      .sort({ createdAt: -1 });
    if (!registerEmail) {
      return false;
    }
    console.log(`🚀 ~ registerEmail:`, registerEmail);
    if (registerEmail.codeConfirm === data.code.toString()) {
      return true;
    } else {
      return false;
    }
  }

  async sendCodeToEmail(email: string) {
    const userFindByEmail = await this.userService.getByEmail(email);
    if (userFindByEmail) throw new ConflictException('Email already exists');
    const codeConfirm = this.generateRandomNumber();
    this.mailerService.sendMail({
      // to: 'ledung160902@gmail.com',
      to: email,
      subject: 'To Do App Created By Tuanna Send Code To You',
      text: 'welcome',
      html: `<span>Your code is: <b>${codeConfirm}</b>. <br>Use it to access your account 
      <br>
      You have 1 minute to use it before it expires
      <br>
      If you didn't request this, simply ignore this message.
      <br>
      Yours,<br>
      Tuanna Developer</span>`,
    });
    console.log('codeConfirm: ', codeConfirm);

    const code = await this.registerEmailModel.create({
      email,
      codeConfirm: codeConfirm,
    });
    console.log(`🚀 ~ code:`, code);
  }
}
