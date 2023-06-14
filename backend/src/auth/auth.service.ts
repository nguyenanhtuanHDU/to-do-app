import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from 'src/user/user.dto';
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

  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    console.log(`🚀 ~ createUserDTO 1:`, createUserDTO)

    const userFind = await this.userService.getByUsername(
      createUserDTO.username,
    );
    if (userFind) throw new ConflictException('Username already exists');
    const user = await this.userService.create(createUserDTO);
    if (!user) throw new BadRequestException();
    return true;
  }
}
