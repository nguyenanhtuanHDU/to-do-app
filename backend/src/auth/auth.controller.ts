import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO, LoginUserDTO } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Res() res) {
    res.send('run login google');
  }

  @Get('google/proxy')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    console.log('run proxy');
  }

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
