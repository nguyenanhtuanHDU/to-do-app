import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './project.service';

import { Module } from '@nestjs/common';
import { Project, ProjectSchema } from './project.schema';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
