import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDTO, TaskDTO } from './task.dto';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';
import * as fs from 'fs';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  async deleteFile(fileName: string) {
    await fs.unlink('./src/assets/images/tasks/' + fileName, (error) => {
      if (error) {
        console.log(`🚀 ~ deleteTaskByID ~ error:`, error);
      }
    });
  }

  async getTasksByUserID(userID: string) {
    const tasks = await this.taskModel.find({ userID });
    return tasks;
  }

  async getTaskByID(taskID: string) {
    return await this.taskModel.findById(taskID);
  }

  async createATask(createTaskDTO: CreateTaskDTO, userID: string) {
    createTaskDTO.userID = userID;
    const task = await this.taskModel.create(createTaskDTO);
    const user = await this.userModel.findById(userID);
    user.tasks.push(task._id.toString());
    await user.save();
  }

  async doneTask(taskID: string) {
    const task = await this.taskModel.findByIdAndUpdate(taskID, {
      completed: true,
    });
    if (!task) throw new NotFoundException('Task not found');
  }

  async unDoneTask(taskID: string) {
    const task = await this.taskModel.findByIdAndUpdate(taskID, {
      completed: false,
    });
    if (!task) throw new NotFoundException('Task not found');
  }

  async editTaskByID(taskID: string, data) {
    console.log(`🚀 ~ editTaskByID ~ data:`, data);

    console.log(`🚀 ~ editTaskByID ~ taskID:`, taskID);

    const task = await this.getTaskByID(taskID);

    // xóa file cũ
    data.fileDeleted.forEach((file) => {
      task.files.splice(task.files.indexOf(file), 1);
      this.deleteFile(file);
    });

    // add file mới
    data.uploadedFileNames.forEach((file) => {
      task.files.push(file);
    });

    await task.save();

    // const task = await this.taskModel.findByIdAndUpdate(taskID, data);
    // if (!task) throw new NotFoundException('Task not found');
  }

  async deleteTaskByID(taskID: string, userID: string) {
    const task = await this.taskModel.findById(taskID);
    if (!task) throw new NotFoundException('Task not found');
    const user = await this.userModel.findById(userID);
    user.tasks.splice(user.tasks.indexOf(taskID), 1);
    task.files.map((fileName: string) => {
      this.deleteFile(fileName);
    });
    await this.taskModel.findByIdAndDelete(taskID);
    await user.save();
  }

  async deleteAllTasks() {
    await this.taskModel.deleteMany();
  }
}
