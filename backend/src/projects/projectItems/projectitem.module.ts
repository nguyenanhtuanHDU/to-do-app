import { Module } from '@nestjs/common';
import { ProjectItemController } from './projectitem.controller';
import { ProjectItemService } from './projectitem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectItem, ProjectItemSchema } from './projectItem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectItem.name, schema: ProjectItemSchema },
    ]),
  ],
  controllers: [ProjectItemController],
  providers: [ProjectItemService],
})
export class ProjectItemModule {}
