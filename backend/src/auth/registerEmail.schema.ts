import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RegisterEmailDocument = HydratedDocument<RegisterEmail>;

@Schema({ timestamps: true, expireAfterSeconds: 10 })
export class RegisterEmail {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: Number })
  code: string;
}

export const RegisterEmailSchema = SchemaFactory.createForClass(RegisterEmail);
