import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
