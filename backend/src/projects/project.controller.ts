import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CreateProjectDTO, EditProjectDTO } from './project.dto';
import { Response } from 'express';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('project/:projectID')
  async getById(@Param('projectID') projectID: string, @Res() res: Response) {
    console.log(`🚀 ~ projectID:`, projectID);
    const project = await this.projectService.getProjectByID(projectID);
    res.status(HttpStatus.OK).json(project);
  }

  @Get()
  async getAll(@Res() res: Response) {
    const projects = await this.projectService.getAllProjects();
    res.status(HttpStatus.OK).json(projects);
  }

  @Post()
  async create(
    @Body() createProjectDTO: CreateProjectDTO,
    @Res() res: Response,
  ) {
    console.log(`🚀 ~ createProjectDTO:`, createProjectDTO);

    await this.projectService.createProject(createProjectDTO);
    res.status(HttpStatus.OK).json({
      message: 'Create project successfully',
    });
  }

  @Put('project/:projectID')
  async editProject(
    @Param('projectID') projectID: string,
    @Body() editProjectDTO: EditProjectDTO,
    @Res() res: Response,
  ) {
    console.log(`🚀 ~ projectID:`, projectID);

    console.log(`🚀 ~ editProjectDTO:`, editProjectDTO);
    await this.projectService.editProjectByID(projectID, editProjectDTO);
    res.status(HttpStatus.OK).json({
      message: 'Edit project successfully',
    });
  }

  @Delete('project/:projectID')
  async deleteByID(
    @Param('projectID') projectID: string,
    @Res() res: Response,
  ) {
    await this.projectService.deleteProjectByID(projectID);
    res.status(HttpStatus.OK).json({
      message: 'Delete project successfully',
    });
  }
}
