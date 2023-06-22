import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenlDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true})
  userID: string;

  @Prop({ required: true })
  refreshToken: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
