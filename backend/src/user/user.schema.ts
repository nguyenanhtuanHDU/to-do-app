import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, index: false })
  username: string;

  @Prop({ index: false })
  email: string;

  @Prop()
  fullName: string;

  // avatar: string
  @Prop()
  password: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
