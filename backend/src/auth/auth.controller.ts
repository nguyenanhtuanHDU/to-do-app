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
import { Response, Request } from 'express';
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

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    console.log('fb login');

    return HttpStatus.OK;
  }

  @Get('facebook/proxy')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginProxy(@Res() res: Response): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      // data: req.user,
    };
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
