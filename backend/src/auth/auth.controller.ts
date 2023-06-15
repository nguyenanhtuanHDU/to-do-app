import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO, LoginUserDTO } from 'src/user/user.dto';
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

  @Get('mail')
  async senMail() {
    return await this.authService.sendMail();
  }
}
