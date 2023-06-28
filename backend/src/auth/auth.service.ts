import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDTO,
  CreateUserWithEmailDTO,
  LoginUserDTO,
  UserDTO,
  UserSecureDTO,
} from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterEmail } from './registerEmail.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './refreshToken.schema';
import { OAuth2Client } from 'google-auth-library';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RegisterEmail.name)
    private registerEmailModel: Model<RegisterEmail>,
    @InjectModel(RefreshToken.name)
    private refreshTokenlModel: Model<RefreshToken>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 10000);
    const paddedNumber = randomNumber.toString().padStart(4, '0');
    return paddedNumber;
  }

  async generateToken(payload: any, expiresIn: string) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    return token;
  }

  async generateAccessToken(payload: any) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10s',
    });
    return token;
  }

  async generateRefreshToken(payload: any) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    return token;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Token empty');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      if (payload) {
        const refreshTokenFind = await this.refreshTokenlModel.findOne({
          userID: payload.id,
        });

        if (!refreshTokenFind) {
          throw new UnauthorizedException('Token does not exist');
        }
        const checkRefreshToken = await bcrypt.compare(
          refreshToken,
          refreshTokenFind.refreshToken,
        );

        if (!checkRefreshToken) {
          throw new UnauthorizedException('Token has been logged out');
        }
        delete payload.iat;
        delete payload.exp;

        const newAccessToken = await this.generateAccessToken(payload);
        const newRefreshToken = await this.generateRefreshToken(payload);

        await this.refreshTokenlModel.deleteMany();

        this.refreshTokenlModel.create({
          userID: payload.id,
          refreshToken: await bcrypt.hash(newRefreshToken, 12),
        });
        return { newAccessToken, newRefreshToken };
      }
    } catch (error) {
      throw new UnauthorizedException('Token has expired');
    }
  }

  async getAllCode() {
    return await this.registerEmailModel.find();
  }

  async login(loginUserDTO: LoginUserDTO) {
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
    } else if (userFindByEmail) {
      comparePassword = await bcrypt.compare(
        loginUserDTO.password,
        userFindByEmail.password,
      );
    }
    if (!comparePassword) throw new UnauthorizedException('Invalid password');

    const payload = {
      id: userFindByUsername._id,
      admin: userFindByUsername.admin,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    this.refreshTokenlModel.create({
      userID: userFindByUsername._id,
      refreshToken: await bcrypt.hash(refreshToken, 12),
    });

    return { accessToken, refreshToken, userID: payload.id };
  }

  async loginGoogle(accessTokenGoogle: string) {
    const client = new OAuth2Client(
      '57178918226-rk75u2a5tl255sv4l0jtv857nqhfulob.apps.googleusercontent.com',
    );
    const ticket = await client.verifyIdToken({
      idToken: accessTokenGoogle,
      audience:
        '57178918226-rk75u2a5tl255sv4l0jtv857nqhfulob.apps.googleusercontent.com',
    });
    const payloadGoogle = ticket.getPayload();

    const user = await this.userService.getByEmail(payloadGoogle.email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    // this.cacheService.setUserSession(user);
    await this.cacheManager.set(
      'userSession',
      plainToClass(UserSecureDTO, user),
      Number.MAX_SAFE_INTEGER,
    );
    const payload = {
      id: user._id,
      admin: user.admin,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    this.refreshTokenlModel.create({
      userID: user._id,
      refreshToken: await bcrypt.hash(refreshToken, 12),
    });

    return {
      accessToken,
      refreshToken,
      userAvatar: payloadGoogle.picture,
    };
  }

  async logOut() {
    const user = await this.cacheManager.get('userSession');
    await this.refreshTokenlModel.findOneAndDelete({
      userID: user._id,
    });
  }

  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    const userFind = await this.userService.getByUsername(
      createUserDTO.username,
    );
    if (userFind) throw new ConflictException('Username already exists');
    const user = await this.userService.create(createUserDTO);
    if (!user) throw new BadRequestException();
    return true;
  }

  async signUpGoogle(accessTokenGoogle: string): Promise<boolean> {
    const client = new OAuth2Client(
      '57178918226-rk75u2a5tl255sv4l0jtv857nqhfulob.apps.googleusercontent.com',
    );

    const ticket = await client.verifyIdToken({
      idToken: accessTokenGoogle,
      audience:
        '57178918226-rk75u2a5tl255sv4l0jtv857nqhfulob.apps.googleusercontent.com',
    });
    const payloadGoogle = ticket.getPayload();

    const userFind = await this.userService.getByEmail(payloadGoogle.email);
    if (userFind) {
      return true;
    }
    const user = await this.userService.createWithEmail({
      fullName: payloadGoogle.name,
      email: payloadGoogle.email,
    });
    if (!user) throw new BadRequestException();
    return true;
  }

  async verifyCode(data: any) {
    const registerEmail = await this.registerEmailModel
      .findOne({ email: data.email })
      .sort({ createdAt: -1 });
    if (!registerEmail) {
      return false;
    }
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
  }
}
