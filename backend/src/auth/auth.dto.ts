import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class authTokens {
  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;
}
