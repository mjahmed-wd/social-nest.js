import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

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
