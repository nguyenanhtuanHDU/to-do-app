import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { RefreshToken } from './refreshToken.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // @InjectModel(RefreshToken.name)
    // private refreshTokenlModel: Model<RefreshToken>,
    private readonly authService: AuthService,
  ) {}

  generateToken(payload: any, expiresIn: string) {
    const token = this.jwtService.signAsync(payload, { expiresIn });
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const accessToken = req.headers.token.split(' ')[1];
    console.log(`🚀 ~ accessToken:`, accessToken);

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing.');
    }
    try {
      this.jwtService.verify(accessToken);
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
      throw new UnauthorizedException('Access token is expired');
    }
    return true;
  }
}
