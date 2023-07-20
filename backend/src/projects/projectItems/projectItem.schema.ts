import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectItemDocument = HydratedDocument<ProjectItem>;

@Schema({ timestamps: true })
export class ProjectItem {
  @Prop({ required: true })
  projectID: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  completed: boolean;
}

export const ProjectItemSchema = SchemaFactory.createForClass(ProjectItem);
