import { Exclude, Expose } from 'class-transformer';
import { IsBooleanString, IsEmail, IsIn, Length } from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';

export class TaskDTO {
  @Expose()
  userID: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Expose()
  completed: boolean;

  @Expose()
  files: string[];

  @Expose()
  exprise: Date;
}

export class CreateTaskDTO extends PickType(TaskDTO, [
  'title',
  'userID',
  'files',
] as const) {}

export class EditTaskDTO extends PickType(TaskDTO, [
  'title',
  'exprise',
  'color',
] as const) {}
