import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTaskDTO } from './task.dto';
import { Response, Request } from 'express';
import { TaskService } from './task.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const customFilename = (req, file, callback) => {
  const userID = req.cookies.userID;
  const customName = userID + '-' + Date.now();
  const fileExtension = extname(file.originalname);
  const fileName = `${customName}${fileExtension}`;
  uploadedFileNames.push(fileName);
  return callback(null, fileName);
};

const deleteFilesName = (userID: string) => {
  uploadedFileNames = uploadedFileNames.filter(
    (file) => !file.includes(userID),
  );
};

let uploadedFileNames: string[] = [];

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':userID')
  async getAll(@Param('userID') userID: string, @Res() res: Response) {
    const tasks = await this.taskService.getTasksByUserID(userID.toString());
    res.status(HttpStatus.OK).json(tasks);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file' }], {
      storage: diskStorage({
        destination: './src/assets/images/tasks',
        filename: (req, file, callback) => customFilename(req, file, callback),
      }),
    }),
  )
  async create(
    @Body('data') data,
    @UploadedFiles() file: { file: Express.Multer.File[] },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const taskData = JSON.parse(data);
    console.log(`🚀 ~ taskData:`, taskData);

    taskData.files = uploadedFileNames;

    const userID = req.cookies.userID;

    await this.taskService.createATask(taskData, userID);
    deleteFilesName(userID);

    res.status(HttpStatus.OK).json({
      message: 'Create task successfully',
    });
  }

  @Put(':taskID')
  async doneTask(
    @Body('type') type: string,
    // @Body() editTaskDTO:
    @Param('taskID') taskID: string,
    @Res() res: Response,
  ) {
    if (type === 'DONE_TASK') {
      await this.taskService.doneTask(taskID);
    } else if (type === 'UNDONE_TASK') {
      await this.taskService.unDoneTask(taskID);
    }
    res.status(HttpStatus.OK).json({
      message: 'ok',
    });
  }

  @Put('task/:taskID')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file' }], {
      storage: diskStorage({
        destination: './src/assets/images/tasks',
        filename: (req, file, callback) => customFilename(req, file, callback),
      }),
    }),
  )
  async editTask(
    @Body('data') data,
    @UploadedFiles() file: { file: Express.Multer.File[] },
    @Param('taskID') taskID: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const taskData = JSON.parse(data);
    taskData.uploadedFileNames = uploadedFileNames;
    await this.taskService.editTaskByID(taskID, taskData);
    res.status(HttpStatus.OK).json({
      message: 'Update Task successfully',
    });
  }

  @Put()
  async updateAll(@Body() data: any) {
    await this.taskService.updateAllTasks(data);
  }

  @Delete(':id')
  async delete(
    @Param('id') taskID: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(`🚀 ~ taskID:`, taskID);
    const userID = req.cookies.userID;
    console.log(`🚀 ~ userID:`, userID);

    await this.taskService.deleteTaskByID(taskID, userID);
    res.status(HttpStatus.OK).json({
      message: 'Delete task successfully',
    });
  }

  @Delete()
  async deleteAll(@Res() res: Response) {
    await this.taskService.deleteAllTasks();
    res.status(HttpStatus.OK).json({
      message: 'Delete all task successfully',
    });
  }
}
