import { CreateProjectDTO, EditProjectDTO } from './project.dto';
import { Project } from './project.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IProject } from './project.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async getProjectByID(projectID: string): Promise<IProject> {
    const project = await this.projectModel.findById(projectID);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async getAllProjects(): Promise<IProject[]> {
    return await this.projectModel.find().sort({ createdAt: -1 });
  }

  async createProject(createProjectDTO: CreateProjectDTO) {
    await this.projectModel.create(createProjectDTO);
  }

  async editProjectByID(projectID: string, editProjectDTO: EditProjectDTO) {
    const project = await this.projectModel.findByIdAndUpdate(
      projectID,
      editProjectDTO,
    );
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async deleteProjectByID(projectID: string) {
    const project = await this.projectModel.findByIdAndDelete(projectID);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
