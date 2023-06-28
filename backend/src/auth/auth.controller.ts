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
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CreateUserDTO,
  CreateUserWithEmailDTO,
  LoginUserDTO,
} from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('codes')
  async getAllCode(@Res() res: Response) {
    res.json(await this.authService.getAllCode());
  }

  @Get('refresh')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN];
    console.log(`🚀 ~ refreshToken:`, refreshToken);
    const authTokens = await this.authService.refreshToken(refreshToken);
    console.log(`🚀 ~ authTokens.newRefreshToken:`, authTokens.newRefreshToken);
    res.cookie(process.env.REFRESH_TOKEN, authTokens.newRefreshToken, {
      sameSite: 'strict',
      path: '/',
      secure: true,
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json({
      accessToken: authTokens.newAccessToken,
    });
  }

  @Get('logout')
  async logOut(@Res() res: Response, @Req() req: Request) {
    await this.authService.logOut();
    res.status(HttpStatus.OK).json({
      message: 'Log out successfully',
    });
  }

  @Post('login')
  async login(
    @Body() loginUserDTO: LoginUserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const authTokens = await this.authService.login(loginUserDTO);
    res.cookie(process.env.REFRESH_TOKEN, authTokens.refreshToken, {
      sameSite: 'strict',
      path: '/',
      secure: true,
      httpOnly: true,
    });

    res.cookie('userID', authTokens.userID, {
      sameSite: 'strict',
      path: '/',
      secure: true,
      httpOnly: true,
    });

    console.log('req cookie 1', req.cookies);

    res.status(HttpStatus.OK).json({
      message: 'Login successfully',
      accessToken: authTokens.accessToken,
    });
  }

  @Post('login-google')
  async loginGoogle(@Req() req: Request, @Res() res: Response) {
    const authTokens = await this.authService.loginGoogle(req.body.credential);
    res.cookie(process.env.REFRESH_TOKEN, authTokens.refreshToken, {
      sameSite: 'strict',
      path: '/',
      secure: true,
      httpOnly: true,
    });
    res.cookie('token', authTokens.accessToken);
    res.cookie('userAvatar', authTokens.userAvatar);
    res.redirect(process.env.FRONTEND_URL);
  }

  @Post('sign-up')
  async signUp(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
    console.log(`🚀 ~ createUserDTO:`, createUserDTO);

    await this.authService.signUp(createUserDTO);
    res.status(HttpStatus.OK).json({
      message: 'Sign Up successfully',
    });
  }

  @Post('sign-up-google')
  async signUpGoogle(@Req() req: Request, @Res() res: Response) {
    await this.authService.signUpGoogle(req.body.credential);
    res.redirect(process.env.FRONTEND_URL + 'auth/login');
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
