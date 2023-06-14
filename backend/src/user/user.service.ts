import { Injectable } from '@nestjs/common';
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserDTO,
} from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAll() {
    return await this.userModel.find();
  }

  async getByID(userID: string): Promise<UserDTO> {
    try {
      const user = await this.userModel.findByIdAndDelete(userID);
      console.log(`🚀 ~ user:`, user);
      if (!user) return null;
      else
        return plainToClass(UserDTO, user, { excludeExtraneousValues: true });
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
    }
  }

  async getByUsername(username: string): Promise<LoginUserDTO> {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;
    else
      return plainToClass(LoginUserDTO, user, {
        excludeExtraneousValues: true,
      });
  }

  async create(createUserDTO: CreateUserDTO): Promise<CreateUserDTO> {
    console.log(`🚀 ~ createUserDTO:`, createUserDTO);

    const user = await plainToClass(CreateUserDTO, createUserDTO, {
      excludeExtraneousValues: true,
    });
    console.log(`🚀 ~ user:`, user);

    user.password = await bcrypt.hash(user.password, 10);
    return await this.userModel.create(user);
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
      console.log(`🚀 ~ user:`, user);
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
