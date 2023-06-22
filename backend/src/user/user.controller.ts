import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from "src/auth/auth.guard";

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
  async getByID(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.getByID(id);
    if (!user) throw new NotFoundException('User not found');
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
