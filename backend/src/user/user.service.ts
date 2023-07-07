import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDTO,
  CreateUserWithEmailDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserDTO,
  UserSecureDTO,
} from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAll() {
    return await this.userModel.find();
  }

  async getByID(userID: string) {
    const user = await this.userModel.findById(userID);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByUsername(username: string): Promise<UserDTO> {
    const user = await this.userModel.findOne({ username });

    if (!user) return null;
    return plainToClass(UserDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async getByEmail(email: string) {
    console.log('email: ', email);
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    return user;
  }

  async create(userInfo: CreateUserDTO): Promise<CreateUserDTO> {
    const user = await plainToClass(CreateUserDTO, userInfo, {
      excludeExtraneousValues: true,
    });

    user.password = await bcrypt.hash(user.password, 10);
    return await this.userModel.create(user);
  }

  // async createWithEmail(
  //   userInfo: CreateUserWithEmailDTO,
  // ): Promise<CreateUserWithEmailDTO> {
  //   const user = await this.userModel.create(userInfo)
  //   console.log('user create: ', user);
  //   if (!user) throw new BadRequestException();
  //   return user;
  // }

  async createWithEmail(userInfo) {
    console.log(`🚀 ~ userInfo:`, userInfo);
    const user = await this.userModel.create(userInfo);
    return user;
  }

  async update(userID: string, userDTO: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userID,
        plainToClass(UpdateUserDTO, userDTO, { excludeExtraneousValues: true }),
      );
      if (!user) return null;
      else
        return plainToClass(UserDTO, user, {
          excludeExtraneousValues: true,
        });
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
    return null;
  }

  async delete(userID: string) {
    try {
      const user = await this.userModel.findByIdAndRemove(userID);
      if (!user) return false;
      else return user;
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
  }

  async deleteAll() {
    await this.userModel.deleteMany();
  }
}
