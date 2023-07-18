import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectlDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  color: string;

//   @Prop()
//   lists: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
