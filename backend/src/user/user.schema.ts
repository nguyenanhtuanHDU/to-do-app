import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  // avatar: string
  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
