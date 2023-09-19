import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.createdAt;
    },
  },
})
export class Comment extends Document {
  @Prop({ required: true, type: String })
  content: string;

  @Prop({ default: 0, type: Number })
  likeCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
