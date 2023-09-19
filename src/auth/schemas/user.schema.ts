import { USER_ROLES } from './../interfaces/user.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.password;
      delete ret.otp;
      delete ret.isVerified;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: USER_ROLES,
    default: USER_ROLES.PROFILE,
  })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    default: () => {
      const otpNumber = Math.floor(1000 + Math.random() * 9000);
      console.log({ otp: otpNumber });
      return otpNumber;
    },
  })
  otp: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
