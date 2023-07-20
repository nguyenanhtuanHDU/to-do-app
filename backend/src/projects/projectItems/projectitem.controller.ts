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
import { ProjectItemCreateDTO, ProjectItemEditDTO } from './projectItem.dto';
import { ProjectItemService } from './projectitem.service';
import { Response } from 'express';

@Controller('project-items')
export class ProjectItemController {
  constructor(private readonly projectItemService: ProjectItemService) {}

  @Get('item/projectID/:projectID')
  async getByProjectID(
    @Param('projectID') projectID: string,
    @Res() res: Response,
  ) {
    const projectItems = await this.projectItemService.getByProjectID(
      projectID,
    );
    res.status(HttpStatus.OK).json(projectItems);
  }

  @Get('item/:projectItemID')
  async getByID(
    @Param('projectItemID') projectItemID: string,
    @Res() res: Response,
  ) {
    const projectItem = await this.projectItemService.getByProjectItemID(
      projectItemID,
    );
    res.status(HttpStatus.OK).json(projectItem);
  }

  @Post()
  async create(
    @Body() projectItemCreate: ProjectItemCreateDTO,
    @Res() res: Response,
  ) {
    await this.projectItemService.createProjectItem(projectItemCreate);
    res.status(HttpStatus.OK).json({
      message: 'Create project item successfully',
    });
  }

  @Put('item/:projectItemID')
  async update(
    @Param('projectItemID') projectItemID: string,
    @Body() projectItemEdit: ProjectItemEditDTO,
    @Res() res: Response,
  ) {
    await this.projectItemService.editByID(projectItemID, projectItemEdit);
    res.status(HttpStatus.OK).json({
      message: 'Update project item successfully',
    });
  }

  @Delete('item/:projectItemID')
  async delete(
    @Param('projectItemID') projectItemID: string,
    @Res() res: Response,
  ) {
    await this.projectItemService.deleteByID(projectItemID);
    res.status(HttpStatus.OK).json({
      message: 'Delete project item successfully',
    });
  }
}
