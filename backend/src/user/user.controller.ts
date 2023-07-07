import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Res() res: Response) {
    const users = await this.userService.getAll();
    res.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  async getByID(@Param('id') id: string, @Res() res: Response): Promise<IUser> {
    const user = await this.userService.getByID(id);
     res.status(HttpStatus.OK).json(user);
     return user
  }

  @Get('user/session')
  async getUserSession(@Res() res: Response, @Req() req: Request) {
    const userID = req.cookies.userID;
    console.log(`🚀 ~ getUserSession ~ req.cookies:`, req.cookies)

    console.log(`🚀 ~ getUserSession ~ userID:`, userID)

    const user = await this.userService.getByID(userID);
    res.status(HttpStatus.OK).json(user);
  }

  @Post()
  async create(@Body() userDTO: CreateUserDTO, @Res() res: Response) {
    await this.userService.create(userDTO);
    res.status(HttpStatus.OK).json({
      message: 'create user succeffully',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userDTO: UpdateUserDTO,
    @Res() res: Response,
  ) {
    const user = await this.userService.update(id, userDTO);
    if (!user) throw new NotFoundException('User not found');
    else
      res.status(HttpStatus.OK).json({
        message: 'Update user successfully',
        data: user,
      });
  }

  @Delete(':id')
  async deleteByID(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.delete(id);
    if (!user) throw new NotFoundException('User not found');
    else
      res.status(HttpStatus.OK).json({ message: 'Delete user successfully' });
  }

  @Delete()
  async deleteAllUsers(@Res() res: Response) {
    await this.userService.deleteAll();
    res.status(HttpStatus.OK).json({ message: 'Delete all user successfully' });
  }
}
