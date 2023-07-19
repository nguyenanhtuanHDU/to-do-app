import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ProjectDTO {
  @Expose()
  @IsNotEmpty()
  userID: string;

  @Expose()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsNotEmpty()
  color: string;
}

export class CreateProjectDTO {
  @Expose()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsNotEmpty()
  color: string;
}

export class EditProjectDTO extends PickType(CreateProjectDTO, [
  'title',
  'color',
] as const) {}
