import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class ProjectItemDTO {
  @Expose()
  @IsNotEmpty()
  projectID: string;

  @Expose()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsNotEmpty()
  @IsBooleanString()
  completed: boolean;
}

export class ProjectItemCreateDTO extends PickType(ProjectItemDTO, [
  'projectID',
  'title',
] as const) {}

export class ProjectItemEditDTO extends PickType(ProjectItemDTO, [
  'title',
  'completed',
] as const) {}
