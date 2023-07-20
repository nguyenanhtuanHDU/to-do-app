import { ProjectItem } from './projectItem.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectItemCreateDTO, ProjectItemEditDTO } from './projectItem.dto';
import { IProjectItem } from './projectItem.interface';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProjectItemService {
  constructor(
    @InjectModel(ProjectItem.name) private projectItemModel: Model<ProjectItem>,
  ) {}

  async getByProjectID(projectID: string): Promise<IProjectItem[]> {
    return await this.projectItemModel.find({ projectID });
  }

  async getByProjectItemID(projectItemID: string): Promise<IProjectItem> {
    return await this.projectItemModel.findById(projectItemID);
  }

  async createProjectItem(projectItem: ProjectItemCreateDTO) {
    await this.projectItemModel.create(projectItem);
  }

  async editByID(projectItemID: string, projectItemEdit: ProjectItemEditDTO) {
    const projectItem = await this.projectItemModel.findByIdAndUpdate(
      projectItemID,
      projectItemEdit,
    );
    if (!projectItem) {
      throw new NotFoundException('Porject item not found');
    }
  }

  async deleteByID(projectItemID: string) {
    const projectItem = await this.projectItemModel.findByIdAndDelete(
      projectItemID,
    );
    if (!projectItem) {
      throw new NotFoundException('Porject item not found');
    }
  }
}
