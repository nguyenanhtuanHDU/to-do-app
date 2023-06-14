import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDTO } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response) {
    console.log(`🚀 ~ loginUserDTO:`, loginUserDTO)

    await this.authService.login(loginUserDTO);
    res.status(HttpStatus.OK).json({
      message: 'Login successfully',
    });
  }
}
