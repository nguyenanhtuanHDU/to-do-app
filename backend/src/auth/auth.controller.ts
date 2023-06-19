import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CreateUserDTO,
  CreateUserWithEmailDTO,
  LoginUserDTO,
} from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response) {
    console.log(`🚀 ~ loginUserDTO:`, loginUserDTO);

    await this.authService.login(loginUserDTO);
    res.status(HttpStatus.OK).json({
      message: 'Login successfully',
    });
  }

  @Post('sign-up')
  async signUp(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
    console.log(`🚀 ~ createUserDTO:`, createUserDTO);

    await this.authService.signUp(createUserDTO);
    res.status(HttpStatus.OK).json({
      message: 'Sign Up successfully',
    });
  }

  @Post('sign-up/email')
  async signUpWithEmail(
    @Body() userInfo: CreateUserWithEmailDTO,
    @Res() res: Response,
  ) {
    const user = await this.authService.signUpWithEmail(userInfo);
    if (!user) {
      throw new BadRequestException();
    }
    res.status(HttpStatus.OK).json({
      message: 'Sign Up successfully',
    });
  }

  @Post('sign-up/verify-code')
  async verifyCode(@Body() data, @Res() res: Response, @Req() req: Request) {
    const checkCode = await this.authService.verifyCode(data);
    console.log(`🚀 ~ checkCode:`, checkCode);
    if (!checkCode) {
      throw new HttpException('Incorrect code', HttpStatus.BAD_REQUEST);
    } else {
      res.status(200).json({ message: 'Code verified. Well done!' });
    }
  }

  @Post('sign-up/verify-email')
  async verifyEmail(@Body() { email }, @Res() res: Response) {
    await this.authService.sendCodeToEmail(email);
    res.cookie('email_sign_up', email);
    res.status(HttpStatus.OK).json({
      message: 'Send code to ' + email + ' successfully',
    });
  }
}
